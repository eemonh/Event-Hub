/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useBreadcrumbs } from "../../context/BreadcrumbContext";
import { updateProfile } from "../../services/auth";
import { changePassword } from "../../services/auth";
import Input from "./Input";
import Button from "./Button";

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

  const toggleInterest = (cat: string) => {
    setInterests((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(token!, { name, interests });
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
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
      await changePassword(token!, currentPassword, newPassword);
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-12">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        <form onSubmit={handleSaveProfile}>
          <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Personal Information</h2>
            <hr className="border-gray-100 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 max-w-3xl">
              <Input
                label="Full Name"
                name="fullName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                register={undefined}
                fullWidth
              />
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2">Email Address</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-gray-600 text-sm focus:outline-none cursor-not-allowed disabled:opacity-60"
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
                <Button
                  key={cat}
                  type="button"
                  variant="tertiary"
                  size="sm"
                  onClick={() => toggleInterest(cat)}
                  className="rounded-full"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 flex justify-end">
            <Button type="submit" loading={saving} showTextWhileLoading size="md">Save Changes</Button>
          </div>
        </form>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        <form onSubmit={handleChangePassword}>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Change Password</h2>
          <hr className="border-gray-100 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 max-w-3xl">
            <Input
              label="Current Password"
              name="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              register={undefined}
              fullWidth
            />
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              register={undefined}
              fullWidth
            />
            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              register={undefined}
              fullWidth
            />
          </div>
          <div className="border-t border-gray-100 pt-6 mt-6 flex justify-end">
            <Button type="submit" loading={changingPassword} showTextWhileLoading size="md">Update Password</Button>
          </div>
        </form>
      </div>
    </main>
  );
}
