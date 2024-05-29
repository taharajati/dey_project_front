import React from 'react';


const TableComponent = ({data }) => {
  return (
    <div>
    <table className="table-auto w-full my-8" dir='rtl'>
      <caption className="text-lg font-semibold mb-6">{data.table.caption}</caption>
      <thead>
        <tr className="bg-gray-200">
          {Object.values(data.table.column_names).map((columnName, index) => (
            <th key={index} className="px-4 py-2">{columnName}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.table.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
            {Object.values(rowData).map((cellData, cellIndex) => (
              <td key={cellIndex} className="px-4 py-2 text-center">
                {typeof cellData === 'number' ? cellData.toLocaleString() : cellData}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

export default TableComponent;
