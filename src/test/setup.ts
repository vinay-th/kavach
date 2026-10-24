import '@testing-library/jest-dom';

// Global mocks for DOM APIs not implemented in jsdom
if (typeof window !== 'undefined') {
  // Mock Element.prototype.scrollIntoView
  Element.prototype.scrollIntoView = () => {};

  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
