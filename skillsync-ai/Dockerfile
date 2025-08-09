# Use a Node.js base image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./ 

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

# Copy necessary files from the builder stage
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Expose the port Next.js runs on
EXPOSE 3000

# Set environment variable for API URL (will be overridden by docker-compose)
ENV NEXT_PUBLIC_API_URL=https://effective-invention-xq9p955q6wwhpx9j-7800.app.github.dev

# Start the Next.js application
CMD ["npm", "start"]
