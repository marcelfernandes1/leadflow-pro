import { useState, useEffect, useMemo, useCallback } from 'react'
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
  DragOverEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  Plus,
  Search,
  Filter,
  Settings,
  Kanban,
  List,
  Calendar,
  Download,
  Trash2,
  Tags,
  ChevronDown,
  DollarSign,
  TrendingUp,
  Clock,
  AlertCircle,
  Target,
  LayoutGrid,
  Table,
  CalendarDays,
  X,
  Sun,
  ArrowRight,
  BarChart3,
} from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { Deal, PipelineStage, PipelineView } from '@/types/pipeline'
import { STAGE_COLORS } from '@/types/pipeline'
import {
  usePipelineStore,
  useFilteredDeals,
  useDealsByStage,
} from '@/hooks/usePipelineStore'

// Components
import { KanbanColumn } from '@/components/pipeline/KanbanColumn'
import { DealCard, DealCardOverlay } from '@/components/pipeline/DealCard'
import { DealDetailPanel } from '@/components/pipeline/DealDetailPanel'
import { QuickAddDeal } from '@/components/pipeline/QuickAddDeal'
import { PipelineSettings } from '@/components/pipeline/PipelineSettings'
import { TableView } from '@/components/pipeline/TableView'
import { TodayView } from '@/components/pipeline/TodayView'
import { PipelineAnalytics } from '@/components/pipeline/PipelineAnalytics'

export default function Pipeline() {
  const {
    settings,
    deals,
    view,
    setView,
    filters,
    setFilters,
    resetFilters,
    selectedDealIds,
    setSelectedDealIds,
    clearSelection,
    toggleDealSelection,
    selectAll,
    moveDeal,
    bulkMoveDeal,
    bulkDeleteDeals,
    bulkAddTags,
    getStaleDeals,
    getPipelineValue,
    getWeightedValue,
    getOverdueFollowUps,
    getFollowUpsToday,
  } = usePipelineStore()

  const filteredDeals = useFilteredDeals()
  const dealsByStage = useDealsByStage()

  const pipeline = settings.pipelines.find((p) => p.id === settings.activePipelineId)
  const stages = useMemo(
    () => pipeline?.stages.sort((a, b) => a.order - b.order) || [],
    [pipeline]
  )

  // UI State
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [quickAddStageId, setQuickAddStageId] = useState<string | undefined>()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [detailPanelOpen, setDetailPanelOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [tagDialogOpen, setTagDialogOpen] = useState(false)
  const [bulkTagInput, setBulkTagInput] = useState('')
  const [mobileStageIndex, setMobileStageIndex] = useState(0)

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // Stats
  const totalDeals = filteredDeals.length
  const pipelineValue = getPipelineValue(settings.activePipelineId)
  const weightedValue = getWeightedValue(settings.activePipelineId)
  const staleDeals = getStaleDeals()
  const overdueFollowUps = getOverdueFollowUps()
  const todaysFollowUps = getFollowUpsToday()

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      // n - New deal
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setQuickAddOpen(true)
      }

      // Escape - Close panels
      if (e.key === 'Escape') {
        if (detailPanelOpen) {
          setDetailPanelOpen(false)
        } else if (selectedDealIds.length > 0) {
          clearSelection()
        }
      }

      // 1/2/3/4/5 - Switch views
      if (e.key === '1') setView('kanban')
      if (e.key === '2') setView('table')
      if (e.key === '3') setView('today')
      if (e.key === '4') setView('analytics')
      if (e.key === '5') setView('calendar')

      // / - Focus search
      if (e.key === '/') {
        e.preventDefault()
        document.getElementById('pipeline-search')?.focus()
      }

      // a - Select all
      if (e.key === 'a' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        selectAll()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [detailPanelOpen, selectedDealIds.length])

  // DnD Handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    setOverId(event.over?.id as string | null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    setOverId(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeDeal = deals.find((d) => d.id === activeId)
    if (!activeDeal) return

    // Check if dropped on a stage
    const targetStage = stages.find((s) => s.id === overId)
    if (targetStage) {
      if (activeDeal.stageId !== targetStage.id) {
        moveDeal(activeId, targetStage.id)
        toast.success(`Moved to ${targetStage.name}`)
      }
      return
    }

    // Check if dropped on another deal (move to that deal's stage)
    const overDeal = deals.find((d) => d.id === overId)
    if (overDeal && activeDeal.stageId !== overDeal.stageId) {
      moveDeal(activeId, overDeal.stageId)
      const stage = stages.find((s) => s.id === overDeal.stageId)
      toast.success(`Moved to ${stage?.name}`)
    }
  }

  const handleViewDeal = (deal: Deal) => {
    setSelectedDeal(deal)
    setDetailPanelOpen(true)
  }

  const handleQuickAdd = (stageId?: string) => {
    setQuickAddStageId(stageId)
    setQuickAddOpen(true)
  }

  const handleBulkMove = (stageId: string) => {
    if (selectedDealIds.length === 0) return
    bulkMoveDeal(selectedDealIds, stageId)
    const stage = stages.find((s) => s.id === stageId)
    toast.success(`Moved ${selectedDealIds.length} deals to ${stage?.name}`)
  }

  const handleBulkDelete = () => {
    if (selectedDealIds.length === 0) return
    const count = selectedDealIds.length
    bulkDeleteDeals(selectedDealIds)
    setDeleteConfirmOpen(false)
    toast.success(`Deleted ${count} deals`)
  }

  const handleBulkTag = () => {
    if (selectedDealIds.length === 0 || !bulkTagInput.trim()) return
    const tags = bulkTagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
    if (tags.length === 0) return
    bulkAddTags(selectedDealIds, tags)
    setBulkTagInput('')
    setTagDialogOpen(false)
    toast.success(`Added ${tags.length} tag(s) to ${selectedDealIds.length} deals`)
  }

  const activeDeal = activeId ? deals.find((d) => d.id === activeId) : null
  const activeStage = activeDeal ? stages.find((s) => s.id === activeDeal.stageId) : null
  const hasFilters =
    filters.search ||
    filters.stageIds.length > 0 ||
    filters.verticals.length > 0 ||
    filters.leadSources.length > 0 ||
    filters.tags.length > 0 ||
    filters.showStale ||
    filters.showWithFollowUps

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 space-y-4 mb-4"
      >
        {/* Title Row */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight">Pipeline</h1>
              <Select
                value={settings.activePipelineId}
                onValueChange={(id) =>
                  usePipelineStore.getState().setActivePipeline(id)
                }
              >
                <SelectTrigger className="w-40 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {settings.pipelines.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-muted-foreground mt-1">
              {totalDeals} deals · {formatCurrency(pipelineValue)} pipeline value
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button onClick={() => handleQuickAdd()}>
              <Plus className="h-4 w-4 mr-1" />
              New Deal
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card variant="surface" className="p-3">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <DollarSign className="h-3.5 w-3.5" />
              Pipeline Value
            </div>
            <p className="text-xl font-semibold">{formatCurrency(pipelineValue)}</p>
          </Card>
          <Card variant="surface" className="p-3">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <TrendingUp className="h-3.5 w-3.5" />
              Weighted Value
            </div>
            <p className="text-xl font-semibold">{formatCurrency(weightedValue)}</p>
          </Card>
          <Card variant="surface" className="p-3">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Sun className="h-3.5 w-3.5" />
              Today's Follow-ups
            </div>
            <p className="text-xl font-semibold">
              {todaysFollowUps.length}
              {overdueFollowUps.length > 0 && (
                <span className="text-sm text-red-400 ml-1">
                  (+{overdueFollowUps.length} overdue)
                </span>
              )}
            </p>
          </Card>
          <Card variant="surface" className="p-3">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <AlertCircle className="h-3.5 w-3.5" />
              Stale Deals
            </div>
            <p className="text-xl font-semibold">{staleDeals.length}</p>
          </Card>
        </div>

        {/* Actions Row */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="pipeline-search"
              placeholder="Search deals... (press /)"
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="pl-9"
            />
          </div>

          {/* View Switcher */}
          <div className="flex items-center border border-border/30 rounded-lg p-1">
            <Button
              variant={view === 'kanban' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('kanban')}
              className="gap-1"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Board</span>
            </Button>
            <Button
              variant={view === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('table')}
              className="gap-1"
            >
              <Table className="h-4 w-4" />
              <span className="hidden sm:inline">Table</span>
            </Button>
            <Button
              variant={view === 'today' as any ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('today' as PipelineView)}
              className="gap-1"
            >
              <Sun className="h-4 w-4" />
              <span className="hidden sm:inline">Today</span>
            </Button>
            <Button
              variant={view === 'analytics' as any ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('analytics' as PipelineView)}
              className="gap-1"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </Button>
          </div>

          {/* Filters */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                Filters
                {hasFilters && (
                  <Badge variant="default" className="ml-1 h-5 w-5 p-0 justify-center">
                    !
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuCheckboxItem
                checked={filters.showStale}
                onCheckedChange={(checked) => setFilters({ showStale: checked })}
              >
                Show stale deals only
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.showWithFollowUps}
                onCheckedChange={(checked) => setFilters({ showWithFollowUps: checked })}
              >
                Show deals with follow-ups
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              {hasFilters && (
                <DropdownMenuItem onClick={resetFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear all filters
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Bulk Actions Bar */}
        <AnimatePresence>
          {selectedDealIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl border border-primary/20 bg-primary/5"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-primary">
                  {selectedDealIds.length} selected
                </span>
              </div>
              <div className="flex items-center gap-2 sm:ml-auto flex-wrap">
                <Select onValueChange={handleBulkMove}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Move to..." />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTagDialogOpen(true)}
                >
                  <Tags className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Tags</span>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteConfirmOpen(true)}
                >
                  <Trash2 className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={clearSelection}>
                  Clear
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 min-h-0">
        {totalDeals === 0 && !filters.search ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex items-center justify-center"
          >
            <Card className="border-dashed border-border/50 max-w-md">
              <CardContent className="flex flex-col items-center justify-center py-12 px-8 text-center">
                <div className="relative mb-6">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-blue-500/10 border border-border/30">
                    <Target className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-primary/20 to-blue-500/20 blur-xl opacity-50" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No deals yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start adding deals to track your sales pipeline and close more business.
                </p>
                <Button onClick={() => handleQuickAdd()}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Your First Deal
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border/50">N</kbd> to
                  quickly add a deal
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : view === 'kanban' ? (
          // Kanban View
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            {/* Mobile Stage Tabs */}
            <div className="md:hidden mb-4">
              <ScrollArea className="w-full">
                <div className="flex gap-2 pb-2">
                  {stages.map((stage, index) => {
                    const colors = STAGE_COLORS[stage.color] || STAGE_COLORS.blue
                    const stageDeals = dealsByStage[stage.id] || []
                    return (
                      <button
                        key={stage.id}
                        onClick={() => setMobileStageIndex(index)}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
                          mobileStageIndex === index
                            ? `bg-gradient-to-r ${colors.gradient} text-white shadow-lg`
                            : 'bg-surface/50 hover:bg-surface'
                        )}
                      >
                        <span>{stage.name}</span>
                        <Badge
                          variant="default"
                          className={cn(
                            'text-xs',
                            mobileStageIndex === index
                              ? 'bg-white/20 text-white'
                              : ''
                          )}
                        >
                          {stageDeals.length}
                        </Badge>
                      </button>
                    )
                  })}
                </div>
              </ScrollArea>
            </div>

            {/* Mobile Single Column */}
            <div className="md:hidden h-full">
              {stages[mobileStageIndex] && (
                <KanbanColumn
                  stage={stages[mobileStageIndex]}
                  deals={dealsByStage[stages[mobileStageIndex].id] || []}
                  selectedDealIds={selectedDealIds}
                  onSelectDeal={toggleDealSelection}
                  onViewDeal={handleViewDeal}
                  onQuickAdd={handleQuickAdd}
                />
              )}
            </div>

            {/* Desktop Horizontal Kanban */}
            <div className="hidden md:flex gap-4 overflow-x-auto pb-4 h-full">
              {stages.map((stage) => (
                <KanbanColumn
                  key={stage.id}
                  stage={stage}
                  deals={dealsByStage[stage.id] || []}
                  selectedDealIds={selectedDealIds}
                  onSelectDeal={toggleDealSelection}
                  onViewDeal={handleViewDeal}
                  onQuickAdd={handleQuickAdd}
                />
              ))}
            </div>

            {/* Drag Overlay */}
            <DragOverlay>
              {activeDeal && activeStage && (
                <DealCardOverlay deal={activeDeal} stage={activeStage} />
              )}
            </DragOverlay>
          </DndContext>
        ) : view === 'table' ? (
          // Table View
          <TableView onViewDeal={handleViewDeal} />
        ) : view === 'today' ? (
          // Today View
          <TodayView onViewDeal={handleViewDeal} onQuickAdd={() => handleQuickAdd()} />
        ) : view === 'analytics' ? (
          // Analytics View
          <PipelineAnalytics />
        ) : (
          // Calendar View (Coming Soon)
          <div className="h-full flex items-center justify-center">
            <Card className="max-w-md">
              <CardContent className="flex flex-col items-center justify-center py-12 px-8 text-center">
                <CalendarDays className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Calendar View</h3>
                <p className="text-muted-foreground">
                  Calendar view for follow-ups and scheduled activities is coming soon.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Modals & Panels */}
      <QuickAddDeal
        open={quickAddOpen}
        onOpenChange={setQuickAddOpen}
        defaultStageId={quickAddStageId}
      />

      <PipelineSettings open={settingsOpen} onOpenChange={setSettingsOpen} />

      <DealDetailPanel
        deal={selectedDeal}
        open={detailPanelOpen}
        onClose={() => {
          setDetailPanelOpen(false)
          setSelectedDeal(null)
        }}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedDealIds.length} deals?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the selected
              deals and all associated data.
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

      {/* Tag Dialog */}
      <Dialog open={tagDialogOpen} onOpenChange={setTagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tags to {selectedDealIds.length} Deals</DialogTitle>
            <DialogDescription>Enter tags separated by commas.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="e.g., priority, hot-lead, follow-up"
              value={bulkTagInput}
              onChange={(e) => setBulkTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleBulkTag()
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTagDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkTag} disabled={!bulkTagInput.trim()}>
              <Tags className="h-4 w-4 mr-1" />
              Add Tags
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
