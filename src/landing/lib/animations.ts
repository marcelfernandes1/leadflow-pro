import type { Variants, Transition } from 'framer-motion'

// Standard easing curves
export const easing = {
  smooth: [0.4, 0, 0.2, 1] as const,
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
  snappy: [0.25, 0.1, 0.25, 1] as const,
}

// Fade in variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0 },
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 },
}

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 },
}

// Scale variants
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
}

export const scaleInBounce: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  },
}

// Stagger children container
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
}

// Reveal on scroll
export const revealOnScroll: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easing.smooth }
  },
}

// Pulse animation for CTAs
export const pulseGlow: Variants = {
  initial: { boxShadow: '0 0 0 0 rgba(61, 123, 242, 0.4)' },
  animate: {
    boxShadow: [
      '0 0 0 0 rgba(61, 123, 242, 0.4)',
      '0 0 20px 8px rgba(61, 123, 242, 0.2)',
      '0 0 0 0 rgba(61, 123, 242, 0)'
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

// Number counter animation config
export const counterTransition: Transition = {
  duration: 1.5,
  ease: easing.smooth,
}

// Card hover
export const cardHover: Variants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.2, ease: easing.smooth }
  },
}

// Slide in from edge (for popups/modals)
export const slideInFromBottom: Variants = {
  hidden: { opacity: 0, y: '100%' },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: easing.smooth }
  },
  exit: {
    opacity: 0,
    y: '100%',
    transition: { duration: 0.2, ease: easing.smooth }
  }
}

export const slideInFromRight: Variants = {
  hidden: { opacity: 0, x: '100%' },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: easing.smooth }
  },
  exit: {
    opacity: 0,
    x: '100%',
    transition: { duration: 0.2, ease: easing.smooth }
  }
}

export const slideInFromTop: Variants = {
  hidden: { opacity: 0, y: '-100%' },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: easing.smooth }
  },
  exit: {
    opacity: 0,
    y: '-100%',
    transition: { duration: 0.2, ease: easing.smooth }
  }
}

// Modal backdrop
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
}

// Score gauge fill
export const gaugeFill: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (score: number) => ({
    pathLength: score / 100,
    opacity: 1,
    transition: { duration: 1.5, ease: easing.smooth, delay: 0.3 }
  })
}

// Typing effect helper
export const typewriterContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
}

export const typewriterChar: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

// Notification pop
export const notificationPop: Variants = {
  hidden: { opacity: 0, scale: 0.8, x: 100 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 500, damping: 30 }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    x: 100,
    transition: { duration: 0.2 }
  }
}
