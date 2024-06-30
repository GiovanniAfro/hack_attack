# Calm Space

Welcome to the Calm Space project!

## Prerequisites

Make sure you have the following installed on your machine:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [npm](https://www.npmjs.com/get-npm)

## Before Running

Navigate to the frontend directory and install the necessary npm packages:

```
cd calm-space/FE && npm install
```

## Starting the containers
```
docker-compose up --build
```
## Try the demo
>http://localhost:5173

## Make api calls
>http://127.0.0.1:5000

## Stopping the containers
```
docker-compose down
```

## Handling Laravel Permissions Errors
```
sudo chown -R $(whoami):www-data backend/storage backend/bootstrap/cache
```
```
sudo chmod -R 775 backend/storage backend/bootstrap/cache
```

## Deleting All Images
```
docker-compose down --rmi all
```

