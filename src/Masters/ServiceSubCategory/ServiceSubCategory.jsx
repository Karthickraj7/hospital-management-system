import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import ListIcon from '@mui/icons-material/List';
import { useNavigate } from 'react-router-dom';
import { MdQrCode2 } from "react-icons/md";

const ServiceSubCategory = () => {

    const UrlLink = useSelector(state => state.userRecord?.UrlLink);

    const navigate = useNavigate()

    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const toast = useSelector(state => state.userRecord?.toast);
    const dispatchvalue = useDispatch();
    const [category, setcategory] = useState([]);
    const [subcategory, setsubcategory] = useState([]);
    const [load,setload] = useState(false);

    const [services,setservices] = useState([]);


    const [Servicetype, setServicetype] = useState({
        Categoryid: "",
        Categoryname:"",  
        ServiceCategory: '',
        ServiceSubCategory: '',
        Subcategorypk:"",
        SubCategoryid: "",
        SubCategoryname: "",
        Type:""

    });
    console.log('serviceee',Servicetype);
    

    useEffect(() => {
        axios.get(`${UrlLink}Masters/Insert_service_category_master`)
            .then((res) => {
                const ress = res.data
                console.log(ress, 'ddhdhdhdhdhdhdhdhdhdhdhdhdhdh');

                setcategory(ress)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [UrlLink])

    useEffect(() => {
        axios.get(`${UrlLink}Masters/Services_List_by_servicecategory?servicecategory=${Servicetype.Categoryid}`)
            .then((res) => {
                const ress = res.data
                console.log(ress, 'ddhdhdhdhdhdhdhdhdhdhdhdhdhdh');

                setsubcategory(ress)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [UrlLink,Servicetype.Categoryid])


    useEffect(() => {
        axios.get(`${UrlLink}Masters/Services_Group_details`)
            .then((res) => {
                const ress = res.data
                console.log(ress, 'ddhdhdhdhdhdhdhdhdhdhdhdhdhdh');

                setservices(ress)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [UrlLink,Servicetype])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        if (name === "ServiceCategory") {
            const value1 = value.split('-');
            const Categoryid = value1[0];
            const Categoryname = value1[1];
            setServicetype((prev) => ({
                ...prev,
                Categoryid: Categoryid,
                Categoryname: Categoryname,
            }));
        } 
        else if (name === "ServiceSubCategory") {
            const value1 = value.split('-');
            if (value1.length === 3) {

                console.log(value1,'value1value1');
                const subcategorypk = value1[0];
                const subCategoryid = value1[1];
                const subCategoryname = value1[2];
                setServicetype((prev) => ({
                    ...prev,
                    SubCategoryid: subCategoryid,
                    [name]: subCategoryid,
                    Subcategorypk: subcategorypk,
                    Type : subCategoryname
                }));
            } else if (value1.length === 2) {
                const subcategorypk = value1[0];
                const subCategoryname = value1[1];
                setServicetype((prev) => ({
                    ...prev,
                    Subcategorypk: subcategorypk,
                    [name]: subCategoryname,
                    SubCategoryid: '',
                   
                }));
            } else if (value1.length === 4) {
                const subcategorypk = value1[0];
                const roomno = value1[1];
                const bedno = value1[2];
                const Wardname = value1[3];
                const subCategoryname = roomno + bedno + Wardname;
                setServicetype((prev) => ({
                    ...prev,
                    Subcategorypk: subcategorypk,
                    [name]: subCategoryname,
                }));
            } else {
                setServicetype((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }
        }
    };
    


    const handleDeleteService = async (params) =>{

        try {
            console.log(params);
            const response = await axios.post(  
                `${UrlLink}Masters/service_map_delete?id=${params}`,
                
            );
            const resData = response.data
            
            const mess = Object.values(resData)[0]; 
            const typp = Object.keys(resData)[0];  
            const tdata = {
                message: mess,
                type: typp,
            };
            dispatchvalue({ type: "toast", value: tdata });

            setServicetype({
                Categoryid: "",
                Categoryname:"",  
                ServiceCategory: '',
                ServiceSubCategory: '',
                Subcategorypk:"",
                SubCategoryid: "",
                SubCategoryname: "",
            });

            setload((prev)=>(!prev));
        } catch (error) {
            console.error("An error occurred:", error);
        }

    };

    const handleSubmit = async () => {

        try {
            const response = await axios.post(
                `${UrlLink}Masters/service_map_details`,
                Servicetype
            );
            const resData = response.data
            
            const mess = Object.values(resData)[0];
            const typp = Object.keys(resData)[0];
            const tdata = {
                message: mess,
                type: typp,
            };
            dispatchvalue({ type: "toast", value: tdata });

            setServicetype({
                Categoryid: "",
                Categoryname:"",  
                ServiceCategory: '',
                ServiceSubCategory: '',
                Subcategorypk:"",
                SubCategoryid: "",
                SubCategoryname: "",
            });

            setload((prev)=>(!prev));
        } catch (error) {
            console.error("An error occurred:", error);
        }



    };

    return (
        <>
            <div className="common_center_tag">
                <span>Service Sub Category</span>
            </div>
            <br />
          {/*}  <div className="RegisFormcon_1">
                <div className="RegisForm_1">
                    <label>
                        Service Category <span>:</span>
                    </label>
                    <input
                        id="ServiceCategory"
                        name="ServiceCategory"
                        value={Servicetype.Categoryname}
                        onChange={handleInputChange}
                        list="CategoryNameList"

                    />

                    <datalist id="CategoryNameList">
                        {Array.isArray(category) &&
                            category.map((f, i) => (
                                <option key={i} value={`${f.Serviceid}-${f.ServiceCategory}`}></option>
                            ))}
                    </datalist>
                </div>
                <br />

                <div className="RegisForm_1">
                    <label>
                        Service Sub Category <span>:</span>
                    </label>
                    <input
                        id="ServiceSubCategory"
                        name="ServiceSubCategory"
                        value={Servicetype.ServiceSubCategory}
                        onChange={handleInputChange}
                        list="SubCategoryNameList"

                    />

                    <datalist id="SubCategoryNameList">
                        {Array.isArray(subcategory) &&
                            subcategory.map((f, i) => (
                                <option key={i} value={`${f.pk}-${f.service_subcategory}`}></option>
                            ))}
                    </datalist>
                </div>

                <div className="Main_container_Btn">
                    <button
                        onClick={handleSubmit}
                    >
                        {Servicetype.Serviceid ? 'Update' : 'Save'}
                    </button>
                </div>


            </div> */}

            <div className="Selected-table-container">
          <table className="selected-medicine-table2">
            <thead>
              <tr>

                <th>S.NO</th>
                <th>Category Name</th>
                <th>SubCategory Name</th>
                <th></th>
                
              </tr>
            </thead>
            <tbody>
            {Array.isArray(services) &&services.map((pkg) => (
                <tr key={pkg.id}>
                  <td>{pkg.Sno}</td>
                  <td>{pkg.category}</td>
                  <td>{pkg.service_subcategory}</td>
                  <td>
                  <button
                      className="delnamebtn"
                      onClick={() => handleDeleteService(pkg.id)}
                    >
                      <DeleteIcon />
                    </button>
                  </td>
                  
                  {/* <td>
                    <button
                      className="delnamebtn"
                      onClick={() => handleEdit(pkg)}
                    >
                      <EditIcon />
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>



            {/*      
            {category.length> 0 &&
                <ReactGrid columns={CategoryMaster}RowData={category} />}
             */}
             <ToastAlert Message={toast.message} Type={toast.type} />
        </>
    )
}

export default ServiceSubCategory
