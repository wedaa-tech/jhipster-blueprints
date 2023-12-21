package handler

import (
	pb "<%= packageName %>/proto"
	"context"
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/micro/micro/v3/service/logger"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"net/http"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"net/url"
)

var note pb.NotesResponse

var noteCollection *mongo.Collection

func InitializeMongoCollection() {
	if(mongoClient!=nil){
	noteCollection = mongoClient.Database("<%= baseName %>").Collection("notes")
	}
}

func AddNote(response http.ResponseWriter, request *http.Request) {
	var notereq pb.NotesRequest
	response.Header().Set("content-type", "application/json")
	_ = json.NewDecoder(request.Body).Decode(&notereq)
	res, err := noteCollection.InsertOne(context.Background(), notereq)
	if err != nil {
		logger.Errorf(err.Error())
		response.WriteHeader(400)
		response.Write([]byte(`{ "message": "` + err.Error() + `" }`))
		return
	} else {
		objectID, ok := res.InsertedID.(primitive.ObjectID)
		if !ok {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{ "message": "Invalid Id" }`))
		return
		}
		notesResponse := pb.NotesResponse{
			Id:          objectID.Hex(), 
			Description: notereq.Description,
			Subject: notereq.Subject,
		}
		logger.Infof("Inserted Note with Id:" + notesResponse.Id)
		json.NewEncoder(response).Encode(notesResponse)
	}
}

func ReadNoteById(response http.ResponseWriter, request *http.Request) {
	response.Header().Set("content-type", "application/json")
	params := mux.Vars(request)
	id := params["id"]
	err := noteCollection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&note)
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{ "message": "` + err.Error() + `" }`))
		logger.Errorf(err.Error())
		return
	}
	logger.Infof("Fetched note by ID:" + id)
	json.NewEncoder(response).Encode(note)
}

func GetNotes(response http.ResponseWriter, request *http.Request) {
	response.Header().Set("content-type", "application/json")
	var notes []pb.NotesResponse
	cursor, err := noteCollection.Find(context.Background(), bson.M{})
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{ "message": "` + err.Error() + `" }`))
		logger.Errorf(err.Error())
		return
	}
	defer cursor.Close(context.Background())
	for cursor.Next(context.Background()) {
		cursor.Decode(&note)
		notes = append(notes, note)
	}
	if err := cursor.Err(); err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{ "message": "` + err.Error() + `" }`))
		logger.Errorf(err.Error())
		return
	}
	logger.Infof("Fetched all notes")
	json.NewEncoder(response).Encode(notes)
}

func UpdateNote(response http.ResponseWriter, request *http.Request) {
	response.Header().Set("content-type", "application/json")
	_ = json.NewDecoder(request.Body).Decode(&note)
	filter := bson.D{{Key: "_id", Value: note.Id}}
	result, err := noteCollection.ReplaceOne(context.Background(), filter, note)
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{ "message": "` + err.Error() + `" }`))
		logger.Errorf(err.Error())
		return
	}
	logger.Infof("Updated Note With Id:" + note.Id)
	json.NewEncoder(response).Encode(result)
}

func DeleteNote(response http.ResponseWriter, request *http.Request) {
	response.Header().Set("content-type", "application/json")
	queryParams, err := url.ParseQuery(request.URL.RawQuery)
	if err != nil {
		http.Error(response, "Error parsing query parameters", http.StatusBadRequest)
		return
	}
	idValues, ok := queryParams["id"]
	if !ok || len(idValues) == 0 {
		http.Error(response, "Missing or empty 'id' parameter", http.StatusBadRequest)
		return
	}
	id := idValues[0]
	objID, err := primitive.ObjectIDFromHex(id)
	filter := bson.D{{Key: "_id", Value: objID}}
	result, err := noteCollection.DeleteOne(context.Background(), filter)
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{ "message": "` + err.Error() + `" }`))
		logger.Errorf(err.Error())
		return
	}
	logger.Infof("Deleted Note With Id:" + id)
	json.NewEncoder(response).Encode(result)
}
