"""note

Revision ID: 5a51df5a9538
Revises: 
Create Date: 2024-11-02 15:59:31.630962

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = '5a51df5a9538'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('note',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('subject', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('description', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )

    
    for i in range(1, 11):
        op.execute(
            f"""
            INSERT INTO note (id, subject, description) 
            VALUES ({i}, 'Dummy Subject', 'This is a description for note {i}')
            """
        )

    op.execute("SELECT setval(pg_get_serial_sequence('note', 'id'), COALESCE(MAX(id), 1) + 1, false) FROM note")





def downgrade() -> None:
    op.drop_table('note')
