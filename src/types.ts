export interface Lead {
  id: string;
  initials: string;
  parentName: string;
  phone: string;
  email?: string;
  source: 'bot' | 'whatsapp' | 'walkin' | 'google';
  sourceLabel: string;
  timeAgo: string;
  grade: string;
  gradeKey: 'pre-kg' | 'grade-1' | 'grade-6' | 'grade-9' | 'grade-11-sci';
  studentName: string;
  status: 'new' | 'contacted' | 'visit' | 'converted' | 'lost';
  statusLabel: string;
  score: number;
  scoreType: 'HOT' | 'WARM' | 'MILD' | 'CONVERTED' | 'LOST';
  scoreBadge: string;
  notes: string;
  callbackBadge?: string;
  tourBadge?: string;
  receiptBadge?: string;
  staffName?: string;
  staffRole?: string;
  staffStatus?: string;
  isUrgent?: boolean;
  history?: Array<{
    date: string;
    action: string;
    counsellor: string;
    note?: string;
  }>;
}

export interface GroundingDoc {
  id: string;
  title: string;
  icon: string;
  isSynced: boolean;
  size: string;
  category: 'Fee' | 'Affiliation' | 'Transport' | 'Curriculum' | 'Compliance';
  verifiedDate: string;
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  isCustom?: boolean;
  isVerified?: boolean;
  citation?: string;
  showActions?: boolean;
}

export interface AdmissionTemplate {
  id: string;
  key: string;
  title: string;
  channel: 'WhatsApp' | 'Email' | 'SMS';
  colorClass: string;
  badgeText: string;
  ctaText: string;
  content: string;
}

export type AdmissionTab = 'pipeline' | 'grounding-base' | 'webbot-preview' | 'templates';
