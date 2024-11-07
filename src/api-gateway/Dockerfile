FROM node:21-alpine3.19

WORKDIR /app

COPY . .

RUN npm install -g npm@latest

RUN yarn install

EXPOSE 3000

CMD ["yarn", "start:dev"]