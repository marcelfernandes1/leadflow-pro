import { useEffect, useState, useMemo, useCallback } from 'react'
import { Command } from 'cmdk'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  ArrowRight,
  Tag,
  FileText,
  Calendar,
  DollarSign,
  Filter,
  Eye,
  Zap,
  AlertTriangle,
  Building2,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLeadStore, type PipelineLead } from '@/hooks/useLeadStore'
import type { PipelineStage } from '@/types'
import { Badge } from '@/components/ui/badge'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectLead: (lead: PipelineLead) => void
  onQuickAction: (action: string, leadId?: string) => void
}

const stages: { id: PipelineStage; title: string }[] = [
  { id: 'new', title: 'New Leads' },
  { id: 'contacted', title: 'Contacted' },
  { id: 'qualified', title: 'Qualified' },
  { id: 'proposal', title: 'Proposal' },
  { id: 'negotiation', title: 'Negotiation' },
  { id: 'won', title: 'Closed Won' },
  { id: 'lost', title: 'Closed Lost' },
]

export function CommandPalette({
  open,
  onOpenChange,
  onSelectLead,
  onQuickAction,
}: CommandPaletteProps) {
  const [search, setSearch] = useState('')
  const [pages, setPages] = useState<string[]>([])
  const [selectedLeadForAction, setSelectedLeadForAction] = useState<PipelineLead | null>(null)

  const {
    pipelineLeads,
    setFilters,
    getAtRiskLeads,
    updateLeadStage,
  } = useLeadStore()

  const page = pages[pages.length - 1]

  // Reset state when closed
  useEffect(() => {
    if (!open) {
      setSearch('')
      setPages([])
      setSelectedLeadForAction(null)
    }
  }, [open])

  // Filtered leads based on search
  const filteredLeads = useMemo(() => {
    if (!search) return pipelineLeads.slice(0, 10)
    const query = search.toLowerCase()
    return pipelineLeads
      .filter((lead) =>
        lead.businessName.toLowerCase().includes(query) ||
        lead.city?.toLowerCase().includes(query) ||
        lead.category?.toLowerCase().includes(query) ||
        lead.tags?.some((t) => t.toLowerCase().includes(query))
      )
      .slice(0, 10)
  }, [pipelineLeads, search])

  const atRiskLeads = getAtRiskLeads()

  const handleSelect = useCallback((callback: () => void) => {
    callback()
    onOpenChange(false)
  }, [onOpenChange])

  // Quick filter actions
  const quickFilters = [
    {
      id: 'hot-leads',
      label: 'Hot Leads',
      icon: Zap,
      description: 'Score 80+',
      action: () => setFilters({ minScore: 80 }),
    },
    {
      id: 'at-risk',
      label: 'At Risk Deals',
      icon: AlertTriangle,
      description: `${atRiskLeads.length} deals`,
      action: () => setFilters({ isAtRisk: true }),
    },
    {
      id: 'high-value',
      label: 'High Value',
      icon: DollarSign,
      description: '$10k+',
      action: () => setFilters({ minValue: 10000 }),
    },
    {
      id: 'needs-followup',
      label: 'Needs Follow-up',
      icon: Calendar,
      description: 'No follow-up set',
      action: () => setFilters({ noFollowUp: true }),
    },
    {
      id: 'clear-filters',
      label: 'Clear All Filters',
      icon: Filter,
      description: 'Show all leads',
      action: () => setFilters({}),
    },
  ]

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => onOpenChange(false)}
          />

          {/* Command Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] as const }}
            className="fixed left-1/2 top-[20%] -translate-x-1/2 w-full max-w-2xl z-50"
          >
            <Command
              className="bg-elevated/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
              loop
            >
              {/* Search Input */}
              <div className="flex items-center border-b border-border/30 px-4">
                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder={
                    page === 'move'
                      ? 'Select stage...'
                      : page === 'value'
                      ? 'Enter deal value...'
                      : 'Search leads, actions, or type a command...'
                  }
                  className="flex-1 px-3 py-4 bg-transparent text-base outline-none placeholder:text-muted-foreground/60"
                  autoFocus
                />
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface text-xs text-muted-foreground border border-border/30">
                  ESC
                </kbd>
              </div>

              {/* Command List */}
              <Command.List className="max-h-[400px] overflow-y-auto p-2">
                <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
                  No results found.
                </Command.Empty>

                {/* Back button for sub-pages */}
                {page && (
                  <Command.Item
                    onSelect={() => setPages((pages) => pages.slice(0, -1))}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-muted-foreground hover:bg-surface/50"
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                    Back
                  </Command.Item>
                )}

                {/* Move to stage sub-page */}
                {page === 'move' && selectedLeadForAction && (
                  <Command.Group heading="Move to Stage">
                    {stages.map((stage) => (
                      <Command.Item
                        key={stage.id}
                        value={stage.title}
                        onSelect={() =>
                          handleSelect(() => {
                            updateLeadStage(selectedLeadForAction.pipelineId, stage.id)
                            onQuickAction('moved', selectedLeadForAction.pipelineId)
                          })
                        }
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer',
                          'hover:bg-surface/50 aria-selected:bg-surface/80',
                          selectedLeadForAction.stage === stage.id && 'text-primary'
                        )}
                      >
                        <ArrowRight className="h-4 w-4" />
                        {stage.title}
                        {selectedLeadForAction.stage === stage.id && (
                          <Badge variant="default" className="ml-auto text-2xs">
                            Current
                          </Badge>
                        )}
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {/* Main content when no sub-page */}
                {!page && (
                  <>
                    {/* Leads */}
                    {filteredLeads.length > 0 && (
                      <Command.Group heading="Leads">
                        {filteredLeads.map((lead) => (
                          <Command.Item
                            key={lead.pipelineId}
                            value={`${lead.businessName} ${lead.city}`}
                            onSelect={() => handleSelect(() => onSelectLead(lead))}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer hover:bg-surface/50 aria-selected:bg-surface/80"
                          >
                            <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium truncate">{lead.businessName}</span>
                                {lead.leadScore && (
                                  <Badge
                                    variant={
                                      lead.leadScore >= 80 ? 'hot' :
                                      lead.leadScore >= 60 ? 'warm' : 'cold'
                                    }
                                    className="text-2xs shrink-0"
                                  >
                                    {lead.leadScore}
                                  </Badge>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground truncate block">
                                {lead.city}, {lead.state} · {stages.find(s => s.id === lead.stage)?.title}
                              </span>
                            </div>
                            {lead.dealValue && (
                              <span className="text-xs font-medium text-success tabular-nums">
                                ${lead.dealValue.toLocaleString()}
                              </span>
                            )}
                          </Command.Item>
                        ))}
                      </Command.Group>
                    )}

                    {/* Quick Actions */}
                    <Command.Group heading="Quick Actions">
                      {filteredLeads.length === 1 && (
                        <>
                          <Command.Item
                            value="move stage"
                            onSelect={() => {
                              setSelectedLeadForAction(filteredLeads[0])
                              setPages([...pages, 'move'])
                            }}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer hover:bg-surface/50 aria-selected:bg-surface/80"
                          >
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <span>Move "{filteredLeads[0].businessName}" to stage</span>
                            <kbd className="ml-auto px-1.5 py-0.5 rounded bg-surface text-2xs text-muted-foreground">
                              M
                            </kbd>
                          </Command.Item>
                          <Command.Item
                            value="add tag"
                            onSelect={() => handleSelect(() => onQuickAction('tag', filteredLeads[0].pipelineId))}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer hover:bg-surface/50 aria-selected:bg-surface/80"
                          >
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            <span>Add tag to "{filteredLeads[0].businessName}"</span>
                            <kbd className="ml-auto px-1.5 py-0.5 rounded bg-surface text-2xs text-muted-foreground">
                              T
                            </kbd>
                          </Command.Item>
                          <Command.Item
                            value="add note"
                            onSelect={() => handleSelect(() => onQuickAction('note', filteredLeads[0].pipelineId))}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer hover:bg-surface/50 aria-selected:bg-surface/80"
                          >
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span>Add note to "{filteredLeads[0].businessName}"</span>
                            <kbd className="ml-auto px-1.5 py-0.5 rounded bg-surface text-2xs text-muted-foreground">
                              N
                            </kbd>
                          </Command.Item>
                          <Command.Item
                            value="set value"
                            onSelect={() => handleSelect(() => onQuickAction('value', filteredLeads[0].pipelineId))}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer hover:bg-surface/50 aria-selected:bg-surface/80"
                          >
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span>Set deal value</span>
                            <kbd className="ml-auto px-1.5 py-0.5 rounded bg-surface text-2xs text-muted-foreground">
                              V
                            </kbd>
                          </Command.Item>
                        </>
                      )}
                    </Command.Group>

                    {/* Quick Filters */}
                    <Command.Group heading="Quick Filters">
                      {quickFilters.map((filter) => (
                        <Command.Item
                          key={filter.id}
                          value={filter.label}
                          onSelect={() => handleSelect(filter.action)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer hover:bg-surface/50 aria-selected:bg-surface/80"
                        >
                          <filter.icon className="h-4 w-4 text-muted-foreground" />
                          <span>{filter.label}</span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {filter.description}
                          </span>
                        </Command.Item>
                      ))}
                    </Command.Group>

                    {/* Navigation */}
                    <Command.Group heading="Navigation">
                      {stages.map((stage) => (
                        <Command.Item
                          key={stage.id}
                          value={`go to ${stage.title}`}
                          onSelect={() =>
                            handleSelect(() => setFilters({ stages: [stage.id] }))
                          }
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer hover:bg-surface/50 aria-selected:bg-surface/80"
                        >
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span>Show {stage.title}</span>
                          <Badge variant="default" className="ml-auto text-2xs">
                            {pipelineLeads.filter((l) => l.stage === stage.id).length}
                          </Badge>
                        </Command.Item>
                      ))}
                    </Command.Group>
                  </>
                )}
              </Command.List>

              {/* Footer */}
              <div className="flex items-center gap-4 px-4 py-3 border-t border-border/30 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border/30">↑↓</kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border/30">↵</kbd>
                  <span>Select</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border/30">ESC</kbd>
                  <span>Close</span>
                </div>
              </div>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
