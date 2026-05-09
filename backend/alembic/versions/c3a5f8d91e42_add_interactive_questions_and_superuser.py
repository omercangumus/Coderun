"""add interactive questions, units, and superuser

Revision ID: c3a5f8d91e42
Revises: b57f111aeb2e
Create Date: 2026-05-09

Adds:
- units table (grouping layer between modules and lessons)
- is_superuser column to users table
- Interactive question columns: explanation, code_block, word_bank,
  correct_line_index, reinforcement_question_id
- unit_id nullable FK on lessons table
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "c3a5f8d91e42"
down_revision = "b57f111aeb2e"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # --- units table ---
    op.create_table(
        "units",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "module_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("modules.id"),
            nullable=False,
            index=True,
        ),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("description", sa.String(), server_default="", nullable=False),
        sa.Column("order", sa.Integer(), nullable=False),
        sa.Column("is_active", sa.Boolean(), server_default="true", nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            index=True,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            index=True,
        ),
    )

    # --- users.is_superuser ---
    op.add_column(
        "users",
        sa.Column(
            "is_superuser", sa.Boolean(), server_default="false", nullable=False
        ),
    )

    # --- lessons.unit_id ---
    op.add_column(
        "lessons",
        sa.Column(
            "unit_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("units.id"),
            nullable=True,
        ),
    )
    op.create_index("ix_lessons_unit_id", "lessons", ["unit_id"])

    # --- questions: new columns ---
    op.add_column(
        "questions",
        sa.Column("explanation", sa.String(), nullable=True),
    )
    op.add_column(
        "questions",
        sa.Column("code_block", sa.String(), nullable=True),
    )
    op.add_column(
        "questions",
        sa.Column("word_bank", postgresql.JSON(), nullable=True),
    )
    op.add_column(
        "questions",
        sa.Column("correct_line_index", sa.Integer(), nullable=True),
    )
    op.add_column(
        "questions",
        sa.Column(
            "reinforcement_question_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("questions.id"),
            nullable=True,
        ),
    )


def downgrade() -> None:
    op.drop_column("questions", "reinforcement_question_id")
    op.drop_column("questions", "correct_line_index")
    op.drop_column("questions", "word_bank")
    op.drop_column("questions", "code_block")
    op.drop_column("questions", "explanation")
    op.drop_index("ix_lessons_unit_id", "lessons")
    op.drop_column("lessons", "unit_id")
    op.drop_column("users", "is_superuser")
    op.drop_table("units")
