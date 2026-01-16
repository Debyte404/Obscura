"use server";

import connectDB from "@/lib/db";
import User, { IUser } from "@/models/User";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";

// Verify session and get user
async function getCurrentUser() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) return null;

    try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
        await connectDB();
        const user = await User.findOne({ uid: decodedClaims.uid });
        return user;
    } catch (error) {
        return null;
    }
}

export async function updateProfileAction(data: Partial<IUser>) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { success: false, error: "Unauthorized" };
        }

        // Validate 5 tags
        if (data.tags && data.tags.length !== 5) {
            return { success: false, error: "Please select exactly 5 tags." };
        }

        // specific field updates allowed
        const ALLOWED_FIELDS = [
            "userName", "collegeYear", "homeState",
            "language", "gender", "introduction",
            "preference", "tags"
        ];

        ALLOWED_FIELDS.forEach((field) => {
            // eslint-disable-next-line
            if ((data as any)[field] !== undefined) {
                // eslint-disable-next-line
                (user as any)[field] = (data as any)[field];
            }
        });

        // Mark setup as done? Maybe add a flag 'isConfigured' or just rely on checks
        await user.save();

        return { success: true };

    } catch (error: any) {
        console.error("Profile Update Error:", error);
        return { success: false, error: error.message };
    }
}
