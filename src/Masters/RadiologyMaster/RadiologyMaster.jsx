import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import JoditRichEditor from "../RadiologyMaster/JoditRichEditor";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
// import axios from "../../services/api";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import DocumentEditor from "./DocumentEditor";

import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";

const RadiologyMaster = () => {
  const dispatchvalue = useDispatch();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const toast = useSelector((state) => state.userRecord?.toast);
  const Usersessionid = useSelector((state) => state.userRecord?.Usersessionid);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSection, setSelectedSection] = useState("radiology");
  const [editDocumentId, setEditDocumentId] = useState(null);

  const [documentUpload, setDocumentUpload] = useState({
    department: "",
    doctor: "",
    file: null,
  });
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [isDocumentGet, setIsDocumentGet] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const editor = useRef(null);
  const [doctorList, setDoctorList] = useState([]);

  // ----------------------RadiologyName--------
  const [RadiologyName, setRadiologyName] = useState({
    RadiologyId: "",
    RadiologyName: "",
    Location: "",
  });
  // console.log(RadiologyName)
  const [LocationData, setLocationData] = useState([]);
  const [IsRadiologyGet, setIsRadiologyGet] = useState(false);
  const [RadiologyNames, setRadiologyNames] = useState([]);

  // Add these new states after your existing useState declarations
  const [doctorFilter, setDoctorFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState([]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Location_Detials_link`, {
        headers: {
          Apikey: UserData.api_key,
          Apipassword: UserData.api_password,
          Sessionid: Usersessionid.session_id,
        },
      })
      .then((res) => {
        const ress = res.data;
        setLocationData(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, UserData]);

  const handleRadiologyChange = (e) => {
    const { name, value } = e.target;

    if (name === "Location") {
      // Update Location and reset RadiologyName when location changes
      setRadiologyName((prev) => ({
        ...prev,
        [name]: value,
        RadiologyName: "", // Reset RadiologyName on location change
      }));
    } else if (name === "RadiologyName") {
      // Update the relevant field, applying toUpperCase and trim
      setRadiologyName((prev) => ({
        ...prev,
        [name]: value?.toUpperCase()?.trim(),
      }));
    }
  };

  const handleeditRadiologyStatus = (params) => {
    const data = {
      RadiologyId: params.id,
      Statusedit: true,
    };
    axios
      .post(`${UrlLink}Masters/Radiology_Names_link`, data, {
        headers: {
          Apikey: UserData.api_key,
          Apipassword: UserData.api_password,
          Sessionid: Usersessionid.session_id,
        },
      })
      .then((res) => {
        const resres = res.data;
        let typp = Object.keys(resres)[0];
        let mess = Object.values(resres)[0];
        const tdata = {
          message: mess,
          type: typp,
        };
        dispatchvalue({ type: "toast", value: tdata });
        setIsRadiologyGet((prev) => !prev);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const RadiologyColumns = [
    {
      key: "id",
      name: "Radiology Id",
      frozen: true,
    },
    {
      key: "created_by",
      name: "Created By",
      frozen: true,
    },
    {
      key: "RadiologyName",
      name: "Radiology Department",
    },
    {
      key: "Location_Name",
      name: "Location Name",
    },
    {
      key: "Status",
      name: "Status",
      renderCell: (params) => (
        <Button
          className="cell_btn"
          onClick={() => handleeditRadiologyStatus(params.row)}
        >
          {params.row.Status}
        </Button>
      ),
    },
    {
      key: "EditAction",
      name: "Edit",
      renderCell: (params) => (
        <Button
          className="cell_btn"
          onClick={() => handleeditRadiology(params.row)}
        >
          <EditIcon className="check_box_clrr_cancell" />
        </Button>
      ),
    },
  ];

  // Add this filter function
  const filterDocuments = () => {
    if (!uploadedDocuments || uploadedDocuments.length === 0) {
      setFilteredDocuments([]);
      return;
    }

    // const filtered = uploadedDocuments.filter((doc) => {
    //   const doctorMatch =
    //     !doctorFilter ||
    //     doc.doctorName?.toLowerCase().includes(doctorFilter.toLowerCase());

    //   const departmentMatch =
    //     !departmentFilter ||
    //     doc.departmentname?.toLowerCase().includes(departmentFilter.toLowerCase());

    //   return doctorMatch && departmentMatch;
    // });

    const filtered = Array.isArray(uploadedDocuments)
    ? uploadedDocuments.filter((doc) => {
        const doctorMatch =
          !doctorFilter ||
          doc.doctorName?.toLowerCase().includes(doctorFilter.toLowerCase());

        const departmentMatch =
          !departmentFilter ||
          doc.departmentname?.toLowerCase().includes(departmentFilter.toLowerCase());

        return doctorMatch && departmentMatch;
      })
    : [];

    setFilteredDocuments(filtered);
  };

  // Add this useEffect to automatically filter when data changes
  useEffect(() => {
    filterDocuments();
  }, [uploadedDocuments, doctorFilter, departmentFilter]);

  // Add clear filters function
  const clearFilters = () => {
    setDoctorFilter("");
    setDepartmentFilter("");
    setFilteredDocuments(uploadedDocuments);
  };

  const handleRadiologySubmit = () => {
    if (RadiologyName.RadiologyName) {
      const data = {
        ...RadiologyName,
        RadiologyName: RadiologyName.RadiologyName || "",
        Location: RadiologyName.Location || "",
        // AmountArray: drainsData2 || [],
        created_by: userRecord?.username || "",
      };
      console.log(" twodata", data);
      axios
        .post(`${UrlLink}Masters/Radiology_Names_link`, data, {
          headers: {
            Apikey: UserData.api_key,
            Apipassword: UserData.api_password,
            Sessionid: Usersessionid.session_id,
          },
        })
        .then((res) => {
          const [typp, mess] = Object.entries(res.data)[0];
          dispatchvalue({
            type: "toast",
            value: { message: mess, type: typp },
          });
          setIsRadiologyGet((prev) => !prev);
          setRadiologyName({
            RadiologyId: "",
            RadiologyName: "",
            Location: "",
          });
          // setDrainsData2([{ id: 1, From: "0", To: "", Amount: "" }]);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      dispatchvalue({
        type: "toast",
        value: { message: "Please provide the Radiology Name.", type: "warn" },
      });
    }
  };
  const handleeditRadiology = (params) => {
    console.log("23456", params);
    const { id, ...rest } = params;
    setRadiologyName({
      RadiologyId: id,
      Location: rest?.Location_Id,
      ...rest,
    });
  };

  // useEffect(() => {
  //   axios
  //     .get(`${UrlLink}Masters/Radiology_Names_link`, {
  //       headers: {
  //         Apikey: UserData.api_key,
  //         Apipassword: UserData.api_password,
  //         Sessionid: Usersessionid.session_id,
  //       },
  //     })
  //     .then((response) => {
  //       setRadiologyNames(response.data);
  //       console.log("response235999", response.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, [IsRadiologyGet, UrlLink]);

  useEffect(() => {
  axios
    .get(`${UrlLink}Masters/Radiology_Names_link`, {
      headers: {
        Apikey: UserData.api_key,
        Apipassword: UserData.api_password,
        Sessionid: Usersessionid.session_id,
      },
    })
    .then((response) => {
      // Check if response.data is an array
      const data = Array.isArray(response.data) ? response.data : [];

      // Always set an array in state
      setRadiologyNames(data);

      console.log("response235999", response.data);
    })
    .catch((err) => {
      console.log(err);
      setRadiologyNames([]); // fallback in case of error
    });
  }, [IsRadiologyGet, UrlLink]);


  // ----------testname--------
  const [TestName, setTestName] = useState({
    TestNameId: "",
    RadiologyId: "",
    RadiologyName: "",
    TestName: "",
    Amount: "",
    TestCode: "",
    Prev_Amount: "",
    Location: "",
    BookingFees: "",
    Prev_BookingFees: "",
    Status: "Active",
  });

  const [TestNames, setTestNames] = useState([]);
  const [IsTestNameGet, setIsTestNameGet] = useState(false);

  const [SelectedFile, setSelectedFile] = useState(null);
  const [getdata, setgetdata] = useState(false);

  const handleeditTestNameLast = (params) => {
    console.log("Params", params);
    setIsEditing(false); // Set editing state to false

    const {
      id,
      Curr_Amount,
      TestCode,
      Prev_Amount,
      Status,
      Prev_BookingFees,
      Curr_BookingFees,
      ...rest
    } = params; // Destructure params

    // Check if Sub_test_data is empty or not present
    if (!params.Sub_test_data || params.Sub_test_data.length === 0) {
      setTestName((prev) => ({
        ...prev,
        TestNameId: id,
        Prev_Amount: Prev_Amount || 0.0,
        Prev_BookingFees: Prev_BookingFees || 0.0,
        Amount: Curr_Amount || 0.0, // Set Curr_Amount correctly here
        TestCode: TestCode,
        BookingFees: Curr_BookingFees || 0.0, // Set Curr_BookingFees correctly here
        Location: rest.locationid,
        ...rest,
      }));
    } else {
      // Set joy state to true to show the grid

      setTestName((prev) => ({
        ...prev,
        TestNameId: id,
        TestCode: TestCode,
        Status: Status,
        Location: rest.locationid,
        ...rest,
      }));
    }
  };

  const handleTestNameChange = (e) => {
    const { name, value } = e.target;

    if (name === "Location") {
      setTestName((prev) => ({
        ...prev,
        [name]: value,
        RadiologyName: "",
        TestName: "",
        Amount: "",
        BookingFees: "",
        Prev_BookingFees: "",
      }));

      // ✅ Enable Radiology dropdown when Location is selected
      if (value) {
        setIsEditing(true);
      } else {
        setIsEditing(false); // Optional: disable again if location is cleared
      }
    } else if (name === "RadiologyName") {
      setTestName((prevState) => ({
        ...prevState,
        RadiologyName: value?.toUpperCase()?.trim(),
        TestName: "",
        BookingFees: "",
        Amount: "",
        Prev_BookingFees: "",
      }));
    } else if (name === "TestName") {
      setTestName((prevState) => ({
        ...prevState,
        TestName: value?.toUpperCase()?.trim(),
        Prev_BookingFees: "",
      }));
    } else {
      setTestName((prevState) => ({
        ...prevState,
        [name]: value?.toUpperCase()?.trim(),
      }));
    }
  };

  const handleTestNameSubmit = () => {
    // Check if all required fields for TestName are filled
    if (
      TestName.RadiologyName !== "" &&
      TestName.TestName !== ""
      // TestName.Types !== ""
    ) {
      const RadId = RadiologyNames.find(
        (p) => p.RadiologyName === TestName.RadiologyName
      );

      const data = {
        TestNameId: TestName.TestNameId,
        RadiologyName: RadId.id,
        TestName: TestName.TestName,
        Amount: TestName.Amount,
        created_by: userRecord?.username || "",
        location: userRecord?.location || "",
        TestCode: TestName.TestCode,
        Prev_BookingFees: TestName.Prev_BookingFees,
        Prev_Amount: TestName.Prev_Amount,
        BookingFees: TestName.BookingFees,
        Status: "Active",
      };

      // Logging data for debugging
      console.log("senddata123", data);

      // Create a new FormData object
      const formData = new FormData();

      // Append the data fields to FormData
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      // Append the file from ChooseFile if it exists
      if (ChooseFile.ChooseFileOne) {
        console.log("ChooseFile", ChooseFile.ChooseFileOne);
        formData.append("ChooseFile", ChooseFile.ChooseFileOne);
      }

      axios
        .post(`${UrlLink}Masters/Radiology_details_link`, formData, {
          headers: {
            Apikey: UserData.api_key,
            Apipassword: UserData.api_password,
            Sessionid: Usersessionid.session_id,
            "Content-Type": "multipart/form-data", // Add this line
          },
        })
        .then((res) => {
          const resData = res.data;
          const type = Object.keys(resData)[0];
          const message = Object.values(resData)[0];
          const tdata = {
            message: message,
            type: type,
          };
          dispatchvalue({ type: "toast", value: tdata });
          setIsTestNameGet((prev) => !prev);
          setTestName({
            TestNameId: "",
            RadiologyId: "",
            RadiologyName: "",
            TestName: "",
            Amount: "",
            SubTestName: "",
            TestCode: "",
            Prev_Amount: "",
            BookingFees: "",
            Location: "",
            Prev_BookingFees: "",
            Status: "Active",
          });
          setIsEditing(true);
          setChooseFile({ ChooseFileOne: null });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const tdata = {
        message: "Please provide Radiology Name, Test Name.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
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

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Radiology_details_link`, {
        headers: {
          Apikey: UserData.api_key,
          Apipassword: UserData.api_password,
          Sessionid: Usersessionid.session_id,
        },
      })
      .then((res) => {
        const ress = res.data;
        console.log("testname", ress);
        setTestNames(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [IsTestNameGet, UrlLink]);
  const handleeditTestNameStatus = (params) => {
    console.log("paramsteststatus", params);

    // Create a FormData object to handle the form data and file
    const formData = new FormData();

    // Append all necessary fields to FormData
    formData.append("TestCode", params.TestCode);
    formData.append("TestName", params.TestName);
    formData.append("RadiologyName", params.RadiologyId);
    formData.append("BookingFees", params.Curr_BookingFees || ""); // Add a default value if null
    formData.append("Prev_Amount", params.Prev_Amount || ""); // Add a default value if null
    formData.append("Prev_BookingFees", params.Prev_BookingFees || ""); // Add a default value if null
    formData.append(
      "Status",
      params.Status === "Active" ? "InActive" : "Active"
    );

    // Only append the file if it's available
    if (params.ChooseFile) {
      formData.append("ChooseFile", params.ChooseFile);
    }

    // Make the Axios POST request
    axios
      .post(`${UrlLink}Masters/Radiology_details_link`, formData, {
        headers: {
          Apikey: UserData.api_key,
          Apipassword: UserData.api_password,
          Sessionid: Usersessionid.session_id,
          "Content-Type": "multipart/form-data", // Required for form data
        },
      })
      .then((res) => {
        const resres = res.data;
        let typp = Object.keys(resres)[0];
        let mess = Object.values(resres)[0];
        const tdata = {
          message: mess,
          type: typp,
        };
        dispatchvalue({ type: "toast", value: tdata });
        setIsTestNameGet((prev) => !prev);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const TestNameColumns = [
    {
      key: "id",
      name: "S.No",
      frozen: true,
    },
    {
      key: "created_by",
      name: "Created By",
      frozen: true,
    },
    {
      key: "RadiologyName",
      name: "Radiology Department",
      frozen: true,
      width: 180,
    },
    {
      key: "TestCode",
      name: "Test Code",
      frozen: true,
    },
    {
      key: "TestName",
      name: "Test Name",
      width: 180,
    },
    {
      key: "BookingFees",
      name: "Booking Fees",
      children: [
        {
          key: "Prev_BookingFees",
          name: "Prev Booking Fees",
          width: 200,
          renderCell: (params) =>
            params.row.Types === "Yes" ? (
              <>-</>
            ) : (
              <>{params.row.Prev_BookingFees}</>
            ),
        },
        {
          key: "Curr_BookingFees",
          name: "Curr Booking Fees",
          width: 200,
          renderCell: (params) =>
            params.row.Types === "Yes" ? (
              <>-</>
            ) : (
              <>{params.row.Curr_BookingFees}</>
            ),
        },
      ],
    },
    {
      key: "Amount",
      name: "Amount",
      children: [
        {
          key: "Prev_Amount",
          name: "Prev Amount",
          width: 180,
          renderCell: (params) =>
            params.row.Types === "Yes" ? <>-</> : <>{params.row.Prev_Amount}</>,
        },
        {
          key: "Curr_Amount",
          name: "Curr Amount",
          width: 180,
          renderCell: (params) =>
            params.row.Types === "Yes" ? <>-</> : <>{params.row.Curr_Amount}</>,
        },
      ],
    },

    {
      key: "Status",
      name: "Status",
      renderCell: (params) => (
        <Button
          className="cell_btn"
          onClick={() => handleeditTestNameStatus(params.row)}
        >
          {params.row.Status}
        </Button>
      ),
    },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <>
          <Button
            className="cell_btn"
            onClick={() => handleeditTestNameLast(params.row)}
          >
            <EditIcon className="check_box_clrr_cancell" />
          </Button>
        </>
      ),
    },
  ];

  const [ChooseFile, setChooseFile] = useState({
    ChooseFileOne: null,
  });

  const handleinpchangeDocumentsForm = (e) => {
    const { name, files } = e.target;

    if (files && files.length > 0) {
      let formattedValue = files[0];

      // Update the allowed types to include Word documents
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "application/msword", // For .doc files
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // For .docx files
      ];
      const maxSize = 5 * 1024 * 1024; // Max size of 5MB

      if (
        !allowedTypes.includes(formattedValue.type) ||
        formattedValue.type === ""
      ) {
        const tdata = {
          message:
            "Invalid file type. Please upload a PDF, JPEG, PNG, DOC, or DOCX file.",
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

  // Add this useEffect to handle initial state
  useEffect(() => {
    setSelectedSection("radiology");
  }, []);

  // Add this function to handle radio change
  const handleSectionChange = (e) => {
    const value = e.target.value;
    setSelectedSection(value);
    // Force a re-render
    setIsEditing((prev) => !prev);
  };

  // Add useEffect to fetch doctors
  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/get_Doctor_Detials_link`, {
        headers: {
          Apikey: UserData.api_key,
          Apipassword: UserData.api_password,
          Sessionid: Usersessionid.session_id,
        },
      })
      .then((res) => {
        // Filter doctors to only include those from radiology departments
        const allDoctors = res.data;
        const radiologyDoctors = allDoctors.filter((doctor) => {
          // Check if doctor's department includes radiology-related terms
          const department = (doctor.Department || "").toLowerCase();
          return department.includes("radiology");
        });
        setDoctorList(radiologyDoctors);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, UserData, Usersessionid]);

  // Add handler for document upload form
  const handleDocumentUploadChange = (e) => {
    const { name, value } = e.target;
    console.log(value, "value123");
    setDocumentUpload((prev) => ({ ...prev, [name]: value }));
  };

  // Add handler for document file upload
  const handleDocumentFileUpload = (e) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const maxSize = 5 * 1024 * 1024;
      if (!allowedTypes.includes(file.type) || file.type === "") {
        dispatchvalue({
          type: "toast",
          value: {
            message:
              "Invalid file type. Please upload a PDF, JPEG, PNG, DOC, or DOCX file.",
            type: "warn",
          },
        });
      } else if (file.size > maxSize) {
        dispatchvalue({
          type: "toast",
          value: {
            message: "File size exceeds the limit of 5MB.",
            type: "warn",
          },
        });
      } else {
        setDocumentUpload((prev) => ({ ...prev, file }));
      }
    }
  };

  // Add function to handle document upload
  const handleDocumentUploadSubmit = () => {
    if (
      !documentUpload.department ||
      !documentUpload.doctor ||
      !documentUpload.file
    ) {
      dispatchvalue({
        type: "toast",
        value: {
          message: "Please select department, doctor, and upload a file.",
          type: "warn",
        },
      });
      return;
    }

    const formData = new FormData();
    const departmentId = RadiologyNames.find(
      (dept) => dept.RadiologyName === documentUpload.department
    )?.id;
    console.log("FormData:", {
      departmentId,
      doctorId: documentUpload.doctor,
      doctorName:
        doctorList.find((doc) => doc.id === documentUpload.doctor)?.Name || "",
      file: documentUpload.file,
      created_by: userRecord?.username || "",
    }); // Debug log
    formData.append("department", departmentId);
    formData.append("doctorId", documentUpload.doctor);
    formData.append(
      "doctorName",
      doctorList.find((doc) => doc.id === documentUpload.doctor)?.Name || ""
    );
    formData.append("file", documentUpload.file);
    formData.append("created_by", userRecord?.username || "");
    formData.append("edit_id", editDocumentId || null); // pass empty string if not editing

    const uploadUrl = `${UrlLink}Radiology/Upload_Document_link/`;
    console.log("Upload URL:", uploadUrl); // Debug log
    axios
      .post(uploadUrl, formData, {})
      .then((res) => {
        const { success, error } = res.data;
        dispatchvalue({
          type: "toast",
          value: {
            message: success || error,
            type: success ? "success" : "error",
          },
        });
        setDocumentUpload({ department: "", doctor: "", file: null });
        setIsDocumentGet((prev) => !prev);
        setEditDocumentId(null);
      })
      .catch((err) => {
        console.error("Upload Error:", err); // Debug log
        dispatchvalue({
          type: "toast",
          value: {
            message: "Error uploading document. Please try again.",
            type: "error",
          },
        });
      });
  };

  const [editorVisible, setEditorVisible] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);

  const handleViewDocument = (hashwar) => {
    console.log("logggiddd", hashwar);

    setSelectedDocId(hashwar?.id);
    setEditorVisible(true);
  };

  const handleOnCloseEditor = () => {
    setEditorVisible(false);
    // if (saved) {
    //   message.success('Document was updated successfully!');
    // }
  };

  // const handleViewDocument111 = (document) => {
  //   return (
  //     <DocumentEditor visible={true} onClose={handleOnCloseEditor} document={document} />
  //   )

  //   console.log(document, 'document')
  //   axios
  //     .get(`${UrlLink}Radiology/Documents_Edit_link/${document.id}/`, {
  //       headers: {
  //         Apikey: UserData.api_key,
  //         Apipassword: UserData.api_password,
  //         Sessionid: Usersessionid.session_id,
  //       },
  //     })
  //     .then((res) => {
  //       console.log("Documents_Edit_link response:", res.data);
  //       setCurrentDocument(res.data);
  //       setEditorContent(res.data.html || "");
  //       setViewModalOpen(true);
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching document:", err);
  //       dispatchvalue({
  //         type: "toast",
  //         value: {
  //           message: "Error fetching document. Please try again.",
  //           type: "error",
  //         },
  //       });
  //     });
  // };
  const handleDeleteDocument = (documentId) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      axios
        .post(`${UrlLink}Radiology/Delete_Document_link/${documentId}/`, {})
        .then((res) => {
          const { success, error } = res.data;
          dispatchvalue({
            type: "toast",
            value: {
              message: success || "Document deleted successfully",
              type: success ? "success" : "error",
            },
          });
          setIsDocumentGet((prev) => !prev); // Refresh document list
        })
        .catch((err) => {
          console.error("Delete Error:", err);
          dispatchvalue({
            type: "toast",
            value: {
              message: "Error deleting document. Please try again.",
              type: "error",
            },
          });
        });
    }
  };

  const handleEditDocument = (document) => {
    // Pre-fill the form fields
    console.log(document);

    const deptName = RadiologyNames.find(
      (d) => d.id === document.id
    )?.RadiologyName;
    console.log(deptName);

    setDocumentUpload((prev) => ({
      ...prev,
      department: deptName, // assuming this is department name
      doctor: document.doctorId, // use doctor ID, not name
      file: null,
    }));

    setEditDocumentId(document.id);
  };

  const handleSaveDocument = () => {
    if (!currentDocument?.id) {
      dispatchvalue({
        type: "toast",
        value: {
          message: "Document ID is missing.",
          type: "error",
        },
      });
      return;
    }
  };

  // Add columns for document grid
  const DocumentColumns = [
    {
      key: "id",
      name: "Document ID",
      frozen: true,
    },
    {
      key: "created_by",
      name: "Created By",
      frozen: true,
    },
    {
      key: "departmentname",
      name: "Department",
    },
    {
      key: "doctorName",
      name: "Doctor Name",
    },
    {
      key: "fileName",
      name: "File Name",
    },
    { key: "created_at", name: "Upload Date" },
    {
      key: "View",
      name: "View",
      renderCell: (params) => (
        <Button
          className="cell_btn"
          onClick={() => handleViewDocument(params.row)}
        >
          <PhotoCameraBackIcon className="check_box_clrr_cancell" />
        </Button>
      ),
    },
    {
      key: "Edit",
      name: "Edit",
      renderCell: (params) => (
        <Button
          className="cell_btn"
          onClick={() => handleEditDocument(params.row)}
        >
          <EditIcon className="check_box_clrr_cancell" />
        </Button>
      ),
    },
    {
      key: "Delete",
      name: "Delete",
      renderCell: (params) => (
        <Button
          className="cell_btn"
          onClick={() => handleDeleteDocument(params.row.id)}
        >
          <DeleteIcon className="check_box_clrr_cancell" />
        </Button>
      ),
    },
  ];

  // Add effect to fetch documents
  useEffect(() => {
    // You'll need to replace this with your actual endpoint
    axios
      .get(`${UrlLink}Radiology/Get_Documents_link`, {})
      .then((res) => {
        setUploadedDocuments(res.data);
        setFilteredDocuments(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [isDocumentGet, UrlLink, UserData, Usersessionid]);

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 900,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  const handleFileChange = (event) => {
    setSelectedFile(null);
    setSelectedFile(event.target.files[0]);
  };

  const handleCsvupload = () => {
    console.log(SelectedFile);
    const formData = new FormData();
    formData.append("file", SelectedFile);
    formData.append("created_by", userRecord?.username);

    if (SelectedFile) {
      axios
        .post(`${UrlLink}Masters/upload_testname_excel`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          console.log(response);
          setSelectedFile(null);

          let data = response.data;

          let type = Object.keys(data)[0];
          let mess = Object.values(data)[0];
          const tdata = {
            message: mess,
            type: type,
          };
          dispatchvalue({ type: "toast", value: tdata });
          setgetdata((prev) => !prev);
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });
    } else {
      // userwarn("Choose File");
    }
  };

  return (
    <>
      <div className="Main_container_app">
        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          <label>
            <input
              type="radio"
              name="section"
              value="radiology"
              checked={selectedSection === "radiology"}
              onChange={handleSectionChange}
            />
            Radiology Department
          </label>
          <label>
            <input
              type="radio"
              name="section"
              value="testname"
              checked={selectedSection === "testname"}
              onChange={handleSectionChange}
            />
            Radiology Test Master
          </label>
          <label>
            <input
              type="radio"
              name="section"
              value="document"
              checked={selectedSection === "document"}
              onChange={handleSectionChange}
            />
            Document Upload
          </label>
        </div>

        {selectedSection === "radiology" && (
          <>
            <div className="common_center_tag">
              <span>Radiology</span>
            </div>
            <div className="RegisFormcon_1">
              <div className="RegisForm_1">
                <label>
                  {" "}
                  Location <span>:</span>{" "}
                </label>

                <select
                  name="Location"
                  required
                  disabled={Boolean(RadiologyName.RadiologyId)}
                  value={RadiologyName.Location}
                  onChange={handleRadiologyChange}
                >
                  <option value="">Select</option>
                  {LocationData.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.locationName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="RegisForm_1">
                <label>
                  Radiology Department <span>:</span>
                </label>
                <input
                  type="text"
                  name="RadiologyName"
                  required
                  value={RadiologyName.RadiologyName}
                  autoComplete="off"
                  onChange={handleRadiologyChange}
                />
              </div>
            </div>
            <div className="Main_container_Btn">
              <button onClick={handleRadiologySubmit}>
                {RadiologyName.RadiologyId ? "Update" : "Save"}
              </button>
            </div>
            {RadiologyNames.length > 0 && (
              <ReactGrid columns={RadiologyColumns} RowData={RadiologyNames} />
            )}
          </>
        )}

        {selectedSection === "testname" && (
          <>
            <div className="common_center_tag">
              <span>Radiology Test Master</span>
            </div>
            <div className="RegisFormcon_1">
              <div className="RegisForm_1">
                <label>
                  {" "}
                  Location <span>:</span>{" "}
                </label>

                <select
                  name="Location"
                  required
                  disabled={TestName.TestNameId}
                  value={TestName.Location}
                  onChange={handleTestNameChange}
                >
                  <option value="">Select</option>
                  {LocationData.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.locationName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="RegisForm_1">
                <label>
                  Radiology Department <span>:</span>
                </label>
                <select
                  name="RadiologyName"
                  required
                  value={TestName.RadiologyName}
                  onChange={handleTestNameChange}
                  disabled={!isEditing}
                >
                  <option value="">Select</option>
                  {RadiologyNames?.map((dept, indx) => (
                    <option key={indx} value={dept.RadiologyName}>
                      {dept.RadiologyName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="RegisForm_1">
                <label>
                  Test Name <span>:</span>
                </label>
                <input
                  type="text"
                  name="TestName"
                  required
                  value={TestName.TestName}
                  autoComplete="off"
                  // disabled={!isEditing}
                  onChange={handleTestNameChange}
                />
              </div>
              <div className="RegisForm_1">
                <label>
                  Test Amount <span>:</span>
                </label>
                <input
                  type="number"
                  name="Amount"
                  autoComplete="off"
                  onKeyDown={(e) =>
                    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                  }
                  required
                  value={TestName.Amount}
                  onChange={handleTestNameChange}
                />
              </div>

              <div className="RegisForm_1">
                <label>
                  BookingFees <span>:</span>
                </label>
                <input
                  type="number"
                  name="BookingFees"
                  autoComplete="off"
                  onKeyDown={(e) =>
                    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                  }
                  required
                  value={TestName.BookingFees}
                  onChange={handleTestNameChange}
                />
              </div>

              <div className="RegisForm_1">
                {Object.keys(ChooseFile).map((field, indx) => (
                  <div className="RegisForm_1" key={indx}>
                    <label htmlFor={`${field}_${indx}_${field}`}>
                      {formatLabel(field)} <span>:</span>
                    </label>
                    <input
                      type="file"
                      name={field}
                      accept="image/jpeg, image/png, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      required
                      id={`${field}_${indx}_${field}`}
                      autoComplete="off"
                      onChange={handleinpchangeDocumentsForm}
                      style={{ display: "none" }}
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
                        htmlFor={`${field}_${indx}_${field}`}
                        className="RegisterForm_1_btns choose_file_update"
                      >
                        <PhotoCameraBackIcon />
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <label>
                  {" "}
                  Radiology Master Excel File<span>:</span>{" "}
                </label>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  id="Servicechoose"
                  required
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />

                <label
                  htmlFor="Servicechoose"
                  title="Choose File"
                  className="RegisterForm_1_btns choose_file_update"
                >
                  <PhotoCameraBackIcon />
                </label>
                <button
                  className="RegisterForm_1_btns choose_file_update"
                  onClick={handleCsvupload}
                  title="File Upload"
                >
                  <DriveFolderUploadIcon />
                </button>
              </div>
            </div>

            <div className="Main_container_Btn">
              <button onClick={handleTestNameSubmit}>
                {TestName.TestNameId ? "Update" : "Save"}
              </button>
            </div>
            {TestNames.length > 0 && (
              <ReactGrid columns={TestNameColumns} RowData={TestNames} />
            )}
          </>
        )}

        {selectedSection === "document" && (
          <>
            {console.log(documentUpload)}
            <div className="common_center_tag">
              <span>Document Upload</span>
            </div>
            <div className="RegisFormcon_1">
              <div className="RegisForm_1">
                <label>
                  Depart Name <span>:</span>
                </label>
                <select
                  name="department"
                  required
                  value={documentUpload.department}
                  onChange={handleDocumentUploadChange}
                >
                  <option value="">Select Departmen</option>
                  {RadiologyNames?.map((dept) => (
                    <option key={dept.id} value={dept.RadiologyName}>
                      {dept.RadiologyName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="RegisForm_1">
                <label>
                  Doctor Name <span>:</span>
                </label>
                <select
                  name="doctor"
                  required
                  value={documentUpload.doctor}
                  onChange={handleDocumentUploadChange}
                >
                  <option value="">Select Doctor</option>
                  {doctorList?.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.Name
                        ? doctor.Name.trim()
                        : doctor.ShortName || ""}
                    </option>
                  ))}
                </select>
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
                </div>
                {documentUpload.file && (
                  <div style={{ marginLeft: "10px" }}>
                    {documentUpload.file.name}
                  </div>
                )}
              </div>
              <div
                className="filter-container"
                style={{                 
                  padding: "10px",
                  background: "#f5f5f5",
                  borderRadius: "8px",
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  placeholder="Filter by Doctor Name"
                  value={doctorFilter}
                  onChange={(e) => setDoctorFilter(e.target.value)}
                  style={{
                    padding: "8px 10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    width: "200px",
                  }}
                />
                <input
                  type="text"
                  placeholder="Filter by Department"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  style={{
                    padding: "8px 10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    width: "200px",
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={clearFilters}
                  style={{ height: "36px" }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
            <div className="Main_container_Btn">
              <button onClick={handleDocumentUploadSubmit}>
                {editDocumentId ? "Update" : "Upload"}
              </button>
            </div>
            {uploadedDocuments.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <ReactGrid
                  columns={DocumentColumns}
                  RowData={filteredDocuments.length > 0 ? filteredDocuments : uploadedDocuments}
                />
              </div>
            )}
          </>
        )}
      </div>

      {editorVisible && (
        <DocumentEditor
          visible={editorVisible}
          onClose={handleOnCloseEditor}
          documentId={selectedDocId}
          from="masterfile"
          requestid={null}
          test={null}
        />
      )}

      <Modal
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setCurrentDocument(null);
          setEditorContent("");
        }}
      >
        <Box sx={modalStyle}>
          <h2>{currentDocument?.fileName || "View Document"}</h2>
          {currentDocument && (
            <>
              <p>
                <strong>Department:</strong> {currentDocument.department}
              </p>
              <p>
                <strong>Doctor:</strong> {currentDocument.doctorName}
              </p>
              {currentDocument.fileType === ".docx" ||
              currentDocument.fileType === ".doc" ? (
                <JoditRichEditor
                  initialContent={editorContent}
                  onSave={(newContent) => setEditorContent(newContent)}
                />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: editorContent }} />
              )}
              <div style={{ marginTop: "10px", textAlign: "right" }}>
                {currentDocument.fileType === ".docx" ||
                currentDocument.fileType === ".doc" ? (
                  <Button
                    variant="contained"
                    onClick={handleSaveDocument}
                    style={{ marginRight: "10px" }}
                  >
                    Save
                  </Button>
                ) : null}
                <Button
                  variant="outlined"
                  onClick={() => {
                    setViewModalOpen(false);
                    setCurrentDocument(null);
                    setEditorContent("");
                  }}
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </Box>
      </Modal>

      <ToastAlert Message={toast.message} Type={toast.type} />
    </>
  );
};

export default RadiologyMaster;
