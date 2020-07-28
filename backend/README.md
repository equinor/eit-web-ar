# Backend

A nodejs server running express to expose a REST api.  
Dependent on component [`storage`](../storage/) for, well, data storage.


## Docs

### For the developer

- [Notes](./notes.md)

### Official

- [ExpressJS routing guide](https://expressjs.com/en/guide/routing.html)
  - Note the paragraph `Response methods`, especially the use of `res.json()` to avoid unecessary transformations
- [ExpressJS cors middelware](https://expressjs.com/en/resources/middleware/cors.html)

### Tutorials, guides and other googly stuff

- [node and redis via docker](https://www.hamrodev.com/en/tutorials/node-and-redis-via-docker)
- [nodejs and express example from workshop `A Hands-On Introduction to modern web based A&A`](https://github.com/larskaare/WebAuthAuthorAndOtherCreatures/tree/master/ex-8/api)
- [HTTP status codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)


## Security

- Backend has no public endpoint in production, it is only available inside the same namespace
- Storage credentials  
  The env var `REDIS_PASSWORD` must be set both in backend and storage container  
  - Development configuration, see below
  - Production configuration, set as secret `REDIS_PASSWORD` for both backend and storage container in Radix


## Development

The [./docker-compose.yaml](./docker-compose.yaml) contains everything we need to run a development environment.  
Note that only the `backend` component will be a development container, the rest will run production builds based on their respective dockerfiles.

Make sure the shared `.env` file is available in your local repo, see [../README/Storage credentials in shared .env file](../README.md#storage-credentials-in-shared-env-file)

### Storage credentials in shared .env file

We make use of [docker-compose `.env` file](https://docs.docker.com/compose/environment-variables/#the-env-file) to insert credentials as environment variables in the storage and backend container.  

1. Simply create your own `.env` file in root of repo 
2. and add variables in key=value format
   ```sh
   REDIS_PASSWORD=<insert-your-password>
   ```

Make sure `.env` is gitignored!

### Build and run development environment

```sh
docker-compose up --build
docker exec -it backend_development bash
```


## Build and run production image

Read the file [`dockerfile.backend`](./dockerfile.backend) for configuration details.

```sh
docker build -t backend -f dockerfile.backend .
docker run -it --name backend backend
```