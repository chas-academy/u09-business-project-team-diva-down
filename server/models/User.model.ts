// import mongoose, { Schema, Document, Model, Types } from "mongoose";

// export interface IUser extends Document {
//     id: string;
//     _id: any; 
//     name: string;
//     email: string;
//     password?: string;
//     oauthProvider?: string;
//     oauthID?: string;
//     createdAt: Date;
//     updatedAt: Date;
//     eloScore: number;
// }

// const userSchema = new Schema<IUser>(
//     {
//         name: { type: String, required: true },
//         email: { type: String, required: true, unique: true },
//         password: { type: String },
//         oauthProvider: { type: String }, 
//         oauthID: { type: String },
//         eloScore: {type: Number}
//     },
//     { 
//         collection: 'Users',
//         timestamps: true
//     }
// );

// userSchema.index({ oauthProvider: 1, oauthID: 1 });

// const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

// export { User };

// models/User.model.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  oauthProvider?: string;
  oauthID?: string;
  eloScore: number;
  createdAt: Date;
  updatedAt: Date;
  wins: number;
  total_matches: number;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    oauthProvider: { type: String }, 
    oauthID: { type: String },
    eloScore: { type: Number, default: 1000 },
    wins: { type: Number, default: 0 },
    total_matches: { type: Number, default: 0 }
  },
  { 
    collection: 'Users',
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

userSchema.index({ oauthProvider: 1, oauthID: 1 });

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export { User };