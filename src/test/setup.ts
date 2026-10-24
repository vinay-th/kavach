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

  if (typeof window.Animation !== 'undefined') {
    const origCancel = window.Animation.prototype.cancel;
    window.Animation.prototype.cancel = function () {
      try {
        this.finished?.catch(() => {});
      } catch {
        // ignore
      }
      return origCancel.call(this);
    };
  }
}

