import { useCallback } from 'react'
import { useLocation } from 'wouter'

// Sections
import { Hero } from './components/sections/Hero'
import { ProblemSpiral } from './components/sections/ProblemSpiral'
import { VillainSection } from './components/sections/VillainSection'
import { MechanismReveal } from './components/sections/MechanismReveal'
import { Fascinations } from './components/sections/Fascinations'
import { LeadDiscoveryFeature } from './components/sections/features/LeadDiscovery'
import { LeadIntelligenceFeature } from './components/sections/features/LeadIntelligence'
import { TechnologyGapsFeature } from './components/sections/features/TechnologyGaps'
import { FutureFeatures } from './components/sections/FutureFeatures'
import { ROICalculator } from './components/sections/ROICalculator'
import { MetricsBar } from './components/sections/social-proof/MetricsBar'
import { CaseStudy } from './components/sections/social-proof/CaseStudy'
import { Testimonials } from './components/sections/social-proof/Testimonials'
import { Pricing } from './components/sections/Pricing'
import { FAQ } from './components/sections/FAQ'
import { FinalClose } from './components/sections/FinalClose'
import { Footer } from './components/sections/Footer'

// Urgency Components
import { LiveActivityFeed } from './components/urgency/LiveActivityFeed'
import { ScrollTriggeredBar } from './components/urgency/ScrollTriggeredBar'
import { ExitIntentPopup } from './components/urgency/ExitIntentPopup'
import { FloatingCTA } from './components/urgency/FloatingCTA'

// Hooks
import { useExitIntent } from './hooks/useExitIntent'

export default function LandingPage() {
  const [, setLocation] = useLocation()
  const { showExitIntent, closeExitIntent } = useExitIntent({ delay: 5000 })

  const handleCtaClick = useCallback(() => {
    setLocation('/sign-up')
  }, [setLocation])

  return (
    <div className="min-h-screen bg-void text-foreground overflow-x-hidden">
      {/* Main Content */}
      <main>
        {/* Hero */}
        <Hero onCtaClick={handleCtaClick} />

        {/* Problem Amplification */}
        <ProblemSpiral />

        {/* Villain Section */}
        <VillainSection />

        {/* Mechanism Reveal */}
        <MechanismReveal onCtaClick={handleCtaClick} />

        {/* Fascinations */}
        <Fascinations onCtaClick={handleCtaClick} />

        {/* Feature Deep Dives */}
        <LeadDiscoveryFeature />
        <LeadIntelligenceFeature />
        <TechnologyGapsFeature />

        {/* Future Features */}
        <FutureFeatures />

        {/* ROI Calculator */}
        <ROICalculator onCtaClick={handleCtaClick} />

        {/* Social Proof */}
        <MetricsBar />
        <CaseStudy onCtaClick={handleCtaClick} />
        <Testimonials />

        {/* Pricing */}
        <Pricing onCtaClick={handleCtaClick} />

        {/* FAQ */}
        <FAQ />

        {/* Final Close */}
        <FinalClose onCtaClick={handleCtaClick} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Urgency Elements */}
      <LiveActivityFeed position="bottom-left" />
      <ScrollTriggeredBar threshold={25} onCtaClick={handleCtaClick} />
      <FloatingCTA showAfterPercent={15} hideAfterPercent={90} onCtaClick={handleCtaClick} />

      {/* Exit Intent Popup */}
      <ExitIntentPopup
        isOpen={showExitIntent}
        onClose={closeExitIntent}
        onCtaClick={handleCtaClick}
      />
    </div>
  )
}
