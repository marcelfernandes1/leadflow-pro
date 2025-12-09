import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { fadeInUp, staggerContainer } from '../../../lib/animations'
import { ScoreBadge } from '../../ui/ScoreGauge'
import { Search, Zap, ArrowRight, MapPin, Star, Building2, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function LeadDiscoveryFeature() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleSearch = () => {
    setIsSearching(true)
    setShowResults(false)
    setTimeout(() => {
      setIsSearching(false)
      setShowResults(true)
    }, 2000)
  }

  const mockLeads = [
    { name: 'Apex Marketing Solutions', score: 94, location: 'Miami, FL', rating: 4.2, employees: '25-50' },
    { name: 'Digital Growth Agency', score: 87, location: 'Miami, FL', rating: 4.5, employees: '10-25' },
    { name: 'Coastal Media Group', score: 82, location: 'Miami, FL', rating: 4.8, employees: '50-100' },
    { name: 'Sunshine Creative', score: 76, location: 'Miami, FL', rating: 4.1, employees: '10-25' },
  ]

  return (
    <section ref={ref} className="py-24 bg-base relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-void via-base to-void" />

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          className="max-w-5xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <Search className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Feature Spotlight</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Find 500 Ready-To-Buy Leads In{' '}
              <span className="text-primary">30 Seconds</span>
            </h2>
            <p className="text-muted-foreground">(Not 30 Hours)</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <p className="text-lg text-muted-foreground">
                Remember when you used to spend entire afternoons building lead lists?
              </p>

              <p className="text-muted-foreground">
                Searching Google Maps. Cross-referencing LinkedIn. Copying names into spreadsheets.
                Verifying emails. Checking websites.
              </p>

              <p className="text-foreground">
                <span className="text-destructive font-semibold">4 hours</span> to build a list of 100 leads.
                And then 97 of them never responded anyway.
              </p>

              <p className="text-xl font-semibold text-foreground">What a waste.</p>

              <div className="pt-4">
                <p className="text-foreground font-semibold mb-4">With LeadFlow Pro:</p>
                <ol className="space-y-3">
                  {[
                    'Type your target: "Dentists in Miami"',
                    'Click search',
                    'Wait 30 seconds',
                    'Get 500 leads with contact info, scored and ranked',
                  ].map((step, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-medium flex items-center justify-center">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <p className="text-muted-foreground">That's it.</p>

              <div className="p-4 rounded-xl bg-surface/50 border border-border/50">
                <p className="text-foreground font-semibold mb-2">
                  But here's what makes this DIFFERENT from every other scraper:
                </p>
                <p className="text-foreground">
                  You don't get a random list. You get a{' '}
                  <span className="text-primary font-semibold">PRIORITIZED</span> list.
                </p>
                <p className="text-muted-foreground mt-2">
                  Hottest leads at the top. Time-wasters at the bottom.
                </p>
              </div>
            </motion.div>

            {/* Right - Interactive Demo */}
            <motion.div variants={fadeInUp}>
              <div className="p-6 rounded-2xl bg-card/70 backdrop-blur-xl border border-border/50 shadow-xl">
                {/* Search Input */}
                <div className="mb-6">
                  <label className="text-sm text-muted-foreground mb-2 block">Target Search</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Marketing agencies in Chicago"
                      className="w-full h-12 px-4 rounded-lg bg-surface border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <Button
                      size="sm"
                      className="absolute right-2 top-2"
                      onClick={handleSearch}
                      disabled={isSearching}
                    >
                      {isSearching ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Scanning...
                        </span>
                      ) : (
                        <>
                          <Search className="w-4 h-4 mr-2" />
                          Search
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Progress */}
                {isSearching && (
                  <motion.div
                    className="mb-6 p-4 rounded-lg bg-surface/50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      <span className="text-sm text-muted-foreground">Finding leads and scoring intent...</span>
                    </div>
                    <div className="h-2 bg-surface rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2, ease: 'linear' }}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Results */}
                {showResults && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">
                        Found <span className="text-foreground font-semibold">487</span> leads
                      </span>
                      <span className="text-xs text-success flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Scored & ranked
                      </span>
                    </div>

                    <div className="space-y-3">
                      {mockLeads.map((lead, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-4 rounded-lg bg-surface/50 border border-border/30 hover:border-primary/30 transition-colors cursor-pointer"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-foreground">{lead.name}</h4>
                              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {lead.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Star className="w-3 h-3 text-warm" />
                                  {lead.rating}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Building2 className="w-3 h-3" />
                                  {lead.employees}
                                </span>
                              </div>
                            </div>
                            <ScoreBadge score={lead.score} />
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            <button className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                              <Mail className="w-3 h-3" />
                              Email
                            </button>
                            <button className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-surface hover:bg-surface/80 transition-colors text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              Call
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <p className="text-xs text-muted-foreground text-center mt-4">
                      +483 more leads available...
                    </p>
                  </motion.div>
                )}

                {!isSearching && !showResults && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Enter a search query to see the magic</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* The Math */}
          <motion.div variants={fadeInUp} className="mt-16">
            <div className="p-8 rounded-2xl bg-surface/30 border border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-6 text-center">The math is simple:</h3>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 rounded-xl bg-destructive/10 border border-destructive/30">
                  <h4 className="font-semibold text-destructive mb-4">Old Way</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">100 calls</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">3 conversations</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex justify-between font-semibold text-foreground">
                      <span>1 deal</span>
                      <span className="text-destructive">😤</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-success/10 border border-success/30">
                  <h4 className="font-semibold text-success mb-4">LeadFlow Pro Way</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">25 calls (to top-scored leads)</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">8 conversations</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex justify-between font-semibold text-foreground">
                      <span>3 deals</span>
                      <span className="text-success">🎉</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-center mt-6 text-foreground">
                <span className="font-semibold">Same effort. 3x results.</span>
                <br />
                <span className="text-muted-foreground">Actually, not the same effort. Less effort. Better results.</span>
              </p>

              <p className="text-center mt-4 text-lg font-semibold text-primary">
                That's not grinding. That's engineering.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
