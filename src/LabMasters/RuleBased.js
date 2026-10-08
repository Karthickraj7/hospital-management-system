import React, { useState, useEffect, } from 'react';

import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { convertToHTML } from 'draft-convert';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import AddIcon from '@mui/icons-material/Add';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import "./TestMaster.css";

function RuleBased() {
    const [selectedValues, setSelectedValues] = useState([]);


    const handleAddValues = () => {
        // Collect the selected values from your selects and store them in an object
        const newValues = {
            validation: document.getElementById('validation').value,
            gender: document.getElementById('gender').value,
            type: document.getElementById('type').value,
            ageType: document.getElementById('ageType').value,
            ageLowerLimit: document.getElementById('ageLowerLimit').value,
            ageUpperLimit: document.getElementById('ageUpperLimit').value,
            rangeLowerLimit: document.getElementById('rangeLowerLimit').value,
            rangeUpperLimit: document.getElementById('rangeUpperLimit').value,
            remarks: document.getElementById('remarks').value, // Use 'remarks' as the id
        };

        // Add the new values to the selectedValues array
        setSelectedValues([...selectedValues, newValues]);
    };


    const handleClearValues = () => {
        setSelectedValues([]);
    };
    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );
    const [convertedContent, setConvertedContent] = useState(null);

    useEffect(() => {
        let html = convertToHTML(editorState.getCurrentContent());
        setConvertedContent(html);
    }, [editorState]);

    console.log(convertedContent);

    return (
        <div className="appointment">
          
                <div className='RegisFormcon'>

                    <div className="RegisForm_1">
                        <label htmlFor="validation" >Validation Type:</label>
                        <select id="validation" name="validation" >
                            <option value="">Select</option>
                            <option value="mr">Mr.</option>
                            <option value="ms">Ms.</option>
                            <option value="mrs">Mrs.</option>
                        </select>
                    </div>
                    <div className="RegisForm_1">
                        <label htmlFor="gender" >Gender:</label>
                        <select id="gender" name="gender" >
                            <option value="">Select</option>
                            <option value="mr">Mr.</option>
                            <option value="ms">Ms.</option>
                            <option value="mrs">Mrs.</option>
                        </select>
                    </div>
                    <div className="RegisForm_1">
                        <label htmlFor="rangeLowerLimit" >Range Lower Limit:</label>
                        <select id="rangeLowerLimit" name="rangeLowerLimit" >
                            <option value="">Select</option>
                            <option value="mr">Mr.</option>
                            <option value="ms">Ms.</option>
                            <option value="mrs">Mrs.</option>
                        </select>
                    </div>

                </div>
               
                <div className='RegisFormcon'>
                   
                    <div className="RegisForm_1">
                        <label htmlFor="rangeUpperLimit" >Range Upper Limit:</label>
                        <select id="rangeUpperLimit" name="rangeUpperLimit" >
                            <option value="">Select</option>
                            <option value="mr">Mr.</option>
                            <option value="ms">Ms.</option>
                            <option value="mrs">Mrs.</option>
                        </select>
                    </div>
                    <div className="RegisForm_1">
                        <label htmlFor="ageUpperLimit" >Remarks:</label>

                        <textarea id="remarks" name="remarks" className='custom-textarea'></textarea>

                    </div>

                </div>


            
            <div className="patient-registration-form">

                <Editor
                    editorState={editorState}
                    onEditorStateChange={setEditorState}
                    wrapperClassName="wrapper-class"
                    editorClassName="editor-class"
                    toolbarClassName="toolbar-class"
                />
            </div>

            <div className='Register_btn_con gap_ad_clr3'>
                <button className="RegisterForm_1_btns" onClick={handleAddValues}>
                    <AddIcon /> Add
                </button>
                <button className="RegisterForm_1_btns" onClick={handleClearValues}>
                    <ClearAllIcon /> Clear
                </button>
            </div>
            <div className="Selected-table-container">
                <table className="selected-medicine-table2">
                <thead>
                    <tr>

                        <th>Validation</th>
                        <th>Gender</th>
                        <th>Type</th>
                        <th>Age Type</th>
                        <th>Age Lower Limit</th>
                        <th>Age Upper Limit</th>
                        <th>Range Lower Limit</th>
                        <th>Range Upper Limit</th>
                        <th>Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedValues.map((values, index) => (
                        <tr key={index}>

                            <td>{values.validation}</td>
                            <td>{values.gender}</td>
                            <td>{values.type}</td>
                            <td>{values.ageType}</td>
                            <td>{values.ageLowerLimit}</td>
                            <td>{values.ageUpperLimit}</td>
                            <td>{values.rangeLowerLimit}</td>
                            <td>{values.rangeUpperLimit}</td>
                            <td>{values.Remarks}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            
          <div className='Register_btn_con'>
            <button className='RegisterForm_1_btns' >Submit</button>
          </div>
        </div>
    );
}

export default RuleBased;

