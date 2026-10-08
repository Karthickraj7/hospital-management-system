import React, { useState, useEffect } from 'react';
// import './Organization.css';
import axios from 'axios';
import { useSelector } from 'react-redux';

function Commercial() {
  const urllink = useSelector(state => state.userRecord?.UrlLink);

  // Initialize state for rate card names, test name list, and input values
  const [ratecardNames, setRatecardNames] = useState([]);
  // const [testName, setTestName] = useState('');
  // const [testCode, setTestCode] = useState('');
  const [ratecardValues, setRatecardValues] = useState({});
  const [testNameList, setTestNameList] = useState([]);

  // Handle changes in dynamically generated inputs
  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'testname') {
      const selectedTest = testNameList.find(test => test.TestName === value);
      const testCode = selectedTest ? selectedTest.Test_Code : '';

      setRatecardValues((prevValues) => ({
        ...prevValues,
        testname: value,
        Test_Code: testCode,
      }));
    } else {
      setRatecardValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };

  // Fetch test names and rate card names on component mount
  useEffect(() => {
   

    axios.get(`${urllink}mainddepartment/get_ratecard_names_for_billing`)
      .then((response) => {
        console.log(response.data);
        setRatecardNames(response.data.ratecard);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [urllink]);


  useEffect(() => {
    axios.get(`${urllink}Billing/gettestnames`)
      .then((res) => {
        console.log('yrioouroiureoiriourei', res.data)
        setTestNameList(res.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [urllink])

  const handleSubmit = () => {
    const postData = {
      testname: ratecardValues.testname,
      testcode: ratecardValues.Test_Code,
      ratecardValues: ratecardValues, // Include rate card values in the post data
    };

    axios.post(`${urllink}usercontrol/inserttestcost`, postData)
      .then((response) => {
        console.log(response);
        setRatecardValues({});
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="appointment">
      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label className="" htmlFor="testname">
            Test Name<span>:</span>
          </label>
          <input
            type="text"
            id="testname"
            name="testname"
            list="testnamelist1"
            placeholder="Enter Test Name"
            className=""
            required
            value={ratecardValues.testname || ''}
            onChange={handleChange}
          />
          <datalist id="testnamelist1">
            {testNameList?.map((item, index) => (
              <option
                key={index}
                value={item.TestName}
              >
                {item.TestName}
              </option>
            ))}
          </datalist>
        </div>

        <div className="RegisForm_1">
          <label className="" htmlFor="testcode">
            Test Code<span>:</span>
          </label>
          <input
            type="text"
            id="testcode"
            name="testcode"
            placeholder="Enter Test Code"
            className=""
            required
            value={ratecardValues.Test_Code || ''}
            onChange={handleChange}
          />
        </div>

        {ratecardNames.map((field, index) => (
          <div className="RegisForm_1" key={index}>
            <label htmlFor={field}>
              {field}<span>:</span>
            </label>
            <input
              type="number"
              id={field}
              name={field}
              value={ratecardValues[field] || ''}
              onChange={handleChange}
              required
            />
          </div>
        ))}
      </div>
      <div className='Register_btn_con'>
        <button className="RegisterForm_1_btns" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

export default Commercial;
