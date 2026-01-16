"use client";

import { resetCooldownAction } from "@/actions/match";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ResetPage() {
    const router = useRouter();

    const handleReset = async () => {
        const res = await resetCooldownAction();
        if (res.success) {
            toast.success("Cooldown reset successfully!");
            router.push("/dashboard");
        } else {
            toast.error("Failed to reset cooldown");
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-black text-white">
            <div className="flex flex-col items-center gap-4">
                <h1 className="text-2xl font-bold">Reset Match Cooldown</h1>
                <p className="text-neutral-400">This is a temporary page for testing.</p>
                <Button onClick={handleReset} size="lg" className="bg-red-600 hover:bg-red-700">
                    Reset Timer & Go to Dashboard
                </Button>
            </div>
        </div>
    );
}
