import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SimpleLead {
  id: string
  name: string
  company: string
  email: string
  columnId: string
  createdAt: string
  notes: string
  value?: number
}

export interface Column {
  id: string
  title: string
  color: string
}

interface SimplePipelineStore {
  columns: Column[]
  leads: SimpleLead[]
  addColumn: (title: string, color?: string) => void
  removeColumn: (id: string) => void
  addLead: (lead: Omit<SimpleLead, 'id' | 'createdAt'>) => void
  updateLead: (id: string, updates: Partial<SimpleLead>) => void
  deleteLead: (id: string) => void
  moveLead: (leadId: string, targetColumnId: string) => void
  setColumns: (columns: Column[]) => void
}

export const useSimplePipelineStore = create<SimplePipelineStore>()(
  persist(
    (set) => ({
      columns: [
        { id: 'lead-in', title: 'New Leads', color: 'bg-blue-500' },
        { id: 'contacted', title: 'Contacted', color: 'bg-yellow-500' },
        { id: 'meeting', title: 'Meeting Scheduled', color: 'bg-orange-500' },
        { id: 'proposal', title: 'Proposal Sent', color: 'bg-purple-500' },
        { id: 'won', title: 'Closed Won', color: 'bg-green-500' },
      ],
      leads: [],
      addColumn: (title, color = 'bg-gray-500') =>
        set((state) => ({
          columns: [
            ...state.columns,
            { id: `col-${Date.now()}`, title, color },
          ],
        })),
      removeColumn: (id) =>
        set((state) => ({
          columns: state.columns.filter((c) => c.id !== id),
        })),
      addLead: (lead) =>
        set((state) => ({
          leads: [
            ...state.leads,
            { ...lead, id: `lead-${Date.now()}`, createdAt: new Date().toISOString() },
          ],
        })),
      updateLead: (id, updates) =>
        set((state) => ({
          leads: state.leads.map((l) => (l.id === id ? { ...l, ...updates } : l)),
        })),
      deleteLead: (id) =>
        set((state) => ({
          leads: state.leads.filter((l) => l.id !== id),
        })),
      moveLead: (leadId, targetColumnId) =>
        set((state) => ({
          leads: state.leads.map((l) =>
            l.id === leadId ? { ...l, columnId: targetColumnId } : l
          ),
        })),
      setColumns: (columns) => set({ columns }),
    }),
    {
      name: 'simple-pipeline-storage',
    }
  )
)
