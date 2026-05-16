import { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import SideNavBar from "./SideNavBar";
import TopAppBar from "./TopAppBar";
import useIsDesktop from "../hooks/useIsDesktop";

export default function DashboardLayout() {
  const isDesktop = useIsDesktop();
  const [sidebarOpen, setSidebarOpen] = useState(isDesktop);

  const prevIsDesktop = useRef(isDesktop);
  useEffect(() => {
    if (prevIsDesktop.current !== isDesktop) {
      prevIsDesktop.current = isDesktop;
      setSidebarOpen(isDesktop);
    }
  }, [isDesktop]);

  return (
    <div className="flex min-h-screen bg-slate-50 font-[Inter] text-slate-900">
      <SideNavBar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
      <div className="flex flex-1 flex-col">
        <TopAppBar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
