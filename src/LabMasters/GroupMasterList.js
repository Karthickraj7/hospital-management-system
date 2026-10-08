import React, { useState, useEffect, useCallback } from "react";
import "./GroupMaster.css";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ToastContainer, toast } from "react-toastify";
import EditNoteIcon from '@mui/icons-material/EditNote';



function GroupMasterList() {
  const urllink = useSelector((state) => state.userRecord?.UrlLink);

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryCode, setSearchQueryCode] = useState("");
  const [value, setValue] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [selectedrow, setSelectedrow] = useState([]);
  // const [isEditMode, setIsEditMode] = useState(false);
  const dispatchvalue = useDispatch();
  const [selctedgrouptestlist, setselctedgrouptestlist] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);

  const handleSearchChangeCode = (event) => {
    setSearchQueryCode(event.target.value);
  };

  const fetchgroup_masterlist = useCallback(() => {
    axios
      .get(`${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=GroupMaster`)
      .then((response) => {
        console.log(response.data);
        const data = response.data.map((row) => ({
          id: row.group_master_id,
          ...row,
        }));
        setValue(data);
      })
      .catch((error) => {
        console.error("Error fetching test description data:", error);
      });
  }, [urllink]);

  useEffect(() => {
    fetchgroup_masterlist();
  }, [fetchgroup_masterlist]);

  const handleEditClick = (params) => {
    console.log(params);

    setSelectedrow((updatedRow) => {
      // Set isEditMode to true and include the original row
      const updatedRowWithEditMode = { ...params, isEditMode: true };

      // Log the updatedRow
      console.log(updatedRowWithEditMode);

      // Dispatch the updatedRow
      dispatchvalue({ type: "GroupMasterEditData", value: updatedRowWithEditMode });
      console.log("dispatch", dispatchvalue);

      // Navigate to the Test Master component
      dispatchvalue({ type: "labnav", value: "GroupMaster" });

      // Return the updatedRow
      return updatedRowWithEditMode;
    });
  };

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const lowersearchQueryCode = searchQueryCode.toLowerCase();

    const filteredData = value.filter((row) => {
      const lowerCaseSupplierName = row.group_name
        ? row.group_name.toLowerCase()
        : "";
      const lowersearchQueryCode1 = row.group_code
        ? row.group_code.toLowerCase()
        : "";

      return (
        lowerCaseSupplierName.includes(lowerCaseQuery) &&
        lowersearchQueryCode1.includes(lowersearchQueryCode)
      );
    });
    setFilteredRows(filteredData);
  }, [searchQuery, value, searchQueryCode]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlenavigate = () => {
    dispatchvalue({ type: "GroupMaster", value: {} });
    dispatchvalue({ type: "labnav", value: "GroupMaster"});
  };

  const handleView = (row) => {
    console.log(row);
    setselctedgrouptestlist(row.GroupList);
    setOpenModal(true);
  };

  const handleclosemodal1 = () => {
    setOpenModal(false);
    // setCheckedTests([]);
  };

  console.log(selectedrow);

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
        `${urllink}Masters/Update_All_Masters_Status_update?Group_Code=${params.Group_Code}&newstatus=${newstatus}&Type=GroupMaster`
      )
      .then((res) => {
        console.log(res);
        successMsg(res.data.message);
        fetchgroup_masterlist();
      })

      .catch((err) => {
        console.error();
      });
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
      style: { marginTop: "50px" },
    });
  };

  const GroupMastercolumns = [
    {
      key: "id",
      name: "S.No",
      width: 70,
      frozen: true,
    },
    {
      key: "Group_Name",
      name: "Group Name",
      width: 300,
      frozen: true,
    },
    {
      key: "Gender",
      name: "Gender",
    },

    {
      key: "Amount",
      name: "Amount",
    },
    {
      key: "Status",
      name: "Status",
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
      key: "View",
      name: "View",
      width: 70,
      renderCell: (params) => (
        <p
          onClick={() => handleView(params.row)}
          style={{
            width: "130px",
            display: "flex",
            cursor: "pointer",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <VisibilityIcon />
        </p>
      ),
    },

    {
      key: "EditAction",
      name: "Action",
      width: 70,
      renderCell: (params) => (
        <Button
          onClick={() => handleEditClick(params.row)}

        >
          <EditNoteIcon />
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="appointment">
        <div className="h_head">
          <h4>Profile Master List</h4>
        </div>
        <br />

        <div className="con_1 ">
          <div className="inp_1">
            <label htmlFor="input">
              Group Name <span>:</span>
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Enter Group Name"
            />
          </div>
          <div className="inp_1">
            <label htmlFor="input">
              Group Code <span>:</span>
            </label>
            <input
              type="text"
              value={searchQueryCode}
              onChange={handleSearchChangeCode}
              placeholder="Enter Group Code"
            />
          </div>
          <button className="RegisterForm_1_btns"
            type="submit" onClick={handlenavigate}>
            <AddCircleOutlineIcon />
          </button>
        </div>

        <div className="Main_container_app">
          <ReactGrid columns={GroupMastercolumns} RowData={filteredRows} />
        </div>
      </div>
      {openModal && (
        <div
          className={
            isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
          }
          onClick={handleclosemodal1}
        >
          <div className="newwProfiles" onClick={(e) => e.stopPropagation()}>
            <br />
            <div className="appointment">
              <div className="h_head">
                <h4>Tests</h4>
              </div>

              <table className="selected-medicine-table2">
                <thead>
                  <tr>
                    <th width={70}>Sl No</th>
                    <th width={200}>Test Name</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(selctedgrouptestlist) &&
                    selctedgrouptestlist?.map((test, index) => (
                      <tr
                        key={index}
                        style={{
                          backgroundColor:
                            index % 2 === 1
                              ? "var(--selectbackgroundcolor)"
                              : "white",
                        }}
                      >
                        <td>{test.id}</td>
                        <td>
                          <span
                            style={{
                              display: "flex",
                              justifyContent: "left",
                              alignItems: "center",
                              fontSize: "15px",
                            }}
                          >
                            {test.test_name}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              <div className="Register_btn_con">
                <button
                  className="RegisterForm_1_btns"
                  onClick={handleclosemodal1}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
}
export default GroupMasterList;

