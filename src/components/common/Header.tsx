import React, { useState } from 'react';
import { useSiteFlow } from '../../context/SiteFlowContext';
import { 
  Bell, 
  Sun, 
  Moon, 
  Building2, 
  ChevronDown, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  ExternalLink
} from 'lucide-react';
import { UserRole, CurrencyCode } from '../../types';

export const Header: React.FC = () => {
  const { 
    selectedProjectId, 
    setSelectedProjectId, 
    projects, 
    theme, 
    toggleTheme, 
    currency, 
    setCurrency, 
    currentUser, 
    switchUserRole,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveTab,
    activeTab
  } = useSiteFlow();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const roles: UserRole[] = [
    'System Administrator',
    'Company Administrator',
    'Project Manager',
    'Site Engineer',
    'Quantity Surveyor',
    'Finance Officer',
    'Storekeeper',
    'Safety Officer',
    'Contractor'
  ];

  const currencies: CurrencyCode[] = ['KES', 'USD', 'EUR', 'GBP'];

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Zone 1: Brand & Active Project Context */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg tracking-tight shrink-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-base shadow-sm">
            SF
          </div>
          <span className="hidden sm:inline">SiteFlow</span>
        </div>

        <div className="h-5 w-px bg-slate-300 dark:bg-slate-700 hidden sm:block" />

        {/* Project Selector */}
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-400 shrink-0 hidden md:block" />
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="text-xs sm:text-sm font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 truncate max-w-[180px] sm:max-w-[280px]"
          >
            <option value="ALL">All Active Projects (Enterprise Overview)</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} · {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Zone 2: Navigation Breadcrumb / Context */}
      <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
        <span>SiteFlow</span>
        <span>/</span>
        <span className="capitalize text-slate-900 dark:text-slate-200">
          {activeTab.replace('-', ' ')}
        </span>
      </div>

      {/* Zone 3: Functional Utilities (Role, Currency, Theme, Notifications, Profile) */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Currency Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
          {currencies.map((curr) => (
            <button
              key={curr}
              onClick={() => setCurrency(curr)}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                currency === curr
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {curr}
            </button>
          ))}
        </div>

        {/* Role Simulator Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleSelector(!showRoleSelector)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 whitespace-nowrap"
            title="Switch Simulated Role for RBAC Demo"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden xl:inline">{currentUser.role}</span>
            <span className="xl:hidden">{currentUser.role.split(' ')[0]}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showRoleSelector && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-850 bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-2 z-50">
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                Simulate Role (RBAC)
              </div>
              <div className="max-h-60 overflow-y-auto">
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      switchUserRole(r);
                      setShowRoleSelector(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                      currentUser.role === r
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{r}</span>
                    {currentUser.role === r && <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Hub */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Site & System Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-850 bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Site Alerts & Activity
                  </span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                      ({unreadCount} new)
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">No notifications at this time.</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        if (n.linkTarget) {
                          setActiveTab(n.linkTarget);
                          setShowNotifications(false);
                        }
                      }}
                      className={`p-3.5 cursor-pointer transition-colors ${
                        !n.isRead
                          ? 'bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-100/40 dark:hover:bg-amber-950/30'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {n.severity === 'critical' ? (
                          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        ) : n.severity === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        ) : (
                          <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                              {n.title}
                            </span>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">
                              {n.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                            {n.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-amber-500/50 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
            {currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
          </div>
          <div className="hidden 2xl:block text-left leading-tight">
            <div className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[120px]">
              {currentUser.name}
            </div>
            <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
              {currentUser.department}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
