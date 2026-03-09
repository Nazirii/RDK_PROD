FROM node:22-alpine
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of your Express code
COPY . .

# Expose the port your Express app uses (e.g., 5000)
EXPOSE 5000

# Start the Express server
CMD ["node", "src/server.js"]