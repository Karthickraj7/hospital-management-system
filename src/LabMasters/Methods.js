import React, { useEffect, useCallback, useState } from "react";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from "react-redux";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";

function Methods() {
  const [methodData, setMethodData] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedMethodId, setSelectedMethodId] = useState(null);
  const userRecord = useSelector((state) => state.userRecord?.UserData);

  const [method, setMethod] = useState("");
  const [methodcode, setMethodCode] = useState("");
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
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

  const handleSubmitMethods = async () => {
    const Type = "MethodsMaster";
    const createdby = userRecord?.username;
    if (!method.trim() || !methodcode.trim()) {
      userwarn("Both Method Name and code are required.");
      return; // Exit the function early if validation fails
    }
    try {
      // Make a POST request to your Django backend endpoint
      const response = await axios.post(
        `${urllink}Masters/Insert_All_Other_Masters`,
        {
          method,
          methodcode,
          Type,
          createdby,
        }
      );

      // Handle the response as needed
      console.log(response.data);
      if(response.data.success === true){
        successMsg(response.data.message);
      }
      else{
        userwarn(response.data.message)
      }
      fetchMethodCodeData();
      // Optionally, you can reset the state after a successful submission
      setMethod("");
      // setMethodCode('');
      fetchMethodData();
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle error scenarios
    }
  };

  const fetchMethodData = useCallback(() => {
    axios
      .get(`${urllink}Masters/Get_All_Master_data?Type=MethodsMaster`)
      .then((response) => {
        const data = response.data;
        console.log("data", data);

        setMethodData(data);
      })
      .catch((error) => {
        console.error("Error fetching method data:", error);
      });
  }, [urllink]);

  const fetchMethodCodeData = useCallback(() => {
    axios
      .get(
        `${urllink}Masters/Get_All_Other_Masters_PrimaryCodes?Type=MethodsMaster`
      )
      .then((response) => {
        const data = response.data;
        console.log("data", data);

        setMethodCode(data.method_code);
      })
      .catch((error) => {
        console.error("Error fetching method data:", error);
      });
  }, [urllink]);

  React.useEffect(() => {
    fetchMethodData();
    fetchMethodCodeData();
  }, [fetchMethodData, fetchMethodCodeData]);

  const handleEdit = (row) => {
    setMethod(row.Method_Name);
    setMethodCode(row.Method_Code);
    setIsEditMode(true);
    setSelectedMethodId(row.method_id); // Assuming `method_id` is the identifier
  };

  const handleUpdateMethod = async () => {
    try {
      const response = await axios.post(
        `${urllink}Masters/Insert_All_Other_Masters`,
        {
          method: method,
          methodcode: methodcode,
          Type: "MethodsMaster",
          createdby: userRecord?.username,
        }
      );
      console.log(response.data);
      

      if (response.data.success){
        successMsg(response.data.message);
      } else{
        userwarn(response.data.message);
      }

      fetchMethodCodeData();
      setMethod("");
      // setMethodCode('');
      setIsEditMode(false);
      setSelectedMethodId(null);
      fetchMethodData();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const methodscolumns = [
    {
      key: "id",
      name: "S.No",
      width: 70,
    },
    // {
    //   key: "Method_Code",
    //   name: "Method Code",
    // },
    {
      key: "Method_Name",
      name: "Method Name",
      width: 500,
    },
    {
      key: "EditAction",
      name: "Action",
      renderCell: (params) => (
        <p
          onClick={() => handleEdit(params.row)}
          style={{ width: "130px", textAlign: "center", cursor: "pointer" }}
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
    if (Array.isArray(methodData)) {
      const lowerCaseNameQuery = searchQuery.toLowerCase();
      const filteredData = methodData.filter((row) => {
        const lowerCasePatientName = row?.Method_Name
          ? row.Method_Name.toLowerCase()
          : "";
        return lowerCasePatientName.includes(lowerCaseNameQuery);
      });
      // console.log(filteredData)
      setFilteredRows(filteredData);
    } else {
      // Handle the case where ageData is not an array
      setFilteredRows([]);
    }
  }, [searchQuery, methodData]);

  return (
    <>
      <div className="appointment">
        <h2 style={{ textAlign: "center" }}>Methods Master</h2>
        <br />
        <div className="RegisFormcon">
          <div className="RegisForm_1">
            <label htmlFor="input">
              Method Code <span>:</span>
            </label>
            <input
              type="text"
              id="FirstName"
              name="roleName"
              value={methodcode}
              disabled
              onChange={(e) => setMethodCode(e.target.value)}
            />
          </div>
          <div className="RegisForm_1">
            <label htmlFor="input">
              Method Name <span>:</span>
            </label>
            <input
              type="text"
              id="FirstName"
              name="roleName"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              placeholder="Enter Method Name"
            />
          </div>
          <button
            className="RegisterForm_1_btns"
            onClick={isEditMode ? handleUpdateMethod : handleSubmitMethods}
          >
            {isEditMode ? "Update" : <AddIcon />}
          </button>
        </div>
        <br />
        <div style={{ width: "100%", display: "grid", placeItems: "center" }}>
          <div className="con_1 ">
            <div className="inp_1">
              <label htmlFor="input">
                Method Name <span>:</span>
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e, "name")}
                placeholder="Search Methods"
              />
            </div>
          </div>
        </div>

        <div className="Main_container_app">
          <ReactGrid columns={methodscolumns} RowData={filteredRows} />
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

export default Methods;
