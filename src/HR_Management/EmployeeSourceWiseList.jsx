import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from 'react-router-dom';
import Diversity1Icon from "@mui/icons-material/Diversity1";
import '../PatientManagement/Patient.css';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const EmployeeSourceWiseList = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const pagewidth = useSelector(state => state.userRecord?.pagewidth);
    const navigate = useNavigate();
    const dispatchvalue = useDispatch();

    const [isSelected, setIsSelected] = useState('');
    const [EmployeeData, setEmployeeData] =useState([])
    const [TotalCount, setTotalCount] = useState(0);

    const [sourceCounts, setSourceCounts] = useState({
      Advertisement: 0,
      SocialMedia: 0,
      Refferal: 0,
      Walkin: 0
  });

    console.log(EmployeeData,'EmployeeData');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const handleSelection = async (source) => {
      setIsSelected(source);
      setLoading(true);
      setError(null); // Reset error before making the request
  
      try {
        const response = await axios.get(`${UrlLink}HR_Management/filter_Sourcewise_Employee_Details?RequirementSource=${source}`);
        setEmployeeData(Array.isArray(response.data) ? response.data : []);
        
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data for the selected source.");
      } finally {
        setLoading(false);
      }
    };


    useEffect(() => {
      const sources = ["Advertisement", "SocialMedia", "Refferal", "Walkin"];
      const fetchCounts = async () => {
          try {
              // Loop through all sources and fetch data
              const counts = {};
              for (const source of sources) {
                  const response = await axios.get(`${UrlLink}HR_Management/filter_Sourcewise_Employee_Details?RequirementSource=${source}`);
                  counts[source] = response.data.length || 0; // Assuming response.data is an array
              }
              setSourceCounts(counts); // Update state with fetched counts
          } catch (error) {
              console.error("Error fetching counts:", error);
          }
      };

      fetchCounts();
  }, [UrlLink]); // Dependency array ensures this runs only when UrlLink changes



  const EmployeeRegisterColumns = [
    { key: "id", name: "S.No", frozen: true },
    { key: "Employee_Id", name: "Employee Id", frozen: true },
    { key: "FirstName", name: "First Name", frozen: true },
    { key: "Phone", name: "Contact Number" },
    { key: "Department", name: "Department" },
    { key: "Designation", name: "Designation" },
    { key: "Created_by", name: "Created By" },
   
    {
        key: "Action",
        name: "Action",
        renderCell: (params) => (
            <>
                <Button
                    className="cell_btn"
                    onClick={() => handleEditEmpDetails(params.row)}
                >
                    <EditIcon className="check_box_clrr_cancell" />
                </Button>
            </>
        ),
    },

   

    {
        key: "UserAction",
        name: "User Action",
        renderCell: (params) => (
            <>{
               
                    params.row.usercreated ? (
                        <>user created</>
                    )
                        :
                        (
                            <Button
                                className="cell_btn"
                                onClick={() => handleEmpUserRegister(params.row)}
                            >
                                <ArrowForwardIcon className="check_box_clrr_cancell" />
                            </Button>
                        )

            }

            </>
        ),
    }

]


const handleEmpUserRegister = (params) => {

  dispatchvalue({ type: 'UsercreateEmpdata', value: { EmployeeId: params.Employee_Id, Type: 'EMPLOYEE' } })
  dispatchvalue({ type: 'UserListId', value: {} })
  navigate('/Home/UserRegisterMaster')
}

const handleEditEmpDetails = (employee) =>{


  console.log(employee,'55555555555555');
  
  const { Employee_Id } = employee;
  dispatchvalue({ type: 'EmployeeListId', value: { Employee_Id } });

  const updatedEmployeeListId = { Employee_Id }; // Capture the PatientId
  console.log(updatedEmployeeListId, 'Employee_Id after dispatch');

  navigate('/Home/HR')
  dispatchvalue({type: 'HrFolder',value:'EmployeeRegistration'})

}


  
  
    return (
    <>
        <div className="Main_container_app">
           

            {/*------------- Patient Counts --------------------- */}
            
            <div className="con_1">
                {/* Options for selecting RequirementSource */}
                {["Advertisement", "SocialMedia", "Refferal", "Walkin"].map((source) => (
                    <div
                        key={source}
                        className="chart_body_1_child_1 dww3"
                        onClick={() => handleSelection(source)}
                    >
                        <div className="chart_body_1_child_1_body">
                            <div className="chart_body_1_child_1_body_icon">
                              
                                <Diversity1Icon />
                            </div>
                            <div className="chart_body_1_child_1_body_count">
                             <h2>{sourceCounts[source]}</h2>
                            </div>
                            <div className="chart_body_1_child_1_body_name">{source}</div>
                        </div>
                    </div>
                ))}
            </div>

            {loading && <p>Loading...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
                {isSelected && !loading && !error && (
                    <ReactGrid columns={EmployeeRegisterColumns} RowData={EmployeeData || []} />
                )}
                
             


        </div>
    
    </>
  )
}

export default EmployeeSourceWiseList;