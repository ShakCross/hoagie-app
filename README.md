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
- Docker and Docker Compose
- Expo Go app on your mobile device (for testing on physical devices)
- Expo account (create one at [expo.dev](https://expo.dev) if you don't have one)

## Project Setup - Step by Step

Follow these steps carefully to set up the Hoagie App for development:

### 1. Clone the Repository

```bash
git clone https://github.com/ShakCross/hoagie-app.git
cd hoagie-app
```

### 2. Set Up Backend Environment

```bash
# Navigate to the backend directory
cd backend

# Create environment file
cp .env.example .env

# Go back to the project root
cd ..
```

### 3. Set Up Frontend Environment

```bash
# Navigate to the frontend directory
cd frontend

# Create environment file
cp .env.example .env
```

Edit the `.env` file and update the `EXPO_PUBLIC_API_URL` with your local IP address:
```
EXPO_PUBLIC_API_URL=http://192.168.x.x:3000/api
```

> **IMPORTANT**: Replace `192.168.x.x` with your actual local IP address. You can find this by running `ipconfig` on Windows or `ifconfig` on macOS/Linux. This is required for testing on physical devices using Expo Go.

### 4. Update Docker Compose Configuration

Open `docker-compose.yml` and update the following environment variables under the `frontend` service with your local IP address:

```yaml
environment:
  - REACT_NATIVE_PACKAGER_HOSTNAME=192.168.x.x
  - EXPO_MANIFEST_HOST=192.168.x.x
  - EXPO_PACKAGER_PROXY_URL=http://192.168.x.x
```

Replace `192.168.x.x` with the same IP address you used in the frontend `.env` file.

### 5. Start the Backend Services

From the project root:

```bash
# Start MongoDB and the NestJS backend using Docker
docker-compose up -d mongodb backend

# Wait a few moments for the services to initialize
```

### 6. Start the Frontend

```bash
# Make sure you're in the frontend directory
cd frontend

# Install dependencies (first time only)
npm install

# Start the Expo development server
npx expo start
```

> **NOTE**: When running `npx expo start` for the first time, you will be prompted to log in with your Expo account credentials. If you don't have an Expo account yet, you'll need to create one at [expo.dev](https://expo.dev) before proceeding. This is a one-time step required by Expo.

### 7. Access the App

Once the Expo dev server starts, you'll see a QR code in your terminal:
- Scan it with your phone's camera (iOS) or Expo Go app (Android) to run on a mobile device
- Press 'w' to run in web browser
- Press 'a' to run on Android emulator
- Press 'i' to run on iOS simulator (macOS only)

### 8. Shutting Down

When you're done developing, stop the backend services:

```bash
# From the project root
docker-compose down
```

## Troubleshooting

### Common Issues

1. **Connection to Backend Fails**: Ensure your IP address is correctly set in both the frontend `.env` file and the `docker-compose.yml` file. This is especially important when testing on physical devices.

2. **MongoDB Connection Issues**: Check if MongoDB is running and accessible:
   ```bash
   docker-compose logs mongodb
   ```

3. **Backend Startup Fails**: Verify environment variables and MongoDB connection:
   ```bash
   docker-compose logs backend
   ```

4. **Expo CLI Errors**: If you see Expo-related errors, make sure you're using `npx expo start` without additional flags.

5. **Expo Authentication Issues**: If you're having trouble logging in to Expo, you can run `npx expo login` separately to authenticate or reset your password through the [Expo website](https://expo.dev).

6. **QR Code Not Working**: If the QR code doesn't connect properly, ensure all IP addresses in your configuration files (`docker-compose.yml` and frontend `.env`) match your actual local IP address.

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

## Project Architecture

The application follows a three-tier architecture:
1. **Frontend**: React Native mobile app with Expo
2. **Backend**: NestJS RESTful API
3. **Database**: MongoDB for data persistence

## License

This project is licensed under the MIT License - see the LICENSE file for details. 