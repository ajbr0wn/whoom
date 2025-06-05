import React from 'react';

/**
 * Recursively renders branches in a tree-style nested list.
 */
function BranchTree({ branches, currentBranchId, onSelect }) {
  const renderBranch = (branch) => {
    const children = branches.filter(b => b.parentId === branch.id);
    return (
      <li key={branch.id}>
        <button
          onClick={() => onSelect(branch.id)}
          disabled={branch.id === currentBranchId}
        >
          {branch.name || branch.id}
        </button>
        {children.length > 0 && (
          <ul>
            {children.map(child => renderBranch(child))}
          </ul>
        )}
      </li>
    );
  };

  const roots = branches.filter(b => !b.parentId);
  return (
    <ul className="branch-tree">
      {roots.map(b => renderBranch(b))}
    </ul>
  );
}

export default BranchTree;
