import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { fadeInUp, staggerContainer } from '../../lib/animations'
import { HighlightText } from '../ui/HighlightText'
import { AlertTriangle, Clock, TrendingDown } from 'lucide-react'

export function ProblemSpiral() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-24 bg-base relative overflow-hidden">
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-hot/5 to-transparent" />

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          className="max-w-3xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <span className="text-xs uppercase tracking-wider text-hot font-medium mb-4 block">
              The Uncomfortable Truth
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              The Cold Outreach Death Spiral
            </h2>
            <p className="text-muted-foreground">
              (And Why It's Killing Your Agency)
            </p>
          </motion.div>

          {/* The Story */}
          <motion.div variants={fadeInUp} className="space-y-6 text-left">
            <p className="text-lg text-muted-foreground">
              Let me describe your week. Tell me if this sounds familiar.
            </p>

            <div className="space-y-4 text-foreground leading-relaxed">
              <p>
                <span className="font-semibold text-warm">Monday:</span> You pull a list of 200 leads from your database.
                You spend 2 hours "researching" them — which really means clicking through LinkedIn profiles and
                websites, looking for <em>SOMETHING</em> to personalize.
              </p>

              <p>
                <span className="font-semibold text-warm">Tuesday:</span> You send 100 cold emails. Your "personalization"?
                Their first name and company. Maybe you mention their city. <span className="text-muted-foreground italic">Revolutionary.</span>
              </p>

              <p>
                <span className="font-semibold text-warm">Wednesday:</span> 3 responses. Two are "not interested."
                One is "send me more information" — which you know means nothing.
              </p>

              <p>
                <span className="font-semibold text-warm">Thursday:</span> You make 50 cold calls. 40 go to voicemail.
                8 hang up. 2 have brief conversations that go nowhere.
              </p>

              <p>
                <span className="font-semibold text-warm">Friday:</span> You repeat Tuesday's email batch. You tell
                yourself <HighlightText variant="yellow">"it's a numbers game."</HighlightText>
              </p>

              <p>
                <span className="font-semibold text-muted-foreground">Saturday-Sunday:</span> You think about how much
                you hate prospecting. You wonder if there's a better way. You tell yourself Monday will be different.
              </p>

              <p className="text-hot font-semibold text-lg">
                Monday: It's not different.
              </p>
            </div>

            <div className="my-8 text-center">
              <span className="text-2xl font-bold text-hot">THIS IS THE DEATH SPIRAL.</span>
            </div>
          </motion.div>

          {/* The Math */}
          <motion.div
            variants={fadeInUp}
            className="my-12 p-8 rounded-2xl bg-surface/50 border border-border/50"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-hot" />
              Here's the math:
            </h3>

            <div className="space-y-3 font-mono text-sm">
              <div className="flex items-center justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">Leads contacted per week</span>
                <span className="text-foreground font-semibold">200</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">Response rate (2-3%)</span>
                <span className="text-foreground font-semibold">4-6 responses</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">50% are "not interested"</span>
                <span className="text-foreground font-semibold">2-3 real conversations</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">25% book calls</span>
                <span className="text-foreground font-semibold">&lt; 1 call per week</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">25% of calls close</span>
                <span className="text-hot font-semibold">1 new client per MONTH (if lucky)</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border/30 text-center">
              <p className="text-muted-foreground mb-2">To close 1 client, you're burning through</p>
              <p className="text-4xl font-bold text-foreground mb-2">800 leads</p>
              <p className="text-muted-foreground">
                And spending <span className="text-foreground font-semibold">15-20 hours per week</span> doing it.
              </p>
            </div>
          </motion.div>

          {/* The Real Cost */}
          <motion.div variants={fadeInUp} className="space-y-6">
            <p className="text-lg text-foreground">
              <span className="font-semibold">That's 80+ hours per month for ONE client.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center text-muted-foreground">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-warm" />
                What else could you do with 80 hours?
              </span>
              <span className="hidden sm:block">•</span>
              <span>What's your hourly rate?</span>
              <span className="hidden sm:block">•</span>
              <span>What's that costing you?</span>
            </div>

            <div className="mt-8 p-6 rounded-xl bg-hot/10 border border-hot/30">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-hot flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-foreground font-semibold mb-2">
                    But here's the part that should make you ANGRY:
                  </p>
                  <p className="text-lg text-foreground">
                    <HighlightText variant="hot">97% of those 800 leads were NEVER going to buy.</HighlightText>
                  </p>
                  <p className="text-muted-foreground mt-2">
                    They didn't need what you sell. Or couldn't afford it. Or weren't ready.
                  </p>
                  <p className="text-foreground mt-4">
                    You spent <span className="font-semibold">78 hours per month</span> reaching out to people
                    who were <span className="text-hot font-semibold">NEVER</span> going to become clients.
                  </p>
                  <p className="text-muted-foreground mt-2">
                    And no one told you which ones were the 3% that would.
                  </p>
                  <p className="text-foreground font-semibold mt-4 text-lg">
                    Until now.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Transition */}
          <motion.div variants={fadeInUp} className="mt-16 text-center">
            <p className="text-xl text-muted-foreground">
              But what if you could{' '}
              <span className="text-primary font-semibold">skip the 97%</span>{' '}
              and go straight to the 3%?
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
