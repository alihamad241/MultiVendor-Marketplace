import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../server.js';
import User from '../models/user.model.js';
import { redis } from '../libs/redis.js';

// Mock Redis
vi.mock('../libs/redis.js', () => ({
  redis: {
    set: vi.fn().mockResolvedValue('OK'),
    get: vi.fn().mockResolvedValue(null),
    del: vi.fn().mockResolvedValue(1),
  },
}));

// Mock User model
vi.mock('../models/user.model.js');

describe('Auth API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user and return 201', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      // Mock User.findOne to return null (user doesn't exist)
      User.findOne.mockResolvedValue(null);
      // Mock User.create to return a fake user
      User.create.mockResolvedValue({
        _id: 'fake_id',
        ...userData,
        role: 'customer',
      });

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.message).toBe('User created successfully');
      expect(redis.set).toHaveBeenCalled(); // Ensure refresh token was stored
    });

    it('should return 400 if user already exists', async () => {
      User.findOne.mockResolvedValue({ email: 'test@example.com' });

      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const user = {
        _id: 'fake_id',
        email: 'test@example.com',
        comparePassword: vi.fn().mockResolvedValue(true),
        role: 'customer',
      };

      User.findOne.mockResolvedValue(user);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Login successful');
    });

    it('should return 401 with incorrect credentials', async () => {
      const user = {
        email: 'test@example.com',
        comparePassword: vi.fn().mockResolvedValue(false),
      };

      User.findOne.mockResolvedValue(user);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });
});
