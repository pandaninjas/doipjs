FROM node:16-alpine
WORKDIR /app
COPY . .
RUN yarn --production --pure-lockfile
EXPOSE 3000
CMD yarn run proxy