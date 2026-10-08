import React, { useEffect, useState ,useCallback} from "react";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";



const EmployeeList = () => {
  const dispatchvalue = useDispatch();
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery1, setSearchQuery1] = useState("");
  const urllink = useSelector((state) => state.userRecord?.UrlLink);

  const [filteredRows, setFilteredRows] = useState([]);
  console.log(filteredRows);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const totalPages = Math.ceil(filteredRows.length / pageSize);

  const paginatedData = filteredRows.slice(page * pageSize, (page + 1) * pageSize);


  console.log(userRecord);
  const [rows, setRows] = useState([]);




  const fetchemployeelist = useCallback(() => {
    axios
      .get(
        `${urllink}HRmanagement/get_employee_personaldetails_forlist?location=${userRecord?.location}`
      )
      .then((response) => {
        console.log(response.data);
        const data = response.data;
        setRows(
          data.map((row) => ({
            id: row.EmployeeID,
            ...row
          }))
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, [urllink, userRecord?.location]);

  useEffect(() => {
    fetchemployeelist()
  }, [fetchemployeelist]);


  const navigate = useNavigate();

  const handleList = (params) => {
    console.log(params);
    axios
      .get(
        `${urllink}HRmanagement/get_for_employeeprofile?employeeid=${params.EmployeeID}&location=${userRecord?.location}`
      )
      .then((response) => {
        console.log(response.data);
        dispatchvalue({ type: "foremployeedata", value: response.data });
      })
      .catch((error) => {
        console.log(error);
      });

    navigate("/Home/Employee-Profile");
  };


  const handleEditList = (params) => {
    console.log(params)
    axios
      .get(
        `${urllink}HRmanagement/getfor_employeeedit?employeeid=${params.EmployeeID}`
      )
      .then((response) => {
        console.log(response.data);
        dispatchvalue({ type: "foremployeeedit", value: response.data });
        navigate("/Home/Employee-Register");
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const handleSearchChange = (event) => {
    const { id, value } = event.target;

    if (id === "FirstName") {
      setSearchQuery(value);
    } else if (id === "PhoneNo") {
      setSearchQuery1(value);
    }
  };

  useEffect(() => {
    const filteredData = rows.filter((row) => {
      const lowerCaseSupplierName = row.EmployeeName.toLowerCase();
      const lowerCasePhoneNo = row.PhoneNumber.toString();

      const matchesFirstName = lowerCaseSupplierName.includes(
        searchQuery.toLowerCase()
      );
      const matchesPhoneNo = lowerCasePhoneNo.includes(
        searchQuery1.toLowerCase()
      );

      return (
        (matchesFirstName || !searchQuery) &&
        (matchesPhoneNo || !searchQuery1)
      );
    });

    setFilteredRows(filteredData);
    setPage(0);
  }, [searchQuery, searchQuery1, rows]);


  const handlestatus = (params) => {
    console.log(params)

    let newstatus;

    if (params.EmployeeStatus === 'active') {
      newstatus = 'Inactive'
    } else if (params.EmployeeStatus === 'Inactive') {
      newstatus = 'active'
    }


    axios.post(`${urllink}HRmanagement/update_employeestatus?newstatus=${newstatus}&Employeeid=${params.EmployeeID}`)
      .then((res) => {
        console.log(res)
        fetchemployeelist()
      })
      .catch((err) => {
        console.error(err);

      })
  }

  return (
    <div className="appointment">
      <div className="h_head">
        <h4>Employee List</h4>
      </div>

      <div className="con_1 ">
        <div className="inp_1">
          <label htmlFor="input">
            Employee Name <span>:</span>
          </label>
          <input
            type="text"
            id="FirstName"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Enter the First Name"
          />
        </div>
        <div className="inp_1">
          <label htmlFor="input">
            Phone No <span>:</span>
          </label>
          <input
            type="number"
            id="PhoneNo"
            value={searchQuery1}
            onChange={handleSearchChange}
            placeholder="Enter the Phone No"
          />
        </div>
      </div>
      <div className="Selected-table-container">
        <table className="selected-medicine-table2">
          <thead>
            <tr>
              <th id="slectbill_ins">Employee ID</th>
              <th id="slectbill_ins">Employee Photo</th>
              <th id="slectbill_ins">Employee Name</th>
              <th id="slectbill_ins">Phone No</th>
              <th id="slectbill_ins">Designation</th>
              <th id="slectbill_ins">Status</th>
              <th id="slectbill_ins">Profile</th>
              <th id="slectbill_ins">Edit</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((employee, index) => (
              <tr key={index}>
                <td>{employee.EmployeeID}</td>
                <td>
                  <img
                    src={employee.EmployeePhoto}
                    style={{
                      height: "50px",
                      width: "50px",
                      borderRadius: "100px",
                    }}
                    alt={employee.EmployeeName}
                  />
                </td>
                <td>{employee.EmployeeName}</td>
                <td>{employee.PhoneNumber}</td>
                <td>{employee.Designation}</td>
                <td>
                  <button
                    onClick={() => handlestatus(employee)}
                    className="Addnamebtn_pt2"
                  >
                    {employee.EmployeeStatus}
                  </button>
                </td>
                <td>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleList(employee)}
                    startIcon={<VisibilityIcon />}
                  >
                    View
                  </Button>
                </td>
                <td>
                  <Button
                    variant="contained"
                    color="warning"
                    size="small"
                    onClick={() => handleEditList(employee)}
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="grid_foot">
          <button
            onClick={() =>
              setPage((prevPage) => Math.max(prevPage - 1, 0))
            }
            disabled={page === 0}
          >
            Previous
          </button>
          Page {page + 1} of {totalPages}
          <button
            onClick={() =>
              setPage((prevPage) =>
                Math.min(prevPage + 1, totalPages - 1)
              )
            }
            disabled={page === totalPages - 1}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
