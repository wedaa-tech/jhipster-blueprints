# <%= baseName %> prototype

This is a Nextjs application prototype, generated using WeDAA. You can find documentation and help at [WeDAA Docs](https://www.wedaa.tech/docs/introduction/what-is-wedaa/)

## Prerequisites

- Node version >= 18
- npm version >= 9.6
- docker version >= 24
<%_ if (oauth2 && eureka) { _%>
- For Keycloak to work with Service Discovery in local(docker) environment, following line must be added to your hosts file `/etc/hosts`
  ```
  127.0.0.1	keycloak
  ```
<%_ } _%>

## Project Structure

This project is based on standard Nextjs Application. It uses App router and src directory as default.

```
├── public/
├── docker/ (contains docker compose files for external components based on architecture design)
├── src
    ├── globals.css
    ├── layout.js (Main React Component)
    ├── page.js (Main React Component)
    ├── page.module.css
    ├── assets/ (Static files)
    ├── components/ (react application components)
    <%_ if (oauth2) { _%>
    ├── api/ (contains keycloak with Oauth configuration)
    ├── providers/ (contains client side session provider)
    ├── (defaultroutes)/ (contains default pages)
    <%_ } _%>
├── Dockerfile (for packaging the application as docker image)
├── README.md (Project documentation)
├── comm.yo-rc.json (generator configuration file for communications)
├── jsconfig.json (It's a configuration file to assist your text editor)
├── next.config.mjs (It's a configuration file to customize nextjs build process).
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

Run the prototype locally in development mode: `npm run dev`

Open [http://localhost:<%= serverPort %>](http://localhost:<%= serverPort %>) to view it in your browser.

The page will reload when you make changes.

## Containerization

Build the docker image: `docker build -t <%= baseName %>:latest .`

Start the container: `docker run -d -p <%= serverPort %>:<%= serverPort %> <%= baseName %>:latest`