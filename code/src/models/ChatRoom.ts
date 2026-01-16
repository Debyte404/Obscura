/**
 * ===== CHATROOM MODEL =====
 * Represents a chat session between two matched users.
 * Adapted for Next.js.
 */

import mongoose, { Schema, Document } from 'mongoose';

// ===== TYPE DEFINITIONS =====
export interface IMessage {
    _id?: string;
    senderId: string;
    type: 'text' | 'image';
    content: string; // Text message or Image Base64/URL
    timestamp: Date;
}

export interface IChatRoom extends Document {
    participants: [string, string];
    messages: IMessage[];
    isActive: boolean;
    endedBy: string | null;
    createdAt: Date;
    updatedAt: Date;
}

// ===== MESSAGE SUB-SCHEMA =====
const messageSchema = new Schema<IMessage>(
    {
        senderId: { type: String, required: true },
        type: { type: String, enum: ['text', 'image'], default: 'text' },
        content: { type: String, required: true, maxlength: 500000 }, // Increased limit for base64
        timestamp: { type: Date, default: Date.now },
    },
    { _id: true }
);

// ===== CHATROOM SCHEMA =====
const chatRoomSchema = new Schema<IChatRoom>(
    {
        participants: {
            type: [String],
            required: true,
            validate: {
                validator: (v: string[]) => v.length === 2,
                message: 'ChatRoom must have exactly 2 participants',
            },
        },
        messages: { type: [messageSchema], default: [] },
        isActive: { type: Boolean, default: true },
        endedBy: { type: String, default: null },
    },
    { timestamps: true }
);

// ===== INDEXES =====
chatRoomSchema.index({ participants: 1 });
chatRoomSchema.index({ isActive: 1 });

// ===== MODEL EXPORT =====
export const ChatRoom = (mongoose.models.ChatRoom as mongoose.Model<IChatRoom>) || mongoose.model<IChatRoom>('ChatRoom', chatRoomSchema);
export default ChatRoom;
