import React from 'react';
import { MdEdit, MdDelete, MdOutlinePlaylistAdd } from 'react-icons/md'; // Common icons for actions

const CustomTable = ({
  data = [], // Array of data objects
  columns = [], // Array of column definitions (e.g., { key, label, render })
  onRowClick, // Function to handle row clicks (e.g., open modal)
  actions = [], // Array of action buttons (e.g., view, edit, delete)
  emptyMessage = 'Нет данных', // Message for empty table
}) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="text-center py-4 text-base-content">{emptyMessage}</div>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-base-content/5 bg-base-100">
      <table className="table w-full">
        <thead>
          <tr className="bg-base-200">
            {columns.map((col, index) => (
              <th
                key={col.key || index}
                className="text-base-content capitalize"
              >
                {col.label || col.key.replace(/([A-Z])/g, ' $1').trim()}
              </th>
            ))}
            {actions.length > 0 && <th className="text-base-content">Действия</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item._id || index}
              className="hover:bg-base-100/80 transition-colors"
              onClick={() => onRowClick && onRowClick(item)}
            >
              {columns.map((col) => (
                <td key={col.key} className="text-base-content">
                  {col.render
                    ? col.render(item[col.key], item)
                    : Array.isArray(item[col.key])
                    ? item[col.key].join(', ')
                    : item[col.key] || 'Н/Д'}
                </td>
              ))}
              {actions.length > 0 && (
                <td>
                  {actions.map((action, actionIndex) => (
                    <button
                      key={actionIndex}
                      className={`btn btn-sm ${action.className || 'btn-primary'}`}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering onRowClick
                        action.onClick(item);
                      }}
                    >
                      {action.icon && React.cloneElement(action.icon, { className: 'mr-2 text-lg' })}
                      {action.label}
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;