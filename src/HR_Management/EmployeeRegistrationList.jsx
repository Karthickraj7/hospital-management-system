import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
import { useNavigate } from 'react-router-dom';
import LoupeIcon from "@mui/icons-material/Loupe";
import UploadIcon from '@mui/icons-material/Upload';
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";




const EmployeeRegistrationList = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const toast = useSelector(state => state.userRecord?.toast);
    const pagewidth = useSelector(state => state.userRecord?.pagewidth);
    const dispatchvalue = useDispatch();
    const navigate = useNavigate()


    const [EmployeeRegisterData, setEmployeeRegisterData] = useState([])
    const [Departments, setDepartments] = useState([])
    const [Designations, setDesignations] = useState([])
    const [GetEmployeeRegisterData, setGetEmployeeRegisterData] = useState(false)
    const [EmployeeRegisterFIlteredData, setEmployeeRegisterFIlteredData] = useState([])
    const [SearchQuery, setSearchQuery] = useState('')
    const [SearchCategory,setSearchCategory] = useState('');
    const [SearchDesignation,setSearchDesignation] = useState('');

    console.log(SearchCategory,SearchDesignation,'SearchDesignation')
    const userRecord = useSelector((state) => state.userRecord?.UserData);

     
    const [loading, setLoading] = useState(false);
      const [selectedFile, setSelectedFile] = useState(null);
          const [load,setload] = useState(true);


        const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      dispatchvalue({
        type: 'toast',
        value: { message: "Please choose a valid Formart file.", type: "error" }
      });
    }
         };

         const FileUpload = () => {
             if (selectedFile) {
               setLoading(true);
            //    scrollToElement("PatientGrid_ID");
         
               const formData = new FormData();
               formData.append('file', selectedFile);
         
               console.log("Uploading file:", selectedFile.name);
               
               axios.post(`${UrlLink}HR_Management/employee_excel_upload`, formData,{
                 headers: { "Content-Type": "multipart/form-data" },
               })
                 .then((res) => {
                   const data = res.data;
                   const type = Object.keys(data)[0];
                   const message = Object.values(data)[0];
         
                   console.log("File upload response:", res); // Log entire response
                   console.log("File uploaded successfully:", message);
         
                   dispatchvalue({
                     type: 'toast',
                     value: { message, type }
                   });
         
                   setLoading(false);
                   setload((prev) => !prev);
                   setSelectedFile(null);
                //    GetPatientData();
                 })
                 .catch(() => {
                   dispatchvalue({
                     type: 'toast',
                     value: { message: "File upload failed.", type: "warn" }
                   });
                   setLoading(false);
                 });
             }
           };

           const ClearFields = () => {
    setSearchQuery('');
  };


    console.log(userRecord);

    useEffect(() => {
        // const Deptid = userRecord?.DepartmentId.join(",")

        axios.get(`${UrlLink}HR_Management/Employee_Registration_Details`, {
            params: {
                deptid: userRecord?.Emp_DepartmentId?.join(","), 
                SearchQuery : SearchQuery,
                SearchCategory : SearchCategory,
                SearchDesignation : SearchDesignation,
            }
        })

            .then((res) => {
                const ress = res.data
                console.log(ress, 'ress');
                setEmployeeRegisterData(ress)


            })
            .catch((err) => {
                console.log(err);
            })
        dispatchvalue({ type: 'EmployeeListId', value: {} })
    }, [UrlLink, dispatchvalue,load,SearchQuery,SearchCategory,SearchDesignation])


    const handleDocuments = (params) => {
        dispatchvalue({ type: 'EmployeeListId', value: { EmployeeId: params.Employee_Id } });
        navigate("/Home/Documents", { state: { EmployeeId: params.Employee_Id } });
        dispatchvalue({ type: 'HrFolder', value: 'EmployeeRegistration' });
        dispatchvalue({ type: "setPreviousFolder", value: null });
        dispatchvalue({ type: "showMenu", value: true });
    };
 

    const EmployeeRegisterColumns = [
        {
            key: "id",
            name: "S.No ",
            frozen: true
        },
        {
            key: "Employee_Id",
            name: "Employee Id",
            filter: true,
            type: 'input-text',
            frozen: true,
            // width:300
        },
        {
            key: "Existing_Employee_ID",
            name: "Existing_Employee_ID",
            filter: true,
            type: 'input-text',
            frozen: true,
            // width:300
        },
        {
            key: "FirstName",
            name: "First Name",
            filter: true,
            frozen: true
        },
        {
            key: "Phone",
            name: "Contact Number",
            frozen: true
        },
        {
            key: "Department",
            name: "Department",
            frozen: true
        },
        {
            key: "Designation",
            name: "Designation",
            frozen: true
        },

        // {
        //     key: "Status",
        //     name: "Status",
        //     frozen: true,
        //     renderCell: (params) => (

        //         <Button
        //             className="cell_btn"
        //             onClick={() => handleeditDoctorstatus(params.row)}
        //         >
        //             {params.row.Status}
        //         </Button>
        //     )

        // },


        {
            key: "Created_by",
            name: "created By",
        },


        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                         type="button"
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

                    params.row.userrecord ? (
                        <>user created</>
                    )
                        :
                        (
                            <Button
                             type="button"
                                className="cell_btn"
                                onClick={() => handleEmpUserRegister(params.row)}
                            >
                                <ArrowForwardIcon className="check_box_clrr_cancell" />
                            </Button>
                        )

                }

                </>
            ),
        }, {
            key: 'Documents',
            name: 'Documents',
            renderCell: (params) => (
                <>
                    <Button
                     type="button"
                        className="cell_btn"
                        onClick={() => handleDocuments(params.row)}
                    >
                        Documents
                    </Button>
                </>
            )
        },

    ]


    // useEffect(() => {
    //     if (EmployeeRegisterData.length > 0 && Departments.length > 0 && Designations.length > 0) {
    //         const updatedData = EmployeeRegisterData.map((employee) => ({
    //             ...employee,
    //             Department: Departments.find((dept) => dept.id === employee.Department)?.name || 'N/A',
    //             Designation: Designations.find((desig) => desig.id === employee.Designation)?.name || 'N/A',
    //         }));
    //         setEmployeeRegisterData(updatedData);
    //     }
    // }, [EmployeeRegisterData, Departments, Designations]);



    const handlenewEmpRegister = () => {

        dispatchvalue({ type: 'EmployeeListId', value: {} })

        navigate("/Home/HR");
        dispatchvalue({ type: 'HrFolder', value: 'EmployeeRegistration' });
        dispatchvalue({ type: "setPreviousFolder", value: null });
        dispatchvalue({ type: "showMenu", value: true });

    }


    const handleEmpUserRegister = (params) => {

        dispatchvalue({ type: 'Usercreatedocdata', value: {} })
        dispatchvalue({ type: 'UsercreateEmpdata', value: { EmployeeId: params.Employee_Id, Type: 'EMPLOYEE' } })
        dispatchvalue({ type: 'UserListId', value: {} })

        navigate("/Home/HR");
        dispatchvalue({ type: 'HrFolder', value: 'UserRegisterMaster' });
        dispatchvalue({ type: "setPreviousFolder", value: null });
        dispatchvalue({ type: "showMenu", value: true });
    }

    const handleEditEmpDetails = (employee) => {
        console.log("employee111111111111", employee);

        const { Employee_Id } = employee;

        console.log(Employee_Id,'employee111111111111')
        dispatchvalue({ type: 'EmployeeListId', value: { Employee_Id } });

        // const updatedEmployeeListId = { Employee_Id }; // Capture the PatientId
        // console.log(updatedEmployeeListId, 'Employee_Id after dispatch');
        navigate("/Home/HR");
        dispatchvalue({ type: 'HrFolder', value: 'EmployeeRegistration' });
        dispatchvalue({ type: "setPreviousFolder", value: null });
        dispatchvalue({ type: "showMenu", value: true });


        // dispatchvalue({ type: 'HrFolder', value: 'EmployeeRegistration' })

    }

        const [Categories, setCategories] = useState([]);

         useEffect(() => {
        axios.get(`${UrlLink}Masters/Category_Detials_link`)
            .then((res) => {
                const ress = res.data
                setCategories(ress)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [UrlLink])

    const [Designation, setDesignation] = useState([]);
        useEffect(() => {
        axios.get(`${UrlLink}Masters/Designation_Detials_link`)
            .then((res) => {
                const ress = res.data
                setDesignation(ress)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [UrlLink])

        const handleSpecialityChange = (e) => {
        const { name, value } = e.target;
        setSearchCategory(
           value
        );
    };

     const handleDesChange = (e) => {
        const { name, value } = e.target;
        setSearchDesignation(
           value
        );
    };
    
    


    return (
        <>
            <div className="Main_container_app">
                <h3>Employee List</h3>
                <div className="search_div_bar">
                    <div className=" search_div_bar_inp_1">
                        <label htmlFor="">Search Here
                            <span>:</span>
                        </label>
                        <input
                            type="text"
                            value={SearchQuery}
                            placeholder='Name or Number'
                        onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className=" search_div_bar_inp_1">
                        <label htmlFor="">Category
                            <span>:</span>
                        </label>
                        <select
                                name='Category'
                                required
                                value={SearchCategory}
                                onChange={handleSpecialityChange}
                            >
                                <option value=''>Select Category</option>
                                {Categories.filter(p => p.Status === 'Active')?.map((Catg, indx) => (
                                    <option key={indx} value={Catg.id}>
                                        {Catg.CategoryName}
                                    </option>
                                ))}
                            </select>
                    </div>

                    <div className=" search_div_bar_inp_1">
                        <label htmlFor="">Designation
                            <span>:</span>
                        </label>
                        <select
                                name='Designation'
                                required
                                value={SearchDesignation}
                                onChange={handleDesChange}
                            >
                                <option value=''>Select Category</option>
                                {Designation.filter(p => p.Status === 'Active')?.map((Catg, indx) => (
                                    <option key={indx} value={Catg.id}>
                                        {Catg.Designation}
                                    </option>
                                ))}
                            </select>
                    </div>


                    <button
                        className="search_div_bar_btn_1"
                        onClick={handlenewEmpRegister}
                        title="New Doctor Register"
                    >
                        <LoupeIcon />
                    </button>

                    <div className="RegisForm_1">
                              <input
                                id="fileInput"
                                type="file"
                                accept=".xlsx, .xls, .csv"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                              />
                              <div style={{ display: "flex", gap: "10px" }}>
                                <label htmlFor="fileInput" className="RegisterForm_1_btns choose_file_update" style={{ cursor: 'pointer' }}>
                                  <PhotoCameraBackIcon />
                                </label>
                                <button className="fileviewbtn" title='Upload' onClick={FileUpload}>
                                  <UploadIcon />
                                </button>
                                <button className="fileviewbtn" onClick={ClearFields}>
                                  Clear Fields
                                </button>
                              </div>
                    </div>

                </div>

                 {loading && (
                    <div className="loader">
                    <div className="Loading">
                        <div className="spinner-border"></div>
                        <div>Loading...</div>
                    </div>
                    </div>
                )}
                <ReactGrid columns={EmployeeRegisterColumns} RowData={EmployeeRegisterData} />

            </div>
            <ToastAlert Message={toast.message} Type={toast.type} />
        </>
    )
}

export default EmployeeRegistrationList;