# Use an official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (Optimize Docker caching)
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev
RUN npm install typescript

# Copy only required source files (ignoring unnecessary folders)
COPY . .

# Ensure TypeScript is built (if applicable)
RUN npx tsc

# Expose the application port
EXPOSE 5041

# Set environment variables for Logstash
ENV LOGSTASH_HOST=logstash
ENV LOGSTASH_PORT=5000

# Start the application
CMD ["npm", "start"]
