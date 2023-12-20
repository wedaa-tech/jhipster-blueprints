package controllers

import (
	<%_ if (auth){  _%>
	auth "<%= packageName %>/auth"
	<%_ } _%>
	"github.com/gorilla/mux"
	"net/http"
	"encoding/json"
	<%_ if (restServer?.length){  _%>
	eureka "<%= packageName %>/eurekaregistry"
	<%_ } _%>
	<%_ if (postgresql||mongodb){  _%>
	"<%= packageName %>/handler"
	<%_ } _%>
	<%_ if (restClient){  _%>
	"github.com/micro/micro/v3/service/logger"
	<%_ } _%>
)

type EventController struct {
}

func (t EventController) RegisterRoutes(r *mux.Router) {
	<%_ if (postgresql || mongodb) { _%>
		<%_ if (auth) { _%>
			r.Handle("/event", auth.Protect(http.HandlerFunc(handler.AddEvent))).Methods(http.MethodPost)
			r.Handle("/events", auth.Protect(http.HandlerFunc(handler.GetEvents))).Methods(http.MethodGet)
			r.Handle("/events/{id}", auth.Protect(http.HandlerFunc(handler.ReadEventById))).Methods(http.MethodGet)
			r.Handle("/update", auth.Protect(http.HandlerFunc(handler.UpdateEvent))).Methods(http.MethodPatch)
			r.Handle("/delete/{id}", auth.Protect(http.HandlerFunc(handler.DeleteEvent))).Methods(http.MethodDelete)
			r.Handle("/api/notes",auth.Protect(http.HandlerFunc(handler.AddNote))).Methods(http.MethodPost,http.MethodOptions)
			r.Handle("/api/notes",auth.Protect(http.HandlerFunc(handler.GetNotes))).Methods(http.MethodGet,http.MethodOptions)
			r.Handle("/notes/{id}",auth.Protect(http.HandlerFunc(handler.ReadNoteById))).Methods(http.MethodGet,http.MethodOptions)
			r.Handle("/update/notes",auth.Protect(http.HandlerFunc(handler.UpdateNote))).Methods(http.MethodPatch,http.MethodOptions)
			r.Handle("/api/notes",auth.Protect(http.HandlerFunc(handler.DeleteNote))).Methods(http.MethodDelete,http.MethodOptions)
		<%_ } else { _%>
			r.HandleFunc("/event", handler.AddEvent).Methods(http.MethodPost)
			r.HandleFunc("/events", handler.GetEvents).Methods(http.MethodGet)
			r.HandleFunc("/events/{id}", handler.ReadEventById).Methods(http.MethodGet)
			r.HandleFunc("/update", handler.UpdateEvent).Methods(http.MethodPatch)
			r.HandleFunc("/delete/{id}", handler.DeleteEvent).Methods(http.MethodDelete)
			r.HandleFunc("/api/notes",handler.AddNote).Methods(http.MethodPost,http.MethodOptions)
			r.HandleFunc("/api/notes",handler.GetNotes).Methods(http.MethodGet,http.MethodOptions)
			r.HandleFunc("/notes/{id}",handler.ReadNoteById).Methods(http.MethodGet,http.MethodOptions)
			r.HandleFunc("/update/notes",handler.UpdateNote).Methods(http.MethodPatch,http.MethodOptions)
			r.HandleFunc("/api/notes",handler.DeleteNote).Methods(http.MethodDelete,http.MethodOptions)
		<%_ } _%>
	<%_ } _%>
	
	r.HandleFunc("/management/health/readiness", func(w http.ResponseWriter, _ *http.Request) {   
	json.NewEncoder(w).Encode(map[string]interface{}{"status": "UP","components":map[string]interface{} {"readinessState": map[string]interface{}{"status": "UP"}}})}).Methods(http.MethodGet)
	<%_ if (restClient) { _%>
		<%_ if (auth) { _%>
			r.Handle("/rest/services/<%= baseName %>", auth.Protect(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
				logger.Infof("response sent")
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusCreated)
				json.NewEncoder(w).Encode(map[string]string{"server": "UP"})
			}))).Methods(http.MethodGet)
		<%_ } else { _%>
			r.HandleFunc("/rest/services/<%= baseName %>", func(w http.ResponseWriter, _ *http.Request) {
				logger.Infof("response sent")
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusCreated)
				json.NewEncoder(w).Encode(map[string]string{"server": "UP"})
			}).Methods(http.MethodGet,http.MethodOptions)
		<%_ } _%>
	<%_ } _%>
	
	<%_ if (restServer?.length){  for(var i=0;i<restServer.length;i++){_%>
	r.HandleFunc("/api/services/<%= restServer[i] %>",func(w http.ResponseWriter, r *http.Request) { eureka.Client(w,r,"<%= restServer[i] %>")}).Methods(http.MethodGet)
	<%_ }} _%>	
	r.HandleFunc("/hello",func(w http.ResponseWriter, _ *http.Request){
	json.NewEncoder(w).Encode("helloworld")}).Methods(http.MethodGet)
	r.HandleFunc("/management/health/liveness", func(w http.ResponseWriter, _ *http.Request) {     
	json.NewEncoder(w).Encode(map[string]interface{}{"status": "UP","components":map[string]interface{} {"livenessState": map[string]interface{}{"status": "UP"}}})}).Methods(http.MethodGet)
}