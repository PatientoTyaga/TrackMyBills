# TrackMyBills

TrackMyBills is a full-stack web application that helps users **track and manage their recurring bills** and **subscriptions** easily.  
It features **secure authentication**, **upcoming bill alerts**, **real-time updates across tabs**, and **visual charts** for spending trends.

---

## 🚀 Live Demo

👉 [Try the Live App]https://trackmybills.org/

---

## 📦 Tech Stack

- [Next.js 14+ (App Router)]
- [Supabase (Auth, Database, Realtime)]
- [Tailwind CSS]
- [Zod (Form validation)]
- [Formspree (Contact Us form handling)]
- [Lucide-react (Icons)]
- [Chart.js (Charts for bill analysis)]

---

## 📋 Features

- ✅ **Sign Up / Sign In** (Email + Password with Email Verification)
- ✅ **Bill Management** (Add, Edit, Delete, Categorize bills)
- ✅ **Recurring Bills** (Automatic handling for monthly/yearly bills)
- ✅ **Real-time Sync** (Across tabs using Supabase Realtime channels)
- ✅ **Bill Due Alerts** (Upcoming bills with visual alerts)
- ✅ **Spending Charts** (Category breakdown and Monthly Trends)
- ✅ **Contact Us Form** (Secure contact form with anti-XSS validation)

---

## 🛠️ Getting Started

Clone the repository:

```bash
git clone https://github.com/your-username/TrackMyBills.git
cd TrackMyBills
npm install
cp .env.example .env.local
# Fill in your environment variables
npm run dev
```

---

## 🔐 Environment Variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public API key |
| `NEXT_PUBLIC_BASE_URL` | Base URL for redirects (ex: `http://localhost:3000`) |
| `FORMSPREE_ENDPOINT` | Formspree form endpoint URL |

> Create a `.env.local` file based on the provided `.env.example`.

---

## ✨ Authentication Flow

- Sign up with email and password
- Supabase sends a verification email
- After email confirmation, user is redirected to `/user-homepage`
- Username is stored securely in `user_metadata`

> **Note:** Profile table setup was considered but deferred for future expansion.

---

## 🧱 Folder Structure

```bash
/app
  /sign-up
  /sign-in
  /user-homepage
  /contact
/components
/context
/hooks
/utils
/public

