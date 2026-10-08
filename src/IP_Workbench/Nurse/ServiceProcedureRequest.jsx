import axios from 'axios';
import React, { useEffect, useState,useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import { formatLabel } from '../../OtherComponent/OtherFunctions';

const ServiceProcedureRequest = () => {
    const [ServiceProcedureForm, setServiceProcedureForm] = useState('Service');
    const [ServiceProcedureData, setServiceProcedureData] = useState([]);
    const [ServiceProcedureDataGet, setServiceProcedureDataGet] = useState([]);
    const [ServiceProcedure, setServiceProcedure] = useState({
        ServiceCategory: '',
        Categoryid: '',
        ServiceSubCategory: '',
        ServiceSubCatId: '',
        Subcategorypk: '',
        Units: '',
    });
    const [ServiceCategoryData, setServiceCategoryData] = useState([])
    const [ServiceSubCategoryData, setServiceSubCategoryData] = useState([])

    const [getdata, setgetdata] = useState(false)
    const IP_DoctorWorkbenchNavigation = useSelector(state => state.Frontoffice?.IP_DoctorWorkbenchNavigation);
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const UserData = useSelector((state) => state.userRecord?.UserData);
    const toast = useSelector(state => state.userRecord?.toast);
    const dispatchvalue = useDispatch()
    useEffect(() => {
        axios.get(`${UrlLink}/Masters/get_service_procedure_for_ip?MasterType=${ServiceProcedureForm}`)
            .then((res) => {
                setServiceProcedureData(Array.isArray(res.data) ? res.data : [])
            })
            .catch((err) => {
                console.log(err);
            })
    }, [ServiceProcedureForm, UrlLink])

    useEffect(() => {
        axios.get(`${UrlLink}/Masters/service_added_details?RegistrationId=${IP_DoctorWorkbenchNavigation?.RegistrationId}`)
            .then((res) => {
                setServiceProcedureDataGet(Array.isArray(res.data) ? res.data : [])
            })
            .catch((err) => {
                console.log(err);
            })
    }, [ServiceProcedureForm, IP_DoctorWorkbenchNavigation?.RegistrationId, UrlLink, getdata])


    useEffect(() => {
        axios.get(`${UrlLink}Masters/services_Group_list_details`)
            .then((res) => {
                const ress = res.data
                console.log(ress, 'ddhdhdhdhdhdhdhdhdhdhdhdhdhdh');

                setServiceCategoryData(ress)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [UrlLink]);


    const HandleOnChange = (e) => {
        const { name, value } = e.target;
    
        if (name === 'ServiceCategory') {
            if (value.includes('-')) {
                const [value2, value3] = value.split('-'); // Extracting values
    
                console.log('serrrrrr', value, value2, value3);
    
                setServiceProcedure((prev) => ({
                    ...prev,
                    Categoryid: value2,
                    [name]: value3,
                }));
    
                if (value2) {
                    axios.get(`${UrlLink}Masters/services_Subcategory_details_by_category?ServiceCategory=${value2}`)
                        .then((res) => {
                            console.log(res.data, 'Fetched Subcategory Data');
                            setServiceSubCategoryData(res.data);
                        })
                        .catch((err) => console.error(err));
                }
            } else if (value === '') {
                // If ServiceCategory is cleared, remove dependent fields
                setServiceProcedure((prev) => ({
                    ...prev,
                    Categoryid: '',
                    ServiceSubCatId: '',
                    Subcategorypk: '',
                    ServiceSubCategory: '',
                    Units:'',
                    [name]: '',
                }));
                setServiceSubCategoryData([]); // Clear subcategory options
            } else {
                setServiceProcedure((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }
        } else if (name === 'ServiceSubCategory') {
            const valueParts = value.split('-');
    
            if (valueParts.length === 3) {
                const [subcategorypk, subCategoryid, subCategoryname] = valueParts;
                setServiceProcedure((prev) => ({
                    ...prev,
                    ServiceSubCatId: subCategoryid,
                    Subcategorypk: subcategorypk,
                    [name]: subCategoryname,
                }));
            } else if (valueParts.length === 2) {
                const [subcategorypk, subCategoryname] = valueParts;
                setServiceProcedure((prev) => ({
                    ...prev,
                    Subcategorypk: subcategorypk,
                    [name]: subCategoryname,
                }));
            } else if (valueParts.length === 4) {
                const [subcategorypk, roomno, bedno, Wardname] = valueParts;
                const subCategoryname = `${roomno}${bedno}${Wardname}`;
                setServiceProcedure((prev) => ({
                    ...prev,
                    Subcategorypk: subcategorypk,
                    [name]: subCategoryname,
                }));
            } else {
                setServiceProcedure((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }
        } else {
            setServiceProcedure((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };
    

    console.log('serrrrrrvvv', ServiceProcedure);


    const [isSubmitting, setIsSubmitting] = useState(false);
const abortControllerRef = useRef(null);

const handlesubmit = async () => {
    // Prevent multiple simultaneous submissions
    if (isSubmitting) {
        const tdata = {
            message: 'Submission already in progress',
            type: 'warn',
        };
        dispatchvalue({ type: 'toast', value: tdata });
        return;
    }

    // Validate required fields
    if (!ServiceProcedure?.ServiceCategory || !ServiceProcedure?.ServiceSubCategory || !ServiceProcedure?.Units) {
        const tdata = {
            message: 'Please fill all the fields',
            type: 'warn',
        };
        dispatchvalue({ type: 'toast', value: tdata });
        return;
    }

    // Set submitting state and create abort controller
    setIsSubmitting(true);
    abortControllerRef.current = new AbortController();

    try {
        const submitdata = {
            RegistrationId: IP_DoctorWorkbenchNavigation?.RegistrationId,
            PatientCategory: IP_DoctorWorkbenchNavigation?.PatientCategory,
            PatientSubCat: IP_DoctorWorkbenchNavigation?.PatientCategoryId,
            WardId: IP_DoctorWorkbenchNavigation?.WardId,
            category_id: IP_DoctorWorkbenchNavigation?.PatientCategoryId,
            ...ServiceProcedure,
            MasterType: ServiceProcedureForm,
            createdby: UserData?.username
        };
        
        console.log('subbb', submitdata);

        const response = await axios.post(
            `${UrlLink}Masters/service_added_details`, 
            submitdata, 
            {
                signal: abortControllerRef.current.signal
            }
        );

        console.log(response.data);
        const resres = response.data;
        let typp = Object.keys(resres)[0];
        let mess = Object.values(resres)[0];
        
        const tdata = {
            message: mess,
            type: typp,
        };
        
        setgetdata(prev => !prev);
        dispatchvalue({ type: 'toast', value: tdata });

        // Reset form
        setServiceProcedure({
            ServiceCategory: '',
            ServiceSubCategory: '',
            ServiceSubCatId: '',
            Subcategorypk: '',
            Units: '',
        });

    } catch (err) {
        // Only log error if it's not an abort error
        if (!axios.isCancel(err)) {
            console.log('Submission error:', err);
            const tdata = {
                message: 'Submission failed. Please try again.',
                type: 'error',
            };
            dispatchvalue({ type: 'toast', value: tdata });
        }
    } finally {
        // Clean up
        setIsSubmitting(false);
        abortControllerRef.current = null;
    }
};

// Optional: Add a cleanup function to abort on unmount
useEffect(() => {
    return () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    };
}, []);

    const Servicecolumns1 = [
        {
            key: "DateTime",
            name: "Date Time",
            frozen: true
        },
        {
            key: "Status",
            name: "Status",
            frozen: true
        },
    ]
    const Servicecolumns = [
        {
            key: "category",
            name: "Service Category",
            frozen: true
        },
        {
            key: "service_subcategory",
            name: "Service SubCategory",
            frozen: true
        },
        {
            key: "rate",
            name: 'Rate',
        },
        ServiceProcedureForm === 'Procedure' ? {
            key: "ServiceType",
            name: `${ServiceProcedureForm} Type`,
        } : undefined,
        {
            key: "Units",
            name: "Units",
        }
    ].filter(Boolean); // Filters out undefined values

    return (
        <>
            <div className='new-patient-registration-form'>
                <div className='DivCenter_container'>Service / Procedure Request</div>
                {/* <div className="RegisterTypecon">
                    <div className="RegisterType">
                        {["Service"].map((p, ind) => (
                            <div className="registertypeval" key={ind + 'key'}>
                                <input
                                    type="radio"
                                    id={p}
                                    name="appointment_type"
                                    checked={ServiceProcedureForm === p}
                                    onChange={(e) => {
                                        setServiceProcedureForm(e.target.value)
                                        setServiceProcedure({
                                            ServiceCategory: '',
                                            ServiceSubCategory: '',
                                            Units: '',
                                        })
                                    }
                                    }
                                    value={p}
                                />
                                <label htmlFor={p}>
                                    {p}
                                </label>
                            </div>
                        ))}
                    </div>
                </div> */}
                {/* <h3>Services Request</h3> */}
                <br />
                <div className="RegisFormcon_1">
                    {
                        Object.keys(ServiceProcedure).filter((p) => p !== 'ServiceSubCatId' && p !== 'Subcategorypk' && p !== 'Categoryid' ).map((field, indx) => (
                            <div className="RegisForm_1" key={indx}>
                                <label htmlFor={`${field}_${indx}`}>
                                    {formatLabel(field)}
                                    <span>:</span>
                                </label>
                                {
                                    ['ServiceCategory', 'ServiceSubCategory'].includes(field) ? (
                                        <input
                                            type='text'
                                            name={field} // Add the name attribute here
                                            value={ServiceProcedure[field]}
                                            list={`${field}_ServiceCategory`}
                                            onChange={HandleOnChange}
                                            autoComplete='off'
                                        // onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                                        />

                                    ) : (
                                        <input
                                            type='number'
                                            name={field} // Add the name attribute here
                                            value={ServiceProcedure[field]}
                                            onChange={HandleOnChange}
                                            onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                                            autoComplete='off'
                                        />
                                    )
                                }
                                {
                                    <datalist id={`${field}_ServiceCategory`}>
                                        {field === 'ServiceCategory' && (
                                            ServiceCategoryData?.map((row, indx) =>
                                                <option key={indx} value={`${row.service_category_id}-${row.service_name}`}>
                                                    {row.service_name}
                                                </option>
                                            )
                                        )}
                                        {field === 'ServiceSubCategory' && (
                                            Array.isArray(ServiceSubCategoryData) &&
                                            ServiceSubCategoryData.map((row, indx) =>
                                                <option key={indx} value={`${row.pk}-${row.service_subcategory}`}>
                                                    {row.service_subcategory}
                                                </option>
                                            )
                                        )}
                                    </datalist>
                                }

                            </div>
                        ))
                    }
                </div>
                <div className="Main_container_Btn">
                    <button onClick={handlesubmit} disabled ={isSubmitting}>
                       {isSubmitting ? 'Submitting...' : 'Add'}
                    </button>
                </div>
                <br />
                <ReactGrid columns={Servicecolumns} RowData={ServiceProcedureDataGet} />

            </div>
            <ToastAlert Message={toast.message} Type={toast.type} />

        </>
    )
}

export default ServiceProcedureRequest;