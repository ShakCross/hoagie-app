#!/bin/bash

# Set default IP address (will be updated by setup-expo.sh)
IP_ADDRESS="192.168.100.206"

# Check if IP was manually provided
if [ "$1" != "" ]; then
  IP_ADDRESS="$1"
  echo "Using provided IP address: $IP_ADDRESS"
fi

# Function to check if MongoDB is running
check_mongodb() {
  echo "Checking if MongoDB is available..."
  
  # Try to connect to MongoDB
  if command -v nc >/dev/null 2>&1; then
    if nc -z localhost 27017 2>/dev/null; then
      echo "MongoDB is available at localhost:27017"
      return 0
    fi
  fi
  
  # If netcat isn't available or connection failed
  echo "MongoDB is not available at localhost:27017. Starting Docker services..."
  return 1
}

# Function to check if backend is running
check_backend() {
  echo "Checking if backend is available..."
  
  # Try to connect to the backend
  if curl -s http://localhost:3000/api > /dev/null; then
    echo "Backend is available at http://localhost:3000/api"
    return 0
  else
    echo "Backend is not available at http://localhost:3000/api. Starting Docker services..."
    return 1
  fi
}

# Stop any running containers
echo "Checking for running containers..."
if docker-compose ps | grep -q "running"; then
  echo "Stopping running containers..."
  docker-compose down
fi

# Check if MongoDB and backend are already running locally
if ! check_mongodb || ! check_backend; then
  # Start MongoDB and Backend containers
  echo "Starting MongoDB and Backend services via Docker..."
  docker-compose up -d mongodb backend
  
  # Wait for backend to be ready
  echo "Waiting for backend to be ready..."
  attempts=0
  max_attempts=30
  
  while [ $attempts -lt $max_attempts ]; do
    if curl -s http://localhost:3000/api > /dev/null; then
      echo "Backend is now available!"
      break
    fi
    
    attempts=$((attempts + 1))
    echo "Waiting for backend to start... ($attempts/$max_attempts)"
    sleep 2
  done
  
  if [ $attempts -eq $max_attempts ]; then
    echo "Error: Backend did not start within the expected time."
    echo "Please check the logs with: docker-compose logs backend"
    exit 1
  fi
else
  echo "Using existing MongoDB and backend services."
fi

# Change to the frontend directory
cd frontend || { echo "Error: frontend directory not found"; exit 1; }

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install || { echo "Error: Failed to install dependencies"; exit 1; }
fi

# Set up environment if needed
if [ ! -f ".env" ]; then
  echo "Creating .env file..."
  cp .env.example .env || { echo "Error: Failed to create .env file"; exit 1; }
  # Update the IP in the .env file
  sed -i "s|EXPO_PUBLIC_API_URL=http://.*:3000/api|EXPO_PUBLIC_API_URL=http://$IP_ADDRESS:3000/api|g" .env
fi

# Start Expo directly on the host machine with explicit IP
echo "Starting Expo development server..."
echo "Using IP address: $IP_ADDRESS"
# Use explicit IP address to make QR code work on local network
EXPO_DEVTOOLS_LISTEN_ADDRESS="0.0.0.0" REACT_NATIVE_PACKAGER_HOSTNAME="$IP_ADDRESS" npx expo start --clear

# Handle cleanup on script exit
cleanup() {
  echo "Shutting down services..."
  cd ..
  docker-compose down
}

# Register the cleanup function for when the script exits 