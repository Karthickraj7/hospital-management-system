import { React, useState, useRef, useEffect } from "react";
import CameraswitchIcon from "@mui/icons-material/Cameraswitch";
import Webcam from "react-webcam";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useSelector,useDispatch } from "react-redux";



import {
  differenceInYears,
  format,
  startOfYear,
  subYears,
  isBefore,
} from "date-fns";

// import male from "../Assets/maledoctor.jpg";
// import female from "../Assets/femaledoctor.jpg";

const EmployeeRegister = () => {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const UrlLink = useSelector(state => state.userRecord?.UrlLink);
  const dispatchvalue = useDispatch();

  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const urllink = useSelector(state => state.userRecord?.UrlLink);

  const foremployeeedit = useSelector(
    (state) => state.userRecord?.foremployeeedit
  );
  const [SelectedFile, setSelectedFile] = useState(null);


  const webcamRef1 = useRef(null);
  const Navigate = useNavigate();
  const [expanded, setExpanded] = useState("panel1");
  const [showFile, setShowFile] = useState({
    file1: false,
  });
  const [isImageCaptured1, setIsImageCaptured1] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const [rollname, setrollname] = useState([]);
  const [location, setlocation] = useState([]);
  const [TitleNameData, setTitleNameData] = useState([]);
  const [BloodGroupData, setBloodGroupData] = useState([]);

  console.log( BloodGroupData, "njndjje");
  


  const [department, setdepartment] = useState([]);
  const [formData, setFormData] = useState({
    FirstName: "",
    MiddleName: "",
    SurName: "",
    name: "",
    fatherName: "",
    title: "",
    dob: "",
    Age: "",
    gender: "",
    email: "",
    qualification: "",
    maritalStatus: "",
    aadharnumber: "",
    phone: "",
    alternatePhone: "",
    communicationAddress: "",
    permanentAddress: "",
    nationality: "",
    reference1: "",
    reference1No: "",
    photo: null,
    bloodgroup: '',

    employeeId: "",
    department: "",
    CapturedFile123: "",
    designation: "",
    specialist: "",
    dateOfJoining: "",
    srnumber: "",
    mcinumber: "",
    manager: "",
    sickLeave: "",
    casualLeave: "",
    totalLeave: "",
    status: "",
    createdby: userRecord?.username,
    locations: "",
    branchlocation: userRecord?.location,
    TDS_Percentage: '',


    salaryType: "",
    payScale: "",
    perHour: "",
    commission: "",
    fixedamount: "",
    comissionAmount: "",
    remarks: "",
    travel: "",
    hrallowance: "",
    medical: "",
    ctc: '',
    StipendAmount: '',

    accountName: "",
    accountNumber: "",
    bankName: "",
    branch: "",
    ifscCode: "",
    pannumber: "",

    epfnumber: "",
    uannumber: "",
    esiamount: "",
    Signature: null,

  });




  useEffect(() => {
    axios.get(`${UrlLink}Masters/Title_Master_link`)
        .then((res) => {
            const resData = res.data;
            setTitleNameData(resData);
        })
        .catch((err) => {
            console.log(err);
        });
}, [ UrlLink]);

  useEffect(() => {
    axios.get(`${UrlLink}Masters/BloodGroup_Master_link`)
        .then((res) => {
            const resData = res.data;
            console.log(resData,'resData');
            
            setBloodGroupData(resData);
        })
        .catch((err) => {
            console.log(err);
        });
}, [ UrlLink]);

  const [facingMode, setFacingMode] = useState("user");
  const devices = ["iPhone", "iPad", "Android", "Mobile", "Tablet", "desktop"];
  const [IsmobileorNot, setIsmobileorNot] = useState(null);

  useEffect(() => {
    // Use an axios request within useEffect to avoid infinite rendering
    axios
      .get(`${urllink}patientmanagement/detect_device`)
      .then((response) => {
        setIsmobileorNot(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []); // The empty dependency array ensures that this effect runs only once on mount

  const videoConstraints = {
    facingMode: facingMode,
    
  };

  const switchCamera = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  useEffect(() => {
    axios
      .get(
        `${urllink}HRmanagement/getRole_bydept?department=${formData.department}`
      )
      .then((response) => {

        setrollname(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get(`${urllink}usercontrol/getlocationdata`)
      .then((response) => {

        setlocation(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get(`${urllink}usercontrol/getDepartment`)
      .then((response) => {

        setdepartment(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userRecord?.location, formData.department, formData.ctc]);


  const base64toFile = (base64String, fileName, mimeType) => {
    if (!base64String) {
      console.error("base64String is undefined or null.");
      return null;
    }

    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const paddedBase64String = base64String + padding;

    try {
      const byteString = atob(paddedBase64String);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array = new Uint8Array(arrayBuffer);

      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([arrayBuffer], { type: mimeType });
      return new File([blob], fileName, { type: mimeType });
    } catch (error) {
      console.error("Error decoding base64 string:", error);
      return null;
    }
  };


  useEffect(() => {
    if (foremployeeedit && foremployeeedit.length > 0) {
      const employee = foremployeeedit[0];
      const updatedFormData = {
        name: employee.EmployeeName,
        fatherName: employee.FatherName,
        title: employee.Title,
        dob: employee.DateofBirth,
        age: employee.Age,
        gender: employee.Gender,
        email: employee.Email,
        qualification: employee.Qualification,
        maritalStatus: employee.MartialStatus,
        aadharnumber: employee.AadhaarNumber,
        phone: employee.PhoneNumber,
        alternatePhone: employee.AlternatePhoneNumber,
        communicationAddress: employee.CommunicationAddress,
        permanentAddress: employee.PermanentAddress,
        nationality: employee.Nationality,
        reference1: employee.ReferenceName,
        reference1No: employee.EmergencyContact,
        photo: base64toFile(employee.EmployeePhoto, "captured_image.jpg", "image/jpeg"),
        employeeId: employee.EmployeeID,
        department: employee.Department,
        CapturedFile123: base64toFile(employee.DoctorSign, "sign.pdf", "application/pdf"),
        CapturedFile1: base64toFile(employee.Resume, "resume.pdf", "application/pdf"),
        CapturedFile2: base64toFile(employee.OfferLetter, "offer_letter.pdf", "application/pdf"),
        CapturedFile3: base64toFile(employee.Contract, "contract.pdf", "application/pdf"),
        CapturedFile4: base64toFile(employee.JoiningLetter, "joining_letter.pdf", "application/pdf"),
        CapturedFile5: base64toFile(employee.Others, "others.pdf", "application/pdf"),
        createdby: userRecord?.username,
        branchlocation: userRecord?.location,
        designation: employee.Designation,
        specialist: employee.Specialist,
        dateOfJoining: employee.DateofJoining,
        srnumber: employee.State_Registration_number,
        mcinumber: employee.MCI_Number,
        manager: employee.ReportingManager,
        sickLeave: employee.Sick_LeaveDays_PerYear,
        casualLeave: employee.Casual_LeaveDays_PerYear,
        totalLeave: employee.Total_LeaveDays_PerYear,
        status: employee.EmployeeStatus,
        salaryType: employee.SalaryType,
        payScale: employee.PayScale,
        perHour: employee.PerHour,
        Signature: employee.Signature,
        commission: employee.PercentageOfCommission,
        fixedamount: employee.FixedAmount,
        comissionAmount: employee.ComissionAmount,
        remarks: employee.Remarks,
        travel: employee.Travel_Allowance_Percentage,
        hrallowance: employee.HRA_Allowance_Percentage,
        medical: employee.Medical_Allowance_Percentage,
        accountName: employee.AccountName,
        accountNumber: employee.AccountNumber,
        bankName: employee.BankName,
        branch: employee.Branch,
        ifscCode: employee.IFSCCode,
        pannumber: employee.PanNumber,
        epfnumber: employee.EPFNumber,
        uannumber: employee.UANNumber,
        esiamount: employee.ESI_Amount_Percentage,
        ctc: employee.CTC_Per_Annum_In_Lakhs,
        pfEmployee: employee.PF_for_Employee_Percentage,
        pfEmployeer: employee.PF_for_Employeer_Percentage,
        TDS_Percentage: employee.TDS_Percentage,
        locations: employee.Employee_Location
      };
      setFormData(updatedFormData);
    } else {
      axios
        .get(`${urllink}HRmanagement/get_employee_Id?location=${userRecord?.location}`)
        .then((response) => {
          setFormData((prevData) => ({
            ...prevData,
            employeeId: response.data.nextemployeeid,
          }));
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [foremployeeedit, userRecord, urllink]);

  const cleardata = () => {
    setFormData({
      name: "",
      fatherName: "",
      title: "",
      dob: "",
      age: "",
      gender: "",
      email: "",
      qualification: "",
      maritalStatus: "",
      aadharnumber: "",
      phone: "",
      alternatePhone: "",
      communicationAddress: "",
      permanentAddress: "",
      nationality: "",
      reference1: "",
      reference1No: "",
      photo: "",

      employeeId: "",
      department: "",
      CapturedFile123: "",
      designation: "",
      srnumber: "",
      mcinumber: "",
      dateOfJoining: "",
      manager: "",
      status: "",
      createdby: userRecord?.username,
      locations: "",
      branchlocation: userRecord?.location,

      salaryType: "",
      payScale: "",

      perHour: "",
      commission: "",
      fixedamount: "",
      comissionAmount: "",
      remarks: "",
      ctc: "",
      travel: "",
      hrallowance: "",
      medical: "",
      pfEmployee: "",
      pfEmployeer: "",

      accountName: "",
      accountNumber: "",
      bankName: "",
      branch: "",
      ifscCode: "",
      pannumber: "",

      epfnumber: "",
      uannumber: "",
      esiamount: "",

      CapturedFile1: "",
      CapturedFile2: "",
      CapturedFile3: "",
      CapturedFile4: "",
      CapturedFile5: "",
      Signature: null,
    });
  };

  const buttonText =
    foremployeeedit && foremployeeedit.length > 0 ? "Update" : "Register";



  const handleRegister = () => {


    // Create a FormData object
    const formData1 = new FormData();

    // Append data to FormData object
    Object.keys(formData).forEach((key) => {
      formData1.append(key, formData[key]);
    });

    // List of required fields
    const requiredFields = [
      "name",
      "title",
      "dob",
      "age",
      "gender",
      "phone",
      "communicationAddress",
      "nationality",
      "permanentAddress",
      "department",
      "designation",
    ];

    // Check for empty required fields
    const emptyFields = requiredFields.filter((field) => !formData[field]);

    // If there are empty fields, show an alert and return
    if (emptyFields.length > 0) {
      alert(`The following fields are required: ${emptyFields.join(", ")}`);
      return;
    }

    // Make the axios request
    axios
      .post(
        `${urllink}HRmanagement/insert_Employee_Register`,
        formData1
      )
      .then((response) => {

        successMsg("Saved Successfully");
        cleardata();
        setTimeout(() => {
          Navigate("/Home/Employee-List");
        }, 1000);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [salaryType, setSalaryType] = useState("fixed");

  const handleSalaryTypeChange = (e) => {
    setSalaryType(e.target.value);
  };

  const [formData3, setFormData3] = useState({
    CapturedImage1: null,
  });


  const handleChange12 = (e) => {
    const { name, value, files } = e.target;

    const formattedValue = [
      "FirstName",
      "MiddleName",
      "SurName",
      "qualification",
      
    ].includes(name)
      ? `${value.charAt(0).toUpperCase()}${value.slice(1)}`
      : value;

      if (
        [
          
          "FirstName",
          "MiddleName",
          "SurName",
          
        ].includes(name) &&
        value.length > 30
      ) {
        const tdata = {
          message: `${name} should not exceed 30 characters.`,
          type: "warn", // Ensure 'warn' is a valid type for your toast system
        };
        dispatchvalue({ type: "toast", value: tdata });
        return; // Exit early to prevent state update
      }  


    const intValue = parseInt(value, 10);
    if (name === "dob") {
      const currentDate = new Date();
      const selectedDate = new Date(value);
      const minAllowedDate = new Date();
      minAllowedDate.setFullYear(currentDate.getFullYear() - 100); // DOB must be within the last 100 years
  
      if (selectedDate >= minAllowedDate && selectedDate <= currentDate) {
        const age = currentDate.getFullYear() - selectedDate.getFullYear();
        setFormData((prevData) => ({
          ...prevData,
          dob: value,
          age: age
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          dob: value,
          age: ""
        }));
      }
  
    // Handling Age input to calculate DOB
    } else if (name === "age") {
      if (!isNaN(intValue) && intValue >= 0 && intValue <= 100) {  // Age validation
        const currentDate = new Date();
        const targetYear = currentDate.getFullYear() - intValue;
        const dob = new Date(targetYear, 0, 1);  // Approximate DOB as Jan 1 of calculated year
        setFormData((prevData) => ({
          ...prevData,
          age: intValue,
          dob: dob.toISOString().split("T")[0]
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          age: intValue,
          dob: ""
        }));
      }
    }
    
    else if (name === "photo") {
      // If user selects an employee photo, update the state directly
      setFormData((prevData) => ({
        ...prevData,
        [name]: e.target.files[0],
      }));
    } else if (name === "gender" && value) {
      let defaultPhotoFile = null;


      // const defaultPhotoPath = value === "male" ? male : female; 

      const defaultPhotoPath = value === "male" ? null : null;


      // Fetch the default photo file
      fetch(defaultPhotoPath)
        .then((response) => response.blob()) // Convert response to blob
        .then((blob) => {
          // Create a File object from the blob
          defaultPhotoFile = new File([blob], `${value}_captured_image.jpg`, {
            type: "image/jpeg",
          });

          // Update formData with the File object
          setFormData((prevData) => ({
            ...prevData,
            [name]: value,
            photo: defaultPhotoFile,
          }));
        })
        .catch((error) => {
          console.error("Error fetching default photo:", error);
        });
    } else {
      if (
        name === "alternatePhone" ||
        name === "phone" ||
        name === "reference1No"
      ) {
        const newval = value.length;
        if (newval <= 10) {
          setFormData((prevData) => ({
            ...prevData,
            [name]: value,
          }));
        } else {
          warnmessage("Phone No must contain 10 digits");
        }
      } else if (
        (name === "CapturedFile123" ||
          name === "photo" ||
          name === "CapturedFile1" ||
          name === "CapturedFile2" ||
          name === "CapturedFile3" ||
          name === "CapturedFile4" ||
          name === "CapturedFile5") &&
        files.length > 0
      ) {
        // Access the file object itself
        const fileObject = e.target.files[0];

        setFormData((prevData) => ({
          ...prevData,
          [name]: fileObject,
        }));
      } else if (name === 'travel') {
        if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 100)) {
          setFormData((prevData) => ({
            ...prevData,
            [name]: value,
          }));
        } else {
          warnmessage("Travel Allowance must be between 0 and 100.");
        }

      }
      else if (name === 'hrallowance') {
        if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 100)) {
          setFormData((prevData) => ({
            ...prevData,
            [name]: value,
          }));
        } else {
          warnmessage("HRA Allowance must be between 0 and 100.");
        }

      }
      else if (name === 'medical') {
        if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 100)) {
          setFormData((prevData) => ({
            ...prevData,
            [name]: value,
          }));
        } else {
          warnmessage("Medical Allowance must be between 0 and 100.");
        }

      }
      else if (name === 'pfEmployee') {
        if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 100)) {
          setFormData((prevData) => ({
            ...prevData,
            [name]: value,
          }));
        } else {
          warnmessage("PF for Employee Percentage must be between 0 and 100.");
        }

      }
      else if (name === 'pfEmployeer') {
        if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 100)) {
          setFormData((prevData) => ({
            ...prevData,
            [name]: value,
          }));
        } else {
          warnmessage("PF for Employeer Percentage must be between 0 and 100.");
        }

      }
      else if (name === 'commission') {
        if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 100)) {
          setFormData((prevData) => ({
            ...prevData,
            [name]: value,
          }));
        } else {
          warnmessage("commission Percentage must be between 0 and 100.");
        }

      }
      else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    }
  };

  const handleRecaptureImage1 = () => {

    setFormData3((prev) => ({
      ...prev,
      CapturedImage1: null,
    }));
    setIsImageCaptured1(false);
  };

    const handleCaptureImage1 = () => {
      const imageSrc = webcamRef1.current.getScreenshot();
      const blob = imageSrc
        ? dataURItoBlob(imageSrc, "captured_image.jpg")
        : null;

      setFormData({
        ...formData,
        photo:
          blob instanceof Blob ? new File([blob], "captured_image.jpg") : null,
      });
      setIsImageCaptured1(true);
    };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const handleChangeSickLeave = (e) => {
    const value = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      sickLeave: value,
      totalLeave: calculateTotalLeave(value, prevData.casualLeave),
    }));
  };

  const handleChangeCasualLeave = (e) => {
    const value = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      casualLeave: value,
      totalLeave: calculateTotalLeave(prevData.sickLeave, value),
    }));
  };

  const calculateTotalLeave = (sickLeave, casualLeave) => {
    const sickLeaveValue = parseInt(sickLeave) || 0;
    const casualLeaveValue = parseInt(casualLeave) || 0;
    return sickLeaveValue + casualLeaveValue;
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



  const handleFileChange = (event) => {
    setSelectedFile(null);
    const { name } = event.target;
    setSelectedFile(event.target.files[0]);

    // Additional handling based on the name attribute
    if (name === "Personal") {
      // Handle Service file

    } else if (name === "Roll") {

    } else if (name === "Finance") {

    } else if (name === "Bank") {

    } else if (name === "EPF") {

    } else if (name === "Documents") {

    }
  };

  const handleCsvupload = (type) => {

    const formData = new FormData();
    formData.append("file", SelectedFile);

    if (SelectedFile) {
      if (type === "Personal") {
        axios
          .post(
            `${urllink}HRmanagement/post_personaldetails_csvfile`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          )
          .then((response) => {

            successMsg("File Processed Successfully");
            setSelectedFile(null);
          })
          .catch((error) => {
            console.error(error);

          });
      } else if (type === "Roll") {
        axios
          .post(
            `${urllink}HRmanagement/post_rollmanagement_csvfile`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          )
          .then((response) => {

            successMsg("File Processed Successfully");

            setSelectedFile(null);
          })
          .catch((error) => {
            console.error(error);
          });
      } else if (type === "Finance") {
        axios
          .post(
            `${urllink}HRmanagement/post_financedetails_csvfile`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          )
          .then((response) => {

            successMsg("File Processed Successfully");

            setSelectedFile(null);
          })
          .catch((error) => {
            console.error(error);

          });
      } else if (type === "Bank") {
        axios
          .post(
            `${urllink}HRmanagement/post_bankdetails_csvfile`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          )
          .then((response) => {

            successMsg("File Processed Successfully");

            setSelectedFile(null);
          })
          .catch((error) => {
            console.error(error);

          });
      } else if (type === "EPF") {
        axios
          .post(
            `${urllink}HRmanagement/post_epfdetails_csvfile`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          )
          .then((response) => {

            successMsg("File Processed Successfully");

            setSelectedFile(null);
          })
          .catch((error) => {
            console.error(error);

          });
      } else if (type === "Documents") {
        axios
          .post(
            `${urllink}HRmanagement/post_documentsdetails_csvfile`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          )
          .then((response) => {

            successMsg("File Processed Successfully");

            setSelectedFile(null);
          })
          .catch((error) => {
            console.error(error);

          });
      }
    }
  };



  useEffect(() => {
    let salaryType = formData.salaryType
    if (salaryType !== 'fixed') {
      setFormData(prev => ({
        ...prev,
        ctc: '',
        esiamount: '',
        travel: '',
        hrallowance: '',
        medical: '',
        pfEmployee: '',
        pfEmployeer: ''
      }))
    }
    else if (salaryType !== 'hourly') {
      setFormData(prev => ({
        ...prev,
        perHour: '',
      }))
    }
    else if (salaryType !== 'commission') {
      setFormData(prev => ({
        ...prev,
        commission: '',
        fixedamount: '',
        comissionAmount: '',
        remarks: ''
      }))
    }
  }, [formData.salaryType])

  return (
    <div className="Main_container_app">
        <h3>New Employee Register</h3>
      

      <div className="DivCenter_container">
        Personal Details
      </div>
      <br />

      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label>
            Employee ID <span>:</span>
          </label>
          <input
            type="text"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange12}
            requiredz
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="title">
            Title <span>:</span>
          </label>
          <select
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange12}
            required
          >
            <option value="">Select</option>
            {TitleNameData?.map((row, indx) => (
              <option key={indx} value={row.id}>
                {row.Title}
              </option>
            ))}
          </select>
        </div>

        <div class="RegisForm_1">
          <label>
          First Name <span>:</span>
          </label>
          <input
            type="text"
            name="FirstName"
            value={formData.FirstName}
            onChange={handleChange12}
            required
          />
        </div>

        <div class="RegisForm_1">
          <label>
          Middle Name <span>:</span>
          </label>
          <input
            type="text"
            name="MiddleName"
            value={formData.MiddleName}
            onChange={handleChange12}
            required
          />
        </div>
        <div class="RegisForm_1">
          <label>
          Sur Name <span>:</span>
          </label>
          <input
            type="text"
            name="SurName"
            value={formData.SurName}
            onChange={handleChange12}
            required
          />
        </div>
        <div class="RegisForm_1">
          <label>
            DOB <span>:</span>
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange12}
          />
        </div>
        <div class="RegisForm_1">
          <label>
            Age <span>:</span>
          </label>
          <input
            type="text"
            name="Age"
            value={formData.Age}
            onChange={handleChange12}
          />
        </div>

        <div class="RegisForm_1">
          <label>
            Gender <span>:</span>
          </label>
          <select
            name="gender"
            required
            value={formData.gender}
            onChange={handleChange12}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="TransGender">TransGender</option>
          </select>
        </div>
        <div class="RegisForm_1">
          <label>
            Blood Group <span>:</span>
          </label>
          <select
            name="bloodgroup"
            id="bloodgroup"
            required
            value={formData.bloodgroup}
            onChange={handleChange12}
          >
             <option value="">Select</option>
            {BloodGroupData?.map((row, indx) => (
              <option key={indx} value={row.id}>
                {row.BloodGroup}
              </option>
            ))}
          </select>
        </div>

        <div class="RegisForm_1">
          <label>
            Email <span>:</span>
          </label>
          <input
            type="email"
            name="email"
            pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
            value={formData.email}
            onChange={handleChange12}
            required
          />
        </div>
        <div className="RegisForm_1">
          <label>
            Qualification <span>:</span>
          </label>
          <input
            type="text"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange12}
            required
          />
        </div>
        <div class="RegisForm_1">
          <label>
            Marital Status <span>:</span>
          </label>
          <select
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleChange12}
            required
          >
            <option value="">Select</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </div>
        <div class="RegisForm_1">
          <label>
            Aadhar Number <span>:</span>
          </label>
          <input
            type="number"
            name="aadharnumber"
            value={formData.aadharnumber}
            onChange={handleChange12}
            required
          />
        </div>

        <div class="RegisForm_1">
          <label>
            Phone <span>:</span>
          </label>
          <input
            type="number"
            name="phone"
            pattern="[0-9]*"
            value={formData.phone}
            onChange={handleChange12}
            required
          />
        </div>
        <div class="RegisForm_1">
          <label>
            Alternate Phone<span>:</span>
          </label>
          <input
            type="number"
            name="alternatePhone"
            pattern="[0-9]*"
            value={formData.alternatePhone}
            onChange={handleChange12}
            required
          />
        </div>
        <div class="RegisForm_1">
          <label>
            Communication Address <span>:</span>
          </label>
          <textarea
            name="communicationAddress"
            value={formData.communicationAddress}
            // placeholder='Enter Local Address'
            onChange={handleChange12}
            required
          ></textarea>
        </div>

        <div class="RegisForm_1">
          <label>
            Permanent Address <span>:</span>
          </label>
          <textarea
            name="permanentAddress"
            // className="txt-ara-lclprntm"
            value={formData.permanentAddress}
            onChange={handleChange12}
            required
          ></textarea>
        </div>

        <div class="RegisForm_1">
          <label>
            Nationality <span>:</span>
          </label>
          <select
            name="nationality"
            required
            value={formData.nationality}
            onChange={handleChange12}
          >
            <option value="">Select</option>
            <option value="male">Indian</option>
            <option value="female">International</option>
          </select>
        </div>
        <div class="RegisForm_1">
          <label>
            Emergency Contact <span>:</span>
          </label>
          <input
            type="tel"
            name="reference1No"
            pattern="[0-9]*"
            value={formData.reference1No}
            onChange={handleChange12}
            required
          />
        </div>
        <div class="RegisForm_1">
          <label>
            Name <span>:</span>
          </label>
          <input
            type="text"
            name="reference1"
            value={formData.reference1}
            onChange={handleChange12}
            required
          />
        </div>

        <div class="RegisForm_1">
          <label>
            Photo <span>:</span>
          </label>
          <div className="RegisterForm_2">
            <input
              type="file"
              id="photo"
              name="photo"
              className="hiden-nochse-file"
              style={{ display: "none" }}
              accept="image/*,.pdf"
              onChange={(e) => handleChange12(e, "photo")}
              required
            />
            <label
              htmlFor="photo"
              className="RegisterForm_1_btns choose_file_update"
            >
              Choose File
            </label>
          </div>
          <span>or </span>
          <div className="RegisterForm_2">
            <button
              onClick={() => setShowFile({ file1: true })}
              className="RegisterForm_1_btns choose_file_update"
            >
              Capture pic
            </button>

            {showFile.file1 && (
              <div
                className={
                  isSidebarOpen
                    ? "sideopen_showcamera_takepic"
                    : "showcamera_takepic"
                }
                onClick={() =>
                  setShowFile({
                    file1: false,
                  })
                }
              >
                <div
                  className={
                    isSidebarOpen
                      ? "sideopen_showcamera_1_takepic1"
                      : "showcamera_1_takepic1"
                  }
                  onClick={(e) => e.stopPropagation()}
                >
                  {formData3.CapturedImage1 ? ( // Display the captured image
                    <img
                      src={URL.createObjectURL(formData3.CapturedImage1)}
                      alt="captured"
                      className="captured-image11"
                    />
                  ) : (
                    <div className="camera-container">
                      <div className="web_head">
                        <h3>Image</h3>
                      </div>
                      <br></br>
                      <div className="RotateButton_canva">
                        <Webcam
                          audio={false}
                          ref={webcamRef1}
                          screenshotFormat="image/jpeg"
                          mirrored={facingMode === "user"}
                          className="web_cam"
                          videoConstraints={videoConstraints}
                        />
                        {!devices.includes(IsmobileorNot) && (
                          <button onClick={switchCamera}>
                            <CameraswitchIcon />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="web_btn">
                    {isImageCaptured1 ? (
                      <button
                        onClick={handleRecaptureImage1}
                        className="btncon_add"
                      >
                        Recapture
                      </button>
                    ) : (
                      <button
                        onClick={handleCaptureImage1}
                        className="btncon_add"
                      >
                        Capture
                      </button>
                    )}

                    <button
                      onClick={() =>
                        setShowFile({
                          file1: false,
                        })
                      }
                      className="btncon_add"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>




        <div className="RegisForm_1">
          <label>
            {" "}
            Upload CSV File <span>:</span>{" "}
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
            className="RegisterForm_1_btns choose_file_update"
          >
            Choose File
          </label>
          <button
            className="RegisterForm_1_btns choose_file_update"
            onClick={() => handleCsvupload("Personal")}
          >
            Upload
          </button>
        </div>
      </div>
      <br />
      <div className="DivCenter_container">
        <span>Roll Management</span>
      </div>
      <br />

      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label>
            Department <span>:</span>
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange12}
            required
          >
            <option value="">Select</option>
            {department.map((department) => (
              <option
                key={department.Dept_id}
                value={department.Department_name}
              >
                {department.Department_name}
              </option>
            ))}
          </select>
        </div>

        <div className="RegisForm_1">
          <label>
            Designation <span>:</span>
          </label>
          <select
            name="designation"
            value={formData.designation}
            onChange={handleChange12}
            required
          >
            <option value="">Select</option>
            {rollname.map((role) => (
              <option key={role.role_id} value={role.role_name}>
                {role.role_name}
              </option>
            ))}
          </select>
        </div>
        <div className="RegisForm_1">
          <label>
            Locations <span>:</span>
          </label>
          <select
            name="locations"
            id="location"
            value={formData.locations}
            onChange={handleChange12}
          >
            <option value="">Select</option>
            {location.map((location) => (
              <option
                key={location.location_id}
                value={location.location_name}
              >
                {location.location_name}
              </option>
            ))}
          </select>
        </div>

        {formData.designation === "THERAPIST" && (
          <div className="RegisFormcon">
            <div class="RegisForm_1">
              <label>
                Specialist <span>:</span>
              </label>
              <input
                type="text"
                name="specialist"
                value={formData.specialist}
                onChange={handleChange12}
                required
              />
            </div>
          </div>
        )}
        {formData.department === "DOCTOR" && (
          <>
            <div class="RegisForm_1">
              <label>
                Specialist <span>:</span>
              </label>
              <input
                type="text"
                name="specialist"
                value={formData.specialist}
                onChange={handleChange12}
                required
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Signature <span>:</span>
              </label>
              <div className="RegisterForm_2">
                <input
                  type="file"
                  id="CapturedFile123"
                  name="CapturedFile123"
                  accept="image/*,.pdf"
                  className="hiden-nochse-file"
                  onChange={handleChange12}
                  required
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor="CapturedFile123"
                  className="RegisterForm_1_btns choose_file_update"
                >
                  Choose File
                </label>
              </div>
            </div>
            <div class="RegisForm_1">
              <label>
                State Registration Number <span>:</span>
              </label>
              <input
                type="text"
                name="srnumber"
                value={formData.srnumber}
                onChange={handleChange12}
                required
              />
            </div>
            <div class="RegisForm_1">
              <label>
                MCI Number <span>:</span>
              </label>
              <input
                type="text"
                name="mcinumber"
                value={formData.mcinumber}
                onChange={handleChange12}
                required
              />
            </div>
          </>
        )}

        <div className="RegisForm_1">
          <label>
            Date of Joining <span>:</span>
          </label>
          <input
            type="date"
            name="dateOfJoining"
            value={formData.dateOfJoining}
            onChange={handleChange12}
            required
          />
        </div>

        <div className="RegisForm_1">
          <label>
            Reporting Manager <span>:</span>
          </label>
          <input
            name="manager"
            value={formData.manager}
            onChange={handleChange12}
            required
          ></input>
        </div>

        <div className="RegisForm_1">
          <label>
            Employee Status <span>:</span>
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange12}
            required
          >
            {" "}
            <option value="">Select</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="RegisForm_1">
          <label>
            Govt Leave (.yrs) <span>:</span>
          </label>
          <input
            type="number"
            name="sickLeave"
            value={formData.sickLeave}
            onChange={handleChangeSickLeave}
            required
          ></input>
        </div>
        <div className="RegisForm_1">
          <label>
            Casual Leave (.yrs) <span>:</span>
          </label>
          <input
            type="number"
            name="casualLeave"
            value={formData.casualLeave}
            onChange={handleChangeCasualLeave}
            required
          ></input>
        </div>
        <div className="RegisForm_1">
          <label>
            Total Leave (.yrs) <span>:</span>
          </label>
          <input
            name="totalLeave"
            value={formData.totalLeave}
            // onChange={handleChange12}
            readOnly
            required
          ></input>
        </div>

        <div className="RegisForm_1">
          <label>
            {" "}
            Upload CSV File <span>:</span>{" "}
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
            className="RegisterForm_1_btns choose_file_update"
          >
            Choose File
          </label>
          <button
            className="RegisterForm_1_btns choose_file_update"
            onClick={() => handleCsvupload("Roll")}
          >
            Upload
          </button>
        </div>
      </div>
      <br />
      <div className="DivCenter_container">
        <span>Finance Details</span>
      </div>
      <br />

      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label>
            Salary Type<span>:</span>
          </label>
          <select
            name="salaryType"
            value={formData.salaryType}
            onChange={handleChange12}
            onClick={handleSalaryTypeChange}
            required
          >
            <option value="">Select</option>
            <option value="fixed">Fixed Salary</option>
            <option value="Stipend">Stipend</option>

          </select>
        </div>

        <div className="RegisForm_1">
          <label>
            Pay Scale<span>:</span>
          </label>
          <select
            name="payScale"
            value={formData.payScale}
            onChange={handleChange12}
            required
          >
            <option value="">Select</option>
            <option value="entryLevel">Entry Level</option>
            <option value="midLevel">Mid Level</option>
            <option value="seniorLevel">Senior Level</option>
          </select>
        </div>




        {formData.salaryType === "fixed" && (
          <>
            {/* <div className="RegisFormcon"> */}
            <div className="RegisForm_1">
              <label>CTC (Per Annum in Lakhs) :</label>
              <input
                type="text"
                name="ctc"
                value={formData.ctc}
                onChange={handleChange12}
              />
            </div>

            <div className="RegisForm_1">
              <label htmlFor="esinumber">
                ESI Amount (%) <span>:</span>
              </label>
              <input
                type="text"
                name="esiamount"
                id="esiamount"
                value={formData.esiamount}
                onChange={handleChange12}
                required
              />
            </div>
            {/* </div>
            <div className="RegisFormcon"> */}
            <div className="RegisForm_1">
              <label>
                Travel Allowance (%) <span>:</span>
              </label>
              <input
                type="text"
                name="travel"
                value={formData.travel}
                onChange={handleChange12}
              />
            </div>
            <div className="RegisForm_1">
              <label>
                HRA Allowance (%) <span>:</span>
              </label>
              <input
                type="text"
                name="hrallowance"
                value={formData.hrallowance}
                onChange={handleChange12}
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Medical Allowance (%) <span>:</span>
              </label>
              <input
                type="text"
                name="medical"
                value={formData.medical}
                onChange={handleChange12}
              />
            </div>
            {/* </div> */}

            {/* <div className="RegisFormcon"> */}
            <div className="RegisForm_1">
              <label>
                PF for Employee (%)<span>:</span>
              </label>
              <input
                type="text"
                name="pfEmployee"
                value={formData.pfEmployee}
                onChange={handleChange12}
              />
            </div>

            <div className="RegisForm_1">
              <label>
                PF for Employeer (%) <span>:</span>
              </label>
              <input
                type="text"
                name="pfEmployeer"
                value={formData.pfEmployeer}
                onChange={handleChange12}
              />
            </div>
            <div className="RegisForm_1">
              <label htmlFor="TDS_Percentage">
                TDS (%) <span>:</span>
              </label>
              <input
                type="text"
                name="TDS_Percentage"
                id="TDS_Percentage"
                value={formData.TDS_Percentage}
                onChange={handleChange12}
              />
            </div>
            {/* </div> */}
          </>
        )}


        {formData.salaryType === 'Stipend' && (
          <>
            <div className="RegisFormcon">
              <div className="RegisForm_1">
                <label>Stipend Amount :</label>
                <input
                  type="text"
                  name="StipendAmount"
                  id="StipendAmount"
                  value={formData.StipendAmount}
                  onChange={handleChange12}
                />
              </div>
            </div>
          </>
        )}

        <div className="RegisForm_1">
          <label>
            {" "}
            Upload CSV File <span>:</span>{" "}
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
            className="RegisterForm_1_btns choose_file_update"
          >
            Choose File
          </label>
          <button
            className="RegisterForm_1_btns choose_file_update"
            onClick={() => handleCsvupload("Finance")}
          >
            Upload
          </button>
        </div>
      </div>
      <br />
      <div className="DivCenter_container">
        <span>Bank Details</span>
      </div>
      <br />

      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label>
            Account Holder Name<span>:</span>
          </label>
          <input
            type="text"
            name="accountName"
            value={formData.accountName}
            onChange={handleChange12}
            required
          />
        </div>
        <div className="RegisForm_1">
          <label>
            Account Number<span>:</span>
          </label>
          <input
            type="number"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange12}
            required
          />
        </div>

        <div className="RegisForm_1">
          <label>
            Bank Name<span>:</span>
          </label>
          <input
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange12}
            required
          />
        </div>

        <div className="RegisForm_1">
          <label>
            Branch<span>:</span>
          </label>
          <input
            type="text"
            name="branch"
            value={formData.branch}
            onChange={handleChange12}
            required
          />
        </div>

        <div className="RegisForm_1">
          <label>
            IFSC Code <span>:</span>
          </label>
          <input
            type="text"
            name="ifscCode"
            value={formData.ifscCode}
            onChange={handleChange12}
            required
          />
        </div>
        <div className="RegisForm_1">
          <label>
            Pan Number <span>:</span>
          </label>
          <input
            type="text"
            name="pannumber"
            value={formData.pannumber}
            onChange={handleChange12}
            required
          />
        </div>

        <div className="RegisForm_1">
          <label>
            {" "}
            Upload CSV File <span>:</span>{" "}
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
            className="RegisterForm_1_btns choose_file_update"
          >
            Choose File
          </label>
          <button
            className="RegisterForm_1_btns choose_file_update"
            onClick={() => handleCsvupload("Bank")}
          >
            Upload
          </button>
        </div>
      </div>
      <br />
      <div className="DivCenter_container">
        <span>EPF Details</span>
      </div>
      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label htmlFor="epfnumber">
            EPF Number <span>:</span>
          </label>
          <input
            type="text"
            name="epfnumber"
            id="epfnumber"
            value={formData.epfnumber}
            onChange={handleChange12}
            required
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="uannumber">
            UAN Number <span>:</span>
          </label>
          <input
            type="text"
            name="uannumber"
            id="uannumber"
            value={formData.uannumber}
            onChange={handleChange12}
            required
          />
        </div>

        <div className="RegisForm_1">
          <label>
            {" "}
            Upload CSV File <span>:</span>{" "}
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
            className="RegisterForm_1_btns choose_file_update"
          >
            Choose File
          </label>
          <button
            className="RegisterForm_1_btns choose_file_update"
            onClick={() => handleCsvupload("EPF")}
          >
            Upload
          </button>
        </div>
      </div>

      <br />
      <div className="DivCenter_container">
        <span>Documents Details</span>
      </div>
      <br />
      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label>
            Resume<span>:</span>
          </label>

          <div className="RegisterForm_2">
            <input
              type="file"
              id="CapturedFile1"
              name="CapturedFile1"
              accept="image/*,.pdf"
              onChange={handleChange12}
              required
            />
            <label
              htmlFor="CapturedFile1"
              className="RegisterForm_1_btns choose_file_update"
            >
              Choose File
            </label>
          </div>
        </div>
        <div className="RegisForm_1">
          <label>
            Offer Letter<span>:</span>
          </label>
          <div className="RegisterForm_2">
            <input
              type="file"
              id="CapturedFile2"
              className="hiden-nochse-file"
              name="CapturedFile2"
              accept="image/*,.pdf"
              onChange={handleChange12}
              required
            />
            <label
              htmlFor="CapturedFile2"
              className="RegisterForm_1_btns choose_file_update"
            >
              Choose File
            </label>
          </div>
        </div>

        <div className="RegisForm_1">
          <label>
            Contract<span>:</span>
          </label>
          <div className="RegisterForm_2">
            <input
              type="file"
              id="CapturedFile3"
              name="CapturedFile3"
              className="hiden-nochse-file"
              accept="image/*,.pdf"
              onChange={handleChange12}
              required
            />
            <label
              htmlFor="CapturedFile3"
              className="RegisterForm_1_btns choose_file_update"
            >
              Choose File
            </label>
          </div>
        </div>

        <div className="RegisForm_1">
          <label>
            Joining Letter<span>:</span>
          </label>
          <div className="RegisterForm_2">
            <input
              type="file"
              id="CapturedFile4"
              name="CapturedFile4"
              className="hiden-nochse-file"
              accept="image/*,.pdf"
              onChange={handleChange12}
              required
              style={{ display: 'none' }}
            />
            <label
              htmlFor="CapturedFile4"
              className="RegisterForm_1_btns choose_file_update"
            >
              Choose File
            </label>
          </div>
        </div>

        <div className="RegisForm_1">
          <label>
            Others<span>:</span>
          </label>
          <div className="RegisterForm_2">
            <input
              type="file"
              id="CapturedFile5"
              name="CapturedFile5"
              className="hiden-nochse-file"
              accept="image/*,.pdf"
              onChange={handleChange12}
              required
              style={{ display: 'none' }}
            />
            <label
              htmlFor="CapturedFile5"
              className="RegisterForm_1_btns choose_file_update"
            >
              Choose File
            </label>
          </div>
        </div>

        <div className="RegisForm_1">
          <label>
            {" "}
            Upload CSV File <span>:</span>{" "}
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
            className="RegisterForm_1_btns choose_file_update"
          >
            Choose File
          </label>
          <button
            className="RegisterForm_1_btns choose_file_update"
            onClick={() => handleCsvupload("Documents")}
          >
            Upload
          </button>
        </div>
      </div>
      <div className="Register_btn_con">
        <button className="RegisterForm_1_btns" onClick={handleRegister}>
          {buttonText}
        </button>
        <ToastContainer />
      </div>
    </div>
  );
};

export default EmployeeRegister;
