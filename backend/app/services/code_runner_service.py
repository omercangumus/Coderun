# Coderun backend — güvenli kod çalıştırma servisi.
# Docker tabanlı sandbox; ağ erişimi yok, read-only rootfs, tmpfs, non-root kullanıcı.

from __future__ import annotations

import asyncio
import base64
import logging
from math import floor

from fastapi import HTTPException, status

from app.core.config import settings
from app.schemas.code_runner import (
    CodeRunResponse,
    CodeSubmitResponse,
    TestCaseResult,
)

logger = logging.getLogger(__name__)

SUPPORTED_LANGUAGES = {"python"}
OUTPUT_LIMIT_BYTES = settings.CODE_RUNNER_OUTPUT_LIMIT_KB * 1024  # 10 KB
# Ortam değişkeni üzerinden kod aktarımı (DooD bind-mount yol sorunlarını önler)
MAX_CODE_BYTES = 96 * 1024
_SANDBOX_BOOTSTRAP = (
    "import base64, os, runpy\n"
    "p = '/tmp/solution.py'\n"
    "open(p, 'wb').write(base64.b64decode(os.environ['CODERUN_CODE']))\n"
    "runpy.run_path(p, run_name='__main__')\n"
)

DOCKER_UNAVAILABLE_DETAIL = (
    "Kod çalıştırıcı şu anda Docker'a erişemiyor. "
    "Docker Desktop açık mı? Ardından: docker compose up -d backend"
)


# ---------------------------------------------------------------------------
# Docker availability check
# ---------------------------------------------------------------------------


async def _check_docker_available() -> bool:
    """Docker daemon'ın erişilebilir olup olmadığını kontrol eder."""
    try:
        proc = await asyncio.create_subprocess_exec(
            "docker", "info",
            stdout=asyncio.subprocess.DEVNULL,
            stderr=asyncio.subprocess.PIPE,
        )
        await asyncio.wait_for(proc.wait(), timeout=5.0)
        return proc.returncode == 0
    except (FileNotFoundError, asyncio.TimeoutError, OSError):
        return False


def _build_sandbox_command(code: str, memory_mb: int) -> list[str]:
    """Güvenli Docker sandbox komutunu oluşturur (host bind-mount gerektirmez)."""
    if len(code.encode("utf-8")) > MAX_CODE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Kod çok uzun; lütfen daha kısa bir çözüm gönderin.",
        )
    code_b64 = base64.b64encode(code.encode("utf-8")).decode("ascii")
    memory_str = f"{memory_mb}m"
    return [
        "docker",
        "run",
        "--rm",
        "--network=none",
        f"--memory={memory_str}",
        f"--memory-swap={memory_str}",
        "--cpus=1",
        "--read-only",
        "--tmpfs",
        "/tmp:size=32m",
        "--user=nobody",
        "-e",
        f"CODERUN_CODE={code_b64}",
        "-i",
        settings.CODE_RUNNER_DOCKER_IMAGE,
        "python",
        "-c",
        _SANDBOX_BOOTSTRAP,
    ]


def _raise_docker_unavailable() -> None:
    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail=DOCKER_UNAVAILABLE_DETAIL,
    )


# ---------------------------------------------------------------------------
# Core execution
# ---------------------------------------------------------------------------


async def run_code(
    language: str,
    code: str,
    stdin: str = "",
    timeout_ms: int = 5000,
    memory_mb: int = 128,
) -> CodeRunResponse:
    """Kodu Docker sandbox içinde güvenli biçimde çalıştırır.

    Args:
        language: Programlama dili (şimdilik sadece "python").
        code: Çalıştırılacak kaynak kod.
        stdin: Standart girdi.
        timeout_ms: Zaman aşımı (milisaniye).
        memory_mb: Bellek limiti (MB).

    Returns:
        CodeRunResponse: stdout, stderr, exit_code, duration_ms, timed_out.

    Raises:
        HTTPException 503: Docker kullanılamıyorsa.
        HTTPException 422: Desteklenmeyen dil.
    """
    if language not in SUPPORTED_LANGUAGES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Desteklenmeyen dil: {language}. Desteklenen: {', '.join(SUPPORTED_LANGUAGES)}",
        )

    if not await _check_docker_available():
        _raise_docker_unavailable()

    cmd = _build_sandbox_command(code, memory_mb)
    timeout_sec = timeout_ms / 1000.0
    start_time = asyncio.get_event_loop().time()

    try:
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdin=asyncio.subprocess.PIPE,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
    except OSError as exc:
        logger.error("docker run başlatılamadı: %s", exc)
        _raise_docker_unavailable()

    timed_out = False
    try:
        stdin_bytes = stdin.encode("utf-8") if stdin else b""
        stdout_bytes, stderr_bytes = await asyncio.wait_for(
            proc.communicate(input=stdin_bytes),
            timeout=timeout_sec,
        )
    except asyncio.TimeoutError:
        timed_out = True
        try:
            proc.kill()
        except ProcessLookupError:
            pass
        stdout_bytes = b""
        stderr_bytes = f"Execution timed out after {timeout_ms}ms".encode()

    end_time = asyncio.get_event_loop().time()
    duration_ms = int((end_time - start_time) * 1000)

    stdout_str = stdout_bytes.decode("utf-8", errors="replace")
    stderr_str = stderr_bytes.decode("utf-8", errors="replace")

    stdout_str, stderr_str = _truncate_output(stdout_str, stderr_str)

    exit_code = proc.returncode if proc.returncode is not None else -1
    if timed_out:
        exit_code = -1

    docker_infra_markers = (
        "Cannot connect to the Docker daemon",
        "error during connect",
        "docker daemon",
        "permission denied",
        "Is the docker daemon running",
    )
    if any(marker.lower() in stderr_str.lower() for marker in docker_infra_markers):
        logger.error("docker infrastructure error: %s", stderr_str[:500])
        _raise_docker_unavailable()

    if "Unable to find image" in stderr_str or "pull access denied" in stderr_str:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                f"Sandbox imajı bulunamadı ({settings.CODE_RUNNER_DOCKER_IMAGE}). "
                f"Terminalde çalıştırın: docker pull {settings.CODE_RUNNER_DOCKER_IMAGE}"
            ),
        )

    logger.info(
        "code_run: language=%s code_len=%d exit_code=%d duration_ms=%d timed_out=%s",
        language,
        len(code),
        exit_code,
        duration_ms,
        timed_out,
    )

    return CodeRunResponse(
        stdout=stdout_str,
        stderr=stderr_str,
        exit_code=exit_code,
        duration_ms=duration_ms,
        timed_out=timed_out,
    )


def _truncate_output(stdout: str, stderr: str) -> tuple[str, str]:
    """Toplam çıktıyı OUTPUT_LIMIT_BYTES ile sınırlar."""
    combined_len = len(stdout.encode("utf-8")) + len(stderr.encode("utf-8"))
    if combined_len <= OUTPUT_LIMIT_BYTES:
        return stdout, stderr

    half = OUTPUT_LIMIT_BYTES // 2
    if len(stdout.encode("utf-8")) > half:
        stdout = stdout.encode("utf-8")[:half].decode("utf-8", errors="replace")
    if len(stderr.encode("utf-8")) > half:
        stderr = stderr.encode("utf-8")[:half].decode("utf-8", errors="replace")
    stderr += "\n... (output truncated)"
    return stdout, stderr


# ---------------------------------------------------------------------------
# Submission evaluation
# ---------------------------------------------------------------------------


async def evaluate_submission(
    question: object,
    code: str,
    language: str,
) -> CodeSubmitResponse:
    """Kodu soru test senaryolarına karşı değerlendirir.

    Args:
        question: Question ORM nesnesi (test_cases, max_runtime_ms, memory_limit_mb içerir).
        code: Öğrencinin gönderdiği kaynak kod.
        language: Programlama dili.

    Returns:
        CodeSubmitResponse: passed, score, test_results, feedback.
    """
    test_cases: list[dict] = question.test_cases or []  # type: ignore[union-attr]
    timeout_ms: int = question.max_runtime_ms or settings.CODE_RUNNER_TIMEOUT_MS  # type: ignore[union-attr]
    memory_mb: int = question.memory_limit_mb or settings.CODE_RUNNER_MEMORY_MB  # type: ignore[union-attr]

    results: list[TestCaseResult] = []
    last_stdout = ""
    last_stderr = ""

    for tc in test_cases:
        name: str = tc.get("name", "Test")
        stdin: str = tc.get("stdin", "")
        expected: str = tc.get("expected_stdout", "")
        hidden: bool = tc.get("hidden", False)

        run_result = await run_code(
            language=language,
            code=code,
            stdin=stdin,
            timeout_ms=timeout_ms,
            memory_mb=memory_mb,
        )

        actual = run_result.stdout.strip()
        passed = actual == expected.strip() and not run_result.timed_out

        last_stdout = run_result.stdout
        last_stderr = run_result.stderr

        results.append(
            TestCaseResult(
                name=name,
                passed=passed,
                stdout=run_result.stdout,
                stderr=run_result.stderr,
                duration_ms=run_result.duration_ms,
                hidden=hidden,
                # Gizli testlerde expected_stdout sızdırılmaz
                expected_stdout=None if hidden else expected,
            )
        )

    total = len(results)
    passed_count = sum(1 for r in results if r.passed)
    score = floor((passed_count / total) * 100) if total > 0 else 0
    all_passed = passed_count == total and total > 0

    feedback = _generate_feedback(score, passed_count, total)

    return CodeSubmitResponse(
        passed=all_passed,
        score=score,
        stdout=last_stdout,
        stderr=last_stderr,
        test_results=results,
        feedback=feedback,
    )


def _generate_feedback(score: int, passed: int, total: int) -> str:
    """Skora göre Ghostie uyumlu geri bildirim mesajı üretir."""
    if total == 0:
        return "Bu ödev için test senaryosu bulunamadı."
    if score == 100:
        return f"Harika! Tüm {total} test geçti. Mükemmel iş! 🎉"
    if score >= 75:
        return f"{passed}/{total} test geçti. Çok yakınsın, küçük bir düzeltme yeterli! 💪"
    if score >= 50:
        return f"{passed}/{total} test geçti. İyi bir başlangıç, devam et! 🔍"
    if score > 0:
        return f"{passed}/{total} test geçti. Tekrar dene, her denemede öğreniyorsun! 📚"
    return "Henüz hiçbir test geçmedi. Soruyu dikkatlice oku ve tekrar dene! 🤔"
