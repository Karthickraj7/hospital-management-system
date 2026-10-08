import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import ModelContainer from "../../OtherComponent/ModelContainer/ModelContainer";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import Visibility from '@mui/icons-material/Visibility';
import "./Ratecard.css";

const RatecardMaster = () => {

  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const [InsuranceData, setInsuranceData] = useState([]);
  const [DoctorRateCardData, setDoctorRateCardData] = useState([]);
  const [modifiedRows, setModifiedRows] = useState({});
  const [ServiceProcedureForm, setServiceProcedureForm] = useState("Ward");
  console.log("ServiceProcedureForm", ServiceProcedureForm);
  console.log("DoctorRateCardData", DoctorRateCardData);
  const [ServiceProcedureColumns, setServiceProcedureColumns] = useState([]);
  const [ServiceProcedureData, setServiceProcedureData] = useState([]);
  const [getChanges, setgetChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const pagewidth = useSelector((state) => state.userRecord?.pagewidth);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const [SearchQuery, setSearchQuery] = useState({
    Type: "",
    SearchBy: "",
  });
  // Fetch Insurance Data
  useEffect(() => {
    axios.get(`${UrlLink}Masters/Insurance_client_master_details`).then((response) => {
      setInsuranceData(response.data);
    });
  }, [UrlLink]);

  // Fetch Doctor RateCard Data
  // useEffect(() => {
  //   axios.get(`${UrlLink}Masters/Overall_services_link`).then((response) => {
  //     console.log('1111111', response.data);

  //     setDoctorRateCardData(response.data);
  //   });
  // }, [UrlLink]);



  //  doctorrate card



  const [ratecardData, setRatecardData] = React.useState([]);
  // const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  // const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const [searchOptions, setSearchOptions] = useState({
    SearchbyFirstName: '',
    SearchbySpecialityId: '',
    SearchbySpeciality: '',
    SearchbyServiceCategory : '',
    SearchbyServiceid : "",
    SearchbyServicesubCategoryid:'',
    SearchbyServicesubCategory:'',
    SearchbyProcedureName:''
    // SearchbyDoctor: '',
  })

  const [ServicesList, setServicesList] = useState([]);
  console.log(searchOptions,'ServicesList')

  useEffect(() => {
      axios
        .get(`${UrlLink}Masters/Insert_service_category_master`)
        .then((res) => {
          const responseData = res.data;
  
          if (responseData) {
            setServicesList(responseData);
          } else {
            setServicesList([]);
          }
        })
        .catch((err) => {
          console.error("Error fetching OP report data:", err);
          setServicesList([]);
        });
    }, [UrlLink]);

  const [SubcategoryList,setSubcategoryList] = useState([]);

  useEffect(() => {
      axios
        .get(`${UrlLink}Masters/Services_List_by_servicecategory?servicecategory=${searchOptions.SearchbyServiceid}`)
        .then((res) => {
          const responseData = res.data;
  
          if (responseData) {
            setSubcategoryList(responseData);
          } else {
            setSubcategoryList([]);
          }
        })
        .catch((err) => {
          console.error("Error fetching OP report data:", err);
          setServicesList([]);
        });
    }, [UrlLink,searchOptions]);

   const HandleOnchangecategory = (e) => {
    const { name, value } = e.target;

    console.log(`Updating ${name} with value:`, value);

    if (name === 'SearchbyServiceCategory') {
      const formattedvall = value
      if (formattedvall.includes(".")) {
        const valuesp = formattedvall.split(".")
        setSearchOptions((prev) => ({
          ...prev,
          SearchbyServiceid: valuesp[0],
          SearchbyServiceCategory: valuesp[1],
        }))
      }
      else {
        setSearchOptions((prev) => ({
          ...prev,
          SearchbyServiceid: "",
          [name]: value,
        }));
      }
    }
    else {
      setSearchOptions((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const HandleOnchangesubcategory = (e) => {
    const { name, value } = e.target;
 
    console.log(`Updating ${name} with value:`, value);
 
    if (name === 'SearchbyServicesubCategory') {
      const formattedvall = value
      if (formattedvall.includes(".")) {
        const valuesp = formattedvall.split(".")
        setSearchOptions((prev) => ({
          ...prev,
          SearchbyServicesubCategoryid: valuesp[0],
          SearchbyServicesubCategory: valuesp[1],
        }))
      }
      else {
        setSearchOptions((prev) => ({
          ...prev,
          SearchbyServicesubCategoryid: "",
          [name]: value,
        }));
      }
    }
 
   
    else {
      setSearchOptions((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
 




  const [SpecialityData, setSpecialityData] = useState([])
  // Fetch data from API on component mount
  const getdocra = () => {
    const params = {
      SearchbyFirstName: searchOptions.SearchbyFirstName,
      SearchbySpecialityId: searchOptions.SearchbySpecialityId
    }

    axios.get(`${UrlLink}Masters/Doctor_Ratecard_Master_API`, { params })
      .then(response => {
        setRatecardData(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch data');
        setLoading(false);
      });
  }

  useEffect(() => {
  if (ServiceProcedureForm === "DoctorRateCard") {
    getdocra();
  }
}, [UrlLink, ServiceProcedureForm, searchOptions]);


  const HandleOnchangeSearch = (e) => {
    const { name, value } = e.target;

    console.log(`Updating ${name} with value:`, value);

    if (name === 'SearchbySpeciality') {
      const formattedvall = value
      if (formattedvall.includes(".")) {
        const valuesp = formattedvall.split(".")
        setSearchOptions((prev) => ({
          ...prev,
          SearchbySpecialityId: valuesp[0],
          SearchbySpeciality: valuesp[1],
        }))
      }
      else {
        setSearchOptions((prev) => ({
          ...prev,
          SearchbySpecialityId: "",
          [name]: value,
        }));
      }
    }
    else {
      setSearchOptions((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    axios.get(`${UrlLink}Masters/Speciality_Detials_link`)
      .then(response => {
        setSpecialityData(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, [UrlLink, searchOptions])


  // Handle input changes for all fields
  const handleDoctorFieldChange = (e, doctorIndex, section, sectionIndex, field) => {
    const newData = [...ratecardData];
    const value = e.target.value;

    if (section) {
      newData[doctorIndex][section][sectionIndex][field] = value;
    } else {
      newData[doctorIndex][field] = value;
    }

    setRatecardData(newData);
  };

  // Handle save to API
  const handleDoctorSave = () => {
    axios.post(`${UrlLink}Masters/Doctor_Ratecard_Master_API`, ratecardData)
      .then(response => {
        alert(response.data.message);
        getdocra();
      })
      .catch(err => {
        alert('Failed to save data');
      });
  };


  // Handler for OP/IP ratecard changes
  const handleRateCardChange = (e, doctorIndex, ratecardIndex, type, field) => {
    const value = e.target.value;
    const newModifiedRows = { ...modifiedRows };

    // Track modified row and field
    if (!newModifiedRows[doctorIndex]) {
      newModifiedRows[doctorIndex] = {};
    }
    newModifiedRows[doctorIndex][`${type}_ratecard_${ratecardIndex}_${field}`] = value;
    setModifiedRows(newModifiedRows);

    // Update original state
    const newData = [...DoctorRateCardData];
    const ratecardDetails = newData[doctorIndex].Ratecarddetails[type];

    // Update the appropriate field (consultation_curr_fee or follow_up_curr_fee) based on the field type
    if (field === 'consultation') {
      ratecardDetails[ratecardIndex].consultation_curr_fee = value;
    } else if (field === 'follow_up') {
      ratecardDetails[ratecardIndex].follow_up_curr_fee = value;
    } else if (field === 'emg') {
      ratecardDetails[ratecardIndex].emg_consultant_curr_fee = value;
    }

    setDoctorRateCardData(newData);
  };

  // Handler for Doctor Contribution changes
  const handleDoctorContributionChange = (e, doctorIndex, contributionIndex, type) => {
    const value = e.target.value;
    const newModifiedRows = { ...modifiedRows };

    // Track modified row and field
    if (!newModifiedRows[doctorIndex]) {
      newModifiedRows[doctorIndex] = {};
    }
    newModifiedRows[doctorIndex][`${type}_contribution_${contributionIndex}`] = value;
    setModifiedRows(newModifiedRows);

    // Update original state
    const newData = [...DoctorRateCardData];
    const contributions = newData[doctorIndex].Contribution;

    // Update the corresponding contribution field (OP or IP)
    if (type === "OP") {
      contributions[contributionIndex].doctor_contribution_OP = value;
    } else if (type === "IP") {
      contributions[contributionIndex].doctor_contribution_IP = value;
    }

    setDoctorRateCardData(newData);
  };

  // Generic handler for Insurance, Client, and Corporate changes
  const handleFieldChange = (e, doctorIndex, section, fieldIndex) => {
    const value = e.target.value;
    const newModifiedRows = { ...modifiedRows };

    // Track modified row and field
    if (!newModifiedRows[doctorIndex]) {
      newModifiedRows[doctorIndex] = {};
    }
    newModifiedRows[doctorIndex][`${section}_${fieldIndex}`] = value;
    setModifiedRows(newModifiedRows);

    // Update original state
    const newData = [...DoctorRateCardData];
    const sectionData = newData[doctorIndex][section];

    // Update the corresponding field (consultation_curr_fee or follow_up_curr_fee) based on section
    sectionData[fieldIndex].consultation_curr_fee = value;

    setDoctorRateCardData(newData);
  };


  // Update the handleSubmit function to include IP room fees
  const handleSubmit = async () => {
    try {
      const payload = Object.keys(modifiedRows).map((doctorIndex) => {
        const updates = modifiedRows[doctorIndex];
        const doctor = DoctorRateCardData[doctorIndex];

        const updatedDoctor = { doctor_id: doctor.id };

        // Update Ratecarddetails
        updatedDoctor.Ratecarddetails = {
          OP: doctor.Ratecarddetails.OP.map((opItem, opIndex) => {
            const updatedOp = { ...opItem };

            // Consultation, Followup, EMG for OP
            if (updates[`OP_consultation_${opIndex}`] !== undefined) {
              updatedOp.consultation_curr_fee = updates[`OP_consultation_${opIndex}`];
            }
            if (updates[`OP_followup_${opIndex}`] !== undefined) {
              updatedOp.follow_up_curr_fee = updates[`OP_followup_${opIndex}`];
            }
            if (updates[`OP_emg_${opIndex}`] !== undefined) {
              updatedOp.emg_consultant_curr_fee = updates[`OP_emg_${opIndex}`];
            }

            return updatedOp;
          }),

          IP: doctor.Ratecarddetails.IP.map((ipItem, ipIndex) => {
            const updatedIp = { ...ipItem };

            // IP Room Type Updates
            doctor.Roomtypes.forEach((room) => {
              const roomKey = `${room.name}_${room.id}`;
              const fieldKey = `IP_room_${roomKey}_${ipIndex}`;
              if (updates[fieldKey] !== undefined) {
                updatedIp[`${roomKey}_curr_fee`] = updates[fieldKey];
              }
            });

            return updatedIp;
          }),
        };

        // Update Contribution
        updatedDoctor.Contribution = doctor.Contribution.map((contri, contriIndex) => {
          const updatedContri = { ...contri };

          if (contri.RatecardType === "Doctor_Contribution_OP" && updates[`OP_contribution_${contriIndex}`] !== undefined) {
            updatedContri.doctor_contribution_OP = updates[`OP_contribution_${contriIndex}`];
          }
          if (contri.RatecardType === "Doctor_Contribution_IP" && updates[`IP_contribution_${contriIndex}`] !== undefined) {
            updatedContri.doctor_contribution_IP = updates[`IP_contribution_${contriIndex}`];
          }

          return updatedContri;
        });

        // Update InsuranceDetails, ClientDetails, CorporateDetails
        ["InsuranceDetails", "ClientDetails", "CorporateDetails"].forEach((section) => {
          updatedDoctor[section] = doctor[section].map((item, itemIndex) => {
            const updatedItem = { ...item };

            if (updates[`${section}_consultation_${itemIndex}`] !== undefined) {
              updatedItem.consultation_curr_fee = updates[`${section}_consultation_${itemIndex}`];
            }
            if (updates[`${section}_followup_${itemIndex}`] !== undefined) {
              updatedItem.follow_up_curr_fee = updates[`${section}_followup_${itemIndex}`];
            }
            if (updates[`${section}_emg_${itemIndex}`] !== undefined) {
              updatedItem.emg_consultant_curr_fee = updates[`${section}_emg_${itemIndex}`];
            }

            return updatedItem;
          });
        });

        return updatedDoctor;
      });

      console.log("Submitting Payload:", payload);

      const response = await axios.post(`${UrlLink}Masters/UpdateRatecardDetails`, payload);
      const resData = response.data;
      const message = Object.values(resData)[0];
      const type = Object.keys(resData)[0];

      dispatchvalue({
        type: "toast",
        value: {
          message: message,
          type: type,
        }
      });

      setModifiedRows({}); // Clear modified after submit
    } catch (error) {
      console.error("Error while submitting:", error);
      dispatchvalue({
        type: "toast",
        value: {
          message: "Error while updating doctor ratecard",
          type: "error",
        }
      });
    }
  };



  // Update the Roomtypes Data section in table body

  const handlesearch = (e) => {
    const { name, value } = e.target;
    setSearchQuery((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleselectChange = (e) => {
    const { value } = e.target;
    setLoading(true);
    setTimeout(() => {
      setServiceProcedureForm(value);
      setSearchQuery({
        Type: "",
        SearchBy: "",
      });
      setLoading(false);
    }, 200);
  };



  const handleeditstatus = useCallback(
    (params) => {
      const data = {
        MasterType: ServiceProcedureForm,
        id: params.id,
      };
      axios
        .post(
          `${UrlLink}Masters/update_status_Service_Procedure_Detials_link`,
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

          dispatchvalue({ type: "toast", value: tdata });
          setgetChanges((prev) => !prev);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [ServiceProcedureForm, UrlLink, dispatchvalue]
  );


  const handleRatecardview = useCallback(
    (params) => {
      const data = {
        MasterType: ServiceProcedureForm,
        id: params.id,
      };
      dispatchvalue({ type: "ServiceProcedureRatecardView", value: data });

      navigate("/Home/Master");
      dispatchvalue({ type: 'HrFolder', value: 'ServiceProcedureRatecard' });
      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });



    },
    [ServiceProcedureForm, dispatchvalue, navigate]
  );
  useEffect(() => {
    const commonColumns = [
      { key: "IsGst", name: "IsGst" },
      { key: "GSTValue", name: "GSTValue" },
      {
        key: "Status",
        name: "Status",
        frozen: pagewidth > 1000 ? true : false,
        renderCell: (params) => (
          <Button
            className="cell_btn"
            onClick={() => handleeditstatus(params.row)}
          >
            {params.row.Status}
          </Button>
        ),
      },
      {
        key: "RatecardView",
        name: "Ratecard View",
        renderCell: (params) => (
          <Button
            className="cell_btn"
            onClick={() => handleRatecardview(params.row)}
          >
            <VisibilityIcon />
          </Button>
        ),
      },

    ];

    const ServiceColumns = [
      {
        key: "id",
        name: "Service ID",
        frozen: pagewidth > 500 ? true : false,
      },
      {
        key: "ServiceName",
        name: "Service Name",
        frozen: pagewidth > 700 ? true : false,
      },
      { key: "ServiceType", name: "Service Type" },
      { key: "Department", name: "Department" },
      ...commonColumns,
    ];

    const ProcedureColumns = [
      {
        key: "id",
        name: " Procedure Id",
        frozen: pagewidth > 500 ? true : false,
      },
      {
        key: "ProcedureName",
        name: "Therapy Name",
        frozen: pagewidth > 700 ? true : false,
      },
      { key: "Type", name: "Procedure Type" },
      ...commonColumns,
    ];

    setServiceProcedureColumns(
      ServiceProcedureForm === "Service" ? ServiceColumns : ProcedureColumns
    );
  }, [
    ServiceProcedureForm,
    pagewidth,
    handleeditstatus,
    handleRatecardview,
  ]);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const data = {
          MasterType: ServiceProcedureForm,
          ...SearchQuery,
        };
        const [filteredRows] = await Promise.all([
          axios.get(`${UrlLink}Masters/Service_Procedure_Master_Detials_link`, {
            params: data,
          }),
        ]);
        setServiceProcedureData(filteredRows.data);
        // setMastertypedata(Mastertypedata.data)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // fetchdata();

  }, [UrlLink, getChanges, ServiceProcedureForm, SearchQuery]);
  // ----------------doctormaster
  const [UserRegisterData, setUserRegisterData] = useState([])
  const [GetUserRegisterData, setGetUserRegisterData] = useState(false)
  const [UserRegisterFIlteredData, setUserRegisterFIlteredData] = useState([])
  const [SearchQuery1, setSearchQuery1] = useState('')

  useEffect(() => {
    axios.get(`${UrlLink}Masters/get_Doctor_Detials_link`)
      .then((res) => {
        const ress = res.data
        if (Array.isArray(ress)) {
          setUserRegisterData(ress)
        } else {
          setUserRegisterData([])
        }

      })
      .catch((err) => {
        console.log(err);
      })
    dispatchvalue({ type: 'DoctorListId', value: {} })
  }, [UrlLink, GetUserRegisterData, dispatchvalue])


  useEffect(() => {

    const lowercasesearch = SearchQuery1.toLowerCase()
    const filteralldata = UserRegisterData.filter((row) => {
      const LowerName = row.Name.toLowerCase()
      const Mobile = row.ContactNumber.toString()
      const Docdtype = row.DoctorType.toLowerCase()

      return (
        LowerName.includes(lowercasesearch) ||
        Mobile.includes(lowercasesearch) ||
        Docdtype.includes(lowercasesearch)

      )

    })

    setUserRegisterFIlteredData(filteralldata)

  }, [SearchQuery1, UserRegisterData])


  const handleeditDoctorstatus = (params) => {
    const data = { DoctorId: params.id }
    axios.post(`${UrlLink}Masters/update_status_Doctor_Detials_link`, data)
      .then((res) => {
        const resres = res.data
        let typp = Object.keys(resres)[0]
        let mess = Object.values(resres)[0]
        const tdata = {
          message: mess,
          type: typp,
        }

        dispatchvalue({ type: 'toast', value: tdata });
        setGetUserRegisterData(prev => !prev)
      })
      .catch((err) => {
        console.log(err);
      })

  }
  const HandleRateCardView = (params) => {

    const { id } = params
    dispatchvalue({ type: 'DoctorListId', value: { DoctorId: id } })
    navigate('/Home/DoctorRatecardList')
  }

  const UserRegisterColumns = [
    {
      key: "id",
      name: "Doctor Id",
      filter: true,
      type: 'input-text',
      frozen: true,
      width: 300
    },
    {
      key: "ShortName",
      name: "Doctor Name",
      filter: true,
      frozen: true
    },
    {
      key: "ContactNumber",
      name: "Contact Number",
      frozen: true
    },
    {
      key: "DoctorType",
      name: "Doctor Type",
      frozen: true
    },
    {
      key: "Status",
      name: "Status",
      frozen: true,
      renderCell: (params) => (

        <Button
          className="cell_btn"
          onClick={() => handleeditDoctorstatus(params.row)}
        >
          {params.row.Status}
        </Button>
      )

    },
    {
      key: "Email",
      name: "Email",

    },


    {
      key: "Qualification",
      name: "Qualification",
    },
    {
      key: "Department",
      name: "Department",
    },
    {
      key: "Designation",
      name: "Designation",
    },
    {
      key: "Specialization",
      name: "Specialization",
    },
    {
      key: "Category",
      name: "Category",
    },
    {
      key: "createdBy",
      name: "created By",
    },



    {
      key: "RatecardAction",
      name: "Rate Card View",
      renderCell: (params) => (
        <>{
          params.row.DoctorType === 'Referral' ?
            (
              <>
                No Ratecard
              </>
            )
            :
            (

              <Button
                className="cell_btn"
                onClick={() => HandleRateCardView(params.row)}
              >
                <Visibility className="check_box_clrr_cancell" />
              </Button>
            )

        }

        </>
      ),
    },

  ]


  // RoomMasterService

  const [floorData, setFloorData] = useState([]);
  const [doctorRateCardColumns, setDoctorRateCardColumns] = useState([]);
  const [editing, setEditing] = useState(null);
  const [getChangess, setGetChangess] = useState(false);

  // useEffect(() => {
  //         axios
  //             .get(`${UrlLink}Masters/floor_ward_ratecard_view_by_doctor_id?DoctorId=${DoctorListId.DoctorId}`)
  //             .then((res) => {
  //                 const { FloorWardDetails } = res.data;
  //                 setFloorData(Array.isArray(FloorWardDetails) ? FloorWardDetails : []);
  //             })
  //             .catch((err) => console.error(err));
  // }, [UrlLink, navigate, getChanges]);

  const handleChange = useCallback((e, rowIdx, column) => {
    const updatedRow = floorData.map((row, index) =>
      index === rowIdx ? { ...row, [column]: e.target.value } : row
    );
    setFloorData(updatedRow);
  }, [floorData]);

  const handleDoubleClick = useCallback((rowIdx, column) => {
    setEditing({ rowIdx, column });
  }, []);

  const handleSaveChanges = useCallback((row, column) => {
    const editData = {
      // doctor_id: DoctorListId?.DoctorId,
      floor_id: row.FloorId,
      ward_id: row.WardId,
      updated_rate: row[column],
      column: column,
    };

    const confirmChange = window.confirm("Do you want to save the changes?");
    if (confirmChange) {
      axios.post(`${UrlLink}Masters/floor_ward_ratecard_update`, editData)
        .then((res) => {
          const tdata = {
            message: res.data.message || "Rate updated successfully",
            type: res.data.status || "success",
          };
          dispatchvalue({ type: 'toast', value: tdata });
        })
        .catch((err) => console.error(err));
      setGetChangess((prev) => !prev);
    }
    setEditing(null);
  }, [UrlLink, dispatchvalue]);

  const handleKeyDown = useCallback((e, row, column) => {
    if (e.key === 'Enter') {
      handleSaveChanges(row, column);
    } else if (['e', 'E', '+', '-'].includes(e.key)) {
      e.preventDefault();
    }
  }, [handleSaveChanges]);

  const handleRoomTypeFeeChange = (e, doctorIndex, roomIndex) => {
    const updatedData = [...DoctorRateCardData];
    updatedData[doctorIndex].Roomtypes[roomIndex].fee = e.target.value;
    setDoctorRateCardData(updatedData); // Update the state
  };

  useEffect(() => {
    const columns = [
      { key: "FloorName", name: "Floor Name", frozen: true },
      { key: "WardName", name: "Ward Name", frozen: true },
      { key: "PrevRate", name: "Previous Rate" },
      {
        key: "CurrentRate",
        name: "Current Rate",
        editable: true,
        renderCell: (params) => (
          editing && editing.rowIdx === params.rowIndex && editing.column === 'CurrentRate' ? (
            <input
              type="number"
              className="ratecard_inputs"
              autoFocus
              onKeyDown={(e) => handleKeyDown(e, params.row, 'CurrentRate')}
              value={params.row.CurrentRate || ''}
              onChange={(e) => handleChange(e, params.rowIndex, 'CurrentRate')}
            />
          ) : (
            <div onDoubleClick={() => handleDoubleClick(params.rowIndex, 'CurrentRate')}>
              {params.row.CurrentRate || ''}
            </div>
          )
        ),
      },
    ];

    setDoctorRateCardColumns(columns);
  }, [editing, handleKeyDown, handleChange, handleDoubleClick]);


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
    axios.get(`${UrlLink}Masters/Location_Detials_link`)
      .then((res) => {
        const ress = res.data
        setLocationData(ress)
      })
      .catch((err) => {
        console.log(err);
      })
  }, [UrlLink])





  // room name ------------
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [LocationData, setLocationData] = useState([]);
  const [IsBuildingGet, setIsBuildingGet] = useState(false)



  const [RoomName, setRoomName] = useState({

    Location: '',
    BuildingName: '',
    BlockName: '',
    FloorName: '',
    WardName: '',
    RoomId: '',
  })
  const [RoomData, setRoomData] = useState([])
  const [Room_Building_by__loc, setRoom_Building_by__loc] = useState([])
  const [Room_block_by_Building, setRoom_block_by_Building] = useState([])
  const [Room_Floor_by_Block, setRoom_Floor_by_Block] = useState([])
  const [Room_ward_by_FLoor, setRoom_ward_by_FLoor] = useState([])
  useEffect(() => {
    if (RoomName.Location) {
      axios.get(`${UrlLink}Masters/get_building_Data_by_location?Location=${RoomName.Location}`)
        .then(res => {
          if (Array.isArray(res.data)) {
            setRoom_Building_by__loc(res.data)
          } else {
            setRoom_Building_by__loc([])
          }

        })
        .catch(err => {
          setRoom_Building_by__loc([])
          console.log(err);
        })
    }

  }, [RoomName.Location, UrlLink])

  useEffect(() => {
    if (RoomName.BuildingName) {
      const data = {
        Building: RoomName.BuildingName,
      }
      axios.get(`${UrlLink}Masters/get_block_Data_by_Building`, { params: data })
        .then(res => {
          if (Array.isArray(res.data)) {
            setRoom_block_by_Building(res.data)
          } else {
            setRoom_block_by_Building([])
          }
        })
        .catch(err => {
          setRoom_block_by_Building([])
          console.log(err);
        })
    }

  }, [RoomName.BuildingName, UrlLink])

  useEffect(() => {
    if (RoomName.BlockName) {
      const data = {
        Block: RoomName.BlockName,
      }
      axios.get(`${UrlLink}Masters/get_Floor_Data_by_Building_block_loc`, { params: data })
        .then(res => {
          if (Array.isArray(res.data)) {
            setRoom_Floor_by_Block(res.data)
          } else {
            setRoom_Floor_by_Block([])
          }

        })
        .catch(err => {
          setRoom_Floor_by_Block([])
          console.log(err);
        })
    }

  }, [RoomName.BlockName, UrlLink])

  useEffect(() => {
    if (RoomName.FloorName) {
      const data = {
        Floor: RoomName.FloorName,
      }
      axios.get(`${UrlLink}Masters/get_Ward_Data_by_Building_block_Floor_loc`, { params: data })
        .then(res => {
          if (Array.isArray(res.data)) {
            setRoom_ward_by_FLoor(res.data)
          } else {
            setRoom_ward_by_FLoor([])
          }

        })
        .catch(err => {
          setRoom_ward_by_FLoor([])
          console.log(err);
        })
    }

  }, [RoomName.FloorName, UrlLink])


  const handlechangeRoom = (e) => {
    const { name, value } = e.target
    if (name === 'Location') {
      setRoomName((prev) => ({
        ...prev,
        [name]: value,
        BuildingName: '',
        BlockName: '',
        FloorName: '',
        WardName: '',
      }))
    } else if (name === 'BuildingName') {
      setRoomName((prev) => ({
        ...prev,
        [name]: value,
        BlockName: '',
        FloorName: '',
        WardName: '',
      }))
    } else if (name === 'BlockName') {
      setRoomName((prev) => ({
        ...prev,
        [name]: value,
        FloorName: '',
        WardName: '',
      }))
    } else if (name === 'FloorName') {
      setRoomName((prev) => ({
        ...prev,
        [name]: value,
        WardName: '',
      }))
    } else if (name === 'WardName') {
      setRoomName((prev) => ({
        ...prev,
        [name]: value,
      }))
    } else {
      setRoomName((prev) => ({
        ...prev,
        [name]: value.toUpperCase(),
        GST: ''
      }))

    }
  }

  const HandleEditRoomStatus = (params) => {
    const data = {
      RoomId: params.id,
      Statusedit: true
    }
    const confirmation = window.confirm('Are you sure you want to update the status? All the children room and bed statuses will be changed.');
    if (confirmation) {
      axios.post(`${UrlLink}Masters/Room_Master_Detials_link`, data)
        .then((res) => {
          const resres = res.data
          let typp = Object.keys(resres)[0]
          let mess = Object.values(resres)[0]
          const tdata = {
            message: mess,
            type: typp,
          }

          dispatchvalue({ type: 'toast', value: tdata });
          setIsBuildingGet(prev => !prev)
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }
  const HandleEditRoom = (params) => {
    const { id, BuildingId, BlockId, FloorId, Location_Id, WardId, Current_Charge, GST_val } = params
    setRoomName({
      Location: Location_Id,
      BuildingName: BuildingId,
      BlockName: BlockId,
      FloorName: FloorId,
      WardName: WardId,
    })
  }

  const HandleSaveRoom = () => {
    const exist = Object.keys(RoomName).filter(p => p !== 'RoomId').filter((field) => !RoomName[field])
    if (exist.length === 0) {


      const data = {
        ...RoomName,
        created_by: userRecord?.username || ''
      }
      axios.post(`${UrlLink}Masters/Room_Master_Detials_link`, data)
        .then((res) => {
          const resres = res.data
          let typp = Object.keys(resres)[0]
          let mess = Object.values(resres)[0]
          const tdata = {
            message: mess,
            type: typp,
          }

          dispatchvalue({ type: 'toast', value: tdata });
          setIsBuildingGet(prev => !prev)
          setRoomName({
            Location: '',
            BuildingName: '',
            BlockName: '',
            FloorName: '',
            WardName: '',
          })
        })
        .catch((err) => {
          console.log(err);
        })
    } else {
      const tdata = {
        message: `Please provide ${exist.join(' and ')}`,
        type: 'warn'
      }
      dispatchvalue({ type: 'toast', value: tdata });
    }
  }

  useEffect(() => {
    axios.get(`${UrlLink}Masters/Room_Master_Detials_link`)
      .then((res) => {
        const ress = res.data
        setRoomData(ress)
      })
      .catch((err) => {
        console.log(err);
      })
  }, [IsBuildingGet, UrlLink])

  const [Roomdata, setRoomdata] = useState([]);
  // Fetch data from API
  // useEffect(() => {
  //   axios
  //     .get(`${UrlLink}Masters/Get_RoomDetails_Ratecard`) // Replace with your API URL
  //     .then((response) => {
  //       setRoomdata(response.data);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //       setLoading(false);
  //     });
  // }, []);

  const handleEdit = (floorIndex, wardIndex, field, subfield, value, type) => {
    const updatedData = [...Roomdata];
    if (type === "insurance") {
      updatedData[floorIndex].Wards[wardIndex].InsuranceDetails[subfield].Fee = value;
    } else {
      updatedData[floorIndex].Wards[wardIndex].Ratecarddetails[field][subfield].consultation_curr_fee = value;
    }
    setRoomdata(updatedData);
  };

  const [WardsearchTerm, setWardSearchTerm] = useState('');


  //------------------------------------Radiology---------------------------------------------//

 const [RadiologyRateCardData, setRadiologyRateCardData] = useState([]);
 const [RadiologyModifiedRows, setRadiologyModifiedRows] = useState({});
 const [RadsearchTerm, setRadSearchTerm] = useState("");

  const fetchRadiologyData = async (searchTerm = "") => {
    try {
      setLoading(true);
      const res = await axios.get(`${UrlLink}Masters/Radiology_Ratecardmaster?RadsearchTerm=${searchTerm}`);

      setRadiologyRateCardData(res.data);
      setRadiologyModifiedRows({});
      setLoading(false);

    } catch (err) {
      console.error("Radiology Fetch Error:", err);
      setLoading(false);

      dispatchvalue({
        type: "toast",
        value: { message: "Error loading radiology ratecards", type: "error" },
      });
    }
  };

  useEffect(() => {
    if (ServiceProcedureForm === "Radiology") {
      fetchRadiologyData(RadsearchTerm);
    }
  }, [UrlLink, ServiceProcedureForm, RadsearchTerm]);


 const applyBasicFeeToAll = () => {
  const updated = [...RadiologyRateCardData];
  const newModified = { ...RadiologyModifiedRows };
  
  updated.forEach((test, testIndex) => {
    const basicFee = test.BasicFee || "0";
    
    if (!newModified[testIndex]) {
      newModified[testIndex] = {};
    }

    // Apply to Insurance
    if (test.InsuranceDetails) {
      test.InsuranceDetails.forEach((ins, i) => {
        const k = `InsuranceDetails_Fee_${i}`;
        newModified[testIndex][k] = basicFee;
        updated[testIndex].InsuranceDetails[i].Fee = basicFee;
      });
    }

    // Apply to Clients
    if (test.ClientDetails) {
      test.ClientDetails.forEach((cl, i) => {
        const k = `ClientDetails_Fee_${i}`;
        newModified[testIndex][k] = basicFee;
        updated[testIndex].ClientDetails[i].Fee = basicFee;
      });
    }

    
  });

  setRadiologyRateCardData(updated);
  setRadiologyModifiedRows(newModified);

  dispatchvalue({
    type: "toast",
    value: { 
      message: `Applied Basic Fee to Insurance, Client & Discount for ${updated.length} tests!`, 
      type: "success" 
    },
  });
};

const handleRadiologyFieldChange = (e, testIndex, type, fieldIndex, fieldKey) => {
  const value = e.target.value;
  const updated = [...RadiologyRateCardData];
  
  // Update base-level fields
  if (!type) {
    updated[testIndex][fieldKey] = value;
  } else {
    // Initialize if not exists
    if (!updated[testIndex][type]) {
      updated[testIndex][type] = [];
    }
    if (!updated[testIndex][type][fieldIndex]) {
      updated[testIndex][type][fieldIndex] = {};
    }
    
    // Special handling for DoctorContribution
    if (type === "DoctorContribution") {
      updated[testIndex][type][fieldIndex][fieldKey] = value;
    } else {
      updated[testIndex][type][fieldIndex][fieldKey] = value;
    }
  }

  setRadiologyRateCardData(updated);

  // Track modifications
  const newModified = { ...RadiologyModifiedRows };
  if (!newModified[testIndex]) {
    newModified[testIndex] = {};
  }

  // Create unique key for tracking
  let key = !type ? fieldKey : `${type}_${fieldKey}_${fieldIndex}`;
  
  // For DoctorContribution, include type for identification
  if (type === "DoctorContribution") {
    const contribType = updated[testIndex][type][fieldIndex]?.Type;
    key = `DoctorContribution_${contribType}_${fieldIndex}`;
  }
  
  newModified[testIndex][key] = value;

  setRadiologyModifiedRows(newModified);
};

 

  const handleRadiologySubmit = async () => {
    try {
      const payload = [];

      RadiologyRateCardData.forEach((test, testIndex) => {
        const upd = RadiologyModifiedRows[testIndex];
        if (!upd) return;

        const row = { Test_Id: test.id };

        // Basic fee
        if (upd.BasicFee !== undefined) row.BasicFee = upd.BasicFee;

        // CGHS
        if (upd.CGHSCode !== undefined) row.CGHSCode = upd.CGHSCode;

        // Doctor Contribution
        if (test.DoctorContribution) {
          row.DoctorContribution = test.DoctorContribution.map((c, i) => {
            const k = `DoctorContribution_${c.Type}_${i}`;
            return { ...c, Value: upd[k] ?? c.Value };
          });
        }

        // Insurance
        if (test.InsuranceDetails) {
          row.InsuranceDetails = test.InsuranceDetails.map((ins, i) => {
            const k = `InsuranceDetails_Fee_${i}`;
            return {
              Ratecardid: ins.Ratecardid,
              Fee: upd[k] ?? ins.Fee,
            };
          });
        }

        // Client
        if (test.ClientDetails) {
          row.ClientDetails = test.ClientDetails.map((cl, i) => {
            const k = `ClientDetails_Fee_${i}`;
            return {
              Ratecardid: cl.Ratecardid,
              Fee: upd[k] ?? cl.Fee,
            };
          });
        }

        // Discount
        if (test.DiscountDetails) {
          row.DiscountDetails = test.DiscountDetails.map((disc, i) => {
            const feeKey = `DiscountDetails_Cur_Fee_${i}`;
            const methodKey = `DiscountDetails_Method_${i}`;

            return {
              RatecardId: disc.RatecardId,
              Cur_Fee: upd[feeKey] ?? disc.Cur_Fee,
              Method: upd[methodKey] ?? disc.Method,
            };
          });
        }

        payload.push(row);
      });

      if (payload.length === 0) {
        dispatchvalue({
          type: "toast",
          value: { message: "No changes to save", type: "info" },
        });
        return;
      }

      await axios.post(`${UrlLink}Masters/Radiology_Ratecardmaster`, payload);

      dispatchvalue({
        type: "toast",
        value: { message: "Saved Successfully!", type: "success" },
      });

      setRadiologyModifiedRows({});
      fetchRadiologyData(RadsearchTerm);

    } catch (e) {
      console.error(e);
      dispatchvalue({
        type: "toast",
        value: { message: "Error updating radiology ratecards", type: "error" },
      });
    }
  };





  {/* -----------------------------------------Lab----------------------------------------*/ }

  const [LabmodifiedRows, setLabmodifiedRows] = useState({});
  const [LabRateCardData, setLabRateCardData] = useState([]);

 
  const [LabsearchTerm, setLabsearchTerm] = useState(""); 

    useEffect(() => {
    if (ServiceProcedureForm === 'Lab') {
      axios
        .get(`${UrlLink}Masters/Get_Lab_Ratecard_Details?LabsearchTerm=${LabsearchTerm}`)
        .then((response) => {
          // Ensure response data is an array
          const data = Array.isArray(response.data) ? response.data : [];
          setLabRateCardData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLabRateCardData([]); // Set empty array on error
          setLoading(false);
        });
    }
  }, [UrlLink, ServiceProcedureForm,LabsearchTerm]);

  const handleCopyTestCostToInsurance = () => {
  const updated = LabRateCardData.map((test, testIndex) => {
    if (!Array.isArray(test.InsuranceDetails)) return test;

    const newInsurance = test.InsuranceDetails.map((ins, iIndex) => ({
      ...ins,
      Test_Curr_Fee: test.Test_Cost || ""
    }));

    return {
      ...test,
      InsuranceDetails: newInsurance
    };
  });

  setLabRateCardData(updated);

  // ⭐ Also update LabmodifiedRows so payload is created
  const newModified = { ...LabmodifiedRows };

  updated.forEach((test, testIndex) => {
    if (!Array.isArray(test.InsuranceDetails)) return;

    if (!newModified[testIndex]) newModified[testIndex] = {};

    test.InsuranceDetails.forEach((ins, iIndex) => {
      newModified[testIndex][`InsuranceDetails_Test_Curr_Fee_${iIndex}`] =
        test.Test_Cost || "";
    });
  });

  setLabmodifiedRows(newModified);
};


  const handleLabFieldChange = (e, testIndex, type, fieldIndex, fieldKey) => {
  const value = e.target.value;
  const updatedData = [...LabRateCardData];

  if (!updatedData[testIndex]) updatedData[testIndex] = {};

  // 🔄 Handle top-level fields like Test_Cost and CGHSCode directly
  if (!type) {
    updatedData[testIndex][fieldKey] = value;
  } else {
    if (!updatedData[testIndex][type]) updatedData[testIndex][type] = [];
    if (!updatedData[testIndex][type][fieldIndex]) updatedData[testIndex][type][fieldIndex] = {};
    updatedData[testIndex][type][fieldIndex][fieldKey] = value;
  }

  setLabRateCardData(updatedData);

  const newModifiedRows = { ...LabmodifiedRows };
  if (!newModifiedRows[testIndex]) newModifiedRows[testIndex] = {};
  
  // Track changes for CGHS Code (root level)
  if (fieldKey === "CGHSCode") {
    newModifiedRows[testIndex][`root_CGHSCode_0`] = value;
  } else {
    newModifiedRows[testIndex][`${type || "root"}_${fieldKey}_${fieldIndex}`] = value;
  }
  
  setLabmodifiedRows(newModifiedRows);
  };

  const handleContributionChange = (e, testIndex, contributionIndex, key) => {
    const value = e.target.value;
    const updatedData = [...LabRateCardData];
    updatedData[testIndex].Contribution[contributionIndex][key] = value;
    setLabRateCardData(updatedData);

    const newModifiedRows = { ...LabmodifiedRows };
    if (!newModifiedRows[testIndex]) newModifiedRows[testIndex] = {};
    newModifiedRows[testIndex][`Contribution_${key}_${contributionIndex}`] = value;
    setLabmodifiedRows(newModifiedRows);
  };

  const handleLabSubmit = async () => {
  try {
    const payload = Object.keys(LabmodifiedRows).map((testIndex) => {
      const updates = LabmodifiedRows[testIndex];
      const test = LabRateCardData[testIndex];

      // Build the updated test object with CGHS Code
      const updatedTest = {
        Test_Id: test.id,
        Test_Cost: test.Test_Cost,
        // Include CGHS Code if it's in the updates
        ...(updates[`root_CGHSCode_0`] && { CGHSCode: updates[`root_CGHSCode_0`] }),
        
        Contribution: test.Contribution.map((contri, cIndex) => ({
          ...contri,
          ...(updates[`Contribution_Inhouse_Doctor_contribution_${cIndex}`] && { 
            Inhouse_Doctor_contribution: updates[`Contribution_Inhouse_Doctor_contribution_${cIndex}`] 
          }),
          ...(updates[`Contribution_Referral_Doctor_contribution_${cIndex}`] && { 
            Referral_Doctor_contribution: updates[`Contribution_Referral_Doctor_contribution_${cIndex}`] 
          }),
          ...(updates[`Contribution_Visiting_Doctor_contribution_${cIndex}`] && { 
            Visiting_Doctor_contribution: updates[`Contribution_Visiting_Doctor_contribution_${cIndex}`] 
          }),
        })),

        InsuranceDetails: test.InsuranceDetails.map((item, iIndex) => ({
          ...item,
          ...(updates[`InsuranceDetails_Test_Curr_Fee_${iIndex}`] && { 
            Test_Curr_Fee: updates[`InsuranceDetails_Test_Curr_Fee_${iIndex}`] 
          })
        })),

        ClientDetails: test.ClientDetails.map((item, cIndex) => ({
          ...item,
          ...(updates[`ClientDetails_Test_Curr_Fee_${cIndex}`] && { 
            Test_Curr_Fee: updates[`ClientDetails_Test_Curr_Fee_${cIndex}`] 
          })
        })),

        DiscountDetails: test.DiscountDetails.map((item, dIndex) => ({
          ...item,
          ...(updates[`DiscountDetails_Test_Curr_Fee_${dIndex}`] && { 
            Test_Curr_Fee: updates[`DiscountDetails_Test_Curr_Fee_${dIndex}`] 
          }),
          ...(dIndex === 0 && updates[`DiscountDetails_RatecardType_0`] && { 
            RatecardType: updates[`DiscountDetails_RatecardType_0`] 
          }) // Method select
        }))
      };

      // Also include CGHS Code if it exists in the test data but wasn't modified
      if (test.CGHSCode && !updates[`root_CGHSCode_0`]) {
        updatedTest.CGHSCode = test.CGHSCode;
      }

      return updatedTest;
    });

    console.log("Lab Payload to Submit:", payload);

    const response = await axios.post(`${UrlLink}Masters/Get_Lab_Ratecard_Details`, payload);
    const resData = response.data;
    const message = Object.values(resData)[0];
    const type = Object.keys(resData)[0];

    dispatchvalue({
      type: "toast",
      value: {
        message,
        type
      }
    });

    setLabmodifiedRows({});
  } catch (error) {
    console.error("Error submitting lab data:", error);
    dispatchvalue({
      type: "toast",
      value: {
        message: "Error while updating lab ratecard",
        type: "error"
      }
    });
  }
  };

  // service 
  const [ServiceRateCardData, setServiceRateCardData] = useState([]);
  const [TherapyRateCardData, setTherapyData] = useState([]);

  const [bulkWardValue, setBulkWardValue] = useState({ general: '', special: '', genPrev: '', splPrev: '' });

  const handleBulkWardUpdate = (serviceIndex) => {
    const updatedData = [...ServiceRateCardData];
    const service = updatedData[serviceIndex];
    
    service.WardDetails.forEach((ward, wardIndex) => {
      // Apply bulk values
      ward.GeneralFee = bulkWardValue.general;
      ward.SpecialFee = bulkWardValue.special;
      ward.GeneralPrevFee = bulkWardValue.genPrev;
      ward.SpecialPrevFee = bulkWardValue.splPrev;
      
      // If needed, call handleServiceFieldChange for each, but since it's bulk, update state directly
    });
    
    // Update the main state
    setServiceRateCardData(updatedData);  // Assuming you have a setter for ServiceRateCardData
  };

    const handleApplyBasicToWards = (serviceIndex) => {
    const updatedData = [...ServiceRateCardData];
    const service = updatedData[serviceIndex];
    const basicFee = service.BasicFee || 0;  

    service.WardDetails.forEach((ward) => {
      ward.GeneralFee = basicFee;
      ward.SpecialFee = basicFee;
      ward.GeneralPrevFee = basicFee;
      ward.SpecialPrevFee = basicFee;
    });

    setServiceRateCardData(updatedData);  
  };

  const handleGlobalApplyBasicToWards = () => {
  const updatedData = [...ServiceRateCardData];
  
  updatedData.forEach((service) => {
    const basicFee = service.BasicFee || 0;  // Use row's BasicFee, default to 0 if empty
    
    service.WardDetails.forEach((ward) => {
      ward.GeneralFee = basicFee;
      ward.SpecialFee = basicFee;
      ward.GeneralPrevFee = basicFee;
      ward.SpecialPrevFee = basicFee;
    });
  });
  
  setServiceRateCardData(updatedData);  // Update your state
};



/////////////////////////////////////

// Apply Basic Fee to Insurance for ALL services
const handleGlobalApplyBasicToInsurance = () => {
  if (!Array.isArray(ServiceRateCardData) || ServiceRateCardData.length === 0) {
    alert('No service data available');
    return;
  }

  const updatedData = ServiceRateCardData.map((service, serviceIndex) => {
    const basicFee = service.BasicFee || "";
    
    if (!service.InsuranceDetails || !Array.isArray(service.InsuranceDetails)) {
      return service;
    }
    
    // Update all InsuranceDetails with the Basic Fee
    const updatedInsuranceDetails = service.InsuranceDetails.map(insurance => ({
      ...insurance,
      Fee: basicFee
    }));
    
    return {
      ...service,
      InsuranceDetails: updatedInsuranceDetails
    };
  });
  
  setServiceRateCardData(updatedData);
  alert(`Applied Basic Fee to Insurance columns for ${updatedData.length} services`);
};

// Apply Basic Fee to Clients for ALL services
const handleGlobalApplyBasicToClients = () => {
  if (!Array.isArray(ServiceRateCardData) || ServiceRateCardData.length === 0) {
    alert('No service data available');
    return;
  }

  const updatedData = ServiceRateCardData.map((service, serviceIndex) => {
    const basicFee = service.BasicFee || "";
    
    if (!service.ClientDetails || !Array.isArray(service.ClientDetails)) {
      return service;
    }
    
    // Update all ClientDetails with the Basic Fee
    const updatedClientDetails = service.ClientDetails.map(client => ({
      ...client,
      Fee: basicFee
    }));
    
    return {
      ...service,
      ClientDetails: updatedClientDetails
    };
  });
  
  setServiceRateCardData(updatedData);
  alert(`Applied Basic Fee to Client columns for ${updatedData.length} services`);
};

// Apply Basic Fee to All (Wards + Insurance + Clients)
const handleGlobalApplyBasicToAll = () => {
  if (!Array.isArray(ServiceRateCardData) || ServiceRateCardData.length === 0) {
    alert('No service data available');
    return;
  }

  const updatedData = ServiceRateCardData.map((service, serviceIndex) => {
    const basicFee = service.BasicFee || "";
    const updatedService = { ...service };
    
    // Apply to Wards (General Fee and Special Fee)
    if (updatedService.WardDetails && Array.isArray(updatedService.WardDetails)) {
      updatedService.WardDetails = updatedService.WardDetails.map(ward => ({
        ...ward,
        GeneralFee: basicFee,
        SpecialFee: basicFee
      }));
    }
    
    // Apply to Insurance
    if (updatedService.InsuranceDetails && Array.isArray(updatedService.InsuranceDetails)) {
      updatedService.InsuranceDetails = updatedService.InsuranceDetails.map(insurance => ({
        ...insurance,
        Fee: basicFee
      }));
    }
    
    // Apply to Clients
    if (updatedService.ClientDetails && Array.isArray(updatedService.ClientDetails)) {
      updatedService.ClientDetails = updatedService.ClientDetails.map(client => ({
        ...client,
        Fee: basicFee
      }));
    }
    
    return updatedService;
  });
  
  setServiceRateCardData(updatedData);
  alert(`Applied Basic Fee to All columns for ${updatedData.length} services`);
};

// Apply Basic Fee to Insurance for ONE specific service
const handleApplyBasicToInsurance = (serviceIndex) => {
  if (!Array.isArray(ServiceRateCardData) || !ServiceRateCardData[serviceIndex]) {
    alert('Service not found');
    return;
  }
  
  const updatedData = [...ServiceRateCardData];
  const service = updatedData[serviceIndex];
  const basicFee = service.BasicFee || "";
  
  if (!service.InsuranceDetails || !Array.isArray(service.InsuranceDetails)) {
    alert("No insurance columns found for this service");
    return;
  }
  
  if (!basicFee) {
    alert("Please enter a Basic Fee first");
    return;
  }
  
  // Update all InsuranceDetails for this specific service
  service.InsuranceDetails = service.InsuranceDetails.map(insurance => ({
    ...insurance,
    Fee: basicFee
  }));
  
  setServiceRateCardData(updatedData);
  alert(`Applied Basic Fee (${basicFee}) to ${service.InsuranceDetails.length} insurance columns`);
};

// Apply Basic Fee to Clients for ONE specific service
const handleApplyBasicToClients = (serviceIndex) => {
  if (!Array.isArray(ServiceRateCardData) || !ServiceRateCardData[serviceIndex]) {
    alert('Service not found');
    return;
  }
  
  const updatedData = [...ServiceRateCardData];
  const service = updatedData[serviceIndex];
  const basicFee = service.BasicFee || "";
  
  if (!service.ClientDetails || !Array.isArray(service.ClientDetails)) {
    alert("No client columns found for this service");
    return;
  }
  
  if (!basicFee) {
    alert("Please enter a Basic Fee first");
    return;
  }
  
  // Update all ClientDetails for this specific service
  service.ClientDetails = service.ClientDetails.map(client => ({
    ...client,
    Fee: basicFee
  }));
  
  setServiceRateCardData(updatedData);
  alert(`Applied Basic Fee (${basicFee}) to ${service.ClientDetails.length} client columns`);
};

//////////////////////////////////////////////////////////////////////




  const fetchServiceRateCardData = () => {
    axios
      .get(`${UrlLink}Masters/Service_Ratecard_Master_API`,{params:searchOptions})
      .then((response) => {
        setServiceRateCardData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching service rate card data:", error);
      });
  };

  useEffect(() => {
    if (ServiceProcedureForm === "Service") {
      fetchServiceRateCardData();
    }
  }, [ServiceProcedureForm, UrlLink,searchOptions]);


  const fetchTherapyRateCardData = () => {
    axios
      .get(`${UrlLink}Masters/Therapy_Ratecard_Master_API`)  // Adjust the API URL accordingly
      .then((response) => {
        setTherapyData(response.data);  // Assuming 'setTherapyData' is the setter for the therapy state
      })
      .catch((error) => {
        console.error("Error fetching therapy data:", error);
      });
  };

  useEffect(() => {
    if (ServiceProcedureForm === "Therapy") {  // Check for therapy form
      fetchTherapyRateCardData();
    }
  }, [ServiceProcedureForm, UrlLink]);


  const handleServiceSubmit = async () => {
  try {
    const payload = ServiceRateCardData.map((service) => {
      const updatedService = {
        id: service.id,
        ServiceName: service.ServiceName,
        Department: service.Department,
        BasicFee: service.BasicFee,
        CGHSCode: service.CGHSCode, // Add CGHS Code to payload
      };

      // Add DoctorContribution if it exists
      if (service.DoctorContribution) {
        updatedService.DoctorContribution = service.DoctorContribution.map(contri => ({
          Type: contri.Type,
          Value: contri.Value,
        }));
      }

      // Add WardDetails if it exists
      if (service.WardDetails) {
        updatedService.WardDetails = service.WardDetails.map(ward => ({
          WardId: ward.WardId,
          WardName: ward.WardName,
          GeneralFee: ward.GeneralFee,
          SpecialFee: ward.SpecialFee,
          GeneralPrevFee: ward.GeneralPrevFee,
          SpecialPrevFee: ward.SpecialPrevFee,
        }));
      }

      // Add InsuranceDetails if it exists
      if (service.InsuranceDetails) {
        updatedService.InsuranceDetails = service.InsuranceDetails.map(ins => ({
          RatecardName: ins.RatecardName,
          Fee: ins.Fee,
          Ratecardid: ins.Ratecardid,
        }));
      }

      // Add ClientDetails if it exists
      if (service.ClientDetails) {
        updatedService.ClientDetails = service.ClientDetails.map(client => ({
          RatecardName: client.RatecardName,
          Fee: client.Fee,
          Ratecardid: client.Ratecardid,
        }));
      }

      // Add DiscountDetails if it exists - with proper structure
      if (service.DiscountDetails) {
        updatedService.DiscountDetails = service.DiscountDetails.map(disc => ({
          RatecardName: disc.RatecardName,
          Cur_Fee: disc.Cur_Fee,
          Method: disc.Method,
          Ratecardid: disc.Ratecardid || '',
        }));
      }

      return updatedService;
    });

    console.log("Submitting Service Ratecard Payload:", payload);

    const response = await axios.post(
      `${UrlLink}Masters/Service_Ratecard_Master_API`,
      payload
    );

    const resData = response.data;
    const message = Object.values(resData)[0];
    const type = Object.keys(resData)[0];

    dispatchvalue({
      type: "toast",
      value: { message, type },
    });

    // Re-fetch data after successful update
    fetchServiceRateCardData();

  } catch (error) {
    console.error("Error submitting service data:", error);
    dispatchvalue({
      type: "toast",
      value: {
        message: "Error while updating service ratecard",
        type: "error",
      },
    });
  }
};

  const handleTherapySubmit = async () => {
    try {
      const payload = TherapyRateCardData.map((therapy) => {
        const updatedTherapy = {
          id: therapy.id,
          TherapyName: therapy.TherapyName,
          Department: therapy.Department,
          BasicFee: therapy.BasicFee,
        };

        // Add DoctorContribution if it exists
        if (therapy.DoctorContribution && Array.isArray(therapy.DoctorContribution)) {
          updatedTherapy.DoctorContribution = therapy.DoctorContribution.map(contri => ({
            Type: contri.Type,
            Value: contri.Value,
          }));
        }

        // Add WardDetails if it exists
        if (therapy.WardDetails && Array.isArray(therapy.WardDetails)) {
          updatedTherapy.WardDetails = therapy.WardDetails.map(ward => ({
            WardId: ward.WardId,
            WardName: ward.WardName,
            GeneralFee: ward.GeneralFee,
            SpecialFee: ward.SpecialFee,
            GeneralPrevFee: ward.GeneralPrevFee,
            SpecialPrevFee: ward.SpecialPrevFee,
          }));
        }

        // Add InsuranceDetails if it exists
        if (therapy.InsuranceDetails && Array.isArray(therapy.InsuranceDetails)) {
          updatedTherapy.InsuranceDetails = therapy.InsuranceDetails.map(ins => ({
            RatecardName: ins.RatecardName,
            Fee: ins.Fee,
            Ratecardid: ins.Ratecardid,
          }));
        }

        // Add ClientDetails if it exists
        if (therapy.ClientDetails && Array.isArray(therapy.ClientDetails)) {
          updatedTherapy.ClientDetails = therapy.ClientDetails.map(client => ({
            RatecardName: client.RatecardName,
            Fee: client.Fee,
            Ratecardid: client.Ratecardid,
          }));
        }

        // Add DiscountDetails if it exists
        if (therapy.DiscountDetails && Array.isArray(therapy.DiscountDetails)) {
          updatedTherapy.DiscountDetails = therapy.DiscountDetails.map(disc => ({
            RatecardName: disc.RatecardName,
            Cur_Fee: disc.Cur_Fee,
            Method: disc.Method, // Make sure this is included
            Ratecardid: disc.Ratecardid || '',
          }));
        }

        return updatedTherapy;
      });

      console.log("Submitting Therapy Payload:", payload);

      // Send the transformed data to the backend
      const response = await axios.post(
        `${UrlLink}Masters/Therapy_Ratecard_Master_API`,  // API endpoint specific to therapy
        payload
      );

      const resData = response.data;
      const message = Object.values(resData)[0];
      const type = Object.keys(resData)[0];

      // Dispatch success message
      dispatchvalue({
        type: "toast",
        value: { message, type },
      });

      // Re-fetch data after successful update (if needed)
      fetchTherapyRateCardData();

    } catch (error) {
      console.error("Error submitting therapy data:", error);

      // Dispatch error message
      dispatchvalue({
        type: "toast",
        value: {
          message: "Error while updating therapy ratecard",
          type: "error",
        },
      });
    }
  };



  const handleServiceFieldChange = (e, serviceIndex, type, fieldIndex, fieldKey) => {
    const value = e.target.value;
    const updatedData = [...ServiceRateCardData];

    if (!type) {
      // Handle top-level fields
      updatedData[serviceIndex][fieldKey] = value;
    } else {
      // Ensure the array exists
      if (!updatedData[serviceIndex][type]) {
        updatedData[serviceIndex][type] = [];
      }

      // Ensure the object exists at the index
      if (!updatedData[serviceIndex][type][fieldIndex]) {
        updatedData[serviceIndex][type][fieldIndex] = {};
      }

      // Special handling for DiscountDetails Method
      if (type === "DiscountDetails" && fieldKey === "Method") {
        // Update Method for all discount entries if needed
        updatedData[serviceIndex][type].forEach(disc => {
          disc.Method = value;
        });
      } else {
        // Normal field update
        updatedData[serviceIndex][type][fieldIndex][fieldKey] = value;
      }
    }

    setServiceRateCardData(updatedData);
  };


  const handleTherapyFieldChange = (e, therapyIndex, type, fieldIndex, fieldKey) => {
    const value = e.target.value;
    const updatedData = [...TherapyRateCardData]; // TherapyData is the state holding the therapy data

    if (!type) {
      // Handle top-level fields
      updatedData[therapyIndex][fieldKey] = value;
    } else {
      // Ensure the array exists for the specific type
      if (!updatedData[therapyIndex][type]) {
        updatedData[therapyIndex][type] = [];
      }

      // Ensure the object exists at the fieldIndex
      if (!updatedData[therapyIndex][type][fieldIndex]) {
        updatedData[therapyIndex][type][fieldIndex] = {};
      }

      // Special handling for DiscountDetails Method
      if (type === "DiscountDetails" && fieldKey === "Method") {
        // Update Method for all discount entries if needed
        updatedData[therapyIndex][type].forEach(disc => {
          disc.Method = value;
        });
      } else {
        // Normal field update
        updatedData[therapyIndex][type][fieldIndex][fieldKey] = value;
      }
    }

    setTherapyData(updatedData); // Update the therapy data state
  };

  //--------------------------------------------------Ward-------------------------------------------

  const [WardRateCardData, setWardRateCardData] = useState([]);
  const [WardModifiedRows, setWardModifiedRows] = useState({});

  useEffect(() => {
    if (ServiceProcedureForm === 'Ward') {
      axios
        .get(`${UrlLink}Masters/Get_Ward_Ratecard_Details`)
        .then((response) => {
          setWardRateCardData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching ward data:", error);
          setLoading(false);
        });
    }
  }, [UrlLink, ServiceProcedureForm]);

  const handleWardFieldChange = (e, wardIndex, type, fieldIndex, fieldKey) => {
    const value = e.target.value;
    const updatedData = [...WardRateCardData];

    if (!updatedData[wardIndex]) updatedData[wardIndex] = {};

    if (!type) {
      updatedData[wardIndex][fieldKey] = value;
    } else {
      if (!updatedData[wardIndex][type]) updatedData[wardIndex][type] = [];
      if (!updatedData[wardIndex][type][fieldIndex]) updatedData[wardIndex][type][fieldIndex] = {};
      updatedData[wardIndex][type][fieldIndex][fieldKey] = value;
    }

    setWardRateCardData(updatedData);

    const newModifiedRows = { ...WardModifiedRows };
    if (!newModifiedRows[wardIndex]) newModifiedRows[wardIndex] = {};
    newModifiedRows[wardIndex][`${type || "root"}_${fieldKey}_${fieldIndex}`] = value;
    setWardModifiedRows(newModifiedRows);
  };

  const handleWardContributionChange = (e, wardIndex, contributionIndex, key) => {
    const value = e.target.value;
    const updatedData = [...WardRateCardData];
    updatedData[wardIndex].Contribution[contributionIndex][key] = value;
    setWardRateCardData(updatedData);

    const newModifiedRows = { ...WardModifiedRows };
    if (!newModifiedRows[wardIndex]) newModifiedRows[wardIndex] = {};
    newModifiedRows[wardIndex][`Contribution_${key}_${contributionIndex}`] = value;
    setWardModifiedRows(newModifiedRows);
  };

  const handleWardSubmit = async () => {
    try {
      const payload = Object.keys(WardModifiedRows).map((wardIndex) => {
        const updates = WardModifiedRows[wardIndex];
        const ward = WardRateCardData[wardIndex];

        const updatedWard = {
          Ward_Id: ward.id,
          Ward_Cost: ward.Ward_Cost,
          Ac_Fee: ward.Ac_Fee,
          Non_Ac_Fee: ward.Non_Ac_Fee,
          Contribution: ward.Contribution.map((contri, cIndex) => ({
            ...contri,
            ...(updates[`Contribution_Inhouse_Doctor_Contribution_${cIndex}`] && {
              Inhouse_Doctor_Contribution: updates[`Contribution_Inhouse_Doctor_Contribution_${cIndex}`],
            }),
            ...(updates[`Contribution_Visiting_Doctor_Contribution_${cIndex}`] && {
              Visiting_Doctor_Contribution: updates[`Contribution_Visiting_Doctor_Contribution_${cIndex}`],
            }),
            ...(updates[`Contribution_Referral_Doctor_Contribution_${cIndex}`] && {
              Referral_Doctor_Contribution: updates[`Contribution_Referral_Doctor_Contribution_${cIndex}`],
            }),
          })),
          InsuranceDetails: ward.InsuranceDetails.map((item, iIndex) => ({
            ...item,
            ...(updates[`InsuranceDetails_Curr_Fee_${iIndex}`] && { Curr_Fee: updates[`InsuranceDetails_Curr_Fee_${iIndex}`] }),
            ...(updates[`InsuranceDetails_Curr_AC_Fee_${iIndex}`] && { Curr_AC_Fee: updates[`InsuranceDetails_Curr_AC_Fee_${iIndex}`] }),
            ...(updates[`InsuranceDetails_Curr_NAC_Fee_${iIndex}`] && { Curr_NAC_Fee: updates[`InsuranceDetails_Curr_NAC_Fee_${iIndex}`] }),
          })),
          ClientDetails: ward.ClientDetails.map((item, cIndex) => ({
            ...item,
            ...(updates[`ClientDetails_Curr_Fee_${cIndex}`] && { Curr_Fee: updates[`ClientDetails_Curr_Fee_${cIndex}`] }),
            ...(updates[`ClientDetails_Curr_AC_Fee_${cIndex}`] && { Curr_AC_Fee: updates[`ClientDetails_Curr_AC_Fee_${cIndex}`] }),
            ...(updates[`ClientDetails_Curr_NAC_Fee_${cIndex}`] && { Curr_NAC_Fee: updates[`ClientDetails_Curr_NAC_Fee_${cIndex}`] }),
          })),
          CorporateDetails: ward.CorporateDetails.map((item, corpIndex) => ({
            ...item,
            ...(updates[`CorporateDetails_Curr_Fee_${corpIndex}`] && { Curr_Fee: updates[`CorporateDetails_Curr_Fee_${corpIndex}`] }),
            ...(updates[`CorporateDetails_Curr_AC_Fee_${corpIndex}`] && { Curr_AC_Fee: updates[`CorporateDetails_Curr_AC_Fee_${corpIndex}`] }),
            ...(updates[`CorporateDetails_Curr_NAC_Fee_${corpIndex}`] && { Curr_NAC_Fee: updates[`CorporateDetails_Curr_NAC_Fee_${corpIndex}`] }),
          })),
          DiscountDetails: ward.DiscountDetails.map((item, dIndex) => ({
            ...item,
            ...(updates[`DiscountDetails_Curr_Fee_${dIndex}`] && { Curr_Fee: updates[`DiscountDetails_Curr_Fee_${dIndex}`] }),
            ...(updates[`DiscountDetails_Curr_AC_Fee_${dIndex}`] && { Curr_AC_Fee: updates[`DiscountDetails_Curr_AC_Fee_${dIndex}`] }),
            ...(updates[`DiscountDetails_Curr_NAC_Fee_${dIndex}`] && { Curr_NAC_Fee: updates[`DiscountDetails_Curr_NAC_Fee_${dIndex}`] }),
            ...(dIndex === 0 && updates[`DiscountDetails_RatecardType_0`] && { RatecardType: updates[`DiscountDetails_RatecardType_0`] }),
          })),
        };

        return updatedWard;
      });

      console.log("Ward Payload to Submit:", payload);

      const response = await axios.post(`${UrlLink}Masters/Update_Ward_RateCard_Details`, payload);
      const resData = response.data;
      const message = Object.values(resData)[0];
      const type = Object.keys(resData)[0];

      dispatchvalue({
        type: "toast",
        value: { message, type },
      });

      setWardModifiedRows({});
    } catch (error) {
      console.error("Error submitting ward data:", error);
      dispatchvalue({
        type: "toast",
        value: {
          message: "Error while updating ward ratecard",
          type: "error",
        },
      });
    }
  };

  //--------------------------------------------------Procedure-------------------------------------------

  const [ProcedureRateCardData, setProcedureRateCardData] = useState([]);

  const fetchProcedureRateCardData = () => {
    axios
      .get(`${UrlLink}Masters/Procedure_Ratecard_Master_API`,{params:searchOptions})
      .then((response) => {
        setProcedureRateCardData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching procedure rate card data:", error);
      });
  };

  useEffect(() => {
    if (ServiceProcedureForm === "Procedure") {
      fetchProcedureRateCardData();
    }
  }, [ServiceProcedureForm, UrlLink,searchOptions]);

  const handleProcedureFieldChange = (e, procedureIndex, type, fieldIndex, fieldKey) => {
    const value = e.target.value;
    const updatedData = [...ProcedureRateCardData];

    if (!type) {
      updatedData[procedureIndex][fieldKey] = value;
    } else {
      if (!updatedData[procedureIndex][type]) {
        updatedData[procedureIndex][type] = [];
      }
      if (!updatedData[procedureIndex][type][fieldIndex]) {
        updatedData[procedureIndex][type][fieldIndex] = {};
      }
      updatedData[procedureIndex][type][fieldIndex][fieldKey] = value;
    }

    setProcedureRateCardData(updatedData);
  };

  // Handle Form Submission
  // Handle Form Submission
const handleProcedureSubmit = async () => {
  try {
    const payload = ProcedureRateCardData.map((procedure) => ({
      id: procedure.id,
      ProcedureName: procedure.ProcedureName,
      Speciality: procedure.Speciality,
      CGHSCode: procedure.CGHSCode, // Add CGHS Code to payload
      BasicFee: procedure.BasicFee,
      SurgeonFee: procedure.SurgeonFee,
      OTFee: procedure.OTFee,
      AssistantSurgeonFee: procedure.AssistantSurgeonFee,
      AnesthesianFee: procedure.AnesthesianFee,
      DoctorContribution: procedure.DoctorContribution.map((contri) => ({
        Type: contri.Type,
        Value: contri.Value,
        Method: contri.Method,
      })),
      WardDetails: procedure.WardDetails.map((ward) => ({
        WardId: ward.WardId,
        WardName: ward.WardName,
        Fee: ward.Fee,
        SurgeonFee: ward.SurgeonFee,
        OTFee: ward.OTFee,
        AssistantSurgeonFee: ward.AssistantSurgeonFee,
        AnesthesianFee: ward.AnesthesianFee,
        SpecialFee: ward.SpecialFee,
        SpecialSurgeonFee: ward.SpecialSurgeonFee,
        SpecialOTFee: ward.SpecialOTFee,
        SpecialAssistantSurgeonFee: ward.SpecialAssistantSurgeonFee,
        SpecialAnesthesianFee: ward.SpecialAnesthesianFee,
      })),
      InsuranceDetails: procedure.InsuranceDetails.map((insurance) => ({
        RatecardName: insurance.RatecardName,
        Ratecardid: insurance.Ratecardid,
        Fee: insurance.Fee,
        SurgeonFee: insurance.SurgeonFee,
        OTFee: insurance.OTFee,
        AssistantSurgeonFee: insurance.AssistantSurgeonFee,
        AnesthesianFee: insurance.AnesthesianFee,
      })),
      ClientDetails: procedure.ClientDetails.map((client) => ({
        RatecardName: client.RatecardName,
        Ratecardid: client.Ratecardid,
        Fee: client.Fee,
        SurgeonFee: client.SurgeonFee,
        OTFee: client.OTFee,
        AssistantSurgeonFee: client.AssistantSurgeonFee,
        AnesthesianFee: client.AnesthesianFee,
      })),
      CorporateDetails: procedure.CorporateDetails.map((corp) => ({
        RatecardName: corp.RatecardName,
        Ratecardid: corp.Ratecardid,
        Fee: corp.Fee,
        SurgeonFee: corp.SurgeonFee,
        OTFee: corp.OTFee,
        AssistantSurgeonFee: corp.AssistantSurgeonFee,
        AnesthesianFee: corp.AnesthesianFee,
      })),
      DiscountDetails: procedure.DiscountDetails.map((disc) => ({
        RatecardName: disc.RatecardName,
        Ratecardid: disc.Ratecardid,
        Method: disc.Method,
        Fee: disc.Fee,
        SurgeonFee: disc.SurgeonFee,
        OTFee: disc.OTFee,
        AssistantSurgeonFee: disc.AssistantSurgeonFee,
        AnesthesianFee: disc.AnesthesianFee,
      })),
    }));

    console.log("Submitting Procedure Ratecard Payload:", payload);

    const response = await axios.post(
      `${UrlLink}Masters/Procedure_Ratecard_Master_API`,
      payload
    );

    const resData = response.data;
    const message = Object.values(resData)[0];
    const type = Object.keys(resData)[0];

    dispatchvalue({
      type: "toast",
      value: { message, type },
    });

    fetchProcedureRateCardData();
  } catch (error) {
    console.error("Error submitting procedure data:", error);
    dispatchvalue({
      type: "toast",
      value: {
        message: "Error while updating procedure ratecard",
        type: "error",
      },
    });
  }
};

  // Determine maximum number of Client, Corporate, and Discount entries

  const maxInsuranceCount = Math.max(
    ...ProcedureRateCardData.map((procedure) => (procedure.InsuranceDetails ? procedure.InsuranceDetails.length : 0)),
    0
  );


  const maxClientCount = Math.max(
    ...ProcedureRateCardData.map((procedure) => (procedure.ClientDetails ? procedure.ClientDetails.length : 0)),
    0
  );

  const maxCorporateCount = Math.max(
    ...ProcedureRateCardData.map((procedure) => (procedure.CorporateDetails ? procedure.CorporateDetails.length : 0)),
    0
  );
  const
    maxDiscountCount = Math.max(
      ...ProcedureRateCardData.map((procedure) => (procedure.DiscountDetails ? procedure.DiscountDetails.length : 0)),
      0
    );

  // Generate arrays for Client, Corporate, and Discount headers

  const insuranceHeaders = Array.from({ length: maxInsuranceCount }, (_, index) => ({
    RatecardName: ProcedureRateCardData.find((p) => p.InsuranceDetails?.[index])?.InsuranceDetails[index]?.RatecardName || `Insurance ${index + 1}`,
    Ratecardid: ProcedureRateCardData.find((p) => p.InsuranceDetails?.[index])?.InsuranceDetails[index]?.Ratecardid || index + 1,
  }));


  const clientHeaders = Array.from({ length: maxClientCount }, (_, index) => ({
    RatecardName: ProcedureRateCardData.find((p) => p.ClientDetails?.[index])?.ClientDetails[index]?.RatecardName || `Client ${index + 1}`,
    Ratecardid: ProcedureRateCardData.find((p) => p.ClientDetails?.[index])?.ClientDetails[index]?.Ratecardid || index + 1,
  }));

  const corporateHeaders = Array.from({ length: maxCorporateCount }, (_, index) => ({
    RatecardName: ProcedureRateCardData.find((p) => p.CorporateDetails?.[index])?.CorporateDetails[index]?.RatecardName || `Corporate ${index + 1}`,
    Ratecardid: ProcedureRateCardData.find((p) => p.CorporateDetails?.[index])?.CorporateDetails[index]?.Ratecardid || index + 1,
  }));

  const discountHeaders = Array.from({ length: maxDiscountCount }, (_, index) => ({
    RatecardName: ProcedureRateCardData.find((p) => p.DiscountDetails?.[index])?.DiscountDetails[index]?.RatecardName || `Discount ${index + 1}`,
    Ratecardid: ProcedureRateCardData.find((p) => p.DiscountDetails?.[index])?.DiscountDetails[index]?.Ratecardid || index + 1,
  }));


  return (
    <div className="Main_container_app">
      <h3>RateCard Master</h3>

      <div className="RegisterTypecon">
        <div className="RegisterType">
          {["Service", "Procedure", "Therapy", "DoctorRateCard", "Ward", "Lab", "Radiology"].map((p, ind) => (
            <div className="registertypeval" key={ind + "key"}>
              <input
                type="radio"
                id={p}
                name="appointment_type"
                checked={ServiceProcedureForm === p}
                onChange={handleselectChange}
                value={p}
              />
              <label htmlFor={p}>{p}</label>
            </div>
          ))}
        </div>
      </div>
      <br />


      {ServiceProcedureForm === "Service" && (
  <>
    <div className="RegisFormcon_1" style={{ marginTop: "10px" }}>
      <div className="RegisForm_1">
        <label>
          Service Category<span>:</span>
        </label>
        <input
          type="text"
          name="SearchbyServiceCategory"
          value={searchOptions.SearchbyServiceCategory}
          onChange={HandleOnchangecategory}
          list="ServicesList"
          autoComplete="off"
        />
      </div>

      <datalist id="ServicesList">
        {Array.isArray(ServicesList) &&
          ServicesList.map((Catg, indx) => (
            <option
              key={indx}
              value={`${Catg.Serviceid}.${Catg.ServiceCategory}`}
            />
          ))}
      </datalist>

      <div className="RegisForm_1">
        <label>
          Services<span>:</span>
        </label>
        <input
          type="text"
          name="SearchbyServicesubCategory"
          value={searchOptions.SearchbyServicesubCategory}
          onChange={HandleOnchangesubcategory}
          list="SubcategoryList"
          autoComplete="off"
        />
      </div>

      <datalist id="SubcategoryList">
        {Array.isArray(SubcategoryList) &&
          SubcategoryList.map((Catg, indx) => (
            <option
              key={indx}
              value={`${Catg.pk}.${Catg.service_subcategory}`}
            />
          ))}
      </datalist>
    </div>

    {/* Global Apply Buttons */}
    <div className="vpk_services-global-actions">
      <div className="vpk_services-global-buttons">
        <button
          onClick={handleGlobalApplyBasicToWards}
          className="vpk_services-global-apply-btn"
        >
          Apply Basic Fee to All Wards
        </button>
        
        <button
          onClick={handleGlobalApplyBasicToInsurance}
          className="vpk_services-global-apply-btn vpk_services-insurance-btn"
        >
          Apply Basic Fee to All Insurance
        </button>
        
        <button
          onClick={handleGlobalApplyBasicToClients}
          className="vpk_services-global-apply-btn vpk_services-client-btn"
        >
          Apply Basic Fee to All Clients
        </button>
        
        <button
          onClick={handleGlobalApplyBasicToAll}
          className="vpk_services-global-apply-btn vpk_services-all-btn"
        >
          Apply Basic Fee to All (Wards + Insurance + Clients)
        </button>
      </div>
      
      <div className="vpk_services-global-info">
        <span className="vpk_services-info-item">
          Total Services: <strong>{ServiceRateCardData.length}</strong>
        </span>
        {ServiceRateCardData[0]?.InsuranceDetails?.length > 0 && (
          <span className="vpk_services-info-item">
            Insurance Columns: <strong>{ServiceRateCardData[0].InsuranceDetails.length}</strong>
          </span>
        )}
        {ServiceRateCardData[0]?.ClientDetails?.length > 0 && (
          <span className="vpk_services-info-item">
            Client Columns: <strong>{ServiceRateCardData[0].ClientDetails.length}</strong>
          </span>
        )}
      </div>
    </div>

    <div className="vpk_services">
      <div className="vpk_services-table-container">
        <table className="vpk_services-table">
          <thead>
            <tr>
              <th className="vpk_services-fixed vpk_services-serial-no" rowSpan="2">S.No</th>
              <th className="vpk_services-fixed vpk_services-category" rowSpan="2">Category</th>
              <th className="vpk_services-fixed vpk_services-name" rowSpan="2">Service Name</th>
              <th className="vpk_services-fixed vpk_services-cghs-code" rowSpan="2">CGHS Code</th>
              <th rowSpan="2">Department</th>
              <th rowSpan="2">
                <div className="vpk_services-basic-fee-header">
                  Basic Fee
                  <button
                    onClick={handleGlobalApplyBasicToAll}
                    className="vpk_services-header-apply-btn"
                    title="Apply to all columns"
                  >
                    Apply All
                  </button>
                </div>
              </th>
              {/* Dynamic Ward Headers */}
              {ServiceRateCardData[0]?.WardDetails?.map((ward, wardIndex) => (
                <th key={`ward-${wardIndex}`} colSpan="3" className="vpk_services-th-center">
                  {ward.WardName}
                </th>
              ))}
              <th colSpan="3" className="vpk_services-th-center">Doctor Contribution</th>
              {ServiceRateCardData[0]?.InsuranceDetails?.length > 0 && (
                <th colSpan={ServiceRateCardData[0].InsuranceDetails.length}>
                  <div className="vpk_services-insurance-header">
                    Insurance
                    <div className="vpk_services-auto-fill-indicator">Auto-filled from Basic Fee</div>
                  </div>
                </th>
              )}
              {ServiceRateCardData[0]?.ClientDetails?.length > 0 && (
                <th colSpan={ServiceRateCardData[0].ClientDetails.length}>Client</th>
              )}
              {ServiceRateCardData[0]?.DiscountDetails?.length > 0 && (
                <th colSpan={ServiceRateCardData[0].DiscountDetails.length}>Discount</th>
              )}
            </tr>
            <tr>
              {/* Sub-headers for each ward */}
              {ServiceRateCardData[0]?.WardDetails?.map((ward, wardIndex) => (
                <React.Fragment key={`ward-sub-${wardIndex}`}>
                  <th>General Fee</th>
                  <th>Special Fee</th>
                  <th>Previous Fees</th>
                </React.Fragment>
              ))}
              <th>Inhouse (%)</th>
              <th>Referral (%)</th>
              <th>Visiting (%)</th>
              {ServiceRateCardData[0]?.InsuranceDetails?.map((ins, index) => (
                <th key={`ins-header-${index}`}>
                  <div className="vpk_services-insurance-subheader">
                    {ins.RatecardName}
                  </div>
                </th>
              ))}
              {ServiceRateCardData[0]?.ClientDetails?.map((client, index) => (
                <th key={`client-header-${index}`}>{client.RatecardName}</th>
              ))}
              {ServiceRateCardData[0]?.DiscountDetails?.map((disc, index) => (
                <th key={`disc-header-${index}`}>{disc.RatecardName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ServiceRateCardData.map((service, serviceIndex) => (
              <tr key={serviceIndex} className={serviceIndex % 2 === 0 ? 'vpk_services-row-even' : 'vpk_services-row-odd'}>
                <td className="vpk_services-fixed vpk_services-serial-no">{serviceIndex + 1}</td>
                <td className="vpk_services-fixed vpk_services-category">{service.Category}</td>
                <td className="vpk_services-fixed vpk_services-name">{service.ServiceName}</td>
                <td className="vpk_services-fixed vpk_services-cghs-code">
                  <input
                    type="text"
                    value={service.CGHSCode || ""}
                    onChange={(e) =>
                      handleServiceFieldChange(e, serviceIndex, null, 0, "CGHSCode")
                    }
                    placeholder="Enter CGHS Code"
                    className="vpk_services-cghs-code-input"
                  />
                </td>
                <td className="vpk_services-department">{service.Department}</td>
                <td className="vpk_services-basic-fee">
                  <div className="vpk_services-basic-fee-cell">
                    <div className="vpk_services-input-with-actions">
                      <input
                        type="number"
                        value={service.BasicFee || ""}
                        onChange={(e) =>
                          handleServiceFieldChange(e, serviceIndex, null, 0, "BasicFee")
                        }
                        className="vpk_services-basic-fee-input"
                        placeholder="0.00"
                      />
                      <div className="vpk_services-basic-fee-buttons">
                        <button
                          onClick={() => handleApplyBasicToWards(serviceIndex)}
                          className="vpk_services-apply-btn"
                          title="Apply to all wards"
                        >
                          Apply to Wards
                        </button>
                        <button
                          onClick={() => handleApplyBasicToInsurance(serviceIndex)}
                          className="vpk_services-apply-btn vpk_services-insurance-apply-btn"
                          title="Apply to all insurance columns"
                        >
                          Apply to Insurance
                        </button>
                        <button
                          onClick={() => handleApplyBasicToClients(serviceIndex)}
                          className="vpk_services-apply-btn vpk_services-client-apply-btn"
                          title="Apply to all client columns"
                        >
                          Apply to Clients
                        </button>
                      </div>
                    </div>
                    <div className="vpk_services-basic-fee-info">
                      {service.BasicFee ? `Will apply: ${service.BasicFee}` : 'Enter basic fee first'}
                    </div>
                  </div>
                </td>
                {/* Ward Details - Each ward gets 3 columns */}
                {ServiceRateCardData[0]?.WardDetails?.map((templateWard, wardIndex) => {
                  const currentWard = service.WardDetails?.find(w => w.WardName === templateWard.WardName) || {};
                  const isWardAutoFilled = currentWard.GeneralFee === service.BasicFee || currentWard.SpecialFee === service.BasicFee;
                  
                  return (
                    <React.Fragment key={`service-ward-${wardIndex}`}>
                      <td className={isWardAutoFilled ? 'vpk_services-ward-auto-filled' : ''}>
                        <input
                          type="number"
                          value={currentWard.GeneralFee || ""}
                          onChange={(e) =>
                            handleServiceFieldChange(
                              e,
                              serviceIndex,
                              "WardDetails",
                              service.WardDetails?.findIndex(w => w.WardName === templateWard.WardName) || wardIndex,
                              "GeneralFee"
                            )
                          }
                          className="vpk_services-number-input"
                          placeholder="0.00"
                        />
                      </td>
                      <td className={isWardAutoFilled ? 'vpk_services-ward-auto-filled' : ''}>
                        <input
                          type="number"
                          value={currentWard.SpecialFee || ""}
                          onChange={(e) =>
                            handleServiceFieldChange(
                              e,
                              serviceIndex,
                              "WardDetails",
                              service.WardDetails?.findIndex(w => w.WardName === templateWard.WardName) || wardIndex,
                              "SpecialFee"
                            )
                          }
                          className="vpk_services-number-input"
                          placeholder="0.00"
                        />
                      </td>
                      <td>
                        <div className="vpk_services-prev-fee-group">
                          <div className="vpk_services-prev-fee-item">
                            <label>Gen Prev: </label>
                            <input
                              type="number"
                              value={currentWard.GeneralPrevFee || ""}
                              onChange={(e) =>
                                handleServiceFieldChange(
                                  e,
                                  serviceIndex,
                                  "WardDetails",
                                  service.WardDetails?.findIndex(w => w.WardName === templateWard.WardName) || wardIndex,
                                  "GeneralPrevFee"
                                )
                              }
                              className="vpk_services-prev-input"
                              placeholder="0.00"
                            />
                          </div>
                          <div className="vpk_services-prev-fee-item">
                            <label>Spl Prev: </label>
                            <input
                              type="number"
                              value={currentWard.SpecialPrevFee || ""}
                              onChange={(e) =>
                                handleServiceFieldChange(
                                  e,
                                  serviceIndex,
                                  "WardDetails",
                                  service.WardDetails?.findIndex(w => w.WardName === templateWard.WardName) || wardIndex,
                                  "SpecialPrevFee"
                                )
                              }
                              className="vpk_services-prev-input"
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                      </td>
                    </React.Fragment>
                  );
                })}
                {/* Doctor Contribution */}
                {service.DoctorContribution?.map((contrib, cIndex) => (
                  <td key={`contrib-${cIndex}`}>
                    <input
                      type="number"
                      value={contrib.Value || ""}
                      onChange={(e) =>
                        handleServiceFieldChange(
                          e,
                          serviceIndex,
                          "DoctorContribution",
                          cIndex,
                          "Value"
                        )
                      }
                      className="vpk_services-number-input"
                      placeholder="0"
                    />
                  </td>
                ))}
                {/* Insurance Details */}
                {service.InsuranceDetails?.map((ins, iIndex) => {
                  const isAutoFilled = ins.Fee === service.BasicFee;
                  return (
                    <td 
                      key={`ins-${iIndex}`}
                      className={isAutoFilled ? 'vpk_services-insurance-auto-filled' : ''}
                    >
                      <div className="vpk_services-insurance-cell">
                        <input
                          type="number"
                          value={ins.Fee || ""}
                          onChange={(e) =>
                            handleServiceFieldChange(
                              e,
                              serviceIndex,
                              "InsuranceDetails",
                              iIndex,
                              "Fee"
                            )
                          }
                          className="vpk_services-number-input vpk_services-insurance-input"
                          placeholder="0.00"
                        />
                        {isAutoFilled && (
                          <div className="vpk_services-auto-fill-badge" title="Matches Basic Fee">
                            ✓
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
                {/* Client Details */}
                {service.ClientDetails?.map((client, clIndex) => {
                  const isAutoFilled = client.Fee === service.BasicFee;
                  return (
                    <td 
                      key={`client-${clIndex}`}
                      className={isAutoFilled ? 'vpk_services-client-auto-filled' : ''}
                    >
                      <input
                        type="number"
                        value={client.Fee || ""}
                        onChange={(e) =>
                          handleServiceFieldChange(
                            e,
                            serviceIndex,
                            "ClientDetails",
                            clIndex,
                            "Fee"
                          )
                        }
                        className="vpk_services-number-input"
                        placeholder="0.00"
                      />
                    </td>
                  );
                })}
                {/* Discount Details */}
                {service.DiscountDetails?.map((disc, dIndex) => (
                  <td key={`disc-${dIndex}`}>
                    <div className="vpk_services-discount-group">
                      <div className="vpk_services-discount-method">
                        <select
                          value={disc.Method || ""}
                          onChange={(e) =>
                            handleServiceFieldChange(
                              e,
                              serviceIndex,
                              "DiscountDetails",
                              dIndex,
                              "Method"
                            )
                          }
                          className="vpk_services-select"
                        >
                          <option value="">Select</option>
                          <option value="Value">Value</option>
                          <option value="Percentage">Percentage</option>
                        </select>
                      </div>
                      <div className="vpk_services-discount-fee">
                        <input
                          type="number"
                          value={disc.Cur_Fee || ""}
                          onChange={(e) =>
                            handleServiceFieldChange(
                              e,
                              serviceIndex,
                              "DiscountDetails",
                              dIndex,
                              "Cur_Fee"
                            )
                          }
                          className="vpk_services-number-input"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="Register_btn_con">
        <button className="RegisterForm_1_btns" onClick={handleServiceSubmit}>
          Save
        </button>
      </div>
    </div>
  </>
)}



      {ServiceProcedureForm === "Therapy" && (
        <>
          <div className="Selected-table-container">
            <table className="selected-medicine-table2">
              <thead>
                <tr>
                  <th rowSpan="2">S.No</th>
                  <th rowSpan="2">Therapy Name</th>
                  <th rowSpan="2">Department</th>
                  <th rowSpan="2">Basic Fee</th>
                  <th colSpan="4" className="text_aln_th_center">Ward Details</th>
                  <th colSpan="3" className="text_aln_th_center">Doctor Contribution</th>
                  {TherapyRateCardData[0]?.InsuranceDetails?.length > 0 && (
                    <th colSpan={TherapyRateCardData[0].InsuranceDetails.length}>Insurance</th>
                  )}
                  {TherapyRateCardData[0]?.ClientDetails?.length > 0 && (
                    <th colSpan={TherapyRateCardData[0].ClientDetails.length}>Client</th>
                  )}
                  {TherapyRateCardData[0]?.CorporateDetails?.length > 0 && (
                    <th colSpan={TherapyRateCardData[0].CorporateDetails.length}>Corporate</th>
                  )}
                  {TherapyRateCardData[0]?.DiscountDetails?.length > 0 && (
                    <th colSpan={TherapyRateCardData[0].DiscountDetails.length}>Discount</th>
                  )}
                </tr>
                <tr>
                  <th>Ward Name</th>
                  <th>General Fee</th>
                  <th>Special Fee</th>
                  <th>Previous Fees</th>
                  <th>Inhouse (%)</th>
                  <th>Referral (%)</th>
                  <th>Visiting (%)</th>
                  {TherapyRateCardData[0]?.InsuranceDetails?.map((ins, index) => (
                    <th key={`ins-header-${index}`}>{ins.RatecardName}</th>
                  ))}
                  {TherapyRateCardData[0]?.ClientDetails?.map((client, index) => (
                    <th key={`client-header-${index}`}>{client.RatecardName}</th>
                  ))}
                  {TherapyRateCardData[0]?.CorporateDetails?.map((client, index) => (
                    <th key={`client-header-${index}`}>{client.RatecardName}</th>
                  ))}
                  {TherapyRateCardData[0]?.DiscountDetails?.map((disc, index) => (
                    <th key={`disc-header-${index}`}>{disc.RatecardName}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TherapyRateCardData.map((therapy, therapyIndex) => (
                  therapy.WardDetails?.length > 0 ? (
                    therapy.WardDetails.map((ward, wardIndex) => (
                      <tr key={`${therapyIndex}-${wardIndex}`}>
                        <td>{wardIndex === 0 ? therapyIndex + 1 : ""}</td>
                        <td>{wardIndex === 0 ? therapy.TherapyName : ""}</td>
                        <td>{wardIndex === 0 ? therapy.Department : ""}</td>
                        <td>
                          {wardIndex === 0 ? (
                            <input
                              type="number"
                              value={therapy.BasicFee || ""}
                              onChange={(e) =>
                                handleTherapyFieldChange(e, therapyIndex, null, 0, "BasicFee")
                              }
                            />
                          ) : ""}
                        </td>
                        <td>{ward.WardName}</td>
                        <td>
                          <input
                            type="number"
                            value={ward.GeneralFee || ""}
                            onChange={(e) =>
                              handleTherapyFieldChange(e, therapyIndex, "WardDetails", wardIndex, "GeneralFee")
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={ward.SpecialFee || ""}
                            onChange={(e) =>
                              handleTherapyFieldChange(e, therapyIndex, "WardDetails", wardIndex, "SpecialFee")
                            }
                          />
                        </td>
                        <td>
                          <label>General Prev Fee <span>:</span> </label>
                          <input
                            type="number"
                            value={ward.GeneralPrevFee || ""}
                            onChange={(e) =>
                              handleTherapyFieldChange(e, therapyIndex, "WardDetails", wardIndex, "GeneralPrevFee")
                            }
                          />
                          <label>Special Prev Fee <span>:</span> </label>
                          <input
                            type="number"
                            value={ward.SpecialPrevFee || ""}
                            onChange={(e) =>
                              handleTherapyFieldChange(e, therapyIndex, "WardDetails", wardIndex, "SpecialPrevFee")
                            }
                          />
                        </td>
                        {wardIndex === 0 &&
                          therapy.DoctorContribution?.map((contrib, cIndex) => (
                            <td key={`contrib-${cIndex}`}>
                              <input
                                type="number"
                                value={contrib.Value || ""}
                                onChange={(e) =>
                                  handleTherapyFieldChange(e, therapyIndex, "DoctorContribution", cIndex, "Value")
                                }
                              />
                            </td>
                          ))}
                        {wardIndex === 0 &&
                          therapy.InsuranceDetails?.map((ins, iIndex) => (
                            <td key={`ins-${iIndex}`}>
                              <input
                                type="number"
                                value={ins.Fee || ""}
                                onChange={(e) =>
                                  handleTherapyFieldChange(e, therapyIndex, "InsuranceDetails", iIndex, "Fee")
                                }
                              />
                            </td>
                          ))}
                        {wardIndex === 0 &&
                          therapy.ClientDetails?.map((client, clIndex) => (
                            <td key={`client-${clIndex}`}>
                              <input
                                type="number"
                                value={client.Fee || ""}
                                onChange={(e) =>
                                  handleTherapyFieldChange(e, therapyIndex, "ClientDetails", clIndex, "Fee")
                                }
                              />
                            </td>
                          ))}
                        {wardIndex === 0 &&
                          therapy.CorporateDetails?.map((corporate, corporateIndex) => (
                            <td key={`corporate-row-${corporateIndex}`}>
                              <input
                                type="number"
                                value={corporate.Fee || ""}
                                onChange={(e) =>
                                  handleTherapyFieldChange(e, therapyIndex, "CorporateDetails", corporateIndex, "Fee")
                                }
                              />
                            </td>
                          ))}
                        {wardIndex === 0 &&
                          therapy.DiscountDetails?.map((disc, dIndex) => (
                            <td key={`disc-${dIndex}`}>
                              {dIndex === 0 && (
                                <select
                                  value={disc.Method || ""}
                                  onChange={(e) =>
                                    handleTherapyFieldChange(e, therapyIndex, "DiscountDetails", dIndex, "Method")
                                  }
                                >
                                  <option value="">Select</option>
                                  <option value="Value">Value</option>
                                  <option value="Percentage">Percentage</option>
                                </select>
                              )}
                              <input
                                type="number"
                                value={disc.Cur_Fee || ""}
                                onChange={(e) =>
                                  handleTherapyFieldChange(e, therapyIndex, "DiscountDetails", dIndex, "Cur_Fee")
                                }
                              />
                            </td>
                          ))}
                      </tr>
                    ))
                  ) : (
                    <tr key={therapyIndex}>
                      <td>{therapyIndex + 1}</td>
                      <td>{therapy.TherapyName}</td>
                      <td>{therapy.Department}</td>
                      <td>
                        <input
                          type="number"
                          value={therapy.BasicFee || ""}
                          onChange={(e) =>
                            handleTherapyFieldChange(e, therapyIndex, null, 0, "BasicFee")
                          }
                        />
                      </td>
                      <td colSpan="4" className="text-center">
                        No Ward Data
                      </td>
                      {therapy.DoctorContribution?.map((contrib, cIndex) => (
                        <td key={`contrib-${cIndex}`}>
                          <input
                            type="number"
                            value={contrib.Value || ""}
                            onChange={(e) =>
                              handleTherapyFieldChange(e, therapyIndex, "DoctorContribution", cIndex, "Value")
                            }
                          />
                        </td>
                      ))}
                      {therapy.InsuranceDetails?.map((ins, iIndex) => (
                        <td key={`ins-${iIndex}`}>
                          <input
                            type="number"
                            value={ins.Fee || ""}
                            onChange={(e) =>
                              handleTherapyFieldChange(e, therapyIndex, "InsuranceDetails", iIndex, "Fee")
                            }
                          />
                        </td>
                      ))}
                      {therapy.ClientDetails?.map((client, clIndex) => (
                        <td key={`client-${clIndex}`}>
                          <input
                            type="number"
                            value={client.Fee || ""}
                            onChange={(e) =>
                              handleTherapyFieldChange(e, therapyIndex, "ClientDetails", clIndex, "Fee")
                            }
                          />
                        </td>
                      ))}
                      {therapy.CorporateDetails?.map((corporate, corporateIndex) => (
                        <td key={`corporate-row-${corporateIndex}`}>
                          <input
                            type="number"
                            value={corporate.Fee || ""}
                            onChange={(e) =>
                              handleTherapyFieldChange(e, therapyIndex, "CorporateDetails", corporateIndex, "Fee")
                            }
                          />
                        </td>
                      ))}
                      {therapy.DiscountDetails?.map((disc, dIndex) => (
                        <td key={`disc-${dIndex}`}>
                          {dIndex === 0 && (
                            <select
                              value={disc.Method || ""}
                              onChange={(e) =>
                                handleTherapyFieldChange(e, therapyIndex, "DiscountDetails", dIndex, "Method")
                              }
                            >
                              <option value="">Select</option>
                              <option value="Value">Value</option>
                              <option value="Percentage">Percentage</option>
                            </select>
                          )}
                          <input
                            type="number"
                            value={disc.Cur_Fee || ""}
                            onChange={(e) =>
                              handleTherapyFieldChange(e, therapyIndex, "DiscountDetails", dIndex, "Cur_Fee")
                            }
                          />
                        </td>
                      ))}
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
          <div className="Register_btn_con">
            <button className="RegisterForm_1_btns" onClick={handleTherapySubmit}>
              Save
            </button>
          </div>
        </>
      )}


      {ServiceProcedureForm === 'DoctorRateCard' && (
        <>
          <div className="RegisFormcon_1" style={{ marginTop: "10px" }}>
            <div className="RegisForm_1">
              <label>Doctor Name<span>:</span></label>
              <input
                type="text"
                name="SearchbyFirstName"
                value={searchOptions.SearchbyFirstName}
                onChange={HandleOnchangeSearch}
              />
            </div>
            <div className="RegisForm_1">
              <label>Speciality<span>:</span></label>
              <input
                type="text"
                list="speciality"
                name="SearchbySpeciality"
                value={searchOptions.SearchbySpeciality}
                onChange={HandleOnchangeSearch}
              />
            </div>
            <datalist id="speciality">
              {
                Array.isArray(SpecialityData) &&
                SpecialityData.filter((p) => p.Status === "Active").map(
                  (Catg, indx) => (
                    <option key={indx} value={`${Catg.id}.${Catg.SpecialityName}`}>
                    </option>
                  ))
              }
            </datalist>
          </div>
          <div className="Selected-table-container">
            <table className="selected-medicine-table2">
              <thead>
                <tr>
                  <th rowSpan="2">S.No</th>
                  <th rowSpan="2">Doctor Name</th>
                  <th rowSpan="2">Department</th>
                  {/* Dynamic Ward Headers */}
                  {ratecardData[0]?.WardDetails?.map((ward, wardIndex) => (
                    <th key={`ward-${wardIndex}`} colSpan="4" className="text_aln_th_center">
                      {ward.WardName}
                    </th>
                  ))}
                  <th colSpan="6" className="text_aln_th_center">General Fees</th>
                  <th colSpan="6" className="text_aln_th_center">Special Fees</th>
                  <th colSpan="2" className="text_aln_th_center">Doctor Contribution</th>
                  {ratecardData[0]?.InsuranceDetails?.length > 0 && (
                    <th colSpan={ratecardData[0].InsuranceDetails.length * 3}>Insurance</th>
                  )}
                  {ratecardData[0]?.ClientDetails?.length > 0 && (
                    <th colSpan={ratecardData[0].ClientDetails.length * 3}>Client</th>
                  )}
                  {ratecardData[0]?.CorporateDetails?.length > 0 && (
                    <th colSpan={ratecardData[0].CorporateDetails.length * 3}>Corporate</th>
                  )}
                  {ratecardData[0]?.DiscountDetails?.length > 0 && (
                    <th colSpan={ratecardData[0].DiscountDetails.length}>Discount</th>
                  )}
                </tr>
                <tr>
                  {/* Sub-headers for each ward */}
                  {ratecardData[0]?.WardDetails?.map((ward, wardIndex) => (
                    <React.Fragment key={`ward-sub-${wardIndex}`}>
                      <th>General</th>
                      <th>Prev General</th>
                      <th>Special</th>
                      <th>Prev Special</th>
                    </React.Fragment>
                  ))}

                  {/* General Fees sub-headers */}
                  <th>Consultation</th>
                  <th>Prev Consultation</th>
                  <th>Follow-Up</th>
                  <th>Prev Follow-Up</th>
                  <th>Emergency</th>
                  <th>Prev Emergency</th>

                  {/* Special Fees sub-headers */}
                  <th>Consultation</th>
                  <th>Prev Consultation</th>
                  <th>Follow-Up</th>
                  <th>Prev Follow-Up</th>
                  <th>Emergency</th>
                  <th>Prev Emergency</th>

                  {/* Doctor Contribution */}
                  <th>OP (%)</th>
                  <th>IP (%)</th>

                  {/* Insurance Details */}
                  {ratecardData[0]?.InsuranceDetails?.map((ins, index) => (
                    <React.Fragment key={`ins-header-${index}`}>
                      <th>{ins.RatecardName} Consultation</th>
                      <th>{ins.RatecardName} Follow-Up</th>
                      <th>{ins.RatecardName} Emergency</th>
                    </React.Fragment>
                  ))}

                  {/* Client Details */}
                  {ratecardData[0]?.ClientDetails?.map((client, index) => (
                    <React.Fragment key={`client-header-${index}`}>
                      <th>{client.RatecardName} Consultation</th>
                      <th>{client.RatecardName} Follow-Up</th>
                      <th>{client.RatecardName} Emergency</th>
                    </React.Fragment>
                  ))}

                  {/* Corporate Details */}
                  {ratecardData[0]?.CorporateDetails?.map((corp, index) => (
                    <React.Fragment key={`corp-header-${index}`}>
                      <th>{corp.RatecardName} Consultation</th>
                      <th>{corp.RatecardName} Follow-Up</th>
                      <th>{corp.RatecardName} Emergency</th>
                    </React.Fragment>
                  ))}

                  {/* Discount Details */}
                  {ratecardData[0]?.DiscountDetails?.map((disc, index) => (
                    <th key={`disc-header-${index}`}>{disc.Ratecardname}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ratecardData.map((doctor, doctorIndex) => (
                  <tr key={doctorIndex}>
                    <td>{doctorIndex + 1}</td>
                    <td>{doctor.DoctorName}</td>
                    <td>{doctor.Department}</td>

                    {/* Ward Details - Each ward gets 4 columns */}
                    {ratecardData[0]?.WardDetails?.map((templateWard, wardIndex) => {
                      const currentWard = doctor.WardDetails?.find(w => w.WardName === templateWard.WardName) || {};
                      return (
                        <React.Fragment key={`doctor-ward-${wardIndex}`}>
                          <td>
                            <input
                              type="number"
                              value={currentWard.GeneralFee || ""}
                              onChange={(e) =>
                                handleDoctorFieldChange(
                                  e,
                                  doctorIndex,
                                  "WardDetails",
                                  doctor.WardDetails?.findIndex(w => w.WardName === templateWard.WardName) || wardIndex,
                                  "GeneralFee"
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={currentWard.GeneralPrevFee || ""}
                              onChange={(e) =>
                                handleDoctorFieldChange(
                                  e,
                                  doctorIndex,
                                  "WardDetails",
                                  doctor.WardDetails?.findIndex(w => w.WardName === templateWard.WardName) || wardIndex,
                                  "GeneralPrevFee"
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={currentWard.SpecialFee || ""}
                              onChange={(e) =>
                                handleDoctorFieldChange(
                                  e,
                                  doctorIndex,
                                  "WardDetails",
                                  doctor.WardDetails?.findIndex(w => w.WardName === templateWard.WardName) || wardIndex,
                                  "SpecialFee"
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={currentWard.SpecialPrevFee || ""}
                              onChange={(e) =>
                                handleDoctorFieldChange(
                                  e,
                                  doctorIndex,
                                  "WardDetails",
                                  doctor.WardDetails?.findIndex(w => w.WardName === templateWard.WardName) || wardIndex,
                                  "SpecialPrevFee"
                                )
                              }
                            />
                          </td>
                        </React.Fragment>
                      );
                    })}

                    {/* General Fees */}
                    <td>
                      <input
                        type="number"
                        value={doctor.GeneralConsultationFee || ""}
                        onChange={(e) =>
                          handleDoctorFieldChange(e, doctorIndex, null, 0, "GeneralConsultationFee")
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={doctor.GeneralPrevConsultationFee || ""}
                        onChange={(e) =>
                          handleDoctorFieldChange(e, doctorIndex, null, 0, "GeneralPrevConsultationFee")
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={doctor.GeneralFollowUpFee || ""}
                        onChange={(e) =>
                          handleDoctorFieldChange(e, doctorIndex, null, 0, "GeneralFollowUpFee")
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={doctor.GeneralPrevFollowUpFee || ""}
                        onChange={(e) =>
                          handleDoctorFieldChange(e, doctorIndex, null, 0, "GeneralPrevFollowUpFee")
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={doctor.GeneralEmgConsultingFee || ""}
                        onChange={(e) =>
                          handleDoctorFieldChange(e, doctorIndex, null, 0, "GeneralEmgConsultingFee")
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={doctor.GeneralPrevEmgConsultingFee || ""}
                        onChange={(e) =>
                          handleDoctorFieldChange(e, doctorIndex, null, 0, "GeneralPrevEmgConsultingFee")
                        }
                      />
                    </td>

                    {/* Special Fees */}
                    <td>
                      <input
                        type="number"
                        value={doctor.SpecialConsultationFee || ""}
                        onChange={(e) =>
                          handleDoctorFieldChange(e, doctorIndex, null, 0, "SpecialConsultationFee")
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={doctor.SpecialPrevConsultationFee || ""}
                        onChange={(e) =>
                          handleDoctorFieldChange(e, doctorIndex, null, 0, "SpecialPrevConsultationFee")
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={doctor.SpecialFollowUpFee || ""}
                        onChange={(e) =>
                          handleDoctorFieldChange(e, doctorIndex, null, 0, "SpecialFollowUpFee")
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={doctor.SpecialPrevFollowUpFee || ""}
                        onChange={(e) =>
                          handleDoctorFieldChange(e, doctorIndex, null, 0, "SpecialPrevFollowUpFee")
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={doctor.SpecialEmgConsultingFee || ""}
                        onChange={(e) =>
                          handleDoctorFieldChange(e, doctorIndex, null, 0, "SpecialEmgConsultingFee")
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={doctor.SpecialPrevEmgConsultingFee || ""}
                        onChange={(e) =>
                          handleDoctorFieldChange(e, doctorIndex, null, 0, "SpecialPrevEmgConsultingFee")
                        }
                      />
                    </td>

                    {/* Doctor Contribution */}
                    {doctor.DoctorContribution?.map((contrib, cIndex) => (
                      <td key={`contrib-${cIndex}`}>
                        <input
                          type="number"
                          value={contrib.Value || ""}
                          onChange={(e) =>
                            handleDoctorFieldChange(
                              e,
                              doctorIndex,
                              "DoctorContribution",
                              cIndex,
                              "Value"
                            )
                          }
                        />
                      </td>
                    ))}

                    {/* Insurance Details */}
                    {doctor.InsuranceDetails?.map((ins, iIndex) => (
                      <React.Fragment key={`ins-${iIndex}`}>
                        <td>
                          <input
                            type="number"
                            value={ins.ConsultationFee || ""}
                            onChange={(e) =>
                              handleDoctorFieldChange(
                                e,
                                doctorIndex,
                                "InsuranceDetails",
                                iIndex,
                                "ConsultationFee"
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={ins.FollowUpFee || ""}
                            onChange={(e) =>
                              handleDoctorFieldChange(
                                e,
                                doctorIndex,
                                "InsuranceDetails",
                                iIndex,
                                "FollowUpFee"
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={ins.EmgConsultingFee || ""}
                            onChange={(e) =>
                              handleDoctorFieldChange(
                                e,
                                doctorIndex,
                                "InsuranceDetails",
                                iIndex,
                                "EmgConsultingFee"
                              )
                            }
                          />
                        </td>
                      </React.Fragment>
                    ))}

                    {/* Client Details */}
                    {doctor.ClientDetails?.map((client, clIndex) => (
                      <React.Fragment key={`client-${clIndex}`}>
                        <td>
                          <input
                            type="number"
                            value={client.ConsultationFee || ""}
                            onChange={(e) =>
                              handleDoctorFieldChange(
                                e,
                                doctorIndex,
                                "ClientDetails",
                                clIndex,
                                "ConsultationFee"
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={client.FollowUpFee || ""}
                            onChange={(e) =>
                              handleDoctorFieldChange(
                                e,
                                doctorIndex,
                                "ClientDetails",
                                clIndex,
                                "FollowUpFee"
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={client.EmgConsultingFee || ""}
                            onChange={(e) =>
                              handleDoctorFieldChange(
                                e,
                                doctorIndex,
                                "ClientDetails",
                                clIndex,
                                "EmgConsultingFee"
                              )
                            }
                          />
                        </td>
                      </React.Fragment>
                    ))}

                    {/* Corporate Details */}
                    {doctor.CorporateDetails?.map((corp, coIndex) => (
                      <React.Fragment key={`corp-${coIndex}`}>
                        <td>
                          <input
                            type="number"
                            value={corp.ConsultationFee || ""}
                            onChange={(e) =>
                              handleDoctorFieldChange(
                                e,
                                doctorIndex,
                                "CorporateDetails",
                                coIndex,
                                "ConsultationFee"
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={corp.FollowUpFee || ""}
                            onChange={(e) =>
                              handleDoctorFieldChange(
                                e,
                                doctorIndex,
                                "CorporateDetails",
                                coIndex,
                                "FollowUpFee"
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={corp.EmgConsultingFee || ""}
                            onChange={(e) =>
                              handleDoctorFieldChange(
                                e,
                                doctorIndex,
                                "CorporateDetails",
                                coIndex,
                                "EmgConsultingFee"
                              )
                            }
                          />
                        </td>
                      </React.Fragment>
                    ))}

                    {/* Discount Details */}
                    {doctor.DiscountDetails?.map((disc, dIndex) => (
                      <td key={`disc-${dIndex}`}>
                        <div style={{ marginBottom: '5px' }}>
                          <select
                            value={disc.Method || ""}
                            onChange={(e) =>
                              handleDoctorFieldChange(
                                e,
                                doctorIndex,
                                "DiscountDetails",
                                dIndex,
                                "Method"
                              )
                            }
                          >
                            <option value="">Select</option>
                            <option value="Value">Value</option>
                            <option value="Percentage">Percentage</option>
                          </select>
                        </div>
                        <div>
                          <input
                            type="number"
                            value={disc.Cur_Fee || ""}
                            onChange={(e) =>
                              handleDoctorFieldChange(
                                e,
                                doctorIndex,
                                "DiscountDetails",
                                dIndex,
                                "Cur_Fee"
                              )
                            }
                          />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <br />
          <div className="Register_btn_con">
            <button className="RegisterForm_1_btns" onClick={handleDoctorSave}>
              Save
            </button>
          </div>
        </>
      )}

     {ServiceProcedureForm === 'Ward' && (
  <>
    {/* Search Component */}
    <div className="search-container">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search ward names..."
          value={WardsearchTerm}
          onChange={(e) => setWardSearchTerm(e.target.value)}
          className="search-input"
        />
        <button 
          className="clear-search-btn"
          onClick={() => setWardSearchTerm('')}
        >
          Clear
        </button>
      </div>
    </div>

    <div className="Selected-table-container">
      <div className="table-scroll-wrapper">
        <table className="selected-medicine-table2">
          <thead>
            <tr>
              <th className="fixed-column serial-no" rowSpan="2">S.No</th>
              <th className="fixed-column department" rowSpan="2">Service</th>
              <th className="fixed-column test-name" rowSpan="2">Ward Name</th>
              <th rowSpan="2">Ward Type</th>
              <th rowSpan="2">Ward Cost</th>
              <th rowSpan="2">AC</th>
              {WardRateCardData.some((ward) => ward.Is_AC) && (
                <>
                  <th rowSpan="2">AC Fee</th>
                  <th rowSpan="2">Non-AC Fee</th>
                </>
              )}
              <th colSpan="3">Contribution</th>
              {WardRateCardData[0]?.InsuranceDetails?.length > 0 && (
                <th colSpan={WardRateCardData[0].InsuranceDetails.length * 3}>Insurance</th>
              )}
              {WardRateCardData[0]?.ClientDetails?.length > 0 && (
                <th colSpan={WardRateCardData[0].ClientDetails.length * 3}>Client</th>
              )}
              {WardRateCardData[0]?.CorporateDetails?.length > 0 && (
                <th colSpan={WardRateCardData[0].CorporateDetails.length * 3}>Corporate</th>
              )}
              {WardRateCardData[0]?.DiscountDetails?.length > 0 && (
                <th colSpan={WardRateCardData[0].DiscountDetails.length * 3 + 1}>Discount</th>
              )}
            </tr>
            <tr>
              <th>Inhouse (%)</th>
              <th>Referral (%)</th>
              <th>Visiting (%)</th>
              {WardRateCardData[0]?.InsuranceDetails?.map((ins, index) => (
                <React.Fragment key={`ins-header-${index}`}>
                  <th>{ins.RatecardName} (Fee)</th>
                  <th>{ins.RatecardName} (AC Fee)</th>
                  <th>{ins.RatecardName} (Non-AC Fee)</th>
                </React.Fragment>
              ))}
              {WardRateCardData[0]?.ClientDetails?.map((client, index) => (
                <React.Fragment key={`client-header-${index}`}>
                  <th>{client.RatecardName} (Fee)</th>
                  <th>{client.RatecardName} (AC Fee)</th>
                  <th>{client.RatecardName} (Non-AC Fee)</th>
                </React.Fragment>
              ))}
              {WardRateCardData[0]?.CorporateDetails?.map((corp, index) => (
                <React.Fragment key={`corp-header-${index}`}>
                  <th>{corp.RatecardName} (Fee)</th>
                  <th>{corp.RatecardName} (AC Fee)</th>
                  <th>{corp.RatecardName} (Non-AC Fee)</th>
                </React.Fragment>
              ))}
              {WardRateCardData[0]?.DiscountDetails?.length > 0 && <th>Method</th>}
              {WardRateCardData[0]?.DiscountDetails?.map((dis, index) => (
                <React.Fragment key={`disc-header-${index}`}>
                  <th>{dis.RatecardName} (Fee)</th>
                  <th>{dis.RatecardName} (AC Fee)</th>
                  <th>{dis.RatecardName} (Non-AC Fee)</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {(() => {
              // Filter data based on search term
              const filteredData = WardsearchTerm 
                ? WardRateCardData.filter(ward => 
                    ward.Ward_Name?.toLowerCase().includes(WardsearchTerm.toLowerCase()) ||
                    ward.Ward_Type?.toLowerCase().includes(WardsearchTerm.toLowerCase())
                  )
                : WardRateCardData;

              // Highlight search term
              const highlightText = (text, searchTerm) => {
                if (!searchTerm || !text) return text;
                const regex = new RegExp(`(${searchTerm})`, 'gi');
                return text.replace(regex, '<mark>$1</mark>');
              };

              return filteredData.map((ward, displayIndex) => {
                const originalIndex = WardRateCardData.findIndex(w => 
                  w.Ward_Name === ward.Ward_Name && w.Ward_Type === ward.Ward_Type
                );

                return (
                  <tr key={originalIndex}>
                    <td className="fixed-column serial-no">{displayIndex + 1}</td>
                    <td className="fixed-column department">{ward.Service}</td>
                    <td className="fixed-column test-name">
                      <span 
                        dangerouslySetInnerHTML={{ 
                          __html: highlightText(ward.Ward_Name, WardsearchTerm)
                        }} 
                      />
                    </td>
                    <td>
                      <span 
                        dangerouslySetInnerHTML={{ 
                          __html: highlightText(ward.Ward_Type, WardsearchTerm)
                        }} 
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={ward.Ward_Cost}
                        onChange={(e) => handleWardFieldChange(e, originalIndex, null, 0, "Ward_Cost")}
                      />
                    </td>
                    <td>{ward.Is_AC ? 'Yes' : 'No'}</td>
                    {WardRateCardData.some((w) => w.Is_AC) && (
                      <>
                        <td>
                          {ward.Is_AC ? (
                            <input
                              type="number"
                              value={ward.Ac_Fee}
                              onChange={(e) => handleWardFieldChange(e, originalIndex, null, 0, "Ac_Fee")}
                            />
                          ) : (
                            '-'
                          )}
                        </td>
                        <td>
                          {ward.Is_AC ? (
                            <input
                              type="number"
                              value={ward.Non_Ac_Fee}
                              onChange={(e) => handleWardFieldChange(e, originalIndex, null, 0, "Non_Ac_Fee")}
                            />
                          ) : (
                            '-'
                          )}
                        </td>
                      </>
                    )}
                    {[
                      { type: "Inhouse_Doctor_Contribution", label: "Inhouse (%)" },
                      { type: "Referral_Doctor_Contribution", label: "Referral (%)" },
                      { type: "Visiting_Doctor_Contribution", label: "Visiting (%)" },
                    ].map((contrib, cIndex) => {
                      const contribData = ward.Contribution.find((c) => c.RatecardType === contrib.type) || {};
                      return (
                        <td key={`contrib-${cIndex}`}>
                          <input
                            type="number"
                            value={contribData[contrib.type] || ""}
                            onChange={(e) => handleWardContributionChange(e, originalIndex, ward.Contribution.indexOf(contribData), contrib.type)}
                          />
                        </td>
                      );
                    })}
                    {ward.InsuranceDetails.map((ins, iIndex) => (
                      <React.Fragment key={`ins-${iIndex}`}>
                        <td>
                          <input
                            type="number"
                            value={ins.Curr_Fee}
                            onChange={(e) => handleWardFieldChange(e, originalIndex, "InsuranceDetails", iIndex, "Curr_Fee")}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={ins.Curr_AC_Fee}
                            onChange={(e) => handleWardFieldChange(e, originalIndex, "InsuranceDetails", iIndex, "Curr_AC_Fee")}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={ins.Curr_NAC_Fee}
                            onChange={(e) => handleWardFieldChange(e, originalIndex, "InsuranceDetails", iIndex, "Curr_NAC_Fee")}
                          />
                        </td>
                      </React.Fragment>
                    ))}
                    {ward.ClientDetails.map((client, clIndex) => (
                      <React.Fragment key={`client-${clIndex}`}>
                        <td>
                          <input
                            type="number"
                            value={client.Curr_Fee}
                            onChange={(e) => handleWardFieldChange(e, originalIndex, "ClientDetails", clIndex, "Curr_Fee")}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={client.Curr_AC_Fee}
                            onChange={(e) => handleWardFieldChange(e, originalIndex, "ClientDetails", clIndex, "Curr_AC_Fee")}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={client.Curr_NAC_Fee}
                            onChange={(e) => handleWardFieldChange(e, originalIndex, "ClientDetails", clIndex, "Curr_NAC_Fee")}
                          />
                        </td>
                      </React.Fragment>
                    ))}
                    {ward.CorporateDetails.map((corp, corpIndex) => (
                      <React.Fragment key={`corp-${corpIndex}`}>
                        <td>
                          <input
                            type="number"
                            value={corp.Curr_Fee}
                            onChange={(e) => handleWardFieldChange(e, originalIndex, "CorporateDetails", corpIndex, "Curr_Fee")}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={corp.Curr_AC_Fee}
                            onChange={(e) => handleWardFieldChange(e, originalIndex, "CorporateDetails", corpIndex, "Curr_AC_Fee")}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={corp.Curr_NAC_Fee}
                            onChange={(e) => handleWardFieldChange(e, originalIndex, "CorporateDetails", corpIndex, "Curr_NAC_Fee")}
                          />
                        </td>
                      </React.Fragment>
                    ))}
                    {ward.DiscountDetails.length > 0 && (
                      <td>
                        <select
                          value={ward.DiscountDetails[0]?.RatecardType || ""}
                          onChange={(e) => handleWardFieldChange(e, originalIndex, "DiscountDetails", 0, "RatecardType")}
                        >
                          <option value="">Select</option>
                          <option value="Percentage">Percentage</option>
                          <option value="Value">Value</option>
                        </select>
                      </td>
                    )}
                    {ward.DiscountDetails.map((disc, dIndex) => (
                      <React.Fragment key={`disc-${dIndex}`}>
                        <td>
                          <input
                            type="number"
                            value={disc.Curr_Fee}
                            onChange={(e) => handleWardFieldChange(e, originalIndex, "DiscountDetails", dIndex, "Curr_Fee")}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={disc.Curr_AC_Fee}
                            onChange={(e) => handleWardFieldChange(e, originalIndex, "DiscountDetails", dIndex, "Curr_AC_Fee")}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={disc.Curr_NAC_Fee}
                            onChange={(e) => handleWardFieldChange(e, originalIndex, "DiscountDetails", dIndex, "Curr_NAC_Fee")}
                          />
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                );
              });
            })()}
          </tbody>
        </table>
      </div>

      <div className="Register_btn_con">
        <button className="RegisterForm_1_btns" onClick={handleWardSubmit}>
          Save
        </button>
      </div>
    </div>
  </>
      )}

      {ServiceProcedureForm === 'Lab' && (
        <div className="vpk_lab">
          {/* Search Component */}
          <div className="vpk_lab-search-container">
            <div className="vpk_lab-search-box">
              <input
                type="text"
                placeholder="Search test names, codes, or CGHS codes..."
                value={LabsearchTerm || ""}
                onChange={(e) => setLabsearchTerm(e.target.value)}
                className="vpk_lab-search-input"
              />
              <button 
                className="vpk_lab-clear-search-btn"
                onClick={() => setLabsearchTerm('')}
              >
                Clear
              </button>
            </div>

            <button 
  className="vpk_lab-copy-testcost-btn"
  onClick={handleCopyTestCostToInsurance}
>
  Copy Test Cost → Insurance Fees
</button>


          

            
          </div>

          <div className="vpk_lab-table-container">
            <table className="vpk_lab-table">
              <thead>
                <tr>
                  <th className="vpk_lab-fixed vpk_lab-serial-no" rowSpan="2">S.No</th>
                  {/* <th className="vpk_lab-fixed vpk_lab-department" rowSpan="2">Service</th>
                  <th className="vpk_lab-fixed vpk_lab-test-code" rowSpan="2">Test Code</th> */}
                  <th className="vpk_lab-fixed vpk_lab-test-name" rowSpan="2">Test Name</th>
                  <th className="vpk_lab-fixed vpk_lab-cghs-code" rowSpan="2">CGHS Code</th>
                  <th rowSpan="2">Test Cost</th>
                  <th colSpan="3">Contribution</th>

                  {/* Add safety check for empty array */}
                  {Array.isArray(LabRateCardData) && LabRateCardData[0]?.InsuranceDetails?.length > 0 && (
                    <th colSpan={LabRateCardData[0].InsuranceDetails.length}>Insurance</th>
                  )}
                  {Array.isArray(LabRateCardData) && LabRateCardData[0]?.ClientDetails?.length > 0 && (
                    <th colSpan={LabRateCardData[0].ClientDetails.length}>Client</th>
                  )}
                  {Array.isArray(LabRateCardData) && LabRateCardData[0]?.DiscountDetails?.length > 0 && (
                    <th colSpan={LabRateCardData[0].DiscountDetails.length + 1}>Discount</th>
                  )}
                </tr>
                <tr>
                  <th>Inhouse (%)</th>
                  <th>Referral (%)</th>
                  <th>Visiting (%)</th>

                  {/* Add safety checks for map functions */}
                  {Array.isArray(LabRateCardData) && LabRateCardData[0]?.InsuranceDetails?.map((ins, index) => (
                    <th key={`ins-header-${index}`}>{ins.RatecardName}</th>
                  ))}
                  {Array.isArray(LabRateCardData) && LabRateCardData[0]?.ClientDetails?.map((client, index) => (
                    <th key={`client-header-${index}`}>{client.RatecardName}</th>
                  ))}
                  <th>Method</th>
                  {Array.isArray(LabRateCardData) && LabRateCardData[0]?.DiscountDetails?.map((dis, index) => (
                    <th key={`disc-header-${index}`}>{dis.RatecardName}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {(() => {
                  // Ensure LabRateCardData is an array before filtering
                  if (!Array.isArray(LabRateCardData)) {
                    return (
                      <tr>
                        <td colSpan="20" className="vpk_lab-no-data">
                          No data available or data format error
                        </td>
                      </tr>
                    );
                  }

                  // Filter data based on search term with safe handling
                  const filteredData = LabsearchTerm 
                    ? LabRateCardData.filter(test => {
                        // Ensure LabsearchTerm is a string
                        const searchTerm = String(LabsearchTerm || "").toLowerCase();
                        
                        // Safely get values with fallbacks
                        const testName = String(test?.Test_Name || "").toLowerCase();
                        const testCode = String(test?.Test_Code || "").toLowerCase();
                        const cghsCode = String(test?.CGHSCode || "").toLowerCase();
                        
                        return testName.includes(searchTerm) ||
                              testCode.includes(searchTerm) ||
                              cghsCode.includes(searchTerm);
                      })
                    : LabRateCardData;

                  // Handle empty filtered data
                  if (filteredData.length === 0) {
                    return (
                      <tr>
                        <td colSpan="20" className="vpk_lab-no-data">
                          {LabsearchTerm ? 'No tests found matching your search' : 'No test data available'}
                        </td>
                      </tr>
                    );
                  }

                  // Highlight search term with safe handling
                  const highlightText = (text, searchTerm) => {
                    if (!searchTerm || !text) return text;
                    try {
                      const safeText = String(text || "");
                      const safeSearchTerm = String(searchTerm || "");
                      const regex = new RegExp(`(${safeSearchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                      return safeText.replace(regex, '<mark class="vpk_lab-highlight">$1</mark>');
                    } catch (error) {
                      console.error('Error in highlightText:', error);
                      return text;
                    }
                  };

                  return filteredData.map((test, displayIndex) => {
                    // Safely find original index
                    const originalIndex = LabRateCardData.findIndex(t => 
                      t?.Test_Code === test?.Test_Code && t?.Test_Name === test?.Test_Name
                    );

                    return (
                      <tr key={originalIndex}>
                        <td className="vpk_lab-fixed vpk_lab-serial-no">{displayIndex + 1}</td>
                        {/* <td className="vpk_lab-fixed vpk_lab-department">{test?.Service || '-'}</td>
                        <td className="vpk_lab-fixed vpk_lab-test-code">
                          <span 
                            dangerouslySetInnerHTML={{ 
                              __html: highlightText(test?.Test_Code || '', LabsearchTerm)
                            }} 
                          />
                        </td> */}
                        <td className="vpk_lab-fixed vpk_lab-test-name">
                          <span 
                            dangerouslySetInnerHTML={{ 
                              __html: highlightText(test?.Test_Name || '', LabsearchTerm)
                            }} 
                          />
                        </td>
                        <td className="vpk_lab-fixed vpk_lab-cghs-code">
                          <input
                            type="text"
                            value={test?.CGHSCode || ""}
                            onChange={(e) => handleLabFieldChange(e, originalIndex, null, 0, "CGHSCode")}
                            placeholder="Enter CGHS Code"
                            className="vpk_lab-cghs-code-input"
                          />
                        </td>
                        <td className="vpk_lab-test-cost">
                          <input
                            type="number"
                            value={test?.Test_Cost || ""}
                            onChange={(e) => handleLabFieldChange(e, originalIndex, null, 0, "Test_Cost")}
                            className="vpk_lab-number-input"
                          />
                        </td>

                        {/* Contributions with safety checks */}
                        {["Inhouse_Doctor_contribution", "Referral_Doctor_contribution", "Visiting_Doctor_contribution"].map(
                          (key, cIndex) => (
                            <td key={`contrib-${cIndex}`}>
                              <input
                                type="number"
                                value={test?.Contribution?.[cIndex]?.[key] || ""}
                                onChange={(e) => handleContributionChange(e, originalIndex, cIndex, key)}
                                className="vpk_lab-number-input"
                              />
                            </td>
                          )
                        )}

                        {/* Insurance Fees with safety checks */}
                        {test?.InsuranceDetails?.map((ins, iIndex) => (
                          <td key={`ins-${iIndex}`}>
                            <input
                              type="number"
                              value={ins?.Test_Curr_Fee || ""}
                              onChange={(e) =>
                                handleLabFieldChange(e, originalIndex, "InsuranceDetails", iIndex, "Test_Curr_Fee")
                              }
                              className="vpk_lab-number-input"
                            />
                          </td>
                        )) || <td className="vpk_lab-empty-cell">-</td>}

                        {/* Client Fees with safety checks */}
                        {test?.ClientDetails?.map((client, clIndex) => (
                          <td key={`client-${clIndex}`}>
                            <input
                              type="number"
                              value={client?.Test_Curr_Fee || ""}
                              onChange={(e) =>
                                handleLabFieldChange(e, originalIndex, "ClientDetails", clIndex, "Test_Curr_Fee")
                              }
                              className="vpk_lab-number-input"
                            />
                          </td>
                        )) || <td className="vpk_lab-empty-cell">-</td>}

                        {/* Discount Method */}
                        <td className="vpk_lab-discount-method">
                          <select
                            value={test?.DiscountDetails?.[0]?.RatecardType || ""}
                            onChange={(e) =>
                              handleLabFieldChange(e, originalIndex, "DiscountDetails", 0, "RatecardType")
                            }
                            className="vpk_lab-select"
                          >
                            <option value="">Select</option>
                            <option value="Percentage">Percentage</option>
                            <option value="Fixed">Fixed</option>
                          </select>
                        </td>

                        {/* Discount Fees with safety checks */}
                        {test?.DiscountDetails?.map((disc, dIndex) => (
                          <td key={`disc-${dIndex}`}>
                            <input
                              type="number"
                              value={disc?.Test_Curr_Fee || ""}
                              onChange={(e) =>
                                handleLabFieldChange(e, originalIndex, "DiscountDetails", dIndex, "Test_Curr_Fee")
                              }
                              className="vpk_lab-number-input"
                            />
                          </td>
                        )) || <td className="vpk_lab-empty-cell">-</td>}
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
          
          <div className="vpk_Register_btn_con">
            <button className="vpk_RegisterForm_1_btns" onClick={handleLabSubmit}>
              Save
            </button>
          </div>
        </div>
      )}

    
       {ServiceProcedureForm === "Radiology" && (
          <>
            {/* Search Component */}
            <div className="vpk_radiology-search-container">
              <div className="vpk_radiology-search-box">
                <input
                  type="text"
                  placeholder="Search test names or CGHS codes..."
                  value={RadsearchTerm || ""}
                  onChange={(e) => setRadSearchTerm(e.target.value)}
                  className="vpk_radiology-search-input"
                />
                <button 
                  className="vpk_radiology-clear-search-btn"
                  onClick={() => setRadSearchTerm('')}
                  disabled={!RadsearchTerm}
                >
                  Clear
                </button>
              </div>

              <br />
              <br />
              
              <button
                className="RegisterForm_1_btns"
                style={{ backgroundColor: '#007bff', color: 'white', padding: '8px 16px', marginLeft: '10px' }}
                onClick={applyBasicFeeToAll}
              >
                Apply Basic Fee → Insurance + Client + Discount
              </button>

              {/* Show modification count */}
              {Object.keys(RadiologyModifiedRows).length > 0 && (
                <div style={{ marginTop: '10px', color: '#ff6b00', fontWeight: 'bold' }}>
                  {Object.keys(RadiologyModifiedRows).length} 
                  test(s) have pending changes
                </div>
              )}
            </div>

            {loading ? (
              <div className="loading-spinner">Loading...</div>
            ) : (
              <div className="vpk_radiology">
                <div className="vpk_radiology-table-container">
                  <table className="vpk_radiology-table">
                    <thead>
                      <tr>
                        <th className="vpk_radiology-fixed vpk_radiology-serial-no" rowSpan="2">S.No</th>
                        <th className="vpk_radiology-fixed vpk_radiology-department" rowSpan="2">Department</th>
                        <th className="vpk_radiology-fixed vpk_radiology-test-name" rowSpan="2">Test Name</th>
                        <th className="vpk_radiology-fixed vpk_radiology-cghs-code" rowSpan="2">CGHS Code</th>
                        <th rowSpan="2">Basic Fee</th>
                        <th colSpan="3">Doctor Contribution</th>
                        {RadiologyRateCardData[0]?.InsuranceDetails?.length > 0 && (
                          <th colSpan={RadiologyRateCardData[0].InsuranceDetails.length}>
                            Insurance
                          </th>
                        )}
                        {RadiologyRateCardData[0]?.ClientDetails?.length > 0 && (
                          <th colSpan={RadiologyRateCardData[0].ClientDetails.length}>
                            Client
                          </th>
                        )}
                        {RadiologyRateCardData[0]?.DiscountDetails?.length > 0 && (
                          <th colSpan={RadiologyRateCardData[0].DiscountDetails.length + 1}>
                            Discount
                          </th>
                        )}
                      </tr>
                      <tr>
                        <th>Inhouse (%)</th>
                        <th>Referral (%)</th>
                        <th>Visiting (%)</th>
                        {RadiologyRateCardData[0]?.InsuranceDetails?.map((ins, index) => (
                          <th key={`ins-header-${index}`}>{ins.RatecardName}</th>
                        ))}
                        {RadiologyRateCardData[0]?.ClientDetails?.map((client, index) => (
                          <th key={`client-header-${index}`}>{client.RatecardName}</th>
                        ))}
                        <th>Method</th>
                        {RadiologyRateCardData[0]?.DiscountDetails?.map((dis, index) => (
                          <th key={`disc-header-${index}`}>{dis.Ratecardname}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        // Filter data based on search term
                        const filteredData = RadsearchTerm 
                          ? RadiologyRateCardData.filter(test => 
                              test.TestName?.toLowerCase().includes(RadsearchTerm.toLowerCase()) ||
                              test.CGHSCode?.toLowerCase().includes(RadsearchTerm.toLowerCase())
                            )
                          : RadiologyRateCardData;

                        // Group filtered data by Department
                        const groupedData = filteredData.reduce((acc, test) => {
                          const dept = test.Department || "Unknown";
                          if (!acc[dept]) acc[dept] = [];
                          acc[dept].push(test);
                          return acc;
                        }, {});

                        return Object.keys(groupedData).map((dept, deptIndex) => {
                          const tests = groupedData[dept];
                          return tests.map((test, testIndex) => {
                            const originalIndex = RadiologyRateCardData.findIndex(
                              (t) => t.id === test.id
                            );
                            
                            // Highlight search term in test name and CGHS code
                            const highlightText = (text, searchTerm) => {
                              if (!searchTerm || !text) return text;
                              const regex = new RegExp(`(${searchTerm})`, 'gi');
                              return text.toString().replace(regex, '<mark class="vpk_radiology-highlight">$1</mark>');
                            };

                            return (
                              <tr key={`test-${originalIndex}`}>
                                <td className="vpk_radiology-fixed vpk_radiology-serial-no">
                                  {`${deptIndex + 1}.${testIndex + 1}`}
                                </td>
                                {testIndex === 0 ? (
                                  <td className="vpk_radiology-fixed vpk_radiology-department" rowSpan={tests.length}>
                                    {dept}
                                  </td>
                                ) : null}
                                <td className="vpk_radiology-fixed vpk_radiology-test-name">
                                  <span 
                                    dangerouslySetInnerHTML={{ 
                                      __html: highlightText(test.TestName, RadsearchTerm)
                                    }} 
                                  />
                                </td>
                                <td className="vpk_radiology-fixed vpk_radiology-cghs-code">
                                  <input
                                    type="text"
                                    value={test.CGHSCode || ""}
                                    onChange={(e) =>
                                      handleRadiologyFieldChange(e, originalIndex, null, 0, "CGHSCode")
                                    }
                                    placeholder="Enter CGHS Code"
                                    className="vpk_radiology-cghs-code-input"
                                  />
                                </td>
                                <td className="vpk_radiology-basic-fee">
                                  <input
                                    type="number"
                                    value={test.BasicFee || ""}
                                    onChange={(e) =>
                                      handleRadiologyFieldChange(e, originalIndex, null, 0, "BasicFee")
                                    }
                                    className="vpk_radiology-number-input"
                                  />
                                </td>
                                {test.DoctorContribution.map((contrib, cIndex) => (
                                  <td key={`contrib-${cIndex}`}>
                                    <input
                                      type="number"
                                      value={contrib.Value || ""}
                                      onChange={(e) =>
                                        handleRadiologyFieldChange(
                                          e,
                                          originalIndex,
                                          "DoctorContribution",
                                          cIndex,
                                          "Value"
                                        )
                                      }
                                      className="vpk_radiology-number-input"
                                    />
                                  </td>
                                ))}
                                {test.InsuranceDetails.map((ins, iIndex) => (
                                  <td key={`ins-${iIndex}`}>
                                    <input
                                      type="number"
                                      value={ins.Fee || ""}
                                      onChange={(e) =>
                                        handleRadiologyFieldChange(
                                          e,
                                          originalIndex,
                                          "InsuranceDetails",
                                          iIndex,
                                          "Fee"
                                        )
                                      }
                                      className="vpk_radiology-number-input"
                                    />
                                  </td>
                                ))}
                                {test.ClientDetails.map((client, clIndex) => (
                                  <td key={`client-${clIndex}`}>
                                    <input
                                      type="number"
                                      value={client.Fee || ""}
                                      onChange={(e) =>
                                        handleRadiologyFieldChange(
                                          e,
                                          originalIndex,
                                          "ClientDetails",
                                          clIndex,
                                          "Fee"
                                        )
                                      }
                                      className="vpk_radiology-number-input"
                                    />
                                  </td>
                                ))}
                                <td className="vpk_radiology-discount-method">
                                  <select
                                    value={test.DiscountDetails[0]?.Method || ""}
                                    onChange={(e) =>
                                      handleRadiologyFieldChange(
                                        e,
                                        originalIndex,
                                        "DiscountDetails",
                                        0,
                                        "Method"
                                      )
                                    }
                                    className="vpk_radiology-select"
                                  >
                                    <option value="">Select</option>
                                    <option value="Value">Value</option>
                                    <option value="Percentage">Percentage</option>
                                  </select>
                                </td>
                                {test.DiscountDetails.map((disc, dIndex) => (
                                  <td key={`disc-${dIndex}`}>
                                    <input
                                      type="number"
                                      value={disc.Cur_Fee || ""}
                                      onChange={(e) =>
                                        handleRadiologyFieldChange(
                                          e,
                                          originalIndex,
                                          "DiscountDetails",
                                          dIndex,
                                          "Cur_Fee"
                                        )
                                      }
                                      className="vpk_radiology-number-input"
                                    />
                                  </td>
                                ))}
                              </tr>
                            );
                          });
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
                
                <div className="vpk_Register_btn_con">
                  <button
                    className="vpk_RegisterForm_1_btns"
                    onClick={handleRadiologySubmit}
                    disabled={Object.keys(RadiologyModifiedRows).length === 0}
                    style={{
                      opacity: Object.keys(RadiologyModifiedRows).length === 0 ? 0.5 : 1,
                      cursor: Object.keys(RadiologyModifiedRows).length === 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {Object.keys(RadiologyModifiedRows).length === 0 ? 'No Changes' : `Save ${Object.keys(RadiologyModifiedRows).length} Changes`}
                  </button>
                  
                  {/* Refresh button */}
                  <button
                    className="vpk_RegisterForm_1_btns"
                    onClick={() => fetchRadiologyData(RadsearchTerm)}
                    style={{ marginLeft: '10px', backgroundColor: '#17a2b8' }}
                  >
                    Refresh
                  </button>
                </div>
              </div>
            )}
          </>
        )}

      

       {ServiceProcedureForm === "Procedure" && (
        <>
          <div className="RegisFormcon_1" style={{ marginTop: "10px" }}>
            <div className="RegisForm_1">
              <label>Procedure Name<span>:</span></label>
              <input
                type="text"
                name="SearchbyProcedureName"
                value={searchOptions.SearchbyProcedureName}
                onChange={HandleOnchangeSearch}
              />
            </div>
            <div className="RegisForm_1">
              <label>Speciality<span>:</span></label>
              <input
                type="text"
                list="speciality"
                name="SearchbySpeciality"
                value={searchOptions.SearchbySpeciality}
                onChange={HandleOnchangeSearch}
              />
            </div>
            <datalist id="speciality">
              {
                Array.isArray(SpecialityData) &&
                SpecialityData.filter((p) => p.Status === "Active").map(
                  (Catg, indx) => (
                    <option key={indx} value={`${Catg.id}.${Catg.SpecialityName}`}>
                    </option>
                  ))
              }
            </datalist>
          </div>

          <div className="vpk_Procedure">
            <div className="vpk_Procedure-table-container">
              <table className="vpk_Procedure-table">
                <thead>
                  <tr>
                    <th className="vpk_Procedure-fixed vpk_Procedure-serial-no" rowSpan="2">S.No</th>
                    <th className="vpk_Procedure-fixed vpk_Procedure-speciality" rowSpan="2">Speciality</th>
                    <th className="vpk_Procedure-fixed vpk_Procedure-procedure-name" rowSpan="2">Procedure Name</th>
                    <th className="vpk_Procedure-fixed vpk_Procedure-cghs-code" rowSpan="2">CGHS Code</th>
                    <th colSpan="5" className="vpk_Procedure-th-center">Basic Fees</th>
                    {ProcedureRateCardData[0]?.WardDetails?.map((ward, wardIndex) => (
                      <th key={`ward-${wardIndex}`} colSpan="10" className="vpk_Procedure-th-center">
                        {ward.WardName}
                      </th>
                    ))}
                    <th colSpan="6" className="vpk_Procedure-th-center">Doctor Contribution</th>
                    {maxInsuranceCount > 0 && (
                      <th colSpan={maxInsuranceCount * 5}>Insurance</th>
                    )}
                    {maxClientCount > 0 && (
                      <th colSpan={maxClientCount * 5}>Client</th>
                    )}
                    {maxCorporateCount > 0 && (
                      <th colSpan={maxCorporateCount * 5}>Corporate</th>
                    )}
                    {maxDiscountCount > 0 && (
                      <th colSpan={maxDiscountCount * 6}>Discount</th>
                    )}
                  </tr>
                  <tr>
                    <th>Basic Fee</th>
                    <th>Surgeon Fee</th>
                    <th>OT Fee</th>
                    <th>Assistant Surgeon Fee</th>
                    <th>Anesthesiologist Fee</th>
                    {ProcedureRateCardData[0]?.WardDetails?.map((ward, wardIndex) => (
                      <React.Fragment key={`ward-sub-${wardIndex}`}>
                        <th>Fee</th>
                        <th>Surgeon Fee</th>
                        <th>OT Fee</th>
                        <th>Assistant Surgeon Fee</th>
                        <th>Anesthesiologist Fee</th>
                        <th>Special Fee</th>
                        <th>Special Surgeon Fee</th>
                        <th>Special OT Fee</th>
                        <th>Special Assistant Surgeon Fee</th>
                        <th>Special Anesthesiologist Fee</th>
                      </React.Fragment>
                    ))}
                    <th>Method</th>
                    <th>Inhouse (%)</th>
                    <th>Method</th>
                    <th>Referral (%)</th>
                    <th>Method</th>
                    <th>Visiting (%)</th>
                    {insuranceHeaders.map((insurance, index) => (
                      <React.Fragment key={`insurance-header-${index}`}>
                        <th>{insurance.RatecardName} - Fee</th>
                        <th>{insurance.RatecardName} - Surgeon</th>
                        <th>{insurance.RatecardName} - OT</th>
                        <th>{insurance.RatecardName} - Asst. Surgeon</th>
                        <th>{insurance.RatecardName} - Anesthesiologist</th>
                      </React.Fragment>
                    ))}
                    {clientHeaders.map((client, index) => (
                      <React.Fragment key={`client-header-${index}`}>
                        <th>{client.RatecardName} - Fee</th>
                        <th>{client.RatecardName} - Surgeon</th>
                        <th>{client.RatecardName} - OT</th>
                        <th>{client.RatecardName} - Asst. Surgeon</th>
                        <th>{client.RatecardName} - Anesthesiologist</th>
                      </React.Fragment>
                    ))}
                    {corporateHeaders.map((corp, index) => (
                      <React.Fragment key={`corp-header-${index}`}>
                        <th>{corp.RatecardName} - Fee</th>
                        <th>{corp.RatecardName} - Surgeon</th>
                        <th>{corp.RatecardName} - OT</th>
                        <th>{corp.RatecardName} - Asst. Surgeon</th>
                        <th>{corp.RatecardName} - Anesthesiologist</th>
                      </React.Fragment>
                    ))}
                    {discountHeaders.map((disc, index) => (
                      <React.Fragment key={`disc-header-${index}`}>
                        <th>{disc.RatecardName} - Method</th>
                        <th>{disc.RatecardName} - Fee</th>
                        <th>{disc.RatecardName} - Surgeon</th>
                        <th>{disc.RatecardName} - OT</th>
                        <th>{disc.RatecardName} - Asst. Surgeon</th>
                        <th>{disc.RatecardName} - Anesthesiologist</th>
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ProcedureRateCardData.map((procedure, procedureIndex) => (
                    <tr key={procedureIndex}>
                      <td className="vpk_Procedure-fixed vpk_Procedure-serial-no">{procedureIndex + 1}</td>
                      <td className="vpk_Procedure-fixed vpk_Procedure-speciality">{procedure.Speciality}</td>
                      <td className="vpk_Procedure-fixed vpk_Procedure-procedure-name">{procedure.ProcedureName}</td>
                      <td className="vpk_Procedure-fixed vpk_Procedure-cghs-code">
                        <input
                          type="text"
                          value={procedure.CGHSCode || ""}
                          onChange={(e) =>
                            handleProcedureFieldChange(e, procedureIndex, null, 0, "CGHSCode")
                          }
                          placeholder="Enter CGHS Code"
                          className="vpk_Procedure-cghs-code-input"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={procedure.BasicFee || ""}
                          onChange={(e) =>
                            handleProcedureFieldChange(e, procedureIndex, null, 0, "BasicFee")
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={procedure.SurgeonFee || ""}
                          onChange={(e) =>
                            handleProcedureFieldChange(e, procedureIndex, null, 0, "SurgeonFee")
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={procedure.OTFee || ""}
                          onChange={(e) =>
                            handleProcedureFieldChange(e, procedureIndex, null, 0, "OTFee")
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={procedure.AssistantSurgeonFee || ""}
                          onChange={(e) =>
                            handleProcedureFieldChange(e, procedureIndex, null, 0, "AssistantSurgeonFee")
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={procedure.AnesthesianFee || ""}
                          onChange={(e) =>
                            handleProcedureFieldChange(e, procedureIndex, null, 0, "AnesthesianFee")
                          }
                        />
                      </td>
                      {ProcedureRateCardData[0]?.WardDetails?.map((templateWard, wardIndex) => {
                        const currentWard = procedure.WardDetails?.find((w) => w.WardName === templateWard.WardName) || {};
                        return (
                          <React.Fragment key={`procedure-ward-${wardIndex}`}>
                            <td>
                              <input
                                type="number"
                                value={currentWard.Fee || ""}
                                onChange={(e) =>
                                  handleProcedureFieldChange(
                                    e,
                                    procedureIndex,
                                    "WardDetails",
                                    procedure.WardDetails?.findIndex((w) => w.WardName === templateWard.WardName) || wardIndex,
                                    "Fee"
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={currentWard.SurgeonFee || ""}
                                onChange={(e) =>
                                  handleProcedureFieldChange(
                                    e,
                                    procedureIndex,
                                    "WardDetails",
                                    procedure.WardDetails?.findIndex((w) => w.WardName === templateWard.WardName) || wardIndex,
                                    "SurgeonFee"
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={currentWard.OTFee || ""}
                                onChange={(e) =>
                                  handleProcedureFieldChange(
                                    e,
                                    procedureIndex,
                                    "WardDetails",
                                    procedure.WardDetails?.findIndex((w) => w.WardName === templateWard.WardName) || wardIndex,
                                    "OTFee"
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={currentWard.AssistantSurgeonFee || ""}
                                onChange={(e) =>
                                  handleProcedureFieldChange(
                                    e,
                                    procedureIndex,
                                    "WardDetails",
                                    procedure.WardDetails?.findIndex((w) => w.WardName === templateWard.WardName) || wardIndex,
                                    "AssistantSurgeonFee"
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={currentWard.AnesthesianFee || ""}
                                onChange={(e) =>
                                  handleProcedureFieldChange(
                                    e,
                                    procedureIndex,
                                    "WardDetails",
                                    procedure.WardDetails?.findIndex((w) => w.WardName === templateWard.WardName) || wardIndex,
                                    "AnesthesianFee"
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={currentWard.SpecialFee || ""}
                                onChange={(e) =>
                                  handleProcedureFieldChange(
                                    e,
                                    procedureIndex,
                                    "WardDetails",
                                    procedure.WardDetails?.findIndex((w) => w.WardName === templateWard.WardName) || wardIndex,
                                    "SpecialFee"
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={currentWard.SpecialSurgeonFee || ""}
                                onChange={(e) =>
                                  handleProcedureFieldChange(
                                    e,
                                    procedureIndex,
                                    "WardDetails",
                                    procedure.WardDetails?.findIndex((w) => w.WardName === templateWard.WardName) || wardIndex,
                                    "SpecialSurgeonFee"
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={currentWard.SpecialOTFee || ""}
                                onChange={(e) =>
                                  handleProcedureFieldChange(
                                    e,
                                    procedureIndex,
                                    "WardDetails",
                                    procedure.WardDetails?.findIndex((w) => w.WardName === templateWard.WardName) || wardIndex,
                                    "SpecialOTFee"
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={currentWard.SpecialAssistantSurgeonFee || ""}
                                onChange={(e) =>
                                  handleProcedureFieldChange(
                                    e,
                                    procedureIndex,
                                    "WardDetails",
                                    procedure.WardDetails?.findIndex((w) => w.WardName === templateWard.WardName) || wardIndex,
                                    "SpecialAssistantSurgeonFee"
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={currentWard.SpecialAnesthesianFee || ""}
                                onChange={(e) =>
                                  handleProcedureFieldChange(
                                    e,
                                    procedureIndex,
                                    "WardDetails",
                                    procedure.WardDetails?.findIndex((w) => w.WardName === templateWard.WardName) || wardIndex,
                                    "SpecialAnesthesianFee"
                                  )
                                }
                              />
                            </td>
                          </React.Fragment>
                        );
                      })}
                      {procedure.DoctorContribution?.map((contrib, cIndex) => (
                        <React.Fragment key={`contrib-${cIndex}`}>
                          <td>
                            <select
                              value={contrib.Method || ""}
                              onChange={(e) =>
                                handleProcedureFieldChange(
                                  e,
                                  procedureIndex,
                                  "DoctorContribution",
                                  cIndex,
                                  "Method"
                                )
                              }
                            >
                              <option value="">Select</option>
                              <option value="Value">Value</option>
                              <option value="Percentage">Percentage</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="number"
                              value={contrib.Value || ""}
                              onChange={(e) =>
                                handleProcedureFieldChange(
                                  e,
                                  procedureIndex,
                                  "DoctorContribution",
                                  cIndex,
                                  "Value"
                                )
                              }
                            />
                          </td>
                        </React.Fragment>
                      ))}
                      {insuranceHeaders.map((_, index) => {
                        const insurance = procedure.InsuranceDetails?.[index] || {};
                        return (
                          <React.Fragment key={`insurance-${index}`}>
                            <td>
                              <input
                                type="number"
                                value={insurance.Fee || ""}
                                onChange={(e) =>
                                  handleProcedureFieldChange(
                                    e,
                                    procedureIndex,
                                    "InsuranceDetails",
                                    index,
                                    "Fee"
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={insurance.SurgeonFee || ""}
                                onChange={(e) =>
                                  handleProcedureFieldChange(
                                    e,
                                    procedureIndex,
                                    "InsuranceDetails",
                                    index,
                                    "SurgeonFee"
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={insurance.OTFee || ""}
                                onChange={(e) =>
                                  handleProcedureFieldChange(
                                    e,
                                    procedureIndex,
                                    "InsuranceDetails",
                                    index,
                                    "OTFee"
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={insurance.AssistantSurgeonFee || ""}
                                onChange={(e) =>
                                  handleProcedureFieldChange(
                                    e,
                                    procedureIndex,
                                    "InsuranceDetails",
                                    index,
                                    "AssistantSurgeonFee"
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={insurance.AnesthesianFee || ""}
                                onChange={(e) =>
                                  handleProcedureFieldChange(
                                    e,
                                    procedureIndex,
                                    "InsuranceDetails",
                                    index,
                                    "AnesthesianFee"
                                  )
                                }
                              />
                            </td>
                          </React.Fragment>
                        );
                      })}
                      {clientHeaders.map((_, index) => {
                        const client = procedure.ClientDetails?.[index] || {};
                        return (
                          <React.Fragment key={`client-${index}`}>
                            <td>
                              <input
                                type="number"
                                value={client.Fee || ""}
                                onChange={(e) =>
                                  handleProcedureFieldChange(
                                    e,
                                    procedureIndex,
                                    "ClientDetails",
                                    index,
                                    "Fee"
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={client.SurgeonFee || ""}
                                onChange={(e) =>
                                  handleProcedureFieldChange(
                                    e,
                                    procedureIndex,
                                    "ClientDetails",
                                    index,
                                    "SurgeonFee"
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={client.OTFee || ""}
                                onChange={(e) =>
                                  handleProcedureFieldChange(
                                    e,
                                    procedureIndex,
                                    "ClientDetails",
                                    index,
                                    "OTFee"
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={client.AssistantSurgeonFee || ""}
                                onChange={(e) =>
                                  handleProcedureFieldChange(
                                    e,
                                    procedureIndex,
                                    "ClientDetails",
                                    index,
                                    "AssistantSurgeonFee"
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={client.AnesthesianFee || ""}
                                onChange={(e) =>
                                  handleProcedureFieldChange(
                                    e,
                                    procedureIndex,
                                    "ClientDetails",
                                    index,
                                    "AnesthesianFee"
                                  )
                                }
                              />
                            </td>
                          </React.Fragment>
                        );
                      })}
                      {corporateHeaders.map((_, index) => {
                        const corp = procedure.CorporateDetails?.[index] || {};
                        return (
                          <React.Fragment key={`corp-${index}`}>
                            <td>
                              <input
                                type="number"
                                value={corp.Fee || ""}
                                onChange={(e) =>
                                  handleProcedureFieldChange(
                                    e,
                                    procedureIndex,
                                    "CorporateDetails",
                                    index,
                                    "Fee"
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={corp.SurgeonFee || ""}
                                onChange={(e) =>
                                  handleProcedureFieldChange(
                                    e,
                                    procedureIndex,
                                    "CorporateDetails",
                                    index,
                                    "SurgeonFee"
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={corp.OTFee || ""}
                                onChange={(e) =>
                                  handleProcedureFieldChange(
                                    e,
                                    procedureIndex,
                                    "CorporateDetails",
                                    index,
                                    "OTFee"
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={corp.AssistantSurgeonFee || ""}
                                onChange={(e) =>
                                  handleProcedureFieldChange(
                                    e,
                                    procedureIndex,
                                    "CorporateDetails",
                                    index,
                                    "AssistantSurgeonFee"
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={corp.AnesthesianFee || ""}
                                onChange={(e) =>
                                  handleProcedureFieldChange(
                                    e,
                                    procedureIndex,
                                    "CorporateDetails",
                                    index,
                                    "AnesthesianFee"
                                  )
                                }
                              />
                            </td>
                          </React.Fragment>
                        );
                      })}
                      {discountHeaders.map((_, index) => {
                        const disc = procedure.DiscountDetails?.[index] || {};
                        return (
                          <React.Fragment key={`disc-${index}`}>
                            <td>
                              <select
                                value={disc.Method || ""}
                                onChange={(e) =>
                                  handleProcedureFieldChange(
                                    e,
                                    procedureIndex,
                                    "DiscountDetails",
                                    index,
                                    "Method"
                                  )
                                }
                              >
                                <option value="">Select</option>
                                <option value="Value">Value</option>
                                <option value="Percentage">Percentage</option>
                              </select>
                            </td>
                            <td>
                              <input
                                type="number"
                                value={disc.Fee || ""}
                                onChange={(e) =>
                                  handleProcedureFieldChange(
                                    e,
                                    procedureIndex,
                                    "DiscountDetails",
                                    index,
                                    "Fee"
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={disc.SurgeonFee || ""}
                                onChange={(e) =>
                                  handleProcedureFieldChange(
                                    e,
                                    procedureIndex,
                                    "DiscountDetails",
                                    index,
                                    "SurgeonFee"
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={disc.OTFee || ""}
                                onChange={(e) =>
                                  handleProcedureFieldChange(
                                    e,
                                    procedureIndex,
                                    "DiscountDetails",
                                    index,
                                    "OTFee"
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={disc.AssistantSurgeonFee || ""}
                                onChange={(e) =>
                                  handleProcedureFieldChange(
                                    e,
                                    procedureIndex,
                                    "DiscountDetails",
                                    index,
                                    "AssistantSurgeonFee"
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={disc.AnesthesianFee || ""}
                                onChange={(e) =>
                                  handleProcedureFieldChange(
                                    e,
                                    procedureIndex,
                                    "DiscountDetails",
                                    index,
                                    "AnesthesianFee"
                                  )
                                }
                              />
                            </td>
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="vpk_Register_btn_con">
              <button className="vpk_RegisterForm_1_btns" onClick={handleProcedureSubmit}>
                Save
              </button>
            </div>
          </div>
        </>
      )}


      <ModelContainer />
      <ToastAlert Message={toast.message} Type={toast.type} />
    </div>
  );
}
export default RatecardMaster;
