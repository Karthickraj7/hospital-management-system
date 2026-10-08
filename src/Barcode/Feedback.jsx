import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const FeedBack = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get('Qrname');
  const id = queryParams.get('IdentifyId');
  const name = queryParams.get('IdentifcationName');
  
  const dispatchvalue = useDispatch();
  const toast = useSelector(state => state.userRecord?.toast);
  const UrlLink = useSelector(state => state.userRecord?.UrlLink);

  const [feedbackform, setFeedbackForm] = useState({
    IdentifyId: id || '',
    IdentifcationName: name || '',
    Ratings: 0, 
    feedback: '',
    Comments: '',
    Name: '',
    Phone: ''
  });

  const feedbackText = {
    0: '',
    1: 'Worst',
    2: 'Need Improvement',
    3: 'Better',
    4: 'Good',
    5: 'Very Good'
  };

  const handleStarClick = (rating) => {
    setFeedbackForm(prevForm => ({
      ...prevForm,
      Ratings: prevForm.Ratings === rating ? 0 : rating,
      feedback: feedbackText[rating] || ''
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedbackForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handlesubmit = () => {
    if (typeof feedbackform.Comments === 'string' && feedbackform.Comments.trim() === '') {
      const tdata = {
        message: 'Please fill out the required fields: Comments',
        type: 'warn'
      };
      dispatchvalue({ type: 'toast', value: tdata });
      return; // Stop further execution
    }
    if (typeof feedbackform.IdentifyId === 'string' && feedbackform.IdentifyId.trim() === '') {
      const tdata = {
        message: 'Please fill out the required fields: IdentifyId',
        type: 'warn'
      };
      dispatchvalue({ type: 'toast', value: tdata });
      return;
    }
    if (typeof feedbackform.IdentifcationName === 'string' && feedbackform.IdentifcationName.trim() === '') {
      const tdata = {
        message: 'Please fill out the required fields: IdentifcationName',
        type: 'warn'
      };
      dispatchvalue({ type: 'toast', value: tdata });
      return;
    }
    if (feedbackform.Ratings === 0) {
      const tdata = {
        message: 'Please fill out the required fields: Ratings',
        type: 'warn'
      };
      dispatchvalue({ type: 'toast', value: tdata });
      return;
    }
    if (typeof feedbackform.Name === 'string' && feedbackform.Name.trim() === '') {
      const tdata = {
        message: 'Please fill out the required fields: Name',
        type: 'warn'
      };
      dispatchvalue({ type: 'toast', value: tdata });
      return;
    }
    if (typeof feedbackform.Phone === 'string' && feedbackform.Phone.trim() === '') {
      const tdata = {
        message: 'Please fill out the required fields: Phone',
        type: 'warn'
      };
      dispatchvalue({ type: 'toast', value: tdata });
      return;
    }
  
    const postdata = {
      ...feedbackform,
      qrname: 'Ward'
    };
  
    axios.post(`${UrlLink}Masters/insert_into_feedback`, postdata)
      .then((response) => {
        console.log(response);
        setFeedbackForm(prev=>({
          IdentifyId: id || '',
          IdentifcationName: name || '',
          Ratings: 0, 
          feedback: '',
          Comments: '',
          Name: '',
          Phone: ''
        }))
      })
      .catch((error) => {
        console.log(error);
      });
  };
  

  return (
    <div className="Main_container_app">
      <h3>Feedback Form</h3>  
      <br />
      <div className="main_container_for_feedback">
        {Object.keys(feedbackform).map((item, index) => (
          <div key={index} className={item === 'Comments' ? 'summalable04940' : 'feedbackdetatils'}>
            <label htmlFor={item}>
              {item} <span>:</span>
            </label>
            {item === "Ratings" ? (
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    className={`star ${star <= feedbackform.Ratings ? 'selected' : ''}`}
                    onClick={() => handleStarClick(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            ) : item === "Comments" ? (
              <textarea
                name={item}
                value={feedbackform[item]}
                onChange={handleChange}
                className="textarea"
              />
            ) : (
              <input
                type="text"
                name={item}
                value={feedbackform[item]}
                onChange={handleChange}
                className="input"
              />
            )}
          </div>
        ))}
      </div>
      <div className='Main_container_Btn'>
        <button onClick={handlesubmit}>
          Save           
        </button>
      </div>
      <ToastAlert Message={toast?.message} Type={toast?.type} />
    </div>
  );
};

export default FeedBack;
