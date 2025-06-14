import express from "express";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import session from 'express-session';
import passport from 'passport';
import http from 'http';
import routerRegister from "./routes/registerUser.route";
import authRouter from "./routes/auth.route";
import configurePassport from "./config/passport.config";
import loginRouter from "./routes/login.route";
import createQuestionRouter from "./routes/createQuestion.route";
import updateQuestionRouter from "./routes/updateQuestion.route";
import deleteQuestionRouter from "./routes/delete.route";
import friendRouter from "./routes/friends.route";
import { WebSocketServer, WebSocket } from "ws";
import cors from 'cors';

dotenv.config();
configurePassport();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;
const URI = process.env.MONGODB_URI;
const socket = new WebSocketServer({ server });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 
    }
}));

app.use(passport.initialize());
app.use(passport.session());


app.get('/live', (req, res) => {
    res.send('API is live!');
});

app.use('/', routerRegister);
app.use('/', loginRouter);
app.use('/', createQuestionRouter);
app.use('/', updateQuestionRouter);
app.use('/', deleteQuestionRouter);
app.use('/auth', authRouter);
app.use('/friends', friendRouter);

socket.on('connection', (ws: WebSocket) => {
    console.log('User Connected to Websocket');

    ws.on('message', (message: string | Buffer) => {
        const text = message.toString();

        console.log('Received: ', text);

        socket.clients.forEach(client => {
            if(client.readyState === WebSocket.OPEN) {
                client.send(`Message: ${text}`)
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
})

mongoose.connect(URI!)
    .then(() => {
        console.log('Connected to MongoDB successfully.');
        server.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    });