
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';



const FinanceGroupMaster = () => {

    const navigate = useNavigate()

    const dispatchvalue = useDispatch();


    const UrlLink = useSelector(state => state.userRecord?.UrlLink);

    const toast = useSelector(state => state.userRecord?.toast);

    const userRecord = useSelector((state) => state.userRecord?.UserData);

    const MasterEditdata = useSelector((state) => state.Financedata?.FinanceMasterEdit);

    console.log('MasterEditdata',MasterEditdata);
    

    const [GroupmasterState,setGroupmasterState] =useState({
        GroupName:'',
        UnderCategory:'',
        NatureOfGroup:'',
    })

    const[PrimeGroupArr,setPrimeGroupArr]=useState([])

    const[NatureOfGroupArr,setNatureOfGroupArr]=useState([])

    console.log('GroupmasterState',GroupmasterState);
    console.log('PrimeGroupArr',PrimeGroupArr);
    
    

    const HandeleOnchange =(e)=>{
        const{name,value}=e.target

        if(name === 'GroupName'){
            setGroupmasterState({
                [name]:value,
                UnderCategory:'',
                NatureOfGroup:'',
            })

        }
        else if (name === 'UnderCategory'){
            setGroupmasterState((prev)=>({
                ...prev,
                [name]:value,
                NatureOfGroup:'',
            }))

        }
        else{
            setGroupmasterState((prev)=>({
                ...prev,
                [name]:value
            }))
        }

      
    }

    useEffect(()=>{

        if(MasterEditdata && Object.keys(MasterEditdata).length !==0){

            console.log('MasterEditdata',MasterEditdata);
            
            setGroupmasterState((prev)=>({
                ...prev,
                GroupName:MasterEditdata.GroupName,
                UnderCategory:MasterEditdata.UnderGroupId,
                NatureOfGroup:MasterEditdata.UnderGroupId === 'Prime' ? MasterEditdata.NatureOfGroupId : ''
            }))
        }
    },[MasterEditdata])


    useEffect(()=>{
        axios.get(`${UrlLink}finance/Get_Finance_PrimeGroupMasters`)
        .then((res)=>{
            console.log(res?.data);
            let getdata=res?.data
            if(getdata && Array.isArray(getdata) && getdata.length >0){
                setPrimeGroupArr(getdata)
            }
        })
        .catch((err)=>{
            console.log(err);            
        })

        axios.get(`${UrlLink}finance/Get_NatureOfGroupMaster_detailes`)
        .then((res)=>{
            console.log(res.data);   
            let getdata=res.data
            if(getdata && Array.isArray(getdata)&& getdata.length >0){
                setNatureOfGroupArr(getdata)
            }
            
        })
        .catch((err)=>{
            console.log(err);            
        })

    },[UrlLink])


    const SaveGroupMaster =()=>{
        
        const requiredFields =[
            'GroupName',
            'UnderCategory'
        ]

        if (GroupmasterState.UnderCategory === 'Prime'){
            requiredFields.push('NatureOfGroup')
        }

        let missingFields=requiredFields.filter((ele)=> !GroupmasterState[ele])

        if (missingFields.length !== 0) {

            const tdata = {
                message: `Please fill out all required fields: ${missingFields.join(", ")}`,
                type: 'warn',
            }
            dispatchvalue({ type: 'toast', value: tdata });
        }
        else{

            let Params ={
                ...GroupmasterState,
                createby:userRecord.username,
                EditGroupID:MasterEditdata?.id || '',
            }

            axios.post(`${UrlLink}finance/Postdata_GroupMasters`,Params)
            .then((res)=>{
                console.log(res.data);  
                let resdata = res.data
                    let type = Object.keys(resdata)[0]
                    let mess = Object.values(resdata)[0]
                    const tdata = {
                        message: mess,
                        type: type,
                    }
                dispatchvalue({ type: 'toast', value: tdata });
                if (type === 'success') {
                    navigate('/Home/FinanceMasterList');
                    dispatchvalue({ type: 'FinanceMasterEdit', value: {} })

                }              
            })
            .catch((err)=>{
                console.log(err);                
            })


        }
        

    }

  return (
    <>

    <div className="Main_container_app">
        <h3>Finance Group Master</h3>
        <br/>
        <div className="RegisFormcon_1" >

            <div className="RegisForm_1">
                <label>Group Name <span>:</span></label>
                <input
                type='text'
                name='GroupName'
                value={GroupmasterState.GroupName}
                onChange={HandeleOnchange}
                />

            </div>


            <div className="RegisForm_1">
                <label>Under Category <span>:</span></label>
                <select
                id='UnderCategory'
                name='UnderCategory'
                value={GroupmasterState.UnderCategory}
                onChange={HandeleOnchange}
                disabled={GroupmasterState.GroupName === ''}
                >
                <option value=''>Select</option>
                <option value='Prime' >* PRIME</option>
                {
                    PrimeGroupArr?.map((ele,ind)=>(
                    <option key={ind+'key'} value={ele.id}>{ele.GroupName}</option>
                    ))
                }
                </select>

            </div>

            {GroupmasterState.UnderCategory === 'Prime' && <div className="RegisForm_1">
            <label>Nature Of Groups <span>:</span></label>
            <select
                id='NatureOfGroup'
                name='NatureOfGroup'
                value={GroupmasterState.NatureOfGroup}
                onChange={HandeleOnchange}
                >
                <option value=''>Select</option>
                {
                    NatureOfGroupArr?.map((ele,ind)=>(
                    <option key={ind+'key'} value={ele.id}>{ele.NatureOfGroupName}</option>
                    ))
                }
                </select>
            </div>}

        

        </div>

        <br/>
        <div className="Main_container_Btn">
            <button onClick={SaveGroupMaster}>
              {MasterEditdata?.id ? 'Update' : 'Save'} 
            </button>
        </div>
     
    </div>
    
    <ToastAlert Message={toast.message} Type={toast.type} />
                
    </>
  )
}

export default FinanceGroupMaster;
