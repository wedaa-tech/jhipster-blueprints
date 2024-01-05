# <%= baseName %> prototype

This is a react application prototype, generated using WeDAA. You can find documentation and help at [WeDAA Docs](https://www.wedaa.tech/docs/introduction/what-is-wedaa/)

## Prerequisites

- Node version >= 18
- npm version >= 9.6
- docker version >= 24

## Project Structure

This project is based on standard React Application, so it follows the same project structure.

```
├── public/
├── docker/ (contains docker compose files for external components based on architecture design)
├── src
    ├── App.css
    ├── App.js (Main React Component)
    ├── assets/ (Static files)
    ├── components/ (react application components)
    <%_ if (oauth2) { _%>
    ├── config/ (contains integration code for other components)
    <%_ } _%>
├── Dockerfile (for packaging the application as docker image)
├── README.md (Project documentation)
├── comm.yo-rc.json (generator configuration file for communications)
├── nginx.conf (nginx server configuration)
└── package.json (npm configuration)
```
<%_ if (oauth2 || eureka) { _%>
## Dependencies

This application is configured to work with few external components.

Docker compose files are provided for the same to get started quickly.

Component details:
<%_ if (oauth2) { _%>
- Keycloak as Identity Management:
  
  Run keycloak as docker container - `npm run docker:keycloak:up`
<%_ } _%>

<%_ if (eureka) { _%>
- Eureka Service Discovery:
<%_ } _%>

On launch, <%= baseName %> will refuse to start if it is not able to connect to any of the above component(s).
<%_ } _%>

## Get Started

Install required dependencies: `npm install`

Run the prototype locally in development mode: `npm start`

Open [http://localhost:<%= serverPort %>](http://localhost:<%= serverPort %>) to view it in your browser.

The page will reload when you make changes.

## Containerization

Build the docker image: `docker build -t <%= baseName %>:latest .`

Start the container: `docker run -d -p <%= serverPort %>:80 <%= baseName %>:latest`
