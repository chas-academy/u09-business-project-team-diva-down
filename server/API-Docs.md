# Trivia API Documentation

## Authentication

### Register
- **Method**: POST
- **Endpoint**: `http://localhost:3000/register` || `https://u09-business-project-team-diva-down.onrender.com/register`
- **Body** (urlencoded):
  - `name`: Testing Server
  - `email`: sddshfde@gmail.com
  - `password`: 1234

### Login
- **Method**: POST
- **Endpoint**: `http://localhost:3000/login` || `https://u09-business-project-team-diva-down.onrender.com/login`
- **Body** (urlencoded):
  - `email`: 1233@gmail.com
  - `password`: 1234

### OAuth (Google)
- **Method**: GET
- **Endpoint**: `http://localhost:3000/auth/google` || `https://u09-business-project-team-diva-down.onrender.com/auth/google`

## Questions

### Create Question
- **Method**: POST
- **Endpoint**: `http://localhost:3000/createquestion` || `https://u09-business-project-team-diva-down.onrender.com/createquestion`
- **Authorization**: Bearer Token (`<token>`)
- **Body** (urlencoded):
  - `question`: How many days in a weekend?
  - `rightAnswer`: 2
  - `answerOp2`: 3
  - `answerOp3`: 4
  - `answerOp4`: 5

### Update Question
- **Method**: PUT
- **Endpoint**: `http://localhost:3000/update/:_id` || `https://u09-business-project-team-diva-down.onrender.com/:_id`
- **Authorization**: Bearer Token (`<token>`)
- **Path Variables**:
  - `_id`: 683c714edaeb7e67fc890768
- **Body** (urlencoded):
  - `question`: How many days in a weekend every weekend?
  - `rightAnswer`: 2
  - `answerOp2`: 3
  - `answerOp3`: 4
  - `answerOp4`: 5

### Delete Question
- **Method**: DELETE
- **Endpoint**: `http://localhost:3000/delete/:_id` || `https://u09-business-project-team-diva-down.onrender.com/:_id`
- **Authorization**: Bearer Token (`<token>`)
- **Path Variables**:
  - `_id`: 683c6ffea5ed27d36c2dc751

## Friends

### Send Friend Request
- **Method**: POST
- **Endpoint**: `http://localhost:3000/friends/request` || `https://u09-business-project-team-diva-down.onrender.com/friends|request`
- **Body** (urlencoded):
  - `userId`: 682899af33b6f1d1c00a00ae
  - `friendId`: 68429bf4a99718e177297a16

### Accept Friend Request
- **Method**: POST
- **Endpoint**: `http://localhost:3000/friends/accept` || `https://u09-business-project-team-diva-down.onrender.com/friends/accept`
- **Body** (urlencoded):
  - `relationshipId`: 68429b5ca99718e177297a0e

### Get Friends List
- **Method**: GET
- **Endpoint**: `http://localhost:3000/friends/682899af33b6f1d1c00a00ae` || `https://u09-business-project-team-diva-down.onrender.com/friends/682899af33b6f1d1c00a00ae`
- **Body** (urlencoded):
  - `relationshipId`: 68429b5ca99718e177297a0e

### Get Pending Friend Requests
- **Method**: GET
- **Endpoint**: `http://localhost:3000/friends/pending/68429bf4a99718e177297a16` || `https://u09-business-project-team-diva-down.onrender.com/friends/pending/68429bf4a99718e177297a16`
- **Body** (urlencoded):
  - `userId`: 682899af33b6f1d1c00a00ae
  - `friendId`: 68429bf4a99718e177297a16