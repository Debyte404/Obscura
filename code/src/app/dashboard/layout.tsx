import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0 min-h-screen">
          <div className="flex items-center gap-2 px-4 py-2">
            <SidebarTrigger className="-ml-1" />
          </div>
          <div className="flex-1 rounded-xl bg-neutral-900/50 min-h-full relative overflow-hidden">
             {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
