# Storage

Storage is a simple redis container with no file storage or backup.

## Docs

### Official

- [docker/redis](https://hub.docker.com/_/redis/)


## Security

- Storage credentials  
  The env var `REDIS_PASSWORD` must be set storage container  
  - Development configuration, set the env var when starting the container
  - Production configuration, set as secret `REDIS_PASSWORD` for component `storage` in Radix


## Build and run production image

Read the file [`dockerfile.storage`](./dockerfile.storage) for configuration details.

```sh
docker build -t redis -f dockerfile.storage .
docker run -it -e REDIS_PASSWORD=<insert-your-password> --name redis redis
```