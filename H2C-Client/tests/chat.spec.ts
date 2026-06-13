import { test, expect } from '@playwright/test';

test.describe('Coaching Chat Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('mindmate_user', JSON.stringify({
        name: 'Jane',
        examType: 'UPSC',
        joinedAt: new Date().toISOString()
      }));
    });
    await page.goto('/chat');
  });

  test('should load greeting and respond to messages', async ({ page }) => {
    // Check initial coach greeting
    await expect(page.locator('text=Hi there! I am your MindMate Wellness Coach')).toBeVisible();

    // Check prompt chips
    await expect(page.locator('button:has-text("I am feeling stressed about exams")')).toBeVisible();

    // Fill in message input and send
    const input = page.locator('input[placeholder*="Ask anything about stress management"]');
    await input.fill('I feel burnt out from GATE studying');
    await page.click('button:has-text("Send")');

    // Verify user bubble appeared
    await expect(page.locator('div:has-text("I feel burnt out from GATE studying")').first()).toBeVisible();

    // Verify AI response bubble appeared (should have at least 2 bot messages now)
    const botMessages = page.locator('div.self-start');
    await expect(botMessages).toHaveCount(2, { timeout: 10000 });
  });
});
