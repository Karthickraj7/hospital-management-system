import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import Button from "@mui/material/Button";
const OtRequest = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  console.log("userRecord", userRecord);
  const toast = useSelector((state) => state.userRecord?.toast);
  const IP_DoctorWorkbenchNavigation = useSelector(state => state.Frontoffice?.IP_DoctorWorkbenchNavigation);
  console.log("IP_DoctorWorkbenchNavigation", IP_DoctorWorkbenchNavigation);
  const dispatchvalue = useDispatch();

  const [OtRequest, setOtRequest] = useState({

    Specialization: "",
    SurgeryName: "",
    SurgeryDate: "",
    SurgeryTime: "",
    TheatreName:"",
    DoctorName: "",
   
    
  });
  console.log("Ot", OtRequest);

  const [SpecialityData, setSpecialityData] = useState([]);
  const [SurgeryNameData, setSurgeryNameData] = useState([]);
  console.log(SurgeryNameData,'SurgeryNameData');
  const [TheatreData,setTheatreData] = useState([]);
  
  
  
  const [ResponseData,setResponseData] = useState([]);

  const [OtRequestGet, setOtRequestGet] = useState(false);

  const [DoctorData,setDoctorData] = useState([]);
  console.log(DoctorData,'DoctorData');
  

  useEffect(() => {
    axios.get(`${UrlLink}Masters/Speciality_Detials_link`)
      .then((res) => {
        const ress = res.data
      
        setSpecialityData(ress)
      })
      .catch((err) => {
        console.log(err);
      })
  }, [UrlLink])


  useEffect(() => {
    axios.get(`${UrlLink}Masters/Surgery_Names_link`)
      .then((res) => {
        const ress = res.data
        setSurgeryNameData(ress)
      })
      .catch((err) => {
        console.log(err);
      })
  }, [UrlLink])

  
  useEffect(() => {
    axios.get(`${UrlLink}Masters/Doctor_Detials_link2`)
      .then((res) => {
        const ress = res.data
        console.log("doctor name", ress);
        setDoctorData(ress)
      })
      .catch((err) => {
        console.log(err);
      
      })
  }, [UrlLink])


  useEffect(() => {
    axios.get(`${UrlLink}Masters/OtTheaterMaster_Detials_link`)
      .then((res) => {
        const ress = res.data
        console.log("theatre name", ress);
        setTheatreData(ress)
      })
      .catch((err) => {
        console.log(err);
      
      })
  }, [UrlLink])




  const handleOtRequestChange = (e) => {
    const { name, value } = e.target;
    setOtRequest((previous) => ({
      ...previous,
      [name]: value,
    }));

  };

  const handleOtRequestSubmit = () => {
    // Check if SurgeryName is provided and AdditionalDoctor/SurgeryName conditions are met
    if (OtRequest.SurgeryName !== "") {
  
      const data = {
        ...OtRequest,
        RegisterType: "IP",
        created_by: userRecord?.username || "",
        RegistrationId: IP_DoctorWorkbenchNavigation?.pk
      };
      
      console.log("sendOtRequestdata", data);
  
      // axios.post(`${UrlLink}OP/OtRequest_Names_link`, data)
      //   .then((res) => {
      //     const reste = res.data;
      //     const typp = Object.keys(reste)[0];
      //     const mess = Object.values(reste)[0];
      //     const tdata = {
      //       message: mess,
      //       type: typp,
      //     };

      
  
      //     dispatchvalue({ type: "toast", value: tdata });
      //     setOtRequestGet((prev) => !prev);
          
      //     // Reset the form after submission
      //     setOtRequest({
      //       Specialization: "",
      //       SurgeryName: "",
      //       SurgeryDate: "",
      //       SurgeryTime: "",
      //       TheatreName: "",
      //       DoctorName: "",
            
      //     });
      //   })

      axios.post(`${UrlLink}Ip_Workbench/post_ot_request_nurse_workbench`, data)
      .then((res) => {
            const reste = res.data;
            const typp = Object.keys(reste)[0];
            const mess = Object.values(reste)[0];
            const tdata = {
              message: mess,
              type: typp,
            };
  
        
    
            dispatchvalue({ type: "toast", value: tdata });
            
          setOtRequest({
            Specialization: "",
            SurgeryName: "",
            SurgeryDate: "",
            SurgeryTime: "",
            TheatreName: "",
            DoctorName: "",
          });
       })
      
      .catch((err) => {
          console.log(err);
        });
  
    } else {
      // Warn the user if required fields are missing
      const tdata = {
        message: "Please provide the required fields.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    }
  };
  

  useEffect(() => {
    // Ensure RegistrationId is available before making the request
    if (IP_DoctorWorkbenchNavigation?.pk) {
      const params = {
        RegistrationId: IP_DoctorWorkbenchNavigation?.pk, // Ensure RegistrationId is valid
        RegisterType: "IP" // Set the RegisterType explicitly
      };

      // Make the API call to fetch OT request details
      axios.get(`${UrlLink}OP/OtRequest_Names_link`, { params })
        .then((res) => {
          const responseData = res.data;
          console.log("Response dataget234:", responseData);
        setResponseData(responseData);

        })
        .catch((err) => {
          console.error("Error fetching OT request data:", err);
        });
    }
  }, [UrlLink, OtRequestGet, IP_DoctorWorkbenchNavigation?.pk]);


  const OtrequestColumns = [
    {
        key: "id",
        name: "S.No ",
        frozen: true,
    },
    {
        key: "Specialization",
        name: "Specialization",
    },
    {
        key: "SurgeryName",
        name: "Surgery Name",
    },
    {
        key: "SurgeryDate",
        name: "Surgery Date",
    },
    {
        key: "SurgeryTime",
        name: "Surgery Time",
    },
   
    {
        key: "TheatreName",
        name: "TheatreName",
    },
   
    {
        key: "DoctorName",
        name: "DoctorName",
    },
   
  
   
];
  return (
    <>
      <div className="Main_container_app">
        <div className="RegisFormcon_1">

          <div className="common_center_tag">
            <span>OT Request</span>
          </div>
          <br></br>
          <br></br>



        
          <div className="RegisForm_1">
            <label> Specialization<span>:</span> </label>

            <select
              name='Specialization'
              value={OtRequest.Specialization}
              onChange={handleOtRequestChange}
            >
              <option value=''>Select</option>
              {
                
                SurgeryNameData.map((p,indx) => (
                  <option key={indx} value={p.Speciality_Id}>{p.Speciality_Name}</option>
                ))
              }
            </select>
          </div>
          
        

          <div className="RegisForm_1">
            <label> Surgery Name<span>:</span> </label>

            <select
              name='SurgeryName'
              value={OtRequest.SurgeryName}
              onChange={handleOtRequestChange}
            >
              <option value=''>Select</option>
              {
                
                SurgeryNameData.map((p,indx) => (
                  <option key={indx} value={p.id}>{p.Surgery_Name}</option>
                ))
                
              }
            </select>
          </div>

         
          <div className="RegisForm_1">
            <label htmlFor="ReportDate">
              Surgery Requested Date <span>:</span>
            </label>
            <input
              type="date"
              id="SurgeryDate"
              name="SurgeryDate"
              onChange={handleOtRequestChange}
              value={OtRequest.SurgeryDate}
              required
            />
          </div>
          
          <div className="RegisForm_1">
            <label htmlFor="ReportTime">
              Surgery Requested Time <span>:</span>
            </label>
            <input
              type="time"
              id="SurgeryTime"
              name="SurgeryTime"
              onChange={handleOtRequestChange}
              value={OtRequest.SurgeryTime}
              required
            />
          </div>
      
          <div className="RegisForm_1">
            <label> Theatre Name<span>:</span> </label>

            <select
              name='TheatreName'
              value={OtRequest.TheatreName}
              onChange={handleOtRequestChange}
            >
              <option value=''>Select</option>
              {
                TheatreData.map((p,indx) => (
                  <option key={indx} value={p.id}>{p.TheatreName}</option>
                ))
              }
            </select>
          </div>

          
            <div className="RegisForm_1">
            <label htmlFor="ReportTime">
               Doctor Name <span>:</span>
            </label>
            
            <select
              name='DoctorName'
              value={OtRequest.DoctorName}
              onChange={handleOtRequestChange}
            >
              <option value=''>Select</option>
              {
                DoctorData.map((p) => (
                  <option key={p.id} value={p.id}>{p.full_name}</option>
                ))
              }
            </select>
          </div>
        </div>

        

        <div className="Main_container_Btn">
          <button onClick={handleOtRequestSubmit}>
            {OtRequest.RequestId ? "Update" : "Save"}
          </button>
        </div>
        <br></br>
        {ResponseData.length > 0 && (
                <>
                   
                    <ReactGrid columns={OtrequestColumns} RowData={ResponseData} />
                </>
            )}
        <ToastAlert Message={toast.message} Type={toast.type} />

      </div>

    </>
  )
}

export default OtRequest
