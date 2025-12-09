import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Search,
  Target,
  Briefcase,
  Building2,
  MapPin,
  ExternalLink,
  Loader2,
  Zap,
  TrendingUp,
  Sparkles,
  Clock,
  DollarSign,
  Linkedin,
  Crown,
  Lock,
} from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { trpc } from '@/lib/trpc'
import { useSubscription } from '@/hooks/useSubscription'
import { ProUpgradeModal } from '@/components/ProUpgradeModal'
import { SignInButton, useUser } from '@clerk/clerk-react'

const searchSchema = z.object({
  state: z.string().min(1, 'Please select a state'),
  industry: z.string().min(1, 'Please enter an industry'),
  serviceType: z.string().min(1, 'Please select a service type'),
})

type SearchFormData = z.infer<typeof searchSchema>

interface HighIntentBusiness {
  id: string
  companyName: string
  jobTitle: string
  jobDescription?: string
  location: string
  source: 'Indeed' | 'Upwork' | 'LinkedIn'
  postedDate: string
  jobUrl?: string
  budget?: string
  skills?: string[]
  intentSignal: string
  companyWebsite?: string
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.04,
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  }),
}

const sourceColors: Record<string, string> = {
  Indeed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Upwork: 'bg-green-500/10 text-green-400 border-green-500/20',
  LinkedIn: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
}

const sourceIcons: Record<string, React.ReactNode> = {
  Indeed: <Briefcase className="w-3 h-3" />,
  Upwork: <DollarSign className="w-3 h-3" />,
  LinkedIn: <Linkedin className="w-3 h-3" />,
}

export default function HighIntentSearch() {
  const [results, setResults] = useState<HighIntentBusiness[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchStats, setSearchStats] = useState<{
    indeed: number
    upwork: number
    linkedin: number
  } | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const { isSignedIn } = useUser()
  const { isPro } = useSubscription()

  // Get service types and states from API
  const { data: serviceTypes = [] } = trpc.leads.getHighIntentServiceTypes.useQuery()
  const { data: states = [] } = trpc.leads.getHighIntentStates.useQuery()

  const searchMutation = trpc.leads.searchHighIntent.useMutation()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      state: '',
      industry: '',
      serviceType: '',
    },
  })

  const selectedState = watch('state')
  const selectedService = watch('serviceType')

  const onSubmit = async (data: SearchFormData) => {
    // Check if user is signed in
    if (!isSignedIn) {
      toast.error('Please sign in to use High-Intent Search')
      return
    }

    // Check if user has Pro subscription
    if (!isPro) {
      setShowUpgradeModal(true)
      return
    }

    setIsSearching(true)
    setResults([])
    setSearchStats(null)

    try {
      const result = await searchMutation.mutateAsync({
        state: data.state,
        industry: data.industry,
        serviceType: data.serviceType,
        maxResultsPerSource: 15,
      })

      if (result.success && 'businesses' in result) {
        setResults(result.businesses)
        setSearchStats(result.sources)
        toast.success(`Found ${result.businesses.length} high-intent businesses!`)
      } else {
        toast.error('Search failed')
      }
    } catch (error: any) {
      console.error('High-intent search error:', error)
      toast.error(error.message || 'Failed to search for businesses')
    } finally {
      setIsSearching(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">High-Intent Business Search</h1>
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          </div>
          <p className="text-zinc-400 mt-1">
            Find businesses actively hiring for services - highest probability to close
          </p>
        </div>
      </div>

      {/* Search Form */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-400" />
            Search Parameters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* State Selection */}
              <div className="space-y-2">
                <Label htmlFor="state" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                  State
                </Label>
                <Select
                  value={selectedState}
                  onValueChange={(value) => setValue('state', value)}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700 max-h-[300px]">
                    {states.map((state) => (
                      <SelectItem key={state.code} value={state.name}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.state && (
                  <p className="text-red-400 text-sm">{errors.state.message}</p>
                )}
              </div>

              {/* Industry Input */}
              <div className="space-y-2">
                <Label htmlFor="industry" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-zinc-400" />
                  Industry
                </Label>
                <Input
                  {...register('industry')}
                  placeholder="e.g., Restaurant, HVAC, Dental"
                  className="bg-zinc-800 border-zinc-700"
                />
                {errors.industry && (
                  <p className="text-red-400 text-sm">{errors.industry.message}</p>
                )}
              </div>

              {/* Service Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="serviceType" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-zinc-400" />
                  Looking For
                </Label>
                <Select
                  value={selectedService}
                  onValueChange={(value) => setValue('serviceType', value)}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {serviceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.serviceType && (
                  <p className="text-red-400 text-sm">{errors.serviceType.message}</p>
                )}
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-center gap-4">
              {!isSignedIn ? (
                <SignInButton mode="modal">
                  <Button
                    type="button"
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Sign In to Search
                  </Button>
                </SignInButton>
              ) : !isPro ? (
                <Button
                  type="button"
                  onClick={() => setShowUpgradeModal(true)}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSearching}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Find High-Intent Businesses
                    </>
                  )}
                </Button>
              )}

              {isPro && (
                <div className="text-sm text-zinc-500">
                  <Zap className="w-4 h-4 inline mr-1 text-amber-400" />
                  Uses 3 credits per search
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Search Stats */}
      {searchStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <TrendingUp className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{results.length}</p>
                <p className="text-xs text-zinc-500">Total Found</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Briefcase className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{searchStats.indeed}</p>
                <p className="text-xs text-zinc-500">From Indeed</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{searchStats.upwork}</p>
                <p className="text-xs text-zinc-500">From Upwork</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sky-500/10">
                <Linkedin className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{searchStats.linkedin}</p>
                <p className="text-xs text-zinc-500">From LinkedIn</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading State */}
      {isSearching && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-orange-500/20 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-orange-500 rounded-full animate-spin" />
          </div>
          <p className="text-zinc-400">Searching Indeed, Upwork, and LinkedIn...</p>
          <p className="text-sm text-zinc-500">This may take 30-60 seconds</p>
        </div>
      )}

      {/* Results Grid */}
      {results.length > 0 && !isSearching && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              High-Intent Businesses
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {results.map((business, index) => (
                <motion.div
                  key={business.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  layout
                >
                  <Card className="bg-zinc-900/50 border-zinc-800 hover:border-orange-500/50 transition-all group h-full">
                    <CardContent className="p-4 space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white truncate group-hover:text-orange-400 transition-colors">
                            {business.companyName}
                          </h3>
                          <p className="text-sm text-zinc-400 truncate">
                            {business.jobTitle}
                          </p>
                        </div>
                        <Badge className={`${sourceColors[business.source]} border shrink-0 ml-2`}>
                          {sourceIcons[business.source]}
                          <span className="ml-1">{business.source}</span>
                        </Badge>
                      </div>

                      {/* Location & Date */}
                      <div className="flex items-center gap-3 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {business.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(business.postedDate)}
                        </span>
                      </div>

                      {/* Intent Signal */}
                      <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                        <p className="text-xs text-orange-300 flex items-start gap-2">
                          <Target className="w-3 h-3 mt-0.5 shrink-0" />
                          <span>{business.intentSignal}</span>
                        </p>
                      </div>

                      {/* Budget (Upwork) */}
                      {business.budget && (
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-green-400" />
                          <span className="text-zinc-300">Budget: {business.budget}</span>
                        </div>
                      )}

                      {/* Skills (Upwork) */}
                      {business.skills && business.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {business.skills.slice(0, 4).map((skill, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-xs border-zinc-700 text-zinc-400"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {business.skills.length > 4 && (
                            <Badge
                              variant="outline"
                              className="text-xs border-zinc-700 text-zinc-500"
                            >
                              +{business.skills.length - 4}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
                        {business.jobUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-zinc-700 hover:bg-zinc-800"
                            onClick={() => window.open(business.jobUrl, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View Job
                          </Button>
                        )}
                        {business.companyWebsite && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-zinc-700 hover:bg-zinc-800"
                            onClick={() => window.open(business.companyWebsite, '_blank')}
                          >
                            <Building2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isSearching && results.length === 0 && (
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="py-12 text-center">
            <Target className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              Find High-Intent Businesses
            </h3>
            <p className="text-zinc-400 max-w-md mx-auto mb-6">
              Search for businesses actively looking to hire for marketing, web design, AI, CRM,
              and more. These leads have the highest probability to close.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-zinc-500">
              <span className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                Indeed Jobs
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                Upwork Projects
              </span>
              <span className="flex items-center gap-1">
                <Linkedin className="w-4 h-4" />
                LinkedIn Hiring
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pro Upgrade Modal */}
      <ProUpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
      />
    </div>
  )
}
