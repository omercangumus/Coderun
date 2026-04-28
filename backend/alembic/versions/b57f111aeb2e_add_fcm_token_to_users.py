"""add_fcm_token_to_users

Revision ID: b57f111aeb2e
Revises: 9715bad48503
Create Date: 2026-04-28 13:12:57.247838
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# Bu migration dosyası otomatik üretilen şema değişikliklerini içerir.

revision: str = 'b57f111aeb2e'
down_revision: Union[str, None] = '9715bad48503'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('users', sa.Column('fcm_token', sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column('users', 'fcm_token')
