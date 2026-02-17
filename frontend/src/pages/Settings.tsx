import { useState, useEffect } from 'react';
import { User, KeyRound, Check, ArrowLeft, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/common/Layout';
import { useAuthStore } from '../store/authStore';
import { apiService } from '../services/api.service';
import { checkinApiService } from '../services/checkin.service';

export const Settings = () => {
  const { user, logout } = useAuthStore();

  // Display name state
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Checkin config state
  const [checkinHour, setCheckinHour] = useState(20);
  const [checkinSaving, setCheckinSaving] = useState(false);
  const [checkinSuccess, setCheckinSuccess] = useState(false);

  useEffect(() => {
    checkinApiService.getConfig().then((config) => {
      setCheckinHour(config.notificationHour);
    }).catch(() => {});
  }, []);

  const handleCheckinSave = async () => {
    setCheckinSaving(true);
    setCheckinSuccess(false);
    try {
      await checkinApiService.updateConfig(checkinHour);
      setCheckinSuccess(true);
      setTimeout(() => setCheckinSuccess(false), 3000);
    } catch {
      // ignore
    } finally {
      setCheckinSaving(false);
    }
  };

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    setProfileSaving(true);
    setProfileError('');
    setProfileSuccess(false);

    try {
      const response = await apiService.put<{ user: { id: string; username: string; displayName: string } }>(
        '/auth/profile',
        { displayName: displayName.trim() }
      );
      // Update the auth store with new user data
      useAuthStore.setState((state) => ({
        user: state.user ? { ...state.user, displayName: response.user.displayName } : null,
      }));
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: any) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 4) {
      setPasswordError('New password must be at least 4 characters');
      return;
    }

    setPasswordSaving(true);

    try {
      await apiService.put('/auth/password', {
        currentPassword,
        newPassword,
      });
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <Layout>
      <div className="container-app py-8 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/map" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>

        {/* Profile Section */}
        <form onSubmit={handleProfileSave} className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={user?.username || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How should we call you?"
              maxLength={50}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
            />
          </div>

          {profileError && (
            <p className="text-sm text-red-600 mb-3">{profileError}</p>
          )}

          <button
            type="submit"
            disabled={profileSaving || !displayName.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 text-sm font-medium transition-colors"
          >
            {profileSuccess ? (
              <>
                <Check className="w-4 h-4" />
                Saved
              </>
            ) : (
              profileSaving ? 'Saving...' : 'Save'
            )}
          </button>
        </form>

        {/* Password Section */}
        <form onSubmit={handlePasswordChange} className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <KeyRound className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
          </div>

          <div className="mb-4">
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
            />
          </div>

          {passwordError && (
            <p className="text-sm text-red-600 mb-3">{passwordError}</p>
          )}

          <button
            type="submit"
            disabled={passwordSaving || !currentPassword || !newPassword || !confirmPassword}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 text-sm font-medium transition-colors"
          >
            {passwordSuccess ? (
              <>
                <Check className="w-4 h-4" />
                Changed
              </>
            ) : (
              passwordSaving ? 'Changing...' : 'Change Password'
            )}
          </button>
        </form>

        {/* Daily Check-in Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Daily Check-in</h2>
          </div>

          <div className="mb-4">
            <label htmlFor="checkinHour" className="block text-sm font-medium text-gray-700 mb-1">
              Reminder Time
            </label>
            <select
              id="checkinHour"
              value={checkinHour}
              onChange={(e) => setCheckinHour(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
            >
              {Array.from({ length: 24 }, (_, i) => {
                const hour12 = i === 0 ? 12 : i > 12 ? i - 12 : i;
                const ampm = i < 12 ? 'AM' : 'PM';
                return (
                  <option key={i} value={i}>
                    {hour12}:00 {ampm}
                  </option>
                );
              })}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              You'll receive a notification at this time if you haven't checked in yet.
            </p>
          </div>

          <button
            onClick={handleCheckinSave}
            disabled={checkinSaving}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 text-sm font-medium transition-colors"
          >
            {checkinSuccess ? (
              <>
                <Check className="w-4 h-4" />
                Saved
              </>
            ) : (
              checkinSaving ? 'Saving...' : 'Save'
            )}
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full py-3 text-red-600 hover:bg-red-50 rounded-xl border border-gray-200 text-sm font-medium transition-colors"
        >
          Logout
        </button>
      </div>
    </Layout>
  );
};
