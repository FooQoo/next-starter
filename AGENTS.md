# Repository Guidelines

## Project Structure & Module Organization

The application entrypoint lives in `src/app`; `layout.tsx` handles shared chrome, `page.tsx` is the root route, and `story/` exposes demo content. Components split into `atoms`, `organizms`, and `pages`, each pairing the implementation (`*.tsx`), SCSS, and Storybook stories. Shared styling stays in `src/app/globals.scss`, static assets in `public/`, Storybook config in `.storybook/`, and Tailwind setup in `tailwind.config.ts`.

## Build, Test, and Development Commands

- `npm run dev` — launch the Next.js dev server at <http://localhost:3000> with hot refresh.
- `npm run build` — produce the production bundle and validate route correctness.
- `npm run start` — serve the production build locally for smoke testing.
- `npm run lint` — run ESLint against the project with the Next.js config.
- `npm run storybook` — open the component workbench on port 6006.
- `npm run build-storybook` — generate a static Storybook build for preview deployments.

## Coding Style & Naming Conventions

`.editorconfig` enforces two-space indentation and LF endings, and Prettier (`.prettierrc.json`) governs formatting; run `npx prettier --write` when working outside lint-staged. Components, hooks, and pages use PascalCase filenames (e.g., `Button.tsx`), with stories following `Component.stories.ts`. Keep SCSS modules beside their component and place shared theme tokens in global styles or Tailwind config. Favor named exports for reusable pieces to keep import graphs explicit.

## Testing Guidelines

Automated unit tests are not yet wired in, so lean on Storybook stories and visual checks for coverage. When adding tests, co-locate React Testing Library specs as `Component.test.tsx` next to the source and run them headlessly before submitting a PR. Validate husky hooks with `npx lint-staged` if you touch the lint pipeline.

## Commit & Pull Request Guidelines

Follow Conventional Commits as reflected in git history (`chore(deps): …`, `feat: …`, `fix: …`). Group related changes per PR, provide a succinct summary, and link tracking issues. Attach screenshots or recordings when UI updates affect layout or interaction. Confirm `npm run lint` and a production build succeed before requesting review.

## Tooling & Automation

Husky triggers `lint-staged` on each commit, running ESLint, Stylelint, and Prettier against staged files; avoid bypassing it unless CI is failing. CI/CD assumes Node 18+ per `.node-version`, so keep local environments aligned. Renovate automates dependency bumps—label larger upgrades and smoke-test Storybook before merging.
