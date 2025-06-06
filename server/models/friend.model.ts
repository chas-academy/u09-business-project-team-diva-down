import mongoose, { Schema, Document, Model } from "mongoose";
import { User } from "./User.model";

export interface IFriendRelationship extends Document {
    user: Schema.Types.ObjectId; 
    friend: Schema.Types.ObjectId;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}

const friendRelationshipSchema = new Schema<IFriendRelationship>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        friend: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        status: { 
            type: String, 
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        }
    },
    { 
        collection: 'FriendRelationships',
        timestamps: true
    }
);

friendRelationshipSchema.index({ user: 1, friend: 1 }, { unique: true });

const FriendRelationship: Model<IFriendRelationship> = mongoose.model<IFriendRelationship>('FriendRelationship', friendRelationshipSchema);

export { FriendRelationship };