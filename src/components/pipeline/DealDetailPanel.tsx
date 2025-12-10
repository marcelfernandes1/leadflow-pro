import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Mail,
  Phone,
  Globe,
  Building2,
  User,
  Calendar,
  Clock,
  Tag,
  Plus,
  Trash2,
  Edit3,
  DollarSign,
  FileText,
  MessageSquare,
  PhoneCall,
  Video,
  Send,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  Copy,
  MoreHorizontal,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import type { Deal, ActivityType, DealActivity } from '@/types/pipeline'
import { STAGE_COLORS } from '@/types/pipeline'
import { usePipelineStore } from '@/hooks/usePipelineStore'
import { toast } from 'sonner'

interface DealDetailPanelProps {
  deal: Deal | null
  open: boolean
  onClose: () => void
}

const activityIcons: Record<ActivityType, React.ReactNode> = {
  call: <PhoneCall className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  text: <MessageSquare className="h-4 w-4" />,
  meeting: <Video className="h-4 w-4" />,
  note: <FileText className="h-4 w-4" />,
  task: <CheckCircle2 className="h-4 w-4" />,
  stage_change: <ChevronRight className="h-4 w-4" />,
  deal_created: <Plus className="h-4 w-4" />,
  follow_up: <Calendar className="h-4 w-4" />,
}

export function DealDetailPanel({ deal, open, onClose }: DealDetailPanelProps) {
  const {
    settings,
    updateDeal,
    moveDeal,
    deleteDeal,
    addActivity,
    addTag,
    removeTag,
    scheduleFollowUp,
    clearFollowUp,
  } = usePipelineStore()

  const pipeline = settings.pipelines.find((p) => p.id === settings.activePipelineId)
  const stage = pipeline?.stages.find((s) => s.id === deal?.stageId)
  const stageColors = stage ? STAGE_COLORS[stage.color] || STAGE_COLORS.blue : STAGE_COLORS.blue

  const [isEditing, setIsEditing] = useState(false)
  const [editedDeal, setEditedDeal] = useState<Partial<Deal>>({})
  const [newTag, setNewTag] = useState('')
  const [newActivity, setNewActivity] = useState<{
    type: ActivityType
    title: string
    description: string
  }>({ type: 'note', title: '', description: '' })
  const [followUpDate, setFollowUpDate] = useState('')
  const [followUpNote, setFollowUpNote] = useState('')
  const [closeReason, setCloseReason] = useState('')
  const [showCloseDialog, setShowCloseDialog] = useState(false)
  const [pendingStageId, setPendingStageId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!deal) return null

  const totalValue = deal.dealValue * deal.contractLength
  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(totalValue)

  const daysInStage = Math.floor(
    (Date.now() - new Date(deal.stageEnteredAt).getTime()) / (1000 * 60 * 60 * 24)
  )

  const handleSaveEdit = () => {
    updateDeal(deal.id, editedDeal)
    setIsEditing(false)
    setEditedDeal({})
    toast.success('Deal updated')
  }

  const handleStageChange = (stageId: string) => {
    const targetStage = pipeline?.stages.find((s) => s.id === stageId)
    if (targetStage?.isWonStage || targetStage?.isLostStage) {
      setPendingStageId(stageId)
      setShowCloseDialog(true)
    } else {
      moveDeal(deal.id, stageId)
      toast.success(`Moved to ${targetStage?.name}`)
    }
  }

  const handleCloseDeal = () => {
    if (pendingStageId) {
      moveDeal(deal.id, pendingStageId, closeReason)
      const targetStage = pipeline?.stages.find((s) => s.id === pendingStageId)
      toast.success(`Deal ${targetStage?.isWonStage ? 'won' : 'lost'}!`)
    }
    setShowCloseDialog(false)
    setPendingStageId(null)
    setCloseReason('')
  }

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTag.trim()) {
      addTag(deal.id, newTag.trim())
      setNewTag('')
      toast.success('Tag added')
    }
  }

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault()
    if (newActivity.title.trim()) {
      addActivity(deal.id, {
        type: newActivity.type,
        title: newActivity.title.trim(),
        description: newActivity.description.trim() || undefined,
      })
      setNewActivity({ type: 'note', title: '', description: '' })
      toast.success('Activity logged')
    }
  }

  const handleScheduleFollowUp = (e: React.FormEvent) => {
    e.preventDefault()
    if (followUpDate) {
      scheduleFollowUp(deal.id, followUpDate, followUpNote || undefined)
      setFollowUpDate('')
      setFollowUpNote('')
      toast.success('Follow-up scheduled')
    }
  }

  const handleDelete = () => {
    deleteDeal(deal.id)
    setShowDeleteConfirm(false)
    onClose()
    toast.success('Deal deleted')
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied`)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-xl bg-base border-l border-border/50 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-3 h-3 rounded-full bg-gradient-to-br',
                    stageColors.gradient
                  )}
                />
                <div>
                  <h2 className="font-semibold text-lg">{deal.companyName}</h2>
                  {deal.contactName && (
                    <p className="text-sm text-muted-foreground">{deal.contactName}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Deal
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Deal
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="ghost" size="icon-sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6">
                {/* Value & Stage */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-success">{formattedValue}</p>
                    <p className="text-sm text-muted-foreground">
                      ${deal.dealValue.toLocaleString()}/mo × {deal.contractLength} months
                    </p>
                  </div>
                  <div className="text-right">
                    <Select value={deal.stageId} onValueChange={handleStageChange}>
                      <SelectTrigger className={cn('w-40', stageColors.border)}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {pipeline?.stages
                          .sort((a, b) => a.order - b.order)
                          .map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {daysInStage} days in stage
                    </p>
                  </div>
                </div>

                {/* Quick Contact Actions */}
                <div className="flex items-center gap-2">
                  {deal.email && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open(`mailto:${deal.email}`)}
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </Button>
                  )}
                  {deal.phone && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open(`tel:${deal.phone}`)}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                  )}
                  {deal.website && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open(deal.website, '_blank')}
                    >
                      <Globe className="h-4 w-4 mr-1" />
                      Website
                    </Button>
                  )}
                </div>

                {/* Follow-up Alert */}
                {deal.nextFollowUp && (
                  <div
                    className={cn(
                      'p-3 rounded-lg border flex items-center justify-between',
                      new Date(deal.nextFollowUp.date) < new Date()
                        ? 'bg-red-500/10 border-red-500/30'
                        : 'bg-primary/10 border-primary/30'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">
                          Follow-up:{' '}
                          {new Date(deal.nextFollowUp.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        {deal.nextFollowUp.note && (
                          <p className="text-xs text-muted-foreground">
                            {deal.nextFollowUp.note}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        clearFollowUp(deal.id)
                        toast.success('Follow-up cleared')
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <Separator />

                {/* Tabs */}
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="w-full grid grid-cols-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                    <TabsTrigger value="files">Files</TabsTrigger>
                  </TabsList>

                  {/* Details Tab */}
                  <TabsContent value="details" className="space-y-4 mt-4">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs text-muted-foreground">Company Name</Label>
                            <Input
                              value={editedDeal.companyName ?? deal.companyName}
                              onChange={(e) =>
                                setEditedDeal({ ...editedDeal, companyName: e.target.value })
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Contact Name</Label>
                            <Input
                              value={editedDeal.contactName ?? deal.contactName}
                              onChange={(e) =>
                                setEditedDeal({ ...editedDeal, contactName: e.target.value })
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Email</Label>
                            <Input
                              type="email"
                              value={editedDeal.email ?? deal.email ?? ''}
                              onChange={(e) =>
                                setEditedDeal({ ...editedDeal, email: e.target.value })
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Phone</Label>
                            <Input
                              type="tel"
                              value={editedDeal.phone ?? deal.phone ?? ''}
                              onChange={(e) =>
                                setEditedDeal({ ...editedDeal, phone: e.target.value })
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Deal Value ($/mo)</Label>
                            <Input
                              type="number"
                              value={editedDeal.dealValue ?? deal.dealValue}
                              onChange={(e) =>
                                setEditedDeal({
                                  ...editedDeal,
                                  dealValue: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Contract Length</Label>
                            <Input
                              type="number"
                              value={editedDeal.contractLength ?? deal.contractLength}
                              onChange={(e) =>
                                setEditedDeal({
                                  ...editedDeal,
                                  contractLength: parseInt(e.target.value) || 1,
                                })
                              }
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleSaveEdit}>Save Changes</Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsEditing(false)
                              setEditedDeal({})
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Contact Info */}
                        <div className="space-y-3">
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Contact Information
                          </h3>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            {deal.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="truncate">{deal.email}</span>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  className="h-6 w-6 opacity-50 hover:opacity-100"
                                  onClick={() => copyToClipboard(deal.email!, 'Email')}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                            {deal.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{deal.phone}</span>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  className="h-6 w-6 opacity-50 hover:opacity-100"
                                  onClick={() => copyToClipboard(deal.phone!, 'Phone')}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                            {deal.website && (
                              <div className="flex items-center gap-2 col-span-2">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <a
                                  href={deal.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline truncate"
                                >
                                  {deal.website}
                                </a>
                                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Business Details */}
                        <div className="space-y-3">
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Business Details
                          </h3>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-muted-foreground">Vertical:</span>{' '}
                              {settings.verticals.find((v) => v.id === deal.vertical)?.label ||
                                deal.vertical}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Source:</span>{' '}
                              {settings.leadSources.find((s) => s.id === deal.leadSource)
                                ?.label || deal.leadSource}
                            </div>
                            {deal.expectedCloseDate && (
                              <div>
                                <span className="text-muted-foreground">Expected Close:</span>{' '}
                                {new Date(deal.expectedCloseDate).toLocaleDateString()}
                              </div>
                            )}
                            <div>
                              <span className="text-muted-foreground">Created:</span>{' '}
                              {new Date(deal.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="space-y-3">
                          <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
                          <div className="flex flex-wrap gap-2">
                            {deal.tags.map((tag) => (
                              <Badge key={tag} variant="default" className="gap-1">
                                {tag}
                                <button
                                  onClick={() => {
                                    removeTag(deal.id, tag)
                                    toast.success('Tag removed')
                                  }}
                                  className="ml-1 hover:text-destructive"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                            <form onSubmit={handleAddTag} className="flex items-center gap-1">
                              <Input
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                placeholder="Add tag..."
                                className="h-7 w-24 text-xs"
                              />
                              <Button type="submit" size="icon-sm" variant="ghost" className="h-7">
                                <Plus className="h-3 w-3" />
                              </Button>
                            </form>
                          </div>
                        </div>

                        {/* Schedule Follow-up */}
                        <div className="space-y-3">
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Schedule Follow-up
                          </h3>
                          <form onSubmit={handleScheduleFollowUp} className="space-y-2">
                            <div className="flex gap-2">
                              <Input
                                type="date"
                                value={followUpDate}
                                onChange={(e) => setFollowUpDate(e.target.value)}
                                className="flex-1"
                              />
                              <Input
                                value={followUpNote}
                                onChange={(e) => setFollowUpNote(e.target.value)}
                                placeholder="Note..."
                                className="flex-1"
                              />
                            </div>
                            <Button type="submit" size="sm" disabled={!followUpDate}>
                              <Calendar className="h-4 w-4 mr-1" />
                              Schedule
                            </Button>
                          </form>
                        </div>
                      </>
                    )}
                  </TabsContent>

                  {/* Activity Tab */}
                  <TabsContent value="activity" className="space-y-4 mt-4">
                    {/* Log Activity Form */}
                    <div className="space-y-3 p-3 rounded-lg bg-surface/50 border border-border/30">
                      <h3 className="text-sm font-medium">Log Activity</h3>
                      <form onSubmit={handleAddActivity} className="space-y-2">
                        <div className="flex gap-2">
                          <Select
                            value={newActivity.type}
                            onValueChange={(v) =>
                              setNewActivity({ ...newActivity, type: v as ActivityType })
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="call">Call</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="meeting">Meeting</SelectItem>
                              <SelectItem value="note">Note</SelectItem>
                              <SelectItem value="task">Task</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            value={newActivity.title}
                            onChange={(e) =>
                              setNewActivity({ ...newActivity, title: e.target.value })
                            }
                            placeholder="Title..."
                            className="flex-1"
                          />
                        </div>
                        <Textarea
                          value={newActivity.description}
                          onChange={(e) =>
                            setNewActivity({ ...newActivity, description: e.target.value })
                          }
                          placeholder="Add notes..."
                          rows={2}
                        />
                        <Button type="submit" size="sm" disabled={!newActivity.title.trim()}>
                          <Plus className="h-4 w-4 mr-1" />
                          Log Activity
                        </Button>
                      </form>
                    </div>

                    {/* Activity Timeline */}
                    <div className="space-y-3">
                      {deal.activities
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                        )
                        .map((activity) => (
                          <div
                            key={activity.id}
                            className="flex gap-3 p-3 rounded-lg bg-surface/30 border border-border/20"
                          >
                            <div
                              className={cn(
                                'p-2 rounded-lg',
                                activity.type === 'stage_change' && 'bg-primary/10 text-primary',
                                activity.type === 'call' && 'bg-green-500/10 text-green-400',
                                activity.type === 'email' && 'bg-blue-500/10 text-blue-400',
                                activity.type === 'meeting' && 'bg-violet-500/10 text-violet-400',
                                activity.type === 'note' && 'bg-amber-500/10 text-amber-400',
                                (activity.type === 'deal_created' ||
                                  activity.type === 'follow_up') &&
                                  'bg-cyan-500/10 text-cyan-400'
                              )}
                            >
                              {activityIcons[activity.type]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{activity.title}</p>
                              {activity.description && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {activity.description}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(activity.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </TabsContent>

                  {/* History Tab */}
                  <TabsContent value="history" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      {deal.stageHistory
                        .sort(
                          (a, b) =>
                            new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
                        )
                        .map((entry, i) => (
                          <div
                            key={entry.id}
                            className="flex gap-3 p-3 rounded-lg bg-surface/30 border border-border/20"
                          >
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                              <ChevronRight className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm">
                                {entry.fromStageName ? (
                                  <>
                                    Moved from{' '}
                                    <span className="font-medium">{entry.fromStageName}</span> to{' '}
                                    <span className="font-medium">{entry.toStageName}</span>
                                  </>
                                ) : (
                                  <>
                                    Added to{' '}
                                    <span className="font-medium">{entry.toStageName}</span>
                                  </>
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(entry.changedAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </TabsContent>

                  {/* Files Tab */}
                  <TabsContent value="files" className="space-y-4 mt-4">
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No files attached</p>
                      <p className="text-xs mt-1">
                        File uploads coming soon
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </ScrollArea>
          </motion.div>

          {/* Close Deal Dialog */}
          <AlertDialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {pipeline?.stages.find((s) => s.id === pendingStageId)?.isWonStage
                    ? 'Close Deal as Won'
                    : 'Close Deal as Lost'}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {pipeline?.stages.find((s) => s.id === pendingStageId)?.isWonStage
                    ? 'Congratulations! Add an optional note about this win.'
                    : 'What was the reason this deal was lost?'}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
                <Textarea
                  value={closeReason}
                  onChange={(e) => setCloseReason(e.target.value)}
                  placeholder={
                    pipeline?.stages.find((s) => s.id === pendingStageId)?.isWonStage
                      ? 'Win notes (optional)...'
                      : 'Loss reason (e.g., budget, timing, competition)...'
                  }
                  rows={3}
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCloseDeal}
                  className={
                    pipeline?.stages.find((s) => s.id === pendingStageId)?.isWonStage
                      ? 'bg-success hover:bg-success/90'
                      : ''
                  }
                >
                  {pipeline?.stages.find((s) => s.id === pendingStageId)?.isWonStage
                    ? 'Mark as Won'
                    : 'Mark as Lost'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Delete Confirmation */}
          <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Deal?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete "{deal.companyName}" and all associated data. This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </AnimatePresence>
  )
}
