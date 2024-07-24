FROM node:20.10-alpine as build

WORKDIR /app

COPY package*.json yarn.lock ./
RUN yarn

ARG SERVER_BASE_URL
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG ENV

ENV REACT_APP_SERVER_BASE_URL=${SERVER_BASE_URL}
ENV REACT_APP_GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ENV REACT_APP_GGOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
ENV REACT_APP_ENV=${ENV}

COPY . .
RUN yarn build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
