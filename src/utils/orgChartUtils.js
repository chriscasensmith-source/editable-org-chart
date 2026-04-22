export const defaultDepartmentColors = {
  Executive: '#DDEBFF',
  'Packaging Operations': '#E8F7E8',
  'Processing Operations': '#FFF2DE',
  'Manufacturing COE': '#F2E8FF',
  Support: '#E5F4F7',
  'Executive Support': '#F0F0F0',
  Warehouse: '#FFE8EC',
  Reliability: '#EAEAEA',
  Engineering: '#E8F0FF',
  'Process Engineering': '#E8EDFF',
  General: '#F7F7F7',
};

export const buildTree = (roles, hiddenIds = new Set()) => {
  const visible = roles.filter((r) => !r.isHidden && !hiddenIds.has(r.id));
  const byId = new Map(visible.map((r) => [r.id, { ...r, children: [] }]));
  const roots = [];
  byId.forEach((node) => {
    if (node.reportsTo && byId.has(node.reportsTo)) {
      byId.get(node.reportsTo).children.push(node);
    } else {
      roots.push(node);
    }
  });
  const sortByName = (arr) => {
    arr.sort((a, b) => a.department.localeCompare(b.department) || a.name.localeCompare(b.name));
    arr.forEach((node) => sortByName(node.children));
  };
  sortByName(roots);
  return roots;
};

export const downloadFile = (name, content, type = 'application/json') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
};

export const rolesToCsv = (roles) => {
  const header = ['id', 'name', 'title', 'department', 'reportsTo', 'notes', 'statusTags', 'extraLines', 'isVacant', 'isContractor', 'isHidden', 'colorCategory'];
  const rows = roles.map((r) => [
    r.id,
    r.name,
    r.title,
    r.department,
    r.reportsTo ?? '',
    (r.notes || []).join(' | '),
    (r.statusTags || []).join(' | '),
    (r.extraLines || []).join(' | '),
    r.isVacant,
    r.isContractor,
    r.isHidden,
    r.colorCategory || r.department,
  ]);
  return [header, ...rows].map((row) => row.map((v) => `"${String(v ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
};
