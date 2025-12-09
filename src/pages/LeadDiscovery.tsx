import { useState, useMemo, useRef } from 'react'
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
  Building2,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { trpc } from '@/lib/trpc'
import { useLeadStore } from '@/hooks/useLeadStore'
import {
  calculateLeadScore,
  convertEnrichmentResult,
  getLeadCategory,
  calculateOpportunityValue,
  type ScoringResult,
} from '@/lib/leadScoring'
import { IntelligenceReportModal } from '@/components/IntelligenceReportModal'
import { ProUpgradeModal } from '@/components/ProUpgradeModal'
import { CountUpScore } from '@/components/CountUpScore'
import { useSubscription } from '@/hooks/useSubscription'
import type { Lead } from '@/types'
import { ALL_US_LOCATIONS } from '@/data/usLocations'

const searchSchema = z.object({
  category: z.string().min(1, 'Please enter a business category'),
  location: z.string().min(1, 'Please enter a location'),
})

type SearchFormData = z.infer<typeof searchSchema>

// Comprehensive business categories for autocomplete
const BUSINESS_CATEGORIES = [
  'ATMs',
  'Abogado',
  'Accountants',
  'Acupuncture',
  'Addiction Treatment Center',
  'Adoption Agency',
  'Advertising Agency',
  'Air Conditioning',
  'Air Duct Cleaning',
  'Airport Transfers',
  'Alarm Services',
  'Animal Feed',
  'Antique Dealers',
  'Apartment Rental',
  'Appliance Repair',
  'Appliances',
  'Appraisers',
  'Architects',
  'Asbestos Removal',
  'Assisted Living Facilities',
  'Attorneys',
  'Auto Body Repair',
  'Auto Dealerships',
  'Auto Detailing',
  'Auto Glass',
  'Auto Loans',
  'Auto Parts Stores',
  'Auto Repair',
  'Auto Wrecker',
  'Bail Bonds',
  'Bakeries',
  'Band Hire',
  'Bankruptcy Services',
  'Banner Printing',
  'Barbers',
  'Bars',
  'Bathroom Contractors',
  'Beauticians',
  'Beauty Salon',
  'Beauty Schools',
  'Bedding Store',
  'Bicycle Store',
  'Birthday Parties',
  'Blinds Installation',
  'Blinds Stores',
  'Blood Tests',
  'Body Piercings Studio',
  'Bookkeeping',
  'Bookstores',
  'Bouncy Castle Hire',
  'Boutique',
  'Bowling Alley',
  'Boxing Club',
  'Brake Services',
  'Breweries',
  'Bridal Shop',
  'Builders',
  'Bus Charter',
  'Business Coach',
  'Business Insurance',
  'CBD',
  'Cafes',
  'Call Centers',
  'Camping Stores',
  'Campsite',
  'Car Dealership',
  'Car Decals',
  'Car Detailing',
  'Car Inspections',
  'Car Insurance',
  'Car Rental',
  'Car Wash',
  'Cardiologist',
  'Carpenters',
  'Carpet Cleaners',
  'Carpet Installation',
  'Carpet Stores',
  'Cash for Gold',
  'Casinos',
  'Catering Services',
  'Catering Supplies',
  'Charities',
  'Check Cashing',
  'Childrens Clothing Stores',
  'Chimney Cleaners',
  'Chinese Restaurants',
  'Chiropractors',
  'Churches',
  'Cinema',
  'Cleaners',
  'Cleaning Service',
  'Closet Suppliers',
  'Clothing',
  'Coaching Services',
  'Coffee Shop',
  'Collections Agencies',
  'Commercial Cleaning',
  'Commercial Loans',
  'Computer Repair',
  'Computer Store',
  'Concrete Contractors',
  'Construction',
  'Consultant',
  'Contractors',
  'Coolsculpting',
  'Copier Service',
  'Copywriters',
  'Cosmetic Dentist',
  'Cosmetic Surgery',
  'Counselors',
  'Coworking Space',
  'Coworking Spaces',
  'Craft Supplies',
  'Crane Rental',
  'Credit Card Merchants',
  'Credit Counseling',
  'Credit Repair',
  'Credit Unions',
  'Criminal Defense Attorneys',
  'Crossfit',
  'Cryotherapy',
  'Culinary Schools',
  'Custom Signs',
  'DUI Lawyer',
  'Dance Studios',
  'Data Recovery Service',
  'Day Spas',
  'Daycare',
  'Debt Collectors',
  'Debt Consolidation Service',
  'Deck Builders',
  'Demolition',
  'Dental Implants',
  'Dentists',
  'Dermatologists',
  'Dietitians',
  'Digital Agency',
  'Digital Marketing',
  'Disc Jockey',
  'Dispensary',
  'Diving Supplies',
  'Divorce Attorney',
  'Doctors',
  'Dog Boarding',
  'Dog Grooming',
  'Dog Training',
  'Door Installation',
  'Drain Services',
  'Driveways',
  'Driving Instructors',
  'Driving School',
  'Dry Cleaners',
  'Drywall',
  'Electrical Engineer',
  'Electricians',
  'Electronics Store',
  'Elevator Contractors',
  'Embroidery Services',
  'Engineering',
  'Escape Rooms',
  'Estate Agents',
  'Estate Planners',
  'Estate Planning Attorney',
  'Esthetician',
  'Event Planners',
  'Exterminators',
  'Fabric Shops',
  'Family Law',
  'Farm Equipment Stores',
  'Fashion Design',
  'Fence Contractors',
  'Fence Suppliers',
  'Finance Services',
  'Financial Advisors',
  'Financial Planners',
  'Fire Alarm Systems',
  'Fire Safety',
  'Firewood',
  'Fishing Boat Charters',
  'Fishing Supplies',
  'Fitness',
  'Fitness Supplies',
  'Fleet Services',
  'Flight Schools',
  'Floor Cleaners',
  'Flooring',
  'Flooring Service',
  'Florists',
  'Food Trucks',
  'Food Wholesaler',
  'Foreign Exchange Services',
  'Fortune Tellers',
  'Funeral Home',
  'Furnished Apartments',
  'Furniture Stores',
  'Garage Door Repair',
  'Garden Center',
  'Gas Stations',
  'Gastroenterology',
  'General Contractors',
  'Gift Shops',
  'Glass Contractors',
  'Gokarting',
  'Golf Courses',
  'Golf Store',
  'Graphic Designer',
  'Gun Safes',
  'Gun Stores',
  'Gunsmiths',
  'Gutter Cleaning',
  'Guttering Service',
  'Gyms',
  'Gynecologist',
  'HVAC',
  'Hair Braiding',
  'Hair Removal',
  'Hair Salon',
  'Hair Salons',
  'Hair Transplants',
  'Handyman',
  'Hardwood Flooring',
  'Health Clubs',
  'Health Stores',
  'Hearing Aid Store',
  'Heat Pump Dealers',
  'Heat Pump Repair',
  'Heating',
  'Heating and Cooling',
  'Hobby Stores',
  'Home Automation',
  'Home Inspections',
  'Home Renovation',
  'Home Security',
  'Home Staging',
  'Hospitals',
  'Hotels',
  'House Painters',
  'House Removals',
  'Hurricane Shutters',
  'Hypnotherapists',
  'Ice Skating',
  'Immigration Lawyer',
  'Indian Restaurants',
  'Insurance Agents',
  'Interior Design',
  'Italian Restaurants',
  'Jewelers',
  'Jiu Jitsu',
  'Juice Bar',
  'Junk Removal',
  'Kitchen Remodeling',
  'LED Signs',
  'Laboratories',
  'Land Clearing',
  'Land Surveyors',
  'Landscaping',
  'Language Classes',
  'Language Schools',
  'Laser Eye',
  'Laser Hair Removal',
  'Lasik',
  'Laundromat',
  'Laundry Services',
  'Lawn Care',
  'Lawyers',
  'Learning Centers',
  'Life Coach',
  'Lighting Contractors',
  'Lighting Stores',
  'Limo Service',
  'Loan Officers',
  'Locksmiths',
  'Logistics',
  'Lottery',
  'Machine Shops',
  'Magicians',
  'Maid Service',
  'Mail Box Rental',
  'Malpractice Lawyers',
  'Manicures',
  'Marketing Agency',
  'Marriage Counseling',
  'Martial Arts',
  'Massages',
  'Mechanics',
  'Medical Associations',
  'Medical Spas',
  'Mens Clothing Stores',
  'Mexican Restaurants',
  'Microblading',
  'Mold Removal',
  'Mortgage Brokers',
  'Motels',
  'Moving Company',
  'Music School',
  'Nail Salons',
  'Network Consultants',
  'Night Clubs',
  'Notary',
  'Nurseries',
  'Nutritionists',
  'Office Cleaning',
  'Office Furniture',
  'Office Rental',
  'Oil Service',
  'Ophthalmologist',
  'Opticians',
  'Optometrists',
  'Orthodontists',
  'Orthopedic Surgeries',
  'Oven Cleaning',
  'Pain Management',
  'Paint Contractors',
  'Paintballing',
  'Painters',
  'Paralegal Services',
  'Party Planners',
  'Party Supplies',
  'Patent Attorney',
  'Paternity Testing',
  'Paving Contractors',
  'Pawn Brokers',
  'Pediatricians',
  'Perfume Stores',
  'Personal Injury Attorneys',
  'Personal Injury Lawyer',
  'Personal Trainers',
  'Pest Control',
  'Pet Salon',
  'Pet Stores',
  'Pharmacies',
  'Phone Repair',
  'Phone Shops',
  'Photographers',
  'Physical Therapists',
  'Piano Movers',
  'Piano Tuning',
  'Pilates',
  'Pizzerias',
  'Plastic Surgeons',
  'Plumbers',
  'Podiatrists',
  'Point of Sale Systems',
  'Pool Builder',
  'Pool Contractors',
  'Portable Buildings',
  'Portable Toilets',
  'Post Offices',
  'Preschools',
  'Pressure Cleaning',
  'Printed Concrete',
  'Printing Services',
  'Private Detectives',
  'Property Maintenance',
  'Property Management',
  'Prosthodontist',
  'Psychiatrists',
  'Psychic',
  'Psychologists',
  'Psychotherapists',
  'RV Dealers',
  'Real Estate Agents',
  'Real Estate Broker',
  'Real Estate Brokers',
  'Real Estate Investor',
  'Realtors',
  'Regeneration Medicine',
  'Rehab',
  'Remodeling Contractors',
  'Residential Cleaning',
  'Restaurants',
  'Restorations',
  'Retirement Homes',
  'Roofing',
  'SEO Companies',
  'Salons',
  'Salvage Yards',
  'Sandblasting Services',
  'Sandwich Bar',
  'Scaffolding',
  'Screen Printing',
  'Security Guards',
  'Security Systems',
  'Self Storage',
  'Shop Fitters',
  'Shop Fitting',
  'Shops',
  'Skate Shops',
  'Sleep Clinics',
  'Solar',
  'Solar Installation',
  'Solicitors',
  'Spa',
  'Speech Therapists',
  'Sport Shop',
  'Sports Wear',
  'Spray Foam Insulation',
  'Stamped Concrete',
  'Supermarkets',
  'Supplements',
  'Sushi Restaurants',
  'Swimming Pools',
  'Tailers',
  'Takeaway Restaurant',
  'Tanning Salons',
  'Tattoo Removal',
  'Tattoo Studios',
  'Taxi Services',
  'Teachers',
  'Temp Agencies',
  'Tennis Clubs',
  'Thai Restaurants',
  'Theater',
  'Therapists',
  'Tile Contractors',
  'Tire Shops',
  'Towing Service',
  'Toy Stores',
  'Trailer Rental',
  'Travel Agencies',
  'Tree Service',
  'Truck Rental',
  'Tutoring',
  'Tutoring Centers',
  'Tuxedo Rental',
  'Uniforms Suppliers',
  'Urologists',
  'Used Car Dealer',
  'Vape Stores',
  'Vegan Restaurants',
  'Vein Clinic',
  'Venetian Blinds',
  'Veterinarians',
  'Videography',
  'Waste Management',
  'Waste Removal',
  'Watch Repair',
  'Water Damage Repair',
  'Waxing',
  'Web Design',
  'Wedding Photographer',
  'Wedding Planners',
  'Wedding Venues',
  'Weight Loss',
  'Welding Service',
  'Wholesalers',
  'Window Cleaning',
  'Window Installation',
  'Window Tinting',
  'Windscreen Repair',
  'Womens Clothing Stores',
  'Yoga Studio',
]

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

// Average pipeline value per lead ($2,500 - $4,000 range, we use $3,200 as middle)
const AVG_PIPELINE_VALUE_PER_LEAD = 3200

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
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const currentSearchRef = useRef<SearchFormData | null>(null)

  // Get subscription info from Clerk
  const { isPro, remainingSearches, canSearch } = useSubscription()

  const {
    discoveredLeads,
    setDiscoveredLeads,
    addToPipeline,
    setLastSearch,
    saveLead,
    unsaveLead,
    isLeadSaved,
    lastSearch,
    addSearchToHistory,
    findExistingSearch,
  } = useLeadStore()

  const enrichMutation = trpc.leads.enrichDiscoveredLead.useMutation()

  const enrichLeads = async (leads: Lead[], calculateScores: boolean = false) => {
    console.log('=== [enrichLeads] Starting enrichment ===')
    console.log('[enrichLeads] Total leads:', leads.length)
    console.log('[enrichLeads] Calculate scores:', calculateScores)

    setIsEnriching(true)
    setEnrichProgress(0)
    const newScores = new Map<string, ScoringResult>()
    const enrichedLeads = [...leads]

    // Process leads in batches of 3 to avoid overwhelming the server
    const batchSize = 3
    let completed = 0
    let emailsFound = 0

    for (let i = 0; i < leads.length; i += batchSize) {
      const batch = leads.slice(i, i + batchSize)
      console.log(`[enrichLeads] Processing batch ${i / batchSize + 1}, leads:`, batch.map(l => l.businessName))

      // Process batch in parallel
      const results = await Promise.allSettled(
        batch.map((lead) => {
          console.log('[enrichLeads] Calling mutation for:', lead.businessName, 'website:', lead.website, 'email:', lead.email)
          return enrichMutation.mutateAsync({
            id: lead.id,
            businessName: lead.businessName,
            website: lead.website,
            // Pass existing email from Google Maps scraper - skip email discovery if present
            email: lead.email,
            googleRating: lead.googleRating,
            reviewCount: lead.reviewCount,
            // Pass social media URLs from Google Maps scraper
            instagram: lead.instagram,
            facebook: lead.facebook,
            linkedin: lead.linkedin,
            twitter: lead.twitter,
            tiktok: lead.tiktok,
            youtube: lead.youtube,
          })
        })
      )

      // Log results for debugging
      console.log('[enrichLeads] Batch results:', results.map((r, idx) => ({
        business: batch[idx].businessName,
        status: r.status,
        error: r.status === 'rejected' ? (r.reason as Error)?.message : null
      })))

      // Process results - update leads with email/social data
      results.forEach((result, idx) => {
        const lead = batch[idx]
        const leadIndex = enrichedLeads.findIndex(l => l.id === lead.id)

        if (result.status === 'fulfilled' && result.value.success && 'technologies' in result.value) {
          const data = result.value

          // Update lead with discovered email and social media (for ALL users)
          const updates: Partial<Lead> = {}

          if (data.emailEnrichment?.bestEmail) {
            updates.email = data.emailEnrichment.bestEmail.email
            updates.emailVerified = data.emailEnrichment.verification?.status === 'valid'
            updates.emailVerificationScore = data.emailEnrichment.verification?.score ?? 0
            updates.emailVerificationStatus = data.emailEnrichment.verification?.status as any
            emailsFound++
          }

          // Add social media from Google Maps scraper (passed through enrichment)
          if (data.socialMedia) {
            if (data.socialMedia.instagram) updates.instagram = data.socialMedia.instagram
            if (data.socialMedia.facebook) updates.facebook = data.socialMedia.facebook
            if (data.socialMedia.linkedin) updates.linkedin = data.socialMedia.linkedin
            if (data.socialMedia.twitter) updates.twitter = data.socialMedia.twitter
            if (data.socialMedia.tiktok) updates.tiktok = data.socialMedia.tiktok
            if (data.socialMedia.youtube) updates.youtube = data.socialMedia.youtube
          }

          if (Object.keys(updates).length > 0 && leadIndex >= 0) {
            enrichedLeads[leadIndex] = {
              ...enrichedLeads[leadIndex],
              ...updates,
            }
          }

          // Only calculate scores if Pro is enabled
          if (calculateScores) {
            const enrichmentData = convertEnrichmentResult({
              technologies: data.technologies,
              jobPostings: data.jobPostings,
              websiteAnalysis: data.websiteAnalysis,
              domainInfo: data.domainInfo,
              employeeCount: data.employeeCount,
              fundingInfo: data.fundingInfo,
              socialMetrics: data.socialMetrics,
            })
            const scoringResult = calculateLeadScore(lead, enrichmentData)
            newScores.set(lead.id, scoringResult)
          }
        }
      })

      completed += batch.length
      setEnrichProgress(Math.round((completed / leads.length) * 100))
    }

    // Update discovered leads with enriched data (email/social for everyone)
    setDiscoveredLeads(enrichedLeads)

    // Only set scores if Pro mode is enabled
    if (calculateScores) {
      setLeadScores(newScores)
    }

    setIsEnriching(false)

    if (calculateScores) {
      toast.success('Pro Intelligence analysis complete!', {
        description: `Analyzed ${newScores.size} leads with real-time data`,
      })
    } else {
      toast.success('Lead enrichment complete!', {
        description: `Found ${emailsFound} emails from business websites`,
      })
    }
  }

  const searchMutation = trpc.leads.search.useMutation({
    onSuccess: (data) => {
      const leads = data.leads as Lead[]
      setDiscoveredLeads(leads)
      setSearchProgress(100)

      // Animate the actual count from Apify results
      animateResultsCount(leads.length)

      // Epic celebration confetti burst from sides
      const duration = 2500
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ['#a855f7', '#22d3ee', '#10b981', '#f59e0b'],
        })
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ['#a855f7', '#22d3ee', '#10b981', '#f59e0b'],
        })
        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      frame()

      // Center burst
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6, x: 0.5 },
        colors: ['#a855f7', '#22d3ee', '#10b981', '#f59e0b', '#ec4899'],
      })

      // Use consistent pipeline value calculation
      const estimatedValue = leads.length * AVG_PIPELINE_VALUE_PER_LEAD

      toast.success(`${data.count} money-making opportunities found!`, {
        description: `Est. pipeline value: $${estimatedValue.toLocaleString()}+`,
        duration: 5000,
      })

      // Add to search history with all leads
      if (currentSearchRef.current) {
        addSearchToHistory({
          category: currentSearchRef.current.category,
          location: currentSearchRef.current.location,
          leads: leads,
        })
      }

      // Always enrich leads for email/social discovery
      // Pass proEnabled to determine if tech stack + scoring should also run
      if (leads.length > 0) {
        enrichLeads(leads, proEnabled)
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
    },
  })

  // Autocomplete state
  const [categorySuggestions, setCategorySuggestions] = useState<string[]>([])
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([])
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false)
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
  const categoryInputRef = useRef<HTMLInputElement>(null)
  const locationInputRef = useRef<HTMLInputElement>(null)

  // Filter suggestions based on input
  const handleCategoryChange = (value: string) => {
    form.setValue('category', value)
    if (value.length > 0) {
      const filtered = BUSINESS_CATEGORIES.filter(cat =>
        cat.toLowerCase().includes(value.toLowerCase())
      )
      setCategorySuggestions(filtered.slice(0, 6))
      setShowCategorySuggestions(filtered.length > 0)
    } else {
      setCategorySuggestions([])
      setShowCategorySuggestions(false)
    }
  }

  const handleLocationChange = (value: string) => {
    form.setValue('location', value)
    if (value.length > 0) {
      const filtered = ALL_US_LOCATIONS.filter(loc =>
        loc.toLowerCase().includes(value.toLowerCase())
      )
      setLocationSuggestions(filtered.slice(0, 6))
      setShowLocationSuggestions(filtered.length > 0)
    } else {
      setLocationSuggestions([])
      setShowLocationSuggestions(false)
    }
  }

  const selectCategory = (category: string) => {
    form.setValue('category', category)
    setShowCategorySuggestions(false)
    setCategorySuggestions([])
  }

  const selectLocation = (location: string) => {
    form.setValue('location', location)
    setShowLocationSuggestions(false)
    setLocationSuggestions([])
  }

  const [loadingPhase, setLoadingPhase] = useState(0)
  const [businessCount, setBusinessCount] = useState(0)
  const [potentialRevenue, setPotentialRevenue] = useState(0)

  const loadingPhases = [
    {
      status: 'Scanning the map for opportunities...',
      subtext: 'Your next big client is in here somewhere',
      tip: 'Every search could uncover a $50K deal',
    },
    {
      status: 'Found businesses. Extracting decision-maker contacts...',
      subtext: 'Getting you direct lines to the people who sign checks',
      tip: 'Direct contacts close 3x faster than cold emails',
    },
    {
      status: 'Analyzing buying signals...',
      subtext: 'Separating the ready-to-buy from the tire-kickers',
      tip: 'We are looking for the ones who need you NOW',
    },
    {
      status: 'Ranking leads by revenue potential...',
      subtext: 'Putting your highest-value opportunities first',
      tip: 'Top-ranked leads have 10x higher close rates',
    },
    {
      status: 'Almost there... Preparing your money-making list',
      subtext: 'This is the moment your pipeline changes forever',
      tip: 'Average users close their first deal within 7 days',
    },
  ]

  const simulateProgress = async () => {
    // Reset to show loading state (0 means "still searching")
    setBusinessCount(0)
    setPotentialRevenue(0)

    for (let i = 0; i < loadingPhases.length; i++) {
      setLoadingPhase(i)
      setSearchStatus(loadingPhases[i].status)
      setSearchProgress((i + 1) * 18)

      // Just wait for phase duration - no fake counting
      await new Promise((r) => setTimeout(r, 2500))
    }
  }

  // Animate counting up to actual values when results arrive
  const animateResultsCount = async (targetCount: number) => {
    const targetRevenue = targetCount * AVG_PIPELINE_VALUE_PER_LEAD
    const duration = 1500 // 1.5 seconds for the animation
    const steps = 30
    const stepDuration = duration / steps

    for (let i = 1; i <= steps; i++) {
      await new Promise((r) => setTimeout(r, stepDuration))
      const progress = i / steps
      // Use easeOutQuad for smooth deceleration
      const easeProgress = 1 - (1 - progress) * (1 - progress)
      setBusinessCount(Math.floor(targetCount * easeProgress))
      setPotentialRevenue(Math.floor(targetRevenue * easeProgress))
    }

    // Ensure final values are exact
    setBusinessCount(targetCount)
    setPotentialRevenue(targetRevenue)
  }

  const onSubmit = async (data: SearchFormData) => {
    // Check subscription limits before searching
    if (!canSearch) {
      toast.error('Daily search limit reached', {
        description: 'Upgrade your plan to get more searches per day.',
        action: {
          label: 'Upgrade',
          onClick: () => setShowUpgradeModal(true),
        },
      })
      return
    }

    // Check if we already searched for this category + location
    const existingSearch = findExistingSearch(data.category, data.location)
    if (existingSearch && existingSearch.leads.length > 0) {
      toast.info("You've already searched for this", {
        description: `Showing ${existingSearch.leads.length} leads from your previous search.`,
      })
      setDiscoveredLeads(existingSearch.leads)
      setLastSearch({ category: data.category, location: data.location })
      setSearchProgress(100)
      return
    }

    setSearchProgress(0)
    setDiscoveredLeads([])
    setLastSearch({ category: data.category, location: data.location })
    currentSearchRef.current = data
    simulateProgress()

    searchMutation.mutate({
      category: data.category,
      location: data.location,
    })
  }

  const handleAddToPipeline = (lead: Lead) => {
    addToPipeline(lead)
    toast.success(`Added ${lead.businessName} to pipeline`)
    setSelectedLead(null)
  }

  const handleToggleSave = (lead: Lead, e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (isLeadSaved(lead.id)) {
      unsaveLead(lead.id)
      toast.success('Lead removed from saved')
    } else {
      saveLead(lead, lastSearch || undefined)
      toast.success('Lead saved for later')
    }
  }

  const isSearching = searchMutation.isPending

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

  const getScoreBadgeVariant = (score: number): 'hot' | 'warm' | 'cold' | 'outline' => {
    const category = getLeadCategory(score)
    switch (category) {
      case 'hot': return 'hot'
      case 'warm': return 'warm'
      case 'cold': return 'cold'
      default: return 'outline'
    }
  }

  const handleProToggle = (checked: boolean) => {
    if (checked && !isPro) {
      // Show upgrade modal for non-Pro users
      setShowUpgradeModal(true)
    } else {
      setProEnabled(checked)
    }
  }

  const handleUpgrade = () => {
    // For testing: Enable Pro mode immediately
    // In production, this would redirect to Stripe and wait for webhook confirmation
    setProEnabled(true)
    setShowUpgradeModal(false)
    toast.success('Pro Intelligence activated!', {
      description: 'You now have access to AI-powered lead scoring and tech analysis.',
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-semibold tracking-tight">
            Discover Leads
          </h1>
          <Badge variant="glow">
            <Zap className="w-3 h-3 mr-1" />
            AI-Powered
          </Badge>
        </div>
        <p className="text-muted-foreground text-lg">
          Find high-intent businesses ready to buy your services
        </p>
      </motion.div>

      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card variant="default" className="overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-cold/5" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-cold">
                <Search className="h-5 w-5 text-white" />
              </div>
              Search for Businesses
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">
                    Business Category
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Input
                      id="category"
                      ref={categoryInputRef}
                      placeholder="e.g., plumbers, restaurants"
                      className="pl-10"
                      value={form.watch('category')}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      onFocus={() => {
                        const value = form.getValues('category')
                        if (value.length > 0) {
                          const filtered = BUSINESS_CATEGORIES.filter(cat =>
                            cat.toLowerCase().includes(value.toLowerCase())
                          )
                          setCategorySuggestions(filtered.slice(0, 6))
                          setShowCategorySuggestions(filtered.length > 0)
                        }
                      }}
                      onBlur={() => {
                        // Delay to allow click on suggestion
                        setTimeout(() => setShowCategorySuggestions(false), 150)
                      }}
                      autoComplete="off"
                    />
                    <AnimatePresence>
                      {showCategorySuggestions && categorySuggestions.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-lg z-50 overflow-hidden"
                        >
                          {categorySuggestions.map((suggestion, idx) => (
                            <button
                              key={suggestion}
                              type="button"
                              className={`w-full px-4 py-2.5 text-left text-sm hover:bg-primary/10 transition-colors flex items-center gap-2 ${
                                idx === 0 ? 'bg-primary/5' : ''
                              }`}
                              onMouseDown={(e) => {
                                e.preventDefault()
                                selectCategory(suggestion)
                              }}
                            >
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              {suggestion}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {form.formState.errors.category && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.category.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium">
                    Location
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Input
                      id="location"
                      ref={locationInputRef}
                      placeholder="e.g., Miami, FL"
                      className="pl-10"
                      value={form.watch('location')}
                      onChange={(e) => handleLocationChange(e.target.value)}
                      onFocus={() => {
                        const value = form.getValues('location')
                        if (value.length > 0) {
                          const filtered = ALL_US_LOCATIONS.filter((loc: string) =>
                            loc.toLowerCase().includes(value.toLowerCase())
                          )
                          setLocationSuggestions(filtered.slice(0, 6))
                          setShowLocationSuggestions(filtered.length > 0)
                        }
                      }}
                      onBlur={() => {
                        // Delay to allow click on suggestion
                        setTimeout(() => setShowLocationSuggestions(false), 150)
                      }}
                      autoComplete="off"
                    />
                    <AnimatePresence>
                      {showLocationSuggestions && locationSuggestions.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-lg z-50 overflow-hidden"
                        >
                          {locationSuggestions.map((suggestion, idx) => (
                            <button
                              key={suggestion}
                              type="button"
                              className={`w-full px-4 py-2.5 text-left text-sm hover:bg-primary/10 transition-colors flex items-center gap-2 ${
                                idx === 0 ? 'bg-primary/5' : ''
                              }`}
                              onMouseDown={(e) => {
                                e.preventDefault()
                                selectLocation(suggestion)
                              }}
                            >
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              {suggestion}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {form.formState.errors.location && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.location.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Pro Intelligence Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 via-transparent to-cold/10 border border-primary/20">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-cold shadow-lg shadow-primary/20">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="pro-toggle" className="font-semibold cursor-pointer">
                        Pro Intelligence
                      </Label>
                      <Badge variant="glow" className="text-2xs px-1.5 py-0">
                        PRO
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      AI-powered lead scoring & opportunity analysis
                    </p>
                  </div>
                </div>
                <Switch
                  id="pro-toggle"
                  checked={proEnabled}
                  onCheckedChange={handleProToggle}
                />
              </div>

              <div className="flex flex-col md:flex-row items-center gap-3">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full md:w-auto gap-2"
                  disabled={isSearching || !canSearch}
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      Find Leads
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  {remainingSearches === Infinity ? (
                    'Unlimited searches'
                  ) : (
                    <>
                      <span className="font-medium tabular-nums">{remainingSearches}</span> searches remaining today
                    </>
                  )}
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Immersive Loading Experience */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card variant="default" className="relative overflow-hidden border-primary/30">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-cold/20" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />

              {/* Floating orbs */}
              <motion.div
                className="absolute top-4 right-8 w-24 h-24 rounded-full bg-primary/20 blur-2xl"
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-4 left-8 w-32 h-32 rounded-full bg-cold/20 blur-2xl"
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              <CardContent className="relative py-10 px-8">
                <div className="space-y-8">
                  {/* Main status */}
                  <div className="text-center space-y-3">
                    <motion.div
                      key={loadingPhase}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-center gap-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        >
                          <Sparkles className="h-6 w-6 text-primary" />
                        </motion.div>
                        <h3 className="text-xl font-semibold text-gradient-brand">
                          {searchStatus}
                        </h3>
                      </div>
                      <p className="text-muted-foreground">
                        {loadingPhases[loadingPhase]?.subtext}
                      </p>
                    </motion.div>
                  </div>

                  {/* Live stats */}
                  <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                    <motion.div
                      className="text-center p-4 rounded-xl bg-surface border border-border"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.div
                        className="text-3xl font-semibold text-primary"
                        key={businessCount}
                      >
                        {businessCount === 0 && searchProgress < 100 ? (
                          <motion.span
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            --
                          </motion.span>
                        ) : (
                          businessCount
                        )}
                      </motion.div>
                      <p className="text-sm text-muted-foreground mt-1">Businesses Found</p>
                    </motion.div>
                    <motion.div
                      className="text-center p-4 rounded-xl bg-surface border border-border"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <motion.div
                        className="text-3xl font-semibold text-success"
                        key={potentialRevenue}
                      >
                        {potentialRevenue === 0 && searchProgress < 100 ? (
                          <motion.span
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            --
                          </motion.span>
                        ) : (
                          `$${potentialRevenue.toLocaleString()}`
                        )}
                      </motion.div>
                      <p className="text-sm text-muted-foreground mt-1">Est. Pipeline Value</p>
                    </motion.div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-3 max-w-lg mx-auto">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Finding your next deals...</span>
                      <span className="font-mono font-bold text-primary">{searchProgress}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-surface overflow-hidden border border-border">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary via-cold to-success relative"
                        initial={{ width: 0 }}
                        animate={{ width: `${searchProgress}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      >
                        {/* Shimmer effect on progress bar */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* Rotating tips */}
                  <motion.div
                    key={`tip-${loadingPhase}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warm/10 border border-warm/20">
                      <TrendingUp className="h-4 w-4 text-warm" />
                      <span className="text-sm text-warm">
                        {loadingPhases[loadingPhase]?.tip}
                      </span>
                    </div>
                  </motion.div>

                  {/* Phase indicators */}
                  <div className="flex items-center justify-center gap-2">
                    {loadingPhases.map((_, index) => (
                      <motion.div
                        key={index}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index <= loadingPhase
                            ? 'bg-gradient-to-r from-primary to-cold w-8'
                            : 'bg-surface w-2'
                        }`}
                        animate={index === loadingPhase ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      />
                    ))}
                  </div>
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card variant="default" className="border-primary/30 overflow-hidden relative">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-cold/5 to-success/10" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />

              <CardContent className="py-8 relative">
                <div className="space-y-6 text-center">
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-3">
                      <motion.div
                        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                        transition={{ rotate: { duration: 2, repeat: Infinity, ease: 'linear' }, scale: { duration: 1, repeat: Infinity } }}
                      >
                        <Sparkles className="h-6 w-6 text-primary" />
                      </motion.div>
                      <h3 className="text-lg font-semibold text-gradient-brand">
                        Uncovering Hidden Revenue Opportunities
                      </h3>
                    </div>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto">
                      Our AI is scanning websites, detecting technology gaps, and calculating exactly how much each lead is worth to you
                    </p>
                  </div>

                  <div className="space-y-2 max-w-md mx-auto">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Analyzing {discoveredLeads.length} potential clients...</span>
                      <span className="font-mono font-bold text-primary">{enrichProgress}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-surface overflow-hidden border border-primary/20">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary via-cold to-success relative"
                        initial={{ width: 0 }}
                        animate={{ width: `${enrichProgress}%` }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                      </motion.div>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20">
                    <Zap className="h-4 w-4 text-success" />
                    <span className="text-sm text-success">
                      Pro users see 3x more qualified leads than free users
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {searchMutation.isError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-destructive/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-destructive">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Search failed</p>
                  <p className="text-sm opacity-80">
                    {searchMutation.error.message}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Results */}
      {sortedLeads.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold">
                {sortedLeads.length} leads found
              </h2>
              {proEnabled && leadScores.size > 0 && (
                <Badge variant="secondary">sorted by score</Badge>
              )}
            </div>
            {proEnabled && !isEnriching && discoveredLeads.length > 0 && leadScores.size === 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => enrichLeads(discoveredLeads)}
                className="gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Analyze
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
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="cursor-pointer"
                  onClick={() => setSelectedLead(lead)}
                >
                  <Card hover className="h-full relative overflow-hidden group">
                    {/* Score indicator bar */}
                    {scoringResult && (
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                        scoringResult.totalScore >= 80 ? 'from-rose to-warm' :
                        scoringResult.totalScore >= 60 ? 'from-warm to-yellow-500' :
                        'from-cold to-blue-500'
                      }`} />
                    )}

                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base line-clamp-1 font-medium">
                          {lead.businessName}
                        </CardTitle>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {scoringResult && (
                            <Badge variant={getScoreBadgeVariant(scoringResult.totalScore)}>
                              <Zap className="h-3 w-3 mr-0.5" />
                              <CountUpScore value={scoringResult.totalScore} delay={index * 0.05} />
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {lead.city}, {lead.state}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Pro Intelligence Insights */}
                      {scoringResult && opportunityValue && (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-primary">
                              ${opportunityValue.monthly}/mo opportunity
                            </p>
                            <p className="text-2xs text-muted-foreground truncate">
                              {scoringResult.opportunities.length} gap{scoringResult.opportunities.length !== 1 ? 's' : ''} found
                            </p>
                          </div>
                        </div>
                      )}

                      {lead.googleRating && (
                        <div className="flex items-center gap-1.5">
                          <Star className="h-4 w-4 fill-amber text-warm" />
                          <span className="text-sm font-medium">
                            {lead.googleRating.toFixed(1)}
                          </span>
                          {lead.reviewCount && (
                            <span className="text-sm text-muted-foreground">
                              ({lead.reviewCount})
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        {lead.email && (
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            className="opacity-60 hover:opacity-100"
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
                            size="icon-sm"
                            variant="ghost"
                            className="opacity-60 hover:opacity-100"
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
                            size="icon-sm"
                            variant="ghost"
                            className="opacity-60 hover:opacity-100"
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
                            size="icon-sm"
                            variant="ghost"
                            className="opacity-60 hover:opacity-100"
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
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className={`ml-auto transition-opacity ${
                            isLeadSaved(lead.id)
                              ? 'opacity-100 text-primary'
                              : 'opacity-0 group-hover:opacity-100'
                          }`}
                          onClick={(e) => handleToggleSave(lead, e)}
                        >
                          {isLeadSaved(lead.id) ? (
                            <BookmarkCheck className="h-4 w-4" />
                          ) : (
                            <Bookmark className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAddToPipeline(lead)
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Loading Skeletons */}
      {isSearching && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <div className="h-5 w-3/4 rounded-md shimmer" />
                <div className="h-4 w-1/2 rounded-md shimmer mt-2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-4 w-1/3 rounded-md shimmer" />
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-lg shimmer" />
                  <div className="h-8 w-8 rounded-lg shimmer" />
                  <div className="h-8 w-8 rounded-lg shimmer" />
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
                <DialogTitle className="text-xl flex items-center gap-2">
                  {selectedLead.businessName}
                  {leadScores.get(selectedLead.id) && (
                    <Badge variant={getScoreBadgeVariant(leadScores.get(selectedLead.id)!.totalScore)}>
                      {leadScores.get(selectedLead.id)!.totalScore}/100
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription>
                  <Badge variant="secondary">{selectedLead.category}</Badge>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-surface">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Address</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedLead.address && `${selectedLead.address}, `}
                      {selectedLead.city}, {selectedLead.state}
                      {selectedLead.zip && ` ${selectedLead.zip}`}
                    </p>
                  </div>
                </div>

                {selectedLead.phone && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-surface">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Phone</p>
                      <a
                        href={`tel:${selectedLead.phone}`}
                        className="text-sm text-cold hover:underline"
                      >
                        {selectedLead.phone}
                      </a>
                    </div>
                  </div>
                )}

                {selectedLead.email && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-surface">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Email</p>
                      <a
                        href={`mailto:${selectedLead.email}`}
                        className="text-sm text-cold hover:underline"
                      >
                        {selectedLead.email}
                      </a>
                    </div>
                  </div>
                )}

                {selectedLead.website && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-surface">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Website</p>
                      <a
                        href={selectedLead.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-cold hover:underline flex items-center gap-1"
                      >
                        {selectedLead.website}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}

                {selectedLead.instagram && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-surface">
                      <Instagram className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Instagram</p>
                      <a
                        href={`https://instagram.com/${selectedLead.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-cold hover:underline flex items-center gap-1"
                      >
                        {selectedLead.instagram}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}

                {selectedLead.facebook && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-surface">
                      <Facebook className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Facebook</p>
                      <a
                        href={selectedLead.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-cold hover:underline flex items-center gap-1"
                      >
                        View Profile
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}

                {selectedLead.linkedin && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-surface">
                      <Linkedin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">LinkedIn</p>
                      <a
                        href={selectedLead.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-cold hover:underline flex items-center gap-1"
                      >
                        View Profile
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}

                {selectedLead.googleRating && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-warm/10">
                      <Star className="h-4 w-4 text-warm" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Rating</p>
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
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleToggleSave(selectedLead)}
                  className={isLeadSaved(selectedLead.id) ? 'text-primary' : ''}
                >
                  {isLeadSaved(selectedLead.id) ? (
                    <BookmarkCheck className="h-4 w-4" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </Button>
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
                  className="flex-1 gap-2"
                  onClick={() => handleAddToPipeline(selectedLead)}
                >
                  <Plus className="h-4 w-4" />
                  Add to Pipeline
                  <ArrowRight className="h-4 w-4 ml-auto" />
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

      {/* Pro Upgrade Modal */}
      <ProUpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        onUpgrade={handleUpgrade}
      />
    </div>
  )
}
