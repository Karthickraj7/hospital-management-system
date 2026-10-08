import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import "./Department.css";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";

function Department() {
  const urllink = useSelector((state) => state.userRecord?.UrlLink);

  const [departmentrole, setDepartmentRole] = useState([]);

  const [roleData, setRoleData] = React.useState([]);
  const [mainDepartmentName, setMainDepartmentName] = useState("");
  const [mainDepartmentCode, setMainDepartmentCode] = useState("");
  const [subdepartment, setSubDepartment] = useState("");
  const [subdepartmentCode, setSubDepartmentCode] = useState("");
  const [selectdept, setSelectdept] = useState("");
  const [isedit, setisedit] = useState(false);
  const [isedit1, setisedit1] = useState(false);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [SelectedDeptCode, setSelectedDeptCode] = useState("");

  const handleSubmitMainDepartment = async () => {
    if (!mainDepartmentName.trim() || !mainDepartmentCode.trim()) {
      if (!mainDepartmentName) {
        userwarn("Both DepartmentName are required.");
      } else if (!mainDepartmentCode) {
        userwarn("Both DepartmentCode are required.");
      } else {
        userwarn("Both DepartmentName and DepartmentCode are required.");
      }

      return; // Exit the function early if validation fails
    }
    try {
      const createdby = userRecord?.username;
      const Type = "MainDepartment";
      // Make a POST request to your Django backend endpoint
      const response = await axios.post(
        `${urllink}Masters/Insert_All_Other_Masters`,
        {
          mainDepartmentName,
          mainDepartmentCode,
          createdby,
          Type,
        }
      );
      console.log(response);

      // Handle the response as needed
      fetchDepartmentCodeData("");
      // Optionally, you can reset the state after a successful submission
      // setMainDepartmentName("");
      fetchDepartmentData();
      setisedit(false);
      successMsg(response.data.message);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const fetchDepartmentCodeData = useCallback(() => {
    axios
      .get(
        `${urllink}Masters/Get_All_Other_Masters_PrimaryCodes?Type=MainDepartment`
      )
      .then((res) => {
        setMainDepartmentCode(res.data.department_code);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [urllink]); // Empty dependency array to memoize the function

  const fetchSubDepartmentCodeData = useCallback(() => {
    axios
      .get(
        `${urllink}Masters/Get_All_Other_Masters_PrimaryCodes?Type=SubMainDepartment`
      )
      .then((res) => {
        setSubDepartmentCode(res.data.Subdepartment_code);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [urllink]); // Empty dependency array to memoize the function

  useEffect(() => {
    fetchDepartmentCodeData();
    fetchSubDepartmentCodeData();
  }, [fetchDepartmentCodeData, fetchSubDepartmentCodeData]); // Now these are stable dependencies

  const handleSubmitSubDepartment = async () => {
    if (
      !subdepartment.trim() ||
      !subdepartmentCode.trim() ||
      !selectdept.trim() ||
      !SelectedDeptCode
    ) {
      if (!SelectedDeptCode) {
        userwarn("Main Department are Mandatory. Select Main Department");
      } else if (!subdepartment) {
        userwarn("DepartmentName are Mandatory.");
      } else {
        userwarn(" Both Maindepartment and Department are required.");
      }

      return; // Exit the function early if validation fails
    }
    try {
      const createdby = userRecord?.username;
      const Type = "SubMainDepartment";
      // Make a POST request to your Django backend endpoint
      const response = await axios.post(
        `${urllink}Masters/Insert_All_Other_Masters`,
        {
          subdepartment,
          subdepartmentCode,
          selectdept,
          createdby,
          Type,
          SelectedDeptCode,
        }
      );
      console.log(response);

      // Handle the response as needed
      fetchSubDepartmentCodeData("");
      setSubDepartment("");
      fetchSubDepartmentData();
      fetchSubDepartmentData();
      // setSelectedDeptCode("");
      setisedit1(false);
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle error scenarios
    }
  };

  const fetchDepartmentData = useCallback(() => {
    axios
      .get(`${urllink}Masters/Get_All_Master_data?Type=MainDepartment`)
      .then((response) => {
        const data = response.data;
        console.log(response);
        setRoleData(data);
      })
      .catch((error) => {
        console.error("Error fetching Department data:", error);
      });
  }, [urllink]);

  const fetchSubDepartmentData = useCallback(() => {
    axios
      .get(`${urllink}Masters/Get_All_Master_data?Type=SubMainDepartment`)
      .then((response) => {
        const data = response.data;

        setDepartmentRole(data);
      })
      .catch((error) => {
        console.error("Error fetching SubDepartment data:", error);
      });
  }, [urllink]);

  React.useEffect(() => {
    fetchSubDepartmentData();
    fetchDepartmentData();
  }, [fetchSubDepartmentData, fetchDepartmentData]);

  const handleEdit = (row) => {
    console.log(row);
    setMainDepartmentCode(row?.Department_Code);
    setMainDepartmentName(row?.Department_Name);
    setisedit(true);
  };

  const handleEdit1 = (row) => {
    console.log(row);
    setSelectdept(row.MainDepartment_Name);
    setSubDepartmentCode(row.SubDepartment_Code);
    setSubDepartment(row.SubDepartment_Name);
    setisedit1(true);
    setSelectedDeptCode(row?.department_id);
  };

  const hadleeditstatus = (params) => {
    console.log(params);

    let newstatus;
    if (params.Status === "Active") {
      newstatus = "Inactive";
    } else if (params.Status === "Inactive") {
      newstatus = "Active";
    }

    axios
      .post(
        `${urllink}Masters/Update_All_Masters_Status_update?department_code=${params.Department_Code}&newstatus=${newstatus}&Type=MainDepartment`
      )
      .then((res) => {
        console.log(res);
        successMsg(res.data.message);
        fetchDepartmentData();
      })

      .catch((err) => {
        console.error();
      });
  };

  const hadleeditstatus1 = (params) => {
    console.log(params);

    let newstatus;
    if (params.Status === "Active") {
      newstatus = "Inactive";
    } else if (params.Status === "Inactive") {
      newstatus = "Active";
    }

    axios
      .post(
        `${urllink}Masters/Update_All_Masters_Status_update?subdepartment_code=${params.SubDepartment_Code}&newstatus=${newstatus}&Type=SubMainDepartment`
      )
      .then((res) => {
        console.log(res);
        successMsg(res.data.message);
        fetchSubDepartmentData();
      })

      .catch((err) => {
        console.error();
      });
  };

  const Maindepartmentcolumns = [
    {
      key: "id",
      name: "S.No",
      frozen: true,
      width: 100
    },
    {
      key: "Department_Name",
      name: "Department",
    },
    {
      key: "Status",
      name: "Status",
      width: 150,
      renderCell: (params) =>
        params.row.Status === "Inactive" ? (
          <Button onClick={() => hadleeditstatus(params.row)}>
            <span style={{ color: "red" }}>{params.row.Status}</span>
          </Button>
        ) : (
          <Button onClick={() => hadleeditstatus(params.row)}>
            <span style={{ color: "black" }}>{params.row.Status}</span>
          </Button>
        ),
    },
    {
      key: "EditAction",
      name: "Action",
      width: 150,
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

  console.log(departmentrole);

  const SubMaindepartmentcolumns = [
    {
      key: "id",
      name: "S.No",
      width: 70,
    },
    {
      key: "MainDepartment_Name",
      name: "Main Department",
      width: 200,
    },
    {
      key: "SubDepartment_Name",
      name: "Department",
      width: 350,
    },
    {
      key: "Status",
      name: "Status",
      renderCell: (params) =>
        params.row.Status === "Inactive" ? (
          <Button onClick={() => hadleeditstatus1(params.row)}>
            <span style={{ color: "red" }}>{params.row.Status}</span>
          </Button>
        ) : (
          <Button onClick={() => hadleeditstatus1(params.row)}>
            <span style={{ color: "black" }}>{params.row.Status}</span>
          </Button>
        ),
    },
    {
      key: "EditAction",
      name: "Action",
      renderCell: (params) => (
        <Button
          size="small"
          onClick={() => handleEdit1(params.row)}
          startIcon={<EditIcon />}
        ></Button>
      ),
    },
  ];

  const handleDepartmentChange = (e) => {
    const selectedDeptName = e.target.value;
    setSelectdept(selectedDeptName);

    // Find the corresponding Department_Code based on the selected Department_Name
    const selectedDept = roleData.find(
      (row) => row.Department_Name === selectedDeptName
    );
    if (selectedDept) {
      setSelectedDeptCode(selectedDept.Department_Code);
    }
  };

  const successMsg = (message) => {
    toast.success(message, {
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
  const errmsg = (error) => {
    toast.error(error, {
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

  return (
    <>
      <div className="appointment">
        <br />
        <div className="ShiftClosing_Contadiner">
          <h2 style={{ textAlign: "center" }}>Main Department</h2>
          <div style={{ width: "100%", display: "grid", placeItems: "center" }}>
            <div className="con_1 ">
              <div className="inp_1">
                <label htmlFor="input">
                  {" "}
                  Department Code <span>:</span>
                </label>
                <input
                  type="text"
                  id="MainDepartmentCode"
                  name="MainDepartmentCode"
                  value={mainDepartmentCode}
                  disabled
                  onChange={(e) => setMainDepartmentCode(e.target.value)}
                  placeholder="Main Department Code"
                />
              </div>
              <div className="inp_1">
                <label htmlFor="input">
                  Department <span className="mandatory"></span> <span>:</span>
                </label>

                <input
                  type="text"
                  id="MainDepartmentName"
                  name="MainDepartmentName"
                  value={mainDepartmentName}
                  onChange={(e) => setMainDepartmentName(e.target.value)}
                  placeholder="Main Department Name"
                />
              </div>

              <button
                className="RegisterForm_1_btns"
                onClick={handleSubmitMainDepartment}
              >
                {isedit ? "Update" : <AddIcon />}
              </button>
            </div>
          </div>

          <div className="Main_container_app">
            <ReactGrid columns={Maindepartmentcolumns} RowData={roleData} />
          </div>
        </div>

        <div className="ShiftClosing_Container">
          <h2 style={{ textAlign: "center" }}>Department</h2>
          <div style={{ width: "100%", display: "grid", placeItems: "center" }}>
            <div className="con_1 ">
              <div className="inp_1">
                <label htmlFor="input" RegisForm_1>
                  Main Department <span className="mandatory"></span><span>:</span>
                </label>
                <select
                  name="department"
                  value={selectdept}
                  onChange={handleDepartmentChange} // Use the handleDepartmentChange function
                  className="deprtsele"
                  required
                >
                  <option value="select">Select </option>
                  {roleData.map((row, index) => (
                    <option
                      key={row.Department_Code}
                      value={row.Department_Name}
                    >
                      {row.Department_Name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="inp_1">
                <label htmlFor="input">
                  Department Code <span>:</span>
                </label>
                <input
                  type="text"
                  id="FirstName"
                  name="roleName"
                  value={subdepartmentCode}
                  disabled
                  onChange={(e) => setSubDepartmentCode(e.target.value)}
                  placeholder="Enter Department Code"
                />
              </div>
            </div>
            <div className="con_1 ">
              <div className="inp_1">
                <label htmlFor="input">
                  Department <span className="mandatory"></span> <span>:</span>
                </label>
                <input
                  type="text"
                  id="FirstName"
                  name="roleName"
                  value={subdepartment}
                  onChange={(e) => setSubDepartment(e.target.value)}
                  placeholder="Enter Department Name"
                />
              </div>

              <button
                className="RegisterForm_1_btns"
                onClick={handleSubmitSubDepartment}
              >
                {isedit1 ? "Update" : <AddIcon />}
              </button>
            </div>
          </div>
          <div className="Main_container_app">
            <ReactGrid
              columns={SubMaindepartmentcolumns}
              RowData={departmentrole}
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Department;
