import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        name: { type: String, required:true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true},
        oauthProvider: { type: String},
        oauthID: { type: String},
    }, { collection: 'Users'}
);

const User = mongoose.model('User', userSchema );
export { User };