import React from 'react';
import OrgNode from './OrgNode';

function OrgChart({ roots, onSelect, colors, showNotes, showExtras, isEditMode }) {
  return (
    <section className="org-chart-wrap">
      <div className="org-chart">
        <ul>
          {roots.map((root) => (
            <OrgNode
              key={root.id}
              node={root}
              onSelect={onSelect}
              colors={colors}
              showNotes={showNotes}
              showExtras={showExtras}
              isEditMode={isEditMode}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default OrgChart;
