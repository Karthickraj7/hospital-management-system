import React, { useState, useEffect } from "react";
import "./Requirements.css";
import axios from "axios";
// import DeveloperResume from "../assets/DeveloperResume.pdf";
import { useSelector } from "react-redux";
// import { Document, Page } from "react-pdf";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useNavigate } from "react-router-dom";

function MailFromConsultancy() {
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const [selectedResume, setSelectedResume] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery1, setSearchQuery1] = useState("");

  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);

  const [resumes, setResumes] = useState([]);
  const [role, setrole] = useState([]);
  const [consultancydata, setconsultancydata] = useState([]);

  // const [approvedResumes, setApprovedResumes] = useState([]);
  // const [rejectedResumes, setRejectedResumes] = useState([]);
  const [shortlistedResumes, setShortlistedResumes] = useState([]);

  const [processdata, setprocessdata] = useState([]);

  // const [resumes, setResumes] = useState([
  //   {
  //     ResumeCode: 1,
  //     ResumeName: "Arun",
  //     ResumePhone: "9863563738.",
  //     ResumeEmail: "arun@emailforResume@gmail.com",
  //     ResumePdf: DeveloperResume,
  //     Status: null,
  //   },
  //   {
  //     ResumeCode: 2,
  //     ResumeName: "Santhosh",
  //     ResumePhone: "982363738.",
  //     ResumeEmail: "Santhosh@emailforResume@gmail.com",
  //     ResumePdf: DeveloperResume,
  //     Status: null,
  //   },
  //   {
  //     ResumeCode: 3,
  //     ResumeName: "Ashok",
  //     ResumePhone: "982380738.",
  //     ResumeEmail: "Ashok@emailforResume@gmail.com",
  //     ResumePdf: DeveloperResume,
  //     Status: null,
  //   },
  // ]);

  useEffect(() => {
    axios
      .get(
        `${urllink}HRmanagement/getprocesseddata?location=${userRecord?.location}`
      )
      .then((response) => {
        console.log(response.data);
        setprocessdata(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [urllink, userRecord?.location]);

  useEffect(() => {
    axios
      .get(`${urllink}HRmanagement/getresponseemail`)
      .then((response) => {
        const resumeData = response.data;
        console.log(resumeData);

        const parsedResumes = resumeData.candidates.map((candidate, index) => {
          const role = extractRole(resumeData.body);
          const consultancyname = resumeData.subject;
          return { ...candidate, role, consultancyname };
        });
        console.log(parsedResumes);
        // setResumes(parsedResumes);
        const filteredResumes1 = parsedResumes.filter(
          (resume) =>
            !processdata.some(
              ({ name, phone, role }) =>
                resume.name === name &&
                resume.phone === phone &&
                resume.role === role
            )
        );

        console.log(filteredResumes1);

        setResumes(filteredResumes1);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [urllink, processdata]);

  useEffect(() => {
    axios
      .get(`${urllink}HRmanagement/getapprovedrole`)
      .then((response) => {
        console.log(response.data);
        setrole(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get(
        `${urllink}HRmanagement/getconsultancymaster?location=${userRecord?.location}`
      )
      .then((response) => {
        console.log(response.data);
        setconsultancydata(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [urllink, userRecord?.location]);

  const extractRole = (body) => {
    // Split the body by lines and find the line containing "Role:"
    const lines = body.split("\n");
    for (let line of lines) {
      if (line.startsWith("Role:")) {
        // Extract and return the role
        return line.substring(5).trim();
      }
    }
    return ""; // Return empty string if role not found
  };

  const closeModal = () => {
    setSelectedResume(false);
  };

  const handleResumeClick = (resumePdf) => {
    setSelectedResume(resumePdf);
  };

  const handleStatusChange = (index, status) => {
    const updatedResumes = [...resumes];
    const updatedResume = { ...updatedResumes[index], Status: status };

    if (status === "Approved" || status === "Rejected") {
      // Add to shortlistedResumes if approved or rejected
      setShortlistedResumes([...shortlistedResumes, updatedResume]);
    } else {
      // Reset case: Remove from shortlistedResumes
      const filteredResumes = shortlistedResumes.filter(
        (resume) => resume !== updatedResume
      );
      setShortlistedResumes(filteredResumes);
    }

    // Update the main resumes array
    updatedResumes[index] = updatedResume;
    setResumes(updatedResumes);
  };

  const handleReset = (index) => {
    console.log(resumes[index]);
    const name = resumes[index].name;

    setResumes((prevResumes) => {
      const updatedResumes = [...prevResumes];
      if (updatedResumes[index]) {
        updatedResumes[index] = { ...updatedResumes[index], Status: null };
      }
      return updatedResumes;
    });

    const shortlistedIndex = shortlistedResumes.findIndex(
      (resume) => resume.name === name
    );

    if (shortlistedIndex !== -1) {
      // Remove from shortlistedResumes if previously shortlisted
      const filteredShortlistedResumes = [...shortlistedResumes];
      filteredShortlistedResumes.splice(shortlistedIndex, 1);
      setShortlistedResumes(filteredShortlistedResumes);
    }
  };

  const handleSearchChange = (event) => {
    const { id, value } = event.target;

    if (id === "role") {
      setSearchQuery(value);
    } else if (id === "consultancyname") {
      setSearchQuery1(value);
    }
  };

  const filteredResumes = resumes.filter((resume) => {
    if (searchQuery && !searchQuery1) {
      // Filter by role
      return resume.role.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (!searchQuery && searchQuery1) {
      // Filter by consultancy name
      return resume.consultancyname.toLowerCase().includes(searchQuery1.toLowerCase());
    } else if (searchQuery && searchQuery1) {
      // Filter by both role and consultancy name
      return (
        resume.role.toLowerCase().includes(searchQuery.toLowerCase()) &&
        resume.consultancyname
          .toLowerCase()
          .includes(searchQuery1.toLowerCase())
      );
    } else {
      // No search query, return all resumes
      return true;
    }
  });

  const navigate = useNavigate();

  const handleApprove = async () => {
    for (const resume of shortlistedResumes) {
      try {
        // Convert resume URL to Blob
        const response1 = await fetch(resume.resume);
        const blob = await response1.blob();
        console.log(blob);

        // Create FormData and append Blob
        const formData = new FormData();
        formData.append("resume", blob, "resume.pdf");

        // Append other data
        formData.append("Status", resume.Status);
        formData.append("consultancyname", resume.consultancyname);
        formData.append("email", resume.email);
        formData.append("name", resume.name);
        formData.append("phone", resume.phone);
        formData.append("role", resume.role);
        formData.append("location", userRecord?.location);
        formData.append("createdby", userRecord?.username);

        // Send FormData to backend
        const response = await axios.post(
          `${urllink}/HRmanagement/postshortlistedresume`,
          formData
        );
        console.log(response.data);
        navigate('/Home/Shortlisted-Resume-list')
        
      } catch (error) {
        console.error("Error handling resume:", error);
      }
    }
  };

  return (
    <div className="appointment">
      <div className="h_head">
        <h4>Resumes</h4>
      </div>
      <br />
      <div className="con_1 ">
        <div className="inp_1">
          <label htmlFor="role">
            Role<span>:</span>
          </label>
          <select
            type="text"
            id="role"
            name="role"
            value={searchQuery}
            onChange={handleSearchChange}
          >
            <option value="">Select</option>
            {role.map((roleObj, index) => (
              <option key={index} value={roleObj.Role}>
                {roleObj.Role}
              </option>
            ))}
          </select>
        </div>

        <div className="inp_1">
          <label htmlFor="consultancyname">
            Consulatncy Name <span>:</span>
          </label>
          <select
            type="text"
            id="consultancyname"
            name="consultancyname"
            value={searchQuery1}
            onChange={handleSearchChange}
          >
            <option value="">Select</option>
            {consultancydata.map((consultancyname, index) => (
              <option key={index} value={consultancyname.Consultancyname}>
                {consultancyname.Consultancyname}
              </option>
            ))}
          </select>
        </div>
      </div>
      <br />
      <div className="ResumeContainer">
        {console.log(filteredResumes)}
        {filteredResumes.length > 0 ? (
          filteredResumes.map((resume, index) => (
            <div className="ResumeCard" key={index}>
              {/* <div className="ResumeCard_ints_lbl">
                <label>
                  Resume ID<span>:</span>
                </label>
                <input value={resume.ResumeID} readOnly />
              </div> */}

              <div className="ResumeCard_ints_lbl">
                <label>
                  Name<span>:</span>
                </label>
                <input value={resume.name} readOnly />
              </div>

              <div className="ResumeCard_ints_lbl">
                <label>
                  Phone Number<span>:</span>
                </label>
                <input value={resume.phone} readOnly />
              </div>

              <div className="ResumeCard_ints_lbl">
                <label>
                  Email ID<span>:</span>
                </label>
                <input value={resume.email} readOnly />
              </div>
              <div className="ResumeCard_ints_lbl">
                <label>
                  Role<span>:</span>
                </label>
                <input value={resume?.role || ""} readOnly />
              </div>
              <div className="ResumeCard_ints_lbl">
                <label>
                  Consultancy Name <span>:</span>
                </label>
                <input value={resume?.consultancyname || ""} readOnly />
              </div>

              <div
                className="ResumeCard_ints_lbl uyewft67e"
                onClick={() => handleResumeClick(resume.resume)}
              >
                <iframe
                  src={resume.resume}
                  title="Resume"
                  className="resume-preview899"
                />
                <label>Resume</label>
              </div>

              <br />

              <div className="ResumeCard_ints_lbl">
                <label>
                  Status<span>:</span>
                </label>
                {resume.Status === "Approved" ? (
                  <CheckIcon className="status-icon22T" />
                ) : resume.Status === "Rejected" ? (
                  <ClearIcon className="status-icon22W" />
                ) : (
                  <>
                    <div className="wedwediwe6u">
                      <button
                        style={{ backgroundColor: "#dbfddb" }}
                        onClick={() => handleStatusChange(index, "Approved")}
                      >
                        Approve
                      </button>
                      <button
                        style={{ backgroundColor: "#ffdddd" }}
                        onClick={() => handleStatusChange(index, "Rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  </>
                )}
                <div className="dsfddnccmo9876">
                  <button onClick={() => handleReset(index)}>
                    <RestartAltIcon />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <>
            {searchQuery && !searchQuery1 && (
              <div className="">No Resumes Found for this Role</div>
            )}
            {!searchQuery && searchQuery1 && (
              <div className="">No Resumes Found for this Consultancy Name</div>
            )}
            {searchQuery && searchQuery1 && (
              <div className="">
                No Resumes Found for Both Role and Consultancy Name
              </div>
            )}
          </>
        )}
      </div>
      {/* {filteredResumes.length > 0 ? ( */}
        <div className="Register_btn_con">
          <button className="RegisterForm_1_btns" onClick={handleApprove}>
            Submit
          </button>
        </div>
      {/* ) : (
        <div style={{ textAlign: "center" }}>No Resumes</div>
      )} */}

      {selectedResume && (
        <div
          className={
            isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
          }
          onClick={closeModal}
        >
          <div
            className="newwProfiles newwPopupforreason"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={selectedResume}
              title="Resume"
              className="resume-iframe"
            />
            <button
              className="RegisterForm_1_btns"
              onClick={() => setSelectedResume(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MailFromConsultancy;
