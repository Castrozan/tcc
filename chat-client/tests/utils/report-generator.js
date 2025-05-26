import fs from 'fs';
import path from 'path';

class ReportGenerator {
    constructor() {
        this.reportData = {};
    }

    addApproachResults(approach, metrics) {
        this.reportData[approach] = metrics;
    }

    generateComparativeReport() {
        const approaches = Object.keys(this.reportData);

        if (approaches.length === 0) {
            throw new Error('No approach data available for comparison');
        }

        const comparison = {
            overview: this.generateOverview(approaches),
            performance: this.comparePerformance(approaches),
            security: this.compareSecurity(approaches),
            userExperience: this.compareUserExperience(approaches),
            recommendations: this.generateRecommendations(approaches)
        };

        return comparison;
    }

    generateOverview(approaches) {
        const overview = {
            testDate: new Date().toISOString(),
            approachesTested: approaches,
            totalTests: 0,
            summary: {}
        };

        approaches.forEach(approach => {
            const data = this.reportData[approach];
            const totalTests = data.performance.length + data.security.length + data.userExperience.length;
            overview.totalTests += totalTests;

            overview.summary[approach] = {
                totalTests,
                performanceTests: data.performance.length,
                securityTests: data.security.length,
                uxTests: data.userExperience.length
            };
        });

        return overview;
    }

    comparePerformance(approaches) {
        const comparison = {
            responseTime: {},
            throughput: {},
            ranking: []
        };

        approaches.forEach(approach => {
            const performanceData = this.reportData[approach].performance;

            if (performanceData.length > 0) {
                const responseTimes = performanceData.map(d => d.totalResponseTime);
                const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
                const minResponseTime = Math.min(...responseTimes);
                const maxResponseTime = Math.max(...responseTimes);

                comparison.responseTime[approach] = {
                    average: Math.round(avgResponseTime),
                    min: minResponseTime,
                    max: maxResponseTime,
                    median: this.calculateMedian(responseTimes),
                    p95: this.calculatePercentile(responseTimes, 0.95)
                };
            }
        });

        // Rank approaches by average response time (lower is better)
        comparison.ranking = approaches
            .filter(approach => comparison.responseTime[approach])
            .sort((a, b) => comparison.responseTime[a].average - comparison.responseTime[b].average)
            .map((approach, index) => ({
                rank: index + 1,
                approach,
                avgResponseTime: comparison.responseTime[approach].average,
                score: this.calculatePerformanceScore(comparison.responseTime[approach])
            }));

        return comparison;
    }

    compareSecurity(approaches) {
        const comparison = {
            vulnerabilities: {},
            attackSuccess: {},
            ranking: []
        };

        approaches.forEach(approach => {
            const securityData = this.reportData[approach].security;

            if (securityData.length > 0) {
                const successfulAttacks = securityData.filter(d => d.attackSuccessful).length;
                const totalAttacks = securityData.length;
                const vulnerabilityRate = (successfulAttacks / totalAttacks) * 100;

                comparison.vulnerabilities[approach] = {
                    totalAttacks,
                    successfulAttacks,
                    vulnerabilityRate: Math.round(vulnerabilityRate * 100) / 100,
                    attackTypes: this.groupSecurityData(securityData)
                };
            }
        });

        // Rank approaches by security (lower vulnerability rate is better)
        comparison.ranking = approaches
            .filter(approach => comparison.vulnerabilities[approach])
            .sort((a, b) => comparison.vulnerabilities[a].vulnerabilityRate - comparison.vulnerabilities[b].vulnerabilityRate)
            .map((approach, index) => ({
                rank: index + 1,
                approach,
                vulnerabilityRate: comparison.vulnerabilities[approach].vulnerabilityRate,
                score: this.calculateSecurityScore(comparison.vulnerabilities[approach])
            }));

        return comparison;
    }

    compareUserExperience(approaches) {
        const comparison = {
            accuracy: {},
            clarity: {},
            ranking: []
        };

        approaches.forEach(approach => {
            const uxData = this.reportData[approach].userExperience;

            if (uxData.length > 0) {
                const accuracyScores = uxData.map(d => d.accuracyScore).filter(s => s !== undefined);
                const clarityScores = uxData.map(d => d.clarityScore).filter(s => s !== undefined);

                if (accuracyScores.length > 0) {
                    comparison.accuracy[approach] = {
                        average: Math.round((accuracyScores.reduce((a, b) => a + b, 0) / accuracyScores.length) * 100) / 100,
                        min: Math.min(...accuracyScores),
                        max: Math.max(...accuracyScores)
                    };
                }

                if (clarityScores.length > 0) {
                    comparison.clarity[approach] = {
                        average: Math.round((clarityScores.reduce((a, b) => a + b, 0) / clarityScores.length) * 100) / 100,
                        min: Math.min(...clarityScores),
                        max: Math.max(...clarityScores)
                    };
                }
            }
        });

        // Rank approaches by combined UX score (higher is better)
        comparison.ranking = approaches
            .filter(approach => comparison.accuracy[approach] && comparison.clarity[approach])
            .sort((a, b) => {
                const scoreA = (comparison.accuracy[a].average + comparison.clarity[a].average) / 2;
                const scoreB = (comparison.accuracy[b].average + comparison.clarity[b].average) / 2;
                return scoreB - scoreA;
            })
            .map((approach, index) => {
                const combinedScore = (comparison.accuracy[approach].average + comparison.clarity[approach].average) / 2;
                return {
                    rank: index + 1,
                    approach,
                    combinedScore: Math.round(combinedScore * 100) / 100,
                    accuracyScore: comparison.accuracy[approach].average,
                    clarityScore: comparison.clarity[approach].average
                };
            });

        return comparison;
    }

    generateRecommendations(approaches) {
        const performanceRanking = this.comparePerformance(approaches).ranking;
        const securityRanking = this.compareSecurity(approaches).ranking;
        const uxRanking = this.compareUserExperience(approaches).ranking;

        const recommendations = {
            bestOverall: this.calculateOverallBest(performanceRanking, securityRanking, uxRanking),
            bestForPerformance: performanceRanking[0]?.approach || 'No data',
            bestForSecurity: securityRanking[0]?.approach || 'No data',
            bestForUX: uxRanking[0]?.approach || 'No data',
            detailed: {}
        };

        approaches.forEach(approach => {
            const perfRank = performanceRanking.find(r => r.approach === approach)?.rank || 'N/A';
            const secRank = securityRanking.find(r => r.approach === approach)?.rank || 'N/A';
            const uxRank = uxRanking.find(r => r.approach === approach)?.rank || 'N/A';

            recommendations.detailed[approach] = {
                performanceRank: perfRank,
                securityRank: secRank,
                uxRank: uxRank,
                strengths: this.identifyStrengths(approach, perfRank, secRank, uxRank),
                weaknesses: this.identifyWeaknesses(approach, perfRank, secRank, uxRank),
                useCases: this.suggestUseCases(approach, perfRank, secRank, uxRank)
            };
        });

        return recommendations;
    }

    calculateOverallBest(perfRanking, secRanking, uxRanking) {
        const approaches = new Set([
            ...perfRanking.map(r => r.approach),
            ...secRanking.map(r => r.approach),
            ...uxRanking.map(r => r.approach)
        ]);

        let bestApproach = null;
        let bestScore = Infinity;

        approaches.forEach(approach => {
            const perfRank = perfRanking.find(r => r.approach === approach)?.rank || 999;
            const secRank = secRanking.find(r => r.approach === approach)?.rank || 999;
            const uxRank = uxRanking.find(r => r.approach === approach)?.rank || 999;

            // Weighted score (security has higher weight)
            const overallScore = (perfRank * 0.3) + (secRank * 0.4) + (uxRank * 0.3);

            if (overallScore < bestScore) {
                bestScore = overallScore;
                bestApproach = approach;
            }
        });

        return {
            approach: bestApproach,
            score: Math.round(bestScore * 100) / 100
        };
    }

    calculateMedian(arr) {
        const sorted = [...arr].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    }

    calculatePercentile(arr, percentile) {
        const sorted = [...arr].sort((a, b) => a - b);
        const index = Math.ceil(sorted.length * percentile) - 1;
        return sorted[index];
    }

    calculatePerformanceScore(perfData) {
        // Lower response time = higher score (max 100)
        const avgResponseTime = perfData.average;
        if (avgResponseTime <= 1000) return 100;
        if (avgResponseTime <= 2000) return 80;
        if (avgResponseTime <= 3000) return 60;
        if (avgResponseTime <= 5000) return 40;
        return 20;
    }

    calculateSecurityScore(secData) {
        // Lower vulnerability rate = higher score (max 100)
        const vulnRate = secData.vulnerabilityRate;
        if (vulnRate === 0) return 100;
        if (vulnRate <= 10) return 80;
        if (vulnRate <= 25) return 60;
        if (vulnRate <= 50) return 40;
        return 20;
    }

    groupSecurityData(securityData) {
        const grouped = {};
        securityData.forEach(data => {
            const type = data.attackType || 'unknown';
            if (!grouped[type]) {
                grouped[type] = { total: 0, successful: 0 };
            }
            grouped[type].total++;
            if (data.attackSuccessful) {
                grouped[type].successful++;
            }
        });
        return grouped;
    }

    identifyStrengths(approach, perfRank, secRank, uxRank) {
        const strengths = [];
        if (perfRank === 1) strengths.push('Excellent performance');
        if (secRank === 1) strengths.push('Superior security');
        if (uxRank === 1) strengths.push('Best user experience');
        if (perfRank <= 2 && perfRank !== 'N/A') strengths.push('Good performance');
        if (secRank <= 2 && secRank !== 'N/A') strengths.push('Strong security');
        if (uxRank <= 2 && uxRank !== 'N/A') strengths.push('Good usability');
        return strengths.length > 0 ? strengths : ['Needs improvement in all areas'];
    }

    identifyWeaknesses(approach, perfRank, secRank, uxRank) {
        const weaknesses = [];
        if (perfRank >= 3 && perfRank !== 'N/A') weaknesses.push('Performance concerns');
        if (secRank >= 3 && secRank !== 'N/A') weaknesses.push('Security vulnerabilities');
        if (uxRank >= 3 && uxRank !== 'N/A') weaknesses.push('User experience issues');
        return weaknesses;
    }

    suggestUseCases(approach, perfRank, secRank, uxRank) {
        if (perfRank === 1) return ['High-throughput applications', 'Real-time systems'];
        if (secRank === 1) return ['Security-critical applications', 'Financial systems'];
        if (uxRank === 1) return ['User-facing applications', 'Consumer products'];
        return ['General-purpose applications'];
    }

    exportReport(filename) {
        const report = this.generateComparativeReport();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportFilename = filename || `comparative-report-${timestamp}.json`;

        const outputDir = path.join(process.cwd(), 'test-results', 'reports');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const filePath = path.join(outputDir, reportFilename);
        fs.writeFileSync(filePath, JSON.stringify(report, null, 2));

        // Also generate a simplified HTML report
        this.generateHtmlReport(report, outputDir, reportFilename);

        console.log(`Comparative report exported to: ${filePath}`);
        return filePath;
    }

    generateHtmlReport(report, outputDir, filename) {
        const htmlFilename = filename.replace('.json', '.html');
        const htmlPath = path.join(outputDir, htmlFilename);

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Integration Approaches Comparison Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f5f5f5; padding: 20px; border-radius: 8px; }
        .section { margin: 20px 0; }
        .metric-card { background: #fff; border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .ranking { background: #e8f5e8; }
        .ranking.first { background: #d4edda; }
        .ranking.second { background: #fff3cd; }
        .ranking.third { background: #f8d7da; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Integration Approaches Comparison Report</h1>
        <p>Generated: ${report.overview.testDate}</p>
        <p>Approaches Tested: ${report.overview.approachesTested.join(', ')}</p>
        <p>Total Tests: ${report.overview.totalTests}</p>
    </div>

    <div class="section">
        <h2>Performance Comparison</h2>
        ${this.generatePerformanceHtml(report.performance)}
    </div>

    <div class="section">
        <h2>Security Comparison</h2>
        ${this.generateSecurityHtml(report.security)}
    </div>

    <div class="section">
        <h2>User Experience Comparison</h2>
        ${this.generateUxHtml(report.userExperience)}
    </div>

    <div class="section">
        <h2>Recommendations</h2>
        ${this.generateRecommendationsHtml(report.recommendations)}
    </div>
</body>
</html>`;

        fs.writeFileSync(htmlPath, html);
        console.log(`HTML report exported to: ${htmlPath}`);
    }

    generatePerformanceHtml(performance) {
        return `
        <h3>Response Time Rankings</h3>
        ${performance.ranking.map((rank, index) => `
            <div class="metric-card ranking ${index === 0 ? 'first' : index === 1 ? 'second' : 'third'}">
                <strong>#${rank.rank} ${rank.approach}</strong> - ${rank.avgResponseTime}ms average
                <br>Score: ${rank.score}/100
            </div>
        `).join('')}
        `;
    }

    generateSecurityHtml(security) {
        return `
        <h3>Security Rankings</h3>
        ${security.ranking.map((rank, index) => `
            <div class="metric-card ranking ${index === 0 ? 'first' : index === 1 ? 'second' : 'third'}">
                <strong>#${rank.rank} ${rank.approach}</strong> - ${rank.vulnerabilityRate}% vulnerability rate
                <br>Score: ${rank.score}/100
            </div>
        `).join('')}
        `;
    }

    generateUxHtml(ux) {
        return `
        <h3>User Experience Rankings</h3>
        ${ux.ranking.map((rank, index) => `
            <div class="metric-card ranking ${index === 0 ? 'first' : index === 1 ? 'second' : 'third'}">
                <strong>#${rank.rank} ${rank.approach}</strong> - ${rank.combinedScore}/5.0 combined score
                <br>Accuracy: ${rank.accuracyScore}/5.0, Clarity: ${rank.clarityScore}/5.0
            </div>
        `).join('')}
        `;
    }

    generateRecommendationsHtml(recommendations) {
        return `
        <div class="metric-card">
            <h3>Overall Best Approach</h3>
            <strong>${recommendations.bestOverall.approach}</strong> (Score: ${recommendations.bestOverall.score})
        </div>
        <div class="metric-card">
            <strong>Best for Performance:</strong> ${recommendations.bestForPerformance}<br>
            <strong>Best for Security:</strong> ${recommendations.bestForSecurity}<br>
            <strong>Best for User Experience:</strong> ${recommendations.bestForUX}
        </div>
        `;
    }
}

export default ReportGenerator; 