import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Plane, Heart, Target, Sparkles, Bell, BellOff, Settings, LogOut, CircleUserRound } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { notificationClientService } from '../../services/notification.service';

const navItems: { path: string; label: string; icon: ReactNode }[] = [
  { path: '/map', label: 'Map', icon: <MapPin className="w-5 h-5" /> },
  { path: '/vacations', label: 'Vacations', icon: <Plane className="w-5 h-5" /> },
  { path: '/timeline', label: 'Timeline', icon: <Heart className="w-5 h-5" /> },
  { path: '/score', label: 'Score', icon: <Target className="w-5 h-5" /> },
  { path: '/wishlist', label: 'Wishlist', icon: <Sparkles className="w-5 h-5" /> },
];

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [pushEnabled, setPushEnabled] = useState(notificationClientService.isSubscribed());
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPushEnabled(notificationClientService.isSubscribed());
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleTogglePush = async () => {
    if (pushEnabled) {
      const success = await notificationClientService.unsubscribe();
      if (success) setPushEnabled(false);
    } else {
      const success = await notificationClientService.requestPermissionAndSubscribe();
      if (success) setPushEnabled(true);
    }
  };

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
  };

  const displayName = user?.displayName || user?.username || '';

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-white shadow-sm">
        <div className="container-app">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-6">
              <Link to="/map" className="text-xl font-bold text-primary-600">
                Love Logger
              </Link>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center space-x-3">
              {notificationClientService.isSupported() && (
                <button
                  onClick={handleTogglePush}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-600"
                  title={pushEnabled ? 'Disable notifications' : 'Enable notifications'}
                >
                  {pushEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                </button>
              )}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-700"
                >
                  <CircleUserRound className="w-5 h-5" />
                  <span className="text-sm font-medium">{displayName}</span>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center text-xs gap-1 ${
                location.pathname === item.path
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-600'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between h-14 px-4">
          <h1 className="text-lg font-bold text-primary-600">Love Logger</h1>
          <div className="flex items-center space-x-1">
            {notificationClientService.isSupported() && (
              <button
                onClick={handleTogglePush}
                className="p-2 text-gray-600"
                title={pushEnabled ? 'Disable notifications' : 'Enable notifications'}
              >
                {pushEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
              </button>
            )}
            <Link
              to="/settings"
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <CircleUserRound className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
