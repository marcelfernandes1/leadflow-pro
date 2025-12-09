import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { fadeInUp, staggerContainer } from '../../lib/animations'
import { Button } from '@/components/ui/button'
import { ScoreGauge } from '../ui/ScoreGauge'
import {
  Eye, Zap, Target, Sparkles, ArrowRight,
  Globe, Briefcase, Activity, TrendingUp
} from 'lucide-react'

interface MechanismRevealProps {
  onCtaClick: () => void
}

export function MechanismReveal({ onCtaClick }: MechanismRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-24 bg-base relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-void via-base to-void" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <span className="text-xs uppercase tracking-wider text-primary font-medium mb-4 block">
              INTRODUCING: The "Lead Intelligence" Breakthrough
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              What If You Could See Inside Every Prospect's Business{' '}
              <span className="text-primary">Before You Ever Reached Out?</span>
            </h2>
          </motion.div>

          {/* X-Ray Vision Intro */}
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <p className="text-lg text-muted-foreground mb-4">
              Imagine having <span className="text-foreground font-semibold">x-ray vision</span> for sales.
            </p>
            <p className="text-foreground">
              Before you send an email or pick up the phone, you already know:
            </p>
          </motion.div>

          {/* The Three Questions */}
          <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: Target,
                question: 'Do they NEED what I sell?',
                answer: 'What technology are they missing?',
              },
              {
                icon: Briefcase,
                question: 'Can they AFFORD what I sell?',
                answer: 'Are they growing or struggling?',
              },
              {
                icon: Zap,
                question: 'Are they ready to buy NOW?',
                answer: 'What signals indicate timing?',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-card/50 backdrop-blur-xl border border-border/50 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">{item.question}</h4>
                <p className="text-sm text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp} className="text-center mb-16">
            <p className="text-lg text-foreground">
              Not guessing. <span className="text-primary font-bold">KNOWING.</span>
            </p>
            <p className="text-muted-foreground mt-2">
              This isn't fantasy. This is Lead Intelligence.
            </p>
          </motion.div>

          {/* How It Works */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-xl font-semibold text-foreground mb-8 text-center">
              Here's how it works:
            </h3>

            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">1</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-3">We scan their digital footprint</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      'Website tech stack',
                      'Job postings',
                      'Website changes',
                      'Review patterns',
                      'Social signals',
                      'Growth velocity',
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm text-muted-foreground p-2 rounded-lg bg-surface/30"
                      >
                        <Globe className="w-4 h-4 text-primary flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">2</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-3">We analyze 23 distinct buying signals</h4>
                  <p className="text-muted-foreground text-sm">
                    Each signal is weighted based on its correlation with closed deals.
                    We've analyzed <span className="text-foreground font-semibold">100,000+ leads</span> to perfect the algorithm.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">3</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-3">We calculate a Lead Score (0-100)</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    <ScoreIndicator score={95} label="HOT" emoji="🔥" description="Drop everything and call NOW" color="hot" />
                    <ScoreIndicator score={75} label="WARM" emoji="🌡️" description="High priority, nurture sequence" color="warm" />
                    <ScoreIndicator score={55} label="COOL" emoji="🧊" description="Possible fit, check back later" color="cold" />
                    <ScoreIndicator score={25} label="COLD" emoji="⬜" description="Don't waste your time" color="muted" />
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">4</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-3">We show you exactly WHY they'll buy</h4>

                  {/* Intelligence Card Mock */}
                  <div className="p-6 rounded-xl bg-card/70 backdrop-blur-xl border border-border/50">
                    <div className="flex items-start gap-6">
                      <ScoreGauge score={94} size="lg" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-lg font-semibold text-foreground">Johnson & Co</span>
                          <span className="text-sm text-success font-medium">$5,500/mo opportunity</span>
                        </div>
                        <h5 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                          Why They'll Close:
                        </h5>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <TrendingUp className="w-4 h-4 text-success mt-0.5" />
                            <span className="text-foreground">No CRM detected <span className="text-muted-foreground">(you can sell them one)</span></span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Activity className="w-4 h-4 text-success mt-0.5" />
                            <span className="text-foreground">Posted Marketing Manager job 3 days ago <span className="text-muted-foreground">(budget unlocked)</span></span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Globe className="w-4 h-4 text-success mt-0.5" />
                            <span className="text-foreground">Website redesigned 6 weeks ago <span className="text-muted-foreground">(investment mode)</span></span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Eye className="w-4 h-4 text-warm mt-0.5" />
                            <span className="text-foreground">4.2 rating with negative reviews about 'slow response' <span className="text-muted-foreground">(they need help)</span></span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Revelation */}
          <motion.div variants={fadeInUp} className="mt-16 text-center">
            <p className="text-lg text-muted-foreground mb-4">
              You're not calling a "lead."
            </p>
            <p className="text-xl text-foreground font-semibold mb-6">
              You're calling someone who <span className="text-success">NEEDS</span> you, can{' '}
              <span className="text-success">AFFORD</span> you, and is ready <span className="text-success">NOW</span>.
            </p>
            <p className="text-foreground">
              That's the difference between{' '}
              <span className="text-destructive">3% close rates</span> and{' '}
              <span className="text-success font-bold">30% close rates</span>.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeInUp} className="mt-12 text-center">
            <Button
              size="lg"
              onClick={onCtaClick}
              className="group bg-primary hover:bg-primary/90 text-white font-semibold shadow-xl shadow-primary/25"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              See Your First Scored Lead In 60 Seconds
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Free. No credit card. No commitment.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function ScoreIndicator({
  score,
  label,
  emoji,
  description,
  color,
}: {
  score: number
  label: string
  emoji: string
  description: string
  color: 'hot' | 'warm' | 'cold' | 'muted'
}) {
  const colors = {
    hot: 'bg-hot/20 text-hot border-hot/30',
    warm: 'bg-warm/20 text-warm border-warm/30',
    cold: 'bg-cold/20 text-cold border-cold/30',
    muted: 'bg-muted/20 text-muted-foreground border-muted/30',
  }

  return (
    <div className={`p-4 rounded-xl border ${colors[color]} text-center`}>
      <div className="text-2xl mb-1">{emoji}</div>
      <div className="text-xs font-medium mb-1">{score}-{score === 95 ? '100' : score + 19}</div>
      <div className="font-semibold text-sm">{label}</div>
      <div className="text-xs mt-1 opacity-80">{description}</div>
    </div>
  )
}
