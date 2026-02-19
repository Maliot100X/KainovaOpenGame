@echo off
REM Git Push Script for Windows
REM Run this to push KAINOVA Mini-App to GitHub

cd /d "C:\Users\PC\Desktop\fullmanus"

echo 🚀 Pushing KAINOVA Mini-App to GitHub...

REM Initialize git if not already done
if not exist ".git\" (
    echo 📦 Initializing git repository...
    git init
)

REM Configure git (update with your info)
git config user.name "Maliot100X"
git config user.email "your-email@example.com"

REM Add all files
echo ➕ Adding all files...
git add .

REM Commit
echo 💾 Committing...
git commit -m "🚀 Initial commit: KAINOVA Agent Grid Mini-App v1.0"

REM Add remote
echo 🔗 Adding remote repository...
git remote add origin https://github.com/Maliot100X/KainovaOpenGame.git 2>nul

REM Push to main
echo 📤 Pushing to GitHub...
git branch -M main
git push -u origin main --force

echo ✅ Done! Check: https://github.com/Maliot100X/KainovaOpenGame
pause
