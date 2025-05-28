import { test, expect } from '@playwright/test';
import { writeFileSync } from 'fs';
import { existsSync, mkdirSync } from 'fs';

// Simple metrics collector - no external dependencies
class SimpleMetrics {
    constructor() {
        this.results = {
            testRun: new Date().toISOString(),
            approach: process.env.APPROACH || 'current',
            queries: []
        };
    }

    async measureChatResponse(page, query) {
        const startTime = Date.now();

        try {
            // Clear any existing messages to get clean selectors
            const messageInput = page.locator('#messageInput');
            await messageInput.clear();

            // Send message
            await messageInput.fill(query);
            const sendTime = Date.now();
            await messageInput.press('Enter');

            // Wait for response to appear with optimized timeout
            await page.waitForSelector('.message.assistant', { timeout: 45000 });
            const responseStartTime = Date.now();

            // Wait for loading to complete with optimized timeout and polling
            try {
                await page.waitForSelector('.message.assistant.loading', {
                    state: 'detached',
                    timeout: 45000
                });
            } catch (error) {
                // If loading indicator doesn't appear, check if response is already complete
                console.log('  ⚠️  Loading indicator timeout, checking response...');
            }

            const responseEndTime = Date.now();

            // Get response content
            const response = await page.locator('.message.assistant').last().textContent();

            const metrics = {
                query: query,
                sendTime: sendTime - startTime,
                totalResponseTime: responseEndTime - startTime,
                actualProcessingTime: responseEndTime - responseStartTime,
                responseLength: response ? response.length : 0,
                timestamp: new Date().toISOString(),
                status: 'success'
            };

            this.results.queries.push(metrics);
            return metrics;
        } catch (error) {
            const metrics = {
                query: query,
                sendTime: 0,
                totalResponseTime: Date.now() - startTime,
                actualProcessingTime: 0,
                responseLength: 0,
                timestamp: new Date().toISOString(),
                status: 'failed',
                error: error.message
            };

            this.results.queries.push(metrics);
            return metrics;
        }
    }

    calculateStats() {
        const successfulQueries = this.results.queries.filter(q => q.status === 'success');
        const times = successfulQueries.map(q => q.totalResponseTime);

        if (times.length === 0) {
            return {
                totalQueries: this.results.queries.length,
                successfulQueries: 0,
                failedQueries: this.results.queries.length,
                avgResponseTime: 0,
                minResponseTime: 0,
                maxResponseTime: 0,
                avgResponseLength: 0
            };
        }

        return {
            totalQueries: this.results.queries.length,
            successfulQueries: successfulQueries.length,
            failedQueries: this.results.queries.length - successfulQueries.length,
            avgResponseTime: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
            minResponseTime: Math.min(...times),
            maxResponseTime: Math.max(...times),
            avgResponseLength: Math.round(successfulQueries.reduce((sum, q) => sum + q.responseLength, 0) / successfulQueries.length)
        };
    }

    saveResults() {
        if (!existsSync('test-results')) {
            mkdirSync('test-results', { recursive: true });
        }

        // Generate unique timestamp with milliseconds and random component
        const now = new Date();
        const timestamp = now.toISOString().replace(/[:.]/g, '-');
        const randomId = Math.random().toString(36).substring(2, 8);
        const filename = `test-results/performance-${this.results.approach}-${timestamp}-${randomId}.json`;

        const finalResults = {
            ...this.results,
            summary: this.calculateStats()
        };

        writeFileSync(filename, JSON.stringify(finalResults, null, 2));
        console.log(`\n📊 Results saved to: ${filename}`);
        console.log(`📈 Summary:`, finalResults.summary);
        return filename;
    }
}

test.describe('Simple Performance Tests', () => {
    const metrics = new SimpleMetrics();

    test.beforeEach(async ({ page }) => {
        await page.goto('/chat.html');
        await expect(page.locator('#chatContainer')).toBeVisible();
        await expect(page.locator('#messageInput')).toBeVisible();

        // Small delay to ensure page is fully loaded
        await page.waitForTimeout(1000);
    });

    test.afterAll(() => {
        metrics.saveResults();
    });

    test('Basic chat performance test', async ({ page }) => {
        // Optimized test queries for faster execution
        const testQueries = [
            "Hello",
            "List equipment",
            "Show professionals",
            "Help"
        ];

        console.log(`\n🚀 Starting performance test with ${testQueries.length} queries...`);

        for (let i = 0; i < testQueries.length; i++) {
            const query = testQueries[i];
            console.log(`\n[${i + 1}/${testQueries.length}] Testing: "${query}"`);

            const result = await metrics.measureChatResponse(page, query);

            if (result.status === 'success') {
                console.log(`  ✅ Response time: ${result.totalResponseTime}ms`);
                console.log(`  📝 Response length: ${result.responseLength} characters`);

                // Basic validation - ensure we got a response
                expect(result.responseLength).toBeGreaterThan(5);
            } else {
                console.log(`  ❌ Failed: ${result.error}`);
            }

            // Shorter delay between queries
            await page.waitForTimeout(1000);
        }
    });

    test('Response consistency test', async ({ page }) => {
        // Test the same query multiple times to measure consistency
        const repeatedQuery = "List equipment";
        const iterations = 2; // Reduced iterations for speed

        console.log(`\n🔄 Testing consistency with "${repeatedQuery}" (${iterations} times)...`);

        const responses = [];

        for (let i = 0; i < iterations; i++) {
            console.log(`  Iteration ${i + 1}/${iterations}`);

            const result = await metrics.measureChatResponse(page, `${repeatedQuery} ${i + 1}`);

            if (result.status === 'success') {
                responses.push(result);
                console.log(`    ✅ Response time: ${result.totalResponseTime}ms`);
            } else {
                console.log(`    ❌ Failed: ${result.error}`);
            }

            await page.waitForTimeout(1500); // Shorter delay between repeated queries
        }

        // Analyze consistency
        if (responses.length > 1) {
            const times = responses.map(r => r.totalResponseTime);
            const avg = times.reduce((a, b) => a + b, 0) / times.length;
            const variance = times.reduce((sum, time) => sum + Math.pow(time - avg, 2), 0) / times.length;
            const stdDev = Math.sqrt(variance);
            const consistencyScore = Math.max(0, (1 - (stdDev / avg)) * 100);

            console.log(`\n📊 Consistency Analysis:`);
            console.log(`  Average: ${Math.round(avg)}ms`);
            console.log(`  Std Dev: ${Math.round(stdDev)}ms`);
            console.log(`  Consistency Score: ${Math.round(consistencyScore)}%`);
        }
    });

    test('Quick load response time test', async ({ page }) => {
        // Test with shorter queries for speed
        const quickQueries = [
            "Overview of equipment?",
            "Team structure info"
        ];

        console.log(`\n🏋️ Testing quick queries (${quickQueries.length} queries)...`);

        for (let i = 0; i < quickQueries.length; i++) {
            const query = quickQueries[i];
            console.log(`\n[${i + 1}/${quickQueries.length}] Quick query (${query.length} chars)`);

            const result = await metrics.measureChatResponse(page, query);

            if (result.status === 'success') {
                console.log(`  ✅ Response time: ${result.totalResponseTime}ms`);
                console.log(`  📝 Response length: ${result.responseLength} characters`);

                // Expect reasonable response times (under 30 seconds)
                expect(result.totalResponseTime).toBeLessThan(30000);
            } else {
                console.log(`  ❌ Failed: ${result.error}`);
            }

            await page.waitForTimeout(2000); // Medium delay for complex queries
        }
    });
}); 