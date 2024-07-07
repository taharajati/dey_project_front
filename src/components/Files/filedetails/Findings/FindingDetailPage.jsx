import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import ModalFinding from './ModalFinding';
import ModalFinding1 from './ModalFinding1';
import EditModal from './EditModal';


import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useReport } from '../ReportContext';
import { FaTrash } from "react-icons/fa";
import { FaFileUpload } from 'react-icons/fa';

import { MdModeEdit } from "react-icons/md";
import NavList from '../NavList';


const FindingDetailPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const findingGroup = queryParams.get('finding_group');
  const { fileId } = useReport();

  const navigate = useNavigate();

  const [titlesData, setTitlesData] = useState([]);
  const [risksData, setRisksData] = useState([]);
  const [suggestionsData, setSuggestionsData] = useState([]);
  const [contentListData, setContentListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [isContentDetailModalOpen, setIsContentDetailModalOpen] = useState(false); // State for content detail modal

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editContentData, setEditContentData] = useState(null);

  const [editMode, setEditMode] = useState({ type: null, index: null });
  const [editedEntry, setEditedEntry] = useState('');

  const [selectedFile, setSelectedFile] = useState(null);




  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');

      const titlesUrl = `http://188.121.99.245:8080/api/report/finding/titles?report_id=${fileId}&finding_group=${findingGroup}`;
      const titlesResponse = await axios.get(titlesUrl, { headers: { Authorization: `Bearer ${token}` } });
      setTitlesData(titlesResponse.data.data || []);

      const risksUrl = `http://188.121.99.245:8080/api/report/finding/risks?report_id=${fileId}&finding_group=${findingGroup}`;
      const risksResponse = await axios.get(risksUrl, { headers: { Authorization: `Bearer ${token}` } });
      setRisksData(risksResponse.data.data || []);

      const suggestionsUrl = `http://188.121.99.245:8080/api/report/finding/suggestions?report_id=${fileId}&finding_group=${findingGroup}`;
      const suggestionsResponse = await axios.get(suggestionsUrl, { headers: { Authorization: `Bearer ${token}` } });
      setSuggestionsData(suggestionsResponse.data.data || []);

      const contentListUrl = `http://188.121.99.245:8080/api/report/finding/content_list?report_id=${fileId}&finding_group=${findingGroup}`;
      const contentListResponse = await axios.get(contentListUrl, { headers: { Authorization: `Bearer ${token}` } });
      setContentListData(contentListResponse.data.data || []);

    } catch (error) {
      setError('خطا در دریافت اطلاعات');
      setTimeout(() => {
        setError('');
      }, 3000);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEntry = async (entryType, id) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      await axios.delete(`http://188.121.99.245:8080/api/report/finding/content_detail?content_id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage('با موفقیت حذف شد');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      fetchData();
    } catch (error) {
      setError('خطا در حذف اطلاعات');
      setTimeout(() => {
        setError('');
      }, 3000);
      console.error('Error deleting entry:', error);
    }
  };

  const handleGoBack = () => {
    navigate('/yaft');
  };

  const handleAddEntry = async (entryType) => {
    switch (entryType) {
      case 'titles':
        setIsTitleModalOpen(true);
        break;
      case 'risks':
        setIsRiskModalOpen(true);
        break;
      case 'suggestions':
        setIsSuggestionModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleEditEntry = (type, index, currentTitle) => {
    setEditMode({ type, index });
    setEditedEntry(currentTitle);
  };

  const handleEntryChange = (e) => {
    setEditedEntry(e.target.value);
  };

  const handleEntrySave = async () => {
    try {
      const { type, index } = editMode;
      let apiUrl;
      let updatedData;

      const token = localStorage.getItem('accessToken');

      const requestBody = {
        report_id: fileId,
        content: editedEntry,
        finding_group: findingGroup
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      switch (type) {
        case 'titles':
          apiUrl = `http://188.121.99.245:8080/api/report/finding/titles?item_id=${titlesData[index]._id.$oid}`;
          updatedData = [...titlesData];
          updatedData[index].title = editedEntry;
          setTitlesData(updatedData);
          break;
        case 'risks':
          apiUrl = `http://188.121.99.245:8080/api/report/finding/risks?item_id=${risksData[index]._id.$oid}`;
          updatedData = [...risksData];
          updatedData[index].title = editedEntry;
          setRisksData(updatedData);
          break;
        case 'suggestions':
          apiUrl = `http://188.121.99.245:8080/api/report/finding/suggestions?item_id=${suggestionsData[index]._id.$oid}`;
          updatedData = [...suggestionsData];
          updatedData[index].title = editedEntry;
          setSuggestionsData(updatedData);
          break;
        default:
          break;
      }

      await axios.put(apiUrl, requestBody, config);

      setEditMode({ type: null, index: null });
      setSuccessMessage('تغییرات با موفقیت ذخیره شد');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setError('خطا در ذخیره اطلاعات');
      setTimeout(() => {
        setError('');
      }, 3000);
      console.error('Error saving entry:', error);
    }
  };

  const handleAddContentDetail = () => {
    setIsContentDetailModalOpen(true);
  };

  const handleCloseContentDetailModal = () => {
    setIsContentDetailModalOpen(false);
  };

  const handleContentDetailSubmit = async (findingTitleId, contentTitle, content) => {
    try {
      const token = localStorage.getItem('accessToken');
      const requestBody = {
        report_id: fileId,
        finding_group: findingGroup,
        finding_title_id: findingTitleId,
        content_title: contentTitle,
        content: content
      };
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await axios.post('http://188.121.99.245:8080/api/report/finding/content_detail', requestBody, config);
      setSuccessMessage('با موفقیت اضافه شد');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      setIsContentDetailModalOpen(false);
      fetchData(); // Fetch updated content list after adding new content detail
    } catch (error) {
      setError('خطا در اضافه کردن جزئیات محتوا');
      setTimeout(() => {
        setError('');
      }, 3000);
      console.error('Error adding content detail:', error);
    }
  };


  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };


  // Function to handle file selection
const handleFileSelect = (file) => {
  setSelectedFile(file);
};

// Function to handle file upload
const handleFileUpload = async (contentId) => {
  try {
    if (!selectedFile) {
      setError('لطفاً یک فایل را انتخاب کنید');
      setTimeout(() => {
        setError('');
      }, 3000);
      return;
    }

    setLoading(true);

    const token = localStorage.getItem('accessToken');
    const formData = new FormData();
    formData.append('content_id', contentId);

    formData.append('file', selectedFile);

    await axios.post(`http://188.121.99.245:8080/api/report/finding/upload_content_file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });

    setSuccessMessage('با موفقیت بارگزاری شد');
    setSelectedFile(null); // Clear selected file after successful upload
    setLoading(false);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);

    // Optionally, you can fetch updated data after successful upload
    // fetchData();

  } catch (error) {
    setError('خطا در بارگزاری فایل');

    setLoading(false);
    setTimeout(() => {
      setError('');
    }, 3000);
    console.error('Error uploading file:', error);
  }
};

  const handleFileDelete = async (contentId) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`http://188.121.99.245:8080/api/report/finding/delete_content_file?content_id=${contentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSuccessMessage('با موفقیت حذف شد');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      fetchData(); // Refresh content list after file delete
    } catch (error) {
      setError('خطا در حذف فایل');
      setTimeout(() => {
        setError('');
      }, 3000);
      console.error('Error deleting file:', error);
    }
  };
  const handleEditContent = (content) => {
    setEditContentData(content);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditContentData(null);
  };

  const handleEditModalSubmit = async (updatedContent) => {
    try {
      const token = localStorage.getItem('accessToken');
  
      // Transform the updatedContent to the required format
      const formattedContent = {
        content_id: updatedContent._id.$oid,
        finding_title_id: updatedContent.finding_title.$oid,
        content_title: updatedContent.content_title,
        content: updatedContent.content,
      };
  
      console.log("formattedContent", formattedContent);
      await axios.put('http://188.121.99.245:8080/api/report/finding/content_detail', formattedContent, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      setSuccessMessage('با موفقیت ویرایش شد');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      setIsEditModalOpen(false);
      fetchData(); // Refresh the content list after editing
    } catch (error) {
      setError('خطا در ویرایش جزئیات محتوا');
      setIsEditModalOpen(false);
  
      setTimeout(() => {
        setError('');
      }, 3000);
      console.error('Error editing content detail:', error);
    }
  };

  return (
    <>
    <NavList/>
    {isLoading && (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-700"></div>
      </div>
    )}
    <div className="container mx-auto px-4 my-2 " dir="rtl">
      <button onClick={handleGoBack} className="bg-[color:var(--color-primary-variant-02)] py-1 px-3 rounded-lg">
        بازگشت
      </button>

      {/* Display Titles */}
      <h2 className="text-2xl font-semibold my-5 text-[color:var(--color-primary-variant)]">عناوین یافته ها</h2>
      <table className="min-w-full leading-normal">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-right">عناوین یافته ها</th>
            <th className="py-3 px-6 text-right"> </th>
            <th className="py-3 px-6 text-right"> </th>
          </tr>
        </thead>
        <tbody>
          {titlesData.map((title, index) => (
            <tr key={index} className="bg-white border-b border-gray-200">
              <td className="py-3 px-6 text-right">
                {editMode.type === 'titles' && editMode.index === index ? (
                  <input
                    type="text"
                    value={editedEntry}
                    onChange={handleEntryChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  title.title
                )}
              </td>
              <td className="px-4 py-2">
                {editMode.type === 'titles' && editMode.index === index ? (
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-md ml-2"
                    onClick={handleEntrySave}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="text-[color:var(--color-primary)] py-2 px-4 rounded-md"
                    onClick={() => handleEditEntry('titles', index, title.title)}
                  >
                    <MdModeEdit />
                  </button>
                )}
              </td>
              <td className="px-4 py-2">
                <button onClick={() => handleDeleteEntry('titles', title._id.$oid)} className="text-red-500">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => handleAddEntry('titles')} className="bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white px-4 py-2 rounded mb-4 focus:outline-none m-5">
        اضافه کردن
      </button>

      {/* Display Risks */}
      <h2 className="text-2xl font-semibold my-5 text-[color:var(--color-primary-variant)]">ریسک ها</h2>
      <table className="min-w-full leading-normal">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-right ">ریسک ها</th>
            <th className="py-3 px-6 text-right "> </th>
            <th className="py-3 px-6 text-right "> </th>
          </tr>
        </thead>
        <tbody>
          {risksData.map((title, index) => (
            <tr key={index} className="bg-white border-b border-gray-200">
              <td className="py-3 px-6 text-right">
                {editMode.type === 'risks' && editMode.index === index ? (
                  <input
                    type="text"
                    value={editedEntry}
                    onChange={handleEntryChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  title.title
                )}
              </td>
              <td className="px-4 py-2">
                {editMode.type === 'risks' && editMode.index === index ? (
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-md ml-2"
                    onClick={handleEntrySave}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="text-[color:var(--color-primary)] py-2 px-4 rounded-md"
                    onClick={() => handleEditEntry('risks', index, title.title)}
                  >
                    <MdModeEdit />
                  </button>
                )}
              </td>
              <td className="px-4 py-2">
                <button onClick={() => handleDeleteEntry('risks', title._id.$oid)} className="text-red-500">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => handleAddEntry('risks')} className="bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white px-4 py-2 rounded mb-4 focus:outline-none m-5">
        اضافه کردن
      </button>

      {/* Display Suggestions */}
      <h2 className="text-2xl font-semibold my-5 text-[color:var(--color-primary-variant)] ">پیشنهادات</h2>
      <table className="min-w-full leading-normal">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-right">پیشنهادات</th>
            <th className="py-3 px-6 text-right"></th>
            <th className="py-3 px-6 text-right"></th>
          </tr>
        </thead>
        <tbody>
          {suggestionsData.map((title, index) => (
            <tr key={index} className="bg-white border-b border-gray-200">
              <td className="py-3 px-6 text-right">
                {editMode.type === 'suggestions' && editMode.index === index ? (
                  <input
                    type="text"
                    value={editedEntry}
                    onChange={handleEntryChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  title.title
                )}
              </td>
              <td className="px-4 py-2">
                {editMode.type === 'suggestions' && editMode.index === index ? (
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-md ml-2"
                    onClick={handleEntrySave}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="text-[color:var(--color-primary)] py-2 px-4 rounded-md"
                    onClick={() => handleEditEntry('suggestions', index, title.title)}
                  >
                    <MdModeEdit />
                  </button>
                )}
              </td>
              <td className="px-4 py-2">
                <button onClick={() => handleDeleteEntry('suggestions', title._id.$oid)} className="text-red-500">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => handleAddEntry('suggestions')} className="bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white px-4 py-2 rounded mb-4 focus:outline-none m-5">
        اضافه کردن
      </button>

        {/* Add Entry Modals */}
        <ModalFinding open={isTitleModalOpen} onClose={() => setIsTitleModalOpen(false)} entryType="titles" fileId={fileId} findingGroup={findingGroup} fetchData={fetchData} />
        <ModalFinding open={isRiskModalOpen} onClose={() => setIsRiskModalOpen(false)} entryType="risks" fileId={fileId} findingGroup={findingGroup} fetchData={fetchData} />
        <ModalFinding open={isSuggestionModalOpen} onClose={() => setIsSuggestionModalOpen(false)} entryType="suggestions" fileId={fileId} findingGroup={findingGroup} fetchData={fetchData} />
        <ModalFinding1 isOpen={isContentDetailModalOpen} onClose={handleCloseContentDetailModal} onSubmit={handleContentDetailSubmit} titles={titlesData} />

        <div>
     
        {/* New section displaying content list data */}
        <h2 className="text-2xl font-semibold my-5 text-[color:var(--color-primary-variant)]">لیست محتوا</h2>
        <table className="min-w-full leading-normal text-center items-center  ">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 ">عنوان</th>
              <th className="py-3 px-6 ">خلاصه</th>
              <th className="py-3 px-6 ">عنوان یافته</th>
              <th className="py-3 px-6 ">بارگزاری فایل جدول</th>
              <th className="py-3 px-6 "> حذف فایل جدول</th>
              <th className="py-3 px-6 "> ویرایش</th>
              <th className="py-3 px-6 "> حذف</th>
            </tr>
          </thead>
          <tbody>
            {contentListData.map((content, index) => (
              <tr key={index} className="border-b border-gray-200 bg-white text-sm">
                <td className="py-3 px-6 ">{content.content_title}</td>
                <td className="py-3 px-6 ">{content.summary}</td>
                <td className="py-3 px-6 ">{content.finding_title_text}</td>
                
            {/* Button for selecting file */}
  <td>
  <div>
      <label className="btn btn-sm btn-primary me-1 cursor-pointer">
        انتخاب
        <input type="file" style={{ display: 'none' }} accept=".xlsx" onChange={handleFileChange} />
      </label>
      {selectedFile && (
        <span className="me-2">{selectedFile.name}</span>
      )}
      <button className="btn btn-sm btn-primary me-1 mx-5" onClick={() => handleFileUpload(content._id.$oid)}>
        {loading ? 'در حال بارگزاری...' : 'بارگزاری'}
      </button>
    </div>
  </td>

              <td>
                <button className="btn btn-sm btn-danger me-1 text-red-500" onClick={() => handleFileDelete(content._id.$oid)}>
                  <FaTrash />
                </button>
              </td>

              <td className="py-3 px-6">
                  <button
                    className="btn btn-sm btn-danger me-1 text-[color:var(--color-primary)]"
                    onClick={() => handleEditContent(content)}
                  >
                    <MdModeEdit />
                  </button>
                </td>


              <td>
                
                <button className="btn btn-sm btn-danger me-1 text-red-500" onClick={() => handleDeleteEntry('content_detail', content._id.$oid)}>
                  <FaTrash />
                </button>
              </td>
              </tr>
            ))}
          </tbody>
        </table>
    
{/* Button to add content detail */}
<button
          onClick={handleAddContentDetail}
          className="bg-[color:var(--color-primary-variant)] text-white py-2 px-4 rounded-lg mt-4"
        >
          اضافه کردن جزئیات محتوا
        </button>
       
</div> 

      </div>
      {/* Error Pop-up */}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-5 max-w-md w-full mx-auto shadow-lg border-e-red-50">
            <p className="text-2xl font-semibold mb-4 text-center text-[color:var(--color-primary-variant)]">{error}</p>
          </div>
        </div>
      )}
      {/* Popup for success message */}
      {successMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-5 max-w-md w-full mx-auto shadow-lg border-e-green-50">
            <p className="text-2xl font-semibold mb-4 text-center text-[color:var(--color-primary)]">{successMessage}</p>
          </div>
        </div>
      )}
      <EditModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSubmit={handleEditModalSubmit}
        initialData={editContentData}
      />
    </>
  );
};

export default FindingDetailPage;
