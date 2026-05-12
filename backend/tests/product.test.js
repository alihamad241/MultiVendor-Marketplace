import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../server.js';
import Product from '../models/product.model.js';
import Store from '../models/store.model.js';
import { redis } from '../libs/redis.js';

// Mock Dependencies
vi.mock('../libs/redis.js', () => ({
  redis: {
    get: vi.fn(),
    set: vi.fn(),
  },
}));
vi.mock('../models/product.model.js');
vi.mock('../models/store.model.js');

describe('Product API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/products', () => {
    it('should fetch all products when no filters are applied', async () => {
      const mockProducts = [
        { name: 'Product 1', price: 100 },
        { name: 'Product 2', price: 200 },
      ];

      Product.find.mockResolvedValue(mockProducts);

      const response = await request(app).get('/api/products');

      expect(response.status).toBe(200);
      expect(response.body.products).toHaveLength(2);
      expect(Product.find).toHaveBeenCalledWith({});
    });

    it('should filter products by category', async () => {
      const category = 'Shoes';
      Product.find.mockResolvedValue([]);

      await request(app).get(`/api/products?category=${category}`);

      expect(Product.find).toHaveBeenCalledWith({
        category: { $regex: `^${category}$`, $options: "i" }
      });
    });
  });

  describe('GET /api/products/featured', () => {
    it('should return cached products if available', async () => {
      const cachedProducts = [{ name: 'Featured 1' }];
      redis.get.mockResolvedValue(JSON.stringify(cachedProducts));

      const response = await request(app).get('/api/products/featured');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(cachedProducts);
      expect(Product.find).not.toHaveBeenCalled();
    });

    it('should fetch from DB and cache if not in Redis', async () => {
      redis.get.mockResolvedValue(null);
      const dbProducts = [{ name: 'Featured DB' }];
      // Use mockReturnValue since we are chaining .lean()
      Product.find.mockReturnValue({
        lean: vi.fn().mockResolvedValue(dbProducts)
      });

      const response = await request(app).get('/api/products/featured');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(dbProducts);
      expect(redis.set).toHaveBeenCalled();
    });
  });
});
