package handler

import (
	"encoding/json"
	"net/http"

	pb "<%= packageName %>/pb"
	"<%= packageName %>/repository"

	"github.com/gorilla/mux"
	"github.com/micro/micro/v3/service/logger"
)

var noteRepository *repository.NoteRepository

type NoteHandler struct{}

func (nh *NoteHandler) AddNote(response http.ResponseWriter, request *http.Request) {
	var note *pb.NotesRequest
	_ = json.NewDecoder(request.Body).Decode(&note)
	err := noteRepository.CreateNote(note)
	if err != nil {
		logger.Errorf(err.Error())
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{ "message": "` + err.Error() + `" }`))
		return
	}
	logger.Infof("Inserted data")
	json.NewEncoder(response).Encode(note)
}

func (nh *NoteHandler) ReadNoteById(response http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id := params["id"]
	note, err := noteRepository.GetNoteById(id)
	if err != nil {
		logger.Errorf(err.Error())
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{ "message": "` + err.Error() + `" }`))
		return
	}
	logger.Infof("Fetched Note With Id:" + id)
	json.NewEncoder(response).Encode(note)
}

func (nh *NoteHandler) GetNotes(response http.ResponseWriter, r *http.Request) {
	notes, err := noteRepository.GetNotes()
	if err != nil {
		logger.Errorf(err.Error())
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{ "message": "` + err.Error() + `" }`))
		return
	}
	logger.Infof("Fetched all Notes")
	json.NewEncoder(response).Encode(notes)
}

func (nh *NoteHandler) UpdateNote(response http.ResponseWriter, request *http.Request) {
	var note *pb.NotesResponse
	_ = json.NewDecoder(request.Body).Decode(&note)
	err := noteRepository.UpdateNote(note)
	if err != nil {
		logger.Errorf(err.Error())
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{ "message": "` + err.Error() + `" }`))
		return
	}
	logger.Infof("Updated Note with Id:" + note.Id)
	json.NewEncoder(response).Encode("Updated Note with Id:" + note.Id)
}

func (nh *NoteHandler) DeleteNote(response http.ResponseWriter, request *http.Request) {
	params := mux.Vars(request)
	id := params["id"]
	err := noteRepository.DeleteNote(id)
	if err != nil {
		logger.Errorf(err.Error())
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{ "message": "` + err.Error() + `" }`))
		return
	}
	logger.Infof("Deleted Note with Id:" + id)
	json.NewEncoder(response).Encode("Deleted Note with Id:" + id)
}
