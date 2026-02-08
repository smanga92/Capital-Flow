// All 12 scenarios with matching logic and trade suggestions
const SCENARIOS = [
    {
        id: 1,
        name: "Money Hiding in Dollars (Safety/Funding)",
        mustHave: { btc: 'down', usdjpy: 'up', eurusd: 'down' },
        confluence: { gold: ['up', 'flat'] },
        description: "Money is running to safety. People are getting nervous, pulling out of risky stuff and parking cash in dollars. Liquidity is drying up.",
        detailedExplanation: `<strong>What's Actually Happening:</strong><br>
Money is running to safety. People are getting nervous, so they're pulling out of risky stuff (BTC falling) and parking their cash in dollars. The dollar is getting stronger against other currencies (EU falling, UJ rising). Liquidity is drying up - there's less money floating around willing to take risks.<br><br>

<strong>When Gold Confluence is Missing or Opposite:</strong><br>
<em>If Gold is falling (↓):</em> This actually makes the dollar move even cleaner. People aren't even buying protection - they just want pure dollar safety. This is extremely clear directional flow. Trade this harder with more confidence.<br><br>
<em>If Gold is rising strongly (↑↑):</em> Mixed signal. Dollar is strong BUT people are also loading up on insurance (gold). Something feels unstable - maybe there's worry about inflation or currency problems on top of the risk-off move. Still tradeable, but reduce your position size and don't hold as long. The market is scared in multiple ways, which can lead to sudden reversals.<br><br>

<strong>Position Sizing & Management:</strong><br>
Use wider stops than normal because this trend can run for days or even weeks. Don't try to pick the bottom or top - just ride the wave. The core trades are: short BTC, buy USDJPY, sell EURUSD. Gold is optional depending on if it's rising.`,
        holdTime: "Hold (days to weeks)",
        riskLevel: "LOW-MODERATE",
        trades: {
            btc: {
                action: "SELL/SHORT",
                type: "sell",
                details: "Clean trade. BTC falling because liquidity drying up. Use normal to wider stops.",
                risk: "Clean trade - one of the best BTC shorts"
            },
            gold: {
                action: "BUY (if rising) or STAY OUT",
                type: "buy",
                details: "If gold rising, buy as safety play. If flat/falling, stay out - dollar trade is cleaner.",
                risk: "Optional - only if confluence present"
            },
            usdjpy: {
                action: "BUY",
                type: "buy",
                details: "Clean trade. Dollar strengthening against yen. Use normal stops.",
                risk: "Clean trade with good risk/reward"
            },
            eurusd: {
                action: "SELL",
                type: "sell",
                details: "Clean trade. Dollar strengthening against euro. Use normal stops.",
                risk: "Clean trade with good risk/reward"
            }
        },
        keyPoints: [
            "Use wider stops - trend can run for days/weeks",
            "Core trades: Short BTC, Buy USDJPY, Sell EURUSD",
            "Gold optional depending on if it's rising",
            "Exit when BTC stabilizes or EU stops falling"
        ]
    },
    {
        id: 2,
        name: "Buying Insurance (Gold/Protection)",
        mustHave: { gold: 'up' },
        confluence: { btc: 'down', usdjpy: ['up', 'down', 'flat'], eurusd: ['up', 'flat'] },
        description: "People buying protection - worried about inflation, currency problems, or just wanting insurance. Gold is the main signal.",
        holdTime: "Short-term (1-3 days)",
        riskLevel: "MODERATE",
        trades: {
            btc: {
                action: "SELL/SHORT (if falling) or STAY OUT",
                type: "sell",
                details: "If BTC falling, can short with tighter stops. If stable/rising, stay out - mixed signal.",
                risk: "Moderate - use tighter stops than Scenario 1"
            },
            gold: {
                action: "BUY (short-term)",
                type: "buy",
                details: "Main trade. Buy gold but take profits FAST. Don't hold for weeks. Take 50-70% off within 1-3 days.",
                risk: "Main trade but short-lived - protection spikes are brief"
            },
            usdjpy: {
                action: "STAY OUT",
                type: "avoid",
                details: "Too uncertain - can go either way. No clear trade here.",
                risk: "Too risky and unclear - avoid completely"
            },
            eurusd: {
                action: "STAY OUT or SMALL BUY (very risky)",
                type: "hold",
                details: "If EU rising, could buy very small (30% size) with tight stops. Most should stay out.",
                risk: "Very risky - most traders should avoid"
            }
        },
        keyPoints: [
            "Main trade is buying gold SHORT-TERM",
            "Take profits within 2-3 days max",
            "Everything else is risky or should be avoided",
            "Exit when gold stops rising or risk assets recover"
        ]
    },
    {
        id: 3,
        name: "Money Taking Risks (Risk-On)",
        mustHave: { btc: 'up', gold: ['down', 'flat'], eurusd: ['down', 'flat'] },
        confluence: { usdjpy: ['down', 'flat'] },
        description: "Money flowing into risky bets. People feeling confident. Liquidity opening up - more money available and people willing to put it to work.",
        holdTime: "Hold with caution (days)",
        riskLevel: "MODERATE",
        trades: {
            btc: {
                action: "BUY",
                type: "buy",
                details: "Main trade. Buy BTC with confidence when clean. Start 50% position, add if holds 2-3 days.",
                risk: "Main trade - but watch gold closely for fake signals"
            },
            gold: {
                action: "SELL/SHORT or STAY OUT (risky)",
                type: "sell",
                details: "Could short gold but risky - doesn't always drop cleanly. Most should stay out.",
                risk: "Weakest trade in this scenario - use very tight stops if trading"
            },
            usdjpy: {
                action: "SELL or STAY OUT (optional)",
                type: "sell",
                details: "If UJ falling, can sell USDJPY. Optional - not required. If stable, stay out.",
                risk: "Optional trade - moderate risk, only if clearly falling"
            },
            eurusd: {
                action: "SELL/SHORT or STAY OUT",
                type: "sell",
                details: "If EU falling, can sell EURUSD. Watch if EU rises - might be Scenario 5 instead.",
                risk: "Moderate - stay flexible, watch for scenario shift"
            }
        },
        keyPoints: [
            "Main trade is buying BTC",
            "CRITICAL: If gold refuses to drop or rises - TIGHTEN STOPS",
            "Real risk-on has falling gold - if gold rising, it's fake",
            "Exit when BTC rolls over or gold starts rising"
        ]
    },
    {
        id: 4,
        name: "Currency Rotation (FX Flow)",
        mustHave: { eurusd: 'up' },
        confluence: { btc: ['up', 'flat'], gold: ['down', 'flat'], usdjpy: ['down', 'flat'] },
        description: "Money rotating out of dollars into other currencies. Not full risk-on - more technical. Dollar giving back gains or other economies looking better.",
        holdTime: "Short-term (3-7 days)",
        riskLevel: "MODERATE-HIGH",
        trades: {
            btc: {
                action: "BUY or STAY OUT (optional)",
                type: "buy",
                details: "If BTC rising/stable, can buy small as 'rotation backed by risk appetite.' If falling, stay out.",
                risk: "NOT a strong BTC trade - use tight stops"
            },
            gold: {
                action: "STAY OUT",
                type: "avoid",
                details: "No clear gold trade. Don't try to short just because it's flat - you'll get chopped.",
                risk: "Avoid completely in currency rotations"
            },
            usdjpy: {
                action: "SELL or STAY OUT (optional)",
                type: "sell",
                details: "If UJ falling, can sell as dollar weakens. Secondary to EU trade. Exit within 3-5 days.",
                risk: "Optional - tight stops, secondary trade"
            },
            eurusd: {
                action: "BUY",
                type: "buy",
                details: "Main trade. Buy EURUSD (euro strengthening). Take partial profits every 1-2 days.",
                risk: "Cleanest trade - but don't hold more than a week"
            }
        },
        keyPoints: [
            "Main trade is buying EURUSD for 3-7 days",
            "WARNING: If BTC falling hard, exit EU faster - rotation isn't backed by risk appetite",
            "Take partial profits every 1-2 days",
            "Exit when EUR stops rising or dollar strength resumes"
        ]
    },
    {
        id: 5,
        name: "Dollar Strength + Risk Appetite (Goldilocks)",
        mustHave: { btc: 'up', gold: 'down', usdjpy: 'up' },
        confluence: { eurusd: ['down', 'flat'] },
        description: "Rare but powerful. Dollar strong NOT from fear but from actual growth. U.S. yields attractive, growth strong. Both dollar AND risk assets rising together.",
        holdTime: "Hold after confirm (weeks)",
        riskLevel: "LOW-MODERATE",
        trades: {
            btc: {
                action: "BUY (after 2-3 day confirmation)",
                type: "buy",
                details: "Wait for 2-3 days confirmation first. Once confirmed, can hold with wider stops for weeks.",
                risk: "Clean trade once confirmed - don't jump in too early"
            },
            gold: {
                action: "SELL/SHORT or STAY OUT (risky)",
                type: "sell",
                details: "Could short but risky. Main signal from gold is just that it's NOT rising.",
                risk: "Risky - most should stay out, tight stops if trading"
            },
            usdjpy: {
                action: "BUY (after confirmation)",
                type: "buy",
                details: "Buy USDJPY with confidence after 2-3 days. Dollar strength from yield advantage. Can hold weeks.",
                risk: "Clean trade after confirmation - wider stops"
            },
            eurusd: {
                action: "SELL or STAY OUT (flexible)",
                type: "sell",
                details: "If EU falling, can sell. If EU rising, might mean global growth - even better. Be flexible.",
                risk: "Flexible - watch which narrative plays out"
            }
        },
        keyPoints: [
            "DON'T jump in immediately - confirm over 2-3 days",
            "Main trades: BUY BTC, BUY USDJPY",
            "Special note: If EU also rising = global growth (very rare, very good)",
            "Exit when BTC stops rising or gold starts rising"
        ]
    },
    {
        id: 6,
        name: "Carry Unwind / JPY Strength (Funding Stress)",
        mustHave: { btc: 'down', usdjpy: 'down' },
        confluence: { gold: 'up', eurusd: ['up', 'flat'] },
        description: "Funding stress - people borrowed cheap yen to buy risky stuff, now unwinding fast. Yen getting strong, risk assets getting hit. Classic risk-off through funding channel.",
        holdTime: "Short-term (1-5 days)",
        riskLevel: "MODERATE",
        trades: {
            btc: {
                action: "SELL/SHORT",
                type: "sell",
                details: "Main trade. Short BTC with confidence when UJ also falling. Take profits within 1-3 days.",
                risk: "Clear trade - but moves are violent and short"
            },
            gold: {
                action: "BUY or STAY OUT (optional)",
                type: "buy",
                details: "If gold rising, can buy as protection joins carry unwind. Optional. Take profits within 2-3 days.",
                risk: "Optional - main trades are BTC and UJ"
            },
            usdjpy: {
                action: "SELL",
                type: "sell",
                details: "Main trade. Sell USDJPY (yen strengthening). THE signal of carry unwind. Take profits within 3-5 days max.",
                risk: "Main trade - use normal to slightly wider stops"
            },
            eurusd: {
                action: "BUY or STAY OUT (weak signal)",
                type: "buy",
                details: "If EU rising, can buy small. But weakest trade in scenario - main story is yen strength.",
                risk: "Weak trade - most should skip and focus on BTC/UJ"
            }
        },
        keyPoints: [
            "Main trades: SHORT BTC, SELL USDJPY",
            "CRITICAL: Exit ALL positions when UJ stabilizes - carry unwind done",
            "Usually 3-5 days max, sometimes 1-2 days",
            "These moves are violent but short - don't overstay"
        ]
    },
    {
        id: 7,
        name: "Inflation Worries / Reflation",
        mustHave: { gold: 'up' },
        confluence: { btc: 'up', usdjpy: ['up', 'flat'], eurusd: ['up', 'flat'] },
        description: "People worried about inflation or currency debasement. Buying 'real assets' - both gold (traditional) and BTC (alternative). Money printing concerns.",
        holdTime: "Hold after confirm (weeks)",
        riskLevel: "MODERATE",
        trades: {
            btc: {
                action: "BUY (after confirmation)",
                type: "buy",
                details: "Wait for 2-3 days of BOTH BTC and gold rising together. Once confirmed, can hold for weeks.",
                risk: "Important confluence - false starts common, wait for confirmation"
            },
            gold: {
                action: "BUY (after confirmation)",
                type: "buy",
                details: "Main trade. Start 30-40% position, add as BTC confirms over 2-3 days. Can hold for weeks once confirmed.",
                risk: "Main trade - but needs BTC confirmation to be real reflation"
            },
            usdjpy: {
                action: "BUY or STAY OUT (weak)",
                type: "hold",
                details: "Just confirms no carry stress. No strong directional trade. Most should stay out.",
                risk: "No real trade here - focus on BTC and gold"
            },
            eurusd: {
                action: "BUY or STAY OUT (weak)",
                type: "hold",
                details: "Could buy small as 'currency debasement' play. Not main story. Most should skip.",
                risk: "Optional and weak - focus on real assets instead"
            }
        },
        keyPoints: [
            "Wait for 2-3 days of BOTH gold AND BTC rising together",
            "Main trades: BUY Gold, BUY BTC",
            "Currencies optional and not the focus",
            "False starts are common - patience critical"
        ]
    },
    {
        id: 8,
        name: "Late-Stage Euphoria (Danger Zone)",
        mustHave: { btc: 'up', gold: 'down' },
        confluence: { usdjpy: 'up', eurusd: 'up' },
        description: "Everything flying except gold. BTC going parabolic. Feels amazing but usually late innings. When beginners pile in and get hurt. Market too greedy, too optimistic, too fast.",
        holdTime: "DO NOT HOLD",
        riskLevel: "EXTREME",
        trades: {
            btc: {
                action: "TAKE PROFITS or FADE (very risky to buy)",
                type: "sell",
                details: "If already long - TAKE PROFITS NOW (70-80%). If thinking about buying - DON'T. Better: wait for top and SHORT the reversal.",
                risk: "EXTREME risk to buy - wait for reversal instead"
            },
            gold: {
                action: "DO NOT SHORT",
                type: "avoid",
                details: "DO NOT short gold in euphoria. When reversal comes, gold will spike and crush you.",
                risk: "Dangerous trap - stay out completely"
            },
            usdjpy: {
                action: "TAKE PROFITS or STAY OUT",
                type: "hold",
                details: "If already long, take profits. If thinking about buying - don't, too late.",
                risk: "Too late to enter - take profits if in"
            },
            eurusd: {
                action: "TAKE PROFITS or STAY OUT",
                type: "hold",
                details: "If already short and it's falling, take profits. Too mixed otherwise, stay out.",
                risk: "Too late to enter - take profits if in"
            }
        },
        keyPoints: [
            "If already in from earlier - TAKE PROFITS immediately",
            "If not in - DON'T CHASE",
            "BEST STRATEGY: Wait for BTC to top, then SHORT the breakdown",
            "For experienced traders only - beginners should just watch"
        ]
    },
    {
        id: 9,
        name: "Range / Consolidation (Nothing Happening)",
        mustHave: { btc: 'flat', gold: 'flat' },
        confluence: { usdjpy: 'flat', eurusd: 'flat' },
        description: "Nothing happening. Market waiting for news, data, or event. Everyone on sidelines. Low volatility, tight ranges, boring price action.",
        holdTime: "NO TRADES",
        riskLevel: "EXTREME (if you force trades)",
        trades: {
            btc: {
                action: "STAY OUT",
                type: "avoid",
                details: "No directional trade. If must trade, only tiny scalps (1-2 hour holds). Most should avoid completely.",
                risk: "Will chop you up - patience pays, just wait"
            },
            gold: {
                action: "STAY OUT",
                type: "avoid",
                details: "Nothing to do here. Don't try to predict which way it breaks - just wait.",
                risk: "No trade - wait for actual movement"
            },
            usdjpy: {
                action: "STAY OUT",
                type: "avoid",
                details: "Even if moving a bit, if BTC/gold flat, it's just daily noise. Don't trade it.",
                risk: "No trade - wait for clear signals"
            },
            eurusd: {
                action: "STAY OUT",
                type: "avoid",
                details: "Same as UJ - any movement is just noise. Wait for all four assets to move together.",
                risk: "No trade - preserve capital and wait"
            }
        },
        keyPoints: [
            "DO NOTHING - this is a 'do nothing' scenario",
            "Use this time to review, study, prepare",
            "Exception: If one asset suddenly breaks out with conviction, watch closely",
            "Capital preservation > forcing trades that aren't there"
        ]
    },
    {
        id: 10,
        name: "Post-Stress Recovery (Early Re-Entry)",
        mustHave: { btc: 'up', eurusd: 'up' },
        confluence: { gold: ['up', 'flat'], usdjpy: ['down', 'flat'] },
        description: "Coming out of scary period. Gold peaked (people were scared, now calming). BTC and EUR recovering. Yen strength slowing. NOT full risk-on yet - stress easing phase.",
        holdTime: "Medium-term staged (weeks)",
        riskLevel: "MODERATE-HIGH",
        trades: {
            btc: {
                action: "BUY (staged entries)",
                type: "buy",
                details: "Start 30% when first seen. Wait 2-3 days. If holds, add 30%. Wait again. If solid, add final 30-40%.",
                risk: "Can fail - stage entries carefully, don't go all-in day one"
            },
            gold: {
                action: "STAY OUT or FADE (risky)",
                type: "avoid",
                details: "Should be flattening after rising. Could short as it rolls over but risky - most should stay out.",
                risk: "Risky - if recovery fails, gold spikes back up"
            },
            usdjpy: {
                action: "BUY or STAY OUT (optional)",
                type: "buy",
                details: "If stabilizing/starting to rise, could buy small. If still falling hard, don't trade - not confirmed.",
                risk: "Optional - use small size and tight stops"
            },
            eurusd: {
                action: "BUY (staged entries)",
                type: "buy",
                details: "Same as BTC: 30% → wait → 30% → wait → 30-40%. Build position as recovery proves itself.",
                risk: "Can fail - stage carefully, confirm before adding"
            }
        },
        keyPoints: [
            "DON'T go all-in at once - stage entries: 30% → 30% → 30-40%",
            "Main trades: BUY BTC, BUY EURUSD (staged)",
            "CRITICAL: If gold still rising strongly, DON'T enter - not confirmed",
            "Exit if gold starts rising again or BTC rolls over"
        ]
    },
    {
        id: 11,
        name: "Mixed Signals - Transition 1",
        mustHave: { gold: 'up' },
        confluence: { btc: 'up', usdjpy: ['up', 'flat'], eurusd: ['down', 'flat'] },
        description: "Confusing. Some people buying protection (gold) but others testing risk (BTC). Market in between - not fully scared, not fully confident. Trying to figure out what's next.",
        holdTime: "NO TRADES (or tiny scalps)",
        riskLevel: "VERY HIGH",
        trades: {
            btc: {
                action: "SMALL BUY or STAY OUT (very risky)",
                type: "buy",
                details: "Could take VERY SMALL long (30% size) betting risk wins. Very tight stops. Most should wait.",
                risk: "VERY HIGH - expect whipsaws, most should avoid"
            },
            gold: {
                action: "SMALL BUY or STAY OUT (risky)",
                type: "buy",
                details: "Could buy gold small (30% size) with tight stops. Better: wait to see which wins.",
                risk: "VERY HIGH - better to wait for resolution"
            },
            usdjpy: {
                action: "STAY OUT",
                type: "avoid",
                details: "Too unclear. No good USDJPY trade. Any move will get whipsawed.",
                risk: "No trade - wait for clarity"
            },
            eurusd: {
                action: "STAY OUT",
                type: "avoid",
                details: "Too unclear. Don't trade EURUSD in this mess.",
                risk: "No trade - wait for clarity"
            }
        },
        keyPoints: [
            "BEST APPROACH: Just wait - let market figure itself out",
            "If must trade: Pick ONE small position (30% size), tight stops",
            "Expect to get stopped out - transitions chop up traders",
            "Patience > forcing it - wait for signals to align clearly"
        ]
    },
    {
        id: 12,
        name: "Conflicted Signals - Transition 2",
        mustHave: { btc: 'up', usdjpy: 'down' },
        confluence: { gold: 'up', eurusd: ['up', 'flat'] },
        description: "Really confusing. Risk up (BTC) + carry unwinding (UJ down) + protection (gold up) all at once. Market arguing with itself. No clear winner. Chaos.",
        holdTime: "NO TRADES (or 1-4hr scalps)",
        riskLevel: "EXTREME",
        trades: {
            btc: {
                action: "TINY SCALPS ONLY or STAY OUT",
                type: "buy",
                details: "Could buy for 1-4 hour scalps only (20-30% size). Very tight stops. DO NOT hold overnight. Most should stay out.",
                risk: "EXTREME - only for experienced scalpers"
            },
            gold: {
                action: "TINY SCALPS ONLY or STAY OUT",
                type: "buy",
                details: "Could buy for 1-4 hour scalps (20-30% size). Tight stops. Most should stay out completely.",
                risk: "EXTREME - chaos, step aside"
            },
            usdjpy: {
                action: "SELL FOR SCALPS or STAY OUT",
                type: "sell",
                details: "Could sell for 1-4 hour scalps if experienced. But with BTC rising, might reverse any moment. Most avoid.",
                risk: "EXTREME - do not hold overnight"
            },
            eurusd: {
                action: "STAY OUT COMPLETELY",
                type: "avoid",
                details: "NO good EURUSD trade. Too many conflicting signals. Just avoid.",
                risk: "No trade - too much confusion"
            }
        },
        keyPoints: [
            "REALITY CHECK: Close your charts and come back later",
            "95% of traders should do NOTHING",
            "If you can't resist: Only 1-4hr scalps, 20-30% size, very tight stops",
            "One signal will eventually win - wait and trade THAT with conviction"
        ]
    }
];
