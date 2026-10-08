import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import './worddoc.css';
import JoditRichEditor from './JoditRichEditor'; // Ensure this component exists
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid'; // Ensure this component exists
import DocumentEditor from './DocumentEditor';

// Define modal style for MUI Modal
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const Histoword = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const [testname, setTestname] = useState('');
  const [testcode, setTestcode] = useState('');
  const [document, setDocument] = useState(null);
  const [docudata, setDocudata] = useState([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [editorContent, setEditorContent] = useState('');
  const [TestNameList, setTestNameList] = useState([]);
  
  const [editorVisible, setEditorVisible] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);
  // Fetch document list from API
  const fetch_document_list = useCallback(() => {
    axios
      .get(`${UrlLink}/Lab/getdocview`)
      .then((response) => {
        const data = response.data.tests.map((row, index) => ({
          id: row.id || index, // Ensure unique ID
          testname: row.testname,
          testcode: row.testcode,
          document: row.html_content,
        }));
        setDocudata(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        alert('Error loading document list.');
      });
  }, [UrlLink]);

  // Fetch documents on component mount
  useEffect(() => {
    fetch_document_list();
  }, [fetch_document_list]);

  // Handle file upload with validation
  const handleDocumentFileUpload = (e) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type. Please upload a PDF, JPEG, PNG, DOC, or DOCX file.');
      } else if (file.size > maxSize) {
        alert('File size exceeds the limit of 5MB.');
      } else {
        setDocument(file); // Store file directly
      }
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!testname || !testcode || !document) {
      alert('Please fill in all fields and upload a document.');
      return;
    }

    const formData = new FormData();
    formData.append('testname', testname);
    formData.append('testcode', testcode);
    formData.append('document', document);

    axios
      .post(`${UrlLink}Lab/uploaddocumentlink`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(() => {
        fetch_document_list();
        setTestname('');
        setTestcode('');
        setDocument(null);
        alert('Upload successful!');
      })
      .catch((error) => {
        const msg = error.response?.data?.error || 'Upload failed.';
        console.error('Upload error:', msg);
        alert(msg);
      });
  };

    const handleViewDocument = (row) => {
    setSelectedDocId(row?.id);
    setEditorVisible(true);
  };
  const handleOnCloseEditor = () => {
    setEditorVisible(false);
  }

  
   useEffect(() => {
        axios
          .get(`${UrlLink}Lab/test_and_group_forpackage`)
          .then((res) => {
            console.log(res);
            setTestNameList(res.data);
          })
          .catch((err) => {
            console.error(err);
          });
      }, [UrlLink]);

  // Handle save document (for editable documents)
  const handleSaveDocument = async () => {
    if (!currentDocument || !editorContent) {
      alert('No document or content to save.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('testcode', currentDocument.testcode);
      formData.append('html', editorContent); // Use editorContent directly or process as needed

      await axios.post(`${UrlLink}/Masters/test_master_doc_update`, formData);
      alert('Document updated successfully');
      setViewModalOpen(false);
      setCurrentDocument(null);
      setEditorContent('');
      fetch_document_list();
    } catch (error) {
      const msg = error.response?.data?.error || 'Update failed.';
      console.error('Update error:', msg);
      alert(msg);
    }
  };

  const handleTestnameChange = (e) => {
    const selectedTestname = e.target.value;
    setTestname(selectedTestname);
    const selectedTest = TestNameList.find(item => item.name === selectedTestname);
    if (selectedTest) {
      setTestcode(selectedTest.Test_Code || '');
    }
  };

  // Grid columns definition
  const ExternalLabListcolumns = [
    { key: 'id', name: 'S.No', width: 70, frozen: true },
    { key: 'testname', name: 'Test Name', width: 300, frozen: true },
    { key: 'testcode', name: 'Test Code' },
    {
      key: 'document',
      name: 'Document',
      width: 70,
      renderCell: (params) => (
        <Button className="visibility-icon-btn" onClick={() => handleViewDocument(params.row)}>
          <VisibilityIcon />
        </Button>
      ),
    },
  ];

  return (
    <div className="Main_container_app">
      <div className="common_center_tag">
        <span>External Lab Details</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="RegisFormcon_1">
          <div className="RegisForm_1">
            <label>
              Test Name<span>:</span>
            </label>
            <input
              type="text"
              id="testname"
              name="testname"
              list="testnamelist"
              value={testname}
              onChange={handleTestnameChange}
              autoComplete="Off"
              placeholder="Enter test name"
              required
            />
            <datalist id="testnamelist">
              {Array.isArray(TestNameList) && TestNameList?.map((item, index) => (
                <option key={index} value={item.name}>
                  {item.Test_Code}
                </option>
              ))}
            </datalist>
          </div>
          <div className="RegisForm_1">
            <label>
              Test Code<span>:</span>
            </label>
            <input
              type="text"
              value={testcode}
              onChange={(e) => setTestcode(e.target.value)}
              placeholder="Enter test code"
              required
            />
          </div>
          <div className="RegisForm_1">
            <label>
              Upload Document <span>:</span>
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleDocumentFileUpload}
              style={{ display: "none" }}
              id="document_upload"
            />
            <div
                    style={{
                      width: "87px",
                      display: "flex",
                      justifyContent: "flex-start",
                      gap: "10px",
                    }}
                  >
                    <label
              htmlFor="document_upload"
              className="RegisterForm_1_btns choose_file_update"
            >
              <PhotoCameraBackIcon />
            </label>
            {document && <span>{document.name}</span>}


                  </div>
            
          </div>
        </div>

        <div className="Main_container_Btn">
          <button type="submit">Save</button>
        </div>
      </form>

      <div className="Main_container_app">
        <ReactGrid columns={ExternalLabListcolumns} RowData={docudata} />
      </div>

           {
              editorVisible &&
              < DocumentEditor
                visible={editorVisible}
                onClose={handleOnCloseEditor}
                documentId={selectedDocId}
              />
      
            }

    
    </div>
  );
};

export default Histoword;