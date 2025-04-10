FROM node:18-alpine

WORKDIR /usr/src/app

# Install global expo-cli
RUN npm install -g expo-cli

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose Expo and Metro ports
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002
EXPOSE 8081

# Start the Expo development server with host options
CMD ["npx", "expo", "start", "--no-dev-client", "--host"] 