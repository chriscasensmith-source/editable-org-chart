import React from 'react';

function Toolbar({
  scenario,
  setScenario,
  search,
  onSearch,
  departments,
  filterDepartment,
  setFilterDepartment,
  showNotes,
  setShowNotes,
  showExtras,
  setShowExtras,
  showLegend,
  setShowLegend,
  editMode,
  setEditMode,
  printMode,
  setPrintMode,
  onSave,
  saveStatus,
  onAdd,
  onExportCsv,
  onImportExcel,
  onReset,
  onPrint,
}) {
  return (
    <div className="toolbar no-print">
      <select value={scenario} onChange={(e) => setScenario(e.target.value)}>
        <option value="current">Current State</option>
        <option value="future">Future State</option>
      </select>
      <input placeholder="Search name or title" value={search} onChange={(e) => onSearch(e.target.value)} />
      <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
        <option value="">All departments</option>
        {departments.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>
      <label><input type="checkbox" checked={editMode} onChange={(e) => setEditMode(e.target.checked)} />Edit mode</label>
      <label><input type="checkbox" checked={showNotes} onChange={(e) => setShowNotes(e.target.checked)} />Show notes</label>
      <label><input type="checkbox" checked={showExtras} onChange={(e) => setShowExtras(e.target.checked)} />Show extra lines</label>
      <label><input type="checkbox" checked={showLegend} onChange={(e) => setShowLegend(e.target.checked)} />Show legend</label>
      <select value={printMode} onChange={(e) => setPrintMode(e.target.value)}>
        <option value="presentation">Print: Presentation</option>
        <option value="detailed">Print: Detailed</option>
      </select>
      <button onClick={onSave}>Save Changes</button>
      <span className="save-status">{saveStatus}</span>
      <button onClick={onAdd}>Add Box</button>
      <button onClick={onExportCsv}>Export CSV</button>
      <label className="file-button">Import Excel<input type="file" accept=".xlsx,.xls" onChange={onImportExcel} /></label>
      <button onClick={onReset}>Reset Data</button>
      <button onClick={onPrint}>Print 11x17</button>
    </div>
  );
}

export default Toolbar;
