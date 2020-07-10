FROM node:dubnium-alpine as builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN NODE_ENV=development npm ci

COPY .env .babelrc.json ./
COPY src/ ./src/
COPY public/ ./public/

RUN npm run build


FROM node:dubnium-alpine

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY .env .babelrc.json ./
COPY src/lib/ ./src/lib/
COPY src/server/ ./src/server/
COPY --from=builder /app/build/ ./build

ENV NODE_ENV=development

CMD ["npm", "run", "start"]
