# Hoagie App API Endpoints

## API Structure Overview

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│                        API ENDPOINTS                           │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Authentication                                                │
│    POST   /api/auth/register                                   │
│    POST   /api/auth/login                                      │
│                                                                │
│  Users                                                         │
│    GET    /api/user-search?q=query                             │
│                                                                │
│  Hoagies                                                       │
│    GET    /api/hoagies?page=1&limit=10&creator=userId         │
│    GET    /api/hoagies/:id                                     │
│    POST   /api/hoagies                                         │
│    PUT    /api/hoagies/:id                                     │
│    DELETE /api/hoagies/:id                                     │
│                                                                │
│  Collaborators                                                 │
│    POST   /api/hoagies/:id/collaborators?userId=requesterId   │
│    DELETE /api/hoagies/:id/collaborators/:userId?userId=reqId │
│                                                                │
│  Comments                                                      │
│    GET    /api/comments?hoagie=hoagieId&page=1&limit=10       │
│    POST   /api/comments                                        │
│    PUT    /api/comments/:id                                    │
│    DELETE /api/comments/:id                                    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## API Endpoints Detail

### Authentication

#### Register User
- **Endpoint**: `POST /api/auth/register`
- **Description**: Create a new user account
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```
- **Response**:
  ```json
  {
    "user": {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2023-04-10T18:22:45.123Z",
      "updatedAt": "2023-04-10T18:22:45.123Z"
    },
    "message": "User registered successfully"
  }
  ```

#### Login User
- **Endpoint**: `POST /api/auth/login`
- **Description**: Authenticate a user and return user information
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```
- **Response**:
  ```json
  {
    "user": {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2023-04-10T18:22:45.123Z",
      "updatedAt": "2023-04-10T18:22:45.123Z"
    },
    "message": "Login successful"
  }
  ```

### Users

#### Search Users
- **Endpoint**: `GET /api/user-search?q=query`
- **Description**: Search for users by name or email
- **Query Parameters**:
  - `q` (string): Search query, minimum 2 characters
- **Response**:
  ```json
  [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "john@example.com"
    },
    {
      "_id": "60d21b4667d0d8992e610c86",
      "name": "John Smith",
      "email": "smith@example.com"
    }
  ]
  ```

### Hoagies

#### Get All Hoagies
- **Endpoint**: `GET /api/hoagies?page=1&limit=10&creator=userId`
- **Description**: Fetch hoagies with pagination and optional filtering
- **Query Parameters**:
  - `page` (number, optional): Page number, default 1
  - `limit` (number, optional): Items per page, default 10
  - `creator` (string, optional): Filter by creator user ID
- **Response**:
  ```json
  {
    "hoagies": [
      {
        "_id": "60d21b4667d0d8992e610c87",
        "name": "Italian Classic",
        "ingredients": ["Bread", "Ham", "Cheese", "Lettuce"],
        "picture": "https://example.com/image.jpg",
        "creator": {
          "_id": "60d21b4667d0d8992e610c85",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "collaborators": [],
        "commentCount": 2,
        "createdAt": "2023-04-10T18:30:45.123Z",
        "updatedAt": "2023-04-10T18:40:45.123Z"
      }
    ],
    "total": 15
  }
  ```

#### Get Hoagie by ID
- **Endpoint**: `GET /api/hoagies/:id`
- **Description**: Fetch a specific hoagie by its ID
- **URL Parameters**:
  - `id` (string): Hoagie ID
- **Response**: Detailed hoagie object

#### Create Hoagie
- **Endpoint**: `POST /api/hoagies`
- **Description**: Create a new hoagie
- **Request Body**:
  ```json
  {
    "name": "Veggie Delight",
    "ingredients": ["Wholegrain Bread", "Hummus", "Avocado", "Lettuce", "Tomato"],
    "picture": "https://example.com/veggie.jpg",
    "creator": "60d21b4667d0d8992e610c85"
  }
  ```
- **Response**: Created hoagie object

#### Update Hoagie
- **Endpoint**: `PUT /api/hoagies/:id`
- **Description**: Update an existing hoagie
- **URL Parameters**:
  - `id` (string): Hoagie ID
- **Request Body**: Partial hoagie object with fields to update
- **Response**: Updated hoagie object

#### Delete Hoagie
- **Endpoint**: `DELETE /api/hoagies/:id`
- **Description**: Delete a hoagie
- **URL Parameters**:
  - `id` (string): Hoagie ID
- **Response**: Success message

### Collaborators

#### Add Collaborator
- **Endpoint**: `POST /api/hoagies/:id/collaborators?userId=requesterId`
- **Description**: Add a user as collaborator to a hoagie
- **URL Parameters**:
  - `id` (string): Hoagie ID
- **Query Parameters**:
  - `userId` (string): ID of user making the request (must be creator)
- **Request Body**:
  ```json
  {
    "userId": "60d21b4667d0d8992e610c86"
  }
  ```
- **Response**: Updated hoagie object

#### Remove Collaborator
- **Endpoint**: `DELETE /api/hoagies/:id/collaborators/:userId?userId=requesterId`
- **Description**: Remove a collaborator from a hoagie
- **URL Parameters**:
  - `id` (string): Hoagie ID
  - `userId` (string): ID of collaborator to remove
- **Query Parameters**:
  - `userId` (string): ID of user making the request (must be creator)
- **Response**: Updated hoagie object

### Comments

#### Get Comments for Hoagie
- **Endpoint**: `GET /api/comments?hoagie=hoagieId&page=1&limit=10`
- **Description**: Fetch comments for a specific hoagie with pagination
- **Query Parameters**:
  - `hoagie` (string): Hoagie ID
  - `page` (number, optional): Page number, default 1
  - `limit` (number, optional): Items per page, default 10
- **Response**:
  ```json
  {
    "comments": [
      {
        "_id": "60d21b4667d0d8992e610c88",
        "text": "This looks delicious!",
        "user": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "John Smith",
          "email": "smith@example.com"
        },
        "hoagie": "60d21b4667d0d8992e610c87",
        "timestamp": "2023-04-10T19:15:45.123Z",
        "createdAt": "2023-04-10T19:15:45.123Z",
        "updatedAt": "2023-04-10T19:15:45.123Z"
      }
    ],
    "total": 2
  }
  ```

#### Create Comment
- **Endpoint**: `POST /api/comments`
- **Description**: Add a comment to a hoagie
- **Request Body**:
  ```json
  {
    "text": "I tried this recipe and loved it!",
    "user": "60d21b4667d0d8992e610c86",
    "hoagie": "60d21b4667d0d8992e610c87"
  }
  ```
- **Response**: Created comment object

#### Update Comment
- **Endpoint**: `PUT /api/comments/:id`
- **Description**: Update an existing comment
- **URL Parameters**:
  - `id` (string): Comment ID
- **Request Body**:
  ```json
  {
    "text": "I tried this recipe and it was amazing!"
  }
  ```
- **Response**: Updated comment object

#### Delete Comment
- **Endpoint**: `DELETE /api/comments/:id`
- **Description**: Delete a comment
- **URL Parameters**:
  - `id` (string): Comment ID
- **Response**: Success message

## Authentication and Authorization

- All endpoints except `/api/auth/login` and `/api/auth/register` require authentication
- Hoagie modifications require the user to be either the creator or a collaborator
- Only the creator can add or remove collaborators
- Comments can be edited or deleted only by the user who created them 