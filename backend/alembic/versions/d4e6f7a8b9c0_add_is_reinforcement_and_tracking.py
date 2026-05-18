"""add is_reinforcement and reinforcement tracking fields

Revision ID: d4e6f7a8b9c0
Revises: c3a5f8d91e42
Create Date: 2026-05-18

Adds:
- is_reinforcement column to questions table
- reinforcement_triggered and reinforcement_passed columns to user_progress table
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "d4e6f7a8b9c0"
down_revision = "c3a5f8d91e42"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add is_reinforcement to questions
    op.add_column(
        "questions",
        sa.Column(
            "is_reinforcement", sa.Boolean(), server_default="false", nullable=False
        ),
    )
    
    # Add reinforcement tracking to user_progress
    op.add_column(
        "user_progress",
        sa.Column(
            "reinforcement_triggered", sa.Boolean(), server_default="false", nullable=False
        ),
    )
    op.add_column(
        "user_progress",
        sa.Column(
            "reinforcement_passed", sa.Boolean(), server_default="false", nullable=False
        ),
    )


def downgrade() -> None:
    op.drop_column("user_progress", "reinforcement_passed")
    op.drop_column("user_progress", "reinforcement_triggered")
    op.drop_column("questions", "is_reinforcement")
