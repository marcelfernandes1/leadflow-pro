import { useState } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import {
  X,
  Plus,
  Trash2,
  GripVertical,
  Settings,
  Palette,
  Percent,
  Trophy,
  XCircle,
  Check,
  ChevronDown,
  Building2,
  Target,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import type { Pipeline, PipelineStage, DropdownOption } from '@/types/pipeline'
import { STAGE_COLORS } from '@/types/pipeline'
import { usePipelineStore } from '@/hooks/usePipelineStore'
import { toast } from 'sonner'

interface PipelineSettingsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const colorOptions = Object.keys(STAGE_COLORS)

export function PipelineSettings({ open, onOpenChange }: PipelineSettingsProps) {
  const {
    settings,
    updateSettings,
    createPipeline,
    updatePipeline,
    deletePipeline,
    setActivePipeline,
    addStage,
    updateStage,
    deleteStage,
    reorderStages,
    addVertical,
    removeVertical,
    addLeadSource,
    removeLeadSource,
  } = usePipelineStore()

  const [selectedPipelineId, setSelectedPipelineId] = useState(settings.activePipelineId)
  const [newPipelineName, setNewPipelineName] = useState('')
  const [showNewPipelineDialog, setShowNewPipelineDialog] = useState(false)
  const [deletingPipelineId, setDeletingPipelineId] = useState<string | null>(null)
  const [editingStageId, setEditingStageId] = useState<string | null>(null)

  // New stage form
  const [newStageName, setNewStageName] = useState('')
  const [newStageColor, setNewStageColor] = useState('blue')
  const [newStageProbability, setNewStageProbability] = useState('20')

  // New dropdown options
  const [newVertical, setNewVertical] = useState('')
  const [newLeadSource, setNewLeadSource] = useState('')

  const selectedPipeline = settings.pipelines.find((p) => p.id === selectedPipelineId)
  const sortedStages = selectedPipeline?.stages.sort((a, b) => a.order - b.order) || []

  const handleCreatePipeline = () => {
    if (!newPipelineName.trim()) {
      toast.error('Pipeline name is required')
      return
    }
    const pipeline = createPipeline(newPipelineName.trim())
    setSelectedPipelineId(pipeline.id)
    setNewPipelineName('')
    setShowNewPipelineDialog(false)
    toast.success('Pipeline created')
  }

  const handleDeletePipeline = () => {
    if (!deletingPipelineId) return
    if (settings.pipelines.length <= 1) {
      toast.error('Cannot delete the only pipeline')
      return
    }
    deletePipeline(deletingPipelineId)
    if (selectedPipelineId === deletingPipelineId) {
      setSelectedPipelineId(settings.pipelines[0]?.id || '')
    }
    setDeletingPipelineId(null)
    toast.success('Pipeline deleted')
  }

  const handleAddStage = () => {
    if (!newStageName.trim() || !selectedPipelineId) return
    addStage(selectedPipelineId, {
      name: newStageName.trim(),
      color: newStageColor,
      probability: parseInt(newStageProbability) || 20,
      order: sortedStages.length,
      isWonStage: false,
      isLostStage: false,
    })
    setNewStageName('')
    setNewStageColor('blue')
    setNewStageProbability('20')
    toast.success('Stage added')
  }

  const handleStageReorder = (newOrder: PipelineStage[]) => {
    if (!selectedPipelineId) return
    reorderStages(
      selectedPipelineId,
      newOrder.map((s) => s.id)
    )
  }

  const handleAddVertical = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newVertical.trim()) return
    addVertical({ label: newVertical.trim() })
    setNewVertical('')
    toast.success('Vertical added')
  }

  const handleAddLeadSource = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLeadSource.trim()) return
    addLeadSource({ label: newLeadSource.trim() })
    setNewLeadSource('')
    toast.success('Lead source added')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Pipeline Settings
          </DialogTitle>
          <DialogDescription>
            Manage your pipelines, stages, and custom fields
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="stages" className="flex-1">
          <TabsList className="w-full justify-start px-6 border-b border-border/30 rounded-none h-auto pb-0">
            <TabsTrigger value="stages" className="rounded-b-none">Stages</TabsTrigger>
            <TabsTrigger value="pipelines" className="rounded-b-none">Pipelines</TabsTrigger>
            <TabsTrigger value="dropdowns" className="rounded-b-none">Dropdowns</TabsTrigger>
            <TabsTrigger value="general" className="rounded-b-none">General</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px]">
            {/* Stages Tab */}
            <TabsContent value="stages" className="p-6 space-y-6 mt-0">
              {/* Pipeline Selector */}
              <div>
                <Label className="text-xs text-muted-foreground">Select Pipeline</Label>
                <Select value={selectedPipelineId} onValueChange={setSelectedPipelineId}>
                  <SelectTrigger className="mt-1">
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

              {/* Stage List */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Stages</h3>
                <p className="text-xs text-muted-foreground">
                  Drag to reorder. Stages with 100% probability are marked as won, 0% as lost.
                </p>

                <Reorder.Group
                  axis="y"
                  values={sortedStages}
                  onReorder={handleStageReorder}
                  className="space-y-2"
                >
                  {sortedStages.map((stage) => {
                    const colors = STAGE_COLORS[stage.color] || STAGE_COLORS.blue

                    return (
                      <Reorder.Item
                        key={stage.id}
                        value={stage}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-lg border border-border/30 bg-surface/30',
                          'cursor-grab active:cursor-grabbing'
                        )}
                      >
                        <GripVertical className="h-4 w-4 text-muted-foreground/50 shrink-0" />

                        <div
                          className={cn(
                            'w-3 h-3 rounded-full bg-gradient-to-br shrink-0',
                            colors.gradient
                          )}
                        />

                        {editingStageId === stage.id ? (
                          <div className="flex-1 flex items-center gap-2">
                            <Input
                              defaultValue={stage.name}
                              className="h-8"
                              onBlur={(e) => {
                                updateStage(selectedPipelineId!, stage.id, {
                                  name: e.target.value,
                                })
                                setEditingStageId(null)
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  updateStage(selectedPipelineId!, stage.id, {
                                    name: e.currentTarget.value,
                                  })
                                  setEditingStageId(null)
                                }
                              }}
                              autoFocus
                            />
                          </div>
                        ) : (
                          <span
                            className="flex-1 font-medium cursor-text"
                            onClick={() => setEditingStageId(stage.id)}
                          >
                            {stage.name}
                          </span>
                        )}

                        <div className="flex items-center gap-2 shrink-0">
                          {stage.isWonStage && (
                            <Badge variant="success" className="text-xs">
                              <Trophy className="h-3 w-3 mr-1" />
                              Won
                            </Badge>
                          )}
                          {stage.isLostStage && (
                            <Badge variant="default" className="text-xs">
                              <XCircle className="h-3 w-3 mr-1" />
                              Lost
                            </Badge>
                          )}

                          <Select
                            value={stage.color}
                            onValueChange={(color) =>
                              updateStage(selectedPipelineId!, stage.id, { color })
                            }
                          >
                            <SelectTrigger className="w-20 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {colorOptions.map((c) => (
                                <SelectItem key={c} value={c}>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={cn(
                                        'w-3 h-3 rounded-full bg-gradient-to-br',
                                        STAGE_COLORS[c].gradient
                                      )}
                                    />
                                    {c}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              value={stage.probability}
                              onChange={(e) =>
                                updateStage(selectedPipelineId!, stage.id, {
                                  probability: parseInt(e.target.value) || 0,
                                  isWonStage: parseInt(e.target.value) === 100,
                                  isLostStage: parseInt(e.target.value) === 0,
                                })
                              }
                              className="w-16 h-8"
                              min={0}
                              max={100}
                            />
                            <span className="text-xs text-muted-foreground">%</span>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => {
                              if (sortedStages.length <= 2) {
                                toast.error('Pipeline must have at least 2 stages')
                                return
                              }
                              deleteStage(selectedPipelineId!, stage.id)
                              toast.success('Stage deleted')
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </Reorder.Item>
                    )
                  })}
                </Reorder.Group>

                {/* Add Stage */}
                <div className="flex items-center gap-2 p-3 rounded-lg border border-dashed border-border/50">
                  <Plus className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Input
                    value={newStageName}
                    onChange={(e) => setNewStageName(e.target.value)}
                    placeholder="New stage name..."
                    className="h-8"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddStage()
                    }}
                  />
                  <Select value={newStageColor} onValueChange={setNewStageColor}>
                    <SelectTrigger className="w-20 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={newStageProbability}
                    onChange={(e) => setNewStageProbability(e.target.value)}
                    className="w-16 h-8"
                    min={0}
                    max={100}
                  />
                  <span className="text-xs text-muted-foreground">%</span>
                  <Button size="sm" onClick={handleAddStage} disabled={!newStageName.trim()}>
                    Add
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Pipelines Tab */}
            <TabsContent value="pipelines" className="p-6 space-y-6 mt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Your Pipelines</h3>
                  <Button size="sm" onClick={() => setShowNewPipelineDialog(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    New Pipeline
                  </Button>
                </div>

                <div className="space-y-2">
                  {settings.pipelines.map((pipeline) => (
                    <div
                      key={pipeline.id}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-lg border',
                        pipeline.id === settings.activePipelineId
                          ? 'border-primary/30 bg-primary/5'
                          : 'border-border/30 bg-surface/30'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{pipeline.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {pipeline.stages.length} stages
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {pipeline.id === settings.activePipelineId ? (
                          <Badge variant="default" className="text-xs">
                            <Check className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setActivePipeline(pipeline.id)
                              toast.success('Active pipeline changed')
                            }}
                          >
                            Set Active
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => setDeletingPipelineId(pipeline.id)}
                          disabled={settings.pipelines.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Dropdowns Tab */}
            <TabsContent value="dropdowns" className="p-6 space-y-6 mt-0">
              {/* Verticals */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Business Verticals</h3>
                <div className="flex flex-wrap gap-2">
                  {settings.verticals.map((v) => (
                    <Badge key={v.id} variant="default" className="gap-1 pr-1">
                      {v.label}
                      <button
                        onClick={() => {
                          removeVertical(v.id)
                          toast.success('Vertical removed')
                        }}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <form onSubmit={handleAddVertical} className="flex items-center gap-2">
                  <Input
                    value={newVertical}
                    onChange={(e) => setNewVertical(e.target.value)}
                    placeholder="Add vertical..."
                    className="flex-1"
                  />
                  <Button type="submit" size="sm" disabled={!newVertical.trim()}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </form>
              </div>

              <Separator />

              {/* Lead Sources */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Lead Sources</h3>
                <div className="flex flex-wrap gap-2">
                  {settings.leadSources.map((s) => (
                    <Badge key={s.id} variant="default" className="gap-1 pr-1">
                      {s.label}
                      <button
                        onClick={() => {
                          removeLeadSource(s.id)
                          toast.success('Lead source removed')
                        }}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <form onSubmit={handleAddLeadSource} className="flex items-center gap-2">
                  <Input
                    value={newLeadSource}
                    onChange={(e) => setNewLeadSource(e.target.value)}
                    placeholder="Add lead source..."
                    className="flex-1"
                  />
                  <Button type="submit" size="sm" disabled={!newLeadSource.trim()}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </form>
              </div>
            </TabsContent>

            {/* General Tab */}
            <TabsContent value="general" className="p-6 space-y-6 mt-0">
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Default Contract Length (months)
                  </Label>
                  <Input
                    type="number"
                    value={settings.defaultContractLength}
                    onChange={(e) =>
                      updateSettings({
                        defaultContractLength: parseInt(e.target.value) || 3,
                      })
                    }
                    className="w-32 mt-1"
                    min={1}
                  />
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">
                    Stale Deal Threshold (days without activity)
                  </Label>
                  <Input
                    type="number"
                    value={settings.staleDealsThreshold}
                    onChange={(e) =>
                      updateSettings({
                        staleDealsThreshold: parseInt(e.target.value) || 7,
                      })
                    }
                    className="w-32 mt-1"
                    min={1}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Deals with no activity for this many days will be marked as stale
                  </p>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="px-6 pb-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>

        {/* New Pipeline Dialog */}
        <Dialog open={showNewPipelineDialog} onOpenChange={setShowNewPipelineDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Pipeline</DialogTitle>
              <DialogDescription>
                Create a new pipeline to organize different types of deals
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label className="text-xs text-muted-foreground">Pipeline Name</Label>
              <Input
                value={newPipelineName}
                onChange={(e) => setNewPipelineName(e.target.value)}
                placeholder="e.g., Cold Outreach, Referrals"
                className="mt-1"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewPipelineDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePipeline}>Create Pipeline</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Pipeline Confirmation */}
        <AlertDialog
          open={!!deletingPipelineId}
          onOpenChange={() => setDeletingPipelineId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Pipeline?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this pipeline and all deals within it. This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeletePipeline}
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  )
}
