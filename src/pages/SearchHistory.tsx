import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import {
  History,
  Search,
  MapPin,
  Star,
  Trash2,
  MoreHorizontal,
  ChevronRight,
  Building2,
  Clock,
  Phone,
  Mail,
  Globe,
  Plus,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import {
  useLeadStore,
  type SearchHistoryEntry,
} from '@/hooks/useLeadStore'
import { LeadDetailModal } from '@/components/LeadDetailModal'
import type { Lead, ContactMethod } from '@/types'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const },
  },
}

export default function SearchHistory() {
  const {
    searchHistory: rawSearchHistory,
    removeSearchFromHistory,
    clearSearchHistory,
    addToPipeline,
    pipelineLeads,
    saveLead,
    unsaveLead,
    isLeadSaved,
  } = useLeadStore()

  // Filter out old entries that don't have leads array (from old format)
  const searchHistory = rawSearchHistory.filter((s) => Array.isArray(s.leads))

  const [selectedSearch, setSelectedSearch] = useState<SearchHistoryEntry | null>(null)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const isInPipeline = (leadId: string) =>
    pipelineLeads.some((l) => l.id === leadId)

  const handleAddToPipeline = (lead: Lead) => {
    if (isInPipeline(lead.id)) {
      toast.info('Lead is already in pipeline')
      return
    }
    addToPipeline(lead)
    toast.success('Added to pipeline')
  }

  const handleToggleSave = (lead: Lead, e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (isLeadSaved(lead.id)) {
      unsaveLead(lead.id)
      toast.success('Lead removed from saved')
    } else {
      saveLead(lead, selectedSearch ? { category: selectedSearch.category, location: selectedSearch.location } : undefined)
      toast.success('Lead saved')
    }
  }

  const handleRemoveSearch = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    removeSearchFromHistory(id)
    if (selectedSearch?.id === id) {
      setSelectedSearch(null)
    }
    toast.success('Search removed from history')
  }

  // Group searches by date
  const groupedSearches = searchHistory.reduce(
    (groups, search) => {
      const date = new Date(search.searchedAt)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      let key: string
      if (date.toDateString() === today.toDateString()) {
        key = 'Today'
      } else if (date.toDateString() === yesterday.toDateString()) {
        key = 'Yesterday'
      } else {
        key = date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
        })
      }

      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(search)
      return groups
    },
    {} as Record<string, SearchHistoryEntry[]>
  )

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {selectedSearch && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedSearch(null)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-semibold tracking-tight">
                  {selectedSearch
                    ? `${selectedSearch.category} in ${selectedSearch.location}`
                    : 'Search History'}
                </h1>
                <Badge variant="secondary" className="text-sm">
                  {selectedSearch
                    ? `${selectedSearch.leads.length} leads`
                    : `${searchHistory.length} searches`}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1 text-lg">
                {selectedSearch
                  ? `Searched ${formatDistanceToNow(new Date(selectedSearch.searchedAt), { addSuffix: true })}`
                  : 'All your previous searches with their leads'}
              </p>
            </div>
          </div>
          {!selectedSearch && searchHistory.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    if (
                      confirm(
                        'Are you sure you want to clear all search history? This will delete all saved leads from searches.'
                      )
                    ) {
                      clearSearchHistory()
                      toast.success('Search history cleared')
                    }
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All History
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {selectedSearch ? (
          /* Leads View */
          <motion.div
            key="leads"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {selectedSearch.leads.length === 0 ? (
              <Card className="p-8">
                <div className="text-center">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No leads in this search</h3>
                  <p className="text-sm text-muted-foreground">
                    This search didn't return any results
                  </p>
                </div>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {selectedSearch.leads.map((lead, index) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Card
                      variant="interactive"
                      className="h-full"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold truncate">
                                {lead.businessName}
                              </h3>
                              <p className="text-sm text-muted-foreground truncate">
                                {lead.category}
                              </p>
                            </div>
                            {lead.googleRating && (
                              <div className="flex items-center gap-1 text-sm">
                                <Star className="h-4 w-4 fill-warm text-warm" />
                                <span className="font-medium">
                                  {lead.googleRating.toFixed(1)}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="truncate">
                              {lead.city}, {lead.state}
                            </span>
                          </div>

                          {/* Contact Info */}
                          <div className="flex items-center gap-3">
                            {lead.phone && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Phone className="h-3 w-3" />
                              </div>
                            )}
                            {lead.email && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Mail className="h-3 w-3" />
                              </div>
                            )}
                            {lead.website && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Globe className="h-3 w-3" />
                              </div>
                            )}
                            {isInPipeline(lead.id) && (
                              <Badge variant="cold" className="text-2xs ml-auto">
                                In Pipeline
                              </Badge>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAddToPipeline(lead)
                              }}
                              disabled={isInPipeline(lead.id)}
                            >
                              <Plus className="h-3.5 w-3.5 mr-1" />
                              {isInPipeline(lead.id) ? 'In Pipeline' : 'Add'}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => handleToggleSave(lead, e)}
                              className={isLeadSaved(lead.id) ? 'text-primary' : 'text-muted-foreground'}
                            >
                              {isLeadSaved(lead.id) ? (
                                <BookmarkCheck className="h-4 w-4" />
                              ) : (
                                <Bookmark className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : searchHistory.length === 0 ? (
          /* Empty State */
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="p-12">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <History className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No search history</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Every search you make is automatically saved here with all the
                  leads found. Start discovering leads to build your history.
                </p>
                <Button onClick={() => (window.location.href = '/discover')}>
                  <Search className="h-4 w-4 mr-2" />
                  Discover Leads
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          /* Search List View */
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {Object.entries(groupedSearches).map(([date, searches]) => (
              <motion.div key={date} variants={itemVariants} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-sm font-medium text-muted-foreground">
                    {date}
                  </h2>
                </div>

                <div className="space-y-2">
                  {searches.map((search) => (
                    <motion.div key={search.id} variants={itemVariants}>
                      <Card
                        variant="interactive"
                        className="cursor-pointer"
                        onClick={() => setSelectedSearch(search)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className="p-2.5 rounded-xl bg-primary/10">
                                <Search className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-semibold">
                                    {search.category}
                                  </span>
                                  <span className="text-muted-foreground">in</span>
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <MapPin className="h-3.5 w-3.5" />
                                    <span>{search.location}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 mt-1">
                                  <span className="text-sm text-muted-foreground">
                                    {formatDistanceToNow(new Date(search.searchedAt), {
                                      addSuffix: true,
                                    })}
                                  </span>
                                  {search.minRating && (
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                      <Star className="h-3 w-3 fill-warm text-warm" />
                                      <span>{search.minRating}+</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <div className="flex items-center gap-1.5 text-lg font-semibold">
                                  <Building2 className="h-4 w-4 text-primary" />
                                  <span>{search.leads.length}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  leads
                                </p>
                              </div>

                              <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={(e) => handleRemoveSearch(search.id, e)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>

                              <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lead Detail Modal */}
      <LeadDetailModal
        open={!!selectedLead}
        onOpenChange={(open) => !open && setSelectedLead(null)}
        lead={selectedLead}
        onContact={(method: ContactMethod) => {
          toast.info(`Contact via ${method}`)
        }}
        onAddNote={() => {
          toast.info('Add to pipeline first to add notes')
        }}
        onAddTag={() => {
          toast.info('Add to pipeline first to add tags')
        }}
        onRemoveTag={() => {}}
        onScheduleFollowUp={() => {
          toast.info('Add to pipeline first to schedule follow-ups')
        }}
      />
    </motion.div>
  )
}
