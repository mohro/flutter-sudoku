import { test, expect } from '@playwright/test';

test.describe('Sudoku Gameplay', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should display the game title', async ({ page }) => {
        await expect(page.locator('h1')).toContainText('Sudoku');
    });

    test('should toggle notes mode in status bar', async ({ page }) => {
        const notesButton = page.getByRole('button', { name: 'Notes' });
        await expect(notesButton).toBeVisible();

        // Initial state check
        await expect(notesButton).not.toHaveClass(/text-accent/);

        // Toggle on
        await notesButton.click();
        await expect(notesButton).toHaveClass(/text-accent/);

        // Toggle off
        await notesButton.click();
        await expect(notesButton).not.toHaveClass(/text-accent/);
    });

    test('should change themes', async ({ page }) => {
        const themeLabel = page.locator('span:has-text("Theme") + span');
        await expect(themeLabel).toContainText('midnight'); // Default

        // Click forest theme swatch (index 1)
        const forestSwatch = page.locator('button[title="Forest"]');
        await forestSwatch.click();

        await expect(themeLabel).toContainText('forest');
    });

    test('should allow selecting cells on the board', async ({ page }) => {
        const firstCell = page.locator('.grid > div').first();
        await firstCell.click();

        // Check if cell has the selected ring/styling
        await expect(firstCell).toHaveClass(/ring-2/);
    });
});
