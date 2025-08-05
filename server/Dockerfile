# Stage 1: Build the TypeScript app
FROM node:20.15.1-alpine AS builder

WORKDIR /build

# Copy package files and install dependencies
COPY package*.json tsconfig.json ./
RUN npm install

# Copy source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm prune --omit=dev

# Stage 2: Run the built app
FROM node:20.15.1-alpine AS runner

WORKDIR /app

# Copy only production files
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/package*.json ./
COPY --from=builder /build/node_modules ./node_modules

# Set NODE_ENV for production
ENV NODE_ENV=production

# Expose backend port
EXPOSE 3000

# Start the built app (not dev mode)
CMD ["node", "dist/src/server.js"]