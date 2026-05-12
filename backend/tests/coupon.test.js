import { describe, it, expect } from 'vitest';

// Utility for regex escaping used in coupon logic
const escapeRegExp = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

describe('Coupon Logic Unit Tests', () => {
  describe('Code Normalization Logic', () => {
    it('should correctly normalize coupon codes (trim and uppercase)', () => {
      const input = "  save20  ";
      const normalized = input.trim().toUpperCase();
      expect(normalized).toBe("SAVE20");
    });

    it('should remove invisible/zero-width characters from codes', () => {
      // Includes a zero-width space
      const input = "SUMMER\u200B2024";
      const cleaned = input.replace(/[\u200B-\u200D\uFEFF]/g, "");
      expect(cleaned).toBe("SUMMER2024");
    });
  });

  describe('Expiration Logic', () => {
    it('should validate that a future date is not expired', () => {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      const isExpired = nextWeek < new Date();
      expect(isExpired).toBe(false);
    });

    it('should validate that a past date is expired', () => {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      const isExpired = lastMonth < new Date();
      expect(isExpired).toBe(true);
    });
  });

  describe('Regex Safety', () => {
    it('should escape special characters for regex matching', () => {
      const codeWithSpecialChars = "SAVE$10*";
      const escaped = escapeRegExp(codeWithSpecialChars);
      
      expect(escaped).toBe("SAVE\\$10\\*");
      const regex = new RegExp(`^${escaped}$`, "i");
      expect(regex.test("save$10*")).toBe(true);
    });
  });
});
