"use server";

import connectDB from "@/lib/db";
import { ChatRoom } from "@/models/ChatRoom";
import { User } from "@/models/User";
import { checkSessionAction } from "./auth";
import { revalidatePath } from "next/cache";

export async function getChatList() {
    await connectDB();
    const session = await checkSessionAction();
    if (!session.isAuthenticated || !session.user) return { error: "Not authenticated" };

    try {
        // Find active chats where user is a participant
        const chats = await ChatRoom.find({
            participants: session.user.uid,
            isActive: true
        }).sort({ updatedAt: -1 });

        // Enrich with participant details (the OTHER user)
        const enrichedChats = await Promise.all(chats.map(async (chat) => {
            const otherUserId = chat.participants.find((p: string) => p !== session.user!.uid);
            const otherUser = await User.findOne({ uid: otherUserId }).select("userName avatar");

            // Get last message
            const lastMessage = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null;

            return {
                id: chat._id.toString(),
                otherUser: otherUser ? {
                    uid: otherUser.uid,
                    userName: otherUser.userName,
                    avatar: otherUser.avatar,
                } : { userName: "Unknown User", avatar: "" },
                lastMessage: lastMessage ? {
                    content: lastMessage.content,
                    type: lastMessage.type,
                    timestamp: lastMessage.timestamp,
                    senderId: lastMessage.senderId
                } : null,
                updatedAt: chat.updatedAt
            };
        }));

        return { success: true, chats: enrichedChats };
    } catch (e) {
        console.error("Get Chats Error:", e);
        return { error: "Failed to fetch chats" };
    }
}

export async function getMessages(roomId: string) {
    await connectDB();
    const session = await checkSessionAction();
    if (!session.isAuthenticated || !session.user) return { error: "Not authenticated" };

    try {
        const chat = await ChatRoom.findOne({
            _id: roomId,
            participants: session.user.uid
        });

        if (!chat) return { error: "Chat not found" };

        return {
            success: true,
            messages: chat.messages.map((m: any) => ({
                id: m._id.toString(),
                senderId: m.senderId,
                content: m.content,
                type: m.type,
                timestamp: m.timestamp
            }))
        };
    } catch (e) {
        return { error: "Failed to fetch messages" };
    }
}

export async function sendMessageAction(roomId: string, content: string, type: 'text' | 'image' = 'text') {
    await connectDB();
    const session = await checkSessionAction();
    if (!session.isAuthenticated || !session.user) return { error: "Not authenticated" };

    try {
        const chat = await ChatRoom.findOne({
            _id: roomId,
            participants: session.user.uid,
            isActive: true
        });

        if (!chat) return { error: "Chat not found or inactive" };

        const newMessage = {
            senderId: session.user.uid,
            content,
            type,
            timestamp: new Date()
        };

        chat.messages.push(newMessage);
        const savedChat = await chat.save();
        const savedMessage = savedChat.messages[savedChat.messages.length - 1];

        if (!savedMessage) {
            return { error: "Failed to save message" };
        }

        revalidatePath(`/dashboard/history`);
        return {
            success: true,
            message: {
                senderId: newMessage.senderId,
                content: newMessage.content,
                type: newMessage.type,
                timestamp: newMessage.timestamp,
                _id: savedMessage._id!.toString()
            }
        };
    } catch (e) {
        console.error("Send Message Error:", e);
        return { error: "Failed to send message" };
    }
}

export async function endChatAction(roomId: string) {
    await connectDB();
    const session = await checkSessionAction();
    if (!session.isAuthenticated || !session.user) return { error: "Not authenticated" };

    try {
        const chat = await ChatRoom.findOne({
            _id: roomId,
            participants: session.user.uid
        });

        if (!chat) return { error: "Chat not found" };

        chat.isActive = false;
        chat.endedBy = session.user.uid;
        await chat.save();

        revalidatePath(`/dashboard/history`);
        return { success: true };
    } catch (e) {
        return { error: "Failed to end chat" };
    }
}

export async function blockUserAction(roomId: string, reason: string) {
    await connectDB();
    const session = await checkSessionAction();
    if (!session.isAuthenticated || !session.user) return { error: "Not authenticated" };

    try {
        const chat = await ChatRoom.findOne({
            _id: roomId,
            participants: session.user.uid
        });

        if (!chat) return { error: "Chat not found" };

        const otherUserId = chat.participants.find((p: string) => p !== session.user!.uid);
        if (!otherUserId) return { error: "Other user not found" };

        // Add to blocked users
        await User.updateOne({ uid: session.user.uid }, {
            $addToSet: { blockedUsers: otherUserId }
        });

        // Mark chat as inactive
        chat.isActive = false;
        chat.endedBy = session.user.uid;
        await chat.save();

        revalidatePath(`/dashboard/history`);
        return { success: true };
    } catch (e) {
        console.error("Block User Error:", e);
        return { error: "Failed to block user" };
    }
}
