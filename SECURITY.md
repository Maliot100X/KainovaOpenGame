# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability within KAINOVA Agent Grid, please send an email to security@kainova.xyz. All security vulnerabilities will be promptly addressed.

Please do not open public issues for security vulnerabilities.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Measures

### Smart Contracts

- KNTWS token contract is verified on BaseScan
- All transactions require user signature
- Reward distribution uses secure wallet management
- No admin functions that can drain user funds

### API Security

- All API routes validate input
- Farcaster webhook signatures verified
- CORS configured for production domains only
- Rate limiting implemented

### Database Security

- Row Level Security (RLS) enabled
- Service role key only used server-side
- User data isolated by FID
- No sensitive data exposed in queries

### Environment Variables

- All secrets stored in environment variables
- No secrets committed to git (see .gitignore)
- Different keys for development and production
- Regular rotation recommended

## Best Practices

### For Developers

1. **Never commit secrets**
   - Use `.env.local` for local development
   - Add all `.env*` files to `.gitignore`
   - Use Vercel/GitHub secrets for deployment

2. **Validate all inputs**
   - Check FID exists and is valid
   - Validate wallet addresses
   - Sanitize all user input

3. **Secure wallet handling**
   - Never expose private keys client-side
   - Use server-side only for transactions
   - Implement proper key management

4. **Rate limiting**
   - Implement on API routes
   - Prevent spam and abuse
   - Monitor for suspicious activity

### For Users

1. **Verify URLs**
   - Only use official KAINOVA domains
   - Check for HTTPS
   - Verify manifest signature

2. **Wallet security**
   - Never share private keys
   - Use hardware wallets when possible
   - Verify transactions before signing

3. **Report issues**
   - Report suspicious activity
   - Contact support for help
   - Stay updated on security notices

## Vulnerability Disclosure

We follow responsible disclosure:

1. Report privately
2. We investigate and fix
3. We publicly disclose after fix
4. We credit reporters (if desired)

## Security Contacts

- Email: security@kainova.xyz
- Farcaster: @kainova

---

Last updated: 2025-02-19
