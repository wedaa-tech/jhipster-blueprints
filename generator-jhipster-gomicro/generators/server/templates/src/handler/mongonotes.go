package handler

import (
	"encoding/json"
	"net/http"
	"net/url"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson/primitive"

	pb "<%= packageName %>/pb"
	repository "<%= packageName %>/repository"
	"github.com/micro/micro/v3/service/logger"
)

var note pb.NotesResponse
var noteRepository *repository.NoteRepository

type NoteHandler struct{}

func (nh *NoteHandler) AddNote(response http.ResponseWriter, request *http.Request) {
	var notereq pb.NotesRequest
	_ = json.NewDecoder(request.Body).Decode(&notereq)
	res, err := noteRepository.AddNote(&notereq)
	if err != nil {
		logger.Errorf(err.Error())
		response.WriteHeader(400)
		response.Write([]byte(`{ "message": "` + err.Error() + `" }`))
		return
	} else {
		objectID, ok := res.InsertedID.(primitive.ObjectID)
		if !ok {
			logger.Errorf(`{ "message": "Invalid Id" }`)
			response.WriteHeader(http.StatusInternalServerError)
			response.Write([]byte(`{ "message": "Invalid Id" }`))
			return
		}
		notesResponse := pb.NotesResponse{
			Id:          objectID.Hex(),
			Description: notereq.Description,
			Subject:     notereq.Subject,
		}
		logger.Infof("Inserted Note with Id:" + notesResponse.Id)
		json.NewEncoder(response).Encode(notesResponse)
	}
}

func (nh *NoteHandler) ReadNoteById(response http.ResponseWriter, request *http.Request) {
	params := mux.Vars(request)
	id := params["id"]
	note, err := noteRepository.GetNoteByID(id)
	if err != nil {
		logger.Errorf(err.Error())
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{ "message": "` + err.Error() + `" }`))
		return
	}
	logger.Infof("Fetched note by ID:" + id)
	json.NewEncoder(response).Encode(note)
}

func (nh *NoteHandler) GetNotes(response http.ResponseWriter, request *http.Request) {
	notes, err := noteRepository.GetNotes()
	if err != nil {
		logger.Errorf(err.Error())
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{ "message": "` + err.Error() + `" }`))
		return
	}
	logger.Infof("Fetched all notes")
	json.NewEncoder(response).Encode(notes)
}

func (nh *NoteHandler) UpdateNote(response http.ResponseWriter, request *http.Request) {
	_ = json.NewDecoder(request.Body).Decode(&note)
	result, err := noteRepository.UpdateNote(&note)
	if err != nil {
		logger.Errorf(err.Error())
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{ "message": "` + err.Error() + `" }`))
		return
	}
	logger.Infof("Updated Note With Id:" + note.Id)
	json.NewEncoder(response).Encode(result)
}

func (nh *NoteHandler) DeleteNote(response http.ResponseWriter, request *http.Request) {
	queryParams, err := url.ParseQuery(request.URL.RawQuery)
	if err != nil {
		logger.Errorf("Error parsing query parameters")
		http.Error(response, "Error parsing query parameters", http.StatusBadRequest)
		return
	}
	idValues, ok := queryParams["id"]
	if !ok || len(idValues) == 0 {
		logger.Errorf("Missing or empty 'id' parameter")
		http.Error(response, "Missing or empty 'id' parameter", http.StatusBadRequest)
		return
	}
	id := idValues[0]
	result, err := noteRepository.DeleteNoteByID(id)
	if err != nil {
		logger.Errorf(err.Error())
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{ "message": "` + err.Error() + `" }`))
		return
	}
	logger.Infof("Deleted Note With Id:" + id)
	json.NewEncoder(response).Encode(result)
}
