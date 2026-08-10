# Vercel Deployment Guide

This guide provides step-by-step instructions for deploying your **Personal Portfolio CMS** to [Vercel](https://vercel.com).

---

## 📋 Prerequisites Checklist

Before deploying, ensure you have:
1. A **GitHub Repository** containing your portfolio project code.
2. A **Vercel Account** connected to your GitHub account.
3. A **Supabase Account** (or PostgreSQL database) for your database and storage buckets.
4. A **GitHub OAuth Application** configured for authentication.

---

## 🗄️ Step 1: Database Setup (Prisma & Supabase)

1. Make sure your database migrations / tables are up-to-date by pushing your Prisma schema to your remote database:
   ```bash
   npx prisma db push
   ```
2. In your Supabase Dashboard, create the following 4 public storage buckets:
   - `portfolio-thumbnails`
   - `skills-icon`
   - `experience-images`
   - `settings-assets`

Ensure public access policy (Read) is enabled for these buckets so images load on the public website.

---

## 🔑 Step 2: GitHub OAuth App Setup

1. Go to **GitHub Developer Settings**: Settings → Developer Settings → OAuth Apps → **New OAuth App**.
2. Set the following fields:
   - **Application name**: `Portfolio CMS`
   - **Homepage URL**: `https://<your-project-name>.vercel.app` (or your custom domain)
   - **Authorization callback URL**: `https://<your-project-name>.vercel.app/api/auth/callback/github`
3. Save the application and generate a **Client Secret**. Keep the **Client ID** and **Client Secret** for Step 4.
4. Find your numeric GitHub User ID (you can check `https://api.github.com/users/<your-github-username>` in your browser) to set as `AUTH_GITHUB_ADMIN_ID`.

---

## 🚀 Step 3: Deploy Project on Vercel

1. Log into your [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** → **Project**.
2. Import your **`portfolio-app`** repository from GitHub.
3. Keep Framework Preset as **Next.js**.

---

## ⚙️ Step 4: Configure Environment Variables on Vercel

In the **Environment Variables** section during project import (or in **Settings → Environment Variables**), add the following:

### Database Configuration
| Variable Name | Description / Example |
|---------------|-----------------------|
| `DATABASE_URL` | Transaction connection pooler URL (e.g. `postgresql://...:6543/postgres?pgbouncer=true`) |
| `DIRECT_URL` | Direct database connection URL (e.g. `postgresql://...:5432/postgres`) |

### Auth Configuration
| Variable Name | Description / Example |
|---------------|-----------------------|
| `AUTH_SECRET` | Secret key for session encryption (generate with `openssl rand -base64 32`) |
| `AUTH_URL` | `https://<your-project-name>.vercel.app` |
| `AUTH_GITHUB_ID` | Client ID from GitHub OAuth App |
| `AUTH_GITHUB_SECRET` | Client Secret from GitHub OAuth App |
| `AUTH_GITHUB_ADMIN_ID` | Your numeric GitHub User ID allowed to access `/admin` |

### Supabase Storage Configuration
| Variable Name | Description / Example |
|---------------|-----------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<your-supabase-id>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key from Supabase project settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret service role key from Supabase project settings |
| `SUPABASE_PORTFOLIO_THUMBNAIL_BUCKET` | `portfolio-thumbnails` |
| `SUPABASE_SKILLS_ICONS_BUCKET` | `skills-icon` |
| `SUPABASE_EXPERIENCE_IMAGES_BUCKET` | `experience-images` |
| `SUPABASE_SETTINGS_ASSETS_BUCKET` | `settings-assets` |

---

## 🏁 Step 5: Finalize & Build

1. Click **Deploy**. Vercel will automatically run `npm install`, generate Prisma client via `postinstall` script, and execute `next build`.
2. Once deployed, open your live URL:
   - **Public Site**: `https://<your-project-name>.vercel.app/`
   - **Admin Dashboard**: `https://<your-project-name>.vercel.app/admin`
3. Sign in via GitHub OAuth. Since your GitHub ID matches `AUTH_GITHUB_ADMIN_ID`, access to `/admin` will be granted!

---

## 🛠️ Post-Deployment Maintenance

- If you modify `prisma/schema.prisma` in the future:
  ```bash
  npx prisma db push
  ```
  Then commit and push your changes to GitHub — Vercel will automatically redeploy.
