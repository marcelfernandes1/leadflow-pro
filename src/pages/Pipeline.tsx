import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
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
  Search,
  Star,
  Trash2,
  MessageSquare,
  CheckSquare,
  Square,
  Send,
  Download,
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
import { cn } from '@/lib/utils'
import { exportLeadsToCSV } from '@/lib/export'
import { Link } from 'wouter'
import { useLeadStore } from '@/hooks/useLeadStore'
import { ContactModal } from '@/components/ContactModal'
import { LeadDetailModal } from '@/components/LeadDetailModal'
import type { PipelineStage, Lead, ContactMethod } from '@/types'

interface PipelineLead extends Lead {
  pipelineId: string
  stage: PipelineStage
  addedAt: string
  notes?: string[]
  tags?: string[]
  activities?: Array<{
    id: string
    type: string
    contactMethod?: string
    details: string
    createdAt: string
  }>
  nextFollowUpAt?: string
  lastContactedAt?: string
  lastContactMethod?: string
}

interface StageConfig {
  id: PipelineStage
  title: string
  color: string
}

const stages: StageConfig[] = [
  { id: 'new', title: 'New Leads', color: 'bg-blue-500' },
  { id: 'contacted', title: 'Contacted', color: 'bg-amber-500' },
  { id: 'qualified', title: 'Qualified', color: 'bg-purple-500' },
  { id: 'proposal', title: 'Proposal', color: 'bg-pink-500' },
  { id: 'negotiation', title: 'Negotiation', color: 'bg-orange-500' },
  { id: 'won', title: 'Closed Won', color: 'bg-green-500' },
  { id: 'lost', title: 'Closed Lost', color: 'bg-gray-500' },
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
        'bg-card border rounded-lg p-3 cursor-grab active:cursor-grabbing',
        isDragging && 'opacity-50 shadow-lg',
        isSelected && 'ring-2 ring-primary'
      )}
      whileHover={{ scale: 1.02 }}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start gap-2">
        <div
          className="mt-0.5 shrink-0"
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
        <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
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

          {/* Rating */}
          {lead.googleRating && (
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-xs">{lead.googleRating.toFixed(1)}</span>
            </div>
          )}

          {/* Tags */}
          {lead.tags && lead.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {lead.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px] px-1 py-0">
                  {tag}
                </Badge>
              ))}
              {lead.tags.length > 2 && (
                <Badge variant="outline" className="text-[10px] px-1 py-0">
                  +{lead.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {lead.category}
            </Badge>
            {lead.leadScore && (
              <Badge
                variant={
                  lead.leadScore >= 80
                    ? 'hot'
                    : lead.leadScore >= 60
                      ? 'warm'
                      : 'cold'
                }
                className="text-xs"
              >
                {lead.leadScore}/100
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1 mt-2">
            {lead.email && (
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
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
                size="icon"
                variant="ghost"
                className="h-6 w-6"
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
                size="icon"
                variant="ghost"
                className="h-6 w-6"
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
                size="icon"
                variant="ghost"
                className="h-6 w-6"
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
              size="icon"
              variant="ghost"
              className="h-6 w-6"
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
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 ml-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onViewDetails()
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onContact()
                  }}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Track Contact
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove()
                  }}
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
      <Card className="h-full">
        <CardHeader className="py-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn('w-2 h-2 rounded-full', stage.color)} />
              <CardTitle className="text-sm font-medium">
                {stage.title}
              </CardTitle>
            </div>
            <Badge variant="secondary" className="text-xs">
              {leads.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-2 pb-2">
          <ScrollArea className="h-[calc(100vh-280px)]">
            <SortableContext
              items={leads.map((l) => l.pipelineId)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2 p-2">
                {leads.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No leads in this stage
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
    scheduleFollowUp,
    bulkUpdateStage,
    bulkDelete,
  } = useLeadStore()

  const [activeId, setActiveId] = useState<string | null>(null)
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set())
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState<PipelineLead | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Group leads by stage
  const leadsByStage = useMemo(() => {
    const grouped: Record<PipelineStage, PipelineLead[]> = {
      new: [],
      contacted: [],
      qualified: [],
      proposal: [],
      negotiation: [],
      won: [],
      lost: [],
    }

    pipelineLeads.forEach((lead) => {
      if (grouped[lead.stage]) {
        grouped[lead.stage].push(lead)
      }
    })

    return grouped
  }, [pipelineLeads])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find which stage the item was dropped into
    const activeLead = pipelineLeads.find((l) => l.pipelineId === activeId)
    if (!activeLead) return

    // Check if dropped on a stage column
    const targetStage = stages.find((s) => s.id === overId)
    if (targetStage) {
      if (activeLead.stage !== targetStage.id) {
        updateLeadStage(activeId, targetStage.id)
        toast.success(`Moved to ${targetStage.title}`)
      }
      return
    }

    // Check if dropped on another lead (find its stage)
    const overLead = pipelineLeads.find((l) => l.pipelineId === overId)
    if (overLead && activeLead.stage !== overLead.stage) {
      updateLeadStage(activeId, overLead.stage)
      toast.success(`Moved to ${stages.find((s) => s.id === overLead.stage)?.title}`)
    }
  }

  const handleSelectLead = (pipelineId: string) => {
    setSelectedLeads((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(pipelineId)) {
        newSet.delete(pipelineId)
      } else {
        newSet.add(pipelineId)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (selectedLeads.size === pipelineLeads.length) {
      setSelectedLeads(new Set())
    } else {
      setSelectedLeads(new Set(pipelineLeads.map((l) => l.pipelineId)))
    }
  }

  const handleRemoveLead = (pipelineId: string) => {
    removeFromPipeline(pipelineId)
    setSelectedLeads((prev) => {
      const newSet = new Set(prev)
      newSet.delete(pipelineId)
      return newSet
    })
    toast.success('Removed from pipeline')
  }

  const handleContactLead = (lead: PipelineLead) => {
    setSelectedLead(lead)
    setContactModalOpen(true)
  }

  const handleViewDetails = (lead: PipelineLead) => {
    setSelectedLead(lead)
    setDetailModalOpen(true)
  }

  const handleTrackContact = (method: ContactMethod, notes?: string) => {
    if (selectedLead) {
      trackContact(selectedLead.pipelineId, method, notes)
      toast.success(`Contact tracked via ${method}`)
    }
  }

  const handleAddNote = (note: string) => {
    if (selectedLead) {
      addNote(selectedLead.pipelineId, note)
      // Update the selected lead to show the new note
      const updatedLead = pipelineLeads.find(
        (l) => l.pipelineId === selectedLead.pipelineId
      )
      if (updatedLead) {
        setSelectedLead(updatedLead)
      }
      toast.success('Note added')
    }
  }

  const handleAddTag = (tag: string) => {
    if (selectedLead) {
      addTag(selectedLead.pipelineId, tag)
      const updatedLead = pipelineLeads.find(
        (l) => l.pipelineId === selectedLead.pipelineId
      )
      if (updatedLead) {
        setSelectedLead(updatedLead)
      }
      toast.success('Tag added')
    }
  }

  const handleRemoveTag = (tag: string) => {
    if (selectedLead) {
      removeTag(selectedLead.pipelineId, tag)
      const updatedLead = pipelineLeads.find(
        (l) => l.pipelineId === selectedLead.pipelineId
      )
      if (updatedLead) {
        setSelectedLead(updatedLead)
      }
      toast.success('Tag removed')
    }
  }

  const handleScheduleFollowUp = (date: string, note?: string) => {
    if (selectedLead) {
      scheduleFollowUp(selectedLead.pipelineId, date, note)
      const updatedLead = pipelineLeads.find(
        (l) => l.pipelineId === selectedLead.pipelineId
      )
      if (updatedLead) {
        setSelectedLead(updatedLead)
      }
      toast.success('Follow-up scheduled')
    }
  }

  const handleStageChange = (stage: PipelineStage) => {
    if (selectedLead) {
      updateLeadStage(selectedLead.pipelineId, stage)
      const updatedLead = pipelineLeads.find(
        (l) => l.pipelineId === selectedLead.pipelineId
      )
      if (updatedLead) {
        setSelectedLead({ ...updatedLead, stage })
      }
      toast.success(`Moved to ${stages.find((s) => s.id === stage)?.title}`)
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
      // Export selected leads
      const leadsToExport = pipelineLeads.filter((l) =>
        selectedLeads.has(l.pipelineId)
      )
      exportLeadsToCSV(leadsToExport, 'selected-leads')
      toast.success(`Exported ${leadsToExport.length} leads`)
    } else {
      // Export all leads
      exportLeadsToCSV(pipelineLeads, 'pipeline-leads')
      toast.success(`Exported ${pipelineLeads.length} leads`)
    }
  }

  const activeLead = activeId
    ? pipelineLeads.find((l) => l.pipelineId === activeId)
    : null

  const totalLeads = pipelineLeads.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pipeline</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your leads through the sales process
          </p>
        </div>
        <div className="flex items-center gap-2">
          {totalLeads > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
              >
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
              <Badge variant="secondary" className="text-sm">
                {totalLeads} leads in pipeline
              </Badge>
            </>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedLeads.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-4 p-3 bg-muted rounded-lg"
        >
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedLeads.size === pipelineLeads.length}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm font-medium">
              {selectedLeads.size} selected
            </span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Select onValueChange={(value) => handleBulkMove(value as PipelineStage)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Move to..." />
              </SelectTrigger>
              <SelectContent>
                {stages.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {stage.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteConfirmOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedLeads(new Set())}
            >
              Clear Selection
            </Button>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {totalLeads === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No leads in pipeline</h3>
            <p className="text-muted-foreground text-center mb-4 max-w-sm">
              Start by discovering leads and adding them to your pipeline to
              track your sales process.
            </p>
            <Link href="/discover">
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Discover Leads
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Pipeline Kanban */}
      {totalLeads > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
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
                animate={{ scale: 1.05, rotate: 3 }}
                className="bg-card border rounded-lg p-3 shadow-lg w-64"
              >
                <h4 className="font-medium text-sm">{activeLead.businessName}</h4>
                <p className="text-xs text-muted-foreground">
                  {activeLead.city}, {activeLead.state}
                </p>
              </motion.div>
            )}
          </DragOverlay>
        </DndContext>
      )}

      {/* Contact Modal */}
      <ContactModal
        open={contactModalOpen}
        onOpenChange={setContactModalOpen}
        lead={selectedLead}
        onContact={handleTrackContact}
      />

      {/* Lead Detail Modal */}
      <LeadDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        lead={selectedLead}
        onContact={(method) => {
          // Open the contact URL and show tracking confirmation
          handleTrackContact(method)
        }}
        onAddNote={handleAddNote}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
        onScheduleFollowUp={handleScheduleFollowUp}
        onStageChange={handleStageChange}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedLeads.size} leads?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the
              selected leads from your pipeline.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
