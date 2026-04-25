/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Navbar from '../src/components/Navbar';
import TimelineStep from '../src/components/TimelineStep';
import { TIMELINE_DATA } from '../src/constants';

describe('Institutional UI Components', () => {
  describe('Navbar', () => {
    it('should render with standard branding', () => {
      const toggle = vi.fn();
      render(
        <Navbar 
          isHighContrast={false} 
          toggleContrast={toggle} 
          currentTheme="minimal" 
          setTheme={vi.fn()} 
        />
      );
      expect(screen.getByText(/ElectionPulse.ai/i)).toBeDefined();
    });

    it('should show Contrast button', () => {
      const toggle = vi.fn();
      render(
        <Navbar 
          isHighContrast={false} 
          toggleContrast={toggle} 
          currentTheme="minimal" 
          setTheme={vi.fn()} 
        />
      );
      expect(screen.getByText(/Contrast/i)).toBeDefined();
    });
  });

  describe('TimelineStep', () => {
    const mockStep = TIMELINE_DATA[0];

    it('should show the stage title', () => {
      render(<TimelineStep step={mockStep} index={0} total={5} />);
      expect(screen.getByText(mockStep.title)).toBeDefined();
    });

    it('should toggle detail view on click', () => {
      render(<TimelineStep step={mockStep} index={0} total={5} />);
      const card = screen.getByRole('button');
      
      // For index 0, it starts closed.
      expect(screen.queryByText(mockStep.description)).toBeNull();
      
      fireEvent.click(card);
      expect(screen.queryByText(mockStep.description)).toBeDefined();
    });
  });
});
