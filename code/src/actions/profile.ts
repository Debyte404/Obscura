"use server";

import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { checkSessionAction } from "./auth";
import { revalidatePath } from "next/cache";
import { generateContent } from "@/lib/gemini";

export async function updateProfileAction(formData: FormData) {
    await connectDB();
    const session = await checkSessionAction();
    if (!session.isAuthenticated || !session.user) return { error: "Not authenticated" };

    const introduction = formData.get("introduction") as string;
    const preference = formData.get("preference") as string;
    const tags = formData.getAll("tags") as string[];

    if (!introduction || !preference || tags.length !== 5) {
        return { error: "Invalid input. Please fill all fields and select exactly 5 tags." };
    }

    try {
        await User.updateOne({ uid: session.user.uid }, {
            introduction,
            preference,
            tags
        });
        revalidatePath("/dashboard/profile");
        return { success: true, message: "Profile updated successfully!" };
    } catch (e) {
        return { error: "Failed to update profile" };
    }
}

async function verifyAvatar(url: string) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
        clearTimeout(timeoutId);
        return res.status === 200;
    } catch (e) {
        console.log("Avatar verification failed for:", url);
        return false;
    }
}

export async function generateAvatarAction() {
    await connectDB();
    const session = await checkSessionAction();
    if (!session.isAuthenticated || !session.user) return { error: "Not authenticated" };

    const user = await User.findOne({ uid: session.user.uid });
    if (!user) return { error: "User not found" };

    // Relaxed check to allow re-generation if broken
    if (user.avatar && user.avatar.includes("dicebear") && user.avatar.length > 80) {
        return { error: "Avatar already generated. You can only generate it once!" };
    }

    try {
        const prompt = `
        Task: Create a JSON configuration for a cartoon avatar (DiceBear Avataaars) based on this user persona.
        
        User Persona:
        - Gender: ${user.gender}
        - Tags: ${user.tags.join(", ")}
        - Self-Intro: "${user.introduction}"
        
        Mandatory Output JSON keys and allowed values:
        - top: [bigHair, bob, bun, curly, curvy, dreads, fro, hijab, longButNotTooLong, miaWallace, shavedSides, straight01, theCaesar, turban, winterHat1, hat]
        - accessories: [blank, kurt, prescription01, prescription02, round, sunglasses, wayfarers]
        - clothing: [blazerAndShirt, graphicShirt, hoodie, overall, shirtCrewNeck, shirtVNeck]
        - hairColor: [A55728, 2C1B18, B58143, D6B370, 724133, 4A312C, F59797, ECDCBF, C93305, E8E1E1]
        - skinColor: [FD9841, F8D25C, FFDBB4, EDB98A, D08B5B, AE5D29, 614335]
        - backgroundColor: [b6e3f4, d1d5db, ffd166, ef4444, 10b981, 3b82f6]

        Pick the most suitable values. Output ONLY the raw JSON.
        `;

        const aiResponse = await generateContent(prompt);
        const cleaned = aiResponse.replace(/```json/g, "").replace(/```/g, "").trim();
        console.log("Raw AI Response:", cleaned);

        let data;
        try {
            data = JSON.parse(cleaned);
        } catch {
            data = {};
        }

        const clean = (v: any) => typeof v === 'string' ? v.trim() : "";

        // Attempt 1: Strict Parameters
        const params = new URLSearchParams();
        if (data.top) params.append("top", clean(data.top));
        if (data.accessories && data.accessories !== 'blank' && data.accessories !== 'none') {
            params.append("accessories", clean(data.accessories));
        }
        if (data.clothing) params.append("clothing", clean(data.clothing));
        if (data.hairColor) params.append("hairColor", clean(data.hairColor).replace("#", ""));
        if (data.skinColor) params.append("skinColor", clean(data.skinColor).replace("#", ""));
        if (data.backgroundColor) params.append("backgroundColor", clean(data.backgroundColor).replace("#", ""));

        params.append("seed", user.uid); // Keep it unique

        let avatarUrl = `https://api.dicebear.com/9.x/avataaars/svg?${params.toString()}`;
        console.log("Trying primary URL:", avatarUrl);

        // Verify primary
        const isOk = await verifyAvatar(avatarUrl);

        if (!isOk) {
            console.log("Primary URL failed verification. Falling back to simple seed.");
            // Fallback: Simplest possible stable seed
            avatarUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.uid}&backgroundColor=b6e3f4`;
        }

        // Save
        user.avatar = avatarUrl;
        await user.save();

        revalidatePath("/dashboard/profile");
        revalidatePath("/dashboard");

        return { success: true, avatarUrl };

    } catch (e) {
        console.error("Avatar Gen Error:", e);
        // Last ditch fallback without AI
        const fallbackUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.uid}`;
        user.avatar = fallbackUrl;
        await user.save();
        return { success: true, avatarUrl: fallbackUrl };
    }
}

export async function getUserProfileAction() {
    await connectDB();
    const session = await checkSessionAction();
    if (!session.isAuthenticated || !session.user) return { error: "Not authenticated" };

    const user = await User.findOne({ uid: session.user.uid }).select("userName introduction preference tags avatar");
    if (!user) return { error: "User not found" };

    return {
        success: true,
        user: {
            userName: user.userName,
            introduction: user.introduction,
            preference: user.preference,
            tags: user.tags,
            avatar: user.avatar
        }
    };
}
