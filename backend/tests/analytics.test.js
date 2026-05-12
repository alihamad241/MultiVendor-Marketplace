import { describe, it, expect } from 'vitest';

// Logic extracted from analytics.controller.js for pure unit testing
function getDatesInRange(startDate, endDate) {
	const dates = [];
	let currentDate = new Date(startDate);

	while (currentDate <= endDate) {
		dates.push(currentDate.toISOString().split("T")[0]);
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return dates;
}

describe('Analytics Utility Unit Tests', () => {
  it('should generate a correct array of dates for a specific date range', () => {
    const start = new Date('2024-08-01');
    const end = new Date('2024-08-05');
    const result = getDatesInRange(start, end);
    
    expect(result).toHaveLength(5);
    expect(result).toEqual([
      '2024-08-01',
      '2024-08-02',
      '2024-08-03',
      '2024-08-04',
      '2024-08-05'
    ]);
  });

  it('should handle a single day range correctly', () => {
    const start = new Date('2024-12-25');
    const end = new Date('2024-12-25');
    const result = getDatesInRange(start, end);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toBe('2024-12-25');
  });

  it('should return an empty array if start date is after end date', () => {
    const start = new Date('2024-12-31');
    const end = new Date('2024-12-01');
    const result = getDatesInRange(start, end);
    
    expect(result).toEqual([]);
  });
});
