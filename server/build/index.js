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
const registerUser_route_1 = __importDefault(require("./routes/registerUser.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const passport_config_1 = __importDefault(require("./config/passport.config"));
const login_route_1 = __importDefault(require("./routes/login.route"));
const createQuestion_route_1 = __importDefault(require("./routes/createQuestion.route"));
const updateQuestion_route_1 = __importDefault(require("./routes/updateQuestion.route"));
const delete_route_1 = __importDefault(require("./routes/delete.route"));
dotenv_1.default.config();
(0, passport_config_1.default)();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const URI = process.env.MONGODB_URI;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
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
mongoose_1.default.connect(URI)
    .then(() => {
    console.log('Connected to MongoDB successfully.');
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
})
    .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
});
