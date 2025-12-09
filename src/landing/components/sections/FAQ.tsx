import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { fadeInUp, staggerContainer } from '../../lib/animations'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function FAQ() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const faqs = [
    {
      question: '"It\'s too expensive"',
      answer: `Too expensive?

Let's do the math together.

LeadFlow Pro costs $149/month.

Your average deal is worth what? $3,000? $5,000? $10,000?

You need to close ONE extra deal per YEAR to make your money back.

One. Deal. Per. Year.

Our average user closes one extra deal in their first TWO WEEKS.

So really, the question isn't "can I afford LeadFlow Pro?"

The question is "can I afford to keep LOSING $141,000 per year on wasted outreach to leads that were never going to buy?"

$149/month isn't expensive.

$141,000/year in lost revenue is expensive.

Your indecision is expensive.

The status quo is expensive.

LeadFlow Pro is the cheapest thing you'll ever buy.`,
    },
    {
      question: '"I need to think about it"',
      answer: `"I need to think about it."

I hear this a lot. And I respect it. Big decisions deserve thought.

But let me ask you something:

What exactly do you need to think about?

Whether lead intelligence works? (I just showed you the data.)

Whether you can afford it? (It costs less than your Netflix subscription per day.)

Whether now is the right time? (Is there ever a "right time" to stop losing money?)

Here's what "I need to think about it" really means:

It means you're going to close this page, get distracted by something else, forget about this conversation, and wake up 6 months from now in the exact same position.

Still grinding. Still guessing. Still watching competitors close deals you should have won.

Is that what you want?

Because the agencies who said "yes" six months ago? They're not "thinking about it" anymore. They're counting their money.

There's a free tier. No credit card required. Literally zero risk.

What is there to think about?`,
    },
    {
      question: '"I\'ll try it later"',
      answer: `"I'll try it later."

Later.

Such a dangerous word.

Let me tell you what "later" actually means:

Later = never.

How many times have you told yourself "I'll do that later" and actually done it?

How many books are on your "read later" list?
How many courses are in your "watch later" folder?
How many opportunities have you missed because "later" never came?

The agencies who are crushing it right now didn't wait for "later."

They decided. They acted. They're winning.

Every day you delay is another day of:
• Lost deals
• Wasted research time
• Competitors gaining ground

"Later" is the most expensive word in business.

The best time to start was 6 months ago. The second best time is RIGHT NOW.

Not later. Now.`,
    },
    {
      question: 'How accurate is the lead scoring?',
      answer: `Our lead scoring is based on 23 distinct data points that we've correlated with actual closed deals across 100,000+ leads.

The scoring weights are continuously updated based on user outcomes.

On average, leads scored 85+ close at 4-6x the rate of randomly selected leads.

Is it perfect? No. Some high-scored leads won't close, and some low-scored leads will.

But that's not the point.

The point is: would you rather call 100 random leads and close 3, or call 25 high-scored leads and close 3-6?

The math is simple. Even if our scoring was only 50% better than random (it's much better), you'd still be ahead.`,
    },
    {
      question: 'What makes this different from Apollo or ZoomInfo?',
      answer: `Apollo and ZoomInfo give you contact databases. Names, emails, phone numbers.

That's it.

They don't tell you:
• Which leads actually need what you sell
• Which leads can afford your services
• Which leads are ready to buy NOW
• What to say to each lead
• Why they'll be interested

You're still GUESSING which leads will close.

LeadFlow Pro gives you INTELLIGENCE.

Every lead comes with a score, technology gaps, growth signals, and recommended pitch angles.

You know who to call, why to call them, and what to say — before you ever pick up the phone.

It's the difference between a phonebook and a crystal ball.`,
    },
    {
      question: 'Is there a contract?',
      answer: `No contracts. No commitments. No annual lock-ins.

Pay monthly, cancel anytime.

We believe you should stay because the product works, not because you're trapped.

Most users who try Pro never leave. Because it works.

If it doesn't work for you, cancel with one click. No phone calls, no "retention specialists," no guilt trips.

We're confident enough in our product to let you leave whenever you want.`,
    },
    {
      question: 'How long until I see results?',
      answer: `Most users see their first hot lead within 10 minutes of signing up.

Our average user closes their first deal from LeadFlow Pro within 2 weeks.

The fastest? 3 days. (New agency, zero experience, found a 94-scored lead, closed $2,500/month.)

But here's the truth: the results depend on you actually using it.

LeadFlow Pro shows you WHO to call and WHY. You still have to make the calls.

We give you the intelligence. You close the deals.`,
    },
    {
      question: 'What if it doesn\'t work for my industry?',
      answer: `LeadFlow Pro works for any B2B service targeting local and mid-market businesses.

Marketing agencies, web designers, SEO consultants, IT services, business consultants, accountants, commercial real estate, and more.

If you're selling to businesses with websites, we can score them.

The one area where we're less effective: Fortune 500 enterprise sales. Those deals are too complex for technology detection alone.

If you're selling $500K contracts to massive corporations, ZoomInfo might be your play.

But if you're selling $2K-$50K services to local and mid-market businesses? Nothing beats LeadFlow Pro.`,
    },
  ]

  return (
    <section ref={ref} className="py-24 bg-void relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          className="max-w-3xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <HelpCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Questions & Objections</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Still Have Doubts? <span className="text-primary">Let's Address Them.</span>
            </h2>
          </motion.div>

          {/* FAQ Items */}
          <motion.div variants={fadeInUp} className="space-y-4">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-card/50 hover:bg-card/70 transition-colors text-left"
      >
        <span className="font-semibold text-foreground">{question}</span>
        <ChevronDown className={cn(
          'w-5 h-5 text-muted-foreground transition-transform',
          isOpen && 'rotate-180'
        )} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-6 py-4 bg-surface/30">
              <p className="text-muted-foreground whitespace-pre-line text-sm leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
