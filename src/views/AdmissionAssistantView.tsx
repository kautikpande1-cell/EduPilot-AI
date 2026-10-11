import React, { useState } from 'react';
import { Lead, GroundingDoc, AdmissionTemplate } from '../types';
import { GROUNDING_DOCS, ADMISSION_TEMPLATES } from '../data/mockData';

interface AdmissionAssistantViewProps {
  leads: Lead[];
  onOpenScheduleModal: (parentName?: string, grade?: string) => void;
  onShowToast: (msg: string) => void;
  onOpenEmbedModal: () => void;
  onUpdateLead: (id: string, updates: Partial<Lead>) => void;
  onOpenCallLogModal: (lead: Lead) => void;
  onOpenGroundingDocsModal: () => void;
}

export const AdmissionAssistantView: React.FC<AdmissionAssistantViewProps> = ({
  leads,
  onOpenScheduleModal,
  onShowToast,
  onOpenEmbedModal,
  onUpdateLead,
  onOpenCallLogModal,
  onOpenGroundingDocsModal,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'visit' | 'converted' | 'lost'>('all');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // WebBot simulator state
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: 'bot' | 'user';
    text: string;
    time: string;
    isCustom?: boolean;
    data?: any;
  }>>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: 'Hello! Welcome to Delhi Public Academy admissions portal. How may I assist you with Class Pre-KG to Class 12 admissions today?',
      time: '10:14 AM',
    },
    {
      id: 'msg-2',
      sender: 'user',
      text: 'What is the annual fee for Class 6 and do you provide school bus from Rohini Sector 14?',
      time: '10:15 AM',
    },
  ]);
  const [botInputText, setBotInputText] = useState('');
  const [showSimulatedBooking, setShowSimulatedBooking] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<Lead | null>(null);

  // Template editor modal
  const [activeTemplate, setActiveTemplate] = useState<AdmissionTemplate | null>(null);
  const [templateCustomName, setTemplateCustomName] = useState('Vikram Kapoor');
  const [templateCustomGrade, setTemplateCustomGrade] = useState('Grade 6');

  // Filtering leads
  const filteredLeads = leads.filter((lead) => {
    const matchStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchGrade = gradeFilter === 'all' || lead.gradeKey === gradeFilter;
    const matchChannel = channelFilter === 'all' || lead.source === channelFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      lead.parentName.toLowerCase().includes(q) ||
      lead.studentName.toLowerCase().includes(q) ||
      lead.phone.includes(q) ||
      lead.grade.toLowerCase().includes(q) ||
      lead.notes.toLowerCase().includes(q);

    return matchStatus && matchGrade && matchChannel && matchSearch;
  });

  const handleCopyTemplate = (text: string, title: string) => {
    navigator.clipboard?.writeText(text);
    onShowToast(`${title} copied! Ready to paste into WhatsApp / Email.`);
  };

  const handleSendBotQuery = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = botInputText.trim();
    if (!q) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user' as const,
      text: q,
      time: 'Just now',
      isCustom: true,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setBotInputText('');

    setTimeout(() => {
      let botReply = `Under official Delhi Public Academy Policies: All admissions strictly adhere to CBSE circular & DOE age guidelines. For details regarding "${q}", please review our verified prospectus or connect with our admissions desk.`;

      const lowQ = q.toLowerCase();
      if (lowQ.includes('nursery') || lowQ.includes('age') || lowQ.includes('pre-kg')) {
        botReply = `Under NEP 2020 guidelines: Pre-KG & Nursery eligibility requires a minimum age of 3+ years as of March 31, 2025. Grade 1 requires 6+ years. Extended day-care and toddler discovery facilities operate till 4:00 PM with female caretakers.`;
      } else if (lowQ.includes('fee') || lowQ.includes('cost') || lowQ.includes('installment')) {
        botReply = `Annual Composite Fee: Grade 1-5 is ₹64,200/yr (₹16,050/quarter), Grade 6-8 is ₹78,400/yr (₹19,600/quarter), and Grade 9-12 is ₹86,000/yr. Sibling concession grants 15% tuition waiver for the second child.`;
      } else if (lowQ.includes('bus') || lowQ.includes('transport') || lowQ.includes('route')) {
        botReply = `Delhi Public Academy manages 18 AC GPS buses. Route #04 covers Rohini Sector 14, Sector 15 & Madhuban Chowk. Route #08 covers Dwarka Sector 6 to 14. All vehicles feature live GPS tracking in the Parent Mobile App.`;
      } else if (lowQ.includes('science') || lowQ.includes('jee') || lowQ.includes('neet') || lowQ.includes('stream')) {
        botReply = `Class 11 & 12 offer PCM, PCB, Commerce with Math/IP, and Humanities with Psychology. Integrated JEE/NEET faculty support and Atal Tinkering Lab sessions are held during regular school hours.`;
      } else if (lowQ.includes('document') || lowQ.includes('certificate') || lowQ.includes('apply')) {
        botReply = `Document Checklist: 1. Birth Certificate (Municipal), 2. Residence Proof (Aadhaar/Electricity bill), 3. Last 2 years Report Cards (for Grade 2+), 4. Transfer Certificate (TC) counter-signed by CBSE/state education officer.`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botReply,
          time: 'Just now',
          isCustom: true,
        },
      ]);
    }, 600);
  };

  const exportCsv = () => {
    const csvContent =
      'Parent Name,Student Name,Phone,Email,Grade,Channel,Lead Score,Status,Follow-up Staff,Notes\n' +
      filteredLeads
        .map(
          (l) =>
            `"${l.parentName}","${l.studentName}","${l.phone}","${l.email || ''}","${l.grade}","${l.sourceLabel}","${l.score}%","${l.statusLabel}","${l.staffName || 'Unassigned'}","${l.notes.replace(/"/g, '""')}"`
        )
        .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `DPA_Admission_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast(`Exported ${filteredLeads.length} leads to CSV successfully.`);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Navigation & Action Banner */}
      <div className="px-gutter-lg pt-space-lg pb-space-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-xs flex-wrap">
              <span className="px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                Admissions Suite
              </span>
              <span className="text-outline text-label-sm font-label-sm">/</span>
              <span className="text-on-surface-variant font-label-sm text-label-sm">Academic Cycle 2025-26</span>
              <span className="inline-flex items-center gap-1 ml-space-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-label-sm font-label-sm font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span> Live Bot Sync
              </span>
            </div>
            <div className="flex items-baseline gap-space-sm flex-wrap">
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                Admission Assistant & CRM Pipeline
              </h1>
              <span className="font-data-tabular text-data-tabular text-on-surface-variant">
                CBSE Affiliation #2730194
              </span>
            </div>
          </div>

          <div className="flex items-center gap-space-sm flex-wrap">
            <button
              onClick={exportCsv}
              className="px-space-md py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm transition-all flex items-center gap-space-xs shadow-xs cursor-pointer border border-surface-container-highest"
            >
              <span className="material-symbols-outlined text-body-lg">download</span>
              <span>Export Lead Log</span>
            </button>
            <button
              onClick={() => onOpenScheduleModal()}
              className="px-space-md py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-title-sm text-title-sm transition-all flex items-center gap-space-xs shadow-md cursor-pointer font-bold"
            >
              <span className="material-symbols-outlined text-body-lg">add_circle</span>
              <span>New Walk-in Enquiry</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="px-gutter-lg pb-space-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
          {/* KPI 1 */}
          <div
            onClick={() => setStatusFilter('all')}
            className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group border border-surface-container-high/40 cursor-pointer"
          >
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-125 transition-transform duration-500"></div>
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface-variant font-semibold">Total Enquiries</span>
                <span className="font-label-sm text-label-sm text-outline">This Month (April 2025)</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                <span className="material-symbols-outlined text-headline-sm">contact_page</span>
              </div>
            </div>
            <div className="mt-space-md flex items-baseline justify-between">
              <span className="font-display-lg text-display-lg text-on-surface font-bold">184</span>
              <div className="flex items-center gap-0.5 text-secondary font-label-md text-label-md font-semibold bg-secondary-container/40 px-2 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-body-sm font-bold">trending_up</span>
                <span>+22% YoY</span>
              </div>
            </div>
            <div className="mt-space-xs w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full w-[78%]"></div>
            </div>
          </div>

          {/* KPI 2 */}
          <div
            onClick={() => {
              const el = document.getElementById('bot-simulator-card');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group border border-surface-container-high/40 cursor-pointer"
          >
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-secondary/10 rounded-full group-hover:scale-125 transition-transform duration-500"></div>
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface-variant font-semibold">AI Chatbot Handled</span>
                <span className="font-label-sm text-label-sm text-outline">Autonomous Resolution</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
                <span className="material-symbols-outlined text-headline-sm">smart_toy</span>
              </div>
            </div>
            <div className="mt-space-md flex items-baseline justify-between">
              <span className="font-display-lg text-display-lg text-on-surface font-bold">142</span>
              <div className="flex items-center gap-0.5 text-secondary font-label-md text-label-md font-semibold bg-secondary-container/40 px-2 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-body-sm">check_circle</span>
                <span>77.2% closed</span>
              </div>
            </div>
            <div className="mt-space-xs text-body-sm font-body-sm text-on-surface-variant flex justify-between">
              <span>Trained on 24 docs</span>
              <span className="text-secondary font-semibold">1.4s avg response</span>
            </div>
          </div>

          {/* KPI 3 */}
          <div
            onClick={() => setStatusFilter('new')}
            className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group border border-surface-container-high/40 cursor-pointer"
          >
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-error/5 rounded-full group-hover:scale-125 transition-transform duration-500"></div>
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface-variant font-semibold">Pending Callbacks</span>
                <span className="font-label-sm text-label-sm text-outline">Counsellor Desk Queue</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-error-container flex items-center justify-center text-on-error-container">
                <span className="material-symbols-outlined text-headline-sm">phone_callback</span>
              </div>
            </div>
            <div className="mt-space-md flex items-baseline justify-between">
              <span className="font-display-lg text-display-lg text-on-surface font-bold">18</span>
              <div className="flex items-center gap-1 text-on-error-container font-label-md text-label-md font-bold bg-error-container px-2 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-body-sm">priority_high</span>
                <span>4 High Priority</span>
              </div>
            </div>
            <div className="mt-space-xs text-body-sm font-body-sm text-on-surface-variant flex justify-between">
              <span>Oldest waiting: 38m</span>
              <span className="text-primary font-semibold">3 Counsellors Active</span>
            </div>
          </div>

          {/* KPI 4 */}
          <div
            onClick={() => setStatusFilter('converted')}
            className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group border border-surface-container-high/40 cursor-pointer"
          >
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-tertiary/10 rounded-full group-hover:scale-125 transition-transform duration-500"></div>
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface-variant font-semibold">Projected Admissions</span>
                <span className="font-label-sm text-label-sm text-outline">Seat Allotment Pipeline</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
                <span className="material-symbols-outlined text-headline-sm">account_balance_wallet</span>
              </div>
            </div>
            <div className="mt-space-md flex items-baseline justify-between">
              <div className="flex items-baseline gap-1">
                <span className="font-display-lg text-display-lg text-on-surface font-bold">56</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Confirmed</span>
              </div>
              <div className="text-right">
                <span className="font-headline-sm text-headline-sm text-primary font-bold">₹44.8L</span>
                <span className="block font-label-sm text-label-sm text-outline">Est. Collections</span>
              </div>
            </div>
            <div className="mt-space-xs text-body-sm font-body-sm text-on-surface-variant flex justify-between">
              <span>Target: 75 seats</span>
              <span className="text-secondary font-semibold">74.6% achieved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dual-Pane Main Work Area */}
      <div className="px-gutter-lg pb-space-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* Pane A: Left 8 cols */}
          <div className="lg:col-span-8 flex flex-col gap-space-md">
            {/* Controls & Filter Toolbar */}
            <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm border border-surface-container-high/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-headline-sm">table_rows</span>
                  <h2 className="font-title-md text-title-md text-on-surface font-bold">Enquiry Lead Matrix</h2>
                  <span className="ml-space-xs px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-data-tabular text-data-tabular font-medium">
                    {filteredLeads.length} Leads Shown
                  </span>
                </div>
                {/* Search bar */}
                <div className="relative w-full sm:w-64">
                  <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-body-md">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search parent, phone, child..."
                    className="w-full h-8 pl-8 pr-2.5 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest transition-colors border border-surface-container-high"
                  />
                </div>
              </div>

              {/* Multi-tier Filter Ribbon */}
              <div className="pt-space-xs flex flex-wrap items-center gap-space-xs text-body-sm">
                <span className="font-label-sm text-label-sm text-outline uppercase font-semibold mr-1">Status:</span>
                {(['all', 'new', 'contacted', 'visit', 'converted', 'lost'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-full font-label-sm text-label-sm transition-all cursor-pointer ${
                      statusFilter === st
                        ? 'bg-primary text-on-primary font-bold shadow-xs'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    {st === 'all'
                      ? 'All'
                      : st === 'new'
                      ? 'New Lead'
                      : st === 'visit'
                      ? 'Campus Visit'
                      : st === 'contacted'
                      ? 'Contacted'
                      : st === 'converted'
                      ? 'Converted'
                      : 'Lost'}
                  </button>
                ))}

                <span className="text-outline-variant mx-1">|</span>
                <span className="font-label-sm text-label-sm text-outline uppercase font-semibold mr-1">Grade:</span>
                <select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  className="h-7 px-2 bg-surface-container-low rounded-lg font-label-sm text-label-sm text-on-surface focus:outline-none cursor-pointer border border-surface-container-high"
                >
                  <option value="all">All Grades</option>
                  <option value="pre-kg">Pre-KG / Nursery</option>
                  <option value="grade-1">Grade 1</option>
                  <option value="grade-6">Grade 6</option>
                  <option value="grade-9">Grade 9</option>
                  <option value="grade-11-sci">Grade 11 (Science)</option>
                </select>

                <span className="font-label-sm text-label-sm text-outline uppercase font-semibold mr-1 ml-2">Channel:</span>
                <select
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value)}
                  className="h-7 px-2 bg-surface-container-low rounded-lg font-label-sm text-label-sm text-on-surface focus:outline-none cursor-pointer border border-surface-container-high"
                >
                  <option value="all">All Channels</option>
                  <option value="bot">Website AI Chat</option>
                  <option value="whatsapp">WhatsApp Inbound</option>
                  <option value="walkin">Walk-in Campus</option>
                  <option value="google">Google Ads</option>
                </select>
              </div>
            </div>

            {/* CRM Leads Table */}
            <div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden flex flex-col border border-surface-container-high/40">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider select-none border-b border-surface-container-high">
                      <th className="py-3 px-space-md font-semibold">Enquirer & Student</th>
                      <th className="py-3 px-space-md font-semibold">Grade</th>
                      <th className="py-3 px-space-md font-semibold">Lead Score</th>
                      <th className="py-3 px-space-md font-semibold">AI Interaction & Bot Memory</th>
                      <th className="py-3 px-space-md font-semibold">Follow-Up Staff</th>
                      <th className="py-3 px-space-md font-semibold text-right">Quick Dispatch</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-high/40 text-body-sm font-body-sm text-on-surface">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-surface-container-low/60 transition-colors group">
                        {/* Parent & Student */}
                        <td className="py-3.5 px-space-md">
                          <div className="flex items-center gap-space-sm">
                            <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center font-title-sm text-title-sm text-on-primary-fixed font-bold shrink-0">
                              {lead.initials}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-title-sm text-title-sm text-on-surface font-semibold group-hover:text-primary transition-colors">
                                {lead.parentName}
                              </span>
                              <div className="flex items-center gap-1.5 text-on-surface-variant font-data-tabular text-data-tabular">
                                <span className="material-symbols-outlined text-body-sm text-outline">call</span>
                                <span>{lead.phone}</span>
                              </div>
                              <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1 mt-0.5">
                                <span className="material-symbols-outlined text-label-sm">
                                  {lead.source === 'bot'
                                    ? 'smart_toy'
                                    : lead.source === 'whatsapp'
                                    ? 'forum'
                                    : lead.source === 'walkin'
                                    ? 'hiking'
                                    : 'ads_click'}
                                </span>
                                {lead.sourceLabel} • {lead.timeAgo}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Grade */}
                        <td className="py-3.5 px-space-md">
                          <span className="px-2 py-0.5 rounded-md bg-surface-container font-label-md text-label-md text-on-surface font-medium whitespace-nowrap">
                            {lead.grade}
                          </span>
                          <span className="block font-label-sm text-label-sm text-outline mt-0.5">{lead.studentName}</span>
                        </td>

                        {/* Score */}
                        <td className="py-3.5 px-space-md">
                          <div className="flex flex-col gap-1">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-label-sm text-label-sm font-bold w-fit ${
                                lead.scoreType === 'HOT'
                                  ? 'bg-error-container text-on-error-container'
                                  : lead.scoreType === 'WARM'
                                  ? 'bg-secondary-container text-on-secondary-container'
                                  : lead.scoreType === 'CONVERTED'
                                  ? 'bg-secondary-container text-on-secondary-container'
                                  : lead.scoreType === 'MILD'
                                  ? 'bg-surface-container text-on-surface-variant'
                                  : 'bg-surface-container-high text-outline'
                              }`}
                            >
                              {lead.scoreType === 'HOT' && (
                                <span className="material-symbols-outlined text-label-sm">local_fire_department</span>
                              )}
                              {lead.scoreType === 'WARM' && (
                                <span className="material-symbols-outlined text-label-sm">wb_sunny</span>
                              )}
                              {lead.scoreType === 'CONVERTED' && (
                                <span className="material-symbols-outlined text-label-sm">verified</span>
                              )}
                              {lead.scoreType === 'MILD' && (
                                <span className="material-symbols-outlined text-label-sm">thermostat</span>
                              )}
                              {lead.scoreType} {lead.scoreType !== 'CONVERTED' && lead.scoreType !== 'LOST' ? `• ${lead.score}%` : ''}
                            </span>
                            <span className="font-label-sm text-label-sm text-outline">{lead.scoreBadge}</span>
                          </div>
                        </td>

                        {/* Bot Memory */}
                        <td className="py-3.5 px-space-md max-w-xs">
                          <div className="p-2 rounded-lg bg-surface-container/60 flex flex-col gap-1">
                            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                              "{lead.notes}"
                            </p>
                            {lead.callbackBadge && (
                              <span className="font-label-sm text-label-sm text-primary font-semibold flex items-center gap-1">
                                <span className="material-symbols-outlined text-label-sm">alarm</span>
                                {lead.callbackBadge}
                              </span>
                            )}
                            {lead.tourBadge && (
                              <span className="font-label-sm text-label-sm text-secondary font-semibold flex items-center gap-1">
                                <span className="material-symbols-outlined text-label-sm">event_available</span>
                                {lead.tourBadge}
                              </span>
                            )}
                            {lead.receiptBadge && (
                              <span className="font-label-sm text-label-sm text-outline flex items-center gap-1">
                                <span className="material-symbols-outlined text-label-sm">receipt_long</span>
                                {lead.receiptBadge}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Follow up staff */}
                        <td className="py-3.5 px-space-md">
                          {lead.staffName ? (
                            <div className="flex flex-col">
                              <span className="font-label-md text-label-md font-semibold text-on-surface">{lead.staffName}</span>
                              <span className="font-label-sm text-label-sm text-on-surface-variant">{lead.staffRole}</span>
                              {lead.staffStatus && (
                                <span
                                  className={`mt-1 px-1.5 py-0.5 rounded font-label-sm text-label-sm font-semibold w-fit ${
                                    lead.isUrgent
                                      ? 'bg-error/10 text-error'
                                      : lead.status === 'visit'
                                      ? 'bg-secondary-container text-on-secondary-container'
                                      : 'bg-surface-container text-on-surface-variant'
                                  }`}
                                >
                                  {lead.staffStatus}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-col">
                              <span className="font-label-md text-label-md font-semibold text-outline italic">Unassigned</span>
                              <button
                                onClick={() => {
                                  onUpdateLead(lead.id, { staffName: 'Dr. Rajesh Sharma', staffRole: 'Principal Admin', staffStatus: 'Claimed' });
                                  onShowToast(`Lead for ${lead.parentName} successfully claimed by Dr. Rajesh Sharma`);
                                }}
                                className="mt-1 px-2 py-0.5 rounded bg-primary text-on-primary font-label-sm text-label-sm font-semibold hover:bg-primary-container transition-all w-fit cursor-pointer"
                              >
                                Claim Lead
                              </button>
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-space-md text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => onOpenCallLogModal(lead)}
                              className="p-1.5 rounded-lg hover:bg-surface-container text-primary transition-colors cursor-pointer"
                              title="Log Direct Call"
                            >
                              <span className="material-symbols-outlined text-headline-sm">call</span>
                            </button>
                            <button
                              onClick={() => onShowToast(`WhatsApp digital brochure with fee schedule dispatched to ${lead.parentName}`)}
                              className="p-1.5 rounded-lg hover:bg-secondary-container text-secondary transition-colors cursor-pointer"
                              title="Send WhatsApp Brochure"
                            >
                              <span className="material-symbols-outlined text-headline-sm">chat</span>
                            </button>
                            <button
                              onClick={() => onOpenScheduleModal(lead.parentName, lead.grade)}
                              className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                              title="Schedule Campus Tour"
                            >
                              <span className="material-symbols-outlined text-headline-sm">calendar_month</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Bottom Bar */}
              <div className="px-space-md py-space-sm bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-xs text-body-sm border-t border-surface-container-high/50">
                <span className="font-data-tabular text-data-tabular text-on-surface-variant">
                  Showing 1 to {filteredLeads.length} of 184 inquiries recorded
                </span>
                <div className="flex items-center gap-space-xs">
                  <button
                    disabled={activePage === 1}
                    onClick={() => setActivePage(Math.max(1, activePage - 1))}
                    className="px-2.5 py-1 rounded-lg bg-surface-container text-outline hover:text-on-surface disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-body-md align-middle">chevron_left</span>
                  </button>
                  <button
                    onClick={() => setActivePage(1)}
                    className={`px-2.5 py-1 rounded-lg font-data-tabular text-data-tabular font-semibold cursor-pointer ${
                      activePage === 1 ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    1
                  </button>
                  <button
                    onClick={() => setActivePage(2)}
                    className={`px-2.5 py-1 rounded-lg font-data-tabular text-data-tabular transition-colors cursor-pointer ${
                      activePage === 2 ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    2
                  </button>
                  <button
                    onClick={() => setActivePage(3)}
                    className={`px-2.5 py-1 rounded-lg font-data-tabular text-data-tabular transition-colors cursor-pointer ${
                      activePage === 3 ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    3
                  </button>
                  <span className="px-1 text-outline font-data-tabular text-data-tabular">...</span>
                  <button
                    onClick={() => setActivePage(16)}
                    className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high font-data-tabular text-data-tabular transition-colors cursor-pointer"
                  >
                    16
                  </button>
                  <button
                    onClick={() => setActivePage(Math.min(16, activePage + 1))}
                    className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-body-md align-middle">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Copyable Admission Communication Templates */}
            <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm border border-surface-container-high/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-secondary text-headline-sm">quick_phrases</span>
                  <h3 className="font-title-md text-title-md text-on-surface font-bold">
                    1-Click Admission Templates for Counsellors
                  </h3>
                </div>
                <span className="font-label-sm text-label-sm text-outline">Click card to copy text</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
                {ADMISSION_TEMPLATES.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    onClick={() => handleCopyTemplate(tmpl.content, tmpl.title)}
                    className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container cursor-pointer transition-all flex flex-col justify-between group border border-surface-container-high/40"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-label-sm text-label-sm ${tmpl.colorClass} font-bold uppercase`}>
                          {tmpl.badgeText}
                        </span>
                        <span className="material-symbols-outlined text-outline group-hover:text-primary text-body-md">
                          content_copy
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">
                        "{tmpl.content}"
                      </p>
                    </div>
                    <span className="mt-2 text-label-sm font-label-sm text-secondary font-semibold group-hover:underline">
                      {tmpl.ctaText}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pane B: Right 4 cols */}
          <div className="lg:col-span-4 flex flex-col gap-space-md">
            {/* Knowledge Base Grounding Card */}
            <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm border border-surface-container-high/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-secondary text-headline-sm">verified_user</span>
                  <div>
                    <h3 className="font-title-md text-title-md text-on-surface font-bold leading-tight">Bot Grounding Base</h3>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">24 Verified Institutional Documents</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">
                  100% Synced
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                EduPilot AI guarantees zero hallucinations by answering queries strictly via these active administrative guidelines:
              </p>

              {/* Document Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {GROUNDING_DOCS.slice(0, 5).map((doc) => (
                  <div
                    key={doc.id}
                    onClick={onOpenGroundingDocsModal}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md shadow-2xs transition-colors border border-surface-container-high/40 cursor-pointer"
                    title="Click to view details"
                  >
                    <span className="material-symbols-outlined text-body-sm text-primary">{doc.icon}</span>
                    <span className="truncate max-w-[170px]">{doc.title}</span>
                    <span className="material-symbols-outlined text-secondary text-body-sm">check_circle</span>
                  </div>
                ))}

                <button
                  onClick={onOpenGroundingDocsModal}
                  className="px-2 py-1 rounded-lg bg-surface-container text-primary hover:bg-surface-container-high font-label-sm text-label-sm font-semibold transition-colors cursor-pointer"
                >
                  +19 More Docs
                </button>
              </div>
            </div>

            {/* Live Website Bot Simulator (Interactive Widget) */}
            <div id="bot-simulator-card" className="rounded-xl bg-surface-container-lowest shadow-md overflow-hidden flex flex-col border border-surface-container-high">
              {/* Bot Window Header */}
              <div className="p-space-sm bg-primary text-on-primary flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-on-primary/10 flex items-center justify-center text-on-primary">
                      <span className="material-symbols-outlined text-headline-sm">smart_toy</span>
                    </div>
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-secondary ring-2 ring-primary"></span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-title-sm text-title-sm font-semibold leading-tight">EduPilot WebBot Preview</span>
                    <span className="font-label-sm text-label-sm text-primary-fixed-dim">Simulating School Portal Widget</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="px-1.5 py-0.5 rounded bg-primary-container text-on-primary font-label-sm text-label-sm uppercase font-bold">
                    RAG Mode
                  </span>
                  <button
                    onClick={() => {
                      setChatMessages([
                        {
                          id: 'msg-1',
                          sender: 'bot',
                          text: 'Hello! Welcome to Delhi Public Academy admissions portal. How may I assist you with Class Pre-KG to Class 12 admissions today?',
                          time: '10:14 AM',
                        },
                        {
                          id: 'msg-2',
                          sender: 'user',
                          text: 'What is the annual fee for Class 6 and do you provide school bus from Rohini Sector 14?',
                          time: '10:15 AM',
                        },
                      ]);
                      setShowSimulatedBooking(false);
                      onShowToast('Bot simulator reset to initial state.');
                    }}
                    title="Reset Simulator"
                    className="p-1 rounded hover:bg-primary-container text-primary-fixed transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-body-md">restart_alt</span>
                  </button>
                </div>
              </div>

              {/* Chat Conversation Scroll Area */}
              <div className="p-space-md bg-surface-container-low/40 h-[380px] overflow-y-auto flex flex-col gap-space-sm font-body-sm text-body-sm">
                {/* Initial Greetings & Exchange */}
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-space-xs ${
                      msg.sender === 'user' ? 'justify-end self-end max-w-[88%]' : 'max-w-[92%]'
                    }`}
                  >
                    {msg.sender === 'bot' && (
                      <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-label-md">smart_toy</span>
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-2xl ${
                        msg.sender === 'user'
                          ? 'rounded-tr-none bg-primary text-on-primary shadow-xs'
                          : 'rounded-tl-none bg-surface-container-lowest text-on-surface shadow-xs border border-surface-container-high/40'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span
                        className={`block mt-1 font-data-tabular text-label-sm ${
                          msg.sender === 'user' ? 'text-primary-fixed-dim text-right' : 'text-outline'
                        }`}
                      >
                        {msg.time}
                      </span>
                    </div>
                    {msg.sender === 'user' && (
                      <div className="w-6 h-6 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-label-md">person</span>
                      </div>
                    )}
                  </div>
                ))}

                {/* Grounded Rich Answer */}
                <div className="flex items-start gap-space-xs max-w-[92%]">
                  <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-label-md">smart_toy</span>
                  </div>
                  <div className="p-3 rounded-2xl rounded-tl-none bg-surface-container-lowest text-on-surface shadow-xs border border-surface-container-high/40 flex flex-col gap-2">
                    <p className="leading-relaxed">
                      For <strong>Class 6 (Academic Year 2025-26)</strong>:
                    </p>
                    <div className="p-2 rounded-lg bg-surface-container text-body-sm font-body-sm flex flex-col gap-1">
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Annual Composite Fee:</span>
                        <span className="font-data-tabular font-bold text-on-surface">₹78,400 / yr</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Payable:</span>
                        <span className="font-data-tabular text-on-surface">₹19,600 quarterly</span>
                      </div>
                    </div>
                    <p className="leading-relaxed">
                      🚌 <strong>Transport Coverage:</strong> Yes! <strong>Route #04</strong> covers Rohini Sector 14 directly.
                    </p>
                    <ul className="text-on-surface-variant list-disc list-inside text-body-sm pl-1">
                      <li>Morning pickup: <strong>07:18 AM</strong></li>
                      <li>Afternoon drop: <strong>02:45 PM</strong></li>
                      <li>AC GPS bus with female attendant on board</li>
                    </ul>

                    {/* Grounding Citations */}
                    <div className="p-2 rounded-lg bg-secondary-container/30 flex items-center gap-1.5 text-on-secondary-container font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-body-md text-secondary">verified</span>
                      <span>Verified via: <em>Fee Structure 2024-25</em> & <em>Delhi North Bus Routes.xlsx</em></span>
                    </div>

                    {/* Bot CTA to lock lead */}
                    <div className="pt-1 flex flex-col gap-1.5">
                      <span className="font-title-sm text-title-sm font-semibold text-primary">
                        Would you like a direct counsellor callback?
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setShowSimulatedBooking(true);
                            onShowToast('Counsellor Callback appointment logged in CRM queue!');
                          }}
                          className="flex-1 py-1.5 px-2.5 rounded-lg bg-secondary hover:bg-secondary/90 text-on-secondary font-title-sm text-title-sm font-semibold text-center transition-colors shadow-xs cursor-pointer"
                        >
                          📅 Book Callback Today
                        </button>
                        <button
                          onClick={() => onShowToast('Downloading verified: Delhi_Public_Academy_Prospectus_2025.pdf')}
                          className="py-1.5 px-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-title-sm text-title-sm text-center transition-colors cursor-pointer"
                        >
                          📄 Prospectus PDF
                        </button>
                      </div>
                    </div>
                    <span className="font-data-tabular text-label-sm text-outline">10:15 AM • EduPilot Autonomous Agent</span>
                  </div>
                </div>

                {/* Simulated Callback Confirmation */}
                {showSimulatedBooking && (
                  <div className="flex items-start gap-space-xs max-w-[90%] animate-in fade-in duration-200">
                    <div className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-label-md">check</span>
                    </div>
                    <div className="p-3 rounded-2xl rounded-tl-none bg-secondary-container text-on-secondary-container shadow-xs">
                      <p className="font-semibold">Callback Reserved for 5:00 PM!</p>
                      <p className="text-body-sm mt-0.5">
                        Our Senior Counsellor Pooja Mehra has received your file. Confirmation SMS dispatched to +91 98112 40991.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bot Simulator Input Form */}
              <form onSubmit={handleSendBotQuery} className="p-space-sm bg-surface-container-lowest flex items-center gap-2 border-t border-surface-container">
                <input
                  type="text"
                  value={botInputText}
                  onChange={(e) => setBotInputText(e.target.value)}
                  placeholder="Type a parent inquiry to test knowledge base..."
                  className="flex-1 h-9 px-3 bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary border border-surface-container-high"
                />
                <button
                  type="submit"
                  className="w-9 h-9 rounded-xl bg-primary hover:bg-primary-container text-on-primary flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-body-lg">send</span>
                </button>
              </form>
            </div>

            {/* Counsellor Call-to-Action Card */}
            <div className="p-space-md rounded-xl bg-surface-container-high shadow-xs flex flex-col gap-space-xs border border-surface-container-highest">
              <div className="flex items-center justify-between">
                <span className="font-title-sm text-title-sm text-on-surface font-bold">Bot Conversion Rate</span>
                <span className="font-data-tabular text-data-tabular text-secondary font-bold text-headline-sm">84.2%</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Out of 142 AI chatbot inquiries handled this month, 56 have already scheduled campus tours or confirmed seat deposits.
              </p>
              <div className="flex items-center gap-space-sm pt-2">
                <button
                  onClick={() => onOpenScheduleModal()}
                  className="flex-1 py-2 px-3 rounded-xl bg-surface-container-lowest hover:bg-surface text-primary font-title-sm text-title-sm font-semibold transition-all shadow-xs text-center cursor-pointer border border-surface-container-high"
                >
                  Schedule Manual Tour
                </button>
                <button
                  onClick={onOpenEmbedModal}
                  className="py-2 px-3 rounded-xl bg-primary text-on-primary font-title-sm text-title-sm font-semibold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-body-md">code</span> Embed
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
