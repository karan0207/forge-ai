# ForgeAI

ForgeAI is a hackathon-built learning app by Karan that turns plain language prompts into focused study tools. It uses Tambo to route each request into the best UI component, so lessons, quizzes, flashcards, comparisons, explainers, and plans appear automatically and feel consistent.

## What it does

- Converts prompts into structured, reusable StudyForge components
- Shows a clean gallery of generative UI components
- Includes a How it Works page that documents the build and the Tambo pipeline
- Keeps the interface flat and professional with an orange, black, gray, and white palette

## Built with

- Next.js App Router
- React 18
- Tailwind CSS
- Tambo AI SDK
- Zod for component schemas

## Pages

- /: Landing page
- /gallery: Component gallery
- /how-it-works: Product story and flow
- /chat: Tambo-powered chat

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create .env.local from example.env.local and set:

```
NEXT_PUBLIC_TAMBO_API_KEY=your_key
NEXT_PUBLIC_TAMBO_URL=optional_override
```

3. Run the dev server:

```bash
npm run dev
```

Open http://localhost:3000

## Deployment

This app is Vercel-ready. Ensure environment variables are set in Vercel before deploying.

## Notes

- StudyForge components live in src/components/studyforge
- Tambo registration is in src/lib/tambo.ts
