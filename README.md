# Next Starter

App Router-based Next.js 16 starter kit with atomic component structure, Storybook 10, Tailwind CSS 4, and lint automation already wired in.

## Features

- Next.js 16 with TypeScript, server components, and global providers under `src/app/`.
- Storybook 10 configured for `atoms`, `organizms`, and `pages`, plus an example route at `src/app/story/page.tsx`.
- Tailwind CSS 4 alongside SCSS modules; global styles live in `src/app/globals.scss`.
- UI helpers ready to use: Font Awesome, Twemoji renderer, Recoil state, SWR data fetching, and a NextUI provider wrapper.
- Tooling guardrails: ESLint 9, Stylelint, Prettier, and Husky + lint-staged pre-commit hooks.

## Requirements

- Node.js 24.11.0 (see `.node-version`; use `nvm`, `fnm`, etc. to align locally).
- npm 10+ (bundled with Node 24).
- Install dependencies with `npm install`.

## Develop

1. Run `npm run dev` to start the Next.js dev server at <http://localhost:3000>.
2. Edit routes in `src/app/…` or components in `src/components/…`; hot reload is enabled by default.

## Scripts

- `npm run dev` – Next.js development server with hot refresh.
- `npm run build` – Production bundle (uses the Webpack-based builder configured for Next 16).
- `npm run start` – Serve the latest production build locally.
- `npm run lint` – ESLint across the project with `--max-warnings=0`.
- `npm run storybook` – Launch Storybook at <http://localhost:6006>.
- `npm run build-storybook` – Generate the static Storybook build into `storybook-static/`.

## Project Layout

```
src/app/             App Router entrypoint, layout, providers, demo route
src/app/globals.scss Global styles shared across routes
src/app/story/       Example Storybook-aligned page
src/components/      Atomic component library
├─ atoms/            Leaf components with local SCSS + stories
├─ organizms/        Composed components
└─ pages/            Page-level compositions and Storybook demos
public/              Static assets (icons, images)
.storybook/          Storybook configuration (main/preview)
tailwind.config.ts   Tailwind + NextUI plugin setup
```

## Styling & UI System

- Tailwind CSS 4 powers utility classes; extend design tokens in `tailwind.config.ts`.
- Component styles stay next to their implementation (`Component.tsx`, `Component.scss`, `Component.stories.ts`).
- `src/app/providers.tsx` wraps the tree with `NextUIProvider` so HeroUI/NextUI components share theme state.
- The `Twemoji` atom serves emoji as SVGs via CDN, and Font Awesome is ready for icon usage in pages.
- Uses [Digital Agency Design System](https://github.com/digital-go-jp/design-system-example-components-react) for accessible and government-standard UI components.
- Icons and illustrations are provided by the [Digital Agency Design System](https://www.digital.go.jp/policies/servicedesign/designsystem/Illustration_Icons).

## Storybook & Demo Content

- Stories follow the `Component.stories.ts` naming convention inside each component folder.
- Run `npm run storybook` for the component workbench; it mirrors the page at `src/app/story/page.tsx` for quick smoke tests.
- Use Storybook controls and links addons to explore different states before wiring live data.

## Linting & Formatting

- Husky’s `pre-commit` hook executes lint-staged: ESLint for TS/JS, Stylelint for SCSS, and Prettier formatting.
- Run `npm run lint` before pushing to catch import order and TypeScript issues early.
- For manual formatting, run `npx prettier --write` and `npx stylelint src/**/*.{css,scss,sass}` as needed.

## Deployment

- Build with `npm run build`, then verify locally via `npm run start`.
- Target Node 24.11.0 in CI/CD; keeping local versions aligned avoids build drift.
- Deploy to Vercel or any Node host that supports Next.js 16.
