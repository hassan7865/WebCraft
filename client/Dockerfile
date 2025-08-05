# Stage 1: Build the Vite project
FROM node:20.15.1-alpine AS builder

WORKDIR /app

# Install dependencies first for better caching
COPY package.json package-lock.json ./
RUN npm install --force

# Copy the rest of the files and build
COPY . .
RUN npm run build

# Stage 2: Serve the production build
FROM node:20.15.1-alpine AS runner

WORKDIR /app

# Install serve globally (better for Railway)
RUN npm install -g serve

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Railway will provide PORT environment variable
ENV PORT=8080
EXPOSE $PORT

# Health check endpoint (recommended for Railway)
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:$PORT || exit 1

# Start the server (Railway will inject PORT automatically)
CMD ["sh", "-c", "serve -s dist -l $PORT"]