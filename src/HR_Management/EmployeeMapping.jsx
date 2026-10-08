import React, { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import { FaTrash } from "react-icons/fa";

import BadgeSharpIcon from '@mui/icons-material/BadgeSharp';

function EmployeeMapping() {

          const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
          const userRecord = useSelector((state) => state.userRecord?.UserData);
          const toast = useSelector((state) => state.userRecord?.toast);
          const dispatchvalue = useDispatch();

          const [Mappingdata,setMappingdata] = useState({

            HOD : "",
            HODName: "",
            Departmentname : "",
            Departmentid : "",
            Employeelist : []

          })

          const [openModal2, setOpenModal2] = useState(false);
          const [filteredTestList, setFilteredTestList] = useState([]);
          const [searchQuery, setsearchQuery] = useState("");

          const [selectedemp,setselectedemp] = useState([]);
          const [Mappedemplist,setMappedemplist] = useState([]);
          const [Emplist,setEmplist] = useState([]);

          const [load,setload] = useState(false);

          console.log(selectedemp,'selectedemp');
          console.log(Mappedemplist,'Mappedemplist');
          console.log(Emplist,'Emplist');
          console.log(Mappingdata,'Mappingdata')

          const openModal = () => {
            setOpenModal2(true);
          };
        
          const handleCloseModal1 = () => {
            setOpenModal2(false);
        
          };

          console.log(Mappingdata)

          const [EmployeeData,setEmployeeData] = useState([]);
          const [HODData,setHODData] = useState([]);
          const [hodId, setHodId] = useState("");

          const handleChange = (e) =>{

            const {value,name} = e.target;
            if(name == 'HOD'){
              setHodId(value);
            }
    
            setMappingdata((prev) => ({
              ...prev,
              [name]: value,
            }))
    
          };


          const handleRemoveTestName = (row) => {

            setselectedemp(selectedemp.filter(emp => emp.id !== row.id));
         
            // const newSubtestNoState = SubtestNo.filter(
            //   (item) =>
            //     item.testid !== row.testid || item.Radiologyid !== row.Radiologyid
            // );
            // setSubtestNo(newSubtestNoState);
          };

          const handleRemoveEmployeeName = (row) => {

            console.log(row,'row');

            const finaldata = {
              ...row,
              hodId : hodId
            }

            axios
        .post(`${UrlLink}HR_Management/Employee_mapping_Remove_Details`, finaldata)
        .then((res) => {

          console.log(res.data);
          const resres = res.data;
         
          let typp = Object.keys(resres)[0];
          let mess = Object.values(resres)[0];
          const tdata = {
            message: mess,
            type: typp,
          };
          dispatchvalue({ type: "toast", value: tdata });
          setload((prev) => !prev);
          setselectedemp([]);
        
        })
        .catch((err) => {
          console.log(err);
        });



          };


          useEffect(() => {
            axios.get(`${UrlLink}HR_Management/Employee_Details?employeeid=${hodId}`)
                .then((res) => {
                  const ress = res.data;
                 
                  setMappingdata({
                    HOD : ress[0].Employeeid,
                    HODName : ress[0].Employeename,
                    Departmentname : ress[0].departments,
                    Departmentid : ress[0].departmentId,
                    Employeelist : []
                  }); 
                })
                .catch((err) => console.log(err));
        }, [hodId]); 

        useEffect(() => {
          axios.get(`${UrlLink}HR_Management/Employee_mapping_Details?hodid=${hodId}`)
            .then((res) => {
              if (res.data.length > 0) {
                const responseData = res.data[0]; 
        
                console.log("API Response Data:", responseData);
                setEmplist(responseData.Employeeidlist);
        
               
                const formattedData = responseData.Employeeidlist.map((id, index) => ({
                  id: index + 1, 
                  HODid: index === 0 ? responseData.HODid : "", 
                  Employeeid: id, 
                  Employeename: responseData.Employeenamelist[index] || "N/A", 
                  Empdesignation: responseData.Empdesignationlist[index] || "N/A", 
                  rowspan: index === 0 ? responseData.Employeeidlist.length : 0, 
                }));
        
                setMappedemplist(formattedData);
              } 
            })
            .catch((err) => console.log(err));
        }, [hodId,load]);


        

        useEffect(() => {
          axios.get(`${UrlLink}HR_Management/Employee_List_Details?deptid=${Mappingdata.Departmentid}&empid=${hodId}`)
              .then((res) => {
                const ress = res.data;
                console.log(ress)
                setEmployeeData(ress);
                setFilteredTestList(ress);
               
              })
              .catch((err) => console.log(err));
      }, [Mappingdata.Departmentid]); 

        useEffect(() => {
          axios.get(`${UrlLink}HR_Management/Get_HOD_Details`)
              .then((res) => {
                const ress = res.data;
                setHODData(ress)
              })
              .catch((err) => console.log(err));
      }, [UrlLink]); 

      const handleSearchlabChange = (e) => {
        const query = e.target.value.toLowerCase();
        setsearchQuery(query);
      
        if (!query) {
          setFilteredTestList(EmployeeData); // Reset to full list if empty
          return;
        }
      
        const filteredList = EmployeeData.filter((test) => 
          (typeof test?.Employee_Id === "string" && test.Employee_Id.toLowerCase().includes(query)) || 
          (typeof test?.FirstName === "string" && test.FirstName.toLowerCase().includes(query))
        );
      
        setFilteredTestList(filteredList);
      };


      const handleCheckboxChange = (e, emp) => {
        const { checked, value } = e.target;
    
        const employee = EmployeeData.find((item) => item.Employee_Id === value);
    
        setselectedemp((prevSelected) => {
            if (checked) {
                if (!prevSelected.some((item) => item.Employee_Id === value)) {
                    // Assign a serial number based on the current length + 1
                    return [...prevSelected, { ...employee, SNo: prevSelected.length + 1 }];
                }
            } else {
                // Remove the employee and reassign serial numbers
                const updatedList = prevSelected.filter((item) => item.Employee_Id !== value);
                return updatedList.map((item, index) => ({ ...item, SNo: index + 1 }));
            }
            return prevSelected;
        });


        setMappingdata((prevState) => {
          let updatedList = [...prevState.Employeelist];
  
          if (checked) {
             
              if (!updatedList.includes(value)) {
                  updatedList.push(value);
              }
          } else {
            
              updatedList = updatedList.filter((id) => id !== value);
          }
  
          return {
              ...prevState,
              Employeelist: updatedList, 
          };
      });
    };
    

    


      const isChecked = (emp) => Mappingdata.Employeelist.includes(emp.Employee_Id);

      const empColumns = [

        { key: "id", name: "S.No", frozen: true },
        { key: "FullName", name: "Name", frozen: true},
        {key:"Designation",name:"Designation"},
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

      const renderHODColumn = ({ row }) => {
    if (row.rowspan > 0) {
      return (
        <td rowSpan={row.rowspan} style={{ verticalAlign: "middle", textAlign: "center" }}>
          {row.HODid}
        </td>
      );
    }
    return null; // Empty cell for rows where rowspan is 0
  };

  const empColumns2 = [
    { key: "id", name: "S.No", frozen: true },
    {
      key: "HODid",
      name: "HOD ID",
      frozen: true,
      renderCell: renderHODColumn,
    },
    { key: "Employeeid", name: "Employee ID" },
    { key: "Employeename", name: "Employee Name" },
    { key: "Empdesignation", name: "Designation" },{
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <Button
          className="cell_btn"
          onClick={() => handleRemoveEmployeeName(params.row)}
        >
          <FaTrash className="check_box_clrr_cancell" />
        </Button>
      ),
    },
  ];


      const  handlesubmit = () => {

        const finaldata = {
          ...Mappingdata,
          createdby : userRecord.username,
        }

        console.log(finaldata);

        axios
        .post(`${UrlLink}HR_Management/Employee_mapping_Details`, finaldata)
        .then((res) => {

          console.log(res.data);
          const resres = res.data;
         
          let typp = Object.keys(resres)[0];
          let mess = Object.values(resres)[0];
          const tdata = {
            message: mess,
            type: typp,
          };
          dispatchvalue({ type: "toast", value: tdata });
          setload((prev) => !prev);
          setselectedemp([]);
        
        })
        .catch((err) => {
          console.log(err);
        });
      }

      
        

  return (
    <>


    <div className="DivCenter_container">Employee Mapping</div>

    <div className="Main_container_app">

    <div className="RegisFormcon_1">

          <div className="RegisForm_1">
            <label>
              HOD :
            </label>  
               <input
                  name="HOD"
                  value={hodId}
                  onChange={handleChange}
                  autoComplete="off"
                  list = "EmployeeData"
                />
                  <datalist id="EmployeeData">
              {Array.isArray(HODData) &&
                HODData.map((p) => (
                  <option key={p.Employee_Id} value={p.Employeeid}>
                    {p.Employeename}
                  </option>
                ))}
            </datalist>
          </div>

          <div className="RegisForm_1">
          <label>
              HODName :
            </label> 

            <input
                  name="HODName"
                  value={Mappingdata.HODName}
                  onChange={handleChange}
                  disabled
                />


          </div>

          <div className="RegisForm_1">
          <label>
             DepartmentName :
            </label> 

            <input
                  name="Departmentname"
                  value={Mappingdata.Departmentname}
                  onChange={handleChange}
                  disabled
                />


          </div>

          <div className="RegisForm_1">
          
                          <Button onClick={() => openModal()}>
                            <BadgeSharpIcon />
                          </Button>
          </div>

          {openModal2 && (
          <div className="loader" onClick={handleCloseModal1}>
            <div className="cardModel" onClick={(e) => e.stopPropagation()}>
              <div className="Main_container_app">
                <h3>Test Names</h3>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    placeItems: "center",
                    gap: "15px",
                    padding: "0px 15px",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <div className="con_1">
                      <div className="inp_1">
                        <label htmlFor="input">
                          Employee ID <span>:</span>
                        </label>
                        <input
                          type="text"
                          value={searchQuery}
                          placeholder="Enter Test Name"
                         onChange={(e) => handleSearchlabChange (e, "name")}
                        />
                      </div>
                    </div>
                  </div>

                  {Array.isArray(filteredTestList) && filteredTestList.length > 0 ? (
                    filteredTestList.map((emp, index) => (
                      <div key={index}>
                        <label
                          htmlFor={`test-${index}`}
                          style={{
                            gap: "15px",
                            padding: "10px",
                          }}
                        >
                          <input
                            type="checkbox"
                            name="testArray"
                            id={`test-${index}`}
                            value={emp.Employee_Id}
                            checked={isChecked(emp) || Emplist.includes(emp.Employee_Id)}
                            onChange={(e) => handleCheckboxChange(e, emp)}
                          />
                          {emp.FullName}
                        </label>
                      </div>
                    ))
                  ) : (
                    <div className="Add_items_Purchase_Master">
                      <span>No Employee Found</span>
                    </div>
                  )}

                </div>

              </div>
            </div>
          </div>
        )}

          

          



    </div>


    {selectedemp.length > 0 &&
        <ReactGrid columns={empColumns} RowData={selectedemp} />
      }

    {Mappedemplist.length > 0 && <ReactGrid columns={empColumns2} RowData={Mappedemplist} />}
    </div>

    
    <div className="Main_container_Btn">
          <button onClick={handlesubmit}>
            Save
          </button>
        </div>

        <ToastAlert Message={toast.message} Type={toast.type} />
  
    </>
  );
};


export default EmployeeMapping