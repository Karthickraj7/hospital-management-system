import React, { useEffect, useState } from "react";
import ControlPointDuplicateIcon from "@mui/icons-material/ControlPointDuplicate";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import { useSelector } from "react-redux";
import axios from "axios";

function InterviewProcessing() {

  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);

  const SelectedCandidateData = useSelector((state) => state.userRecord?.SelectedCandidateData);
  console.log(SelectedCandidateData)

  const [selectedResume, setSelectedResume] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false); // Added loading state

  const [interviewRounds, setInterviewRounds] = useState([2]);
  const [showCardTwo, setShowCardTwo] = useState(false);
  const [currentRound, setCurrentRound] = useState({});

  const [card1Data, setCard1Data] = useState({
    interviewerName: "",
    candidateName: "",
    interviewDate: "",
    email: "",
    phoneNumber: "",
    positionApplied: "",
    educationBackground: "",
    relevantExperience: "",
    availability: "",
    performanceMarksCard1: 1,
    moveToNextRoundCard1: "",
    CandidateID: '',
    nextRoundDate: "",
    InterViewRounds: ''
  });

  const [card2Data, setCard2Data] = useState({
    performanceMarksCard2: 1,
    moveToNextRoundCard2: "",
    interviewerName: '',
  });

  const [finalRoundData, setFinalRoundData] = useState({
    interviewerName: "",
    candidateName: "",
    interviewDate: "",
    baseSalary: "",
    bonusIncentives: "",
    preferredStartDate: "",
  });


  console.log(card2Data)

  useEffect(() => {
    fetchcurrentround()
  }, [card1Data.CandidateID])

  const fetchcurrentround = () => {
    axios.get(`${urllink}HRmanagement/getcurrentRound?CadidateID=${card1Data.CandidateID}`)
      .then((response) => {
        console.log(response.data)
        setCurrentRound(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  useEffect(() => {
    setCard1Data((prevData) => ({
      ...prevData,
      interviewerName: SelectedCandidateData?.InterviewerName,
      candidateName: SelectedCandidateData?.CandidateName,
      email: SelectedCandidateData?.CandidateEmail,
      phoneNumber: SelectedCandidateData?.CandidateNumber,
      positionApplied: SelectedCandidateData?.Role,
      CandidateID: SelectedCandidateData?.id,
      interviewDate: SelectedCandidateData?.Interviewdate,
      InterViewRounds: SelectedCandidateData?.InterViewRounds,
      performanceMarksCard1: SelectedCandidateData?.PerformanceMark,
      nextRoundDate: SelectedCandidateData?.NextInterviewdate,
    }));

    if (SelectedCandidateData) {
      // Generate initial interview rounds array based on SelectedCandidateData
      const rounds = Array.from({ length: SelectedCandidateData?.InterViewRounds }, (_, i) => i + 1);
      setInterviewRounds(rounds);


      if (SelectedCandidateData?.CompletedRound == 1) {
        const updatedStatus1 = {
          icon: <CheckCircleOutlineIcon />,
          backgroundColor: "#ccffc4"
        };
        setRound1Status(updatedStatus1)
      } else {
        const updatedStatus = rounds.map(round => ({
          icon: round <= SelectedCandidateData?.CompletedRound ? <CheckCircleOutlineIcon /> : <HourglassEmptyIcon />,
          backgroundColor: round <= SelectedCandidateData?.CompletedRound ? "#ccffc4" : "#e6f7ff",
        }));
        setRoundStatus(updatedStatus);
      }



    }
    // setSelectedResume(SelectedCandidateData?.Resume)
  }, [SelectedCandidateData])


  const handlecard2change = (name, value, index) => {
    setCard2Data((prevData) => ({
      ...prevData,
      [`interviewerName_${index}`]: value,
    }));
  };


  const [round1Status, setRound1Status] = useState({
    icon: <HourglassEmptyIcon />,
    backgroundColor: "#e6f7ff",
  });

  const [roundStatus, setRoundStatus] = useState([
    { icon: <HourglassEmptyIcon />, backgroundColor: "#e6f7ff" }, // For round 1
  ]);

  const [finalRoundStatus, setFinalRoundStatus] = useState({
    icon: <HourglassEmptyIcon />,
    backgroundColor: "#e6f7ff",
  });

  const closeModal = () => {
    setSelectedResume(null);
  };

  const handleResumeClick = () => {
    setSelectedResume(SelectedCandidateData?.Resume);
    setResumeLoading(true); // Set loading state to true
  };

  const handleInputChange = (e, card) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    if (card === 1) {
      setCard1Data((prevData) => ({
        ...prevData,
        [name]: newValue,
      }));
    } else if (card === 2) {
      setCard2Data((prevData) => ({
        ...prevData,
        [name]: newValue,
      }));
    } else {
      setFinalRoundData((prevData) => ({
        ...prevData,
        [name]: newValue,
      }));
    }
  };

  const handlePerformanceMarkChange = (value) => {
    setCard1Data((prevData) => ({
      ...prevData,
      performanceMarksCard1: parseInt(value),
    }));
  };

  const handleMoveToNextRoundChange = (value) => {
    setCard1Data((prevData) => ({
      ...prevData,
      moveToNextRoundCard1: value,
    }));
  };

  const handlePerformanceMarkChange2 = (value) => {
    setCard2Data((prevData) => ({
      ...prevData,
      performanceMarksCard2: parseInt(value),
    }));
  };

  const handleMoveToNextRoundChange2 = (value) => {
    setCard2Data((prevData) => ({
      ...prevData,
      moveToNextRoundCard2: value,
    }));
  };

  const handleFinalRoundInputChange = (e) => {
    const { name, value } = e.target;
    setFinalRoundData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitCard1 = (e) => {
    e.preventDefault();
    console.log("Form submitted for card 1");
    console.log("Card 1 Data:", card1Data);

    // Update round 1 status
    let backgroundColor;
    if (card1Data.moveToNextRoundCard1 === "") {
      backgroundColor = "#e6f7ff";
    } else if (card1Data.moveToNextRoundCard1 === "yes") {
      backgroundColor = "#ccffc4";
    } else {
      backgroundColor = "#ffcccc";
    }

    setRound1Status({
      icon: getStatusIcon(card1Data.moveToNextRoundCard1),
      backgroundColor,
    });
  };

  const handleSubmitCard2 = (e, index) => {
    e.preventDefault();
    console.log("Form submitted for card 2");
    console.log("Card 2 Data:", card2Data);

    // Update round 2 status
    let backgroundColor;
    if (card2Data.moveToNextRoundCard2 === "") {
      backgroundColor = "#e6f7ff";
    } else if (card2Data.moveToNextRoundCard2 === "yes") {
      backgroundColor = "#ccffc4";
    } else {
      backgroundColor = "#ffcccc";
    }

    const updatedStatus = [...roundStatus];
    updatedStatus[index] = {
      icon: getStatusIcon(card2Data.moveToNextRoundCard2),
      backgroundColor,
    };
    setRoundStatus(updatedStatus);
  };

  const handleSubmitFinalRound = (e) => {
    e.preventDefault();
    console.log("Form submitted for final round");
    console.log("Final Round Data:", finalRoundData);

    // Update final round status based on your form data
    let moveToNextRound = finalRoundData.moveToNextRound;
    let backgroundColor;
    let icon;

    if (moveToNextRound === "yes") {
      backgroundColor = "#ccffc4";
      icon = <CheckCircleOutlineIcon />;
    } else {
      backgroundColor = "#ccffc4";
      icon = <CheckCircleOutlineIcon />;
    }

    setFinalRoundStatus({
      icon,
      backgroundColor,
    });
  };

  const getStatusIcon = (moveToNextRound) => {
    if (moveToNextRound === "") {
      return <HourglassEmptyIcon />;
    } else if (moveToNextRound === "yes") {
      return <CheckCircleOutlineIcon />;
    } else {
      return <CancelIcon />;
    }
  };

  const handleAddRound = () => {
    const newRound = interviewRounds[interviewRounds.length - 1] + 1;
    setInterviewRounds((prevRounds) => [...prevRounds, newRound]);

    // Add default status for the new round
    setRoundStatus((prevStatus) => [
      ...prevStatus,
      { icon: <HourglassEmptyIcon />, backgroundColor: "#e6f7ff" },
    ]);
  };

  const handleDeleteRound = () => {
    setInterviewRounds((prevRounds) =>
      prevRounds.filter((_, i) => i !== prevRounds.length - 1)
    );
  };

  // State to track current round

  const handleSubmit = () => {
    console.log(currentRound)
    const formdata = new FormData();

    for (const key in card1Data) {
      formdata.append(key, card1Data[key]);
    }
    formdata.append('currentRound', currentRound.CurrentRound)

    axios.post(`${urllink}HRmanagement/UpdateInterviewStatus`, formdata)
      .then((response) => {
        console.log(response.data)
        fetchcurrentround(card1Data.CandidateID)
      })
      .catch((error) => {
        console.error(error)
      })



  }


  const handleselectcandidate = () => {
    console.log(finalRoundData)
    axios.post(`${urllink}HRmanagement/updatefinalrounndstatus?CandidateID=${SelectedCandidateData?.id}&basesalary=${finalRoundData?.baseSalary}`)
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }



  return (
    <div className="card_interview_container">
      {/* {interviewRounds.map((round, index) => ( */}
      <div className="card_interview_hed">
        <div className="card-body">
          <div
            className="peding_selcd_86"
            style={{
              backgroundColor: round1Status.backgroundColor,
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            {round1Status.icon}
          </div>

          <br />
          <h5 className="card_title_interec">
            Interview Round {1}{" "}
            <span onClick={() => setShowCardTwo(!showCardTwo)}>
              <ControlPointDuplicateIcon />
            </span>
          </h5>

          <form onSubmit={handleSubmitCard1}>
            <div className="RegisFormcon" style={{ justifyContent: "center" }}>
              <div className="interviw_12">
                <label htmlFor="interviewerName">
                  Interviewer Name<span>:</span>
                </label>
                <input
                  type="text"
                  id="interviewerName"
                  name="interviewerName"
                  value={card1Data.interviewerName}
                  onChange={(e) => handleInputChange(e, 1)}
                />
              </div>
              <div className="interviw_12">
                <label htmlFor="CandidateID">
                  CandidateID<span>:</span>
                </label>
                <input
                  type="text"
                  id="CandidateID"
                  name="CandidateID"
                  value={card1Data.CandidateID}
                  onChange={(e) => handleInputChange(e, 1)}
                />
              </div>

              <div className="interviw_12">
                <label htmlFor="candidateName">
                  Candidate Name<span>:</span>
                </label>
                <input
                  type="text"
                  id="candidateName"
                  name="candidateName"
                  value={card1Data.candidateName}
                  onChange={(e) => handleInputChange(e, 1)}
                />
              </div>
              <div className="interviw_12">
                <label htmlFor="interviewDate">
                  Date of Interview<span>:</span>
                </label>
                <input
                  type="date"
                  id="interviewDate"
                  name="interviewDate"
                  value={card1Data.interviewDate}
                  onChange={(e) => handleInputChange(e, 1)}
                />
              </div>
              <div className="interviw_12">
                <label htmlFor="email">
                  Email<span>:</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={card1Data.email}
                  onChange={(e) => handleInputChange(e, 1)}
                />
              </div>
              <div className="interviw_12">
                <label htmlFor="phoneNumber">
                  Phone Number<span>:</span>
                </label>
                <input
                  type="number"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={card1Data.phoneNumber}
                  onChange={(e) => handleInputChange(e, 1)}
                />
              </div>
              <div className="interviw_12">
                <label htmlFor="positionApplied">
                  Position Applied For<span>:</span>
                </label>
                <input
                  id="positionApplied"
                  name="positionApplied"
                  value={card1Data.positionApplied}
                  onChange={(e) => handleInputChange(e, 1)}
                >
                </input>
              </div>
              <div className="interviw_12">
                <label htmlFor="relevantExperience">
                  Resume<span>:</span>
                </label>
                <p onClick={handleResumeClick}>
                  <ContentPasteSearchIcon />
                </p>
              </div>

              <div className="interviw_12">
                <label htmlFor="performanceMarksCard1">
                  Performance Mark (1-10)<span>:</span>
                </label>
                <select
                  id="performanceMarksCard1"
                  name="performanceMarksCard1"
                  value={card1Data.performanceMarksCard1}
                  onChange={(e) => handlePerformanceMarkChange(e.target.value)}
                >
                  {[...Array(10)].map((_, index) => (
                    <option key={index} value={index + 1}>
                      {index + 1}/10
                    </option>
                  ))}
                </select>
              </div>
              <div className="interviw_12">
                <label htmlFor="moveToNextRoundCard1">
                  Move to Next Round<span>:</span>
                </label>
                <div className="radio_interve">
                  <input
                    type="radio"
                    id="yes"
                    name="moveToNextRoundCard1"
                    value="yes"
                    checked={card1Data.moveToNextRoundCard1 === "yes"}
                    onChange={(e) =>
                      handleMoveToNextRoundChange(e.target.value)
                    }
                  />
                  <label htmlFor="yes">Yes</label>
                </div>
                <div className="radio_interve">
                  <input
                    type="radio"
                    id="no"
                    name="moveToNextRoundCard1"
                    value="no"
                    checked={card1Data.moveToNextRoundCard1 === "no"}
                    onChange={(e) =>
                      handleMoveToNextRoundChange(e.target.value)
                    }
                  />
                  <label htmlFor="no">No</label>
                </div>
              </div>
              <div className="interviw_12">
                <label htmlFor="nextRoundDate">
                  Next Round Date<span>:</span>
                </label>
                <input
                  type="date"
                  id="nextRoundDate"
                  name="nextRoundDate"
                  value={card1Data.nextRoundDate}
                  onChange={(e) => handleInputChange(e, 1)}
                />
              </div>
            </div>

            <br />
            <div className="Register_btn_con">
              <button type="submit" className="RegisterForm_1_btns" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* {showCardTwo && ( */}
      {/* <>
        {interviewRounds.map((round, index) => (
          <div key={index} className="card_interview_hed">
            <div className="card-body">
              <div
                className="peding_selcd_86"
                style={{
                  backgroundColor: roundStatus[index]?.backgroundColor,
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                {roundStatus[index]?.icon}
              </div>
              <br />

              <h5 className="card_title_interec">
                Interview Round {round + 1}{" "}
                <div className="sxcdjuye54wdp">
                  {index === 0 && (
                    <span onClick={() => setShowCardTwo(!showCardTwo)}>
                      <HighlightOffIcon />
                    </span>
                  )}
                  {index !== 0 && (
                    <span onClick={() => handleDeleteRound(index)}>
                      {" "}
                      <RemoveCircleOutlineIcon />
                    </span>
                  )}
                  {index === interviewRounds.length - 1 && (
                    <span onClick={handleAddRound}>
                      <ControlPointIcon />
                    </span>
                  )}
                </div>
              </h5>
              <form onSubmit={(e) => handleSubmitCard2(e, index)}>
                {" "}
                <div
                  className="RegisFormcon"
                  style={{ justifyContent: "center" }}
                >
                  <div className="interviw_12">
                    <label htmlFor={`CandidateID${index}`}>
                      Candidate ID<span>:</span>
                    </label>
                    <input type="text" id={`CandidateID${index}`}
                      value={card1Data.CandidateID} />
                  </div>

                  <div className="interviw_12">
                    <label htmlFor={`interviewerName_${index}`}>
                      Interviewer Name<span>:</span>
                    </label>
                    <input
                      type="text"
                      id={`interviewerName_${index}`}
                      name="interviewerName"
                      value={card2Data.interviewerName}
                      onChange={(e) => handlecard2change(e.target.name, e.target.value, index)}
                    />

                  </div>
                  <div className="interviw_12">
                    <label htmlFor={`candidateName_${index}`}>
                      Candidate Name<span>:</span>
                    </label>
                    <input type="text" id={`candidateName_${index}`}
                      value={card1Data.candidateName} />
                  </div>
                  <div className="interviw_12">
                    <label htmlFor={`interviewDate_${index}`}>
                      Date of Interview<span>:</span>
                    </label>
                    <input type="date" id={`interviewDate_${index}`} />
                  </div>

                  <div className="interviw_12">
                    <label htmlFor={`performanceMarksCard_${index}`}>
                      Performance Mark (1-10)<span>:</span>
                    </label>
                    <select
                      id={`performanceMarksCard_${index}`}
                      name={`performanceMarksCard_${index}`}
                      onChange={(e) =>
                        handlePerformanceMarkChange2(e.target.value, index)
                      }
                    >
                      {[...Array(10)].map((_, index) => (
                        <option key={index} value={index + 1}>
                          {index + 1}/10
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="interviw_12">
                    <label htmlFor={`moveToNextRoundsCard_${index}`}>
                      Move to Next Round<span>:</span>
                    </label>
                    <div className="radio_interve">
                      <input
                        type="radio"
                        id={`yes_${index}`}
                        name={`moveToNextRoundsCard_${index}`}
                        value="yes"
                        onChange={(e) =>
                          handleMoveToNextRoundChange2(e.target.value, index)
                        }
                      />
                      <label htmlFor={`yes_${index}`}>Yes</label>
                    </div>
                    <div className="radio_interve">
                      <input
                        type="radio"
                        id={`no_${index}`}
                        name={`moveToNextRoundsCard_${index}`}
                        value="no"
                        onChange={(e) =>
                          handleMoveToNextRoundChange2(e.target.value, index)
                        }
                      />
                      <label htmlFor={`no_${index}`}>No</label>
                    </div>
                  </div>
                  <div className="interviw_12">
                    <label htmlFor={`nextRoundDate_${index}`}>
                      Date of Interview<span>:</span>
                    </label>
                    <input type="date" id={`nextRoundDate_${index}`} />
                  </div>
                </div>
                <br />
                <div className="Register_btn_con">
                  <button type="submit" className="RegisterForm_1_btns" onClick={handleSubmit}>
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        ))}
      </>  */}


      <div className="card_interview_hed">
        <div className="card-body">
          <div
            className="peding_selcd_86"
            style={{
              backgroundColor: finalRoundStatus.backgroundColor,
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            {finalRoundStatus.icon}
          </div>
          <br />
          <h5 className="card_title_interec">Interview Round Final</h5>

          <form onSubmit={handleSubmitFinalRound}>
            <div className="RegisFormcon" style={{ justifyContent: "center" }}>
              <div className="interviw_12">
                <label htmlFor="interviewerName">
                  Interviewer Name<span>:</span>
                </label>
                <input
                  type="text"
                  id="interviewerName"
                  name="interviewerName"
                  value={finalRoundData.interviewerName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="interviw_12">
                <label htmlFor="candidateName">
                  Candidate Name<span>:</span>
                </label>
                <input
                  type="text"
                  id="candidateName"
                  name="candidateName"
                  value={card1Data.CandidateID}
                  onChange={handleInputChange}
                />
              </div>
              <div className="interviw_12">
                <label htmlFor="interviewDate">
                  Date of Interview<span>:</span>
                </label>
                <input
                  type="date"
                  id="interviewDate"
                  name="interviewDate"
                  value={card1Data.interviewDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="interviw_12">
                <label htmlFor="baseSalary">
                  CTC (Per Annum in Lakhs) <span>:</span>
                </label>
                <input
                  type="number"
                  id="baseSalary"
                  name="baseSalary"
                  value={finalRoundData.baseSalary}
                  onChange={handleFinalRoundInputChange}
                />
              </div>
              {/* <div className="interviw_12">
                <label htmlFor="bonusIncentives">
                  Bonus/Incentives<span>:</span>
                </label>
                <input
                  type="number"
                  id="bonusIncentives"
                  name="bonusIncentives"
                  value={finalRoundData.bonusIncentives}
                  onChange={handleFinalRoundInputChange}
                />
              </div> */}
              <div className="interviw_12">
                <label htmlFor="preferredStartDate">
                  Preferred Start Date<span>:</span>
                </label>
                <input
                  type="date"
                  id="preferredStartDate"
                  name="preferredStartDate"
                  value={finalRoundData.preferredStartDate}
                  onChange={handleFinalRoundInputChange}
                />
              </div>
            </div>

            <br />
            <div className="Register_btn_con">
              <button type="submit" className="RegisterForm_1_btns" onClick={handleselectcandidate}>
                Submit
              </button>
            </div>
          </form>
        </div>
        {selectedResume && (
          <div
            className={
              isSidebarOpen
                ? "sideopen_showcamera_profile"
                : "showcamera_profile"
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
                onClick={() => setSelectedResume(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InterviewProcessing;

