import { useState } from 'react'
import { motion } from 'framer-motion'
import { format, formatDistanceToNow } from 'date-fns'
import {
  Mail,
  Phone,
  Globe,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  MapPin,
  Star,
  X,
  Plus,
  Calendar,
  MessageSquare,
  Tag,
  Clock,
  CheckCircle2,
  Circle,
  Send,
  FileText,
  Pencil,
  Trash2,
  Facebook,
  BadgeCheck,
  AlertCircle,
  Sparkles,
  Loader2,
  TrendingUp,
} from 'lucide-react'

// TikTok icon component (not in lucide-react)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
)

// Helper to get proper social media URL (handles both full URLs and usernames)
function getSocialUrl(platform: string, value: string | undefined): string {
  if (!value) return ''
  // If it's already a full URL, return it
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value
  }
  // Otherwise, construct the URL from the username
  const username = value.replace('@', '')
  const baseUrls: Record<string, string> = {
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    linkedin: 'https://linkedin.com/in/',
    twitter: 'https://twitter.com/',
    tiktok: 'https://tiktok.com/@',
    youtube: 'https://youtube.com/@',
  }
  return `${baseUrls[platform] || ''}${username}`
}

// Helper to extract display name from URL or username
function getSocialDisplayName(value: string | undefined): string {
  if (!value) return ''
  // If it's a URL, extract the username/handle
  if (value.startsWith('http://') || value.startsWith('https://')) {
    try {
      const url = new URL(value)
      // Get the last meaningful path segment
      const pathParts = url.pathname.split('/').filter(Boolean)
      return pathParts[pathParts.length - 1] || url.hostname
    } catch {
      return value
    }
  }
  return value
}
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import type { Lead, ContactMethod, PipelineStage } from '@/types'
import type { ScoringResult } from '@/lib/leadScoring'

interface Activity {
  id: string
  type: 'contacted' | 'note_added' | 'stage_changed' | 'tag_added' | 'follow_up_scheduled'
  contactMethod?: string
  details: string
  createdAt: string
}

interface CustomField {
  key: string
  value: string
}

interface ExtendedLead extends Omit<Lead, 'lastContactMethod'> {
  notes?: string[]
  tags?: string[]
  customFields?: CustomField[]
  activities?: Activity[]
  nextFollowUpAt?: string
  lastContactedAt?: string
  lastContactMethod?: ContactMethod | string
  createdAt?: string
  updatedAt?: string
}

interface LeadDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead: ExtendedLead | null
  onContact: (method: ContactMethod) => void
  onAddNote: (note: string) => void
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
  onAddCustomField?: (key: string, value: string) => void
  onUpdateCustomField?: (key: string, value: string) => void
  onRemoveCustomField?: (key: string) => void
  onScheduleFollowUp: (date: string, note?: string) => void
  onStageChange?: (stage: PipelineStage) => void
  // Pro Intelligence analysis
  onAnalyze?: (lead: Lead) => Promise<ScoringResult | null>
  isAnalyzing?: boolean
  analysisProgress?: number
  scoringResult?: ScoringResult | null
}

const stages: Array<{ id: PipelineStage; label: string; color: string }> = [
  { id: 'new', label: 'New', color: 'bg-blue-500' },
  { id: 'contacted', label: 'Contacted', color: 'bg-amber-500' },
  { id: 'qualified', label: 'Qualified', color: 'bg-purple-500' },
  { id: 'proposal', label: 'Proposal', color: 'bg-pink-500' },
  { id: 'negotiation', label: 'Negotiation', color: 'bg-orange-500' },
  { id: 'won', label: 'Won', color: 'bg-green-500' },
  { id: 'lost', label: 'Lost', color: 'bg-gray-500' },
]

const activityIcons: Record<string, React.ElementType> = {
  contacted: Send,
  note_added: MessageSquare,
  stage_changed: Circle,
  tag_added: Tag,
  follow_up_scheduled: Calendar,
}

export function LeadDetailModal({
  open,
  onOpenChange,
  lead,
  onContact,
  onAddNote,
  onAddTag,
  onRemoveTag,
  onAddCustomField,
  onUpdateCustomField,
  onRemoveCustomField,
  onScheduleFollowUp,
  onStageChange,
  onAnalyze,
  isAnalyzing,
  analysisProgress,
  scoringResult,
}: LeadDetailModalProps) {
  const [newNote, setNewNote] = useState('')
  const [newTag, setNewTag] = useState('')
  const [followUpDate, setFollowUpDate] = useState('')
  const [followUpNote, setFollowUpNote] = useState('')
  const [newFieldKey, setNewFieldKey] = useState('')
  const [newFieldValue, setNewFieldValue] = useState('')
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState('')

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(newNote.trim())
      setNewNote('')
    }
  }

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(newTag.trim())
      setNewTag('')
    }
  }

  const handleScheduleFollowUp = () => {
    if (followUpDate) {
      onScheduleFollowUp(followUpDate, followUpNote || undefined)
      setFollowUpDate('')
      setFollowUpNote('')
    }
  }

  const handleAddCustomField = () => {
    if (newFieldKey.trim() && newFieldValue.trim() && onAddCustomField) {
      onAddCustomField(newFieldKey.trim(), newFieldValue.trim())
      setNewFieldKey('')
      setNewFieldValue('')
    }
  }

  const handleUpdateCustomField = (key: string) => {
    if (editingValue.trim() && onUpdateCustomField) {
      onUpdateCustomField(key, editingValue.trim())
      setEditingField(null)
      setEditingValue('')
    }
  }

  const startEditing = (field: CustomField) => {
    setEditingField(field.key)
    setEditingValue(field.value)
  }

  if (!lead) return null

  // Helper to get score color
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-hot'
    if (score >= 50) return 'text-warm'
    return 'text-cold'
  }

  const getScoreBg = (score: number) => {
    if (score >= 70) return 'bg-hot/10 border-hot/30'
    if (score >= 50) return 'bg-warm/10 border-warm/30'
    return 'bg-cold/10 border-cold/30'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{lead.businessName}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {lead.category}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {lead.googleRating && (
                <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-md">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  <span className="font-medium">{lead.googleRating.toFixed(1)}</span>
                  {lead.reviewCount && (
                    <span className="text-xs text-muted-foreground">
                      ({lead.reviewCount})
                    </span>
                  )}
                </div>
              )}
              {/* Score badge if analyzed */}
              {scoringResult && (
                <div className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-md border',
                  getScoreBg(scoringResult.totalScore)
                )}>
                  <TrendingUp className={cn('h-4 w-4', getScoreColor(scoringResult.totalScore))} />
                  <span className={cn('font-bold', getScoreColor(scoringResult.totalScore))}>
                    {scoringResult.totalScore}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Pro Intelligence Analysis Button/Status */}
          {onAnalyze && (
            <div className="mt-4">
              {isAnalyzing ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span>Analyzing lead...</span>
                    <span className="ml-auto text-xs">{analysisProgress}%</span>
                  </div>
                  <Progress value={analysisProgress} className="h-1.5" />
                </div>
              ) : scoringResult ? (
                <div className={cn(
                  'p-3 rounded-lg border',
                  getScoreBg(scoringResult.totalScore)
                )}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className={cn('h-4 w-4', getScoreColor(scoringResult.totalScore))} />
                      <span className="text-sm font-medium">Pro Intelligence Score</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {scoringResult.opportunities.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">
                            ${scoringResult.opportunities.reduce((sum, o) => sum + o.value, 0).toLocaleString()}
                          </span>
                          /mo opportunity
                        </div>
                      )}
                      <Badge variant={
                        scoringResult.totalScore >= 70 ? 'hot' :
                        scoringResult.totalScore >= 50 ? 'warm' : 'cold'
                      }>
                        {scoringResult.totalScore >= 70 ? 'Hot' :
                         scoringResult.totalScore >= 50 ? 'Warm' : 'Cold'} Lead
                      </Badge>
                    </div>
                  </div>
                  {scoringResult.opportunities.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {scoringResult.opportunities.slice(0, 3).map((opp, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {opp.tool}: ${opp.value}/mo
                        </Badge>
                      ))}
                      {scoringResult.opportunities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{scoringResult.opportunities.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              ) : lead.website ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAnalyze(lead as Lead)}
                  className="w-full gap-2 bg-primary/5 border-primary/20 hover:bg-primary/10"
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                  Analyze with Pro Intelligence
                </Button>
              ) : (
                <div className="text-xs text-muted-foreground text-center py-2">
                  No website available for analysis
                </div>
              )}
            </div>
          )}
        </DialogHeader>

        <Tabs defaultValue="details" className="flex-1">
          <TabsList className="px-6 w-full justify-start rounded-none border-b bg-transparent">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(90vh-180px)]">
            {/* Details Tab */}
            <TabsContent value="details" className="px-6 py-4 space-y-6 mt-0">
              {/* Stage Selection */}
              {onStageChange && lead.stage && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pipeline Stage</label>
                  <div className="flex flex-wrap gap-2">
                    {stages.map((stage) => (
                      <button
                        key={stage.id}
                        onClick={() => onStageChange(stage.id)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                          lead.stage === stage.id
                            ? `${stage.color} text-white`
                            : 'bg-muted hover:bg-muted/80'
                        )}
                      >
                        {stage.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Contact Information</h4>
                <div className="grid gap-2">
                  {lead.address && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {lead.address}, {lead.city}, {lead.state}
                      </span>
                    </div>
                  )}
                  {lead.phone && (
                    <button
                      onClick={() => onContact('phone')}
                      className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                    >
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{lead.phone}</span>
                    </button>
                  )}
                  {lead.email && (
                    <button
                      onClick={() => onContact('email')}
                      className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                    >
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{lead.email}</span>
                    </button>
                  )}
                  {lead.website && (
                    <button
                      onClick={() => onContact('website')}
                      className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                    >
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{lead.website}</span>
                    </button>
                  )}
                  {lead.instagram && (
                    <button
                      onClick={() => {
                        window.open(getSocialUrl('instagram', lead.instagram), '_blank')
                        onContact('instagram')
                      }}
                      className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                    >
                      <Instagram className="h-4 w-4 text-muted-foreground" />
                      <span>{getSocialDisplayName(lead.instagram)}</span>
                    </button>
                  )}
                  {lead.facebook && (
                    <button
                      onClick={() => {
                        window.open(getSocialUrl('facebook', lead.facebook), '_blank')
                        onContact('facebook')
                      }}
                      className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                    >
                      <Facebook className="h-4 w-4 text-muted-foreground" />
                      <span>{getSocialDisplayName(lead.facebook)}</span>
                    </button>
                  )}
                  {lead.linkedin && (
                    <button
                      onClick={() => {
                        window.open(getSocialUrl('linkedin', lead.linkedin), '_blank')
                        onContact('linkedin')
                      }}
                      className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                    >
                      <Linkedin className="h-4 w-4 text-muted-foreground" />
                      <span>{getSocialDisplayName(lead.linkedin)}</span>
                    </button>
                  )}
                  {lead.twitter && (
                    <button
                      onClick={() => {
                        window.open(getSocialUrl('twitter', lead.twitter), '_blank')
                        onContact('twitter')
                      }}
                      className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                    >
                      <Twitter className="h-4 w-4 text-muted-foreground" />
                      <span>{getSocialDisplayName(lead.twitter)}</span>
                    </button>
                  )}
                  {lead.tiktok && (
                    <button
                      onClick={() => window.open(getSocialUrl('tiktok', lead.tiktok), '_blank')}
                      className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                    >
                      <TikTokIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{getSocialDisplayName(lead.tiktok)}</span>
                    </button>
                  )}
                  {lead.youtube && (
                    <button
                      onClick={() => window.open(getSocialUrl('youtube', lead.youtube), '_blank')}
                      className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                    >
                      <Youtube className="h-4 w-4 text-muted-foreground" />
                      <span>{getSocialDisplayName(lead.youtube)}</span>
                    </button>
                  )}
                </div>

                {/* Email Verification Status */}
                {lead.email && lead.emailVerificationStatus && (
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    {lead.emailVerificationStatus === 'valid' ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <BadgeCheck className="h-3 w-3" />
                        <span>Verified email</span>
                      </div>
                    ) : lead.emailVerificationStatus === 'invalid' ? (
                      <div className="flex items-center gap-1 text-red-500">
                        <AlertCircle className="h-3 w-3" />
                        <span>Invalid email</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-amber-500">
                        <AlertCircle className="h-3 w-3" />
                        <span>Unverified</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Separator />

              {/* Tags */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {(lead.tags || []).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      onClick={() => onRemoveTag(tag)}
                    >
                      {tag}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                  <div className="flex items-center gap-1">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag..."
                      className="h-7 w-24 text-xs"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={handleAddTag}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Custom Fields */}
              {onAddCustomField && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Custom Fields
                  </h4>

                  {/* Existing fields */}
                  {(lead.customFields || []).length > 0 && (
                    <div className="space-y-2">
                      {(lead.customFields || []).map((field) => (
                        <div
                          key={field.key}
                          className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                        >
                          <span className="text-xs font-medium text-muted-foreground min-w-[80px]">
                            {field.key}:
                          </span>
                          {editingField === field.key ? (
                            <div className="flex-1 flex items-center gap-1">
                              <Input
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                className="h-7 text-xs flex-1"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleUpdateCustomField(field.key)
                                  if (e.key === 'Escape') {
                                    setEditingField(null)
                                    setEditingValue('')
                                  }
                                }}
                                autoFocus
                              />
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                                onClick={() => handleUpdateCustomField(field.key)}
                              >
                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                                onClick={() => {
                                  setEditingField(null)
                                  setEditingValue('')
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <span className="text-sm flex-1">{field.value}</span>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                                onClick={() => startEditing(field)}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              {onRemoveCustomField && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 hover:text-destructive"
                                  onClick={() => onRemoveCustomField(field.key)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add new field */}
                  <div className="flex items-center gap-2">
                    <Input
                      value={newFieldKey}
                      onChange={(e) => setNewFieldKey(e.target.value)}
                      placeholder="Field name"
                      className="h-8 text-xs w-28"
                    />
                    <Input
                      value={newFieldValue}
                      onChange={(e) => setNewFieldValue(e.target.value)}
                      placeholder="Value"
                      className="h-8 text-xs flex-1"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddCustomField()}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleAddCustomField}
                      disabled={!newFieldKey.trim() || !newFieldValue.trim()}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              )}

              <Separator />

              {/* Follow-up Scheduling */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Schedule Follow-up</h4>
                {lead.nextFollowUpAt && (
                  <div className="flex items-center gap-2 text-sm bg-amber-500/10 px-3 py-2 rounded-md">
                    <Calendar className="h-4 w-4 text-amber-500" />
                    <span>
                      Follow-up scheduled for{' '}
                      {format(new Date(lead.nextFollowUpAt), 'PPP')}
                    </span>
                  </div>
                )}
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
                    placeholder="Note (optional)"
                    className="flex-1"
                  />
                  <Button onClick={handleScheduleFollowUp} disabled={!followUpDate}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                </div>
              </div>

              {/* Last Contact Info */}
              {lead.lastContactedAt && (
                <>
                  <Separator />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      Last contacted{' '}
                      {formatDistanceToNow(new Date(lead.lastContactedAt), {
                        addSuffix: true,
                      })}
                      {lead.lastContactMethod && (
                        <> via {lead.lastContactMethod.replace('_', ' ')}</>
                      )}
                    </span>
                  </div>
                </>
              )}
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="px-6 py-4 mt-0">
              <div className="space-y-4">
                {(lead.activities || []).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No activity yet
                  </p>
                ) : (
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                    <div className="space-y-4">
                      {(lead.activities || []).map((activity, index) => {
                        const Icon = activityIcons[activity.type] || Circle
                        return (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="relative flex gap-4 pl-8"
                          >
                            <div className="absolute left-2 w-4 h-4 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                              <Icon className="h-2 w-2" />
                            </div>
                            <div className="flex-1 pb-4">
                              <p className="text-sm">{activity.details}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDistanceToNow(new Date(activity.createdAt), {
                                  addSuffix: true,
                                })}
                              </p>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="px-6 py-4 mt-0">
              <div className="space-y-4">
                {/* Add Note */}
                <div className="space-y-2">
                  <Textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    rows={3}
                  />
                  <Button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                </div>

                <Separator />

                {/* Notes List */}
                {(lead.notes || []).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No notes yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {(lead.notes || []).map((note, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-muted rounded-lg"
                      >
                        <p className="text-sm">{note}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
