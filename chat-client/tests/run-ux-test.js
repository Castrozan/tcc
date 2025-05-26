#!/usr/bin/env node

import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the project root (parent of tests directory)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = dirname(__dirname);

// Change to project root directory
process.chdir(projectRoot);

// Configuration
const APPROACH = process.env.APPROACH || 'current';
const TIMEOUT = process.env.TIMEOUT || '180000'; // 3 minutes default

console.log('🎨 Simple User Experience Test Runner');
console.log('====================================');
console.log(`📊 Testing approach: ${APPROACH}`);
console.log(`⏱️  Timeout: ${TIMEOUT}ms`);
console.log('');

// Check if playwright is available
if (!existsSync('node_modules/@playwright/test')) {
    console.error('❌ Playwright not found. Please run: npm install');
    process.exit(1);
}

// Set environment variables
process.env.APPROACH = APPROACH;

// Run the simplified UX test
const args = [
    'test',
    'tests/user-experience/ux.spec.js',
    '--project', 'chromium',
    '--timeout', TIMEOUT,
    '--reporter', 'line',
    '--workers', '1' // Force single worker
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
    console.error('❌ Failed to start UX test:', error.message);
    process.exit(1);
});

child.on('close', (code) => {
    console.log('');
    if (code === 0) {
        console.log('✅ User Experience tests completed successfully!');
        console.log('📁 Results saved in test-results/ directory');
    } else {
        console.log(`❌ UX tests failed with exit code ${code}`);
    }
    process.exit(code);
}); 