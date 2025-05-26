import { test, expect } from '@playwright/test';

test.describe('Chat Interface', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the chat interface
        await page.goto('/chat.html');
    });

    test('should load the chat interface', async ({ page }) => {
        // Check if the page title is correct
        await expect(page).toHaveTitle('Chat Interface');

        // Check if the main elements are present
        await expect(page.locator('#chatContainer')).toBeVisible();
        await expect(page.locator('#messageInput')).toBeVisible();

        // Check if the input placeholder is correct
        await expect(page.locator('#messageInput')).toHaveAttribute('placeholder', 'Ask anything');
    });

    test('should send a message and receive a response', async ({ page }) => {
        // Type a message
        const testMessage = 'Hello, this is a test message';
        await page.fill('#messageInput', testMessage);

        // Send the message by pressing Enter
        await page.press('#messageInput', 'Enter');

        // Check if the user message appears in the chat
        await expect(page.locator('.message.user').last()).toContainText(testMessage);

        // Wait for the assistant response (with loading state)
        await expect(page.locator('.message.assistant').last()).toBeVisible();

        // Wait for loading to complete (loading class should be removed)
        await expect(page.locator('.message.assistant.loading')).toHaveCount(0);

        // Check if the assistant message is not empty and not just "..."
        const assistantMessage = page.locator('.message.assistant').last();
        await expect(assistantMessage).not.toContainText('...');

        // Verify the input field is cleared
        await expect(page.locator('#messageInput')).toHaveValue('');
    });

    test('should handle empty messages gracefully', async ({ page }) => {
        // Try to send an empty message
        await page.press('#messageInput', 'Enter');

        // Should not create any new messages
        await expect(page.locator('.message')).toHaveCount(0);
    });

    test('should show loading state during response', async ({ page }) => {
        // Type a message
        await page.fill('#messageInput', 'Test loading state');

        // Send the message
        await page.press('#messageInput', 'Enter');

        // Check if loading state appears briefly
        await expect(page.locator('.message.assistant.loading')).toBeVisible();

        // Wait for loading to complete
        await expect(page.locator('.message.assistant.loading')).toHaveCount(0);
    });

    test('should preserve message history', async ({ page }) => {
        // Send first message
        await page.fill('#messageInput', 'First message');
        await page.press('#messageInput', 'Enter');

        // Wait for response
        await expect(page.locator('.message.assistant').last()).toBeVisible();
        await expect(page.locator('.message.assistant.loading')).toHaveCount(0);

        // Send second message
        await page.fill('#messageInput', 'Second message');
        await page.press('#messageInput', 'Enter');

        // Wait for second response
        await expect(page.locator('.message.assistant').last()).toBeVisible();
        await expect(page.locator('.message.assistant.loading')).toHaveCount(0);

        // Check that we have 4 messages total (2 user + 2 assistant)
        await expect(page.locator('.message')).toHaveCount(4);

        // Verify the order and content
        await expect(page.locator('.message').nth(0)).toContainText('First message');
        await expect(page.locator('.message').nth(2)).toContainText('Second message');
    });
});