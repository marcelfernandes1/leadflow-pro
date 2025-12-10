// =============================================================================
// LEADFLOW PRO - CRM PIPELINE TYPES
// Professional pipeline management for high-ticket sales
// =============================================================================

// -----------------------------------------------------------------------------
// Pipeline Configuration
// -----------------------------------------------------------------------------

export interface Pipeline {
  id: string
  name: string
  description?: string
  stages: PipelineStage[]
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface PipelineStage {
  id: string
  name: string
  color: string // Tailwind color class (e.g., 'blue', 'green', 'red')
  probability: number // 0-100 for weighted forecasting
  order: number
  isWonStage: boolean
  isLostStage: boolean
}

// Default stages for new pipelines
export const DEFAULT_STAGES: Omit<PipelineStage, 'id'>[] = [
  { name: 'New Lead', color: 'blue', probability: 5, order: 0, isWonStage: false, isLostStage: false },
  { name: 'Contacted', color: 'cyan', probability: 10, order: 1, isWonStage: false, isLostStage: false },
  { name: 'Discovery Call Booked', color: 'violet', probability: 20, order: 2, isWonStage: false, isLostStage: false },
  { name: 'Proposal Sent', color: 'amber', probability: 50, order: 3, isWonStage: false, isLostStage: false },
  { name: 'Negotiation', color: 'orange', probability: 75, order: 4, isWonStage: false, isLostStage: false },
  { name: 'Closed Won', color: 'green', probability: 100, order: 5, isWonStage: true, isLostStage: false },
  { name: 'Closed Lost', color: 'slate', probability: 0, order: 6, isWonStage: false, isLostStage: true },
]

// Stage colors for UI
export const STAGE_COLORS: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', gradient: 'from-blue-500 to-blue-600' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30', gradient: 'from-cyan-500 to-cyan-600' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/30', gradient: 'from-violet-500 to-violet-600' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', gradient: 'from-amber-500 to-amber-600' },
  orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', gradient: 'from-orange-500 to-orange-600' },
  green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30', gradient: 'from-green-500 to-green-600' },
  red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', gradient: 'from-red-500 to-red-600' },
  slate: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30', gradient: 'from-slate-500 to-slate-600' },
  pink: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30', gradient: 'from-pink-500 to-pink-600' },
  indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30', gradient: 'from-indigo-500 to-indigo-600' },
  teal: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30', gradient: 'from-teal-500 to-teal-600' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', gradient: 'from-emerald-500 to-emerald-600' },
}

// -----------------------------------------------------------------------------
// Deal / Contact Record
// -----------------------------------------------------------------------------

export interface Deal {
  id: string
  pipelineId: string
  stageId: string

  // Contact Info
  contactName: string
  email?: string
  phone?: string
  companyName: string
  website?: string

  // Business Details
  vertical: string // Business vertical (med spa, dentist, etc.)
  leadSource: string // Where the lead came from

  // Deal Value
  dealValue: number // Monthly retainer value
  contractLength: number // Months
  expectedCloseDate?: string

  // CRM Fields
  ownerId?: string // For teams
  ownerName?: string
  tags: string[]

  // Stage History
  stageHistory: StageHistoryEntry[]

  // Activities
  activities: DealActivity[]

  // Follow-up
  nextFollowUp?: {
    date: string
    note?: string
    type: ActivityType
  }

  // Win/Loss
  closeReason?: string
  closedAt?: string

  // Files (stored as references)
  files: DealFile[]

  // Timestamps
  createdAt: string
  updatedAt: string
  lastActivityAt?: string
  stageEnteredAt: string // When entered current stage
}

export interface StageHistoryEntry {
  id: string
  fromStageId?: string
  fromStageName?: string
  toStageId: string
  toStageName: string
  changedAt: string
}

export interface DealFile {
  id: string
  name: string
  type: 'proposal' | 'contract' | 'document' | 'other'
  url?: string // For external links
  uploadedAt: string
}

// -----------------------------------------------------------------------------
// Activities
// -----------------------------------------------------------------------------

export type ActivityType = 'call' | 'email' | 'text' | 'meeting' | 'note' | 'task' | 'stage_change' | 'deal_created' | 'follow_up'

export interface DealActivity {
  id: string
  type: ActivityType
  title: string
  description?: string
  duration?: number // Minutes for calls/meetings
  outcome?: 'completed' | 'no_answer' | 'left_voicemail' | 'rescheduled' | 'cancelled'
  createdAt: string
  scheduledFor?: string // For future activities
  completedAt?: string
}

// -----------------------------------------------------------------------------
// Customizable Dropdowns
// -----------------------------------------------------------------------------

export interface DropdownOption {
  id: string
  label: string
  color?: string
  isDefault?: boolean
}

export const DEFAULT_VERTICALS: DropdownOption[] = [
  { id: 'med-spa', label: 'Med Spa', isDefault: true },
  { id: 'dentist', label: 'Dentist', isDefault: true },
  { id: 'chiropractor', label: 'Chiropractor', isDefault: true },
  { id: 'hvac', label: 'HVAC', isDefault: true },
  { id: 'roofing', label: 'Roofing', isDefault: true },
  { id: 'plumbing', label: 'Plumbing', isDefault: true },
  { id: 'real-estate', label: 'Real Estate', isDefault: true },
  { id: 'gym-fitness', label: 'Gym / Fitness', isDefault: true },
  { id: 'restaurant', label: 'Restaurant', isDefault: true },
  { id: 'salon-spa', label: 'Salon / Spa', isDefault: true },
  { id: 'legal', label: 'Legal Services', isDefault: true },
  { id: 'home-services', label: 'Home Services', isDefault: true },
  { id: 'automotive', label: 'Automotive', isDefault: true },
  { id: 'other', label: 'Other', isDefault: true },
]

export const DEFAULT_LEAD_SOURCES: DropdownOption[] = [
  { id: 'cold-dm', label: 'Cold DM', color: 'blue', isDefault: true },
  { id: 'cold-email', label: 'Cold Email', color: 'cyan', isDefault: true },
  { id: 'referral', label: 'Referral', color: 'green', isDefault: true },
  { id: 'facebook-ad', label: 'Facebook Ad', color: 'blue', isDefault: true },
  { id: 'google-ad', label: 'Google Ad', color: 'red', isDefault: true },
  { id: 'inbound', label: 'Inbound', color: 'violet', isDefault: true },
  { id: 'walk-in', label: 'Walk-in', color: 'amber', isDefault: true },
  { id: 'linkedin', label: 'LinkedIn', color: 'blue', isDefault: true },
  { id: 'webinar', label: 'Webinar', color: 'pink', isDefault: true },
  { id: 'event', label: 'Event', color: 'orange', isDefault: true },
  { id: 'other', label: 'Other', color: 'slate', isDefault: true },
]

// -----------------------------------------------------------------------------
// Pipeline Settings
// -----------------------------------------------------------------------------

export interface PipelineSettings {
  pipelines: Pipeline[]
  activePipelineId: string
  verticals: DropdownOption[]
  leadSources: DropdownOption[]
  defaultContractLength: number
  currency: string
  staleDealsThreshold: number // Days without activity to mark as stale
}

// -----------------------------------------------------------------------------
// Analytics Types
// -----------------------------------------------------------------------------

export interface PipelineAnalytics {
  totalDeals: number
  totalValue: number
  weightedValue: number
  wonDeals: number
  lostDeals: number
  wonValue: number
  winRate: number
  avgDealSize: number
  avgTimeToClose: number // Days

  // Stage breakdown
  stageMetrics: {
    stageId: string
    stageName: string
    count: number
    value: number
    avgDaysInStage: number
    conversionRate: number // To next stage
  }[]

  // Time-based
  dealsThisWeek: number
  dealsThisMonth: number
  revenueThisMonth: number
  revenueGoal: number
}

// -----------------------------------------------------------------------------
// View Types
// -----------------------------------------------------------------------------

export type PipelineView = 'kanban' | 'table' | 'calendar' | 'today' | 'analytics'

export interface DealFilters {
  search: string
  stageIds: string[]
  verticals: string[]
  leadSources: string[]
  owners: string[]
  tags: string[]
  minValue?: number
  maxValue?: number
  dateRange?: {
    start: string
    end: string
  }
  showStale: boolean
  showWithFollowUps: boolean
}

export type SortField = 'contactName' | 'companyName' | 'dealValue' | 'createdAt' | 'updatedAt' | 'expectedCloseDate' | 'lastActivityAt' | 'stageEnteredAt'
export type SortDirection = 'asc' | 'desc'

export interface DealSort {
  field: SortField
  direction: SortDirection
}
