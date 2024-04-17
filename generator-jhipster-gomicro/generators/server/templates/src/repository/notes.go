package repository

import (
 config "<%= packageName %>/db"
 pb "<%= packageName %>/pb"
 "strconv"
)

var tableName = "notes"

type NoteRepository struct{}

type Note struct {
	Id          uint64 `gorm:"primaryKey" json:"id,omitempty"`
	Subject     string `json:"subject,omitempty"`
	Description string `json:"description,omitempty"`
}

func (nr *NoteRepository) GetNotes() ([]*pb.NotesResponse, error) {
	var notes []*pb.NotesResponse
	err := config.DatabaseClient.Table(tableName).Find(&notes).Error
	return notes, err
}

func (nr *NoteRepository) CreateNote(note *pb.NotesRequest) error {
	noteData := Note{
		Subject:     note.Subject,
		Description: note.Description,
	}
	return config.DatabaseClient.Table(tableName).Create(&noteData).Error
}

func (nr *NoteRepository) GetNoteById(id string) (*pb.NotesResponse, error) {
	var note *pb.NotesResponse
	err := config.DatabaseClient.Table(tableName).First(&note, id).Error
	return note, err
}

func (nr *NoteRepository) UpdateNote(note *pb.NotesResponse) error {
	var existingNote *pb.NotesResponse
	err := config.DatabaseClient.Table(tableName).First(&existingNote, note.Id).Error
	if err != nil {
		return err
	}
	return config.DatabaseClient.Table(tableName).Model(&existingNote).Updates(note).Error
}

func (nr *NoteRepository) DeleteNote(id string) error {
	var note *pb.NotesResponse
	Id, _ := strconv.Atoi(id)
	result := config.DatabaseClient.Table(tableName).Where("id = ?", Id).Delete(&note)
	return result.Error
}
