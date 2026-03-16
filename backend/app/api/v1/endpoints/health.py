# Coderun backend health endpoint — GET /health ile uygulama durumunu döndürür.

from fastapi import APIRouter

from backend.app.core.config import settings

router = APIRouter()


@router.get("/health")
async def health_check() -> dict[str, str]:
    """Uygulamanın sağlık durumunu döndürür.

    Returns:
        dict[str, str]: ``status`` ve ``environment`` anahtarlarını içeren sözlük.
    """
    return {"status": "ok", "environment": settings.ENVIRONMENT}
