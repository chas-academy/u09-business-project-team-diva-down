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
import { v4 as uuidv4 } from "uuid";
import { Url } from "url";
import { BlobOptions } from "buffer";
import userRouter from "./routes/user.route";

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
app.use('/user', userRouter);

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


// WebSocket Interfaces

interface Client {
    socket: WebSocket;
    username: string;
    id: string;
    ready: boolean;
    lobbyId?: string;
    isHost?: boolean;
}

interface Lobby {
    id: string;
    name: string;
    hostId: string;
    clients: Set<string>;
    createdAt: Date;
}

interface Message {
    id: string;
    username: string;
    content: string;
    timestamp: Date;
    lobbyId?: string;
}

// Websocket Consts

const clients = new Map<string, Client>();
const lobbies = new Map<string, Lobby>();
const messageHistory: Message[] = [];

// Websocket Functions

function broadcastToLobby(lobbyId: string, message: string) {
    const lobby = lobbies.get(lobbyId);
    if (!lobby) return;

    lobby.clients.forEach(clientId => {
        const client = clients.get(clientId);
        if (client && client.socket.readyState === WebSocket.OPEN) {
            client.socket.send(message);
        }
    });
}

function broadcastClientList(lobbyId?: string) {
    let targetClients: Client[];
    
    if (lobbyId) {
        // Broadcast to specific lobby
        const lobby = lobbies.get(lobbyId);
        if (!lobby) return;
        
        targetClients = Array.from(lobby.clients)
            .map(clientId => clients.get(clientId))
            .filter(client => client !== undefined) as Client[];
    } else {
        // Broadcast to all clients (for global messages)
        targetClients = Array.from(clients.values());
    }

    const clientList = targetClients.map(client => ({
        id: client.id,
        username: client.username,
        ready: client.ready,
        isHost: client.isHost
    }));

    const message = JSON.stringify({
        type: 'clientList',
        data: clientList
    });

    targetClients.forEach(client => {
        if (client.socket.readyState === WebSocket.OPEN) {
            client.socket.send(message);
        }
    });
}

function broadcastAllClients() {
    const allClients = Array.from(clients.values()).map(client => ({
        id: client.id,
        username: client.username,
        ready: client.ready,
        isHost: client.isHost,
        lobbyId: client.lobbyId
    }));

    const message = JSON.stringify({
        type: 'allClients',
        data: allClients
    });

    clients.forEach(client => {
        if (client.socket.readyState === WebSocket.OPEN) {
            client.socket.send(message);
        }
    });
}

function createLobby(hostClient: Client, lobbyName: string): Lobby {
    const lobbyId = uuidv4();
    const newLobby: Lobby = {
        id: lobbyId,
        name: lobbyName,
        hostId: hostClient.id,
        clients: new Set([hostClient.id]),
        createdAt: new Date()
    };
    
    lobbies.set(lobbyId, newLobby);
    
    // Update host client
    hostClient.lobbyId = lobbyId;
    hostClient.isHost = true;
    clients.set(hostClient.id, hostClient);
    
    return newLobby;
}

function updateClientLobbyState(clientId: string, lobbyId?: string) {
    const client = clients.get(clientId);
    if (client) {
        client.lobbyId = lobbyId;
        clients.set(clientId, client);
        broadcastAllClients();
    }
}

function joinLobby(client: Client, lobbyId: string): boolean {
    const lobby = lobbies.get(lobbyId);
    if (!lobby) return false;
    
    lobby.clients.add(client.id);
    updateClientLobbyState(client.id, lobbyId);
    return true;
}

function leaveLobby(clientId: string) {
    const client = clients.get(clientId);
    if (!client || !client.lobbyId) return;
    
    const lobby = lobbies.get(client.lobbyId);
    if (!lobby) return;
    
    // Remove client from lobby
    lobby.clients.delete(clientId);
    client.lobbyId = undefined;
    client.isHost = false;
    clients.set(clientId, client);
    
    // If host leaves, assign new host or disband lobby
    if (lobby.hostId === clientId) {
        if (lobby.clients.size > 0) {
            // Assign new host (first client in Set)
            const newHostId = Array.from(lobby.clients)[0];
            lobby.hostId = newHostId;
            
            const newHost = clients.get(newHostId);
            if (newHost) {
                newHost.isHost = true;
                clients.set(newHostId, newHost);
            }
            
            // Notify lobby about new host
            broadcastToLobby(lobby.id, JSON.stringify({
                type: 'newHost',
                hostId: newHostId
            }));
        } else {
            // No clients left, disband lobby
            lobbies.delete(lobby.id);
        }
    }
    
    // Update client list for remaining lobby members
    if (lobby.clients.size > 0) {
        broadcastClientList(lobby.id);
    }
}


// WebSocket Server Setup

socket.on('connection', (connection, request) => {
    console.log('Connected to the Websocket!');

    const tempClient: Client = {
        socket: connection,
        id: '',
        username: 'Pending Auth',
        ready: false,
        lobbyId: undefined,
        isHost: false
    };

    connection.on('message', (message) => {
        console.log('Recived Raw message: ', message.toString());
        try {
            const data = JSON.parse(message.toString());
            if (data.type === 'auth') {
                // verify token here if needed
                tempClient.id = data.userId;
                tempClient.username = data.username;
                clients.set(data.userId, tempClient);
                console.log(`Authenticated ${data.username}`);
            }
            else if (data.type === 'createLobby') {
                const lobbyName = data.name;
                const lobby = createLobby(tempClient, lobbyName);

                connection.send(JSON.stringify({
                    type: 'lobbyCreated',
                    lobbyId: lobby.id,
                    lobbyName: lobby.name
                    
                }));

                console.log(`Lobby Created: ${lobbyName} (ID: ${lobby.id})`);
                broadcastClientList(lobby.id);

                const lobbyListMessage = JSON.stringify({
                    type: 'lobbyList',
                    data: Array.from(lobbies.values()).map(l => ({
                        id: l.id,
                        name: l.name,
                        hostId: l.hostId,
                        clientCount: l.clients.size
                    }))
                });

                clients.forEach(client => {
                    if (client.socket.readyState === WebSocket.OPEN) {
                        client.socket.send(lobbyListMessage);
                    }
                });
            }
        } catch (error) {
            console.error(`Invalid message: ${error}`);
        }
    });

    connection.on('error', (error) => {
        console.error('WebSocket Error:', error);
    })
});