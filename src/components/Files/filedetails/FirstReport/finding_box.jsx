import React, { useState, useContext } from 'react';
import { FaComments } from "react-icons/fa";
import PopUpModal from './PopUpModal'; // Import the modal component
import RenderContent from './report_element'; // Import the component
import { PermissionsContext } from '../../../../App'; // Import the context

const FindingComponent = ({ finding, editedData, isEditing, handleInputChange, findingGroup }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const permissions = useContext(PermissionsContext);

  const handleCommentIconClick = () => {
    setIsModalOpen(true);
  };

  const findingData = editedData[finding] || {};

  const englishToPersianNumber = (number) => {
    if (number === undefined || number === null) {
      return '';
    }
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    return String(number).replace(/[0-9]/g, (match) => persianDigits[parseInt(match)]);
  };

  
  return (
    <div className="bg-slate-200 my-8 p-7">
      <div className="flex justify-between items-center">
        <h4 className="text-2xl font-bold">یافته ها</h4>
        {permissions?.report_comment && (
          <span 
            className="text-white bg-primary rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
            onClick={handleCommentIconClick}
          >
            <FaComments />
          </span>
        )}
      </div>
      <div className="px-5 pb-2">
        {findingData.titles && (
          <>
            <h4 className="text-xl font-bold my-8 py-1">عنوان یافته</h4>
            {isEditing ? (
              <textarea
                className="w-full p-2 rounded-lg border border-gray-300"
                rows={4}
                value={findingData.titles?.map(item => englishToPersianNumber(item.text)).join('\n') || ''}
                onChange={(e) => handleInputChange(e, `${finding}.titles`)}
              />
            ) : (
              <RenderContent content={findingData.titles.map(item => ({ ...item, text: englishToPersianNumber(item.text) }))} />
            )}
          </>
        )}

        {findingData.description && (
          <>
            <h4 className="text-xl font-bold my-8 py-1">توضیحات</h4>
            {isEditing ? (
              <textarea
                className="w-full p-2 rounded-lg border border-gray-300"
                rows={4}
                value={englishToPersianNumber(findingData.description) || ''}
                onChange={(e) => handleInputChange(e, `${finding}.description`)}
              />
            ) : (
              <p className="mb-6">{englishToPersianNumber(findingData.description)}</p>
            )}
          </>
        )}

          {findingData.content && findingData.content.data && (
            <>
              <h4 className="text-xl font-bold my-8 py-1">محتوا</h4>
              {isEditing ? (
                <textarea
                  className="w-full p-2 rounded-lg border border-gray-300"
                rows={4}
                value={findingData.content.data.map(item => englishToPersianNumber(item.text)).join('\n') || ''}
                onChange={(e) => handleInputChange(e, `${finding}.content.data`)}
              />
            ) : (
              findingData.content.data.map((contentItem, index) => (
                <div key={index} className="mt-6">
        <RenderContent content={[{ ...contentItem, text: englishToPersianNumber(contentItem.text) }]} />
                  {contentItem.table && contentItem.table.length > 0 && (
                    <table className="table-auto w-full" dir="">
                      <thead>
                        <tr className="bg-gray-200">
                          {contentItem.table[0].map((column, colIndex) => (
                            <th key={colIndex} className="px-4 py-2">{englishToPersianNumber(column)}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {contentItem.table.slice(1).map((row, rowIndex) => (
                          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className={`px-4 py-2 text-center ${cell < 0 ? 'text-red-500' : ''}`}>
                                {englishToPersianNumber(cell)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              ))
            )}
          </>
        )}
      </div>


      <h4 className="text-xl font-bold my-8 py-1">ریسک ها</h4>
        {isEditing ? (
          <textarea
            className="w-full p-2 rounded-lg border border-gray-300"
            rows={4}
            value={findingData.risk?.map(item => englishToPersianNumber(item.text)).join('\n') || ''}
            onChange={(e) => handleInputChange(e, `${finding}.risk`)}
          />
        ) : (
          <RenderContent content={findingData.risk} />
        )}


        <h4 className="text-xl font-bold my-8 py-1">پیشنهاد ها</h4>
        {isEditing ? (
          <textarea
            className="w-full p-2 rounded-lg border border-gray-300"
            rows={4}
            value={findingData.suggestions?.map(item => englishToPersianNumber(item.text)).join('\n') || ''}
            onChange={(e) => handleInputChange(e, `${finding}.suggestions`)}
          />
        ) : (
          <RenderContent content={findingData.suggestions} />
        )}
  

      {isModalOpen && (
        <PopUpModal
          finding={finding}
          onClose={() => setIsModalOpen(false)}
          findingGroup={findingGroup}
        />
      )}
    </div>
    
  );
};

export default FindingComponent;
