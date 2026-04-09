# Editable Org Chart Tool

A lightweight single-page org chart app driven by one editable CSV file.

## What this project does

- Reads `org_data.csv` as the source of truth.
- Shows two scenario views:
  - **Current State**
  - **Proposed Future State**
- Uses `manager_role_id` to draw reporting lines.
- Highlights vacant roles clearly.
- Provides simple filters for **department** and **state**.
- Supports print/export to PDF with a print-friendly layout.

## Files

- `index.html` — the app (plain HTML/CSS/JavaScript, no framework).
- `org_data.csv` — editable source data table.
- `current_org_chart.xlsx` and `future_org_chart.xlsx` — reference files only.

## How to run

Because browsers often block local CSV fetches from `file://`, use a tiny local server:

```bash
python3 -m http.server 8000
```

Then open:

- `http://localhost:8000`

This is the simplest reliable way to let `index.html` load `org_data.csv`.

## How to use

1. Open the page.
2. Click **Current State** or **Proposed Future State**.
3. Optionally filter by **Department** and **State**.
4. Use browser print (`Ctrl/Cmd + P`) to export to PDF.

## How to update data (important)

Update **only** `org_data.csv` for org changes.

### Required columns

```text
role_id, scenario, employee_name, title, manager_role_id, department, state, role_status, notes
```

### Data rules

- `scenario` must be `current` or `future`.
- Keep the same `role_id` across scenarios for the same logical role.
- Use `manager_role_id` to define reporting lines.
- Use `role_status=vacant` for open roles.
- Leave `employee_name` blank for vacant roles.
- Use `notes` when role title, reporting, or proposal status changes.

## Business-friendly editing tips

- Change person in role: update `employee_name` for that row.
- Move role to a new manager: change `manager_role_id`.
- Add a proposed future role: add a new row with `scenario=future`.
- Mark open position: set `role_status=vacant` and clear `employee_name`.

The chart updates automatically from the CSV on page load—no manual box drawing required.
