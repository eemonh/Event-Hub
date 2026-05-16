import React from 'react';
import { 
  LayoutGrid, 
  Calendar, 
  Users, 
  LogOut, 
  Plus, 
  ChevronRight 
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, isActive }) => (
  <div className={`flex items-center px-4 py-3 cursor-pointer transition-colors ${
    isActive 
      ? 'bg-[#f3e5f5] text-[#6200ea] font-semibold' 
      : 'text-gray-600 hover:bg-gray-50'
  }`}>
    <Icon className="w-5 h-5 mr-3" />
    <span className="text-sm">{label}</span>
  </div>
);

const Sidebar = () => (
  <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
    {/* Logo */}
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#6200ea] tracking-tight">EventHub</h1>
    </div>

    {/* Navigation */}
    <nav className="flex-1 mt-2">
      <SidebarItem icon={LayoutGrid} label="Dashboard" />
      <SidebarItem icon={Calendar} label="Events" isActive />
      <SidebarItem icon={Users} label="Users" />
    </nav>

    {/* Logout Button */}
    <div className="p-4 mt-auto">
      <button className="w-full flex items-center justify-center px-4 py-3 bg-[#d32f2f] text-white rounded-lg hover:bg-[#b71c1c] transition-colors font-semibold">
        <LogOut className="w-5 h-5 mr-2" />
        <span>Logout</span>
      </button>
    </div>
  </aside>
);

const TopBar = ({ breadcrumbs = [], actionLabel, onAction }) => (
  <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
    {/* Breadcrumbs */}
    <div className="flex items-center text-sm">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          <span className={index === breadcrumbs.length - 1 ? 'text-gray-900 font-semibold' : 'text-gray-500'}>
            {crumb}
          </span>
          {index < breadcrumbs.length - 1 && (
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          )}
        </React.Fragment>
      ))}
    </div>

    {/* Actions */}
    <div className="flex items-center space-x-4">
      {actionLabel && (
        <button 
          onClick={onAction}
          className="bg-[#6200ea] hover:bg-[#5200c3] text-white px-5 py-2 rounded-lg flex items-center text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          {actionLabel}
        </button>
      )}
      {/* User Avatar */}
      <div className="w-9 h-9 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center overflow-hidden">
        <img 
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
          alt="User Avatar" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  </header>
);

export default function MockupLayout({ children, breadcrumbs, actionLabel, onAction }) {
  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-gray-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          breadcrumbs={breadcrumbs} 
          actionLabel={actionLabel} 
          onAction={onAction} 
        />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1200px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
