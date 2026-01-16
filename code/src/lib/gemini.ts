import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("Missing GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function generateContent(prompt: string) {
    if (!apiKey) {
        throw new Error("Gemini API Key is not configured");
    }
    const result = await model.generateContent(prompt);
    return result.response.text();
}
