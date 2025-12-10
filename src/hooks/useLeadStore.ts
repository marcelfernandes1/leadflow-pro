import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Lead, PipelineStage, ContactMethod, StageHistoryEntry, PipelineFilters, SavedView, HealthStatus } from '@/types'

// Stage win probabilities (used for weighted pipeline value)
export const STAGE_WIN_PROBABILITIES: Record<PipelineStage, number> = {
  new: 10,
  contacted: 20,
  qualified: 40,
  proposal: 60,
  negotiation: 80,
  won: 100,
  lost: 0,
}

// Days before a deal is considered "at risk" per stage
export const STAGE_ROTTING_DAYS: Record<PipelineStage, number> = {
  new: 3,
  contacted: 5,
  qualified: 7,
  proposal: 10,
  negotiation: 14,
  won: Infinity,
  lost: Infinity,
}

export interface PipelineActivity {
  id: string
  type: 'contacted' | 'note_added' | 'stage_changed' | 'tag_added' | 'follow_up_scheduled' | 'deal_value_changed'
  contactMethod?: string
  details: string
  createdAt: string
}

export interface CustomField {
  key: string
  value: string
}

export interface PipelineLead extends Lead {
  pipelineId: string
  stage: PipelineStage
  addedAt: string
  notes: string[]
  tags: string[]
  customFields: CustomField[]
  activities: PipelineActivity[]
  nextFollowUpAt?: string
  lastContactedAt?: string
  lastContactMethod?: ContactMethod

  // Deal value tracking
  dealValue?: number
  currency?: string
  winProbability?: number

  // Health tracking
  stageEnteredAt: string
  stageHistory: StageHistoryEntry[]
}

export interface SavedLead extends Lead {
  savedAt: string
  searchQuery?: { category: string; location: string }
}

export interface SearchHistoryEntry {
  id: string
  category: string
  location: string
  minRating?: number
  leads: Lead[]
  searchedAt: string
}

interface LeadStore {
  // Discovered leads (from search - not persisted)
  discoveredLeads: Lead[]
  setDiscoveredLeads: (leads: Lead[]) => void
  clearDiscoveredLeads: () => void

  // Saved leads (persisted)
  savedLeads: SavedLead[]
  saveLead: (lead: Lead, searchQuery?: { category: string; location: string }) => void
  unsaveLead: (leadId: string) => void
  isLeadSaved: (leadId: string) => boolean
  clearSavedLeads: () => void

  // Pipeline leads
  pipelineLeads: PipelineLead[]
  addToPipeline: (lead: Lead) => void
  removeFromPipeline: (pipelineId: string) => void
  updateLeadStage: (pipelineId: string, stage: PipelineStage) => void
  getLeadsByStage: (stage: PipelineStage) => PipelineLead[]

  // Deal value tracking
  setDealValue: (pipelineId: string, value: number) => void
  setWinProbability: (pipelineId: string, probability: number) => void

  // Pipeline metrics (computed)
  getTotalPipelineValue: () => number
  getWeightedPipelineValue: () => number
  getStageValue: (stage: PipelineStage) => number
  getStageWeightedValue: (stage: PipelineStage) => number

  // Health tracking
  getLeadDaysInStage: (pipelineId: string) => number
  getLeadHealthStatus: (pipelineId: string) => HealthStatus
  getAtRiskLeads: () => PipelineLead[]
  getLeadHealthPercentage: (pipelineId: string) => number

  // Contact tracking
  trackContact: (pipelineId: string, method: ContactMethod, notes?: string) => void

  // Notes
  addNote: (pipelineId: string, note: string) => void

  // Tags
  addTag: (pipelineId: string, tag: string) => void
  removeTag: (pipelineId: string, tag: string) => void

  // Custom fields
  addCustomField: (pipelineId: string, key: string, value: string) => void
  updateCustomField: (pipelineId: string, key: string, value: string) => void
  removeCustomField: (pipelineId: string, key: string) => void

  // Follow-up scheduling
  scheduleFollowUp: (pipelineId: string, date: string, note?: string) => void
  clearFollowUp: (pipelineId: string) => void
  getFollowUpsDue: () => PipelineLead[]

  // Bulk operations
  bulkUpdateStage: (pipelineIds: string[], stage: PipelineStage) => void
  bulkDelete: (pipelineIds: string[]) => void
  bulkAddTags: (pipelineIds: string[], tags: string[]) => void

  // Filtering
  activeFilters: PipelineFilters
  setFilters: (filters: PipelineFilters) => void
  clearFilters: () => void
  getFilteredLeads: () => PipelineLead[]

  // Saved views
  savedViews: SavedView[]
  currentViewId: string | null
  addSavedView: (name: string, filters: PipelineFilters) => void
  updateSavedView: (id: string, updates: Partial<SavedView>) => void
  deleteSavedView: (id: string) => void
  setCurrentView: (id: string | null) => void

  // Focus mode
  focusedLeadId: string | null
  setFocusedLead: (pipelineId: string | null) => void
  navigateToNextLead: () => void
  navigateToPrevLead: () => void

  // Keyboard navigation
  selectedLeadIndex: number
  selectedStageIndex: number
  setSelectedLeadIndex: (index: number) => void
  setSelectedStageIndex: (index: number) => void

  // Search history
  lastSearch: { category: string; location: string } | null
  setLastSearch: (search: { category: string; location: string }) => void
  searchHistory: SearchHistoryEntry[]
  addSearchToHistory: (search: { category: string; location: string; minRating?: number; leads: Lead[] }) => void
  removeSearchFromHistory: (id: string) => void
  clearSearchHistory: () => void
  findExistingSearch: (category: string, location: string) => SearchHistoryEntry | undefined
}

export const useLeadStore = create<LeadStore>()(
  persist(
    (set, get) => ({
      // Discovered leads
      discoveredLeads: [],
      setDiscoveredLeads: (leads) => set({ discoveredLeads: leads }),
      clearDiscoveredLeads: () => set({ discoveredLeads: [] }),

      // Saved leads
      savedLeads: [],
      saveLead: (lead, searchQuery) => {
        const existing = get().savedLeads.find((l) => l.id === lead.id)
        if (existing) return // Already saved

        const savedLead: SavedLead = {
          ...lead,
          savedAt: new Date().toISOString(),
          searchQuery,
        }
        set((state) => ({
          savedLeads: [savedLead, ...state.savedLeads],
        }))
      },
      unsaveLead: (leadId) =>
        set((state) => ({
          savedLeads: state.savedLeads.filter((l) => l.id !== leadId),
        })),
      isLeadSaved: (leadId) => get().savedLeads.some((l) => l.id === leadId),
      clearSavedLeads: () => set({ savedLeads: [] }),

      // Pipeline leads
      pipelineLeads: [],
      addToPipeline: (lead) => {
        const existing = get().pipelineLeads.find(
          (l) => l.id === lead.id || l.businessName === lead.businessName
        )
        if (existing) return // Already in pipeline

        const now = new Date().toISOString()
        const pipelineLead: PipelineLead = {
          ...lead,
          pipelineId: `pipeline-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          stage: 'new',
          addedAt: now,
          notes: [],
          tags: [],
          customFields: [],
          activities: [
            {
              id: `activity-${Date.now()}`,
              type: 'stage_changed',
              details: 'Lead added to pipeline',
              createdAt: now,
            },
          ],
          // Deal value tracking
          dealValue: undefined,
          currency: 'USD',
          winProbability: undefined,
          // Health tracking
          stageEnteredAt: now,
          stageHistory: [
            {
              stage: 'new',
              enteredAt: now,
            },
          ],
        }
        set((state) => ({
          pipelineLeads: [...state.pipelineLeads, pipelineLead],
        }))
      },
      removeFromPipeline: (pipelineId) =>
        set((state) => ({
          pipelineLeads: state.pipelineLeads.filter(
            (l) => l.pipelineId !== pipelineId
          ),
        })),
      updateLeadStage: (pipelineId, stage) =>
        set((state) => ({
          pipelineLeads: state.pipelineLeads.map((l) => {
            if (l.pipelineId !== pipelineId) return l
            if (l.stage === stage) return l // No change
            const now = new Date().toISOString()
            const updatedHistory = l.stageHistory.map((h) => {
              if (h.stage === l.stage && !h.exitedAt) {
                const enteredDate = new Date(h.enteredAt)
                const exitedDate = new Date(now)
                const durationDays = Math.round(
                  (exitedDate.getTime() - enteredDate.getTime()) / (1000 * 60 * 60 * 24)
                )
                return { ...h, exitedAt: now, durationDays }
              }
              return h
            })
            return {
              ...l,
              stage,
              stageEnteredAt: now,
              stageHistory: [
                ...updatedHistory,
                { stage, enteredAt: now },
              ],
              activities: [
                ...l.activities,
                {
                  id: `activity-${Date.now()}`,
                  type: 'stage_changed' as const,
                  details: `Stage changed from "${l.stage}" to "${stage}"`,
                  createdAt: now,
                },
              ],
            }
          }),
        })),
      getLeadsByStage: (stage) =>
        get().pipelineLeads.filter((l) => l.stage === stage),

      // Deal value tracking
      setDealValue: (pipelineId, value) =>
        set((state) => ({
          pipelineLeads: state.pipelineLeads.map((l) => {
            if (l.pipelineId !== pipelineId) return l
            const now = new Date().toISOString()
            const oldValue = l.dealValue
            return {
              ...l,
              dealValue: value,
              activities: [
                ...l.activities,
                {
                  id: `activity-${Date.now()}`,
                  type: 'deal_value_changed' as const,
                  details: oldValue
                    ? `Deal value changed from $${oldValue.toLocaleString()} to $${value.toLocaleString()}`
                    : `Deal value set to $${value.toLocaleString()}`,
                  createdAt: now,
                },
              ],
            }
          }),
        })),
      setWinProbability: (pipelineId, probability) =>
        set((state) => ({
          pipelineLeads: state.pipelineLeads.map((l) =>
            l.pipelineId === pipelineId ? { ...l, winProbability: probability } : l
          ),
        })),

      // Pipeline metrics (computed)
      getTotalPipelineValue: () => {
        return get()
          .pipelineLeads.filter((l) => l.stage !== 'lost')
          .reduce((sum, l) => sum + (l.dealValue || 0), 0)
      },
      getWeightedPipelineValue: () => {
        return get()
          .pipelineLeads.filter((l) => l.stage !== 'lost' && l.stage !== 'won')
          .reduce((sum, l) => {
            const prob = l.winProbability ?? STAGE_WIN_PROBABILITIES[l.stage]
            return sum + (l.dealValue || 0) * (prob / 100)
          }, 0)
      },
      getStageValue: (stage) => {
        return get()
          .pipelineLeads.filter((l) => l.stage === stage)
          .reduce((sum, l) => sum + (l.dealValue || 0), 0)
      },
      getStageWeightedValue: (stage) => {
        return get()
          .pipelineLeads.filter((l) => l.stage === stage)
          .reduce((sum, l) => {
            const prob = l.winProbability ?? STAGE_WIN_PROBABILITIES[stage]
            return sum + (l.dealValue || 0) * (prob / 100)
          }, 0)
      },

      // Health tracking
      getLeadDaysInStage: (pipelineId) => {
        const lead = get().pipelineLeads.find((l) => l.pipelineId === pipelineId)
        if (!lead) return 0
        const enteredDate = new Date(lead.stageEnteredAt)
        const now = new Date()
        return Math.round((now.getTime() - enteredDate.getTime()) / (1000 * 60 * 60 * 24))
      },
      getLeadHealthStatus: (pipelineId) => {
        const lead = get().pipelineLeads.find((l) => l.pipelineId === pipelineId)
        if (!lead) return 'healthy'
        const daysInStage = get().getLeadDaysInStage(pipelineId)
        const threshold = STAGE_ROTTING_DAYS[lead.stage]
        if (threshold === Infinity) return 'healthy'
        if (daysInStage >= threshold) return 'at_risk'
        if (daysInStage >= threshold * 0.5) return 'aging'
        return 'healthy'
      },
      getLeadHealthPercentage: (pipelineId) => {
        const lead = get().pipelineLeads.find((l) => l.pipelineId === pipelineId)
        if (!lead) return 0
        const daysInStage = get().getLeadDaysInStage(pipelineId)
        const threshold = STAGE_ROTTING_DAYS[lead.stage]
        if (threshold === Infinity) return 0
        return Math.min(100, (daysInStage / threshold) * 100)
      },
      getAtRiskLeads: () => {
        return get().pipelineLeads.filter((l) => {
          const daysInStage = get().getLeadDaysInStage(l.pipelineId)
          const threshold = STAGE_ROTTING_DAYS[l.stage]
          return threshold !== Infinity && daysInStage >= threshold
        })
      },

      // Contact tracking
      trackContact: (pipelineId, method, notes) =>
        set((state) => ({
          pipelineLeads: state.pipelineLeads.map((l) => {
            if (l.pipelineId !== pipelineId) return l
            const now = new Date().toISOString()
            const activities = [
              ...l.activities,
              {
                id: `activity-${Date.now()}`,
                type: 'contacted' as const,
                contactMethod: method,
                details: notes || `Contacted via ${method}`,
                createdAt: now,
              },
            ]

            // Auto-move to contacted stage if in "new" stage
            let newStage = l.stage
            if (l.stage === 'new') {
              newStage = 'contacted'
              activities.push({
                id: `activity-${Date.now()}-stage`,
                type: 'stage_changed' as const,
                details: 'Automatically moved to "contacted" stage',
                createdAt: now,
              })
            }

            return {
              ...l,
              stage: newStage,
              lastContactedAt: now,
              lastContactMethod: method,
              activities,
            }
          }),
        })),

      // Notes
      addNote: (pipelineId, note) =>
        set((state) => ({
          pipelineLeads: state.pipelineLeads.map((l) => {
            if (l.pipelineId !== pipelineId) return l
            const now = new Date().toISOString()
            return {
              ...l,
              notes: [...l.notes, note],
              activities: [
                ...l.activities,
                {
                  id: `activity-${Date.now()}`,
                  type: 'note_added' as const,
                  details: note,
                  createdAt: now,
                },
              ],
            }
          }),
        })),

      // Tags
      addTag: (pipelineId, tag) =>
        set((state) => ({
          pipelineLeads: state.pipelineLeads.map((l) => {
            if (l.pipelineId !== pipelineId) return l
            if (l.tags.includes(tag)) return l
            const now = new Date().toISOString()
            return {
              ...l,
              tags: [...l.tags, tag],
              activities: [
                ...l.activities,
                {
                  id: `activity-${Date.now()}`,
                  type: 'tag_added' as const,
                  details: `Tag "${tag}" added`,
                  createdAt: now,
                },
              ],
            }
          }),
        })),
      removeTag: (pipelineId, tag) =>
        set((state) => ({
          pipelineLeads: state.pipelineLeads.map((l) => {
            if (l.pipelineId !== pipelineId) return l
            return {
              ...l,
              tags: l.tags.filter((t) => t !== tag),
            }
          }),
        })),

      // Custom fields
      addCustomField: (pipelineId, key, value) =>
        set((state) => ({
          pipelineLeads: state.pipelineLeads.map((l) => {
            if (l.pipelineId !== pipelineId) return l
            // Check if field already exists
            if (l.customFields.some((f) => f.key === key)) return l
            return {
              ...l,
              customFields: [...l.customFields, { key, value }],
            }
          }),
        })),
      updateCustomField: (pipelineId, key, value) =>
        set((state) => ({
          pipelineLeads: state.pipelineLeads.map((l) => {
            if (l.pipelineId !== pipelineId) return l
            return {
              ...l,
              customFields: l.customFields.map((f) =>
                f.key === key ? { ...f, value } : f
              ),
            }
          }),
        })),
      removeCustomField: (pipelineId, key) =>
        set((state) => ({
          pipelineLeads: state.pipelineLeads.map((l) => {
            if (l.pipelineId !== pipelineId) return l
            return {
              ...l,
              customFields: l.customFields.filter((f) => f.key !== key),
            }
          }),
        })),

      // Follow-up scheduling
      scheduleFollowUp: (pipelineId, date, note) =>
        set((state) => ({
          pipelineLeads: state.pipelineLeads.map((l) => {
            if (l.pipelineId !== pipelineId) return l
            const now = new Date().toISOString()
            return {
              ...l,
              nextFollowUpAt: date,
              activities: [
                ...l.activities,
                {
                  id: `activity-${Date.now()}`,
                  type: 'follow_up_scheduled' as const,
                  details:
                    note ||
                    `Follow-up scheduled for ${new Date(date).toLocaleDateString()}`,
                  createdAt: now,
                },
              ],
            }
          }),
        })),
      clearFollowUp: (pipelineId) =>
        set((state) => ({
          pipelineLeads: state.pipelineLeads.map((l) => {
            if (l.pipelineId !== pipelineId) return l
            return {
              ...l,
              nextFollowUpAt: undefined,
            }
          }),
        })),
      getFollowUpsDue: () => {
        const now = new Date()
        return get()
          .pipelineLeads.filter(
            (l) => l.nextFollowUpAt && new Date(l.nextFollowUpAt) <= now
          )
          .sort((a, b) => {
            if (!a.nextFollowUpAt || !b.nextFollowUpAt) return 0
            return (
              new Date(a.nextFollowUpAt).getTime() -
              new Date(b.nextFollowUpAt).getTime()
            )
          })
      },

      // Bulk operations
      bulkUpdateStage: (pipelineIds, stage) =>
        set((state) => ({
          pipelineLeads: state.pipelineLeads.map((l) => {
            if (!pipelineIds.includes(l.pipelineId)) return l
            if (l.stage === stage) return l // No change
            const now = new Date().toISOString()
            const updatedHistory = l.stageHistory.map((h) => {
              if (h.stage === l.stage && !h.exitedAt) {
                const enteredDate = new Date(h.enteredAt)
                const exitedDate = new Date(now)
                const durationDays = Math.round(
                  (exitedDate.getTime() - enteredDate.getTime()) / (1000 * 60 * 60 * 24)
                )
                return { ...h, exitedAt: now, durationDays }
              }
              return h
            })
            return {
              ...l,
              stage,
              stageEnteredAt: now,
              stageHistory: [
                ...updatedHistory,
                { stage, enteredAt: now },
              ],
              activities: [
                ...l.activities,
                {
                  id: `activity-${Date.now()}-${l.pipelineId}`,
                  type: 'stage_changed' as const,
                  details: `Stage changed from "${l.stage}" to "${stage}" (bulk update)`,
                  createdAt: now,
                },
              ],
            }
          }),
        })),
      bulkDelete: (pipelineIds) =>
        set((state) => ({
          pipelineLeads: state.pipelineLeads.filter(
            (l) => !pipelineIds.includes(l.pipelineId)
          ),
        })),
      bulkAddTags: (pipelineIds, tags) =>
        set((state) => ({
          pipelineLeads: state.pipelineLeads.map((l) => {
            if (!pipelineIds.includes(l.pipelineId)) return l
            const newTags = tags.filter((t) => !l.tags.includes(t))
            if (newTags.length === 0) return l
            return {
              ...l,
              tags: [...l.tags, ...newTags],
            }
          }),
        })),

      // Filtering
      activeFilters: {},
      setFilters: (filters) => set({ activeFilters: filters }),
      clearFilters: () => set({ activeFilters: {} }),
      getFilteredLeads: () => {
        const { pipelineLeads, activeFilters } = get()
        if (Object.keys(activeFilters).length === 0) return pipelineLeads

        return pipelineLeads.filter((lead) => {
          // Stage filter
          if (activeFilters.stages?.length && !activeFilters.stages.includes(lead.stage)) {
            return false
          }
          // Tag filter
          if (activeFilters.tags?.length) {
            const hasMatchingTag = activeFilters.tags.some((t) => lead.tags.includes(t))
            if (!hasMatchingTag) return false
          }
          // Value range filter
          if (activeFilters.minValue !== undefined && (lead.dealValue || 0) < activeFilters.minValue) {
            return false
          }
          if (activeFilters.maxValue !== undefined && (lead.dealValue || 0) > activeFilters.maxValue) {
            return false
          }
          // Score range filter
          if (activeFilters.minScore !== undefined && (lead.leadScore || 0) < activeFilters.minScore) {
            return false
          }
          if (activeFilters.maxScore !== undefined && (lead.leadScore || 0) > activeFilters.maxScore) {
            return false
          }
          // Days in stage filter
          const daysInStage = get().getLeadDaysInStage(lead.pipelineId)
          if (activeFilters.minDaysInStage !== undefined && daysInStage < activeFilters.minDaysInStage) {
            return false
          }
          if (activeFilters.maxDaysInStage !== undefined && daysInStage > activeFilters.maxDaysInStage) {
            return false
          }
          // At risk filter
          if (activeFilters.isAtRisk) {
            const status = get().getLeadHealthStatus(lead.pipelineId)
            if (status !== 'at_risk') return false
          }
          // Follow-up filters
          if (activeFilters.hasFollowUp && !lead.nextFollowUpAt) {
            return false
          }
          if (activeFilters.noFollowUp && lead.nextFollowUpAt) {
            return false
          }
          // Search query filter
          if (activeFilters.searchQuery) {
            const query = activeFilters.searchQuery.toLowerCase()
            const matchesName = lead.businessName.toLowerCase().includes(query)
            const matchesCategory = lead.category?.toLowerCase().includes(query)
            const matchesCity = lead.city?.toLowerCase().includes(query)
            if (!matchesName && !matchesCategory && !matchesCity) return false
          }
          return true
        })
      },

      // Saved views
      savedViews: [],
      currentViewId: null,
      addSavedView: (name, filters) => {
        const view: SavedView = {
          id: `view-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name,
          filters,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          savedViews: [...state.savedViews, view],
          currentViewId: view.id,
          activeFilters: filters,
        }))
      },
      updateSavedView: (id, updates) =>
        set((state) => ({
          savedViews: state.savedViews.map((v) =>
            v.id === id ? { ...v, ...updates } : v
          ),
        })),
      deleteSavedView: (id) =>
        set((state) => ({
          savedViews: state.savedViews.filter((v) => v.id !== id),
          currentViewId: state.currentViewId === id ? null : state.currentViewId,
        })),
      setCurrentView: (id) => {
        const view = id ? get().savedViews.find((v) => v.id === id) : null
        set({
          currentViewId: id,
          activeFilters: view?.filters || {},
        })
      },

      // Focus mode
      focusedLeadId: null,
      setFocusedLead: (pipelineId) => set({ focusedLeadId: pipelineId }),
      navigateToNextLead: () => {
        const { pipelineLeads, focusedLeadId } = get()
        if (!focusedLeadId) return
        const currentIndex = pipelineLeads.findIndex((l) => l.pipelineId === focusedLeadId)
        if (currentIndex === -1) return
        const nextIndex = (currentIndex + 1) % pipelineLeads.length
        set({ focusedLeadId: pipelineLeads[nextIndex].pipelineId })
      },
      navigateToPrevLead: () => {
        const { pipelineLeads, focusedLeadId } = get()
        if (!focusedLeadId) return
        const currentIndex = pipelineLeads.findIndex((l) => l.pipelineId === focusedLeadId)
        if (currentIndex === -1) return
        const prevIndex = (currentIndex - 1 + pipelineLeads.length) % pipelineLeads.length
        set({ focusedLeadId: pipelineLeads[prevIndex].pipelineId })
      },

      // Keyboard navigation
      selectedLeadIndex: -1,
      selectedStageIndex: 0,
      setSelectedLeadIndex: (index) => set({ selectedLeadIndex: index }),
      setSelectedStageIndex: (index) => set({ selectedStageIndex: index }),

      // Search history
      lastSearch: null,
      setLastSearch: (search) => set({ lastSearch: search }),
      searchHistory: [],
      addSearchToHistory: (search) => {
        const entry: SearchHistoryEntry = {
          id: `search-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          category: search.category,
          location: search.location,
          minRating: search.minRating,
          leads: search.leads,
          searchedAt: new Date().toISOString(),
        }
        set((state) => ({
          searchHistory: [entry, ...state.searchHistory].slice(0, 30), // Keep last 30 searches
        }))
      },
      removeSearchFromHistory: (id) =>
        set((state) => ({
          searchHistory: state.searchHistory.filter((s) => s.id !== id),
        })),
      clearSearchHistory: () => set({ searchHistory: [] }),
      findExistingSearch: (category, location) => {
        const normalizedCategory = category.toLowerCase().trim()
        const normalizedLocation = location.toLowerCase().trim()
        return get().searchHistory.find(
          (s) =>
            s.category.toLowerCase().trim() === normalizedCategory &&
            s.location.toLowerCase().trim() === normalizedLocation
        )
      },
    }),
    {
      name: 'leadflow-leads',
      partialize: (state) => ({
        pipelineLeads: state.pipelineLeads,
        savedLeads: state.savedLeads,
        lastSearch: state.lastSearch,
        searchHistory: state.searchHistory,
        savedViews: state.savedViews,
        currentViewId: state.currentViewId,
        activeFilters: state.activeFilters,
      }),
    }
  )
)
