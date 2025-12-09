import { motion, useInView } from 'framer-motion'
import { useRef, useState, useMemo } from 'react'
import { fadeInUp, staggerContainer } from '../../lib/animations'
import { Button } from '@/components/ui/button'
import { urgencyConfig, formatCurrency } from '../../lib/urgencyConfig'
import { Calculator, TrendingUp, ArrowRight, Sparkles } from 'lucide-react'

interface ROICalculatorProps {
  onCtaClick: () => void
}

export function ROICalculator({ onCtaClick }: ROICalculatorProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const [leadsPerMonth, setLeadsPerMonth] = useState(urgencyConfig.roiDefaults.leadsPerMonth)
  const [closeRate, setCloseRate] = useState(urgencyConfig.roiDefaults.currentCloseRate)
  const [avgDealValue, setAvgDealValue] = useState(urgencyConfig.roiDefaults.avgDealValue)

  const calculations = useMemo(() => {
    // Current situation
    const currentDeals = Math.round((leadsPerMonth * closeRate) / 100)
    const currentRevenue = currentDeals * avgDealValue
    const timePerLead = 20 // minutes
    const totalHours = Math.round((leadsPerMonth * timePerLead) / 60)
    const wastedHours = Math.round(totalHours * 0.97) // 97% wasted on non-buyers

    // With LeadFlow Pro (conservative 4x improvement on scored leads)
    const effectiveLeads = Math.round(leadsPerMonth * 0.25) // Focus on top 25%
    const improvedCloseRate = Math.min(closeRate * 4, 30) // 4x improvement, max 30%
    const newDeals = Math.round((effectiveLeads * improvedCloseRate) / 100) + currentDeals * 0.5
    const newRevenue = Math.round(newDeals * avgDealValue)
    const additionalRevenue = newRevenue - currentRevenue
    const yearlyAdditional = additionalRevenue * 12

    // Time savings
    const newHours = Math.round(totalHours * 0.3) // 70% time savings
    const hoursSaved = totalHours - newHours

    // ROI
    const monthlyInvestment = 149
    const roi = Math.round((additionalRevenue / monthlyInvestment) * 100)
    const paybackDays = additionalRevenue > 0 ? Math.round((monthlyInvestment / additionalRevenue) * 30) : 999

    return {
      currentDeals,
      currentRevenue,
      totalHours,
      wastedHours,
      newDeals: Math.round(newDeals),
      newRevenue,
      additionalRevenue,
      yearlyAdditional,
      hoursSaved,
      newHours,
      roi,
      paybackDays,
    }
  }, [leadsPerMonth, closeRate, avgDealValue])

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
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/30 mb-6">
              <Calculator className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success">ROI Calculator</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Let's Calculate Exactly How Much Money{' '}
              <span className="text-hot">You're Losing</span> Every Month
            </h2>
            <p className="text-muted-foreground">
              Don't take my word for it. Let's use YOUR numbers.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left - Inputs */}
            <motion.div variants={fadeInUp}>
              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h3 className="font-semibold text-foreground mb-6 uppercase tracking-wider text-sm">
                  Your Current Situation
                </h3>

                <div className="space-y-6">
                  <SliderInput
                    label="Leads contacted per month"
                    value={leadsPerMonth}
                    min={50}
                    max={500}
                    step={10}
                    onChange={setLeadsPerMonth}
                  />
                  <SliderInput
                    label="Current close rate"
                    value={closeRate}
                    min={1}
                    max={15}
                    step={0.5}
                    onChange={setCloseRate}
                    suffix="%"
                  />
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">Average deal value</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <input
                        type="number"
                        value={avgDealValue}
                        onChange={(e) => setAvgDealValue(Number(e.target.value) || 0)}
                        className="w-full h-12 pl-8 pr-4 rounded-lg bg-surface border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Current Results */}
                <div className="mt-8 pt-6 border-t border-border/50">
                  <h4 className="font-semibold text-destructive mb-4 text-sm uppercase tracking-wider">
                    Your Current Results
                  </h4>
                  <div className="space-y-3 text-sm">
                    <ResultRow
                      label="Leads contacted"
                      value={leadsPerMonth.toString()}
                    />
                    <ResultRow
                      label="Deals closed"
                      value={calculations.currentDeals.toString()}
                      className="text-muted-foreground"
                    />
                    <ResultRow
                      label="Monthly revenue from outreach"
                      value={formatCurrency(calculations.currentRevenue)}
                    />
                    <ResultRow
                      label="Time spent on outreach"
                      value={`${calculations.totalHours} hours/month`}
                      className="text-muted-foreground"
                    />
                    <ResultRow
                      label="Time wasted on non-buyers (97%)"
                      value={`${calculations.wastedHours} hours/month`}
                      className="text-destructive"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right - Results */}
            <motion.div variants={fadeInUp}>
              <div className="p-8 rounded-2xl bg-success/5 border border-success/30">
                <h3 className="font-semibold text-success mb-6 uppercase tracking-wider text-sm">
                  With LeadFlow Pro
                </h3>

                <div className="space-y-3 text-sm mb-8">
                  <ResultRow
                    label="Focus only on high-scored leads"
                    value="Top 25% of your list"
                  />
                  <ResultRow
                    label="Effective close rate on scored leads"
                    value="12%+ (4x improvement)"
                    className="text-success"
                  />
                </div>

                <div className="p-6 rounded-xl bg-surface/30">
                  <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
                    New Results
                  </h4>
                  <div className="space-y-3 text-sm">
                    <ResultRow
                      label="Total monthly deals"
                      value={calculations.newDeals.toString()}
                      className="text-success font-semibold"
                    />
                    <ResultRow
                      label="Monthly revenue"
                      value={formatCurrency(calculations.newRevenue)}
                      className="text-success font-semibold"
                    />
                    <ResultRow
                      label="Time on outreach"
                      value={`${calculations.newHours} hours/month`}
                    />
                    <ResultRow
                      label="Time saved"
                      value={`${calculations.hoursSaved} hours/month`}
                      className="text-primary"
                    />
                  </div>
                </div>

                {/* Impact Summary */}
                <div className="mt-8 p-6 rounded-xl bg-success/20 border border-success/30">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-success" />
                    <span className="font-semibold text-foreground uppercase tracking-wider text-sm">
                      Additional Revenue
                    </span>
                  </div>
                  <div className="text-4xl font-bold text-success mb-2">
                    +{formatCurrency(calculations.additionalRevenue)}/month
                  </div>
                  <div className="text-muted-foreground">
                    (+{formatCurrency(calculations.yearlyAdditional)}/year)
                  </div>
                </div>

                {/* ROI */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-surface/30 text-center">
                    <p className="text-xs text-muted-foreground mb-1">LeadFlow Pro cost</p>
                    <p className="text-lg font-semibold text-foreground">$149/month</p>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/20 text-center">
                    <p className="text-xs text-muted-foreground mb-1">ROI</p>
                    <p className="text-lg font-semibold text-primary">{calculations.roi.toLocaleString()}%</p>
                  </div>
                </div>

                <p className="text-center mt-4 text-sm text-muted-foreground">
                  LeadFlow Pro pays for itself in{' '}
                  <span className="text-success font-semibold">
                    {calculations.paybackDays < 1 ? 'less than 1 day' : `${calculations.paybackDays} days`}
                  </span>
                </p>
              </div>
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.div variants={fadeInUp} className="mt-12 text-center">
            <div className="p-8 rounded-2xl bg-card/30 border border-border/30">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                THE REAL QUESTION:
              </h3>
              <p className="text-lg text-foreground mb-4">
                Can you afford <span className="text-hot font-semibold">NOT</span> to have this?
              </p>
              <p className="text-muted-foreground mb-6">
                Every month you wait:
                <br />
                • <span className="text-hot">{formatCurrency(calculations.additionalRevenue)}+</span> in lost revenue
                <br />
                • <span className="text-hot">{calculations.hoursSaved}+</span> hours of wasted time
                <br />
                • Competitors gaining ground
              </p>
              <p className="text-foreground font-medium mb-6">
                The math is undeniable. The only question is whether you'll act on it.
              </p>
              <Button
                size="lg"
                onClick={onCtaClick}
                className="group bg-primary hover:bg-primary/90 text-white font-semibold shadow-xl shadow-primary/25"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Free - See Your Leads
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function SliderInput({
  label,
  value,
  min,
  max,
  step,
  onChange,
  suffix = '',
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  suffix?: string
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm text-muted-foreground">{label}</label>
        <span className="text-sm font-semibold text-foreground tabular-nums">
          {value}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-primary"
      />
    </div>
  )
}

function ResultRow({
  label,
  value,
  className = '',
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium ${className || 'text-foreground'}`}>{value}</span>
    </div>
  )
}
