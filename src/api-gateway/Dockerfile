FROM node:20-alpine

WORKDIR /src

COPY . .

RUN yarn install

EXPOSE 5000

CMD ["yarn", "run", "start:dev"]