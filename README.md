# Editable Org Chart (GitHub Pages Ready)

A modern, business-friendly org chart editor and printer built for **Current State** and **Future State** planning.

This project treats the Excel workbook as a **one-time starting source**, then manages data in the app as structured JSON.

## What this app does

- Shows a real top-down org chart (not a spreadsheet view).
- Supports **Current** and **Future** scenarios.
- Lets non-technical users edit org boxes directly in the browser.
- Lets users add, duplicate, delete, hide, and recolor roles.
- Supports notes, extra detail lines, and status badges.
- Exports and imports JSON so changes can be saved outside GitHub.
- Exports CSV for spreadsheet sharing.
- Prints cleanly on **11 x 17 landscape** with presentation and detailed modes.

## One-time Excel import approach

The workbook is used once to create normalized app data.

- Future source workbook: `future_org_chart.xlsx` (equivalent to uploaded future workbook input).
- Import script: `scripts/importFromExcel.mjs`.
- Normalized data output: `src/data/orgChartData.json`.

After import, the app renders from JSON data instead of spreadsheet coordinates.

## Project structure

- `src/components/` – chart, editor panel, toolbar UI.
- `src/data/` – normalized org chart data JSON.
- `src/utils/` – chart helpers, exports, optional runtime Excel parser.
- `src/styles/` – modern UI + print stylesheet.
- `scripts/` – one-time Excel import script.
- `public/` – static assets.

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start dev server:
   ```bash
   npm run dev
   ```
3. Open the local URL shown in your terminal.

## Build for production

```bash
npm run build
```

The output will be in `dist/`.

## Deploy to GitHub Pages

This repo is configured so Vite uses a GitHub Pages-safe base path when `GITHUB_PAGES=true`.

1. Build for pages:
   ```bash
   GITHUB_PAGES=true npm run build
   ```
2. Deploy `dist/` to GitHub Pages (Actions or `gh-pages` branch flow).

## How non-technical users edit the org chart

1. Turn on **Edit mode**.
2. Click a role box.
3. In the right editor panel, update:
   - Name
   - Title
   - Manager (reporting line)
   - Department
   - Notes
   - Extra lines
   - Status tags
   - Vacant / contractor flags
   - Hide from chart
   - Border style (including no outline)
   - Department color

Buttons include:
- **Add Box**
- **Duplicate**
- **Delete**

## Save and reload edits

Because this is static hosting:

- Use **Export JSON** to save changes.
- Use **Import JSON** later to continue editing.
- Use **Export CSV** for optional tabular sharing.

## Print on 11 x 17

1. Choose print mode in the toolbar:
   - **Presentation** (clean leadership view)
   - **Detailed** (shows notes/details)
2. Click **Print 11x17**.
3. In print dialog, keep **Landscape** and **11 x 17** paper.

The stylesheet hides editing controls and keeps chart connectors for print.

## One-time source update workflow (if needed)

If you get a new workbook and want to rebuild the future-state seed:

```bash
npm run import:excel -- "future org chart test.xlsx" src/data/orgChartData.json
```

Then commit the updated JSON.

## Files that matter most

- `src/App.jsx` – app orchestration and state.
- `src/components/OrgChart.jsx` – hierarchy rendering.
- `src/components/EditorPanel.jsx` – no-code editing experience.
- `src/styles/app.css` – modern visual styling + 11x17 print rules.
- `src/data/orgChartData.json` – single editable source data model.
- `scripts/importFromExcel.mjs` – one-time Excel conversion script.
