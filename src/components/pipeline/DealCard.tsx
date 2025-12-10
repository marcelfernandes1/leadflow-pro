import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import {
  GripVertical,
  Mail,
  Phone,
  Globe,
  Calendar,
  Clock,
  AlertCircle,
  CheckSquare,
  Square,
  MoreHorizontal,
  Building2,
  DollarSign,
  Tag,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { Deal, PipelineStage } from '@/types/pipeline'
import { STAGE_COLORS } from '@/types/pipeline'
import { usePipelineStore } from '@/hooks/usePipelineStore'

interface DealCardProps {
  deal: Deal
  stage: PipelineStage
  isSelected: boolean
  onSelect: () => void
  onViewDetails: () => void
  isDragging?: boolean
}

export function DealCard({
  deal,
  stage,
  isSelected,
  onSelect,
  onViewDetails,
  isDragging: externalDragging,
}: DealCardProps) {
  const { deleteDeal, moveDeal, settings } = usePipelineStore()
  const pipeline = settings.pipelines.find((p) => p.id === settings.activePipelineId)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: internalDragging,
  } = useSortable({ id: deal.id })

  const isDragging = externalDragging || internalDragging

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Calculate days in stage
  const daysInStage = Math.floor(
    (Date.now() - new Date(deal.stageEnteredAt).getTime()) / (1000 * 60 * 60 * 24)
  )

  // Check if deal is stale
  const staleThreshold = settings.staleDealsThreshold
  const lastActivityDate = deal.lastActivityAt || deal.createdAt
  const daysSinceActivity = Math.floor(
    (Date.now() - new Date(lastActivityDate).getTime()) / (1000 * 60 * 60 * 24)
  )
  const isStale = daysSinceActivity > staleThreshold && !stage.isWonStage && !stage.isLostStage

  // Check if follow-up is overdue
  const isFollowUpOverdue =
    deal.nextFollowUp && new Date(deal.nextFollowUp.date) < new Date()

  // Format currency
  const totalValue = deal.dealValue * deal.contractLength
  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(totalValue)

  const stageColors = STAGE_COLORS[stage.color] || STAGE_COLORS.blue

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative bg-elevated/60 backdrop-blur-sm border rounded-xl p-3 cursor-grab active:cursor-grabbing transition-all duration-200',
        isDragging && 'opacity-50 shadow-xl shadow-primary/20 z-50',
        isSelected && 'ring-2 ring-primary/50 border-primary/30',
        isStale && !isDragging && 'border-amber-500/30',
        isFollowUpOverdue && !isDragging && 'border-red-500/30',
        !isDragging && 'border-border/30 hover:border-border/50 hover:bg-elevated/80'
      )}
      whileHover={{ scale: isDragging ? 1 : 1.01 }}
      layout
      {...attributes}
      {...listeners}
    >
      {/* Selection & Drag Handle */}
      <div className="flex items-start gap-2 mb-2">
        <button
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
        </button>
        <GripVertical className="h-4 w-4 text-muted-foreground/40 mt-0.5 shrink-0" />

        {/* Company & Contact */}
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            onViewDetails()
          }}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-sm truncate">{deal.companyName}</h4>
              {deal.contactName && (
                <p className="text-xs text-muted-foreground truncate">{deal.contactName}</p>
              )}
            </div>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onViewDetails}>View Details</DropdownMenuItem>
                <DropdownMenuSeparator />
                {pipeline?.stages
                  .filter((s) => s.id !== deal.stageId)
                  .map((s) => (
                    <DropdownMenuItem
                      key={s.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        moveDeal(deal.id, s.id)
                      }}
                    >
                      Move to {s.name}
                    </DropdownMenuItem>
                  ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteDeal(deal.id)
                  }}
                >
                  Delete Deal
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Deal Value */}
      {totalValue > 0 && (
        <div className="flex items-center gap-1.5 mb-2 pl-10">
          <DollarSign className="h-3.5 w-3.5 text-success" />
          <span className="text-sm font-semibold text-success">{formattedValue}</span>
          {deal.contractLength > 1 && (
            <span className="text-xs text-muted-foreground">
              ({deal.contractLength}mo)
            </span>
          )}
        </div>
      )}

      {/* Tags */}
      {deal.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2 pl-10">
          {deal.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="default" className="text-2xs px-1.5 py-0">
              {tag}
            </Badge>
          ))}
          {deal.tags.length > 2 && (
            <Badge variant="default" className="text-2xs px-1.5 py-0">
              +{deal.tags.length - 2}
            </Badge>
          )}
        </div>
      )}

      {/* Meta Info */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground pl-10">
        {/* Days in stage */}
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{daysInStage}d</span>
        </div>

        {/* Follow-up indicator */}
        {deal.nextFollowUp && (
          <div
            className={cn(
              'flex items-center gap-1',
              isFollowUpOverdue && 'text-red-400'
            )}
          >
            <Calendar className="h-3 w-3" />
            <span>
              {new Date(deal.nextFollowUp.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        )}

        {/* Stale indicator */}
        {isStale && (
          <div className="flex items-center gap-1 text-amber-400">
            <AlertCircle className="h-3 w-3" />
            <span>Stale</span>
          </div>
        )}
      </div>

      {/* Quick contact actions */}
      <div className="flex items-center gap-1 mt-2 pl-10 opacity-0 group-hover:opacity-100 transition-opacity">
        {deal.email && (
          <Button
            size="icon-sm"
            variant="ghost"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation()
              window.open(`mailto:${deal.email}`)
            }}
          >
            <Mail className="h-3 w-3" />
          </Button>
        )}
        {deal.phone && (
          <Button
            size="icon-sm"
            variant="ghost"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation()
              window.open(`tel:${deal.phone}`)
            }}
          >
            <Phone className="h-3 w-3" />
          </Button>
        )}
        {deal.website && (
          <Button
            size="icon-sm"
            variant="ghost"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation()
              window.open(deal.website, '_blank')
            }}
          >
            <Globe className="h-3 w-3" />
          </Button>
        )}
      </div>
    </motion.div>
  )
}

// Overlay version for drag preview
export function DealCardOverlay({ deal, stage }: { deal: Deal; stage: PipelineStage }) {
  const totalValue = deal.dealValue * deal.contractLength
  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(totalValue)

  return (
    <motion.div
      initial={{ scale: 1 }}
      animate={{ scale: 1.05, rotate: 2 }}
      className="bg-elevated border border-primary/30 rounded-xl p-3 shadow-2xl shadow-primary/20 w-64"
    >
      <h4 className="font-medium text-sm">{deal.companyName}</h4>
      {deal.contactName && (
        <p className="text-xs text-muted-foreground">{deal.contactName}</p>
      )}
      {totalValue > 0 && (
        <p className="text-sm font-semibold text-success mt-1">{formattedValue}</p>
      )}
    </motion.div>
  )
}
