import { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import SideNavBar from "./SideNavBar";
import TopAppBar from "./TopAppBar";
import useIsDesktop from "../hooks/useIsDesktop";
import { BreadcrumbProvider, useBreadcrumbs } from "../context/BreadcrumbContext";

function DashboardContent() {
  const isDesktop = useIsDesktop();
  const [sidebarOpen, setSidebarOpen] = useState(isDesktop);
  const { breadcrumbs, action } = useBreadcrumbs();

  const prevIsDesktop = useRef(isDesktop);
  useEffect(() => {
    if (prevIsDesktop.current !== isDesktop) {
      prevIsDesktop.current = isDesktop;
      setSidebarOpen(isDesktop);
    }
  }, [isDesktop]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] font-[Inter] text-slate-900">
      <SideNavBar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
      <div className="flex flex-1 flex-col">
        <TopAppBar breadcrumbs={breadcrumbs} actionLabel={action?.label ?? ''} onAction={action?.onClick ?? null} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <BreadcrumbProvider>
      <DashboardContent />
    </BreadcrumbProvider>
  );
}
