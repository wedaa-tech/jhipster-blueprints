# Communication

<% if(restServer?.length) { %>
## SYNC

Synchronized communication is configured using REST API.

```
<%_ for(var i=0;i<restServer.length;i++){ _%>
communication {
  client "<%= baseName %>"
  server "<%= restServer[i] %>"
  type "sync"
  framework "rest-api"
}
<%_ } _%>	
```

You can call other microservices using the following curl command:

```
<%_ for(var i=0;i<restServer.length;i++){ _%>
curl http://localhost:<%= serverPort %>/rest/services/<%= restServer[i] %>
<%_ } _%>	
```
<%_ } _%>	



<% if(rabbitmqClient?.length) { %>
## ASYNC

Asynchronous communication is configured using RabbitMQ.

```
<%_ for(var i=0;i<rabbitmqClient.length;i++){ _%>
communication {
  producer "<%= baseName %>"
  consumer "<%= rabbitmqClient[i] %>"
  type "async"
  framework "rabbitmq"
}
<%_ } _%>
```
<% } %>

