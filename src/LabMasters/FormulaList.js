import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineTwoToneIcon from "@mui/icons-material/DeleteOutlineTwoTone";

function FormulaList() {
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const [Formulas, setFormulas] = useState([]); // New state to store all submitted formulas
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);

  const fetchdata = useCallback(() => {
    axios
      .get(`${urllink}Masters/Get_All_Master_data?Type=FormulaMaster`)
      .then((res) =>
        setFormulas(res.data)
        // console.log(res)
      )
      .catch((err) => console.error(err));
  }, [urllink]);

  useEffect(() => {
    fetchdata();
  }, [fetchdata]);

  const handleEdit = (params) => {
    console.log(params);
    dispatchvalue({ type: "forEditFormula", value: params });
    navigate("/Home/FormulaMaster");
  };

  const handleSearchChange = (event, type) => {
    const value = event.target.value;
    if (type === "name") {
      setSearchQuery(value);
    }
  };

  const handlenavigate = () => {
    dispatchvalue({ type: "forEditFormula", value: {} });
    navigate("/Home/FormulaMaster");
  };

  useEffect(() => {
    // console.log(ageData)
    if (Array.isArray(Formulas)) {
      const lowerCaseNameQuery = searchQuery.toLowerCase();
      const filteredData = Formulas.filter((row) => {
        const lowerCasePatientName = row?.Test_Name
          ? row.Test_Name.toLowerCase()
          : "";
        return lowerCasePatientName.includes(lowerCaseNameQuery);
      });
      // console.log(filteredData)
      setFilteredRows(filteredData);
    } else {
      // Handle the case where ageData is not an array
      setFilteredRows([]);
    }
  }, [searchQuery, Formulas]);

  const removetheresultvalue = (params) => {
    console.log(params);

    const conmsg = window.confirm(
      `Are You Sure ! You Want Remove the Formula For this Test - ${params?.Test_Name}`
    );
    if (conmsg) {
      axios
        .post(
          `${urllink}Masters/Update_All_Masters_Status_update?Test_Code=${params?.Test_Code}&Type=FormulaMaster`
        )
        .then((response) => {
          console.log(response);
          fetchdata();
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      return;
    }
  };

  const FormulaDatacolumns = [
    { key: "id", name: "S.No", width: 70 },
    { key: "Test_Name", name: "Test Name"},
    { key: "displayformula", name: "Formula" },
    {
      key: "EditAction",
      name: "Action",
      width: 70,
      renderCell: (params) => (
        <p onClick={() => handleEdit(params.row)}  className="newmasterbseiuhfuisehbutton">
          <EditIcon />
        </p>
      ),
    },
    {
      key: "DeleteAction",
      name: "Remove",
      width: 90,
      renderCell: (params) => (
        <p
          onClick={() => removetheresultvalue(params.row)}
           className="newmasterbseiuhfuisehbutton"
        >
          <DeleteOutlineTwoToneIcon />
        </p>
      ),
    },
  ];

  return (
    <div className="appointment">
      <div className="h_head">
        <h4>List Of Formula's</h4>
      </div>
      <br />

      <div style={{ width: "100%", display: "grid", placeItems: "center" }}>
        <div className="con_1 ">
          <div className="inp_1">
            <label htmlFor="input">
              Test Name <span>:</span>
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e, "name")}
              placeholder="Enter Test Name"
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
      </div>
      <br />
      <div className="Main_container_app">
        <ReactGrid columns={FormulaDatacolumns} RowData={filteredRows} />
      </div>
    </div>
  );
}

export default FormulaList;
