import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Feedbackview = () => {
  const [AppointmentRegisType, setAppointmentRegisType] = useState('');
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const [data, setData] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);

  useEffect(() => {
    // Fetch chart data
    axios
      .get(`${UrlLink}Masters/get_feedback_data_for_chart?type=${AppointmentRegisType}`)
      .then((response) => {
        console.log(response);
        setData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
        setData([])
      });

    // Fetch all feedback data
    axios
      .get(`${UrlLink}Masters/get_all_feedback_data?type=${AppointmentRegisType}`)
      .then((response) => {
        console.log(response);
        setFeedback(response.data.data);
        setFilteredFeedback(response.data.data); // Set initial feedback
      })
      .catch((error) => {
        console.log(error);
        setFeedback([])
      });
  }, [AppointmentRegisType]);

  const handleBarClick = (data) => {
    const floorId = data.payload.floorId;
    console.log(floorId, 'floorId');
    
    // Filter feedback based on the floorId
    const filteredData = feedback.filter((item) => item.Identificationid === floorId);
    setFilteredFeedback(filteredData);
  };

  return (
    <div className="Main_container_app">
      <h3>Feed Back</h3>
      <div className="RegisterTypecon">
        <div className="RegisterType">
          {['Floor','Ward' ,'Employee'].map((p, ind) => (
            <div className="registertypeval" key={ind}>
              <input
                type="radio"
                id={p}
                name="appointment_type"
                checked={AppointmentRegisType === p}
                onChange={(e) => {
                  setAppointmentRegisType(e.target.value);
                  setFilteredFeedback([]); // Reset filtered data on type change
                }}
                value={p}
              />
              <label htmlFor={p}>{p}</label>
            </div>
          ))}
        </div>
      </div>

      {data.length > 0 && (
        <div
          style={{
            width: '90%',
            height: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            marginTop: '20px',
          }}
        >
          <h2>Review Trend (Building Chart)</h2>
          <ResponsiveContainer width="80%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="rating"
                fill="#8884d8"
                onClick={handleBarClick} // Add onClick handler here
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {filteredFeedback.length > 0 && (
        <div className="feedback_container">
          {filteredFeedback.map((item, ind) => (
            <div className="feedbacks" key={ind}>
              {item.QrName === AppointmentRegisType && (
                <>
                  <div className="stars">
                    <p>
                      <strong>{item.QrName} Name:</strong> {item.Identificationname}
                    </p>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${star <= item.Ratings ? 'active' : ''}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p>
                    <strong>Feed Back:</strong> {item.Feedback}
                  </p>
                  <p>
                    <strong>Comments:</strong> {item.Comments}
                  </p>
                  <p>
                    <strong>By:</strong> {item.Name}
                  </p>
                  <p>
                    <strong>Contact No:</strong> {item.Phone}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feedbackview;
