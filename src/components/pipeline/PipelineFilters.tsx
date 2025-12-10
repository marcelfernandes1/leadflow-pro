import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Filter,
  X,
  Zap,
  AlertTriangle,
  DollarSign,
  Calendar,
  Flame,
  Snowflake,
  Clock,
  ChevronDown,
  Save,
  Trash2,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useLeadStore } from '@/hooks/useLeadStore'
import type { PipelineFilters as Filters } from '@/types'

interface PipelineFiltersProps {
  onSearchFocus?: () => void
}

interface QuickFilter {
  id: string
  label: string
  icon: React.ElementType
  description: string
  filters: Filters
  variant?: 'default' | 'hot' | 'warm' | 'cold' | 'destructive'
}

const quickFilters: QuickFilter[] = [
  {
    id: 'hot-leads',
    label: 'Hot Leads',
    icon: Flame,
    description: 'Score 80+',
    filters: { minScore: 80 },
    variant: 'hot',
  },
  {
    id: 'warm-leads',
    label: 'Warm Leads',
    icon: Zap,
    description: 'Score 60-79',
    filters: { minScore: 60, maxScore: 79 },
    variant: 'warm',
  },
  {
    id: 'cold-leads',
    label: 'Cold Leads',
    icon: Snowflake,
    description: 'Score < 60',
    filters: { maxScore: 59 },
    variant: 'cold',
  },
  {
    id: 'at-risk',
    label: 'At Risk',
    icon: AlertTriangle,
    description: 'Stale deals',
    filters: { isAtRisk: true },
    variant: 'destructive',
  },
  {
    id: 'high-value',
    label: 'High Value',
    icon: DollarSign,
    description: '$10k+',
    filters: { minValue: 10000 },
  },
  {
    id: 'needs-followup',
    label: 'No Follow-up',
    icon: Calendar,
    description: 'No date set',
    filters: { noFollowUp: true },
  },
  {
    id: 'long-in-stage',
    label: 'Long in Stage',
    icon: Clock,
    description: '7+ days',
    filters: { minDaysInStage: 7 },
  },
]

export function PipelineFiltersComponent({ onSearchFocus }: PipelineFiltersProps) {
  const {
    activeFilters,
    setFilters,
    clearFilters,
    savedViews,
    currentViewId,
    addSavedView,
    deleteSavedView,
    setCurrentView,
    getAtRiskLeads,
  } = useLeadStore()

  const [saveViewOpen, setSaveViewOpen] = useState(false)
  const [newViewName, setNewViewName] = useState('')
  const [advancedOpen, setAdvancedOpen] = useState(false)

  const atRiskCount = getAtRiskLeads().length
  const hasActiveFilters = Object.keys(activeFilters).length > 0

  const isFilterActive = (filterId: string) => {
    const filter = quickFilters.find((f) => f.id === filterId)
    if (!filter) return false

    return Object.entries(filter.filters).every(([key, value]) => {
      return activeFilters[key as keyof Filters] === value
    })
  }

  const toggleFilter = (filter: QuickFilter) => {
    if (isFilterActive(filter.id)) {
      // Remove this filter
      const newFilters = { ...activeFilters }
      Object.keys(filter.filters).forEach((key) => {
        delete newFilters[key as keyof Filters]
      })
      setFilters(newFilters)
    } else {
      // Add this filter
      setFilters({ ...activeFilters, ...filter.filters })
    }
  }

  const handleSaveView = () => {
    if (!newViewName.trim()) return
    addSavedView(newViewName.trim(), activeFilters)
    setNewViewName('')
    setSaveViewOpen(false)
  }

  const currentView = savedViews.find((v) => v.id === currentViewId)

  return (
    <div className="space-y-3">
      {/* Search and Views Row */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-xs">
          <Input
            placeholder="Search leads..."
            value={activeFilters.searchQuery || ''}
            onChange={(e) => setFilters({ ...activeFilters, searchQuery: e.target.value || undefined })}
            onFocus={onSearchFocus}
            className="pl-9"
          />
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          {activeFilters.searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
              onClick={() => setFilters({ ...activeFilters, searchQuery: undefined })}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Saved Views Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              {currentView ? currentView.name : 'All Leads'}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem onClick={() => setCurrentView(null)}>
              <div className="flex items-center gap-2 flex-1">
                All Leads
                {!currentViewId && <Check className="h-4 w-4 ml-auto" />}
              </div>
            </DropdownMenuItem>
            {savedViews.length > 0 && <DropdownMenuSeparator />}
            {savedViews.map((view) => (
              <DropdownMenuItem
                key={view.id}
                className="flex items-center gap-2"
              >
                <button
                  className="flex-1 text-left flex items-center gap-2"
                  onClick={() => setCurrentView(view.id)}
                >
                  {view.name}
                  {currentViewId === view.id && <Check className="h-4 w-4 ml-auto" />}
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteSavedView(view.id)
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </DropdownMenuItem>
            ))}
            {hasActiveFilters && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSaveViewOpen(true)}>
                  <Save className="h-4 w-4 mr-2" />
                  Save current view
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Quick Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {quickFilters.map((filter) => {
          const isActive = isFilterActive(filter.id)
          const Icon = filter.icon

          // Show count for at-risk filter
          const count = filter.id === 'at-risk' ? atRiskCount : undefined

          return (
            <motion.button
              key={filter.id}
              onClick={() => toggleFilter(filter)}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                'border border-border/50 hover:border-border',
                isActive && filter.variant === 'hot' && 'bg-hot/10 border-hot/30 text-hot',
                isActive && filter.variant === 'warm' && 'bg-warm/10 border-warm/30 text-warm',
                isActive && filter.variant === 'cold' && 'bg-cold/10 border-cold/30 text-cold',
                isActive && filter.variant === 'destructive' && 'bg-destructive/10 border-destructive/30 text-destructive',
                isActive && !filter.variant && 'bg-primary/10 border-primary/30 text-primary',
                !isActive && 'hover:bg-surface/50'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="h-3.5 w-3.5" />
              {filter.label}
              {count !== undefined && count > 0 && (
                <Badge
                  variant={filter.variant === 'destructive' ? 'destructive' : 'default'}
                  className="ml-1 text-2xs px-1.5 py-0"
                >
                  {count}
                </Badge>
              )}
            </motion.button>
          )
        })}

        {/* Advanced Filters */}
        <Popover open={advancedOpen} onOpenChange={setAdvancedOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-3.5 w-3.5" />
              More
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-80">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Value Range</h4>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={activeFilters.minValue || ''}
                    onChange={(e) =>
                      setFilters({
                        ...activeFilters,
                        minValue: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="flex-1"
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={activeFilters.maxValue || ''}
                    onChange={(e) =>
                      setFilters({
                        ...activeFilters,
                        maxValue: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Score Range</h4>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={activeFilters.minScore || ''}
                    onChange={(e) =>
                      setFilters({
                        ...activeFilters,
                        minScore: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="flex-1"
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={activeFilters.maxScore || ''}
                    onChange={(e) =>
                      setFilters({
                        ...activeFilters,
                        maxScore: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Days in Stage</h4>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={activeFilters.minDaysInStage || ''}
                    onChange={(e) =>
                      setFilters({
                        ...activeFilters,
                        minDaysInStage: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="flex-1"
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={activeFilters.maxDaysInStage || ''}
                    onChange={(e) =>
                      setFilters({
                        ...activeFilters,
                        maxDaysInStage: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="flex-1"
                  />
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  clearFilters()
                  setAdvancedOpen(false)
                }}
                className="w-full"
              >
                Reset All Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters Summary */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Filter className="h-4 w-4" />
            <span>
              Showing filtered results
              {activeFilters.searchQuery && ` matching "${activeFilters.searchQuery}"`}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save View Dialog */}
      <Dialog open={saveViewOpen} onOpenChange={setSaveViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save View</DialogTitle>
            <DialogDescription>
              Save your current filters as a view to quickly access later.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="View name (e.g., Hot leads to follow up)"
              value={newViewName}
              onChange={(e) => setNewViewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveView()
              }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveViewOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveView} disabled={!newViewName.trim()}>
              Save View
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
