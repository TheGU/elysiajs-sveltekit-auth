# SvelteKit with Elysia (bun) for backend and Auth Demo



## Developing

Once you've cloned a project and installed dependencies with `bun install`, start a development server:


### start docker 
```bash
# start docker database
docker compose up
# or start by bun command
bun run db:start

# Then run database migration
bun run db:push
```

### start web server
```bash
# start web server
bun run dev

# or start the server and open the app in a new browser tab
bun run dev -- --open
```
