# Email Verification Implementation Plan

**Status:** 📋 Planned for Future Implementation  
**Priority:** Medium  
**Estimated Time:** 2 hours

---

## 🎯 Goal

Implement double opt-in email verification for newsletter signups to ensure only valid, accessible email addresses are added to the subscriber list.

---

## 🛠️ Tech Stack (Decided)

- **Email Service:** Resend (3,000 emails/month free)
- **Database:** Supabase (Free tier)
- **Framework:** Next.js API Routes

---

## 📋 Implementation Checklist

### 1. Setup Services
- [ ] Create Resend account
- [ ] Get Resend API key
- [ ] Create Supabase project
- [ ] Get Supabase connection details
- [ ] Add environment variables to `.env.local`

### 2. Database Schema
- [ ] Create `newsletter_subscribers` table in Supabase
  - `id` (UUID, primary key)
  - `email` (string, unique)
  - `verification_token` (string, unique)
  - `verified` (boolean, default: false)
  - `created_at` (timestamp)
  - `verified_at` (timestamp, nullable)

### 3. API Routes
- [ ] Create `/api/newsletter/subscribe` endpoint
  - Validate email format
  - Generate unique verification token
  - Store in database (verified: false)
  - Send verification email via Resend
  - Return success message
- [ ] Create `/api/newsletter/verify` endpoint
  - Accept token from URL
  - Find subscriber by token
  - Update verified status to true
  - Send welcome email
  - Redirect to success page
- [ ] Create `/api/newsletter/resend-verification` endpoint (optional)
  - Allow users to request new verification email

### 4. Email Templates
- [ ] Create verification email template
  - Subject: "Confirm your subscription to ConU Planner"
  - Body: Welcome message + verification link
  - CTA button: "Confirm Subscription"
- [ ] Create welcome email template
  - Subject: "Welcome to ConU Planner!"
  - Body: Thank you message + what's next
  - Links to key features

### 5. Frontend Updates
- [ ] Update `NewsletterSignup.jsx`
  - Add better email validation (regex)
  - Show "Check your email" state after submission
  - Add loading state during API call
  - Show error messages if submission fails
- [ ] Create verification success page
  - `/newsletter/verified` route
  - Show success message
  - Provide next steps

### 6. Testing
- [ ] Test email submission flow
- [ ] Test verification link click
- [ ] Test welcome email delivery
- [ ] Test error cases (invalid email, expired token, etc.)
- [ ] Test resend verification flow

---

## 📧 Email Flow

1. User enters email in newsletter form
2. Frontend validates email format
3. API creates pending subscriber with token
4. Verification email sent via Resend
5. User clicks verification link
6. API verifies token and updates status
7. Welcome email sent
8. User redirected to success page

---

## 🔐 Environment Variables Needed

```env
# Resend
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxxxxxxxxxx
```

---

## 💰 Cost

- **Resend:** FREE (up to 3,000 emails/month)
- **Supabase:** FREE (up to 500MB storage)
- **Total:** $0/month

---

## 📝 Notes

- Verification links should expire after 24 hours
- Store only verified emails in active subscriber list
- **CRITICAL: Add unsubscribe functionality (legally required)**
- GDPR compliance: Add privacy policy link in emails
- Track email open rates and click rates in Resend dashboard

---

## 🚫 Unsubscribe Feature (LEGALLY REQUIRED)

### Database Updates
- [ ] Add `unsubscribed` column to `newsletter_subscribers` table (boolean, default: false)
- [ ] Add `unsubscribed_at` column (timestamp, nullable)

### API Routes
- [ ] Create `/api/newsletter/unsubscribe` endpoint
  - Accept email or token from URL
  - Update `unsubscribed` status to true
  - Send confirmation email
  - Redirect to unsubscribe confirmation page

### Email Template Updates
- [ ] Add unsubscribe link to ALL email footers
  - Format: "Don't want these updates? [Unsubscribe here](link)"
  - Must be visible and easy to find
  - Link to: `https://conuplanner.com/api/newsletter/unsubscribe?token={token}`

### Frontend Pages
- [ ] Create `/newsletter/unsubscribed` success page
  - Confirm unsubscription
  - Option to resubscribe if accidental

### Legal Compliance
- **CASL (Canada)**: Unsubscribe mechanism required
- **CAN-SPAM (USA)**: Unsubscribe link mandatory in every email
- **GDPR (EU)**: Users must be able to withdraw consent
- **Penalties**: Up to $10M CAD for CASL violations


---

## 🚀 Next Steps When Ready

1. Create Resend account at https://resend.com
2. Create Supabase project at https://supabase.com
3. Share API keys
4. Begin implementation following this plan
