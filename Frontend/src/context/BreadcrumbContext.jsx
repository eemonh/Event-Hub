/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const BreadcrumbContext = createContext();

export function BreadcrumbProvider({ children }) {
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [action, setAction] = useState({ label: '', onClick: null });
    return (
        <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs, action, setAction }}>
            {children}
        </BreadcrumbContext.Provider>
    );
}

export function useBreadcrumbs() {
    const ctx = useContext(BreadcrumbContext);
    if (!ctx) throw new Error('useBreadcrumbs must be used within BreadcrumbProvider');
    return ctx;
}
