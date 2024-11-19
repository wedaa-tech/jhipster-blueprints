from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from core.postgres import get_db
from models.note import Note
from fastapi import Depends

class NoteRepository:
    def __init__(self, session: AsyncSession = Depends(get_db)):
        self.session = session

    async def create_note(self, note: Note) -> Note:
        """Create a new note in the database."""
        self.session.add(note)
        await self.session.commit()
        await self.session.refresh(note)
        return note

    async def get_note(self, note_id: int) -> Optional[Note]:
        """Retrieve a note by ID."""
        result = await self.session.execute(select(Note).where(Note.id == note_id))
        return result.scalar_one_or_none()

    async def get_all_notes(self) -> List[Note]:
        """Retrieve all notes."""
        result = await self.session.execute(select(Note))
        return result.scalars().all()

    async def update_note(self, note: Note) -> Note:
        """Update an existing note."""
        await self.session.commit()
        await self.session.refresh(note)
        return note

    async def delete_note(self, note_id: int) -> bool:
        """Delete a note by ID."""
        note = await self.get_note(note_id)
        if note:
            await self.session.delete(note)
            await self.session.commit()
            return True
        return False
