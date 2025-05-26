import fs from 'fs';
import path from 'path';

class MetricsCollector {
    constructor() {
        this.metrics = {
            performance: [],
            security: [],
            userExperience: [],
            reliability: []
        };
        this.currentTest = null;
        this.testStartTime = null;
    }

    startTest(testName, approach, scenario) {
        this.currentTest = {
            testName,
            approach, // 'orm', 'mcp', 'direct-db'
            scenario,
            timestamp: new Date().toISOString(),
            startTime: Date.now()
        };
        this.testStartTime = Date.now();
    }

    endTest(result = 'success') {
        if (this.currentTest) {
            this.currentTest.endTime = Date.now();
            this.currentTest.duration = this.currentTest.endTime - this.currentTest.startTime;
            this.currentTest.result = result;
        }
    }

    recordPerformanceMetric(metric) {
        const performanceData = {
            ...this.currentTest,
            ...metric,
            timestamp: new Date().toISOString()
        };
        this.metrics.performance.push(performanceData);
    }

    recordSecurityMetric(metric) {
        const securityData = {
            ...this.currentTest,
            ...metric,
            timestamp: new Date().toISOString()
        };
        this.metrics.security.push(securityData);
    }

    recordUserExperienceMetric(metric) {
        const uxData = {
            ...this.currentTest,
            ...metric,
            timestamp: new Date().toISOString()
        };
        this.metrics.userExperience.push(uxData);
    }

    recordReliabilityMetric(metric) {
        const reliabilityData = {
            ...this.currentTest,
            ...metric,
            timestamp: new Date().toISOString()
        };
        this.metrics.reliability.push(reliabilityData);
    }

    async measureResponseTime(page, userMessage) {
        const startTime = Date.now();

        // Fill and send message
        await page.fill('#messageInput', userMessage);
        const sendTime = Date.now();
        await page.press('#messageInput', 'Enter');

        // Wait for assistant response to appear
        await page.waitForSelector('.message.assistant', { timeout: 30000 });

        // Wait for loading to complete
        await page.waitForSelector('.message.assistant.loading', { state: 'detached', timeout: 30000 });

        const endTime = Date.now();

        const metrics = {
            totalResponseTime: endTime - startTime,
            sendTime: sendTime - startTime,
            processingTime: endTime - sendTime,
            userMessage: userMessage.substring(0, 100) // Truncate for logging
        };

        this.recordPerformanceMetric(metrics);
        return metrics;
    }

    async measureNetworkLatency(page) {
        const responses = [];

        page.on('response', response => {
            if (response.url().includes('/chat')) {
                responses.push({
                    url: response.url(),
                    status: response.status(),
                    responseTime: response.timing()
                });
            }
        });

        return responses;
    }

    exportMetrics(filename) {
        const outputDir = path.join(process.cwd(), 'test-results', 'metrics');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fullFilename = filename || `metrics-${timestamp}.json`;
        const filePath = path.join(outputDir, fullFilename);

        const reportData = {
            summary: this.generateSummary(),
            rawMetrics: this.metrics,
            exportTime: new Date().toISOString()
        };

        fs.writeFileSync(filePath, JSON.stringify(reportData, null, 2));
        console.log(`Metrics exported to: ${filePath}`);
        return filePath;
    }

    generateSummary() {
        return {
            performance: {
                totalTests: this.metrics.performance.length,
                averageResponseTime: this.calculateAverage(this.metrics.performance, 'totalResponseTime'),
                minResponseTime: this.calculateMin(this.metrics.performance, 'totalResponseTime'),
                maxResponseTime: this.calculateMax(this.metrics.performance, 'totalResponseTime')
            },
            security: {
                totalTests: this.metrics.security.length,
                successfulAttacks: this.metrics.security.filter(m => m.attackSuccessful).length,
                failedAttacks: this.metrics.security.filter(m => !m.attackSuccessful).length
            },
            userExperience: {
                totalTests: this.metrics.userExperience.length,
                averageAccuracy: this.calculateAverage(this.metrics.userExperience, 'accuracyScore'),
                averageClarity: this.calculateAverage(this.metrics.userExperience, 'clarityScore')
            }
        };
    }

    calculateAverage(metrics, field) {
        if (metrics.length === 0) return 0;
        const sum = metrics.reduce((acc, metric) => acc + (metric[field] || 0), 0);
        return sum / metrics.length;
    }

    calculateMin(metrics, field) {
        if (metrics.length === 0) return 0;
        return Math.min(...metrics.map(m => m[field] || Infinity));
    }

    calculateMax(metrics, field) {
        if (metrics.length === 0) return 0;
        return Math.max(...metrics.map(m => m[field] || 0));
    }

    reset() {
        this.metrics = {
            performance: [],
            security: [],
            userExperience: [],
            reliability: []
        };
        this.currentTest = null;
        this.testStartTime = null;
    }
}

export default MetricsCollector; 