import React, { useState } from 'react';
import { Lead, GroundingDoc, AdmissionTemplate } from '../types';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (leadData: Partial<Lead>) => void;
  initialParentName?: string;
  initialGrade?: string;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialParentName = '',
  initialGrade = 'Grade 6',
}) => {
  const [parentName, setParentName] = useState(initialParentName);
  const [phone, setPhone] = useState('+91 ');
  const [grade, setGrade] = useState(initialGrade);
  const [appointmentType, setAppointmentType] = useState('In-Person Campus Tour');
  const [slot, setSlot] = useState('2025-04-19T11:30');
  const [counsellor, setCounsellor] = useState('Pooja Mehra (Senior Academician)');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      parentName,
      phone,
      grade,
      notes: notes || `Requested ${appointmentType} with ${counsellor}`,
      staffName: counsellor.split(' ')[0] + ' ' + counsellor.split(' ')[1],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col border border-surface-container-high">
        <div className="p-space-md bg-primary text-on-primary flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-headline-sm">event_available</span>
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold leading-tight">
                Schedule Campus Visit / Callback
              </h3>
              <span className="font-label-sm text-label-sm text-primary-fixed-dim">
                Delhi Public Academy Admissions Bureau
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-primary-container text-on-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-body-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-space-md flex flex-col gap-space-sm max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">Parent Full Name</label>
            <input
              required
              type="text"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full h-10 px-3 bg-surface-container-low rounded-xl font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest border border-surface-container-high"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
            <div>
              <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">Mobile (WhatsApp)</label>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98000 00000"
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest border border-surface-container-high"
              />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">Seeking Grade</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl font-body-md text-body-md text-on-surface focus:outline-none border border-surface-container-high cursor-pointer"
              >
                <option>Pre-KG / Nursery</option>
                <option>Grade 1</option>
                <option>Grade 6</option>
                <option>Grade 9</option>
                <option>Grade 11 (Science)</option>
                <option>Grade 11 (Commerce/Humanities)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
            <div>
              <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">Appointment Type</label>
              <select
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value)}
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl font-body-md text-body-md text-on-surface focus:outline-none border border-surface-container-high cursor-pointer"
              >
                <option>In-Person Campus Tour</option>
                <option>Phone / WhatsApp Callback</option>
                <option>Principal One-on-One Interaction</option>
                <option>Document Verification</option>
              </select>
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">Preferred Slot</label>
              <input
                type="datetime-local"
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl font-body-md text-body-md text-on-surface focus:outline-none border border-surface-container-high"
              />
            </div>
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">Assign Academic Counsellor</label>
            <select
              value={counsellor}
              onChange={(e) => setCounsellor(e.target.value)}
              className="w-full h-10 px-3 bg-surface-container-low rounded-xl font-body-md text-body-md text-on-surface focus:outline-none border border-surface-container-high cursor-pointer"
            >
              <option>Pooja Mehra (Senior Academician)</option>
              <option>Sunil Verma (Admissions Head)</option>
              <option>Devika Nair (Front Office Executive)</option>
            </select>
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">Special Requirements / Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Needs sibling discount info, bus route 14 seat availability..."
              className="w-full p-2.5 bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest border border-surface-container-high"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-space-sm border-t border-surface-container">
            <button
              type="button"
              onClick={onClose}
              className="px-space-md py-2 rounded-xl bg-surface-container text-on-surface-variant font-title-sm text-title-sm hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-space-lg py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-title-sm text-title-sm transition-all shadow-md cursor-pointer font-bold"
            >
              Confirm & Notify Parent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const LogCallModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onSaveLog: (leadId: string, note: string, outcome: string) => void;
}> = ({ isOpen, onClose, lead, onSaveLog }) => {
  const [callOutcome, setCallOutcome] = useState('Interested - Campus Tour Scheduled');
  const [callNotes, setCallNotes] = useState('');
  const [duration, setDuration] = useState('4m 20s');

  if (!isOpen || !lead) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveLog(lead.id, callNotes || `Call completed (${duration}): ${callOutcome}`, callOutcome);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col border border-surface-container-high">
        <div className="p-space-md bg-primary text-on-primary flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-headline-sm">call</span>
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold leading-tight">Log Counsellor Call</h3>
              <span className="font-label-sm text-label-sm text-primary-fixed-dim">
                {lead.parentName} ({lead.phone})
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-primary-container text-on-primary cursor-pointer">
            <span className="material-symbols-outlined text-body-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-space-md flex flex-col gap-space-sm">
          <div className="p-2.5 rounded-xl bg-surface-container-low flex justify-between items-center text-body-sm">
            <div>
              <span className="text-outline block text-label-sm font-semibold">Student & Target Grade:</span>
              <span className="font-bold text-on-surface">{lead.studentName} • {lead.grade}</span>
            </div>
            <div className="text-right">
              <span className="text-outline block text-label-sm font-semibold">Call Duration:</span>
              <span className="font-bold text-secondary">{duration}</span>
            </div>
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">Call Outcome</label>
            <select
              value={callOutcome}
              onChange={(e) => setCallOutcome(e.target.value)}
              className="w-full h-10 px-3 bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface border border-surface-container-high cursor-pointer focus:outline-none"
            >
              <option>Interested - Campus Tour Scheduled</option>
              <option>Requested Follow-Up Callback</option>
              <option>Fee Structure Sent via WhatsApp</option>
              <option>Ready to Pay Seat Deposit</option>
              <option>Distance Issue / Not Feasible</option>
              <option>Call Unanswered / Left Voicemail</option>
            </select>
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">Counsellor Discussion Notes</label>
            <textarea
              rows={3}
              value={callNotes}
              onChange={(e) => setCallNotes(e.target.value)}
              placeholder="e.g. Parent clarified pickup point at Rohini Sec 14. Eager to visit campus on Saturday morning."
              className="w-full p-2.5 bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface border border-surface-container-high focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-space-sm pt-2 border-t border-surface-container">
            <button
              type="button"
              onClick={onClose}
              className="px-space-md py-2 rounded-xl bg-surface-container text-on-surface-variant font-title-sm text-title-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-space-md py-2 rounded-xl bg-primary text-on-primary font-title-sm text-title-sm font-bold shadow-md hover:bg-primary-container cursor-pointer"
            >
              Save Call Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const GroundingDocsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  docs: GroundingDoc[];
  onUploadDoc: (title: string, category: GroundingDoc['category']) => void;
}> = ({ isOpen, onClose, docs, onUploadDoc }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [docSearch, setDocSearch] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<GroundingDoc['category']>('Fee');

  if (!isOpen) return null;

  const filteredDocs = docs.filter((d) => {
    const matchCat = selectedCategory === 'All' || d.category === selectedCategory;
    const matchQ = !docSearch || d.title.toLowerCase().includes(docSearch.toLowerCase());
    return matchCat && matchQ;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onUploadDoc(newTitle.trim(), newCategory);
    setNewTitle('');
    setShowUploadForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col border border-surface-container-high max-h-[85vh]">
        <div className="p-space-md bg-primary text-on-primary flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-headline-sm">verified_user</span>
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold leading-tight">
                Bot Grounding Repository (24 Verified Guidelines)
              </h3>
              <span className="font-label-sm text-label-sm text-primary-fixed-dim">
                Active Knowledge Base for EduPilot WebBot
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-primary-container text-on-primary cursor-pointer">
            <span className="material-symbols-outlined text-body-lg">close</span>
          </button>
        </div>

        <div className="p-space-md flex flex-col gap-space-sm overflow-y-auto">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-space-xs">
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-body-md">
                search
              </span>
              <input
                type="text"
                value={docSearch}
                onChange={(e) => setDocSearch(e.target.value)}
                placeholder="Search verified doc..."
                className="w-full h-8 pl-8 pr-2.5 bg-surface-container-low rounded-lg font-body-sm text-body-sm border border-surface-container-high text-on-surface focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between">
              <div className="flex gap-1 overflow-x-auto text-label-sm">
                {['All', 'Fee', 'Affiliation', 'Transport', 'Curriculum', 'Compliance'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                      selectedCategory === cat
                        ? 'bg-primary text-on-primary font-bold'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowUploadForm(!showUploadForm)}
                className="px-2.5 py-1 rounded-lg bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-sm">add</span> Add Doc
              </button>
            </div>
          </div>

          {/* Optional Upload Form */}
          {showUploadForm && (
            <form onSubmit={handleUploadSubmit} className="p-3 rounded-xl bg-surface-container-low border border-surface-container-high flex flex-col gap-2 animate-in fade-in">
              <span className="font-label-sm text-label-sm font-bold text-primary uppercase">Ingest New Institutional Guideline</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  required
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Hostels_and_Sports_Fee_2025.pdf"
                  className="h-8 px-2.5 bg-surface rounded-lg font-body-sm text-body-sm border border-surface-container-high text-on-surface focus:outline-none"
                />
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="h-8 px-2 bg-surface rounded-lg font-body-sm text-body-sm border border-surface-container-high text-on-surface focus:outline-none cursor-pointer"
                >
                  <option value="Fee">Fee</option>
                  <option value="Affiliation">Affiliation</option>
                  <option value="Transport">Transport</option>
                  <option value="Curriculum">Curriculum</option>
                  <option value="Compliance">Compliance</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface text-label-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 rounded-lg bg-primary text-on-primary text-label-sm font-bold"
                >
                  Upload & Sync
                </button>
              </div>
            </form>
          )}

          {/* Grid of Documents */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center justify-between border border-surface-container-high/60 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-body-md">{doc.icon}</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-md text-label-md font-semibold text-on-surface truncate">
                      {doc.title}
                    </span>
                    <span className="font-label-sm text-label-sm text-outline">
                      {doc.category} • {doc.size} • {doc.verifiedDate}
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-secondary text-body-md shrink-0 ml-1">
                  check_circle
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-surface-container-low border-t border-surface-container flex justify-between items-center text-body-sm">
          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
            Showing {filteredDocs.length} grounded files • 100% Vectorized
          </span>
          <button
            onClick={onClose}
            className="px-space-md py-1.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-bold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export const EmbedModal: React.FC<{ isOpen: boolean; onClose: () => void; onCopy: () => void }> = ({
  isOpen,
  onClose,
  onCopy,
}) => {
  if (!isOpen) return null;

  const embedCode = `<script 
  src="https://cdn.edupilot.ai/widget/v2/bot.js" 
  data-school="DPA-DELHI" 
  data-affiliation="2730194" 
  data-theme="cbse-navy" 
  defer>
</script>`;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-gutter animate-in fade-in duration-150">
      <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-space-lg shadow-2xl flex flex-col gap-space-md border border-surface-container-high">
        <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
          <div className="flex items-center gap-space-xs">
            <div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-body-md">code</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Embed EduPilot WebBot</h3>
          </div>
          <button onClick={onClose} className="p-1 text-outline hover:text-on-surface rounded-full cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Paste this snippet inside your official school website <code className="px-1 py-0.5 rounded bg-surface-container text-primary font-semibold">&lt;head&gt;</code> or <code className="px-1 py-0.5 rounded bg-surface-container text-primary font-semibold">&lt;body&gt;</code> tag to deploy the zero-hallucination admissions assistant.
        </p>

        <pre className="p-space-md rounded-xl bg-on-background text-inverse-on-surface font-data-tabular text-body-sm overflow-x-auto select-all">
          {embedCode}
        </pre>

        <div className="flex items-center justify-end gap-space-sm pt-space-xs border-t border-surface-container">
          <button onClick={onClose} className="px-space-md py-2 rounded-xl bg-surface-container text-on-surface font-title-sm text-title-sm cursor-pointer">
            Close
          </button>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(embedCode);
              onCopy();
              onClose();
            }}
            className="px-space-lg py-2 rounded-xl bg-primary text-on-primary font-title-sm text-title-sm font-semibold flex items-center gap-1 shadow-md hover:bg-primary-container cursor-pointer"
          >
            <span className="material-symbols-outlined text-body-md">content_copy</span>
            Copy Embed Code
          </button>
        </div>
      </div>
    </div>
  );
};
