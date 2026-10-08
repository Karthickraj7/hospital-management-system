import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import { useNavigate } from "react-router-dom";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";

const ServiceProcedureMaster = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const toast = useSelector((state) => state.userRecord?.toast);
  const ServiceProcedureMasteredit = useSelector(
    (state) => state.userRecord?.ServiceProcedureMaster
  );
  const [ServiceProcedureForm, setServiceProcedureForm] = useState("Service");

  const dispatchvalue = useDispatch();
  const navigate = useNavigate();

  const [Specialitydata, setSpecialitydata] = useState([]);

  const [SelectedFile, setSelectedFile] = useState(null);
  const [getdata, setgetdata] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(null);
    setSelectedFile(event.target.files[0]);
  };

  const handleCsvupload = () => {
    console.log(SelectedFile);
    const formData = new FormData();
    formData.append("file", SelectedFile);
    formData.append("created_by", UserData?.username);

    if (SelectedFile) {
      axios
        .post(`${UrlLink}Masters/upload_procedure_excel`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          console.log(response, "ressssssss");
          setSelectedFile(null);

          let data = response.data;

          let type = Object.keys(data)[0];
          let mess = Object.values(data)[0];
          const tdata = {
            message: mess,
            type: type,
          };
          dispatchvalue({ type: "toast", value: tdata });
          setgetdata((prev) => !prev);
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });
    } else {
      // userwarn("Choose File");
    }
  };

  const [SelectedFileService, setSelectedFileService] = useState(null);
  const [getdataService, setgetdataService] = useState(false);

  const handleFileChangeService = (event) => {
    setSelectedFileService(null);
    setSelectedFileService(event.target.files[0]);
  };

  const handleCsvuploadService = () => {
    console.log(SelectedFileService, "lklklklklkl");
    const formData = new FormData();
    formData.append("file", SelectedFileService);
    formData.append("created_by", UserData?.username);

    if (SelectedFileService) {
      axios
        .post(`${UrlLink}Masters/upload_service_master_excel`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          console.log(response);
          setSelectedFileService(null);

          let data = response.data;

          let type = Object.keys(data)[0];
          let mess = Object.values(data)[0];
          const tdata = {
            message: mess,
            type: type,
          };
          dispatchvalue({ type: "toast", value: tdata });
          setgetdataService((prev) => !prev);
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });
    } else {
      // userwarn("Choose File");
    }
  };

  const [ServiceMasterData, setServiceMasterData] = useState({
    ServiceCategory: "",
    Department: "",
    ServiceCode: "",
    ServiceName: "",
    ServiceType: "",
    Amount: "",
    IsGst: "No",
    GSTValue: "Nill",
    ISWardConsession: "Yes",
    ISWardPercentage: "",
  });
  const [ProcedureMasterData, setProcedureMasterData] = useState({
    ProcedureCode: "",
    ProcedureName: "",
    Type: "",
    SurgeonFee: 0,
    AssistantSurgeonFee: 0,
    OTFee: 0,
    AnesthesianFee: 0,
    Speciality: "",
    IsSeparateFee: "false",
    TotalAmount: 0,
    RoomSurgeonFee: 0,
    RoomOTFee: 0,
    RoomAssistantSurgeonFee: 0,
    RoomAnesthesianFee: 0,
    TotalRoomAmount: 0,
    WardSurgeonFee: 0,
    WardOTFee: 0,
    WardAssistantSurgeonFee: 0,
    WardAnesthesianFee: 0,
    TotalWardAmount: 0,
  });
  const [ServiceCategory, setServiceCategory] = useState([]);
  const cleardatass = useCallback(() => {
    setServiceMasterData({
      ServiceCategory: "",
      Department: "",
      ServiceCode: "",
      ServiceName: "",
      ServiceType: "",
      Amount: "",
      IsGst: "No",
      GSTValue: "Nill",
      ISWardConsession: "Yes",
      ISWardPercentage: "",
    });
    setProcedureMasterData({
      ProcedureCode: "",
      ProcedureName: "",
      Type: "",
      Speciality: "",
      IsSeparateFee: "false",
      SurgeonFee: 0,
      AssistantSurgeonFee: 0,
      OTFee: 0,
      AnesthesianFee: 0,
      TotalAmount: 0,
      RoomSurgeonFee: 0,
      RoomOTFee: 0,
      RoomAssistantSurgeonFee: 0,
      RoomAnesthesianFee: 0,
      TotalRoomAmount: 0,
      WardSurgeonFee: 0,
      WardOTFee: 0,
      WardAssistantSurgeonFee: 0,
      WardAnesthesianFee: 0,
      TotalWardAmount: 0,
    });
  }, []);

  const handleselectChange = (e) => {
    const { value } = e.target;
    setServiceProcedureForm(value);
    cleardatass();
  };

  useEffect(() => {
    if (ProcedureMasterData && ProcedureMasterData.IsSeparateFee !== "true") {
      const total = (
        (parseFloat(ProcedureMasterData.SurgeonFee) || 0) +
        (parseFloat(ProcedureMasterData.OTFee) || 0) +
        (parseFloat(ProcedureMasterData.AnesthesianFee) || 0)
      ).toFixed(2);
      setProcedureMasterData((prev) => ({
        ...prev,
        TotalAmount: total,
      }));
    } else {
      setProcedureMasterData((prev) => ({
        ...prev,
        TotalAmount: "",
        SurgeonFee: 0,
        OTFee: 0,
        AnesthesianFee: 0,
      }));
    }
  }, [
    ProcedureMasterData.SurgeonFee,
    ProcedureMasterData.OTFee,
    ProcedureMasterData.AnesthesianFee,
    ProcedureMasterData.IsSeparateFee,
  ]);

  useEffect(() => {
    if (ProcedureMasterData.IsSeparateFee === "true") {
      const totalRoom = (
        (parseFloat(ProcedureMasterData.RoomSurgeonFee) || 0) +
        (parseFloat(ProcedureMasterData.RoomOTFee) || 0) +
        (parseFloat(ProcedureMasterData.RoomAssistantSurgeonFee) || 0)
      ).toFixed(2);
      const totalWard = (
        (parseFloat(ProcedureMasterData.WardSurgeonFee) || 0) +
        (parseFloat(ProcedureMasterData.WardOTFee) || 0) +
        (parseFloat(ProcedureMasterData.WardAssistantSurgeonFee) || 0)
      ).toFixed(2);
      setProcedureMasterData((prev) => ({
        ...prev,
        TotalRoomAmount: totalRoom,
        TotalWardAmount: totalWard,
      }));
    } else {
      setProcedureMasterData((prev) => ({
        ...prev,
        TotalRoomAmount: 0,
        TotalWardAmount: 0,
        RoomSurgeonFee: 0,
        RoomOTFee: 0,
        RoomAssistantSurgeonFee: 0,
        WardSurgeonFee: 0,
        WardOTFee: 0,
        WardAssistantSurgeonFee: 0,
      }));
    }
  }, [
    ProcedureMasterData.IsSeparateFee,
    ProcedureMasterData.RoomSurgeonFee,
    ProcedureMasterData.RoomOTFee,
    ProcedureMasterData.RoomAssistantSurgeonFee,
    ProcedureMasterData.WardSurgeonFee,
    ProcedureMasterData.WardOTFee,
    ProcedureMasterData.WardAssistantSurgeonFee,
  ]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Speciality_Detials_link`)
      .then((res) => setSpecialitydata(res.data))
      .catch((err) => console.log(err));
  }, [UrlLink]);

  useEffect(() => {
    if (Object.keys(ServiceProcedureMasteredit).length > 0) {
      const { MasterType, ...data } = ServiceProcedureMasteredit;
      setServiceProcedureForm(MasterType);
      if (MasterType === "Service") {
        setServiceMasterData({
          ServiceCategory: data.ServiceCatId,
          Department: data.Department,
          ServiceCode: data.id,
          ServiceName: data.ServiceName,
          ServiceType: data.ServiceType,
          Amount: data.Amount,
          IsGst: data.IsGst,
          GSTValue: data.GSTValue,
          ISWardConsession: data.ISWardConsession,
          ISWardPercentage: data.ISWardPercentage,
        });
      } else {
        setProcedureMasterData({
          Type: data.Type || "",
          ProcedureCode: data.id || "",
          ProcedureName: data.ProcedureName || "",
          SurgeonFee: data.SurgeonFee || "",
          OTFee: data.OTFee || "",
          AssistantSurgeonFee: data.AssistantSurgeonFee || "",
          AnesthesianFee: data.AnesthesianFee || 0,
          Speciality: data.SpecialityId || "",
          IsSeparateFee: data.IsSeparateFee || "false",
          TotalAmount: data.TotalAmount || 0,
          RoomSurgeonFee: data.RoomSurgeonFee || 0,
          RoomOTFee: data.RoomOTFee || 0,
          RoomAssistantSurgeonFee: data.RoomAssistantSurgeonFee || 0,
          RoomAnesthesianFee: data.RoomAnesthesianFee || 0,
          TotalRoomAmount: data.TotalRoomAmount || 0,
          WardSurgeonFee: data.WardSurgeonFee || 0,
          WardOTFee: data.WardOTFee || 0,
          WardAssistantSurgeonFee: data.WardAssistantSurgeonFee || 0,
          WardAnesthesianFee: data.WardAnesthesianFee || 0,
          TotalWardAmount: data.TotalWardAmount || 0,
        });
      }
    } else {
    }
  }, [ServiceProcedureMasteredit]);
  const formatLabel = (label) => {
    if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
      return label
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (str) => str.toUpperCase());
    } else {
      return label;
    }
  };
  const handleOnchange = (e) => {
    const { name, value, type } = e.target;
    if (ServiceProcedureForm === "Service") {
      setServiceMasterData((prev) => ({
        ...prev,
        [name]: value.trim(),
      }));
    } else {
      if (type === "number") {
        setProcedureMasterData((prev) => ({
          ...prev,
          [name]: parseFloat(value),
        }));
      } else {
        if (name === "ProcedureName") {
          setProcedureMasterData((prev) => ({
            ...prev,
            [name]: value.trim().toUpperCase(),
          }));
        } else {
          setProcedureMasterData((prev) => ({
            ...prev,
            [name]: value.trim(),
          }));
        }
      }
    }
  };
  console.log("ServiceMasterData", ServiceMasterData);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Insert_service_category_master`)
      .then((res) => {
        const ress = res.data;
        console.log(ress, "ddhdhdhdhdhdhdhdhdhdhdhdhdhdh");

        setServiceCategory(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  // console.log('ProcedureMasterData',ProcedureMasterData);
  // const handlesubmit = () => {
  //     const requiredfields = [...Object.keys(ServiceProcedureForm === 'Service' ? ServiceMasterData : ProcedureMasterData).filter(f => !['ServiceCode', 'ProcedureCode'].includes(f))]
  //     console.log('requiredfields', requiredfields);
  //     const emptyFields = requiredfields.filter((field) => ServiceProcedureForm === 'Service' ? !ServiceMasterData[field] : !ProcedureMasterData[field]);
  //     if (emptyFields.length > 0) {
  //         console.log('emptyFields', emptyFields);
  //         const tdata = {
  //             message: `Please fill empty fields: ${emptyFields.join(", ")}`,
  //             type: 'warn',
  //         }

  //         dispatchvalue({ type: 'toast', value: tdata });

  //     } else {

  //         let submitdata = {};
  //         if (ServiceProcedureForm === 'Service') {
  //             submitdata = {
  //                 ...ServiceMasterData,
  //                 Created_by: UserData?.username,
  //                 MasterType: ServiceProcedureForm,
  //             };
  //         } else {
  //             submitdata = {
  //                 ...ProcedureMasterData,
  //                 Created_by: UserData?.username,
  //                 MasterType: ServiceProcedureForm,
  //             };
  //         }
  //         console.log('senddata', submitdata);

  //         axios.post(`${UrlLink}Masters/Service_Procedure_Master_Detials_link`, submitdata)
  //             .then(res => {
  //                 dispatchvalue({ type: 'ServiceProcedureMaster', value: {} })
  //                 console.log(res.data);
  //                 const resres = res.data
  //                 let typp = Object.keys(resres)[0]
  //                 let mess = Object.values(resres)[0]
  //                 const tdata = {
  //                     message: mess,
  //                     type: typp,
  //                 }

  //                 dispatchvalue({ type: 'toast', value: tdata });
  //                 cleardatass()
  //                 navigate("/Home/MasterFolder");
  //                 dispatchvalue({ type: 'HrFolder', value: 'ServiceProcedureMasterList' });
  //                 dispatchvalue({ type: "setPreviousFolder", value: null });
  //                 dispatchvalue({ type: "showMenu", value: true });
  //             })
  //             .catch(err => {
  //                 console.log(err);
  //             })
  //     }
  // }

  const handlesubmit = () => {
    const requiredfields = Object.keys(
      ServiceProcedureForm === "Service"
        ? ServiceMasterData
        : ProcedureMasterData
    )
      .filter(
        (f) =>
          ![
            "ServiceCode",
            "ProcedureCode",
            "TotalAmount",
            "TotalRoomAmount",
            "TotalWardAmount",
          ].includes(f)
      )
      .filter((f) => {
        const separateFeeFields = [
          "RoomSurgeonFee",
          "RoomOTFee",
          "RoomAssistantSurgeonFee",
          "RoomAnesthesianFee",
          "TotalRoomAmount",
          "WardSurgeonFee",
          "WardOTFee",
          "WardAssistantSurgeonFee",
          "WardAnesthesianFee",
          "TotalWardAmount",
        ];
        const mainFeeFields = [
          "SurgeonFee",
          "OTFee",
          "AssistantSurgeonFee",
          "AnesthesianFee",
          "TotalAmount",
        ];

        if (ServiceProcedureForm === "Service") {
          return true; // For Service, all fields except excluded ones are required
        }
        if (ProcedureMasterData.IsSeparateFee === "true") {
          // When IsSeparateFee is true, only separate fee fields are required
          return separateFeeFields.includes(f);
        }
        // When IsSeparateFee is false, only main fee fields are required
        return mainFeeFields.includes(f);
      });

    const emptyFields = requiredfields.filter((field) => {
      const value =
        ServiceProcedureForm === "Service"
          ? ServiceMasterData[field]
          : ProcedureMasterData[field];
      // Consider a field empty only if it's undefined, null, or an empty string; allow 0 as a valid value
      return value === undefined || value === null || value === "";
    });

    if (emptyFields.length > 0) {
      const tdata = {
        message: `Please fill empty fields: ${emptyFields.join(", ")}`,
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    } else {
      let submitdata = {};
      if (ServiceProcedureForm === "Service") {
        submitdata = {
          ...ServiceMasterData,
          Created_by: UserData?.username,
          MasterType: ServiceProcedureForm,
        };
      } else {
        submitdata = {
          ...ProcedureMasterData,
          Created_by: UserData?.username,
          MasterType: ServiceProcedureForm,
          TotalAmount: parseFloat(ProcedureMasterData?.TotalAmount) || 0,
          TotalWardAmount:
            parseFloat(ProcedureMasterData?.TotalWardAmount) || 0,
          TotalRoomAmount:
            parseFloat(ProcedureMasterData?.TotalRoomAmount) || 0,
        };
      }

      console.log(submitdata, "submitdata123");
      axios
        .post(
          `${UrlLink}Masters/Service_Procedure_Master_Detials_link`,
          submitdata
        )
        .then((res) => {
          dispatchvalue({ type: "ServiceProcedureMaster", value: {} });
          const resres = res.data;
          let typp = Object.keys(resres)[0];
          let mess = Object.values(resres)[0];
          const tdata = {
            message: mess,
            type: typp,
          };
          dispatchvalue({ type: "toast", value: tdata });
          cleardatass();
          navigate("/Home/ServiceProcedureMasterList");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      <div className="Main_container_app">
        <h3>Service / Procedure Master</h3>
        <br />
        <div className="RegisterTypecon">
          <div className="RegisterType">
            {["Service", "Procedure"]
              .filter((p) =>
                Object.keys(ServiceProcedureMasteredit).length > 0
                  ? p === ServiceProcedureMasteredit.MasterType
                  : p
              )
              .map((p, ind) => (
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
        <div className="RegisFormcon_1">
          {/* {Object.keys(ServiceProcedureForm === 'Service' ? ServiceMasterData : ProcedureMasterData).filter(f => !Object.keys(ServiceProcedureMasteredit).length > 0 ? !['ServiceCode', 'ProcedureCode'].includes(f) : f).map((field, indx) => (
                        <div className="RegisForm_1" key={indx}>
                            <label htmlFor={`${field}_${indx}_${field}`}> {field === 'GSTValue' ? 'GST Value' : formatLabel(field)} <span>:</span> </label>
                            {

                                ["ServiceCategory", "Department",'ServiceType','Speciality'].filter(f => (ServiceProcedureForm === 'Service' ? ServiceMasterData.IsGst !== 'Yes' : ProcedureMasterData.IsGst !== 'Yes') ? f !== 'GSTValue' : f).includes(field) ?
                                    <select
                                        name={field}
                                        // disabled={field !== 'GSTValue' && Object.keys(ServiceProcedureMasteredit).length > 0}
                                        disabled={field !== "Speciality" && Object.keys(ServiceProcedureMasteredit).length > 0 }
                                        value={ServiceProcedureForm === 'Service' ? ServiceMasterData[field] : ProcedureMasterData[field]}
                                        onChange={handleOnchange}
                                    >
                                        <option value="">Select</option>
                       
                                        {field === 'Department' &&

                                            ["OP", "IP", "Both OP and IP"].map((val, ind) => (
                                                <option key={ind} value={val}>{val}</option>
                                            ))
                                        }
                                        {field === 'ServiceCategory' &&

                                            ServiceCategory.map((val, ind) => (
                                                <option key={ind} value={val.Serviceid}>{val.ServiceCategory}</option>
                                            ))
                                        }
                                        {field === 'ServiceType' &&

                                            ["Quantity", "Hourly"].map((val, ind) => (
                                                <option key={ind} value={val}>{val}</option>
                                            ))
                                        }
                                        {field === 'Speciality' &&
                                            (Array.isArray(Specialitydata) && Specialitydata.map((val, ind) => (
                                            <option key={ind} value={val.Speciality_Id}>{val.SpecialityName}</option>
                                            )))
                                        }
                           

                                    </select>
                                    :
                                    field === 'IsSeparateFee' ?
                      <input
                        type="checkbox"
                        name={field}
                        checked={ProcedureMasterData[field] === "true"}
                        onChange={(e) => {
                          setProcedureMasterData((prev) => ({
                            ...prev,
                            IsSeparateFee: e.target.checked ? "true" : "false"
                          }));
                        }}
                        style={{ width: '20px' }}
                      />:
                                    field === 'IsGst' ?
                                        (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '150px' }}>
                                                <label style={{ width: '60px', cursor: 'pointer' }} >
                                                    <input
                                                        id={`${field}_${indx}_${field}_Yes`}
                                                        type="radio"
                                                        name={field}
                                                        value="Yes"
                                                        style={{ width: '15px' }}
                                                        checked={ServiceProcedureForm === 'Service' ? ServiceMasterData[field] === 'Yes' : ProcedureMasterData[field] === 'Yes'}
                                                        onChange={(e) => {
                                                            if (ServiceProcedureForm === 'Service') {

                                                                setServiceMasterData((prev) => ({
                                                                    ...prev,
                                                                    IsGst: 'Yes',
                                                                    GSTValue: ''
                                                                }))


                                                            } else {
                                                                setProcedureMasterData((prev) => ({
                                                                    ...prev,
                                                                    IsGst: 'Yes',
                                                                    GSTValue: ''
                                                                }))
                                                            }
                                                        }}
                                                    />
                                                    Yes
                                                </label>
                                                <label style={{ width: '60px', cursor: 'pointer' }} >
                                                    <input
                                                        id={`${field}_${indx}_${field}_No`}
                                                        type="radio"
                                                        name={field}
                                                        value="No"
                                                        style={{ width: '15px' }}
                                                        checked={ServiceProcedureForm === 'Service' ? ServiceMasterData[field] === 'No' : ProcedureMasterData[field] === 'No'}
                                                        onChange={(e) => {
                                                            if (ServiceProcedureForm === 'Service') {

                                                                setServiceMasterData((prev) => ({
                                                                    ...prev,
                                                                    IsGst: 'No',
                                                                    GSTValue: 'Nill'
                                                                }))


                                                            } else {
                                                                setProcedureMasterData((prev) => ({
                                                                    ...prev,
                                                                    IsGst: 'No',
                                                                    GSTValue: 'Nill'

                                                                }))
                                                            }
                                                        }}
                                                    />
                                                    No
                                                </label>
                                            </div>
                                        ) :
                                         <input
                          disabled={
                            field === 'Amount' && ServiceProcedureForm === 'Procedure' ||
                            ['TotalAmount', 'TotalRoomAmount', 'TotalWardAmount'].includes(field)
                          }
                          type={[
                            'Amount',
                            'SurgeonFee',
                            'OTFee',
                            'AssistantSurgeonFee',
                            'AnesthesianFee',
                            'RoomSurgeonFee',
                            'RoomOTFee',
                            'RoomAssistantSurgeonFee',
                            'RoomAnesthesianFee',
                            'WardSurgeonFee',
                            'WardOTFee',
                            'WardAssistantSurgeonFee',
                            'WardAnesthesianFee',
                          ].includes(field) ? 'number' : 'text'}
                          onKeyDown={(e) => [
                            'Amount',
                            'SurgeonFee',
                            'OTFee',
                            'AssistantSurgeonFee',
                            'AnesthesianFee',
                            'RoomSurgeonFee',
                            'RoomOTFee',
                            'RoomAssistantSurgeonFee',
                            'RoomAnesthesianFee',
                            'WardSurgeonFee',
                            'WardOTFee',
                            'WardAssistantSurgeonFee',
                            'WardAnesthesianFee',
                          ].includes(field) && ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                          value={ServiceProcedureForm === 'Service' ? ServiceMasterData[field] : ProcedureMasterData[field]}
                          onChange={handleOnchange}
                          name={field}
                          autoComplete="off"
                        />
                            }
                        </div>

                    ))} */}

          {Object.keys(
            ServiceProcedureForm === "Service"
              ? ServiceMasterData
              : ProcedureMasterData
          )
            .filter((f) =>
              !Object.keys(ServiceProcedureMasteredit).length > 0
                ? !["ServiceCode", "ProcedureCode"].includes(f)
                : f
            )
            .filter((f) => {
              const separateFeeFields = [
                "RoomSurgeonFee",
                "RoomOTFee",
                "RoomAssistantSurgeonFee",
                "RoomAnesthesianFee",
                "TotalRoomAmount",
                "WardSurgeonFee",
                "WardOTFee",
                "WardAssistantSurgeonFee",
                "WardAnesthesianFee",
                "TotalWardAmount",
              ];
              const mainFeeFields = [
                "SurgeonFee",
                "OTFee",
                "AnesthesianFee",
                "TotalAmount",
                "AssistantSurgeonFee",
              ];
              if (ServiceProcedureForm === "Service") {
                return true;
              }
              if (ProcedureMasterData.IsSeparateFee === "true") {
                return !mainFeeFields.includes(f);
              }
              return !separateFeeFields.includes(f);
            })
            .filter((f) =>
              (
                ServiceProcedureForm === "Service"
                  ? ServiceMasterData.IsGst !== "Yes"
                  : ProcedureMasterData.IsGst !== "Yes"
              )
                ? f !== "GSTValue"
                : f
            )
            .map((field, indx) => (
              <div className="RegisForm_1" key={indx}>
                <label htmlFor={`${field}_${indx}_${field}`}>
                  {field === "GSTValue" ? "GST Value" : formatLabel(field)}{" "}
                  <span>:</span>
                </label>
                {[
                  "ServiceCategory",
                  "Department",
                  "ServiceType",
                  "Speciality",
                ].includes(field) ? (
                  <select
                    name={field}
                    disabled={
                      field !== "Speciality" &&
                      Object.keys(ServiceProcedureMasteredit).length > 0
                    }
                    value={
                      ServiceProcedureForm === "Service"
                        ? ServiceMasterData[field]
                        : ProcedureMasterData[field]
                    }
                    onChange={handleOnchange}
                  >
                    <option value="">Select</option>
                    {field === "Department" &&
                      ["OP", "IP", "Both OP and IP"].map((val, ind) => (
                        <option key={ind} value={val}>
                          {val}
                        </option>
                      ))}
                    {field === "ServiceCategory" &&
                      ServiceCategory.map((val, ind) => (
                        <option key={ind} value={val.Serviceid}>
                          {val.ServiceCategory}
                        </option>
                      ))}
                    {field === "ServiceType" &&
                      ["Quantity", "Hourly"].map((val, ind) => (
                        <option key={ind} value={val}>
                          {val}
                        </option>
                      ))}
                    {field === "Speciality" &&
                      Array.isArray(Specialitydata) &&
                      Specialitydata.map((val, ind) => (
                        <option key={ind} value={val.Speciality_Id}>
                          {val.SpecialityName}
                        </option>
                      ))}
                  </select>
                ) : field === "IsSeparateFee" ? (
                  <input
                    type="checkbox"
                    name={field}
                    checked={ProcedureMasterData[field] === "true"}
                    onChange={(e) => {
                      setProcedureMasterData((prev) => ({
                        ...prev,
                        IsSeparateFee: e.target.checked ? "true" : "false",
                      }));
                    }}
                    style={{ width: "20px" }}
                  />
                ) : field === "IsGst" ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "150px",
                    }}
                  >
                    <label style={{ width: "60px", cursor: "pointer" }}>
                      <input
                        id={`${field}_${indx}_${field}_Yes`}
                        type="radio"
                        name={field}
                        value="Yes"
                        style={{ width: "15px" }}
                        checked={
                          ServiceProcedureForm === "Service"
                            ? ServiceMasterData[field] === "Yes"
                            : ProcedureMasterData[field] === "Yes"
                        }
                        onChange={(e) => {
                          if (ServiceProcedureForm === "Service") {
                            setServiceMasterData((prev) => ({
                              ...prev,
                              IsGst: "Yes",
                              GSTValue: "",
                            }));
                          } else {
                            setProcedureMasterData((prev) => ({
                              ...prev,
                              IsGst: "Yes",
                              GSTValue: "",
                            }));
                          }
                        }}
                      />
                      Yes
                    </label>
                    <label style={{ width: "60px", cursor: "pointer" }}>
                      <input
                        id={`${field}_${indx}_${field}_No`}
                        type="radio"
                        name={field}
                        value="No"
                        style={{ width: "15px" }}
                        checked={
                          ServiceProcedureForm === "Service"
                            ? ServiceMasterData[field] === "No"
                            : ProcedureMasterData[field] === "No"
                        }
                        onChange={(e) => {
                          if (ServiceProcedureForm === "Service") {
                            setServiceMasterData((prev) => ({
                              ...prev,
                              IsGst: "No",
                              GSTValue: "Nill",
                            }));
                          } else {
                            setProcedureMasterData((prev) => ({
                              ...prev,
                              IsGst: "No",
                              GSTValue: "Nill",
                            }));
                          }
                        }}
                      />
                      No
                    </label>
                  </div>
                )  : field === "ISWardConsession" ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "150px",
                    }}
                  >
                    <label style={{ width: "60px", cursor: "pointer" }}>
                      <input
                        id={`${field}_${indx}_${field}_Yes`}
                        type="radio"
                        name={field}
                        value="Yes"
                        style={{ width: "15px" }}
                        checked={
                          ServiceProcedureForm === "Service"
                            ? ServiceMasterData[field] === "Yes"
                            : ProcedureMasterData[field] === "Yes"
                        }
                        onChange={(e) => {
                          if (ServiceProcedureForm === "Service") {
                            setServiceMasterData((prev) => ({
                              ...prev,
                              ISWardConsession: "Yes",
                            }));
                          } else {
                            setProcedureMasterData((prev) => ({
                              ...prev,
                              ISWardConsession: "Yes",
                            }));
                          }
                        }}
                      />
                      Yes
                    </label>
                    <label style={{ width: "60px", cursor: "pointer" }}>
                      <input
                        id={`${field}_${indx}_${field}_No`}
                        type="radio"
                        name={field}
                        value="No"
                        style={{ width: "15px" }}
                        checked={
                          ServiceProcedureForm === "Service"
                            ? ServiceMasterData[field] === "No"
                            : ProcedureMasterData[field] === "No"
                        }
                        onChange={(e) => {
                          if (ServiceProcedureForm === "Service") {
                            setServiceMasterData((prev) => ({
                              ...prev,
                              ISWardConsession: "No",
                              GSTValue: "Nill",
                            }));
                          } else {
                            setProcedureMasterData((prev) => ({
                              ...prev,
                              ISWardConsession: "No",
                              GSTValue: "Nill",
                            }));
                          }
                        }}
                      />
                      No
                    </label>
                  </div>
                ): (
                  <input
                    disabled={
                      (field === "Amount" &&
                        ServiceProcedureForm === "Procedure") ||
                      [
                        "TotalAmount",
                        "TotalRoomAmount",
                        "TotalWardAmount",
                      ].includes(field)
                    }
                    type={
                      [
                        "Amount",
                        "SurgeonFee",
                        "OTFee",
                        "AssistantSurgeonFee",
                        "AnesthesianFee",
                        "RoomSurgeonFee",
                        "RoomOTFee",
                        "RoomAssistantSurgeonFee",
                        "RoomAnesthesianFee",
                        "WardSurgeonFee",
                        "WardOTFee",
                        "WardAssistantSurgeonFee",
                        "WardAnesthesianFee",
                      ].includes(field)
                        ? "number"
                        : "text"
                    }
                    onKeyDown={(e) =>
                      [
                        "Amount",
                        "SurgeonFee",
                        "OTFee",
                        "AssistantSurgeonFee",
                        "AnesthesianFee",
                        "RoomSurgeonFee",
                        "RoomOTFee",
                        "RoomAssistantSurgeonFee",
                        "RoomAnesthesianFee",
                        "WardSurgeonFee",
                        "WardOTFee",
                        "WardAssistantSurgeonFee",
                        "WardAnesthesianFee",
                      ].includes(field) &&
                      ["e", "E", "+", "-"].includes(e.key) &&
                      e.preventDefault()
                    }
                    value={
                      ServiceProcedureForm === "Service"
                        ? ServiceMasterData[field]
                        : ProcedureMasterData[field]
                    }
                    onChange={handleOnchange}
                    name={field}
                    autoComplete="off"
                  />
                )}
              </div>
            ))}

          {ServiceProcedureForm === "Procedure" && (
            <>
              <div style={{ display: "flex", alignItems: "center" }}>
                <label>
                  {" "}
                  Procedure Master Excel File<span>:</span>{" "}
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
                  title="Choose File"
                  className="RegisterForm_1_btns choose_file_update"
                >
                  <PhotoCameraBackIcon />
                </label>
                <button
                  className="RegisterForm_1_btns choose_file_update"
                  onClick={handleCsvupload}
                  title="File Upload"
                >
                  <DriveFolderUploadIcon />
                </button>
              </div>
            </>
          )}

          {ServiceProcedureForm === "Service" && (
            <>
              <div style={{ display: "flex", alignItems: "center" }}>
                <label>
                  {" "}
                  Service Master Excel File<span>:</span>{" "}
                </label>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  id="Servicechoose"
                  required
                  style={{ display: "none" }}
                  onChange={handleFileChangeService}
                />

                <label
                  htmlFor="Servicechoose"
                  title="Choose File"
                  className="RegisterForm_1_btns choose_file_update"
                >
                  <PhotoCameraBackIcon />
                </label>
                <button
                  className="RegisterForm_1_btns choose_file_update"
                  onClick={handleCsvuploadService}
                  title="File Upload"
                >
                  <DriveFolderUploadIcon />
                </button>
              </div>
            </>
          )}
          <div className="Main_container_Btn">
            <button onClick={handlesubmit}>
              {(
                ServiceProcedureForm === "Service"
                  ? ServiceMasterData.ServiceCode
                  : ProcedureMasterData.ProcedureCode
              )
                ? "Update"
                : "Save"}
            </button>
          </div>
        </div>
      </div>
      <ToastAlert Message={toast.message} Type={toast.type} />
    </>
  );
};

export default ServiceProcedureMaster;
