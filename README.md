# Sheefoo Backend code

Backend code for sheefoo project, note that this contains code for all backend microservices. Therefore, make sure to npm i in all sub repositories.

Since we are using docker-compose, run the following command, to test if the change actually works: `docker-compose up --build --force-recreate --no-deps `

Dev commands:
Command to run mongodb authentication database locally
`docker run -d --name authentication-db -v ~/mongo/data:/data/db -p 27017:27017 mongo:latest`

Command to run posts db locally
`docker run -d --name posts-db -e POSTGRES_PASSWORD=password -e PGDATA=/var/lib/postgresql/data/pgdata -v /custom/mount:/var/lib/postgresql/data postgres `

<!-- needs localhost:port 5432  -> localhost:5432-->

Instead of running the whole command every 2nd time, should only need `docker run posts-db`
