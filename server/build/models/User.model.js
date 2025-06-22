"use strict";
// import mongoose, { Schema, Document, Model, Types } from "mongoose";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
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
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    oauthProvider: { type: String },
    oauthID: { type: String },
    eloScore: { type: Number, default: 1000 },
    wins: { type: Number, default: 0 },
    total_matches: { type: Number, default: 0 }
}, {
    collection: 'Users',
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
        }
    }
});
userSchema.index({ oauthProvider: 1, oauthID: 1 });
const User = mongoose_1.default.model('User', userSchema);
exports.User = User;
