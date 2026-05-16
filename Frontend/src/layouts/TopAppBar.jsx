import { useAuth } from "../context/AuthContext";

const TopAppBar = ({ breadcrumbs = [], actionLabel = '', onAction }) => {
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";
    const userName = user?.name || "User";
    const userInitials = user?.name 
        ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
        : "U";
    
    return (
        <header className="box-border flex flex-row justify-between items-center px-3 py-4 w-full h-16 bg-white/90 border-b border-slate-200 shadow-sm backdrop-blur-sm sticky top-0 z-10">

            <nav className="flex flex-row items-center h-10 gap-1" aria-label="Breadcrumb">
                <div className="flex items-center text-sm">
                    {breadcrumbs.map((crumb, index) => (
                        <span key={index} className={index === breadcrumbs.length - 1 ? 'text-gray-900 font-semibold' : 'text-gray-500'}>
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
                    <button type="button" onClick={onAction} className="flex flex-row items-center justify-center px-4 py-2 gap-2 h-10 bg-[#6200ea] hover:bg-[#5200c3] text-white rounded-lg transition-colors font-['Inter'] font-medium text-[14px] shadow-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>{actionLabel}</span>
                    </button>
                )}

                <button type="button" className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border border-slate-200 hover:ring-2 hover:ring-slate-300 transition-all focus:outline-none">
                    {user?.avatar ? (
                        <img
                            src={user.avatar}
                            alt={userName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-semibold">
                            {userInitials}
                        </div>
                    )}
                </button>

            </div>

        </header>
    );
};

export default TopAppBar;
