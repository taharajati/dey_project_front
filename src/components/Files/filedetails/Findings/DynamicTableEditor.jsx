import React, { useState } from 'react';
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
    const updatedTableData = tableData.filter((row, index) => index !== rowIndex);
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
    <div className="my-4">
  
      
      <table className="border-collapse ">
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex} className="border border-gray-400">
                  <input
                    className=" p-1 w-full"
                    type="text"
                    value={cell}
                    onChange={(e) => updateCellValue(rowIndex, colIndex, e.target.value)}
                  />
                </td>
              ))}
              <td className="">
                <button
                  className="  text-red-600 font-bold py-1 px-2 rounded"
                  onClick={() => removeRow(rowIndex)}
                >
                  <FaTrashAlt />

                </button>
              </td>
            </tr>
          ))}
          <tr>
            {tableData.length > 0 &&
              tableData[0].map((_, colIndex) => (
                <td key={colIndex} className="">
                  <button
                    className=" text-red-600 font-bold py-1 px-2 rounded"
                    onClick={() => removeColumn(colIndex)}
                  >
                    <FaTrashAlt />

                  </button>
                </td>
              ))}
          </tr>
        </tbody>
      </table>
      <button
        className="bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white font-bold py-2 px-4 rounded mr-2 my-5"
        onClick={addRow}
      >
       اضافه کردن سطر
      </button>
      <button
        className="bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white font-bold py-2 px-4 rounded mr-2 my-5"
        onClick={addColumn}
      >
       اضافه کردن ستون
      </button>
    </div>
  );
};

export default DynamicTableEditor;
