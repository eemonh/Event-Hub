import React from 'react';
import { Plus, Info } from 'lucide-react';

export default function ProfileSettings() {
  return (
    <div className="p-8 max-w-[1400px] w-full mx-auto font-sans text-gray-900">
      
      {/* Top Page Action Bar */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-sm text-gray-500 font-medium">
          <span>Dashboard</span>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-900 font-semibold">Overview</span>
        </div>
        <button className="bg-[#6200ea] hover:bg-[#5200c3] text-white px-5 py-2.5 rounded-lg flex items-center text-sm font-semibold transition-colors shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Add New User
        </button>
      </div>

      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        
        {/* Personal Information Section */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Personal Information</h2>
          <hr className="border-gray-100 mb-6" />
          
          <div className="space-y-6 max-w-3xl">
            {/* Full Name Input */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2">
                Full Name
              </label>
              <input
                type="text"
                defaultValue="Alex Johnson"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#6200ea]/50 focus:border-[#6200ea] transition-all"
              />
            </div>

            {/* Email Address Input */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2">
                Email Address
              </label>
              <input
                type="email"
                defaultValue="alex.johnson@example.com"
                readOnly
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm focus:outline-none cursor-default"
              />
              <div className="flex items-center text-xs text-gray-500 mt-2">
                <Info className="w-3.5 h-3.5 mr-1.5" />
                <span>Email cannot be changed here. Contact support.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Change Password</h2>
          <hr className="border-gray-100 mb-6" />
          
          <div className="space-y-6 max-w-3xl">
            {/* Current Password Input */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2">
                Current Password
              </label>
              <input
                type="password"
                defaultValue="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#6200ea]/50 focus:border-[#6200ea] transition-all"
              />
            </div>

            {/* New Password Input */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2">
                New Password
              </label>
              <input
                type="password"
                defaultValue="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#6200ea]/50 focus:border-[#6200ea] transition-all"
              />
            </div>

            {/* Confirm New Password Input */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                defaultValue="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#6200ea]/50 focus:border-[#6200ea] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="border-t border-gray-100 pt-6 flex justify-end">
          <button className="bg-[#6200ea] hover:bg-[#5200c3] text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm">
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}