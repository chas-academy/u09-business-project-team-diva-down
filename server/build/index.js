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
const user_route_1 = require("./routes/user.route");
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
    origin: 'http://localhost:5173'
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
app.use('/', createQuestion_route_1.default);
app.use('/', updateQuestion_route_1.default);
app.use('/', delete_route_1.default);
app.use('/auth', auth_route_1.default);
app.use('/friends', friends_route_1.default);
app.get('/me', user_route_1.getProfile);
socket.on('connection', (ws) => {
    console.log('User Connected to Websocket');
    ws.on('message', (message) => {
        const text = message.toString();
        console.log('Received: ', text);
        socket.clients.forEach(client => {
            if (client.readyState === ws_1.WebSocket.OPEN) {
                client.send(`Message: ${text}`);
            }
        });
    });
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
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
