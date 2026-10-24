// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { RiskGauge } from './RiskGauge';

describe('RiskGauge Component', () => {
  it('renders with role="meter" and correct aria attributes for safe score', () => {
    render(<RiskGauge score={18} verdict="safe" />);

    const meter = screen.getByRole('meter');
    expect(meter).toBeInTheDocument();
    expect(meter).toHaveAttribute('aria-valuenow', '18');
    expect(meter).toHaveAttribute('aria-valuemin', '0');
    expect(meter).toHaveAttribute('aria-valuemax', '100');
    expect(meter).toHaveAttribute('aria-label', 'SAFE');

    expect(screen.getByTestId('verdict-label')).toHaveTextContent('SAFE');
  });

  it('renders SUSPICIOUS label when verdict is suspicious', () => {
    render(<RiskGauge score={52} verdict="suspicious" />);

    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('aria-valuenow', '52');
    expect(meter).toHaveAttribute('aria-label', 'SUSPICIOUS');
    expect(screen.getByTestId('verdict-label')).toHaveTextContent('SUSPICIOUS');
  });

  it('renders SCAM DETECTED label when verdict is scam', () => {
    render(<RiskGauge score={94} verdict="scam" />);

    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('aria-valuenow', '94');
    expect(meter).toHaveAttribute('aria-label', 'SCAM DETECTED');
    expect(screen.getByTestId('verdict-label')).toHaveTextContent('SCAM DETECTED');
  });

  it('clamps scores below 0 or above 100 gracefully', () => {
    render(<RiskGauge score={120} verdict="scam" />);
    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('aria-valuenow', '100');
  });
});
