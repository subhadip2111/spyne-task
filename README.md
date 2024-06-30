# MERN Stack Social Media Backend

This project is a backend implementation for a social media application using the MERN stack (MongoDB, Express.js, React.js, and Node.js). It provides RESTful APIs for user management, discussions, comments, and other social media functionalities.

## Table of Contents
- Project Overview
- Requirements
- Installation
- Environment Variables
- API Routes
  - User Routes
  - Discussion Routes
  - Comment Routes
- Database Schema

## Project Overview

The backend of this project supports the following functionalities:
1. User registration and authentication
2. User profile management
3. Following and unfollowing users
4. Creating, updating, and deleting discussions
5. Liking and unliking discussions
6. Viewing discussions by hashtags and text
7. Adding, updating, and deleting comments on discussions
8. Liking and unliking comments
9. Viewing the count of views on discussions

## Requirements

- Node.js
- MongoDB

## Installation

1. Clone the repository:
   git clone https://github.com/yourusername/mern-social-media-backend.git
   cd mern-social-media-backend

2. Install dependencies:
   npm install

3. Create a .env file in the root directory and add the necessary environment variables (see below).

4. Start the server:
   npm start

## Environment Variables

Create a .env file in the root directory and add the following variables:
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>

## API Routes

### User Routes

- POST /api/users/signup
  - Register a new user
  - Request body: { "name": "John Doe", "email": "john@example.com", "password": "password123", "mobile": "1234567890" }

- POST /api/users/login
  - Login a user
  - Request body: { "email": "john@example.com", "password": "password123" }

- GET /api/users
  - Get list of all users (protected route)

- GET /api/users/profile
  - Get current user's profile (protected route)

- PUT /api/users
  - Update current user's profile (protected route)
  - Request body: { "name": "John Doe Updated", "email": "johnnew@example.com", "mobile": "0987654321" }

- DELETE /api/users
  - Delete current user's account (protected route)

- GET /api/users/search/:name
  - Search users by name (protected route)

- PUT /api/users/follow/:id
  - Follow a user by ID (protected route)

- PUT /api/users/unfollow/:id
  - Unfollow a user by ID (protected route)

### Discussion Routes

- POST /api/discussions
  - Create a new discussion (protected route)
  - Request body: { "text": "This is a discussion", "hashtags": "tag1,tag2", "image": <image file> }

- PUT /api/discussions/:id
  - Update a discussion by ID (protected route)
  - Request body: { "text": "Updated discussion", "hashtags": "newtag1,newtag2", "image": <image file> }

- DELETE /api/discussions/:id
  - Delete a discussion by ID (protected route)

- GET /api/discussions/hashtag/:hashtag
  - Get discussions by hashtag (protected route)

- GET /api/discussions/text/:text
  - Get discussions by text (protected route)

- PUT /api/discussions/like/:id
  - Like a discussion by ID (protected route)

- PUT /api/discussions/unlike/:id
  - Unlike a discussion by ID (protected route)

- PUT /api/discussions/view/:id
  - Increment view count of a discussion by ID (protected route)

### Comment Routes

- POST /api/comments/:discussionId
  - Create a new comment on a discussion (protected route)
  - Request body: { "text": "This is a comment" }

- PUT /api/comments/:id
  - Update a comment by ID (protected route)
  - Request body: { "text": "Updated comment" }

- DELETE /api/comments/:id
  - Delete a comment by ID (protected route)

- PUT /api/comments/like/:id
  - Like a comment by ID (protected route)

- PUT /api/comments/unlike/:id
  - Unlike a comment by ID (protected route)

## Database Schema

User
{
  "name": "String",
  "email": "String",
  "password": "String",
  "mobile": "String",
  "avatar": "String",
  "following": ["ObjectId"],
  "followers": ["ObjectId"]
}

Discussion
{
  "user": "ObjectId",
  "text": "String",
  "image": "String",
  "hashtags": ["String"],
  "likes": ["ObjectId"],
  "views": "Number",
  "comments": ["ObjectId"],
  "createdAt": "Date",
  "updatedAt": "Date"
}

Comment
{
  "user": "ObjectId",
  "discussion": "ObjectId",
  "text": "String",
  "likes": ["ObjectId"],
  "createdAt": "Date",
  "updatedAt": "Date"
}
