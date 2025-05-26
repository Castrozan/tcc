#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class TestSetup {
    constructor() {
        this.setupConfig = {
            directories: [
                'test-results',
                'test-results/metrics',
                'test-results/reports',
                'test-results/screenshots',
                'test-results/traces'
            ],
            envFiles: [
                '.env.test.mcp',
                '.env.test.orm',
                '.env.test.direct-db'
            ],
            requiredServices: [
                { name: 'Equipment API', url: 'http://localhost:3001', endpoint: '/public/equipment' },
                { name: 'Professional API', url: 'http://localhost:3002', endpoint: '/public/professional' },
                { name: 'Backend Server', url: 'http://localhost:3004', endpoint: '/health' }
            ]
        };
    }

    async run() {
        console.log('🔧 Setting up E2E Testing Environment');
        console.log('='.repeat(50));

        try {
            await this.checkNodeVersion();
            await this.createDirectories();
            await this.createEnvironmentFiles();
            await this.checkDependencies();
            await this.installPlaywrightBrowsers();
            await this.checkServices();
            await this.createTestDataSamples();
            this.printSetupComplete();
        } catch (error) {
            console.error('❌ Setup failed:', error.message);
            process.exit(1);
        }
    }

    async checkNodeVersion() {
        console.log('📋 Checking Node.js version...');

        const nodeVersion = process.version;
        const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

        if (majorVersion < 18) {
            throw new Error(`Node.js 18+ required. Current version: ${nodeVersion}`);
        }

        console.log(`✅ Node.js ${nodeVersion} (compatible)`);
    }

    async createDirectories() {
        console.log('📁 Creating test directories...');

        for (const dir of this.setupConfig.directories) {
            const fullPath = path.join(__dirname, dir);
            if (!fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath, { recursive: true });
                console.log(`  Created: ${dir}`);
            } else {
                console.log(`  Exists: ${dir}`);
            }
        }

        console.log('✅ Directories ready');
    }

    async createEnvironmentFiles() {
        console.log('⚙️  Creating environment configuration files...');

        const envConfigs = {
            '.env.test.mcp': `# MCP Approach Test Configuration
INTEGRATION_APPROACH=mcp
BACKEND_URL=http://localhost:3004
TEST_API_URL=http://localhost
EQUIPMENT_API_PORT=3001
PROFESSIONAL_API_PORT=3002
TEST_TIMEOUT=30000
DEBUG_MODE=false

# MCP-specific settings
MCP_SERVER_URL=ws://localhost:8080
MCP_PROTOCOL_VERSION=1.0
`,

            '.env.test.orm': `# ORM Approach Test Configuration
INTEGRATION_APPROACH=orm
BACKEND_URL=http://localhost:3004
TEST_API_URL=http://localhost
EQUIPMENT_API_PORT=3001
PROFESSIONAL_API_PORT=3002
TEST_TIMEOUT=30000
DEBUG_MODE=false

# ORM-specific settings
DATABASE_URL=postgresql://user:password@localhost:5432/testdb
ORM_LOGGING=false
`,

            '.env.test.direct-db': `# Direct Database Approach Test Configuration
INTEGRATION_APPROACH=direct-db
BACKEND_URL=http://localhost:3004
TEST_API_URL=http://localhost
EQUIPMENT_API_PORT=3001
PROFESSIONAL_API_PORT=3002
TEST_TIMEOUT=30000
DEBUG_MODE=false

# Direct DB-specific settings
DB_HOST=localhost
DB_PORT=5432
DB_NAME=testdb
DB_USER=user
DB_PASSWORD=password
DB_POOL_SIZE=10
`
        };

        for (const [filename, content] of Object.entries(envConfigs)) {
            const filePath = path.join(__dirname, filename);
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, content);
                console.log(`  Created: ${filename}`);
            } else {
                console.log(`  Exists: ${filename}`);
            }
        }

        console.log('✅ Environment files ready');
    }

    async checkDependencies() {
        console.log('📦 Checking dependencies...');

        const packageJsonPath = path.join(__dirname, 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

        const requiredDeps = [
            '@playwright/test',
            'concurrently',
            'live-server'
        ];

        const missingDeps = [];

        for (const dep of requiredDeps) {
            if (!packageJson.devDependencies?.[dep] && !packageJson.dependencies?.[dep]) {
                missingDeps.push(dep);
            }
        }

        if (missingDeps.length > 0) {
            console.log('⚠️  Missing dependencies:', missingDeps.join(', '));
            console.log('Installing missing dependencies...');

            await this.runCommand('npm', ['install', ...missingDeps, '--save-dev']);
        }

        console.log('✅ Dependencies ready');
    }

    async installPlaywrightBrowsers() {
        console.log('🌐 Installing Playwright browsers...');

        try {
            await this.runCommand('npx', ['playwright', 'install', 'chromium']);
            console.log('✅ Playwright browsers installed');
        } catch (error) {
            console.log('⚠️  Failed to install browsers automatically');
            console.log('Please run: npx playwright install chromium');
        }
    }

    async checkServices() {
        console.log('🔍 Checking service availability...');

        for (const service of this.setupConfig.requiredServices) {
            try {
                const response = await fetch(`${service.url}${service.endpoint}`);
                if (response.ok) {
                    console.log(`  ✅ ${service.name}: Available`);
                } else {
                    console.log(`  ⚠️  ${service.name}: Response ${response.status}`);
                }
            } catch (error) {
                console.log(`  ❌ ${service.name}: Not available (${service.url})`);
            }
        }

        console.log('');
        console.log('💡 If services are not available:');
        console.log('   1. Start the backend services');
        console.log('   2. Verify the ports are correct');
        console.log('   3. Check firewall/network settings');
    }

    async createTestDataSamples() {
        console.log('📊 Creating test data samples...');

        const testDataDir = path.join(__dirname, 'test-results', 'samples');
        if (!fs.existsSync(testDataDir)) {
            fs.mkdirSync(testDataDir, { recursive: true });
        }

        const sampleEquipment = [
            { id: 1, name: 'Development Laptop', type: 'Computer', description: 'High-performance laptop for software development' },
            { id: 2, name: '4K Monitor', type: 'Display', description: 'Ultra-wide 4K display for productivity' },
            { id: 3, name: 'Mechanical Keyboard', type: 'Peripheral', description: 'RGB mechanical keyboard for programming' }
        ];

        const sampleProfessionals = [
            { id: 1, name: 'Alice Johnson', role: 'Software Engineer', hierarchy: 2, bio: 'Full-stack developer with 5 years experience' },
            { id: 2, name: 'Bob Smith', role: 'Engineering Manager', hierarchy: 4, bio: 'Technical lead managing development teams' },
            { id: 3, name: 'Carol Davis', role: 'UX Designer', hierarchy: 2, bio: 'User experience designer with focus on accessibility' }
        ];

        fs.writeFileSync(
            path.join(testDataDir, 'sample-equipment.json'),
            JSON.stringify(sampleEquipment, null, 2)
        );

        fs.writeFileSync(
            path.join(testDataDir, 'sample-professionals.json'),
            JSON.stringify(sampleProfessionals, null, 2)
        );

        console.log('✅ Test data samples created');
    }

    async runCommand(command, args) {
        return new Promise((resolve, reject) => {
            const child = spawn(command, args, {
                stdio: 'inherit',
                cwd: __dirname
            });

            child.on('close', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`Command failed with exit code ${code}`));
                }
            });

            child.on('error', reject);
        });
    }

    printSetupComplete() {
        console.log('');
        console.log('🎉 Setup Complete!');
        console.log('='.repeat(50));
        console.log('');
        console.log('📋 Next Steps:');
        console.log('');
        console.log('1. Start your backend services:');
        console.log('   • Equipment API: http://localhost:3001');
        console.log('   • Professional API: http://localhost:3002');
        console.log('   • Backend Server: http://localhost:3004');
        console.log('');
        console.log('2. Run tests:');
        console.log('   node run-tests.js                    # All approaches');
        console.log('   node run-tests.js --approaches mcp   # Single approach');
        console.log('');
        console.log('3. Run individual test suites:');
        console.log('   INTEGRATION_APPROACH=mcp npx playwright test tests/performance/');
        console.log('   INTEGRATION_APPROACH=orm npx playwright test tests/security/');
        console.log('');
        console.log('4. Debug specific tests:');
        console.log('   npx playwright test tests/chat.spec.js --headed --debug');
        console.log('');
        console.log('📁 Project Structure:');
        console.log('   tests/                    # Test suites');
        console.log('   test-results/            # Test outputs');
        console.log('   ├── metrics/             # Raw metrics');
        console.log('   ├── reports/             # Generated reports');
        console.log('   └── samples/             # Sample data');
        console.log('');
        console.log('⚙️  Configuration:');
        console.log('   .env.test.mcp            # MCP approach settings');
        console.log('   .env.test.orm            # ORM approach settings');
        console.log('   .env.test.direct-db      # Direct DB settings');
        console.log('');
        console.log('📚 Documentation:');
        console.log('   tests/README.md          # Comprehensive guide');
        console.log('   playwright.config.js     # Playwright configuration');
        console.log('');
        console.log('🚀 Happy Testing!');
    }
}

// CLI interface
async function main() {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
E2E Testing Environment Setup

Usage: node setup-tests.js [options]

Options:
  --help, -h    Show this help message

This script will:
  ✅ Check Node.js version
  ✅ Create necessary directories  
  ✅ Generate environment configuration files
  ✅ Verify dependencies
  ✅ Install Playwright browsers
  ✅ Check service availability
  ✅ Create sample test data

After setup, you can run tests with:
  node run-tests.js
`);
        return;
    }

    const setup = new TestSetup();
    await setup.run();
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(error => {
        console.error('❌ Setup failed:', error.message);
        process.exit(1);
    });
}

export default TestSetup; 