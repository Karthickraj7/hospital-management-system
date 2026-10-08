import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from 'react-router-dom';


const SurgeryMaster = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const toast = useSelector((state) => state.userRecord?.toast);
  const dispatchvalue = useDispatch();
  // ----------------------SurgeryName--------
  const [Surgery, setSurgery] = useState({
    SurgeryNameId: "",
    SurgeryName: "",
    Speciality: "",
    AnesthesiaType: "",
    SurgeryType: "",
    SurgeryDescription: "",
    Duration: "",
    Cost: "",
    Location: "",
    SurgeryCode: ""
  });
  console.log("Surgerydata", Surgery);
  const [Surgerydata, setSurgerydata] = useState([]);
  const navigate = useNavigate()
  const [IsSurgeryGet, setIsSurgeryGet] = useState(false);
  const [LocationData, setLocationData] = useState([]);
  const [SpecialityData, setSpecialityData] = useState([]);
  useEffect(() => {
    axios.get(`${UrlLink}Masters/Location_Detials_link`)
      .then((res) => {
        const ress = res.data
        setLocationData(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [UrlLink])

  useEffect(() => {
    axios
      .get(`${UrlLink}Workbench/All_Speciality_Details_Link`)
      .then((res) => {
        const ress = res.data
        console.log("specialization", ress);
        setSpecialityData(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [UrlLink])


  const handleSurgeryChange = (e) => {
    const { name, value } = e.target;

    if (name === 'Location') {
      // Update Location and reset RadiologyName when location changes
      setSurgery((prev) => ({
        ...prev,
        [name]: value,
        SurgeryName: '',
        Speciality: '',
        Duration: '',
        AnesthesiaType: '',
        SurgeryType: "",
        SurgeryDescription: "",
        Cost: '',
        SurgeryCode: ""
      }));
    }
    else if (name === 'Speciality') {
      // Update Location and reset RadiologyName when location changes
      setSurgery((prev) => ({
        ...prev,
        [name]: value,
        SurgeryName: '',
        Duration: '',
        SurgeryType: "",
        SurgeryDescription: "",
        AnesthesiaType: '',
        Cost: '',
        SurgeryCode: "" // Reset RadiologyName on location change
      }));
    }
    else if (name === "SurgeryType") {
      // Update the relevant field, applying toUpperCase and trim
      setSurgery((prev) => ({
        ...prev,
        [name]: value,
        Duration: '',
        AnesthesiaType: '',
        SurgeryName: '',
        SurgeryDescription: "",
        Cost: '',
        SurgeryCode: ""
      }));
    }
    else if (name === "SurgeryName") {
      // Update the relevant field, applying toUpperCase and trim
      setSurgery((prev) => ({
        ...prev,
        [name]: value?.toUpperCase()?.trim(),
        Duration: '',
        AnesthesiaType: '',
        SurgeryDescription: "",
        Cost: '',
      }));
    }
    else {
      setSurgery((pre) => ({
        ...pre,
        [name]: value,
      }));
    }
  };

  const handleSurgerySubmit = () => {
    if (Surgery.SurgeryName && Surgery.Location && Surgery.SurgeryType && Surgery.Speciality && Surgery.AnesthesiaType && Surgery.Cost && Surgery.Duration) {
      const data = {
        ...Surgery,
        Speciality: Surgery.Speciality || "",
        SurgeryName: Surgery.SurgeryName || "",
        Location: Surgery.Location || "",
        Duration: Surgery.Duration || "",
        Cost: Surgery.Cost || "",
        created_by: userRecord?.username || "",
      };
      console.log("senddatadata", data);
      axios
        .post(`${UrlLink}Masters/Surgery_Names_link`, data)
        .then((res) => {
          const restes = res.data;
          console.log(restes);
          const type = Object.keys(restes)[0];
          const mess = Object.values(restes)[0];
          const tdata = {
            message: mess,
            type: type,
          };
          dispatchvalue({ type: "toast", value: tdata });
          setIsSurgeryGet((prev) => !prev);
          setSurgery({
            SurgeryNameId: "",
            SurgeryType: "",
            SurgeryName: "",
            Location: "",
            Speciality: "",
            AnesthesiaType: "",
            Cost: "",
            Duration: "",
            SurgeryDescription: "",
            SurgeryCode: ""
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      dispatchvalue({ type: "toast", value: { message: "Please provide Surgery Details.", type: "warn" } });
    }

  };

  useEffect(() => {
    axios.get(`${UrlLink}Masters/Surgery_Names_link`)
      .then((response) => {
        console.log("123", response.data)
        setSurgerydata(response.data);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [IsSurgeryGet, UrlLink]);

  const handleSurgeryStatus = (params) => {
    console.log("status", params);

    const data = {
      SurgeryNameId: params.id,
      Statusedit: true
    };
    axios.post(`${UrlLink}Masters/Surgery_Names_link`, data)
      .then((res) => {
        const resres = res.data;
        let typp = Object.keys(resres)[0];
        let mess = Object.values(resres)[0];
        const tdata = {
          message: mess,
          type: typp,
        };
        dispatchvalue({ type: 'toast', value: tdata });
        setIsSurgeryGet(prev => !prev);
      })
      .catch((err) => {
        console.log(err);
      });

  }
  const handleEditSurgery = (params) => {
    console.log("SurgeryEdit", params);
    const { id, ...rest } = params;

    setSurgery({
      SurgeryNameId: params.id,
      SurgeryType: params.SurgeryType,
      SurgeryCode: params.SurgeryCode,
      SurgeryName: params.Surgery_Name,
      Duration: params.Duration_Hours,
      Cost: params.Estimate_Cost,
      Speciality: params.Speciality_Id, // Set Speciality ID if applicable
      AnesthesiaType: params.Anesthesia_Type,
      SurgeryDescription: params.SurgeryDescription,
      Location: params.Location_Id, // Set Location ID, not the name
      ...rest
    });
  };

  const handleRatecardview = useCallback(
    (params) => {
      if (!params?.id) {
        dispatchvalue({
          type: "toast",
          value: { message: "Unable to load rate card. Please try again.", type: "warn" }
        });
        return;
      }

      const data = { MasterType: "Surgery", id: params.id };

      // Dispatch state updates before navigation
      dispatchvalue({ type: "SurgeryProcedureRatecardView", value: data });
      // Navigate after state updates
      navigate("/Home/MasterFolder");
      dispatchvalue({ type: "HrFolder", value: "SurgeryProcedureRatecardView" });
      dispatchvalue({ type: "setPreviousFolder", value: null });


    },
    [dispatchvalue, navigate]
  );



  const SurgeryNamesColumns = [
    {
      key: "id",
      name: "S.NO",
      frozen: true,
    },

    {
      key: "Speciality_Name",
      name: "Speciality Name ",
      frozen: true,

    },
    {
      key: "SurgeryCode",
      name: "SurgeryCode",
      frozen: true,
      width: 170,
    },
    {
      key: "SurgeryType",
      name: "SurgeryType",
    }
    ,
    {
      key: "Surgery_Name",
      name: "Surgery Name",
      width: 250,

    },

    {
      key: "Duration_Hours",
      name: "Duration Hours",
    },
    {
      key: "Estimate_Cost",
      name: "Estimate Cost",
    },
    {
      key: "Anesthesia_Type",
      name: "AnesthesiaType ",

    },
    {
      key: "SurgeryDescription",
      name: "Surgery Description ",
      width: 360,
    },
    {
      key: "Status",
      name: "Status",
      renderCell: (params) => (
        <Button
          className="cell_btn"
          onClick={() => handleSurgeryStatus(params.row)}
        >
          {params.row.Status}
        </Button>
      ),
    },
    {
      key: 'RatecardView',
      name: 'Ratecard View',
      renderCell: (params) => (
        <Button className='cell_btn' onClick={() => handleRatecardview(params.row)}>
          <VisibilityIcon />
        </Button>
      ),
    },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <Button className="cell_btn"
          onClick={() => handleEditSurgery(params.row)}
        >
          <EditIcon className="check_box_clrr_cancell" />
        </Button>
      ),
    },
  ]

  return (
    <>
      <div className="Main_container_app">
        <div className="common_center_tag">
          <span>Surgery Master</span>
        </div>

        <div className="RegisFormcon_1">
          <div className="RegisForm_1">
            <label> Location <span>:</span> </label>

            <select
              name='Location'
              required
              disabled={Boolean(Surgery.SurgeryNameId)}
              value={Surgery.Location}
              onChange={handleSurgeryChange}
            >
              <option value=''>Select</option>
              {
                LocationData.map((p) => (
                  <option key={p.id} value={p.id}>{p.locationName}</option>
                ))
              }
            </select>
          </div>
          <div className="RegisForm_1">
            <label>Speciality Name <span>:</span> </label>

            <select
              name='Speciality'
              required
              disabled={Boolean(Surgery.SurgeryNameId)}
              value={Surgery.Speciality}
              onChange={handleSurgeryChange}
            >
              <option value=''>Select</option>
              {
                SpecialityData.map((p) => (
                  <option key={p.id} value={p.id}>{p.Speciality_name}</option>
                ))
              }
            </select>
          </div>

          <div className="RegisForm_1">
            <label>
              Surgery Type <span>:</span>
            </label>
            <select
              name="SurgeryType"
              required
              value={Surgery.SurgeryType}
              onChange={handleSurgeryChange}
              disabled={Boolean(Surgery.SurgeryNameId)}
            >
              <option value="" disabled>Select</option>
              <option value="Minor">Minor</option>
              <option value="Major">Major</option>
            </select>
          </div>


          <div className="RegisForm_1">

            <label>
              Surgery Name <span>:</span>
            </label>
            <input
              type="text"
              name="SurgeryName"
              required
              value={Surgery.SurgeryName}
              autoComplete="off"
              onChange={handleSurgeryChange}
              disabled={Boolean(Surgery.SurgeryNameId)}
            />
          </div>
          <div className="RegisForm_1">
            <label>
              Estimate  Duration in Hours<span>:</span>
            </label>
            <input
              type="number"
              name="Duration"
              required
              value={Surgery.Duration}
              onKeyDown={(e) =>
                ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
              }
              autoComplete="off"
              onChange={handleSurgeryChange}
            />
          </div>
          <div className="RegisForm_1">
            <label>
              Estimate Cost<span>:</span>
            </label>
            <input
              type="number"
              name="Cost"
              required
              value={Surgery.Cost}
              onKeyDown={(e) =>
                ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
              }
              autoComplete="off"
              onChange={handleSurgeryChange}
            />
          </div>
          <div className="RegisForm_1">
            <label>
              Anesthesia Type <span>:</span>
            </label>
            <select
              name="AnesthesiaType"
              required
              value={Surgery.AnesthesiaType}
              onChange={handleSurgeryChange}
            >
              <option value="" disabled>Select</option>
              <option value="General">General</option>
              <option value="Regional">Regional</option>
              <option value="Local">Local</option>
              <option value="Topical">Topical</option>
            </select>
          </div>
          <div className="RegisForm_1">
            <label htmlFor="instruction">
              Surgery Description<span>:</span>
            </label>
            <textarea
              id="SurgeryDescription"
              name="SurgeryDescription"
              rows="2"
              value={Surgery.SurgeryDescription}
              onChange={handleSurgeryChange}
            ></textarea>
          </div>


        </div>


        <div className="Main_container_Btn">
          <button onClick={handleSurgerySubmit}>
            {Surgery.SurgeryNameId ? "Update" : "Save"}
          </button>
        </div>
        {Surgerydata.length > 0 && (
          <ReactGrid columns={SurgeryNamesColumns} RowData={Surgerydata} />
        )}
        <ToastAlert Message={toast.message} Type={toast.type} />
      </div>

    </>
  )
}

export default SurgeryMaster;

