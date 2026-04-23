import React from 'react';
import OrgNode from './OrgNode';

function OrgChart({ roots, onSelect, colors, showNotes, showExtras, isEditMode, chartRef }) {
  if (!roots.length) {
    return (
      <section className="org-chart-wrap">
        <p className="empty-state">No roles match the current filter/search.</p>
      </section>
    );
  }

  return (
    <section className="org-chart-wrap">
      <div className="org-chart" ref={chartRef}>
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
