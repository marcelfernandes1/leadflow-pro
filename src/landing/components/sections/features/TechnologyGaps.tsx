import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { fadeInUp, staggerContainer } from '../../../lib/animations'
import { Cpu, Check, X, AlertTriangle, DollarSign } from 'lucide-react'

export function TechnologyGapsFeature() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const detectedTech = [
    { name: 'WordPress 6.4', type: 'CMS' },
    { name: 'Google Analytics 4', type: 'Analytics' },
    { name: 'Mailchimp (Free tier)', type: 'Email' },
    { name: 'Basic contact form', type: 'Lead Capture' },
  ]

  const missingTech = [
    { name: 'CRM (no Salesforce, HubSpot detected)', value: '$2,000/mo' },
    { name: 'Marketing automation', value: '$3,000/mo' },
    { name: 'AI chatbot', value: '$500/mo' },
    { name: 'Facebook Pixel', value: '$1,000/mo' },
    { name: 'Heatmapping (Hotjar, etc)', value: '$500/mo' },
  ]

  const issues = [
    { name: 'Website speed: 34/100 (poor)', value: '$1,500/mo' },
    { name: 'Mobile: Failing Core Web Vitals', value: '$1,000/mo' },
    { name: 'SSL certificate: Expiring in 19 days', value: 'Urgent' },
    { name: '3 WordPress plugins with vulnerabilities', value: 'Security risk' },
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
              <Cpu className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Technology Detection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              See Exactly What Technology They're Missing{' '}
              <span className="text-primary">(And Exactly What To Sell Them)</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              This feature alone is worth <span className="text-success font-semibold">100x</span> the subscription cost.
            </p>
          </motion.div>

          {/* Explanation */}
          <motion.div variants={fadeInUp} className="mb-12">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <p className="text-foreground text-lg">
                When you know what technology a prospect is <span className="font-semibold text-primary">MISSING</span>,
                you know:
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="px-4 py-2 rounded-lg bg-surface/50 border border-border/50">
                  <span className="text-muted-foreground">What they</span>{' '}
                  <span className="text-foreground font-semibold">NEED</span>{' '}
                  <span className="text-muted-foreground text-sm">(your opening)</span>
                </div>
                <div className="px-4 py-2 rounded-lg bg-surface/50 border border-border/50">
                  <span className="text-muted-foreground">What problem they</span>{' '}
                  <span className="text-foreground font-semibold">HAVE</span>{' '}
                  <span className="text-muted-foreground text-sm">(your pitch angle)</span>
                </div>
                <div className="px-4 py-2 rounded-lg bg-surface/50 border border-border/50">
                  <span className="text-muted-foreground">What to</span>{' '}
                  <span className="text-foreground font-semibold">SELL</span> them{' '}
                  <span className="text-muted-foreground text-sm">(your offer)</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Technology Scan Demo */}
          <motion.div variants={fadeInUp} className="mb-16">
            <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
              <h3 className="font-semibold text-foreground mb-6 text-center">
                LeadFlow Pro scans every lead's website and detects:
              </h3>

              <div className="grid md:grid-cols-3 gap-6">
                {/* What they HAVE */}
                <div className="p-5 rounded-xl bg-success/5 border border-success/20">
                  <h4 className="font-semibold text-success mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    What they HAVE
                  </h4>
                  <ul className="space-y-2">
                    {detectedTech.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-success flex-shrink-0" />
                        <span className="text-foreground">{item.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What they DON'T have */}
                <div className="p-5 rounded-xl bg-hot/5 border border-hot/20">
                  <h4 className="font-semibold text-hot mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                    <X className="w-4 h-4" />
                    What they DON'T have
                  </h4>
                  <ul className="space-y-2">
                    {missingTech.map((item, i) => (
                      <li key={i} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <X className="w-4 h-4 text-hot flex-shrink-0" />
                          <span className="text-muted-foreground">{item.name}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What's OUTDATED */}
                <div className="p-5 rounded-xl bg-warm/5 border border-warm/20">
                  <h4 className="font-semibold text-warm mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    What's BROKEN
                  </h4>
                  <ul className="space-y-2">
                    {issues.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-warm flex-shrink-0" />
                        <span className="text-muted-foreground">{item.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Email Comparison */}
          <motion.div variants={fadeInUp} className="mb-16">
            <h3 className="text-lg font-semibold text-foreground mb-6 text-center">
              Now imagine your cold outreach:
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Before */}
              <div className="p-6 rounded-xl bg-destructive/10 border border-destructive/30">
                <h4 className="font-semibold text-destructive mb-4 flex items-center gap-2">
                  <X className="w-5 h-5" />
                  BEFORE (Guessing)
                </h4>
                <div className="p-4 rounded-lg bg-surface/30 font-mono text-sm text-muted-foreground">
                  "Hi [Name], I help businesses like yours with digital marketing. Want to chat?"
                </div>
                <p className="text-xs text-destructive mt-3">Response rate: ~1%</p>
              </div>

              {/* After */}
              <div className="p-6 rounded-xl bg-success/10 border border-success/30">
                <h4 className="font-semibold text-success mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  AFTER (Intelligence)
                </h4>
                <div className="p-4 rounded-lg bg-surface/30 font-mono text-sm text-foreground leading-relaxed">
                  "Hi [Name], I noticed your website is loading in 6.2 seconds (Google recommends under 2.5),
                  you're not tracking Facebook ad conversions, and you're using Mailchimp Free but don't have
                  any automation set up. I specialize in exactly these issues. Here's what I'd fix first..."
                </div>
                <p className="text-xs text-success mt-3">Response rate: ~15-25%</p>
              </div>
            </div>

            <p className="text-center mt-6 text-foreground font-semibold">
              Which email gets a response?
            </p>
          </motion.div>

          {/* Dollar Value */}
          <motion.div variants={fadeInUp}>
            <div className="p-8 rounded-2xl bg-success/10 border border-success/30">
              <h3 className="text-lg font-semibold text-foreground mb-6 text-center">
                But wait, it gets better. We calculate the dollar value of each gap:
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                {[
                  { gap: 'Missing CRM', value: '$2,000/mo' },
                  { gap: 'No automation', value: '$3,000/mo' },
                  { gap: 'No AI chatbot', value: '$500/mo' },
                  { gap: 'No FB Pixel', value: '$1,000/mo' },
                  { gap: 'Slow website', value: '$1,500/mo' },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-lg bg-surface/30 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{item.gap}</p>
                    <p className="text-lg font-bold text-success">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-success/20 border border-success/30">
                  <DollarSign className="w-6 h-6 text-success" />
                  <div>
                    <p className="text-sm text-muted-foreground">TOTAL OPPORTUNITY</p>
                    <p className="text-2xl font-bold text-success">$8,000/month ($96,000/year)</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center space-y-2">
                <p className="text-foreground">
                  You're not going into sales calls blind anymore.
                </p>
                <p className="text-lg font-semibold text-foreground">
                  You're going in with a <span className="text-success">$96,000 proposal</span> already written.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
