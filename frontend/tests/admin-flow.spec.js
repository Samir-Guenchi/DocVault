import { test, expect } from '@playwright/test';

test('admin can log in and see management sections', async ({ page }) => {
  await page.goto('/');

  await page.fill('#email', 'admin@dms.com');
  await page.fill('#password', '123');
  await page.click('button:has-text("Login")');

  await expect(page.getByRole('heading', { name: 'Welcome back, IT Admin' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Users Management' })).toBeVisible();

  await page.getByRole('button', { name: 'Departments' }).click();
  await expect(page.getByRole('heading', { name: 'Department Management' })).toBeVisible();

  await page.getByRole('button', { name: 'Categories' }).click();
  await expect(page.getByRole('heading', { name: 'Category Management' })).toBeVisible();
});
