import React, { useState } from "react";
import "./skilstyle.css";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";


const SkillSetTable = () => {
  const [skills, setSkills] = useState([]);
  const EmployeeListId = useSelector((state) => state.Frontoffice?.EmployeeListId);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addSkill = () => {
    const skillInput = document.getElementById("new-skill");
    const skillName = skillInput.value.trim();

    if (!skillName) {
      alert("Please enter a skill name.");
      return;
    }

    const normalizedSkillName = skillName.toLowerCase();
    if (skills.some((skill) => skill.name.toLowerCase() === normalizedSkillName)) {
      alert("This skill already exists.");
      return;
    }

    setSkills([...skills, { name: skillName, level: "" }]);
    skillInput.value = ""; // Clear the input
  };

  const deleteSkill = (index) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      const updatedSkills = skills.filter((_, i) => i !== index);
      setSkills(updatedSkills);
    }
  };
  

  const updateSkillLevel = (index, level) => {
    const updatedSkills = skills.map((skill, i) =>
      i === index ? { ...skill, level } : skill
    );
    setSkills(updatedSkills);
  };

  const handleSubmit = () => {
    if (skills.length === 0) {
      alert("Please add at least one skill before submitting.");
      return;
    }

    const incompleteSkills = skills.filter((skill) => !skill.level);
    if (incompleteSkills.length > 0) {
      alert(
        `Please select a proficiency level for the following skills: ${incompleteSkills
          .map((skill) => skill.name)
          .join(",")}`
      );
      return;
    }
    const Data ={
      EmployeeListId:EmployeeListId?.Employee_Id || "",
      skills,
    }

    console.log(Data,'Dataaaaaaaaaaa');
    
    axios.post(`${UrlLink}HR_Management/Employee_SkillSet_Details`,Data)
    .then((res) => {
      const [type, message] = [Object.keys(res.data)[0], Object.values(res.data)[0]];
      dispatch({ type: 'toast', value: { message, type } });
      alert("Skills submitted successfully!");
    })
    .catch((err) => console.log(err));
    alert("Failed to submit skills. Please try again.");

  };

  return (
    <div className="table-container_v7">
      <div className="skilHeadv12">
        <h2>Skill-Set Form</h2>
        <div className="skvinput">
          <label htmlFor="new-skill">Add Skill:&nbsp;&nbsp;&nbsp;</label>
          <input type="text" id="new-skill" placeholder="Enter new skill" />
          <button type="button" onClick={addSkill}>
            Add New
          </button>
        </div>
      </div>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Skill</th>
            <th>Beginner</th>
            <th>Intermediate</th>
            <th>Expert</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {skills.map((skill, index) => (
            <tr key={index}>
              <td>{skill.name}</td>
              <td>
                <input
                  type="radio"
                  name={`level-${index}`}
                  value="Beginner"
                  checked={skill.level === "Beginner"}
                  onChange={() => updateSkillLevel(index, "Beginner")}
                />
              </td>
              <td>
                <input
                  type="radio"
                  name={`level-${index}`}
                  value="Intermediate"
                  checked={skill.level === "Intermediate"}
                  onChange={() => updateSkillLevel(index, "Intermediate")}
                />
              </td>
              <td>
                <input
                  type="radio"
                  name={`level-${index}`}
                  value="Expert"
                  checked={skill.level === "Expert"}
                  onChange={() => updateSkillLevel(index, "Expert")}
                />
              </td>
              <td>
                <button
                  type="button"
                  onClick={() => deleteSkill(index)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleSubmit}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#2196F3",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Submit
      </button>
      <button
        onClick={ ()=>navigate('/Home/EmployeeRegistration')}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#2196F3",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        >
          Close
      </button>
    </div>
  );
};

export default SkillSetTable;
