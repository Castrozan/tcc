#!/usr/bin/env node

import { spawn } from 'child_process';
import { existsSync } from 'fs';

// Configuration
const APPROACH = process.env.APPROACH || 'current';

console.log('🚀 Complete Test Suite Runner');
console.log('==============================');
console.log(`📊 Testing approach: ${APPROACH}`);
console.log('🔄 Running Performance + Security Tests');
console.log('');

// Check if playwright is available
if (!existsSync('node_modules/@playwright/test')) {
    console.error('❌ Playwright not found. Please run: npm install');
    process.exit(1);
}

// Set environment variables
process.env.APPROACH = APPROACH;

async function runTest(testName, scriptPath) {
    return new Promise((resolve, reject) => {
        console.log(`\n📋 Starting ${testName} tests...`);
        console.log('='.repeat(50));

        const child = spawn('node', [scriptPath], {
            stdio: 'inherit',
            env: {
                ...process.env,
                PLAYWRIGHT_BROWSERS_PATH: process.env.PLAYWRIGHT_BROWSERS_PATH || '/nix/store/4v0091sy6x7f9y8xvs9sgv05f0020ljf-playwright-browsers',
                PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS: 'true'
            }
        });

        child.on('error', (error) => {
            console.error(`❌ Failed to start ${testName} test:`, error.message);
            reject(error);
        });

        child.on('close', (code) => {
            if (code === 0) {
                console.log(`\n✅ ${testName} tests completed successfully!`);
            } else {
                console.log(`\n⚠️  ${testName} tests completed with some issues (exit code ${code})`);
            }
            resolve(code);
        });
    });
}

async function main() {
    const results = {};

    try {
        // Run performance tests
        console.log('🏃‍♂️ Phase 1: Performance Testing');
        results.performance = await runTest('Performance', 'run-performance-test.js');

        // Run security tests
        console.log('\n🛡️  Phase 2: Security Testing');
        results.security = await runTest('Security', 'run-security-test.js');

        // Summary
        console.log('\n' + '='.repeat(60));
        console.log('📊 COMPLETE TEST SUITE SUMMARY');
        console.log('='.repeat(60));
        console.log(`📈 Performance Tests: ${results.performance === 0 ? '✅ PASSED' : '⚠️  ISSUES'}`);
        console.log(`🔒 Security Tests: ${results.security === 0 ? '✅ PASSED' : '⚠️  ISSUES'}`);
        console.log(`📁 Results saved in test-results/ directory`);
        console.log(`🔍 Approach tested: ${APPROACH}`);

        if (results.performance === 0 && results.security === 0) {
            console.log('\n🎉 All tests completed successfully!');
            process.exit(0);
        } else {
            console.log('\n⚠️  Some tests had issues - check individual test results');
            process.exit(1);
        }

    } catch (error) {
        console.error('\n❌ Test suite failed:', error.message);
        process.exit(1);
    }
}

main(); 