import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import mongoose from "mongoose";
import keys from "../config/keys.js";

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: "http://localhost:5001/auth/google/callback",
            proxy: true,
        },
        async (accessToken, refreshToken, profile, done) => {
            const existingUser = await User.findOne({ googleId: profile.id });

            if (existingUser) {
                return done(null, existingUser);
            }

            const user = await new User({
                googleId: profile.id,
                displayName: profile.displayName,
            }).save();
            done(null, user);
        }
    )
);
