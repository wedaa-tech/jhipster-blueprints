package main

import (
	<%_ if (auth){  _%>
 auth "<%= packageName %>/auth"
	<%_ } _%>
 "<%= packageName %>/controllers"
 "github.com/asim/go-micro/v3"
	<%_ if (rabbitmqClient?.length||rabbitmqServer?.length){  _%>
 rabbitmq "<%= packageName %>/communication/rabbitmq"
	<%_ } _%>
 "github.com/micro/micro/v3/service/logger"
	<%_ if (eureka){  _%>
 eureka "<%= packageName %>/serviceregistry"
 "github.com/google/uuid"
	<%_ } _%>
	<%_ if (postgresql||mongodb){  _%>
 config "<%= packageName %>/db"
	<%_ } _%>
	<%_ if (postgresql){  _%>	
 "<%= packageName %>/migrate"
	<%_ } _%>
 _ "github.com/jackc/pgx/v4/stdlib"
 "net/http"
 mhttp "github.com/go-micro/plugins/v3/server/http"
 "github.com/gorilla/mux"
 app "<%= packageName %>/config/loader"
)

<%_ if (eureka){  _%>
var configurations eureka.RegistrationVariables
<%_ } _%>

func main() {
	<%_ if (eureka){  _%>
	defer cleanup()
	<%_ } _%>
	app.Setconfig()
	<%_ if (postgresql){  _%>
	migrate.MigrateAndCreateDatabase()
	<%_ } _%>
	<%_ if (auth){  _%>
	auth.SetClient()
	<%_ } _%>
	<%_ if (postgresql||mongodb){  _%>
	config.InitializeDb()
	<%_ } _%>
	<%_ if (eureka){  _%>
	service_registry_url :=app.GetVal("GO_MICRO_SERVICE_REGISTRY_URL")
	InstanceId := "<%= baseName %>:"+uuid.New().String()
	configurations = eureka.RegistrationVariables {ServiceRegistryURL:service_registry_url,InstanceId:InstanceId}
	<%_ } _%>
	port :=app.GetVal("GO_MICRO_SERVICE_PORT")
	srv := micro.NewService(
		micro.Server(mhttp.NewServer()),
    )
	opts1 := []micro.Option{
		micro.Name("<%= baseName %>"),
		micro.Version("latest"),
		micro.Address(":"+port),
	}
	srv.Init(opts1...)
	r := mux.NewRouter().StrictSlash(true)
	r.Use(corsMiddleware)
	registerRoutes(r)		
	var handlers http.Handler = r
	
	<%_ if (eureka){  _%>
	go eureka.ManageDiscovery(configurations)
	<%_ } _%>
	<%_ if (rabbitmqClient?.length){  for(var i=0;i<rabbitmqClient.length;i++){
		 capitalizedServer=baseName.charAt(0).toUpperCase()+baseName.slice(1)
		 capitalizedClient=rabbitmqClient[i].charAt(0).toUpperCase()+rabbitmqClient[i].slice(1)
	_%>
	rabbitmq.Producer<%= capitalizedServer %>To<%= capitalizedClient %>()
    <%_ }}_%>
	<%_ if (rabbitmqServer?.length){ for(var i=0;i<rabbitmqServer.length;i++){ 
		 capitalizedServer=rabbitmqServer[i].charAt(0).toUpperCase()+rabbitmqServer[i].slice(1)
		 capitalizedClient=baseName.charAt(0).toUpperCase()+baseName.slice(1)
	_%>
	go rabbitmq.Consumer<%= capitalizedServer %>To<%= capitalizedClient %>() 
	<%_ }} _%>

    if err := micro.RegisterHandler(srv.Server(), handlers); err != nil {
		logger.Fatal(err)
	}
	
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}

<%_ if (eureka){  _%>
func cleanup(){
	eureka.Cleanup(configurations)
}
<%_ } _%>

func registerRoutes(router *mux.Router) {
		<%_ if (restServer?.length || restClient){  _%>
		registerControllerRoutes(controllers.CommunicationController{}, router)
		<%_ } _%>
		registerControllerRoutes(controllers.ManagementController{}, router)
		<%_ if (postgresql||mongodb){  _%>
		registerControllerRoutes(controllers.NoteController{}, router)
		<%_ } _%>
}

func registerControllerRoutes(controller controllers.Controller, router *mux.Router) {
	controller.RegisterRoutes(router)
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept,Authorization")
		w.Header().Set("Content-Type", "application/json")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}