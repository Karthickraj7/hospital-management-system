import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CancelIcon from "@mui/icons-material/Cancel";
import Barcode from "react-barcode";
import IpAdmitCardDetails from "../FrontOffice/RegistrationList/IpAdmitCardDetails";
import IpVisitorPassDetails from "../FrontOffice/RegistrationList/IpVisitotPassDetails";
import IpAttenderPassDetails from "../FrontOffice/RegistrationList/IpAttenderPassDetails";
import IpBarcodeDetails from "../FrontOffice/RegistrationList/IpBarcodeDetails";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";



const IpHandoverQuelist = () => {

  const Registeredit = useSelector((state) => state.Frontoffice?.Registeredit);
  console.log("egggggggggggg", Registeredit);
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const dispatch = useDispatch();
  
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const [PatientRegisterData, setPatientRegisterData] = useState([]);
  console.log(PatientRegisterData,'PatientRegisterData')
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [getdata, setgetdata] = useState(false);
  const [searchOPParams, setsearchOPParams] = useState({
    query: "",
    status: "Pending",
    NurseStationid : UserData?.NurseStationid || ""

  });

  const [openModal, setOpenModal] = useState(false);

//   const [modalContent, setModalContent] = useState("");

    const [SelectedWard, setSelectedWard] = useState("");
    const [SelectedRoom, setSelectedRoom] = useState("");

    const [WardGet, setWardGet] = useState([]);
    const [WardList,setWardList] = useState([]);

    console.log(WardList,'WardList')

    const [IsRoomslist,setIsRoomslist] = useState(false);
    const [Roomslist,setRoomslist] = useState([]);

    console.log(Roomslist,'Roomslist')

    const [NurseStationData, setNurseStationData] = useState([]);


useEffect(() => {
      axios
        .get(`${UrlLink}Masters/NurseStationData`)
        .then((hash) => {
          setNurseStationData(hash.data);
        })
        .catch((err) => {
          console.log(err);
        });

    }, [UrlLink]);


     useEffect(() => {

        if(searchOPParams?.NurseStationid !== ""){
            axios
                .get(`${UrlLink}Masters/Ward_Detials_link_by_NS?NurseStationid=${searchOPParams?.NurseStationid}`)
                .then((res) => {
                    const ress = res.data;
                    console.log("Ward Data:", ress);
                    if (Array.isArray(ress)) {
                        setWardGet(ress);
                         const wardIds = ress.map((item) => item.id); 
                         setWardList(wardIds); 
                    } else {
                        setWardGet([]);
                    }
                })
                .catch((err) => {
                    console.error("Error fetching ward data:", err);
                    const tdata = {
                        message: "Failed to fetch ward data.",
                        type: "error",
                    };
                    dispatch({ type: "toast", value: tdata });
                });

        }

        else{
            return
        }
            
        }, [UrlLink, searchOPParams?.NurseStationid]);

            useEffect(() => {
                if (IsRoomslist && SelectedWard) {
                    axios
                        .get(`${UrlLink}Masters/Room_Detials_link_by_NSWard?Wardid=${SelectedWard}`)
                        .then((res) => {
                            const ress = res.data;
                            console.log("Ward Data:", ress);
                            if (Array.isArray(ress)) {
                                setRoomslist(ress);
                            } else {
                                setRoomslist([]);
                            }
                        })
                        .catch((err) => {
                            console.error("Error fetching room data:", err);
                            const tdata = {
                                message: "Failed to fetch room data.",
                                type: "error",
                            };
                            dispatch({ type: "toast", value: tdata });
                        });
                }
            }, [IsRoomslist, SelectedWard]);

    const handleIPSearchChange = (e) => {
    const { name, value } = e.target;

    console.log(value, 'value');
    


    if (name === "Ward") {

        if(value === "Select"){

        }

        else{
            const matchedward = WardGet.find((e) => e.id === Number(value));
        console.log(matchedward,'matchedward')

        if(matchedward.WardType === 'ROOM'){
            setIsRoomslist(true);
            setSelectedWard(value);
            setSelectedRoom("");
        }

        else{
            setSelectedWard(value);
            setSelectedRoom("");
        }

        }
        
         
    }

    else if(name === "RoomNo"){
        setSelectedRoom(value);
    }
};

  const handleOpenModal = (modalType,rowData) => {
    setOpenModal(modalType);
    setSelectedRowData(rowData);
};

const handleCloseModal = () => {
    setOpenModal(null);
    setSelectedRowData(null);
};

  const dispatchvalue = useDispatch();
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setsearchOPParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleeditIPPatientRegister = (params) => {
    dispatchvalue({ type: "Registeredit", value: { Type: "IP", ...params } });
    navigate("/Home/WardManagementFolder");
    dispatchvalue({ type: "HrFolder", value: "IpHandoverWorkbench" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  };

  const handleHandover = (params) => {
    console.log(params);

    const reasen = window.prompt("Enter the reason for cancel the admission");
    if (reasen) {
      const data = {
        RegistrationId: params?.RegistrationId,
        type: "cancel",
        Reason: reasen,
        createdby : UserData?.username,
      };
      axios
        .post(
          `${UrlLink}Frontoffice/post_ip_submit_handover_or_cancel_details`,
          data
        )
        .then((res) => {
          const resres = res.data;
          let typp = Object.keys(resres)[0];
          let mess = Object.values(resres)[0];
          const tdata = {
            message: mess,
            type: typp,
          };
          setgetdata((prev) => !prev);
          dispatchvalue({ type: "toast", value: tdata });
          dispatchvalue({ type: "Registeredit", value: {} });
          navigate("Home/IpHandoverQue");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const RegisterColumn = [
    {
      key: "id",
      name: "S.No",
    },
    // {
    //     key: "PatientProfile",
    //     name: "Patient Profile",
    //     renderCell: (params) => (

    //         <div style={{ height: '30px', width: '30px' }}>
    //             <img src={params.row.PatientProfile} alt='PatientProfile' style={{ width: '100%', height: '100%' }} />
    //         </div>

    //     ),
    // },
    {
      key: "PatientId",
      name: "Patient Id",
    },
    {
      key: "PatientName",
      name: "Patient Name",
      width: 150,
    },
    {
      key: "PhoneNo",
      name: "PhoneNo",
    },

    {
      key: "Complaint",
      name: "Purpose of Admission",
    },
    {
            key: "WardName",
            name: "Ward Name",
        },
        {
            key: "RoomNo",
            name: "Room No",
        },
        {
            key: "BedNo",
            name: "Bed No",
        },
    // {
    //     key: "isMLC",
    //     name: "isMLC",
    // },
    // {
    //     key: "isRefferal",
    //     name: "isRefferal",
    // },
    // {
    //     key: "Status",
    //     name: "Status",
    // },
    {
      key: "Specilization",
      name: "Specilization",
    },
    {
      key: "DoctorName",
      name: "Doctor Name",
    },
    {
      key: "Action",
      name: "Action",
      width: 200,
      renderCell: (params) =>
        params.row.Status === "Pending" ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              className="cell_btn"
              onClick={() => handleeditIPPatientRegister(params.row)}
            >
              <ArrowForwardIcon className="check_box_clrr_cancell" />
            </Button>
            <Button
              className="cell_btn"
              onClick={() => handleHandover(params.row)}
            >
              <CancelIcon className="check_box_clrr_cancell" />
            </Button>
          </div>
        ) : (
          <div className="weudygwe_uy8iu">
            <Button onClick={() =>handleOpenModal("AdmitCard", params.row)}>
              AdmitCard
            </Button>
            <Button onClick={() => handleOpenModal("VisitorCard",params.row)}>
              VisitorCard
            </Button>
            <Button onClick={() => handleOpenModal("AttenderCard",params.row)}>
              AttenderCard
            </Button>
            <Button onClick={() => handleOpenModal("Barcode",params.row)}>Barcode</Button>
          </div>
        ),
    },
  ];


  const getModalContent = () => {
    if (!selectedRowData) return null;

    switch (openModal) {
        case 'AdmitCard':
            return <IpAdmitCardDetails rowData={selectedRowData} />;
        case 'VisitorCard':
            return <IpVisitorPassDetails rowData={selectedRowData} />;
        case 'AttenderCard':
            return <IpAttenderPassDetails rowData={selectedRowData} />;
        case 'Barcode':
            return <IpBarcodeDetails rowData={selectedRowData} />;
        default:
            return null;
    }
};


  useEffect(() => {

    const params = {
            ...searchOPParams,
    }

    if(searchOPParams?.NurseStationid){
                    params.NurseStationid = searchOPParams?.NurseStationid
                }

    if (SelectedWard) {
       params.Wardid = SelectedWard;
     }
    if (SelectedRoom) {
        params.Roomid = SelectedRoom;
        }


    console.log(params,'paramsasssss')

    axios
      .get(
        `${UrlLink}NurseStation/get_ip_registration_before_handover_details`,
        { params}
      )
      .then((res) => {
        const ress = res.data;
        if (Array.isArray(ress)) {
          setPatientRegisterData([]);
          setPatientRegisterData(ress);
        } else {
          setPatientRegisterData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [searchOPParams,getdata,SelectedWard,SelectedRoom,WardList]);

  return (
    <>
      <div className="Main_container_app">
        <h3>Ip Request Que List</h3>
        <br />
        <div className="search_div_bar">
          <div className=" search_div_bar_inp_1">
            <label htmlFor="">
              Search by
              <span>:</span>
            </label>
            <input
              type="text"
              name="query"
              value={searchOPParams.query}
              placeholder="Patient ID or Name or PhoneNo "
              onChange={handleSearchChange}
            />
          </div>
          <div className=" RegisForm_1">
            <label htmlFor="">
              Status
              <span>:</span>
            </label>
            <select
              name="status"
              value={searchOPParams.status}
              onChange={handleSearchChange}
            >
              <option value="">Select</option>
              <option value="Pending">Pending</option>
              <option value="Admitted">Admitted</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

                            <div className="RegisForm_1">
                          <label>Nursestation Name<span>:</span></label>

                             <select
                                name='NurseStationid'
                                value={searchOPParams.NurseStationid}
                                onChange={handleSearchChange}
                                
                            >
                                <option value="">Select</option>
                             
                                {NurseStationData.map((ele, indx) => (
                                    <option value={ele.NurseStationid} key={indx + "key"}>
                                    {ele.NurseStationName}
                                    </option>
                                ))}
                            </select>
                        </div>

          <div className="search_div_bar_inp_1">
                    <label>
                        Ward Type <span>:</span>
                    </label>
                    <select
                        name="Ward"
                        required
                        value={SelectedWard}
                        onChange={handleIPSearchChange}
                    >
                        <option value="Select">Select Ward</option>
                        {WardGet.filter(
                            (ward) =>
                                ward.Status === "Active" &&
                                ward.WardName !== "ICU" &&
                                ward.WardName !== "CCU" &&
                                ward.WardName !== "CASUALITY"
                        ).map((ward, idx) => (
                            <option key={idx} value={ward.id}>
                                {ward.WardName}
                            </option>
                        ))}
                    </select>
                </div>

                {IsRoomslist && (
                    <>
                        <div className="RegisForm_1">
                        <label>
                            Room No <span>:</span>
                        </label>
                        <input
                            list="room-options"
                            name="RoomNo"
                            required
                            value={SelectedRoom}
                            onChange={handleIPSearchChange}
                        />
                        <datalist id="room-options">
                            {Roomslist.map((room, idx) => (
                            <option key={idx} value={room.RoomNo} />
                            ))}
                        </datalist>
                        </div>
                    </>
                )}

        </div>
        <br />

        <ReactGrid columns={RegisterColumn} RowData={PatientRegisterData} />
      </div>



      {openModal && (
                <div className="sideopen_showcamera_profile" onClick={handleCloseModal}>
                    <div className="newwProfiles newwPopupforreason" onClick={(e) => e.stopPropagation()}>
                        <h2>{openModal}</h2>
                        
                        {getModalContent()}


                        <div className="Main_container_Btn">
                        <button onClick={handleCloseModal}>Close</button>
                        </div> </div>
                </div>
            )}
    </>
  );
};

export default IpHandoverQuelist
