import { describe, it, expect, vi } from 'vitest';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';

// Mock bcrypt to avoid real hashing during unit tests
vi.mock('bcryptjs', () => ({
  default: {
    compare: vi.fn(),
    genSalt: vi.fn().mockResolvedValue('salt'),
    hash: vi.fn().mockResolvedValue('hashed_password'),
  }
}));

describe('User Model Unit Tests', () => {
  it('should correctly compare passwords using bcrypt', async () => {
    const user = new User({ password: 'hashed_password' });
    bcrypt.compare.mockResolvedValue(true);

    const isMatch = await user.comparePassword('password123');
    
    expect(isMatch).toBe(true);
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password');
  });

  it('should return false for incorrect passwords', async () => {
    const user = new User({ password: 'hashed_password' });
    bcrypt.compare.mockResolvedValue(false);

    const isMatch = await user.comparePassword('wrong_password');
    
    expect(isMatch).toBe(false);
  });
});
