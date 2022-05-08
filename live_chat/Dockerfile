FROM node:14-alpine as base
# Setup the alpine image
RUN apk add --no-cache git
WORKDIR /usr/app

# Setup the node enviroment variables
ENV NODE_ENV='PRODUCTION'
ENV NODE_PORT=3005
EXPOSE 3005

# Install the production dependancies
COPY ./package.json ./
RUN npm install --only=prod

# App source
COPY . .

CMD ["node", "server.js"]