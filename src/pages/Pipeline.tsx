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
} from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Link } from 'wouter'
import { useLeadStore } from '@/hooks/useLeadStore'
import type { PipelineStage, Lead } from '@/types'

interface PipelineLead extends Lead {
  pipelineId: string
  stage: PipelineStage
  addedAt: string
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
  onRemove,
}: {
  lead: PipelineLead
  onRemove: () => void
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
        isDragging && 'opacity-50 shadow-lg'
      )}
      whileHover={{ scale: 1.02 }}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
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
  onRemoveLead,
}: {
  stage: StageConfig
  leads: PipelineLead[]
  onRemoveLead: (pipelineId: string) => void
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
                      onRemove={() => onRemoveLead(lead.pipelineId)}
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
  const { pipelineLeads, updateLeadStage, removeFromPipeline } = useLeadStore()
  const [activeId, setActiveId] = useState<string | null>(null)

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

  const handleRemoveLead = (pipelineId: string) => {
    removeFromPipeline(pipelineId)
    toast.success('Removed from pipeline')
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
        {totalLeads > 0 && (
          <Badge variant="secondary" className="text-sm">
            {totalLeads} leads in pipeline
          </Badge>
        )}
      </div>

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
                onRemoveLead={handleRemoveLead}
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
    </div>
  )
}
