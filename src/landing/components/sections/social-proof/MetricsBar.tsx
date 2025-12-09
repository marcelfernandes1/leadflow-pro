import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { AnimatedCounter } from '../../ui/AnimatedCounter'
import { urgencyConfig } from '../../../lib/urgencyConfig'
import { fadeInUp, staggerContainer } from '../../../lib/animations'

export function MetricsBar() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const metrics = [
    {
      value: urgencyConfig.metrics.totalAgencies,
      label: 'Agencies Using Today',
      suffix: '',
    },
    {
      value: urgencyConfig.metrics.leadsScored / 1000000,
      label: 'Leads Scored This Month',
      suffix: 'M',
      decimals: 1,
    },
    {
      value: urgencyConfig.metrics.dealsClosedValue / 1000000,
      label: 'Deals Closed By Users',
      prefix: '$',
      suffix: 'M',
    },
    {
      value: urgencyConfig.metrics.avgCloseRate,
      label: 'Avg. Close Rate',
      suffix: '%',
      comparison: '(vs. 3% industry)',
    },
  ]

  return (
    <section ref={ref} className="py-12 bg-void border-y border-border/30">
      <motion.div
        className="container mx-auto px-4"
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {metrics.map((metric, i) => (
            <motion.div key={i} variants={fadeInUp}>
              <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1 tabular-nums">
                {metric.prefix || ''}
                <AnimatedCounter
                  value={metric.value}
                  duration={2}
                  delay={i * 0.1}
                  decimals={metric.decimals}
                />
                {metric.suffix}
              </div>
              <div className="text-sm text-muted-foreground">
                {metric.label}
                {metric.comparison && (
                  <span className="text-success ml-1">{metric.comparison}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
