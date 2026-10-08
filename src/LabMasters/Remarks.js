import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import "./TestMaster.css";
import axios from 'axios';
import { useSelector } from 'react-redux';

function Remarks() {
  const urllink=useSelector(state=>state.userRecord?.UrlLink)

    const [formValues, setFormValues] = useState({
        validation: '',
        type: '',
        remarks: '',
    });
    const [testname,setTestName] = useState()
    const [selectedValues, setSelectedValues] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddValues = () => {
        setSelectedValues([...selectedValues, formValues]);
        setFormValues({
            validation: '',
            type: '',
            remarks: '',
        });
    };

    useEffect(()=>{
            axios.get(`${urllink}usercontrol/gettestname`)
            .then((response)=>{
                console.log(response.data)
                const data= response.data.test_name
                setTestName(data);
            })
            .catch((error)=>{
                console.log(error)
            })
    },[])
    
    const handleClearValues = () => {
        setSelectedValues([]);
    };

    const handleRemarksubmit =()=>{
        const postdata={
            ...selectedValues,
            testname
        }
        const allFieldsFilled = Object.values(selectedValues).every(value => value !== '' );
        console.log(postdata)
    if (!allFieldsFilled) {
      alert('Please fill out all fields.');
      return; // Stop the submission since not all fields are filled
    }
       
        axios.post(`${urllink}usercontrol/insertremark`,postdata)
        .then((response)=>{
            console.log(response);

        })
        .catch((error)=>{
            console.log(error);
        })
    }

    return (
        <div className="appointment">
            <div className='RegisFormcon'>
                <div className="RegisForm_1">
                    <label htmlFor="validation">Validation Type:</label>
                    <select id="validation" name="validation" value={formValues.validation} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Manual">Manual</option>
                        <option value="Autometic">Autometic</option>
                        
                    </select>
                </div>
              
                <div className="RegisForm_1">
                    <label htmlFor="type">Remark Type:</label>
                    <select id="type" name="type" value={formValues.type} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Technical">Technical</option>
                        <option value="Medical">Medical</option>
                        
                    </select>
                </div>
             
                <div className="RegisForm_1">
                    <label htmlFor="remarks">Remarks:</label>
                    <textarea id="remarks" name="remarks" className='custom-textarea' value={formValues.remarks} onChange={handleChange}></textarea>
                </div>
            </div>
            
          <div className='Register_btn_con'>
            <button className='RegisterForm_1_btns' onClick={handleRemarksubmit} >Submit</button>
          </div>
        </div>
    );
}

export default Remarks;
