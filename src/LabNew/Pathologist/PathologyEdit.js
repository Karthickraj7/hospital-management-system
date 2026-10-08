import React, { useState, useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const PathologyEdit = () => {
  const [contents, setContent] = useState('')
  const dispatchvalue = useDispatch();
  const navigate = useNavigate()
  const urllink = useSelector(state => state.userRecord?.UrlLink)
  const patdataiiii = useSelector((state) => state.userRecord?.foreditcontent);
  const contentRef = useRef(null);
  const handlepagesave = () => {

    let updateeditcontents = {
      pathologycontent: contents,
      patientid: patdataiiii.patientid,
      visitid: patdataiiii.visitid,
      invoiceno: patdataiiii.invno
    }
    axios.post(`${urllink}Phelobotomist/updatepathologyeditcontent`, updateeditcontents)
      .then((response) => {
        // Handle success (optional, you can add further actions here)
        console.log('Data saved successfully:', response);


        navigate('/Home/NavigationPathalogist')
      })
      .catch((error) => {
        // Handle errors
        console.error('Error saving data:', error);
      });
  };
  return (
    <div>
      <div ref={contentRef} className='editor_life'>
        <CKEditor
          editor={ClassicEditor}
          data={patdataiiii.pateditword}
          onChange={(event, editor) => {
            const data = editor.getData();
            setContent(data);
          }}
        />
      </div>

      <div className="Register_btn_con">
        <button className="RegisterForm_1_btns" onClick={handlepagesave}>
          Save
        </button>
      </div>
    </div>
  )
}

export default PathologyEdit