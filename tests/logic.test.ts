/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { getGoogleCalendarLink } from '../src/utils/calendar';
import { STATE_WAIT_FACTORS } from '../src/constants';

describe('Operational Logic Engine', () => {
  describe('Calendar Link Generator', () => {
    it('should generate a Template action link', () => {
      const link = getGoogleCalendarLink('Registration', '2026-10-01', 'Description');
      expect(link).toContain('calendar.google.com/calendar/render');
      expect(link).toContain('action=TEMPLATE');
    });

    it('should encode specific dates for registration', () => {
      const link = getGoogleCalendarLink('Registration Period', '2026-09-30', 'Desc');
      expect(link).toContain('20260930');
    });
    
    it('should escape special characters in descriptions', () => {
      const link = getGoogleCalendarLink('Test', 'Date', 'A & B');
      expect(link).toContain('A%20%26%20B');
    });
  });

  describe('Predictive Wait Metrics', () => {
    it('should derive consistent factors for known states', () => {
      expect(STATE_WAIT_FACTORS.NY).toBeGreaterThan(1);
      expect(STATE_WAIT_FACTORS.WY).toBeLessThan(1);
    });

    it('should fallback to default factor of 1.0', () => {
      expect(STATE_WAIT_FACTORS.Default).toBe(1.0);
    });
  });
});
