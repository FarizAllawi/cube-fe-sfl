#Install dependencies only when needed
FROM node:16.17.0 
# RUN apk add --no-cache libc6-compat
WORKDIR /app

# Dockerfile

# create & set working directory
RUN mkdir -p /app
WORKDIR /app

# copy source files
COPY . /app

# install dependencies
RUN npm install

# start app
RUN npm run build
EXPOSE 3000
CMD npm run start