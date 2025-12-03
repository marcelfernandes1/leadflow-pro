import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import confetti from 'canvas-confetti'
import {
  Search,
  MapPin,
  Mail,
  Phone,
  Globe,
  Instagram,
  Facebook,
  Linkedin,
  Star,
  Plus,
  ExternalLink,
  Loader2,
  AlertCircle,
  Zap,
  TrendingUp,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { trpc } from '@/lib/trpc'
import { useLeadStore } from '@/hooks/useLeadStore'
import {
  calculateLeadScore,
  generateMockEnrichmentData,
  getLeadCategory,
  calculateOpportunityValue,
  type ScoringResult,
} from '@/lib/leadScoring'
import { IntelligenceReportModal } from '@/components/IntelligenceReportModal'
import type { Lead } from '@/types'

const searchSchema = z.object({
  category: z.string().min(1, 'Please enter a business category'),
  location: z.string().min(1, 'Please enter a location'),
  minRating: z.string().optional(),
})

type SearchFormData = z.infer<typeof searchSchema>

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  }),
}

export default function LeadDiscovery() {
  const [searchProgress, setSearchProgress] = useState(0)
  const [searchStatus, setSearchStatus] = useState('')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [proEnabled, setProEnabled] = useState(false)
  const [isEnriching, setIsEnriching] = useState(false)
  const [enrichProgress, setEnrichProgress] = useState(0)
  const [leadScores, setLeadScores] = useState<Map<string, ScoringResult>>(new Map())
  const [showReport, setShowReport] = useState(false)
  const [reportLead, setReportLead] = useState<Lead | null>(null)

  const { discoveredLeads, setDiscoveredLeads, addToPipeline, setLastSearch } =
    useLeadStore()

  // Enrich leads with Pro Intelligence scoring
  const enrichLeads = async (leads: Lead[]) => {
    setIsEnriching(true)
    setEnrichProgress(0)
    const newScores = new Map<string, ScoringResult>()

    for (let i = 0; i < leads.length; i++) {
      const lead = leads[i]
      // Simulate API call delay
      await new Promise((r) => setTimeout(r, 50))

      // Generate mock enrichment data and calculate score
      const enrichmentData = generateMockEnrichmentData(lead)
      const scoringResult = calculateLeadScore(lead, enrichmentData)
      newScores.set(lead.id, scoringResult)

      setEnrichProgress(Math.round(((i + 1) / leads.length) * 100))
    }

    setLeadScores(newScores)
    setIsEnriching(false)
    toast.success('Pro Intelligence analysis complete!', {
      description: `Analyzed ${leads.length} leads`,
    })
  }

  const searchMutation = trpc.leads.search.useMutation({
    onSuccess: (data) => {
      const leads = data.leads as Lead[]
      setDiscoveredLeads(leads)
      setSearchProgress(100)

      // Confetti celebration!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#f59e0b'],
      })

      toast.success(`🎉 Found ${data.count} leads!`, {
        description: data.cached
          ? 'Results served from cache'
          : 'Fresh results from Google Maps',
      })

      // Auto-enrich if Pro is enabled
      if (proEnabled && leads.length > 0) {
        enrichLeads(leads)
      }
    },
    onError: (error) => {
      toast.error('Search failed', {
        description: error.message,
      })
      setSearchProgress(0)
      setSearchStatus('')
    },
  })

  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      category: '',
      location: '',
      minRating: '',
    },
  })

  const simulateProgress = async () => {
    const statuses = [
      'Searching Google Maps...',
      'Analyzing businesses...',
      'Extracting contact information...',
      'Validating data...',
    ]

    for (let i = 0; i < statuses.length; i++) {
      setSearchStatus(statuses[i])
      setSearchProgress((i + 1) * 20)
      await new Promise((r) => setTimeout(r, 600))
    }
  }

  const onSubmit = async (data: SearchFormData) => {
    setSearchProgress(0)
    setDiscoveredLeads([])
    setLastSearch({ category: data.category, location: data.location })

    // Start progress simulation
    simulateProgress()

    // Call real API
    searchMutation.mutate({
      category: data.category,
      location: data.location,
      minRating: data.minRating ? parseFloat(data.minRating) : undefined,
      maxResults: 50,
    })
  }

  const handleAddToPipeline = (lead: Lead) => {
    addToPipeline(lead)
    toast.success(`✅ Added ${lead.businessName} to pipeline`)
    setSelectedLead(null)
  }

  const isSearching = searchMutation.isPending

  // Sort leads by score when Pro is enabled
  const sortedLeads = useMemo(() => {
    if (!proEnabled || leadScores.size === 0) {
      return discoveredLeads
    }
    return [...discoveredLeads].sort((a, b) => {
      const scoreA = leadScores.get(a.id)?.totalScore ?? 0
      const scoreB = leadScores.get(b.id)?.totalScore ?? 0
      return scoreB - scoreA
    })
  }, [discoveredLeads, leadScores, proEnabled])

  // Get score badge color based on category
  const getScoreBadgeVariant = (score: number): 'hot' | 'default' | 'secondary' | 'outline' => {
    const category = getLeadCategory(score)
    switch (category) {
      case 'hot':
        return 'hot'
      case 'warm':
        return 'default'
      case 'cold':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Discover Leads</h1>
        <p className="text-muted-foreground mt-1">
          Find high-intent businesses ready to buy your services
        </p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search for Businesses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="category">Business Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., plumbers, restaurants, dentists"
                  {...form.register('category')}
                />
                {form.formState.errors.category && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.category.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="e.g., Miami, FL"
                    className="pl-9"
                    {...form.register('location')}
                  />
                </div>
                {form.formState.errors.location && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.location.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="minRating">Minimum Rating</Label>
                <Select
                  onValueChange={(value) => form.setValue('minRating', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any rating</SelectItem>
                    <SelectItem value="3">3+ stars</SelectItem>
                    <SelectItem value="4">4+ stars</SelectItem>
                    <SelectItem value="4.5">4.5+ stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Pro Intelligence Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="pro-toggle" className="font-semibold cursor-pointer">
                      Pro Intelligence
                    </Label>
                    <Badge variant="default" className="text-[10px] px-1.5 py-0">
                      PRO
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Score leads, find tech gaps & get AI insights
                  </p>
                </div>
              </div>
              <Switch
                id="pro-toggle"
                checked={proEnabled}
                onCheckedChange={setProEnabled}
              />
            </div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                type="submit"
                className="w-full md:w-auto"
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Find Leads
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>

      {/* Search Progress */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{searchStatus}</span>
                    <span className="font-medium">{searchProgress}%</span>
                  </div>
                  <Progress value={searchProgress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enrichment Progress */}
      <AnimatePresence>
        {isEnriching && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                      <span className="text-primary font-medium">
                        Analyzing leads with Pro Intelligence...
                      </span>
                    </div>
                    <span className="font-medium">{enrichProgress}%</span>
                  </div>
                  <Progress value={enrichProgress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {searchMutation.isError && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">Search failed</p>
                <p className="text-sm opacity-80">
                  {searchMutation.error.message}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {sortedLeads.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Found {sortedLeads.length} leads
              {proEnabled && leadScores.size > 0 && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  (sorted by score)
                </span>
              )}
            </h2>
            {proEnabled && !isEnriching && discoveredLeads.length > 0 && leadScores.size === 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => enrichLeads(discoveredLeads)}
                className="gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Analyze Leads
              </Button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedLeads.map((lead, index) => {
              const scoringResult = leadScores.get(lead.id)
              const opportunityValue = scoringResult
                ? calculateOpportunityValue(scoringResult.opportunities)
                : null
              return (
                <motion.div
                  key={lead.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  whileHover={{ y: -4 }}
                  className="cursor-pointer"
                  onClick={() => setSelectedLead(lead)}
                >
                  <Card className={`h-full hover:shadow-lg transition-shadow ${
                    scoringResult && getLeadCategory(scoringResult.totalScore) === 'hot'
                      ? 'ring-2 ring-orange-500/30'
                      : ''
                  }`}>
                    <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base line-clamp-1">
                        {lead.businessName}
                      </CardTitle>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {scoringResult && (
                          <Badge
                            variant={getScoreBadgeVariant(scoringResult.totalScore) as "default" | "secondary" | "destructive" | "outline"}
                            className={`text-xs ${
                              getLeadCategory(scoringResult.totalScore) === 'hot'
                                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-0'
                                : getLeadCategory(scoringResult.totalScore) === 'warm'
                                ? 'bg-amber-500 text-white border-0'
                                : ''
                            }`}
                          >
                            <Zap className="h-3 w-3 mr-0.5" />
                            {scoringResult.totalScore}
                          </Badge>
                        )}
                        <Badge variant="secondary" className="shrink-0">
                          {lead.category}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {lead.city}, {lead.state}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Pro Intelligence Insights */}
                    {scoringResult && opportunityValue && (
                      <div className="flex items-center gap-2 p-2 rounded-md bg-primary/5 border border-primary/10">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-primary">
                            ${opportunityValue.monthly}/mo opportunity
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {scoringResult.opportunities.length} gap{scoringResult.opportunities.length !== 1 ? 's' : ''} found
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Rating */}
                    {lead.googleRating && (
                      <div className="flex items-center gap-1.5">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">
                          {lead.googleRating.toFixed(1)}
                        </span>
                        {lead.reviewCount && (
                          <span className="text-sm text-muted-foreground">
                            ({lead.reviewCount} reviews)
                          </span>
                        )}
                      </div>
                    )}

                    {/* Quick actions */}
                    <div className="flex items-center gap-2">
                      {lead.email && (
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(`mailto:${lead.email}`)
                          }}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      )}
                      {lead.phone && (
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(`tel:${lead.phone}`)
                          }}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      )}
                      {lead.website && (
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(lead.website, '_blank')
                          }}
                        >
                          <Globe className="h-4 w-4" />
                        </Button>
                      )}
                      {lead.instagram && (
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(
                              `https://instagram.com/${lead.instagram?.replace('@', '') ?? ''}`,
                              '_blank'
                            )
                          }}
                        >
                          <Instagram className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* Loading Skeletons */}
      {isSearching && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-1/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Lead Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-lg">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {selectedLead.businessName}
                </DialogTitle>
                <DialogDescription>
                  <Badge variant="secondary">{selectedLead.category}</Badge>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedLead.address && `${selectedLead.address}, `}
                      {selectedLead.city}, {selectedLead.state}
                      {selectedLead.zip && ` ${selectedLead.zip}`}
                    </p>
                  </div>
                </div>

                {/* Contact Info */}
                {selectedLead.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <a
                        href={`tel:${selectedLead.phone}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {selectedLead.phone}
                      </a>
                    </div>
                  </div>
                )}

                {selectedLead.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a
                        href={`mailto:${selectedLead.email}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {selectedLead.email}
                      </a>
                    </div>
                  </div>
                )}

                {selectedLead.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Website</p>
                      <a
                        href={selectedLead.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        {selectedLead.website}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Social Media */}
                {selectedLead.instagram && (
                  <div className="flex items-start gap-3">
                    <Instagram className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Instagram</p>
                      <a
                        href={`https://instagram.com/${selectedLead.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        {selectedLead.instagram}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}

                {selectedLead.facebook && (
                  <div className="flex items-start gap-3">
                    <Facebook className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Facebook</p>
                      <a
                        href={selectedLead.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        View Profile
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}

                {selectedLead.linkedin && (
                  <div className="flex items-start gap-3">
                    <Linkedin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">LinkedIn</p>
                      <a
                        href={selectedLead.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        View Profile
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Rating */}
                {selectedLead.googleRating && (
                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-amber-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Google Rating</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedLead.googleRating.toFixed(1)} stars
                        {selectedLead.reviewCount &&
                          ` (${selectedLead.reviewCount} reviews)`}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                {proEnabled && leadScores.has(selectedLead.id) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setReportLead(selectedLead)
                      setShowReport(true)
                      setSelectedLead(null)
                    }}
                    className="gap-2"
                  >
                    <Zap className="h-4 w-4" />
                    View Report
                  </Button>
                )}
                <Button
                  className="flex-1"
                  onClick={() => handleAddToPipeline(selectedLead)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Pipeline
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Intelligence Report Modal */}
      <IntelligenceReportModal
        lead={reportLead}
        scoringResult={reportLead ? leadScores.get(reportLead.id) || null : null}
        open={showReport}
        onOpenChange={(open) => {
          setShowReport(open)
          if (!open) setReportLead(null)
        }}
        onAddToPipeline={handleAddToPipeline}
      />
    </div>
  )
}
