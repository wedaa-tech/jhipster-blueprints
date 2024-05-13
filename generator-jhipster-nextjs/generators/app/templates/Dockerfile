FROM node:18-alpine as base
RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci
EXPOSE <%= serverPort %>
ENV PORT <%= serverPort %>

FROM base as builder
WORKDIR /app
COPY . .
RUN npm run build


FROM base as production
WORKDIR /app
COPY . .
RUN npm run build

ENV NODE_ENV=production


RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

CMD npm start
