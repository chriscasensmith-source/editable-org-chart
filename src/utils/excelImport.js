import * as XLSX from 'xlsx';
import { normalizeRole } from './orgChartUtils';

export const parseExcelWorkbook = async (file) => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  return rows.map((row, i) =>
    normalizeRole(
      {
        ...row,
        id: row.role_id || row.id,
        name: row.employee_name || row.name,
        reportsTo: row.manager_role_id || row.reportsTo,
        notes: row.notes ? [String(row.notes)] : [],
        statusTags: row.role_status ? [String(row.role_status)] : [],
        isVacant: /vacant|open/i.test(`${row.role_status} ${row.employee_name}`),
        isContractor: /contractor/i.test(`${row.title} ${row.role_status}`),
      },
      i,
    ),
  );
};
