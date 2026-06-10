"""add difficulty to questions

Revision ID: e5f6a7b8c9d0
Revises: d4e6f7a8b9c0
Create Date: 2026-06-10

Adds:
- difficulty column to questions table ("easy" | "medium" | "hard", default "easy")
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "e5f6a7b8c9d0"
down_revision = ("b0b72209457b", "d4e6f7a8b9c0")
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "questions",
        sa.Column(
            "difficulty",
            sa.String(),
            server_default="easy",
            nullable=True,
        ),
    )


def downgrade() -> None:
    op.drop_column("questions", "difficulty")
