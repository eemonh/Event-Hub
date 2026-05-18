/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useBreadcrumbs } from "../../context/BreadcrumbContext";
import { updateProfile } from "../../services/auth";
import { changePassword } from "../../services/auth";

const CATEGORIES = [
  "Technology", "Design", "Business", "Startup", "Music",
  "Arts", "Health", "Sports", "Education", "Food & Drink",
  "Networking", "Other",
];

export default function ProfileSettingsPage() {
  const { user, token } = useAuth();
  const { setBreadcrumbs, setAction } = useBreadcrumbs();

  const [name, setName] = useState(user?.name || "");
  const [interests, setInterests] = useState(user?.interests || []);
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setInterests(user.interests || []);
    }
  }, [user]);

  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Profile", "Settings"]);
    setAction(null);
  }, [setBreadcrumbs, setAction]);

  const toggleInterest = (cat) => {
    setInterests((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(token, { name, interests });
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    setChangingPassword(true);
    try {
      await changePassword(token, currentPassword, newPassword);
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        <form onSubmit={handleSaveProfile}>
          <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Personal Information</h2>
            <hr className="border-gray-100 mb-6" />
            <div className="space-y-6 max-w-3xl">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-700/50 focus:border-violet-700 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2">Email Address</label>
                <input
                  type="email"
                  value={user?.email || ""}
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

          <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Interests</h2>
            <hr className="border-gray-100 mb-6" />
            <p className="text-sm text-gray-500 mb-4">Select categories you're interested in. We'll recommend events based on your choices.</p>
            <div className="flex flex-wrap gap-3 max-w-3xl">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleInterest(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    interests.includes(cat)
                      ? "bg-violet-700 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-violet-700 hover:bg-violet-800 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        <form onSubmit={handleChangePassword}>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Change Password</h2>
          <hr className="border-gray-100 mb-6" />
          <div className="space-y-6 max-w-3xl">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-700/50 focus:border-violet-700 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-700/50 focus:border-violet-700 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-700/50 focus:border-violet-700 transition-all"
              />
            </div>
          </div>
          <div className="border-t border-gray-100 pt-6 mt-6 flex justify-end">
            <button
              type="submit"
              disabled={changingPassword}
              className="bg-violet-700 hover:bg-violet-800 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm disabled:opacity-50"
            >
              {changingPassword ? "Changing..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
