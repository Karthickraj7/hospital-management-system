import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";


const NurseStationPatients = () => {
    const dispatch = useDispatch();
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const toast = useSelector((state) => state.userRecord?.toast);
    const UserData = useSelector((state) => state.userRecord?.UserData);
    const navigate = useNavigate();


    // State for grid data
    const [patientRegisterData, setPatientRegisterData] = useState([]);
    console.log(patientRegisterData,'patientRegisterData')
    const [billingData, setBillingData] = useState([]);
    const [getDataTrigger, setGetDataTrigger] = useState(false);

    // Filter states
    const [dateOption, setDateOption] = useState("ALL");
    const [CurrentDate, setCurrentDate] = useState(new Date().toISOString().split("T")[0]);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [ParticularDate, setParticularDate] = useState("");
    const [searchIPParams, setSearchIPParams] = useState({
        query: "",
        status: "Admitted",
        NurseStationid : UserData?.NurseStationid || ""
    });
    const [SelectedWard, setSelectedWard] = useState("");
    const [SelectedRoom, setSelectedRoom] = useState("");

    const [WardGet, setWardGet] = useState([]);

    const [IsRoomslist,setIsRoomslist] = useState(false);
    const [Roomslist,setRoomslist] = useState([]);

    const [SpecializationList, setSpecializationList] = useState([]);
    const PatientCategoryList = [
        "General",
        "Student",
        "Camp",
        "FreeAll",
        "KRCL",
        "Insurance",
        "Client",
        "Donation",
        "Employee",
        "EmployeeRelation",
        "Doctor",
        "DoctorRelation",
      ];

    // Current date for calculation (June 13, 2025, 01:34 PM IST)
    const currentDate = new Date();
    const handleRestrictedAction = () => {
    alert("You do not have permission to perform this action.");
  };

    const handleeditIPPatientRegister = (params, type) => {
      console.log("params", params);
  
      if (params.Status === "Completed") {
        alert("Navigation is not allowed for completed status.");
        return; // Stop execution if status is "Completed"
      }
      
      const { RegistrationId } = params;
  
      const requestType = type; // Use selected type or fallback to default
  
      axios
        .get(`${UrlLink}OP/get_workbenchquelist_doctor`, {
          params: { RegistrationId, Type: requestType },
        })
        .then((res) => {
          console.log(res);
          navigate("/Home/Nurse");
          dispatch({ type: "DoctorWorkbenchNavigation", value: {} });
          dispatch({ type: "AllergyDetails", value: {} });
  
          dispatch({
            type: "IP_DoctorWorkbenchNavigation",
            value: { ...res.data, ...params, RequestType: requestType },
          });
         
          dispatch({
            type: "HrFolder",
            value: "IP_NurseWorkbenchNavigation",
          });
          dispatch({ type: "setPreviousFolder", value: null });
          dispatch({ type: "showMenu", value: true });
        })
        .catch((err) => {
          console.log(err);
        });
    };


    useEffect(() => {
        axios
          .get(`${UrlLink}Masters/Speciality_Detials_link`)
          .then((res) => {
            setSpecializationList(Array.isArray(res.data) ? res.data : []);
          })
          .catch((err) => console.error("error fetching specialization", err));
      }, [UrlLink]);

      

    // Grid column definitions
    const pationsColumn = [
        {
        key: "id",
        name: "S.No",
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
        {
            key: "PatientId",
            name: "Patient ID",
        },
        {
            key: "PatientName",
            name: "Patient Name",
            width: 150,
        },

        {
        key: "Age",
        name: "Age",
        },
        {
        key: "Gender",
        name: "Gender",
        },
        {
            key: "PatientCategory",
            name: "Patient Category",
        },
        // {
        //     key: "AdmissionPurpose",
        //     name: "Admission Purpose",
        // },
        {
            key: "DoctorName",
            name: "Primary Doctor",
            width: 150,
        },
        {
            key: "AdmissionDate",
            name: "Admission Date",
        },
        
        
            {
              key: "Action",
              name: "Action",
              renderCell: (params) =>
                params.row.Status === "Admitted" || params.row.Status === "Pending" ? (
                  <Button
                    className="cell_btn"
                    onClick={() => {
                      if (UserData?.Create) {
                        handleeditIPPatientRegister(params.row, 'IP')
                      } else {
                        handleRestrictedAction();
                      }
                    }}
                  >
                    <ArrowForwardIcon className="check_box_clrr_cancell" />
                  </Button>
                ) : (
                  "-"
                ),
            },

    ];

    // Fetch ward details
    useEffect(() => {

        if(!searchIPParams?.NurseStationid){
            return;
        }

        else{
            axios
            .get(`${UrlLink}Masters/Ward_Detials_link_by_NS?NurseStationid=${searchIPParams?.NurseStationid}`)
            .then((res) => {
                const ress = res.data;
                console.log("Ward Data:", ress);
                if (Array.isArray(ress)) {
                    setWardGet(ress);
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
        
    }, [UrlLink, searchIPParams?.NurseStationid]);

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


    // Fetch billing data from risk_management_list
    useEffect(() => {
        const fetchBillingData = async () => {
            try {
                const params = {
                    searchBy: searchIPParams.query,
                    Status: searchIPParams.status,
                    location: UserData?.location || 1,
                };

                const response = await axios.get(
                    `${UrlLink}Frontoffice/risk_management_list`,
                    { params }
                );

                const billingData = Array.isArray(response.data) ? response.data : [];
                console.log("Billing Data:", billingData);
                setBillingData(billingData);
            } catch (error) {
                console.error("Error fetching billing data:", error);
                setBillingData([]);
                const tdata = {
                    message: "Failed to fetch billing data.",
                    type: "error",
                };
                dispatch({ type: "toast", value: tdata });
            }
        };

        fetchBillingData();
    }, [UrlLink, searchIPParams, UserData?.location, dispatch]);

    // Fetch patient data and merge with billing data
    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const params = {};
                if(searchIPParams?.NurseStationid){
                    params.NurseStationid = searchIPParams?.NurseStationid
                }
                if (searchIPParams.query.trim()) {
                    params.query = searchIPParams.query;
                }
                if (searchIPParams.status) {
                    params.status = searchIPParams.status;
                }
                if (SelectedWard) {
                    params.Wardid = SelectedWard;
                }
                if (SelectedRoom) {
                    params.Roomid = SelectedRoom;
                }
                if (searchIPParams.Specialization) {
                params.Specialization = searchIPParams.Specialization;
                }
                if (searchIPParams.PatientCategory) {
                params.PatientCategory = searchIPParams.PatientCategory;
                }
                if (dateOption === "current" && CurrentDate) {
                    params.CurrentDate = CurrentDate;
                } else if (dateOption === "custom" && fromDate && toDate) {
                    params.fromDate = fromDate;
                    params.toDate = toDate;
                } else if (dateOption === "particular" && ParticularDate) {
                    params.ParticularDate = ParticularDate;
                } 
                else if(dateOption === "ALL"){
                    params.dateOption = dateOption;

                }
                else {
                    setPatientRegisterData([]);
                    return;
                }

                console.log("Patient API Parameters:", params);

                const patientResponse = await axios.get(
                    `${UrlLink}NurseStation/get_ip_Patient_registration_details_for_Nusestation`,
                    { params }
                );

                console.log(patientResponse.data.appointments,'patientResponse')

                if (Array.isArray(patientResponse.data.appointments)) {
                    setPatientRegisterData(patientResponse.data.appointments);
                    } else {
                    setPatientRegisterData([]);
                    }

               
            } catch (error) {
                console.error("Error fetching patient data:", error);
                setPatientRegisterData([]);
                const tdata = {
                    message: "Failed to fetch patient data.",
                    type: "error",
                };
                dispatch({ type: "toast", value: tdata });
            }
        };

        fetchPatientData();
    }, [
        UrlLink,
        getDataTrigger,
        dispatch,
        dateOption,
        CurrentDate,
        fromDate,
        toDate,
        ParticularDate,
        searchIPParams,
        SelectedWard,
        SelectedRoom,
        billingData,
    ]);

    // Handle date option change
    const handleDateOptionChange = (e) => {
        setDateOption(e.target.value);
        setSearchIPParams({ ...searchIPParams, query: "", status: "Admitted" });
        setSelectedWard("");
        setFromDate("");
        setToDate("");
        setParticularDate("");
        if (e.target.value === "current") {
            setCurrentDate(new Date().toISOString().split("T")[0]);
        } else {
            setCurrentDate("");
        }
    };

    // Handle date changes
    const handleCurrentDateChange = (e) => {
        setCurrentDate(e.target.value);
    };

    const handleFromDateChange = (e) => {
        setFromDate(e.target.value);
    };

    const handleToDateChange = (e) => {
        setToDate(e.target.value);
    };

    const handleParticularDateChange = (e) => {
        setParticularDate(e.target.value);
    };

    // Handle search and filter changes
const handleIPSearchChange = (e) => {
    const { name, value } = e.target;

    console.log(value, 'value');

    setSearchIPParams(prev => ({ ...prev, [name]: value }));

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

    return (
        <div className="Main_container_app">
            <h3>Nurse Station Patients</h3>
            <br />
            <div className="search_div_bar">
                <div className="search_div_bar_inp_1">
                    <label>
                        Date <span>:</span>
                    </label>
                    <select value={dateOption} onChange={handleDateOptionChange}>
                        <option value="ALL">ALL</option>
                        <option value="current">Current Date</option>
                        <option value="custom">Custom Date</option>
                        <option value="particular">Particular Date</option>
                    </select>
                </div>

                {dateOption === "current" && (
                    <div className="search_div_bar_inp_1">
                        <label>
                            Current Date <span>:</span>
                        </label>
                        <input
                            type="date"
                            value={CurrentDate}
                            disabled
                            onChange={handleCurrentDateChange}
                        />
                    </div>
                )}

                {dateOption === "custom" && (
                    <>
                        <div className="search_div_bar_inp_1">
                            <label>
                                From <span>:</span>
                            </label>
                            <input
                                type="date"
                                placeholder="From Date"
                                value={fromDate}
                                onChange={handleFromDateChange}
                            />
                        </div>
                        <div className="search_div_bar_inp_1">
                            <label>
                                To <span>:</span>
                            </label>
                            <input
                                type="date"
                                placeholder="To Date"
                                value={toDate}
                                onChange={handleToDateChange}
                            />
                        </div>
                    </>
                )}

                {dateOption === "particular" && (
                    <div className="search_div_bar_inp_1">
                        <label>
                            Select Date <span>:</span>
                        </label>
                        <input
                            type="date"
                            value={ParticularDate}
                            onChange={handleParticularDateChange}
                        />
                    </div>
                )}

                <div className="search_div_bar_inp_1">
                    <label>
                        Search by <span>:</span>
                    </label>
                    <input
                        type="text"
                        name="query"
                        value={searchIPParams.query}
                        placeholder="Search here ..."
                        onChange={handleIPSearchChange}
                    />
                </div>



                <div className="search_div_bar_inp_1">
                    <label>
                        Status <span>:</span>
                    </label>
                    <select
                        name="status"
                        value={searchIPParams.status}
                        onChange={handleIPSearchChange}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Admitted">Admitted</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                  <div className="RegisForm_1">
                          <label>Nursestation Name<span>:</span></label>

                             <select
                                name='NurseStationid'
                                value={searchIPParams.NurseStationid}
                                onChange={handleIPSearchChange}
                                
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


                        {/* Specialization */}
                <div className="search_div_bar_inp_1">
                <label>
                    Specialization <span>:</span>
                </label>
                <select
                    name="Specialization"
                    value={searchIPParams.Specialization}
                    onChange={handleIPSearchChange}
                >
                    <option value="">All</option>
                    {SpecializationList.map((spec, idx) => (
                    <option key={idx} value={spec.id}>
                        {spec.SpecialityName}
                    </option>
                    ))}
                </select>
                </div>

                {/* Patient Category */}
                <div className="search_div_bar_inp_1">
                <label>
                    Patient Category <span>:</span>
                </label>
                <select
                    name="PatientCategory"
                    value={searchIPParams.PatientCategory}
                    onChange={handleIPSearchChange}
                >
                    <option value="">All</option>
                    {PatientCategoryList.map((cat, idx) => (
                    <option key={idx} value={cat}>
                        {cat}
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

            <ReactGrid
                columns={pationsColumn}
                RowData={patientRegisterData}
            />
            <ToastAlert Message={toast.message} Type={toast.type} />
        </div>
    );
};

export default NurseStationPatients;