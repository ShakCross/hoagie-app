#!/bin/bash

# Script to help set up the environment for Expo development
# This script updates the necessary configuration files with your local IP address

# Function to detect the local IP address
get_local_ip() {
    # Try to get the IP address in a cross-platform way
    if command -v ip >/dev/null 2>&1; then
        # Linux with ip command
        IP=$(ip route get 1 | sed -n 's/^.*src \([0-9.]*\) .*$/\1/p')
    elif command -v ifconfig >/dev/null 2>&1; then
        # macOS or Linux with ifconfig
        IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)
    elif command -v ipconfig >/dev/null 2>&1; then
        # Windows
        IP=$(ipconfig | grep -i "IPv4 Address" | head -n 1 | awk '{print $NF}' | tr -d '\r')
    else
        echo "Could not automatically detect your local IP address."
        return 1
    fi

    if [ -z "$IP" ]; then
        echo "Could not detect your local IP address."
        return 1
    fi

    echo "$IP"
}

# Main script logic
echo "Hoagie App - Expo Development Setup"
echo "==================================="
echo ""

# Try to detect local IP automatically
IP=$(get_local_ip)
if [ $? -ne 0 ]; then
    # If automatic detection failed, ask the user
    echo "Please enter your local IP address (e.g., 192.168.1.10):"
    read IP
fi

echo "Using IP address: $IP"
echo ""

# Create frontend .env file if it doesn't exist
if [ ! -f frontend/.env ]; then
    if [ -f frontend/.env.example ]; then
        echo "Creating frontend/.env from example..."
        cp frontend/.env.example frontend/.env
    else
        echo "Creating new frontend/.env file..."
        echo "# Expo API URL Configuration" > frontend/.env
        echo "EXPO_PUBLIC_API_URL=http://$IP:3000/api" >> frontend/.env
    fi
else
    echo "frontend/.env already exists"
fi

# Update the frontend .env file with the correct IP
echo "Updating frontend/.env with your IP address..."
sed -i "s|EXPO_PUBLIC_API_URL=http://.*:3000/api|EXPO_PUBLIC_API_URL=http://$IP:3000/api|g" frontend/.env

# Update the start-expo-dev.sh script with the correct IP
if [ -f start-expo-dev.sh ]; then
    echo "Updating start-expo-dev.sh with your IP address..."
    sed -i "s|REACT_NATIVE_PACKAGER_HOSTNAME=\".*\"|REACT_NATIVE_PACKAGER_HOSTNAME=\"$IP\"|g" start-expo-dev.sh
fi

# Update docker-compose.yml with the correct IP
if [ -f docker-compose.yml ]; then
    echo "Updating docker-compose.yml with your IP address..."
    sed -i "s|REACT_NATIVE_PACKAGER_HOSTNAME=.*|REACT_NATIVE_PACKAGER_HOSTNAME=$IP|g" docker-compose.yml
    sed -i "s|EXPO_MANIFEST_HOST=.*|EXPO_MANIFEST_HOST=$IP|g" docker-compose.yml
    sed -i "s|EXPO_PACKAGER_PROXY_URL=http://.*|EXPO_PACKAGER_PROXY_URL=http://$IP|g" docker-compose.yml
fi

echo ""
echo "Setup complete! Your local environment has been configured with IP: $IP"
echo ""
echo "Next steps:"
echo "1. Start the backend with: cd backend && npm run start:dev"
echo "2. Start the frontend with: cd frontend && npm start"
echo ""
echo "If you're using Docker:"
echo "Run: docker-compose up"
echo ""
echo "Happy coding!"

# Make the script executable
chmod +x ./start-expo-dev.sh 2>/dev/null

exit 0 