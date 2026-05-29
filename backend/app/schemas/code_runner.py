# Coderun backend — code runner Pydantic şemaları.
# POST /api/v1/code/run ve POST /api/v1/code/submit endpoint'leri için.

from pydantic import BaseModel, Field


class CodeRunRequest(BaseModel):
    """Kod çalıştırma isteği."""

    language: str = "python"
    code: str = Field(..., max_length=50_000, description="Çalıştırılacak kaynak kod")
    stdin: str = ""
    assignment_id: str | None = None
    timeout_ms: int = Field(default=5000, ge=1000, le=30_000, description="Zaman aşımı (ms)")
    memory_limit_mb: int = Field(default=128, ge=64, le=512, description="Bellek limiti (MB)")


class CodeRunResponse(BaseModel):
    """Kod çalıştırma sonucu."""

    stdout: str
    stderr: str
    exit_code: int
    duration_ms: int
    timed_out: bool


class TestCaseResult(BaseModel):
    """Tek bir test senaryosunun sonucu."""

    name: str
    passed: bool
    stdout: str
    stderr: str
    duration_ms: int
    hidden: bool
    expected_stdout: str | None = None  # Gizli testlerde None


class CodeSubmitRequest(BaseModel):
    """Ödev gönderme isteği."""

    question_id: str
    code: str = Field(..., max_length=50_000, description="Gönderilen kaynak kod")
    language: str = "python"


class CodeSubmitResponse(BaseModel):
    """Ödev gönderme sonucu."""

    passed: bool
    score: int
    stdout: str
    stderr: str
    test_results: list[TestCaseResult]
    feedback: str
