import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import "../DoctorWorkBench/Navigation.css";

import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import { useNavigate } from "react-router-dom";
import bgImg2 from "../Assets/bgImg2.jpg";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";

function RadiologyRequest() {
 
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const toast = useSelector((state) => state.userRecord?.toast);
    const RadiologyWorkbenchNavigation = useSelector(state => state.Frontoffice?.RadiologyWorkbenchNavigation);
    console.log("LabWorkbenchNavigation",RadiologyWorkbenchNavigation)
    const dispatchvalue = useDispatch();
    const [IsTestGet, setIsTestGet] = useState([]);
    const [checkedTests, setCheckedTests] = useState([]);
    console.log("checkedTests",checkedTests);
    const [reason, setReason] = useState({});
    const [amounts, setAmounts] = useState({});
    console.log("amounts",amounts);
    console.log("reason",reason);
    const [labname, setlabname] = useState({});
    const [labamounts, setlabAmounts] = useState({});
    console.log("labamounts", labamounts);
    console.log("labname", labname)
    const [showTextarea, setShowTextarea] = useState(false);
    const navigate = useNavigate();

    const [no, setno] = useState([]);
    const [yes, setyes] = useState([]);
    const [IsViewMode, setIsViewMode] = useState(false);

    // useEffect(() => {
    //     if (Object.keys(LabWorkbenchNavigation).length === 0) {
    //         navigate('/Home/LabQuelist')
    //     }
    // }, [LabWorkbenchNavigation, navigate])

    console.log(no,'no');

   
    


    // useEffect(() => {
    //     const params = {
    //         Register_Id: LabWorkbenchNavigation?.params?.RegistrationId,
    //         Patient_Id: LabWorkbenchNavigation?.params?.PatientId,
    //         RegisterType: LabWorkbenchNavigation?.params?.RegisterType,
    //         Status: LabWorkbenchNavigation?.params?.Status,
    //     };
    
    //     axios.get(`${UrlLink}OP/Lab_Request_TestDetails`, { params })
    //         .then((res) => {
    //             console.log("Requestdata", res.data);
    //             const ress = res.data;
    
    //             const IndividualRequestsarr = ress?.AllTestDetails;
    
    //             // Check if the AllTestDetails array is empty
    //             if (!IndividualRequestsarr || IndividualRequestsarr.length === 0) {
    //                 // Navigate to LabQuelist if the array is empty
    //                 navigate('/Home/LabQuelist');
    //                 const tdata = {
    //                     message: 'There is No Action Request.',
    //                     type: 'warn',
    //                 }
    //                 dispatchvalue({ type: 'toast', value: tdata });
    //                 return;  // Early exit if navigation is triggered
    //             }
    
    //             // Initialize checkedTests with all tests checked
    //             const initialCheckedTests = IndividualRequestsarr.map(test => ({ testCode: test.TestCode, amount: '' }));
    //             setCheckedTests(initialCheckedTests);
    
    //             setIsTestGet(ress);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // }, [UrlLink, LabWorkbenchNavigation?.params?.RegistrationId, LabWorkbenchNavigation?.params?.RegisterType, LabWorkbenchNavigation?.params?.PatientId, LabWorkbenchNavigation?.params?.Status, navigate]);
    const handleeditReport = (row) => {

      console.log(row);
      // setIsViewMode(true);
      // console.log("Row data on edit:", row); // Debugging: log the row data
  
      // if (row.IsSubTest === "No") {
  
      //   setReportEntry({
      //     ...row,
      //     TestCode: row.TestCode,
      //     TestName: row.TestName,
      //     Radiology_RequestID: row.Radiology_RequestId
      //   });
      // } else if (row.IsSubTest === "Yes") {
  
      //   setReportEntry({
      //     ...row,
      //     TestCode: row.SubTestCode,
      //     TestName: row.SubTestName,
      //     Radiology_RequestID: row.Radiology_RequestId
      //   });
      // }
    };

    // const handleInputChange = (e, row) => {
    //     console.log(row);
    //     const testCode = row.TestCode;
    //     const isChecked = e.target.checked;

    //     if (e.target.name === 'TestName') {
    //         if (isChecked) {
    //             setCheckedTests(prev => [...prev, row]);
    //             setUncheckedTests(prev => prev.filter(test => test.TestCode !== testCode));
    //         } else {
    //             setCheckedTests(prev => prev.filter(test => test.TestCode !== testCode));
    //             setUncheckedTests(prev => [...prev, row]);
    //         }
    //     }      

    //     if (e.target.name === 'EnterAmount') {
    //         setAmounts(prev => ({
    //             ...prev,
    //             [testCode]: e.target.value
    //         }));

    //         setCheckedTests(prevCheckedTests => {
    //             return prevCheckedTests.map(test =>
    //                 test.TestCode === testCode ? { ...test, amount: e.target.value } : test
    //             );
    //         });
    //     }
    // };

    const [testdata,settestdata] = useState([]);
    const [testshow,settestshow] = useState("hide");
    const [testshowbtn,settestshowbtn] = useState('show')

    const fetchData = () => {
      const params = {
        Register_Id: RadiologyWorkbenchNavigation?.params?.RegistrationId,
        RegisterType: RadiologyWorkbenchNavigation?.params?.RegisterType,
        Employeeid : userRecord?.Employeeid
      };
  
      axios.get(`${UrlLink}OP/Radiology_Request_Detailslink`, { params })
        .then((res) => {
          const ress = res.data;
          console.log("1234", ress);
          setyes(ress?.IsSubTestYes);
          setno(ress?.IsSubTestNo);
          settestdata(ress?.IsSubTestNo);
          const IndividualRequestsarr = ress?.IsSubTestNo;

          const initialCheckedTests = IndividualRequestsarr.map(test => ({
            testCode: test.TestCode,
            amount: ''
        }));
        setCheckedTests(initialCheckedTests);
        setIsTestGet(ress);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const handleAmountChange = (id, value) => {
      setno((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, TestAmount: value } : row
        )
      );
    };

    const handleDeleteTest = (id) => {
        // Assuming you have a state that stores your rows, e.g., testList
        setno((prevTests) => prevTests.filter((test) => test.id !== id));
      };
      
    

     useEffect(() => {
          const { RegistrationId, RegisterType } = RadiologyWorkbenchNavigation?.params || {};
      
          if (UrlLink && RegistrationId && RegisterType) {
            fetchData();
          }
        }, [
          UrlLink,
          RadiologyWorkbenchNavigation?.params?.RegistrationId,
          RadiologyWorkbenchNavigation?.params?.RegisterType,     
        ]);
    
        const noColumns = [
  
          {
            key: "id",
            name: "S.No",
            width: "160px",
      
          },
      
          {
            key: "RadiologyName",
            name: "Radiology Name",
            width: "160px",
          },
      
          {
            key: "TestName",
            name: "Test Name",
            width: "160px",
          },
          {
            key: "Amount",
            name: "Amount",
          },
          {
            key: "BookingFees",
            name: "BookingFees",
          },
          {
            key: "TestAmount",
            name: "Test Amount",
            renderCell: (params) => (
              <input
                type="number"
                className="test-amount-input"
                value={params.row.TestAmount || ''}  // Default value if undefined
               onChange={(e) => handleAmountChange(params.row.id, e.target.value)}
                placeholder="Enter Amount"
              />
            ),
          },

        //   {
        //     key: "Delete",
        //     name: "Delete",
        //     renderCell: (params) => (
        //       <button
        //         className="delete-button bg-red-500 text-white px-2 py-1 rounded"
        //         onClick={() => handleDeleteTest(params.row.id)}
        //       >
        //         Delete
        //       </button>
        //     ),
        //   },









          // {
          //   key: "Action",
          //   name: "Action",
          //   renderCell: (params) => (
          //     <Button
          //       key={params.row.id}  // Assuming `id` is unique for each row
          //       className="cell_btn"
          //       onClick={() => handleeditReport(params.row)}
          //     >
          //       <EditIcon className="check_box_clrr_cancell" />
          //     </Button>
          //   ),
          // }
      
        ];

        const testdatacolumn = [

            {
                key: "id",
                name: "S.No",
                width: "160px",
          
              },
          
              {
                key: "RadiologyName",
                name: "Radiology Name",
                width: "160px",
              },
          
              {
                key: "TestName",
                name: "Test Name",
                width: "160px",
              },
        ]

    // const IndivitualTestNameColumns = [
    //     {
    //         key: "id",
    //         name: "S.NO",
    //         frozen: true,
    //     },
    //     {
    //         key: "RadiologyName",
    //         name: "Radiology Name",
    //         width: "160px",
    //       },
      
    //     {
    //         key: "TestName",
    //         name: "Test Name",
    //         width: 280,
    //         renderCell: (params) => (
    //             <div style={{ display: 'flex', alignItems: 'center', padding: '5px', gap: '30px' }}>
    //                 <input
    //                     type="checkbox"
    //                     name='TestName'
    //                     id={`TestName-${params.row.TestCode}`}  // Unique ID based on TestCode
    //                     checked={checkedTests.some(test => test.testCode === params.row.TestCode)}
                        
    //                     style={{ cursor: 'pointer' }}
    //                     onChange={(e) => handleInputChange(e, params.row)}
    //                 />
    //                 <span>{params.row.TestName}</span>
    //             </div>
    //         ),
    //     },
    //     {
    //         key: "Amount",
    //         name: "Amount",
    //         width: 200,
    //     },
    //    {
    //         key: "BookingFees",
    //         name: "BookingFees",
    //       },
       
       
    //     {
    //         key: "EnterAmount",
    //         name: "Enter Amount",
    //         width: 300,
    //         renderCell: (params) => {
    //             return (
    //                 <div className="RegisForm_1" style={{ padding: '5px' }}>
    //                     <input
    //                         type="number"
    //                         name='EnterAmount'
    //                         id={`EnterAmount-${params.row.TestCode}`}  // Unique ID based on TestCode
    //                         value={amounts[params.row.TestCode] || ''}
    //                         onKeyDown={(e) =>
    //                             ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
    //                         }
    //                         checked={checkedTests.some(test => test.testCode === params.row.TestCode)}
    //                         onChange={(e) => handleInputChange(e, params.row)}
    //                         style={{ width: '100px' }}
    //                         disabled={!checkedTests.some(test => test.testCode === params.row.TestCode)}
    //                     />
    //                 </div>
    //             );
    //         },
    //     },
    // ];

    const [uncheckedTests, setUncheckedTests] = useState([]);
    console.log("uncheckedTests", uncheckedTests)
    const handleSubmitRequest = () => {

        const isValidAmount = no.every((test) => test.TestAmount && test.TestAmount > 0);

    if (!isValidAmount) {
        dispatchvalue({
            type: "toast",
            value: { message: "Please enter a valid amount for all tests before submitting.", type: "warn" }
        });
        return;
    }
        const data = {
            Register_Id: RadiologyWorkbenchNavigation?.params?.RegistrationId,
            RegisterType: RadiologyWorkbenchNavigation?.params?.RegisterType,
            created_by: userRecord?.username || "",
            SubtestNoArr : no
            // IndividualArr: checkedTests || [],
            // uncheckedTestsArr: uncheckedTests || [],
        };

        console.log("12345", data);

        // // Function to check if an amount is valid (greater than 0)
        // const isValidAmount = (test) => test.amount > 0;

        // // Check for invalid amounts in checkedTests and favcheckedTests
        // const invalidCheckedTests = checkedTests.filter(test => !isValidAmount(test));

        // if (IsTestGet?.AllTestDetails.length === checkedTests.length) {
        //     setUncheckedTests([]);
        // }
        // if (invalidCheckedTests.length > 0) {
        //     dispatchvalue({
        //         type: "toast",
        //         value: { message: "Please enter a valid amount for all checked tests .", type: "warn" }
        //     });
        // } else {
            console.log("postdata", data);
            axios.post(`${UrlLink}OP/Radiology_TestAmount_Entry`, data)
                .then((res) => {
                    const { data } = res;
                    // const type = Object.keys(data)[0];
                    // const message = Object.values(data)[0];
                    // dispatchvalue({ type: "toast", value: { message, type } });
                    setCheckedTests([]);
                    setUncheckedTests([]);
                    setShowTextarea(false);
                    setlabname({});
                    setlabAmounts({});
                    setno([]);
                    settestshow('show');
                    settestshowbtn('hide');

                   

                    // navigate("/Home/FrontOfficeFolder");
                    // dispatchvalue({ type: "HrFolder", value: "GeneralBillingRadiologyQuelist" });
                    // dispatchvalue({ type: "setPreviousFolder", value: null });
                    // dispatchvalue({ type: "showMenu", value: true });


                })
                .catch((err) => {
                    console.error("Error during request:", err);
                    dispatchvalue({
                        type: "toast",
                        value: { message: "Error during request.", type: "warn" }
                    });
                });
        
    };

    const handleReasonChange = (e, testCode) => {
        const newReason = e.target.value;


        // Update the reason in the state object
        setReason(prevReason => ({
            ...prevReason,
            [testCode]: newReason
        }));

        // Update the uncheckedTests array with the new reason
        setUncheckedTests(prevUncheckedTests =>
            prevUncheckedTests.map(test =>
                test.testCode === testCode ? { ...test, reason: newReason } : test
            )
        );




    };

    const getReason = () => {
        if (uncheckedTests.length === 0) return '';
        const firstUncheckedTestCode = uncheckedTests[0].TestCode;
        return reason[firstUncheckedTestCode] || '';
    };

    const handleChange = (e) => {
        if (uncheckedTests.length === 0) return;
        const firstUncheckedTestCode = uncheckedTests[0].TestCode;
        setReason(prev => ({
            ...prev,
            [firstUncheckedTestCode]: e.target.value
        }));
    };


    useEffect(() => {
        // Update showTextarea based on the length of uncheckedTests
        setShowTextarea(uncheckedTests.length > 0);
    }, [uncheckedTests]);

    useEffect(() => {
        // Determine if all tests are unchecked to set showTextarea
        const allTests = [...checkedTests];
        const allUnchecked = allTests.every(test => test.amount === '');
        setShowTextarea(allUnchecked);
    }, [checkedTests]);



    return (
        <>
            <div className="Main_container_app">

                <div className="new-patient-registration-form">
                    <br />
                    <div className="dctr_info_up_head">
                        <div className="RegisFormcon ">
                            <div className="dctr_info_up_head22">

                                <img src={bgImg2} alt="Patient Profile" />

                                <label>Profile</label>
                            </div>
                        </div>
                        <div className="RegisFormcon_1">
                            <div className="RegisForm_1 ">
                                <label htmlFor="PatientID">
                                    Patient ID <span>:</span>
                                </label>
                                <span className="dctr_wrbvh_pice" htmlFor="PatientID">
                                    {RadiologyWorkbenchNavigation?.params?.PatientId}
                                </span>
                            </div>
                            <div className="RegisForm_1 ">
                                <label htmlFor="PatientName">
                                    Patient Name <span>:</span>{" "}
                                </label>
                                <span className="dctr_wrbvh_pice" htmlFor="PatientName">
                                    {RadiologyWorkbenchNavigation?.params?.PatientName}
                                </span>
                            </div>
                            <div className="RegisForm_1 ">
                                <label htmlFor="Age">
                                    Age <span>:</span>{" "}
                                </label>
                                <span className="dctr_wrbvh_pice" htmlFor="Age">
                                    {RadiologyWorkbenchNavigation?.params?.age}
                                </span>
                            </div>
                            <div className="RegisForm_1 ">
                                <label htmlFor="Gender">
                                    Gender <span>:</span>{" "}
                                </label>
                                <span className="dctr_wrbvh_pice" htmlFor="Gender">
                                    {RadiologyWorkbenchNavigation?.params?.gender}
                                </span>
                            </div>
                            <div className="RegisForm_1 ">
                                <label htmlFor="PhoneNumber">
                                    Phone Number<span>:</span>{" "}
                                </label>
                                <span className="dctr_wrbvh_pice" htmlFor="PhoneNumber">
                                    {RadiologyWorkbenchNavigation?.params?.PhoneNumber}
                                </span>
                            </div>
                            <div className="RegisForm_1 ">
                                <label htmlFor="DoctorShortName">
                                    Doctor Name<span>:</span>{" "}
                                </label>
                                <span className="dctr_wrbvh_pice" htmlFor="DoctorShortName">
                                    {RadiologyWorkbenchNavigation?.params?.doctor_name}
                                </span>
                            </div>
                        </div>
                    </div>
                    <br />
                </div>
                <div className="new-navigation">
                    <div className="common_center_tag">
                        <span>Radiology Request</span>
                    </div>
                </div>
                <br />




                {/* {IsTestGet.AllTestDetails && IsTestGet.AllTestDetails.length > 0 && (
                    <ReactGrid columns={IndivitualTestNameColumns} RowData={IsTestGet.AllTestDetails} />
                )} */}


          {no?.length > 0 && (
            <>
              <div className="common_center_tag">
                <span>Selected TestName</span>
              </div>

              <ReactGrid columns={noColumns} RowData={no} />
            </>
          )}




            {uncheckedTests.length > 0 && (
                <div className="treatcon_body_1">
                    <label htmlFor="reason">Reason for not Selecting Test</label>
                    <span>:</span>
                    <textarea
                        className="treatcon_body_1 textarea"
                        id="reason"
                        name="reason"
                        value={getReason()}
                        onChange={handleChange}
                    />
                </div>
            )}



            {testshowbtn === 'show' && (

                <>
                <div className="Main_container_Btn">
                    <button
                        onClick={handleSubmitRequest}
                    >
                        Save
                    </button>
                </div>
                </>
            )}



                

                {testshow === 'show' && (
                    <>
                    <div className="common_center_tag">
                        <span>Selected TestName</span>
                    </div>

                    <ReactGrid columns={testdatacolumn} RowData={testdata} />
                    </>
                )}



                <ToastAlert Message={toast.message} Type={toast.type} />



            </div>

        </>
    )





}

export default RadiologyRequest