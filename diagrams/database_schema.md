# Hoagie App Database Schema

## Entity Relationship Diagram

```
┌───────────────────────────┐       ┌────────────────────────────┐
│         User              │       │          Hoagie            │
├───────────────────────────┤       ├────────────────────────────┤
│ _id: ObjectId (PK)        │       │ _id: ObjectId (PK)         │
│ name: String              │       │ name: String               │
│ email: String (unique)    │───┐   │ ingredients: String[]      │
│ password: String          │   │   │ picture: String (optional) │
│ createdAt: Date           │   │   │ creator: ObjectId (FK)     │◄───┐
│ updatedAt: Date           │   │   │ collaborators: ObjectId[]  │◄───┼──┐
└───────────────────────────┘   │   │ commentCount: Number       │    │  │
                                │   │ createdAt: Date            │    │  │
                                │   │ updatedAt: Date            │    │  │
                                │   └────────────┬───────────────┘    │  │
                                │                │                    │  │
                                │                │                    │  │
                                │                ▼                    │  │
┌───────────────────────────┐   │   ┌────────────────────────────┐   │  │
│        Comment            │   │   │       Relationship         │   │  │
├───────────────────────────┤   │   ├────────────────────────────┤   │  │
│ _id: ObjectId (PK)        │   │   │ - Hoagie creator: 1:N      │───┘  │
│ text: String              │   │   │   (User creates many       │      │
│ user: ObjectId (FK)       │───┘   │    Hoagies)                │      │
│ hoagie: ObjectId (FK)     │───────┘   │                        │      │
│ timestamp: Date           │       │ - Hoagie collaborators: M:N │──────┘
│ createdAt: Date           │       │   (Many Users collaborate  │
│ updatedAt: Date           │       │    on many Hoagies)        │
└───────────────────────────┘       └────────────────────────────┘
```

## Schema Details

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,              // User's full name
  email: String,             // Unique email for login
  password: String,          // Hashed password (not returned in queries)
  createdAt: Date,           // When the user was created
  updatedAt: Date            // When the user was last updated
}
```

### Hoagie Collection
```javascript
{
  _id: ObjectId,
  name: String,              // Name of the hoagie recipe
  ingredients: [String],     // Array of ingredients
  picture: String,           // Optional URL to image
  creator: {                 // Reference to User who created the hoagie
    _id: ObjectId,
    name: String,
    email: String
  },
  collaborators: [{          // Array of Users who can edit this hoagie
    _id: ObjectId,
    name: String,
    email: String
  }],
  commentCount: Number,      // Count of comments for efficient retrieval
  createdAt: Date,           // When the hoagie was created
  updatedAt: Date            // When the hoagie was last updated
}
```

### Comment Collection
```javascript
{
  _id: ObjectId,
  text: String,              // Comment text content
  user: {                    // Reference to User who made the comment
    _id: ObjectId,
    name: String,
    email: String
  },
  hoagie: ObjectId,          // Reference to Hoagie the comment belongs to
  timestamp: Date,           // When the comment was made
  createdAt: Date,           // When the comment was created
  updatedAt: Date            // When the comment was last updated
}
```

## Relationships

1. **User to Hoagie (Creator)** - One-to-Many
   - A User can create many Hoagies
   - Each Hoagie has exactly one creator

2. **User to Hoagie (Collaborator)** - Many-to-Many
   - A User can collaborate on many Hoagies
   - A Hoagie can have many collaborator Users

3. **User to Comment** - One-to-Many
   - A User can create many Comments
   - Each Comment has exactly one author User

4. **Hoagie to Comment** - One-to-Many
   - A Hoagie can have many Comments
   - Each Comment belongs to exactly one Hoagie

## Database Indexing Strategy

### User Collection
- `email`: Unique index for fast lookups during authentication
- `name`: Text index for user search functionality

### Hoagie Collection
- `creator`: Index for quick filtering of hoagies by creator
- `name`: Text index for search functionality
- `collaborators`: Index for filtering hoagies by collaborator

### Comment Collection
- `hoagie`: Index for quick retrieval of all comments for a hoagie
- `user`: Index for retrieving all comments by a specific user
- `timestamp`: Index for chronological sorting

## Data Validation Rules

1. **User**
   - `email`: Must be a valid email format and unique
   - `password`: Must be hashed before storage
   - `name`: Required, string between 2-50 characters

2. **Hoagie**
   - `name`: Required, string between 2-100 characters
   - `ingredients`: Required, array with at least one element
   - `creator`: Required, must be a valid ObjectId
   - `picture`: Optional, must be a valid URL if provided

3. **Comment**
   - `text`: Required, string between 1-500 characters
   - `user`: Required, must be a valid ObjectId
   - `hoagie`: Required, must be a valid ObjectId
   - `timestamp`: Required, valid date 