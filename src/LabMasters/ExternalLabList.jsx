import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
// import "./Neww.css";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { ToastContainer, toast } from "react-toastify";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import EditNoteIcon from '@mui/icons-material/EditNote';



const ExternalLabList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [summa, setsumma] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [refresh, setrefersh] = useState(false)

  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const dispatchValue = useDispatch();

  const fetch_externallab_list = useCallback(() => {
    axios
      .get(`${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=ExternalLabMaster`)
      .then((response) => {
        console.log(response);
        const data = response.data.map((row) => ({
          id: row.S_No,
          ...row,
        }));
        setsumma(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [urllink, refresh]);

  useEffect(() => {
    fetch_externallab_list();
  }, [fetch_externallab_list, refresh]);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filteredData = summa.filter((row) => {
      const lowerCaseSupplierName = row.Lab_Name
        ? row.Lab_Name.toLowerCase()
        : "";
      return lowerCaseSupplierName.includes(lowerCaseQuery);
    });
    setFilteredRows(filteredData);
  }, [searchQuery, summa]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlenavigate = () => {
    dispatchValue({ type: "LabEditData", value: {} });
    navigate("/Home/ExternalLab");
  };

  const handleEditClick = (params) => {
    console.log(params);
    axios
      .get(
        `${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET?Labcode=${params.LabCode}&Type=ExternalLabMaster`
      )
      .then((res) => {
        const dispatchdata =  res.data[0]
        console.log("kkkk",dispatchdata);
        dispatchValue({ type: "LabEditData", value: dispatchdata });
        navigate("/Home/ExternalLab");
      })
      .catch((err) => {
        console.error(err);
      });
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
        `${urllink}Masters/Update_All_Masters_Status_update?Labcode=${params.LabCode}&newstatus=${newstatus}&Type=ExternalLabMaster`
      )
      .then((res) => {
        console.log(res);
        successMsg(res.data.message);
        setrefersh(prv=>(
          !prv
        ))
        fetch_externallab_list();
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

  const ExternalLabListcolumns = [
    {
      key: "id",
      name: "S.No",
      width: 70,
      frozen: true,
    },
    {
      key: "LabName",
      name: "Lab Name",
      width: 300,
      frozen: true,
    },
    {
      key: "PhoneNo",
      name: "Phone No",
    },
    {
      key: "Location",
      name: "Location",
    },
    {
      key: "SourceType",
      name: "Source",
    },
    {
      key: "Status",
      name: "Status",
      width: 70,
      renderCell: (params) => (
        <Button onClick={() => hadleeditstatus(params.row)}>
          <span style={{ color: "black" }}>{params.row.Status}</span>
        </Button>
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
          <h4>Lab List</h4>
        </div>
        <br />

        <div className="con_1 ">
          <div className="inp_1">
            <label htmlFor="input">
              Lab Name <span>:</span>
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Enter Lab Name"
            />
          </div>
          <button
            className="RegisterForm_1_btns"
            type="submit"
            onClick={handlenavigate}
          >
            <AddCircleOutlineIcon />
          </button>
        </div>
        <div className="Main_container_app">
          <ReactGrid columns={ExternalLabListcolumns} RowData={filteredRows} />
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ExternalLabList;

