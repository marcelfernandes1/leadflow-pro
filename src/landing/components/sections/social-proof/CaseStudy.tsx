import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { fadeInUp, staggerContainer } from '../../../lib/animations'
import { Button } from '@/components/ui/button'
import { ArrowRight, Quote, Clock, DollarSign, Sparkles } from 'lucide-react'

interface CaseStudyProps {
  onCtaClick: () => void
}

export function CaseStudy({ onCtaClick }: CaseStudyProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-24 bg-base relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-void via-base to-void" />

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <span className="text-xs uppercase tracking-wider text-success font-medium mb-4 block">
              Case Study
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              How A One-Person Agency Added{' '}
              <span className="text-success">$127,000/Year</span>
            </h2>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <div className="p-8 lg:p-12 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
              {/* The Situation */}
              <div className="mb-10">
                <h3 className="text-lg font-semibold text-foreground mb-4 uppercase tracking-wider text-sm">
                  The Situation
                </h3>
                <p className="text-muted-foreground mb-4">
                  Rachel Kim runs a solo marketing agency in Denver.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30">
                    <h4 className="text-sm font-semibold text-destructive mb-3">Before LeadFlow Pro</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• 200 cold emails/week</li>
                      <li>• 2-3% response rate</li>
                      <li>• 4 meetings/month</li>
                      <li>• 1 new client/month</li>
                      <li>• $35K/year from outreach</li>
                      <li>• 25 hours/week on prospecting</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-surface/50">
                    <Quote className="w-8 h-8 text-muted-foreground mb-3 opacity-50" />
                    <p className="text-foreground italic">
                      "I was drowning. Spending half my week on cold outreach that barely worked.
                      I knew there had to be a better way but I'd tried everything."
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">— Rachel Kim</p>
                  </div>
                </div>
              </div>

              {/* The Change */}
              <div className="mb-10">
                <h3 className="text-lg font-semibold text-foreground mb-4 uppercase tracking-wider text-sm">
                  The Change
                </h3>
                <p className="text-muted-foreground mb-4">
                  Rachel signed up for LeadFlow Pro's free tier on a Tuesday.
                </p>

                <div className="p-6 rounded-xl bg-primary/10 border border-primary/30 mb-6">
                  <p className="text-foreground">
                    "Within 10 minutes I had 100 leads scored. I saw one scored{' '}
                    <span className="text-primary font-bold">94</span> — missing CRM, just posted a sales job,
                    website redesigned last month. I reached out that afternoon."
                  </p>
                </div>

                <p className="text-lg text-foreground text-center mb-6">
                  That lead closed <span className="text-success font-bold">8 days later</span>.
                  <br />
                  <span className="text-success font-bold text-2xl">$4,500/month</span> contract.
                </p>

                <div className="p-4 rounded-xl bg-success/10 border border-success/30 text-center">
                  <p className="text-foreground font-medium">
                    "One lead. 94 score. $54,000/year. In my first week.
                    <br />
                    <span className="text-success font-semibold">I upgraded to Pro immediately.</span>"
                  </p>
                </div>
              </div>

              {/* The Results */}
              <div className="mb-10">
                <h3 className="text-lg font-semibold text-foreground mb-4 uppercase tracking-wider text-sm">
                  The Results (90 Days)
                </h3>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-success/10 border border-success/30">
                    <h4 className="text-sm font-semibold text-success mb-3">After LeadFlow Pro</h4>
                    <ul className="space-y-2 text-sm text-foreground">
                      <li>• 50 targeted emails/week (to 80+ scored leads only)</li>
                      <li>• <span className="text-success font-semibold">15%</span> response rate</li>
                      <li>• <span className="text-success font-semibold">12</span> meetings/month</li>
                      <li>• <span className="text-success font-semibold">4-5</span> new clients/month</li>
                      <li>• <span className="text-success font-semibold">$162K/year</span> from outreach</li>
                      <li>• <span className="text-success font-semibold">8</span> hours/week on prospecting</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-success/20 border border-success/30 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-success" />
                        <span className="text-sm text-muted-foreground">Revenue Impact</span>
                      </div>
                      <p className="text-3xl font-bold text-success">+$127,000/year</p>
                    </div>
                    <div className="p-4 rounded-xl bg-primary/20 border border-primary/30 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-primary" />
                        <span className="text-sm text-muted-foreground">Time Savings</span>
                      </div>
                      <p className="text-3xl font-bold text-primary">17 hours/week</p>
                      <p className="text-xs text-muted-foreground">(68 hours/month)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div className="p-6 rounded-xl bg-surface/50 border border-border/30">
                <Quote className="w-8 h-8 text-primary mb-3" />
                <p className="text-lg text-foreground italic mb-4">
                  "I'm working less and earning more. My only regret is not finding this sooner.
                  Every month I waited was $10K+ I left on the table."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                    RK
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Rachel Kim</p>
                    <p className="text-sm text-muted-foreground">Founder, Elevate Digital Marketing</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 text-center">
                <Button
                  size="lg"
                  onClick={onCtaClick}
                  className="group bg-primary hover:bg-primary/90 text-white font-semibold shadow-xl shadow-primary/25"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  See Your Hot Leads Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
