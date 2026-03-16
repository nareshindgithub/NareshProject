# Stage 1: Build & Dependencies
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install ALL dependencies (including those needed for build/tests)
RUN npm install

# Copy the rest of the application source code
COPY . .

# Optional: Build step if using TypeScript or a bundler
# RUN npm run build

# Stage 2: Final Production Image
FROM node:20-alpine

WORKDIR /app

# Copy only production dependencies from the builder stage
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy the built application/source from the builder stage
# If you have a build step, copy only the 'dist' folder instead
COPY --from=builder /app .

# Use a non-root user for better security
USER node

# Expose the application port (matching docker-compose)
EXPOSE 3000

# Start the application directly (avoids npm overhead and signal issues)
CMD ["node", "index.js"]