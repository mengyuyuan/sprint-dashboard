# Sprint Dashboard

AI-powered sprint planning for engineering managers.

## Stack
- Next.js 16 + React 19
- Tailwind CSS v4
- Prisma + SQLite
- NextAuth (GitHub OAuth)

## Getting Started

```bash
npm install
cp .env.example .env
# Fill in AUTH_GITHUB_ID and AUTH_GITHUB_SECRET from GitHub OAuth App
npx prisma db push
npm run dev
```

Open http://localhost:3000
