import { sortGitignore } from './src/main.ts'

if (!import.meta.main) Deno.exit(1)

await sortGitignore()


