# Coderun backend health endpoint — GET /health ile uygulama durumunu döndürür.

from fastapi import APIRouter
from sqlalchemy import text

from backend.app.core.config import settings
from backend.app.core.database import AsyncSessionLocal

router = APIRouter()


@router.get("/health")
async def health_check() -> dict[str, str]:
    """Uygulamanın sağlık durumunu döndürür.

    Returns:
        dict[str, str]: ``status`` ve ``environment`` anahtarlarını içeren sözlük.
    """
    db_status = "ok"
    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
    except Exception:
        db_status = "error"
    return {"status": "ok", "environment": settings.ENVIRONMENT, "database": db_status}
