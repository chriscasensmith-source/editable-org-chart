import React from 'react';

function OrgNode({ node, onSelect, colors, showNotes, showExtras, isEditMode }) {
  return (
    <li>
      <button
        type="button"
        className={`org-node ${node.isVacant ? 'vacant' : ''} ${node.isContractor ? 'contractor' : ''}`}
        style={{
          backgroundColor: colors[node.colorCategory || node.department],
          borderStyle: node.boxStyle?.borderStyle || 'solid',
          borderWidth: node.boxStyle?.borderWidth || 1,
        }}
        onClick={() => onSelect(node)}
      >
        <div className="node-name">{node.name || 'Open Role'}</div>
        <div className="node-title">{node.title}</div>
        <div className="node-meta">{node.department}</div>
        {!!node.statusTags?.length && (
          <div className="tag-row">
            {node.statusTags.map((tag) => (
              <span className="tag" key={tag}>{tag}</span>
            ))}
          </div>
        )}
        {showExtras && !!node.extraLines?.length && (
          <ul className="detail-list">
            {node.extraLines.map((line, idx) => <li key={`${node.id}-extra-${idx}`}>{line}</li>)}
          </ul>
        )}
        {showNotes && !!node.notes?.length && (
          <ul className="detail-list notes">
            {node.notes.map((line, idx) => <li key={`${node.id}-note-${idx}`}>{line}</li>)}
          </ul>
        )}
        {isEditMode && <div className="edit-hint">Click to edit</div>}
      </button>
      {!!node.children?.length && (
        <ul>
          {node.children.map((child) => (
            <OrgNode
              key={child.id}
              node={child}
              onSelect={onSelect}
              colors={colors}
              showNotes={showNotes}
              showExtras={showExtras}
              isEditMode={isEditMode}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default OrgNode;
