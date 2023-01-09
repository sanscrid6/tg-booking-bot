FROM node:16
WORKDIR /app

COPY package*.json ./
RUN yarn install --prod

COPY . .
