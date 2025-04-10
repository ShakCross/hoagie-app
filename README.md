# Hoagie App

A full-stack mobile application for creating and sharing hoagie recipes, built with a delicious McDonald's-inspired UI theme.

## Features

- User authentication
- Create, read, update, and delete hoagie recipes
- Browse recipes created by other users
- Add collaborators to recipes
- Comment on recipes
- Mobile-optimized UI with consistent McDonald's-themed styling

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: NestJS
- **Database**: MongoDB
- **Containerization**: Docker
- **UI Components**: Custom McDonald's-themed components

## Project Structure

- `/frontend`: React Native Expo application
- `/backend`: NestJS API server
- `/docker-compose.yml`: Docker configuration for local development
- `/frontend/src/theme`: Global theme constants (colors, typography, spacing)
- `/frontend/src/components/ui`: Reusable UI components with consistent styling

## Prerequisites

- Node.js 18.x or higher
- npm 8.x or higher
- Docker and Docker Compose (optional, for containerized setup)
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (for testing on physical devices)

## Environment Setup

Both the frontend and backend require environment variables to be configured properly:

### Frontend Environment Setup

The frontend needs to know where to find the backend API:

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Create a `.env` file by copying the example:
   ```bash
   npm run prepare-env
   ```
   Or manually:
   ```bash
   cp .env.example .env
   ```

3. Edit the `.env` file and update the `EXPO_PUBLIC_API_URL` with your local IP address:
   ```
   # For development on physical devices (Expo Go)
   EXPO_PUBLIC_API_URL=http://192.168.x.x:3000/api
   
   # For web development
   # EXPO_PUBLIC_API_URL=http://localhost:3000/api
   ```

   > **IMPORTANT**: Replace `192.168.x.x` with your actual local IP address. You can find this by running `ipconfig` on Windows or `ifconfig` on macOS/Linux.

### Backend Environment Setup

The backend needs configuration for MongoDB and test user credentials:

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a `.env` file by copying the example:
   ```bash
   npm run prepare-env
   ```
   Or manually:
   ```bash
   cp .env.example .env
   ```

3. Edit the `.env` file as needed:
   ```
   # Node Environment Configuration
   NODE_ENV=development
   
   # Server Port Configuration
   PORT=3000
   
   # MongoDB Connection String
   # For local MongoDB: mongodb://localhost:27017/hoagie-app
   # For Docker: mongodb://mongodb:27017/hoagie-app
   MONGODB_URI=mongodb://localhost:27017/hoagie-app
   
   # Test User Configuration
   TEST_USER_EMAIL=test@example.com
   TEST_USER_PASSWORD=test123
   TEST_USER_NAME=Test User
   ```

## Installation and Setup

### Option 1: Using Docker (Recommended for Development)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hoagie-app.git
   cd hoagie-app
   ```

2. Set up environment variables as described in the Environment Setup section.

3. Update your local IP in Docker Compose configuration:
   Edit `docker-compose.yml` and update `REACT_NATIVE_PACKAGER_HOSTNAME`, `EXPO_MANIFEST_HOST`, and `EXPO_PACKAGER_PROXY_URL` with your local IP address.

4. Start all services:
   ```bash
   docker-compose up
   ```

   Or use the provided script (which will only start MongoDB and backend, and run the frontend on your host machine):
   ```bash
   ./start-expo-dev.sh
   ```

### Option 2: Manual Setup

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the environment variables as described earlier.

4. Start the backend service:
   ```bash
   npm run start:dev
   ```

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the environment variables as described earlier.

4. Start the Expo development server:
   ```bash
   npm start
   ```

## Running the App

### On a Physical Mobile Device (Using Expo Go)

1. Make sure your mobile device is on the same Wi-Fi network as your development machine.

2. Ensure you've set the correct IP address in your frontend `.env` file:
   ```
   EXPO_PUBLIC_API_URL=http://192.168.x.x:3000/api
   ```

3. Start the backend:
   ```bash
   cd backend
   npm run start:dev
   ```

4. Start the frontend:
   ```bash
   cd frontend
   npm start
   ```

5. Scan the QR code displayed in the terminal with your phone:
   - **iOS**: Use the Camera app
   - **Android**: Use the Expo Go app

6. The app should load on your device. If you see connection errors, double-check your IP address in the `.env` file.

### In a Web Browser

1. Set your frontend `.env` file to use localhost:
   ```
   EXPO_PUBLIC_API_URL=http://localhost:3000/api
   ```

2. Start the backend:
   ```bash
   cd backend
   npm run start:dev
   ```

3. Start the frontend with web support:
   ```bash
   cd frontend
   npm run web
   ```

4. The application should automatically open in your default browser at http://localhost:19006.

### Using Expo Development Build (Advanced)

For a more native-like development experience, you can create a development build:

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Build a development client:
   ```bash
   cd frontend
   eas build --profile development --platform android
   # or
   eas build --profile development --platform ios
   ```

3. Follow the prompts and instructions from EAS.

## Accessing the App

### Test Account

A test account is automatically created and maintained:
- Email: test@example.com
- Password: test123

You can use this account to log in and test the application without creating a new account.

### API Documentation

API documentation is available at `http://localhost:3000/api` when the backend is running.

## Mobile App Screens

- **Login/Registration**: User authentication
- **Hoagie List**: Browse all hoagies with pagination
- **My Hoagies**: View hoagies created by the logged-in user
- **Hoagie Details**: View recipe details, comments, and collaborators
- **Create/Edit Hoagie**: Form to create or edit a hoagie recipe
- **User Profile**: User information and settings

## Contributing to the Project

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add some feature'` 
5. Push to the branch: `git push origin feature/your-feature-name`
6. Create a Pull Request

## Preparing for GitHub

Before pushing your code to GitHub:

1. Make sure you've updated all `.env.example` files with necessary variables but WITHOUT any real credentials
2. Check that `.env` files are in the `.gitignore` to avoid committing real credentials
3. Update the repository URL in package.json files:
   - In `frontend/package.json`
   - In `backend/package.json`

## Troubleshooting

### Common Issues

1. **Backend Connection Issues**
   - Ensure MongoDB is running
   - Check `.env` files for correct configuration
   - Verify network settings if using Docker

2. **Expo Connection Issues**
   - Ensure the correct IP address is set in the Expo configuration
   - Check if your device and development machine are on the same network
   - If you see "Network response timed out" in Expo Go, check your IP address in `.env`

3. **Docker Issues**
   - Run `docker-compose down -v` to reset all containers and volumes
   - Try rebuilding with `docker-compose build --no-cache`

4. **UI Display Issues**
   - If text appears cut off or buttons are hard to press, report the issue with a screenshot
   - For older Android devices, try setting `enableExperimentalWebImplementation: false` in app.json

## Project Architecture

![Architecture Diagram](docs/architecture.png)

The application follows a three-tier architecture:
1. **Frontend**: React Native mobile app with Expo
2. **Backend**: NestJS RESTful API
3. **Database**: MongoDB for data persistence

## License

This project is licensed under the MIT License - see the LICENSE file for details. 