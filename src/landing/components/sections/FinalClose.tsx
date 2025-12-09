import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { fadeInUp, staggerContainer } from '../../lib/animations'
import { Button } from '@/components/ui/button'
import { SpotsCounter } from '../urgency/SpotsCounter'
import { urgencyConfig } from '../../lib/urgencyConfig'
import { Sparkles, ArrowRight, AlertTriangle, Shield, CheckCircle } from 'lucide-react'

interface FinalCloseProps {
  onCtaClick: () => void
}

export function FinalClose({ onCtaClick }: FinalCloseProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-24 bg-gradient-to-b from-base via-void to-void relative overflow-hidden">
      {/* Dramatic gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          className="max-w-3xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Pre-headline */}
          <motion.div variants={fadeInUp} className="text-center mb-8">
            <span className="text-muted-foreground">
              You've scrolled this far. You already know what you need to do.
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h2
            variants={fadeInUp}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-center mb-12"
          >
            The Only Question Is:{' '}
            <span className="text-primary">Are You Going To Act On It?</span>
          </motion.h2>

          {/* The Letter */}
          <motion.div variants={fadeInUp} className="space-y-6 text-left mb-12">
            <p className="text-muted-foreground">
              Let me be real with you.
            </p>

            <p className="text-muted-foreground">
              I know what's happening in your head right now.
            </p>

            <p className="text-foreground">
              Part of you is excited. You can see how this could change everything.
            </p>

            <p className="text-foreground">
              But another part is saying:{' '}
              <span className="italic">"I'll check this out later."</span>
            </p>

            <p className="text-muted-foreground">
              I've seen this movie before. Here's how it ends:
            </p>

            <div className="p-6 rounded-xl bg-surface/30 border border-border/30 space-y-2 text-muted-foreground">
              <p>You close this tab.</p>
              <p>You get distracted by an email.</p>
              <p>You forget about this conversation.</p>
              <p>You wake up tomorrow and do the same thing you did yesterday.</p>
              <p className="text-foreground pt-4">100 cold calls. 3 responses. 0 closes.</p>
              <p className="text-hot font-semibold">The Death Spiral continues.</p>
            </div>

            <p className="text-foreground">
              Meanwhile, the {urgencyConfig.metrics.signupsThisWeek} agencies who signed up this week?
              They're scoring leads. They're closing deals. They're building the business you want.
            </p>

            <p className="text-lg font-semibold text-foreground">
              Every day you wait, the gap gets wider.
            </p>

            <div className="my-8 p-6 rounded-xl bg-primary/10 border border-primary/30 text-center">
              <p className="text-2xl font-bold text-foreground">This is the moment.</p>
              <p className="text-muted-foreground mt-2">
                Not tomorrow. Not "when things slow down." Not "after I think about it."
              </p>
              <p className="text-primary font-semibold text-lg mt-2">Now.</p>
            </div>

            <p className="text-foreground">
              You've read the testimonials. You've seen the math. You've imagined the future.
            </p>

            <p className="text-foreground font-semibold">
              You know this works.
            </p>

            <p className="text-muted-foreground">
              The only thing between you and more closed deals is clicking a button.
            </p>

            <p className="text-muted-foreground">
              A free button. No credit card required.
            </p>

            <p className="text-lg text-foreground font-semibold">
              So let me ask you:
            </p>

            <p className="text-foreground">
              What are you afraid of?
            </p>

            <ul className="space-y-2 text-muted-foreground">
              <li>That it won't work? <span className="text-foreground">(There's a free tier. Test it.)</span></li>
              <li>That it costs too much? <span className="text-foreground">(It costs less than the deals you're losing.)</span></li>
              <li>That it's too complicated? <span className="text-foreground">(It takes 60 seconds to see your first lead.)</span></li>
            </ul>

            <p className="text-foreground">
              None of those are real objections.
            </p>

            <p className="text-foreground font-semibold">
              The real objection is change.
            </p>

            <p className="text-muted-foreground">
              Change is scary. The status quo is comfortable.
            </p>

            <p className="text-foreground">
              But the status quo is also <span className="text-hot font-semibold">COSTING</span> you:
            </p>

            <ul className="space-y-1 text-foreground">
              <li>• ${urgencyConfig.lossCalculations.monthlyLostRevenue.toLocaleString()}+/month in missed revenue</li>
              <li>• {urgencyConfig.lossCalculations.hoursWastedPerMonth}+ hours/month in wasted time</li>
              <li>• Deals going to competitors</li>
              <li>• Stress, frustration, burnout</li>
            </ul>

            <p className="text-foreground">
              Is that comfort worth it?
            </p>

            <div className="my-8 text-center">
              <p className="text-2xl font-bold text-primary">Enough.</p>
            </div>

            <p className="text-foreground">
              You didn't start an agency to grind through cold lists.
            </p>

            <p className="text-foreground">
              You started an agency for <span className="font-semibold">freedom</span>,{' '}
              <span className="font-semibold">impact</span>, and <span className="font-semibold">income</span>.
            </p>

            <p className="text-foreground font-semibold text-lg">
              LeadFlow Pro is the bridge.
            </p>

            <p className="text-primary font-bold text-xl">
              Cross it.
            </p>
          </motion.div>

          {/* Final CTA */}
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <Button
              size="xl"
              onClick={onCtaClick}
              className="group bg-primary hover:bg-primary/90 text-white font-semibold shadow-2xl shadow-primary/30 px-12 py-6 text-lg animate-pulse-glow"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Show Me My Hot Leads
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-success" />
                Free forever tier - no credit card
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-success" />
                See scored leads in 60 seconds
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-success" />
                14-day Pro trial
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-success" />
                Full money-back guarantee
              </span>
            </div>

            {/* Testimonial */}
            <p className="mt-6 text-sm text-muted-foreground italic">
              "I closed $47,000 in my first month. Don't wait like I almost did."
              <br />
              <span className="not-italic text-foreground">— Sarah Chen, GrowthPilot Agency</span>
            </p>
          </motion.div>

          {/* Scarcity Reinforcement */}
          <motion.div variants={fadeInUp}>
            <div className="p-6 rounded-xl bg-hot/10 border border-hot/30">
              <div className="flex items-center justify-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-hot" />
                <span className="text-sm font-semibold text-hot uppercase tracking-wider">
                  Founding Member Pricing Ends Soon
                </span>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 text-center mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Current price</p>
                  <p className="text-lg font-bold text-success">$149/month</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Price after 1,000 users</p>
                  <p className="text-lg font-bold text-foreground line-through opacity-50">$299/month</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Current users</p>
                  <p className="text-lg font-bold text-foreground tabular-nums">{urgencyConfig.currentUsers}</p>
                </div>
              </div>

              <SpotsCounter className="mb-4" />

              <p className="text-sm text-center text-muted-foreground">
                When they're gone, they're gone.
              </p>

              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  onClick={onCtaClick}
                  className="border-hot/50 text-hot hover:bg-hot/10"
                >
                  Lock In My Founding Price
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* P.S. */}
          <motion.div variants={fadeInUp} className="mt-12 text-center">
            <p className="text-muted-foreground text-sm">
              <span className="font-semibold text-foreground">P.S.</span> — Still scrolling? Here's the bottom line:
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              You can keep doing what you're doing and keep getting what you're getting.
            </p>
            <p className="text-foreground text-sm mt-2">
              Or you can try something different for <span className="text-success font-semibold">FREE</span> and potentially change everything.
            </p>
            <p className="text-muted-foreground text-sm mt-4">
              The only cost of trying is 60 seconds.
              <br />
              The cost of NOT trying is $72,000+/year in lost revenue.
            </p>
            <button
              onClick={onCtaClick}
              className="mt-4 text-primary hover:text-primary/80 font-medium underline"
            >
              Show Me My Hot Leads →
            </button>
            <p className="text-xs text-muted-foreground mt-4">
              We'll be here when you're ready. But your competitors won't wait.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
