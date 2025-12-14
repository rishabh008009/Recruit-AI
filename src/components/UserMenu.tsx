import { useState, useRef, useEffect } from 'react';
import { LogOut, User as UserIcon, Settings, ChevronDown } from 'lucide-react';
import { User } from '../types/auth';

interface UserMenuProps {
  user: User;
  onLogout: () => void;
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-9 h-9 rounded-full ring-2 ring-white/30"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-violet-500 text-white flex items-center justify-center text-sm font-bold ring-2 ring-white/30">
            {getInitials(user.name)}
          </div>
        )}
        <span className="text-sm font-semibold text-white hidden sm:block">
          {user.name}
        </span>
        <ChevronDown className={`w-4 h-4 text-white/70 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-neutral-100 py-2 z-[9999] overflow-hidden">
          {/* User Info */}
          <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 text-white flex items-center justify-center text-sm font-bold">
                  {getInitials(user.name)}
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-neutral-900">{user.name}</p>
                <p className="text-xs text-neutral-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
            >
              <UserIcon className="w-4 h-4" />
              Profile
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-neutral-100 pt-2 px-2">
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
