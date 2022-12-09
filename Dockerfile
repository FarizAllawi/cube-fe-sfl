#Install dependencies only when needed
FROM node:16.17.0 
# RUN apk add --no-cache libc6-compat
WORKDIR /app

# copy source files
COPY package*.json ./

# install dependencies
RUN npm install
COPY . .

# start app
EXPOSE 3001
CMD [ "node", "server.js" ]