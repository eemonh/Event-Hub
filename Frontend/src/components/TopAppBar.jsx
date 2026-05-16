import { useLocation, useNavigate } from 'react-router-dom';

const breadcrumbMap = {
  '/dashboard': 'Dashboard',
  '/dashboard/events': 'Events',
  '/dashboard/organizers': 'Organizers',
  '/dashboard/profile': 'Profile',
};

const TopAppBar = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const currentPage = breadcrumbMap[pathname] || 'Dashboard';

    return (
        <header className="box-border flex flex-row justify-between items-center px-3 py-4 w-full h-[73px] bg-white/90 border-b border-slate-200 shadow-sm backdrop-blur-sm sticky top-0 z-10">

            {/* Left Section: Breadcrumbs */}
            <nav className="flex flex-row items-center h-10 gap-1" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-1">
                    <li>
                        <span className="text-slate-900 font-['Inter'] text-[15px] font-semibold" aria-current="page">
                            {currentPage}
                        </span>
                    </li>
                </ol>
            </nav>

            {/* Right Section: Actions & Profile */}
            <div className="flex flex-row items-center gap-4">

                {/* Create Event Button */}
                <button onClick={() => navigate('/dashboard/events')} className="flex flex-row items-center justify-center px-4 py-2 gap-2 h-10 bg-[#15803D] hover:bg-green-800 text-white rounded-lg transition-colors font-['Inter'] font-medium text-[14px] shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Create Event</span>
                </button>

                {/* User Profile Avatar */}
                <button className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border border-slate-200 hover:ring-2 hover:ring-slate-300 transition-all focus:outline-none">
                    <img
                        src="https://ui-avatars.com/api/?name=User&background=F1F5F9&color=475569"
                        alt="User profile"
                        className="w-full h-full object-cover"
                    />
                </button>

            </div>

        </header>
    );
};

export default TopAppBar;