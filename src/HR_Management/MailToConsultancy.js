import { React, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function MailToConsultancy() {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const Jobapproveeddata = useSelector(
    (state) => state.userRecord?.Jobapproveeddata
  );



  const navigate = useNavigate();
  const Urllink = useSelector((state) => state.userRecord?.UrlLink);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const [consultancymaster, setconsultancymaster] = useState([]);

  const [masterformData, setmasterFormData] = useState({
    Consultancyname: "",
    Contactpersonname: "",
    PhoneNumber: "",
    CompanyAddress: "",
    ConsultingService: "",
    EmailFrom: "",
    EmailTo: "",
    // Signature: null,
    Message: '',
    Department: '',
    Role: '',
    NoofOpenings: '',
    Qualification: '',
    Experience: '',
    JobDescription: '',
    Enddate: '',
  });
  useEffect(() => {
    // Format the Message field with specific properties of Jobapproveeddata
    // const formattedMessage = `Department         : ${Jobapproveeddata.Department}\n` +
    //                          `Role               : ${Jobapproveeddata.Role}\n` +
    //                          `No of Openings     : ${Jobapproveeddata.No_of_Openings}\n` +
    //                          `Qualification      : ${Jobapproveeddata.Qualification}\n` +
    //                          `Experience         : ${Jobapproveeddata.Experience}\n` + 
    //                          `JobDescription     : ${Jobapproveeddata.JobDescription}`
  
    setmasterFormData({
      ...masterformData,
      Department: Jobapproveeddata.Department,
      Role: Jobapproveeddata.Role,
      NoofOpenings: Jobapproveeddata.No_of_Openings,
      Qualification: Jobapproveeddata.Qualification,
      Experience: Jobapproveeddata.Experience,
      JobDescription: Jobapproveeddata.JobDescription,
      Enddate: Jobapproveeddata?.Enddate,
      // Message: formattedMessage,
    });
  }, [Jobapproveeddata]);

  useEffect(() => {
    axios
      .get(
        `${Urllink}HRmanagement/getconsultancymaster?location=${userRecord?.location}`
      )
      .then((response) => {
        console.log(response.data);
        setconsultancymaster(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userRecord?.location]);

 



  const resetFormData = () => {
    setmasterFormData({
   Consultancyname: "",
    Contactpersonname: "",
    PhoneNumber: "",
    CompanyAddress: "",
    ConsultingService: "",
    EmailFrom: "",
    EmailTo: "",
    // Signature: null,
    Message: '',
    });
  };

  console.log(masterformData);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If the changed field is the consultancy name field
    if (name === "Consultancyname") {
      // Find the selected consultancy object from the consultancymaster array
      const selectedConsultancy = consultancymaster.find(
        (consultancy) => consultancy.Consultancyname === value
      );

      // Update the form data state with the selected consultancy's details
      setmasterFormData({
        ...masterformData,
        [name]: value,
        Contactpersonname: selectedConsultancy?.Contactpersonname || "",
        PhoneNumber: selectedConsultancy?.PhoneNumber || "",
        CompanyAddress: selectedConsultancy?.CompanyAddress || "",
        ConsultingService: selectedConsultancy?.ConsultingService || "",
      });
    } else {
      // Add a condition to check phone number length
      if (name === "PhoneNumber" && value.length > 10) {
        // Show alert message if phone number length exceeds 10
        alert("Phone number cannot exceed 10 characters.");
        return; // Prevent updating state if condition is met
      }

      // Update form data state for other fields
      setmasterFormData({
        ...masterformData,
        [name]: value,
      });
    }
  };
  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   setmasterFormData({
  //     ...masterformData,
  //     Signature: file,
  //   });
  // };

  const handlesendemail = () => {
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
      .post(`${Urllink}HRmanagement/sendjobopeningemail_toconsultancy`, formDataObj)
      .then((response) => {
        console.log(response.data);
        resetFormData();
        successMsg("Email sent Successfully");
  
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
        <h4>Mail To Consultancy</h4>
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
            list="consultancyList" // Associate with datalist
            value={masterformData?.Consultancyname}
            onChange={handleChange} // Handle consultancy name change
          />
          <datalist id="consultancyList">
            {consultancymaster.map((consultancy, index) => (
              <option key={index} value={consultancy.Consultancyname}>
                Name: {consultancy.Contactpersonname}
              {" , "}
                <br />
                PhoneNumber<span>:</span> {consultancy.PhoneNumber}
              </option>
            ))}
          </datalist>
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
          <label htmlFor="EmailFrom">
            Email From <span>:</span>
          </label>
          <input
            id="EmailFrom"
            name="EmailFrom"
            value={masterformData?.EmailFrom}
            onChange={handleChange}
          />
        </div>

        <div className="RegisForm_1">
          <label htmlFor="EmailTo">
            Email To <span>:</span>
          </label>
          <input
            id="EmailTo"
            name="EmailTo"
            value={masterformData?.EmailTo}
            onChange={handleChange}
          />
        </div>
        {/* <div class="RegisForm_1">
          <label>
            Subject <span>:</span>
          </label>
          <textarea
            name="Subject"
            value={masterformData?.Subject}
            onChange={handleChange}
            required
          ></textarea>
        </div> */}
        {/* <div className="RegisForm_1">
          <label>
            Signature<span>:</span>
          </label>
          <div className="RegisterForm_2">
            <input
              type="file"
              id="Signature"
              name="Signature"
              className="hiden-nochse-file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
            />
            <label
              htmlFor="Signature"
              className="RegisterForm_1_btns choose_file_update"
            >
              Choose File
            </label>
          </div>
        </div> */}
      </div>
      
      <br />
      <div className="Otdoctor_intra_Con">
        <div className="Otdoctor_intra_Con_2 with_increse_85">
          <label htmlFor="Message">
            Message <span>:</span>
          </label>
          <textarea
            name="Message"
            id="Message"
            value={masterformData?.Message}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>
      <br />
      <div className="Register_btn_con">
        <button className="RegisterForm_1_btns" onClick={handlesendemail}>
          Send Email
        </button>
        <ToastContainer />
      </div>
    </div>
  );
}

export default MailToConsultancy;
