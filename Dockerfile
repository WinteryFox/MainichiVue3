FROM node:15.5.1-alpine3.10 AS build
RUN apk add --no-cache --virtual .gyp python make g++
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM alpine:3.12.3
COPY --from=build /app/dist /var/www/html
