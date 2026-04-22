import * as XLSX from 'xlsx';

export const parseExcelWorkbook = async (file) => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  return rows.map((row, i) => ({
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
};
