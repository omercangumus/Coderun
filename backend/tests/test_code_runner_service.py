# Code runner servis birim testleri

from unittest.mock import AsyncMock, patch

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
