import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import "./Requirements.css";
import axios from "axios";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import AccessTimeIcon from '@mui/icons-material/AccessTime';


function JobRequirement() {
  const [openModal, setOpenModal] = useState(false);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const urllink = useSelector((state) => state.userRecord?.UrlLink);

  const [jobformData, setjobFormData] = useState({
    companyName: "",
    department: "",
    role: "",
    qualification: "",
    keySkills: "",
    employeeType: "",
    experience: "",
    ctc: "",
    location: "",
    jobDescription: "",
    jobOpenings: "",
  });

  const clearjobformdata = () => {
    setjobFormData({
      companyName: "",
      department: "",
      role: "",
      qualification: "",
      keySkills: "",
      employeeType: "",
      experience: "",
      ctc: "",
      location: "",
      jobDescription: "",
      jobOpenings: "",
    });
  };

  console.log(jobformData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setjobFormData({
      ...jobformData,
      [name]: value,
    });
  };

  const handleFormSubmit = () => {
    const data = new FormData();

    for (const key in jobformData) {
      data.append(key, jobformData[key]);
    }

    data.append("CreatedBy", userRecord?.username);
    data.append("BranchLocation", userRecord?.location);

    axios
      .post(`${urllink}HRmanagement/post_Jobrequirements`, data)
      .then((response) => {
        console.log(response);
        clearjobformdata();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // const [jobsArray, setjobsArray] = useState([]);

  // useEffect(() => {
  //   axios
  //     .get(`${urllink}HRmanagement/getrequirements`)
  //     .then((response) => {
  //       console.log(response);
  //       setjobsArray(response.data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }, []);

  const jobsArray = [
    {
      JobCode: 1,
      jobName: "Frontend Developer",
      jobDescription:
        "Design and develop user interfaces for web applications, ensuring high performance and responsiveness.",
      Qualification: "B.SC C.S , MCA",
      JobOpenings: "5",
      Experience: "2+ years",
      applicationsReceived: 50,
    },
    {
      JobCode: 2,
      jobName: "UI/UX Designer",
      jobDescription:
        "Create intuitive user interfaces and engaging user experiences for web and mobile applications.",
      Qualification: "B.SC C.S , MCA",
      JobOpenings: "6",
      Experience: "3+ years",
      applicationsReceived: 30,
    },
    {
      JobCode: 3,
      jobName: "Frontend Engineer",
      jobDescription:
        "Collaborate with backend developers to integrate user-facing elements with server-side logic, ensuring seamless user experience.",
      Qualification: "B.SC C.S , MCA",
      JobOpenings: "2",
      Experience: "4+ years",
      applicationsReceived: 40,
    },
    {
      JobCode: 4,
      jobName: "Web Developer",
      jobDescription:
        "Build and maintain websites using a variety of web development technologies and tools.",
      Qualification: "B.SC C.S , MCA",
      JobOpenings: "12",
      Experience: "2+ years",
      applicationsReceived: 60,
    },
    {
      JobCode: 5,
      jobName: "Frontend Architect",
      jobDescription:
        "Define and implement frontend architecture, design patterns, and best practices for large-scale web applications.",
      Qualification: "B.SC C.S , MCA",
      JobOpenings: "3",
      Experience: "5+ years",
      applicationsReceived: 20,
    },
    {
      JobCode: 6,
      jobName: "React Developer",
      jobDescription:
        "Develop user interfaces using React.js library, ensuring high performance and scalability.",
      Qualification: "B.SC C.S , MCA",
      JobOpenings: "5",
      Experience: "3+ years",
      applicationsReceived: 45,
    },
    {
      JobCode: 7,
      jobName: "Angular Developer",
      jobDescription:
        "Build scalable and maintainable web applications using Angular framework, adhering to best practices and coding standards.",
      Qualification: "B.SC C.S , MCA",
      JobOpenings: "7",
      Experience: "2+ years",
      applicationsReceived: 35,
    },
    {
      JobCode: 8,
      jobName: "Frontend Team Lead",
      jobDescription:
        "Lead a team of frontend developers in designing and implementing web applications, providing technical guidance and mentorship.",
      Qualification: "B.SC C.S , MCA",
      JobOpenings: "9",
      Experience: "6+ years",
      applicationsReceived: 15,
    },
    {
      JobCode: 9,
      jobName: "Frontend Tester",
      jobDescription:
        "Test and debug frontend applications to ensure quality and reliability, identifying and fixing issues in collaboration with development teams.",
      Qualification: "B.SC C.S , MCA",
      JobOpenings: "4",
      Experience: "2+ years",
      applicationsReceived: 25,
    },
    {
      JobCode: 10,
      jobName: "Frontend Intern",
      jobDescription:
        "Assist in frontend development tasks under the guidance of senior developers, gaining practical experience in web development.",
      Qualification: "B.SC C.S , MCA",
      JobOpenings: "15",
      Experience: "No prior experience required",
      applicationsReceived: 70,
    },
  ];

  const handleEditClick1 = () => {
    setOpenModal(true);
  };

  return (
    <>
      <div className="appointment">
        <div className="h_head">
          <h4>Requirements</h4>
        </div>
        <br />

        <h4
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          New Requirement
          <div className="Register_btn_con">
            <button className="btn_1" onClick={() => handleEditClick1()}>
              <AddIcon />
            </button>
          </div>
        </h4>
        <br />
        <div className="job_list_container">
          {jobsArray.map((job, index) => (
            <div className="job_card" key={index}>
              <div className="job_details1234">
                <div className="job_detailscon_edit">

                  <p><BorderColorIcon style={{ fontSize: '17px', cursor: 'pointer', padding: '5px 10px', marginRight: '10px' }} /></p>
                </div>
                <div className="job_detailscon">
                  <label>
                    Job Code<span>:</span>
                  </label>
                  <p>{job.JobCode}</p>
                </div>

                <div className="job_detailscon">
                  <label>
                    Job Name<span>:</span>
                  </label>
                  <p>   <FontAwesomeIcon icon={faStar} style={{ color: 'gold' }} /><h4>{job.jobName}</h4></p>
                </div>

                <div className="job_detailscon">
                  <label>
                    Qualification<span>:</span>
                  </label>
                  <p>{job.Qualification}</p>
                </div>

                <div className="job_detailscon">
                  <label>
                    Experience<span>:</span>
                  </label>
                  <p>{job.Experience}</p>
                </div>



                <div className="job_detailscon">
                  <label>
                    Job Openings<span>:</span>
                  </label>
                  <p>{job.JobOpenings}</p>
                </div>

                <div className="job_detailscon">
                  <label>
                    Applications<span>:</span>
                  </label>
                  <p style={{ width: '130px' }}><h3>{job?.applicationsReceived || 0}</h3></p><button><VisibilityIcon style={{ fontSize: '13.5px' }} />View Applications</button>
                </div>



                <div className="recruiting_button_hrt">
                  <button>
                    <AccessTimeIcon style={{ fontSize: '15px' }} />Recruiting in Process
                  </button>
                  {/* <button className="close-button">
    Close
  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {openModal && (
        <div
          className={
            isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
          }
          onClick={() => {
            setOpenModal(false);
          }}
        >
          <div
            className="newwProfiles newwPopupforreason"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="appointment">
              <div className="h_head">
                <h4>New Job Requirement</h4>
              </div>
            </div>
            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1">
                <label htmlFor="companyName">
                  Company Name<span>:</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  onChange={handleInputChange}
                  value={jobformData.companyName}
                />
              </div>
            </div>
            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1">
                <label htmlFor="department">
                  Department<span>:</span>
                </label>
                <input
                  type="text"
                  name="department"
                  id="department"
                  value={jobformData.department}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1">
                <label htmlFor="role">
                  Role<span>:</span>
                </label>
                <input
                  type="text"
                  name="role"
                  id="role"
                  value={jobformData.role}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1">
                <label htmlFor="qualification">
                  Qualification<span>:</span>
                </label>
                <input
                  type="text"
                  name="qualification"
                  id="qualification"
                  value={jobformData.qualification}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1">
                <label htmlFor="keySkills">
                  Key Skills<span>:</span>
                </label>
                <input
                  type="text"
                  name="keySkills"
                  id="keySkills"
                  value={jobformData.keySkills}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1">
                <label htmlFor="employeeType">
                  Employee Type<span>:</span>
                </label>
                <select
                  type="text"
                  name="employeeType"
                  id="employeeType"
                  value={jobformData.employeeType}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="FullTime">Full Time</option>
                  <option value="PartTime">Part Time</option>
                </select>
              </div>
            </div>
            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1">
                <label htmlFor="experience">
                  Experience<span>:</span>
                </label>
                <input
                  type="text"
                  name="experience"
                  id="experience"
                  value={jobformData.experience}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1">
                <label htmlFor="ctc">
                  CTC<span>:</span>
                </label>
                <input
                  type="text"
                  id="ctc"
                  name="ctc"
                  value={jobformData.ctc}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1">
                <label htmlFor="location">
                  Location<span>:</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={jobformData.location}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1">
                <label htmlFor="jobOpenings">
                  Job Openings <span>:</span>
                </label>
                <input
                  id="jobOpenings"
                  name="jobOpenings"
                  value={jobformData.jobOpenings}
                  onChange={handleInputChange}
                ></input>
              </div>
            </div>
            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1">
                <label htmlFor="jobDescription">
                  Job Description <span>:</span>
                </label>
                <textarea
                  id="jobDescription"
                  name="jobDescription"
                  cols="25"
                  rows="3"
                  value={jobformData.jobDescription}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>

            <div className="Register_btn_con">
              <button
                className="RegisterForm_1_btns"
                onClick={handleFormSubmit}
              >
                Submit
              </button>
              <button
                className="RegisterForm_1_btns"
                onClick={() => setOpenModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default JobRequirement;
