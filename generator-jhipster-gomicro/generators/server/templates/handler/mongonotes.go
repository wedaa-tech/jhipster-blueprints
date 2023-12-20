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
	"strconv"
	"sync"
	"net/url"
)

var note pb.NotesResponse


var (
	noteCollection *mongo.Collection
	noteMu         sync.Mutex
	currentID      int
)

func fetchMongoId() {
	if(mongoClient!=nil){
	noteCollection = mongoClient.Database("<%= baseName %>").Collection("notes")
	currentID, _ = getMaxIDFromDB()
	}
}

func getMaxIDFromDB() (int, error) {
	pipeline := []bson.D{
		bson.D{
			{"$group", bson.D{
				{"_id", nil},
				{"max_id", bson.D{
					{"$max", bson.D{
						{"$toInt", "$_id"},
					}},
				}},
			}},
		},
	}
	cursor, err := noteCollection.Aggregate(context.Background(), pipeline)
	if err != nil {
		logger.Errorf(err.Error())	
	}
	defer cursor.Close(context.Background())

	var result bson.M
	if cursor.Next(context.Background()) {
		err := cursor.Decode(&result)
		if err != nil {
			logger.Errorf(err.Error())	
		}
	}
	maxID,ok:= result["max_id"].(int32)
	if !ok {
		return 0, nil
	}
	return int(maxID), nil
}

func getNextID() int {
	noteMu.Lock()
	defer noteMu.Unlock()
	currentID++
	return currentID
}


func AddNote(response http.ResponseWriter, request *http.Request) {
	response.Header().Set("content-type", "application/json")
	_ = json.NewDecoder(request.Body).Decode(&note)
	logger.Infof("%v", note)
	note.Id = strconv.Itoa(getNextID())
	_, err := noteCollection.InsertOne(context.Background(), note)
	if err != nil {
		logger.Errorf(err.Error())
		response.WriteHeader(400)
		response.Write([]byte(`{ "message": "` + err.Error() + `" }`))
		return
	} else {
		logger.Infof("Inserted object with Id:" + note.Id)
		json.NewEncoder(response).Encode(note)
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
	filter := bson.D{{Key: "_id", Value: id}}
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
