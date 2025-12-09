import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { fadeInUp, staggerContainer } from '../../lib/animations'
import { Button } from '@/components/ui/button'
import { urgencyConfig } from '../../lib/urgencyConfig'
import { Sparkles, Mail, Zap, Bell, Lock, ArrowRight } from 'lucide-react'

export function FutureFeatures() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const features = [
    {
      icon: Sparkles,
      title: 'AI Outreach Writer',
      timeline: 'Q1 2025',
      description: `What if every email you sent was perfectly personalized - without spending 20 minutes writing it?

Our AI reads the intelligence report (tech gaps, growth signals, pain points) and generates hyper-personalized emails in 3 seconds.

Not templates with [FIRST NAME] merge fields. Real emails that reference THEIR specific situation.`,
      example: `"Hi Sarah - I noticed TechCorp.io is using Mailchimp but doesn't have any automation set up. Given your recent Marketing Manager job posting, I'm guessing email automation is about to become a priority. I helped a similar company in Austin increase their email revenue by 340% in 60 days. Worth a quick conversation?"`,
      waitlist: urgencyConfig.earlyAccess.aiOutreach,
      ctaText: 'Join Early Access Waitlist',
      benefit: 'First 200 sign-ups get it FREE for life',
    },
    {
      icon: Mail,
      title: 'Automated Email Sequences',
      timeline: 'Q1 2025',
      description: `Set it. Forget it. Close deals while you sleep.

1. Find hot leads (score 80+)
2. Click "Add to Sequence"
3. We handle the rest:

Day 1: Personalized outreach (AI-written)
Day 3: Value-add follow-up
Day 7: Case study or social proof
Day 14: "Checking in" touch
Day 21: Breakup email

Every email personalized. Every reply detected. Every meeting booked.`,
      waitlist: urgencyConfig.earlyAccess.autoSequences,
      ctaText: 'Join Early Access Waitlist',
      benefit: 'First 150 users get 50% off for life',
    },
    {
      icon: Bell,
      title: 'Real-Time Trigger Alerts',
      timeline: 'Q2 2025',
      description: `Get notified the MOMENT a lead becomes ready to buy.

Your phone buzzes:

"🔥 TRIGGER ALERT: Johnson & Co
→ Just posted job: 'Marketing Manager'
→ Score increased: 67 → 91
→ Recommendation: Call within 24 hours"

Reach out within 24 hours of a trigger event = 3x higher close rate.

Other alerts:
• Website went down (they need help!)
• New negative review (pain point emerged)
• Competitor lost a client (opening!)
• Company got funding (budget unlocked)`,
      waitlist: urgencyConfig.earlyAccess.triggerAlerts,
      ctaText: 'Join Early Access Waitlist',
      benefit: 'First 100 users get lifetime access',
    },
  ]

  return (
    <section ref={ref} className="py-24 bg-void relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

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
              Coming Soon
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              What's Coming Next Will Make This Even{' '}
              <span className="text-primary">MORE Unfair</span>...
            </h2>
            <p className="text-muted-foreground">
              (Early Access Available)
            </p>
          </motion.div>

          <motion.p variants={fadeInUp} className="text-center text-muted-foreground mb-12">
            LeadFlow Pro is already the most advanced lead intelligence platform for agencies.
            But we're just getting started. Here's what's launching in the next 90 days — and how to get it before anyone else:
          </motion.p>

          {/* Features */}
          <div className="space-y-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-primary/20">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                        <span className="text-sm text-muted-foreground">Early Access: {feature.timeline}</span>
                      </div>
                    </div>

                    <div className="text-muted-foreground whitespace-pre-line text-sm leading-relaxed mb-6">
                      {feature.description}
                    </div>

                    {feature.example && (
                      <div className="p-4 rounded-lg bg-surface/50 border border-border/30 mb-6">
                        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Example Output:</p>
                        <p className="text-sm text-foreground italic">"{feature.example}"</p>
                      </div>
                    )}
                  </div>

                  <div className="lg:w-72 flex-shrink-0">
                    <div className="p-6 rounded-xl bg-surface/50 border border-border/50">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-muted-foreground">Spots Available</span>
                        <span className="text-sm font-semibold text-foreground">
                          {feature.waitlist.remaining} / {feature.waitlist.total}
                        </span>
                      </div>

                      <div className="h-2 bg-surface rounded-full overflow-hidden mb-4">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(feature.waitlist.claimed / feature.waitlist.total) * 100}%` }}
                        />
                      </div>

                      <p className="text-xs text-success mb-4 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        {feature.benefit}
                      </p>

                      <Button size="sm" className="w-full">
                        {feature.ctaText}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>

                      <p className="text-xs text-muted-foreground text-center mt-3">
                        Currently: {feature.waitlist.claimed} spots claimed
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Urgency Box */}
          <motion.div variants={fadeInUp} className="mt-12">
            <div className="p-6 rounded-xl bg-warm/10 border border-warm/30 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-warm" />
                <span className="font-semibold text-warm uppercase tracking-wider text-sm">
                  Early Access Spots Are Limited
                </span>
              </div>
              <p className="text-muted-foreground mb-4">
                We cap early access to ensure quality feedback and server stability.
                Once spots fill, you'll have to wait for public release — and pay full price.
              </p>
              <p className="text-foreground font-medium">
                Current LeadFlow Pro users get <span className="text-primary">FIRST priority</span>.
                <br />
                Sign up now → Get early access to every future feature before anyone else.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
