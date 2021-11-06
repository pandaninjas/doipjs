FROM node:14-alpine
WORKDIR /app
COPY . .
RUN yarn --production --pure-lockfile
EXPOSE 3000
CMD yarn run proxy