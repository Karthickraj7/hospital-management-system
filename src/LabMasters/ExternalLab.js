import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";



function ExternalLab() {
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);

  const dispatchExternalLabdata = useSelector(
    (state) => state.Frontoffice?.LabEditData
  );


  console.log(dispatchExternalLabdata, "dispatchExternalLabdata");

  const navigate = useNavigate();
  const [emailBorderColor, setEmailBorderColor] = useState("black"); // Default to black
  const [phoneBorderColor, setPhoneBorderColor] = useState("black"); // Default to black

  const [externalLabData, setExternalLabData] = useState({
    labName: "",
    registerNo: "",
    labCode: "",
    address: "",
    email: "",
    phoneNumber: "",
    pincode: "",
    referenceCode: "",
    source: "",
    location: "",
    Type: "ExternalLabMaster",
    IsEditMode: false,
    createdby: userRecord?.username,
  });
  console.log(externalLabData)
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value); // Get the input name and its new value
    setExternalLabData({
      ...externalLabData, // Spread the current state
      [name]: value, // Update the changed value
    });
  };

  const validateEmail = () => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/; // Ensure email ends with @gmail.com
    if (emailPattern.test(externalLabData.email)) {
      setEmailBorderColor("green"); // Correct email
    } else if (externalLabData.email === "") {
      setEmailBorderColor("black"); // No input, keep it black
    } else {
      setEmailBorderColor("red"); // Incorrect email
    }
  };

  const validatePhoneNumber = () => {
    const phonePattern = /^[0-9]{10}$/; // Ensure the phone number is exactly 10 digits
    if (phonePattern.test(externalLabData.phoneNumber)) {
      setPhoneBorderColor("green"); // Correct phone number
    } else if (externalLabData.phoneNumber === "") {
      setPhoneBorderColor("black"); // No input, keep it black
    } else {
      setPhoneBorderColor("red"); // Incorrect phone number
    }
  };

  const handlesubmit = () => {
    console.log(externalLabData);

    axios
      .post(`${urllink}/Masters/All_Other_Lab_Masters_POST_AND_GET`, externalLabData)
      .then((response) => {
        console.log(response.data);
        if (response.data.success == true) {
          successMsg(response.data.message);
        } else {
          userwarn(response.data.message);
        }
        navigate("/Home/Master");

        setExternalLabData({
          labName: "",
          registerNo: "",
          labCode: "",
          address: "",
          email: "",
          phoneNumber: "",
          pincode: "",
          referenceCode: "",
          source: "",
          location: "",
        });
      })
      .catch((error) => {
        console.log("error :", error);
        alert("An error occurred: " + error.message); // Improved error message
      });

    console.log("externalLabData", externalLabData);
  };

  useEffect(() => {
    if (Object.keys(dispatchExternalLabdata).length === 0) {
      axios
        .get(
          `${urllink}Masters/Get_All_Other_Masters_PrimaryCodes?Type=ExternalLabMaster`
        )
        .then((res) => {
          console.log(res);
          setExternalLabData((prevData) => ({
            ...prevData,
            labCode: res.data.Lab_Code,
          }));
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      setExternalLabData((prevData) => ({
        ...prevData,
        labName: dispatchExternalLabdata?.LabName,
        registerNo: dispatchExternalLabdata?.RegisterNo,
        labCode: dispatchExternalLabdata?.LabCode,
        address: dispatchExternalLabdata?.Address,
        email: dispatchExternalLabdata?.Email,
        phoneNumber: dispatchExternalLabdata?.PhoneNo,
        pincode: dispatchExternalLabdata?.Pincode,
        referenceCode: dispatchExternalLabdata?.ReferenceCode,
        source: dispatchExternalLabdata?.SourceType,
        location: dispatchExternalLabdata?.Location,
        IsEditMode: true,
      }));
    }
  }, [dispatchExternalLabdata, urllink]);


  const successMsg = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      containerId: "toast-container-over-header",
      style: { marginTop: "50px" },
    });
  };
  const userwarn = (warningMessage) => {
    toast.warn(`${warningMessage}`, {
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
  const errmsg = (error) => {
    toast.error(error, {
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
    <div className="Main_container_app">

      <h3>External Lab</h3>
      <br />

      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label htmlFor="labCode">
            Lab Code<span>:</span>
          </label>
          <input
            type="text"
            id="labCode"
            name="labCode"
            required
            disabled
            value={externalLabData.labCode}
            onChange={handleInputChange}
          />
        </div>

        <div className="RegisForm_1">
          <label htmlFor="labName">
            Lab Name<span className="mandatory"></span>
            <span>:</span>
          </label>
          <input
            type="text"
            id="labName"
            name="labName"
            required
            value={externalLabData.labName}
            onChange={handleInputChange}
            autoComplete="off"
          />
        </div>

        <div className="RegisForm_1">
          <label htmlFor="registerNo">
            Register No<span>:</span>
          </label>
          <input
            type="text"
            id="registerNo"
            name="registerNo"
            required
            value={externalLabData.registerNo}
            onChange={handleInputChange}
            autoComplete="off"
          />
        </div>

        <div className="RegisForm_1">
          <label htmlFor="address">
            Address<span>:</span>
          </label>
          <textarea
            id="address"
            name="address"
            required
            value={externalLabData.address}
            onChange={handleInputChange}
            autoComplete="off"
          ></textarea>
        </div>

        <div className="RegisForm_1">
          <label htmlFor="email">
            Email <span>:</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}"
            value={externalLabData.email}
            onChange={handleInputChange}
            autoComplete="off"
            onBlur={validateEmail}
            style={{
              borderColor: emailBorderColor, // Dynamically set border color
            }}
          />
        </div>

        <div className="RegisForm_1">
          <label htmlFor="phoneNumber">
            Phone <span>:</span>
          </label>
          <input
            type="text" // Use text instead of number to prevent unwanted behavior
            id="phoneNumber"
            name="phoneNumber"
            required
            maxLength={10} // Limit to 10 characters
            value={externalLabData.phoneNumber}
            onChange={handleInputChange}
            autoComplete="off"
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
            onBlur={validatePhoneNumber}
            style={{
              borderColor: phoneBorderColor, // Dynamically set border color
            }}
          />
        </div>

        <div className="RegisForm_1">
          <label htmlFor="pincode">
            Pincode<span>:</span>
          </label>
          <input
            type="text"
            id="pincode"
            name="pincode"
            required
            pattern="[0-9]+"
            title="Please enter a valid pincode with only numbers"
            value={externalLabData.pincode}
            onChange={handleInputChange}
            autoComplete="off"
          />
        </div>

        <div className="RegisForm_1">
          <label htmlFor="referenceCode">
            Reference Code<span>:</span>
          </label>
          <input
            type="text"
            id="referenceCode"
            name="referenceCode"
            required
            value={externalLabData.referenceCode}
            onChange={handleInputChange}
            autoComplete="off"
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="location">
            {" "}
            Location<span className="mandatory"></span>
            <span>:</span>
          </label>
          <input
            type="text"
            id="location"
            name="location"
            required
            value={externalLabData.location}
            onChange={handleInputChange}
            autoComplete="off"
          />
        </div>

        <div className="RegisForm_1">
          <label htmlFor="source">
            Source Type<span className="mandatory"></span>
            <span>:</span>
          </label>
          <select
            name="source"
            onChange={handleInputChange}
            value={externalLabData.source || ""}
          >
            <option value="">Select</option>
            <option value="Outsource">Outsource</option>
            <option value="Insource">Insource</option>
          </select>
        </div>
      </div>

      <div className="Main_container_Btn">
        <button onClick={handlesubmit}>
          {externalLabData?.IsEditMode ? "Update" : "Submit"}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ExternalLab;

