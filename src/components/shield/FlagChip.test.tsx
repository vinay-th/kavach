// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { FlagChip } from './FlagChip';
import { LanguageProvider } from '@/context/LanguageContext';
import type { RedFlag } from '@/types/analysis';

describe('FlagChip Component', () => {
  const fakePoliceFlag: RedFlag = {
    type: 'fake_authority',
    evidence: 'Claims to be ACP from Mumbai Crime Branch',
  };

  it('renders the label, an accessible icon, and the exact phrase heard', () => {
    render(
      <LanguageProvider>
        <FlagChip flag={fakePoliceFlag} />
      </LanguageProvider>
    );

    const label = screen.getByTestId('flag-label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent(/Fake Authority/i);

    const icon = screen.getByTestId('flag-icon');
    expect(icon).toBeInTheDocument();

    const evidence = screen.getByTestId('flag-evidence');
    expect(evidence).toHaveTextContent('Claims to be ACP from Mumbai Crime Branch');
  });

  it('renders correctly for urgency red flag type', () => {
    const urgencyFlag: RedFlag = {
      type: 'urgency',
      evidence: 'Transfer money within 15 minutes or police will raid',
    };

    render(
      <LanguageProvider>
        <FlagChip flag={urgencyFlag} />
      </LanguageProvider>
    );

    expect(screen.getByTestId('flag-label')).toHaveTextContent(/Urgency/i);
    expect(screen.getByTestId('flag-evidence')).toHaveTextContent(
      'Transfer money within 15 minutes or police will raid'
    );
  });
});
