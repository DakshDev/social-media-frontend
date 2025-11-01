# Build
FROM node:18 AS builder

WORKDIR /app/
COPY package*.json .
RUN npm ci
RUN npm run build

# Runner
FROM node:18-alpine AS runner

WORKDIR /app/
COPY --from=builder /app/build /build
COPY --from=builder /app/node_modules /node_modules
COPY --from=builder /app/package*.json .

ENV PORT=10000
EXPOSE 10000

RUN npm start