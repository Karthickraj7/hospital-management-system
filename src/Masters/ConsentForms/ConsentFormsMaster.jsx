import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import ModelContainer from "../../OtherComponent/ModelContainer/ModelContainer";
import { renderMatches } from "react-router-dom";

const ConsentFormsMaster = () => {
  const dispatchvalue = useDispatch();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const toast = useSelector((state) => state.userRecord?.toast);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [Consent, setConsent] = useState({

    ConsentId: "",
    Department: "",
    ConsentFormsName: "",
    ConsentFormsID: "",
    ConsentFile: null,
  });
  console.log("Consent", Consent);
  console.log("ConsentFile", Consent.ConsentFile);
  const [ConsentData, setConsentData] = useState([]);
  const [IsConsentGet, setIsConsentGet] = useState(false);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Department_Detials_link`)
      .then((response) => {
        setDepartmentData(Array.isArray(response.data) ? response.data : []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/ConsentName_Detials_link`)
      .then((res) => {

        setConsentData(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [IsConsentGet, UrlLink]);

  const handleeditConsentName = (params) => {
    setConsent({
      ConsentId: params.id,
      Department: params.DepartmentId,
      ConsentFormsName: params.ConsentFormsName,
      ConsentFormsID: params.ConsentFormsID,
      ConsentFile: params.ChooseFile || null,
    });
  };


  const handleConsentChange = (e) => {
    const { name, value } = e.target;
    setConsent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleConsentSubmit = () => {
    if (!Consent.Department || !Consent.ConsentFormsName || !Consent.ConsentFormsID) {
      const tdata = {
        message: "Please fill in all required fields: Department, Consent Form Name, and Consent Form ID.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    const data = {
      ...Consent,
      created_by: userRecord?.username || "",
    };

    axios.post(`${UrlLink}Masters/ConsentName_Detials_link`, data, {
      headers: { "Content-Type": "application/json" },
    })

      .then((res) => {
        const tdata = {
          message: res.data.success || res.data.warn,
          type: res.data.success ? "success" : "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });

        setIsConsentGet((prev) => !prev);

        setConsent({
          ConsentId: "",  // If it's not needed, remove it
          Department: "",
          ConsentFormsName: "",
          ConsentFormsID: "",
          ConsentFile: null,
        });
      })
      .catch((err) => {
        console.error("Error submitting form:", err);
        const tdata = {
          message: "An error occurred while submitting the form. Please try again.",
          type: "error",
        };
        dispatchvalue({ type: "toast", value: tdata });
      });
  };

  const handleinpchangeDocumentsForm = (e) => {
    const { name, files } = e.target;

    // Ensure that files exist and are not empty
    if (files && files.length > 0) {
      const formattedValue = files[0];

      // Optional: Add validation for file type and size
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"]; // Example allowed types
      const maxSize = 5 * 1024 * 1024; // Example max size of 5MB
      if (
        !allowedTypes.includes(formattedValue.type) ||
        formattedValue.type === ""
      ) {
        // Dispatch a warning toast or handle file type validation
        const tdata = {
          message: "Invalid file type. Please upload a PDF, JPEG, or PNG file.",
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
      } else if (formattedValue.size > maxSize) {
        // Dispatch a warning toast or handle file size validation
        const tdata = {
          message: "File size exceeds the limit of 5MB.",
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          setConsent((prev) => ({
            ...prev,
            [name]: reader.result,
          }));
        };
        reader.readAsDataURL(formattedValue);
      }
    } else {
      // Handle case where no file is selected
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
      if (
        ["data:image/jpeg;base64", "data:image/jpg;base64"].includes(
          fileval?.split(",")[0]
        )
      ) {
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

  // const handleeditStatus = (params) => {
  //   console.log("params", params)
  //   const data = {
  //     ConsentId: params.id,
  //     Statusedit:true

  //   }
  //   axios.post(`${UrlLink}Masters/ConsentName_Detials_link`, data)
  //     .then((res) => {
  //       let typp = Object.keys(res)[0]
  //       let mess = Object.values(res)[0]
  //       const tdata = {
  //         message: mess,
  //         type: typp,
  //       }
  //       dispatchvalue({ type: 'toast', value: tdata });
  //       setIsConsentGet((prev) => !prev);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     })
  // }

  return (
    <>
      <div className="Main_container_app">
        <h3>Consent Form Master</h3>
        <div className="common_center_tag">
          <span>Consent Form Master</span>
        </div>
        <div className="RegisFormcon_1">


          {["Department","ConsentFormsID", "ConsentFormsName"].map(
            (field, indx) => (
              <div className="RegisForm_1" key={indx}>
                <label>
                  {field === "Department"
                    ? "Department"
                    : field === "ConsentFormsName"
                      ? "ConsentForms Name"
                      : "ConsentForms ID"}{" "}
                  <span>:</span>
                </label>
                {field === "Department" ? (
                  <select
                    name={field}
                    value={Consent[field]}
                    onChange={handleConsentChange}
                  >
                    <option value="">Select Department</option>
                    {DepartmentData.filter((p) => p.Status === "Active").map(
                      (dept, index) => (
                        <option key={index} value={dept.id}>
                          {dept.DepartmentName}
                        </option>
                      )
                    )}
                  </select>
                ) : (
                  <input
                    type="text"
                    name={field}
                    value={Consent[field]}
                    onChange={handleConsentChange}
                    autoComplete="off"
                  />
                )}
              </div>
            )
          )}
          <div className="RegisForm_1">
            <label>
              ChooseFile <span>:</span>
            </label>
            <div className="RegisterForm_2">
              {" "}
              <input
                type="file"
                name="ConsentFile"
                accept="image/jpeg, image/png, application/pdf"
                style={{ display: "none" }}
                id="ConsentForm"
                onChange={handleinpchangeDocumentsForm}
                autoComplete="off"
              />
              <div
                style={{
                  width: "120px",
                  display: "flex",
                  justifyContent: "flex-start",
                  gap: "20px",
                }}
              >
                <label
                  title="Choose Consent Form"
                  htmlFor={"ConsentForm"}
                  className="RegisterForm_1_btns choose_file_update"
                >
                  <PhotoCameraBackIcon />
                </label>

                <button
                  className="RegisterForm_1_btns choose_file_update"
                  onClick={() => {
                    Selectedfileview(Consent.ConsentFile);
                  }}
                >
                  <VisibilityIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="Main_container_Btn">
          <button onClick={handleConsentSubmit}>
            {Consent.ConsentId ? "Update" : "Save"}
          </button>
        </div>

        {ConsentData && ConsentData.length > 0 && (
          <ReactGrid
            columns={[
              { key: "id", name: "Consent Id", frozen: true },
             
              { key: "Department", name: "Department Name" },
          
              { key: "ConsentFormsID", name: "ConsentForms ID" },
              { key: "ConsentFormsName", name: "ConsentForms Name" },
              // {
              //   key: "Status",
              //   name: "Status",
              //   renderCell: (params) => (
              //     <Button
              //       className="cell_btn"
              //       onClick={() => handleeditStatus(params.row)}
              //     >
              //       {params.row.Status}
              //     </Button>
              //   ),
              // },
              {
                key: "Action",
                name: "Action",
                renderCell: (params) => (
                  <Button
                    className="cell_btn"
                    onClick={() => handleeditConsentName(params.row)}
                  >
                    <EditIcon className="check_box_clrr_cancell" />
                  </Button>
                ),
              },
              { key: "created_by", name: "Created By", frozen: true },
            ]}
            RowData={ConsentData}
          />
        )}
      </div>
      <ToastAlert Message={toast.message} Type={toast.type} />
      <ModelContainer />
    </>
  );
};

export default ConsentFormsMaster;
