FROM node:23-alpine3.19

WORKDIR /app

COPY . .

RUN yarn

EXPOSE 3002

CMD ["yarn", "start:dev"]