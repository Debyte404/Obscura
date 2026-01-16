import "server-only";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
// Handle newlines in private key for Vercel/Node
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing Firebase Admin credentials");
}

const serviceAccount = {
    projectId,
    clientEmail,
    privateKey,
};

if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount),
    });
}

export const adminAuth = getAuth();
