#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ResultsAnalyzer {
    constructor() {
        this.metricsDir = path.join(__dirname, 'test-results', 'metrics');
        this.reportsDir = path.join(__dirname, 'test-results', 'reports');
        this.approaches = ['mcp', 'orm', 'direct-db'];
        this.testCategories = ['performance', 'security', 'ux', 'reliability', 'comparative'];
    }

    async analyze(options = {}) {
        console.log('📊 Analyzing Test Results');
        console.log('='.repeat(50));

        try {
            const metrics = await this.loadAllMetrics();

            if (Object.keys(metrics).length === 0) {
                console.log('❌ No metrics files found. Please run tests first.');
                return;
            }

            const analysis = this.performAnalysis(metrics);
            const insights = this.generateInsights(analysis);
            const recommendations = this.generateRecommendations(analysis);

            const report = {
                timestamp: new Date().toISOString(),
                summary: this.generateSummary(analysis),
                detailed: analysis,
                insights,
                recommendations,
                visualizations: this.generateVisualizationData(analysis)
            };

            await this.exportAnalysis(report);
            this.printSummary(report);

            if (options.detailed) {
                this.printDetailedAnalysis(report);
            }

            if (options.export) {
                await this.exportCSV(analysis);
            }

        } catch (error) {
            console.error('❌ Analysis failed:', error.message);
            throw error;
        }
    }

    async loadAllMetrics() {
        const metrics = {};

        if (!fs.existsSync(this.metricsDir)) {
            return metrics;
        }

        const files = fs.readdirSync(this.metricsDir);

        for (const file of files) {
            if (!file.endsWith('.json')) continue;

            try {
                const filePath = path.join(this.metricsDir, file);
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

                // Parse filename to extract approach and category
                const match = file.match(/([^-]+)-([^-]+)-([^.]+)\.json/);
                if (match) {
                    const [, category, approach, timestamp] = match;

                    if (!metrics[approach]) {
                        metrics[approach] = {};
                    }

                    if (!metrics[approach][category]) {
                        metrics[approach][category] = [];
                    }

                    metrics[approach][category].push({
                        timestamp,
                        data: data.rawMetrics || data,
                        summary: data.summary || {}
                    });
                }
            } catch (error) {
                console.warn(`⚠️  Failed to load ${file}:`, error.message);
            }
        }

        return metrics;
    }

    performAnalysis(metrics) {
        const analysis = {
            approaches: {},
            comparisons: {},
            trends: {},
            statistics: {}
        };

        // Analyze each approach
        for (const [approach, categories] of Object.entries(metrics)) {
            analysis.approaches[approach] = this.analyzeApproach(approach, categories);
        }

        // Cross-approach comparisons
        if (Object.keys(metrics).length > 1) {
            analysis.comparisons = this.performComparisons(metrics);
        }

        // Generate statistics
        analysis.statistics = this.calculateStatistics(metrics);

        return analysis;
    }

    analyzeApproach(approach, categories) {
        const result = {
            performance: this.analyzePerformance(categories.performance || []),
            security: this.analyzeSecurity(categories.security || []),
            userExperience: this.analyzeUserExperience(categories.ux || []),
            reliability: this.analyzeReliability(categories.reliability || []),
            overall: {}
        };

        // Calculate overall scores
        result.overall = this.calculateOverallScores(result);

        return result;
    }

    analyzePerformance(performanceData) {
        if (performanceData.length === 0) return null;

        const allMetrics = performanceData.flatMap(d => d.data.performance || []);

        return {
            averageResponseTime: this.calculateAverage(allMetrics, 'totalResponseTime'),
            medianResponseTime: this.calculateMedian(allMetrics, 'totalResponseTime'),
            p95ResponseTime: this.calculatePercentile(allMetrics, 'totalResponseTime', 95),
            throughput: this.calculateAverage(allMetrics, 'throughput'),
            networkLatency: this.calculateAverage(allMetrics, 'avgNetworkResponseTime'),
            testCount: allMetrics.length,
            reliability: this.calculateSuccessRate(allMetrics)
        };
    }

    analyzeSecurity(securityData) {
        if (securityData.length === 0) return null;

        const allMetrics = securityData.flatMap(d => d.data.security || []);

        const attacksByType = {};
        let totalAttacks = 0;
        let successfulAttacks = 0;

        for (const metric of allMetrics) {
            const type = metric.attackType || 'unknown';
            if (!attacksByType[type]) {
                attacksByType[type] = { total: 0, successful: 0 };
            }

            attacksByType[type].total++;
            totalAttacks++;

            if (metric.attackSuccessful) {
                attacksByType[type].successful++;
                successfulAttacks++;
            }
        }

        return {
            totalAttacks,
            successfulAttacks,
            successRate: totalAttacks > 0 ? (successfulAttacks / totalAttacks) * 100 : 0,
            resistanceScore: totalAttacks > 0 ? ((totalAttacks - successfulAttacks) / totalAttacks) * 100 : 100,
            attacksByType,
            vulnerabilities: this.identifyVulnerabilities(attacksByType)
        };
    }

    analyzeUserExperience(uxData) {
        if (uxData.length === 0) return null;

        const allMetrics = uxData.flatMap(d => d.data.userExperience || []);

        return {
            averageAccuracy: this.calculateAverage(allMetrics, 'accuracyScore'),
            averageClarity: this.calculateAverage(allMetrics, 'clarityScore'),
            averageHelpfulness: this.calculateAverage(allMetrics, 'helpfulnessScore'),
            averageOverall: this.calculateAverage(allMetrics, 'overallScore'),
            responseQuality: this.categorizeResponseQuality(allMetrics),
            conversationFlow: this.analyzeConversationFlow(allMetrics),
            testCount: allMetrics.length
        };
    }

    analyzeReliability(reliabilityData) {
        if (reliabilityData.length === 0) return null;

        const allMetrics = reliabilityData.flatMap(d => d.data.reliability || []);

        return {
            consistencyScore: this.calculateAverage(allMetrics, 'consistencyScore'),
            recoverySuccess: this.calculateSuccessRate(allMetrics, 'recoverySuccessful'),
            errorHandling: this.calculateSuccessRate(allMetrics, 'errorHandledGracefully'),
            sessionPersistence: this.calculateSuccessRate(allMetrics, 'sessionMaintained'),
            averageRecoveryTime: this.calculateAverage(allMetrics, 'recoveryTime'),
            testCount: allMetrics.length
        };
    }

    performComparisons(metrics) {
        const approaches = Object.keys(metrics);
        const comparisons = {};

        // Performance comparison
        const performanceComparison = {};
        for (const approach of approaches) {
            const perfData = this.analyzePerformance(metrics[approach].performance || []);
            if (perfData) {
                performanceComparison[approach] = {
                    responseTime: perfData.averageResponseTime,
                    throughput: perfData.throughput,
                    reliability: perfData.reliability
                };
            }
        }
        comparisons.performance = this.rankApproaches(performanceComparison, 'responseTime', false); // Lower is better

        // Security comparison
        const securityComparison = {};
        for (const approach of approaches) {
            const secData = this.analyzeSecurity(metrics[approach].security || []);
            if (secData) {
                securityComparison[approach] = {
                    resistanceScore: secData.resistanceScore,
                    vulnerabilities: secData.vulnerabilities.length
                };
            }
        }
        comparisons.security = this.rankApproaches(securityComparison, 'resistanceScore', true); // Higher is better

        // UX comparison
        const uxComparison = {};
        for (const approach of approaches) {
            const uxData = this.analyzeUserExperience(metrics[approach].ux || []);
            if (uxData) {
                uxComparison[approach] = {
                    overallScore: uxData.averageOverall,
                    accuracy: uxData.averageAccuracy,
                    clarity: uxData.averageClarity
                };
            }
        }
        comparisons.userExperience = this.rankApproaches(uxComparison, 'overallScore', true);

        return comparisons;
    }

    generateInsights(analysis) {
        const insights = [];

        // Performance insights
        for (const [approach, data] of Object.entries(analysis.approaches)) {
            if (data.performance) {
                const perf = data.performance;
                if (perf.averageResponseTime > 10000) {
                    insights.push({
                        type: 'performance',
                        approach,
                        severity: 'high',
                        message: `${approach.toUpperCase()} has slow response times (${Math.round(perf.averageResponseTime)}ms average)`
                    });
                }

                if (perf.p95ResponseTime > 30000) {
                    insights.push({
                        type: 'performance',
                        approach,
                        severity: 'medium',
                        message: `${approach.toUpperCase()} has poor P95 response times (${Math.round(perf.p95ResponseTime)}ms)`
                    });
                }
            }

            // Security insights
            if (data.security) {
                const sec = data.security;
                if (sec.successRate > 10) {
                    insights.push({
                        type: 'security',
                        approach,
                        severity: 'critical',
                        message: `${approach.toUpperCase()} has security vulnerabilities (${sec.successRate.toFixed(1)}% attack success rate)`
                    });
                }

                if (sec.vulnerabilities.length > 0) {
                    insights.push({
                        type: 'security',
                        approach,
                        severity: 'high',
                        message: `${approach.toUpperCase()} vulnerable to: ${sec.vulnerabilities.join(', ')}`
                    });
                }
            }

            // UX insights
            if (data.userExperience) {
                const ux = data.userExperience;
                if (ux.averageOverall < 3.0) {
                    insights.push({
                        type: 'ux',
                        approach,
                        severity: 'medium',
                        message: `${approach.toUpperCase()} has poor user experience scores (${ux.averageOverall.toFixed(2)}/5.0)`
                    });
                }
            }
        }

        return insights;
    }

    generateRecommendations(analysis) {
        const recommendations = [];

        // Find best performing approach
        const performanceRanking = analysis.comparisons.performance || {};
        if (performanceRanking.ranking && performanceRanking.ranking.length > 0) {
            const best = performanceRanking.ranking[0];
            recommendations.push({
                category: 'performance',
                priority: 'high',
                title: `Use ${best.approach.toUpperCase()} for best performance`,
                description: `${best.approach.toUpperCase()} shows the best performance with ${Math.round(best.responseTime)}ms average response time`
            });
        }

        // Security recommendations
        for (const [approach, data] of Object.entries(analysis.approaches)) {
            if (data.security && data.security.successRate > 5) {
                recommendations.push({
                    category: 'security',
                    priority: 'critical',
                    title: `Fix security vulnerabilities in ${approach.toUpperCase()}`,
                    description: `Implement additional security measures to prevent ${data.security.vulnerabilities.join(', ')} attacks`
                });
            }
        }

        // General recommendations
        recommendations.push({
            category: 'general',
            priority: 'medium',
            title: 'Implement comprehensive monitoring',
            description: 'Set up continuous monitoring for performance, security, and user experience metrics'
        });

        return recommendations;
    }

    calculateOverallScores(approachData) {
        const scores = {};

        if (approachData.performance) {
            // Performance score (0-100, higher is better)
            const responseTime = approachData.performance.averageResponseTime;
            scores.performance = Math.max(0, 100 - (responseTime / 100)); // Penalize slow responses
        }

        if (approachData.security) {
            scores.security = approachData.security.resistanceScore;
        }

        if (approachData.userExperience) {
            scores.userExperience = (approachData.userExperience.averageOverall / 5) * 100;
        }

        if (approachData.reliability) {
            scores.reliability = approachData.reliability.consistencyScore * 100;
        }

        // Calculate weighted overall score
        const weights = { performance: 0.3, security: 0.3, userExperience: 0.2, reliability: 0.2 };
        let weightedSum = 0;
        let totalWeight = 0;

        for (const [category, weight] of Object.entries(weights)) {
            if (scores[category] !== undefined) {
                weightedSum += scores[category] * weight;
                totalWeight += weight;
            }
        }

        scores.overall = totalWeight > 0 ? weightedSum / totalWeight : 0;

        return scores;
    }

    // Utility functions
    calculateAverage(data, field) {
        if (data.length === 0) return 0;
        const values = data.map(d => d[field]).filter(v => v !== undefined && v !== null);
        return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
    }

    calculateMedian(data, field) {
        const values = data.map(d => d[field]).filter(v => v !== undefined && v !== null).sort((a, b) => a - b);
        if (values.length === 0) return 0;
        const mid = Math.floor(values.length / 2);
        return values.length % 2 === 0 ? (values[mid - 1] + values[mid]) / 2 : values[mid];
    }

    calculatePercentile(data, field, percentile) {
        const values = data.map(d => d[field]).filter(v => v !== undefined && v !== null).sort((a, b) => a - b);
        if (values.length === 0) return 0;
        const index = Math.ceil((percentile / 100) * values.length) - 1;
        return values[Math.max(0, index)];
    }

    calculateSuccessRate(data, field = 'success') {
        if (data.length === 0) return 0;
        const successful = data.filter(d => d[field] === true || d[field] === 'success').length;
        return (successful / data.length) * 100;
    }

    generateSummary(analysis) {
        const approachCount = Object.keys(analysis.approaches).length;
        const hasComparisons = Object.keys(analysis.comparisons).length > 0;

        return {
            approachesTested: approachCount,
            hasComparativeData: hasComparisons,
            testCategories: Object.keys(analysis.approaches[Object.keys(analysis.approaches)[0]] || {}),
            overallWinner: hasComparisons ? this.determineOverallWinner(analysis) : null
        };
    }

    determineOverallWinner(analysis) {
        const scores = {};

        for (const [approach, data] of Object.entries(analysis.approaches)) {
            scores[approach] = data.overall?.overall || 0;
        }

        const winner = Object.entries(scores).reduce((best, [approach, score]) =>
            score > best.score ? { approach, score } : best,
            { approach: null, score: -1 }
        );

        return winner.approach;
    }

    async exportAnalysis(report) {
        if (!fs.existsSync(this.reportsDir)) {
            fs.mkdirSync(this.reportsDir, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportPath = path.join(this.reportsDir, `analysis-${timestamp}.json`);

        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`✅ Analysis report saved: ${reportPath}`);

        return reportPath;
    }

    printSummary(report) {
        console.log('\n📈 Analysis Summary');
        console.log('─'.repeat(50));

        const summary = report.summary;
        console.log(`Approaches tested: ${summary.approachesTested}`);
        console.log(`Test categories: ${summary.testCategories.join(', ')}`);

        if (summary.overallWinner) {
            console.log(`🏆 Best overall approach: ${summary.overallWinner.toUpperCase()}`);
        }

        // Print top insights
        const criticalInsights = report.insights.filter(i => i.severity === 'critical');
        if (criticalInsights.length > 0) {
            console.log('\n⚠️  Critical Issues:');
            criticalInsights.forEach(insight => {
                console.log(`   • ${insight.message}`);
            });
        }

        // Print top recommendations
        const topRecommendations = report.recommendations
            .filter(r => r.priority === 'critical' || r.priority === 'high')
            .slice(0, 3);

        if (topRecommendations.length > 0) {
            console.log('\n💡 Top Recommendations:');
            topRecommendations.forEach(rec => {
                console.log(`   • ${rec.title}`);
            });
        }
    }

    // Helper methods (continuing with implementation...)
    identifyVulnerabilities(attacksByType) {
        const vulnerabilities = [];
        for (const [type, stats] of Object.entries(attacksByType)) {
            if (stats.successful > 0) {
                vulnerabilities.push(type);
            }
        }
        return vulnerabilities;
    }

    categorizeResponseQuality(metrics) {
        const excellent = metrics.filter(m => m.overallScore >= 4.0).length;
        const good = metrics.filter(m => m.overallScore >= 3.0 && m.overallScore < 4.0).length;
        const poor = metrics.filter(m => m.overallScore < 3.0).length;

        return { excellent, good, poor, total: metrics.length };
    }

    analyzeConversationFlow(metrics) {
        const conversationMetrics = metrics.filter(m => m.queryType === 'conversation_flow');
        if (conversationMetrics.length === 0) return null;

        const contextRetention = conversationMetrics.filter(m => m.contextRetained).length;
        return {
            totalConversations: conversationMetrics.length,
            contextRetentionRate: (contextRetention / conversationMetrics.length) * 100
        };
    }

    rankApproaches(data, field, higherIsBetter = true) {
        const entries = Object.entries(data).map(([approach, values]) => ({
            approach,
            [field]: values[field]
        }));

        entries.sort((a, b) => higherIsBetter ? b[field] - a[field] : a[field] - b[field]);

        return {
            ranking: entries,
            best: entries[0]?.approach,
            worst: entries[entries.length - 1]?.approach
        };
    }

    calculateStatistics(metrics) {
        const stats = {
            totalTestRuns: 0,
            totalMetrics: 0,
            approaches: Object.keys(metrics),
            categories: new Set()
        };

        for (const [approach, categories] of Object.entries(metrics)) {
            for (const [category, runs] of Object.entries(categories)) {
                stats.categories.add(category);
                stats.totalTestRuns += runs.length;

                for (const run of runs) {
                    if (run.data) {
                        stats.totalMetrics += Object.values(run.data).flat().length;
                    }
                }
            }
        }

        stats.categories = Array.from(stats.categories);
        return stats;
    }

    generateVisualizationData(analysis) {
        // Generate data structures suitable for visualization
        return {
            performanceChart: this.generatePerformanceChart(analysis),
            securityRadar: this.generateSecurityRadar(analysis),
            uxScores: this.generateUXScores(analysis),
            comparisonMatrix: this.generateComparisonMatrix(analysis)
        };
    }

    generatePerformanceChart(analysis) {
        const data = [];
        for (const [approach, approachData] of Object.entries(analysis.approaches)) {
            if (approachData.performance) {
                data.push({
                    approach: approach.toUpperCase(),
                    avgResponseTime: Math.round(approachData.performance.averageResponseTime),
                    medianResponseTime: Math.round(approachData.performance.medianResponseTime),
                    p95ResponseTime: Math.round(approachData.performance.p95ResponseTime)
                });
            }
        }
        return data;
    }

    generateSecurityRadar(analysis) {
        const data = [];
        for (const [approach, approachData] of Object.entries(analysis.approaches)) {
            if (approachData.security) {
                data.push({
                    approach: approach.toUpperCase(),
                    resistanceScore: Math.round(approachData.security.resistanceScore),
                    vulnerabilityCount: approachData.security.vulnerabilities.length
                });
            }
        }
        return data;
    }

    generateUXScores(analysis) {
        const data = [];
        for (const [approach, approachData] of Object.entries(analysis.approaches)) {
            if (approachData.userExperience) {
                const ux = approachData.userExperience;
                data.push({
                    approach: approach.toUpperCase(),
                    accuracy: Math.round(ux.averageAccuracy * 20), // Convert to 0-100 scale
                    clarity: Math.round(ux.averageClarity * 20),
                    helpfulness: Math.round(ux.averageHelpfulness * 20),
                    overall: Math.round(ux.averageOverall * 20)
                });
            }
        }
        return data;
    }

    generateComparisonMatrix(analysis) {
        const matrix = {};
        for (const [approach, approachData] of Object.entries(analysis.approaches)) {
            matrix[approach.toUpperCase()] = {
                performance: approachData.overall?.performance || 0,
                security: approachData.overall?.security || 0,
                userExperience: approachData.overall?.userExperience || 0,
                reliability: approachData.overall?.reliability || 0,
                overall: approachData.overall?.overall || 0
            };
        }
        return matrix;
    }

    async exportCSV(analysis) {
        // Export key metrics as CSV for further analysis
        const csvData = [];
        const headers = ['Approach', 'Category', 'Metric', 'Value'];
        csvData.push(headers.join(','));

        for (const [approach, approachData] of Object.entries(analysis.approaches)) {
            // Performance metrics
            if (approachData.performance) {
                const perf = approachData.performance;
                csvData.push(`${approach},Performance,Average Response Time,${perf.averageResponseTime}`);
                csvData.push(`${approach},Performance,Median Response Time,${perf.medianResponseTime}`);
                csvData.push(`${approach},Performance,P95 Response Time,${perf.p95ResponseTime}`);
                csvData.push(`${approach},Performance,Throughput,${perf.throughput}`);
            }

            // Security metrics
            if (approachData.security) {
                const sec = approachData.security;
                csvData.push(`${approach},Security,Resistance Score,${sec.resistanceScore}`);
                csvData.push(`${approach},Security,Attack Success Rate,${sec.successRate}`);
                csvData.push(`${approach},Security,Vulnerability Count,${sec.vulnerabilities.length}`);
            }

            // UX metrics
            if (approachData.userExperience) {
                const ux = approachData.userExperience;
                csvData.push(`${approach},UX,Average Accuracy,${ux.averageAccuracy}`);
                csvData.push(`${approach},UX,Average Clarity,${ux.averageClarity}`);
                csvData.push(`${approach},UX,Average Helpfulness,${ux.averageHelpfulness}`);
                csvData.push(`${approach},UX,Overall Score,${ux.averageOverall}`);
            }

            // Overall scores
            if (approachData.overall) {
                const overall = approachData.overall;
                for (const [metric, value] of Object.entries(overall)) {
                    csvData.push(`${approach},Overall,${metric},${value}`);
                }
            }
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const csvPath = path.join(this.reportsDir, `metrics-export-${timestamp}.csv`);
        fs.writeFileSync(csvPath, csvData.join('\n'));

        console.log(`✅ CSV export saved: ${csvPath}`);
        return csvPath;
    }
}

// CLI interface
async function main() {
    const args = process.argv.slice(2);

    const options = {
        detailed: args.includes('--detailed') || args.includes('-d'),
        export: args.includes('--export') || args.includes('-e'),
        help: args.includes('--help') || args.includes('-h')
    };

    if (options.help) {
        console.log(`
Test Results Analyzer

Usage: node analyze-results.js [options]

Options:
  --detailed, -d    Show detailed analysis
  --export, -e      Export data to CSV
  --help, -h        Show this help message

Examples:
  node analyze-results.js
  node analyze-results.js --detailed --export

This script analyzes test results and generates insights about:
  📊 Performance comparisons across approaches
  🔒 Security vulnerability assessments  
  👥 User experience evaluations
  🔧 Reliability measurements
  💡 Actionable recommendations
`);
        return;
    }

    const analyzer = new ResultsAnalyzer();
    await analyzer.analyze(options);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(error => {
        console.error('❌ Analysis failed:', error.message);
        process.exit(1);
    });
}

export default ResultsAnalyzer; 