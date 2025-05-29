"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleOAuthConfig = void 0;
exports.googleOAuthConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: "/auth/google/callback",
};
