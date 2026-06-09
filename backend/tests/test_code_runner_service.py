# Code runner servis birim testleri

import asyncio
from unittest.mock import MagicMock, AsyncMock, patch

import pytest
from fastapi import HTTPException

from app.services import code_runner_service


@pytest.mark.asyncio
async def test_run_code_raises_503_when_docker_unavailable() -> None:
    """Docker yoksa Türkçe 503 mesajı dönmeli."""
    with patch.object(
        code_runner_service,
        "_check_docker_available",
        new=AsyncMock(return_value=False),
    ):
        with pytest.raises(HTTPException) as exc_info:
            await code_runner_service.run_code(
                language="python",
                code='print("hi")',
            )
    assert exc_info.value.status_code == 503
    assert "Docker" in str(exc_info.value.detail)


@pytest.mark.asyncio
async def test_run_code_rejects_unsupported_language() -> None:
    """Desteklenmeyen dil 422 dönmeli."""
    with pytest.raises(HTTPException) as exc_info:
        await code_runner_service.run_code(language="rust", code="fn main() {}")
    assert exc_info.value.status_code == 422


@pytest.mark.asyncio
async def test_run_code_success() -> None:
    """Başarılı kod çalıştırma: stdout doğru dönmeli."""
    mock_proc = AsyncMock()
    mock_proc.communicate.return_value = (b"Hello, World!\n", b"")
    mock_proc.returncode = 0
    
    mock_rm_proc = AsyncMock()
    mock_rm_proc.wait.return_value = 0

    with patch.object(code_runner_service, "_check_docker_available", return_value=True), \
         patch("asyncio.create_subprocess_exec") as mock_exec:
        mock_exec.side_effect = [mock_proc, mock_rm_proc]
        
        result = await code_runner_service.run_code(
            language="python",
            code='print("Hello, World!")'
        )
        
        assert result.stdout.strip() == "Hello, World!"
        assert result.stderr == ""
        assert result.exit_code == 0
        assert not result.timed_out
        assert mock_exec.call_count == 2
        assert mock_exec.call_args_list[1][0][1] == "rm"


@pytest.mark.asyncio
async def test_run_code_timeout() -> None:
    """Timeout senaryosu: 10+ saniyelik kod -> 124 exit_code + Türkçe mesaj, ve container listede olmamalı."""
    mock_proc = AsyncMock()
    mock_proc.kill = MagicMock()
    mock_proc.communicate.side_effect = asyncio.TimeoutError
    mock_proc.returncode = -1

    mock_kill_proc = AsyncMock()
    mock_kill_proc.wait.return_value = 0

    mock_rm_proc = AsyncMock()
    mock_rm_proc.wait.return_value = 0

    with patch.object(code_runner_service, "_check_docker_available", return_value=True), \
         patch("asyncio.create_subprocess_exec") as mock_exec:
        mock_exec.side_effect = [mock_proc, mock_kill_proc, mock_rm_proc]

        result = await code_runner_service.run_code(
            language="python",
            code='import time; time.sleep(11)'
        )

        assert result.exit_code == 124
        assert result.timed_out is True
        assert "Hata: Kod çalıştırma zaman aşımına uğradı (maks. 10 saniye)." in result.stderr
        
        kill_args = mock_exec.call_args_list[1][0]
        assert "kill" in kill_args
        
        rm_args = mock_exec.call_args_list[2][0]
        assert "rm" in rm_args
        assert "-f" in rm_args


@pytest.mark.asyncio
async def test_run_code_error_translation() -> None:
    """Hatalı kod: stderr Türkçeleştirilmiş dönmeli."""
    mock_proc = AsyncMock()
    mock_proc.communicate.return_value = (
        b"",
        b'Traceback (most recent call last):\n  File "<string>", line 1\nZeroDivisionError: division by zero'
    )
    mock_proc.returncode = 1

    mock_rm_proc = AsyncMock()
    mock_rm_proc.wait.return_value = 0

    with patch.object(code_runner_service, "_check_docker_available", return_value=True), \
         patch("asyncio.create_subprocess_exec") as mock_exec:
        mock_exec.side_effect = [mock_proc, mock_rm_proc]

        result = await code_runner_service.run_code(
            language="python",
            code='1 / 0'
        )

        assert "Hata izleme (son çağrı en altta):" in result.stderr
        assert "Dosya: <string>, Satır 1" in result.stderr
        assert "Sıfıra Bölme Hatası: division by zero" in result.stderr
        assert result.exit_code == 1
