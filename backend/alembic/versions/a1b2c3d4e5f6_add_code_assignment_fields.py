"""add_code_assignment_fields

Revision ID: a1b2c3d4e5f6
Revises: b57f111aeb2e
Create Date: 2026-05-01 00:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, None] = 'd4e6f7a8b9c0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        'questions',
        sa.Column('language', sa.String(), nullable=True, server_default='python'),
    )
    op.add_column(
        'questions',
        sa.Column('starter_code', sa.Text(), nullable=True),
    )
    op.add_column(
        'questions',
        sa.Column('test_cases', postgresql.JSON(astext_type=sa.Text()), nullable=True),
    )
    op.add_column(
        'questions',
        sa.Column('assignment_instructions', sa.Text(), nullable=True),
    )
    op.add_column(
        'questions',
        sa.Column('max_runtime_ms', sa.Integer(), nullable=True, server_default='5000'),
    )
    op.add_column(
        'questions',
        sa.Column('memory_limit_mb', sa.Integer(), nullable=True, server_default='128'),
    )


def downgrade() -> None:
    op.drop_column('questions', 'memory_limit_mb')
    op.drop_column('questions', 'max_runtime_ms')
    op.drop_column('questions', 'assignment_instructions')
    op.drop_column('questions', 'test_cases')
    op.drop_column('questions', 'starter_code')
    op.drop_column('questions', 'language')
