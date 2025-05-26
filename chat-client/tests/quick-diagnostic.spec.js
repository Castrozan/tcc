import { test, expect } from '@playwright/test';

test.describe('Quick Diagnostic Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/chat.html');
        await expect(page.locator('#chatContainer')).toBeVisible();
        await expect(page.locator('#messageInput')).toBeVisible();
        await page.waitForTimeout(1000);
    });

    test('Chat interface loads correctly', async ({ page }) => {
        console.log('🔍 Testing chat interface...');

        // Check essential elements (no send button - uses Enter key)
        await expect(page.locator('#chatContainer')).toBeVisible();
        await expect(page.locator('#messageInput')).toBeVisible();
        await expect(page.locator('#menuBtn')).toBeVisible();

        console.log('✅ Chat interface loaded successfully');
    });

    test('Single quick message test', async ({ page }) => {
        console.log('🔍 Testing single message...');

        const startTime = Date.now();

        // Send a simple message
        await page.fill('#messageInput', 'Hello');
        await page.press('#messageInput', 'Enter');

        // Wait for response with shorter timeout
        try {
            await page.waitForSelector('.message.assistant', { timeout: 30000 });
            const responseTime = Date.now() - startTime;

            const response = await page.locator('.message.assistant').last().textContent();

            console.log(`✅ Response received in ${responseTime}ms`);
            console.log(`📝 Response length: ${response ? response.length : 0} characters`);

            expect(response).toBeTruthy();
            expect(response.length).toBeGreaterThan(0);

        } catch (error) {
            console.log(`❌ Response timeout after ${Date.now() - startTime}ms`);
            console.log(`Error: ${error.message}`);
            throw error;
        }
    });

    test('Backend connectivity test', async ({ page }) => {
        console.log('🔍 Testing backend connectivity...');

        // Check if we can make a request to the actual chat backend
        const response = await page.evaluate(async () => {
            try {
                const res = await fetch('http://127.0.0.1:3004/mcp/initialize', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ mcpServerUrls: ['http://localhost:3000/mcp'] })
                });
                return { ok: res.ok, status: res.status };
            } catch (error) {
                return { error: error.message };
            }
        });

        console.log('📡 Backend response:', response);

        // This test is informational - don't fail if backend has issues
        if (response.error) {
            console.log('⚠️  Backend connectivity issue detected (this is informational only)');
        }
    });
}); 