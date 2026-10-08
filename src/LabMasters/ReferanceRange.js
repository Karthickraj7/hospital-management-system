import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import "./TestMaster.css";
import axios from 'axios';
import { useSelector } from 'react-redux';

function ReferanceRange() {
    const urllink=useSelector(state=>state.userRecord?.UrlLink)


    const [formValues, setFormValues] = useState({
        analyzerType: '',
        validation: '',
        gender: '',
        method:'',
        rangeLowerLimit: '',
        rangeUpperLimit: '',
        referanceRangeText: ''
    });
    const [selectedValues, setSelectedValues] = useState([]);
    const [methoddata,setMethodData] = useState([]);
    const [testname,setTestName] = useState([])
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
            analyzerType: '',
            validation: '',
            method:'',
            gender: '',
            rangeLowerLimit: '',
            rangeUpperLimit: '',
            referanceRangeText: ''
        });
    };


    useEffect(()=>{
        axios.get(`${urllink}mainddepartment/getmethod`)
        .then((response) => {
          const data = response.data;
          console.log("data",data)
    
          setMethodData(data)
        })
        .catch((error) => {
          console.error('Error fetching method data:', error);
        });

    
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


    const handleSubmission = () => {
        const postData = {
          ...formValues,
          testname // Ensure 'testname' is defined or obtained correctly in your function's scope
        };
      
        // Check if any of the required fields are missing
        if (!formValues.analyzerType || !formValues.validation || !formValues.method || !formValues.rangeLowerLimit || !formValues.rangeUpperLimit) {
          // If any of the required fields are missing, alert the user
          alert('Please enter all inputs.');
        } else {
          // If all required fields are present, proceed with the Axios post request
          axios.post(`${urllink}usercontrol/insertreferencerange`, postData)
            .then((response) => {
              console.log(response);
              setFormValues({
                analyzerType: '',
                validation: '',
                method:'',
                gender: '',
                rangeLowerLimit: '',
                rangeUpperLimit: '',
                referanceRangeText: ''
            });
              // Optionally, handle response (e.g., notifying user of success, clearing form, etc.)
            })
            .catch((error) => {
              console.log(error);
              // Optionally, handle error (e.g., notifying user of the error)
            });
        }
      };
      
    
    const handleClearValues = () => {
        setSelectedValues([]);
    };

    return (
        <div className="appointment">
            <div className='RegisFormcon'>
                <div className="RegisForm_1">
                    <label htmlFor="analyzerType">Analyzer Type:</label>
                    <select id="analyzerType" name="analyzerType" value={formValues.analyzerType} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="type1">Type 1</option>
                        <option value="type2">Type 2</option>
                    </select>
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="validation">Validation:</label>
                    <select id="validation" name="validation" value={formValues.validation} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="valid1">Valid 1</option>
                        <option value="valid2">Valid 2</option>
                    </select>
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="method">Method:</label>
                    <select id="method" name="method" value={formValues.method} onChange={handleChange}>
                        <option value="">Select</option>
                        {methoddata.map((row,index)=>(
                            <option key={index} value={row.method_name}>{row.method_name}</option>
                        ))}
                    </select>
                </div>
                
            </div>
            
            <div className='RegisFormcon'>
            <div className="RegisForm_1">
                    <label htmlFor="gender">Gender:</label>
                    <select id="gender" name="gender" value={formValues.gender} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="rangeLowerLimit">Range Lower Limit:</label>
                    <input type="number" id="rangeLowerLimit" name="rangeLowerLimit" value={formValues.rangeLowerLimit} onChange={handleChange} />
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="rangeUpperLimit">Range Upper Limit:</label>
                    <input type="number" id="rangeUpperLimit" name="rangeUpperLimit" value={formValues.rangeUpperLimit} onChange={handleChange} />
                </div>
                
            </div>
            <div className="RegisFormcon">
            <div className="RegisForm_1">
                    <label htmlFor="referanceRangeText">Reference Range Text:</label>
                    <input type="text" id="referanceRangeText" name="referanceRangeText" value={formValues.referanceRangeText} onChange={handleChange} />
                </div>
            </div>
          
        
            
          <div className='Register_btn_con'>
            <button className='RegisterForm_1_btns' onClick={handleSubmission}>Submit</button>
          </div>
        </div>
    );
}

export default ReferanceRange;
