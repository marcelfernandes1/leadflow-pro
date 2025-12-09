import { describe, it, expect } from 'vitest'
import {
  cn,
  formatCurrency,
  formatNumber,
  getScoreCategory,
  getScoreEmoji,
  truncate,
  sleep,
} from './utils'

describe('Utils', () => {
  describe('cn (class names)', () => {
    it('should merge class names', () => {
      const result = cn('foo', 'bar')
      expect(result).toBe('foo bar')
    })

    it('should handle conditional classes', () => {
      const result = cn('base', true && 'truthy', false && 'falsy')
      expect(result).toBe('base truthy')
    })

    it('should merge tailwind classes correctly', () => {
      const result = cn('px-4', 'px-8')
      expect(result).toBe('px-8') // Later class should win
    })

    it('should handle array inputs', () => {
      const result = cn(['foo', 'bar'])
      expect(result).toBe('foo bar')
    })

    it('should handle object inputs', () => {
      const result = cn({ foo: true, bar: false, baz: true })
      expect(result).toBe('foo baz')
    })

    it('should handle undefined and null', () => {
      const result = cn('foo', undefined, null, 'bar')
      expect(result).toBe('foo bar')
    })
  })

  describe('formatCurrency', () => {
    it('should format whole numbers', () => {
      expect(formatCurrency(1000)).toBe('$1,000')
      expect(formatCurrency(50000)).toBe('$50,000')
    })

    it('should format zero', () => {
      expect(formatCurrency(0)).toBe('$0')
    })

    it('should round decimals', () => {
      expect(formatCurrency(1234.56)).toBe('$1,235')
      expect(formatCurrency(1234.49)).toBe('$1,234')
    })

    it('should format large numbers with commas', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000')
    })
  })

  describe('formatNumber', () => {
    it('should add commas to large numbers', () => {
      expect(formatNumber(1000)).toBe('1,000')
      expect(formatNumber(1000000)).toBe('1,000,000')
    })

    it('should handle small numbers', () => {
      expect(formatNumber(0)).toBe('0')
      expect(formatNumber(999)).toBe('999')
    })

    it('should handle decimals', () => {
      expect(formatNumber(1234.56)).toBe('1,234.56')
    })
  })

  describe('getScoreCategory', () => {
    it('should return "hot" for scores >= 80', () => {
      expect(getScoreCategory(80)).toBe('hot')
      expect(getScoreCategory(90)).toBe('hot')
      expect(getScoreCategory(100)).toBe('hot')
    })

    it('should return "warm" for scores >= 60 and < 80', () => {
      expect(getScoreCategory(60)).toBe('warm')
      expect(getScoreCategory(70)).toBe('warm')
      expect(getScoreCategory(79)).toBe('warm')
    })

    it('should return "cold" for scores >= 40 and < 60', () => {
      expect(getScoreCategory(40)).toBe('cold')
      expect(getScoreCategory(50)).toBe('cold')
      expect(getScoreCategory(59)).toBe('cold')
    })

    it('should return "low" for scores < 40', () => {
      expect(getScoreCategory(0)).toBe('low')
      expect(getScoreCategory(20)).toBe('low')
      expect(getScoreCategory(39)).toBe('low')
    })
  })

  describe('getScoreEmoji', () => {
    it('should return fire emoji for hot scores', () => {
      expect(getScoreEmoji(80)).toBe('🔥')
      expect(getScoreEmoji(100)).toBe('🔥')
    })

    it('should return thermometer emoji for warm scores', () => {
      expect(getScoreEmoji(60)).toBe('🌡️')
      expect(getScoreEmoji(79)).toBe('🌡️')
    })

    it('should return ice emoji for cold scores', () => {
      expect(getScoreEmoji(40)).toBe('🧊')
      expect(getScoreEmoji(59)).toBe('🧊')
    })

    it('should return empty string for low scores', () => {
      expect(getScoreEmoji(0)).toBe('')
      expect(getScoreEmoji(39)).toBe('')
    })
  })

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...')
    })

    it('should not truncate short strings', () => {
      expect(truncate('Hi', 5)).toBe('Hi')
    })

    it('should handle exact length', () => {
      expect(truncate('Hello', 5)).toBe('Hello')
    })

    it('should handle empty string', () => {
      expect(truncate('', 5)).toBe('')
    })

    it('should handle length of 0', () => {
      expect(truncate('Hello', 0)).toBe('...')
    })
  })

  describe('sleep', () => {
    it('should return a promise', () => {
      const result = sleep(1)
      expect(result).toBeInstanceOf(Promise)
    })

    it('should resolve after specified time', async () => {
      const start = Date.now()
      await sleep(50)
      const elapsed = Date.now() - start
      expect(elapsed).toBeGreaterThanOrEqual(45) // Allow some variance
    })
  })
})
