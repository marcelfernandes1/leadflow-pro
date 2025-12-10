import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import {
  Bookmark,
  BookmarkX,
  Search,
  Filter,
  MapPin,
  Star,
  Phone,
  Mail,
  Globe,
  Plus,
  Trash2,
  MoreHorizontal,
  ArrowUpDown,
  Calendar,
  Building2,
  CheckCircle2,
  X,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  Sparkles,
  Loader2,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { useLeadStore, type SavedLead } from '@/hooks/useLeadStore'
import { useLeadAnalysis } from '@/hooks/useLeadAnalysis'
import { LeadDetailModal } from '@/components/LeadDetailModal'
import { Progress } from '@/components/ui/progress'
import type { ContactMethod, Lead } from '@/types'
import type { ScoringResult } from '@/lib/leadScoring'

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

type SortOption = 'newest' | 'oldest' | 'name' | 'rating'

export default function SavedLeads() {
  const {
    savedLeads,
    unsaveLead,
    clearSavedLeads,
    addToPipeline,
    pipelineLeads,
  } = useLeadStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [locationFilter, setLocationFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [selectedLead, setSelectedLead] = useState<SavedLead | null>(null)
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set())

  // Lead analysis hook
  const {
    isAnalyzing,
    progress: analysisProgress,
    currentLeadId,
    analyzeLead,
    analyzeLeads,
    getAnalysis,
  } = useLeadAnalysis()

  // Get unique categories and locations for filters
  const categories = useMemo(() => {
    const cats = new Set(savedLeads.map((l) => l.category).filter(Boolean))
    return Array.from(cats).sort()
  }, [savedLeads])

  const locations = useMemo(() => {
    const locs = new Set(
      savedLeads
        .map((l) => l.searchQuery?.location || `${l.city}, ${l.state}`)
        .filter(Boolean)
    )
    return Array.from(locs).sort()
  }, [savedLeads])

  // Filter and sort leads
  const filteredLeads = useMemo(() => {
    let result = [...savedLeads]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (lead) =>
          lead.businessName.toLowerCase().includes(query) ||
          lead.category?.toLowerCase().includes(query) ||
          lead.city?.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter((lead) => lead.category === categoryFilter)
    }

    // Location filter
    if (locationFilter !== 'all') {
      result = result.filter(
        (lead) =>
          lead.searchQuery?.location === locationFilter ||
          `${lead.city}, ${lead.state}` === locationFilter
      )
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort(
          (a, b) =>
            new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
        )
        break
      case 'oldest':
        result.sort(
          (a, b) =>
            new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime()
        )
        break
      case 'name':
        result.sort((a, b) => a.businessName.localeCompare(b.businessName))
        break
      case 'rating':
        result.sort((a, b) => (b.googleRating || 0) - (a.googleRating || 0))
        break
    }

    return result
  }, [savedLeads, searchQuery, categoryFilter, locationFilter, sortBy])

  const isInPipeline = (leadId: string) =>
    pipelineLeads.some((l) => l.id === leadId)

  const handleAddToPipeline = (lead: SavedLead) => {
    if (isInPipeline(lead.id)) {
      toast.info('Lead is already in pipeline')
      return
    }
    addToPipeline(lead)
    toast.success('Added to pipeline')
  }

  const handleUnsave = (leadId: string) => {
    unsaveLead(leadId)
    toast.success('Lead removed from saved')
  }

  const handleBulkAddToPipeline = () => {
    let added = 0
    selectedLeads.forEach((leadId) => {
      const lead = savedLeads.find((l) => l.id === leadId)
      if (lead && !isInPipeline(lead.id)) {
        addToPipeline(lead)
        added++
      }
    })
    setSelectedLeads(new Set())
    toast.success(`Added ${added} leads to pipeline`)
  }

  const handleBulkUnsave = () => {
    selectedLeads.forEach((leadId) => unsaveLead(leadId))
    setSelectedLeads(new Set())
    toast.success('Removed selected leads')
  }

  const toggleLeadSelection = (leadId: string) => {
    const newSelection = new Set(selectedLeads)
    if (newSelection.has(leadId)) {
      newSelection.delete(leadId)
    } else {
      newSelection.add(leadId)
    }
    setSelectedLeads(newSelection)
  }

  const toggleSelectAll = () => {
    if (selectedLeads.size === filteredLeads.length) {
      setSelectedLeads(new Set())
    } else {
      setSelectedLeads(new Set(filteredLeads.map((l) => l.id)))
    }
  }

  // Handle bulk analysis of selected leads
  const handleBulkAnalyze = async () => {
    if (selectedLeads.size === 0) return
    const leadsToAnalyze = savedLeads
      .filter((l) => selectedLeads.has(l.id))
      .map((l) => l as Lead)
    await analyzeLeads(leadsToAnalyze)
  }

  // Handle single lead analysis (for modal)
  const handleAnalyzeLead = async (lead: Lead): Promise<ScoringResult | null> => {
    return await analyzeLead(lead)
  }

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
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-semibold tracking-tight">
                Saved Leads
              </h1>
              <Badge variant="secondary" className="text-sm">
                {savedLeads.length}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1 text-lg">
              Your saved leads from previous searches
            </p>
          </div>
          {savedLeads.length > 0 && (
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
                        'Are you sure you want to clear all saved leads?'
                      )
                    ) {
                      clearSavedLeads()
                      toast.success('All saved leads cleared')
                    }
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Saved Leads
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </motion.div>

      {savedLeads.length === 0 ? (
        <motion.div variants={itemVariants}>
          <Card className="p-12">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Bookmark className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No saved leads yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                When you discover leads, click the bookmark icon to save them
                here for later. Saved leads persist across sessions.
              </p>
              <Button onClick={() => (window.location.href = '/discover')}>
                <Search className="h-4 w-4 mr-2" />
                Discover Leads
              </Button>
            </div>
          </Card>
        </motion.div>
      ) : (
        <>
          {/* Filters */}
          <motion.div variants={itemVariants}>
            <Card className="p-4">
              <div className="flex flex-wrap gap-4">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search saved leads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {/* Category Filter */}
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Location Filter */}
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="w-[180px]">
                    <MapPin className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select
                  value={sortBy}
                  onValueChange={(v) => setSortBy(v as SortOption)}
                >
                  <SelectTrigger className="w-[150px]">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </motion.div>

          {/* Bulk Actions */}
          <AnimatePresence>
            {selectedLeads.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card className="p-3 bg-primary/5 border-primary/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLeads(new Set())}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium">
                        {selectedLeads.size} selected
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleBulkAddToPipeline}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add to Pipeline
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleBulkAnalyze}
                        disabled={isAnalyzing}
                        className="gap-1 bg-primary/5 border-primary/20 hover:bg-primary/10"
                      >
                        <Sparkles className="h-4 w-4 text-primary" />
                        Analyze
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleBulkUnsave}
                        className="text-destructive hover:text-destructive"
                      >
                        <BookmarkX className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                  {/* Analysis Progress */}
                  {isAnalyzing && (
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Analyzing leads...
                        </span>
                        <span>{analysisProgress}%</span>
                      </div>
                      <Progress value={analysisProgress} className="h-1.5" />
                    </div>
                  )}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Count & Select All */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between"
          >
            <p className="text-sm text-muted-foreground">
              Showing {filteredLeads.length} of {savedLeads.length} leads
            </p>
            <Button variant="ghost" size="sm" onClick={toggleSelectAll}>
              {selectedLeads.size === filteredLeads.length
                ? 'Deselect All'
                : 'Select All'}
            </Button>
          </motion.div>

          {/* Lead Grid */}
          <motion.div
            variants={containerVariants}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredLeads.map((lead) => (
              <motion.div key={lead.id} variants={itemVariants}>
                <Card
                  variant="interactive"
                  className={`relative ${
                    selectedLeads.has(lead.id)
                      ? 'ring-2 ring-primary border-primary/50'
                      : ''
                  }`}
                >
                  {/* Selection Checkbox */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleLeadSelection(lead.id)
                    }}
                    className={`absolute top-3 left-3 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      selectedLeads.has(lead.id)
                        ? 'bg-primary border-primary text-white'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {selectedLeads.has(lead.id) && (
                      <CheckCircle2 className="h-3 w-3" />
                    )}
                  </button>

                  <CardContent
                    className="p-4 pl-10 cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  >
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
                      <div className="flex items-center gap-2 flex-wrap">
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
                        {lead.instagram && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Instagram className="h-3 w-3" />
                          </div>
                        )}
                        {lead.facebook && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Facebook className="h-3 w-3" />
                          </div>
                        )}
                        {lead.linkedin && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Linkedin className="h-3 w-3" />
                          </div>
                        )}
                        {lead.twitter && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Twitter className="h-3 w-3" />
                          </div>
                        )}
                        {lead.tiktok && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <TikTokIcon className="h-3 w-3" />
                          </div>
                        )}
                        {lead.youtube && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Youtube className="h-3 w-3" />
                          </div>
                        )}
                      </div>

                      {/* Meta */}
                      <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Saved{' '}
                            {formatDistanceToNow(new Date(lead.savedAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        {isInPipeline(lead.id) && (
                          <Badge variant="cold" className="text-2xs">
                            In Pipeline
                          </Badge>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2">
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
                          {isInPipeline(lead.id) ? 'In Pipeline' : 'Add to Pipeline'}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleUnsave(lead.id)
                          }}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <BookmarkX className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredLeads.length === 0 && (
            <motion.div variants={itemVariants}>
              <Card className="p-8">
                <div className="text-center">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No leads match your filters</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              </Card>
            </motion.div>
          )}
        </>
      )}

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
        // Pro Intelligence analysis props
        onAnalyze={handleAnalyzeLead}
        isAnalyzing={isAnalyzing && currentLeadId === selectedLead?.id}
        analysisProgress={analysisProgress}
        scoringResult={selectedLead ? getAnalysis(selectedLead.id) : undefined}
      />
    </motion.div>
  )
}
