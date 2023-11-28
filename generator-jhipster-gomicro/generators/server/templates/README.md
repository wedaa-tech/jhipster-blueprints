# <%= baseName %> prototype

This is a go-micro prototype generated using WeDAA, you can find documentation and help at [WeDAA Docs](https://www.wedaa.tech/docs/introduction/what-is-wedaa/)

## Prerequisites

- go version >= 1.20

## Project Structure

```
<%_ if (auth) { _%>
├── auth/ (IdP configuration for keycloak)
<%_ } _%>
├── config/ (configuration properties loader)
├── controllers/ (api controllers)
<%_ if (postgresql || mongodb) { _%>
├── db/ (DB connection configuration)
<%_ } _%>
├── docker/ (contains docker compose files for external components based on architecture design)
<%_ if (eureka) { _%>
├── eurekaregistry/ (configuration for eureka service registry)
<%_ } _%>
<%_ if (postgresql || mongodb) { _%>
├── handler/ (DB handler methods)
<%_ } _%>
<%_ if (postgresql) { _%>
├── migrate/ (database schema change management)
<%_ } _%>
<%_ if (postgresql || mongodb) { _%>
├── proto/ (proto files supporting DB models)
<%_ } _%>
<%_ if (rabbitmq) { _%>
├── rabbitmq/ (message broker configuration)
<%_ } _%>
├── resources/ (configuration properties)
├── Dockerfile (for packaging the application as docker image)
├── README.md (Project documentation)
├── comm.yo-rc.json (generator configuration file for communications)
├── go.mod
└── main.go
```

<%_ if (auth || eureka || postgresql || mongodb || rabbitmq) { _%>
## Dependencies

This application is configured to work with external component(s).

Docker compose files are provided for the same to get started quickly.

Component details:
<%_ if (auth) { _%>
- Keycloak as Identity Management: `docker compose -f docker/keycloak.yml up -d`
<%_ } _%>
<%_ if (eureka) { _%>
- Eureka Service Discovery: `docker compose -f docker/jhipster-registry.yml up -d`
<%_ } _%>
<%_ if (postgresql) { _%>
- Postgresql DB: `docker compose -f docker/postgresql.yml up -d`
<%_ } _%>
<%_ if (mongodb) { _%>
- mongoDB: `docker compose -f docker/mongodb.yml up -d`
<%_ } _%>
<%_ if (rabbitmq) { _%>
- RabbitMQ message broker: `docker compose -f docker/rabbitmq.yml up -d`
<%_ } _%>

On launch, <%= baseName %> will refuse to start if it is not able to connect to any of the above component(s).
<%_ } _%>

## Get Started

Install required dependencies: `go mod tidy`

Run the prototype locally: `go run .`

Open [http://localhost:<%= serverPort %>/hello](http://localhost:<%= serverPort %>/hello) to view it in your browser.

The page will reload when you make changes.

## Containerization

Build the docker image: `docker build -t <%= baseName %>:latest .`

Start the container: `docker run -d -p <%= serverPort %>:<%= serverPort %> <%= baseName %>:latest`
