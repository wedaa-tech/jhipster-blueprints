package controllers

import (
	"net/http"
	<%_ if (auth && restClient){  _%>
	auth "<%= packageName %>/auth"
	<%_ } _%>
	<%_ if (restClient){  _%>
	"github.com/micro/micro/v3/service/logger"
	"encoding/json"
	<%_ } _%>
	<%_ if (restServer?.length ){  _%>
		rest "<%= packageName %>/communication/rest"
	<%_ } _%>
	"github.com/gorilla/mux"
	)

type CommunicationController struct {

}

func (communicationController CommunicationController) RegisterRoutes(r *mux.Router) {
			<%_ if (restClient) { _%>
				<%_ if (auth) { _%>
					r.Handle("/rest/services/<%= baseName %>", auth.Protect(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
						logger.Infof("response sent")
						w.Header().Set("Content-Type", "application/json")
						w.WriteHeader(http.StatusOK)
						json.NewEncoder(w).Encode(map[string]string{"server": "UP"})
					}))).Methods(http.MethodGet)
				<%_ } else { _%>
					r.HandleFunc("/rest/services/<%= baseName %>", func(w http.ResponseWriter, _ *http.Request) {
						logger.Infof("response sent")
						w.Header().Set("Content-Type", "application/json")
						w.WriteHeader(http.StatusOK)
						json.NewEncoder(w).Encode(map[string]string{"server": "UP"})
					}).Methods(http.MethodGet,http.MethodOptions)
				<%_ } _%>
			<%_ } _%>
			<%_ if (restServer?.length && eureka){  for(var i=0;i<restServer.length;i++){_%>
			r.HandleFunc("/api/services/<%= restServer[i] %>",func(w http.ResponseWriter, r *http.Request) { 
				rest.Client(w,r,"<%= restServer[i] %>")
			}).Methods(http.MethodGet)
			<%_ }} _%>
			<%_ if (restServer?.length && !eureka && apiServers){ apiServers.forEach((appServer) =>  { _%>
			r.HandleFunc("/api/services/<%= appServer.baseName %>",func(w http.ResponseWriter, r *http.Request) { 
				rest.Client(w,r,"<%= appServer.baseName %>")
			}).Methods(http.MethodGet)
			<%_ })} _%>
}


