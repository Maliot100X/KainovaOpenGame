#!/bin/bash
# Git Push Script for KAINOVA Mini-App
# Run this script to push to GitHub

cd "C:\Users\PC\Desktop\fullmanus" || exit 1

echo "🚀 Pushing KAINOVA Mini-App to GitHub..."

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
fi

# Configure git (update with your info)
git config user.name "Maliot100X"
git config user.email "your-email@example.com"

# Add all files
echo "➕ Adding all files..."
git add .

# Commit
echo "💾 Committing..."
git commit -m "🚀 Initial commit: KAINOVA Agent Grid Mini-App v1.0

Complete Farcaster Mini-App with:
- 5-tab interface (Home, Tasks, Leaderboard, Redeem, Profile)
- KNTWS token integration on Base
- Task system with real rewards
- Epic redemption tiers (Bronze to Diamond)
- Global leaderboard with medals
- Supabase database integration
- Farcaster & Base SDKs
- Framer Motion animations
- Production-ready deployment config

Features:
✅ Daily check-ins with streak bonuses
✅ 10+ task types (Daily, Agent, Social, Special)
✅ Real-time KNTWS balance tracking
✅ 5-tier redemption system with multipliers
✅ Achievement system
✅ Webhook notifications
✅ Responsive mobile design

Built with: Next.js 15, TypeScript, Tailwind CSS, Farcaster SDK, Base OnchainKit"

# Add remote
echo "🔗 Adding remote repository..."
git remote add origin https://github.com/Maliot100X/KainovaOpenGame.git 2>/dev/null || true

# Push to main
echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main --force

echo "✅ Done! Check: https://github.com/Maliot100X/KainovaOpenGame"
