# Capital Flow Tracker - PWA

A Progressive Web App for tracking and analyzing capital flow scenarios in financial markets.

## Features

- 📊 **Daily Market Analysis** - Input 4 asset directions, get instant scenario matching
- 🎯 **12 Trading Scenarios** - Complete framework from your trading guide
- 💼 **Specific Trade Suggestions** - Detailed recommendations for BTC, Gold, USDJPY, EURUSD
- 📈 **30-Day History Tracking** - Automatic rolling history with regime context
- 🔄 **Transition Detection** - Alerts when market is shifting between regimes
- 📱 **Works Offline** - PWA that installs on your phone/desktop
- 💾 **Local Storage** - All data stored in your browser, completely private

## Deployment to Netlify

### Option 1: Drag & Drop (Easiest)

1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag the entire `capital-flow-app` folder onto the page
3. Done! Your app is live

### Option 2: Git Deploy (Recommended for updates)

1. Create a new repository on GitHub
2. Push this folder to the repository:
   ```bash
   cd capital-flow-app
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```
3. Go to [Netlify](https://app.netlify.com/)
4. Click "Add new site" → "Import an existing project"
5. Connect your GitHub repo
6. Deploy settings:
   - Build command: (leave empty)
   - Publish directory: `/`
7. Click "Deploy site"

### Option 3: Netlify CLI

```bash
npm install -g netlify-cli
cd capital-flow-app
netlify deploy --prod
```

## How to Use

1. **Open the app** (on your phone or desktop)
2. **Input today's market reading**:
   - BTC: ↑ Rising / ↓ Falling / → Flat
   - Gold: ↑ Rising / ↓ Falling / → Flat  
   - USDJPY: ↑ Rising / ↓ Falling / → Flat
   - EURUSD: ↑ Rising / ↓ Falling / → Flat
3. **Click "Analyze Market"**
4. **Review the results**:
   - Current scenario match with confidence %
   - Trade suggestions for each asset
   - Regime context (how many days in this scenario)
   - Transition alerts if applicable
5. **Check 30-day history** to see patterns

## Installing as PWA

### On iPhone/iPad:
1. Open in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"
4. Tap "Add"

### On Android:
1. Open in Chrome
2. Tap the menu (3 dots)
3. Tap "Add to Home screen"
4. Tap "Add"

### On Desktop (Chrome/Edge):
1. Look for the install icon in the address bar
2. Click "Install"

## Data Privacy

All data is stored locally in your browser. Nothing is sent to any server. Your trading data stays 100% private on your device.

## Files Structure

```
capital-flow-app/
├── index.html          # Main HTML structure
├── styles.css          # Modern dark theme styling
├── app.js             # Application logic & history management
├── scenarios.js       # All 12 scenarios with matching logic
├── manifest.json      # PWA manifest
├── sw.js             # Service worker for offline functionality
└── README.md         # This file
```

## Features in Detail

### Scenario Matching
- Scores each scenario based on must-have and confluence signals
- Shows confidence percentage (80%+ = high confidence)
- Displays alternative matches if signals are mixed

### Trade Suggestions
- Buy/Sell/Hold/Avoid for each of the 4 assets
- Risk level and detailed reasoning
- Staging guidance for entries

### Regime Context
- Tracks consecutive days in current scenario
- Shows previous regime for context
- Lead/lag analysis (which assets are moving first)
- Volatility assessment

### Transition Detection
- Automatically detects Scenarios 11 & 12 (transitional states)
- Suggests possible next scenarios
- Recommends reduced position sizing

## Support

This app is based on your Capital Flow Trading Guide and implements all 12 scenarios with the exact logic and trade suggestions from the guide.

For best results:
- Input data daily (morning routine)
- Build at least 5-7 days of history for context
- Use staging entries when confidence is <80%
- Pay attention to lead/lag signals

## Updates

The app caches for offline use. To get updates:
- Clear browser cache
- Or reinstall the PWA

---

Built with ❤️ for systematic capital flow trading
