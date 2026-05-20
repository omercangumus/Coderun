# Coderun database reset and seed utility script.
import asyncio
import logging
import sys
import os

# Add parent directory to path so app imports work
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from sqlalchemy import text
from app.core.database import AsyncSessionLocal
from app.core.seed import seed_database

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def reset_and_seed() -> None:
    """Resets database tables and re-runs standard seed data insertion."""
    async with AsyncSessionLocal() as session:
        try:
            logger.info("Cleaning up existing seed data (questions, lessons, modules)...")

            # Reset self-referential foreign keys first
            await session.execute(text("UPDATE questions SET reinforcement_question_id = NULL"))
            await session.commit()

            # Delete child data first
            await session.execute(text("DELETE FROM questions"))
            await session.execute(text("DELETE FROM user_progress"))
            await session.execute(text("DELETE FROM lessons"))
            await session.execute(text("DELETE FROM modules"))
            await session.commit()

            logger.info("Database cleaned successfully. Running seeding...")

            # Run the seed function
            await seed_database(session)

            logger.info("Database re-seeded successfully.")
        except Exception as e:
            await session.rollback()
            logger.error(f"Error occurred during database reset and seed: {e}")
            raise


if __name__ == "__main__":
    asyncio.run(reset_and_seed())
