# Portfolio - Steven Kemendics

Personal developer portfolio built with Node.js, Express and EJS.

The site presents my resume, technical skills and selected software projects in one recruiter-facing platform. The current positioning is junior developer work focused on backend APIs, practical web tools, data-driven applications, React/TypeScript projects, deployment and testing.

## Highlights

- Resume/profile page with recruiter-facing summary and featured projects
- Projects overview with stable desktop overlays and mobile-safe direct actions
- Project detail pages for:
  - Board Game Intelligence API
  - unrealDice
  - Speed Dungeon
  - Handcrafted Haven
- Filament Finder data/filtering project
- Browser Hangman learning project
- Contact flow using a modal and `mailto:` fallback
- Lightweight smoke test for important routes

## Featured Projects

### Board Game Intelligence API

Backend/data integration project built with Python, FastAPI and PostgreSQL. It imports BoardGameGeek-style XML data, validates it, stores it in relational tables and exposes documented API endpoints.

- Tech: Python, FastAPI, PostgreSQL, SQLAlchemy, Alembic, Docker, Pytest
- Live docs: https://board-game-intelligence-api.onrender.com/docs
- Repo: https://github.com/STU6266/board-game-intelligence-api

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

### Handcrafted Haven

School team project for a marketplace-style web app.

My contribution focused on integration, deployment/Vercel support, cleanup, accessibility/usability fixes, smoke testing, small bug fixes, project coordination and final stabilization.

- Tech: Next.js, TypeScript, MongoDB/Mongoose, Vercel
- Repo: https://github.com/STU6266/handcrafted-haven

## Routes

```text
/resume
/projects
/projects/board-game-intelligence-api
/projects/unrealdice
/projects/speed-dungeon
/projects/handcrafted-haven
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
|   |-- project-board-game-api.ejs
|   |-- project-unrealdice.ejs
|   |-- project-speed-dungeon.ejs
|   |-- project-handcrafted-haven.ejs
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
