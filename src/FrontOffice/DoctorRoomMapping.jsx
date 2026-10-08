import React, { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";

function DoctorRoomMapping() {


    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
      const userRecord = useSelector((state) => state.userRecord?.UserData);
      const toast = useSelector((state) => state.userRecord?.toast);
      const dispatchvalue = useDispatch();

      const [Doctordata,setDoctordata] = useState([]);
      const [Roomdata,setRoomdata] = useState([]);
      const [Mappeddata,setMappeddata] = useState([]);
      const [load,setload] = useState(false);

      const [Mapping,setMapping] = useState({
        mapid : "",
        Specialization:"",
        Doctor : "",
        Counter : "",
        FromCounter: "",
        ToCounter : "",
        
      })

      const [Specialitydata, setSpecialitydata] = useState([]);
      


      const handleChange = (e) =>{

        const {value,name} = e.target;

        setMapping((prev) => ({

          ...prev,
          [name]: value,

        }))

      };

      const handlesubmit = () => { 


        const submitdata = {
          ...Mapping,
          Created_by: userRecord?.username,
        }

        console.log(submitdata,'data');

         axios
                    .post(`${UrlLink}Masters/Doctor_Room_Mapping_Details`, submitdata)
                    .then((res) => {
        
                      console.log(res.data);
                      const resres = res.data;
                      

                      setMapping({
                        mapid : "",
                        Doctor : "",
                        Counter : "",
                        Specialization : ""
                      })
                      let typp = Object.keys(resres)[0];
                      let mess = Object.values(resres)[0];
                      const tdata = {
                        message: mess,
                        type: typp,
                      };
                      dispatchvalue({ type: "toast", value: tdata });
                      setload((prev) => !prev);
                    
                    })
                    .catch((err) => {
                      console.log(err);
                    });

      };


      useEffect(() => {
        axios.get(`${UrlLink}Masters/Consultation_Room_Details_link_by_Speciality?speciality=${Mapping.Specialization}`)
            .then((res) => {
                const ress = res.data     
                setRoomdata(ress);              
            })
            .catch((err) => {
                console.log(err);
            })
      }, [UrlLink,Mapping.Specialization]);

      useEffect(() => {
        axios.get(`${UrlLink}Masters/get_All_DoctorNames_for_mapping?speciality=${Mapping.Specialization}`)
            .then((res) => {
                const ress = res.data     
                setDoctordata(ress);              
            })
            .catch((err) => {
                console.log(err);
            })
      }, [UrlLink,Mapping.Specialization]);

      useEffect(() => {
        axios.get(`${UrlLink}Masters/Doctor_Room_Mapping_Details`)
            .then((res) => {
                const ress = res.data     
                setMappeddata(ress);              
            })
            .catch((err) => {
                console.log(err);
            })
      }, [UrlLink,load]);

      useEffect(() => {
              axios.get(`${UrlLink}Masters/Speciality_Detials_link`)
                .then((res) => setSpecialitydata(res.data))
                .catch((err) => console.log(err));
            }, [UrlLink]);

      const handleeditMapping = (params) => {
        const { id, ...rest } = params
        setMapping((prev) => ({
          mapid : params.id,
          Doctor : params.DoctorID,
          Counter : params.ConRoomID,
          FromCounter:params.ConRoomID,
          Specialization : params.Speciality

        }))
       }

    const handlestatuseditMapping = (params) => {
      const { id, ...rest } = params
      
      const submitdata = {
        statusedit : true,
        mapid : id      
      }

      console.log(submitdata,'data');

       axios
                  .post(`${UrlLink}Masters/Doctor_Room_Mapping_Details`, submitdata)
                  .then((res) => {
      
                    console.log(res.data);
                    const resres = res.data;
                    

                    setMapping({
                      mapid : "",
                      Doctor : "",
                      Counter : "",
                      Specialization:"",
                      FromCounter:"",
                      ToCounter:"",

                    })
                    let typp = Object.keys(resres)[0];
                    let mess = Object.values(resres)[0];
                    const tdata = {
                      message: mess,
                      type: typp,
                    };
                    dispatchvalue({ type: "toast", value: tdata });
                    setload((prev) => !prev);
                  
                  })
                  .catch((err) => {
                    console.log(err);
                  });
  }

      const daycarecol = [

        {
          key: "sno",
          name: "S.No",
          frozen: true,
        },
        {
          key: "SpecialityName",
          name: "Specialization",
    
        },
        {
          key: "DoctorName",
          name: "DoctorName",
    
        },
        {
          key: "OPNo",
          name: "OPNo",
    
        },
        {
          key: "countername",
          name: "countername",
    
        },
        {
          key: "Action",
          name: "Action",
          renderCell: (params) => (
              <>
                  <Button
                      className="cell_btn"
                      onClick={() => handlestatuseditMapping(params.row)}
                  >
                      {params.row.Status}
                  </Button>
              </>
          ),
        },
        {
                    key: "Action",
                    name: "Action",
                    renderCell: (params) => (
                        <>
                            <Button
                                className="cell_btn"
                                onClick={() => handleeditMapping(params.row)}
                            >
                                <EditIcon className="check_box_clrr_cancell" />
                            </Button>
                        </>
                    ),
        },
       
   
      ]


  return (
    <>
 <div className="DivCenter_container">OPD Counter Mapping</div>
    <div className="Main_container_app">
    <div className="RegisFormcon_1">

          <div className="RegisForm_1">
            <label>
              Specialization <span>:</span>
            </label>  
               <select 
                  name="Specialization"
                  value={Mapping.Specialization}
                  disabled={Mapping.mapid}
                  onChange={handleChange}
                >
                    <option value="">select</option>
                    {Array.isArray(Specialitydata) &&
                    Specialitydata.map((val,idx) =>(
                      <option key={idx} value={val.Speciality_Id}>{val.SpecialityName}</option>
                    ))}   
                </select>
          </div>

          <div className="RegisForm_1">
            <label>
              Doctor <span>:</span>
            </label>  
               <select 
                  name="Doctor"
                  value={Mapping.Doctor}
                  onChange={handleChange}
                >
                    <option value="">select</option>
                    {Array.isArray(Doctordata) &&
                    Doctordata.map((val,idx) =>(
                      <option key={idx} value={val.id}>{val.Name}</option>
                    ))}   
                </select>
          </div>

           {!Mapping.mapid && (
            <div className="RegisForm_1">
              <label>
                OPD Counter <span>:</span>
              </label>  
              <select 
                name="Counter"
                value={Mapping.Counter}
                onChange={handleChange}
              >
                <option value="">select</option>
                {Array.isArray(Roomdata) &&
                  Roomdata.map((val, idx) => (
                    <option key={idx} value={val.id}>{val.ConsultationroomName}</option>
                  ))
                }   
              </select>
            </div>
          )}


          { Mapping.mapid && (
            <>

            <div className="RegisForm_1">
            <label>
             From OPD Counter <span>:</span>
            </label>  
               <select 
                  name="FromCounter"
                  value={Mapping.FromCounter}
                  onChange={handleChange}
                  disabled={Mapping.mapid}

                >
                    <option value="">select</option>
                    {Array.isArray(Roomdata) &&
                    Roomdata.map((val,idx) =>(
                      <option key={idx} value={val.id}>{val.ConsultationroomName}</option>
                    ))}   
                </select>
            </div>

            <div className="RegisForm_1">
            <label>
             To OPD Counter <span>:</span>
            </label>  
               <select 
                  name="ToCounter"
                  value={Mapping.ToCounter}
                  onChange={handleChange}
                >
                    <option value="">select</option>
                    {Array.isArray(Roomdata) &&
                    Roomdata.map((val,idx) =>(
                      <option key={idx} value={val.id}>{val.ConsultationroomName}</option>
                    ))}   
                </select>
            </div>
            
            </>
          )
          }

          

          <div className="Main_container_Btn">
          <button onClick={handlesubmit}>
          {Mapping.mapid ? 'Update' : 'Save'}
          </button>
        </div>



    </div>


    <div className="RegisFormcon_1 jjxjx_">
                  <ReactGrid columns={daycarecol} RowData={Mappeddata} />
                </div>

                    <ToastAlert Message={toast.message} Type={toast.type} />
    </div>
    </>
  )
}

export default DoctorRoomMapping;