"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const authRouter = (0, express_1.Router)();
authRouter.get('/google', passport_1.default.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
}));
authRouter.get('/google/callback', passport_1.default.authenticate('google', {
    failureRedirect: '/auth/failure',
    successRedirect: '/auth/success'
}));
authRouter.get('/success', (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});
authRouter.get('/failure', (req, res) => {
    res.status(401).json({
        success: false,
        message: 'Authentication failed'
    });
});
authRouter.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err)
            return next(err);
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.redirect('/');
        });
    });
});
exports.default = authRouter;
