# Coderun backend — başlangıç verisi (seed); Python, DevOps, Cloud modülleri ve dersleri.

import logging
from uuid import uuid4, UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import hash_password
from app.models.lesson import Lesson
from app.models.module import Module
from app.models.question import Question
from app.models.user import User
from app.core.seed_data import SEED_DATA, CODING_ASSIGNMENTS_LESSON, PYTHON_EXTRA_QUIZ_LESSON

logger = logging.getLogger(__name__)

# İnteraktif soru türleri örnek seed verisi (boş bırakıldı çünkü seed_data.py içinde zaten var)
INTERACTIVE_LESSON_SEED = {
    "title": "İnteraktif Sorular",
    "lesson_type": "quiz",
    "order": 6,
    "xp_reward": 25,
    "questions": []
}

_PINNED_USER_EMAIL = "1"
_PINNED_USER_PASSWORD = "1"
_PINNED_USER_USERNAME = "1"
_PINNED_USER_ALLOWED_ENVS = frozenset({"development", "local", "test"})


async def _ensure_pinned_user(db: AsyncSession) -> None:
    env = (settings.ENVIRONMENT or "").lower()
    if env not in _PINNED_USER_ALLOWED_ENVS:
        return

    result = await db.execute(select(User).where(User.email == _PINNED_USER_EMAIL))
    user = result.scalars().first()
    if user is not None:
        user.hashed_password = hash_password(_PINNED_USER_PASSWORD)
        user.username = _PINNED_USER_USERNAME
        user.is_active = True
        user.is_verified = True
        user.is_superuser = True
        await db.flush()
        return

    db.add(
        User(
            email=_PINNED_USER_EMAIL,
            username=_PINNED_USER_USERNAME,
            hashed_password=hash_password(_PINNED_USER_PASSWORD),
            is_active=True,
            is_verified=True,
            is_superuser=True,
            xp=0,
            level=1,
            streak=0,
        )
    )
    await db.flush()


async def seed_database(db: AsyncSession) -> None:
    """Veritabanına başlangıç verilerini ekler.

    İdempotent: Modül zaten varsa seed çalıştırılmaz.
    Transaction içinde çalışır; hata olursa rollback yapar.

    Args:
        db: Aktif async veritabanı oturumu.
    """
    try:
        await _ensure_pinned_user(db)
        await db.commit()

        # Modül var mı kontrol et (idempotent)
        existing = await db.execute(select(Module).limit(1))
        if existing.scalars().first() is not None:
            logger.info("Seed verisi zaten mevcut, atlanıyor.")
            return

        logger.info("Seed verisi ekleniyor...")

        for module_data in SEED_DATA:
            # Python modülüne kodlama ödevleri dersini ekle
            lessons_data = list(module_data.get("lessons", []))
            if module_data.get("slug") == "python":
                lessons_data = lessons_data + [PYTHON_EXTRA_QUIZ_LESSON, CODING_ASSIGNMENTS_LESSON]
            module_id = uuid4()

            module = Module(
                id=module_id,
                title=module_data["title"],
                slug=module_data["slug"],
                description=module_data["description"],
                order=module_data["order"],
                is_active=True,
                is_published=True,
            )
            db.add(module)
            await db.flush()

            for lesson_data in lessons_data:
                questions_data = lesson_data.get("questions", [])
                lesson_id = uuid4()

                lesson = Lesson(
                    id=lesson_id,
                    module_id=module_id,
                    title=lesson_data["title"],
                    lesson_type=lesson_data["lesson_type"],
                    order=lesson_data["order"],
                    xp_reward=lesson_data["xp_reward"],
                    content={},
                    is_active=True,
                )
                db.add(lesson)
                await db.flush()

                # İlk geçiş: Tüm soruları oluştur
                question_list: list[tuple[UUID, bool, bool]] = []
                for question_data in questions_data:
                    question_id = uuid4()
                    question = Question(
                        id=question_id,
                        lesson_id=lesson_id,
                        question_type=question_data["question_type"],
                        question_text=question_data["question_text"],
                        options=question_data.get("options"),
                        correct_answer=question_data["correct_answer"],
                        hint=question_data.get("hint"),
                        explanation=question_data.get("explanation"),
                        code_block=question_data.get("code_block"),
                        word_bank=question_data.get("word_bank"),
                        correct_line_index=question_data.get("correct_line_index"),
                        is_reinforcement=question_data.get("is_reinforcement", False),
                        order=question_data["order"],
                        # Code assignment fields
                        language=question_data.get("language"),
                        starter_code=question_data.get("starter_code"),
                        test_cases=question_data.get("test_cases"),
                        assignment_instructions=question_data.get("assignment_instructions"),
                        max_runtime_ms=question_data.get("max_runtime_ms"),
                        memory_limit_mb=question_data.get("memory_limit_mb"),
                    )
                    db.add(question)
                    question_list.append((
                        question_id,
                        question_data.get("has_reinforcement", False),
                        question_data.get("is_reinforcement", False)
                    ))

                await db.flush()

                # İkinci geçiş: Pekiştirme sorularını sırayla eşleştirip bağla
                has_reinf_qs = [q_id for q_id, has_reinf, is_reinf in question_list if has_reinf]
                is_reinf_qs = [q_id for q_id, has_reinf, is_reinf in question_list if is_reinf]

                for i in range(min(len(has_reinf_qs), len(is_reinf_qs))):
                    main_q_id = has_reinf_qs[i]
                    reinf_q_id = is_reinf_qs[i]

                    result = await db.execute(
                        select(Question).where(Question.id == main_q_id)
                    )
                    main_question = result.scalar_one()
                    main_question.reinforcement_question_id = reinf_q_id

                await db.flush()

        await db.commit()
        logger.info("Seed verisi başarıyla eklendi.")

    except Exception as exc:
        await db.rollback()
        logger.error("Seed verisi eklenirken hata oluştu: %s", exc)
        raise

