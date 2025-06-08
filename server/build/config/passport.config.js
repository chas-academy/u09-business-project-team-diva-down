"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const User_model_1 = require("../models/User.model");
const configurePassport = () => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_CALLBACK_URL) {
        throw new Error('Google OAuth environment variables not configured');
    }
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email']
    }, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            let user = yield User_model_1.User.findOne({ googleId: profile.id });
            if (!user) {
                user = new User_model_1.User({
                    googleId: profile.id,
                    email: (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value,
                    displayName: profile.displayName,
                    avatar: (_b = profile.photos) === null || _b === void 0 ? void 0 : _b[0].value
                });
                yield user.save();
            }
            return done(null, user);
        }
        catch (err) {
            return done(err);
        }
    })));
    passport_1.default.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User_model_1.User.findById(id);
            done(null, user);
        }
        catch (err) {
            done(err);
        }
    }));
};
exports.default = configurePassport;
