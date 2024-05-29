import React from 'react';
import { FaTrashAlt } from "react-icons/fa";

const DEFAULT_COLUMN_COUNT = 3;

const DynamicTableEditor = ({ tableData, setTableData }) => {
  const addRow = () => {
    if (tableData.length === 0) {
      const newRow = Array(DEFAULT_COLUMN_COUNT).fill('');
      setTableData([newRow]);
    } else {
      const newRow = Array(tableData[0].length).fill('');
      setTableData([...tableData, newRow]);
    }
  };

  const removeRow = (rowIndex) => {
    const updatedTableData = tableData.filter((_, index) => index !== rowIndex);
    setTableData(updatedTableData);
  };

  const addColumn = () => {
    const updatedTableData = tableData.map(row => [...row, '']);
    setTableData(updatedTableData);
  };

  const removeColumn = (colIndex) => {
    const updatedTableData = tableData.map(row => row.filter((_, index) => index !== colIndex));
    setTableData(updatedTableData);
  };

  const updateCellValue = (rowIndex, colIndex, value) => {
    const updatedTableData = tableData.map((row, i) =>
      i === rowIndex ? row.map((cell, j) => (j === colIndex ? value : cell)) : row
    );
    setTableData(updatedTableData);
  };

  return (
    <div className="my-4 overflow-auto">
      <table className="border-collapse table-auto w-full">
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex} className="border border-gray-400 p-2">
                  <input
                    className="p-1 w-full"
                    type="text"
                    value={cell}
                    onChange={(e) => updateCellValue(rowIndex, colIndex, e.target.value)}
                  />
                </td>
              ))}
              <td className="p-2">
                <button
                  className="text-red-600 font-bold py-1 px-2 rounded"
                  onClick={() => removeRow(rowIndex)}
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
          {tableData.length > 0 && (
            <tr>
              {tableData[0].map((_, colIndex) => (
                <td key={colIndex} className="p-2">
                  <button
                    className="text-red-600 font-bold py-1 px-2 rounded"
                    onClick={() => removeColumn(colIndex)}
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              ))}
              <td className="p-2"></td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="my-5">
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={addRow}
        >
          اضافه کردن سطر
        </button>
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={addColumn}
        >
          اضافه کردن ستون
        </button>
      </div>
    </div>
  );
};

export default DynamicTableEditor;
