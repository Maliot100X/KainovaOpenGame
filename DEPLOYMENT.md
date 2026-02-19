# KAINOVA Mini-App Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables
Make sure all these are set in your hosting platform (Vercel):

```env
# Required
NEXT_PUBLIC_URL=https://your-domain.vercel.app
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_ONCHAINKIT_API_KEY=

# Optional
NEYNAR_API_KEY=
KNTWS_REWARD_WALLET_PRIVATE_KEY=
WEBHOOK_SECRET=
```

### 2. Supabase Setup

1. Create new Supabase project
2. Run the schema from `supabase/schema.sql`
3. Copy Project URL and API keys
4. Set Row Level Security policies (already in schema)

### 3. Farcaster Manifest

1. Deploy your app to get a public URL
2. Go to: `https://farcaster.xyz/~/developers/mini-apps/manifest`
3. Enter your domain
4. Click "Verify" and follow instructions
5. Copy the `accountAssociation` JSON
6. Update `src/app/.well-known/farcaster.json`:
   ```json
   {
     "accountAssociation": {
       "header": "...",
       "payload": "...",
       "signature": "..."
     },
     ...
   }
   ```
7. Redeploy

### 4. Base OnchainKit

1. Go to: `https://portal.cdp.coinbase.com/projects`
2. Create new project
3. Copy API key
4. Add to environment variables

### 5. Neynar (Optional)

1. Sign up at: `https://neynar.com`
2. Create API key
3. Copy to environment variables

## Deploy to Vercel

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Option 2: GitHub Integration

1. Push code to GitHub
2. Go to: `https://vercel.com/new`
3. Import your GitHub repository
4. Add environment variables
5. Deploy

### Option 3: Vercel Dashboard

1. Go to: `https://vercel.com/dashboard`
2. Click "Add New Project"
3. Import GitHub repository
4. Configure:
   - Framework: Next.js
   - Build Command: `next build`
   - Output Directory: `.next`
5. Add environment variables
6. Deploy

## Custom Domain (Optional)

1. In Vercel dashboard, go to Project Settings → Domains
2. Add your domain (e.g., `app.kainova.xyz`)
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_URL` with new domain
5. Update Farcaster manifest with new domain
6. Redeploy

## Testing

### Local Testing

```bash
# Start dev server
npm run dev

# Test in browser
open http://localhost:3000
```

### Production Testing

1. Use ngrok for local testing with Farcaster:
   ```bash
   npx ngrok http 3000
   ```

2. Test in Farcaster Preview:
   ```
   https://farcaster.xyz/~/developers/mini-apps/preview
   ```

3. Check all tabs work
4. Verify wallet connection
5. Test task completion
6. Verify token rewards

## Post-Deployment

### 1. Verify Manifest

```bash
curl https://your-domain.vercel.app/.well-known/farcaster.json
```

Should return valid JSON with `accountAssociation`.

### 2. Test Webhooks

Check that webhooks are being received in Supabase logs.

### 3. Monitor

- Check Vercel Analytics
- Monitor Supabase logs
- Watch for errors in browser console

### 4. Announce

Share on:
- Farcaster
- Twitter/X
- Telegram
- Discord

Include:
- App URL
- Brief description
- Screenshot/GIF
- Call to action

## Troubleshooting

### Common Issues

**Build fails**
- Check Node.js version (need 22.11.0+)
- Check all dependencies installed
- Check environment variables set

**Manifest not found**
- Ensure file at `src/app/.well-known/farcaster.json`
- Check Vercel rewrites in `vercel.json`
- Verify file deployed

**SDK not working**
- Check Farcaster Developer Mode enabled
- Test in actual Farcaster client
- Check browser console for errors

**Database errors**
- Verify Supabase URL and keys
- Check schema applied correctly
- Check RLS policies

## Support

Need help? Create an issue on GitHub or reach out on Farcaster.

## Quick Reference

| Task | URL/Command |
|------|-------------|
| Vercel Dashboard | https://vercel.com/dashboard |
| Supabase Dashboard | https://app.supabase.com |
| Farcaster Manifest | https://farcaster.xyz/~/developers/mini-apps/manifest |
| Preview Tool | https://farcaster.xyz/~/developers/mini-apps/preview |
| Base OnchainKit | https://portal.cdp.coinbase.com |
| Deploy | `vercel --prod` |

---

**You're now ready to deploy! 🚀**
