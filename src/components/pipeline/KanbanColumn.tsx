import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { DealCard } from './DealCard'
import type { Deal, PipelineStage } from '@/types/pipeline'
import { STAGE_COLORS } from '@/types/pipeline'

interface KanbanColumnProps {
  stage: PipelineStage
  deals: Deal[]
  selectedDealIds: string[]
  onSelectDeal: (id: string) => void
  onViewDeal: (deal: Deal) => void
  onQuickAdd: (stageId: string) => void
}

export function KanbanColumn({
  stage,
  deals,
  selectedDealIds,
  onSelectDeal,
  onViewDeal,
  onQuickAdd,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id })

  const stageColors = STAGE_COLORS[stage.color] || STAGE_COLORS.blue

  // Calculate totals
  const dealCount = deals.length
  const totalValue = deals.reduce((sum, d) => sum + d.dealValue * d.contractLength, 0)
  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(totalValue)

  return (
    <div className="flex-shrink-0 w-72">
      <Card
        ref={setNodeRef}
        variant="default"
        className={cn(
          'h-full overflow-hidden transition-all duration-200',
          isOver && 'ring-2 ring-primary/50 border-primary/30 bg-primary/5'
        )}
      >
        {/* Header */}
        <CardHeader className="py-3 px-4 border-b border-border/30 space-y-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-2.5 h-2.5 rounded-full bg-gradient-to-br shadow-lg',
                  stageColors.gradient
                )}
              />
              <CardTitle className="text-sm font-medium truncate">
                {stage.name}
              </CardTitle>
            </div>
            <Badge variant="default" className="text-xs shrink-0">
              {dealCount}
            </Badge>
          </div>

          {/* Stage Value & Probability */}
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span className="font-medium">{formattedValue}</span>
            <span>{stage.probability}% likely</span>
          </div>
        </CardHeader>

        {/* Deal Cards */}
        <CardContent className="p-2">
          <ScrollArea className="h-[calc(100vh-320px)]">
            <SortableContext
              items={deals.map((d) => d.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2 p-1">
                {deals.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 text-muted-foreground text-sm"
                  >
                    <div className="p-3 rounded-full bg-surface/50 inline-block mb-2">
                      <Plus className="h-5 w-5 opacity-50" />
                    </div>
                    <p>No deals</p>
                    <p className="text-xs mt-1">Drop here or add new</p>
                  </motion.div>
                ) : (
                  deals.map((deal) => (
                    <DealCard
                      key={deal.id}
                      deal={deal}
                      stage={stage}
                      isSelected={selectedDealIds.includes(deal.id)}
                      onSelect={() => onSelectDeal(deal.id)}
                      onViewDetails={() => onViewDeal(deal)}
                    />
                  ))
                )}
              </div>
            </SortableContext>
          </ScrollArea>

          {/* Quick Add Button */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2 text-muted-foreground hover:text-foreground"
            onClick={() => onQuickAdd(stage.id)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Deal
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
