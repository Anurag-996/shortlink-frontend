# TinyClick Frontend — Next.js Web Client

[![Next.js](https://img.shields.io/badge/Next.js-16.3.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![ESLint](https://img.shields.io/badge/ESLint-Clean-brightgreen?logo=eslint)](https://eslint.org/)

A modern, high-performance web frontend for the **TinyClick (`tinyclick.in`)** URL shortening and analytics platform. Built with **Next.js 16 (App Router + Turbopack)**, **React 19**, and **TypeScript**, engineered for speed, token security, dynamic SEO, and responsive mobile-first user experience.

---

## 🌟 Key Features

### 🔐 1. Zero-Storage Token Architecture
- **In-Memory JWT Storage**: Access tokens exist strictly in React runtime memory (`useState` / module memory). Never persisted to `localStorage`, `sessionStorage`, `IndexedDB`, or JavaScript-accessible cookies, mitigating XSS token theft.
- **HttpOnly Cookie Session Restoration**: On browser refresh (`F5`), `AuthProvider` invokes `POST /api/auth/refresh` with `credentials: "include"`. The backend validates the secure `HttpOnly` refresh token and restores the session without UI flicker.
- **Automatic 401 Interception & Retry**: Authenticated API calls that receive a `401 Unauthorized` automatically attempt a single deduplicated refresh cycle, update the in-memory token, and retry the request transparently.

### ⚡ 2. URL Shortening & Custom Aliases
- **Flexible Domain Validation**: Accepts full URLs (`https://youtube.com`) or bare domains (`youtube.com`, `m.youtube.com`), auto-prepending `https://` for external web domains and `http://` for local development (`localhost:8000`).
- **Gibberish Rejection**: Strict validation blocks single-word inputs lacking valid Top-Level Domains (`.com`, `.in`, `.org`, `.live`), invalid protocols (`ftp://`, `file://`), and emails (`mailto:`).
- **Custom Alias & Expiry**: Configure custom short codes (3–16 chars) and optional date/time expiration.

### 📊 3. Link Analytics Dashboard
- **Per-Link Analytics Page**: Dedicated analytics view (`/app/urls/{id}/analytics`) for each short link with:
  - **Click Time-Series Chart**: Daily click counts over configurable ranges (7d, 30d, 90d, all time)
  - **Geographic Distribution**: Country-level click breakdown with visual charts
  - **Device Breakdown**: Desktop, Mobile, Tablet distribution
  - **Browser Distribution**: Chrome, Safari, Firefox, Edge, etc.
  - **Referrer Sources**: Direct, social media, search engines, websites
- **User Dashboard Overview**: Aggregated analytics across all user's links with total clicks, total links, and click trends
- **Admin Platform Analytics**: Platform-wide metrics including growth charts, top links, top users, geography, devices, and recent activity feed

### 📋 4. Server-Side Pagination & Multi-Column Sorting
- **Scalable Dataset Handling**: Seamlessly navigates thousands of short links without browser memory lag.
- **Interactive Table Sorting**: Clickable column headers for **Created**, **Status / Expiry**, and **Clicks** with directional sort indicators (`↑` / `↓`).
- **Page Size Controls**: Switch dynamically between `10`, `25`, `50`, or `100` links per page.

### 🌐 5. Server-Side Short Link Resolution (`/[shortCode]`)
- **Instant Redirection**: Server Component checks link validity and issues an immediate HTTP `302 Found` redirect.
- **Branded Error States**:
  - **Invalid Code (`404`)**: Renders a styled **"Short Link Not Found"** interface with navigation back to the home shortener.
  - **Expired Link (`410`)**: Renders a **"Link Expired"** badge notifying users that the short link is inactive.

### 🔍 6. Search Engine Optimization (SEO) & Metadata
- **Dynamic Tab Titles**: Root layout templating (`%s | TinyClick`) gives server-rendered, non-flickering browser titles across all pages.
- **Social Sharing**: OpenGraph and Twitter Card metadata generated for previews on WhatsApp, LinkedIn, Discord, and Twitter.
- **Crawler Directives**: Dynamic TypeScript generators for [app/robots.ts](app/robots.ts) and [app/sitemap.ts](app/sitemap.ts), hiding private admin routes from indexing.
- **Rich Snippets**: Schema.org `WebApplication` JSON-LD embedded on the public landing page.

### 🔄 7. Account Lifecycle Management
- **User Registration**: Email & password signup with email verification
- **Account Deletion**: 7-day grace period with confirmation dialog
- **Cancel Deletion & Restore**: Login during grace period shows a confirmation dialog to cancel deletion and restore the account instantly
- **Password Management**: Forgot password, reset password, and change password flows

---

## 🗺️ Application Routing Map

| Route | Access Level | Description | Tab Bar Title |
| :--- | :---: | :--- | :--- |
| **`/`** | Public | Public landing page with instant URL shortener. | `TinyClick` |
| **`/login`** | Public | User sign-in portal with deletion recovery. | `Login \| TinyClick` |
| **`/register`** | Public | User registration with email verification. | `Register \| TinyClick` |
| **`/forgot-password`** | Public | Password reset request. | `Forgot Password \| TinyClick` |
| **`/reset-password`** | Public | Password reset with token. | `Reset Password \| TinyClick` |
| **`/verify-email`** | Public | Email verification callback. | `Verify Email \| TinyClick` |
| **`/app/dashboard`** | Protected | User dashboard with analytics overview and recent links. | `Dashboard \| TinyClick` |
| **`/app/urls`** | Protected | Full paginated link management with search and column sorting. | `URLs \| TinyClick` |
| **`/app/urls/{id}/analytics`** | Protected | Per-link analytics: clicks, geography, devices, browsers, referrers. | `Link Analytics \| TinyClick` |
| **`/app/settings`** | Protected | Account profile, password, and session management. | `Settings \| TinyClick` |
| **`/app/admin/analytics`** | Admin | Platform-wide analytics dashboard. | `Admin Analytics \| TinyClick` |
| **`/app/admin/users`** | Admin | User management panel. | `Admin Users \| TinyClick` |
| **`/[shortCode]`** | Public (Dynamic) | Server-rendered short link redirector and branded 404/410 error page. | `Redirecting /xyz \| TinyClick` |
| **`/robots.txt`** | Public | Dynamic crawler rules generated by [app/robots.ts](app/robots.ts). | — |
| **`/sitemap.xml`** | Public | Dynamic search index sitemap generated by [app/sitemap.ts](app/sitemap.ts). | — |

---

## 🏗️ Architecture & Authentication Flow

```
+-----------------------------------------------------------------------------------+
|                                 Next.js Browser Client                            |
|                                                                                   |
|  [ In-Memory State: accessToken ]     [ UI Components / Table / Dashboard ]       |
+--------------------------+-----------------------------------+--------------------+
                           |                                   |
         (1) Initial Mount: POST /api/auth/refresh             | (2) API Calls:
             (credentials: "include")                          |     Authorization: Bearer <token>
                           |                                   |
                           v                                   v
+-----------------------------------------------------------------------------------+
|                         ShortLink Backend (Port 8080)                              |
|               - CORS Configuration (https://tinyclick.in)                         |
|               - JWT Authentication & Refresh Token Rotation                       |
+--------------------------+-----------------------------------+--------------------+
                           |                                   |
                           v                                   v
              [ Auth + User Management ]              [ URL + Analytics Service ]
           (Validates HttpOnly Cookie)              (Executes Paginated Queries)
```

---

## 📁 Directory Structure

```text
shortlink-frontend/
├── app/
│   ├── [shortCode]/         # Dynamic server-rendered 302 redirect & 404/410 error UI
│   │   └── page.tsx
│   ├── app/
│   │   ├── admin/
│   │   │   ├── analytics/   # Admin platform-wide analytics dashboard
│   │   │   └── users/       # Admin user management panel
│   │   ├── dashboard/       # User dashboard with analytics overview
│   │   ├── settings/        # Account settings & session management
│   │   └── urls/
│   │       ├── page.tsx     # Paginated URL list with sorting
│   │       └── [id]/
│   │           └── analytics/ # Per-link analytics (clicks, geo, devices, browsers, referrers)
│   ├── forgot-password/     # Password reset request
│   ├── login/               # User login with deletion recovery
│   ├── register/            # User registration
│   ├── reset-password/      # Password reset with token
│   ├── verify-email/        # Email verification callback
│   ├── globals.css          # Global styles, variables, and dark/light tokens
│   ├── layout.tsx           # Root layout (Fonts, SEO Metadata, AuthProvider, Analytics)
│   ├── page.tsx             # Public landing page with URL shortener
│   ├── robots.ts            # Dynamic robots.txt generator
│   └── sitemap.ts           # Dynamic sitemap.xml generator
├── components/
│   ├── analytics/           # Link analytics charts and dashboard components
│   ├── auth/                # Login form, register form, and authentication components
│   ├── layout/              # AppShell, Navbar, and layout wrappers
│   ├── ui/                  # Reusable primitives (Button, Dialog, Badge, Icons, Toast)
│   └── urls/                # UrlCreator, UrlListView, and EmptyState
├── lib/
│   ├── api/                 # Centralized apiClient, auth endpoints, url endpoints, analytics endpoints
│   ├── auth/                # AuthContext & pure in-memory state provider
│   └── utils/               # Formatting helpers (dates, numbers, status, URLs)
├── types/
│   └── api.ts               # TypeScript interfaces (ShortUrlResponse, PageResponse, Analytics, etc.)
├── next.config.ts           # Reverse proxy API rewrites & Turbopack config
└── package.json             # Project dependencies & scripts
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root of `shortlink-frontend`:

```env
# URL of the ShortLink Backend API
NEXT_PUBLIC_GATEWAY_URL=http://localhost:8080

# Production site URL for canonical SEO, robots, and sitemap generation
NEXT_PUBLIC_SITE_URL=https://tinyclick.in
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **Package Manager**: `npm`, `pnpm`, or `bun`

### 2. Installation
```bash
cd shortlink-frontend
npm install
```

### 3. Development Server
Start the local Next.js development server with Turbopack:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Code Quality & Linting
Run ESLint to ensure strict type checking and React 19 compliance:
```bash
npm run lint
```

### 5. Production Build
Compile optimized static pages and server bundles:
```bash
npm run build
npm run start
```

---

## 🛡️ Security Best Practices

1. **No Token Storage**: The application never stores JWT access tokens in browser persistence (`localStorage` or `sessionStorage`).
2. **Cross-Site Cookie Security**: Production uses `SameSite=None; Secure; HttpOnly` cookies for cross-origin refresh token transmission between `tinyclick.in` and the backend API.
3. **Reverse Proxying**: Frontend calls `/api/*` which Next.js rewrites to the API Gateway (`NEXT_PUBLIC_GATEWAY_URL`), avoiding mixed-content warnings and handling CORS cleanly.
4. **Defense-in-Depth Validation**: Both frontend client-side validation and backend Jakarta annotations enforce strict domain/subdomain checks.

---

## 📄 License
This project is open-source and available under the **MIT License**.
