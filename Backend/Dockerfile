# ==========================================================
# RAGify Backend - Production Dockerfile
# ==========================================================

FROM node:22-alpine

# Application working directory
WORKDIR /app

# Use the same npm version as local development
RUN npm install -g npm@11.6.4

# Copy dependency files first
COPY package.json package-lock.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy backend source code
COPY . .

# Render uses PORT environment variable
EXPOSE 5000

# Start application
CMD ["npm", "start"]