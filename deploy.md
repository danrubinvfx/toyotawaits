# ToyotaWaits.ca Deployment Guide

This guide details how to publish the **ToyotaWaits.ca** codebase to GitHub and deploy to Vercel production with continuous integration and deployment.

---

## 1. Push Code to GitHub

Replace `<YOUR_GITHUB_USERNAME>` with your GitHub username or organization name.

```bash
# Add the remote GitHub repository
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/toyotawaits.git

# Push the main branch to GitHub
git push -u origin main
```

> **Note**: If you created the repository on GitHub with a README or license, use `git push -u origin main --force-with-lease` or ensure the remote repo was created empty without initializing files.

---

## 2. Deploy to Vercel

### Option A: Via Vercel Web Dashboard (Recommended)

1. Go to [https://vercel.com/new](https://vercel.com/new).
2. Under **Import Git Repository**, find and select **`toyotawaits`**.
3. Framework Preset will automatically detect **Next.js**.
4. Root Directory: `./` (default).
5. Expand the **Environment Variables** section and paste the required production variables listed below.
6. Click **Deploy**.
7. In **Project Settings -> Domains**, attach your production domain: `toyotawaits.ca` and `www.toyotawaits.ca`.

---

### Option B: Via Vercel CLI

If you prefer deploying directly from your terminal:

```bash
# Login to Vercel CLI
npx vercel login

# Link and deploy preview
npx vercel

# Deploy to production
npx vercel --prod
```

---

## 3. Production Environment Variables Checklist

Add these environment variables in **Vercel Dashboard -> Project Settings -> Environment Variables**:

| Variable Name | Description | Example / Recommended Value |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_BASE_URL` | Canonical domain for OpenGraph / social cards | `https://toyotawaits.ca` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project API URL | `https://xyzproject.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Public Anonymous API Key | `eyJhbGciOi...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key (Keep secret!) | `eyJhbGciOi...` |
| `DATABASE_URL` | Direct PostgreSQL connection string | `postgresql://postgres:[PASSWORD]@db.xyzproject.supabase.co:5432/postgres` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile Site Key for production | `0x4AAAAAA...` |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile Secret Key | `0x4AAAAAA...` |
| `UPSTASH_REDIS_REST_URL` *(Optional)* | Upstash Redis REST URL for distributed rate limiting | `https://[ID].upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` *(Optional)* | Upstash Redis REST Token | `AX...` |

> [!NOTE]
> For local testing or pre-production previews, Cloudflare Turnstile test keys can be used:
> * `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: `1x00000000000000000000AA` (Always passes)
> * `TURNSTILE_SECRET_KEY`: `1x0000000000000000000000000000000AA` (Always passes)

---

## 4. Automated CI/CD Pipeline

Every push or pull request to `main` triggers `.github/workflows/ci.yml`:
1. **ESLint**: Verifies code quality and zero errors.
2. **Vitest**: Runs the complete unit, integration, and component test suite.
3. **Next.js Production Build**: Executes `next build` with mock variables to ensure clean compilation before deployment.
4. **Vercel GitHub Integration**: Automatically builds and deploys production upon successful CI on `main`.
