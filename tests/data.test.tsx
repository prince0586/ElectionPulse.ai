/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { TIMELINE_DATA } from '../src/constants';

describe('Voter Intelligence Data', () => {
  it('should have a complete timeline with 6 stages', () => {
    expect(TIMELINE_DATA).toHaveLength(6);
  });

  it('should have valid status for each timeline step', () => {
    TIMELINE_DATA.forEach(step => {
      expect(['Completed', 'Active', 'Upcoming']).toContain(step.status);
    });
  });
});
