import { describe, it, expect } from 'vitest'
import { cn } from '../lib/utils'

describe('Utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'conditional')).toBe('base conditional')
      expect(cn('base', false && 'conditional')).toBe('base')
    })

    it('should merge conflicting Tailwind classes', () => {
      expect(cn('p-4 p-2')).toBe('p-2')
    })
  })
})
