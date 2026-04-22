import React from 'react';

const toMultiline = (arr) => (arr || []).join('\n');
const fromMultiline = (text) => text.split('\n').map((line) => line.trim()).filter(Boolean);

function EditorPanel({ selected, roles, onClose, onUpdate, onDelete, onDuplicate, departments, onColorChange, colors }) {
  if (!selected) return null;

  return (
    <aside className="editor-panel no-print">
      <header>
        <h3>Edit Role</h3>
        <button onClick={onClose}>Close</button>
      </header>
      <label>Name<input value={selected.name} onChange={(e) => onUpdate({ ...selected, name: e.target.value })} /></label>
      <label>Title<input value={selected.title} onChange={(e) => onUpdate({ ...selected, title: e.target.value })} /></label>
      <label>Department
        <input list="dept-list" value={selected.department} onChange={(e) => onUpdate({ ...selected, department: e.target.value, colorCategory: e.target.value })} />
        <datalist id="dept-list">{departments.map((d) => <option key={d} value={d} />)}</datalist>
      </label>
      <label>Reports To
        <select value={selected.reportsTo || ''} onChange={(e) => onUpdate({ ...selected, reportsTo: e.target.value || null })}>
          <option value="">(No manager/root)</option>
          {roles.filter((r) => r.id !== selected.id).map((r) => <option key={r.id} value={r.id}>{r.name} — {r.title}</option>)}
        </select>
      </label>
      <label>Status Tags (one per line)
        <textarea value={toMultiline(selected.statusTags)} onChange={(e) => onUpdate({ ...selected, statusTags: fromMultiline(e.target.value) })} />
      </label>
      <label>Extra Lines (one per line)
        <textarea value={toMultiline(selected.extraLines)} onChange={(e) => onUpdate({ ...selected, extraLines: fromMultiline(e.target.value) })} />
      </label>
      <label>Notes (one per line)
        <textarea value={toMultiline(selected.notes)} onChange={(e) => onUpdate({ ...selected, notes: fromMultiline(e.target.value) })} />
      </label>
      <div className="inline-checks">
        <label><input type="checkbox" checked={selected.isVacant} onChange={(e) => onUpdate({ ...selected, isVacant: e.target.checked })} />Vacant / Open Role</label>
        <label><input type="checkbox" checked={selected.isContractor} onChange={(e) => onUpdate({ ...selected, isContractor: e.target.checked })} />Contractor</label>
        <label><input type="checkbox" checked={selected.isHidden} onChange={(e) => onUpdate({ ...selected, isHidden: e.target.checked })} />Hide from Chart</label>
      </div>
      <label>Border Style
        <select value={selected.boxStyle?.borderStyle || 'solid'} onChange={(e) => onUpdate({ ...selected, boxStyle: { ...selected.boxStyle, borderStyle: e.target.value } })}>
          <option value="solid">Solid</option>
          <option value="none">No Outline</option>
          <option value="dashed">Dashed</option>
        </select>
      </label>
      <label>Department Color
        <input type="color" value={colors[selected.colorCategory || selected.department] || '#f7f7f7'} onChange={(e) => onColorChange(selected.colorCategory || selected.department, e.target.value)} />
      </label>
      <div className="panel-actions">
        <button onClick={() => onDuplicate(selected.id)}>Duplicate</button>
        <button className="danger" onClick={() => onDelete(selected.id)}>Delete</button>
      </div>
    </aside>
  );
}

export default EditorPanel;
