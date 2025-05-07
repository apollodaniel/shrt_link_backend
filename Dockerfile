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

RUN apk update && apk add bash busybox-extras

ENV POSTGRES_HOST=db
ENV POSTGRES_PORT=5432

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]

CMD ["node", "index.js"]
