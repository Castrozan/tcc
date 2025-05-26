#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
    approaches: ['mcp', 'orm', 'direct-db'],
    testSuites: [
        'performance/response-time.spec.js',
        'security/prompt-injection.spec.js',
        'security/jailbreak-resistance.spec.js',
        'user-experience/response-quality.spec.js',
        'reliability/error-recovery.spec.js',
        'comparative/approach-comparison.spec.js'
    ],
    services: {
        equipment: 'http://localhost:3001',
        professional: 'http://localhost:3002',
        backend: 'http://localhost:3004'
    },
    timeout: 300000, // 5 minutes per test suite
    outputDir: './test-results',
    reportDir: './test-results/reports'
};

class TestRunner {
    constructor() {
        this.results = {
            approaches: {},
            summary: {},
            startTime: new Date(),
            endTime: null
        };

        this.ensureDirectories();
    }

    ensureDirectories() {
        [CONFIG.outputDir, CONFIG.reportDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    async run() {
        console.log('🚀 Starting E2E Integration Approach Testing Suite');
        console.log('==================================================');
        console.log(`Testing approaches: ${CONFIG.approaches.join(', ')}`);
        console.log(`Test suites: ${CONFIG.testSuites.length} suites`);
        console.log(`Output directory: ${CONFIG.outputDir}`);
        console.log('');

        // Check services availability
        await this.checkServices();

        // Run tests for each approach
        for (const approach of CONFIG.approaches) {
            console.log(`\n📋 Testing ${approach.toUpperCase()} approach...`);
            console.log('─'.repeat(50));

            await this.runApproachTests(approach);
        }

        // Generate final comparative report
        await this.generateFinalReport();

        this.results.endTime = new Date();
        this.printSummary();
    }

    async checkServices() {
        console.log('🔍 Checking service availability...');

        const serviceChecks = Object.entries(CONFIG.services).map(async ([name, url]) => {
            try {
                const response = await fetch(`${url}/health`).catch(() => null);
                const available = response && response.ok;

                console.log(`  ${name}: ${available ? '✅ Available' : '❌ Not available'} (${url})`);

                return { name, url, available };
            } catch (error) {
                console.log(`  ${name}: ❌ Error - ${error.message} (${url})`);
                return { name, url, available: false };
            }
        });

        const results = await Promise.all(serviceChecks);
        const unavailableServices = results.filter(r => !r.available);

        if (unavailableServices.length > 0) {
            console.log('\n⚠️  Warning: Some services are not available.');
            console.log('Tests may fail or produce incomplete results.');
            console.log('Make sure all backend services are running before proceeding.\n');
        } else {
            console.log('✅ All services are available\n');
        }
    }

    async runApproachTests(approach) {
        this.results.approaches[approach] = {
            startTime: new Date(),
            endTime: null,
            suites: {},
            success: true,
            totalTests: 0,
            passedTests: 0,
            failedTests: 0
        };

        for (const suite of CONFIG.testSuites) {
            const suiteName = this.getSuiteName(suite);
            console.log(`  Running ${suiteName}...`);

            const result = await this.runTestSuite(approach, suite);
            this.results.approaches[approach].suites[suiteName] = result;

            if (!result.success) {
                this.results.approaches[approach].success = false;
                console.log(`    ❌ ${suiteName} failed`);
            } else {
                console.log(`    ✅ ${suiteName} passed (${result.duration}ms)`);
            }

            // Update test counts
            this.results.approaches[approach].totalTests += result.totalTests;
            this.results.approaches[approach].passedTests += result.passedTests;
            this.results.approaches[approach].failedTests += result.failedTests;
        }

        this.results.approaches[approach].endTime = new Date();

        const approachSuccess = this.results.approaches[approach].success;
        const totalTests = this.results.approaches[approach].totalTests;
        const passedTests = this.results.approaches[approach].passedTests;

        console.log(`\n${approach.toUpperCase()} Summary: ${approachSuccess ? '✅' : '❌'} ${passedTests}/${totalTests} tests passed`);
    }

    async runTestSuite(approach, suitePath) {
        return new Promise((resolve) => {
            const startTime = Date.now();

            const env = {
                ...process.env,
                INTEGRATION_APPROACH: approach,
                TEST_API_URL: 'http://localhost',
                EQUIPMENT_API_PORT: '3001',
                PROFESSIONAL_API_PORT: '3002',
                BACKEND_URL: 'http://localhost:3004'
            };

            const args = [
                'test',
                `tests/${suitePath}`,
                '--reporter=json'
            ];

            const child = spawn('npx', ['playwright', ...args], {
                env,
                cwd: __dirname,
                stdio: ['ignore', 'pipe', 'pipe']
            });

            let stdout = '';
            let stderr = '';

            child.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            child.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            const timeout = setTimeout(() => {
                child.kill('SIGTERM');
                resolve({
                    success: false,
                    duration: Date.now() - startTime,
                    error: 'Test suite timed out',
                    totalTests: 0,
                    passedTests: 0,
                    failedTests: 0,
                    stdout,
                    stderr
                });
            }, CONFIG.timeout);

            child.on('close', (code) => {
                clearTimeout(timeout);

                const duration = Date.now() - startTime;
                let testResult = {
                    success: code === 0,
                    duration,
                    totalTests: 0,
                    passedTests: 0,
                    failedTests: 0,
                    stdout,
                    stderr
                };

                // Try to parse Playwright JSON output for test counts
                try {
                    const lines = stdout.split('\n');
                    for (const line of lines) {
                        if (line.trim().startsWith('{')) {
                            const report = JSON.parse(line);
                            if (report.stats) {
                                testResult.totalTests = report.stats.expected || 0;
                                testResult.passedTests = report.stats.ok || 0;
                                testResult.failedTests = report.stats.unexpected || 0;
                                break;
                            }
                        }
                    }
                } catch (error) {
                    // Fallback: estimate from output
                    const passedMatches = stdout.match(/✅|passed/g) || [];
                    const failedMatches = stdout.match(/❌|failed/g) || [];
                    testResult.passedTests = passedMatches.length;
                    testResult.failedTests = failedMatches.length;
                    testResult.totalTests = testResult.passedTests + testResult.failedTests;
                }

                if (code !== 0 && !testResult.error) {
                    testResult.error = `Test suite exited with code ${code}`;
                }

                resolve(testResult);
            });
        });
    }

    getSuiteName(suitePath) {
        return suitePath.replace(/\.spec\.js$/, '').replace(/\//g, '-');
    }

    async generateFinalReport() {
        console.log('\n📊 Generating final comparative report...');

        try {
            // Import and use ReportGenerator
            const { default: ReportGenerator } = await import('./tests/utils/report-generator.js');
            const reportGenerator = new ReportGenerator();

            // Load metrics from all approaches
            const metricsDir = path.join(__dirname, 'test-results', 'metrics');

            if (fs.existsSync(metricsDir)) {
                const files = fs.readdirSync(metricsDir);
                const comparativeFiles = files.filter(f => f.includes('comparative-') && f.endsWith('.json'));

                for (const file of comparativeFiles) {
                    const filePath = path.join(metricsDir, file);
                    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

                    const approachMatch = file.match(/comparative-([^-]+)-/);
                    if (approachMatch) {
                        const approach = approachMatch[1];
                        reportGenerator.addApproachResults(approach, data.rawMetrics);
                    }
                }

                if (comparativeFiles.length > 1) {
                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                    const reportPath = reportGenerator.exportReport(`final-comparison-${timestamp}.json`);
                    console.log(`✅ Final comparative report generated: ${reportPath}`);
                } else {
                    console.log('⚠️  Not enough approaches tested for comparative report');
                }
            }

            // Generate summary report
            await this.generateSummaryReport();

        } catch (error) {
            console.log(`❌ Failed to generate final report: ${error.message}`);
        }
    }

    async generateSummaryReport() {
        const summary = {
            testRun: {
                startTime: this.results.startTime,
                endTime: new Date(),
                duration: new Date() - this.results.startTime,
                approachesTested: CONFIG.approaches.length,
                totalTestSuites: CONFIG.testSuites.length
            },
            results: {},
            overall: {
                totalTests: 0,
                passedTests: 0,
                failedTests: 0,
                successRate: 0
            }
        };

        // Aggregate results by approach
        for (const [approach, result] of Object.entries(this.results.approaches)) {
            summary.results[approach] = {
                success: result.success,
                totalTests: result.totalTests,
                passedTests: result.passedTests,
                failedTests: result.failedTests,
                successRate: result.totalTests > 0 ? (result.passedTests / result.totalTests) * 100 : 0,
                duration: result.endTime - result.startTime,
                suites: Object.keys(result.suites).length
            };

            summary.overall.totalTests += result.totalTests;
            summary.overall.passedTests += result.passedTests;
            summary.overall.failedTests += result.failedTests;
        }

        summary.overall.successRate = summary.overall.totalTests > 0 ?
            (summary.overall.passedTests / summary.overall.totalTests) * 100 : 0;

        // Save summary report
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const summaryPath = path.join(CONFIG.reportDir, `test-summary-${timestamp}.json`);
        fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

        console.log(`✅ Test summary saved: ${summaryPath}`);
    }

    printSummary() {
        console.log('\n📈 Final Test Results Summary');
        console.log('═'.repeat(50));

        const duration = (this.results.endTime - this.results.startTime) / 1000;
        console.log(`Total execution time: ${Math.round(duration)}s`);
        console.log('');

        // Print results by approach
        Object.entries(this.results.approaches).forEach(([approach, result]) => {
            const successRate = result.totalTests > 0 ? (result.passedTests / result.totalTests) * 100 : 0;
            const status = result.success ? '✅' : '❌';

            console.log(`${status} ${approach.toUpperCase()}: ${result.passedTests}/${result.totalTests} tests (${successRate.toFixed(1)}%)`);
        });

        // Print overall stats
        const totalTests = Object.values(this.results.approaches).reduce((sum, r) => sum + r.totalTests, 0);
        const totalPassed = Object.values(this.results.approaches).reduce((sum, r) => sum + r.passedTests, 0);
        const overallRate = totalTests > 0 ? (totalPassed / totalTests) * 100 : 0;

        console.log('');
        console.log(`Overall: ${totalPassed}/${totalTests} tests passed (${overallRate.toFixed(1)}%)`);
        console.log('');

        // Print recommendations
        this.printRecommendations();
    }

    printRecommendations() {
        console.log('💡 Recommendations:');
        console.log('');

        const approaches = Object.entries(this.results.approaches);

        if (approaches.length === 0) {
            console.log('  No test results available for recommendations.');
            return;
        }

        // Find best performing approach
        const bestApproach = approaches.reduce((best, [name, result]) => {
            const rate = result.totalTests > 0 ? result.passedTests / result.totalTests : 0;
            const bestRate = best.result.totalTests > 0 ? best.result.passedTests / best.result.totalTests : 0;

            return rate > bestRate ? { name, result } : best;
        }, { name: approaches[0][0], result: approaches[0][1] });

        console.log(`  🏆 Best overall approach: ${bestApproach.name.toUpperCase()}`);

        // Print specific recommendations
        const failedApproaches = approaches.filter(([name, result]) => !result.success);
        if (failedApproaches.length > 0) {
            console.log(`  🔧 Approaches needing attention: ${failedApproaches.map(([name]) => name.toUpperCase()).join(', ')}`);
        }

        console.log(`  📁 Detailed reports available in: ${CONFIG.reportDir}`);
        console.log(`  📊 Metrics data available in: ${CONFIG.outputDir}/metrics`);
    }
}

// CLI interface
async function main() {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        printHelp();
        return;
    }

    // Parse command line arguments
    if (args.includes('--approaches')) {
        const idx = args.indexOf('--approaches');
        const approachesArg = args[idx + 1];
        if (approachesArg) {
            CONFIG.approaches = approachesArg.split(',').map(a => a.trim());
        }
    }

    if (args.includes('--timeout')) {
        const idx = args.indexOf('--timeout');
        const timeoutArg = args[idx + 1];
        if (timeoutArg) {
            CONFIG.timeout = parseInt(timeoutArg) * 1000; // Convert to ms
        }
    }

    const runner = new TestRunner();
    await runner.run();
}

function printHelp() {
    console.log(`
E2E Integration Approach Testing Suite

Usage: node run-tests.js [options]

Options:
  --approaches <list>    Comma-separated list of approaches to test
                        Default: ${CONFIG.approaches.join(',')}
                        
  --timeout <seconds>    Timeout for each test suite in seconds
                        Default: ${CONFIG.timeout / 1000}
                        
  --help, -h            Show this help message

Examples:
  node run-tests.js
  node run-tests.js --approaches mcp,orm
  node run-tests.js --timeout 600
  
Output:
  Test results: ${CONFIG.outputDir}/
  Reports: ${CONFIG.reportDir}/
`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(error => {
        console.error('❌ Test runner failed:', error.message);
        process.exit(1);
    });
} 