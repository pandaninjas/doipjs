FROM node:14

RUN mkdir /app
WORKDIR /app

COPY package.json /app
COPY yarn.lock /app

RUN yarn --production --pure-lockfile

COPY . /app

EXPOSE 3000
CMD yarn run proxy
