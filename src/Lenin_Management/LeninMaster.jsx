import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
import DeleteIcon from "@mui/icons-material/Delete";
const LeninMaster = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const toast = useSelector(state => state.userRecord?.toast);
    const dispatchvalue = useDispatch();

    const formatLabel = (label) => {
        if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
            return label
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .replace(/^./, (str) => str.toUpperCase());
        } else {
            return label;
        }
    };

    //=================== Lenin category ========================================

    const [LeninCatg, setLeninCatg] = useState({
        catgId: '',
        LeninCategory: '',
    })

    const [LeninCatgData, setLeninCatgData] = useState([])
    const [IsLeninCatgGet, setIsLeninCatgGet] = useState(false)
    const [searchCatg, setSearchCatg] = useState("");

    // --- CORRECTED DELETE HANDLER FOR CATEGORY ---
    const handleDeleteCatg = (params) => {
        if (window.confirm("Are you sure you want to delete this Category?")) {
            const data = {
                catgId: params.catgId, // Extract ID from row data
                isDelete: true
            }
            axios.post(`${UrlLink}LeninManagement/Lenin_Catg_Master_Detials_link`, data)
                .then((res) => {
                    const resres = res.data
                    dispatchvalue({ 
                        type: 'toast', 
                        value: { message: Object.values(resres)[0], type: Object.keys(resres)[0] } 
                    });
                    setIsLeninCatgGet(prev => !prev) // Refresh Grid
                    setLeninCatg({ catgId: '', LeninCategory: '' }) // Clear form
                })
                .catch(err => console.log(err));
        }
    }

    const LeninCatgColumns = [
        { key: "catgId", name: "catg Id", frozen: true },
        { key: "created_by", name: "Created By ", frozen: true },
        { key: "LeninCategory", name: "Lenin Category" },
        {
            key: "Status",
            name: "Status",
            renderCell: (params) => (
                <Button className="cell_btn" onClick={() => handleeditLeninCatgstatus(params.row)}>
                    {params.row.Status}
                </Button>
            ),
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <div style={{ display: 'flex', gap: '5px' }}>
                    <Button className="cell_btn" onClick={() => handleeditLeninCatg(params.row)}>
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                    <Button className="cell_btn" onClick={() => handleDeleteCatg(params.row)}>
                        <DeleteIcon className="check_box_clrr_cancell" />
                    </Button>
                </div>
            ),
        }
    ]

    const getcategory = () => {
        axios.get(`${UrlLink}LeninManagement/Lenin_Catg_Master_Detials_link`)
            .then((res) => {
                setLeninCatgData(res.data)
            })
            .catch((err) => console.log(err))
    }

    const fetchData = async () => {
        try {
            const [leninCategoryResponse] = await Promise.all([
                axios.get(`${UrlLink}LeninManagement/Lenin_Catg_Master_Detials_link`),
            ]);
            setLeninCategoryData(leninCategoryResponse.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleeditLeninCatgstatus = (params) => {
        const data = { catgId: params.catgId, Statusedit: true }
        axios.post(`${UrlLink}LeninManagement/Lenin_Catg_Master_Detials_link`, data)
            .then((res) => {
                const resres = res.data
                dispatchvalue({ type: 'toast', value: { message: Object.values(resres)[0], type: Object.keys(resres)[0] } });
                setIsLeninCatgGet(prev => !prev)
            })
            .catch(err => console.log(err))
    }

    const handleeditLeninCatg = (params) => {
        const { catgId, LeninCategory } = params
        setLeninCatg({ catgId, LeninCategory })
    }

    const handleLeninCatgSubmit = () => {
        if (LeninCatg.LeninCategory) {
            const data = { ...LeninCatg, created_by: userRecord?.username || '' }
            axios.post(`${UrlLink}LeninManagement/Lenin_Catg_Master_Detials_link`, data)
                .then((res) => {
                    const resres = res.data
                    getcategory();
                    fetchData();
                    dispatchvalue({ type: 'toast', value: { message: Object.values(resres)[0], type: Object.keys(resres)[0] } });
                    setIsLeninCatgGet(prev => !prev)
                    setLeninCatg({ catgId: '', LeninCategory: '' })
                })
                .catch(err => console.log(err))
        } else {
            dispatchvalue({ type: 'toast', value: { message: `Please provide all field.`, type: 'warn' } });
        }
    }

    useEffect(() => {
        getcategory()
    }, [IsLeninCatgGet, UrlLink])

    const handleLeninCatgChange = (e) => {
        const { name, value } = e.target;
        setLeninCatg((prev) => ({ ...prev, [name]: value?.toUpperCase()?.trim() }));
    };

    const filteredLeninCatgData = LeninCatgData.filter((row) => {
        return Object.values(row).some((val) => String(val).toLowerCase().includes(searchCatg.toLowerCase()));
    });

    //======================== Lenin Master Details ===================================

    const [Lenin, setLenin] = useState({
        LeninCode: '',
        LeninCategory: '',
        LeninType: '',
        LeninSize: '',
        ColorCode: '',
        MaxWashCount: '',
        InfectionCategory: '',
        Remarks: '',
    })

    const [LeninData, setLeninData] = useState([])
    const [IsLeninGet, setIsLeninGet] = useState(false)
    const [LeninCategoryData, setLeninCategoryData] = useState([]);
    const [searchLenin, setSearchLenin] = useState("");

    // --- CORRECTED DELETE HANDLER FOR LENIN DETAILS ---
    const handleDeleteLenin = (params) => {
        if (window.confirm("Are you sure you want to delete this Lenin item?")) {
            const data = {
                LeninCode: params.LeninCode, // Extract ID from row data
                isDelete: true
            }
            axios.post(`${UrlLink}LeninManagement/LeninMaster_Detials_link`, data)
                .then((res) => {
                    const resres = res.data
                    dispatchvalue({ 
                        type: 'toast', 
                        value: { message: Object.values(resres)[0], type: Object.keys(resres)[0] } 
                    });
                    setIsLeninGet(prev => !prev) // Refresh Grid
                    setLenin({ // Reset form
                        LeninCode: '', LeninCategory: '', LeninType: '', LeninSize: '',
                        ColorCode: '', MaxWashCount: '', InfectionCategory: '', Remarks: '',
                    })
                })
                .catch(err => console.log(err));
        }
    }

    const LeninColumns = [
        { key: "LeninCode", name: "Lenin Code", frozen: true },
        { key: "created_by", name: "Created By ", frozen: true },
        { key: "LeninCategory", name: "Lenin Category" },
        { key: "LeninType", name: "Lenin Type" },
        { key: "LeninSize", name: "Lenin Size" },
        { key: "ColorCode", name: "ColorCode" },
        { key: "MaxWashCount", name: "MaxWashCount" },
        { key: "InfectionCategory", name: "InfectionCategory" },
        {
            key: "Status",
            name: "Status",
            renderCell: (params) => (
                <Button className="cell_btn" onClick={() => handleeditLeninstatus(params.row)}>
                    {params.row.Status}
                </Button>
            ),
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <div style={{ display: 'flex', gap: '5px' }}>
                    <Button className="cell_btn" onClick={() => handleeditLenin(params.row)}>
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                    <Button className="cell_btn" onClick={() => handleDeleteLenin(params.row)}>
                        <DeleteIcon className="check_box_clrr_cancell" />
                    </Button>
                </div>
            ),
        },
        { key: "Remarks", name: "Remarks" }
    ]

    useEffect(() => {
        fetchData();
    }, [UrlLink]);

    const handleeditLeninstatus = (params) => {
        const data = { LeninCode: params.LeninCode, Statusedit: true }
        axios.post(`${UrlLink}LeninManagement/LeninMaster_Detials_link`, data)
            .then((res) => {
                const resres = res.data
                dispatchvalue({ type: 'toast', value: { message: Object.values(resres)[0], type: Object.keys(resres)[0] } });
                setIsLeninGet(prev => !prev)
            })
            .catch(err => console.log(err))
    }

    const handleeditLenin = (params) => {
        const { LeninCode, ...rest } = params
        setLenin({
            LeninCode: LeninCode,
            LeninCategory: rest.catgId || rest.CatgId || '',
            LeninType: rest.LeninType,
            LeninSize: rest.LeninSize,
            ColorCode: rest.ColorCode,
            MaxWashCount: rest.MaxWashCount,
            InfectionCategory: rest.InfectionCategory,
            Remarks: rest.Remarks
        })
    }

    const handleLeninSubmit = () => {
        if (Lenin.LeninCategory && Lenin.LeninType && Lenin.LeninSize && Lenin.ColorCode && Lenin.MaxWashCount && Lenin.InfectionCategory && Lenin.Remarks) {
            const data = { ...Lenin, created_by: userRecord?.username || '' }
            axios.post(`${UrlLink}LeninManagement/LeninMaster_Detials_link`, data)
                .then((res) => {
                    const resres = res.data
                    dispatchvalue({ type: 'toast', value: { message: Object.values(resres)[0], type: Object.keys(resres)[0] } });
                    setIsLeninGet(prev => !prev)
                    setLenin({
                        LeninCode: '', LeninCategory: '', LeninType: '', LeninSize: '',
                        ColorCode: '', MaxWashCount: '', InfectionCategory: '', Remarks: '',
                    })
                })
                .catch(err => console.log(err))
        } else {
            dispatchvalue({ type: 'toast', value: { message: `Please provide all field.`, type: 'warn' } });
        }
    }

    useEffect(() => {
        axios.get(`${UrlLink}LeninManagement/LeninMaster_Detials_link`)
            .then((res) => {
                setLeninData(res.data)
            })
            .catch(err => console.log(err))
    }, [IsLeninGet, UrlLink])

    const handleLeninChange = (e) => {
        const { name, value } = e.target;
        setLenin((prev) => ({ ...prev, [name]: value?.toUpperCase()?.trim() }));
    };

    const filteredLeninData = Array.isArray(LeninData)
  ? LeninData.filter((row) =>
      Object.values(row || {}).some((val) =>
        String(val ?? "")
          .toLowerCase()
          .includes(searchLenin.toLowerCase())
      )
    )
  : [];


    return (
        <>
            <div className="Main_container_app">
                <h3>Lenin Masters</h3>
                {/* JSX UI content remains the same... */}
                <div className="common_center_tag">
                    <span>Lenin Category</span>
                </div>
                <div className="RegisFormcon_1">
                    {Object.keys(LeninCatg).filter(p => p !== 'catgId').map((field, indx) => (
                        <div className="RegisForm_1" key={indx}>
                            <label> {formatLabel(field)} <span>:</span> </label>
                            <input
                                type="text"
                                name={field}
                                autoComplete='off'
                                required
                                value={LeninCatg[field]}
                                onChange={handleLeninCatgChange}
                            />
                        </div>
                    ))}
                </div>

                <div className="Main_container_Btn">
                    <button onClick={handleLeninCatgSubmit}>
                        {LeninCatg.catgId ? "Update" : "Add"}
                    </button>
                </div>

                <div className="RegisFormcon_1" style={{ justifyContent: 'flex-end', marginTop: '10px' }}>
                    <div className="RegisForm_1">
                        <label>Search Category<span>:</span></label>
                        <input
                            type="text"
                            placeholder="Search category..."
                            value={searchCatg}
                            onChange={(e) => setSearchCatg(e.target.value)}
                        />
                    </div>
                </div>

                <ReactGrid columns={LeninCatgColumns} RowData={filteredLeninCatgData} />

                <div className="common_center_tag">
                    <span>Lenin Details</span>
                </div>
                <div className="RegisFormcon_1">
                    {Object.keys(Lenin).filter(p => p !== 'LeninCode').map((field, indx) => (
                        <div className="RegisForm_1" key={indx}>
                            <label htmlFor={`${field}_${indx}_${field}`}> {formatLabel(field)} <span>:</span> </label>
                            {
                                ['LeninCategory', 'LeninSize', "ColorCode", 'InfectionCategory'].includes(field) ?
                                    <select
                                        name={field}
                                        required
                                        id={`${field}_${indx}_${field}`}
                                        value={Lenin[field]}
                                        onChange={handleLeninChange}
                                    >
                                        <option value=''>Select</option>
                                        {field === 'LeninCategory' &&
                                            LeninCategoryData.filter(p => p.Status === 'Active').map((p, index) => (
                                                <option key={index} value={p.catgId}>{p.LeninCategory}</option>
                                            ))
                                        }
                                        {field === 'LeninSize' &&
                                            ['XS', 'XXS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL', 'Free Size'].map((size, index) => (
                                                <option key={index} value={size}>{size}</option>
                                            ))
                                        }
                                        {field === 'ColorCode' && (
                                            <>
                                                <option value={'GREEN'} style={{ backgroundColor: "green" }}>Green</option>
                                                <option value={'RED'} style={{ backgroundColor: "Red" }}>Red</option>
                                                <option value={'YELLOW'} style={{ backgroundColor: "Yellow" }}>Yellow</option>
                                                <option value={'ORANGE'} style={{ backgroundColor: "Orange" }}>Orange</option>
                                                <option value={'WHITE'} style={{ backgroundColor: "White" }}>White</option>
                                                <option value={'BLACK'} style={{ backgroundColor: "Black", color: "White" }}>Black</option>
                                                <option value={'BLUE'} style={{ backgroundColor: "Blue" }}>Blue</option>
                                                <option value={'PINK'} style={{ backgroundColor: "Pink" }}>Pink</option>
                                                <option value={'PURPLE'} style={{ backgroundColor: "Purple" }}>Purple</option>
                                                <option value={'BROWN'} style={{ backgroundColor: "Brown" }}>Brown</option>
                                                <option value={'GREY'} style={{ backgroundColor: "Grey" }}>Grey</option>
                                                <option value={'NAVY'} style={{ backgroundColor: "#000080", color: 'white' }}>Navy</option>
                                                <option value={'SKYBLUE'} style={{ backgroundColor: " #87CEEB" }}>Sky Blue</option>
                                                <option value={'MAROON'} style={{ backgroundColor: "#800000" }}>Maroon</option>
                                                <option value={'MINT'} style={{ backgroundColor: "#98FF98" }}>Mint</option>
                                            </>
                                        )}
                                        {field === "InfectionCategory" && (
                                            <>
                                                <option value={"YES"}> Yes </option>
                                                <option value={'NO'}> No </option>
                                            </>
                                        )}
                                    </select>
                                    :
                                    <input
                                        type="text"
                                        name={field}
                                        autoComplete='off'
                                        required
                                        value={Lenin[field]}
                                        onChange={handleLeninChange}
                                    />
                            }
                        </div>
                    ))}
                </div>
                <div className="Main_container_Btn">
                    <button onClick={handleLeninSubmit}>
                        {Lenin.LeninCode ? "Update" : "Add"}
                    </button>
                </div>

                <div className="RegisFormcon_1" style={{ justifyContent: 'flex-end', marginTop: '10px' }}>
                    <div className="RegisForm_1">
                        <label>Search Lenin Details<span>:</span></label>
                        <input
                            type="text"
                            placeholder="Search type, size, etc..."
                            value={searchLenin}
                            onChange={(e) => setSearchLenin(e.target.value)}
                        />
                    </div>
                </div>

                <ReactGrid columns={LeninColumns} RowData={filteredLeninData} />

            </div>
            <ToastAlert Message={toast.message} Type={toast.type} />
        </>
    )
}

export default LeninMaster;