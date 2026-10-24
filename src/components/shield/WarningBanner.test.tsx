// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { WarningBanner } from './WarningBanner';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';

describe('WarningBanner Component', () => {
  it('renders with role="alert" and aria-live="assertive" when verdict is scam', () => {
    render(
      <LanguageProvider>
        <WarningBanner verdict="scam" />
      </LanguageProvider>
    );

    const alertElement = screen.getByRole('alert');
    expect(alertElement).toBeInTheDocument();
    expect(alertElement).toHaveAttribute('aria-live', 'assertive');
    expect(screen.getByTestId('warning-headline')).toHaveTextContent(/Scam Alert/i);
  });

  it('does not render when verdict is safe', () => {
    const { container } = render(
      <LanguageProvider>
        <WarningBanner verdict="safe" />
      </LanguageProvider>
    );

    expect(container.querySelector('[role="alert"]')).toBeNull();
  });

  it('renders custom localized explanation when passed', () => {
    const customExplanation = {
      en: 'CBI never arrests over video call.',
      hi: 'सीबीआई कभी वीडियो कॉल पर गिरफ़्तार नहीं करती।',
      gu: 'સીબીઆઈ ક્યારેય વિડિયો કૉલ પર ધરપકડ નથી કરતી.',
    };

    render(
      <LanguageProvider>
        <WarningBanner verdict="scam" explanation={customExplanation} />
      </LanguageProvider>
    );

    expect(screen.getByTestId('warning-explanation')).toHaveTextContent(
      'CBI never arrests over video call.'
    );
  });

  it('autofocuses the Hang Up button when rendered and triggers onHangUp click', () => {
    const onHangUpMock = vi.fn();

    render(
      <LanguageProvider>
        <WarningBanner verdict="scam" onHangUp={onHangUpMock} />
      </LanguageProvider>
    );

    const hangUpBtn = screen.getByTestId('hang-up-button');
    expect(hangUpBtn).toBeInTheDocument();
    fireEvent.click(hangUpBtn);
    expect(onHangUpMock).toHaveBeenCalledTimes(1);
  });
});
