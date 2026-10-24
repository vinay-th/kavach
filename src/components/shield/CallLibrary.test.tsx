// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { CallLibrary } from './CallLibrary';

describe('CallLibrary Component', () => {
  it('renders all 4 available call scenarios', () => {
    render(
      <CallLibrary
        selectedScenarioId="scam-digital-arrest"
        onSelectScenario={() => {}}
      />
    );

    expect(screen.getByText(/Digital Arrest Extortion/i)).toBeInTheDocument();
    expect(screen.getByText(/Customs \/ FedEx Parcel Seizure/i)).toBeInTheDocument();
    expect(screen.getByText(/Fake Electricity \/ KYC Suspension/i)).toBeInTheDocument();
    expect(screen.getByText(/Genuine Delivery Partner Call/i)).toBeInTheDocument();
  });

  it('selects a scenario via mouse click', () => {
    const onSelectMock = vi.fn();

    render(
      <CallLibrary
        selectedScenarioId="scam-digital-arrest"
        onSelectScenario={onSelectMock}
      />
    );

    const deliveryCard = screen.getByTestId('scenario-genuine-delivery');
    fireEvent.click(deliveryCard);

    expect(onSelectMock).toHaveBeenCalledWith('genuine-delivery');
  });

  it('supports keyboard selection with Enter and Space keys', () => {
    const onSelectMock = vi.fn();

    render(
      <CallLibrary
        selectedScenarioId="scam-digital-arrest"
        onSelectScenario={onSelectMock}
      />
    );

    const courierCard = screen.getByTestId('scenario-scam-courier-customs');

    // Trigger Enter key
    fireEvent.keyDown(courierCard, { key: 'Enter' });
    expect(onSelectMock).toHaveBeenCalledWith('scam-courier-customs');

    // Trigger Space key
    fireEvent.keyDown(courierCard, { key: ' ' });
    expect(onSelectMock).toHaveBeenCalledTimes(2);
  });
});
