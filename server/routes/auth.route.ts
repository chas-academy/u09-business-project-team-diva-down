import { Router } from 'express';
import passport from 'passport';

const authRouter = Router();

authRouter.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        prompt: 'select_account'
    })
);

authRouter.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/failure',
        successRedirect: '/auth/success'
    })
);

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
        if (err) return next(err);
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.redirect('/');
        });
    });
});

export default authRouter;