# Editable Org Chart Tool

A lightweight, business-friendly org chart app powered by a single CSV source file.

## What this tool does

- Builds a **true top-down org chart tree** from `org_data.csv`.
- Uses **Nichole Jones (`R001`)** as the single root node.
- Supports two views:
  - **Current State**
  - **Proposed Future State**
- Shows reporting lines from `manager_role_id`.
- Highlights vacant roles clearly.
- Uses neutral `performance_band` statuses with color coding.
- Shows extra future-planning focus fields in Future view.
- Includes print-friendly layout for PDF export.
- Includes an in-browser CSV editor with apply + download actions.

## Project files

- `index.html` — single-page app (plain HTML/CSS/JavaScript).
- `org_data.csv` — editable source of truth.
- `current_org_chart.xlsx` / `future_org_chart.xlsx` — reference inputs only.

## Run locally

Because browsers block CSV loading in many `file://` cases, run a tiny local server:

```bash
python3 -m http.server 8000
```

Open:

- `http://localhost:8000`

## Edit + export workflow

You can now edit data directly in the browser:

1. Click **Edit Data**.
2. Update CSV text.
3. Click **Apply Edits** to re-render immediately.
4. Click **Download CSV** to save your updated file.
5. Use **Print / Export PDF** for presentation output.

## Publish on GitHub Pages (important)

Use this checklist so the page works after publishing:

1. Push **both** `index.html` and `org_data.csv` to the branch used by GitHub Pages.
2. In repo settings, enable Pages and point it to the correct branch/folder.
3. Wait for Pages to rebuild, then hard refresh the site.
4. The app requests `org_data.csv` with cache-busting and `no-store` to reduce stale-file issues after deployment.

The app first tries to load `org_data.csv`.  
If that load fails, it falls back to embedded data in `index.html` and shows a message at the top.
That means the page still renders, but updates in `org_data.csv` will not appear until the CSV is correctly published.

## Data model (`org_data.csv`)

Required columns:

```text
role_id,scenario,employee_name,title,manager_role_id,department,state,role_status,performance_band,future_focus_1,future_focus_2,future_focus_3,notes
```

### Field rules

- `scenario`: `current` or `future`
- `role_id`: stable across scenarios for the same logical role
- `manager_role_id`: points to another `role_id` to define reporting lines
- `role_status`: use `vacant` for open roles; leave `employee_name` blank for vacant roles
- `performance_band`: neutral status values only:
  - `needs_support`
  - `solid`
  - `strong`
- Current-state rows can leave `performance_band` blank if you do not want ratings shown.
- `future_focus_1` / `future_focus_2` / `future_focus_3`:
  - planning priorities shown in **Proposed Future State** cards
  - can be blank for current-state rows

## How to update

1. Edit `org_data.csv`.
2. Keep one row per role per scenario.
3. Keep `role_id` consistent between current/future rows.
4. Update `manager_role_id` when reporting lines change.
5. Add or update future planning with `future_focus_1..3` on future rows.
6. Refresh the page.

No manual box drawing is needed—the chart is rendered from the CSV.

## Printing / export

Use browser print (`Ctrl/Cmd + P`) and save as PDF. The page includes print styles for presentation output.
