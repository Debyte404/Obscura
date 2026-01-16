"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming we have this, else Input
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { updateProfileAction, generateAvatarAction } from "@/actions/profile";
import { checkSessionAction } from "@/actions/auth"; // Need to fetch initial data
import { Loader2, Sparkles, User as UserIcon } from "lucide-react";
import { PREDEFINED_TAGS } from "@/lib/constants"; 
// Note: We might need to fetch user data via a server component or action.
// Let's create a fetch action or use the props if passed (but this is a page).
// Ideally, use a Server Component to fetch data then pass to Client Form.
// For speed, I'll fetch in useEffect or swr.

import { getUserProfileAction } from "@/actions/profile"; // Need to create this one or reuse checkSession

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [generating, setGenerating] = useState(false);
    
    // Form State
    const [introduction, setIntroduction] = useState("");
    const [preference, setPreference] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [avatar, setAvatar] = useState("");
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const init = async () => {
            // We need a way to get full profile data. 
            // checkSessionAction gives basic User session, not full fields like intro/tags if minimal.
            // Let's rely on a helper action.
            const { getUserProfileAction } = await import("@/actions/profile");
            const res = await getUserProfileAction();
            
            if (res.error || !res.user) {
                toast.error("Failed to load profile");
                return;
            }
            
            setIntroduction(res.user.introduction || "");
            setPreference(res.user.preference || "");
            setTags(res.user.tags || []);
            setAvatar(res.user.avatar || "");
            setUserName(res.user.userName || "");
            setLoading(false);
        };
        init();
    }, []);

    const toggleTag = (tag: string) => {
        if (tags.includes(tag)) {
            setTags(tags.filter(t => t !== tag));
        } else {
            if (tags.length >= 5) {
                toast.error("Max 5 tags allowed");
                return;
            }
            setTags([...tags, tag]);
        }
    };

    const handleSave = async () => {
        if (tags.length !== 5) {
            toast.error("Please select exactly 5 tags.");
            return;
        }
        setSaving(true);
        const formData = new FormData();
        formData.append("introduction", introduction);
        formData.append("preference", preference);
        tags.forEach(t => formData.append("tags", t));

        const res = await updateProfileAction(formData);
        if (res.success) {
            toast.success("Profile updated!");
        } else {
            toast.error(res.error || "Failed to update");
        }
        setSaving(false);
    };

    const handleGenerateAvatar = async () => {
        if (avatar && avatar.length > 50) { // Crude check if already generated
            // Double check? Client side check
            if (!confirm("Your current avatar will be replaced properly only if it was a default. Proceed?")) return;
        }
        
        setGenerating(true);
        const res = await generateAvatarAction();
        if (res.success && res.avatarUrl) {
            setAvatar(res.avatarUrl);
            toast.success("Avatar generated!");
        } else {
            toast.error(res.error || "Failed");
        }
        setGenerating(false);
    };

    if (loading) return <div className="flex h-full w-full items-center justify-center text-white"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="h-full w-full p-4 overflow-y-auto bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 text-white">
            <div className="max-w-3xl mx-auto space-y-8 pb-10">
                
                {/* Header */}
                <div className="flex items-center gap-6">
                    <div className="relative group">
                         <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-500/30 bg-neutral-800 flex items-center justify-center">
                            {avatar ? (
                                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon className="w-12 h-12 text-neutral-500" />
                            )}
                         </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{userName}</h1>
                        <p className="text-neutral-400 text-sm">Customize your persona</p>
                        
                        <Button 
                            onClick={handleGenerateAvatar} 
                            disabled={generating || (!!avatar && avatar.includes("dicebear") && avatar.length > 60)}
                            className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 border-none text-white font-semibold"
                        >
                            {generating ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2 w-4 h-4" />}
                            {avatar && avatar.includes("dicebear") && avatar.length > 60 ? "Avatar Generated" : "Generate AI Avatar"}
                        </Button>
                        <p className="text-xs text-neutral-500 mt-1">*Can only be generated once.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Introduction */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-emerald-400">About Me (Introduction)</label>
                        <Textarea 
                            value={introduction}
                            onChange={(e) => setIntroduction(e.target.value)}
                            placeholder="Tell others about yourself..."
                            className="bg-neutral-900/50 border-white/10 min-h-[100px]"
                            maxLength={500}
                        />
                        <p className="text-xs text-right text-neutral-500">{introduction.length}/500</p>
                    </div>

                    {/* Preference */}
                    <div className="space-y-2">
                         <label className="text-sm font-medium text-emerald-400">Looking For (Preference)</label>
                        <Textarea 
                            value={preference}
                            onChange={(e) => setPreference(e.target.value)}
                            placeholder="What kind of connection do you want?"
                            className="bg-neutral-900/50 border-white/10 min-h-[100px]"
                            maxLength={500}
                        />
                        <p className="text-xs text-right text-neutral-500">{preference.length}/500</p>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-emerald-400 flex justify-between">
                            <span>Interests ({tags.length}/5)</span>
                        </label>
                        <div className="flex flex-wrap gap-2 p-4 bg-neutral-900/30 rounded-lg border border-white/5">
                            {PREDEFINED_TAGS.map(tag => (
                                <Badge 
                                    key={tag}
                                    variant={tags.includes(tag) ? "default" : "outline"}
                                    onClick={() => toggleTag(tag)}
                                    className={`cursor-pointer transition-all px-3 py-1 ${
                                        tags.includes(tag) 
                                        ? "bg-emerald-500 hover:bg-emerald-600 text-white border-transparent" 
                                        : "hover:bg-white/10 text-neutral-400 border-white/20"
                                    }`}
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-4 flex justify-end">
                        <Button 
                            onClick={handleSave} 
                            disabled={saving}
                            size="lg"
                            className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold w-full md:w-auto"
                        >
                            {saving ? <Loader2 className="animate-spin mr-2" /> : null}
                            Save Changes
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
}
