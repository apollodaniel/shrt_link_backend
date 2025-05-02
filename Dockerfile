FROM node:22.10-alpine AS builder

WORKDIR /build

COPY . .
RUN yarn install
RUN yarn build

FROM node:22.10-alpine

WORKDIR /app

COPY --from=builder /build/dist/ .
COPY --from=builder /build/package.json .

RUN yarn install

EXPOSE 8080

CMD [ "node", "index.js" ]
