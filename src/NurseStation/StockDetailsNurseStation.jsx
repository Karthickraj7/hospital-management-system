import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { formatunderscoreLabel } from "../OtherComponent/OtherFunctions";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

function StockDetailsNurseStation() {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const UserData = useSelector((state) => state.userRecord?.UserData);

    const dispatchvalue = useDispatch();

  
  const [NurseStockData, setNurseStockData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [rowDataState, setRowDataState] = useState({});
  const [searchQuery, setsearchQuery] = useState({
    NurseStation: UserData?.NurseStationid || "",
    Location: "",
    ItemCode: "",
    ItemName: "",
    ProductCategory: "",
    SubCategory: "",
  });
  console.log(searchQuery);

  const [summaArray1, setsummaArray1] = useState([]);
  const [summaArray2, setsummaArray2] = useState([]);
  const [summaArray3, setsummaArray3] = useState([]);
  const [summaArray4, setsummaArray4] = useState([]);
  const [summaArray5, setsummaArray5] = useState([]);
  console.log("summaArray5", summaArray5);
  const [NurseStationData, setNurseStationData] = useState([]);

  const [NSItems,setNSItems] = useState([]);
  console.log(NSItems,'NSItems')
  
  const [SelectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(null);
    setSelectedFile(event.target.files[0]);
  };
  const handleCsvupload = () => {
    console.log(SelectedFile);
    const formData = new FormData();
    formData.append("file", SelectedFile);
    formData.append("created_by", UserData?.username);

    if (SelectedFile) {
      axios
        .post(`${UrlLink}NurseStation/NurseStation_Stock_Excel_File_Upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          console.log(response);
          setSelectedFile(null);

          let data = response.data;

          let type = Object.keys(data)[0]
          let mess = Object.values(data)[0]
          const tdata = {
            message: mess,
            type: type
          }
          dispatchvalue({ type: 'toast', value: tdata })

          

        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });
    } else {
      // userwarn("Choose File");
    }
  };

  const handleonchange = (e) => {
    const { name, value } = e.target;
    if (name === "ProductCategory") {
      setsearchQuery((prev) => ({
        ...prev,
        [name]: value,
        SubCategory: "",
      }));
    } else if (name === "Location") {
      setsearchQuery((prev) => ({
        ...prev,
        [name]: value,
      }));
    }else if (name === "NurseStation") {
      setsearchQuery((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setsearchQuery((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/NurseStationData`)
      .then((hash) => {
        setNurseStationData(hash.data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(`${UrlLink}Masters/Location_Detials_link`)
      .then((res) => {
        const ress = res.data;
        setsummaArray1(ress);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(`${UrlLink}Inventory/Product_Category_Product_Details_link`)
      .then((res) => {
        const ress = res.data;
        setsummaArray3(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  useEffect(() => {
    if (searchQuery.ProductCategory) {
      axios
        .get(
          `${UrlLink}Masters/SubCategory_Master_link?ProductCategory=${searchQuery.ProductCategory}`
        )
        .then((res) => {
          const ress = res.data;
          setsummaArray4(ress);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setsummaArray4([]);
    }
  }, [UrlLink, searchQuery.ProductCategory]);

  useEffect(() => {
    axios
      .get(`${UrlLink}NurseStation/get_stockDetails_for_nursestation`, { params: searchQuery })
      .then((response) => {
        const dataWithState = response.data.map((item) => ({
          ...item,
          checked: false, // Initial state for checkbox
          remarks: "", // Initial state for remarks
        }));
        setNurseStockData(dataWithState);
        setFilteredData(dataWithState);
       const items = response.data.map((item) => ({
          ItemName: item.ItemName,
          ItemCode: item.ItemCode
        }));

        setNSItems(items)


      })
      .catch((err) => console.log(err));
  }, [UrlLink, searchQuery]);

  // Handle filtering based on ItemName
  const handleFilterChange = (event) => {
    const value = event.target.value.toLowerCase();
    setFilterText(value);
    setFilteredData(
      NurseStockData.filter((item) =>
        item.ItemName.toLowerCase().includes(value)
      )
    );
  };

  // Handle checkbox change for a specific row
  const handleCheckboxChange = (id) => {
    setFilteredData((prevData) =>
      prevData.map((row) =>
        row.id === id ? { ...row, checked: !row.checked } : row
      )
    );
  };

  // Handle remarks input change for a specific row
  const handleRemarksChange = (id, event) => {
    const value = event.target.value;
    setFilteredData((prevData) =>
      prevData.map((row) => (row.id === id ? { ...row, remarks: value } : row))
    );
  };

  const NursestationColumns = [
    { key: "Sno", name: "S.No", frozen: true },
    {
      key: "ItemName",
      name: "Item Name",
      filter: true,
      type: "input-text",
      frozen: true,
    },
    {
      key: "ProductCategory",
      name: "Product Category",
      filter: true,
      frozen: true,
    },
    { key: "SubCategory", name: "Sub Category", frozen: true },
    { key: "GenericName", name: "Generic Name", frozen: true },
    { key: "Batch_No", name: "Batch No ", frozen: true },
    { key: "Expiry_Date", name: "Expiry Date", frozen: true },
    { key: "AvailableQuantity", name: "Available Quantity", frozen: true },

  
  ];

  return (
    <div className="Main_container_app">
      <h3>Stock</h3>
    
      <div className="RegisFormcon_1">
        {Object.keys(searchQuery).map((field, indx) => (
          <div className="RegisForm_1" key={indx}>
            <label>
              {formatunderscoreLabel(field)}
              <span>:</span>
            </label>
            {[
              "NurseStation",
              "Location",
              "ProductCategory",
              "SubCategory",
            ].includes(field) ? (
              <select
                name={field}
                value={searchQuery[field]}
                onChange={handleonchange}
                disabled={
                  field === "SubCategory" ? !searchQuery.ProductCategory : false
                }
              >
                <option value="">Select</option>

                {field === "NurseStation" &&
                  NurseStationData.map((ele, indx) => (
                    <option value={ele.NurseStationid} key={indx + "key"}>
                      {ele.NurseStationName}
                    </option>
                  ))}
                {field === "Location" &&
                  summaArray1.map((ele, ind) => (
                    <option key={ind + "key"} value={ele.id}>
                      {ele.locationName}
                    </option>
                  ))}
                {console.log(summaArray3)}
                {field === "ProductCategory" &&
                  summaArray3.map((ele, ind) => (
                    <option key={ind + "key"} value={ele.id}>
                      {ele.ProductCategory}
                    </option>
                  ))}
                {field === "SubCategory" &&
                  summaArray4.map((ele, ind) => (
                    <option key={ind + "key"} value={ele.id}>
                      {ele.SubCategoryName}
                    </option>
                  ))}
              </select>
            ) : field === "ItemName" ? (
                <>
                  <input
                    type="text"
                    list="item-names"
                    name="ItemName"
                    value={searchQuery[field]}
                    onChange={handleonchange}
                  />
                  <datalist id="item-names">
                    {NSItems.map((item, idx) => (
                      <option key={idx} value={item.ItemName} />
                    ))}
                  </datalist>
                </>
              ) : (
              <input
                type="text"
                name={field}
                value={searchQuery[field]}
                onChange={handleonchange}
              />
            )}
          </div>
        ))}

         <div style={{ display: "flex", alignItems: "center", }}>
          <label>
            {" "}
            CurrentStock Excel File<span>:</span>{" "}
          </label>
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            id="Servicechoose"
            required
            style={{ display: "none" }}
            onChange={handleFileChange}
            autoComplete='off'
          />



          <label
            htmlFor="Servicechoose"
            title='Choose File'
            className="RegisterForm_1_btns choose_file_update"
          >
            <PhotoCameraBackIcon />
          </label>
          <button
            className="RegisterForm_1_btns choose_file_update"
            onClick={handleCsvupload}
            title='File Upload'
          >

            <DriveFolderUploadIcon />

          </button>
        </div>
      </div>
      <ReactGrid columns={NursestationColumns} RowData={filteredData} />
    </div>
  );
}

export default StockDetailsNurseStation;
