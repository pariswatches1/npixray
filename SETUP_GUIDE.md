# NPIxray — Setup Guide for Claude Code

## STEP 1: Create the project folder

Open your terminal (Command Prompt, PowerShell, or Terminal) and run:

```bash
mkdir npixray
cd npixray
```

That's it. You now have an empty folder called `npixray`.

---

## STEP 2: Copy the instruction files into the folder

Put these 2 files in the `npixray` folder:
- `CLAUDE.md` — Claude Code reads this AUTOMATICALLY every time it opens the project. It tells Claude Code what the project is, the tech stack, the structure, and the rules.
- `PROJECT_SPEC.md` — Detailed specifications for every feature. Claude Code references this when building specific features.

Your folder should look like:
```
npixray/
├── CLAUDE.md
└── PROJECT_SPEC.md
```

---

## STEP 3: Open Claude Code

In your terminal, make sure you're inside the npixray folder, then launch Claude Code:

```bash
cd npixray
claude
```

Claude Code will automatically read CLAUDE.md and understand the entire project.

---

## STEP 4: Give Claude Code the first task

Copy and paste this EXACT prompt into Claude Code:

```
Initialize the NPIxray project. Read CLAUDE.md and PROJECT_SPEC.md first, then:

1. Run `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"` to scaffold Next.js in the current directory
2. Install dependencies: `npm install recharts lucide-react`
3. Set up the project structure from CLAUDE.md (create the folders: components/scanner, components/report, components/charts, components/layout, components/ui, lib/, data/scripts/)
4. Create a basic homepage (app/page.tsx) with:
   - NPIxray branding (dark theme, gold accent #E8A824)
   - Hero section: "X-Ray Your Practice Revenue" headline
   - NPI search input (10-digit number field)
   - Search by name option (first name, last name, state dropdown)
   - "Scan Now" button
   - Below the fold: brief explanation of what the scan shows
5. Create app/layout.tsx with proper metadata for npixray.com (title, description, OG tags)
6. Create a basic header component (components/layout/header.tsx) and footer (components/layout/footer.tsx)
7. Initialize git repo and make first commit

Use the design specs from CLAUDE.md: dark mode, gold accent, Bloomberg-terminal aesthetic, DM Sans font from Google Fonts.
```

---

## STEP 5: Connect to GitHub

After Claude Code builds the initial project, push it to GitHub:

```
Create a new GitHub repository called "npixray" and push this project to it. Use `gh repo create npixray --public --source=. --push` or walk me through the manual git remote add steps.
```

---

## STEP 6: Connect to Vercel

1. Go to vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your "npixray" GitHub repo
4. Vercel auto-detects Next.js — just click "Deploy"
5. After deploy, go to Settings → Domains → add npixray.com
6. Since you bought the domain through Vercel, it should connect automatically

---

## STEP 7: Continue building with Claude Code

After the foundation is deployed, come back to me (Claude.ai) and I'll give you the next task specs for Claude Code:

**Task 2**: Database setup (PostgreSQL on Vercel Postgres or Supabase)
**Task 3**: CMS data download + processing pipeline
**Task 4**: NPI lookup API route
**Task 5**: Revenue calculation engine
**Task 6**: Scanner results dashboard with charts
**Task 7**: Email capture + scan storage
**Task 8**: SEO content pages
**Task 9**: Programmatic SEO page generation

Each task is a specific prompt you paste into Claude Code. I write the specs, Claude Code builds them.

---

## How the workflow works going forward:

```
You come to me (Claude.ai)
    ↓
I write detailed task spec
    ↓
You paste it into Claude Code
    ↓
Claude Code builds it
    ↓
Code auto-pushes to GitHub
    ↓
Vercel auto-deploys to npixray.com
    ↓
You come back to me for next task
```

---

## Tips for working with Claude Code:

1. **One task at a time.** Don't give it 10 things at once. One focused task → verify it works → next task.

2. **If something breaks**, tell Claude Code: "That's not working. Here's the error: [paste error]" — it will fix it.

3. **To reference the spec**, tell Claude Code: "Read PROJECT_SPEC.md for the details on [feature]"

4. **To continue a previous task**, just say: "Continue building [feature] from where we left off"

5. **Always test before moving on.** Run `npm run dev` and check localhost:3000 before deploying.
