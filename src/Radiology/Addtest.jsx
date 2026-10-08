import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import Button from "@mui/material/Button";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import axios from 'axios';
import { FaTrash } from "react-icons/fa";
// import "./Addtest.css";

function Addtest() {
      const UrlLink = useSelector(state => state.userRecord?.UrlLink);
      const userRecord = useSelector(state => state.userRecord?.UserData);
       const RadiologyWorkbenchNavigation = useSelector(state => state.Frontoffice?.RadiologyWorkbenchNavigation);
       console.log(RadiologyWorkbenchNavigation,'RadiologyWorkbenchNavigation')
      const dispatch = useDispatch();
      const navigate = useNavigate();

      const [TestNames, setTestNames] = useState([]);
      const [SubtestNo, setSubtestNo] = useState([]);

          const handleCheckboxSubtestNo = (
            Curr_Amount,
            testid,
            TestName,
            Radiologyid,
            RadiologyName,
            TestCode,
        ) => {
            const isChecked = SubtestNo.some((item) => item.TestCode === TestCode);
            if (isChecked) {
                const newCheckedState = SubtestNo.filter(
                    (item) => item.TestCode !== TestCode
                );
                setSubtestNo(newCheckedState);
            } else {
                const newCheckedState = [
                    ...SubtestNo,
                    {
                        Radiologyid,
                        RadiologyName,
                        testid,
                        TestName,
                        Curr_Amount,
                        TestCode
                    },
                ];
                setSubtestNo(newCheckedState);
            }
        };

        const handleRemoveTestName = (row) => {
            // Remove from SubtestNo (if applicable)
            const newSubtestNoState = SubtestNo.filter(
                (item) =>
                    item.testid !== row.testid || item.Radiologyid !== row.Radiologyid
            );
            setSubtestNo(newSubtestNoState);
        };

        const transformFavouriteData = (SubtestNo) => {
            return SubtestNo.map((sutestno, ind) => ({
                Radiologyid: sutestno.Radiologyid, // Correctly assign Radiologyid
                RadiologyName: sutestno.RadiologyName,
                TestCode: sutestno.TestCode,
                TestName: sutestno.TestName,
                testid: sutestno.testid, // Correctly assign testid
                id: ind + 1, // Ensure unique key for each row
            }));
        };
    
    const transformedFavouriteData1 = transformFavouriteData(SubtestNo);

     const [RadiologyTest, setRadiologyTest] = useState({
            RadiologyTestId: "",
            SubtestNoArr: "",
        });
    
           
    const IndivitualColumns = [
        {
            key: "id",
            name: "S.No",
            frozen: true,
        },
        {
            key: "TestCode",
            name: "Test Code",
       
        },
        {
            key: "RadiologyName",
            name: "Radiology Name",
          
        },

        {
            key: "TestName",
            name: "Test Name",
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <Button
                    className="cell_btn"
                    onClick={() => handleRemoveTestName(params.row)}
                >
                    <FaTrash className="check_box_clrr_cancell" />
                </Button>
            ),
        },
    ];    

    useEffect(() => {
        axios
            .get(`${UrlLink}Masters/Radiology_details_link_view_for_technician?Employeeid=${userRecord?.Employeeid}&Dept=${userRecord?.Emp_DepartmentId} `)
            .then((res) => {
                const ress = res.data;
                setTestNames(ress);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [UrlLink]);

    const handleSubmitRadiologyTest = () => {
        if (SubtestNo.length > 0) {
            const data = {
                // RadiologyTestId: RadiologyTest.RadiologyTestId,
                SubtestNoArr: SubtestNo,
                created_by: userRecord?.username || "",
                Register_Id: RadiologyWorkbenchNavigation.params?.RegistrationId,
                RegisterType: RadiologyWorkbenchNavigation.params?.RegisterType,
            };
            console.log("data", data);
            axios
                .post(`${UrlLink}OP/Radiology_Request_Detailslink`, data)
                .then((res) => {
                    const resData = res.data;
                    const type = Object.keys(resData)[0];
                    const message = Object.values(resData)[0];
                    const tdata = {
                        message: message,
                        type: type,
                    };
                    dispatch({ type: "toast", value: tdata });
                  
                    // setRadiologyTest({
                    //     RadiologyTestId: "",
                    //     SubtestNoArr: [],
                    // });
                    setSubtestNo([]);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            const tdata = {
                message: "Please Select TestNames .",
                type: "warn",
            };
            dispatch({ type: "toast", value: tdata });
        }
    };
    
  return (
    <>
            <div className="displayuseraccess">
             {TestNames.map((item) => (
        <div key={item.id}>
            <label htmlFor={item.id} className="par_acc_lab">
                {item.RadiologyName}
            </label>

            <div  style={{display:'flex',justifyContent:'center',alignItems:'flex-start',flexWrap:'wrap'}}>
                {item.TestNames.map((test, index) => (
                    <div key={test.id} >
                        <input
                            type="checkbox"
                            id={test.id}
                            onChange={() => handleCheckboxSubtestNo(
                                test.Curr_Amount,
                                test.id,
                                test.TestName,
                                item.id,
                                item.RadiologyName,
                                test.TestCode
                            )}
                            checked={SubtestNo.some(checkedItem => checkedItem.TestCode === test.TestCode)}
                        />
                        <label htmlFor={test.id} className="chi_acc_lab">
                            {test.TestName}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    ))}
            </div>


                {transformedFavouriteData1.length > 0 && (
                            <>
                            <div className="common_center_tag">
                            <span>Selected Test Name</span>
                            </div>

                            <div className="RegisFormcon_1 jjxjx_">
                            <ReactGrid columns={IndivitualColumns} RowData={transformedFavouriteData1} />
                            </div>
                            </>
                )}

            <div className="Main_container_Btn">
                <button onClick={handleSubmitRadiologyTest}>Save</button>
                </div>
    
    
    
    
    
    
    
    
    
    </>
  )
}

export default Addtest