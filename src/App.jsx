import React, { useMemo, useState } from 'react';
import startingData from './data/orgChartData.json';
import OrgChart from './components/OrgChart';
import EditorPanel from './components/EditorPanel';
import Toolbar from './components/Toolbar';
import { buildTree, defaultDepartmentColors, downloadFile, rolesToCsv } from './utils/orgChartUtils';

const clone = (obj) => JSON.parse(JSON.stringify(obj));

function App() {
  const [colors, setColors] = useState(defaultDepartmentColors);
  const [scenario, setScenario] = useState('future');
  const [scenarioData, setScenarioData] = useState(clone(startingData.scenarios));
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

  const filteredRoles = useMemo(() => {
    const q = search.trim().toLowerCase();
    return roles.filter((r) => {
      if (filterDepartment && r.department !== filterDepartment) return false;
      if (!q) return true;
      return `${r.name} ${r.title}`.toLowerCase().includes(q);
    });
  }, [roles, search, filterDepartment]);

  const filteredIds = new Set(filteredRoles.map((r) => r.id));
  const tree = useMemo(() => buildTree(roles.filter((r) => filteredIds.has(r.id))), [roles, filteredIds]);
  const selected = roles.find((r) => r.id === selectedId) || null;

  const updateRole = (updated) => {
    setScenarioData((prev) => ({ ...prev, [scenario]: prev[scenario].map((r) => (r.id === updated.id ? updated : r)) }));
  };

  const addRole = () => {
    const id = `R${String(Date.now()).slice(-6)}`;
    const role = {
      id,
      name: 'New Role',
      title: 'Title',
      department: 'General',
      reportsTo: null,
      notes: [],
      statusTags: [],
      extraLines: [],
      isVacant: true,
      isContractor: false,
      isHidden: false,
      boxStyle: { borderStyle: 'solid', borderWidth: 1 },
      colorCategory: 'General',
    };
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
      if (parsed.scenarios && typeof parsed.scenarios === 'object') setScenarioData(parsed.scenarios);
      else if (Array.isArray(parsed.roles)) setScenarioData((prev) => ({ ...prev, [scenario]: parsed.roles }));
      if (parsed.colors && typeof parsed.colors === 'object') setColors(parsed.colors);
    } catch {
      alert('Invalid JSON file.');
    }
    event.target.value = '';
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
