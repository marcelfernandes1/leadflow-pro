import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Lead, PipelineStage } from '@/types'

interface PipelineLead extends Lead {
  pipelineId: string
  stage: PipelineStage
  addedAt: string
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

        const pipelineLead: PipelineLead = {
          ...lead,
          pipelineId: `pipeline-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          stage: 'new',
          addedAt: new Date().toISOString(),
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
          pipelineLeads: state.pipelineLeads.map((l) =>
            l.pipelineId === pipelineId ? { ...l, stage } : l
          ),
        })),
      getLeadsByStage: (stage) =>
        get().pipelineLeads.filter((l) => l.stage === stage),

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
