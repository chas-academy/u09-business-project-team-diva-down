"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const http_1 = __importDefault(require("http"));
const registerUser_route_1 = __importDefault(require("./routes/registerUser.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const passport_config_1 = __importDefault(require("./config/passport.config"));
const login_route_1 = __importDefault(require("./routes/login.route"));
const createQuestion_route_1 = __importDefault(require("./routes/createQuestion.route"));
const updateQuestion_route_1 = __importDefault(require("./routes/updateQuestion.route"));
const delete_route_1 = __importDefault(require("./routes/delete.route"));
const friends_route_1 = __importDefault(require("./routes/friends.route"));
const ws_1 = require("ws");
const cors_1 = __importDefault(require("cors"));
const uuid_1 = require("uuid");
const user_route_1 = __importDefault(require("./routes/user.route"));
dotenv_1.default.config();
(0, passport_config_1.default)();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const port = process.env.PORT || 3000;
const URI = process.env.MONGODB_URI;
const socket = new ws_1.WebSocketServer({ server });
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.get('/live', (req, res) => {
    res.send('API is live!');
});
app.use('/', registerUser_route_1.default);
app.use('/', login_route_1.default);
app.use('/', createQuestion_route_1.default);
app.use('/', updateQuestion_route_1.default);
app.use('/', delete_route_1.default);
app.use('/auth', auth_route_1.default);
app.use('/friends', friends_route_1.default);
app.use('/user', user_route_1.default);
mongoose_1.default.connect(URI)
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
// Websocket Consts
const clients = new Map();
const lobbies = new Map();
const messageHistory = [];
// Websocket Functions
function broadcastToLobby(lobbyId, message) {
    const lobby = lobbies.get(lobbyId);
    if (!lobby)
        return;
    lobby.clients.forEach(clientId => {
        const client = clients.get(clientId);
        if (client && client.socket.readyState === ws_1.WebSocket.OPEN) {
            client.socket.send(message);
        }
    });
}
function broadcastClientList(lobbyId) {
    let targetClients;
    if (lobbyId) {
        // Broadcast to specific lobby
        const lobby = lobbies.get(lobbyId);
        if (!lobby)
            return;
        targetClients = Array.from(lobby.clients)
            .map(clientId => clients.get(clientId))
            .filter(client => client !== undefined);
    }
    else {
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
        if (client.socket.readyState === ws_1.WebSocket.OPEN) {
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
        if (client.socket.readyState === ws_1.WebSocket.OPEN) {
            client.socket.send(message);
        }
    });
}
function createLobby(hostClient, lobbyName) {
    const lobbyId = (0, uuid_1.v4)();
    const newLobby = {
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
function updateClientLobbyState(clientId, lobbyId) {
    const client = clients.get(clientId);
    if (client) {
        client.lobbyId = lobbyId;
        clients.set(clientId, client);
        broadcastAllClients();
    }
}
function joinLobby(client, lobbyId) {
    const lobby = lobbies.get(lobbyId);
    if (!lobby)
        return false;
    lobby.clients.add(client.id);
    updateClientLobbyState(client.id, lobbyId);
    return true;
}
function leaveLobby(clientId) {
    const client = clients.get(clientId);
    if (!client || !client.lobbyId)
        return;
    const lobby = lobbies.get(client.lobbyId);
    if (!lobby)
        return;
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
        }
        else {
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
    const tempClient = {
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
                    if (client.socket.readyState === ws_1.WebSocket.OPEN) {
                        client.socket.send(lobbyListMessage);
                    }
                });
            }
        }
        catch (error) {
            console.error(`Invalid message: ${error}`);
        }
    });
    connection.on('error', (error) => {
        console.error('WebSocket Error:', error);
    });
});
