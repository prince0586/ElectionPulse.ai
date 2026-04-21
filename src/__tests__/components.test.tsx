/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Navbar from '../components/Navbar';

describe('Institutional UI Components', () => {
  it('Navbar should render with standard branding', () => {
    const toggle = vi.fn();
    render(<Navbar isHighContrast={false} toggleContrast={toggle} />);
    expect(screen.getByText(/ElectionPulse.ai/i)).toBeDefined();
  });

  it('Navbar should show Contrast button', () => {
    const toggle = vi.fn();
    render(<Navbar isHighContrast={false} toggleContrast={toggle} />);
    expect(screen.getByText(/Contrast/i)).toBeDefined();
  });
});
