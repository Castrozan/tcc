#!/usr/bin/env node

import { spawn } from 'child_process';
import { existsSync } from 'fs';

console.log('🔍 Quick Diagnostic Test Runner');
console.log('==============================');
console.log('🎯 Running quick tests to verify setup...');
console.log('');

// Check if playwright is available
if (!existsSync('node_modules/@playwright/test')) {
    console.error('❌ Playwright not found. Please run: npm install');
    process.exit(1);
}

// Run the diagnostic test
const args = [
    'test',
    'tests/quick-diagnostic.spec.js',
    '--project', 'chromium',
    '--timeout', '60000', // 1 minute timeout
    '--reporter', 'line',
    '--workers', '1'
];

console.log(`🎯 Running: npx playwright ${args.join(' ')}`);
console.log('');

const child = spawn('npx', ['playwright', ...args], {
    stdio: 'inherit',
    env: {
        ...process.env,
        PLAYWRIGHT_BROWSERS_PATH: process.env.PLAYWRIGHT_BROWSERS_PATH || '/nix/store/4v0091sy6x7f9y8xvs9sgv05f0020ljf-playwright-browsers',
        PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS: 'true'
    }
});

child.on('error', (error) => {
    console.error('❌ Failed to start diagnostic test:', error.message);
    process.exit(1);
});

child.on('close', (code) => {
    console.log('');
    if (code === 0) {
        console.log('✅ Diagnostic tests passed! System is ready for full testing.');
        console.log('💡 You can now run: npm run test:performance or npm run test:all');
    } else {
        console.log(`❌ Diagnostic tests failed with exit code ${code}`);
        console.log('💡 Please check the output above for issues.');
    }
    process.exit(code);
}); 