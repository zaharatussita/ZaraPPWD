# Copilot Instructions for this repository

## Repository overview

This repository is a collection of static front-end practice projects, not a single app. The root contains a storefront demo (`index.html`, `style.css`, `script.js`) and several standalone folders such as `websitemusikzara/`, `kopinihbos/`, `pertemuan 11/`, and `ZARA_HANDMADE ppwd/` that each contain their own HTML/CSS/JS page(s). The codebase is primarily plain HTML, CSS, and jQuery rather than a framework-based application.

## Build, test, and lint

There is no `package.json`, no build pipeline, and no automated test or lint configuration in this repository.

Validation is browser-based and manual:

- Open the relevant HTML file directly in a browser, or
- Serve the repository locally from the project root:
  - `cd "C:\laragon\www\ZaharatussitaPPWDStudykasus"`
  - `python -m http.server 8000`
  - Open `http://localhost:8000/` or the specific project folder in a browser

The `ZARA_HANDMADE ppwd/README.txt` specifically notes that you should open `index.html` or `profil.html` directly in the browser.

There are no single-test commands to run. Treat browser/manual validation as the default verification path.

The deployment workflow in `.github/workflows/main.yml` triggers an aaPanel webhook on pushes to `main`; do not alter deployment behavior unless explicitly requested.

## High-level architecture

- `index.html` provides the storefront shell: navigation, product grid, cart sidebar, buyer modal, toast notification, and footer.
- `style.css` contains the full theme, layout, responsive styling, and visual states for the storefront.
- `script.js` holds the app state and behavior: product catalog data, filters, search, cart updates, totals, discount logic, modal validation, and purchase confirmation flow.
- The app uses in-memory state (`cart`, `currentFilter`, `searchKeyword`) and renders DOM elements dynamically with jQuery.
- Most pages rely on CDN-hosted dependencies such as jQuery, Google Fonts, and Font Awesome; these external URLs are part of normal local usage.
- The project is educational/demo-oriented and self-contained: there is no backend, no API, and no build tooling.

## Conventions to preserve

- Prefer vanilla JavaScript and the repo's existing jQuery patterns over introducing React, TypeScript, or a framework.
- Keep names and labels in Indonesian when they match the original coursework and storefront UI (`nama`, `alamat`, `hp`, `Keranjang`, `Checkout`, etc.).
- Follow the existing DOM/event style: `$(document).ready(...)` for initialization and delegated event handlers such as `$(document).on(...)` when working with dynamically rendered elements.
- Maintain the current data-object shape when editing product items: `id`, `nama`, `harga`, `kategori`, `icon`, `desc`, `badge`, and `badgeType`.
- Keep page-local assets relative to the folder being edited; do not assume a single global app structure.
- Preserve the static-site behavior of these course projects rather than turning them into a production application.
- If a change targets a specific subproject (for example `ZARA_HANDMADE ppwd`), keep the fix isolated to that folder instead of changing unrelated static pages.

## Working style for this repo

- Make focused, surgical edits in the relevant HTML/CSS/JS file instead of broad refactors.
- Prefer matching the surrounding code style and structure over introducing new conventions.
- Verify UI changes by reloading the page and checking the behavior in the browser.
- Treat the repository as a set of practice exercises: small, self-contained, front-end-only implementations.
