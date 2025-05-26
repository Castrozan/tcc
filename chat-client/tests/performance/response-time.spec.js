import { test, expect } from '@playwright/test';
import MetricsCollector from '../utils/metrics-collector.js';
import TestDataManager from '../utils/test-data-manager.js';

const metricsCollector = new MetricsCollector();
const testDataManager = new TestDataManager();

// Test configuration - can be set via environment variables
const INTEGRATION_APPROACH = process.env.INTEGRATION_APPROACH || 'mcp';
const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:3004';

test.describe(`Performance Tests - ${INTEGRATION_APPROACH.toUpperCase()} Approach`, () => {

    test.beforeAll(async () => {
        console.log(`Setting up performance tests for ${INTEGRATION_APPROACH} approach...`);

        // Wait for services to be ready
        try {
            await testDataManager.waitForServices();
            console.log('Services are ready');
        } catch (error) {
            console.warn('Some services may not be available:', error.message);
        }

        // Setup test data
        try {
            const dataResult = await testDataManager.setupTestData();
            console.log(`Test data created: ${dataResult.equipmentCount} equipment, ${dataResult.professionalCount} professionals`);
        } catch (error) {
            console.warn('Failed to setup test data:', error.message);
        }
    });

    test.afterAll(async () => {
        console.log('Cleaning up test data...');
        await testDataManager.cleanupTestData();

        // Export metrics for this approach
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        metricsCollector.exportMetrics(`performance-${INTEGRATION_APPROACH}-${timestamp}.json`);
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/chat.html');

        // Wait for the interface to be ready
        await expect(page.locator('#chatContainer')).toBeVisible();
        await expect(page.locator('#messageInput')).toBeVisible();
    });

    test('Simple query response time', async ({ page }) => {
        metricsCollector.startTest('simple-query-response-time', INTEGRATION_APPROACH, 'simple');

        try {
            // Test simple queries with response time measurement
            const simpleQueries = [
                "List all equipment",
                "Show me the professionals",
                "How many items do we have?",
                "What equipment is available?"
            ];

            for (const query of simpleQueries) {
                const metrics = await metricsCollector.measureResponseTime(page, query);

                console.log(`Query: "${query}" - Response Time: ${metrics.totalResponseTime}ms`);

                // Verify we got a response
                const lastMessage = page.locator('.message.assistant').last();
                await expect(lastMessage).toBeVisible();
                const responseText = await lastMessage.textContent();
                expect(responseText.length).toBeGreaterThan(10); // Should have meaningful content

                // Performance expectations (adjust based on approach)
                expect(metrics.totalResponseTime).toBeLessThan(30000); // Max 30 seconds
                expect(metrics.sendTime).toBeLessThan(100); // UI response should be fast
            }

            metricsCollector.endTest('success');
        } catch (error) {
            metricsCollector.endTest('failed');
            throw error;
        }
    });

    test('Complex query response time', async ({ page }) => {
        metricsCollector.startTest('complex-query-response-time', INTEGRATION_APPROACH, 'complex');

        try {
            const complexQueries = [
                "Show me all equipment assigned to software engineers",
                "Which professionals have hierarchy higher than 3?",
                "Create a summary report of all equipment by type",
                "Find professionals who might need the available equipment",
                "What is the relationship between professionals and their potential equipment needs?"
            ];

            for (const query of complexQueries) {
                const metrics = await metricsCollector.measureResponseTime(page, query);

                console.log(`Complex Query: "${query}" - Response Time: ${metrics.totalResponseTime}ms`);

                // Verify we got a response
                const lastMessage = page.locator('.message.assistant').last();
                await expect(lastMessage).toBeVisible();
                const responseText = await lastMessage.textContent();
                expect(responseText.length).toBeGreaterThan(20); // Should have substantial content

                // Complex queries may take longer
                expect(metrics.totalResponseTime).toBeLessThan(45000); // Max 45 seconds for complex queries
            }

            metricsCollector.endTest('success');
        } catch (error) {
            metricsCollector.endTest('failed');
            throw error;
        }
    });

    test('Network latency measurement', async ({ page }) => {
        metricsCollector.startTest('network-latency', INTEGRATION_APPROACH, 'performance');

        try {
            const networkMetrics = [];

            // Setup network monitoring
            page.on('response', response => {
                if (response.url().includes('/chat') || response.url().includes('/mcp')) {
                    const timing = response.timing();
                    networkMetrics.push({
                        url: response.url(),
                        status: response.status(),
                        responseTime: timing.responseEnd - timing.requestStart,
                        dnsTime: timing.domainLookupEnd - timing.domainLookupStart,
                        connectTime: timing.connectEnd - timing.connectStart,
                        requestTime: timing.requestStart,
                        responseStart: timing.responseStart,
                        responseEnd: timing.responseEnd
                    });
                }
            });

            // Send multiple queries to measure consistent network performance
            const queries = [
                "Show equipment",
                "List professionals",
                "Count items"
            ];

            for (const query of queries) {
                await page.fill('#messageInput', query);
                await page.press('#messageInput', 'Enter');

                // Wait for response
                await page.waitForSelector('.message.assistant', { timeout: 30000 });
                await page.waitForSelector('.message.assistant.loading', { state: 'detached', timeout: 30000 });

                // Small delay between requests
                await page.waitForTimeout(1000);
            }

            // Analyze network metrics
            if (networkMetrics.length > 0) {
                const avgResponseTime = networkMetrics.reduce((sum, m) => sum + m.responseTime, 0) / networkMetrics.length;
                const avgDnsTime = networkMetrics.reduce((sum, m) => sum + (m.dnsTime || 0), 0) / networkMetrics.length;
                const avgConnectTime = networkMetrics.reduce((sum, m) => sum + (m.connectTime || 0), 0) / networkMetrics.length;

                metricsCollector.recordPerformanceMetric({
                    metricType: 'network-latency',
                    avgNetworkResponseTime: Math.round(avgResponseTime),
                    avgDnsTime: Math.round(avgDnsTime),
                    avgConnectTime: Math.round(avgConnectTime),
                    totalNetworkCalls: networkMetrics.length,
                    networkMetricsDetails: networkMetrics
                });

                console.log(`Network Metrics - Avg Response: ${Math.round(avgResponseTime)}ms, DNS: ${Math.round(avgDnsTime)}ms, Connect: ${Math.round(avgConnectTime)}ms`);

                // Network performance expectations
                expect(avgResponseTime).toBeLessThan(5000); // Network calls should be under 5 seconds
            }

            metricsCollector.endTest('success');
        } catch (error) {
            metricsCollector.endTest('failed');
            throw error;
        }
    });

    test('Concurrent user simulation', async ({ browser }) => {
        metricsCollector.startTest('concurrent-users', INTEGRATION_APPROACH, 'load');

        try {
            const userCount = 3; // Start with 3 concurrent users for testing
            const contexts = [];
            const pages = [];
            const results = [];

            // Create multiple browser contexts to simulate different users
            for (let i = 0; i < userCount; i++) {
                const context = await browser.newContext();
                const page = await context.newPage();
                await page.goto('/chat.html');
                await expect(page.locator('#messageInput')).toBeVisible();

                contexts.push(context);
                pages.push(page);
            }

            // Simulate concurrent queries
            const queries = [
                "Show me all equipment",
                "List all professionals",
                "Count total items"
            ];

            const startTime = Date.now();

            // Send queries from all users simultaneously
            const promises = pages.map(async (page, index) => {
                const query = queries[index % queries.length];
                const userStartTime = Date.now();

                await page.fill('#messageInput', query);
                await page.press('#messageInput', 'Enter');

                // Wait for response
                await page.waitForSelector('.message.assistant', { timeout: 30000 });
                await page.waitForSelector('.message.assistant.loading', { state: 'detached', timeout: 30000 });

                const userEndTime = Date.now();

                return {
                    userId: index + 1,
                    query,
                    responseTime: userEndTime - userStartTime,
                    startTime: userStartTime,
                    endTime: userEndTime
                };
            });

            const userResults = await Promise.all(promises);
            const totalTime = Date.now() - startTime;

            // Analyze concurrent performance
            const avgResponseTime = userResults.reduce((sum, r) => sum + r.responseTime, 0) / userResults.length;
            const maxResponseTime = Math.max(...userResults.map(r => r.responseTime));
            const minResponseTime = Math.min(...userResults.map(r => r.responseTime));

            metricsCollector.recordPerformanceMetric({
                metricType: 'concurrent-load',
                concurrentUsers: userCount,
                totalExecutionTime: totalTime,
                avgResponseTime: Math.round(avgResponseTime),
                minResponseTime,
                maxResponseTime,
                userResults
            });

            console.log(`Concurrent Test - ${userCount} users, Avg: ${Math.round(avgResponseTime)}ms, Max: ${maxResponseTime}ms, Min: ${minResponseTime}ms`);

            // Performance expectations for concurrent users
            expect(avgResponseTime).toBeLessThan(45000); // Should handle concurrent load
            expect(maxResponseTime).toBeLessThan(60000); // No user should wait more than 1 minute

            // Cleanup
            for (const context of contexts) {
                await context.close();
            }

            metricsCollector.endTest('success');
        } catch (error) {
            metricsCollector.endTest('failed');
            throw error;
        }
    });

    test('Response time consistency', async ({ page }) => {
        metricsCollector.startTest('response-consistency', INTEGRATION_APPROACH, 'reliability');

        try {
            const sameQuery = "List all equipment";
            const iterations = 5;
            const responseTimes = [];

            // Send the same query multiple times to test consistency
            for (let i = 0; i < iterations; i++) {
                const metrics = await metricsCollector.measureResponseTime(page, sameQuery);
                responseTimes.push(metrics.totalResponseTime);

                // Verify response content is consistent
                const lastMessage = page.locator('.message.assistant').last();
                const responseText = await lastMessage.textContent();
                expect(responseText.length).toBeGreaterThan(10);

                console.log(`Iteration ${i + 1}: ${metrics.totalResponseTime}ms`);

                // Small delay between iterations
                await page.waitForTimeout(2000);
            }

            // Calculate consistency metrics
            const avgTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
            const variance = responseTimes.reduce((sum, time) => sum + Math.pow(time - avgTime, 2), 0) / responseTimes.length;
            const standardDeviation = Math.sqrt(variance);
            const coefficientOfVariation = (standardDeviation / avgTime) * 100;

            metricsCollector.recordPerformanceMetric({
                metricType: 'response-consistency',
                iterations,
                avgResponseTime: Math.round(avgTime),
                standardDeviation: Math.round(standardDeviation),
                coefficientOfVariation: Math.round(coefficientOfVariation * 100) / 100,
                responseTimes,
                minTime: Math.min(...responseTimes),
                maxTime: Math.max(...responseTimes)
            });

            console.log(`Consistency - Avg: ${Math.round(avgTime)}ms, StdDev: ${Math.round(standardDeviation)}ms, CV: ${Math.round(coefficientOfVariation * 100) / 100}%`);

            // Consistency expectations
            expect(coefficientOfVariation).toBeLessThan(50); // Should be reasonably consistent (CV < 50%)
            expect(avgTime).toBeLessThan(30000); // Average should be reasonable

            metricsCollector.endTest('success');
        } catch (error) {
            metricsCollector.endTest('failed');
            throw error;
        }
    });
}); 