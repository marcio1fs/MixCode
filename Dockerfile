# Multi-stage build for MixCode AI Assisted IDE

# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY vite.config.ts ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Python backend
FROM python:3.11-slim AS backend

WORKDIR /app

# Copy Python requirements
COPY apps/ai-services/requirements.txt ./requirements.txt

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy Python services
COPY apps/ai-services ./ai-services
COPY plugins/mix-muse ./plugins/mix-muse

# Stage 3: Production image
FROM nginx:alpine

# Copy built frontend
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy Python backend
COPY --from=backend /app /app/backend

# Install Python runtime
RUN apk add --no-cache python3 py3-pip

# Install Python dependencies
COPY --from=backend /app/requirements.txt /app/backend/requirements.txt
RUN pip3 install --no-cache-dir -r /app/backend/requirements.txt

# Create startup script
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'cd /app/backend && python3 main.py &' >> /start.sh && \
    echo 'nginx -g "daemon off;"' >> /start.sh && \
    chmod +x /start.sh

EXPOSE 80 8000

CMD ["/start.sh"] 