# YALNIZCA yerel geliştirme — admin@coderun.com süper kullanıcı oluşturur.

from __future__ import annotations

import asyncio
import logging
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from sqlalchemy import select

from app.core.config import settings
from app.core.database import AsyncSessionLocal
from app.core.security import hash_password
from app.models.user import User

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

_ALLOWED_ENVS = frozenset({"development", "local", "test"})
DEFAULT_EMAIL = "admin@coderun.com"
DEFAULT_PASSWORD = "admin123"
DEFAULT_USERNAME = "admin"


async def ensure_dev_admin() -> None:
    """Geliştirme admin hesabını oluşturur veya süper kullanıcı yapar."""
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.email == DEFAULT_EMAIL))
        admin = result.scalar_one_or_none()
        if admin:
            admin.is_superuser = True
            admin.is_verified = True
            admin.is_active = True
            await session.commit()
            logger.info("Mevcut admin süper kullanıcı olarak güncellendi.")
            return

        session.add(
            User(
                email=DEFAULT_EMAIL,
                username=DEFAULT_USERNAME,
                hashed_password=hash_password(DEFAULT_PASSWORD),
                is_superuser=True,
                is_verified=True,
                is_active=True,
                xp=0,
                level=1,
                streak=0,
            )
        )
        await session.commit()
        logger.info("Dev admin oluşturuldu: %s", DEFAULT_EMAIL)


def main() -> None:
    """CLI giriş noktası."""
    env = (settings.ENVIRONMENT or os.environ.get("ENVIRONMENT", "")).lower()
    if env not in _ALLOWED_ENVS:
        raise SystemExit(
            f"Güvenlik: ENVIRONMENT={env!r} — yalnızca {sorted(_ALLOWED_ENVS)}."
        )
    asyncio.run(ensure_dev_admin())


if __name__ == "__main__":
    main()
