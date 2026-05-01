import { test, expect } from '@playwright/test';

test('blocks empty login then allows valid user login to user dashboard', async ({ page }) => {
  await page.goto('/');

  await page.click('button:has-text("Login")');
  await expect(page.getByText('Please fill email and password before continuing.')).toBeVisible();

  await page.fill('#email', 'user@dms.com');
  await page.fill('#password', '123');
  await page.click('button:has-text("Login")');

  await expect(page.getByRole('heading', { name: 'Welcome back, Samir Guenchi' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Upload New Document' })).toBeVisible();
});

test('protects dashboard route when user is not authenticated', async ({ page }) => {
  await page.goto('/dashboard/admin');
  await expect(page.getByRole('heading', { name: 'Document Management System' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
});
