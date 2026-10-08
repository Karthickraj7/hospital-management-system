import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";

function DepartmentOrderMaster() {
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const [departmentrole, setDepartmentRole] = useState([]);
  const [orderDepartment, setOrderDepartment] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [orderId, setOrderId] = useState("");
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [SelectedDeptCode, setSelectedDeptCode] = useState("");
  useEffect(() => {
    const fetchSubDepartmentData = () => {
      axios
        .get(`${urllink}Masters/Get_All_Master_data?Type=SubMainDepartment`)
        .then((response) => {
          const data = response.data;
          setDepartmentRole(data);
        })
        .catch((error) => {
          console.error("Error fetching SubDepartment data:", error);
        });
    };

    fetchSubDepartmentData();
    fetchdepartmentorderdata();
  }, [urllink]);

  const fetchdepartmentorderdata = () => {
    axios
      .get(`${urllink}Masters/Get_All_Master_data?Type=DepartmentOrderMaster`)
      .then((response) => {
        console.log(response);
        const data = response.data;

        const data1 = data.sort((a, b) => {
          // Parse the OrderID as an integer to ensure proper numerical comparison
          const orderID_a = parseInt(a.OrderID, 10); // Use radix 10 for decimal parsing
          const orderID_b = parseInt(b.OrderID, 10); 
        
          // Ascending order by OrderID
          return orderID_a - orderID_b;
        });


        setOrderDepartment(data1);
      })
      .catch((error) => {
        console.error("Error fetching SubDepartment data:", error);
      });
  };

  useEffect(() => {
    // Filter out departments already in orderDepartment
    const usedDepartmentCodes = new Set(
      orderDepartment.map((order) => order.SubDepartment_Code)
    );
    const filtered = departmentrole.filter(
      (department) => !usedDepartmentCodes.has(department.SubDepartment_Code)
    );
    setFilteredDepartments(filtered);
  }, [departmentrole, orderDepartment]);

  const handleInputChange = (event) => {
    const { name, value, dataset } = event.target;

    if (name === "departmentname") {
      setSelectedDepartment(value);
      const selectedDept = filteredDepartments.find(
        (row) => row.SubDepartment_Name === value
      );
      if (selectedDept) {
        setSelectedDeptCode(selectedDept.SubDepartment_Code);
      }
    } else if (name === "OrderID") {
      setOrderId(value);
    }
  };

  const handleadddepartment = () => {
    const existingOrder = orderDepartment.find(
      (order) => order.OrderID === orderId
    );

    if (existingOrder) {
      const userConfirmed = window.confirm(
        `This Order ID is already assigned to department ${existingOrder.SubDepartment_Name}. Do you want to replace it?`
      );

      if (!userConfirmed) {
        return; // User canceled, do nothing
      }

      // Replace the department order
      const updatedOrderDepartment = orderDepartment.map((order) =>
        order.OrderID === orderId
          ? {
              ...order,
              SubDepartment_Name:
                departmentrole.find(
                  (dept) => dept.SubDepartment_Code === SelectedDeptCode
                )?.SubDepartment_Name || order.SubDepartment_Name,
              SubDepartment_Code: SelectedDeptCode,
            }
          : order
      );

      
      setOrderDepartment(updatedOrderDepartment);
      setSelectedDepartment("");
      setOrderId("");
      return;
    }

    const selectedDepartmentData = departmentrole.find(
      (dept) => dept.SubDepartment_Code === SelectedDeptCode
    );
    console.log(selectedDepartmentData);
    if (selectedDepartmentData && orderId) {
      const newDepartmentOrder = {
        id: orderDepartment.length + 1,
        OrderID: orderId,
        SubDepartment_Name: selectedDepartmentData.SubDepartment_Name,
        SubDepartment_Code: selectedDepartmentData.SubDepartment_Code,
        Type: "DepartmentOrderMaster",
        created_by: userRecord?.username,
      };

      console.log(newDepartmentOrder)
      setOrderDepartment([...orderDepartment, newDepartmentOrder]);
      setSelectedDepartment("");
      setOrderId("");
    }
  };

  console.log(orderDepartment)

  const handlesavedepartmentorder = () => {
    console.log(orderDepartment);
    axios
      .post(`${urllink}Masters/Insert_All_Other_Masters`, orderDepartment)
      .then((res) => {
        console.log(res.data);
        if (res.data.success === true) {
          successMsg(res.data.message);
        } else {
          userwarn(res.data.message);
        }
        alert("Data saved successfully");
        fetchdepartmentorderdata();
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to save data");
      });
  };

  const handleEditClick = (row) => {
    console.log(row)
    const { OrderID } = row;
    if (window.confirm("Do you want to update this")) {
      // Remove the department order
      const updatedOrderDepartment = orderDepartment.filter(
        (order) => order.OrderID !== OrderID
      );
      setOrderDepartment(updatedOrderDepartment);
      setSelectedDepartment(row.SubDepartment_Name);
      setSelectedDeptCode(row.SubDepartment_Code)
      setOrderId(row.OrderID);
    }
  };

  const columns = [
    // {
    //   key: "id",
    //   name: "S.No",
    //   width: 70,
    // },
    {
      key: "OrderID",
      name: "Order ID",
      width: 220,
    },
    {
      key: "SubDepartment_Name",
      name: "Department",
      // width: 280,
    },
    // {
    //   key: "SubDepartment_Code",
    //   name: "Department Code",
    // },
    {
      key: "EditAction",
      name: "Action",
      width: 90,
      renderCell: (params) => (
        <p
          onClick={() => handleEditClick(params.row)}
          className="newmasterbseiuhfuisehbutton"
        >
          <EditIcon />
        </p>
      ),
    },
  ];

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

  return (
    <div className="appointment">
      <div className="h_head">
        <h4>Department Order Master</h4>
      </div>
      <br />
      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label htmlFor="departmentname">
            Select Department<span>:</span>
          </label>
          <input
            name="departmentname"
            id="departmentname"
            list="departments"
            value={selectedDepartment}
            onChange={handleInputChange}
            autoComplete="off"
          />
          <datalist id="departments">
            {Array.isArray(filteredDepartments) &&
              filteredDepartments.map((department) => (
                <option
                  key={department.SubDepartment_Code}
                  value={department.SubDepartment_Name}
                >
                  {department.SubDepartment_Name}
                </option>
              ))}
          </datalist>
        </div>
        <div className="RegisForm_1">
          <label htmlFor="OrderID">
            Department OrderID <span>:</span>
          </label>
          <input
            type="text"
            name="OrderID"
            id="OrderID"
            value={orderId}
            onChange={handleInputChange}
            required
          />
        </div>
        <button className="RegisterForm_1_btns" onClick={handleadddepartment}>
          <AddCircleOutlineIcon />
        </button>
      </div>
      <br />
      {Array.isArray(orderDepartment) && orderDepartment.length > 0 && (
        <div className="Main_container_app">
          <ReactGrid columns={columns} RowData={orderDepartment} />
        </div>
      )}
      <div className="Register_btn_con">
        <button
          className="RegisterForm_1_btns"
          onClick={handlesavedepartmentorder}
        >
          Save{" "}
        </button>
        {/* <ToastContainer /> */}
      </div>
      <ToastContainer />
    </div>
  );
}

export default DepartmentOrderMaster;
