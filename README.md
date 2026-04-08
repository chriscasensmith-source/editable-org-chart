# Editable Org Chart Tool

## What this project is

This project is for building a simple, editable org chart tool based on one source data table.

The goal is to stop manually redrawing org charts every time something changes.

Instead, the org chart will be generated from a data file that can be updated as roles, reporting lines, and vacancies change.

## Reference files

These files are reference inputs only:

- current_org_chart.xlsx
- future_org_chart.xlsx

They are not meant to be the long term source of truth.

## Source of truth

The long term source of truth for this tool should be a single editable data table.

That file will likely be:

- org_data.csv

This file will contain one row per role for the current state and future state.

## What the tool should do

The tool should:

- show a Current State view
- show a Proposed Future State view
- show reporting lines clearly
- make vacant roles easy to identify
- be easy to print or export for presentations
- be simple for business users to understand

## Expected data fields

The editable data table should include fields like:

- role_id
- scenario
- employee_name
- title
- manager_role_id
- department
- state
- role_status
- notes

## How updates should work later

Once the tool is built, updates should be made in the data table instead of manually editing the org chart.

Examples:
- if a person changes roles, update the row
- if a role becomes vacant, change role_status
- if a new future role is proposed, add a future row
- if reporting lines change, update manager_role_id

## Notes

The Excel org charts are only starting references.
The maintainable version of this project should be driven by structured data, not by manually drawn boxes.