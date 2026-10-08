import React, { useEffect, useState } from 'react'
import { formatLabel } from '../OtherComponent/OtherFunctions'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
import { useNavigate } from 'react-router-dom';


const DayCloseing = () => {

    const dispatchvalue = useDispatch();
    const navigate = useNavigate();

    const DayCloseingEdit = useSelector((state) => state.Financedata?.DayCloseingEdit);

    const blockInvalidChar = (e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
    const toast = useSelector(state => state.userRecord?.toast);
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const userRecord = useSelector((state) => state.userRecord?.UserData);

    const today = new Date();
    const currentDate = today.toISOString().split('T')[0];


    const [Dayclosestate, setDayclosestate] = useState({
        Location: "",
        closeingDate: currentDate,
        IssueBy: '',
        OpeningCash: '',
        OPCollectionCash: '',
        IPCollectionCash: '',
        TotalCash: '',
        ExpensesCash: '',
        AvailableCash: '',
        HandoverCash: '',
        BalanceCash: '',
        Narration: '',
        HandOverTo: '',
    })

    const [userData, setUserData] = useState([]);
    const [LocationData, setLocationData] = useState([]);




    const clearStates = () => {
        setDayclosestate({
            Location: "",
            closeingDate: currentDate,
            IssueBy: '',
            OpeningCash: '',
            OPCollectionCash: '',
            IPCollectionCash: '',
            TotalCash: '',
            ExpensesCash: '',
            AvailableCash: '',
            HandoverCash: '',
            BalanceCash: '',
            Narration: '',
            HandOver: '',
            HandOverTo: '',
        })
    }


    useEffect(() => {

        if (DayCloseingEdit && Object.keys(DayCloseingEdit).length > 0) {

            const { LocationName, Status, ...rest } = DayCloseingEdit;

            setDayclosestate({
                ...rest
            })

        }

    }, [DayCloseingEdit])


    useEffect(() => {
        const params = {
            deptid: [8, 18],
            SearchQuery: "",
            SearchCategory: "",
            SearchDesignation: "",
        }
        axios.post(`${UrlLink}Frontoffice/Employee_User_Get_Details`, params)
            .then((response) => {
                const res = response.data;
                setUserData(res);
            })
            .catch((e) =>
                console.log(e)
            )
    }, [UrlLink, Dayclosestate.HandOverTo])

    useEffect(() => {
        if (userRecord && userRecord?.username) {
            setDayclosestate((prev) => ({
                ...prev,
                IssueBy: userRecord?.username,
            }))
        }
    }, [userRecord])

    useEffect(() => {
        axios.get(`${UrlLink}Masters/Location_Detials_link`)
            .then((res) => {
                const ress = res.data
                setLocationData(ress)
            })
            .catch((err) => {
                console.log(err);
            })


    }, [UrlLink])




    const HadelonchageSupplier = async (e) => {

        const { name, value } = e.target

        if (name === 'HandoverCash') {

            if (+Dayclosestate?.AvailableCash >= +value) {
                setDayclosestate((prev) => ({
                    ...prev,
                    [name]: value
                }))
            }
            else {
                const tdata = {
                    message: "Insufficient Handover cash",
                    type: 'warn',
                }
                dispatchvalue({ type: 'toast', value: tdata });
            }
        }
        else {
            setDayclosestate((prev) => ({
                ...prev,
                [name]: value
            }))
        }


    }



    useEffect(() => {
        setDayclosestate((prev) => {
            const OpeningCash = parseFloat(prev.OpeningCash) || 0;
            const OPCollectionCash = parseFloat(prev.OPCollectionCash) || 0;
            const IPCollectionCash = parseFloat(prev.IPCollectionCash) || 0;
            const Expenses = parseFloat(prev.ExpensesCash) || 0;
            const HandoverCash = parseFloat(prev.HandoverCash) || 0;

            const TotalAmount = OpeningCash + OPCollectionCash + IPCollectionCash;
            const AvailAmount = TotalAmount - Expenses;
            const BalanceAmount = AvailAmount - HandoverCash;

            return {
                ...prev,
                TotalCash: TotalAmount,
                AvailableCash: AvailAmount,
                BalanceCash: BalanceAmount,
            };
        });
    }, [
        Dayclosestate.OpeningCash,
        Dayclosestate.OPCollectionCash,
        Dayclosestate.IPCollectionCash,
        Dayclosestate.ExpensesCash,
        Dayclosestate.HandoverCash,
    ]);






    const SaveExpenses = () => {

        let requiredFields = [
            'Location',
            'closeingDate',
            'IssueBy',
            'AvailableCash',
            'HandoverCash',
            'Narration'
        ]

        const missingFields = requiredFields.filter(
            (field) => !Dayclosestate[field]
        )
        if (missingFields.length !== 0) {

            const tdata = {
                message: `Please fill out all required fields: ${missingFields.join(", ")}`,
                type: 'warn',
            }
            dispatchvalue({ type: 'toast', value: tdata });
        }
        else {

            let senddata = {
                ...Dayclosestate,
                Create_by: userRecord?.username,
            }

            axios.post(`${UrlLink}finance/postdataforDayclosing`, senddata)
                .then((res) => {
                    console.log('mmmmm', res.data);
                    let resdata = res.data
                    let type = Object.keys(resdata)[0]
                    let mess = Object.values(resdata)[0]
                    const tdata = {
                        message: mess,
                        type: type,
                    }
                    dispatchvalue({ type: 'toast', value: tdata });
                    if (type === 'success') {
                        navigate("/Home/CashierFolder");
                        dispatchvalue({ type: "HrFolder", value: "DayCloseingList" });
                        dispatchvalue({ type: "setPreviousFolder", value: null });
                        dispatchvalue({ type: "showMenu", value: true });

                        clearStates()
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        }


    }


    return (
        <><div className="Main_container_app">
            <h3>Day Closing</h3>

            <br />

            <div className="RegisFormcon_1">

                {
                    Object.keys(Dayclosestate).filter(ele => ele !== 'id').map((StateName, Index) => {

                        return (
                            <div className="RegisForm_1" key={Index + 'key'}>

                                <label htmlFor={StateName}>{formatLabel(StateName)} :</label>

                                {['Location'].includes(StateName) ?

                                    <select
                                        id={StateName}
                                        name={StateName}
                                        value={Dayclosestate[StateName]}
                                        onChange={HadelonchageSupplier}
                                    >
                                        <option value=''>Select</option>
                                        {
                                            LocationData.map((ele, ind) => (
                                                <option key={ind + 'key'} value={ele.id} >{ele.locationName}</option>
                                            ))
                                        }
                                    </select>
                                    :
                                    ['Narration'].includes(StateName) ?
                                        <textarea
                                            id={StateName}
                                            name={StateName}
                                            value={Dayclosestate[StateName]}
                                            onChange={HadelonchageSupplier}
                                        >
                                        </textarea>
                                        :
                                        <input
                                            type={StateName === 'closeingDate' ? 'date' : StateName === 'IssueBy' || StateName === 'HandOverTo' ? 'text' : 'number'}
                                            id={StateName}
                                            name={StateName}
                                            list={StateName === 'HandOverTo' ? 'handoverlist' : null}
                                            value={Dayclosestate[StateName]}
                                            onChange={HadelonchageSupplier}
                                            disabled={['IssueBy', 'TotalCash', 'AvailableCash', 'BalanceCash'].includes(StateName)}
                                        />


                                }
                                <datalist id='handoverlist'>


                                </datalist>
                            </div>
                        )
                    })
                }


            </div>

            <div className="Main_container_Btn">
                <button onClick={SaveExpenses}>
                    {Dayclosestate?.id ? 'Update' : 'Save'}
                </button>
            </div>
        </div>
            <ToastAlert Message={toast.message} Type={toast.type} />
        </>
    )
}
export default DayCloseing;