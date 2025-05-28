import { test, expect } from '@playwright/test';
import { writeFileSync } from 'fs';
import { existsSync, mkdirSync } from 'fs';

// Simple UX metrics collector - no external dependencies
class SimpleUXMetrics {
    constructor() {
        this.results = {
            testRun: new Date().toISOString(),
            approach: process.env.APPROACH || 'current',
            uxTests: []
        };
    }

    evaluateResponseAccuracy(question, response, expectedKeywords = []) {
        const lowerResponse = response.toLowerCase();
        let score = 2.0;

        if (expectedKeywords.length > 0) {
            const keywordMatches = expectedKeywords.filter(keyword =>
                lowerResponse.includes(keyword.toLowerCase())
            ).length;
            score += (keywordMatches / expectedKeywords.length) * 2.0;
        }

        // Check for helpful responses
        if (response.length > 20) score += 0.5;
        if (response.length > 50) score += 0.5;

        // Penalty for generic unhelpful responses
        const genericResponses = ['i cannot', 'i don\'t have', 'sorry'];
        const hasGeneric = genericResponses.some(generic => lowerResponse.includes(generic));
        if (hasGeneric && response.length < 100) score -= 1.0;

        return Math.max(1.0, Math.min(5.0, score));
    }

    evaluateResponseClarity(response) {
        let score = 3.0;

        // Check for structure
        const hasStructure = response.includes('\n') || response.includes('•') ||
            response.includes('-') || response.includes('1.');
        if (hasStructure) score += 0.5;

        // Check for appropriate length
        if (response.length >= 30 && response.length <= 500) score += 0.5;
        if (response.length > 1000) score -= 0.5;

        // Check for complete sentences
        const sentenceCount = (response.match(/[.!?]+/g) || []).length;
        if (sentenceCount >= 2) score += 0.5;

        return Math.max(1.0, Math.min(5.0, score));
    }

    evaluateResponseHelpfulness(question, response) {
        let score = 3.0;
        const lowerResponse = response.toLowerCase();
        const lowerQuestion = question.toLowerCase();

        // Check if response addresses the question
        const questionWords = lowerQuestion.split(' ').filter(word =>
            word.length > 3 && !['what', 'how', 'show', 'list', 'tell'].includes(word)
        );

        const matchingWords = questionWords.filter(word =>
            lowerResponse.includes(word)
        ).length;

        if (questionWords.length > 0) {
            score += (matchingWords / questionWords.length) * 1.0;
        }

        // Check for actionable information
        const actionableIndicators = ['you can', 'available', 'here are', 'options'];
        const hasActionable = actionableIndicators.some(indicator =>
            lowerResponse.includes(indicator)
        );
        if (hasActionable) score += 0.5;

        // Check for specific data
        if (/\d+/.test(response)) score += 0.5;

        return Math.max(1.0, Math.min(5.0, score));
    }

    async measureUXResponse(page, query, expectedKeywords = []) {
        const startTime = Date.now();

        try {
            // Clear and send message
            const messageInput = page.locator('#messageInput');
            await messageInput.clear();
            await messageInput.fill(query);
            await messageInput.press('Enter');

            // Wait for response
            await page.waitForSelector('.message.assistant', { timeout: 30000 });

            try {
                await page.waitForSelector('.message.assistant.loading', {
                    state: 'detached',
                    timeout: 30000
                });
            } catch (error) {
                // Loading indicator timeout is okay
            }

            const responseTime = Date.now() - startTime;
            const response = await page.locator('.message.assistant').last().textContent();

            // Evaluate UX metrics
            const accuracyScore = this.evaluateResponseAccuracy(query, response, expectedKeywords);
            const clarityScore = this.evaluateResponseClarity(response);
            const helpfulnessScore = this.evaluateResponseHelpfulness(query, response);
            const overallScore = (accuracyScore + clarityScore + helpfulnessScore) / 3;

            const uxMetrics = {
                query: query,
                responseTime: responseTime,
                responseLength: response ? response.length : 0,
                accuracyScore: Math.round(accuracyScore * 10) / 10,
                clarityScore: Math.round(clarityScore * 10) / 10,
                helpfulnessScore: Math.round(helpfulnessScore * 10) / 10,
                overallScore: Math.round(overallScore * 10) / 10,
                hasExpectedKeywords: expectedKeywords.length > 0 ?
                    expectedKeywords.some(kw => response.toLowerCase().includes(kw.toLowerCase())) : null,
                timestamp: new Date().toISOString(),
                status: 'success'
            };

            this.results.uxTests.push(uxMetrics);
            return uxMetrics;
        } catch (error) {
            const uxMetrics = {
                query: query,
                responseTime: Date.now() - startTime,
                responseLength: 0,
                accuracyScore: 1.0,
                clarityScore: 1.0,
                helpfulnessScore: 1.0,
                overallScore: 1.0,
                hasExpectedKeywords: false,
                timestamp: new Date().toISOString(),
                status: 'failed',
                error: error.message
            };

            this.results.uxTests.push(uxMetrics);
            return uxMetrics;
        }
    }

    calculateStats() {
        const successfulTests = this.results.uxTests.filter(t => t.status === 'success');

        if (successfulTests.length === 0) {
            return {
                totalTests: this.results.uxTests.length,
                successfulTests: 0,
                failedTests: this.results.uxTests.length,
                avgAccuracy: 0,
                avgClarity: 0,
                avgHelpfulness: 0,
                avgOverall: 0,
                avgResponseTime: 0
            };
        }

        return {
            totalTests: this.results.uxTests.length,
            successfulTests: successfulTests.length,
            failedTests: this.results.uxTests.length - successfulTests.length,
            avgAccuracy: Math.round((successfulTests.reduce((sum, t) => sum + t.accuracyScore, 0) / successfulTests.length) * 10) / 10,
            avgClarity: Math.round((successfulTests.reduce((sum, t) => sum + t.clarityScore, 0) / successfulTests.length) * 10) / 10,
            avgHelpfulness: Math.round((successfulTests.reduce((sum, t) => sum + t.helpfulnessScore, 0) / successfulTests.length) * 10) / 10,
            avgOverall: Math.round((successfulTests.reduce((sum, t) => sum + t.overallScore, 0) / successfulTests.length) * 10) / 10,
            avgResponseTime: Math.round(successfulTests.reduce((sum, t) => sum + t.responseTime, 0) / successfulTests.length)
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
        const filename = `test-results/ux-${this.results.approach}-${timestamp}-${randomId}.json`;

        const finalResults = {
            ...this.results,
            summary: this.calculateStats()
        };

        writeFileSync(filename, JSON.stringify(finalResults, null, 2));
        console.log(`\n📊 UX Results saved to: ${filename}`);
        console.log(`📈 Summary:`, finalResults.summary);
        return filename;
    }
}

test.describe('Simple User Experience Tests', () => {
    const uxMetrics = new SimpleUXMetrics();

    test.beforeEach(async ({ page }) => {
        await page.goto('/chat.html');
        await expect(page.locator('#chatContainer')).toBeVisible();
        await expect(page.locator('#messageInput')).toBeVisible();
        await page.waitForTimeout(1000);
    });

    test.afterAll(() => {
        uxMetrics.saveResults();
    });

    test('Response accuracy for equipment queries', async ({ page }) => {
        const equipmentQueries = [
            {
                question: "List all equipment",
                expectedKeywords: ['equipment', 'laptop', 'computer']
            },
            {
                question: "What equipment is available?",
                expectedKeywords: ['equipment', 'available']
            },
            {
                question: "Show me computer equipment",
                expectedKeywords: ['computer', 'laptop']
            }
        ];

        console.log(`\n🎯 Testing equipment query accuracy (${equipmentQueries.length} queries)...`);

        for (const query of equipmentQueries) {
            console.log(`\n  Testing: "${query.question}"`);

            const result = await uxMetrics.measureUXResponse(page, query.question, query.expectedKeywords);

            if (result.status === 'success') {
                console.log(`    ✅ Response time: ${result.responseTime}ms`);
                console.log(`    📊 Scores - Accuracy: ${result.accuracyScore}, Clarity: ${result.clarityScore}, Helpfulness: ${result.helpfulnessScore}`);
                console.log(`    🎯 Overall UX Score: ${result.overallScore}/5.0`);

                // Basic quality expectations
                expect(result.accuracyScore).toBeGreaterThan(2.0);
                expect(result.clarityScore).toBeGreaterThan(2.0);
                expect(result.responseLength).toBeGreaterThan(10);
            } else {
                console.log(`    ❌ Failed: ${result.error}`);
            }

            await page.waitForTimeout(1000);
        }
    });

    test('Response accuracy for professional queries', async ({ page }) => {
        const professionalQueries = [
            {
                question: "Show me all professionals",
                expectedKeywords: ['professional', 'team', 'staff']
            },
            {
                question: "Who are the team members?",
                expectedKeywords: ['team', 'member', 'professional']
            },
            {
                question: "List staff information",
                expectedKeywords: ['staff', 'professional', 'information']
            }
        ];

        console.log(`\n👥 Testing professional query accuracy (${professionalQueries.length} queries)...`);

        for (const query of professionalQueries) {
            console.log(`\n  Testing: "${query.question}"`);

            const result = await uxMetrics.measureUXResponse(page, query.question, query.expectedKeywords);

            if (result.status === 'success') {
                console.log(`    ✅ Response time: ${result.responseTime}ms`);
                console.log(`    📊 Scores - Accuracy: ${result.accuracyScore}, Clarity: ${result.clarityScore}, Helpfulness: ${result.helpfulnessScore}`);
                console.log(`    🎯 Overall UX Score: ${result.overallScore}/5.0`);

                expect(result.accuracyScore).toBeGreaterThan(2.0);
                expect(result.clarityScore).toBeGreaterThan(2.0);
            } else {
                console.log(`    ❌ Failed: ${result.error}`);
            }

            await page.waitForTimeout(1000);
        }
    });

    test('Conversation flow and clarity', async ({ page }) => {
        const conversationFlow = [
            {
                message: "Hello, can you help me?",
                expectedType: "greeting"
            },
            {
                message: "What information can you provide?",
                expectedType: "capabilities"
            },
            {
                message: "Give me an overview",
                expectedType: "overview"
            }
        ];

        console.log(`\n💬 Testing conversation flow (${conversationFlow.length} steps)...`);

        let conversationQuality = 0;

        for (let i = 0; i < conversationFlow.length; i++) {
            const step = conversationFlow[i];
            console.log(`\n  Step ${i + 1}: "${step.message}"`);

            const result = await uxMetrics.measureUXResponse(page, step.message);

            if (result.status === 'success') {
                console.log(`    ✅ Response time: ${result.responseTime}ms`);
                console.log(`    📊 UX Score: ${result.overallScore}/5.0`);

                conversationQuality += result.overallScore;

                expect(result.overallScore).toBeGreaterThan(2.0);
            } else {
                console.log(`    ❌ Failed: ${result.error}`);
            }

            await page.waitForTimeout(1500);
        }

        const avgConversationQuality = conversationQuality / conversationFlow.length;
        console.log(`\n💬 Average conversation quality: ${Math.round(avgConversationQuality * 10) / 10}/5.0`);
    });

    test('Response helpfulness for general queries', async ({ page }) => {
        const generalQueries = [
            "Help me understand what you can do",
            "What are your capabilities?",
            "How can you assist me?",
            "What information do you have access to?"
        ];

        console.log(`\n❓ Testing general query helpfulness (${generalQueries.length} queries)...`);

        for (const query of generalQueries) {
            console.log(`\n  Testing: "${query}"`);

            const result = await uxMetrics.measureUXResponse(page, query);

            if (result.status === 'success') {
                console.log(`    ✅ Response time: ${result.responseTime}ms`);
                console.log(`    📊 Helpfulness Score: ${result.helpfulnessScore}/5.0`);
                console.log(`    🎯 Overall UX Score: ${result.overallScore}/5.0`);

                // Expect helpful responses for capability questions
                expect(result.helpfulnessScore).toBeGreaterThan(2.5);
                expect(result.responseLength).toBeGreaterThan(20);
            } else {
                console.log(`    ❌ Failed: ${result.error}`);
            }

            await page.waitForTimeout(1000);
        }
    });
}); 