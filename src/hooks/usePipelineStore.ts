import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Pipeline,
  PipelineStage,
  Deal,
  DealActivity,
  ActivityType,
  StageHistoryEntry,
  DealFile,
  DropdownOption,
  PipelineSettings,
  PipelineView,
  DealFilters,
  DealSort,
  SortField,
  SortDirection,
  DEFAULT_STAGES,
  DEFAULT_VERTICALS,
  DEFAULT_LEAD_SOURCES,
} from '@/types/pipeline'

// =============================================================================
// HELPERS
// =============================================================================

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`

const createDefaultPipeline = (): Pipeline => {
  const stages: PipelineStage[] = [
    { id: generateId(), name: 'New Lead', color: 'blue', probability: 5, order: 0, isWonStage: false, isLostStage: false },
    { id: generateId(), name: 'Contacted', color: 'cyan', probability: 10, order: 1, isWonStage: false, isLostStage: false },
    { id: generateId(), name: 'Discovery Call', color: 'violet', probability: 20, order: 2, isWonStage: false, isLostStage: false },
    { id: generateId(), name: 'Proposal Sent', color: 'amber', probability: 50, order: 3, isWonStage: false, isLostStage: false },
    { id: generateId(), name: 'Negotiation', color: 'orange', probability: 75, order: 4, isWonStage: false, isLostStage: false },
    { id: generateId(), name: 'Closed Won', color: 'green', probability: 100, order: 5, isWonStage: true, isLostStage: false },
    { id: generateId(), name: 'Closed Lost', color: 'slate', probability: 0, order: 6, isWonStage: false, isLostStage: true },
  ]

  return {
    id: generateId(),
    name: 'Sales Pipeline',
    description: 'Main sales pipeline for tracking deals',
    stages,
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

const createDefaultSettings = (): PipelineSettings => {
  const defaultPipeline = createDefaultPipeline()
  return {
    pipelines: [defaultPipeline],
    activePipelineId: defaultPipeline.id,
    verticals: [
      { id: 'med-spa', label: 'Med Spa' },
      { id: 'dentist', label: 'Dentist' },
      { id: 'chiropractor', label: 'Chiropractor' },
      { id: 'hvac', label: 'HVAC' },
      { id: 'roofing', label: 'Roofing' },
      { id: 'plumbing', label: 'Plumbing' },
      { id: 'real-estate', label: 'Real Estate' },
      { id: 'gym-fitness', label: 'Gym / Fitness' },
      { id: 'restaurant', label: 'Restaurant' },
      { id: 'salon-spa', label: 'Salon / Spa' },
      { id: 'legal', label: 'Legal Services' },
      { id: 'home-services', label: 'Home Services' },
      { id: 'automotive', label: 'Automotive' },
      { id: 'other', label: 'Other' },
    ],
    leadSources: [
      { id: 'cold-dm', label: 'Cold DM', color: 'blue' },
      { id: 'cold-email', label: 'Cold Email', color: 'cyan' },
      { id: 'referral', label: 'Referral', color: 'green' },
      { id: 'facebook-ad', label: 'Facebook Ad', color: 'blue' },
      { id: 'google-ad', label: 'Google Ad', color: 'red' },
      { id: 'inbound', label: 'Inbound', color: 'violet' },
      { id: 'walk-in', label: 'Walk-in', color: 'amber' },
      { id: 'linkedin', label: 'LinkedIn', color: 'blue' },
      { id: 'webinar', label: 'Webinar', color: 'pink' },
      { id: 'event', label: 'Event', color: 'orange' },
      { id: 'other', label: 'Other', color: 'slate' },
    ],
    defaultContractLength: 3,
    currency: 'USD',
    staleDealsThreshold: 7,
  }
}

// =============================================================================
// STORE INTERFACE
// =============================================================================

interface PipelineStore {
  // Settings
  settings: PipelineSettings
  updateSettings: (settings: Partial<PipelineSettings>) => void

  // Pipelines
  getActivePipeline: () => Pipeline | undefined
  createPipeline: (name: string, description?: string) => Pipeline
  updatePipeline: (id: string, updates: Partial<Pipeline>) => void
  deletePipeline: (id: string) => void
  setActivePipeline: (id: string) => void

  // Stages
  addStage: (pipelineId: string, stage: Omit<PipelineStage, 'id'>) => void
  updateStage: (pipelineId: string, stageId: string, updates: Partial<PipelineStage>) => void
  deleteStage: (pipelineId: string, stageId: string) => void
  reorderStages: (pipelineId: string, stageIds: string[]) => void

  // Deals
  deals: Deal[]
  createDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt' | 'stageHistory' | 'activities' | 'stageEnteredAt'>) => Deal
  updateDeal: (id: string, updates: Partial<Deal>) => void
  deleteDeal: (id: string) => void
  bulkDeleteDeals: (ids: string[]) => void
  bulkMoveDeal: (ids: string[], stageId: string) => void
  bulkAddTags: (ids: string[], tags: string[]) => void
  moveDeal: (id: string, stageId: string, closeReason?: string) => void
  getDealsByStage: (stageId: string) => Deal[]
  getDealsByPipeline: (pipelineId: string) => Deal[]

  // Activities
  addActivity: (dealId: string, activity: Omit<DealActivity, 'id' | 'createdAt'>) => void
  updateActivity: (dealId: string, activityId: string, updates: Partial<DealActivity>) => void
  deleteActivity: (dealId: string, activityId: string) => void

  // Follow-ups
  scheduleFollowUp: (dealId: string, date: string, note?: string, type?: ActivityType) => void
  clearFollowUp: (dealId: string) => void
  getFollowUpsDue: () => Deal[]
  getFollowUpsToday: () => Deal[]
  getOverdueFollowUps: () => Deal[]

  // Files
  addFile: (dealId: string, file: Omit<DealFile, 'id' | 'uploadedAt'>) => void
  deleteFile: (dealId: string, fileId: string) => void

  // Tags
  addTag: (dealId: string, tag: string) => void
  removeTag: (dealId: string, tag: string) => void
  getAllTags: () => string[]

  // Dropdowns
  addVertical: (vertical: Omit<DropdownOption, 'id'>) => void
  removeVertical: (id: string) => void
  addLeadSource: (source: Omit<DropdownOption, 'id'>) => void
  removeLeadSource: (id: string) => void

  // View State (not persisted)
  view: PipelineView
  setView: (view: PipelineView) => void
  filters: DealFilters
  setFilters: (filters: Partial<DealFilters>) => void
  resetFilters: () => void
  sort: DealSort
  setSort: (field: SortField, direction?: SortDirection) => void
  selectedDealIds: string[]
  setSelectedDealIds: (ids: string[]) => void
  toggleDealSelection: (id: string) => void
  clearSelection: () => void
  selectAll: (pipelineId?: string) => void

  // Analytics
  getStaleDeals: () => Deal[]
  getPipelineValue: (pipelineId: string) => number
  getWeightedValue: (pipelineId: string) => number
  getWinRate: (pipelineId: string, period?: 'week' | 'month' | 'quarter' | 'all') => number
  getConversionRate: (pipelineId: string, fromStageId: string, toStageId: string) => number
  getAvgDaysInStage: (pipelineId: string, stageId: string) => number
  getDealsClosedInPeriod: (pipelineId: string, period: 'week' | 'month' | 'quarter') => { won: Deal[]; lost: Deal[] }

  // Quick Actions
  quickAddDeal: (companyName: string, contactName?: string, dealValue?: number) => Deal

  // Import from discovered leads
  importFromLead: (lead: any) => Deal
}

// =============================================================================
// DEFAULT FILTERS
// =============================================================================

const defaultFilters: DealFilters = {
  search: '',
  stageIds: [],
  verticals: [],
  leadSources: [],
  owners: [],
  tags: [],
  showStale: false,
  showWithFollowUps: false,
}

const defaultSort: DealSort = {
  field: 'createdAt',
  direction: 'desc',
}

// =============================================================================
// STORE IMPLEMENTATION
// =============================================================================

export const usePipelineStore = create<PipelineStore>()(
  persist(
    (set, get) => ({
      // =========================================================================
      // SETTINGS
      // =========================================================================
      settings: createDefaultSettings(),

      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),

      // =========================================================================
      // PIPELINES
      // =========================================================================
      getActivePipeline: () => {
        const { settings } = get()
        return settings.pipelines.find((p) => p.id === settings.activePipelineId)
      },

      createPipeline: (name, description) => {
        const newPipeline: Pipeline = {
          id: generateId(),
          name,
          description,
          stages: [
            { id: generateId(), name: 'New Lead', color: 'blue', probability: 5, order: 0, isWonStage: false, isLostStage: false },
            { id: generateId(), name: 'Contacted', color: 'cyan', probability: 10, order: 1, isWonStage: false, isLostStage: false },
            { id: generateId(), name: 'Discovery Call', color: 'violet', probability: 20, order: 2, isWonStage: false, isLostStage: false },
            { id: generateId(), name: 'Proposal Sent', color: 'amber', probability: 50, order: 3, isWonStage: false, isLostStage: false },
            { id: generateId(), name: 'Negotiation', color: 'orange', probability: 75, order: 4, isWonStage: false, isLostStage: false },
            { id: generateId(), name: 'Closed Won', color: 'green', probability: 100, order: 5, isWonStage: true, isLostStage: false },
            { id: generateId(), name: 'Closed Lost', color: 'slate', probability: 0, order: 6, isWonStage: false, isLostStage: true },
          ],
          isDefault: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        set((state) => ({
          settings: {
            ...state.settings,
            pipelines: [...state.settings.pipelines, newPipeline],
          },
        }))

        return newPipeline
      },

      updatePipeline: (id, updates) =>
        set((state) => ({
          settings: {
            ...state.settings,
            pipelines: state.settings.pipelines.map((p) =>
              p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
            ),
          },
        })),

      deletePipeline: (id) =>
        set((state) => {
          const pipelines = state.settings.pipelines.filter((p) => p.id !== id)
          const activePipelineId =
            state.settings.activePipelineId === id
              ? pipelines[0]?.id || ''
              : state.settings.activePipelineId

          return {
            settings: { ...state.settings, pipelines, activePipelineId },
            deals: state.deals.filter((d) => d.pipelineId !== id),
          }
        }),

      setActivePipeline: (id) =>
        set((state) => ({
          settings: { ...state.settings, activePipelineId: id },
        })),

      // =========================================================================
      // STAGES
      // =========================================================================
      addStage: (pipelineId, stage) =>
        set((state) => ({
          settings: {
            ...state.settings,
            pipelines: state.settings.pipelines.map((p) => {
              if (p.id !== pipelineId) return p
              const maxOrder = Math.max(...p.stages.map((s) => s.order), -1)
              return {
                ...p,
                stages: [...p.stages, { ...stage, id: generateId(), order: maxOrder + 1 }],
                updatedAt: new Date().toISOString(),
              }
            }),
          },
        })),

      updateStage: (pipelineId, stageId, updates) =>
        set((state) => ({
          settings: {
            ...state.settings,
            pipelines: state.settings.pipelines.map((p) => {
              if (p.id !== pipelineId) return p
              return {
                ...p,
                stages: p.stages.map((s) => (s.id === stageId ? { ...s, ...updates } : s)),
                updatedAt: new Date().toISOString(),
              }
            }),
          },
        })),

      deleteStage: (pipelineId, stageId) =>
        set((state) => ({
          settings: {
            ...state.settings,
            pipelines: state.settings.pipelines.map((p) => {
              if (p.id !== pipelineId) return p
              return {
                ...p,
                stages: p.stages.filter((s) => s.id !== stageId),
                updatedAt: new Date().toISOString(),
              }
            }),
          },
        })),

      reorderStages: (pipelineId, stageIds) =>
        set((state) => ({
          settings: {
            ...state.settings,
            pipelines: state.settings.pipelines.map((p) => {
              if (p.id !== pipelineId) return p
              const stageMap = new Map(p.stages.map((s) => [s.id, s]))
              return {
                ...p,
                stages: stageIds.map((id, index) => ({ ...stageMap.get(id)!, order: index })),
                updatedAt: new Date().toISOString(),
              }
            }),
          },
        })),

      // =========================================================================
      // DEALS
      // =========================================================================
      deals: [],

      createDeal: (dealData) => {
        const now = new Date().toISOString()
        const pipeline = get().settings.pipelines.find((p) => p.id === dealData.pipelineId)
        const stage = pipeline?.stages.find((s) => s.id === dealData.stageId)

        const newDeal: Deal = {
          ...dealData,
          id: generateId(),
          tags: dealData.tags || [],
          files: dealData.files || [],
          stageHistory: [
            {
              id: generateId(),
              toStageId: dealData.stageId,
              toStageName: stage?.name || 'Unknown',
              changedAt: now,
            },
          ],
          activities: [
            {
              id: generateId(),
              type: 'deal_created',
              title: 'Deal created',
              description: `Deal added to ${stage?.name || 'pipeline'}`,
              createdAt: now,
            },
          ],
          createdAt: now,
          updatedAt: now,
          stageEnteredAt: now,
        }

        set((state) => ({ deals: [...state.deals, newDeal] }))
        return newDeal
      },

      updateDeal: (id, updates) =>
        set((state) => ({
          deals: state.deals.map((d) =>
            d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
          ),
        })),

      deleteDeal: (id) =>
        set((state) => ({
          deals: state.deals.filter((d) => d.id !== id),
          selectedDealIds: state.selectedDealIds.filter((did) => did !== id),
        })),

      bulkDeleteDeals: (ids) =>
        set((state) => ({
          deals: state.deals.filter((d) => !ids.includes(d.id)),
          selectedDealIds: [],
        })),

      bulkMoveDeal: (ids, stageId) => {
        const now = new Date().toISOString()
        set((state) => {
          const pipeline = state.settings.pipelines.find((p) => p.id === state.settings.activePipelineId)
          const stage = pipeline?.stages.find((s) => s.id === stageId)

          return {
            deals: state.deals.map((d) => {
              if (!ids.includes(d.id)) return d
              const oldStage = pipeline?.stages.find((s) => s.id === d.stageId)
              return {
                ...d,
                stageId,
                stageEnteredAt: now,
                updatedAt: now,
                closedAt: stage?.isWonStage || stage?.isLostStage ? now : d.closedAt,
                stageHistory: [
                  ...d.stageHistory,
                  {
                    id: generateId(),
                    fromStageId: d.stageId,
                    fromStageName: oldStage?.name,
                    toStageId: stageId,
                    toStageName: stage?.name || 'Unknown',
                    changedAt: now,
                  },
                ],
                activities: [
                  ...d.activities,
                  {
                    id: generateId(),
                    type: 'stage_change' as ActivityType,
                    title: `Moved to ${stage?.name}`,
                    description: `Stage changed from ${oldStage?.name || 'Unknown'} to ${stage?.name || 'Unknown'}`,
                    createdAt: now,
                  },
                ],
              }
            }),
            selectedDealIds: [],
          }
        })
      },

      bulkAddTags: (ids, tags) =>
        set((state) => ({
          deals: state.deals.map((d) => {
            if (!ids.includes(d.id)) return d
            const newTags = tags.filter((t) => !d.tags.includes(t))
            return {
              ...d,
              tags: [...d.tags, ...newTags],
              updatedAt: new Date().toISOString(),
            }
          }),
        })),

      moveDeal: (id, stageId, closeReason) => {
        const now = new Date().toISOString()
        set((state) => {
          const deal = state.deals.find((d) => d.id === id)
          if (!deal) return state

          const pipeline = state.settings.pipelines.find((p) => p.id === deal.pipelineId)
          const oldStage = pipeline?.stages.find((s) => s.id === deal.stageId)
          const newStage = pipeline?.stages.find((s) => s.id === stageId)

          return {
            deals: state.deals.map((d) => {
              if (d.id !== id) return d
              return {
                ...d,
                stageId,
                stageEnteredAt: now,
                updatedAt: now,
                closedAt: newStage?.isWonStage || newStage?.isLostStage ? now : undefined,
                closeReason: closeReason || d.closeReason,
                stageHistory: [
                  ...d.stageHistory,
                  {
                    id: generateId(),
                    fromStageId: d.stageId,
                    fromStageName: oldStage?.name,
                    toStageId: stageId,
                    toStageName: newStage?.name || 'Unknown',
                    changedAt: now,
                  },
                ],
                activities: [
                  ...d.activities,
                  {
                    id: generateId(),
                    type: 'stage_change' as ActivityType,
                    title: `Moved to ${newStage?.name}`,
                    description: closeReason
                      ? `Stage changed to ${newStage?.name}. Reason: ${closeReason}`
                      : `Stage changed from ${oldStage?.name || 'Unknown'} to ${newStage?.name || 'Unknown'}`,
                    createdAt: now,
                  },
                ],
              }
            }),
          }
        })
      },

      getDealsByStage: (stageId) => get().deals.filter((d) => d.stageId === stageId),

      getDealsByPipeline: (pipelineId) => get().deals.filter((d) => d.pipelineId === pipelineId),

      // =========================================================================
      // ACTIVITIES
      // =========================================================================
      addActivity: (dealId, activity) => {
        const now = new Date().toISOString()
        set((state) => ({
          deals: state.deals.map((d) => {
            if (d.id !== dealId) return d
            return {
              ...d,
              activities: [
                ...d.activities,
                { ...activity, id: generateId(), createdAt: now },
              ],
              lastActivityAt: now,
              updatedAt: now,
            }
          }),
        }))
      },

      updateActivity: (dealId, activityId, updates) =>
        set((state) => ({
          deals: state.deals.map((d) => {
            if (d.id !== dealId) return d
            return {
              ...d,
              activities: d.activities.map((a) =>
                a.id === activityId ? { ...a, ...updates } : a
              ),
              updatedAt: new Date().toISOString(),
            }
          }),
        })),

      deleteActivity: (dealId, activityId) =>
        set((state) => ({
          deals: state.deals.map((d) => {
            if (d.id !== dealId) return d
            return {
              ...d,
              activities: d.activities.filter((a) => a.id !== activityId),
              updatedAt: new Date().toISOString(),
            }
          }),
        })),

      // =========================================================================
      // FOLLOW-UPS
      // =========================================================================
      scheduleFollowUp: (dealId, date, note, type = 'follow_up') => {
        const now = new Date().toISOString()
        set((state) => ({
          deals: state.deals.map((d) => {
            if (d.id !== dealId) return d
            return {
              ...d,
              nextFollowUp: { date, note, type },
              activities: [
                ...d.activities,
                {
                  id: generateId(),
                  type: 'follow_up',
                  title: 'Follow-up scheduled',
                  description: note || `Follow-up scheduled for ${new Date(date).toLocaleDateString()}`,
                  scheduledFor: date,
                  createdAt: now,
                },
              ],
              updatedAt: now,
            }
          }),
        }))
      },

      clearFollowUp: (dealId) =>
        set((state) => ({
          deals: state.deals.map((d) =>
            d.id === dealId ? { ...d, nextFollowUp: undefined, updatedAt: new Date().toISOString() } : d
          ),
        })),

      getFollowUpsDue: () => {
        const now = new Date()
        return get().deals.filter((d) => d.nextFollowUp && new Date(d.nextFollowUp.date) <= now)
      },

      getFollowUpsToday: () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        return get().deals.filter((d) => {
          if (!d.nextFollowUp) return false
          const followUpDate = new Date(d.nextFollowUp.date)
          return followUpDate >= today && followUpDate < tomorrow
        })
      },

      getOverdueFollowUps: () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return get().deals.filter((d) => d.nextFollowUp && new Date(d.nextFollowUp.date) < today)
      },

      // =========================================================================
      // FILES
      // =========================================================================
      addFile: (dealId, file) =>
        set((state) => ({
          deals: state.deals.map((d) => {
            if (d.id !== dealId) return d
            return {
              ...d,
              files: [...d.files, { ...file, id: generateId(), uploadedAt: new Date().toISOString() }],
              updatedAt: new Date().toISOString(),
            }
          }),
        })),

      deleteFile: (dealId, fileId) =>
        set((state) => ({
          deals: state.deals.map((d) => {
            if (d.id !== dealId) return d
            return {
              ...d,
              files: d.files.filter((f) => f.id !== fileId),
              updatedAt: new Date().toISOString(),
            }
          }),
        })),

      // =========================================================================
      // TAGS
      // =========================================================================
      addTag: (dealId, tag) =>
        set((state) => ({
          deals: state.deals.map((d) => {
            if (d.id !== dealId || d.tags.includes(tag)) return d
            return { ...d, tags: [...d.tags, tag], updatedAt: new Date().toISOString() }
          }),
        })),

      removeTag: (dealId, tag) =>
        set((state) => ({
          deals: state.deals.map((d) => {
            if (d.id !== dealId) return d
            return { ...d, tags: d.tags.filter((t) => t !== tag), updatedAt: new Date().toISOString() }
          }),
        })),

      getAllTags: () => {
        const tags = new Set<string>()
        get().deals.forEach((d) => d.tags.forEach((t) => tags.add(t)))
        return Array.from(tags).sort()
      },

      // =========================================================================
      // DROPDOWNS
      // =========================================================================
      addVertical: (vertical) =>
        set((state) => ({
          settings: {
            ...state.settings,
            verticals: [...state.settings.verticals, { ...vertical, id: generateId() }],
          },
        })),

      removeVertical: (id) =>
        set((state) => ({
          settings: {
            ...state.settings,
            verticals: state.settings.verticals.filter((v) => v.id !== id),
          },
        })),

      addLeadSource: (source) =>
        set((state) => ({
          settings: {
            ...state.settings,
            leadSources: [...state.settings.leadSources, { ...source, id: generateId() }],
          },
        })),

      removeLeadSource: (id) =>
        set((state) => ({
          settings: {
            ...state.settings,
            leadSources: state.settings.leadSources.filter((s) => s.id !== id),
          },
        })),

      // =========================================================================
      // VIEW STATE
      // =========================================================================
      view: 'kanban',
      setView: (view) => set({ view }),

      filters: defaultFilters,
      setFilters: (updates) =>
        set((state) => ({ filters: { ...state.filters, ...updates } })),
      resetFilters: () => set({ filters: defaultFilters }),

      sort: defaultSort,
      setSort: (field, direction) =>
        set((state) => ({
          sort: {
            field,
            direction: direction || (state.sort.field === field && state.sort.direction === 'asc' ? 'desc' : 'asc'),
          },
        })),

      selectedDealIds: [],
      setSelectedDealIds: (ids) => set({ selectedDealIds: ids }),
      toggleDealSelection: (id) =>
        set((state) => ({
          selectedDealIds: state.selectedDealIds.includes(id)
            ? state.selectedDealIds.filter((did) => did !== id)
            : [...state.selectedDealIds, id],
        })),
      clearSelection: () => set({ selectedDealIds: [] }),
      selectAll: (pipelineId) => {
        const { deals, settings } = get()
        const targetPipelineId = pipelineId || settings.activePipelineId
        set({ selectedDealIds: deals.filter((d) => d.pipelineId === targetPipelineId).map((d) => d.id) })
      },

      // =========================================================================
      // ANALYTICS
      // =========================================================================
      getStaleDeals: () => {
        const { deals, settings } = get()
        const threshold = settings.staleDealsThreshold * 24 * 60 * 60 * 1000
        const now = Date.now()

        return deals.filter((d) => {
          const pipeline = settings.pipelines.find((p) => p.id === d.pipelineId)
          const stage = pipeline?.stages.find((s) => s.id === d.stageId)
          if (stage?.isWonStage || stage?.isLostStage) return false

          const lastActivity = d.lastActivityAt ? new Date(d.lastActivityAt).getTime() : new Date(d.createdAt).getTime()
          return now - lastActivity > threshold
        })
      },

      getPipelineValue: (pipelineId) => {
        const { deals, settings } = get()
        const pipeline = settings.pipelines.find((p) => p.id === pipelineId)
        if (!pipeline) return 0

        return deals
          .filter((d) => {
            if (d.pipelineId !== pipelineId) return false
            const stage = pipeline.stages.find((s) => s.id === d.stageId)
            return !stage?.isLostStage
          })
          .reduce((sum, d) => sum + d.dealValue * d.contractLength, 0)
      },

      getWeightedValue: (pipelineId) => {
        const { deals, settings } = get()
        const pipeline = settings.pipelines.find((p) => p.id === pipelineId)
        if (!pipeline) return 0

        return deals
          .filter((d) => {
            if (d.pipelineId !== pipelineId) return false
            const stage = pipeline.stages.find((s) => s.id === d.stageId)
            return !stage?.isLostStage
          })
          .reduce((sum, d) => {
            const stage = pipeline.stages.find((s) => s.id === d.stageId)
            const probability = (stage?.probability || 0) / 100
            return sum + d.dealValue * d.contractLength * probability
          }, 0)
      },

      getWinRate: (pipelineId, period = 'all') => {
        const { deals, settings } = get()
        const pipeline = settings.pipelines.find((p) => p.id === pipelineId)
        if (!pipeline) return 0

        const now = new Date()
        let startDate: Date

        switch (period) {
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            break
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1)
            break
          case 'quarter':
            startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
            break
          default:
            startDate = new Date(0)
        }

        const closedDeals = deals.filter((d) => {
          if (d.pipelineId !== pipelineId || !d.closedAt) return false
          const closedDate = new Date(d.closedAt)
          return closedDate >= startDate
        })

        const wonDeals = closedDeals.filter((d) => {
          const stage = pipeline.stages.find((s) => s.id === d.stageId)
          return stage?.isWonStage
        })

        return closedDeals.length > 0 ? (wonDeals.length / closedDeals.length) * 100 : 0
      },

      getConversionRate: (pipelineId, fromStageId, toStageId) => {
        const { deals } = get()
        const pipelineDeals = deals.filter((d) => d.pipelineId === pipelineId)

        const enteredFrom = pipelineDeals.filter((d) =>
          d.stageHistory.some((h) => h.toStageId === fromStageId)
        ).length

        const movedTo = pipelineDeals.filter((d) =>
          d.stageHistory.some(
            (h, i, arr) => h.fromStageId === fromStageId && h.toStageId === toStageId
          )
        ).length

        return enteredFrom > 0 ? (movedTo / enteredFrom) * 100 : 0
      },

      getAvgDaysInStage: (pipelineId, stageId) => {
        const { deals } = get()
        const pipelineDeals = deals.filter((d) => d.pipelineId === pipelineId)

        const daysInStage: number[] = []

        pipelineDeals.forEach((deal) => {
          const history = deal.stageHistory.filter((h) => h.toStageId === stageId)
          history.forEach((entry, i) => {
            const exitEntry = deal.stageHistory.find(
              (h, j) => j > deal.stageHistory.indexOf(entry) && h.fromStageId === stageId
            )
            if (exitEntry) {
              const days = (new Date(exitEntry.changedAt).getTime() - new Date(entry.changedAt).getTime()) / (24 * 60 * 60 * 1000)
              daysInStage.push(days)
            } else if (deal.stageId === stageId) {
              const days = (Date.now() - new Date(entry.changedAt).getTime()) / (24 * 60 * 60 * 1000)
              daysInStage.push(days)
            }
          })
        })

        return daysInStage.length > 0 ? daysInStage.reduce((a, b) => a + b, 0) / daysInStage.length : 0
      },

      getDealsClosedInPeriod: (pipelineId, period) => {
        const { deals, settings } = get()
        const pipeline = settings.pipelines.find((p) => p.id === pipelineId)
        if (!pipeline) return { won: [], lost: [] }

        const now = new Date()
        let startDate: Date

        switch (period) {
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            break
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1)
            break
          case 'quarter':
            startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
            break
        }

        const closedDeals = deals.filter((d) => {
          if (d.pipelineId !== pipelineId || !d.closedAt) return false
          const closedDate = new Date(d.closedAt)
          return closedDate >= startDate
        })

        const won = closedDeals.filter((d) => {
          const stage = pipeline.stages.find((s) => s.id === d.stageId)
          return stage?.isWonStage
        })

        const lost = closedDeals.filter((d) => {
          const stage = pipeline.stages.find((s) => s.id === d.stageId)
          return stage?.isLostStage
        })

        return { won, lost }
      },

      // =========================================================================
      // QUICK ACTIONS
      // =========================================================================
      quickAddDeal: (companyName, contactName, dealValue = 0) => {
        const { settings, createDeal } = get()
        const pipeline = settings.pipelines.find((p) => p.id === settings.activePipelineId)
        const firstStage = pipeline?.stages.sort((a, b) => a.order - b.order)[0]

        return createDeal({
          pipelineId: settings.activePipelineId,
          stageId: firstStage?.id || '',
          contactName: contactName || '',
          companyName,
          vertical: 'other',
          leadSource: 'other',
          dealValue,
          contractLength: settings.defaultContractLength,
          tags: [],
          files: [],
        })
      },

      importFromLead: (lead) => {
        const { settings, createDeal } = get()
        const pipeline = settings.pipelines.find((p) => p.id === settings.activePipelineId)
        const firstStage = pipeline?.stages.sort((a, b) => a.order - b.order)[0]

        return createDeal({
          pipelineId: settings.activePipelineId,
          stageId: firstStage?.id || '',
          contactName: '',
          companyName: lead.businessName || '',
          email: lead.email,
          phone: lead.phone,
          website: lead.website,
          vertical: lead.category || 'other',
          leadSource: 'inbound',
          dealValue: 0,
          contractLength: settings.defaultContractLength,
          tags: [],
          files: [],
        })
      },
    }),
    {
      name: 'leadflow-pipeline-v2',
      partialize: (state) => ({
        settings: state.settings,
        deals: state.deals,
      }),
    }
  )
)

// =============================================================================
// SELECTOR HOOKS
// =============================================================================

export const useFilteredDeals = () => {
  const { deals, filters, sort, settings } = usePipelineStore()
  const pipeline = settings.pipelines.find((p) => p.id === settings.activePipelineId)
  if (!pipeline) return []

  let filtered = deals.filter((d) => d.pipelineId === settings.activePipelineId)

  // Search
  if (filters.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(
      (d) =>
        d.contactName.toLowerCase().includes(search) ||
        d.companyName.toLowerCase().includes(search) ||
        d.email?.toLowerCase().includes(search) ||
        d.phone?.includes(search)
    )
  }

  // Stage filter
  if (filters.stageIds.length > 0) {
    filtered = filtered.filter((d) => filters.stageIds.includes(d.stageId))
  }

  // Vertical filter
  if (filters.verticals.length > 0) {
    filtered = filtered.filter((d) => filters.verticals.includes(d.vertical))
  }

  // Lead source filter
  if (filters.leadSources.length > 0) {
    filtered = filtered.filter((d) => filters.leadSources.includes(d.leadSource))
  }

  // Tag filter
  if (filters.tags.length > 0) {
    filtered = filtered.filter((d) => filters.tags.some((t) => d.tags.includes(t)))
  }

  // Value filter
  if (filters.minValue !== undefined) {
    filtered = filtered.filter((d) => d.dealValue >= filters.minValue!)
  }
  if (filters.maxValue !== undefined) {
    filtered = filtered.filter((d) => d.dealValue <= filters.maxValue!)
  }

  // Stale deals
  if (filters.showStale) {
    const threshold = settings.staleDealsThreshold * 24 * 60 * 60 * 1000
    const now = Date.now()
    filtered = filtered.filter((d) => {
      const stage = pipeline.stages.find((s) => s.id === d.stageId)
      if (stage?.isWonStage || stage?.isLostStage) return false
      const lastActivity = d.lastActivityAt ? new Date(d.lastActivityAt).getTime() : new Date(d.createdAt).getTime()
      return now - lastActivity > threshold
    })
  }

  // Follow-ups filter
  if (filters.showWithFollowUps) {
    filtered = filtered.filter((d) => d.nextFollowUp)
  }

  // Sort
  filtered.sort((a, b) => {
    let aVal: any = a[sort.field]
    let bVal: any = b[sort.field]

    if (sort.field === 'dealValue') {
      aVal = a.dealValue * a.contractLength
      bVal = b.dealValue * b.contractLength
    }

    if (aVal === undefined || aVal === null) return 1
    if (bVal === undefined || bVal === null) return -1

    if (typeof aVal === 'string') {
      return sort.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }

    return sort.direction === 'asc' ? aVal - bVal : bVal - aVal
  })

  return filtered
}

export const useDealsByStage = () => {
  const filteredDeals = useFilteredDeals()
  const { settings } = usePipelineStore()
  const pipeline = settings.pipelines.find((p) => p.id === settings.activePipelineId)

  if (!pipeline) return {}

  const byStage: Record<string, typeof filteredDeals> = {}
  pipeline.stages.forEach((stage) => {
    byStage[stage.id] = filteredDeals.filter((d) => d.stageId === stage.id)
  })

  return byStage
}
