import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';


const VentilatorType = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const toast = useSelector(state => state.userRecord?.toast);
    const dispatchvalue = useDispatch();



    const [VentilatorType, setVentilatorType] = useState({
        VentilatorTypeId: '',
        VentilatorTypeName: '',

    });

    const [VentilatorTypeData, setVentilatorTypeData] = useState([])
    const [VentilatorTypeGet, setVentilatorTypeGet] = useState(false)


    const VentilatorTypeColumns = [
        {
            key: "id",
            name: "Id",
            frozen: true
        },
        {
            key: "created_by",
            name: "Created By ",
            frozen: true
        },
        {
            key: "VentilatorTypeName",
            name: "Ventilator Type",
        },

        {
            key: "Status",
            name: "Status",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleeditVentilatorTypeDatatatus(params.row)}
                    >
                        {params.row.Status}
                    </Button>
                </>
            ),
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleeditVentilator(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        }
    ]



    const handleeditVentilatorTypeDatatatus = (params) => {
        const data = {
            VentilatorTypeId: params.id,
            Statusedit: true
        }
        axios.post(`${UrlLink}Masters/VentilatorType_Detials_link`, data)
            .then((res) => {
                const resres = res.data
                let typp = Object.keys(resres)[0]
                let mess = Object.values(resres)[0]
                const tdata = {
                    message: mess,
                    type: typp,
                }

                dispatchvalue({ type: 'toast', value: tdata });
                setVentilatorTypeGet(prev => !prev)
            })
            .catch((err) => {
                console.log(err);
            })
    }



    const handleeditVentilator = (params) => {
        const { id, ...rest } = params
        setVentilatorType((prev) => ({
            ...prev,
            VentilatorTypeId: id,
            ...rest
        }))
    }



    const handleVentilatorSubmit = () => {

        if (VentilatorType.VentilatorTypeName) {
            const data = {
                ...VentilatorType,
                created_by: userRecord?.username || ''
            }
            axios.post(`${UrlLink}Masters/VentilatorType_Detials_link`, data)
                .then((res) => {
                    const resres = res.data
                    let typp = Object.keys(resres)[0]
                    let mess = Object.values(resres)[0]
                    const tdata = {
                        message: mess,
                        type: typp,
                    }

                    dispatchvalue({ type: 'toast', value: tdata });
                    setVentilatorTypeGet(prev => !prev)
                    setVentilatorType({
                        VentilatorTypeId: '',
                        VentilatorTypeName: '',

                    })
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            const tdata = {
                message: `Please provide both Ward Name and Location.`,
                type: 'warn'
            }
            dispatchvalue({ type: 'toast', value: tdata });
        }
    }

    useEffect(() => {
        axios.get(`${UrlLink}Masters/VentilatorType_Detials_link`)
            .then((res) => {
                const ress = res.data
                setVentilatorTypeData(ress)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [VentilatorTypeGet, UrlLink])




    const handleVentilatorChange = (e) => {
        const { name, value } = e.target;
        setVentilatorType((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    
  return (
    <>
        <div className="Main_container_app">
            <div className="common_center_tag">
                <span>Ventilator Types</span>
            </div>

            <div className="RegisFormcon_1">
                <div className="RegisForm_1">
                    <label> VentilatorType<span>:</span> </label>
                    <input
                        type="text"
                        name='VentilatorTypeName'
                        required
                        value={VentilatorType.VentilatorTypeName}
                        onChange={handleVentilatorChange}
                    />
                </div>

            </div>

            <div className="Main_container_Btn">
                <button onClick={handleVentilatorSubmit}>
                    {VentilatorType.VentilatorTypeId ? "Update" : "Add"}
                </button>
            </div>
            {VentilatorTypeData.length > 0 &&
                <ReactGrid columns={VentilatorTypeColumns} RowData={VentilatorTypeData} />
            }
            
        </div>
        <ToastAlert Message={toast.message} Type={toast.type} />

                    
    </>
  )
}

export default VentilatorType;