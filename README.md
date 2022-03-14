# Sheefoo Backend code
Backend code for sheefoo project, note that this contains code for all backend microservices. Therefore, make sure to npm i in all sub repositories. 

Since we are using docker-compose, run the following command, to test if the change actually works: `docker-compose up --build --force-recreate --no-deps  `

Dev commands:
Command to run mongodb server locally
`docker run -d --name authentication-db -v ~/mongo/data:/data/db -p 27017:27017 mongo:latest`