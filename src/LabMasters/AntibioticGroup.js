
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from 'react-redux';
function AntibioticGroup() {
  const urllink=useSelector(state=>state.userRecord?.UrlLink)

  const [antibioticGroupData, setAntibioticGroupData] = useState([]);
  const [antibioticGroupCode, setAntibioticGroupCode] = useState('');
  const [antibioticGroupDes, setAntibioticGroupDes] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedMethodId, setSelectedMethodId] = useState(null);

  const handleSubmitAntibioticGroup = async () => {
    try {
      const response = await axios.post(`${urllink}usercontrol/insertantibioticgroupdata`, {
        antibioticGroupCode,
        antibioticGroupDes,
      });

      console.log(response.data);
      setAntibioticGroupCode('');
      setAntibioticGroupDes('');
      fetchAntibioticGroupData();
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const fetchAntibioticGroupData = () => {
    axios.get(`${urllink}usercontrol/getantibioticgroupdata`)
      .then((response) => {
        const data = response.data;
        console.log("data", data);
        setAntibioticGroupData(data);
      })
      .catch((error) => {
        console.error('Error fetching antibioticgroup data:', error);
        setAntibioticGroupData([]); // Reset data in case of an error
      });
  };

  const handleEdit = (row) => {
    setAntibioticGroupCode(row.anti_biotic_group_code);
    setAntibioticGroupDes(row.anti_biotic_group_des);
    setIsEditMode(true);
    setSelectedMethodId(row.anti_biotic_group_id);
  };

  const handleUpdateMethod = async () => {
    try {
      const response = await axios.post(`${urllink}usercontrol/updateantibioticgroupdata`, {
        method_id: selectedMethodId,
        method_name: antibioticGroupCode,
        method_code: antibioticGroupDes,
      });

      console.log(response.data);
      setAntibioticGroupCode('');
      setAntibioticGroupDes('');
      setIsEditMode(false);
      setSelectedMethodId(null);
      fetchAntibioticGroupData();
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  useEffect(() => {
    fetchAntibioticGroupData();
  }, []);

  return (
    <>
      <div className='ShiftClosing_over'>
        <div className="ShiftClosing_Container">
          <div className="ShiftClosing_header">
            <h3>Antibiotic Group</h3>
          </div>
        </div>
        <div className="ShiftClosing_Container">
          <div className='FirstpartOFExpensesMaster'>
            <h2 style={{ textAlign: 'center' }}>Antibiotic Groups</h2>

            <div className="con_1">
              <div className="inp_1">
                <label htmlFor="input" style={{ whiteSpace: "nowrap" }}>Antibiotic Group Code:</label>
                <input
                  type="text"
                  id="antibioticGroupCode"
                  name="antibioticGroupCode"
                  value={antibioticGroupCode}
                  onChange={(e) => setAntibioticGroupCode(e.target.value)}
                  placeholder="Enter Antibiotic Group Code"
                  style={{ width: "150px" }}
                />
              </div>
              <div className="inp_1">
                <label htmlFor="input" style={{ whiteSpace: "nowrap" }}>Antibiotic Group :</label>
                <input
                  type="text"
                  id="antibioticGroupDes"
                  name="antibioticGroupDes"
                  value={antibioticGroupDes}
                  onChange={(e) => setAntibioticGroupDes(e.target.value)}
                  placeholder="Enter Antibiotic Group Description"
                  style={{ width: "150px" }}
                />
              </div>
              <button className="btn_1" onClick={isEditMode ? handleUpdateMethod : handleSubmitAntibioticGroup}>
                {isEditMode ? 'Update' : <AddIcon />}
              </button>
            </div>

            <div style={{ width: '100%', display: 'grid', placeItems: 'center' }}>
              <h4>Table</h4>
              <div className="Selected-table-container">
                <table className="selected-medicine-table2">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Antibiotic Group Code</th>
                      <th>Antibiotic Group Description</th>
                      <th>Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(antibioticGroupData) && antibioticGroupData.length > 0 ? (
                      antibioticGroupData.map((row, index) => (
                        <tr key={index}>
                          <td>{row.anti_biotic_group_id}</td>
                          <td>{row.anti_biotic_group_code}</td>
                          <td>{row.anti_biotic_group_des}</td>
                          <td><button onClick={() => handleEdit(row)}><EditIcon /></button></td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center' }}>No data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AntibioticGroup;

