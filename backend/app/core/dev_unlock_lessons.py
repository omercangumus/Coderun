# YALNIZCA yerel geliştirme / demo — production'da çalıştırmayın.
# Belirtilen kullanıcı için Python modülündeki önceki dersleri tamamlanmış işaretler;
# böylece kodlama laboratuvarı dersi test edilebilir.

from __future__ import annotations

import argparse
import asyncio
import logging
import os
import sys
from datetime import datetime, timezone
from uuid import UUID

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert

from app.core.config import settings
from app.core.database import AsyncSessionLocal
from app.models.lesson import Lesson
from app.models.module import Module
from app.models.user import User
from app.models.user_progress import UserProgress

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

_ALLOWED_ENVS = frozenset({"development", "local", "test"})


async def unlock_python_lessons_for_user(
    user_email: str,
    *,
    up_to_order: int | None = None,
) -> int:
    """Python modülünde `up_to_order` dahil dersleri kullanıcı için tamamlar."""
    async with AsyncSessionLocal() as session:
        user = (
            await session.execute(select(User).where(User.email == user_email))
        ).scalar_one_or_none()
        if user is None:
            raise SystemExit(f"Kullanıcı bulunamadı: {user_email}")

        module = (
            await session.execute(select(Module).where(Module.slug == "python"))
        ).scalar_one_or_none()
        if module is None:
            raise SystemExit("Python modülü bulunamadı. Önce reset_seed çalıştırın.")

        lessons_q = (
            select(Lesson)
            .where(Lesson.module_id == module.id)
            .order_by(Lesson.order)
        )
        lessons = list((await session.execute(lessons_q)).scalars().all())
        if not lessons:
            raise SystemExit("Python modülünde ders yok.")

        max_order = up_to_order if up_to_order is not None else max(l.order for l in lessons) - 1
        targets = [l for l in lessons if l.order <= max_order]
        now = datetime.now(timezone.utc)
        count = 0

        for lesson in targets:
            stmt = (
                insert(UserProgress)
                .values(
                    user_id=user.id,
                    lesson_id=lesson.id,
                    is_completed=True,
                    score=100,
                    attempt_count=1,
                    completed_at=now,
                )
                .on_conflict_do_update(
                    index_elements=["user_id", "lesson_id"],
                    set_={
                        "is_completed": True,
                        "score": 100,
                        "completed_at": now,
                    },
                )
            )
            await session.execute(stmt)
            count += 1

        await session.commit()
        logger.info(
            "Demo kilidi açıldı: %s için %d ders tamamlandı (order <= %d).",
            user_email,
            count,
            max_order,
        )
        return count


def main() -> None:
    """CLI giriş noktası — argparse ile demo kilidi açma."""
    env = (settings.ENVIRONMENT or os.environ.get("ENVIRONMENT", "")).lower()
    if env not in _ALLOWED_ENVS:
        raise SystemExit(
            f"Güvenlik: ENVIRONMENT={env!r} — bu script yalnızca "
            f"{sorted(_ALLOWED_ENVS)} ortamlarında çalışır."
        )

    parser = argparse.ArgumentParser(
        description="[DEV] Python ders kilidini demo için aç (önceki dersleri tamamlar)."
    )
    parser.add_argument("--email", required=True, help="Kullanıcı e-postası")
    parser.add_argument(
        "--up-to-order",
        type=int,
        default=None,
        help="Bu sıra numarasına kadar dersleri tamamla (varsayılan: son ders hariç)",
    )
    args = parser.parse_args()
    asyncio.run(unlock_python_lessons_for_user(args.email, up_to_order=args.up_to_order))


if __name__ == "__main__":
    main()
