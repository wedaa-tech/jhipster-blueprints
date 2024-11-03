from models.note import Note
from sqlalchemy.ext.asyncio import AsyncSession
from repository.note_repository import NoteRepository
from typing import List, Optional
from fastapi import Depends
from core.postgres import get_db 

class NoteService:
    def __init__(self, session: AsyncSession = Depends(get_db)):
        self.noteRepository = NoteRepository(session)

    async def create_note(self, subject: str, description: str) -> Note:
        note = Note(subject=subject, description=description)
        return await self.noteRepository.create_note(note)

    async def get_note(self, note_id: int) -> Optional[Note]:
        return await self.noteRepository.get_note(note_id)

    async def get_all_notes(self) -> List[Note]:
        return await self.noteRepository.get_all_notes()

    async def delete_note(self, note_id: int) -> bool:
        return await self.noteRepository.delete_note(note_id)
