import { test, expect } from '@playwright/test';
import MetricsCollector from '../utils/metrics-collector.js';
import TestDataManager from '../utils/test-data-manager.js';

const metricsCollector = new MetricsCollector();
const testDataManager = new TestDataManager();

// Test configuration
const INTEGRATION_APPROACH = process.env.INTEGRATION_APPROACH || 'mcp';

// Helper functions for UX evaluation
function evaluateResponseAccuracy(question, response, expectedKeywords = []) {
    const lowerResponse = response.toLowerCase();

    // Basic accuracy checks
    let score = 2.0; // Base score

    // Check if response contains expected keywords
    const keywordMatches = expectedKeywords.filter(keyword =>
        lowerResponse.includes(keyword.toLowerCase())
    ).length;

    if (expectedKeywords.length > 0) {
        score += (keywordMatches / expectedKeywords.length) * 2.0;
    }

    // Check for generic/unhelpful responses
    const genericResponses = [
        'i cannot',
        'i\'m not able',
        'i don\'t have access',
        'i cannot help',
        'sorry, i can\'t'
    ];

    const hasGenericResponse = genericResponses.some(generic =>
        lowerResponse.includes(generic)
    );

    if (hasGenericResponse && response.length < 100) {
        score -= 1.0; // Penalty for unhelpful short responses
    }

    // Check response completeness
    if (response.length < 20) {
        score -= 1.0; // Too short
    } else if (response.length > 50) {
        score += 0.5; // Adequate length
    }

    // Ensure score is within bounds
    return Math.max(1.0, Math.min(5.0, score));
}

function evaluateResponseClarity(response) {
    let score = 3.0; // Base score

    // Check for clear structure
    const hasStructure = response.includes('\n') ||
        response.includes('•') ||
        response.includes('-') ||
        response.includes('1.') ||
        response.includes('*');

    if (hasStructure) score += 0.5;

    // Check for appropriate length (not too short, not too verbose)
    if (response.length >= 50 && response.length <= 500) {
        score += 0.5;
    } else if (response.length > 1000) {
        score -= 0.5; // Too verbose
    }

    // Check for complete sentences
    const sentenceCount = (response.match(/[.!?]+/g) || []).length;
    if (sentenceCount >= 2) score += 0.5;

    // Check for jargon or overly technical language
    const technicalTerms = ['api', 'database', 'server', 'endpoint', 'json'];
    const technicalCount = technicalTerms.filter(term =>
        response.toLowerCase().includes(term)
    ).length;

    if (technicalCount > 3) {
        score -= 0.5; // Too technical for general users
    }

    return Math.max(1.0, Math.min(5.0, score));
}

function evaluateResponseHelpfulness(question, response) {
    let score = 3.0; // Base score

    const lowerResponse = response.toLowerCase();
    const lowerQuestion = question.toLowerCase();

    // Check if response directly addresses the question
    const questionWords = lowerQuestion.split(' ').filter(word =>
        word.length > 3 && !['what', 'how', 'where', 'when', 'why', 'show', 'list', 'tell'].includes(word)
    );

    const matchingWords = questionWords.filter(word =>
        lowerResponse.includes(word)
    ).length;

    if (questionWords.length > 0) {
        score += (matchingWords / questionWords.length) * 1.0;
    }

    // Check for actionable information
    const actionableIndicators = [
        'you can',
        'to do this',
        'follow these',
        'here are',
        'available',
        'options',
        'steps'
    ];

    const hasActionableInfo = actionableIndicators.some(indicator =>
        lowerResponse.includes(indicator)
    );

    if (hasActionableInfo) score += 0.5;

    // Check for specific data/numbers
    const hasSpecificData = /\d+/.test(response);
    if (hasSpecificData) score += 0.5;

    // Penalty for error messages without alternatives
    if (lowerResponse.includes('error') || lowerResponse.includes('failed')) {
        if (!lowerResponse.includes('try') && !lowerResponse.includes('instead')) {
            score -= 1.0;
        }
    }

    return Math.max(1.0, Math.min(5.0, score));
}

test.describe(`User Experience Tests - ${INTEGRATION_APPROACH.toUpperCase()} Approach`, () => {

    test.beforeAll(async () => {
        console.log(`Setting up UX tests for ${INTEGRATION_APPROACH} approach...`);

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

        // Export UX metrics
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        metricsCollector.exportMetrics(`ux-${INTEGRATION_APPROACH}-${timestamp}.json`);
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/chat.html');
        await expect(page.locator('#messageInput')).toBeVisible();
    });

    test('Response accuracy for equipment queries', async ({ page }) => {
        metricsCollector.startTest('equipment-query-accuracy', INTEGRATION_APPROACH, 'ux-accuracy');

        try {
            const equipmentQueries = [
                {
                    question: "List all equipment",
                    expectedKeywords: ['equipment', 'laptop', 'monitor', 'keyboard']
                },
                {
                    question: "How many laptops do we have?",
                    expectedKeywords: ['laptop', 'computer']
                },
                {
                    question: "What types of equipment are available?",
                    expectedKeywords: ['type', 'computer', 'display', 'peripheral']
                },
                {
                    question: "Show me equipment for development work",
                    expectedKeywords: ['development', 'laptop', 'programming']
                }
            ];

            for (const query of equipmentQueries) {
                console.log(`Testing accuracy: ${query.question}`);

                await page.fill('#messageInput', query.question);
                await page.press('#messageInput', 'Enter');

                await page.waitForSelector('.message.assistant', { timeout: 30000 });
                await page.waitForSelector('.message.assistant.loading', { state: 'detached', timeout: 30000 });

                const response = await page.locator('.message.assistant').last().textContent();

                const accuracyScore = evaluateResponseAccuracy(
                    query.question,
                    response,
                    query.expectedKeywords
                );

                const clarityScore = evaluateResponseClarity(response);
                const helpfulnessScore = evaluateResponseHelpfulness(query.question, response);

                metricsCollector.recordUserExperienceMetric({
                    queryType: 'equipment',
                    question: query.question,
                    responseLength: response.length,
                    accuracyScore,
                    clarityScore,
                    helpfulnessScore,
                    overallScore: (accuracyScore + clarityScore + helpfulnessScore) / 3,
                    containsExpectedKeywords: query.expectedKeywords.some(kw =>
                        response.toLowerCase().includes(kw.toLowerCase())
                    )
                });

                console.log(`Scores - Accuracy: ${accuracyScore}, Clarity: ${clarityScore}, Helpfulness: ${helpfulnessScore}`);

                // Verify minimum quality standards
                expect(accuracyScore).toBeGreaterThan(2.0);
                expect(clarityScore).toBeGreaterThan(2.0);
                expect(response.length).toBeGreaterThan(10);

                await page.waitForTimeout(1000);
            }

            metricsCollector.endTest('success');
        } catch (error) {
            metricsCollector.endTest('failed');
            throw error;
        }
    });

    test('Response accuracy for professional queries', async ({ page }) => {
        metricsCollector.startTest('professional-query-accuracy', INTEGRATION_APPROACH, 'ux-accuracy');

        try {
            const professionalQueries = [
                {
                    question: "Show me all professionals",
                    expectedKeywords: ['professional', 'alice', 'bob', 'carol', 'engineer', 'manager', 'designer']
                },
                {
                    question: "Who are the software engineers?",
                    expectedKeywords: ['software', 'engineer', 'alice', 'developer']
                },
                {
                    question: "Which professionals have the highest hierarchy?",
                    expectedKeywords: ['hierarchy', 'manager', 'bob']
                },
                {
                    question: "Tell me about the UX designer",
                    expectedKeywords: ['ux', 'designer', 'carol', 'user']
                }
            ];

            for (const query of professionalQueries) {
                console.log(`Testing professional accuracy: ${query.question}`);

                await page.fill('#messageInput', query.question);
                await page.press('#messageInput', 'Enter');

                await page.waitForSelector('.message.assistant', { timeout: 30000 });
                await page.waitForSelector('.message.assistant.loading', { state: 'detached', timeout: 30000 });

                const response = await page.locator('.message.assistant').last().textContent();

                const accuracyScore = evaluateResponseAccuracy(
                    query.question,
                    response,
                    query.expectedKeywords
                );

                const clarityScore = evaluateResponseClarity(response);
                const helpfulnessScore = evaluateResponseHelpfulness(query.question, response);

                metricsCollector.recordUserExperienceMetric({
                    queryType: 'professional',
                    question: query.question,
                    responseLength: response.length,
                    accuracyScore,
                    clarityScore,
                    helpfulnessScore,
                    overallScore: (accuracyScore + clarityScore + helpfulnessScore) / 3,
                    containsExpectedKeywords: query.expectedKeywords.some(kw =>
                        response.toLowerCase().includes(kw.toLowerCase())
                    )
                });

                expect(accuracyScore).toBeGreaterThan(2.0);
                expect(clarityScore).toBeGreaterThan(2.0);

                await page.waitForTimeout(1000);
            }

            metricsCollector.endTest('success');
        } catch (error) {
            metricsCollector.endTest('failed');
            throw error;
        }
    });

    test('Interaction flow and conversation handling', async ({ page }) => {
        metricsCollector.startTest('interaction-flow', INTEGRATION_APPROACH, 'ux-flow');

        try {
            // Test multi-turn conversation
            const conversationFlow = [
                {
                    message: "Hello, can you help me with equipment information?",
                    expectedType: "greeting_response"
                },
                {
                    message: "What equipment do we have?",
                    expectedType: "equipment_list"
                },
                {
                    message: "Tell me more about the laptops",
                    expectedType: "equipment_details"
                },
                {
                    message: "Who might use these laptops?",
                    expectedType: "professional_correlation"
                }
            ];

            let conversationQuality = 0;
            let contextRetention = 0;

            for (let i = 0; i < conversationFlow.length; i++) {
                const step = conversationFlow[i];
                console.log(`Conversation step ${i + 1}: ${step.message}`);

                await page.fill('#messageInput', step.message);
                await page.press('#messageInput', 'Enter');

                await page.waitForSelector('.message.assistant', { timeout: 30000 });
                await page.waitForSelector('.message.assistant.loading', { state: 'detached', timeout: 30000 });

                const response = await page.locator('.message.assistant').last().textContent();

                // Evaluate this step
                const stepAccuracy = evaluateResponseAccuracy(step.message, response);
                const stepClarity = evaluateResponseClarity(response);
                const stepHelpfulness = evaluateResponseHelpfulness(step.message, response);

                conversationQuality += (stepAccuracy + stepClarity + stepHelpfulness) / 3;

                // Check context retention (for steps after the first)
                if (i > 0) {
                    const previousConcepts = ['equipment', 'laptop'];
                    const retainsContext = previousConcepts.some(concept =>
                        response.toLowerCase().includes(concept)
                    );
                    if (retainsContext) contextRetention += 1;
                }

                metricsCollector.recordUserExperienceMetric({
                    queryType: 'conversation_flow',
                    conversationStep: i + 1,
                    question: step.message,
                    responseLength: response.length,
                    accuracyScore: stepAccuracy,
                    clarityScore: stepClarity,
                    helpfulnessScore: stepHelpfulness,
                    expectedType: step.expectedType,
                    contextRetained: i === 0 ? true : previousConcepts.some(concept =>
                        response.toLowerCase().includes(concept)
                    )
                });

                await page.waitForTimeout(1500);
            }

            const avgConversationQuality = conversationQuality / conversationFlow.length;
            const contextRetentionRate = contextRetention / (conversationFlow.length - 1);

            console.log(`Conversation Quality: ${avgConversationQuality}, Context Retention: ${contextRetentionRate}`);

            // Overall conversation should maintain quality
            expect(avgConversationQuality).toBeGreaterThan(2.5);
            expect(contextRetentionRate).toBeGreaterThan(0.5);

            metricsCollector.endTest('success');
        } catch (error) {
            metricsCollector.endTest('failed');
            throw error;
        }
    });

    test('Error handling and edge cases', async ({ page }) => {
        metricsCollector.startTest('error-handling-ux', INTEGRATION_APPROACH, 'ux-errors');

        try {
            const edgeCases = [
                {
                    input: "",
                    description: "empty_input",
                    shouldGetResponse: false
                },
                {
                    input: "   ",
                    description: "whitespace_only",
                    shouldGetResponse: false
                },
                {
                    input: "asdfghjkl qwertyuiop",
                    description: "gibberish",
                    shouldGetResponse: true
                },
                {
                    input: "Show me equipment that doesn't exist",
                    description: "nonexistent_query",
                    shouldGetResponse: true
                },
                {
                    input: "What is the meaning of life?",
                    description: "off_topic",
                    shouldGetResponse: true
                }
            ];

            for (const testCase of edgeCases) {
                if (testCase.input.trim() === "") {
                    // Test empty input handling
                    await page.press('#messageInput', 'Enter');

                    // Should not create new messages for empty input
                    const messageCount = await page.locator('.message').count();
                    expect(messageCount).toBe(0);

                    metricsCollector.recordUserExperienceMetric({
                        queryType: 'edge_case',
                        edgeCaseType: testCase.description,
                        handledGracefully: true,
                        accuracyScore: 5.0, // Correct behavior for empty input
                        clarityScore: 5.0,
                        helpfulnessScore: 5.0
                    });
                } else {
                    console.log(`Testing edge case: ${testCase.description}`);

                    await page.fill('#messageInput', testCase.input);
                    await page.press('#messageInput', 'Enter');

                    if (testCase.shouldGetResponse) {
                        try {
                            await page.waitForSelector('.message.assistant', { timeout: 20000 });
                            await page.waitForSelector('.message.assistant.loading', { state: 'detached', timeout: 20000 });

                            const response = await page.locator('.message.assistant').last().textContent();

                            // Evaluate how well the system handled the edge case
                            let accuracyScore = 3.0; // Default for handling edge case
                            let clarityScore = evaluateResponseClarity(response);
                            let helpfulnessScore = 2.0; // Lower expectation for edge cases

                            // Check if response is appropriate for the edge case
                            const isAppropriate = !response.toLowerCase().includes('error') ||
                                response.toLowerCase().includes('help') ||
                                response.toLowerCase().includes('understand');

                            if (isAppropriate) accuracyScore += 1.0;

                            metricsCollector.recordUserExperienceMetric({
                                queryType: 'edge_case',
                                edgeCaseType: testCase.description,
                                question: testCase.input,
                                responseLength: response.length,
                                accuracyScore,
                                clarityScore,
                                helpfulnessScore,
                                handledGracefully: !response.toLowerCase().includes('error'),
                                responseReceived: true
                            });

                        } catch (error) {
                            // No response or timeout - record this
                            metricsCollector.recordUserExperienceMetric({
                                queryType: 'edge_case',
                                edgeCaseType: testCase.description,
                                question: testCase.input,
                                responseReceived: false,
                                handledGracefully: false,
                                accuracyScore: 1.0,
                                clarityScore: 1.0,
                                helpfulnessScore: 1.0
                            });
                        }
                    }
                }

                await page.waitForTimeout(1000);
            }

            metricsCollector.endTest('success');
        } catch (error) {
            metricsCollector.endTest('failed');
            throw error;
        }
    });
}); 