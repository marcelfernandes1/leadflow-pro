import { useState } from 'react'
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
  MoreHorizontal,
  Search,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Link } from 'wouter'

interface PipelineLead {
  id: string
  businessName: string
  category: string
  city: string
  state: string
  phone?: string
  email?: string
  lastContacted?: string
  score?: number
}

interface PipelineStage {
  id: string
  title: string
  color: string
  leads: PipelineLead[]
}

const initialStages: PipelineStage[] = [
  {
    id: 'new',
    title: 'New Leads',
    color: 'bg-blue-500',
    leads: [],
  },
  {
    id: 'contacted',
    title: 'Contacted',
    color: 'bg-amber-500',
    leads: [],
  },
  {
    id: 'qualified',
    title: 'Qualified',
    color: 'bg-purple-500',
    leads: [],
  },
  {
    id: 'proposal',
    title: 'Proposal',
    color: 'bg-pink-500',
    leads: [],
  },
  {
    id: 'won',
    title: 'Closed Won',
    color: 'bg-green-500',
    leads: [],
  },
  {
    id: 'lost',
    title: 'Closed Lost',
    color: 'bg-gray-500',
    leads: [],
  },
]

function SortableLeadCard({ lead }: { lead: PipelineLead }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id })

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
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {lead.category}
            </Badge>
            {lead.score && (
              <Badge
                variant={
                  lead.score >= 80
                    ? 'hot'
                    : lead.score >= 60
                      ? 'warm'
                      : 'cold'
                }
                className="text-xs"
              >
                {lead.score}/100
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
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 ml-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function PipelineColumn({ stage }: { stage: PipelineStage }) {
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
              {stage.leads.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-2 pb-2">
          <ScrollArea className="h-[calc(100vh-280px)]">
            <SortableContext
              items={stage.leads.map((l) => l.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2 p-2">
                {stage.leads.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No leads in this stage
                  </div>
                ) : (
                  stage.leads.map((lead) => (
                    <SortableLeadCard key={lead.id} lead={lead} />
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
  const [stages, _setStages] = useState<PipelineStage[]>(initialStages)
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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active: _active, over } = event
    setActiveId(null)

    if (!over) return

    // Handle drag and drop logic here
    // For now, this is a placeholder
  }

  const activeLead = activeId
    ? stages
        .flatMap((s) => s.leads)
        .find((l) => l.id === activeId)
    : null

  const totalLeads = stages.reduce((sum, stage) => sum + stage.leads.length, 0)

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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <PipelineColumn key={stage.id} stage={stage} />
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
    </div>
  )
}
