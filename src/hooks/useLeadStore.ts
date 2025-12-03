import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Lead, PipelineStage, ContactMethod } from '@/types'

export interface PipelineActivity {
  id: string
  type: 'contacted' | 'note_added' | 'stage_changed' | 'tag_added' | 'follow_up_scheduled'
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
}

interface LeadStore {
  // Discovered leads (from search)
  discoveredLeads: Lead[]
  setDiscoveredLeads: (leads: Lead[]) => void
  clearDiscoveredLeads: () => void

  // Pipeline leads
  pipelineLeads: PipelineLead[]
  addToPipeline: (lead: Lead) => void
  removeFromPipeline: (pipelineId: string) => void
  updateLeadStage: (pipelineId: string, stage: PipelineStage) => void
  getLeadsByStage: (stage: PipelineStage) => PipelineLead[]

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

  // Search history
  lastSearch: { category: string; location: string } | null
  setLastSearch: (search: { category: string; location: string }) => void
}

export const useLeadStore = create<LeadStore>()(
  persist(
    (set, get) => ({
      // Discovered leads
      discoveredLeads: [],
      setDiscoveredLeads: (leads) => set({ discoveredLeads: leads }),
      clearDiscoveredLeads: () => set({ discoveredLeads: [] }),

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
            const now = new Date().toISOString()
            return {
              ...l,
              stage,
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
            const now = new Date().toISOString()
            return {
              ...l,
              stage,
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

      // Search history
      lastSearch: null,
      setLastSearch: (search) => set({ lastSearch: search }),
    }),
    {
      name: 'leadflow-leads',
      partialize: (state) => ({
        pipelineLeads: state.pipelineLeads,
        lastSearch: state.lastSearch,
      }),
    }
  )
)
