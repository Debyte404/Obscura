"use client";

import { LogOut } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function LogoutButton() {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = async () => {
    await logoutAction();
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative flex items-center justify-center h-10 rounded-full transition-all duration-300 ease-in-out overflow-hidden bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700",
        isHovered ? "w-32 bg-red-600 border-red-500" : "w-10"
      )}
    >
      <div className={cn("absolute flex items-center justify-center transition-all duration-300", isHovered ? "left-4" : "left-1/2 -translate-x-1/2")}>
        <LogOut size={18} />
      </div>
      <span
        className={cn(
          "absolute left-10 font-medium whitespace-nowrap transition-all duration-300",
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
        )}
      >
        Logout
      </span>
    </button>
  );
}
