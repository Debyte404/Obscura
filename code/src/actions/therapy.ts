"use server";

import { generateContent } from "@/lib/gemini";
import { checkSessionAction } from "./auth";

export async function getTherapyResponseAction(messages: { role: 'user' | 'model', content: string }[]) {
    const session = await checkSessionAction();
    if (!session.isAuthenticated || !session.user) return { error: "Not authenticated" };

    try {
        const systemInstruction = `
        You are a highly skilled, empathetic, and professional therapist. 
        Your goal is to provide a safe, non-judgmental space for the user to express themselves.
        Guidelines:
        - Be supportive and active in listening.
        - Ask open-ended questions to help the user explore their feelings.
        - Avoid giving direct advice unless specifically asked, and even then, frame it as suggestions.
        - Maintain a calm, professional, yet warm tone.
        - If the user expresses intense distress or self-harm, gently provide resources for immediate professional help (standard therapy protocol).
        - Keep responses concise but meaningful.
        - This is an ephemeral session; you don't remember previous visits, but focus deeply on the current conversation.
        `;

        // We pass the conversation history to Gemini
        // We'll prefix the history with the system instruction for context if needed, 
        // or use the 'system' role if supported. lib/gemini.ts seems to take a single prompt.
        // Let's construct a full prompt string.

        let prompt = systemInstruction + "\n\nConversation History:\n";
        messages.forEach(m => {
            prompt += `${m.role === 'user' ? 'User' : 'Therapist'}: ${m.content}\n`;
        });
        prompt += "\nTherapist:";

        const response = await generateContent(prompt);
        return { success: true, response };

    } catch (e) {
        console.error("Therapy AI Error:", e);
        return { error: "I'm having a bit of trouble connecting right now. Let's try again in a moment." };
    }
}
