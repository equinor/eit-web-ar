# Frontend

## Docs

- [How to set up an easy and secure reverse proxy with Docker, Nginx & Letsencrypt](https://www.freecodecamp.org/news/docker-nginx-letsencrypt-easy-secure-reverse-proxy-40165ba3aee2/)


## Development

The [./docker-compose.yaml](./docker-compose.yaml) contains everything we need to run a development environment.  
Note that only the `frontend` component will be a development container, the rest will run production builds based on their respective dockerfiles.

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
docker exec -it frontend_development bash
```


## Build and run production image

Read the file [`dockerfile.frontend`](./dockerfile.frontend) for configuration details.

```sh
docker build -t frontend -f dockerfile.frontend .
docker run -it --name frontend frontend
```