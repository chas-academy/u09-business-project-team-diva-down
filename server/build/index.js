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
const friends_route_1 = __importDefault(require("./routes/friends.route"));
const trivia_route_1 = __importDefault(require("./routes/trivia.route"));
const ws_1 = require("ws");
const cors_1 = __importDefault(require("cors"));
const uuid_1 = require("uuid");
const user_route_1 = __importDefault(require("./routes/user.route"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
(0, passport_config_1.default)();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const port = process.env.PORT || 3000;
const URI = process.env.MONGODB_URI;
const socket = new ws_1.WebSocketServer({ server });
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: true,
    credentials: true
}));
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
app.use('/auth', auth_route_1.default);
app.use('/friends', friends_route_1.default);
app.use('/user', user_route_1.default);
app.use('/trivia', trivia_route_1.default);
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
function broadcastQuestionToLobby(lobbyId, formattedQuestions) {
    const lobby = lobbies.get(lobbyId);
    if (!lobby)
        return;
    const message = JSON.stringify({
        type: 'gameStarted',
        questions: formattedQuestions
    });
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
        const lobby = lobbies.get(lobbyId);
        if (!lobby)
            return;
        targetClients = Array.from(lobby.clients)
            .map(clientId => clients.get(clientId))
            .filter(client => client !== undefined);
    }
    else {
        targetClients = Array.from(clients.values());
    }
    const clientList = targetClients.map(client => ({
        id: client.id,
        username: client.username,
        ready: client.ready,
        isHost: client.isHost,
        lobbyId: client.lobbyId
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
    client.lobbyId = lobbyId;
    client.isHost = false;
    client.ready = false;
    clients.set(client.id, client);
    return true;
}
function leaveLobby(clientId) {
    const client = clients.get(clientId);
    if (!client || !client.lobbyId)
        return false;
    const lobby = lobbies.get(client.lobbyId);
    if (!lobby)
        return false;
    lobby.clients.delete(clientId);
    client.lobbyId = undefined;
    client.isHost = false;
    client.ready = false;
    clients.set(clientId, client);
    if (lobby.hostId === clientId && lobby.clients.size > 0) {
        const newHostId = Array.from(lobby.clients)[0];
        lobby.hostId = newHostId;
        const newHost = clients.get(newHostId);
        if (newHost) {
            newHost.isHost = true;
            clients.set(newHostId, newHost);
            newHost.socket.send(JSON.stringify({
                type: 'promotedToHost',
                lobbyId: lobby.id
            }));
            broadcastToLobby(lobby.id, JSON.stringify({
                type: 'newHost',
                hostId: newHostId
            }));
        }
    }
    if (lobby.clients.size === 0) {
        lobbies.delete(lobby.id);
        const message = JSON.stringify({
            type: 'lobbyDisbanded',
            lobbyId: lobby.id
        });
        clients.forEach(c => {
            if (c.socket.readyState === ws_1.WebSocket.OPEN) {
                c.socket.send(message);
            }
        });
    }
    else {
        broadcastClientList(lobby.id);
    }
    broadcastAllClients();
    const lobbyListMessage = JSON.stringify({
        type: 'lobbyList',
        data: Array.from(lobbies.values()).map(l => ({
            id: l.id,
            name: l.name,
            hostId: l.hostId,
            clientCount: l.clients.size
        }))
    });
    clients.forEach(c => {
        if (c.socket.readyState === ws_1.WebSocket.OPEN) {
            c.socket.send(lobbyListMessage);
        }
    });
    return true;
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
                try {
                    const decoded = jsonwebtoken_1.default.verify(data.token, process.env.JWT_SECRET);
                    tempClient.id = decoded.id;
                    tempClient.username = data.username;
                    clients.set(decoded.id, tempClient);
                    console.log(`Authenticated ${data.username}`);
                    connection.send(JSON.stringify({
                        type: 'authSuccess',
                        userId: decoded.id,
                        username: data.username
                    }));
                    broadcastAllClients();
                    broadcastClientList();
                    const lobbyListMessage = JSON.stringify({
                        type: 'lobbyList',
                        data: Array.from(lobbies.values()).map(l => ({
                            id: l.id,
                            name: l.name,
                            hostId: l.hostId,
                            clientCount: l.clients.size
                        }))
                    });
                    connection.send(lobbyListMessage);
                }
                catch (error) {
                    console.error('Authentication failed:', error);
                    connection.send(JSON.stringify({
                        type: 'authError',
                        message: 'Authenticationfailed'
                    }));
                    connection.close(1008, 'Authentication Failed');
                }
            }
            else if (data.type === 'getClientList') {
                broadcastClientList();
            }
            else if (data.type === 'FinalScores') {
                const clientId = tempClient.id;
                const client = clients.get(clientId);
                if (client && client.lobbyId) {
                    broadcastToLobby(client === null || client === void 0 ? void 0 : client.lobbyId, JSON.stringify({
                        type: 'LobbiesFinalScores',
                        clientId: clientId,
                        username: client.username,
                        ScoreData: data.ScoreData
                    }));
                }
            }
            else if (data.type === 'getLobbyList') {
                const lobbyList = Array.from(lobbies.values()).map(lobby => ({
                    id: lobby.id,
                    name: lobby.name,
                    hostId: lobby.hostId,
                    clientCount: lobby.clients.size,
                    createdAt: lobby.createdAt
                }));
                connection.send(JSON.stringify({
                    type: 'lobbyList',
                    data: lobbyList
                }));
            }
            else if (data.type === 'createLobby') {
                if (!tempClient.id) {
                    connection.send(JSON.stringify({
                        type: 'error',
                        message: 'Not Authenticated'
                    }));
                    return;
                }
                const lobbyName = data.name;
                const lobby = createLobby(tempClient, lobbyName);
                const AuthUserProfile = clients.get(tempClient.id);
                if (AuthUserProfile) {
                    AuthUserProfile.lobbyId = lobby.id;
                    clients.set(tempClient.id, AuthUserProfile);
                }
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
            else if (data.type === 'ready') {
                if (!tempClient.id) {
                    connection.send(JSON.stringify({
                        type: 'error',
                        message: 'Not Authenticated'
                    }));
                    return;
                }
                const client = clients.get(tempClient.id);
                if (client) {
                    client.ready = data.ready;
                    clients.set(tempClient.id, client);
                    console.log(`${client.username} is now ${client.ready ? 'ready' : 'not ready'}`);
                    if (client.lobbyId) {
                        broadcastClientList(client.lobbyId);
                    }
                    else {
                        broadcastAllClients();
                    }
                    connection.send(JSON.stringify({
                        type: 'readyUpdate',
                        userId: client.id,
                        ready: client.ready
                    }));
                }
            }
            else if (data.type === 'invite') {
                console.log('Invite message detected');
                const { id: targetClientId, lobbyId, lobbyName, senderId } = data;
                const sender = clients.get(senderId);
                const targetClient = clients.get(targetClientId);
                if (!sender || !targetClient) {
                    connection.send(JSON.stringify({
                        type: 'error',
                        message: 'Invalid client ID'
                    }));
                    return;
                }
                if (targetClient.socket.readyState === ws_1.WebSocket.OPEN) {
                    targetClient.socket.send(JSON.stringify({
                        type: 'inviteReceived',
                        from: sender.username,
                        lobbyId,
                        lobbyName,
                        senderId: senderId
                    }));
                }
                connection.send(JSON.stringify({
                    type: 'inviteSent',
                    to: targetClient.username,
                    targetClientId: targetClientId
                }));
                console.log('Target Client State: ', {
                    exists: !!targetClient,
                    connected: (targetClient === null || targetClient === void 0 ? void 0 : targetClient.socket.readyState) === ws_1.WebSocket.OPEN
                });
            }
            else if (data.type === 'joinLobby') {
                const lobbyId = data.lobbyId;
                const success = joinLobby(tempClient, lobbyId);
                if (success) {
                    const lobby = lobbies.get(lobbyId);
                    tempClient.lobbyId = lobbyId;
                    clients.set(tempClient.id, tempClient);
                    connection.send(JSON.stringify({
                        type: 'lobbyJoined',
                        lobbyId,
                        lobbyName: lobby === null || lobby === void 0 ? void 0 : lobby.name,
                        hostId: lobby === null || lobby === void 0 ? void 0 : lobby.hostId,
                        isHost: false
                    }));
                    broadcastAllClients();
                    broadcastClientList(lobbyId);
                    const lobbyList = Array.from(lobbies.values()).map(lobby => ({
                        id: lobby.id,
                        name: lobby.name,
                        hostId: lobby.hostId,
                        clientCount: lobby.clients.size,
                        createdAt: lobby.createdAt
                    }));
                    clients.forEach(client => {
                        if (client.socket.readyState === ws_1.WebSocket.OPEN) {
                            client.socket.send(JSON.stringify({
                                type: 'lobbyList',
                                data: lobbyList
                            }));
                        }
                    });
                }
                else {
                    connection.send(JSON.stringify({
                        type: 'error',
                        message: 'Failed to join lobby via Invite'
                    }));
                }
            }
            else if (data.type === 'leaveLobby') {
                const ClientId = data.clientId;
                leaveLobby(ClientId);
                connection.send(JSON.stringify({
                    type: 'lobbyLeft',
                    lobbyId: tempClient.lobbyId
                }));
                if (tempClient.lobbyId) {
                    broadcastClientList(tempClient.lobbyId);
                }
                tempClient.lobbyId = undefined;
                clients.set(tempClient.id, tempClient);
            }
            else if (data.type === 'kickPlayer') {
                const { clientId, lobbyId } = data;
                const kicker = clients.get(tempClient.id);
                const targetClient = clients.get(clientId);
                // Validate kicker is host
                const lobby = lobbies.get(lobbyId);
                if (!lobby || lobby.hostId !== tempClient.id) {
                    connection.send(JSON.stringify({
                        type: 'error',
                        message: 'Only the host can kick players'
                    }));
                    return;
                }
                // Validate target exists and is in lobby
                if (!targetClient || targetClient.lobbyId !== lobbyId) {
                    connection.send(JSON.stringify({
                        type: 'error',
                        message: 'Player not found in this lobby'
                    }));
                    return;
                }
                // Perform the kick
                const success = leaveLobby(clientId);
                if (success) {
                    // Notify the kicked player
                    if (targetClient.socket.readyState === ws_1.WebSocket.OPEN) {
                        targetClient.socket.send(JSON.stringify({
                            type: 'kickedFromLobby',
                            lobbyId,
                            reason: 'You were kicked by the host'
                        }));
                    }
                    // Notify remaining lobby members
                    broadcastToLobby(lobbyId, JSON.stringify({
                        type: 'playerKicked',
                        clientId,
                        kickedBy: tempClient.id
                    }));
                    // Send success confirmation
                    connection.send(JSON.stringify({
                        type: 'kickSuccess',
                        clientId
                    }));
                }
                else {
                    connection.send(JSON.stringify({
                        type: 'error',
                        message: 'Failed to kick player'
                    }));
                }
            }
            else if (data.type === 'StartGame') {
                const formattedQuestions = data.formattedQuestions;
                const client = clients.get(tempClient.id);
                if (client && client.lobbyId) {
                    broadcastQuestionToLobby(client.lobbyId, formattedQuestions);
                }
                else {
                    connection.send(JSON.stringify({
                        type: 'error',
                        message: 'You must be in a lobby to start a game!'
                    }));
                }
            }
        }
        catch (error) {
            console.error(`Invalid message: ${error}`);
        }
    });
    connection.on('close', () => {
        if (tempClient.id) {
            const client = clients.get(tempClient.id);
            const lobbyId = client === null || client === void 0 ? void 0 : client.lobbyId;
            leaveLobby(tempClient.id);
            clients.delete(tempClient.id);
            broadcastAllClients();
            if (lobbyId) {
                broadcastClientList(lobbyId);
                const lobbyList = Array.from(lobbies.values()).map(lobby => ({
                    id: lobby.id,
                    name: lobby.name,
                    hostId: lobby.hostId,
                    clientCount: lobby.clients.size,
                    createdAt: lobby.createdAt
                }));
                clients.forEach(c => {
                    if (c.socket.readyState === ws_1.WebSocket.OPEN) {
                        c.socket.send(JSON.stringify({
                            type: 'lobbyList',
                            data: lobbyList
                        }));
                    }
                });
            }
        }
    });
    connection.on('error', (error) => {
        console.error('WebSocket Error:', error);
    });
});
