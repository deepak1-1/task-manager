
FROM node:20.10-alpine as build

WORKDIR /app

COPY package*.json yarn.lock ./
RUN yarn --production

COPY . .

CMD ["yarn", "start"]