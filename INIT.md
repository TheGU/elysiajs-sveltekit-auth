This is how this repo is initailize by `bunx sv create` command

```bash
❯ bunx sv create elysiajs-sveltekit-auth
┌  Welcome to the Svelte CLI! (v0.6.13)
│
◇  Which template would you like?
│  SvelteKit minimal
│
◇  Add type checking with Typescript?
│  Yes, using Typescript syntax
│
◆  Project created
│
◇  What would you like to add to your project? (use arrow keys / space bar)
│  prettier, eslint, vitest, playwright, tailwindcss, sveltekit-adapter, drizzle, lucia, mdsvex, paraglide, storybook
│
◇  tailwindcss: Which plugins would you like to add?
│  typography, forms, container-queries
│
◇  sveltekit-adapter: Which SvelteKit adapter would you like to use?
│  vercel
│
◇  drizzle: Which database would you like to use?
│  PostgreSQL
│
◇  drizzle: Which PostgreSQL client would you like to use?
│  Postgres.JS
│
◇  drizzle: Do you want to run the database locally with docker-compose?
│  Yes
│
◇  lucia: Do you want to include a demo? (includes a login/register page)
│  Yes
│
◇  paraglide: Which languages would you like to support? (e.g. en,de-ch)
│  en
│
◇  paraglide: Do you want to include a demo?
│  No
│
◇  Which package manager do you want to install dependencies with?
│  bun
│
◇  storybook: Running external command (bun x storybook@latest init --skip-install --no-dev)
╭──────────────────────────────────────────────────────╮
│                                                      │
│   Adding Storybook version 8.5.0 to your project..   │
│                                                      │
╰──────────────────────────────────────────────────────╯
 • Detecting project type. ✓
 • Adding Storybook support to your "SvelteKit" appWARN An issue occurred while trying to find dependencies metadata using npm.

  ✔ Getting the correct version of 9 packages
    Configuring eslint-plugin-storybook in your package.json
  ✔ Installing Storybook dependencies
WARN An issue occurred while trying to find dependencies metadata using npm.
. ✓

attention => Storybook now collects completely anonymous telemetry regarding usage.
This information is used to shape Storybook's roadmap and prioritize features.
You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
https://storybook.js.org/telemetry

╭──────────────────────────────────────────────────────────────────────────────╮
│                                                                              │
│   Storybook was successfully installed in your project! 🎉                   │
│   To run Storybook manually, run npm run storybook. CTRL+C to stop.          │
│                                                                              │
│   Wanna know more about Storybook? Check out https://storybook.js.org/       │
│   Having trouble or want to chat? Join us at https://discord.gg/storybook/   │
│                                                                              │
╰──────────────────────────────────────────────────────────────────────────────╯
│
◆  Successfully setup add-ons
│
◆  Successfully installed dependencies
│
◇  Successfully formatted modified files
│
◇  Project next steps ─────────────────────────────────────────────────────╮
│                                                                          │
│  1: cd elysiajs-sveltekit-auth                                           │
│  2: git init && git add -A && git commit -m "Initial commit" (optional)  │
│  3: bun run dev --open                                                   │
│                                                                          │
│  To close the dev server, hit Ctrl-C                                     │
│                                                                          │
│  Stuck? Visit us at https://svelte.dev/chat                              │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────╯
│
◇  Add-on next steps ──────────────────────────────────────────────────╮
│                                                                      │
│  drizzle:                                                            │
│  - You will need to set DATABASE_URL in your production environment  │
│  - Run bun run db:start to start the docker container                │
│  - Run bun run db:push to update your database schema                │
│                                                                      │
│  lucia:                                                              │
│  - Run bun run db:push to update your database schema                │
│  - Visit /demo/lucia route to view the demo                          │
│                                                                      │
│  paraglide:                                                          │
│  - Edit your messages in messages/en.json                            │
│  - Consider installing the Sherlock IDE Extension                    │
│  - Visit /demo/paraglide route to view the demo                      │
│                                                                      │
├──────────────────────────────────────────────────────────────────────╯
│
└  You're all set!
```