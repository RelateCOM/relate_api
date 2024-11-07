FROM node:21-alpine3.19

WORKDIR /app

COPY . .

RUN npm install -g npm@latest

RUN yarn install

EXPOSE 3002

CMD ["yarn", "start:dev"]