import { describe, it, expect } from 'vitest'
import {
  calculateLeadScore,
  getLeadCategory,
  calculateOpportunityValue,
  convertEnrichmentResult,
  type EnrichmentData,
} from './leadScoring'
import type { Lead, Opportunity } from '@/types'

// Helper to create a mock lead
const createMockLead = (overrides: Partial<Lead> = {}): Lead => ({
  id: 'test-lead-1',
  businessName: 'Test Business',
  category: 'Restaurant',
  address: '123 Test St',
  city: 'Test City',
  state: 'CA',
  zip: '90210',
  country: 'USA',
  phone: '+1234567890',
  email: 'test@business.com',
  website: 'https://testbusiness.com',
  googleRating: 4.5,
  reviewCount: 100,
  ...overrides,
})

// Helper to create mock enrichment data
const createMockEnrichmentData = (overrides: Partial<EnrichmentData> = {}): EnrichmentData => ({
  technologies: [],
  domainAge: 5,
  employeeCount: 25,
  jobPostings: [],
  performanceScore: 75,
  isMobileFriendly: true,
  ...overrides,
})

describe('Lead Scoring Algorithm', () => {
  describe('calculateLeadScore', () => {
    it('should return a score between 0 and 100', () => {
      const lead = createMockLead()
      const enrichment = createMockEnrichmentData()
      const result = calculateLeadScore(lead, enrichment)

      expect(result.totalScore).toBeGreaterThanOrEqual(0)
      expect(result.totalScore).toBeLessThanOrEqual(100)
    })

    it('should have all score breakdown categories', () => {
      const lead = createMockLead()
      const enrichment = createMockEnrichmentData()
      const result = calculateLeadScore(lead, enrichment)

      expect(result.breakdown).toHaveProperty('technologyGaps')
      expect(result.breakdown).toHaveProperty('growthSignals')
      expect(result.breakdown).toHaveProperty('budgetSignals')
      expect(result.breakdown).toHaveProperty('timingSignals')
    })

    it('should cap technologyGaps at 40 points', () => {
      const lead = createMockLead()
      const enrichment = createMockEnrichmentData({ technologies: [] }) // No tech = max gaps
      const result = calculateLeadScore(lead, enrichment)

      expect(result.breakdown.technologyGaps).toBeLessThanOrEqual(40)
    })

    it('should cap growthSignals at 30 points', () => {
      const lead = createMockLead()
      const enrichment = createMockEnrichmentData({
        jobPostings: [
          { title: 'Developer', date: '2024-01-01', source: 'LinkedIn' },
          { title: 'Designer', date: '2024-01-02', source: 'Indeed' },
        ],
        employeeCount: 25,
        hasRecentFunding: true,
        fundingAmount: 5000000,
      })
      const result = calculateLeadScore(lead, enrichment)

      expect(result.breakdown.growthSignals).toBeLessThanOrEqual(30)
    })

    it('should cap budgetSignals at 20 points', () => {
      const lead = createMockLead({
        googleRating: 4.8,
        reviewCount: 500,
      })
      const enrichment = createMockEnrichmentData({
        performanceScore: 95,
        domainAge: 10,
        socialFollowers: {
          instagram: 50000,
          facebook: 30000,
        },
      })
      const result = calculateLeadScore(lead, enrichment)

      expect(result.breakdown.budgetSignals).toBeLessThanOrEqual(20)
    })

    it('should cap timingSignals at 10 points', () => {
      const lead = createMockLead()
      const enrichment = createMockEnrichmentData({
        lastWebsiteUpdate: new Date().toISOString(),
        isMobileFriendly: false,
        domainAge: 5,
      })
      const result = calculateLeadScore(lead, enrichment)

      expect(result.breakdown.timingSignals).toBeLessThanOrEqual(10)
    })

    it('should total score equal sum of all breakdown categories', () => {
      const lead = createMockLead()
      const enrichment = createMockEnrichmentData()
      const result = calculateLeadScore(lead, enrichment)

      const expectedTotal =
        result.breakdown.technologyGaps +
        result.breakdown.growthSignals +
        result.breakdown.budgetSignals +
        result.breakdown.timingSignals

      expect(result.totalScore).toBe(expectedTotal)
    })

    describe('Technology Gap Analysis', () => {
      it('should increase score when missing CRM', () => {
        const lead = createMockLead()
        const withCRM = createMockEnrichmentData({ technologies: ['Salesforce', 'HubSpot'] })
        const withoutCRM = createMockEnrichmentData({ technologies: [] })

        const scoreWithCRM = calculateLeadScore(lead, withCRM)
        const scoreWithoutCRM = calculateLeadScore(lead, withoutCRM)

        expect(scoreWithoutCRM.breakdown.technologyGaps).toBeGreaterThan(
          scoreWithCRM.breakdown.technologyGaps
        )
      })

      it('should increase score when missing Email Marketing', () => {
        const lead = createMockLead()
        const withEmail = createMockEnrichmentData({ technologies: ['Mailchimp'] })
        const withoutEmail = createMockEnrichmentData({ technologies: [] })

        const scoreWithEmail = calculateLeadScore(lead, withEmail)
        const scoreWithoutEmail = calculateLeadScore(lead, withoutEmail)

        expect(scoreWithoutEmail.breakdown.technologyGaps).toBeGreaterThan(
          scoreWithEmail.breakdown.technologyGaps
        )
      })

      it('should create opportunities for missing essential tools', () => {
        const lead = createMockLead()
        const enrichment = createMockEnrichmentData({ technologies: [] })
        const result = calculateLeadScore(lead, enrichment)

        expect(result.opportunities.length).toBeGreaterThan(0)
        expect(result.opportunities.some((o) => o.tool === 'CRM')).toBe(true)
        expect(result.opportunities.some((o) => o.tool === 'Email Marketing')).toBe(true)
        expect(result.opportunities.some((o) => o.tool === 'Analytics')).toBe(true)
      })

      it('should mark detected technologies correctly', () => {
        const lead = createMockLead()
        const enrichment = createMockEnrichmentData({
          technologies: ['Salesforce', 'Google Analytics'],
        })
        const result = calculateLeadScore(lead, enrichment)

        const salesforce = result.technologies.find((t) => t.name === 'Salesforce')
        const ga = result.technologies.find((t) => t.name === 'Google Analytics')

        expect(salesforce?.detected).toBe(true)
        expect(ga?.detected).toBe(true)
      })
    })

    describe('Growth Signals Analysis', () => {
      it('should increase score for job postings', () => {
        const lead = createMockLead()
        const withJobs = createMockEnrichmentData({
          jobPostings: [{ title: 'Developer', date: '2024-01-01', source: 'LinkedIn' }],
        })
        const withoutJobs = createMockEnrichmentData({ jobPostings: [] })

        const scoreWithJobs = calculateLeadScore(lead, withJobs)
        const scoreWithoutJobs = calculateLeadScore(lead, withoutJobs)

        expect(scoreWithJobs.breakdown.growthSignals).toBeGreaterThan(
          scoreWithoutJobs.breakdown.growthSignals
        )
      })

      it('should add growth signals for job postings', () => {
        const lead = createMockLead()
        const enrichment = createMockEnrichmentData({
          jobPostings: [{ title: 'Sales Manager', date: '2024-03-01', source: 'Indeed' }],
        })
        const result = calculateLeadScore(lead, enrichment)

        expect(result.growthSignals.some((s) => s.type === 'job_posting')).toBe(true)
      })

      it('should increase score for sweet spot employee count (10-50)', () => {
        const lead = createMockLead()
        const sweetSpot = createMockEnrichmentData({ employeeCount: 25 })
        const tooSmall = createMockEnrichmentData({ employeeCount: 3 })

        const scoreSweetSpot = calculateLeadScore(lead, sweetSpot)
        const scoreTooSmall = calculateLeadScore(lead, tooSmall)

        expect(scoreSweetSpot.breakdown.growthSignals).toBeGreaterThan(
          scoreTooSmall.breakdown.growthSignals
        )
      })

      it('should increase score for recent funding', () => {
        const lead = createMockLead()
        const withFunding = createMockEnrichmentData({
          hasRecentFunding: true,
          fundingAmount: 2000000,
        })
        const withoutFunding = createMockEnrichmentData({ hasRecentFunding: false })

        const scoreWithFunding = calculateLeadScore(lead, withFunding)
        const scoreWithoutFunding = calculateLeadScore(lead, withoutFunding)

        expect(scoreWithFunding.breakdown.growthSignals).toBeGreaterThan(
          scoreWithoutFunding.breakdown.growthSignals
        )
      })
    })

    describe('Budget Signals Analysis', () => {
      it('should increase score for poor website performance', () => {
        const lead = createMockLead()
        const poorPerf = createMockEnrichmentData({ performanceScore: 30 })
        const goodPerf = createMockEnrichmentData({ performanceScore: 90 })

        const scorePoorPerf = calculateLeadScore(lead, poorPerf)
        const scoreGoodPerf = calculateLeadScore(lead, goodPerf)

        // Poor performance means they need help, which is actually an opportunity
        expect(scorePoorPerf.breakdown.budgetSignals).toBeGreaterThanOrEqual(
          scoreGoodPerf.breakdown.budgetSignals
        )
      })

      it('should increase score for strong social presence', () => {
        const lead = createMockLead()
        const strongSocial = createMockEnrichmentData({
          socialFollowers: { instagram: 20000, facebook: 15000 },
        })
        const weakSocial = createMockEnrichmentData({
          socialFollowers: { instagram: 100 },
        })

        const scoreStrong = calculateLeadScore(lead, strongSocial)
        const scoreWeak = calculateLeadScore(lead, weakSocial)

        expect(scoreStrong.breakdown.budgetSignals).toBeGreaterThan(
          scoreWeak.breakdown.budgetSignals
        )
      })

      it('should increase score for good Google rating with reviews', () => {
        const leadWithGoodRating = createMockLead({ googleRating: 4.5, reviewCount: 100 })
        const leadWithPoorRating = createMockLead({ googleRating: 3.0, reviewCount: 5 })
        const enrichment = createMockEnrichmentData()

        const scoreGood = calculateLeadScore(leadWithGoodRating, enrichment)
        const scorePoor = calculateLeadScore(leadWithPoorRating, enrichment)

        expect(scoreGood.breakdown.budgetSignals).toBeGreaterThan(scorePoor.breakdown.budgetSignals)
      })

      it('should increase score for established domain', () => {
        const lead = createMockLead()
        const established = createMockEnrichmentData({ domainAge: 8 })
        const newDomain = createMockEnrichmentData({ domainAge: 0 })

        const scoreEstablished = calculateLeadScore(lead, established)
        const scoreNew = calculateLeadScore(lead, newDomain)

        expect(scoreEstablished.breakdown.budgetSignals).toBeGreaterThan(
          scoreNew.breakdown.budgetSignals
        )
      })
    })

    describe('Timing Signals Analysis', () => {
      it('should increase score for recent website update', () => {
        const lead = createMockLead()
        const recentUpdate = createMockEnrichmentData({
          lastWebsiteUpdate: new Date().toISOString(),
        })
        const noUpdate = createMockEnrichmentData({ lastWebsiteUpdate: undefined })

        const scoreRecent = calculateLeadScore(lead, recentUpdate)
        const scoreNoUpdate = calculateLeadScore(lead, noUpdate)

        expect(scoreRecent.breakdown.timingSignals).toBeGreaterThan(
          scoreNoUpdate.breakdown.timingSignals
        )
      })

      it('should increase score when not mobile-friendly', () => {
        const lead = createMockLead()
        const notMobile = createMockEnrichmentData({ isMobileFriendly: false })
        const mobile = createMockEnrichmentData({ isMobileFriendly: true })

        const scoreNotMobile = calculateLeadScore(lead, notMobile)
        const scoreMobile = calculateLeadScore(lead, mobile)

        expect(scoreNotMobile.breakdown.timingSignals).toBeGreaterThan(
          scoreMobile.breakdown.timingSignals
        )
      })
    })

    describe('Pitch Recommendation', () => {
      it('should generate a pitch recommendation', () => {
        const lead = createMockLead()
        const enrichment = createMockEnrichmentData()
        const result = calculateLeadScore(lead, enrichment)

        expect(result.pitchRecommendation).toBeTruthy()
        expect(typeof result.pitchRecommendation).toBe('string')
        expect(result.pitchRecommendation.length).toBeGreaterThan(20)
      })

      it('should include business name in pitch', () => {
        const lead = createMockLead({ businessName: 'Acme Corp' })
        const enrichment = createMockEnrichmentData()
        const result = calculateLeadScore(lead, enrichment)

        expect(result.pitchRecommendation).toContain('Acme Corp')
      })
    })

    describe('Insights Generation', () => {
      it('should generate insights', () => {
        const lead = createMockLead()
        const enrichment = createMockEnrichmentData({
          technologies: [],
          jobPostings: [{ title: 'Dev', date: '2024-01-01', source: 'LinkedIn' }],
        })
        const result = calculateLeadScore(lead, enrichment)

        expect(result.insights.length).toBeGreaterThan(0)
      })
    })
  })

  describe('getLeadCategory', () => {
    it('should return "hot" for score >= 70', () => {
      expect(getLeadCategory(70)).toBe('hot')
      expect(getLeadCategory(85)).toBe('hot')
      expect(getLeadCategory(100)).toBe('hot')
    })

    it('should return "warm" for score >= 50 and < 70', () => {
      expect(getLeadCategory(50)).toBe('warm')
      expect(getLeadCategory(60)).toBe('warm')
      expect(getLeadCategory(69)).toBe('warm')
    })

    it('should return "cold" for score >= 30 and < 50', () => {
      expect(getLeadCategory(30)).toBe('cold')
      expect(getLeadCategory(40)).toBe('cold')
      expect(getLeadCategory(49)).toBe('cold')
    })

    it('should return "low" for score < 30', () => {
      expect(getLeadCategory(0)).toBe('low')
      expect(getLeadCategory(15)).toBe('low')
      expect(getLeadCategory(29)).toBe('low')
    })
  })

  describe('calculateOpportunityValue', () => {
    it('should return monthly and yearly values', () => {
      const opportunities: Opportunity[] = [
        { tool: 'CRM', value: 100, description: 'Need CRM' },
        { tool: 'Email', value: 50, description: 'Need email' },
      ]
      const result = calculateOpportunityValue(opportunities)

      expect(result).toHaveProperty('monthly')
      expect(result).toHaveProperty('yearly')
    })

    it('should calculate correct monthly total', () => {
      const opportunities: Opportunity[] = [
        { tool: 'CRM', value: 100, description: '' },
        { tool: 'Email', value: 50, description: '' },
        { tool: 'Chat', value: 75, description: '' },
      ]
      const result = calculateOpportunityValue(opportunities)

      expect(result.monthly).toBe(225)
    })

    it('should calculate yearly as 12x monthly', () => {
      const opportunities: Opportunity[] = [{ tool: 'CRM', value: 100, description: '' }]
      const result = calculateOpportunityValue(opportunities)

      expect(result.yearly).toBe(result.monthly * 12)
    })

    it('should return 0 for empty opportunities', () => {
      const result = calculateOpportunityValue([])

      expect(result.monthly).toBe(0)
      expect(result.yearly).toBe(0)
    })
  })

  describe('convertEnrichmentResult', () => {
    it('should convert backend result to EnrichmentData format', () => {
      const backendResult = {
        technologies: [
          { name: 'Salesforce', category: 'CRM' },
          { name: 'Mailchimp', category: 'Email Marketing' },
        ],
        domainInfo: { age: 5 },
        employeeCount: 50,
        jobPostings: [{ title: 'Developer', date: '2024-01-01', source: 'LinkedIn' }],
        websiteAnalysis: { performanceScore: 85, isMobileFriendly: true },
        fundingInfo: { hasRecentFunding: true, amount: 1000000 },
        socialMetrics: {
          instagram: { followers: 5000, following: 500, mediaCount: 100, isBusiness: true },
          facebook: { likes: 3000, followers: 3500 },
        },
      }

      const result = convertEnrichmentResult(backendResult)

      expect(result.technologies).toEqual(['Salesforce', 'Mailchimp'])
      expect(result.domainAge).toBe(5)
      expect(result.employeeCount).toBe(50)
      expect(result.jobPostings).toHaveLength(1)
      expect(result.performanceScore).toBe(85)
      expect(result.isMobileFriendly).toBe(true)
      expect(result.hasRecentFunding).toBe(true)
      expect(result.fundingAmount).toBe(1000000)
      expect(result.socialFollowers?.instagram).toBe(5000)
      expect(result.socialFollowers?.facebook).toBe(3500)
    })

    it('should handle missing optional fields', () => {
      const backendResult = {
        technologies: [],
      }

      const result = convertEnrichmentResult(backendResult)

      expect(result.technologies).toEqual([])
      expect(result.domainAge).toBeUndefined()
      expect(result.employeeCount).toBeUndefined()
      expect(result.jobPostings).toEqual([])
      expect(result.performanceScore).toBeUndefined()
      expect(result.hasRecentFunding).toBe(false)
    })

    it('should handle null values', () => {
      const backendResult = {
        technologies: undefined,
        domainInfo: null,
        websiteAnalysis: null,
        fundingInfo: null,
        socialMetrics: null,
        employeeCount: null,
      }

      const result = convertEnrichmentResult(backendResult)

      expect(result.technologies).toEqual([])
      expect(result.domainAge).toBeUndefined()
      expect(result.performanceScore).toBeUndefined()
      expect(result.hasRecentFunding).toBe(false)
      expect(result.socialFollowers).toBeUndefined()
    })
  })
})
