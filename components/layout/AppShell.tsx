import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";
import MobileBottomNav from "./MobileBottomNav";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Sidebar Desktop */}
      <AppSidebar />

      {/* Contenido principal */}
      <main className="
        min-h-screen
        pb-24
        md:ml-64
        md:pb-0
      ">
        <div className="
          mx-auto
          w-full
          max-w-7xl
          p-4
          sm:p-6
          lg:p-8
        ">
          {children}
        </div>
      </main>

      {/* Bottom Navigation Mobile */}
      <MobileBottomNav />

    </div>
  );
}