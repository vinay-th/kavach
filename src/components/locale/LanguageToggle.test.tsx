// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { LanguageToggle } from './LanguageToggle';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';

function LanguageDisplay() {
  const { language } = useLanguage();
  return <div data-testid="active-lang">{language}</div>;
}

describe('LanguageToggle Component', () => {
  it('switches languages across Gujarati, Hindi, and English', () => {
    render(
      <LanguageProvider>
        <LanguageToggle />
        <LanguageDisplay />
      </LanguageProvider>
    );

    // Initial default language is English ('en')
    expect(screen.getByTestId('active-lang')).toHaveTextContent('en');

    // Click Gujarati
    fireEvent.click(screen.getByRole('button', { name: /Switch to ગુજરાતી/i }));
    expect(screen.getByTestId('active-lang')).toHaveTextContent('gu');

    // Click Hindi
    fireEvent.click(screen.getByRole('button', { name: /Switch to हिन्दी/i }));
    expect(screen.getByTestId('active-lang')).toHaveTextContent('hi');

    // Click English
    fireEvent.click(screen.getByRole('button', { name: /Switch to English/i }));
    expect(screen.getByTestId('active-lang')).toHaveTextContent('en');
  });
});
