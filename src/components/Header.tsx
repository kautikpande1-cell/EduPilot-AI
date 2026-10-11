import React, { useState } from 'react';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  academicYear: string;
  setAcademicYear: (ay: string) => void;
  onOpenNewLeadModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  searchQuery,
  setSearchQuery,
  academicYear,
  setAcademicYear,
  onOpenNewLeadModal,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [deskRole, setDeskRole] = useState<'Admissions Head' | 'Principal Admin' | 'Desk Counsellor'>('Principal Admin');

  const notifications = [
    {
      id: 1,
      title: 'Hot Admission Lead: Vikram Kapoor (Class 6)',
      time: '14m ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Callback Scheduled: Ananya Sen (Sat, 11:30 AM)',
      time: '42m ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Token Fee Received: Manish Gupta (₹68,000)',
      time: '1d ago',
      unread: false,
    },
  ];

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-gutter md:px-gutter-lg border-b border-surface-container/50">
      {/* Left: Mobile hamburger & Global Search */}
      <div className="flex items-center gap-space-md flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface cursor-pointer"
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined text-headline-sm">menu</span>
        </button>

        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-on-surface-variant text-body-lg pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-space-md bg-surface-container-lowest rounded-xl font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary shadow-[0_1px_2px_rgba(15,23,42,0.04)] border border-surface-container-high/60 transition-colors"
            placeholder="Search syllabus, lesson plans, students, leads..."
          />
        </div>

        {/* Academic Year Badge */}
        <button
          onClick={() => setAcademicYear(academicYear === 'AY 2024-25' ? 'AY 2025-26' : 'AY 2024-25')}
          title="Click to toggle academic session"
          className="hidden lg:flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-outline text-body-sm">event</span>
          <span className="font-label-md text-label-md font-semibold">{academicYear}</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-space-sm md:gap-space-md">
        {/* Role Switcher Pill */}
        <div className="hidden sm:flex items-center bg-surface-container-low p-0.5 rounded-full shadow-[0_1px_2px_rgba(15,23,42,0.04)] border border-surface-container-high/40">
          <button
            onClick={() => setDeskRole('Desk Counsellor')}
            className={`px-space-sm py-1 rounded-full font-label-sm text-label-sm transition-all cursor-pointer ${
              deskRole === 'Desk Counsellor'
                ? 'bg-primary font-semibold text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Teacher
          </button>
          <button
            onClick={() => setDeskRole('Principal Admin')}
            className={`px-space-sm py-1 rounded-full font-label-sm text-label-sm transition-all cursor-pointer ${
              deskRole === 'Principal Admin'
                ? 'bg-primary font-semibold text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Principal Admin
          </button>
          <button
            onClick={() => setDeskRole('Admissions Head')}
            className={`px-space-sm py-1 rounded-full font-label-sm text-label-sm transition-all cursor-pointer ${
              deskRole === 'Admissions Head'
                ? 'bg-primary font-semibold text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Student
          </button>
        </div>

        {/* Notifications Icon & Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-space-xs rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-headline-sm">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error ring-2 ring-surface"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-surface-container-lowest shadow-xl border border-surface-container-high p-space-md z-50">
              <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
                <span className="font-title-sm text-title-sm text-on-surface font-bold">Admissions Desk Alerts</span>
                <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
                  2 Pending
                </span>
              </div>
              <div className="divide-y divide-surface-container py-1 max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 px-1 hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <span className="font-label-md text-label-md text-on-surface font-semibold">{n.title}</span>
                      {n.unread && <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1"></span>}
                    </div>
                    <span className="font-label-sm text-label-sm text-outline mt-0.5 block">{n.time}</span>
                  </div>
                ))}
              </div>
              <div className="pt-space-xs border-t border-surface-container text-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-primary hover:underline font-label-sm text-label-sm font-semibold cursor-pointer"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="relative">
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-space-sm pl-space-xs cursor-pointer select-none"
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDD6JP-Wt1Q0SFFCy8JbM7or-n3nslRlHWm0apm3zcum2uGVsqBnkpJN4bvsVk_1w4TVSIrIm3EemOJGYt5rI313i3tpWu76nJwSsrQLUBG-fjjI16CYMyGEE8R9HDJbx9TADcw0BINymyO0X2Bi3n2yQJF-pTvDke69iKS0Ezn1X_YnXebflZAo345bUy9ILLrKidprQodcn6IYM3k_dWDRwbEVq83DaozEkqBev_7tZC9u3_mSggo7Q"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="font-title-sm text-title-sm text-on-surface leading-tight font-semibold">
                Dr. Rajesh Sharma
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Principal & Senior Academician
              </span>
            </div>
          </div>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-surface-container-lowest shadow-xl border border-surface-container-high p-space-sm z-50">
              <div className="p-2 border-b border-surface-container">
                <span className="font-title-sm text-title-sm font-bold text-on-surface block">Delhi Public Academy</span>
                <span className="font-label-sm text-label-sm text-outline">CBSE Centre #8412 • Dwarka</span>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    onOpenNewLeadModal();
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-on-surface hover:bg-surface-container rounded-lg font-body-sm text-body-sm flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-body-sm text-primary">add_circle</span>
                  <span>New Walk-in Enquiry</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
