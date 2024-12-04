FROM node:23-alpine3.19

WORKDIR /app

COPY . .

RUN yarn

EXPOSE 3003

CMD ["yarn", "start:dev"]