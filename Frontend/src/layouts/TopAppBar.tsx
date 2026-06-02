import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const TopAppBar = ({ breadcrumbs = [], actionLabel = "", onAction }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const isAdmin = user?.role === "admin";
    const userName = user?.name || "User";
    const userEmail = user?.email || "";
    const userInitials = user?.name
        ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
        : "U";
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const closeDropdown = useCallback(() => setDropdownOpen(false), []);

    useEffect(() => {
        if (!dropdownOpen) return;
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) closeDropdown();
        };
        const handleKey = (e) => { if (e.key === "Escape") closeDropdown(); };
        document.addEventListener("mousedown", handleClick);
        window.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            window.removeEventListener("keydown", handleKey);
        };
    }, [dropdownOpen, closeDropdown]);

    const handleNav = (path) => {
        navigate(path);
        closeDropdown();
    };

    const handleLogout = () => {
    logout();
    navigate("/");
    };

    return (
        <header className="box-border flex flex-row justify-between items-center px-3 py-4 w-full h-16 bg-white/90 border-b border-slate-200 shadow-sm backdrop-blur-sm sticky top-0 z-10">
            <nav className="flex flex-row items-center h-10 gap-1" aria-label="Breadcrumb">
                <div className="flex items-center text-sm">
                    {breadcrumbs.map((crumb, index) => (
                        <span key={index} className={index === breadcrumbs.length - 1 ? "text-gray-900 font-semibold" : "text-gray-500"}>
                            {crumb}
                            {index < breadcrumbs.length - 1 && (
                                <svg className="w-4 h-4 mx-2 text-gray-400 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            )}
                        </span>
                    ))}
                </div>
            </nav>

            <div className="flex flex-row items-center gap-4">
                {isAdmin && actionLabel && onAction && (
                    <button type="button" onClick={onAction} className="flex flex-row items-center justify-center px-4 py-2 gap-2 h-10 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors font-['Poppins'] font-medium text-[14px] shadow-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>{actionLabel}</span>
                    </button>
                )}

                <div ref={dropdownRef} className="relative">
                    <button
                        type="button"
                        onClick={() => setDropdownOpen((v) => !v)}
                        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100 transition-all focus:outline-none"
                    >
                        <div className="flex items-center justify-center w-9 h-9 rounded-full overflow-hidden border border-slate-200">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={userName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-semibold">
                                    {userInitials}
                                </div>
                            )}
                        </div>
                        <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
                            {userName}
                        </span>
                        <ChevronDown size={14} className={`text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white shadow-lg py-2 z-50">
                            <div className="px-4 py-3 flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={userName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-semibold">
                                            {userInitials}
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                                    <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                                </div>
                                <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isAdmin ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}>
                                    {isAdmin ? "Admin" : "User"}
                                </span>
                            </div>

                            <div className="border-t border-slate-100 my-1" />

                            <button onClick={() => handleNav("/dashboard/profile")} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-slate-50 transition-colors text-left">
                                <User size={16} className="text-gray-400" />
                                Profile
                            </button>
                            <button onClick={() => handleNav("/dashboard/profile/settings")} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-slate-50 transition-colors text-left">
                                <Settings size={16} className="text-gray-400" />
                                Settings
                            </button>

                            <div className="border-t border-slate-100 my-1" />

                            <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left">
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default TopAppBar;
