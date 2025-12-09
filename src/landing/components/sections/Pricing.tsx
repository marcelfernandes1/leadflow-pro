import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { fadeInUp, staggerContainer } from '../../lib/animations'
import { Button } from '@/components/ui/button'
import { urgencyConfig } from '../../lib/urgencyConfig'
import { Check, Shield, Zap, Star } from 'lucide-react'

interface PricingProps {
  onCtaClick: () => void
}

export function Pricing({ onCtaClick }: PricingProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const valueStack = [
    { feature: 'Lead Discovery Engine', value: '$197/month', description: "that's what ScraperAPI charges" },
    { feature: 'Lead Intelligence & Scoring', value: '$297/month', description: 'BuiltWith charges $295/month for LESS' },
    { feature: 'Technology Gap Detection', value: '$147/month', description: 'WhatRuns charges $149/month' },
    { feature: 'One-Click Contact Actions', value: '$47/month', description: 'Mixmax charges $49/month' },
    { feature: 'Built-In CRM Pipeline', value: '$97/month', description: 'Pipedrive charges $99/month' },
    { feature: 'AI-Powered Pitch Recommendations', value: '$97/month', description: 'Copy.ai charges $99/month' },
    { feature: 'Priority Email Support', value: '$47/month', description: '' },
  ]

  const plans = [
    {
      name: 'FREE',
      price: 0,
      period: 'forever',
      features: [
        '100 leads/month',
        '10 searches/day',
        'Lead discovery',
        'Contact information',
        'One-click contact',
        'Basic pipeline',
      ],
      cta: 'Start Free',
      highlighted: false,
    },
    {
      name: 'PRO',
      badge: 'MOST POPULAR',
      price: 149,
      originalPrice: 299,
      period: '/month',
      yearlyNote: '(or $1,188/year - save $600)',
      features: [
        '1,000 leads/month',
        '50 searches/day',
        'Everything in Free',
        'Full Lead Intelligence',
        'Lead Scoring (0-100)',
        'Technology detection',
        'Growth signal analysis',
        'Opportunity values',
        'AI pitch recommendations',
        'Email support',
      ],
      cta: 'Start Pro - 14 Days Free',
      highlighted: true,
    },
    {
      name: 'AGENCY',
      price: 299,
      originalPrice: 599,
      period: '/month',
      yearlyNote: '(or $2,388/year - save $1,200)',
      features: [
        '5,000 leads/month',
        '200 searches/day',
        'Everything in Pro',
        'Team collaboration (5 seats)',
        'API access',
        'Priority support',
        'Custom onboarding call',
      ],
      cta: 'Start Agency - 14 Days Free',
      highlighted: false,
    },
  ]

  return (
    <section ref={ref} className="py-24 bg-base relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-void via-base to-void" />

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          className="max-w-6xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <span className="text-xs uppercase tracking-wider text-primary font-medium mb-4 block">
              Here's Everything You Get When You Join Today
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Choose Your Path To{' '}
              <span className="text-primary">More Closed Deals</span>
            </h2>
            <p className="text-muted-foreground">(With Zero Risk)</p>
          </motion.div>

          {/* Value Stack */}
          <motion.div variants={fadeInUp} className="mb-12">
            <div className="p-8 rounded-2xl bg-card/30 border border-border/30">
              <h3 className="font-semibold text-foreground mb-6 uppercase tracking-wider text-sm">
                When You Join LeadFlow Pro Today, You Get:
              </h3>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {valueStack.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success flex-shrink-0" />
                      <span className="text-foreground">{item.feature}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-success font-semibold">{item.value}</span>
                      {item.description && (
                        <span className="text-xs text-muted-foreground block">{item.description}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center pt-6 border-t border-border/30">
                <p className="text-muted-foreground mb-2">TOTAL VALUE:</p>
                <p className="text-4xl font-bold text-foreground line-through opacity-50">$929/month</p>
                <p className="text-lg text-muted-foreground mt-2">
                  But you won't pay anywhere CLOSE to that.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <motion.div variants={fadeInUp} className="grid lg:grid-cols-3 gap-6 mb-12">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative p-8 rounded-2xl ${
                  plan.highlighted
                    ? 'bg-primary/10 border-2 border-primary/50 shadow-xl shadow-primary/10'
                    : 'bg-card/50 border border-border/50'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-1 rounded-full bg-primary text-white text-xs font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {plan.badge}
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    {plan.originalPrice && (
                      <span className="text-2xl text-muted-foreground line-through mr-2">
                        ${plan.originalPrice}
                      </span>
                    )}
                    <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  {plan.yearlyNote && (
                    <p className="text-xs text-muted-foreground mt-1">{plan.yearlyNote}</p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                        plan.highlighted ? 'text-primary' : 'text-success'
                      }`} />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.highlighted
                      ? 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20'
                      : 'bg-surface hover:bg-surface/80'
                  }`}
                  onClick={onCtaClick}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </motion.div>

          {/* Signup count */}
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-success">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">
                {urgencyConfig.metrics.signupsThisWeek} agencies signed up this week
              </span>
            </div>
          </motion.div>

          {/* Price Anchoring */}
          <motion.div variants={fadeInUp} className="mb-12">
            <div className="max-w-2xl mx-auto p-6 rounded-xl bg-surface/30 border border-border/30">
              <h4 className="font-semibold text-foreground mb-4">
                "Wait... $149/month? That seems too cheap."
              </h4>
              <p className="text-muted-foreground text-sm mb-4">
                You're right to be suspicious. Here's why we can offer this:
              </p>
              <ol className="space-y-2 text-sm text-muted-foreground mb-4">
                <li>1. We're not ZoomInfo. We don't have 500 salespeople and a Manhattan office.</li>
                <li>2. Our tech is efficient. We built this lean.</li>
                <li>3. We believe in volume. We'd rather have 10,000 users at $149 than 1,000 users at $1,490.</li>
              </ol>
              <p className="text-foreground text-sm font-medium">
                But here's the real reason: We KNOW that once you use lead intelligence, you'll never go back.
                You'll upgrade. You'll stay for years. You'll refer friends.
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                $149/month is an investment in a 10-year relationship.
                <br />
                <span className="text-foreground">(And it's less than your Netflix + Spotify + coffee habit combined.)</span>
              </p>
            </div>
          </motion.div>

          {/* Guarantee Box */}
          <motion.div variants={fadeInUp}>
            <div className="p-8 rounded-2xl bg-success/10 border border-success/30">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Shield className="w-6 h-6 text-success" />
                <h3 className="text-xl font-bold text-foreground">
                  The "Close More Or It's Free" Guarantee
                </h3>
              </div>

              <p className="text-center text-muted-foreground mb-6">
                We're so confident LeadFlow Pro will transform your results that we GUARANTEE it:
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 rounded-xl bg-surface/30 text-center">
                  <h4 className="font-semibold text-foreground mb-2">GUARANTEE #1</h4>
                  <p className="text-sm font-medium text-success mb-1">14-Day Free Trial</p>
                  <p className="text-xs text-muted-foreground">
                    Try Pro or Agency completely free. Full access. No limitations. Cancel before day 14 and pay nothing.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-surface/30 text-center">
                  <h4 className="font-semibold text-foreground mb-2">GUARANTEE #2</h4>
                  <p className="text-sm font-medium text-success mb-1">30-Day Money Back</p>
                  <p className="text-xs text-muted-foreground">
                    If you're not thrilled — for ANY reason — email us within 30 days. Full refund. No questions. No hassle.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-surface/30 text-center">
                  <h4 className="font-semibold text-foreground mb-2">GUARANTEE #3</h4>
                  <p className="text-sm font-medium text-success mb-1">The "One Deal" Promise</p>
                  <p className="text-xs text-muted-foreground">
                    If you don't close at least ONE extra deal in your first 60 days, we'll refund your entire subscription AND give you $100.
                  </p>
                </div>
              </div>

              <div className="text-center mt-6">
                <p className="text-lg font-semibold text-foreground mb-2">That's how confident we are.</p>
                <p className="text-foreground">
                  You literally cannot lose money on this.
                  <br />
                  Either LeadFlow Pro works and you make more money...
                  <br />
                  Or it doesn't and <span className="text-success font-semibold">we pay YOU</span>.
                </p>
                <p className="text-muted-foreground mt-4">
                  What's the risk? <span className="text-foreground font-semibold">There is none.</span>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
