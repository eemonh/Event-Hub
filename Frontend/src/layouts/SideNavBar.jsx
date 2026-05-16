import { useNavigate, useLocation } from 'react-router-dom';
import {
    Briefcase,
    LayoutDashboard,
    CalendarDays,
    Shield,
    Users,
    UserCog,
    User,
    CalendarCheck,
    Bookmark,
    PlusCircle,
    ListTodo,
    Settings,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SideNavBar = ({ isOpen = true, onToggle }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { user, logout } = useAuth();
    const isAdmin = user?.role === "admin";

    const sections = [
        {
            label: "OVERVIEW",
            items: isAdmin
                ? [
                    { name: "Admin Dashboard", path: "/dashboard/admin", icon: Shield },
                ]
                : [
                    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
                ],
        },
        {
            label: "EVENTS",
            items: [
                { name: "All Events", path: "/dashboard/events", icon: CalendarDays },
                ...(isAdmin
                    ? []
                    : [
                        { name: "My Events", path: "/dashboard/events/my", icon: CalendarCheck },
                        { name: "Saved Events", path: "/dashboard/events/saved", icon: Bookmark },
                    ]),
                ...(isAdmin
                    ? [
                        { name: "Create Event", path: "/dashboard/events/create", icon: PlusCircle },
                        { name: "Event Management", path: "/dashboard/events/manage", icon: ListTodo },
                    ]
                    : []),
            ],
        },
        ...(isAdmin
            ? [
                {
                    label: "PEOPLE",
                    items: [
                        { name: "Users", path: "/dashboard/users", icon: Users },
                        { name: "Organizers", path: "/dashboard/organizers", icon: UserCog },
                    ],
                },
            ]
            : []),
        {
            label: "ACCOUNT",
            items: [
                { name: "Profile", path: "/dashboard/profile", icon: User },
                { name: "Settings", path: "/dashboard/profile/settings", icon: Settings },
            ],
        },
    ];

    return (
        <aside className={`box-border flex flex-col ${isOpen ? 'items-start p-3 gap-3 w-64' : 'items-center p-2 gap-3 w-16'} h-full bg-white border-r border-[#E2E8F0]`}>

            {/* Logo Section + Toggle */}
            <div className={`flex ${isOpen ? 'flex-row justify-between items-center w-full mb-4 mt-2' : 'flex-col items-center w-full mb-4 mt-2 gap-3'}`}>
                <div className={`flex items-center gap-2 ${isOpen ? 'flex-1 justify-center' : ''}`}>
                    {isOpen ? (
                        <>
                            <Briefcase size={32} strokeWidth={2.66667} className="text-primary" />
                            <span className="text-[20px] font-bold leading-7 tracking-[-0.5px] text-text-primary">
                                EventHub
                            </span>
                        </>
                    ) : (
                        <div className="w-8 h-8 rounded-md border-2 border-[#6200ea] flex items-center justify-center">
                            <Briefcase size={18} strokeWidth={2.66667} className="text-[#6200ea]" />
                        </div>
                    )}
                </div>

                <button onClick={onToggle} className="p-2 rounded-md hover:bg-slate-100" aria-label="Toggle sidebar">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Navigation Links */}
            <nav className={`flex flex-col w-full gap-1 flex-grow overflow-y-auto custom-scrollbar ${isOpen ? '' : 'items-center'}`}>
                {sections.map((section) => (
                    <div key={section.label} className="w-full">
                        {isOpen && (
                            <div className="px-4 py-2">
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                                    {section.label}
                                </span>
                            </div>
                        )}
                        <div className={`flex flex-col w-full gap-0.5 ${isOpen ? '' : 'items-center'}`}>
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                const isActive = item.path === '/dashboard'
                                    ? pathname === '/dashboard'
                                    : pathname === item.path || pathname.startsWith(item.path + '/');
                                return (
                                    <button
                                        key={item.name}
                                        onClick={() => navigate(item.path)}
                                        className={`flex items-center gap-3 ${isOpen ? 'px-4 py-3 w-full' : 'p-3 w-auto justify-center'} rounded-lg transition-colors duration-200
                                            ${
                                                isActive
                                                    ? `${isOpen ? 'bg-[#f3e5f5] text-[#6200ea] font-bold' : 'text-[#6200ea] bg-white ring-2 ring-[#6200ea]'}`
                                                    : 'bg-transparent text-[#4A4455] font-semibold hover:bg-slate-50'
                                            }
                                        `}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {isOpen && (
                                            <span className="font-['Inter'] text-[16px] leading-[12px] tracking-[0.6px]">
                                                {item.name}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Logout Button */}
            <button
                onClick={() => { logout(); navigate('/'); }}
                className={`flex ${isOpen ? 'flex-row justify-center items-center px-4 py-3 gap-2 w-full h-[50px]' : 'p-3 w-auto justify-center'} bg-[#d32f2f] text-white font-semibold rounded-lg hover:bg-[#b71c1c] transition-colors mt-auto`}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {isOpen && <span>Logout</span>}
            </button>

        </aside>
    );
};

export default SideNavBar;
