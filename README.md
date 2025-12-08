# Portfolio – Steven Kemendics

Personal developer portfolio built with **Node.js**, **Express** and **EJS**.  
The site showcases my background, skills and a few small demo projects:

- An interactive **resume** with hover panels and detailed experience pages
- A **Filament Finder** data project for 3D printing filaments
- A web version of my old **Hangman** console game
- A simple but robust **contact flow** using a modal + `mailto:`

The goal of this project is to practise real-world web development basics in a way that is easy to read and understand for junior developers and reviewers.

---

## Features

### 1. Interactive Resume

- Main entry point at **`/resume`**
- Profile section with a hover panel and link to a dedicated **“More about me”** page (`/about`)
- Professional experience with:
  - Three roles (Heinrich Reiter, Interspar, McDonald’s)
  - Hover panels that explain how each role connects to software development
  - Links to long-form detail pages:
    - `/reiter`
    - `/interspar`
    - `/mcdonalds`
- Education & training section with image hovers (certificates, documents)
- Clean, card-based layout suitable for desktop and mobile

### 2. Projects Page

- Overview at **`/projects`**
- Project cards with:
  - Tag line (e.g. `WEB · HTML / CSS / JS`)
  - Title, short description, tech stack
  - GitHub link for the code
  - For interactive projects:
    - **Hangman:** "Play Hangman" → `/hangman`
    - **Filament Finder:** "Open Filament Finder" → `/filament`

### 3. Filament Finder (3D Printing)

- Main page at **`/filament`**
- Uses a static JSON dataset at `public/data/filaments.json`:
  - `materials[]`: name, description, typical temps, flags (flexible, enclosure, etc.)
  - `filaments[]`: id, brand, product_name, material, color, temp ranges, notes
- Filter UI:
  - Material dropdown (auto-filled from `materials[]`)
  - Brand dropdown (auto-filled from `filaments[]`)
  - Color filter (any / black / white)
  - Single nozzle temperature input (keeps filaments where range includes the value)
  - Optional bed temperature input
- Material info panel that updates when you select a material
- Results shown as a compact list (brand + product name, material chip, temps, notes)

#### Add Filament Demo

- Page at **`/filament/add`**
- Form with all relevant fields (brand, product name, material, colors, temps, special type, notes)
- Live preview on the right that shows how the filament would appear in the main list
- On save:
  - Client sends `POST /api/filaments` with JSON
  - Server:
    - Reads `public/data/filaments.json`
    - Validates required fields and numeric temps
    - Determines new `id` (max existing + 1)
    - Appends filament to the `filaments[]` array
    - Writes the JSON file back to disk
    - Returns the created filament as JSON

> Note: On some hosting providers the filesystem is ephemeral. This feature is meant as a **demo of simple data writing**, not a production database.

### 4. Hangman (Web Version)

- Page at **`/hangman`**
- Browser version of an original C# console Hangman game
- Features:
  - Difficulty levels (easy / medium / hard)
  - "Start new game" button
  - Display of:
    - Word as underscores + revealed letters
    - Wrong guesses count
    - List of guessed letters
    - ASCII hangman drawing that progresses with each wrong guess
  - On-screen keyboard (A–Z) implemented in JavaScript
- Logic is handled in `public/js/hangman.js` and heavily commented in plain English

### 5. Contact Flow

- Navigation bar contains **"Contact Me"**
  - Basic fallback: `<a href="mailto:stevenkemendics@gmail.com">`
  - Enhanced behaviour:
    - `public/js/contact-modal.js` intercepts clicks on `#nav-contact-link`
    - Opens a custom contact modal (`contactModal.ejs`)
    - Collects:
      - Name (optional)
      - Company (optional)
      - How to contact the user (required)
      - Message (required)
    - Builds a `mailto:` URL with subject + body
    - Redirects to the mailto link (`window.location.href = mailtoUrl`)
    - No server-side email sending (no SMTP, no passwords)

---

## Tech Stack

**Backend**

- Node.js (CommonJS)
- Express
- EJS view engine

**Frontend**

- HTML5, semantic structure
- CSS (split into multiple files for maintainability)
  - `base.css` – reset, typography, color variables
  - `layout.css` – general layout and responsive grid
  - `style.css` – shared components (cards, buttons, chips, tags)
  - `resume.css` – resume layout and all hover effects
  - `filament.css` – Filament Finder and Add Filament pages
  - `projects.css` – projects overview page
  - `hangman.css` – Hangman UI
  - `contact.css` – contact modal
- Vanilla JavaScript modules:
  - `public/js/nav.js` – mobile nav toggle
  - `public/js/contact-modal.js` – contact modal + mailto logic
  - `public/js/education-hover.js` – education image hover behaviour
  - `public/js/filament.js` – Filament Finder filters + UI
  - `public/js/filament-add.js` – Add Filament logic + live preview
  - `public/js/hangman.js` – full game logic for Hangman

---

## Project Structure

Rough overview of the important parts:

```text
portfolio-pro/
├─ server.js                 # Express app entry point
├─ package.json
├─ public/
│  ├─ css/
│  │  ├─ base.css
│  │  ├─ layout.css
│  │  ├─ style.css
│  │  ├─ resume.css
│  │  ├─ filament.css
│  │  ├─ projects.css
│  │  ├─ hangman.css
│  │  └─ contact.css
│  ├─ js/
│  │  ├─ nav.js
│  │  ├─ contact-modal.js
│  │  ├─ education-hover.js
│  │  ├─ filament.js
│  │  ├─ filament-add.js
│  │  └─ hangman.js
│  ├─ data/
│  │  └─ filaments.json
│  └─ images/
│     ├─ profile, certificates, job images, etc.
├─ views/
│  ├─ resume.ejs             # Main resume page
│  ├─ projects.ejs           # Projects overview
│  ├─ filament.ejs           # Filament Finder UI
│  ├─ filament-add.ejs       # Add filament + preview
│  ├─ hangman.ejs            # Hangman game view
│  ├─ about.ejs              # Long-form "More about me"
│  ├─ reiter.ejs             # Detailed Heinrich Reiter experience
│  ├─ interspar.ejs          # Detailed Interspar experience
│  ├─ mcdonalds.ejs          # Detailed McDonald's experience
│  ├─ error.ejs              # Generic error page (404 / 500)
│  └─ partials/
│     ├─ head.ejs
│     ├─ header.ejs
│     ├─ nav.ejs
│     ├─ footer.ejs
│     └─ contactModal.ejs
├─ routes/
│  └─ siteRoute.js           # All main routes
└─ utilities/
   └─ handleErrors.js        # Error wrapper + 404 & error handlers
