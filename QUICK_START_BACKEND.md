# SubSentry Backend - Quick Start (15 Minutes)

## 🚀 Get Your Backend Running in 3 Steps

### Step 1: Create Supabase Project (5 min)

1. **Sign up**: Go to [supabase.com](https://supabase.com) → Sign in with GitHub
2. **New Project**: Click "New Project"
   - Name: `subsentry-tracker`
   - Password: Generate & save it
   - Region: Choose closest to you
   - Click "Create"
3. **Wait**: 2-3 minutes for setup

---

### Step 2: Set Up Database (3 min)

1. **Open SQL Editor**: Supabase Dashboard → SQL Editor
2. **Run Schema**: 
   - Click "New Query"
   - Copy ALL of `supabase/schema.sql`
   - Paste and click "Run"
   - Wait for "Success" ✅

**What this does:**
- Creates 5 tables (users, subscriptions, reminders, settings, payment_history)
- Sets up Row Level Security
- Adds indexes for speed
- Creates helper functions

---

### Step 3: Configure Google OAuth (7 min)

#### 3.1 Get Google Credentials
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create project: "SubSentry"
3. Enable **Google+ API**
4. **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure consent screen:
   - App name: SubSentry
   - Your email
6. Create OAuth Client:
   - Type: Web application
   - Authorized redirect URIs:
     ```
     https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
     ```
     (Get YOUR_PROJECT_REF from Supabase Dashboard → Settings → API → Project URL)
7. **Copy Client ID and Client Secret**

#### 3.2 Add to Supabase
1. Supabase → **Authentication** → **Providers**
2. Enable **Google**
3. Paste Client ID and Secret
4. **Save**

---

## ✅ You're Done! Now Connect Front-End

### Update Your Code

1. **Get Supabase Credentials**:
   - Supabase → Settings → API
   - Copy **Project URL** and **anon public** key

2. **Update `lib/supabase-client.js`**:
   ```javascript
   const SUPABASE_URL = 'https://xxxxx.supabase.co'  // Your URL
   const SUPABASE_ANON_KEY = 'eyJhbGc...'            // Your key
   ```

3. **Test It**:
   - Open your app
   - Click "Continue with Google"
   - Sign in
   - Should see dashboard! 🎉

---

## 🧪 Quick Test

Open browser console and run:

```javascript
// Check if connected
console.log('Supabase URL:', supabase.supabaseUrl)

// Test auth
const { data: { user } } = await supabase.auth.getUser()
console.log('Current user:', user)

// Test database
const { data } = await supabase.from('subscriptions').select('*')
console.log('Subscriptions:', data)
```

---

## 📧 Optional: Email Reminders

### Quick Setup with Resend (5 min)

1. **Sign up**: [resend.com](https://resend.com)
2. **Get API key**: Dashboard → API Keys → Create
3. **Add to Supabase**:
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Login
   supabase login
   
   # Link project
   supabase link --project-ref YOUR_PROJECT_REF
   
   # Add secret
   supabase secrets set RESEND_API_KEY=your_key_here
   
   # Deploy function
   supabase functions deploy send-reminder
   ```

4. **Done!** Emails will send automatically

---

## 🎯 What You Can Do Now

✅ **Authentication**: Users sign in with Gmail
✅ **Create Subscriptions**: Add Netflix, Spotify, etc.
✅ **View Dashboard**: See total spending
✅ **Set Reminders**: Get notified before billing
✅ **Update Settings**: Customize preferences
✅ **Real-time Sync**: Changes appear instantly

---

## 📚 Full Documentation

- **Complete Setup**: `BACKEND_SETUP.md`
- **API Reference**: `API_DOCUMENTATION.md`
- **Deployment**: `DEPLOYMENT_CHECKLIST.md`
- **Overview**: `BACKEND_SUMMARY.md`

---

## 🚨 Troubleshooting

**OAuth not working?**
- Check redirect URI matches exactly
- Verify Client ID/Secret are correct
- Make sure Google+ API is enabled

**Database errors?**
- Ensure schema.sql ran successfully
- Check Supabase logs: Dashboard → Logs
- Verify RLS policies are enabled

**Can't connect?**
- Double-check SUPABASE_URL and ANON_KEY
- Clear browser cache
- Check browser console for errors

---

## 🎉 You're Live!

Your SubSentry backend is now:
- ✅ Accepting Gmail logins
- ✅ Storing subscription data securely
- ✅ Ready for thousands of users
- ✅ Deployed on Supabase's global infrastructure

**Next**: Push your updated code to GitHub and test in production!

```bash
git add .
git commit -m "Connect Supabase backend"
git push origin main
```

---

**Total Setup Time**: ~15 minutes
**Cost**: $0 (free tier)
**Scalability**: 5,000+ users
**Status**: Production Ready ✅
