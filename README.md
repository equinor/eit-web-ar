# Emerging IT - Web AR

_Summer 2020 Internship Project_

The challenges for the average Equinor employee to use dedicated AR devices in a office environment are
- Devices are not easily available
- Devices require setup on dedicated machines
- Equinor managed pcs are a no-go due to the way they are locked down
- Management of both device setup and usage scenarios are too cumbersome for quick and easy show and tell demos, or simply exploration of a 3d design you are working on

To be able to make (a limited subset of) the possibilities of AR available to as many people as possible we can
- Use their mobile phone as device
- Use a web app so that no installations is required
- And then help tracking by using QR codes or GPS coords for where AR should kick in

By using WebXR we trade (advanced) device capabilities to gain user availability - both for end-users and developers.
By gaining easy availability we hope to be able to quickly explore use cases where "lightweight" AR can enhance the daily work experience.

![Explore AR possibilites with the user](./docs/zapp-brannigan.jpg)

![alt text](./docs/lezdodis.gif)

## Table of contents

### For developers

- [Technology](#technology)
- [Components](#components)
- [Security](#security)
- [Development](./README.md#development)
- [How we work](./docs/how-we-work.md)
- [Documentation](./docs/README.md)

### For users

- [User guide](./docs/user-guide.md)

### For Equinor

- Final report is available in the following formats  
  - [docx](./docs/Report/Case09_report.docx)
  - [pdf](./docs/Report/Case09_report.pdf)
- [Documentation](./docs/README.md)


## Technologies

- [A-Frame JS](https://aframe.io/)  
   Web VR library built on top of [three.js](https://threejs.org/)
   - [Experiment with AR and A-Frame](https://aframe.io/blog/webxr-ar-module/)
   - [Image Tracking and Location-Based AR with A-Frame and AR.js 3](https://aframe.io/blog/arjs3/)

- [AR.js](https://ar-js-org.github.io/AR.js-Docs/)  
  Web AR library that works well with A-frame.

- [nginx](https://www.nginx.com/)  
  Simple web server for static content, handle public routing

- [NodeJS](https://nodejs.org/en/)  
  Serverside javascript
  - [Express](https://expressjs.com/) for creating a REST API.
  - [Socket.io](https://socket.io/) for WebSocket communication.
  

- [Redis](https://redis.io/)  
  Redis is an open source (BSD licensed), in-memory data structure store, used as a database, cache and message broker

- [Docker](https://www.docker.com/)  
  For hosting the web app anywhere and to run local development environments
  To quickly get up to speed with docker then run through the [Learn Docker & Containers using Interactive Browser-Based Scenarios](https://www.katacoda.com/courses/docker) at katacoda

- [OAuth2 proxy](https://github.com/oauth2-proxy/oauth2-proxy)  
  A reverse proxy and static file server that provides authentication using Providers (Google, GitHub, and others) to validate accounts by email, domain or group.
  We use it as a proxy container in front of the app container to simplify integration with an Azure AD app.

- [Omnia Radix](https://www.radix.equinor.com/)  
   CICD and hosting


### CICD

- [webpack](https://webpack.js.org/guides/)  
  Build and bundle the web components of the app

- [Docker](https://www.docker.com/)  
  We use multistage dockerfiles to build the images.
  `docker-compose` is used for development purposes only.

- [Omnia Radix](https://www.radix.equinor.com/)  
  CICD and hosting in the [playground](https://console.playground.radix.equinor.com/) environment.
  Radix configuration is mainly handled in [`radixconfiguration.yaml`](../radixconfiguration.yaml)


## Components

### Core 

- [**frontend**](./frontend)  
  A client side web app.  
  nginx acts as a "backend" in that it
  - Serve static js/css/html to the client
  - Route `/api` to the `backend` component

- [**backend**](./backend)  
  Handle business logic for multiplayer scenarios.  
  It is a nodejs server running express to expose a REST api.  
  Dependent on component `storage` for, well, data storage.

- [**storage**](./storage)   
  Storage is a simple redis container with no file storage or backup

### Additional components when app is available in Radix (public)

- **auth-proxy**  
  Main entry point for the app when making the app available to the public in `radix`.  
  It allows traffic to the `frontend` component if the `aad app` authenticate the user.
  Based on [radix auth proxy example](https://github.com/equinor/radix-example-front-proxy)

- **aad app**  
  OAuth in Azure


## Security

- **Authentication**
  - _Who:_ All Equinor employees
  - _What:_ auth-proxy
  - _Where:_
    - Azure AD app `EIT Web AR AD App`, see configfile [azure.env](./azure/azure.env) for details
    - Auth proxy configuration in [radixconfig.yaml](../radixconfig.yaml)
    - Credentials are set as secrets in each host environment in Radix (see CICD)

- **Network**
  - _What:_ https
  - _Where:_
    - Internet facing app use TLS cert provided by Radix
    - Local dev app served by webpack use a selfsigned cert issued by webpack

- **Keyvault**
  - _What:_ az keyvault
  - _Where:_ `eit-web-ar`, owned by EIT

- **CICD**
  - _What:_ Radix Playground
  - _Where:_ https://console.playground.radix.equinor.com/applications/eit-web-ar
  - _Who:_ AZ AD group `EIT Web AR` (`1c15fcc6-3f69-4db7-a8ee-b4d86c293c35`)

- **Hosting**
  - _What:_ Radix Playground
  - _Where:_
    - [Production](https://eit-web-ar.app.playground.radix.equinor.com/), (git branch `release`)
    - [Development](https://entrypoint-eit-web-ar-development.playground.radix.equinor.com/), (git branch `master`)
  - _Who:_ See "CICID"

- **Docker**
  - _What:_  Release image does not have root privilieges
  - _Where:_ 
    - [dockerfile.frontend](./frontend/dockerfile.frontend)
    - [dockerfile.backend](./backend/dockerfile.backend)
    - [dockerfile.storage](./storage/dockerfile.storage)


- **Credentials**  
  The component `storage` is the only component that use credentials, see [storage/security](./storage/README.md#security) for details.  
  The local development share all credentials by using a docker-compose `.env` file, see [README/Storage credentials in shared .env file](./README.md#storage-credentials-in-shared-env-file)


## Development

Each component has a `docker-compose.yaml` that contains everything we need to run a development environment for that specific component, while the other components are run using their production dockerfiles. See each component README for how to get it up and running.

If you need to have the development environment for _all_ components available at the same time then use the [./docker-compose.yaml](./docker-compose.yaml) found in repo root.

### Storage credentials in shared .env file

We make use of [docker-compose `.env` file](https://docs.docker.com/compose/environment-variables/#the-env-file) to insert credentials as environment variables in the storage and backend container.  
This `.env` file is shared among the development environments (docker-compose) for all the app components.

1. Create your own `.env` file in root of repo 
1. Add variables in key=value format
   ```sh
   REDIS_PASSWORD=<insert-your-password>
   ```
1. Make sure `.env` is gitignored!
