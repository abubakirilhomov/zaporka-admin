import React from "react";

const CustomTable = ({ data, columns, emptyMessage, onSort, onRowClick, actions }) => {
  const handleSort = (key) => {
    if (onSort) {
      onSort(key);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>
                {column.sortable ? (
                  <button onClick={() => handleSort(column.key)} className="btn btn-ghost">
                    {column.label}
                  </button>
                ) : (
                  column.label
                )}
              </th>
            ))}
            {actions && <th>Действия</th>}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr
                key={row._id || index}
                onClick={() => onRowClick && onRowClick(row)}
                className="cursor-pointer hover:bg-base-200"
              >
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render
                      ? column.render(row[column.key]) // Pass the specific value, not the entire row
                      : row[column.key] || "Н/Д"}
                  </td>
                ))}
                {actions && (
                  <td>
                    {actions.map((action, idx) => (
                      <button
                        key={idx}
                        className={`btn ${action.className}`}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                          action.onClick(row);
                        }}
                      >
                        {action.icon} {action.label}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;