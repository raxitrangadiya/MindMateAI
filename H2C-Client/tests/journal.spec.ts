import { test, expect } from '@playwright/test';

test.describe('Journal Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to landing page, then set user state in localStorage
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('mindmate_user', JSON.stringify({
        name: 'John Doe',
        examType: 'JEE',
        joinedAt: new Date().toISOString()
      }));
    });
    // Go to journal page
    await page.goto('/journal');
  });

  test('should display existing entries', async ({ page }) => {
    // Check for previous journals headers
    await expect(page.locator('h2:has-text("Previous Journals")')).toBeVisible();
    
    // Check if the mock entries are rendered in the sidebar list
    const entriesList = page.locator('button:has-text("Today was hard")');
    await expect(entriesList).toBeVisible();
  });

  test('should allow writing and submitting a new journal', async ({ page }) => {
    const textarea = page.locator('textarea[placeholder*="How is your preparation going"]');
    await expect(textarea).toBeVisible();

    // Try submitting too short entry
    await textarea.fill('Short entry');
    await page.click('button:has-text("Analyze Stress & Mood")');
    await expect(page.locator('p:has-text("Write at least 20 characters")')).toBeVisible();

    // Submit valid entry
    await textarea.fill('Testing writing a long journal entry to verify AI analysis works correctly.');
    await page.click('button:has-text("Analyze Stress & Mood")');

    // Verification of new analysis rendering
    await expect(page.locator('h2:has-text("AI Cognitive Breakdown")')).toBeVisible();
    await expect(page.locator('h3:has-text("AI Mind-Care Recommendations")')).toBeVisible();
  });
});
