# Build image
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci 
COPY . .
RUN npm run build \
    && npm prune --production

# Production image
FROM node:18-alpine
WORKDIR /app
RUN apk add --no-cache ffmpeg
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json .
EXPOSE 8080
CMD ["node", "dist/src/main"]
