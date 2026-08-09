# Portfolio - Steven Kemendics

Personal developer portfolio built with Node.js, Express and EJS.

The site presents my resume, technical skills and selected software projects in one recruiter-facing platform. The current positioning is junior developer work focused on backend APIs, practical web tools, data-driven applications, React/TypeScript projects, deployment and testing.

## Highlights

- Resume/profile page with recruiter-facing summary and featured projects
- Projects overview with stable desktop overlays and mobile-safe direct actions
- Project detail pages for:
  - PrintTune
  - unrealDice
  - Speed Dungeon
- Filament Finder data/filtering project
- Browser Hangman learning project
- Contact flow using a modal and `mailto:` fallback
- Lightweight smoke test for important routes

## Featured Projects

### PrintTune

Work-in-progress local-first advisory platform for FDM 3D printers.

- Tech: Electron, React, TypeScript, SQLite, FTS5, Ollama, JSON Schema, Ajv, Zod
- Scope: structured printer/slicer/filament/calibration data, deterministic diagnostics, local knowledge search and German-first local AI guidance
- Note: Alpha/WIP only; read-only with respect to printers, firmware, slicer profiles and imported source files
- Repo: https://github.com/STU6266/PrintTune

### unrealDice

React/TypeScript PWA for managing reusable dice groups, play sessions, local roll history and safe import/export backups.

- Tech: React, TypeScript, Vite, PWA, browser storage
- Live demo: https://unrealdice.onrender.com
- Repo: https://github.com/STU6266/unreal-dice

### Speed Dungeon

Static browser dungeon game with age-based content, room logic, timers, mobile controls, hidden-object rooms and a boss fight flow.

- Tech: HTML, CSS, JavaScript, JSON
- Live demo: https://speed-dungeon.onrender.com
- Repo: https://github.com/STU6266/speed-dungeon

## Routes

```text
/resume
/projects
/projects/printtune
/projects/ffki-alpha
/projects/board-game-intelligence-api
/projects/unrealdice
/projects/speed-dungeon
/about
/filament
/filament/add
/hangman
/impressum
/health
```

## Run Locally

```bash
git clone https://github.com/STU6266/portfolio-pro.git
cd portfolio-pro
npm install
npm start
```

Open:

```text
http://localhost:3000
```

## Test

```bash
npm test
```

The smoke test starts the Express server, checks the important pages and verifies the 404 handler.

## Tech Stack

- Node.js
- Express
- EJS
- HTML/CSS
- Vanilla JavaScript
- JSON data

## Project Structure

```text
portfolio-pro/
|-- server.js
|-- package.json
|-- controllers/
|   `-- siteController.js
|-- routes/
|   `-- siteRoute.js
|-- public/
|   |-- css/
|   |-- js/
|   |-- data/
|   `-- images/
|-- views/
|   |-- partials/
|   |-- resume.ejs
|   |-- projects.ejs
|   |-- project-printtune.ejs
|   |-- project-ffki-alpha.ejs
|   |-- project-board-game-api.ejs
|   |-- project-unrealdice.ejs
|   |-- project-speed-dungeon.ejs
|   |-- filament.ejs
|   |-- filament-add.ejs
|   |-- hangman.ejs
|   `-- about.ejs
|-- scripts/
|   `-- smoke-test.js
`-- docs/
    `-- github-profile-readme.md
```

## Notes

This portfolio is intentionally simple. It avoids heavy frontend frameworks and focuses on readable server-rendered pages, real project evidence and maintainable structure.
