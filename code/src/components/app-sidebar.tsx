"use client"

import { Calendar, Home, Inbox, Search, Settings, MessageCircle, Heart, Info, Globe, Menu } from "lucide-react"

import { cn } from "@/lib/utils"
 
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import Image from "next/image"

// Menu items.
const items = [
  {
    title: "Find Chat",
    url: "/dashboard",
    icon: Globe,
  },
  {
    title: "Chat History",
    url: "/dashboard/history",
    icon: MessageCircle,
  },
  {
    title: "About Us",
    url: "/about",
    icon: Info,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: Settings,
  },
]

export function AppSidebar() {
    const pathname = usePathname();
    const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon">
        <SidebarHeader className="flex flex-row items-center gap-2 py-4 h-16 transition-all">
             <div className="relative h-8 w-8 shrink-0">
                <Image src="/logo.png" alt="Obscura Logo" fill className="object-contain" />
             </div>
             {state === "expanded" && (
                <span className="font-bold text-2xl truncate">
                    <span className="text-red-400">Ob</span>
                    <span className="text-cyan-400">scura</span>
                </span>
             )}
        </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url || (item.url !== "/dashboard" && pathname?.startsWith(item.url))}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <div className="h-px bg-white/5 mx-2 my-2" />

              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === "/dashboard/therapy"}
                  className={cn(
                    "text-emerald-500/80 hover:text-emerald-400 hover:bg-neutral-800/50 data-[active=true]:bg-emerald-500/10 data-[active=true]:text-emerald-400"
                  )}
                >
                  <a href="/dashboard/therapy">
                    <Heart />
                    <span>Seek Therapy</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-white/5 mb-15 md:mb-3">
         <button 
            onClick={async () => {
                const { logoutAction } = await import("@/actions/auth");
                await logoutAction();
                window.location.href = "/login";
            }}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-neutral-800/50 rounded-lg transition-colors group"
         >
            <Home className="w-4 h-4 rotate-180" />
            <span className="group-hover:translate-x-1 transition-transform">Sign Out</span>
         </button>
      </SidebarFooter>
    </Sidebar>
  )
}
