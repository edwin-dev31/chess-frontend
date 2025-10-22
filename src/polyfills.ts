if (typeof globalThis.global === 'undefined') {
  // Node compatibility
  // @ts-ignore
  globalThis.global = globalThis;
}

if (typeof globalThis.process === 'undefined') {
  // @ts-ignore
  globalThis.process = { env: {} };
}

if (typeof globalThis.fetch === 'undefined' && typeof window !== 'undefined') {
  globalThis.fetch = window.fetch.bind(window);
}

if (typeof globalThis.setImmediate === 'undefined') {
  // @ts-ignore
  globalThis.setImmediate = (fn: Function, ...args: any[]) => setTimeout(fn, 0, ...args);
}
