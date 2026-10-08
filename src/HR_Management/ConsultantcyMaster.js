import { React, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ConsultantcyMaster() {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const ConsultancyMasterdata = useSelector(
    (state) => state.userRecord?.ConsultancyMasterdata
  );
  console.log(ConsultancyMasterdata);
  const navigate = useNavigate();
  const Urllink = useSelector((state) => state.userRecord?.UrlLink);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);

  const [masterformData, setmasterFormData] = useState({
    Consultancyname: "",
    Contactpersonname: "",
    PhoneNumber: "",
    Email: "",
    SharePercentage: "",
    CompanyAddress: "",
    ConsultingService: "",
    ContractForm: null,
    Status: "",
  });

  useEffect(() => {
    if (ConsultancyMasterdata) {
      if (ConsultancyMasterdata.ContractForm) {
        try {
          const byteCharacters = atob(
            ConsultancyMasterdata.ContractForm.split(",")[1]
          );
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "application/pdf" });
          console.log(blob);

          setmasterFormData((prevMasterformData) => ({
            ...prevMasterformData,
            ...ConsultancyMasterdata,
            ContractForm: blob,
          }));
        } catch (error) {
          console.error("Error creating Blob from data URL:", error);
        }
      }
    }
  }, [ConsultancyMasterdata]);

  const buttonText =
    ConsultancyMasterdata && Object.keys(ConsultancyMasterdata).length > 0
      ? "Update"
      : "Register";

  console.log(buttonText);

  const resetFormData = () => {
    setmasterFormData({
      Consultancyname: "",
      Contactpersonname: "",
      PhoneNumber: "",
      Email: "",
      SharePercentage: "",
      CompanyAddress: "",
      ConsultingService: "",
      ContractForm: null,
    });
  };

  console.log(masterformData);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Add a condition to check phone number length
    if (name === "PhoneNumber" && value.length > 10) {
      // Show alert message if phone number length exceeds 10
      alert("Phone number cannot exceed 10 characters.");
      return; // Prevent updating state if condition is met
    }

    // Update form data state
    setmasterFormData({
      ...masterformData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setmasterFormData({
      ...masterformData,
      ContractForm: file,
    });
  };

  const handleRegister = () => {
    for (const key in masterformData) {
      if (!masterformData[key]) {
        warnmessage(`${key} field is mandatory.`);
        return; // Prevent registration if any field is empty
      }
    }

    const formDataObj = new FormData();
    // Append form data to FormData object
    for (let key in masterformData) {
      formDataObj.append(key, masterformData[key]);
    }

    formDataObj.append("CreatedBy", userRecord?.username);
    formDataObj.append("Location", userRecord?.location);

    axios
      .post(`${Urllink}HRmanagement/Post_ConsulantcyMaster`, formDataObj)
      .then((response) => {
        console.log(response.data);
        resetFormData();
        successMsg("Register Successfully");
        navigate('/Home/Consultancy-Typeup-List')
      })
      .catch((error) => {
        console.error(error);
        errmsg(error);
      });
  };

  const successMsg = (msg) => {
    toast.success(`${msg}`, {
      position: "top-center",
      autoClose: 100,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      style: { marginTop: "50px" },
    });
  };

  const warnmessage = (wmsg) => {
    toast.warn(`${wmsg}`, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      style: { marginTop: "50px" },
    });
  };

  const errmsg = (errorMessage) => {
    toast.error(`${errorMessage}`, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      style: { marginTop: "50px" },
    });
  };

  return (
    <div className="appointment">
      <div className="h_head">
        <h4>Consultancy Master</h4>
      </div>
      <br />
      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label htmlFor="Consultancyname">
            Consultancy Name <span>:</span>
          </label>
          <input
            id="Consultancyname"
            name="Consultancyname"
            value={masterformData?.Consultancyname}
            onChange={handleChange}
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="Contactpersonname">
            Contact Person Name<span>:</span>
          </label>
          <input
            id="Contactpersonname"
            name="Contactpersonname"
            value={masterformData?.Contactpersonname}
            onChange={handleChange}
          />
        </div>
        <div className="RegisForm_1">
          <label>
            Phone Number <span>:</span>
          </label>
          <input
            id="PhoneNumber"
            name="PhoneNumber"
            value={masterformData?.PhoneNumber}
            onChange={handleChange}
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="Email">
            Email <span>:</span>
          </label>
          <input
            id="Email"
            name="Email"
            value={masterformData?.Email}
            onChange={handleChange}
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="SharePercentage">
            Share Percentage Per Head <span>:</span>
          </label>
          <input
            id="SharePercentage"
            name="SharePercentage"
            value={masterformData?.SharePercentage}
            onChange={handleChange}
          />
        </div>
        <div class="RegisForm_1">
          <label>
            Company Address <span>:</span>
          </label>
          <textarea
            name="CompanyAddress"
            value={masterformData?.CompanyAddress}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="RegisForm_1">
          <label htmlFor="ConsultingService">
            Consulting Service <span>:</span>
          </label>
          <input
            id="ConsultingService"
            name="ConsultingService"
            value={masterformData?.ConsultingService}
            onChange={handleChange}
          />
        </div>
        <div className="RegisForm_1">
          <label>
            Contract Form<span>:</span>
          </label>
          <div className="RegisterForm_2">
            <input
              type="file"
              id="ContractForm"
              name="ContractForm"
              className="hiden-nochse-file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
            />
            <label
              htmlFor="ContractForm"
              className="RegisterForm_1_btns choose_file_update"
            >
              Choose File
            </label>
          </div>
        </div>
        <div className="RegisForm_1">
          <label htmlFor="Status">
            Status<span>:</span>
          </label>
          <select
            id="Status"
            name="Status"
            value={masterformData.Status}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="Active">Active</option>
            <option value="InActive">In-Active</option>
          </select>
        </div>
      </div>
      <br />
      <div className="Register_btn_con">
        <button className="RegisterForm_1_btns" onClick={handleRegister}>
          {buttonText}
        </button>
        <ToastContainer />
      </div>
    </div>
  );
}

export default ConsultantcyMaster;

