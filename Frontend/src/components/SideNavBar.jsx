import React, { useState } from 'react';

const SideNavBar = () => {
    const [activeItem, setActiveItem] = useState('Profile');

    const navItems = [
        { name: 'Dashboard', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
        { name: 'Events', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
        { name: 'Organizers', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
        { name: 'Profile', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
    ];

    return (
        <aside className="box-border flex flex-col items-start p-3 gap-3 relative w-[232px] h-screen min-h-[800px] bg-white border-r border-[#E2E8F0]">

            {/* Logo Section */}
            <div className="flex flex-col justify-center items-center gap-1 w-full h-[39px] mb-4 mt-2">
                <h1 className="w-full text-center font-bold text-2xl tracking-wide text-slate-800">
                    EventHub
                </h1>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col w-full gap-2 flex-grow">
                {navItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => setActiveItem(item.name)}
                        className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-colors duration-200 
              ${activeItem === item.name
                                ? 'bg-slate-100 text-[#4A4455] font-bold'
                                : 'bg-transparent text-[#4A4455] font-semibold hover:bg-slate-50'
                            }
            `}
                    >
                        {item.icon}
                        <span className="font-['Inter'] text-[16px] leading-[12px] tracking-[0.6px]">
                            {item.name}
                        </span>
                    </button>
                ))}
            </nav>

            {/* Logout Button */}
            <button className="flex flex-row justify-center items-center px-4 py-3 gap-2 w-full h-[50px] bg-[#BA1A1A] text-white font-semibold rounded-lg hover:bg-red-800 transition-colors mt-auto">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
            </button>

        </aside>
    );
};

export default SideNavBar;