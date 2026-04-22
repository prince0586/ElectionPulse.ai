/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import VoterChecklist from '../src/components/VoterChecklist';

// Mock the hook to isolate component testing
vi.mock('../src/hooks/useChecklist', () => ({
  useChecklist: () => ({
    items: [
      { id: 1, text: 'Check Registration', checked: true },
      { id: 2, text: 'Research Ballot', checked: false }
    ],
    toggleItem: vi.fn(),
    isSyncing: false,
    user: { uid: 'test-user' },
    loadingAuth: false
  })
}));

// Mock Firebase modules
vi.mock('../src/lib/firebase', () => ({
  auth: {},
  db: {}
}));

describe('Institutional Integration: Voter Protocols', () => {
  it('should calculate and display progress accurately', () => {
    render(<VoterChecklist />);
    // With 1 item checked out of 2, progress should be 50%
    expect(screen.getByText(/50% Operational Readiness/i)).toBeDefined();
  });

  it('should display the secure sync indicator for authenticated users', () => {
    render(<VoterChecklist />);
    expect(screen.getByText(/Personnel Protocol/i)).toBeDefined();
  });
});
