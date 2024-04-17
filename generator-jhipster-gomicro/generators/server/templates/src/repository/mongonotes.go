package repository

import (
 "context"

 config "<%= packageName %>/db"
 pb "<%= packageName %>/pb"

 "go.mongodb.org/mongo-driver/bson"
 "go.mongodb.org/mongo-driver/bson/primitive"
 "go.mongodb.org/mongo-driver/mongo"
)

var collectionName = "notes"
var noteCollection *mongo.Collection

type NoteRepository struct{}

func (nr *NoteRepository) AddNote(note *pb.NotesRequest) (*mongo.InsertOneResult, error) {
	result, err := config.DatabaseClient.Database("<%= packageName %>").Collection(collectionName).InsertOne(context.Background(), note)
	return result, err
}

func (repo *NoteRepository) GetNoteByID(id string) (*pb.NotesResponse, error) {
	var note pb.NotesResponse
	err := config.DatabaseClient.Database("<%= packageName %>").Collection(collectionName).FindOne(context.Background(), bson.M{"_id": id}).Decode(&note)
	return &note, err
}

func (repo *NoteRepository) GetNotes() ([]*pb.NotesResponse, error) {
	var notes []*pb.NotesResponse
	cursor, err := config.DatabaseClient.Database("<%= packageName %>").Collection(collectionName).Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())
	for cursor.Next(context.Background()) {
		var note pb.NotesResponse
		err := cursor.Decode(&note)
		if err != nil {
			return nil, err
		}
		notes = append(notes, &note)
	}
	return notes, nil
}

func (repo *NoteRepository) UpdateNote(note *pb.NotesResponse) (*mongo.UpdateResult, error) {
	filter := bson.M{"_id": note.Id}
	update := bson.M{"$set": note}
	result, err := config.DatabaseClient.Database("<%= packageName %>").Collection(collectionName).UpdateOne(context.Background(), filter, update)
	return result, err
}

func (repo *NoteRepository) DeleteNoteByID(id string) (*mongo.DeleteResult, error) {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	result, err := config.DatabaseClient.Database("<%= packageName %>").Collection(collectionName).DeleteOne(context.Background(), bson.M{"_id": objID})
	if err != nil {
		return nil, err
	}

	return result, nil
}
