# SubSentry - Subscription Tracker

A calm, supportive web app that helps users track recurring subscriptions and stay in control of their spending.

## 🎯 Product Overview

SubSentry is designed for people like Priya, a 32-year-old freelance designer who wants financial control without the stress. The app provides a single dashboard to manually log all recurring subscriptions (Netflix, gym, software) and sends alerts before renewals.

## 🖥️ Front-End Screens

The Lovable front-end includes 7 fully functional screens covering login, dashboard, subscription creation, detail views, reminders, and settings. The UI uses a white base with light blue accents and Inter typography, emphasizing simplicity and confidence. The navigation is seamless, enabling key actions within 3 clicks.

### Screens Included:
1. **Login/Signup** - Google authentication with email fallback
2. **Dashboard** - Overview of all subscriptions with spending stats
3. **Create Subscription** - Form to add new recurring payments
4. **Subscription Detail** - Detailed view with annual cost calculations
5. **Reminder Setup** - Schedule notifications before billing
6. **Confirmation** - Success feedback after actions
7. **Settings/Profile** - Manage preferences and notifications

## 🎨 Design System

- **Color Palette**: White base, light blue (#4A90E2) accents, minimal icons
- **Typography**: Inter Sans with consistent hierarchy (H1: 32px, H2: 24px, Body: 14px+)
- **UI Style**: Clean card layout, rounded corners (12-16px), gentle shadows, accessible contrast (4.5:1)
- **Brand Tone**: Calm, Supportive, Empowering

## 🚀 Getting Started

### Front-End Only (Quick Demo)
1. Open `index.html` in a modern web browser
2. Explore the UI with sample data
3. All screens are functional with mock data

### Full-Stack (With Backend)
1. **Set up Supabase backend** (15 min) - See `QUICK_START_BACKEND.md`
2. **Configure Google OAuth** - Follow `BACKEND_SETUP.md`
3. **Connect front-end** - Update `lib/supabase-client.js` with your credentials
4. **Deploy** - Push to GitHub Pages or Vercel

**Quick Backend Setup**: See `QUICK_START_BACKEND.md` for 15-minute setup guide

## ✨ Key Features

- **Interactive Dashboard**: View total monthly spending and subscription status at a glance
- **Smart Categorization**: Active, Due Soon, and Overdue subscriptions clearly labeled
- **Reminder System**: Set custom notifications 1-14 days before billing
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Accessible**: Keyboard navigation, proper contrast ratios, descriptive labels

## 🔄 Navigation Flow

```
Login → Dashboard → [Add Subscription | View Details | Set Reminder] → Confirmation → Dashboard
                  ↓
              Settings (accessible from sidebar)
```

## 📱 Responsive & Accessible

- Minimum font size: 14px
- Button contrast: ≥ 4.5:1
- Tab and keyboard navigation friendly
- Descriptive alt text for all icons
- Mobile-optimized layouts

## 🛠️ Technical Stack

### Front-End
- Pure HTML5, CSS3, and Vanilla JavaScript
- No dependencies or build tools required
- Smooth transitions and animations
- Responsive design (mobile, tablet, desktop)

### Backend (Optional)
- **Supabase**: PostgreSQL database + Auth + Edge Functions
- **Google OAuth**: Gmail-based authentication
- **Row Level Security**: Complete data isolation
- **Real-time**: Live updates across devices
- **Email Service**: Resend/Gmail/SendGrid for reminders

**See `BACKEND_SUMMARY.md` for complete backend documentation**

## 💡 Key Takeaway

Users should feel **empowered and in control** — tracking subscriptions becomes effortless, not stressful.

---

Built with care for people who deserve financial peace of mind.
