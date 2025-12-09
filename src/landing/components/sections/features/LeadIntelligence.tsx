import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { fadeInUp, staggerContainer } from '../../../lib/animations'
import { ScoreGauge } from '../../ui/ScoreGauge'
import {
  Brain, Check, Briefcase, Clock, TrendingUp, Server
} from 'lucide-react'

export function LeadIntelligenceFeature() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const signalCategories = [
    {
      title: 'NEED SIGNALS',
      subtitle: 'Do they need what you sell?',
      icon: Server,
      color: 'primary',
      signals: [
        'CRM system detected? Which one? What tier?',
        'Email marketing platform present?',
        'Marketing automation in use?',
        'AI chatbot installed?',
        'Website speed score',
        'Mobile optimization status',
        'SSL/security status',
        'Analytics tracking active?',
      ],
    },
    {
      title: 'BUDGET SIGNALS',
      subtitle: 'Can they afford you?',
      icon: Briefcase,
      color: 'success',
      signals: [
        'Employee count (10-200 is the sweet spot)',
        'Number of locations',
        'Website traffic estimates',
        'E-commerce indicators',
        'Premium tool usage',
        'Office/location quality signals',
      ],
    },
    {
      title: 'TIMING SIGNALS',
      subtitle: 'Are they ready NOW?',
      icon: Clock,
      color: 'warm',
      signals: [
        'Job postings in last 30 days',
        'Hiring for marketing/sales/ops roles',
        'Website redesigned recently',
        'Domain age and changes',
        'Recent news or PR',
      ],
    },
    {
      title: 'GROWTH SIGNALS',
      subtitle: 'Are they expanding?',
      icon: TrendingUp,
      color: 'hot',
      signals: [
        'Review velocity',
        'Social media activity trends',
        'Content publishing frequency',
        'Competitor landscape changes',
      ],
    },
  ]

  return (
    <section ref={ref} className="py-24 bg-void relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

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
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">The Core Technology</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              The 23 Buying Signals That Tell You{' '}
              <span className="text-primary">EXACTLY</span> Who's Ready To Buy
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              This is the core of LeadFlow Pro. This is why you'll close 3-10x more deals.
            </p>
          </motion.div>

          {/* Signal Categories */}
          <motion.div variants={fadeInUp} className="grid md:grid-cols-2 gap-6 mb-16">
            {signalCategories.map((category, i) => {
              const colors = {
                primary: 'border-primary/30 bg-primary/5',
                success: 'border-success/30 bg-success/5',
                warm: 'border-warm/30 bg-warm/5',
                hot: 'border-hot/30 bg-hot/5',
              }
              const textColors = {
                primary: 'text-primary',
                success: 'text-success',
                warm: 'text-warm',
                hot: 'text-hot',
              }

              return (
                <div
                  key={i}
                  className={`p-6 rounded-xl border ${colors[category.color as keyof typeof colors]}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${colors[category.color as keyof typeof colors]}`}>
                      <category.icon className={`w-5 h-5 ${textColors[category.color as keyof typeof textColors]}`} />
                    </div>
                    <div>
                      <h3 className={`font-semibold text-sm uppercase tracking-wider ${textColors[category.color as keyof typeof textColors]}`}>
                        {category.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">{category.subtitle}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {category.signals.map((signal, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{signal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </motion.div>

          {/* Score Explanation */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-xl font-semibold text-foreground mb-8 text-center">
              Each signal is weighted. The algorithm runs. A score appears: 0-100.
            </h3>

            <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
              <h4 className="font-semibold text-foreground mb-6 text-center uppercase tracking-wider text-sm">
                Here's What The Score Means
              </h4>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <ScoreExplanation
                  score={95}
                  range="90-100"
                  label="DROP EVERYTHING"
                  emoji="🔥"
                  description="These leads have multiple strong buying signals. They need what you sell. They can afford it. They're ready NOW. If you don't reach out today, someone else will."
                  color="hot"
                />
                <ScoreExplanation
                  score={78}
                  range="70-89"
                  label="HIGH PRIORITY"
                  emoji="🌡️"
                  description="Strong fit, clear need, good timing indicators. These should be in your outreach sequence immediately."
                  color="warm"
                />
                <ScoreExplanation
                  score={55}
                  range="50-69"
                  label="NURTURE"
                  emoji="🧊"
                  description="Possible fit but not showing urgency. Add to long-term drip. Check back in 60-90 days."
                  color="cold"
                />
                <ScoreExplanation
                  score={25}
                  range="0-49"
                  label="IGNORE"
                  emoji="⬜"
                  description="Poor fit, no buying signals, or negative indicators. Don't waste a single second here."
                  color="muted"
                />
              </div>
            </div>

            {/* Revelation */}
            <div className="mt-12 text-center">
              <p className="text-xl text-foreground font-semibold mb-2">
                For the first time, you <span className="text-primary">KNOW</span> where to focus.
              </p>
              <p className="text-muted-foreground">
                No more guessing. No more hoping. No more "let's see what happens."
              </p>
              <p className="text-lg text-foreground font-semibold mt-4">
                You have <span className="text-primary">INTELLIGENCE</span>.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function ScoreExplanation({
  score,
  range,
  label,
  emoji,
  description,
  color,
}: {
  score: number
  range: string
  label: string
  emoji: string
  description: string
  color: 'hot' | 'warm' | 'cold' | 'muted'
}) {
  const colorClasses = {
    hot: 'border-hot/30 bg-hot/5',
    warm: 'border-warm/30 bg-warm/5',
    cold: 'border-cold/30 bg-cold/5',
    muted: 'border-muted/30 bg-muted/5',
  }

  const textColors = {
    hot: 'text-hot',
    warm: 'text-warm',
    cold: 'text-cold',
    muted: 'text-muted-foreground',
  }

  return (
    <div className={`p-4 rounded-xl border ${colorClasses[color]}`}>
      <div className="flex items-center justify-center mb-4">
        <ScoreGauge score={score} size="sm" />
      </div>
      <div className="text-center">
        <div className="text-2xl mb-1">{emoji}</div>
        <div className={`text-xs font-medium ${textColors[color]} mb-1`}>{range}</div>
        <div className={`font-bold text-sm ${textColors[color]} mb-2`}>{label}</div>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
