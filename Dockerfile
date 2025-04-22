FROM --platform=linux/amd64 node:lts
WORKDIR /usr/src/app
COPY . .
EXPOSE 3000
RUN yarn install 
RUN yarn build
CMD yarn knex migrate:latest &&\
    yarn start