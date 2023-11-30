# <%= baseName %> prototype

This is an angular application prototype, generated using WeDAA. You can find documentation and help at [WeDAA Docs](https://www.wedaa.tech/docs/introduction/what-is-wedaa/)

## Prerequisites

- Node version >= 18
- npm version >= 9.6
- docker version >= 24

## Project Structure

This project is based on standard Angular Application, so it follows the same project structure.

```
├── docker/ (contains docker compose files for external components based on architecture design)
├── src
│   ├── app
<%_ if (oauth2) { _%>
│   │   ├── auth (Authentication component)
<%_ } _%>
│   │   ├── home (Homepage component)
│   │   ├── layouts (Navbar component)
│   │   ├── app-routing.module.ts
│   │   ├── app.component.css
│   │   ├── app.component.html
│   │   ├── app.component.spec.ts
│   │   ├── app.component.ts
│   │   └── app.module.ts
│   ├── assets
│   │   └── logox.png
│   ├── favicon.ico
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── README.md (Project documentation)
├── angular.json (Angular configuration)
├── comm.yo-rc.json (generator configuration file for communications)
├── environment.production.ts (Production environment configuration)
├── environment.ts (Development environment configuration)
├── package.json (npm configuration)
├── tsconfig.app.json
├── tsconfig.json
└── tsconfig.spec.json
```

<%_ if (oauth2 || eureka) { _%>
## Dependencies

This application is configured to work with few external components.

Docker compose files are provided for the same to get started quickly.

Component details:
<%_ if (oauth2) { _%>
- Keycloak as Identity Management - `docker compose -f docker/keycloak.yml up -d`
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
