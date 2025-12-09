import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { fadeInUp, staggerContainer } from '../../../lib/animations'
import { Quote, Star, TrendingUp } from 'lucide-react'

export function Testimonials() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const testimonials = [
    {
      quote: "$47,000 In My First Month. I'm Actually Angry.",
      content: "Angry at myself for not finding this sooner. Angry at all the time I wasted on Apollo.\n\nFirst week with LeadFlow Pro, I only called leads scored 85+. Closed 3 deals totaling $47K.\n\nMy old method? Would've taken 6 months minimum.\n\nDo NOT make my mistake. Sign up now.",
      author: 'Sarah Chen',
      role: 'Founder, GrowthPilot Agency',
      result: '$47,000 closed in first 30 days',
      avatar: 'SC',
    },
    {
      quote: 'We Replaced ZoomInfo And Saved $14K/Year (And Close MORE Deals)',
      content: "We were paying $1,200/month for ZoomInfo. Switched to LeadFlow Pro at $299/month.\n\nBetter intelligence. Better results. $14,400/year in savings PLUS higher close rates.\n\nOur sales team literally cheered when we showed them the lead scores. They finally knew who to call first.",
      author: 'David Park',
      role: 'VP Sales, Momentum Marketing Group',
      result: '$14,400/year saved + 23% higher close rate',
      avatar: 'DP',
    },
    {
      quote: 'From 3% to 19% Close Rate. My Pipeline Has Never Been Healthier.',
      content: "I've been in sales for 15 years. Thought I knew what I was doing.\n\nLeadFlow Pro showed me I was wasting 80% of my effort on leads that were never going to close.\n\nNow I only pursue high-scored opportunities. My close rate went from 3% to 19% in 60 days.\n\nSame effort. 6x the results. I feel like I'm cheating.",
      author: 'Marcus Webb',
      role: 'CEO, Webb Digital Consulting',
      result: '3% → 19% close rate in 60 days',
      avatar: 'MW',
    },
    {
      quote: 'I Got My First Client In 3 Days. As A Complete Beginner.',
      content: "Just launched my agency. No network. No referrals. Zero idea what I was doing.\n\nUsed LeadFlow Pro to find businesses without CRM in my city. Sent 15 emails to leads scored 85+.\n\nBooked 4 calls. Closed 1 at $2,500/month.\n\nIn three days. With zero experience.\n\nIf I can do this, anyone can.",
      author: 'Jennifer Okonkwo',
      role: 'Founder, Elevate CRM Solutions',
      result: 'First $2,500/month client in 3 days',
      avatar: 'JO',
    },
  ]

  return (
    <section ref={ref} className="py-24 bg-void relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-success/5 via-transparent to-transparent" />

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          className="max-w-5xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <span className="text-xs uppercase tracking-wider text-success font-medium mb-4 block">
              Success Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Don't Take Our Word For It.{' '}
              <span className="text-success">See The Results.</span>
            </h2>
            <p className="text-muted-foreground">
              (Each testimonial includes results AND regret for waiting)
            </p>
          </motion.div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="p-6 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 hover:border-success/30 transition-colors"
              >
                {/* Quote Header */}
                <div className="flex items-start gap-3 mb-4">
                  <Quote className="w-8 h-8 text-success flex-shrink-0" />
                  <h3 className="font-semibold text-foreground text-lg leading-tight">
                    "{testimonial.quote}"
                  </h3>
                </div>

                {/* Content */}
                <p className="text-sm text-muted-foreground whitespace-pre-line mb-4 leading-relaxed">
                  {testimonial.content}
                </p>

                {/* Result Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 border border-success/30 mb-4">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium text-success">{testimonial.result}</span>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-border/30">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-warm text-warm" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
