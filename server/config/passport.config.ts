import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/User.model';
import { IUser } from '../models/User.model';

const configurePassport = () => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_CALLBACK_URL) {
        throw new Error('Google OAuth environment variables not configured');
    }

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });

            if (!user) {
                user = new User({
                    googleId: profile.id,
                    email: profile.emails?.[0].value,
                    displayName: profile.displayName,
                    avatar: profile.photos?.[0].value
                });
                await user.save();
            }

            return done(null, user);
        } catch (err) {
            return done(err as Error);
        }
    }));

    passport.serializeUser((user: Express.User, done) => {
        done(null, (user as IUser)._id);
    });

    passport.deserializeUser(async (id: string, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err as Error);
        }
    });
};

export default configurePassport;