import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { fadeInUp, staggerContainer, staggerContainerFast } from '../../lib/animations'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, ChevronRight } from 'lucide-react'

interface FascinationsProps {
  onCtaClick: () => void
}

const fascinations = [
  'The "technology gap" signal that reveals when a business is 5x more likely to buy — and how to spot it in 3 seconds',
  'Why a 4.2-star rating is actually a BETTER sales opportunity than a 5-star rating (this counterintuitive insight has closed $2.3M in deals for our users)',
  'The "job posting trigger" that tells you within 24 HOURS when a company is about to invest in marketing — reach them before competitors even know they\'re in the market',
  'How to identify the exact dollar value of every opportunity BEFORE you make contact (imagine walking into a call knowing "this is a $4,500/month deal")',
  'The "competitor displacement" signal that reveals when a prospect is unhappy with their current vendor — these leads close 3x faster because they\'re already looking',
  'Why chasing "big companies" is destroying your close rate — and the exact employee count sweet spot that converts 340% better (most agencies get this backwards)',
  'A "website autopsy" technique that reveals a business\'s financial health in under 30 seconds — you\'ll know if they can afford you before wasting a minute',
  'The one-click outreach system that lets you contact 50 qualified leads in the time it used to take to RESEARCH 5 (saves users 11.5 hours per week)',
  'Why "personalization" is dead — and what actually makes prospects respond in 2024 (hint: it\'s not their first name or company)',
  'The hidden signal that predicts when a business is about to churn from their current vendor — reach out at this moment and you\'ll close 67% of the time',
  'How to spot a "tire-kicker" from a "check-writer" before you ever get on a call (stop wasting time on prospects who will "think about it" forever)',
  'A scoring system that tells you EXACTLY how much energy to invest in each lead — finally, a way to prioritize that actually works',
  'The "investment cascade" indicator that shows when a business is in "buying mode" (once you see this pattern, you\'ll never miss it again)',
  'Why the leads everyone fights over are actually the WORST leads to pursue — and where to find the high-intent prospects nobody else is contacting',
]

export function Fascinations({ onCtaClick }: FascinationsProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-24 bg-void relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Here's Just A <span className="text-primary">FRACTION</span> Of What You'll
              Discover Inside LeadFlow Pro...
            </h2>
          </motion.div>

          {/* Fascination Bullets */}
          <motion.div
            className="space-y-4"
            variants={staggerContainerFast}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {fascinations.map((fascination, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="flex items-start gap-3 p-4 rounded-xl bg-card/30 backdrop-blur border border-border/30 hover:border-primary/30 hover:bg-card/50 transition-all duration-200"
              >
                <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-foreground leading-relaxed">
                  {formatFascination(fascination)}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeInUp} className="mt-12 text-center">
            <Button
              size="lg"
              onClick={onCtaClick}
              className="group bg-primary hover:bg-primary/90 text-white font-semibold shadow-xl shadow-primary/25"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              I Need To See This For Myself
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Helper to highlight key phrases in fascinations
function formatFascination(text: string) {
  // Highlight quoted phrases and numbers with dollar signs
  const parts = text.split(/(".*?"|"\$[\d,]+.*?"|[\d]+%|\$[\d,]+[KM]?|\d+x)/g)

  return parts.map((part, i) => {
    if (part.startsWith('"') && part.endsWith('"')) {
      return (
        <span key={i} className="text-primary font-medium">
          {part}
        </span>
      )
    }
    if (part.includes('%') || part.includes('$') || /\dx/.test(part)) {
      return (
        <span key={i} className="text-success font-semibold">
          {part}
        </span>
      )
    }
    return part
  })
}
