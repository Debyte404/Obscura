"use server";

import { adminAuth } from "@/lib/firebase-admin";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";

export async function loginWithGoogleAction(idToken: string) {
    try {
        // 1. Verify the ID token
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const { uid, email, name, picture } = decodedToken;

        if (!email) {
            return { success: false, error: "Email is required" };
        }

        await connectDB();

        // 2. Check if user exists
        let user = await User.findOne({ uid });
        let isNewUser = false;

        if (!user) {
            isNewUser = true;
            // 3. Create new user stub
            // Split name into first and last
            const nameParts = (name || "").split(" ");
            const firstName = nameParts[0] || "User";
            const lastName = nameParts.slice(1).join(" ") || "";

            // Generate a unique username based on email part + random string if needed
            // For now, keep it simple, the onboarding might overwrite it or we generate a placeholder
            const baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "");
            const uniqueSuffix = Math.random().toString(36).substring(2, 6);
            const userName = `${baseUsername}_${uniqueSuffix}`.substring(0, 20);

            user = await User.create({
                uid,
                email,
                userName,
                firstName,
                lastName,
                avatar: picture || "",
                // Default values for required fields (to be filled in onboarding)
                collegeYear: "1st",
                homeState: "Delhi", // Default placeholder
                language: "English",
                gender: "Other",
                introduction: "New user",
                preference: "New user",
                tags: ["Studious", "Coding", "Gaming", "Music", "Reading"], // 5 default tags
                isOnline: true,
            });
        } else {
            // Update online status
            user.isOnline = true;
            await user.save();
        }

        // 4. Set session cookie
        // In a real app, you might mint a custom JWT or use firebase-admin to create a session cookie
        // For simplicity/MVP, we'll store the UID in a signed/httpOnly cookie
        // Warning: This is a simplified session management. 
        // Ideally use adminAuth.createSessionCookie(idToken, { expiresIn })

        // Let's use Firebase Session Cookie for security
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
        const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

        const cookieStore = await cookies();
        cookieStore.set("session", sessionCookie, {
            maxAge: expiresIn,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
        });

        return { success: true, isNewUser };
    } catch (error: any) {
        console.error("Login Error:", error);
        return { success: false, error: error.message };
    }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    return { success: true };
}

export async function checkSessionAction() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie?.value) {
        return { isAuthenticated: false };
    }

    try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie.value, true);
        return {
            isAuthenticated: true,
            user: {
                uid: decodedClaims.uid,
                email: decodedClaims.email
            }
        };
    } catch (error) {
        return { isAuthenticated: false };
    }
}
