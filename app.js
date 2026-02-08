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
        
        // Auto-load today's analysis if it exists
        this.loadTodaysAnalysis();
        
        // Service worker registration for PWA
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').catch(() => {});
        }
    }

    loadTodaysAnalysis() {
        const today = new Date().toISOString().split('T')[0];
        const todaysEntry = this.history.find(h => h.date === today);
        
        if (todaysEntry) {
            // Populate the input fields
            document.getElementById('btc').value = todaysEntry.btc;
            document.getElementById('gold').value = todaysEntry.gold;
            document.getElementById('usdjpy').value = todaysEntry.usdjpy;
            document.getElementById('eurusd').value = todaysEntry.eurusd;
            
            // Re-run analysis to show results
            const input = {
                btc: todaysEntry.btc,
                gold: todaysEntry.gold,
                usdjpy: todaysEntry.usdjpy,
                eurusd: todaysEntry.eurusd
            };
            
            const matches = this.matchScenarios(input);
            this.displayResults(matches, input);
            this.checkTransitions(matches.bestMatch);
            
            // Show results container
            document.getElementById('resultsContainer').style.display = 'block';
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
            <button class="more-info-btn" onclick="app.toggleMoreInfo()">
                📖 More Info & Detailed Explanation
            </button>
            <div id="moreInfoContent" class="more-info-content">
                ${this.getDetailedExplanation(scenario)}
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

    getDetailedExplanation(scenario) {
        // Comprehensive explanations for each scenario
        const explanations = {
            1: `<h4>What's Actually Happening:</h4>
                <p>Money is running to safety. People are getting nervous, so they're pulling out of risky stuff (BTC falling) and parking their cash in dollars. The dollar is getting stronger against other currencies (EU falling, UJ rising). Liquidity is drying up - there's less money floating around willing to take risks.</p>
                
                <h4>When Gold Confluence is Missing:</h4>
                <p><strong>If Gold is falling (↓):</strong> This actually makes the dollar move even cleaner. People aren't even buying protection - they just want pure dollar safety. Trade this harder with more confidence.</p>
                <p><strong>If Gold is rising strongly (↑↑):</strong> Mixed signal. Dollar strong BUT people also buying insurance. Something feels unstable. Reduce position size and don't hold as long.</p>
                
                <h4>Position Management:</h4>
                <p>Use wider stops - this trend can run for days or weeks. Don't try to pick tops/bottoms. Core trades: short BTC, buy USDJPY, sell EURUSD. Gold optional if rising.</p>`,
            
            2: `<h4>What's Actually Happening:</h4>
                <p>People buying protection - worried about inflation, currency problems, or just wanting insurance. Gold is the main signal here.</p>
                
                <h4>When BTC Confluence is Missing:</h4>
                <p><strong>If BTC stable/rising:</strong> Gold rising alone might just be inflation worries, not full panic. Still tradeable but watch if BTC starts dropping - that confirms real fear.</p>
                <p><strong>If BTC rising strongly (↑↑):</strong> Strange - both protection AND risk assets rising. Could be early inflation concerns or confusion. Trade smaller.</p>
                
                <h4>Position Management:</h4>
                <p>Protection buying can reverse quickly when fear fades. Take profits FAST - don't overstay. Good for 1-3 day moves, not long holds. If you're up 2-3%, take at least half off.</p>`,
            
            3: `<h4>What's Actually Happening:</h4>
                <p>Money flowing into risky bets. People feeling confident and optimistic. Liquidity opening up - more money available and people willing to put it to work. BTC rising because people think things will get better.</p>
                
                <h4>When UJ Confluence is Missing:</h4>
                <p><strong>If UJ rising (↑):</strong> Risk up but dollar carry also strong. Could be U.S.-driven strength. Still tradeable but watch for mixed signals.</p>
                <p><strong>If UJ rising strongly (↑↑):</strong> Risk up but carry very strong. Could be late cycle where everything rises before reversal. Use tighter stops, take profits quicker.</p>
                
                <h4>CRITICAL - Watch Gold:</h4>
                <p><strong>If gold refuses to drop or starts rising:</strong> RED FLAG. Real risk-on should see gold falling. If gold rising alongside BTC, might be fake risk-on. Use much tighter stops.</p>
                
                <h4>Position Management:</h4>
                <p>Start smaller, add if trend confirms over 2-3 days. Tighter stops than dollar-safety trades. If gold acts weird, tighten even more. Exit when BTC flattens or gold rises.</p>`,
            
            4: `<h4>What's Actually Happening:</h4>
                <p>Money rotating out of dollars into other currencies. Not full risk-on - more technical. Dollar giving back gains or other economies looking relatively better.</p>
                
                <h4>When BTC Confluence is Missing:</h4>
                <p><strong>If BTC falling (↓):</strong> Just currency rotation, not real risk appetite. Tradeable but don't assume risk-on everywhere.</p>
                <p><strong>If BTC falling hard (↓↓):</strong> EUR strong but risk crushed = confusion or technical only. Ignore or trade very small.</p>
                
                <h4>Position Management:</h4>
                <p>Good for 3-7 day swings. Take partial profits every 1-2 days. If BTC doesn't support move, exit within 1-2 days instead of waiting a week. These rotations usually temporary corrections in longer dollar trends.</p>`,
            
            5: `<h4>What's Actually Happening:</h4>
                <p>Rare but powerful. Dollar strong NOT from fear but from actual growth. U.S. yields attractive, growth strong. Both dollar AND risk assets rising together. This is growth-driven dollar strength.</p>
                
                <h4>When EU Confluence is Missing:</h4>
                <p><strong>If EU rising (↑):</strong> Even better! Global growth, not just U.S. Trade bigger.</p>
                <p><strong>If EU rising strongly (↑↑):</strong> Mixed - if EUR strengthening a lot, maybe not pure U.S. strength. Watch which wins, reduce if confused.</p>
                
                <h4>Position Management:</h4>
                <p>DON'T jump in immediately. Confirm over 2-3 days. Once confirmed, can hold with wider stops for weeks. This is clean trend that can run. Exit when BTC stops rising or gold starts rising.</p>`,
            
            6: `<h4>What's Actually Happening:</h4>
                <p>Funding stress - people borrowed cheap yen to buy risky stuff, now unwinding fast. Yen getting strong (UJ falling), risk assets getting hit (BTC falling). Classic risk-off through funding channel.</p>
                
                <h4>When Gold Confluence is Missing:</h4>
                <p><strong>If gold flat/falling:</strong> Just carry unwind without broader fear. More technical, less scary. Still tradeable short-term but won't be as dramatic.</p>
                <p><strong>If gold falling hard (↓↓):</strong> Carry unwind but no protection buying = maybe just profit-taking. Trade lighter, shorter holds.</p>
                
                <h4>Position Management:</h4>
                <p>Carry unwinds are SHARP and FAST but short-lived. When UJ dropping + BTC dropping together, very clear. Take profits as it goes - don't wait for perfect exit. Usually 3-5 days max. Exit when UJ stabilizes.</p>`,
            
            7: `<h4>What's Actually Happening:</h4>
                <p>People worried about inflation or currency debasement. Buying 'real assets' - both gold (traditional) and BTC (alternative). Money printing concerns. Both hedge and risk rising together.</p>
                
                <h4>When BTC Confluence is Missing:</h4>
                <p><strong>If BTC flat/falling:</strong> Just gold = maybe defensive. Wait for BTC to confirm before calling it reflation.</p>
                <p><strong>If BTC falling hard (↓↓):</strong> Only gold up = fear, not reflation. Don't trade as reflation theme.</p>
                
                <h4>Position Management:</h4>
                <p>FALSE STARTS COMMON. Wait for 2-3 days of BOTH gold AND BTC rising together. Start 30-40%, add as confirms. Once confirmed, can be powerful multi-week trend. Exit when either stops rising.</p>`,
            
            8: `<h4>What's Actually Happening:</h4>
                <p>Everything flying except gold. BTC parabolic. Feels amazing but usually late innings. When beginners pile in and get hurt. Market too greedy, too optimistic, too fast.</p>
                
                <h4>WARNING:</h4>
                <p><strong>If already in from earlier:</strong> TAKE PROFITS NOW. 70-80% off the table.</p>
                <p><strong>If thinking about buying:</strong> DON'T. You're chasing euphoria.</p>
                
                <h4>Better Strategy:</h4>
                <p>WAIT for BTC to top and start falling. THEN short the breakdown. Much safer than trying to ride last 5% of parabolic move. Risk-reward of buying into euphoria is TERRIBLE.</p>
                
                <h4>Position Management:</h4>
                <p>For experienced traders only. If you must trade it, tiny size with very tight trailing stops. Better: just wait for reversal and trade that with conviction.</p>`,
            
            9: `<h4>What's Actually Happening:</h4>
                <p>Nothing happening. Market waiting - maybe for news, data, or event. Everyone on sidelines. Low volatility, tight ranges, boring price action.</p>
                
                <h4>What To Do:</h4>
                <p><strong>DO NOTHING.</strong> Ranges chop up impatient traders. Don't force trades that aren't there.</p>
                
                <h4>Exception:</h4>
                <p><strong>If one asset suddenly breaks out with conviction:</strong> Don't trade immediately, but get ready. That asset might be catching early signal of next regime. Wait for others to confirm, THEN trade.</p>
                
                <h4>Use This Time:</h4>
                <p>Review trading plan, study previous trades, prepare watchlist. Patience here saves money and keeps capital ready for next clear opportunity. Best traders know when NOT to trade.</p>`,
            
            10: `<h4>What's Actually Happening:</h4>
                <p>Coming out of scary period. Gold peaked (people were scared, now calming). BTC and EUR recovering. Yen strength slowing. NOT full risk-on yet - stress easing phase. Early recovery.</p>
                
                <h4>When Gold Confluence is Missing:</h4>
                <p><strong>If gold still rising strongly (↑↑):</strong> Recovery NOT confirmed. People still scared. Wait longer.</p>
                <p><strong>If UJ still falling hard (↓↓):</strong> Carry still unwinding = not stable. Trade smaller, might be fake recovery.</p>
                
                <h4>Position Management:</h4>
                <p>STAGED ENTRIES critical. Enter 30% when first seen. Wait 2-3 days. If holds, add 30%. Wait again. If solid, add final 30-40%. This catches early move but protects against fake recoveries. Exit if gold starts rising again or BTC rolls over.</p>`,
            
            11: `<h4>What's Actually Happening:</h4>
                <p>Confusing. Some buying protection (gold) but others testing risk (BTC). Market in between - not fully scared, not fully confident. Trying to figure out what's next. Transition phase.</p>
                
                <h4>What To Do:</h4>
                <p><strong>BEST APPROACH: Just wait.</strong> Let market figure itself out. Signals will eventually clear up - either into clean risk-on, clean risk-off, or something else. THEN trade with conviction.</p>
                
                <h4>If You Absolutely Must Trade:</h4>
                <p>Pick ONE small position (30% size): either small long BTC OR small long gold, not both. Very tight stops. Expect to be wrong 50% of time. Better to preserve capital and wait.</p>
                
                <h4>Reality:</h4>
                <p>Transitions chop up even experienced traders. Patience better than forcing it. This is 'watch and wait' scenario for most traders.</p>`,
            
            12: `<h4>What's Actually Happening:</h4>
                <p>REALLY confusing. Risk up (BTC) + carry unwinding (UJ down) + protection (gold up) all at once. Market arguing with itself. No clear winner. Chaos.</p>
                
                <h4>REALITY CHECK:</h4>
                <p><strong>Close your charts and come back in 4-8 hours or next day.</strong> One signal will eventually win - either risk-on dominates (BTC wins, gold/UJ reverse) or risk-off takes over (gold/UJ win, BTC rolls). Let that play out. THEN trade the clear winner.</p>
                
                <h4>If You Can't Resist:</h4>
                <p>Only 1-4 hour scalps. 20-30% size. Very tight stops. DO NOT hold overnight. You'll probably get stopped out 2-4 times before giving up. Expensive tuition to learn "don't trade chaos."</p>
                
                <h4>For 95% of Traders:</h4>
                <p>DO NOTHING. Preserve capital. Wait for clarity. Sometimes best trade is no trade. This is definitely one of those times.</p>`
        };

        return explanations[scenario.id] || '<p>Detailed explanation coming soon...</p>';
    }

    toggleMoreInfo() {
        const content = document.getElementById('moreInfoContent');
        const btn = document.querySelector('.more-info-btn');
        
        if (content.classList.contains('show')) {
            content.classList.remove('show');
            btn.textContent = '📖 More Info & Detailed Explanation';
        } else {
            content.classList.add('show');
            btn.textContent = '📕 Hide Detailed Explanation';
            // Scroll to show the expanded content
            setTimeout(() => {
                content.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
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
