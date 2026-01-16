/**
 * ===== USER MODEL =====
 * Defines the User document for MongoDB.
 * Adapted for Next.js with hot-reload support.
 */

import mongoose, { Schema, Document } from 'mongoose';
import { COLLEGE_YEARS, LANGUAGES, GENDERS, INDIAN_STATES, PREDEFINED_TAGS } from '@/lib/constants';

// ===== TYPE DEFINITIONS =====
export interface IUser extends Document {
    uid: string;
    email: string;
    userName: string;
    firstName: string;
    lastName: string;
    collegeYear: '1st' | '2nd' | '3rd' | '4th';
    homeState: string;
    language: 'Hindi' | 'English';
    gender: 'Male' | 'Female' | 'Other';
    introduction: string;
    preference: string;
    tags: string[];
    avatar: string;
    avatarGenerating: boolean;
    blockedUsers: string[];
    recentMatches: string[];
    isOnline: boolean;
    lastMatchedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

// ===== SCHEMA DEFINITION =====
const userSchema = new Schema<IUser>(
    {
        uid: { type: String, required: true, unique: true, index: true },
        email: { type: String, required: true, unique: true },
        userName: { type: String, required: true, unique: true, minlength: 3, maxlength: 20, match: /^[a-zA-Z0-9_]+$/ },
        firstName: { type: String, required: true, maxlength: 50 },
        lastName: { type: String, maxlength: 50 },
        collegeYear: { type: String, required: true, enum: COLLEGE_YEARS },
        homeState: { type: String, required: true, enum: INDIAN_STATES },
        language: { type: String, required: true, enum: LANGUAGES },
        gender: { type: String, required: true, enum: GENDERS },
        introduction: { type: String, required: true, maxlength: 500 },
        preference: { type: String, required: true, maxlength: 500 },
        tags: {
            type: [String],
            required: true,
            validate: {
                validator: (v: string[]) => v.length === 5,
                message: 'Exactly 5 tags are required',
            },
        },
        avatar: { type: String, default: '' },
        avatarGenerating: { type: Boolean, default: false },
        blockedUsers: { type: [String], default: [] },
        recentMatches: { type: [String], default: [] },
        isOnline: { type: Boolean, default: false },
        lastMatchedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

// ===== INDEXES =====
userSchema.index({ homeState: 1 });
userSchema.index({ language: 1 });
userSchema.index({ tags: 1 });
userSchema.index({ isOnline: 1 });

// ===== MODEL EXPORT =====
// Use mongoose.models.User if it exists (for Next.js hot reload), otherwise create it
export const User = (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('User', userSchema);
export default User;
