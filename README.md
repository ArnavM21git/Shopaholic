# Shopaholic

A minimal Next.js shopping-list demo app with a client-side shopping list (add / remove), theme toggle (light / dark), and sensible base styles. Items persist to localStorage. Built as a small starter you can extend and deploy.

## Features
- Add items with text input (press Enter or click Add)
- Delete items with a red trash button
- Items persist in `localStorage`
- Numbered, accessible shopping list with subtle badges
- Light / Dark theme toggle (respects OS preference and cookie)
- Ready for development with Next.js and a CI workflow

## Screenshot
(Use images from the repo or replace with your own.)

## Quick start

1. Clone the repo
```bash
git clone https://github.com/<your-username>/<repo>.git
cd shopaholic
```

2. Install dependencies
```bash
npm install
```

3. Run the dev server
```bash
npm run dev
# open http://localhost:3000
```

4. Build for production
```bash
npm run build
npm start
```

## Important notes before pushing to GitHub
- Do NOT commit `node_modules/`, `.next/`, or any `.env` files with secrets.
- The repository already contains a `.gitignore` and `.env.example`. Make sure `.env.example` contains placeholders only.
- If `.next/` or other build artifacts were previously committed, remove them from history before making the repo public.

To untrack build artifacts locally (keeps files but removes from git):
```bash
git rm -r --cached .next node_modules
git add -A
git commit -m "chore: remove build artifacts from tracking"
```

## Environment
- Node 18+ recommended
- Next.js 15.x, React 19.x (see `package.json`)

If you use environment variables, add them to `.env.local` (not committed) and include examples in `.env.example`.

## Project structure (key files)
- `app/` — Next.js app router files
  - `page.js` — main page
  - `ShoppingList.js` — client component for add/remove + localStorage
  - `ThemeProvider.js` — theme toggle + accessibility helpers
  - `globals.css` — base styles and shopping list CSS
- `package.json` — scripts: `dev`, `build`, `start`, `lint`
- `.github/workflows/ci.yml` — simple CI that runs build + lint

## Accessibility & tips
- Theme changes are announced using an `aria-live` region.
- Browser-only APIs are used in client components to avoid hydration mismatches (follow `use client` pattern).
- Avoid non-deterministic values (Date.now(), Math.random()) in server-rendered markup to prevent hydration errors.

## Contributing
- Feel free to open issues or PRs.
- Run `npm run lint` and `npm run build` before submitting changes.

## License
This project is licensed under the MIT License — see `LICENSE`.

---

If you want, I can:
- Add a short demo GIF or optimized screenshot to the README.
- Add more detailed developer notes (how ThemeProvider handles cookies/OS preference).
- Create a GitHub release / initial tag before you push. Which would you like next?
