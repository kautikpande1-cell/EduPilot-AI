import React, { useState } from 'react';
import { Lead, GroundingDoc } from './types';
import { INITIAL_LEADS, GROUNDING_DOCS } from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ScheduleModal, LogCallModal, GroundingDocsModal, EmbedModal } from './components/Modals';
import { AdmissionAssistantView } from './views/AdmissionAssistantView';

export default function App() {
  const [academicYear, setAcademicYear] = useState<string>('AY 2024-25');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [activeSection, setActiveSection] = useState('pipeline');

  // Leads state
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);

  // Grounding docs state
  const [docs, setDocs] = useState<GroundingDoc[]>(GROUNDING_DOCS);

  // Modals state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleModalInitial, setScheduleModalInitial] = useState<{ parentName?: string; grade?: string }>({});
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [isGroundingDocsModalOpen, setIsGroundingDocsModalOpen] = useState(false);
  const [selectedLeadForCall, setSelectedLeadForCall] = useState<Lead | null>(null);

  // Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMsg(message);
    setTimeout(() => {
      setToastMsg((current) => (current === message ? null : current));
    }, 3500);
  };

  const handleOpenScheduleModal = (parentName?: string, grade?: string) => {
    setScheduleModalInitial({ parentName, grade });
    setIsScheduleModalOpen(true);
  };

  const handleCreateLead = (leadData: Partial<Lead>) => {
    const initials = (leadData.parentName || 'Parent')
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      initials: initials || 'NL',
      parentName: leadData.parentName || 'Anonymous Parent',
      phone: leadData.phone || '+91 98000 00000',
      source: 'walkin',
      sourceLabel: 'Walk-in Campus',
      timeAgo: 'Just now',
      grade: leadData.grade || 'Grade 6',
      gradeKey:
        leadData.grade?.includes('Pre-KG')
          ? 'pre-kg'
          : leadData.grade?.includes('11')
          ? 'grade-11-sci'
          : leadData.grade?.includes('1')
          ? 'grade-1'
          : leadData.grade?.includes('9')
          ? 'grade-9'
          : 'grade-6',
      studentName: 'Applicant Student',
      status: 'visit',
      statusLabel: 'Campus Visit',
      score: 85,
      scoreType: 'HOT',
      scoreBadge: 'Scheduled in-person',
      notes: leadData.notes || 'In-person campus tour scheduled via front office registration.',
      tourBadge: 'Campus Visit Reserved',
      staffName: leadData.staffName || 'Pooja Mehra',
      staffRole: 'Sr. Counsellor',
      staffStatus: 'Tour Confirmed',
    };

    setLeads((prev) => [newLead, ...prev]);
    showToast(`Appointment confirmed for ${newLead.parentName}! Added to CRM pipeline.`);
  };

  const handleUpdateLead = (id: string, updates: Partial<Lead>) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const handleSaveCallLog = (leadId: string, note: string, outcome: string) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? {
              ...l,
              status: outcome.includes('Tour') ? 'visit' : outcome.includes('Deposit') ? 'converted' : 'contacted',
              statusLabel: outcome.includes('Tour') ? 'Campus Visit' : outcome.includes('Deposit') ? 'Converted' : 'Contacted',
              callbackBadge: note.slice(0, 35) + '...',
              staffStatus: outcome.includes('Tour') ? 'Tour Scheduled' : 'Call Logged',
            }
          : l
      )
    );
    showToast(`Call record logged for ${leads.find((l) => l.id === leadId)?.parentName}`);
  };

  const handleUploadDoc = (title: string, category: GroundingDoc['category']) => {
    const newDoc: GroundingDoc = {
      id: `doc-${Date.now()}`,
      title,
      category,
      icon: category === 'Fee' ? 'payments' : category === 'Transport' ? 'directions_bus' : 'description',
      isSynced: true,
      size: '1.2 MB',
      verifiedDate: 'Just now',
    };
    setDocs((prev) => [newDoc, ...prev]);
    showToast(`Grounded document "${title}" uploaded and vectorized successfully.`);
  };

  const handleSelectSection = (section: string) => {
    setActiveSection(section);
    if (section === 'pipeline') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'bot') {
      const el = document.getElementById('bot-simulator-card');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'docs') {
      setIsGroundingDocsModalOpen(true);
    } else if (section === 'templates') {
      window.scrollTo({ top: 600, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-body-md text-on-surface antialiased flex">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        onShowToast={showToast}
      />

      {/* Main Container */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          onOpenMobileMenu={() => setIsOpenMobile(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          academicYear={academicYear}
          setAcademicYear={setAcademicYear}
          onOpenNewLeadModal={() => handleOpenScheduleModal()}
        />

        {/* Main Content Area: Admission Assistant & CRM Pipeline */}
        <main className="relative pt-16 bg-surface min-h-screen flex-1">
          <AdmissionAssistantView
            leads={leads}
            onOpenScheduleModal={handleOpenScheduleModal}
            onShowToast={showToast}
            onOpenEmbedModal={() => setIsEmbedModalOpen(true)}
            onUpdateLead={handleUpdateLead}
            onOpenCallLogModal={(lead) => setSelectedLeadForCall(lead)}
            onOpenGroundingDocsModal={() => setIsGroundingDocsModalOpen(true)}
          />
        </main>
      </div>

      {/* Modals */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSubmit={handleCreateLead}
        initialParentName={scheduleModalInitial.parentName}
        initialGrade={scheduleModalInitial.grade}
      />

      <LogCallModal
        isOpen={!!selectedLeadForCall}
        lead={selectedLeadForCall}
        onClose={() => setSelectedLeadForCall(null)}
        onSaveLog={handleSaveCallLog}
      />

      <GroundingDocsModal
        isOpen={isGroundingDocsModalOpen}
        docs={docs}
        onClose={() => setIsGroundingDocsModalOpen(false)}
        onUploadDoc={handleUploadDoc}
      />

      <EmbedModal
        isOpen={isEmbedModalOpen}
        onClose={() => setIsEmbedModalOpen(false)}
        onCopy={() => showToast('Embed snippet copied! Paste inside your website <head> tag.')}
      />

      {/* Floating Notification Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="px-4 py-3 rounded-xl bg-on-background text-inverse-on-surface shadow-2xl flex items-center gap-space-sm border border-white/10 max-w-md">
            <span className="material-symbols-outlined text-secondary text-headline-sm">check_circle</span>
            <span className="font-body-md text-body-md leading-snug">{toastMsg}</span>
          </div>
        </div>
      )}
    </div>
  );
}
