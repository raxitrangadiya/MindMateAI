import { test, expect } from '@playwright/test';

test.describe('Routing and Guards Feature', () => {
  test('guest user should access landing page but get redirected from dashboard', async ({ page }) => {
    // Guest visiting landing page
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Conquer Your Exam Stress');

    // Guest visiting onboarding page
    await page.goto('/onboarding');
    await expect(page.locator('h2')).toContainText('Welcome to MindMate');

    // Guest trying to access protected dashboard route should be redirected to onboarding
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/onboarding/);
  });

  test('logged in user should be redirected from landing and onboarding to dashboard', async ({ page }) => {
    // Inject user state in localStorage
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('mindmate_user', JSON.stringify({
        name: 'Jane Doe',
        examType: 'GATE',
        joinedAt: new Date().toISOString()
      }));
    });

    // Visiting landing page as logged-in user should redirect to dashboard
    await page.goto('/');
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('h1')).toContainText('Hey, Jane Doe!');

    // Visiting onboarding page as logged-in user should redirect to dashboard
    await page.goto('/onboarding');
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
