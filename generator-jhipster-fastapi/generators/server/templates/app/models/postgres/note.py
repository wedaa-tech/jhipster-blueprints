from sqlmodel import SQLModel, Field
from typing import Optional


class Note(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    subject: str
    description: str
