# Enes Öztürk — Personal Portfolio

A personal portfolio connecting my music and software work through a cinematic, full-screen experience. Inspired by the red-and-blue contrast of Need for Speed: Rivals, the interface presents two distinct worlds with an angled split screen and animated transitions.

## Features

- Dedicated Music and Software sections with links to my social and professional profiles.
- Responsive compositions: a side-by-side desktop layout and a vertically split mobile layout.
- Turkish, English, and German translations, with language preference saved locally.
- Glassmorphism cards, subtle hover effects, and CSS-driven section transitions.
- Email contact through `mailto:` and a separate copy-to-clipboard button with localized feedback.
- Q95 WebP backgrounds with device-specific image selection using `<picture>`.
- An opening loader tied to image loading, with error and timeout handling.
- Keyboard navigation, visible focus indicators, and reduced-motion support.

The site is fully static and does not require a backend, database, or API credentials.

## Technologies

- **React and React DOM** — components, state, and rendering.
- **Vite** — local development and production builds.
- **JavaScript, HTML, and CSS** — application logic, semantic markup, responsive layouts, and animations.
- **Browser APIs** — localStorage for language preference and the Clipboard API for email copying.
- **Google Fonts** — Barlow and Barlow Condensed, with system-font fallbacks.
- **GitHub Actions and GitHub Pages** — the included static-site deployment workflow.

Icons are inline SVGs. Image optimization uses Sharp as a separate development utility; it is not an application dependency.

## Local Development

Install Node.js **22.12 or later** and npm, then run the following commands from the project directory:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. To build and preview the production version:

```sh
npm run build
npm run preview
```

The production output is written to `dist/`. Both `dist/` and `node_modules/` are excluded from Git.

## Configuration

Profile links and the email address are defined in [`src/config.js`](src/config.js). Store the email address without the `mailto:` prefix; the application adds it when creating the contact link. Social and professional links open in a new tab.

Translations are maintained in [`src/translations.js`](src/translations.js), and application styles are in [`src/styles.css`](src/styles.css).

The active backgrounds are Q95 WebP files in `assets/images/`. Original PNG files and Q90 alternatives are retained. During local development, open `/__image-compare` at the Vite server URL to compare image variants. This tool is excluded from production builds. See [`tools/README.md`](tools/README.md) for the optimization report and utility instructions.

## GitHub Pages

The repository includes a deployment workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

1. In the GitHub repository, open **Settings → Pages** and select **GitHub Actions** as the source.
2. When ready to publish, run the workflow manually from the **Actions** tab.

The workflow installs dependencies, builds the site, and deploys `dist/`. It configures the asset base path automatically for repository sites and `*.github.io` user sites. Deployment is manual; pushing commits does not publish the site.

Local builds use relative asset paths by default. For a custom deployment path, set `VITE_BASE_PATH` before building; for example, in PowerShell:

```powershell
$env:VITE_BASE_PATH = '/enes-ozturk-portfolio/'
npm run build
```

## AI-assisted Development

I defined the visual concept, user experience, design decisions, and requirements for this portfolio. OpenAI Codex was used to implement the application code according to those requirements.

I tested and evaluated the application, reviewed the# Enes Öztürk — Personal Portfolio

A personal portfolio showcasing my work in **music and software development** through a cinematic, interactive interface inspired by Need for Speed: Rivals.

## Features

- Responsive design for desktop and mobile
- Interactive Music and Software sections
- Turkish, English, and German language support
- Animated transitions and glassmorphism effects
- Optimized WebP backgrounds
- Social media, professional profile, and contact links

## Technologies

- React
- Vite
- JavaScript
- HTML & CSS

## Getting Started

```bash
npm install
npm run dev
```

## AI-Assisted Development

I designed the visual concept, defined the requirements, and directed the user experience of this portfolio.

The application was implemented with the assistance of **OpenAI Codex**, while I guided the development process, tested the results, and refined the final design.


