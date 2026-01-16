"use server";

import connectDB from "@/lib/db";
import { User, IUser } from "@/models/User";
import { ChatRoom } from "@/models/ChatRoom";
import { checkSessionAction } from "./auth";
import { generateContent } from "@/lib/gemini";
import { redirect } from "next/navigation";

// Constants
const COOLDOWN_HOURS = 12;
const MAX_TAG_SCORE = 30;
const STATE_SCORE = 10;
const LANGUAGE_SCORE = 10;
const RANDOM_SCORE_MAX = 20;

export async function findMatchAction() {
    console.log(">>> findMatchAction STARTED");
    await connectDB();
    const session = await checkSessionAction();

    if (!session.isAuthenticated || !session.user) {
        console.log(">>> Auth Failed");
        return { error: "Not authenticated" };
    }
    console.log(">>> User Authenticated:", session.user.uid);

    const currentUser = await User.findOne({ uid: session.user.uid });
    if (!currentUser) {
        console.log(">>> User Not Found in DB");
        return { error: "User not found" };
    }

    // 1. Check Cooldown
    if (currentUser.lastMatchedAt) {
        const lastMatched = new Date(currentUser.lastMatchedAt);
        const now = new Date();
        const diffHours = (now.getTime() - lastMatched.getTime()) / (1000 * 60 * 60);
        console.log(">>> Cooldown Check. Diff Hours:", diffHours);

        if (diffHours < COOLDOWN_HOURS) {
            const timeLeft = COOLDOWN_HOURS - diffHours;
            const hours = Math.floor(timeLeft);
            const minutes = Math.floor((timeLeft - hours) * 60);
            console.log(">>> Cooldown Active");
            return {
                cooldown: true,
                message: `Next match available in ${hours}h ${minutes}m`
            };
        }
    }

    // 2. Find Candidates (Excluding blocked, recent, self)
    // Note: In a real app, use aggregation for performance. Here doing in-memory for MVP logic clarity.
    const candidates = await User.find({
        uid: { $ne: currentUser.uid, $nin: [...currentUser.blockedUsers, ...currentUser.recentMatches] },
        // Simple filter to ensure they have completed onboarding
        firstName: { $exists: true }
    }).limit(50); // Fetch a pool to score

    console.log(`>>> Candidates Found: ${candidates.length}`);

    if (candidates.length === 0) {
        return { error: "No matching candidates found. Try again later!" };
    }

    // 3. Scoring Function
    const scoredCandidates = candidates.map(candidate => {
        let score = 0;

        // State (+10)
        if (candidate.homeState === currentUser.homeState) score += STATE_SCORE;

        // Language (+10)
        if (candidate.language === currentUser.language) score += LANGUAGE_SCORE;

        // Tags (+10, +20, +30)
        const commonTags = candidate.tags.filter((t: string) => currentUser.tags.includes(t));
        if (commonTags.length === 1) score += 10;
        else if (commonTags.length === 2) score += 20;
        else if (commonTags.length >= 3) score += 30;

        // Random (+0-20)
        score += Math.floor(Math.random() * RANDOM_SCORE_MAX);

        return { candidate, score };
    });

    // 4. Sort and Top 5
    scoredCandidates.sort((a, b) => b.score - a.score);
    const top5 = scoredCandidates.slice(0, 5);

    // 5. Randomize Top 5 -> Top 3
    const top3 = top5.sort(() => 0.5 - Math.random()).slice(0, 3);

    // 6. AI Analysis (Gemini)
    const finalCandidates = await Promise.all(top3.map(async (item) => {
        try {
            const prompt = `
            Task: Compatibility Score
            User Preference: "${currentUser.preference}"
            Candidate Introduction: "${item.candidate.introduction}"
            
            System Prompt: Analyze compatibility based on interests and vibe. Return ONLY a single number from 0 to 30. No text.
            `;

            const aiResponse = await generateContent(prompt);
            const aiScore = parseInt(aiResponse.trim()) || 0;

            return {
                ...item,
                aiScore: Math.min(aiScore, 30), // Cap at 30
                totalScore: item.score + Math.min(aiScore, 30)
            };
        } catch (e) {
            console.error("Gemini Error:", e);
            return { ...item, aiScore: 0, totalScore: item.score }; // Fallback
        }
    }));

    // 7. Select Winner
    finalCandidates.sort((a, b) => b.totalScore - a.totalScore);
    const winner = finalCandidates[0];

    // LOGGING FOR DEV
    console.log("\n=== MATCHMAKING SCORES ===");
    finalCandidates.forEach(c => {
        console.log(`User: ${c.candidate.userName} | Base: ${c.score} | AI: ${c.aiScore} | Total: ${c.totalScore}/100`);
    });
    console.log("Winner:", winner?.candidate.userName, "\n");

    if (!winner) return { error: "Matchmaking failed." };

    // 8. Execute Match
    const newChat = await ChatRoom.create({
        participants: [currentUser.uid, winner.candidate.uid],
        isActive: true,
        messages: []
    });

    // Update Users
    const now = new Date();
    await User.updateOne({ uid: currentUser.uid }, {
        lastMatchedAt: now,
        $push: { recentMatches: { $each: [winner.candidate.uid], $slice: -10 } }
    });
    await User.updateOne({ uid: winner.candidate.uid }, {
        // lastMatchedAt: now, // User requested cooldown only for initiator
        $push: { recentMatches: { $each: [currentUser.uid], $slice: -10 } }
    });

    return { success: true, roomId: newChat._id.toString(), matchScore: winner.totalScore };
}

export async function resetCooldownAction() {
    await connectDB();
    const session = await checkSessionAction();
    if (!session.isAuthenticated || !session.user) return { error: "Not authenticated" };

    await User.updateOne({ uid: session.user.uid }, {
        $set: { lastMatchedAt: null }
    });

    return { success: true };
}

export async function clearMatchHistoryAction() {
    await connectDB();
    const session = await checkSessionAction();
    if (!session.isAuthenticated || !session.user) return { error: "Not authenticated" };

    await User.updateOne({ uid: session.user.uid }, {
        $set: { recentMatches: [] }
    });

    return { success: true };
}
