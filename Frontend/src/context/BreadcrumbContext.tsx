/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from "react";
import type { Breadcrumb, BreadcrumbAction } from "../types/index";

interface BreadcrumbContextValue {
  breadcrumbs: Breadcrumb[];
  setBreadcrumbs: React.Dispatch<React.SetStateAction<Breadcrumb[]>>;
  action: BreadcrumbAction;
  setAction: React.Dispatch<React.SetStateAction<BreadcrumbAction>>;
}

const BreadcrumbContext = createContext<BreadcrumbContextValue | undefined>(undefined);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [action, setAction] = useState<BreadcrumbAction>({ label: "", onClick: null });
  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs, action, setAction }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumbs(): BreadcrumbContextValue {
  const ctx = useContext(BreadcrumbContext);
  if (!ctx) throw new Error("useBreadcrumbs must be used within BreadcrumbProvider");
  return ctx;
}
