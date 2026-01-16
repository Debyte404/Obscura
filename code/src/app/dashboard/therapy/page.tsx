"use client";

import { useState, useEffect, useRef } from "react";
import { getTherapyResponseAction } from "@/actions/therapy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, Sparkles, RefreshCcw, Heart, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

type Message = {
    role: 'user' | 'model';
    content: string;
    timestamp: Date;
};

export default function TherapyPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial greeting
    useEffect(() => {
        const greeting: Message = {
            role: 'model',
            content: "Hello. I'm here for you. Is there anything on your mind today? Whether it's a small worry or something deeper, feel free to share. This space is entirely yours and completely private.",
            timestamp: new Date()
        };
        setMessages([greeting]);
    }, []);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputText.trim() || loading) return;

        const userMsg: Message = {
            role: 'user',
            content: inputText,
            timestamp: new Date()
        };

        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInputText("");
        setLoading(true);

        // Call Gemini
        // We only send the last few messages for context to keep it snappy and within limits
        const contextMessages = newMessages.slice(-10).map(m => ({
            role: m.role,
            content: m.content
        }));

        const res = await getTherapyResponseAction(contextMessages);

        if (res.success && res.response) {
            const aiMsg: Message = {
                role: 'model',
                content: res.response,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
        } else {
            toast.error(res.error || "Something went wrong.");
        }
        setLoading(false);
    };

    const resetSession = () => {
        if (confirm("Are you sure you want to end this session? All conversation data will be permanently cleared for your privacy.")) {
            const greeting: Message = {
                role: 'model',
                content: "Session cleared. I'm here whenever you're ready to talk again.",
                timestamp: new Date()
            };
            setMessages([greeting]);
            toast.success("Session reset");
        }
    };

    return (
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500 rounded-lg shadow-lg shadow-emerald-500/20">
                        <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white flex items-center gap-2">
                            Seek Therapy <Sparkles className="w-4 h-4 text-emerald-400" />
                        </h1>
                        <p className="text-xs text-emerald-400/80">A safe, private space with Gemini</p>
                    </div>
                </div>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetSession}
                    className="text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Reset
                </Button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 min-h-0 bg-neutral-900/30 rounded-2xl border border-white/5 backdrop-blur-md overflow-hidden flex flex-col shadow-2xl">
                <ScrollArea className="flex-1 p-6" viewportRef={scrollRef}>
                    <div className="space-y-6">
                        {messages.map((msg, i) => (
                            <div 
                                key={i} 
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                            >
                                <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-emerald-500 text-white rounded-br-none' 
                                    : 'bg-neutral-800 text-neutral-100 rounded-bl-none border border-white/5'
                                }`}>
                                    <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                    <p className={`text-[10px] mt-2 opacity-60 text-right`}>
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-neutral-800 px-4 py-3 rounded-2xl rounded-bl-none border border-white/5 flex items-center gap-2">
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                                    </div>
                                    <span className="text-xs text-neutral-400 ml-2">Therapist is thinking...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 bg-black/20 border-t border-white/5">
                    <div className="flex gap-2 items-center">
                        <Input 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Share what's on your mind..."
                            className="bg-neutral-800/50 border-white/10 h-12 rounded-xl focus-visible:ring-emerald-500"
                        />
                        <Button 
                            onClick={handleSendMessage} 
                            disabled={loading || !inputText.trim()}
                            className="h-12 w-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
                        </Button>
                    </div>
                    <p className="text-[10px] text-center text-neutral-500 mt-3 flex items-center justify-center gap-2">
                         <ShieldAlert className="w-3 h-3 text-emerald-500/50" />
                         Private session. This conversation is encrypted and NOT stored in any database.
                    </p>
                </div>
            </div>
            
            {/* Disclaimer */}
            <div className="text-[10px] text-neutral-500 text-center px-8">
                Disclaimer: This is an AI-powered supportive tool, not a substitute for professional medical advice, diagnosis, or treatment. 
                If you are in a crisis, please contact emergency services or a crisis hotline immediately.
            </div>
        </div>
    );
}
