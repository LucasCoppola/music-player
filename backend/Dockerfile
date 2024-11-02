# Build enviroment  
FROM node:18 AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Production enviroment
FROM node:18
WORKDIR /app

RUN apt-get update && apt-get install -y ffmpeg

COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public
COPY --from=build /app/package.json .
COPY --from=build /app/package-lock.json .

RUN npm ci --omit=dev

EXPOSE 8080

CMD ["npm", "run", "start:prod"]
