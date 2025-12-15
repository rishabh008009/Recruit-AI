# Recruit AI - AI-Powered Resume Screening

An intelligent recruitment dashboard that uses Google Gemini AI to analyze resumes and automate candidate screening.

## 🎯 Product Overview

Recruit AI helps recruiters save 90% of their screening time by automatically analyzing resumes against job descriptions. The AI provides fit scores (0-100%), identifies strengths/weaknesses, and sends automated interview invites or rejection emails.

**Live Demo:** [https://recruit-ai-sooty.vercel.app](https://recruit-ai-sooty.vercel.app)

## ✨ Key Features

- **AI Resume Analysis**: Upload a resume and get instant AI-powered fit scoring using Google Gemini
- **Candidate Pipeline Dashboard**: Track all candidates with color-coded AI scores
- **Automated Emails**: Interview invites (score ≥70%) or rejection emails sent automatically
- **User Authentication**: Email/password + Google OAuth via Supabase
- **Database Persistence**: All candidates stored in Supabase PostgreSQL
- **Modern UI**: Glassmorphism design with gradient backgrounds

## 🖥️ Screens

1. **Login/Signup** - Email + Google OAuth authentication
2. **Dashboard** - Command center with metrics, active jobs, and candidate pipeline
3. **Resume Upload** - AI-powered resume analysis modal
4. **Candidate Detail** - Slide-over with AI analysis, strengths, weaknesses, and actions

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Supabase (Auth + PostgreSQL)
- **AI**: Google Gemini 2.0 Flash Lite via n8n
- **Automation**: n8n workflows for AI analysis + email sending
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- n8n Cloud account
- Google Cloud Console (for Gemini API)

### Installation

```bash
# Clone the repo
git clone https://github.com/rishabh008009/Recruit-AI.git
cd Recruit-AI

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_N8N_WEBHOOK_URL=your_n8n_webhook_url
```

## 🔄 n8n Workflow Architecture

```
Website → n8n Webhook → Gemini AI Analysis
                              ↓
              ┌───────────────┴───────────────┐
              ↓                               ↓
    Respond to Webhook              Gmail (Auto Email)
    (Returns AI Score)              (Interview/Rejection)
```

**Key Configuration:**
- Y-shape workflow: HTTP Request splits to both response AND email
- Gmail has "Continue on Error" enabled
- Conditional email based on AI score (≥70% = interview, <70% = rejection)

## 📊 AI Scoring

| Score | Color | Recommendation |
|-------|-------|----------------|
| 80-100% | Green | Interview |
| 60-79% | Yellow | Review |
| 0-59% | Red | Reject |

## 📁 Project Structure

```
src/
├── components/
│   ├── LoginPage.tsx
│   ├── SignUpPage.tsx
│   ├── ResumeUpload.tsx
│   ├── CandidateTable.tsx
│   ├── CandidateDetailView.tsx
│   └── ...
├── lib/
│   ├── supabase.ts
│   ├── n8n.ts
│   └── candidates.ts
├── types/
│   └── index.ts
└── App.tsx
```

## 📈 Roadmap

See [ROADMAP_FINANCIALS.md](./ROADMAP_FINANCIALS.md) for:
- 6-month feature roadmap
- 5-year financial projections
- Pricing tiers and market analysis

## 🔒 Security

- Row Level Security (RLS) enabled on Supabase
- Environment variables for all sensitive data
- Google OAuth for secure authentication

## 📄 License

MIT License

---

Built with ❤️ using React, Supabase, n8n, and Google Gemini AI
