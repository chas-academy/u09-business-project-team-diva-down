// import mongoose, { Schema } from "mongoose";

// const userSchema = new Schema(
//     {
//         name: { type: String, required:true },
//         email: { type: String, required: true, unique: true },
//         password: { type: String, required: true},
//         oauthProvider: { type: String},
//         oauthID: { type: String},
//     }, { collection: 'Users'}
// );

// const User = mongoose.model('User', userSchema );
// export { User };
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    oauthProvider?: string;
    oauthID?: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        oauthProvider: { type: String }, 
        oauthID: { type: String },
    },
    { 
        collection: 'Users',
        timestamps: true
    }
);

userSchema.index({ oauthProvider: 1, oauthID: 1 });

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export { User };
