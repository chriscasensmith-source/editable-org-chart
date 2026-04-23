import fs from 'node:fs';
import path from 'node:path';
import XLSX from 'xlsx';

const workbookPath = process.argv[2] || 'future_org_chart.xlsx';
const outputPath = process.argv[3] || 'src/data/orgChartData.json';

const wb = XLSX.readFile(workbookPath);
const sheetName = wb.SheetNames[0];
const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { defval: '' });

const roles = rows.map((row, i) => ({
  id: row.role_id || row.id || `R${String(i + 1).padStart(3, '0')}`,
  name: row.employee_name || row.name || 'Open Role',
  title: row.title || '',
  department: row.department || 'General',
  reportsTo: row.manager_role_id || row.reportsTo || null,
  notes: row.notes ? [String(row.notes)] : [],
  statusTags: row.role_status ? [String(row.role_status)] : [],
  extraLines: [],
  isVacant: /vacant|open/i.test(`${row.role_status} ${row.employee_name}`),
  isContractor: /contractor/i.test(`${row.title} ${row.role_status}`),
  isHidden: false,
  boxStyle: { borderStyle: 'solid', borderWidth: 1 },
  colorCategory: row.department || 'General',
}));

const result = {
  source: { future: `${path.basename(workbookPath)} (one-time import)` },
  scenarios: { future: roles, current: [] },
};

fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
console.log(`Imported ${roles.length} roles from ${workbookPath} -> ${outputPath}`);
