import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Globe,
  Instagram,
  Facebook,
  Linkedin,
  Star,
  MapPin,
  Calendar,
  DollarSign,
  Tag,
  FileText,
  Clock,
  ArrowRight,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useLeadStore, type PipelineLead, STAGE_ROTTING_DAYS } from '@/hooks/useLeadStore'
import type { PipelineStage, HealthStatus } from '@/types'
import { formatDistanceToNow } from 'date-fns'

interface FocusModeProps {
  lead: PipelineLead | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onPrevious: () => void
  onNext: () => void
  onStageChange: (stage: PipelineStage) => void
  onAddNote: () => void
  onAddTag: () => void
  onSetValue: () => void
  onContact: () => void
}

const stages: { id: PipelineStage; title: string; color: string }[] = [
  { id: 'new', title: 'New', color: 'bg-cold' },
  { id: 'contacted', title: 'Contacted', color: 'bg-warm' },
  { id: 'qualified', title: 'Qualified', color: 'bg-primary' },
  { id: 'proposal', title: 'Proposal', color: 'bg-pink-500' },
  { id: 'negotiation', title: 'Negotiation', color: 'bg-orange-500' },
  { id: 'won', title: 'Won', color: 'bg-success' },
  { id: 'lost', title: 'Lost', color: 'bg-gray-500' },
]

export function FocusMode({
  lead,
  open,
  onOpenChange,
  onPrevious,
  onNext,
  onStageChange,
  onAddNote,
  onAddTag,
  onSetValue,
  onContact,
}: FocusModeProps) {
  const { getLeadDaysInStage, getLeadHealthStatus, pipelineLeads } = useLeadStore()

  // Keyboard navigation
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      switch (e.key) {
        case 'Escape':
          onOpenChange(false)
          break
        case 'j':
        case 'ArrowDown':
          e.preventDefault()
          onNext()
          break
        case 'k':
        case 'ArrowUp':
          e.preventDefault()
          onPrevious()
          break
        case 'n':
          e.preventDefault()
          onAddNote()
          break
        case 't':
          e.preventDefault()
          onAddTag()
          break
        case 'v':
          e.preventDefault()
          onSetValue()
          break
        case 'c':
          e.preventDefault()
          onContact()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onOpenChange, onNext, onPrevious, onAddNote, onAddTag, onSetValue, onContact])

  if (!lead) return null

  const daysInStage = getLeadDaysInStage(lead.pipelineId)
  const healthStatus = getLeadHealthStatus(lead.pipelineId)
  const currentIndex = pipelineLeads.findIndex((l) => l.pipelineId === lead.pipelineId)
  const threshold = STAGE_ROTTING_DAYS[lead.stage]

  const getHealthColor = (status: HealthStatus) => {
    switch (status) {
      case 'healthy': return 'text-success'
      case 'aging': return 'text-warm'
      case 'at_risk': return 'text-destructive'
    }
  }

  const formatDaysInStage = (days: number) => {
    if (days === 0) return 'Today'
    if (days === 1) return '1 day'
    if (days < 7) return `${days} days`
    if (days < 30) return `${Math.floor(days / 7)} weeks`
    return `${Math.floor(days / 30)} months`
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
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            onClick={() => onOpenChange(false)}
          />

          {/* Focus Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 flex flex-col"
          >
            <Card className="flex-1 flex flex-col overflow-hidden bg-elevated/98 backdrop-blur-xl border-border/50">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onOpenChange(false)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold">{lead.businessName}</h2>
                      {lead.leadScore && (
                        <Badge
                          variant={
                            lead.leadScore >= 80 ? 'hot' :
                            lead.leadScore >= 60 ? 'warm' : 'cold'
                          }
                        >
                          {lead.leadScore}/100
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {lead.city}, {lead.state}
                      {lead.category && (
                        <>
                          <span className="mx-1">·</span>
                          {lead.category}
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {currentIndex + 1} of {pipelineLeads.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={onPrevious}
                      className="h-8 w-8"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={onNext}
                      className="h-8 w-8"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <ScrollArea className="flex-1">
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Info */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Stage Selector */}
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">Stage</h3>
                      <div className="flex flex-wrap gap-2">
                        {stages.map((stage) => (
                          <Button
                            key={stage.id}
                            variant={lead.stage === stage.id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => onStageChange(stage.id)}
                            className={cn(
                              'gap-2',
                              lead.stage === stage.id && stage.color
                            )}
                          >
                            <div className={cn('w-2 h-2 rounded-full', stage.color)} />
                            {stage.title}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Deal Value & Health */}
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="p-4 bg-surface/50">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <DollarSign className="h-4 w-4" />
                          Deal Value
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-semibold tabular-nums">
                            {lead.dealValue
                              ? `$${lead.dealValue.toLocaleString()}`
                              : '—'
                            }
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={onSetValue}
                            className="text-xs"
                          >
                            Edit
                          </Button>
                        </div>
                      </Card>

                      <Card className="p-4 bg-surface/50">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Clock className="h-4 w-4" />
                          Time in Stage
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={cn('text-2xl font-semibold', getHealthColor(healthStatus))}>
                            {formatDaysInStage(daysInStage)}
                          </span>
                          {healthStatus === 'at_risk' && (
                            <Badge variant="destructive" className="gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              At Risk
                            </Badge>
                          )}
                          {healthStatus === 'aging' && (
                            <Badge variant="warning" className="gap-1">
                              Aging
                            </Badge>
                          )}
                        </div>
                        {threshold !== Infinity && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Threshold: {threshold} days
                          </p>
                        )}
                      </Card>
                    </div>

                    {/* Contact Info */}
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">Contact Information</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {lead.email && (
                          <a
                            href={`mailto:${lead.email}`}
                            className="flex items-center gap-3 p-3 rounded-lg bg-surface/50 hover:bg-surface transition-colors"
                          >
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm truncate">{lead.email}</span>
                            <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto" />
                          </a>
                        )}
                        {lead.phone && (
                          <a
                            href={`tel:${lead.phone}`}
                            className="flex items-center gap-3 p-3 rounded-lg bg-surface/50 hover:bg-surface transition-colors"
                          >
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{lead.phone}</span>
                            <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto" />
                          </a>
                        )}
                        {lead.website && (
                          <a
                            href={lead.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg bg-surface/50 hover:bg-surface transition-colors"
                          >
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm truncate">{lead.website}</span>
                            <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto" />
                          </a>
                        )}
                        {lead.instagram && (
                          <a
                            href={lead.instagram.startsWith('http') ? lead.instagram : `https://instagram.com/${lead.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg bg-surface/50 hover:bg-surface transition-colors"
                          >
                            <Instagram className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm truncate">{lead.instagram}</span>
                            <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto" />
                          </a>
                        )}
                        {lead.facebook && (
                          <a
                            href={lead.facebook.startsWith('http') ? lead.facebook : `https://facebook.com/${lead.facebook}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg bg-surface/50 hover:bg-surface transition-colors"
                          >
                            <Facebook className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm truncate">{lead.facebook}</span>
                            <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto" />
                          </a>
                        )}
                        {lead.linkedin && (
                          <a
                            href={lead.linkedin.startsWith('http') ? lead.linkedin : `https://linkedin.com/company/${lead.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg bg-surface/50 hover:bg-surface transition-colors"
                          >
                            <Linkedin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm truncate">{lead.linkedin}</span>
                            <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    {lead.notes && lead.notes.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                          <Button variant="ghost" size="sm" onClick={onAddNote}>
                            Add Note
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {lead.notes.map((note, index) => (
                            <Card key={index} className="p-3 bg-surface/50">
                              <p className="text-sm">{note}</p>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Quick Actions */}
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Actions</h3>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-2"
                          onClick={onContact}
                        >
                          <ArrowRight className="h-4 w-4" />
                          Track Contact
                          <kbd className="ml-auto px-1.5 py-0.5 rounded bg-surface text-2xs">C</kbd>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-2"
                          onClick={onAddNote}
                        >
                          <FileText className="h-4 w-4" />
                          Add Note
                          <kbd className="ml-auto px-1.5 py-0.5 rounded bg-surface text-2xs">N</kbd>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-2"
                          onClick={onAddTag}
                        >
                          <Tag className="h-4 w-4" />
                          Add Tag
                          <kbd className="ml-auto px-1.5 py-0.5 rounded bg-surface text-2xs">T</kbd>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-2"
                          onClick={onSetValue}
                        >
                          <DollarSign className="h-4 w-4" />
                          Set Value
                          <kbd className="ml-auto px-1.5 py-0.5 rounded bg-surface text-2xs">V</kbd>
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {/* Tags */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
                        <Button variant="ghost" size="sm" onClick={onAddTag}>
                          Add
                        </Button>
                      </div>
                      {lead.tags && lead.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {lead.tags.map((tag) => (
                            <Badge key={tag} variant="default">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No tags</p>
                      )}
                    </div>

                    <Separator />

                    {/* Reviews */}
                    {(lead.googleRating || lead.reviewCount) && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">Reviews</h3>
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 fill-warm text-warm" />
                          <span className="text-lg font-semibold">
                            {lead.googleRating?.toFixed(1) || '—'}
                          </span>
                          {lead.reviewCount && (
                            <span className="text-sm text-muted-foreground">
                              ({lead.reviewCount} reviews)
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <Separator />

                    {/* Activity Summary */}
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">Recent Activity</h3>
                      <div className="space-y-2">
                        {lead.activities?.slice(-5).reverse().map((activity) => (
                          <div key={activity.id} className="text-sm">
                            <p className="text-muted-foreground">
                              {activity.details}
                            </p>
                            <p className="text-xs text-muted-foreground/60">
                              {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Follow-up */}
                    {lead.nextFollowUpAt && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Next Follow-up</h3>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date(lead.nextFollowUpAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </ScrollArea>

              {/* Footer with keyboard hints */}
              <div className="flex items-center justify-center gap-6 px-6 py-3 border-t border-border/30 text-xs text-muted-foreground bg-surface/30">
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border/30">J</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border/30">K</kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border/30">N</kbd>
                  <span>Note</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border/30">T</kbd>
                  <span>Tag</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border/30">V</kbd>
                  <span>Value</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border/30">ESC</kbd>
                  <span>Close</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
