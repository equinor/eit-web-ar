# Frontend

## Docs

### Tutorials, guides and other googly stuff

- [How to set up an easy and secure reverse proxy with Docker, Nginx & Letsencrypt](https://www.freecodecamp.org/news/docker-nginx-letsencrypt-easy-secure-reverse-proxy-40165ba3aee2/)


## Development

The [./docker-compose.yaml](./docker-compose.yaml) contains everything we need to run a development environment.  
Note that only the `frontend` component will be a development container, the rest will run production builds based on their respective dockerfiles.

Make sure the shared `.env` file is available in your local repo, see [../README/Storage credentials in shared .env file](../README.md#storage-credentials-in-shared-env-file)

### Start

You will want to use 2-3 terminal sessions for this as it is easier to see what is going on where.

#### _Session 1: Build and start the webpack container_

```sh
docker-compose up --build
```
Note for WSL1: If you are using WSL1 then this session should be in windows `cmd` to avoid running into problems with mount paths

#### _Session 2: Run commands inside the webpack container_

```sh
# Open a bash session into the webpack container
docker exec -it frontend_development bash

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
1. open a bash session in the container `docker exec -it frontend_development bash`
1. and in this session I can then run the npm script `npm run lint:watch`
Now I can code and watch changes at the same time.


### Starting from scratch

Say you want to start a new nodejs project and build up `package.js` and `webpack.config.js` from scratch.

All you have to do is to remove those files from this demo and simply start building them using the tools availble in the frontend_development.

```sh
# Open a bash session into the webpack container
docker exec -it frontend_development bash

# From inside the container you can then run any npm command.
npm init
npm install --save-dev webpack webpack-cli webpack-dev-server
```


## Build and run release image

The [`./dockerfile.frontend`](./dockerfile.frontend) is a multistage build that will produce a minimal release image.
Please note that webpack is set to development mode in this demo. You should add your own configuration for webpack production mode (mine tend to differ from project to project).


```sh
docker build -t frontend -f dockerfile.frontend .
docker run -it --rm -p 3000:8080 --name frontend frontend

# You should now be able to access the web app from the host computer at http://localhost:3000/
# Note that https is not available as there is no tls cert. Cert termination will be handled automatically by the host loadbalancer, in our case Radix.

# Inspect contents
docker exec -it frontend sh
```