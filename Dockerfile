FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn run build

FROM node:20-alpine AS production
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

# El comando para iniciar la aplicación
CMD ["node", "dist/main.js"]