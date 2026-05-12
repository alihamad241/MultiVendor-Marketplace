import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  'backend/vitest.config.js',
  'frontend/vitest.config.js',
  {
    test: {
      include: ['tests/**/*.test.js'],
      environment: 'node',
    }
  }
])
