# --------------------------
# 1. Base Builder Image
# --------------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --------------------------
# 2. Production Runner Image
# --------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./next.config.ts

# Set environment
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000


CMD ["npm", "start"]