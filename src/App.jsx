import React, { useEffect, useMemo, useState } from 'react';
import startingData from './data/orgChartData.json';
import OrgChart from './components/OrgChart';
import EditorPanel from './components/EditorPanel';
import Toolbar from './components/Toolbar';
import { parseExcelWorkbook } from './utils/excelImport';
import { buildTree, defaultDepartmentColors, downloadFile, getDisplayRoleIds, normalizeRole, rolesToCsv } from './utils/orgChartUtils';

const clone = (obj) => JSON.parse(JSON.stringify(obj));
const STORAGE_KEY = 'editable-org-chart-state-v1';

const getInitialState = () => {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (!cached) return clone(startingData.scenarios);
    const parsed = JSON.parse(cached);
    if (!parsed || typeof parsed !== 'object') return clone(startingData.scenarios);
    return Object.fromEntries(
      Object.entries(parsed).map(([key, roles]) => [key, Array.isArray(roles) ? roles.map(normalizeRole) : []]),
    );
  } catch {
    return clone(startingData.scenarios);
  }
};

function App() {
  const [colors, setColors] = useState(defaultDepartmentColors);
  const [scenario, setScenario] = useState('future');
  const [scenarioData, setScenarioData] = useState(getInitialState);
  const [search, setSearch] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [showExtras, setShowExtras] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [editMode, setEditMode] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [printMode, setPrintMode] = useState('presentation');

  const roles = scenarioData[scenario] || [];
  const departments = useMemo(() => [...new Set(roles.map((r) => r.department))].sort(), [roles]);

  const displayRoleIds = useMemo(() => getDisplayRoleIds(roles, search, filterDepartment), [roles, search, filterDepartment]);
  const tree = useMemo(() => buildTree(roles.filter((r) => displayRoleIds.has(r.id))), [roles, displayRoleIds]);
  const selected = roles.find((r) => r.id === selectedId) || null;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarioData));
  }, [scenarioData]);

  const updateRole = (updated) => {
    const isSelfManager = updated.reportsTo === updated.id;
    if (isSelfManager) {
      alert('A role cannot report to itself.');
      return;
    }
    setScenarioData((prev) => ({ ...prev, [scenario]: prev[scenario].map((r) => (r.id === updated.id ? updated : r)) }));
  };

  const addRole = () => {
    const id = `R${String(Date.now()).slice(-6)}`;
    const role = normalizeRole(
      {
        id,
        name: 'New Role',
        title: 'Title',
        department: 'General',
        reportsTo: null,
        isVacant: true,
      },
      0,
    );
    setScenarioData((prev) => ({ ...prev, [scenario]: [...prev[scenario], role] }));
    setSelectedId(id);
  };

  const deleteRole = (id) => {
    setScenarioData((prev) => ({
      ...prev,
      [scenario]: prev[scenario].filter((r) => r.id !== id).map((r) => (r.reportsTo === id ? { ...r, reportsTo: null } : r)),
    }));
    setSelectedId(null);
  };

  const duplicateRole = (id) => {
    const original = roles.find((r) => r.id === id);
    if (!original) return;
    const copy = { ...clone(original), id: `R${String(Date.now()).slice(-6)}`, name: `${original.name} (Copy)` };
    setScenarioData((prev) => ({ ...prev, [scenario]: [...prev[scenario], copy] }));
    setSelectedId(copy.id);
  };

  const exportJson = () => downloadFile('org-chart-updated.json', JSON.stringify({ scenario, scenarios: scenarioData, colors }, null, 2));
  const exportCsv = () => downloadFile('org-chart-updated.csv', rolesToCsv(roles), 'text/csv');

  const importJson = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (parsed.scenarios && typeof parsed.scenarios === 'object') {
        const next = Object.fromEntries(
          Object.entries(parsed.scenarios).map(([key, importedRoles]) => [key, (importedRoles || []).map(normalizeRole)]),
        );
        setScenarioData(next);
      } else if (Array.isArray(parsed.roles)) {
        setScenarioData((prev) => ({ ...prev, [scenario]: parsed.roles.map(normalizeRole) }));
      }
      if (parsed.colors && typeof parsed.colors === 'object') setColors(parsed.colors);
    } catch {
      alert('Invalid JSON file.');
    }
    event.target.value = '';
  };

  const importExcel = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const importedRoles = await parseExcelWorkbook(file);
      setScenarioData((prev) => ({ ...prev, [scenario]: importedRoles.map(normalizeRole) }));
    } catch {
      alert('Unable to parse workbook. Please verify the file format.');
    }
    event.target.value = '';
  };

  const resetData = () => {
    setScenarioData(clone(startingData.scenarios));
    setColors(defaultDepartmentColors);
    setSelectedId(null);
  };

  return (
    <div className={`app ${printMode === 'detailed' ? 'print-detailed' : 'print-presentation'}`}>
      <header className="page-header no-print">
        <h1>Org Chart Editor</h1>
        <p>Editable, printable org chart built from one-time Excel imports and managed in-browser.</p>
      </header>
      <Toolbar
        scenario={scenario}
        setScenario={setScenario}
        search={search}
        onSearch={setSearch}
        departments={departments}
        filterDepartment={filterDepartment}
        setFilterDepartment={setFilterDepartment}
        showNotes={showNotes}
        setShowNotes={setShowNotes}
        showExtras={showExtras}
        setShowExtras={setShowExtras}
        showLegend={showLegend}
        setShowLegend={setShowLegend}
        editMode={editMode}
        setEditMode={setEditMode}
        printMode={printMode}
        setPrintMode={setPrintMode}
        onAdd={addRole}
        onExportJson={exportJson}
        onExportCsv={exportCsv}
        onImportJson={importJson}
        onImportExcel={importExcel}
        onReset={resetData}
        onPrint={() => window.print()}
      />
      {showLegend && (
        <section className="legend no-print">
          <strong>Legend:</strong>
          <span className="pill">Vacant/Open</span>
          <span className="pill contractor">Contractor</span>
          <span className="pill">Custom tags editable per box</span>
        </section>
      )}
      <OrgChart
        roots={tree}
        onSelect={(node) => editMode && setSelectedId(node.id)}
        colors={colors}
        showNotes={showNotes || printMode === 'detailed'}
        showExtras={showExtras || printMode === 'detailed'}
        isEditMode={editMode}
      />
      <EditorPanel
        selected={selected}
        roles={roles}
        onClose={() => setSelectedId(null)}
        onUpdate={updateRole}
        onDelete={deleteRole}
        onDuplicate={duplicateRole}
        departments={departments}
        onColorChange={(department, color) => setColors((prev) => ({ ...prev, [department]: color }))}
        colors={colors}
      />
    </div>
  );
}

export default App;
