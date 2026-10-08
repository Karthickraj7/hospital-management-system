// import React from "react";
import React, { useState } from "react";
// import '../Pettycash/Pettycash.css';
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import { ToastContainer, toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from "react-redux";
function AssetType() {
  const urllink=useSelector(state=>state.userRecord?.UrlLink)

  const [assetData, setAssetData] = useState([]);
  const [assetType, setAssetType] = useState("");
  const [assetCode, setAssetCode] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedMethodId, setSelectedMethodId] = useState(null);

  const handleSubmitAsset = async () => {
    try {
      // Make a POST request to your Django backend endpoint
      const response = await axios.post(
        `${urllink}mainddepartment/insertasset`,
        {
          assetType,
          assetCode,
        }
      );

      // Handle the response as needed
      console.log(response.data);

      // Optionally, you can reset the state after a successful submission
      setAssetType("");
      setAssetCode("");
      fetchAssetData();
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle error scenarios
    }
  };
  React.useEffect(() => {
    fetchAssetData();
  }, []);
  const fetchAssetData = () => {
    axios
      .get(`${urllink}mainddepartment/getasset`)
      .then((response) => {
        const data = response.data;
        console.log("data", data);

        setAssetData(data);
      })
      .catch((error) => {
        console.error("Error fetching asset data:", error);
      });
  };
  // const handleEdit = (row) => {
  //   // setMethod(row.method_name);
  //   // setMethodCode(row.method_code);
  //    setAssetType(row.asset_type);
  //     setAssetCode(row.asset_code);
  //   setIsEditMode(true);
  //   setSelectedMethodId(row.asset_id); // Assuming `method_id` is the identifier
  // };
  const handleEdit = (row) => {
    setAssetType(row.asset_type);
    setAssetCode(row.asset_code);
    setIsEditMode(true);
    setSelectedMethodId(row.asset_id); // Assuming `asset_id` is the identifier
  };

  const handleUpdateMethod = async () => {
    try {
      const response = await axios.post(
        `${urllink}mainddepartment/updateasset`,
        {
          method_id: selectedMethodId,
          method_name: assetType,
          method_code: assetCode,
        }
      );
      console.log(response.data);
      // setMethod('');
      // setMethodCode('');
      setAssetType("");
      setAssetCode("");
      setIsEditMode(false);
      setSelectedMethodId(null);
      fetchAssetData();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  return (
    <div className="appointment">
      <div className="h_head">
        <h4>AssetType</h4>
      </div>

      <div className="ShiftClosing_Container">
        <div className="FirstpartOFExpensesMaster">
          <h2 style={{ textAlign: "center" }}></h2>
          <div className="con_1 ">
            <div className="inp_1">
              <label htmlFor="input" style={{ whiteSpace: "nowrap" }}>
                Asset Type :
              </label>
              {/* <label htmlFor="assetType" >
              Asset Type Name<span>:</span>
            </label> */}
              <input
                type="text"
                id="assetType"
                name="assetType"
                value={assetType}
                onChange={(e) => setAssetType(e.target.value)}
                placeholder="Enter Asset Type"
                style={{ width: "150px" }}
              />
            </div>
            <div className="inp_1">
              <label htmlFor="input" style={{ whiteSpace: "nowrap" }}>
                Asset Code :
              </label>
              <input
                type="text"
                id="assetCode"
                name="assetCode"
                value={assetCode}
                onChange={(e) => setAssetCode(e.target.value)}
                placeholder="Enter Asset Code"
                style={{ width: "150px" }}
              />
            </div>

            {/* <div className='Register_btn_con'> */}

            {/* <button className='RegisterForm_1_btns'onClick={h}>Save</button> */}
            <button
              className="btn_1"
              onClick={isEditMode ? handleUpdateMethod : handleSubmitAsset}
            >
              {isEditMode ? "Update" : <AddIcon />}
            </button>
          </div>

          <div style={{ width: "100%", display: "grid", placeItems: "center" }}>
            <h4>Table</h4>

            <div className="Selected-table-container ">
              <table className="selected-medicine-table2 ">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Asset Type Name</th>
                    <th>Asset Code </th>
                    <th>Edit</th>
                    {/* <th >Status</th> */}
                  </tr>
                </thead>
                <tbody>
                  {assetData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.asset_id}</td>
                      <td>{row.asset_type}</td>
                      <td>{row.asset_code}</td>
                      <td>
                        <button onClick={() => handleEdit(row)}>
                          <EditIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AssetType;
