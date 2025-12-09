import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Sparkles, Shield, CheckCircle } from 'lucide-react'
import { fadeInUp, staggerContainer } from '../../lib/animations'
import { urgencyConfig } from '../../lib/urgencyConfig'
import { AnimatedCounter } from '../ui/AnimatedCounter'

interface HeroProps {
  onCtaClick: () => void
}

export function Hero({ onCtaClick }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-void via-void to-base" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(61,123,242,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(61,123,242,0.03)_1px,transparent_1px)] bg-[size:72px_72px]" />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-hot/10 rounded-full blur-[100px]"
        animate={{
          x: [0, -30, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-24 lg:py-32">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Pre-headline warning */}
          <motion.div variants={fadeInUp} className="mb-6">
            <Badge variant="hot" className="text-sm px-4 py-1.5 border-hot/40">
              WARNING: This May Change Everything
            </Badge>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6"
          >
            What If I Told You That{' '}
            <span className="text-gradient-hot">97% Of The Leads</span>{' '}
            You're Calling Will{' '}
            <span className="relative">
              <span className="relative z-10">NEVER Buy</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-destructive/20 -z-0" />
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-muted-foreground mb-4 max-w-2xl mx-auto"
          >
            And I Could Show You{' '}
            <span className="text-foreground font-semibold">Exactly Which 3% Will?</span>
          </motion.p>

          {/* Hook continuation */}
          <motion.p
            variants={fadeInUp}
            className="text-base text-muted-foreground mb-8 max-w-xl mx-auto"
          >
            Discover the "Lead Intelligence" secret that top agencies use to close{' '}
            <span className="text-primary font-medium">10x more deals</span> while their competitors
            burn through cold lists.
          </motion.p>

          {/* CTA Section */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button
              size="xl"
              onClick={onCtaClick}
              className="group bg-primary hover:bg-primary/90 text-white font-semibold shadow-xl shadow-primary/25 px-8"
            >
              <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Show Me Which Leads Will Close
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Free forever. No credit card. No BS.
            </span>
          </motion.div>

          {/* Social proof line */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>
                Join <span className="text-foreground font-semibold tabular-nums">
                  <AnimatedCounter value={urgencyConfig.metrics.totalAgencies} />
                </span> agencies who stopped guessing
              </span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-muted-foreground" />
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              <span>
                <span className="text-foreground font-semibold tabular-nums">
                  {urgencyConfig.metrics.signupsThisWeek}
                </span> signed up this week
              </span>
            </div>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={fadeInUp}
            className="mt-12 pt-8 border-t border-border/30"
          >
            <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
              Trusted by agencies featured in
            </p>
            <div className="flex items-center justify-center gap-8 opacity-40 grayscale">
              <span className="text-lg font-semibold">Forbes</span>
              <span className="text-lg font-semibold">Inc.</span>
              <span className="text-lg font-semibold">Entrepreneur</span>
              <span className="text-lg font-semibold hidden sm:inline">TechCrunch</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-2 rounded-full bg-muted-foreground"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
