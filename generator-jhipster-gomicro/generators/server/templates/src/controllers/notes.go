package controllers

import (
<%_ if (auth){  _%>
 auth "<%= packageName %>/auth"
<%_ } _%>
 "github.com/gorilla/mux"
 "net/http"
<%_ if (postgresql||mongodb){  _%>
 "<%= packageName %>/handler"
<%_ } _%>
)

var noteHandler *handler.NoteHandler

type NoteController struct {
}

func (noteController NoteController) RegisterRoutes(r *mux.Router) {
<%_ if (postgresql || mongodb) { _%>
	<%_ if (auth) { _%>
	r.Handle("/api/notes",auth.Protect(http.HandlerFunc(noteHandler.AddNote))).Methods(http.MethodPost,http.MethodOptions)
	r.Handle("/api/notes",auth.Protect(http.HandlerFunc(noteHandler.GetNotes))).Methods(http.MethodGet,http.MethodOptions)
	r.Handle("/api/notes/{id}",auth.Protect(http.HandlerFunc(noteHandler.ReadNoteById))).Methods(http.MethodGet,http.MethodOptions)
	r.Handle("/api/notes",auth.Protect(http.HandlerFunc(noteHandler.UpdateNote))).Methods(http.MethodPatch,http.MethodOptions)
	r.Handle("/api/notes",auth.Protect(http.HandlerFunc(noteHandler.DeleteNote))).Methods(http.MethodDelete,http.MethodOptions)
	<%_ } else { _%>
	r.Handle("/api/notes",http.HandlerFunc(noteHandler.AddNote)).Methods(http.MethodPost,http.MethodOptions)
	r.Handle("/api/notes",http.HandlerFunc(noteHandler.GetNotes)).Methods(http.MethodGet,http.MethodOptions)
	r.Handle("/api/notes/{id}",http.HandlerFunc(noteHandler.ReadNoteById)).Methods(http.MethodGet,http.MethodOptions)
	r.Handle("/api/notes",http.HandlerFunc(noteHandler.UpdateNote)).Methods(http.MethodPatch,http.MethodOptions)
	r.Handle("/api/notes",http.HandlerFunc(noteHandler.DeleteNote)).Methods(http.MethodDelete,http.MethodOptions)
	<%_ } _%>
<%_ } _%>
	
}