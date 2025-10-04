import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/_components/sidebar/app-sidebar";
import AdminTopbar from "./admin-topbar";

export default function ClientAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 71)",
          "--header-height": "calc(var(--spacing) * 11)",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <main className="w-full">
        <div className="p-5 pl-4">
          <AdminTopbar />

          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
