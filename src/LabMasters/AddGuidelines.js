import React, { useState, useEffect, useCallback } from "react";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import EditNoteIcon from '@mui/icons-material/EditNote';
import "./Department.css";



function AddGuidelines() {
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  

  const [header, setheader] = useState("");
  const [comments, setComments] = useState("");
  const [testname, setTestName] = useState("");
  const [Test_Code, setTestCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [addDatas, setAddDatas] = useState([]);
  const [addData, setAddData] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [filteredRows, setFilteredRows] = useState([]);
  const [selectedid, setSelectedid] = useState(null);
    const [ageData, setAgeData] = useState([]);
    const [testId, setTestId] = useState(null);
  
  // useEffect(() => {
  //   axios
  //     .get(`${urllink}usercontrol/gettestname`)
  //     .then((response) => {
  //       console.log(response.data);
  //       const data = response.data.test_name;
  //       const testcode = response.data.test_code;
  //       setTestName(data);
  //       setTestCode(testcode);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, [urllink]);


  const handlesubmit = () => {
     const updatedata = {
      method_id: selectedid, // Assuming `id` is the identifier
      header: header,
      comments: comments,
      testname: testname,
      Test_Code: Test_Code,
      created_by: userRecord?.username,
      Type: "Add_Testmaster_guidelines_table"
    };

   

    if (comments === "" || testname === "") {
        alert("Please enter comments and test name.");
      
    } else {
       axios
      .post(`${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET`, updatedata)
        .then((response) => {
          console.log(response);
          successMsg(response.data.message);
          setComments("");
          setheader("");
          setTestName("");
          setTestCode("");
          fetchAddInterpretationData();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   setAddData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Check if the input is for test name and find the corresponding test code
    if (name === "testname") {
      const selectedTest = ageData.find((test) => test.name === value);
      const testCode = selectedTest ? selectedTest.Test_Code : "";
      setTestName(value);
      setTestCode(testCode);
    } else {
      setAddData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const fetchAddInterpretationData = useCallback(() => {
    axios
      .get(`${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=Get_AllTests_For_guideline`)
      .then((response) => {
        const data = response.data;
        console.log("fetchAddInterpretationData", data);

        setAddDatas(data);
      })
      .catch((error) => {
        console.error("Error fetching AddInterpretationData  data:", error);
      });
  }, [urllink]);

  
  

  const handleEdit = (row) => {
    console.log(row);
    setTestId(row.Test_Id);
    setheader(row.Header_interpretation);
    setComments(row.Comments);
    setTestName(row.Test_Name);
    setIsEditMode(true);
    setSelectedid(row.Test_Id); // Assuming `id` is the identifier
    setTestCode(row.Test_Code);
  };

  React.useEffect(() => {
    fetchAddInterpretationData();
  }, [fetchAddInterpretationData]);


    useEffect(() => {
    if (Array.isArray(addDatas)) {
        console.log("-------addData------", addDatas);

      const lowerCaseNameQuery = searchQuery.toLowerCase();
      const filteredData = addDatas.filter((row) => {
        const lowerCasePatientName = row?.Test_Name
          ? row.Test_Name.toLowerCase()
          : "";
        return lowerCasePatientName.includes(lowerCaseNameQuery);
      });
      setFilteredRows(filteredData);
    } else {
      // Handle the case where ageData is not an array
      setFilteredRows([]);
    }
  }, [searchQuery, addDatas]);


  const handleUpdateMethod = () => {
    const updatedata = {
      method_id: selectedid, // Assuming `id` is the identifier
      header: header,
      comments: comments,
      testname: testname,
      Test_Code: Test_Code,
      id: testId,
      created_by: userRecord?.username,
      Type: "Update_Testmaster_guidelines_table"
    };

    axios
      .post(`${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET`, updatedata)
      .then((response) => {
        console.log(response.data);
        successMsg(response.data.message);
        setIsEditMode(false);
        setSelectedid(null);
        setComments("");
        setheader("");
        setTestCode("");
        setTestName("");
        setTestId(null);
        fetchAddInterpretationData();
      })

      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };
  const successMsg = (msg) => {
    toast.success(`${msg}`, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      style: { marginTop: "50px" },
    });
  };

  // const errmsg = (errorMessage) => {
  //   toast.error(`${errorMessage}`, {
  //     position: "top-center",
  //     autoClose: 5000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //     theme: "dark",
  //     style: { marginTop: "50px" },
  //   });
  // };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;

    if (name === "TestName") {
      setSearchQuery(value);
    }
  };

  const InterpretationMastercolumns = [
    {
      key: "id",
      name: "S.No",
      width: 70,
      frozen: true
    },
    {
      key: "Test_Name",
      name: "Test Name",
      width: 300,
      frozen: true
    },
    {
      key: "Header_interpretation",
      name: "Header interpretation",
      width: 200,
    },
    {
      key: "Comments",
      name: "Comments",
      width: 450,
    },

    {
      key: "EditAction",
      name: "Action",
      renderCell: (params) => (
        <Button
          onClick={() => handleEdit(params.row)}
        >
          <EditNoteIcon />
        </Button>
      ),
    },
  ];

  //  const fetchAgeSetUpData = useCallback(() => {
  //     axios
  //       .get(`${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=Get_AllTests_For_AgeSetup`)
  //       .then((response) => {
  //         const data = response.data;
  //         console.log(data)
  //         setAgeData(data);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching agesetup data:", error);
  //       });
  //   }, [urllink]);
  //    React.useEffect(() => {
  //       fetchAgeSetUpData();
  //     }, [fetchAgeSetUpData]);


      useEffect(() => {
      axios
        .get(`${urllink}Lab/test_and_group_forpackage`)
        .then((res) => {
          console.log(res);
          setAgeData(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }, [urllink]);

      console.log(testname,Test_Code,"-----------------")
  // console.log("addData", ageData);


  return (
    <>
      <div className="appointment">
        <br />

        <div className="RegisFormcon">
          <div className="RegisForm_1">
            <label htmlFor="selectTest">
              Test Name<span>:</span>
            </label>
            <input
              type="text"
              id="testname"
              name="testname"
              list="testnamelist"
              placeholder="select Test"
              required
              value={testname}
              onChange={handleInputChange}
              autoComplete="Off"
            />
            <datalist id="testnamelist">
              {Array.isArray(ageData) && ageData?.map((item, index) => (
                <option key={index} value={item.name}>
                  {item.Test_Code}
                </option>
              ))}
            </datalist>
          </div>
          <div className="uidelineeee">
            <label htmlFor="validation">
            Guidelines Header<span>:</span>
            </label>
            <textarea
              id="remarks"
              name="remarks"
              value={header}
              onChange={(e) => {
                setheader(e.target.value);
              }}
             
            ></textarea>
          </div>
          <div className="uidelineeee">
            <label htmlFor="remarks">
            Guidelines Points<span>:</span>
            </label>
            <textarea
              id="remarks"
              name="remarks"
              value={comments}
              onChange={(e) => {
                setComments(e.target.value);
              }}
            ></textarea>
          </div>
        </div>
        <br />

        <div className="Register_btn_con">
          <button
            className="RegisterForm_1_btns"
            onClick={isEditMode ? handleUpdateMethod : handlesubmit}
          >
            {isEditMode ? "Update" : <AddIcon />}
          </button>
        </div>
        <div style={{ width: "100%", display: "grid", placeItems: "center" }}>
          <div className="con_1">
            <div className="inp_1">
              <label htmlFor="TestName">
                Test Name<span>:</span>
              </label>
              <input
                type="text"
                id="TestName"
                name="TestName"
                value={searchQuery}
                placeholder="Enter Test Name"
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
        <div className="Main_container_app">
          <ReactGrid
            columns={InterpretationMastercolumns}
            RowData={filteredRows}
          />
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

export default AddGuidelines;

