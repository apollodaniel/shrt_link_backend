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

ENV DOCKERIZE_VERSION v0.9.3

RUN apk update --no-cache \
	&& apk add --no-cache wget openssl bash \
	&& wget -O - https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz | tar xzf - -C /usr/local/bin \
	&& apk del wget

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]

CMD ["/bin/sh", "-c", "dockerize -wait tcp://$POSTGRES_HOST:$POSTGRES_PORT node index.js"]
