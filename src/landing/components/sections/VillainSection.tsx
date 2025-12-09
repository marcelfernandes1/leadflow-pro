import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { fadeInUp, staggerContainer } from '../../lib/animations'
import { HighlightText } from '../ui/HighlightText'
import { X, Check, DollarSign, Skull } from 'lucide-react'

export function VillainSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-24 bg-void relative overflow-hidden">
      {/* Dramatic gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-destructive/10 via-transparent to-transparent" />

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          className="max-w-3xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <span className="text-xs uppercase tracking-wider text-destructive font-medium mb-4 block">
              The Dirty Secret
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              The Lead Database Industry Has Been{' '}
              <span className="text-destructive">Lying To You</span> For Years
            </h2>
          </motion.div>

          {/* The Revelation */}
          <motion.div variants={fadeInUp} className="space-y-6 text-left">
            <p className="text-lg text-foreground">
              Here's a dirty secret the lead database companies don't want you to know:
            </p>

            <div className="p-6 rounded-xl bg-surface/50 border border-border/50">
              <p className="text-xl font-semibold text-foreground text-center">
                They make money whether you close deals or not.
              </p>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Think about it.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Apollo, ZoomInfo, Lusha — they charge you for access to{' '}
              <span className="text-foreground font-semibold">CONTACTS</span>.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Not <span className="text-success font-semibold">CUSTOMERS</span>. Contacts.
            </p>

            <p className="text-foreground leading-relaxed">
              They have <HighlightText variant="hot">zero incentive</HighlightText> to help you close deals.
              They just need you to keep believing that more contacts = more sales.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              So they sell you bigger lists. More data. Additional "enrichment."
            </p>

            <p className="text-muted-foreground leading-relaxed">
              And you keep grinding through thousands of leads, believing it's just a "numbers game."
            </p>

            <div className="my-8 p-6 rounded-xl bg-destructive/10 border border-destructive/30">
              <p className="text-foreground text-lg font-semibold text-center">
                It's brilliant, actually. The worse their data works, the more you need.
              </p>
              <p className="text-muted-foreground text-center mt-2">
                It's like a casino selling you more chips when you're losing.
              </p>
              <p className="text-destructive text-center mt-4 font-semibold">
                "Don't worry, keep playing. The next hand will be different."
              </p>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Meanwhile, they're printing money.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center py-4">
              <div className="flex items-center gap-2 text-foreground">
                <DollarSign className="w-5 h-5 text-success" />
                <span>ZoomInfo: <span className="font-bold">$1.3 BILLION</span> last year</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-muted-foreground" />
              <div className="flex items-center gap-2 text-foreground">
                <DollarSign className="w-5 h-5 text-success" />
                <span>Apollo: <span className="font-bold">$100M+</span> in funding</span>
              </div>
            </div>

            <p className="text-lg text-foreground text-center">
              From selling you phonebooks.
            </p>
          </motion.div>

          {/* What They Won't Build */}
          <motion.div variants={fadeInUp} className="mt-12">
            <h3 className="text-xl font-semibold text-foreground mb-6 text-center">
              Here's what they'll <span className="text-destructive">never</span> build:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Lead scoring based on buying signals',
                'Technology gap detection',
                'Growth signal identification',
                'Opportunity value calculation',
                'AI-powered buying intent analysis',
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg bg-surface/30"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <X className="w-5 h-5 text-destructive flex-shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </motion.div>
              ))}
            </div>

            <p className="text-muted-foreground mt-6 text-center">
              Why would they? That would make their product <span className="text-foreground font-semibold">WORK</span>.
              And if their product worked, you'd need <span className="text-success">FEWER</span> leads, not more.
            </p>

            <p className="text-foreground font-semibold mt-4 text-center">
              Their entire business model depends on you staying on the hamster wheel.
            </p>
          </motion.div>

          {/* Comparison Table */}
          <motion.div variants={fadeInUp} className="mt-12">
            <h3 className="text-lg font-semibold text-foreground mb-6 text-center">
              What They Sell You vs. What You Actually Need
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Left - Lead Databases */}
              <div className="p-6 rounded-xl bg-destructive/10 border border-destructive/30">
                <div className="flex items-center gap-2 mb-4">
                  <Skull className="w-5 h-5 text-destructive" />
                  <h4 className="font-semibold text-destructive">Lead Databases</h4>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Contact information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">More data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Quantity (1M leads!)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">YOU figure out who to call</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Their success = your addiction</span>
                  </li>
                </ul>
              </div>

              {/* Right - LeadFlow Pro */}
              <div className="p-6 rounded-xl bg-success/10 border border-success/30">
                <div className="flex items-center gap-2 mb-4">
                  <Check className="w-5 h-5 text-success" />
                  <h4 className="font-semibold text-success">LeadFlow Pro</h4>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">Contact information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-foreground font-semibold">BETTER data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">Quality (leads that CLOSE)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-foreground font-semibold">WE TELL you who to call</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">Our success = YOUR success</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Transition */}
          <motion.div variants={fadeInUp} className="mt-16 text-center">
            <p className="text-2xl font-bold text-foreground">
              Time to get off the wheel.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
