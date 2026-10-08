import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";

const MRD_Rack_Master = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const dispatchvalue = useDispatch();

  const [RackMasterPage, setRackMasterPage] = useState("Rack");
  const [RackArray, setRackArray] = useState([]);
  const [ShelfArray, setShelfArray] = useState([]);
  const [FileArray, setFileArray] = useState([]);
  const [originalFileArray, setOriginalFileArray] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [FilterbyPatientId, setFilterbyPatientId] = useState([]);


  const [RackState, setRackState] = useState({
    RackID: "",
    RackName: "",
  });

  const [ShelfState, setShelfState] = useState({
    ShelfID: "",
    RackName: "",
    ShelfName: "",
  });

  const [FileState, setFileState] = useState({
    FileID: "",
    Patient_Id: "",
    File_Name: "",
    Shelf_Id: "",
    File_Position: "",
    Booking_Status: "Available",
  });

  // const filteredFiles = FileArray.filter((file) =>
  //   file.Patient_Id.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   file.File_Name.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  // Fetch Rack Data
  const GetRackData = useCallback(() => {
    axios
      .get(`${UrlLink}MRD/MRD_Rack_Detials_link`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setRackArray(data);
      })
      .catch((err) => {
        console.error(err);
        dispatchvalue({
          type: "toast",
          value: { message: "Failed to fetch racks", type: "error" },
        });
      });
  }, [UrlLink, dispatchvalue]);

  useEffect(() => {
    GetRackData();
  }, [GetRackData]);

  // Fetch Shelf Data
  const GetShelfData = useCallback(() => {
    const params = { RackName: ShelfState.RackName || FileState.Rack_Id };
    axios
      .get(`${UrlLink}MRD/MRD_Shelf_Detials_link`, { params })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setShelfArray(data);
      })
      .catch((err) => {
        console.error(err);
        dispatchvalue({
          type: "toast",
          value: { message: "Failed to fetch shelves", type: "error" },
        });
      });
  }, [UrlLink, ShelfState.RackName, FileState.Rack_Id, dispatchvalue]);

  useEffect(() => {
    if (ShelfState.RackName || FileState.Rack_Id) {
      GetShelfData();
    }
  }, [GetShelfData, ShelfState.RackName, FileState.Rack_Id]);

  // Fetch File Data
  const GetFileData = useCallback(() => {
    const params = { ShelfName: FileState.Shelf_Id };
    axios
      .get(`${UrlLink}MRD/MRD_File_Detials_link`, { params })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setFileArray(data);
        setOriginalFileArray(data);
      })
      .catch((err) => {
        console.error(err);
        dispatchvalue({
          type: "toast",
          value: { message: "Failed to fetch files", type: "error" },
        });
      });
  }, [UrlLink, FileState.Shelf_Id, dispatchvalue]);

  useEffect(() => {
    if (FileState.Shelf_Id) {
      GetFileData();
    }
  }, [GetFileData, FileState.Shelf_Id]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = originalFileArray.filter(
        (file) =>
          file.Patient_Id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          file.File_Name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFileArray(filtered);
    } else {
      setFileArray(originalFileArray);
    }
  }, [searchQuery, originalFileArray]);

  const fetchFilePatientData = (patientId) => {
    axios
      .get(`${UrlLink}MRD/get_file_patient_details`, {
        params: {
          PatientId: patientId,
          FirstName: "",
          PhoneNumber: "",
        },
      })
      .then((res) => {
        const data = res.data;

        if (data.warn) {
          dispatchvalue({
            type: "toast",
            value: { message: data.warn, type: "warn" },
          });
          return;
        }

        setFileState((prev) => ({
          ...prev,
          Patient_Id: data.PatientId || "",
          File_Name: data.File_Name?.toUpperCase() || "",
        }));
      })
      .catch((err) => {
        console.error("Error fetching patient file details:", err);
      });
  };

  useEffect(() => {
    axios
      .get(`${UrlLink}MRD/get_all_patients_list`)
      .then((res) => {
        setFilterbyPatientId(res.data || []);
      })
      .catch((err) => console.error("Failed to load patients", err));
  }, []);

  // Handle Rack Save
  const HandleSaveRack = () => {
    if (!RackState.RackName.trim()) {
      dispatchvalue({
        type: "toast",
        value: { message: "Rack name is required", type: "warn" },
      });
      return;
    }

    const sendData = {
      RackID: RackState.RackID,
      RackName: RackState.RackName,
      created_by: userRecord?.username || "",
    };

    axios
      .post(`${UrlLink}MRD/MRD_Rack_Detials_link`, sendData)
      .then((res) => {
        const { success, warn, error } = res.data;
        const message = success || warn || error;
        const type = success ? "success" : warn ? "warn" : "error";
        dispatchvalue({ type: "toast", value: { message, type } });
        if (type === "success") {
          setRackState({ RackID: "", RackName: "" });
          GetRackData();
        }
      })
      .catch((err) => {
        console.error(err);
        dispatchvalue({
          type: "toast",
          value: { message: "Failed to save rack", type: "error" },
        });
      });
  };

  // Handle Rack Status Toggle
  const HandleEditRackStatus = (params) => {
    const data = { RackID: params.id, Statusedit: true };
    axios
      .post(`${UrlLink}MRD/MRD_Rack_Detials_link`, data)
      .then((res) => {
        const { success, error } = res.data;
        const message = success || error;
        const type = success ? "success" : "error";
        dispatchvalue({ type: "toast", value: { message, type } });
        GetRackData();
      })
      .catch((err) => {
        console.error(err);
        dispatchvalue({
          type: "toast",
          value: { message: "Failed to toggle rack status", type: "error" },
        });
      });
  };

  // Handle Rack Edit
  const HandleEditRack = (params) => {
    setRackState({
      RackID: params.id,
      RackName: params.RackName,
    });
  };

  // Handle Shelf Save
  const HandleSaveShelf = () => {
    if (!ShelfState.RackName || !ShelfState.ShelfName.trim()) {
      dispatchvalue({
        type: "toast",
        value: {
          message: "Rack name and shelf name are required",
          type: "warn",
        },
      });
      return;
    }

    const sendData = {
      ShelfID: ShelfState.ShelfID,
      RackName: ShelfState.RackName,
      ShelfName: ShelfState.ShelfName,
      created_by: userRecord?.username || "",
    };

    axios
      .post(`${UrlLink}MRD/MRD_Shelf_Detials_link`, sendData)
      .then((res) => {
        const { success, warn, error } = res.data;
        const message = success || warn || error;
        const type = success ? "success" : warn ? "warn" : "error";
        dispatchvalue({ type: "toast", value: { message, type } });
        if (type === "success") {
          setShelfState({ ShelfID: "", RackName: "", ShelfName: "" });
          GetShelfData();
        }
      })
      .catch((err) => {
        console.error(err);
        dispatchvalue({
          type: "toast",
          value: { message: "Failed to save shelf", type: "error" },
        });
      });
  };

  // Handle Shelf Status Toggle
  const HandleEditShelfStatus = (params) => {
    const data = { ShelfID: params.id, Statusedit: true };
    axios
      .post(`${UrlLink}MRD/MRD_Shelf_Detials_link`, data)
      .then((res) => {
        const { success, error } = res.data;
        const message = success || error;
        const type = success ? "success" : "error";
        dispatchvalue({ type: "toast", value: { message, type } });
        GetShelfData();
      })
      .catch((err) => {
        console.error(err);
        dispatchvalue({
          type: "toast",
          value: { message: "Failed to toggle shelf status", type: "error" },
        });
      });
  };

  // Handle Shelf Edit
  const HandleEditShelf = (params) => {
    setShelfState({
      ShelfID: params.id,
      RackName: params.Rack_Id,
      ShelfName: params.Shelf_Name,
    });
  };

  // Handle File Save
  const HandleSaveFile = () => {
    if (
      !FileState.Patient_Id ||
      !FileState.File_Name.trim() ||
      !FileState.Shelf_Id
    ) {
      dispatchvalue({
        type: "toast",
        value: {
          message: "Patient ID, file name, and shelf are required",
          type: "warn",
        },
      });
      return;
    }

    const sendData = {
      FileID: FileState.FileID,
      Patient_Id: FileState.Patient_Id,
      File_Name: FileState.File_Name,
      Shelf_Id: FileState.Shelf_Id,
      File_Position: FileState.File_Position,
      Booking_Status: FileState.Booking_Status,
      created_by: userRecord?.username || "",
    };

    axios
      .post(`${UrlLink}MRD/MRD_File_Detials_link`, sendData)
      .then((res) => {
        const { success, warn, error } = res.data;
        const message = success || warn || error;
        const type = success ? "success" : warn ? "warn" : "error";
        dispatchvalue({ type: "toast", value: { message, type } });
        if (type === "success") {
          setFileState({
            FileID: "",
            Patient_Id: "",
            File_Name: "",
            Shelf_Id: "",
            File_Position: "",
            Booking_Status: "Available",
          });
          GetFileData();
        }
      })
      .catch((err) => {
        console.error(err);
        dispatchvalue({
          type: "toast",
          value: { message: "Failed to save file", type: "error" },
        });
      });
  };

  // Handle File Status Toggle
  const HandleEditFileStatus = (params) => {
    const data = { FileID: params.File_Id, Statusedit: true };
    axios
      .post(`${UrlLink}MRD/MRD_File_Detials_link`, data)
      .then((res) => {
        const { success, error } = res.data;
        const message = success || error;
        const type = success ? "success" : "error";
        dispatchvalue({ type: "toast", value: { message, type } });
        GetFileData();
      })
      .catch((err) => {
        console.error(err);
        dispatchvalue({
          type: "toast",
          value: { message: "Failed to toggle file status", type: "error" },
        });
      });
  };

  // Handle File Edit
  const HandleEditFile = (params) => {
    setFileState({
      FileID: params.File_Id,
      Patient_Id: params.Patient_Id,
      File_Name: params.File_Name,
      Shelf_Id: params.Shelf_Id,
      File_Position: params.File_Position,
      Booking_Status: params.Booking_Status,
    });
    setShelfState((prev) => ({ ...prev, RackName: params.Rack_Id }));
  };

  // Grid Columns
  const RackColumns = [
    { key: "id", name: "Rack ID", frozen: true },
    { key: "RackName", name: "Rack Name", frozen: true },
    {
      key: "Status",
      name: "Status",
      renderCell: (params) => (
        <Button
          className="cell_btn"
          onClick={() => HandleEditRackStatus(params.row)}
        >
          {params.row.Status ? "ACTIVE" : "INACTIVE"}
        </Button>
      ),
    },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <Button className="cell_btn" onClick={() => HandleEditRack(params.row)}>
          <EditIcon className="check_box_clrr_cancell" />
        </Button>
      ),
    },
  ];

  const ShelfColumns = [
    { key: "id", name: "Shelf ID", frozen: true },
    { key: "Shelf_Name", name: "Shelf Name", frozen: true },
    { key: "Rack_Name", name: "Rack Name", frozen: true },
    {
      key: "Status",
      name: "Status",
      renderCell: (params) => (
        <Button
          className="cell_btn"
          onClick={() => HandleEditShelfStatus(params.row)}
        >
          {params.row.Status ? "ACTIVE" : "INACTIVE"}
        </Button>
      ),
    },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <Button
          className="cell_btn"
          onClick={() => HandleEditShelf(params.row)}
        >
          <EditIcon className="check_box_clrr_cancell" />
        </Button>
      ),
    },
  ];

  const FileColumns = [
    { key: "File_Id", name: "File ID", frozen: true },
    { key: "File_Name", name: "File Name", frozen: true },
    { key: "Patient_Name", name: "Patient Name" },
    { key: "Shelf_Name", name: "Shelf Name" },
    { key: "Rack_Name", name: "Rack Name" },
    { key: "File_Position", name: "File Position" },
    { key: "Booking_Status", name: "Booking Status" },
    {
      key: "Status",
      name: "Status",
      renderCell: (params) => (
        <Button
          className="cell_btn"
          onClick={() => HandleEditFileStatus(params.row)}
        >
          {params.row.Status ? "ACTIVE" : "INACTIVE"}
        </Button>
      ),
    },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <Button className="cell_btn" onClick={() => HandleEditFile(params.row)}>
          <EditIcon className="check_box_clrr_cancell" />
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="Main_container_app">
        <h3>MRD Rack Master</h3>

        <div className="RegisterTypecon">
          <div className="RegisterType">
            {["Rack", "Shelf", "File"].map((p, ind) => (
              <div className="registertypeval" key={ind}>
                <input
                  type="radio"
                  id={p}
                  name="appointment_type"
                  checked={RackMasterPage === p}
                  onChange={(e) => setRackMasterPage(e.target.value)}
                  value={p}
                />
                <label htmlFor={p}>{p}</label>
              </div>
            ))}
          </div>
        </div>

        <br />

        {RackMasterPage === "Rack" && (
          <>
            <div className="common_center_tag">
              <span>Rack Name</span>
            </div>
            <br />
            <div className="RegisFormcon_1">
              <div className="RegisForm_1">
                <label>
                  Rack Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="RackName"
                  autoComplete="off"
                  required
                  value={RackState.RackName}
                  onChange={(e) =>
                    setRackState((prev) => ({
                      ...prev,
                      RackName: e.target.value.toUpperCase(),
                    }))
                  }
                />
              </div>
            </div>
            <br />
            <div className="Main_container_Btn">
              <button onClick={HandleSaveRack}>
                {RackState.RackID ? "Update" : "Add"}
              </button>
            </div>
            <br />
            <ReactGrid columns={RackColumns} RowData={RackArray} />
          </>
        )}

        {RackMasterPage === "Shelf" && (
          <>
            <div className="common_center_tag">
              <span>Shelf Name</span>
            </div>
            <br />
            <div className="RegisFormcon_1">
              <div className="RegisForm_1">
                <label>
                  Rack Name <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  name="RackName"
                  required
                  value={ShelfState.RackName}
                  onChange={(e) =>
                    setShelfState((prev) => ({
                      ...prev,
                      RackName: e.target.value,
                      ShelfName: "",
                    }))
                  }
                >
                  <option value="">Select</option>
                  {RackArray.map((p, index) => (
                    <option key={index} value={p.id}>
                      {p.RackName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="RegisForm_1">
                <label>
                  Shelf Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="ShelfName"
                  autoComplete="off"
                  required
                  value={ShelfState.ShelfName}
                  onChange={(e) =>
                    setShelfState((prev) => ({
                      ...prev,
                      ShelfName: e.target.value.toUpperCase(),
                    }))
                  }
                  disabled={!ShelfState.RackName}
                />
              </div>
            </div>
            <br />
            <div className="Main_container_Btn">
              <button onClick={HandleSaveShelf}>
                {ShelfState.ShelfID ? "Update" : "Add"}
              </button>
            </div>
            <br />
            <ReactGrid columns={ShelfColumns} RowData={ShelfArray} />
          </>
        )}

        {RackMasterPage === "File" && (
          <>
            <div className="common_center_tag">
              <span>File Name</span>
            </div>
            <br />
            <div className="RegisFormcon_1">
              <div className="RegisForm_1">
                <label>Search Files</label>
                <input
                  type="text"
                  placeholder="Search by Patient ID or File Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="RegisForm_1">
                <label>
                  Rack Name <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  name="RackName"
                  required
                  value={ShelfState.RackName}
                  onChange={(e) => {
                    setShelfState((prev) => ({
                      ...prev,
                      RackName: e.target.value,
                    }));
                    setFileState((prev) => ({
                      ...prev,
                      Shelf_Id: "",
                      Rack_Id: e.target.value,
                    }));
                  }}
                >
                  <option value="">Select</option>
                  {RackArray.map((p, index) => (
                    <option key={index} value={p.id}>
                      {p.RackName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="RegisForm_1">
                <label>
                  Shelf Name <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  name="Shelf_Id"
                  required
                  value={FileState.Shelf_Id}
                  onChange={(e) =>
                    setFileState((prev) => ({
                      ...prev,
                      Shelf_Id: e.target.value,
                    }))
                  }
                  disabled={!ShelfState.RackName}
                >
                  <option value="">Select</option>
                  {ShelfArray.map((p, index) => (
                    <option key={index} value={p.id}>
                      {p.Shelf_Name}
                    </option>
                  ))}
                </select>
              </div>
              <datalist id="patient_id_list_file">
                {FilterbyPatientId.map((item, index) => (
                  <option
                    key={index}
                    value={item.PatientId}
                    label={`Ph: ${item.PhoneNo} | Name: ${item.FirstName}`}
                  />
                ))}
              </datalist>
              <div className="RegisForm_1">
                <label>
                  Patient ID <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="Patient_Id"
                  list="patient_id_list_file"
                  autoComplete="off"
                  required
                  value={FileState.Patient_Id}
                  onChange={(e) => {
                    const value = e.target.value;

                    setFileState((prev) => ({
                      ...prev,
                      Patient_Id: value,
                    }));

                    const match = FilterbyPatientId.find(
                      (p) => p.PatientId === value
                    );
                    if (match) {
                      fetchFilePatientData(value);
                    }
                  }}
                  disabled={!FileState.Shelf_Id}
                />
              </div>
              <div className="RegisForm_1">
                <label>
                  File Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="File_Name"
                  autoComplete="off"
                  required
                  value={FileState.File_Name}
                  onChange={(e) =>
                    setFileState((prev) => ({
                      ...prev,
                      File_Name: e.target.value.toUpperCase(),
                    }))
                  }
                  disabled={!FileState.Shelf_Id}
                />
              </div>
              <div className="RegisForm_1">
                <label>File Position</label>
                <input
                  type="text"
                  name="File_Position"
                  autoComplete="off"
                  value={FileState.File_Position}
                  onChange={(e) =>
                    setFileState((prev) => ({
                      ...prev,
                      File_Position: e.target.value,
                    }))
                  }
                  disabled={!FileState.Shelf_Id}
                />
              </div>
              <div className="RegisForm_1">
                <label>Booking Status</label>
                <select
                  name="Booking_Status"
                  value={FileState.Booking_Status}
                  onChange={(e) =>
                    setFileState((prev) => ({
                      ...prev,
                      Booking_Status: e.target.value,
                    }))
                  }
                  disabled={!FileState.Shelf_Id}
                >
                  <option value="Available">Available</option>
                  <option value="Booked">Booked</option>
                </select>
              </div>
            </div>
            <br />
            <div className="Main_container_Btn">
              <button onClick={HandleSaveFile}>
                {FileState.FileID ? "Update" : "Add"}
              </button>
            </div>
            <br />
            <ReactGrid columns={FileColumns} RowData={FileArray} />
          </>
        )}

        <ToastAlert Message={toast.message} Type={toast.type} />
      </div>
    </>
  );
};

export default MRD_Rack_Master;
