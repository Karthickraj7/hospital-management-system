import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";

function Container() {
  const urllink = useSelector((state) => state.userRecord?.UrlLink);

  const [containerData, setContainerData] = useState([]);
  const [container, setContainer] = useState("");
  const [containerCode, setContainerCode] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedid, setSelectedid] = useState(null);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [FlaggName, setFlaggName] = useState("");
  console.log(FlaggName);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);

  const successMsg = (message) => {
    toast.success(`${message}`, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      // containerId: "toast-container-over-header",
      style: { marginTop: "50px" },
    });
  };

  const userwarn = (warningMessage) => {
    toast.warn(`${warningMessage}`, {
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

  const handleSubmitContainer = () => {
    const Type = "ContainerMaster";
    const createdby = userRecord?.username;
    if (!container.trim() || !containerCode.trim() || !FlaggName.trim()) {
      if (!container) {
        userwarn("container are required.");
      } else if (!FlaggName) {
        userwarn("FlaggName are required.");
      } else {
        userwarn("Both Container and Container code ,FlaggName are required.");
      }

      return; // Exit the function early if validation fails
    }
    axios
      .post(`${urllink}Masters/Insert_All_Other_Masters`, {
        container,
        containerCode,
        Type,
        createdby,
        FlaggName,
      })
      .then((response) => {
        if (response.data.success) {
          successMsg(response.data.message);
        } else {
          userwarn(response.data.message);
        }
        fetchgetcontainercode();
        setContainer("");
        setFlaggName("");
        fetchContainerData();
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  const fetchContainerData = useCallback(() => {
    axios
      .get(`${urllink}Masters/Get_All_Master_data?Type=ContainerMaster`)
      .then((response) => {
        const data = response.data;
        console.log("data", data);

        setContainerData(data);
      })
      .catch((error) => {
        console.error("Error fetching container data:", error);
      });
  }, [urllink]);

  const fetchgetcontainercode = useCallback(() => {
    axios
      .get(
        `${urllink}Masters/Get_All_Other_Masters_PrimaryCodes?Type=ContainerMaster`
      )
      .then((response) => {
        const data = response.data;
        console.log("data", data);

        setContainerCode(data.container_code);
      })
      .catch((error) => {
        console.error("Error fetching container data:", error);
      });
  }, [urllink]);

  useEffect(() => {
    fetchContainerData();
    fetchgetcontainercode();
  }, [fetchContainerData, fetchgetcontainercode]);

  const handleEdit = (row) => {
    // Assuming `method_id` is the identifier
    setContainer(row.Container_Name);
    setContainerCode(row.Container_Code);
    setIsEditMode(true);
    setSelectedid(row.container_id);
    setFlaggName(row?.ColorFlag);
  };

  const handleUpdateMethod = async () => {
    try {
      const response = await axios.post(
        `${urllink}Masters/Insert_All_Other_Masters`,
        {
          container: container,
          containerCode: containerCode,
          Type: "ContainerMaster",
          FlaggName: FlaggName,
          createdby: userRecord?.username,
        }
      );
      console.log(response.data);
      if (response.data.success) {
        successMsg(response.data.message);
      } else {
        userwarn(response.data.message);
      }
      fetchgetcontainercode();
      setContainer("");
      // setContainerCode("");
      setFlaggName("");
      setIsEditMode(false);
      setSelectedid("");
      fetchContainerData();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleFlaggInputChange = (e) => {
    const { name, value } = e.target;
    setFlaggName(value);
  };

  const containercolumns = [
    {
      key: "id",
      name: "S.No",
      width: 70,
    },
    {
      key: "Container_Name",
      name: "Container Name",
      width: 280,
    },
    {
      key: "ColorFlag",
      name: "Color Flag",
      renderCell: (params) => (
        <span
          style={{
            height: "20px",
            width: "20px",
            backgroundColor: params.row.ColorFlag,
          }}
        ></span>
      ),
    },
    {
      key: "EditAction",
      name: "Action",
      renderCell: (params) => (
        <p
          style={{ width: "130px", textAlign: "center", cursor: "pointer" }}
          onClick={() => handleEdit(params.row)}
        >
          <EditIcon />
        </p>
      ),
    },
  ];

  const handleSearchChange = (event, type) => {
    const value = event.target.value;
    if (type === "name") {
      setSearchQuery(value);
    }
  };

  useEffect(() => {
    // console.log(ageData)
    if (Array.isArray(containerData)) {
      const lowerCaseNameQuery = searchQuery.toLowerCase();
      const filteredData = containerData.filter((row) => {
        const lowerCasePatientName = row?.Container_Name
          ? row.Container_Name.toLowerCase()
          : "";
        return lowerCasePatientName.includes(lowerCaseNameQuery);
      });
      // console.log(filteredData)
      setFilteredRows(filteredData);
    } else {
      // Handle the case where ageData is not an array
      setFilteredRows([]);
    }
  }, [searchQuery, containerData]);

  return (
    <>
      <div className="appointment">
        {/* <div className="ShiftClosing_Container"> */}
        {/* <h2 style={{ textAlign: "center" }}>Container</h2> */}
        <h2 style={{ textAlign: "center" }}>Container Master</h2>
        <br />
        <div className="RegisFormcon">
          <div className="RegisForm_1">
            <label htmlFor="input">
              Container Code <span>:</span>
            </label>
            <input
              type="text"
              id="FirstName"
              name="roleName"
              value={containerCode}
              disabled
              onChange={(e) => setContainerCode(e.target.value)}
            />
          </div>
          <div className="RegisForm_1">
            <label htmlFor="input">
              Container Name <span>:</span>
            </label>
            <input
              type="text"
              id="FirstName"
              name="roleName"
              value={container}
              onChange={(e) => setContainer(e.target.value)}
              placeholder="Enter Container Name"
            />
          </div>
          <div className="RegisForm_1">
            <label>
              {" "}
              Flagg Color <span>:</span>{" "}
            </label>
            <input
              style={{ border: "0px", padding: "0px", width: "50px" }}
              type="color"
              name="FlaggColor"
              required
              value={FlaggName}
              onChange={handleFlaggInputChange}
            />
          </div>
          <button
            className="RegisterForm_1_btns"
            onClick={isEditMode ? handleUpdateMethod : handleSubmitContainer}
          >
            {isEditMode ? "Update" : <AddIcon />}
          </button>
        </div>
        <br />
        <div style={{ width: "100%", display: "grid", placeItems: "center" }}>
          <div className="con_1 ">
            <div className="inp_1">
              <label htmlFor="input">
                Container Name <span>:</span>
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e, "name")}
                placeholder="Search Container"
              />
            </div>
          </div>
        </div>
        <div className="Main_container_app">
          <ReactGrid columns={containercolumns} RowData={filteredRows} />
        </div>
        {/* </div> */}
      </div>
      <ToastContainer />
    </>
  );
}

export default Container;
