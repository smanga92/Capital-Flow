// Capital Flow Tracker - Main Application Logic

class CapitalFlowApp {
    constructor() {
        this.history = this.loadHistory();
        this.currentAnalysis = null;
        this.init();
    }

    init() {
        // Event listeners
        document.getElementById('analyzeBtn').addEventListener('click', () => this.analyze());
        document.getElementById('clearHistoryBtn').addEventListener('click', () => this.clearHistory());
        
        // Load history display
        this.displayHistory();
        
        // Service worker registration for PWA
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').catch(() => {});
        }
    }

    analyze() {
        const btc = document.getElementById('btc').value;
        const gold = document.getElementById('gold').value;
        const usdjpy = document.getElementById('usdjpy').value;
        const eurusd = document.getElementById('eurusd').value;

        if (!btc || !gold || !usdjpy || !eurusd) {
            alert('Please select all four assets before analyzing');
            return;
        }

        const input = { btc, gold, usdjpy, eurusd };
        
        // Find matching scenarios
        const matches = this.matchScenarios(input);
        
        // Save to history
        this.saveToHistory(input, matches.bestMatch);
        
        // Display results
        this.displayResults(matches, input);
        
        // Check for transitions
        this.checkTransitions(matches.bestMatch);
        
        // Scroll to results
        document.getElementById('resultsContainer').scrollIntoView({ behavior: 'smooth' });
    }

    matchScenarios(input) {
        const scores = SCENARIOS.map(scenario => {
            let score = 0;
            let maxScore = 0;
            let missingSignals = [];

            // Check must-have signals
            for (const [asset, required] of Object.entries(scenario.mustHave)) {
                maxScore += 10;
                if (Array.isArray(required)) {
                    if (required.includes(input[asset])) {
                        score += 10;
                    } else {
                        missingSignals.push(`${asset.toUpperCase()} should be ${required.join(' or ')}`);
                    }
                } else {
                    if (input[asset] === required) {
                        score += 10;
                    } else {
                        missingSignals.push(`${asset.toUpperCase()} should be ${required}`);
                    }
                }
            }

            // Check confluence signals
            if (scenario.confluence) {
                for (const [asset, acceptable] of Object.entries(scenario.confluence)) {
                    maxScore += 3;
                    if (Array.isArray(acceptable)) {
                        if (acceptable.includes(input[asset])) {
                            score += 3;
                        }
                    } else {
                        if (input[asset] === acceptable) {
                            score += 3;
                        }
                    }
                }
            }

            const percentage = Math.round((score / maxScore) * 100);

            return {
                scenario,
                score,
                maxScore,
                percentage,
                missingSignals
            };
        });

        // Sort by score
        scores.sort((a, b) => b.percentage - a.percentage);

        return {
            bestMatch: scores[0],
            alternativeMatches: scores.slice(1, 4).filter(s => s.percentage > 40),
            allScores: scores
        };
    }

    displayResults(matches, input) {
        const resultsContainer = document.getElementById('resultsContainer');
        const scenarioResult = document.getElementById('scenarioResult');
        const confidenceBadge = document.getElementById('confidenceBadge');
        const tradesSuggestions = document.getElementById('tradesSuggestions');
        const regimeContext = document.getElementById('regimeContext');

        resultsContainer.style.display = 'block';

        const match = matches.bestMatch;
        const scenario = match.scenario;

        // Confidence badge
        let confidenceClass = 'confidence-low';
        let confidenceText = 'Low Confidence';
        if (match.percentage >= 80) {
            confidenceClass = 'confidence-high';
            confidenceText = `${match.percentage}% Match`;
        } else if (match.percentage >= 60) {
            confidenceClass = 'confidence-medium';
            confidenceText = `${match.percentage}% Match`;
        } else {
            confidenceText = `${match.percentage}% Match - Mixed Signals`;
        }

        confidenceBadge.className = `confidence-badge ${confidenceClass}`;
        confidenceBadge.textContent = confidenceText;

        // Scenario details
        scenarioResult.innerHTML = `
            <div class="scenario-name">Scenario ${scenario.id}: ${scenario.name}</div>
            <div class="scenario-description">${scenario.description}</div>
            <div class="scenario-details">
                <div class="detail-row">
                    <span class="detail-label">Hold Time:</span>
                    <span class="detail-value">${scenario.holdTime}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Risk Level:</span>
                    <span class="detail-value">${scenario.riskLevel}</span>
                </div>
                ${match.missingSignals.length > 0 ? `
                    <div class="detail-row">
                        <span class="detail-label">Missing Signals:</span>
                        <span class="detail-value" style="color: var(--warning);">${match.missingSignals.join(', ')}</span>
                    </div>
                ` : ''}
                ${matches.alternativeMatches.length > 0 ? `
                    <div class="detail-row">
                        <span class="detail-label">Alternative:</span>
                        <span class="detail-value">${matches.alternativeMatches[0].scenario.name} (${matches.alternativeMatches[0].percentage}%)</span>
                    </div>
                ` : ''}
            </div>
        `;

        // Trade suggestions
        tradesSuggestions.innerHTML = '';
        const assets = ['btc', 'gold', 'usdjpy', 'eurusd'];
        assets.forEach(asset => {
            const trade = scenario.trades[asset];
            const assetName = asset === 'btc' ? 'BTC' : 
                            asset === 'gold' ? 'Gold' : 
                            asset === 'usdjpy' ? 'USDJPY' : 'EURUSD';
            
            tradesSuggestions.innerHTML += `
                <div class="trade-card ${trade.type}">
                    <div class="trade-header">
                        <span class="trade-asset">${assetName}</span>
                        <span class="trade-action ${trade.type}">${trade.action}</span>
                    </div>
                    <div class="trade-details">${trade.details}</div>
                    <div class="trade-risk"><strong>Risk:</strong> ${trade.risk}</div>
                </div>
            `;
        });

        // Key points
        if (scenario.keyPoints && scenario.keyPoints.length > 0) {
            tradesSuggestions.innerHTML += `
                <div class="trade-card" style="border-left-color: var(--accent-teal); grid-column: 1 / -1;">
                    <div class="trade-header">
                        <span class="trade-asset">⚡ Key Points</span>
                    </div>
                    <div class="trade-details">
                        ${scenario.keyPoints.map(point => `• ${point}`).join('<br>')}
                    </div>
                </div>
            `;
        }

        // Regime context
        this.displayRegimeContext(regimeContext, scenario);
    }

    displayRegimeContext(container, currentScenario) {
        const recentHistory = this.history.slice(-7); // Last 7 days
        
        if (recentHistory.length === 0) {
            container.innerHTML = `
                <div class="context-item">
                    <div class="context-label">Status</div>
                    <div class="context-value">No historical data yet. Start tracking daily to build context.</div>
                </div>
            `;
            return;
        }

        // Count consecutive days in current scenario
        let consecutiveDays = 0;
        for (let i = recentHistory.length - 1; i >= 0; i--) {
            if (recentHistory[i].scenarioId === currentScenario.id) {
                consecutiveDays++;
            } else {
                break;
            }
        }

        // Find previous scenario
        let previousScenario = null;
        if (consecutiveDays < recentHistory.length) {
            const prevIndex = recentHistory.length - consecutiveDays - 1;
            if (prevIndex >= 0) {
                previousScenario = SCENARIOS.find(s => s.id === recentHistory[prevIndex].scenarioId);
            }
        }

        // Lead/lag analysis
        const leadLagInfo = this.analyzeLeadLag(recentHistory);

        container.innerHTML = `
            <div class="context-item">
                <div class="context-label">Current Regime Duration</div>
                <div class="context-value">${consecutiveDays === 0 ? 'New scenario starting today' : `Day ${consecutiveDays + 1} of Scenario ${currentScenario.id}`}</div>
            </div>
            ${previousScenario ? `
                <div class="context-item">
                    <div class="context-label">Previous Regime</div>
                    <div class="context-value">Came from Scenario ${previousScenario.id}: ${previousScenario.name}</div>
                </div>
            ` : ''}
            ${leadLagInfo ? `
                <div class="context-item">
                    <div class="context-label">Lead/Lag Analysis</div>
                    <div class="context-value">${leadLagInfo}</div>
                </div>
            ` : ''}
            <div class="context-item">
                <div class="context-label">Recent Volatility</div>
                <div class="context-value">${this.getVolatilityDescription(recentHistory)}</div>
            </div>
        `;
    }

    analyzeLeadLag(history) {
        if (history.length < 2) return null;

        const today = history[history.length - 1];
        const yesterday = history[history.length - 2];

        // Check which assets changed
        const changes = [];
        ['btc', 'gold', 'usdjpy', 'eurusd'].forEach(asset => {
            if (today[asset] !== yesterday[asset]) {
                changes.push(asset.toUpperCase());
            }
        });

        if (changes.length === 0) return 'All assets holding steady - regime stable';
        if (changes.length === 1) return `${changes[0]} leading the move - watch for other assets to confirm`;
        if (changes.length === 2) return `${changes.join(' and ')} shifting - partial confirmation`;
        return 'All assets moving - strong regime change signal';
    }

    getVolatilityDescription(history) {
        if (history.length < 3) return 'Insufficient data';

        // Count scenario changes in last 7 days
        const scenarios = history.map(h => h.scenarioId);
        const uniqueScenarios = new Set(scenarios);

        if (uniqueScenarios.size === 1) return 'Very stable - same scenario throughout';
        if (uniqueScenarios.size === 2) return 'Moderate - one transition occurred';
        if (uniqueScenarios.size >= 3) return 'High - multiple regime changes';
        
        return 'Normal market conditions';
    }

    checkTransitions(currentMatch) {
        const transitionSection = document.getElementById('transitionSection');
        const transitionAlert = document.getElementById('transitionAlert');

        // Check if current match is a transitional scenario (11 or 12)
        if (currentMatch.scenario.id === 11 || currentMatch.scenario.id === 12) {
            const possibleNext = this.getPossibleTransitions(currentMatch.scenario.id);
            
            transitionSection.style.display = 'block';
            transitionAlert.innerHTML = `
                <p><strong>The market is in a transitional state.</strong> This means signals are mixed and the next clear regime is forming. Based on current signals, watch for these possibilities:</p>
                <div class="transition-scenarios">
                    ${possibleNext.map(scenario => `
                        <div class="transition-item">
                            <strong>Scenario ${scenario.id}: ${scenario.name}</strong><br>
                            <span style="color: var(--text-muted); font-size: 0.9rem;">
                                Watch for: ${this.getTransitionSignals(scenario)}
                            </span>
                        </div>
                    `).join('')}
                </div>
                <p style="margin-top: 1rem; color: var(--text-muted);">
                    <strong>Recommendation:</strong> Use small position sizes (30% max) or wait for clear alignment before committing capital.
                </p>
            `;
        } else {
            transitionSection.style.display = 'none';
        }
    }

    getPossibleTransitions(currentId) {
        // From Scenario 11 (Gold + BTC rising)
        if (currentId === 11) {
            return [
                SCENARIOS.find(s => s.id === 2), // Protection buying if BTC fails
                SCENARIOS.find(s => s.id === 7), // Reflation if both continue
                SCENARIOS.find(s => s.id === 3), // Risk-on if gold fails
            ];
        }
        
        // From Scenario 12 (BTC up + UJ down + Gold up)
        if (currentId === 12) {
            return [
                SCENARIOS.find(s => s.id === 6), // Carry unwind if BTC fails
                SCENARIOS.find(s => s.id === 3), // Risk-on if gold/UJ reverse
                SCENARIOS.find(s => s.id === 2), // Protection if BTC fails
            ];
        }

        return [];
    }

    getTransitionSignals(scenario) {
        const mustHave = Object.entries(scenario.mustHave).map(([asset, direction]) => {
            const dir = Array.isArray(direction) ? direction.join('/') : direction;
            return `${asset.toUpperCase()} ${dir}`;
        }).join(', ');
        return mustHave;
    }

    saveToHistory(input, match) {
        const entry = {
            date: new Date().toISOString().split('T')[0],
            timestamp: Date.now(),
            ...input,
            scenarioId: match.scenario.id,
            scenarioName: match.scenario.name,
            confidence: match.percentage
        };

        // Remove entry for today if it exists (allow updates)
        this.history = this.history.filter(h => h.date !== entry.date);

        // Add new entry
        this.history.push(entry);

        // Keep only last 30 days
        if (this.history.length > 30) {
            this.history = this.history.slice(-30);
        }

        // Save to localStorage
        localStorage.setItem('capitalFlowHistory', JSON.stringify(this.history));

        // Update display
        this.displayHistory();
    }

    loadHistory() {
        const stored = localStorage.getItem('capitalFlowHistory');
        return stored ? JSON.parse(stored) : [];
    }

    displayHistory() {
        const container = document.getElementById('historyContainer');

        if (this.history.length === 0) {
            container.innerHTML = '<div class="history-empty">No history yet. Start analyzing to build your 30-day tracking.</div>';
            return;
        }

        // Sort by date descending
        const sorted = [...this.history].sort((a, b) => b.timestamp - a.timestamp);

        container.innerHTML = sorted.map(entry => {
            const date = new Date(entry.date);
            const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            const getSignal = (value) => {
                if (value === 'up') return '↑';
                if (value === 'down') return '↓';
                return '→';
            };

            const getSignalClass = (value) => {
                if (value === 'up') return 'signal-up';
                if (value === 'down') return 'signal-down';
                return 'signal-flat';
            };

            return `
                <div class="history-item">
                    <div class="history-date">${formattedDate}</div>
                    <div class="history-data">
                        <span class="history-asset ${getSignalClass(entry.btc)}">BTC ${getSignal(entry.btc)}</span>
                        <span class="history-asset ${getSignalClass(entry.gold)}">Gold ${getSignal(entry.gold)}</span>
                        <span class="history-asset ${getSignalClass(entry.usdjpy)}">UJ ${getSignal(entry.usdjpy)}</span>
                        <span class="history-asset ${getSignalClass(entry.eurusd)}">EU ${getSignal(entry.eurusd)}</span>
                    </div>
                    <div class="history-scenario">
                        Scenario ${entry.scenarioId}: ${entry.scenarioName} (${entry.confidence}%)
                    </div>
                </div>
            `;
        }).join('');
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
            this.history = [];
            localStorage.removeItem('capitalFlowHistory');
            this.displayHistory();
            document.getElementById('resultsContainer').style.display = 'none';
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CapitalFlowApp();
});
