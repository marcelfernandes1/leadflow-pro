import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Plus,
  GripVertical,
  Mail,
  Phone,
  Globe,
  Instagram,
  MoreHorizontal,
  Star,
  Trash2,
  MessageSquare,
  CheckSquare,
  Square,
  Send,
  Download,
  Tags,
  Kanban,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { exportLeadsToCSV } from '@/lib/export'
import { Link } from 'wouter'
import { useLeadStore, type PipelineLead } from '@/hooks/useLeadStore'
import { ContactModal } from '@/components/ContactModal'
import { LeadDetailModal } from '@/components/LeadDetailModal'
import type { PipelineStage, Lead, ContactMethod } from '@/types'

interface StageConfig {
  id: PipelineStage
  title: string
  gradient: string
  glow: string
}

const stages: StageConfig[] = [
  { id: 'new', title: 'New Leads', gradient: 'from-cold to-blue-500', glow: 'shadow-cold/30' },
  { id: 'contacted', title: 'Contacted', gradient: 'from-warm to-orange-500', glow: 'shadow-warm/30' },
  { id: 'qualified', title: 'Qualified', gradient: 'from-primary to-purple-500', glow: 'shadow-primary/30' },
  { id: 'proposal', title: 'Proposal', gradient: 'from-pink-500 to-rose', glow: 'shadow-hot/30' },
  { id: 'negotiation', title: 'Negotiation', gradient: 'from-orange-500 to-warm', glow: 'shadow-warm/30' },
  { id: 'won', title: 'Closed Won', gradient: 'from-success to-green-500', glow: 'shadow-success/30' },
  { id: 'lost', title: 'Closed Lost', gradient: 'from-gray-500 to-gray-600', glow: 'shadow-gray-500/30' },
]

function SortableLeadCard({
  lead,
  isSelected,
  onSelect,
  onRemove,
  onContact,
  onViewDetails,
}: {
  lead: PipelineLead
  isSelected: boolean
  onSelect: () => void
  onRemove: () => void
  onContact: () => void
  onViewDetails: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.pipelineId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-elevated/50 border border-border/30 rounded-xl p-3 cursor-grab active:cursor-grabbing transition-all duration-200',
        isDragging && 'opacity-50 shadow-xl shadow-primary/20',
        isSelected && 'ring-2 ring-violet/50 border-primary/30',
        !isDragging && 'hover:border-border/50 hover:bg-elevated/80'
      )}
      whileHover={{ scale: isDragging ? 1 : 1.01 }}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start gap-2">
        <div
          className="mt-0.5 shrink-0 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          {isSelected ? (
            <CheckSquare className="h-4 w-4 text-primary" />
          ) : (
            <Square className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
          )}
        </div>
        <GripVertical className="h-4 w-4 text-muted-foreground/50 mt-0.5 shrink-0" />
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            onViewDetails()
          }}
        >
          <h4 className="font-medium text-sm truncate">{lead.businessName}</h4>
          <p className="text-xs text-muted-foreground truncate">
            {lead.city}, {lead.state}
          </p>

          {lead.googleRating && (
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-3 w-3 fill-amber text-warm" />
              <span className="text-xs">{lead.googleRating.toFixed(1)}</span>
            </div>
          )}

          {lead.tags && lead.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {lead.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="default" className="text-2xs px-1.5 py-0">
                  {tag}
                </Badge>
              ))}
              {lead.tags.length > 2 && (
                <Badge variant="default" className="text-2xs px-1.5 py-0">
                  +{lead.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 mt-2">
            {lead.leadScore && (
              <Badge
                variant={
                  lead.leadScore >= 80 ? 'hot' :
                  lead.leadScore >= 60 ? 'warm' : 'cold'
                }
                className="text-2xs"
              >
                {lead.leadScore}/100
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1 mt-2">
            {lead.email && (
              <Button
                size="icon-sm"
                variant="ghost"
                className="h-6 w-6 opacity-60 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(`mailto:${lead.email}`)
                }}
              >
                <Mail className="h-3 w-3" />
              </Button>
            )}
            {lead.phone && (
              <Button
                size="icon-sm"
                variant="ghost"
                className="h-6 w-6 opacity-60 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(`tel:${lead.phone}`)
                }}
              >
                <Phone className="h-3 w-3" />
              </Button>
            )}
            {lead.website && (
              <Button
                size="icon-sm"
                variant="ghost"
                className="h-6 w-6 opacity-60 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(lead.website, '_blank')
                }}
              >
                <Globe className="h-3 w-3" />
              </Button>
            )}
            {lead.instagram && (
              <Button
                size="icon-sm"
                variant="ghost"
                className="h-6 w-6 opacity-60 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(
                    `https://instagram.com/${lead.instagram?.replace('@', '')}`,
                    '_blank'
                  )
                }}
              >
                <Instagram className="h-3 w-3" />
              </Button>
            )}

            <Button
              size="icon-sm"
              variant="ghost"
              className="h-6 w-6 opacity-60 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation()
                onContact()
              }}
              title="Track Contact"
            >
              <Send className="h-3 w-3" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="h-6 w-6 ml-auto opacity-60 hover:opacity-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onViewDetails() }}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onContact() }}>
                  <Send className="h-4 w-4 mr-2" />
                  Track Contact
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={(e) => { e.stopPropagation(); onRemove() }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove from Pipeline
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function PipelineColumn({
  stage,
  leads,
  selectedLeads,
  onSelectLead,
  onRemoveLead,
  onContactLead,
  onViewDetails,
}: {
  stage: StageConfig
  leads: PipelineLead[]
  selectedLeads: Set<string>
  onSelectLead: (pipelineId: string) => void
  onRemoveLead: (pipelineId: string) => void
  onContactLead: (lead: PipelineLead) => void
  onViewDetails: (lead: PipelineLead) => void
}) {
  return (
    <div className="flex-shrink-0 w-72">
      <Card variant="default" className="h-full overflow-hidden">
        <CardHeader className="py-3 px-4 border-b border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn('w-2.5 h-2.5 rounded-full bg-gradient-to-br shadow-lg', stage.gradient, stage.glow)} />
              <CardTitle className="text-sm font-medium">
                {stage.title}
              </CardTitle>
            </div>
            <Badge variant="default" className="text-xs">
              {leads.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          <ScrollArea className="h-[calc(100vh-280px)]">
            <SortableContext
              items={leads.map((l) => l.pipelineId)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2 p-1">
                {leads.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    <div className="p-3 rounded-full bg-surface inline-block mb-2">
                      <Plus className="h-5 w-5 opacity-50" />
                    </div>
                    <p>No leads</p>
                  </div>
                ) : (
                  leads.map((lead) => (
                    <SortableLeadCard
                      key={lead.pipelineId}
                      lead={lead}
                      isSelected={selectedLeads.has(lead.pipelineId)}
                      onSelect={() => onSelectLead(lead.pipelineId)}
                      onRemove={() => onRemoveLead(lead.pipelineId)}
                      onContact={() => onContactLead(lead)}
                      onViewDetails={() => onViewDetails(lead)}
                    />
                  ))
                )}
              </div>
            </SortableContext>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Pipeline() {
  const {
    pipelineLeads,
    updateLeadStage,
    removeFromPipeline,
    trackContact,
    addNote,
    addTag,
    removeTag,
    addCustomField,
    updateCustomField,
    removeCustomField,
    scheduleFollowUp,
    bulkUpdateStage,
    bulkDelete,
    bulkAddTags,
  } = useLeadStore()

  const [activeId, setActiveId] = useState<string | null>(null)
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set())
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState<PipelineLead | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [tagDialogOpen, setTagDialogOpen] = useState(false)
  const [bulkTagInput, setBulkTagInput] = useState('')
  const [mobileStage, setMobileStage] = useState<PipelineStage>('new')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const leadsByStage = useMemo(() => {
    const grouped: Record<PipelineStage, PipelineLead[]> = {
      new: [], contacted: [], qualified: [], proposal: [],
      negotiation: [], won: [], lost: [],
    }
    pipelineLeads.forEach((lead) => {
      if (grouped[lead.stage]) grouped[lead.stage].push(lead)
    })
    return grouped
  }, [pipelineLeads])

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string
    const activeLead = pipelineLeads.find((l) => l.pipelineId === activeId)
    if (!activeLead) return

    const targetStage = stages.find((s) => s.id === overId)
    if (targetStage) {
      if (activeLead.stage !== targetStage.id) {
        updateLeadStage(activeId, targetStage.id)
        toast.success(`Moved to ${targetStage.title}`)
      }
      return
    }

    const overLead = pipelineLeads.find((l) => l.pipelineId === overId)
    if (overLead && activeLead.stage !== overLead.stage) {
      updateLeadStage(activeId, overLead.stage)
      toast.success(`Moved to ${stages.find((s) => s.id === overLead.stage)?.title}`)
    }
  }

  const handleSelectLead = (pipelineId: string) => {
    setSelectedLeads((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(pipelineId)) newSet.delete(pipelineId)
      else newSet.add(pipelineId)
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (selectedLeads.size === pipelineLeads.length) setSelectedLeads(new Set())
    else setSelectedLeads(new Set(pipelineLeads.map((l) => l.pipelineId)))
  }

  const handleRemoveLead = (pipelineId: string) => {
    removeFromPipeline(pipelineId)
    setSelectedLeads((prev) => { const n = new Set(prev); n.delete(pipelineId); return n })
    toast.success('Removed from pipeline')
  }

  const handleContactLead = (lead: PipelineLead) => { setSelectedLead(lead); setContactModalOpen(true) }
  const handleViewDetails = (lead: PipelineLead) => { setSelectedLead(lead); setDetailModalOpen(true) }

  const handleTrackContact = (method: ContactMethod, notes?: string) => {
    if (selectedLead) {
      trackContact(selectedLead.pipelineId, method, notes)
      toast.success(`Contact tracked via ${method}`)
    }
  }

  const handleAddNote = (note: string) => {
    if (selectedLead) {
      addNote(selectedLead.pipelineId, note)
      const updated = pipelineLeads.find((l) => l.pipelineId === selectedLead.pipelineId)
      if (updated) setSelectedLead(updated)
      toast.success('Note added')
    }
  }

  const handleAddTag = (tag: string) => {
    if (selectedLead) {
      addTag(selectedLead.pipelineId, tag)
      const updated = pipelineLeads.find((l) => l.pipelineId === selectedLead.pipelineId)
      if (updated) setSelectedLead(updated)
      toast.success('Tag added')
    }
  }

  const handleRemoveTag = (tag: string) => {
    if (selectedLead) {
      removeTag(selectedLead.pipelineId, tag)
      const updated = pipelineLeads.find((l) => l.pipelineId === selectedLead.pipelineId)
      if (updated) setSelectedLead(updated)
      toast.success('Tag removed')
    }
  }

  const handleScheduleFollowUp = (date: string, note?: string) => {
    if (selectedLead) {
      scheduleFollowUp(selectedLead.pipelineId, date, note)
      const updated = pipelineLeads.find((l) => l.pipelineId === selectedLead.pipelineId)
      if (updated) setSelectedLead(updated)
      toast.success('Follow-up scheduled')
    }
  }

  const handleStageChange = (stage: PipelineStage) => {
    if (selectedLead) {
      updateLeadStage(selectedLead.pipelineId, stage)
      const updated = pipelineLeads.find((l) => l.pipelineId === selectedLead.pipelineId)
      if (updated) setSelectedLead({ ...updated, stage })
      toast.success(`Moved to ${stages.find((s) => s.id === stage)?.title}`)
    }
  }

  const handleAddCustomField = (key: string, value: string) => {
    if (selectedLead) {
      addCustomField(selectedLead.pipelineId, key, value)
      const updated = pipelineLeads.find((l) => l.pipelineId === selectedLead.pipelineId)
      if (updated) setSelectedLead(updated)
      toast.success(`Added field "${key}"`)
    }
  }

  const handleUpdateCustomField = (key: string, value: string) => {
    if (selectedLead) {
      updateCustomField(selectedLead.pipelineId, key, value)
      const updated = pipelineLeads.find((l) => l.pipelineId === selectedLead.pipelineId)
      if (updated) setSelectedLead(updated)
      toast.success(`Updated field "${key}"`)
    }
  }

  const handleRemoveCustomField = (key: string) => {
    if (selectedLead) {
      removeCustomField(selectedLead.pipelineId, key)
      const updated = pipelineLeads.find((l) => l.pipelineId === selectedLead.pipelineId)
      if (updated) setSelectedLead(updated)
      toast.success(`Removed field "${key}"`)
    }
  }

  const handleBulkMove = (stage: PipelineStage) => {
    if (selectedLeads.size === 0) return
    bulkUpdateStage(Array.from(selectedLeads), stage)
    setSelectedLeads(new Set())
    toast.success(`Moved ${selectedLeads.size} leads to ${stages.find((s) => s.id === stage)?.title}`)
  }

  const handleBulkDelete = () => {
    if (selectedLeads.size === 0) return
    const count = selectedLeads.size
    bulkDelete(Array.from(selectedLeads))
    setSelectedLeads(new Set())
    setDeleteConfirmOpen(false)
    toast.success(`Removed ${count} leads from pipeline`)
  }

  const handleExportCSV = () => {
    if (selectedLeads.size > 0) {
      const leadsToExport = pipelineLeads.filter((l) => selectedLeads.has(l.pipelineId))
      exportLeadsToCSV(leadsToExport, 'selected-leads')
      toast.success(`Exported ${leadsToExport.length} leads`)
    } else {
      exportLeadsToCSV(pipelineLeads, 'pipeline-leads')
      toast.success(`Exported ${pipelineLeads.length} leads`)
    }
  }

  const handleBulkTag = () => {
    if (selectedLeads.size === 0 || !bulkTagInput.trim()) return
    const tags = bulkTagInput.split(',').map((t) => t.trim()).filter((t) => t.length > 0)
    if (tags.length === 0) return
    bulkAddTags(Array.from(selectedLeads), tags)
    setBulkTagInput('')
    setTagDialogOpen(false)
    toast.success(`Added ${tags.length} tag(s) to ${selectedLeads.size} leads`)
  }

  const activeLead = activeId ? pipelineLeads.find((l) => l.pipelineId === activeId) : null
  const totalLeads = pipelineLeads.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-semibold tracking-tight">Pipeline</h1>
            <Badge variant="glow">
              <Kanban className="w-3 h-3 mr-1" />
              {totalLeads} leads
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-lg">
            Track and manage your leads through the sales process
          </p>
        </div>
        {totalLeads > 0 && (
          <Button variant="outline" onClick={handleExportCSV} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        )}
      </motion.div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedLeads.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border border-primary/20"
          >
            <div className="flex items-center gap-3">
              <Checkbox
                checked={selectedLeads.size === pipelineLeads.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm font-medium text-primary">
                {selectedLeads.size} selected
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto sm:ml-auto">
              <Select onValueChange={(value) => handleBulkMove(value as PipelineStage)}>
                <SelectTrigger className="w-36 shrink-0">
                  <SelectValue placeholder="Move to..." />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>{stage.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => setTagDialogOpen(true)}>
                <Tags className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Tags</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">CSV</span>
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setDeleteConfirmOpen(true)}>
                <Trash2 className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedLeads(new Set())}>
                Clear
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {totalLeads === 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-dashed border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="relative mb-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-cold/10 border border-border/30">
                  <Kanban className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-primary/20 to-cold/20 blur-xl opacity-50" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No leads in pipeline</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Start by discovering leads and adding them to your pipeline to track your sales process.
              </p>
              <Link href="/discover">
                <Button className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Discover Leads
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Pipeline Kanban */}
      {totalLeads > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* Mobile Stage Selector */}
          <div className="md:hidden mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
              {stages.map((stage) => (
                <button
                  key={stage.id}
                  onClick={() => setMobileStage(stage.id)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
                    mobileStage === stage.id
                      ? `bg-gradient-to-r ${stage.gradient} text-white shadow-lg`
                      : 'hover:bg-surface'
                  )}
                >
                  <div className={cn('w-2 h-2 rounded-full', mobileStage !== stage.id && `bg-gradient-to-r ${stage.gradient}`)} />
                  {stage.title}
                  <Badge variant="default" className="text-xs">{leadsByStage[stage.id].length}</Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile: Single Column View */}
          <div className="md:hidden">
            {stages.filter((stage) => stage.id === mobileStage).map((stage) => (
              <Card key={stage.id} variant="default">
                <CardHeader className="py-3 px-4 border-b border-border/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn('w-2.5 h-2.5 rounded-full bg-gradient-to-br', stage.gradient)} />
                      <CardTitle className="text-sm font-medium">{stage.title}</CardTitle>
                    </div>
                    <Badge variant="default" className="text-xs">{leadsByStage[stage.id].length}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-2">
                  <SortableContext
                    items={leadsByStage[stage.id].map((l) => l.pipelineId)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2 p-1">
                      {leadsByStage[stage.id].length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">No leads in this stage</div>
                      ) : (
                        leadsByStage[stage.id].map((lead) => (
                          <SortableLeadCard
                            key={lead.pipelineId}
                            lead={lead}
                            isSelected={selectedLeads.has(lead.pipelineId)}
                            onSelect={() => handleSelectLead(lead.pipelineId)}
                            onRemove={() => handleRemoveLead(lead.pipelineId)}
                            onContact={() => handleContactLead(lead)}
                            onViewDetails={() => handleViewDetails(lead)}
                          />
                        ))
                      )}
                    </div>
                  </SortableContext>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop: Horizontal Scroll Kanban */}
          <div className="hidden md:flex gap-4 overflow-x-auto pb-4">
            {stages.map((stage) => (
              <PipelineColumn
                key={stage.id}
                stage={stage}
                leads={leadsByStage[stage.id]}
                selectedLeads={selectedLeads}
                onSelectLead={handleSelectLead}
                onRemoveLead={handleRemoveLead}
                onContactLead={handleContactLead}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          <DragOverlay>
            {activeLead && (
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: 1.05, rotate: 2 }}
                className="bg-elevated rounded-xl p-3 shadow-2xl shadow-primary/20 w-64"
              >
                <h4 className="font-medium text-sm">{activeLead.businessName}</h4>
                <p className="text-xs text-muted-foreground">{activeLead.city}, {activeLead.state}</p>
              </motion.div>
            )}
          </DragOverlay>
        </DndContext>
      )}

      {/* Modals */}
      <ContactModal open={contactModalOpen} onOpenChange={setContactModalOpen} lead={selectedLead as Lead | null} onContact={handleTrackContact} />
      <LeadDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        lead={selectedLead as any}
        onContact={handleTrackContact}
        onAddNote={handleAddNote}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
        onAddCustomField={handleAddCustomField}
        onUpdateCustomField={handleUpdateCustomField}
        onRemoveCustomField={handleRemoveCustomField}
        onScheduleFollowUp={handleScheduleFollowUp}
        onStageChange={handleStageChange}
      />

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedLeads.size} leads?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the selected leads from your pipeline.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={tagDialogOpen} onOpenChange={setTagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tags to {selectedLeads.size} Leads</DialogTitle>
            <DialogDescription>Enter tags separated by commas.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="e.g., hot-lead, follow-up, priority"
              value={bulkTagInput}
              onChange={(e) => setBulkTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleBulkTag() }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTagDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleBulkTag} disabled={!bulkTagInput.trim()} className="gap-2">
              <Tags className="h-4 w-4" />
              Add Tags
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
