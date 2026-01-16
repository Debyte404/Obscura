"use client";

import { useState, useEffect } from "react";
import { getChatList, getMessages, sendMessageAction, endChatAction, blockUserAction } from "@/actions/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Send, Image as ImageIcon, MoreVertical, Ban, Loader2, ArrowLeft, ShieldAlert } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { checkSessionAction } from "@/actions/auth";

type Chat = {
    id: string;
    otherUser: {
        uid: string;
        userName: string;
        avatar: string;
    };
    lastMessage: {
        content: string;
        type: 'text' | 'image';
        timestamp: Date;
        senderId: string;
    } | null;
    updatedAt: Date;
};

type Message = {
    id: string;
    senderId: string;
    content: string; // text or base64
    type: 'text' | 'image';
    timestamp: Date;
};

export default function ChatHistoryPage() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loadingChats, setLoadingChats] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [inputText, setInputText] = useState("");
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [sending, setSending] = useState(false);

    // Initial Fetch
    useEffect(() => {
        const init = async () => {
            setLoadingChats(true);
            const session = await checkSessionAction();
            if (session.user) setCurrentUserId(session.user.uid);

            const res = await getChatList();
            if (res.success && res.chats) {
                setChats(res.chats as Chat[]);
            }
            setLoadingChats(false);
        };
        init();
    }, []);

    // Load messages when active chat changes
    useEffect(() => {
        if (!activeChat) return;
        const fetchMsgs = async () => {
            setLoadingMessages(true);
            const res = await getMessages(activeChat.id);
            if (res.success && res.messages) {
                setMessages(res.messages as Message[]);
            }
            setLoadingMessages(false);
        };
        fetchMsgs();
        
        // Simple polling for now
        const interval = setInterval(fetchMsgs, 5000);
        return () => clearInterval(interval);
    }, [activeChat]);

    const handleSendMessage = async () => {
        if ((!inputText.trim()) || !activeChat) return;

        setSending(true);
        // Optimistic update
        const tempId = Math.random().toString();
        const optimisticMsg: Message = {
            id: tempId,
            senderId: currentUserId!,
            content: inputText,
            type: 'text',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, optimisticMsg]);
        setInputText("");

        const res = await sendMessageAction(activeChat.id, optimisticMsg.content, 'text');
        
        if (!res.success) {
            toast.error("Failed to send");
            setMessages(prev => prev.filter(m => m.id !== tempId)); // Rollback
        } else {
            // Update the real message from server or just keep optimistic (re-fetch will sync)
             if (res.message) {
                 setMessages(prev => prev.map(m => m.id === tempId ? { ...res.message, id: res.message._id } as any : m));
             }
        }
        setSending(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !activeChat) return;

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result as string;
            setSending(true);
             const res = await sendMessageAction(activeChat.id, base64, 'image');
             if (res.success) {
                 // Refresh messages
                 const msgsRes = await getMessages(activeChat.id);
                 if (msgsRes.success && msgsRes.messages) setMessages(msgsRes.messages as Message[]);
             } else {
                 toast.error("Failed to upload image");
             }
             setSending(false);
        };
        reader.readAsDataURL(file);
    };

// ...

    const handleReportBlock = async () => {
        if (!activeChat) return;
        const reason = prompt("Please provide a reason for reporting (optional):");
        if (reason === null) return; // Cancelled

        if (!confirm("Are you sure? They will be blocked and you cannot match with them again.")) return;
        
        const res = await blockUserAction(activeChat.id, reason || "No reason provided");
        if (res.success) {
            toast.success("User blocked and reported");
            setChats(prev => prev.filter(c => c.id !== activeChat.id));
            setActiveChat(null);
        } else {
            toast.error("Failed to block user");
        }
    };

    const handleEndChat = async () => {
        if (!activeChat) return;
        if (!confirm("Are you sure you want to end this chat? You can match with them again in the future.")) return;

        const res = await endChatAction(activeChat.id);
        if (res.success) {
            toast.success("Chat ended");
            setChats(prev => prev.filter(c => c.id !== activeChat.id));
            setActiveChat(null);
        } else {
            toast.error("Failed to end chat");
        }
    };

    // Mobile view handling
    const [isMobileView, setIsMobileView] = useState(false); // Can double check with media query but keeping simple logic
    const showList = !activeChat;

    return (
        <div className="flex h-[85vh] w-full bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden shadow-2xl">
            {/* Sidebar List */}
            <div className={`${showList ? 'flex' : 'hidden md:flex'} w-full md:w-[350px] flex-col border-r border-white/10 bg-black/40`}>
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <h2 className="font-bold text-white text-lg">Messages</h2>
                </div>
                <ScrollArea className="flex-1">
                    {loadingChats ? (
                        <div className="flex items-center justify-center h-full py-10">
                            <Loader2 className="animate-spin text-neutral-500" />
                        </div>
                    ) : chats.length === 0 ? (
                        <div className="p-8 text-center text-neutral-500 text-sm">
                            No active chats. <br/> Use "Find Chat" to start!
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1 p-2">
                            {chats.map(chat => (
                                <button
                                    key={chat.id}
                                    onClick={() => setActiveChat(chat)}
                                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${activeChat?.id === chat.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
                                >
                                    <div className="relative">
                                        <Avatar>
                                            <AvatarImage src={chat.otherUser.avatar} />
                                            <AvatarFallback>{chat.otherUser.userName.substring(0,2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-white truncate">{chat.otherUser.userName}</span>
                                            {chat.lastMessage && (
                                                <span className="text-[10px] text-neutral-400">
                                                    {format(new Date(chat.lastMessage.timestamp), "HH:mm")}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-neutral-400 truncate">
                                            {chat.lastMessage 
                                                ? (chat.lastMessage.type === 'image' ? '📷 Image' : chat.lastMessage.content) 
                                                : 'Start chatting...'}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </div>

            {/* Chat Window */}
            {activeChat ? (
                <div className={`${!showList ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-neutral-900/10`}>
                    {/* Header */}
                    <div className="h-16 border-b border-white/10 flex items-center px-4 justify-between bg-black/40">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setActiveChat(null)}>
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={activeChat.otherUser.avatar} />
                                <AvatarFallback>{activeChat.otherUser.userName.substring(0,2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-bold text-white text-sm">{activeChat.otherUser.userName}</h3>
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white">
                                    <MoreVertical className="w-5 h-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-neutral-900 border-neutral-800 text-white">
                                <DropdownMenuItem className="text-red-500 hover:bg-red-900/30 cursor-pointer focus:bg-red-900/30 focus:text-red-500" onClick={handleEndChat}>
                                    <Ban className="w-4 h-4 mr-2" />
                                    End Conversation
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-500 hover:bg-red-900/30 cursor-pointer focus:bg-red-900/30 focus:text-red-500" onClick={handleReportBlock}>
                                    <ShieldAlert className="w-4 h-4 mr-2" />
                                    Report & Block
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4 bg-black">
                        <div className="flex flex-col gap-2">
                            {messages.map((msg, idx) => {
                                const isMe = msg.senderId === currentUserId;
                                const isLast = idx === messages.length - 1;
                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`
                                            max-w-[70%] px-4 py-2 shadow-sm text-sm
                                            ${isMe 
                                                ? 'bg-[#007AFF] text-white rounded-[20px] rounded-br-[4px]' 
                                                : 'bg-[#262628] text-[#E9E9EB] rounded-[20px] rounded-bl-[4px]'}
                                        `}>
                                            {msg.type === 'image' ? (
                                                <img src={msg.content} alt="Sent image" className="max-w-full max-h-[300px] object-contain rounded-lg" />
                                            ) : (
                                                <p className="leading-snug break-words whitespace-pre-wrap">{msg.content}</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            <div id="scroll-anchor" />
                        </div>
                    </ScrollArea>

                    {/* Input */}
                    <div className="p-3 bg-black flex items-center justify-center">
                         <div className="flex items-center gap-2 w-full max-w-4xl p-1 bg-[#1C1C1E] border border-[#3A3A3C] rounded-full px-2">
                            <label className="cursor-pointer p-2 hover:bg-white/10 rounded-full transition-colors text-[#8E8E93] hover:text-white">
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                <ImageIcon className="w-5 h-5" />
                            </label>
                            <Input 
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Message..."
                                className="flex-1 bg-transparent border-none text-white focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#8E8E93] h-9"
                            />
                            {inputText.trim() && (
                                <Button 
                                    onClick={handleSendMessage} 
                                    disabled={sending}
                                    size="icon"
                                    className="bg-[#007AFF] hover:bg-[#0071E3] text-white rounded-full h-8 w-8 shrink-0 transition-opacity"
                                >
                                    <Send className="w-4 h-4 ml-0.5" />
                                </Button>
                            )}
                         </div>
                    </div>
                </div>
            ) : (
                <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-black/20 text-neutral-500 gap-4">
                    <div className="bg-neutral-800/50 p-6 rounded-full">
                        <ArrowLeft className="w-12 h-12 opacity-20" />
                    </div>
                    <p>Select a conversation to start chatting</p>
                </div>
            )}
        </div>
    );
}
