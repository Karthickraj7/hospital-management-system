// Removed SearchDiagnosis logic
import axios from 'axios';
import React, { useCallback, useLayoutEffect, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import debounce from "lodash.debounce";
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import UploadIcon from '@mui/icons-material/Upload';
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";

const PatientDetailsMaster = () => {
  const dispatch = useDispatch();

  const UrlLink = useSelector(state => state.userRecord?.UrlLink);
  const toast = useSelector(state => state.userRecord?.toast);

  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  console.log(selectedFile,'selectedFile');
  
  const [PatientData, setPatientData] = useState([]);
  const [SearchPatientID, setSearchPatientID] = useState('');
  const [SearchPatientName, setSearchPatientName] = useState('');

  const gridRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      dispatch({
        type: 'toast',
        value: { message: "Please choose a valid Formart file.", type: "error" }
      });
    }
  };

  const GetPatientData = useCallback(() => {
    axios.get(`${UrlLink}Masters/Patient_Detials_FileUpload`, {
      params: {
        SearchPatientID,
        SearchPatientName,
      }
    })
      .then((res) => {
        const data = res.data;
        setPatientData(Array.isArray(data) ? data : []);
      })
      .catch(err => console.log(err));
  }, [SearchPatientID, SearchPatientName, UrlLink]);

  useEffect(() => {
    GetPatientData();
  }, [GetPatientData]);

  const ClearFields = () => {
    setSearchPatientID('');
    setSearchPatientName('');
  };

  const GetSinglePatient = () => {
    if (!SearchPatientID && !SearchPatientName) {
      dispatch({
        type: "toast",
        value: {
          message: "Please enter a search criteria to view results.",
          type: "warn",
        },
      });
      return;
    }

    const findData =
      PatientData.find(ele => ele.PatientID === SearchPatientID) ||
      PatientData.find(ele => ele.PatientName === SearchPatientName);

    if (findData) {
      setSearchPatientID(findData.PatientID);
      setSearchPatientName(findData.PatientName);
    }
  };

  const FileUpload = () => {
    if (selectedFile) {
      setLoading(true);
      scrollToElement("PatientGrid_ID");

      const formData = new FormData();
      formData.append('file', selectedFile);

      console.log("Uploading file:", selectedFile.name);
      
      axios.post(`${UrlLink}Masters/upload_revisit_patient_excel`, formData,{
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((res) => {
          const data = res.data;
          const type = Object.keys(data)[0];
          const message = Object.values(data)[0];

          console.log("File upload response:", res); // Log entire response
          console.log("File uploaded successfully:", message);

          dispatch({
            type: 'toast',
            value: { message, type }
          });

          setLoading(false);
          setSelectedFile(null);
          GetPatientData();
        })
        .catch(() => {
          dispatch({
            type: 'toast',
            value: { message: "File upload failed.", type: "warn" }
          });
          setLoading(false);
        });
    }
  };

  const handleStopEvent = (event) => {
    document.body.style.pointerEvents = "auto";
    event.preventDefault();
    event.stopPropagation();
  };

  const scrollToElement = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      document.body.style.pointerEvents = "none";
      element.scrollIntoView({ behavior: "auto", block: "start" });
      window.addEventListener("scroll", handleStopEvent);
      window.addEventListener("click", handleStopEvent);
    }
  };

  useLayoutEffect(() => {
    const handleResize = debounce(() => {
      if (gridRef.current) {
        const { clientWidth } = gridRef.current;
        const updatedWidth = clientWidth - 20;

        const items = document.querySelectorAll(".RegisForm_1");
        let totalWidth = 0;
        let currentRowItemsCount = 0;

        items.forEach((item) => {
          const style = getComputedStyle(item);
          const itemWidth = item.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);

          if (totalWidth + itemWidth <= updatedWidth) {
            totalWidth += itemWidth;
            currentRowItemsCount++;
          }
        });

        const remainingGap = updatedWidth - totalWidth;
        const gap = Math.floor(remainingGap / currentRowItemsCount);
        const container = document.getElementById("PatientGrid_ID");

        if (updatedWidth > 800) {
          container.style.justifyContent = "flex-start";
          container.style.columnGap = `${gap === 0 ? 5 : gap}px`;
        } else {
          container.style.justifyContent = "center";
          container.style.columnGap = "10px";
        }
      }
    }, 100);

    const currentRef = gridRef.current;
    const resizeObserver = new ResizeObserver(handleResize);
    if (currentRef) resizeObserver.observe(currentRef);

    return () => {
      if (currentRef) resizeObserver.unobserve(currentRef);
      resizeObserver.disconnect();
    };
  }, []);


  
  const PatientColumn = [
    { key: 'id', name: 'S.No' },
    { key: 'PatientId', name: 'Patient ID' },
    { key: 'FullName', name: 'Full Name' },
    // { key: 'FirstName', name: 'First Name' },
    // { key: 'MiddleName', name: 'Middle Name' },
    // { key: 'SurName', name: 'Surname' },
    { key: 'Gender', name: 'Gender' },
    { key: 'Age', name: 'Age' },
    { key: 'Dob', name: 'DOB' },
    { key: 'PhoneNo', name: 'Phone No' },
    // { key: 'Email', name: 'Email' },
    // { key: 'Status', name: 'Status' },
    { key: 'CreatedAt', name: 'Created At' }
  ];

  return (
    <div className="Main_container_app">
      <h3>Patient Details Master</h3>

      <div className="RegisFormcon_1" id="PatientGrid_ID" ref={gridRef}>
        <div className="RegisForm_1">
          <div className='Search_patient_icons'>
            <label>Patient ID<span>:</span></label>
            <input
              type="text"
              value={SearchPatientID}
              placeholder='Search Patient ID'
              onChange={(e) => setSearchPatientID(e.target.value)}
              list="PatientIDList"
            />
            <datalist id="PatientIDList">
              {PatientData.map((ele, i) => <option key={i} value={ele.PatientID} />)}
            </datalist>
            <span onClick={GetSinglePatient}><ManageSearchIcon /></span>
          </div>
        </div>

        <div className="RegisForm_1">
          <div className='Search_patient_icons'>
            <label>Patient Name<span>:</span></label>
            <input
              type="text"
              value={SearchPatientName}
              placeholder='Search Patient Name'
              onChange={(e) => setSearchPatientName(e.target.value)}
              list="PatientNameList"
            />
            <datalist id="PatientNameList">
              {PatientData.map((ele, i) => <option key={i} value={ele.PatientName} />)}
            </datalist>
            <span onClick={GetSinglePatient}><ManageSearchIcon /></span>
          </div>
        </div>

        <div className="RegisForm_1">
          <input
            id="fileInput"
            type="file"
            accept=".xlsx, .xls, .csv"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <label htmlFor="fileInput" className="RegisterForm_1_btns choose_file_update" style={{ cursor: 'pointer' }}>
              <PhotoCameraBackIcon />
            </label>
            <button className="fileviewbtn" title='Upload' onClick={FileUpload}>
              <UploadIcon />
            </button>
            <button className="fileviewbtn" onClick={ClearFields}>
              Clear Fields
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="loader">
          <div className="Loading">
            <div className="spinner-border"></div>
            <div>Loading...</div>
          </div>
        </div>
      )}

      <ReactGrid columns={PatientColumn} RowData={PatientData} />
      <ToastAlert Message={toast.message} Type={toast.type} />
    </div>
  );
};

export default PatientDetailsMaster;
