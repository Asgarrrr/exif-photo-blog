// Bun test configuration
// This file configures Bun's built-in test runner
// For compatibility with existing Jest tests, we keep jest.config.ts

import type { TestOptions } from 'bun:test';

export const testConfig: TestOptions = {
  timeout: 10000,
  preload: ['./jest.setup.ts'],
  coverage: {
    enabled: true,
    reporter: ['text', 'lcov'],
    exclude: [
      'node_modules/**',
      '__tests__/**',
      '*.config.*',
      '*.setup.*',
      'coverage/**'
    ]
  }
};

export default testConfig;
