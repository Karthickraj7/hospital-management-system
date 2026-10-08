import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import bgImg2 from "../Assets/bgImg2.jpg";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import EditIcon from "@mui/icons-material/Edit";
import DocumentEditor from "../Masters/RadiologyMaster/DocumentEditor";
import { useNavigate } from 'react-router-dom';
import { Button, Select, MenuItem } from '@mui/material';

const RadiologyReport = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);

  console.log(userRecord.Emp_DepartmentId,'userRecord')
  const toast = useSelector((state) => state.userRecord?.toast);
  const reporthtmlcont = useSelector((state) => state.userRecord?.radiologyhtmlcon);
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const [IsRadiologyGet, setIsRadiologyGet] = useState(false);
  const RadiologyWorkbenchNavigation = useSelector(state => state.Frontoffice?.RadiologyWorkbenchNavigation);
  console.log(RadiologyWorkbenchNavigation,"efefefefe");
  
  const [ReportEntry, setReportEntry] = useState({
    TestCode: "",
    TestName: "",
    ReportDate: "",
    ReportTime: "",
    RadiologistName: "",
    TechnicianName: "",
    Report: "",
    ReportHandoOvered: "",
    RelativeName: "",
    Radiology_RequestID: "",
    Radiology_CompleteId: "",
    ReportName: "",
    subdepartment:"",
    radiologistid:"",
    id:"",
  });



  const [ChooseFile, setChooseFile] = useState({
    ChooseFileOne: null,
    ChooseFileTwo: null,
    ChooseFileThree: null,
  });


  const [completeArr, SetCompleteArr] = useState([]);
  const [no, setno] = useState([]);
  const [yes, setyes] = useState([]);
  const [IsViewMode, setIsViewMode] = useState(false);
  const [doctorList, setDoctorList] = useState([]);
  const [radiologist, setRadiologist] = useState("");
  const [reports, setReports] = useState([]);
  const [editorVisible, setEditorVisible] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [Technician, setTechnician]=useState(false);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/get_Doctor_Detials_link`, {})
      .then((res) => {
        const allDoctors = res.data;
        const radiologyDoctors = allDoctors
          .filter((doctor) => {
            const department = (doctor.Department || "").toLowerCase();
            return department.includes("radiology");
          })
          .map((doctor) => ({
            DoctorID: doctor.id,
            DoctorName: doctor.Name,
          }));
        setDoctorList(radiologyDoctors);
      })
      .catch((err) => {
        console.error("Error fetching doctors:", err);
      });
  }, [UrlLink]);

  const handleDoctorChange = (rowId, doctorName) => {

    console.log(rowId,'rowId',doctorName,'doctorName')
    setno((prev) =>
      prev.map((row) =>
        row.id === rowId ? { ...row, DoctorName: doctorName } : row
      )
    );
    setRadiologist(doctorName);
    setReportEntry((prev) => ({ ...prev, RadiologistName: doctorName }));
  };

  const handleReportEntryChange = (e) => {
  const { name, value } = e.target;
  if (name === "ReportName") {
    const selectedReport = reports.find((item) => item.fileName === value);
    if (selectedReport) {
      console.log("Selected report:", selectedReport);
      setReportEntry((prev) => ({ ...prev, radiologistid: selectedReport.doctorid }));
      setSelectedDocId(selectedReport.id);
      setEditorVisible(true);
      setTechnician(true);

      dispatchvalue({ type: "radiologytech", value: true });
    }
     else {
      console.warn("No report found for fileName:", value);
    }
    setReportEntry((prev) => ({ ...prev, ReportName: value }));
  } else {
    setReportEntry((prev) => ({ ...prev, [name]: value || "" }));
  }
 };

  const formatLabel = (label) => {
    if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
      return label
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (str) => str.toUpperCase());
    } else {
      return label;
    }
  };

  const handleinpchangeDocumentsForm = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      let formattedValue = files[0];
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      const maxSize = 5 * 1024 * 1024;
      if (!allowedTypes.includes(formattedValue.type) || formattedValue.type === "") {
        const tdata = {
          message: "Invalid file type. Please upload a PDF, JPEG, or PNG file.",
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
      } else if (formattedValue.size > maxSize) {
        const tdata = {
          message: "File size exceeds the limit of 5MB.",
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          setChooseFile((prev) => ({
            ...prev,
            [name]: reader.result,
          }));
        };
        reader.readAsDataURL(formattedValue);
      }
    } else {
      const tdata = {
        message: "No file selected. Please choose a file to upload.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    }
  };

  const Selectedfileview = (fileval) => {
    if (fileval) {
      let tdata = {
        Isopen: false,
        content: null,
        type: "image/jpg",
      };
      if (["data:image/jpeg;base64", "data:image/jpg;base64"].includes(fileval?.split(",")[0])) {
        tdata = {
          Isopen: true,
          content: fileval,
          type: "image/jpeg",
        };
      } else if (fileval?.split(",")[0] === "data:image/png;base64") {
        tdata = {
          Isopen: true,
          content: fileval,
          type: "image/png",
        };
      } else if (fileval?.split(",")[0] === "data:application/pdf;base64") {
        tdata = {
          Isopen: true,
          content: fileval,
          type: "application/pdf",
        };
      }
      dispatchvalue({ type: "modelcon", value: tdata });
    } else {
      const tdata = {
        message: "There is no file to view.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    }
  };

  const fetchData = () => {
    const params = {
      Register_Id: RadiologyWorkbenchNavigation?.params?.RegistrationId,
      RegisterType: RadiologyWorkbenchNavigation?.params?.RegisterType,
      Employeeid: userRecord?.Employeeid,
      Dept : userRecord?.Emp_DepartmentId

    };

    axios
      .get(`${UrlLink}OP/Radiology_Request_Detailslink_paid`, { params })
      .then((res) => {
        const ress = res.data;
        setyes(ress?.IsSubTestYes);
        setno(ress?.IsSubTestNo);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const { RegistrationId, RegisterType } = RadiologyWorkbenchNavigation?.params || {};
    if (UrlLink && RegistrationId && RegisterType) {
      fetchData();
    }
  }, [
    UrlLink,
    RadiologyWorkbenchNavigation?.params?.RegistrationId,
    RadiologyWorkbenchNavigation?.params?.RegisterType,
    IsRadiologyGet,
  ]);

  const yesColumns = [
    {
      key: "id",
      name: "S.No",
      frozen: true,
    },
    {
      key: "RadiologyName",
      name: "Radiology Name",
      frozen: true,
    },
    {
      key: "TestName",
      name: "TestName",
      frozen: true,
    },
    {
      key: "SubTestName",
      name: "Sub TestName",
      frozen: true,
    },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <Button
          key={params.row.id}
          className="cell_btn"
          onClick={() => handleeditReport(params.row)}
        >
          <EditIcon className="check_box_clrr_cancell" />
        </Button>
      ),
    },
  ];

  const noColumns = [
    {
      key: "id",
      name: "S.No",
      width: "160px",
    },
    {
      key: "RadiologyName",
      name: "Radiology Name",
    },
    {
      key: "TestName",
      name: "Test Name",
    },
    {
      key: "DoctorName",
      name: "Doctor Name",
      renderCell: (params) => (
        <Select
          value={params.row.DoctorName || ""}
          onChange={(event) => handleDoctorChange(params.row.id, event.target.value)}
          size="small"
          displayEmpty
          renderValue={(selected) => (selected ? selected : <em>Select a Doctor</em>)}
          style={{ minWidth: "150px" }}
        >
          {doctorList.length > 0 ? (
            doctorList.map((doctor) => (
              <MenuItem key={doctor.DoctorName} value={doctor.DoctorID}>
                {doctor.DoctorName}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No Doctors Available</MenuItem>
          )}
        </Select>
      ),
    },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <Button
          key={params.row.id}
          className="cell_btn"
          onClick={() => handleeditReport(params.row)}
        >
          <EditIcon className="check_box_clrr_cancell" />
        </Button>
      ),
    },
  ];

  const handleeditReport = (row) => {
    console.log(row,'sfsdfdfdfdf')
    setIsViewMode(true);
    if (row.IsSubTest === "Yes") {
      setReportEntry({
        TestCode: row.SubTestCode || "",
        TestName: row.SubTestName || "",
        Radiology_RequestID: row.Radiology_RequestId || "",
        RadiologistName: radiologist || "",
        ReportDate: "",
        ReportTime: "",
        TechnicianName: "",
        Report: "",
        ReportHandoOvered: "",
        RelativeName: "",
        Radiology_CompleteId: "",
        ReportName: "",
        subdepartment: row.RadiologyName || "",
      });
    } else {
      setReportEntry({
        TestCode: row.TestCode || "",
        TestName: row.TestName || "",
        Radiology_RequestID: row.Radiology_RequestId || "",
        RadiologistName: radiologist || "",
        ReportDate: "",
        ReportTime: "",
        TechnicianName: "",
        Report: "",
        ReportHandoOvered: "",
        RelativeName: "",
        Radiology_CompleteId: "",
        ReportName: "",
        subdepartment: row.RadiologyName || "",
      });
    }
  };

  const handleOnCloseEditor = () => {
    setEditorVisible(false);
  };

 useEffect(() => {
  if (ReportEntry.RadiologistName) {
    axios
      .get(`${UrlLink}Radiology/Get_Report_From_Doctor?Radiologist=${ReportEntry.RadiologistName}`)
      .then((res) => {
        console.log("API response:", res.data);
        // Ensure reports is an array
        const reportData = Array.isArray(res.data) ? res.data : [res.data];
        setReports(reportData);
      })
      .catch((err) => {
        console.error("Error fetching reports:", err);
        const tdata = {
          message: "Error fetching reports. Please try again.",
          type: "error",
        };
        dispatchvalue({ type: "toast", value: tdata });
        setReports([]);
      });
  } else {
    setReports([]);
  }
 }, [ReportEntry.RadiologistName, UrlLink, dispatchvalue]);

  console.log(reporthtmlcont,"reporthtmlcontent");
  
 console.log(selectedDocId);
 
  const handleSubmitReportEntry = () => {
    const reportentrydata = {
      ...ReportEntry,
      ...ChooseFile,
      Registeration_Id: RadiologyWorkbenchNavigation?.params?.RegistrationId,
      RegisterType: RadiologyWorkbenchNavigation?.params?.RegisterType,
      created_by: userRecord?.username || "",
      htmlcontent: reporthtmlcont?.html || "",
      Document_Id : selectedDocId,  
    };

    // const reportentrydatatosend = new FormData();
    // const arrchfile = [...Object.keys(ChooseFile), "ReportEntryFile"];
    // Object.keys(reportentrydata).forEach((key) => {
    //   if (arrchfile.includes(key)) {
    //     if (reportentrydata[key] !== null) {
    //       reportentrydatatosend.append(key, reportentrydata[key]);
    //     }
    //   } else {
    //     reportentrydatatosend.append(key, reportentrydata[key]);
    //   }
    // });

    axios
      .post(`${UrlLink}OP/Radiology_Complete_Details_Link`, reportentrydata)
      .then((res) => {
        setIsRadiologyGet((prev) => !prev);
        const responsedata = res.data;
        let typp = Object.keys(responsedata)[0];
        let mess = Object.values(responsedata)[0];
        const tdata = {
          message: mess,
          type: typp,
        };
        handleClear();
        setSelectedDocId(null);
        dispatchvalue({ type: "toast", value: tdata });
        if (userRecord?.Emp_DepartmentName?.includes("USG")) {

      navigate("/Home/Radiology");
      dispatchvalue({ type: "HrFolder", value: "UsgTechnician" });
      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });
          
        }

         else if (userRecord?.Emp_DepartmentName?.includes("MRI")) {

      navigate("/Home/Radiology");
      dispatchvalue({ type: "HrFolder", value: "Mritechnician" });
      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });
          
        }

         else if (userRecord?.Emp_DepartmentName?.includes("CT")) {

      navigate("/Home/Radiology");
      dispatchvalue({ type: "HrFolder", value: "Cttechnician" });
      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });
          
        }

        else if (userRecord?.Emp_DepartmentName?.includes("XRAY")) {

      navigate("/Home/Radiology");
      dispatchvalue({ type: "HrFolder", value: "XRayTechnician" });
      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });
          
        }

      
      })
      .catch((err) => {
        console.error(err);
        const tdata = {
          message: "Error submitting report. Please try again.",
          type: "error",
        };
        dispatchvalue({ type: "toast", value: tdata });
      });
  };

  const handleClear = () => {
    setReportEntry({
      TestCode: "",
      TestName: "",
      ReportDate: "",
      ReportTime: "",
      RadiologistName: "",
      TechnicianName: "",
      Report: "",
      ReportHandoOvered: "",
      RelativeName: "",
      Radiology_RequestID: "",
      Radiology_CompleteId: "",
      ReportName: "",
    });
    setChooseFile({
      ChooseFileOne: null,
      ChooseFileTwo: null,
      ChooseFileThree: null,
    });
  };

  useEffect(() => {
    const params = {
      Register_Id: RadiologyWorkbenchNavigation?.params?.RegistrationId,
      RegisterType: RadiologyWorkbenchNavigation?.params?.RegisterType,
    };
    axios
      .get(`${UrlLink}OP/Radiology_Complete_Details_Link`, { params })
      .then((res) => {
        SetCompleteArr(res.data || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [
    RadiologyWorkbenchNavigation?.params?.RegistrationId,
    RadiologyWorkbenchNavigation?.params?.RegisterType,
    IsRadiologyGet,
    UrlLink,
  ]);

  const RadiologyColumns = [
    {
      key: "id",
      name: "S.No",
      width: "160px",
    },
    {
      key: "ReportDate",
      name: "Report Date",
    },
    {
      key: "RadiologistName",
      name: "Radiologist Name",
    },
    {
      key: "TechnicianName",
      name: "Technician Name",
    },
    {
      key: "RadiologyName",
      name: "Radiology Name",
    },
    {
      key: "TestName",
      name: "TestName",
    },
    {
      key: "SubTestName",
      name: "Sub TestName",
      renderCell: (params) => (params.row.SubTestName ? params.row.SubTestName : 'No SubTest'),
    },
    {
      key: "Report_HandOverTo",
      name: "Report HandOver",
    },
    {
      key: "RelativeName",
      name: "RelativeName",
    },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <Button
          key={params.row.id}
          className="cell_btn"
          onClick={() => handleEditComplete(params.row)}
        >
          <EditIcon className="check_box_clrr_cancell" />
        </Button>
      ),
    },
  ];

  const handleEditComplete = (row) => {
    setIsViewMode(true);
    if (row.IsSubTest === 'Yes') {
      setReportEntry({
        TestCode: row.SubTestCode || "",
        TestName: row.SubTestName || "",
        ReportDate: row.ReportDate || "",
        ReportTime: row.ReportTime || "",
        RadiologistName: row.RadiologistName || "",
        TechnicianName: row.TechnicianName || "",
        Report: row.Report || "",
        ReportHandoOvered: row.Report_HandOverTo || "",
        RelativeName: row.RelativeName || "",
        Radiology_RequestID: row.Radiology_RequestId || "",
        Radiology_CompleteId: row.Radiology_CompleteId || "",
        ReportName: "",
      });
      setChooseFile({
        ChooseFileOne: row.Report_fileone,
        ChooseFileTwo: row.Report_filetwo,
        ChooseFileThree: row.Report_filethree,
      });
    } else {
      setReportEntry({
        TestCode: row.TestCode || "",
        TestName: row.TestName || "",
        ReportDate: row.ReportDate || "",
        ReportTime: row.ReportTime || "",
        RadiologistName: row.RadiologistName || "",
        TechnicianName: row.TechnicianName || "",
        Report: row.Report || "",
        ReportHandoOvered: row.Report_HandOverTo || "",
        RelativeName: row.RelativeName || "",
        Radiology_RequestID: row.Radiology_RequestId || "",
        Radiology_CompleteId: row.Radiology_CompleteId || "",
        ReportName: "",
      });
      setChooseFile({
        ChooseFileOne: row.Report_fileone,
        ChooseFileTwo: row.Report_filetwo,
        ChooseFileThree: row.Report_filethree,
      });
    }
  };

  return (
    <>
      <div className="RegisFormcon_1">
        {yes?.length > 0 && (
          <>
            <div className="common_center_tag">
              <span>Selected SubTestName</span>
            </div>
            <ReactGrid columns={yesColumns} RowData={yes} />
          </>
        )}
        {no?.length > 0 && (
          <>
            <div className="common_center_tag">
              <span>Selected TestName</span>
            </div>
            <ReactGrid columns={noColumns} RowData={no} />
          </>
        )}
        <br />
        <br />
        <div className="RegisForm_1">
          <label htmlFor="TestName">
            Test Name <span>:</span>
          </label>
          <input
            type="text"
            id="TestName"
            name="TestName"
            onChange={handleReportEntryChange}
            value={ReportEntry.TestName || ""}
            readOnly={IsViewMode}
            required
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="TestCode">
            Test Code <span>:</span>
          </label>
          <input
            type="text"
            id="TestCode"
            name="TestCode"
            onChange={handleReportEntryChange}
            value={ReportEntry.TestCode || ""}
            readOnly={IsViewMode}
            required
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="ReportDate">
            Report Date <span>:</span>
          </label>
          <input
            type="date"
            id="ReportDate"
            name="ReportDate"
            onChange={handleReportEntryChange}
            value={ReportEntry.ReportDate}
            required
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="ReportTime">
            Report Time <span>:</span>
          </label>
          <input
            type="time"
            id="ReportTime"
            name="ReportTime"
            onChange={handleReportEntryChange}
            value={ReportEntry.ReportTime}
            required
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="TechnicianName">
            Technician Name <span>:</span>
          </label>
          <input
            type="text"
            id="TechnicianName"
            name="TechnicianName"
            onChange={handleReportEntryChange}
            value={ReportEntry.TechnicianName}
            required
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="RadiologistName">
            Radiologist Name <span>:</span>
          </label>
          <input
            type="text"
            id="RadiologistName"
            name="RadiologistName"
            onChange={handleReportEntryChange}
            value={ReportEntry.RadiologistName}
            required
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="ReportName">
            Report Type <span>:</span>
          </label>
          <input
            type="text"
            id="ReportName"
            name="ReportName"
            list="ReportNamelist"
            className=""
            required
            value={ReportEntry.ReportName}
            onChange={handleReportEntryChange}
            autoComplete="off"
            placeholder="Select Report"
          />
          <datalist id="ReportNamelist">
            {Array.isArray(reports) &&
              reports.map((item, index) => (
                <option key={index} value={item.fileName}>
                  {item.fileName}
                </option>
              ))}
          </datalist>
        </div>
      </div>
      <br />
      {/* <div className="Otdoctor_intra_Con_2 with_increse_85">
        <label htmlFor="Report">
          Report <span>:</span>
        </label>
        <textarea
          type="text"
          id="Report"
          name="Report"
          onChange={handleReportEntryChange}
          value={ReportEntry.Report}
          required
        />
      </div>
      <br />
      <div className="RegisFormcon_1">
        {Object.keys(ChooseFile).map((field, indx) => (
          <div className="RegisForm_1" key={indx}>
            <label htmlFor={`${field}_${indx}_${field}`}>
              {formatLabel(field)} <span>:</span>
            </label>
            <input
              type="file"
              name={field}
              accept="image/jpeg, image/png,application/pdf"
              required
              id={`${field}_${indx}_${field}`}
              autoComplete="off"
              onChange={handleinpchangeDocumentsForm}
              style={{ display: "none" }}
            />
            <div
              style={{
                width: "150px",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <label
                htmlFor={`${field}_${indx}_${field}`}
                className="RegisterForm_1_btns choose_file_update"
              >
                Choose File
              </label>
              <button
                className="fileviewbtn"
                onClick={() => Selectedfileview(ChooseFile[field])}
              >
                view
              </button>
            </div>
          </div>
        ))}
      </div> */}
      <div className="RegisFormcon_1">
        <div className="RegisForm_1">
          <label htmlFor="ReportHandoOvered">
            Report Handovered to Relative by <span>:</span>
          </label>
          <input
            type="text"
            id="ReportHandoOvered"
            name="ReportHandoOvered"
            onChange={handleReportEntryChange}
            value={ReportEntry.ReportHandoOvered}
            required
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="RelativeName">
            Relative Name <span>:</span>
          </label>
          <input
            type="text"
            id="RelativeName"
            name="RelativeName"
            onChange={handleReportEntryChange}
            value={ReportEntry.RelativeName}
            required
          />
        </div>
      </div>
      <br />
      <div className="Main_container_Btn">
        <button className="RegisterForm_1_btns" onClick={handleSubmitReportEntry}>
          {ReportEntry.Radiology_CompleteId ? "Update" : "Save"}
        </button>
      </div>
      <br />
      {completeArr?.length > 0 && (
        <>
          <div className="common_center_tag">
            <span>Completed TestName</span>
          </div>
          <ReactGrid columns={RadiologyColumns} RowData={completeArr} />
        </>
      )}
      {editorVisible && (
        <DocumentEditor
          visible={editorVisible}
          onClose={handleOnCloseEditor}
          documentId={selectedDocId}
          from = {'Technician'}
        />
      )}
      <ToastAlert Message={toast.message} Type={toast.type} />
    </>
  );
};

export default RadiologyReport;
