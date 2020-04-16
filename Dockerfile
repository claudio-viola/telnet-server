FROM node:10.16.3-alpine

WORKDIR /src

RUN mkdir -p /src/node_modules  /src/dist
RUN chown -R node:node /src/node_modules /src/dist

COPY --chown=node:node package.json package-lock.json  /src/

RUN npm install

COPY --chown=node:node . /src

RUN npm run build

USER node

EXPOSE 10000
CMD npm run start
