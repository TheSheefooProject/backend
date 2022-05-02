FROM node:14-alpine as base
# Setup the alpine image
RUN apk add --no-cache git
WORKDIR /usr/app

# Setup the node enviroment varibales
#TODO! FIGURE OUT WHAT TO DO FOR THE REMAINING ENVIROMENT VARIABLES
ENV NODE_ENV='PRODUCTION'
ENV NODE_PORT=3001
EXPOSE 3001

# Install the production dependancies
COPY ./package.json ./
RUN npm install --only=prod

# App source
COPY . .

# Create the run build 
RUN npm run build:ts

CMD ["node", "dist/src/server.js"]