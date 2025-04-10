# Hoagie App System Architecture

## High-Level Architecture Diagram

```
┌───────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│                          HOAGIE APP ARCHITECTURE                          │
│                                                                           │
├───────────────┐     ┌───────────────┐     ┌────────────────────────────┐  │
│               │     │               │     │                            │  │
│  MOBILE CLIENT│     │  WEB CLIENT   │     │          CONTAINERS        │  │
│  (React Native│     │  (React Web)  │     │                            │  │
│   with Expo)  │     │               │     │ ┌──────────────────────┐   │  │
│               │     │               │     │ │                      │   │  │
│               │     │               │     │ │   Frontend Container │   │  │
│               │     │               │     │ │   (Expo Web Server)  │   │  │
└───────┬───────┘     └───────┬───────┘     │ │                      │   │  │
        │                     │             │ └──────────────────────┘   │  │
        │                     │             │                            │  │
        │                     │             │ ┌──────────────────────┐   │  │
        │                     │             │ │                      │   │  │
        └─────────────────────┼─────────────┼─►    Backend Container │   │  │
                              │             │ │      (NestJS API)    │   │  │
                              │             │ │                      │   │  │
                              │             │ └───────────┬──────────┘   │  │
                              │             │             │              │  │
                              └─────────────┼─────────────┘              │  │
                                            │                            │  │
                                            │ ┌──────────────────────┐   │  │
                                            │ │                      │   │  │
                                            │ │   MongoDB Container  │   │  │
                                            │ │                      │   │  │
                                            │ └──────────────────────┘   │  │
                                            │                            │  │
                                            └────────────────────────────┘  │
                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

## Connection Flow

```
┌─────────────────┐        HTTP/HTTPS         ┌─────────────────┐
│                 │ ───────Requests────────>  │                 │
│                 │                           │                 │
│  Mobile/Web     │ <──────Responses───────── │  NestJS Backend │
│  Client         │                           │  API (Port 3000)│
│                 │ Authentication/API Calls  │                 │
└─────────────────┘                           └────────┬────────┘
                                                      │
                                                      │ Mongoose ORM
                                                      │
                                                      ▼
                                              ┌─────────────────┐
                                              │                 │
                                              │    MongoDB      │
                                              │  (Port 27017)   │
                                              │                 │
                                              └─────────────────┘
```

## Components Description

### Client Applications
- **Mobile Client**: React Native application using Expo framework, providing native mobile experience on iOS and Android
- **Web Client**: React Web application that shares code with the mobile client, allowing for browser access

### Server Components
- **Frontend Container**: Serves the Expo web application in development (in production, mobile apps would be distributed through app stores)
- **Backend Container**: NestJS REST API handling all business logic, authentication, and data operations
- **MongoDB Container**: NoSQL database storing all application data in document collections

### Communication Patterns
- Clients communicate with backend exclusively through REST API calls
- Backend uses Mongoose ORM to interact with MongoDB
- Authentication is handled via token-based auth with the backend server

## Deployment Options

### Development Environment
- Docker Compose orchestrates the backend and database containers
- Frontend runs directly on the host for easier debugging with Expo

### Production Options
- **Mobile**: 
  - Publish to App Store/Google Play through Expo EAS
  - Backend deployed to cloud provider (AWS, Azure, etc.)
- **Web**:
  - Static assets deployed to CDN
  - Backend deployed as containerized service

## Technology Stack Details

- **Frontend**:
  - React Native / React
  - Expo SDK
  - TypeScript
  - React Navigation
  - Axios for HTTP requests

- **Backend**:
  - NestJS framework
  - TypeScript
  - Mongoose ODM
  - JWT authentication
  - Class-validator for DTO validation

- **Database**:
  - MongoDB
  - Document-based data model
  - Mongoose schemas for data modeling 