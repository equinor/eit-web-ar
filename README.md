# eit-web-ar

_Summer 2020 Internship Project_

R&T often print models to enable engineers and stakeholders to get a better idea of what they are working with. These models will often be used as "lego", where people can build or deconstruct installations to get a sense for how the design will work in real life. We might be able to enhance the visual aspect of the models by using augmented reality (AR).  

The challenges for the average Equinor employee to use dedicated AR devices in a office environment are
- Devices are not easily available
- Devices require setup on dedicated machines
- Equinor managed pcs are a no-go
- Management of both device setup and usage scenarios are too cumbersome for quick and easy show and tell demos

To make "show my model in AR" available to as many people as possible we can 
- Use their mobile phone as device 
- Use a web app so that no installations is required
- And then use QR codes to tag the model (where AR should kick in)

The web app is hosted in Omnia Radix, see [Security/Hosting/Where](#Security) for links 


## Table of contents

### For developers

- [Technology](#technology)
- [Components](#components)
- [Security](#security)
- [Development](./README.md#development)
  - [Start](./README.md#start)
  - [Stop](./README.md#stop)
  - [Notes](./README.md#notes)
  - [Starting from scratch](./README.md#starting-from-scratch)
- [Build and run release image](./README.md#build-and-run-release-image)
- [How we work](./docs/how-we-work.md)

### For users

- [User guide](./docs/user-guide.md)

### For people with too much coffe

- [Brainstorming](./docs/brainstorming.md)


## Technologies

- [A-Frame JS](https://aframe.io/)  
   Web VR library  
   - [Experiment with AR and A-Frame](https://aframe.io/blog/webxr-ar-module/)
   - [Image Tracking and Location-Based AR with A-Frame and AR.js 3](https://aframe.io/blog/arjs3/)

- [nginx](https://www.nginx.com/)  
  Web server  

- [Docker](https://www.docker.com/)  
  For hosting the web app anywhere

- [OAuth2 proxy](https://github.com/oauth2-proxy/oauth2-proxy)  
  A reverse proxy and static file server that provides authentication using Providers (Google, GitHub, and others) to validate accounts by email, domain or group.   
  We use it as a proxy container in front of the app container to simplify integration with an Azure AD app.

- [Omnia Radix](https://www.radix.equinor.com/)  
   CICD and hosting


### CICD

- nodejs

- [webpack](https://webpack.js.org/guides/)  
  Build and bundle the web components of the app

- [Docker](https://www.docker.com/)  
  We use a multistage dockerfile to build the images.  
  `docker-compose` is used for development purposes only.

- [Omnia Radix](https://www.radix.equinor.com/)  
  CICD and hosting in the [playground](https://console.playground.radix.equinor.com/) environment.  
  Radix configuration is mainly handled in [`radixconfiguration.yaml`](../radixconfiguration.yaml)


## Components

- **frontend**  
  A pure client side app that handle all business logic. nginx acts as a backend in that it serves the inital js/css/html to the client.  
  All traffic is routed through the `auth-proxy` component.

- **auth-proxy**  
  Main entry point for the app.  
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


## Development

The [`./docker-compose.yaml`](./docker-compose.yaml) contains everything we need to run a development environment.

### Start

You will want to use 2-3 terminal sessions for this as it is easier to see what is going on where.

#### _Session 1: Build and start the webpack container_  

If you are using WSL then this session should be in windows `cmd`
```sh
docker-compose up --build
```

#### _Session 2: Run commands inside the webpack container_  

```sh
# Open a bash session into the webpack container
docker exec -it eit-web-ar-development_container bash

# From inside the container you can then run any npm command.
# First install all packages. You can later skip this step as long as docker volume "eit-web-ar_node-modules" still exist.
npm install
# Then start the webpack-dev-server
npm run start
```
You should now be able to access the webpack server from the host at https://localhost:3000/  
Please note that webpack is serving selfsigned tls cert as `https` is required for browsers to handle `WebXR`.  
See `webpack.config.js`  
```
   devServer: {
      contentBase: "./dist",
      port: 3000,
      https: true // true for self-signed, object for cert authority
   },
```

#### _Session 3: Access the files in host_  

```sh
# Bring up your IDE and start hacking away. 
# Please note that template files will not be hot reloaded, see "Notes" down below
code .

# Run git commands etc
git status
```

### Stop

Stop and remove all started containers and networks

```sh
docker-compose down
```

If you want to clean out `node-modules` as well then add option `-v` to make docker delete the volume

```sh
docker-compose down -v
```


### Notes

#### Template files are not hot reloaded

This is a bug in `webpack-dev-server`, and hopefully it will be resolved in the next major versions.  
See [git issue 1271](https://github.com/webpack/webpack-dev-server/issues/1271)

#### Exposing webpack-dev-server

To make the webpack-dev-server accessible outside the container then you must set the `--host` option when starting the server.  

Example `package.json`:
```js
{
   ...
   "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "watch": "webpack --watch",
      "start": "webpack-dev-server --mode development --open --hot --host 0.0.0.0",
      "build": "webpack"
   }
}
```

#### WebXR, tls and webpack

The webpack development server can provide self-signed certs using a simple boolean toggle in the config.

Example `webpack.config.js`:
```js
{
   ...
   devServer: {
      ...
      https: true // true for self-signed, object for cert authority
   },
   ...
}
```

#### npm scripts

Remember that your nodejs development environment is in the context of the docker container. To be able to successfully run npm scripts like `eslint` then you must run them in context of the docker container. If you try to call on scripts outside the container, even if the files are shared by mounting, will most likely fail and npm will complain that it cannot find the resources.  

Example:  
I want to eslint to watch changes so can can track of any errors while working in vs code.  
I have added the script `"lint:watch": "esw -w src"` to `package.json`.  
The solution is to  
1. open a terminal in vscode, 
1. open a bash session in the container `docker exec -it eit-web-ar-development_container bash`
1. and in this session I can then run the npm script `npm run lint:watch`
Now I can code and watch changes at the same time.


### Starting from scratch

Say you want to start a new nodejs project and build up `package.js` and `webpack.config.js` from scratch.  

All you have to do is to remove those files from this demo and simply start building them using the tools availble in the eit-web-ar-development_container.

```sh
# Open a bash session into the webpack container
docker exec -it eit-web-ar-development_container bash

# From inside the container you can then run any npm command.
npm init
npm install --save-dev webpack webpack-cli webpack-dev-server
```


## Build and run release image

The [`./Dockerfile`](./Dockerfile) is a multistage build that will produce a minimal release image.  
Please note that webpack is set to development mode in this demo. You should add your own configuration for webpack production mode (mine tend to differ from project to project).


```sh
docker build -t eit-web-ar-release .
docker run -it --rm -p 3000:80 --name eit-web-ar-release eit-web-ar-release
# You should now be able to access the web app from the host computer at http://localhost:3000/
# Note that https is not available as there is no tls cert. Cert termination will be handled automatically by the host loadbalancer, in our case Radix.

# Inspect contents
docker exec -it eit-web-ar-release sh
```
