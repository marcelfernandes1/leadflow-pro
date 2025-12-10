import { useState, useRef } from 'react'
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

// Comprehensive business categories for industry autocomplete
const BUSINESS_CATEGORIES = [
  'ATMs', 'Abogado', 'Accountants', 'Acupuncture', 'Addiction Treatment Center', 'Adoption Agency', 'Advertising Agency', 'Air Conditioning', 'Air Duct Cleaning', 'Airport Transfers', 'Alarm Services', 'Animal Feed', 'Antique Dealers', 'Apartment Rental', 'Appliance Repair', 'Appliances', 'Appraisers', 'Architects', 'Asbestos Removal', 'Assisted Living Facilities', 'Attorneys', 'Auto Body Repair', 'Auto Dealerships', 'Auto Detailing', 'Auto Glass', 'Auto Loans', 'Auto Parts Stores', 'Auto Repair', 'Auto Wrecker', 'Bail Bonds', 'Bakeries', 'Band Hire', 'Bankruptcy Services', 'Banner Printing', 'Barbers', 'Bars', 'Bathroom Contractors', 'Beauticians', 'Beauty Salon', 'Beauty Schools', 'Bedding Store', 'Bicycle Store', 'Birthday Parties', 'Blinds Installation', 'Blinds Stores', 'Blood Tests', 'Body Piercings Studio', 'Bookkeeping', 'Bookstores', 'Bouncy Castle Hire', 'Boutique', 'Bowling Alley', 'Boxing Club', 'Brake Services', 'Breweries', 'Bridal Shop', 'Builders', 'Bus Charter', 'Business Coach', 'Business Insurance', 'CBD', 'Cafes', 'Call Centers', 'Camping Stores', 'Campsite', 'Car Dealership', 'Car Decals', 'Car Detailing', 'Car Inspections', 'Car Insurance', 'Car Rental', 'Car Wash', 'Cardiologist', 'Carpenters', 'Carpet Cleaners', 'Carpet Installation', 'Carpet Stores', 'Cash for Gold', 'Casinos', 'Catering Services', 'Catering Supplies', 'Charities', 'Check Cashing', 'Childrens Clothing Stores', 'Chimney Cleaners', 'Chinese Restaurants', 'Chiropractors', 'Churches', 'Cinema', 'Cleaners', 'Cleaning Service', 'Closet Suppliers', 'Clothing', 'Coaching Services', 'Coffee Shop', 'Collections Agencies', 'Commercial Cleaning', 'Commercial Loans', 'Computer Repair', 'Computer Store', 'Concrete Contractors', 'Construction', 'Consultant', 'Contractors', 'Coolsculpting', 'Copier Service', 'Copywriters', 'Cosmetic Dentist', 'Cosmetic Surgery', 'Counselors', 'Coworking Space', 'Coworking Spaces', 'Craft Supplies', 'Crane Rental', 'Credit Card Merchants', 'Credit Counseling', 'Credit Repair', 'Credit Unions', 'Criminal Defense Attorneys', 'Crossfit', 'Cryotherapy', 'Culinary Schools', 'Custom Signs', 'DUI Lawyer', 'Dance Studios', 'Data Recovery Service', 'Day Spas', 'Daycare', 'Debt Collectors', 'Debt Consolidation Service', 'Deck Builders', 'Demolition', 'Dental Implants', 'Dentists', 'Dermatologists', 'Dietitians', 'Digital Agency', 'Digital Marketing', 'Disc Jockey', 'Dispensary', 'Diving Supplies', 'Divorce Attorney', 'Doctors', 'Dog Boarding', 'Dog Grooming', 'Dog Training', 'Door Installation', 'Drain Services', 'Driveways', 'Driving Instructors', 'Driving School', 'Dry Cleaners', 'Drywall', 'Electrical Engineer', 'Electricians', 'Electronics Store', 'Elevator Contractors', 'Embroidery Services', 'Engineering', 'Escape Rooms', 'Estate Agents', 'Estate Planners', 'Estate Planning Attorney', 'Esthetician', 'Event Planners', 'Exterminators', 'Fabric Shops', 'Family Law', 'Farm Equipment Stores', 'Fashion Design', 'Fence Contractors', 'Fence Suppliers', 'Finance Services', 'Financial Advisors', 'Financial Planners', 'Fire Alarm Systems', 'Fire Safety', 'Firewood', 'Fishing Boat Charters', 'Fishing Supplies', 'Fitness', 'Fitness Supplies', 'Fleet Services', 'Flight Schools', 'Floor Cleaners', 'Flooring', 'Flooring Service', 'Florists', 'Food Trucks', 'Food Wholesaler', 'Foreign Exchange Services', 'Fortune Tellers', 'Funeral Home', 'Furnished Apartments', 'Furniture Stores', 'Garage Door Repair', 'Garden Center', 'Gas Stations', 'Gastroenterology', 'General Contractors', 'Gift Shops', 'Glass Contractors', 'Gokarting', 'Golf Courses', 'Golf Store', 'Graphic Designer', 'Gun Safes', 'Gun Stores', 'Gunsmiths', 'Gutter Cleaning', 'Guttering Service', 'Gyms', 'Gynecologist', 'HVAC', 'Hair Braiding', 'Hair Removal', 'Hair Salon', 'Hair Salons', 'Hair Transplants', 'Handyman', 'Hardwood Flooring', 'Health Clubs', 'Health Stores', 'Hearing Aid Store', 'Heat Pump Dealers', 'Heat Pump Repair', 'Heating', 'Heating and Cooling', 'Hobby Stores', 'Home Automation', 'Home Inspections', 'Home Renovation', 'Home Security', 'Home Staging', 'Hospitals', 'Hotels', 'House Painters', 'House Removals', 'Hurricane Shutters', 'Hypnotherapists', 'Ice Skating', 'Immigration Lawyer', 'Indian Restaurants', 'Insurance Agents', 'Interior Design', 'Italian Restaurants', 'Jewelers', 'Jiu Jitsu', 'Juice Bar', 'Junk Removal', 'Kitchen Remodeling', 'LED Signs', 'Laboratories', 'Land Clearing', 'Land Surveyors', 'Landscaping', 'Language Classes', 'Language Schools', 'Laser Eye', 'Laser Hair Removal', 'Lasik', 'Laundromat', 'Laundry Services', 'Lawn Care', 'Lawyers', 'Learning Centers', 'Life Coach', 'Lighting Contractors', 'Lighting Stores', 'Limo Service', 'Loan Officers', 'Locksmiths', 'Logistics', 'Lottery', 'Machine Shops', 'Magicians', 'Maid Service', 'Mail Box Rental', 'Malpractice Lawyers', 'Manicures', 'Marketing Agency', 'Marriage Counseling', 'Martial Arts', 'Massages', 'Mechanics', 'Medical Associations', 'Medical Spas', 'Mens Clothing Stores', 'Mexican Restaurants', 'Microblading', 'Mold Removal', 'Mortgage Brokers', 'Motels', 'Moving Company', 'Music School', 'Nail Salons', 'Network Consultants', 'Night Clubs', 'Notary', 'Nurseries', 'Nutritionists', 'Office Cleaning', 'Office Furniture', 'Office Rental', 'Oil Service', 'Ophthalmologist', 'Opticians', 'Optometrists', 'Orthodontists', 'Orthopedic Surgeries', 'Oven Cleaning', 'Pain Management', 'Paint Contractors', 'Paintballing', 'Painters', 'Paralegal Services', 'Party Planners', 'Party Supplies', 'Patent Attorney', 'Paternity Testing', 'Paving Contractors', 'Pawn Brokers', 'Pediatricians', 'Perfume Stores', 'Personal Injury Attorneys', 'Personal Injury Lawyer', 'Personal Trainers', 'Pest Control', 'Pet Salon', 'Pet Stores', 'Pharmacies', 'Phone Repair', 'Phone Shops', 'Photographers', 'Physical Therapists', 'Piano Movers', 'Piano Tuning', 'Pilates', 'Pizzerias', 'Plastic Surgeons', 'Plumbers', 'Podiatrists', 'Point of Sale Systems', 'Pool Builder', 'Pool Contractors', 'Portable Buildings', 'Portable Toilets', 'Post Offices', 'Preschools', 'Pressure Cleaning', 'Printed Concrete', 'Printing Services', 'Private Detectives', 'Property Maintenance', 'Property Management', 'Prosthodontist', 'Psychiatrists', 'Psychic', 'Psychologists', 'Psychotherapists', 'RV Dealers', 'Real Estate Agents', 'Real Estate Broker', 'Real Estate Brokers', 'Real Estate Investor', 'Realtors', 'Regeneration Medicine', 'Rehab', 'Remodeling Contractors', 'Residential Cleaning', 'Restaurants', 'Restorations', 'Retirement Homes', 'Roofing', 'SEO Companies', 'Salons', 'Salvage Yards', 'Sandblasting Services', 'Sandwich Bar', 'Scaffolding', 'Screen Printing', 'Security Guards', 'Security Systems', 'Self Storage', 'Shop Fitters', 'Shop Fitting', 'Shops', 'Skate Shops', 'Sleep Clinics', 'Solar', 'Solar Installation', 'Solicitors', 'Spa', 'Speech Therapists', 'Sport Shop', 'Sports Wear', 'Spray Foam Insulation', 'Stamped Concrete', 'Supermarkets', 'Supplements', 'Sushi Restaurants', 'Swimming Pools', 'Tailers', 'Takeaway Restaurant', 'Tanning Salons', 'Tattoo Removal', 'Tattoo Studios', 'Taxi Services', 'Teachers', 'Temp Agencies', 'Tennis Clubs', 'Thai Restaurants', 'Theater', 'Therapists', 'Tile Contractors', 'Tire Shops', 'Towing Service', 'Toy Stores', 'Trailer Rental', 'Travel Agencies', 'Tree Service', 'Truck Rental', 'Tutoring', 'Tutoring Centers', 'Tuxedo Rental', 'Uniforms Suppliers', 'Urologists', 'Used Car Dealer', 'Vape Stores', 'Vegan Restaurants', 'Vein Clinic', 'Venetian Blinds', 'Veterinarians', 'Videography', 'Waste Management', 'Waste Removal', 'Watch Repair', 'Water Damage Repair', 'Waxing', 'Web Design', 'Wedding Photographer', 'Wedding Planners', 'Wedding Venues', 'Weight Loss', 'Welding Service', 'Wholesalers', 'Window Cleaning', 'Window Installation', 'Window Tinting', 'Windscreen Repair', 'Womens Clothing Stores', 'Yoga Studio',
]

export default function HighIntentSearch() {
  const [results, setResults] = useState<HighIntentBusiness[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchStats, setSearchStats] = useState<{
    indeed: number
    upwork: number
    linkedin: number
  } | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [industrySuggestions, setIndustrySuggestions] = useState<string[]>([])
  const [showIndustrySuggestions, setShowIndustrySuggestions] = useState(false)
  const industryInputRef = useRef<HTMLInputElement>(null)

  const { isSignedIn } = useUser()
  const { isPro } = useSubscription()

  // Get service types and states from API
  const { data: serviceTypes = [] } = trpc.leads.getHighIntentServiceTypes.useQuery()
  const { data: states = [] } = trpc.leads.getHighIntentStates.useQuery()

  const searchMutation = trpc.leads.searchHighIntent.useMutation()

  const {
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

  const handleStartTrial = async () => {
    try {
      // DEMO MODE: Set localStorage instead of Clerk
      localStorage.setItem('mockSubscriptionTier', 'pro')
      localStorage.setItem('mockTrialStartedAt', new Date().toISOString())
      localStorage.setItem('mockTrialEndsAt', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())

      toast.success('Pro trial activated! (Demo Mode)', {
        description: 'Refresh the page to see Pro features. This is a demo!',
      })

      setShowUpgradeModal(false)

      // Reload to refresh subscription state
      setTimeout(() => window.location.reload(), 500)
    } catch (error) {
      console.error('Trial activation error:', error)
      toast.error('Failed to activate trial', {
        description: 'Please try again or contact support',
      })
    }
  }

  const handleIndustryChange = (value: string) => {
    setValue('industry', value)
    if (value.length > 0) {
      const filtered = BUSINESS_CATEGORIES.filter(cat =>
        cat.toLowerCase().includes(value.toLowerCase())
      )
      setIndustrySuggestions(filtered.slice(0, 6))
      setShowIndustrySuggestions(filtered.length > 0)
    } else {
      setIndustrySuggestions([])
      setShowIndustrySuggestions(false)
    }
  }

  const selectIndustry = (industry: string) => {
    setValue('industry', industry)
    setShowIndustrySuggestions(false)
    setIndustrySuggestions([])
  }

  const onSubmit = async (data: SearchFormData) => {
    console.log('🔍 [HIGH-INTENT SEARCH] Starting search...')
    console.log('📋 [HIGH-INTENT SEARCH] Form data:', data)

    // Check if user is signed in
    if (!isSignedIn) {
      console.log('❌ [HIGH-INTENT SEARCH] User not signed in')
      toast.error('Please sign in to use High-Intent Search')
      return
    }
    console.log('✅ [HIGH-INTENT SEARCH] User is signed in')

    // Check if user has Pro subscription
    if (!isPro) {
      console.log('❌ [HIGH-INTENT SEARCH] User does not have Pro subscription')
      setShowUpgradeModal(true)
      return
    }
    console.log('✅ [HIGH-INTENT SEARCH] User has Pro subscription')

    console.log('⏳ [HIGH-INTENT SEARCH] Setting loading state and clearing previous results')
    setIsSearching(true)
    setResults([])
    setSearchStats(null)

    try {
      console.log('🚀 [HIGH-INTENT SEARCH] Calling searchHighIntent mutation with:')
      console.log('   - State:', data.state)
      console.log('   - Industry:', data.industry)
      console.log('   - Service Type:', data.serviceType)
      console.log('   - Max Results Per Source:', 15)

      const result = await searchMutation.mutateAsync({
        state: data.state,
        industry: data.industry,
        serviceType: data.serviceType,
        maxResultsPerSource: 15,
      })

      console.log('📥 [HIGH-INTENT SEARCH] Mutation response received:', result)

      if (result.success && 'businesses' in result) {
        console.log('✅ [HIGH-INTENT SEARCH] Search successful!')
        console.log('📊 [HIGH-INTENT SEARCH] Results summary:')
        console.log('   - Total businesses found:', result.businesses?.length || 0)
        console.log('   - Indeed results:', result.sources?.indeed || 0)
        console.log('   - Upwork results:', result.sources?.upwork || 0)
        console.log('   - LinkedIn results:', result.sources?.linkedin || 0)
        console.log('   - Search timestamp:', result.searchedAt)
        console.log('📋 [HIGH-INTENT SEARCH] Full result object:', result)

        setResults(result.businesses)
        setSearchStats(result.sources)

        console.log('🎉 [HIGH-INTENT SEARCH] UI updated with results')
        toast.success(`Found ${result.businesses.length} high-intent businesses!`)
      } else {
        console.log('❌ [HIGH-INTENT SEARCH] Search returned but success flag is false')
        console.log('   Response:', result)
        toast.error('Search failed')
      }
    } catch (error: any) {
      console.error('❌ [HIGH-INTENT SEARCH] Error during search:', error)
      console.error('   Error message:', error.message)
      console.error('   Error stack:', error.stack)
      console.error('   Full error object:', error)
      toast.error(error.message || 'Failed to search for businesses')
    } finally {
      console.log('🏁 [HIGH-INTENT SEARCH] Search completed, clearing loading state')
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
      <Card className="bg-zinc-900/50 border-zinc-800 overflow-visible relative z-20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-400" />
            Search Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-visible">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 overflow-visible">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-visible">
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
              <div className="space-y-2" style={{ zIndex: showIndustrySuggestions ? 9999 : 'auto', position: 'relative' }}>
                <Label htmlFor="industry" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-zinc-400" />
                  Industry
                </Label>
                <div className="relative" style={{ zIndex: 9999 }}>
                  <Input
                    id="industry"
                    ref={industryInputRef}
                    placeholder="e.g., Restaurant, HVAC, Dental"
                    value={watch('industry')}
                    onChange={(e) => handleIndustryChange(e.target.value)}
                    onFocus={() => {
                      const value = watch('industry')
                      if (value) handleIndustryChange(value)
                    }}
                    onBlur={() => {
                      // Delay to allow click on suggestion
                      setTimeout(() => setShowIndustrySuggestions(false), 150)
                    }}
                    autoComplete="off"
                    className="bg-zinc-800 border-zinc-700"
                  />

                  {/* Autocomplete dropdown */}
                  <AnimatePresence>
                    {showIndustrySuggestions && industrySuggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-[calc(100%+4px)] left-0 right-0 bg-zinc-800 border border-zinc-700 rounded-lg shadow-2xl z-[9999] overflow-hidden"
                        style={{ position: 'absolute' }}
                      >
                        {industrySuggestions.map((suggestion, idx) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => selectIndustry(suggestion)}
                            className={`w-full px-4 py-2.5 text-left text-sm hover:bg-zinc-700 transition-colors border-b border-zinc-700/50 last:border-0 ${idx === 0 ? 'bg-zinc-700/50' : ''
                              }`}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

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
            <div className="flex items-center gap-4 relative z-0">
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
        onUpgrade={handleStartTrial}
      />
    </div>
  )
}
