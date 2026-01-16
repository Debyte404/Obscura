"use client";

import Dither from "@/components/Dither";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Clock } from "lucide-react"; // Added icons
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { findMatchAction, clearMatchHistoryAction } from "@/actions/match";

export default function FindChatPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState<string | null>(null);

  const handleResetHistory = async () => {
    try {
      if(!confirm("Reset match history? You will be able to match with previous people again.")) return;
       const res = await clearMatchHistoryAction();
       if (res.success) {
           toast.success("History reset! You can now match again.");
           // setCooldown(null); // Optional: if you want to clear cooldown too
       } else {
           toast.error("Failed to reset history");
       }
    } catch (e) {
        toast.error("Error resetting history");
    }
  };

  const handleFindMatch = async () => {
    setLoading(true);
    setCooldown(null);

    try {
      const res = await findMatchAction();

      if (res.error) {
        toast.error(res.error);
      } else if (res.cooldown) {
        setCooldown(res.message || "Cooldown active");
        toast.info(res.message);
      } else if (res.success && res.roomId) {
        toast.success(`Match found! (${res.matchScore}% Match)`);
        router.push(`/dashboard/history`); // Ideally deep link to chat
      }
    } catch (error) {
       console.error(error);
       toast.error("Something went wrong. Please try again.");
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[85vh] flex items-center justify-center overflow-hidden rounded-xl">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <Dither
          waveSpeed={0.05}
          waveFrequency={3}
          waveAmplitude={0.3}
          waveColor={[0.1, 0.7, 0.8]} // Greenish hope tones
          colorNum={4}
          pixelSize={2}
          enableMouseInteraction={true}
          mouseRadius={0}
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center gap-6 p-8 bg-black/20 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-700">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold font-doto text-white tracking-tight drop-shadow-lg">
            Find Your Connection
          </h1>
          <p className="text-lg text-emerald-100/90 font-medium">
            Anonymous. Meaningful. Real.
          </p>
        </div>

        <Button
          size="lg"
          onClick={handleFindMatch}
          disabled={loading || !!cooldown}
          className="group relative px-8 py-8 text-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-white rounded-full shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] transition-all duration-300 transform hover:scale-105 border-none disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span className="flex items-center gap-3">
             {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : cooldown ? <Clock className="w-6 h-6" /> : <Sparkles className="w-6 h-6 animate-pulse" />}
             {loading ? "Analyzing..." : cooldown ? "Cooldown Active" : "Find Chat"}
          </span>
          {!loading && !cooldown && <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-white/40 animate-ping opacity-20 duration-2000" />}
        </Button>

        <p className="text-xs text-emerald-200/60 max-w-[250px] text-center font-mono">
            {cooldown ? cooldown : "Find a new chat once every 12 hours."}
        </p>

        <div className="flex gap-4 mt-2">
            <button
                onClick={handleResetHistory} 
                className="text-xs text-white/40 hover:text-white underline decoration-dotted transition-colors"
            >
                Reset History (Test)
            </button>
        </div>

      </div>
    </div>
  );
}
