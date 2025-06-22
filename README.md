# Trivia Game🎮

A fullstack Trivia Game app that uses the Open Trivia Database https://opentdb.com/api_config.php. Play solo or challenge friends in multiplayer mode — test your knowledge and have fun!

## Features ✨

✅ User registration & authentication (JWT + Google OAuth) ✅ Create, read, update, delete trivia questions ✅ Friend request system: send, accept, view friends ✅ RESTful API built with Express ✅ Single-player & multiplayer support (via WebSockets)

## Technologies Used 🛠️

Layer	Tech
Frontend	React + Vite
Backend	Node.js + Express
Database	MongoDB + Mongoose
Auth	JWT + Google OAuth
Other	Bcrypt (password hashing), CORS, Dotenv
## Setup Instructions 🚀

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- Google OAuth credentials (for Google login)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/trivia-express-server.git
   cd trivia-express-server
   ```
2. Install dependencies:
bash
    ```bash
        npm install
    ```
3. Create a .env file in the root directory with the following variables:
    ```bash
    PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret    
    ```
4. Run
```bash
npm run dev
```
in both client and server maps

## 📌 API Endpoints

## 📝 **Register**

**POST**
`http://localhost:3000/register`

**Body (x-www-form-urlencoded)**

* `name`: `Testing Server`
* `email`: `sddshfde@gmail.com`
* `password`: `1234`

---

## 🔑 **Login**

**POST**
`http://localhost:3000/login`

**Body (x-www-form-urlencoded)**

* `email`: `1233@gmail.com`
* `password`: `1234`

---

## 🌐 **OAuth**

**GET**
`http://localhost:3000/auth/google`

---

## ❓ **Create Question**

**POST**
`http://localhost:3000/createquestion`

**Authorization:**
`Bearer <token>`

**Body (x-www-form-urlencoded)**

* `question`: `How many days in a weekend?`
* `rightAnswer`: `2`
* `answerOp2`: `3`
* `answerOp3`: `4`
* `answerOp4`: `5`

---

## ✏️ **Update Question**

**PUT**
`http://localhost:3000/update/:_id`

**Path Variable**

* `_id`: `683c714edaeb7e67fc890768`

**Authorization:**
`Bearer <token>`

**Body (x-www-form-urlencoded)**

* `question`: `How many days in a weekend every weekend?`
* `rightAnswer`: `2`
* `answerOp2`: `3`
* `answerOp3`: `4`
* `answerOp4`: `5`

---

## 🗑️ **Delete Question**

**DELETE**
`http://localhost:3000/delete/:_id`

**Path Variable**

* `_id`: `683c6ffea5ed27d36c2dc751`

**Authorization:**
`Bearer <token>`

---

## 🤝 **Send Friend Request**

**POST**
`http://localhost:3000/friends/request`

**Body (x-www-form-urlencoded)**

* `userId`: `682899af33b6f1d1c00a00ae`
* `friendId`: `68429bf4a99718e177297a16`

---

## ✅ **Accept Friend Request**

**POST**
`http://localhost:3000/friends/accept`

**Body (x-www-form-urlencoded)**

* `relationshipId`: `68429b5ca99718e177297a0e`

---

## 👥 **Get Friends List**

**GET**
`http://localhost:3000/friends/682899af33b6f1d1c00a00ae`

---

## ⏳ **Pending Friend Request**

**GET**
`http://localhost:3000/friends/pending/68429bf4a99718e177297a16`

---

> 💡 **Note:** Replace `<token>` with your actual Bearer token when making requests.

---


