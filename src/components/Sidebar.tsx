import React from 'react';

interface SidebarProps {
  isOpenMobile: boolean;
  setIsOpenMobile: (isOpen: boolean) => void;
  activeSection?: string;
  onSelectSection?: (section: string) => void;
  onShowToast: (msg: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpenMobile,
  setIsOpenMobile,
  activeSection = 'pipeline',
  onSelectSection,
  onShowToast,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-72 bg-surface-container-low shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Logo & School OS */}
          <div className="h-16 px-gutter flex items-center justify-between bg-surface-container-low border-b border-surface-container/40">
            <div className="flex items-center gap-space-sm">
              <img
                alt="EduPilot AI Logo"
                className="h-8 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1X-0Y1G-wgl5Ld900RZmOOKLGXCTDYXw4OvhGoSaVTbWaXQufMT2Dur3pFz-19BcUlG0f-qZ0J0OKslqQvwtyf2a4k5I-Pg3TCWF2w8I8J7lxaWz-yfn7blrbuXzW4A572OPZWrb3Nhf3OnKhT-V2-URGod8dd7LJ0O6oeLEp-1oRraKkLhxmmS7ub1GVo73bTSW7t33QQk4AvCgHT7GIUTNpBGCIBtSgyHvT1H9NP1Usu1j9KiHulDauQ"
              />
              <div className="flex flex-col">
                <span className="font-title-sm text-title-sm text-primary tracking-tight font-bold">EduPilot AI</span>
                <span className="font-label-sm text-label-sm text-secondary uppercase font-semibold">CBSE Academic OS</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpenMobile(false)}
              className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container cursor-pointer"
            >
              <span className="material-symbols-outlined text-body-lg">close</span>
            </button>
          </div>

          {/* School Badge */}
          <div className="px-gutter pt-space-md pb-space-xs">
            <div className="px-space-sm py-space-xs rounded-xl bg-surface-container flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-space-xs min-w-0">
                <span className="material-symbols-outlined text-secondary text-body-lg shrink-0">school</span>
                <span className="font-label-md text-label-md text-on-surface font-semibold truncate max-w-[145px]">
                  Delhi Public Academy
                </span>
              </div>
              <span className="px-space-xs py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold shrink-0">
                CBSE
              </span>
            </div>
          </div>

          {/* Navigation Links focused on Admission Assistant Suite */}
          <nav className="px-space-sm py-space-sm flex flex-col gap-space-xs">
            <div className="px-space-sm pt-space-sm pb-space-xs font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
              Admission Modules
            </div>

            {/* Active Admission Assistant Main Link */}
            <div
              onClick={() => {
                onSelectSection?.('pipeline');
                setIsOpenMobile(false);
              }}
              className="flex items-center gap-space-sm px-space-md py-space-sm rounded-xl transition-all bg-primary-container text-on-primary font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.08)] cursor-pointer"
            >
              <span className="material-symbols-outlined text-body-lg">person_add</span>
              <span className="font-body-md text-body-md flex-1">Admission Assistant</span>
              <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
            </div>

            {/* Sub-features for admissions */}
            <div className="pl-6 flex flex-col gap-1 pt-1">
              <button
                onClick={() => {
                  onSelectSection?.('pipeline');
                  setIsOpenMobile(false);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-body-sm text-body-sm text-left transition-colors cursor-pointer ${
                  activeSection === 'pipeline'
                    ? 'bg-surface-container text-primary font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-base">table_rows</span>
                <span>Enquiry Lead Matrix</span>
              </button>

              <button
                onClick={() => {
                  onSelectSection?.('bot');
                  setIsOpenMobile(false);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-body-sm text-body-sm text-left transition-colors cursor-pointer ${
                  activeSection === 'bot'
                    ? 'bg-surface-container text-primary font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-base">smart_toy</span>
                <span>WebBot Simulator</span>
              </button>

              <button
                onClick={() => {
                  onSelectSection?.('docs');
                  setIsOpenMobile(false);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-body-sm text-body-sm text-left transition-colors cursor-pointer ${
                  activeSection === 'docs'
                    ? 'bg-surface-container text-primary font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-base">verified_user</span>
                <span>Bot Grounding Base</span>
              </button>

              <button
                onClick={() => {
                  onSelectSection?.('templates');
                  setIsOpenMobile(false);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-body-sm text-body-sm text-left transition-colors cursor-pointer ${
                  activeSection === 'templates'
                    ? 'bg-surface-container text-primary font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-base">quick_phrases</span>
                <span>1-Click Templates</span>
              </button>
            </div>

            <div className="px-space-sm pt-space-md pb-space-xs font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
              Live Admission Stats
            </div>

            <div className="px-space-md py-2.5 rounded-xl bg-surface-container flex flex-col gap-1.5 text-on-surface">
              <div className="flex items-center justify-between text-label-sm">
                <span className="text-on-surface-variant">Active Counsellors</span>
                <span className="font-bold text-secondary">3 Online</span>
              </div>
              <div className="flex items-center justify-between text-label-sm">
                <span className="text-on-surface-variant">Avg First Response</span>
                <span className="font-bold text-primary">1.4s (Bot)</span>
              </div>
              <div className="flex items-center justify-between text-label-sm">
                <span className="text-on-surface-variant">Cycle Allotment</span>
                <span className="font-bold text-on-surface">56 / 75 Seats</span>
              </div>
            </div>
          </nav>
        </div>

        {/* Quota & Operational Status Footer */}
        <div className="p-gutter flex flex-col gap-space-sm border-t border-surface-container/30">
          <div className="p-space-md rounded-xl bg-surface-container-high shadow-xs">
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">Monthly AI Quota</span>
              <span className="font-data-tabular text-data-tabular text-primary font-bold">74% Used</span>
            </div>
            <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full w-3/4 transition-all"></div>
            </div>
            <div className="flex items-center justify-between mt-space-xs">
              <span className="font-label-sm text-label-sm text-outline font-medium">148k / 200k tokens</span>
              <span className="font-label-sm text-label-sm text-secondary font-bold">Tier 2</span>
            </div>
          </div>

          <div className="px-space-sm py-space-xs rounded-lg bg-surface-container flex items-center justify-between text-outline-variant">
            <div className="flex items-center gap-space-xs">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Gemini & Supabase</span>
            </div>
            <span className="font-label-sm text-label-sm text-secondary font-semibold">Operational</span>
          </div>
        </div>
      </aside>
    </>
  );
};
