import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete"; 
import Button from "@mui/material/Button";

const LeninIssue = () => {
  const dispatchvalue = useDispatch();
  const UrlLink = useSelector(state => state.userRecord?.UrlLink);
  const toast = useSelector(state => state.userRecord?.toast);
  const userRecord = useSelector(state => state.userRecord?.UserData);

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  };

  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [LinenTypeData, setLinenTypeData] = useState([]);
  const [linenIssueData, setLinenIssueData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [linenIssue, setLinenIssue] = useState({
    Issue_Id: "",
    Issue_date: formatDate(new Date()),
    Issue_shift: "",
    Department: "",
    LinenType: "",
    Quantity_issued: "",
    Status: "Issued", 
    Issued_By: userRecord?.username || "",
  });

  useEffect(() => {
    const fetchMaster = async () => {
      try {
        const [deptRes, linenRes] = await Promise.all([
          axios.get(`${UrlLink}Masters/Department_Detials_link`),
          axios.get(`${UrlLink}LeninManagement/LeninMaster_Detials_link`)
        ]);
        setDepartmentData(deptRes.data || []);
        setLinenTypeData(linenRes.data || []);
      } catch (err) { console.error("Master fetch error", err); }
    };
    if(UrlLink) fetchMaster();
  }, [UrlLink]);

  const fetchIssueList = useCallback(() => {
    axios.get(`${UrlLink}LeninManagement/Linen_Issue_Details_Link`)
      .then(res => setLinenIssueData(res.data || []))
      .catch(err => console.error(err));
  }, [UrlLink]);

  useEffect(() => {
    if(UrlLink) fetchIssueList();
  }, [UrlLink, refresh, fetchIssueList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLinenIssue(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (row) => {
    setLinenIssue({
      Issue_Id: row.Issue_Id,
      Issue_date: formatDate(row.Issue_date),
      Issue_shift: row.Issue_shift || "",
      Department: row.DepartmentId || "", 
      LinenType: row.LinenTypeId || "",   // Changed to LinenTypeId to match backend key
      Quantity_issued: row.Quantity_issued || "",
      Status: row.Status || "Issued", 
      Issued_By: row.Issued_By || "",
    });
  };

  const handleDelete = (row) => {
    if (window.confirm("Are you sure you want to delete this issue record?")) {
      axios.post(`${UrlLink}LeninManagement/Linen_Issue_Details_Link`, {
        Issue_Id: row.Issue_Id,
        isDelete: true 
      })
        .then(res => {
          const key = Object.keys(res.data)[0];
          const msg = Object.values(res.data)[0];
          dispatchvalue({ type: 'toast', value: { message: msg, type: key } });
          setRefresh(prev => !prev);
        })
        .catch(err => console.error(err));
    }
  };

  const handleSubmit = async () => {
    if (!linenIssue.Department || !linenIssue.LinenType || !linenIssue.Quantity_issued) {
        dispatchvalue({ type: "toast", value: { type: "warn", message: "Fill all fields!" } });
        return;
    }
    setLoading(true);
    const payload = {
      Issue_Id: linenIssue.Issue_Id || null,
      Issue_date: linenIssue.Issue_date,
      Issue_shift: linenIssue.Issue_shift,
      Department: parseInt(linenIssue.Department),
      LinenType: linenIssue.LinenType,
      Quantity_issued: parseInt(linenIssue.Quantity_issued),
      status: linenIssue.Status, 
      Issued_By: userRecord?.username || "Admin",
    };
    try {
      const response = await axios.post(`${UrlLink}LeninManagement/Linen_Issue_Details_Link`, payload);
      if (response.data) {
          const key = Object.keys(response.data)[0];
          const msg = Object.values(response.data)[0];
          dispatchvalue({ type: "toast", value: { type: key, message: msg } });
          setRefresh(!refresh);
          setLinenIssue({
            Issue_Id: "", Issue_date: formatDate(new Date()), Issue_shift: "",
            Department: "", LinenType: "", Quantity_issued: "", Status: "Issued",
            Issued_By: userRecord?.username || "",
          });
      }
    } catch (err) {
      dispatchvalue({ type: "toast", value: { type: "error", message: err.response?.data?.error || "Operation failed" } });
    } finally { setLoading(false); }
  };

  const filteredLinenIssueData = linenIssueData.filter((row) => {
    return Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const LinenIssueColumns = [
    { key: "Issue_Id", name: "Id" },
    { key: "Issue_date", name: "Issue Date" },
    { key: "Department", name: "Department" },
    { key: "LinenType", name: "Linen Type" },
    { key: "Quantity_issued", name: "Qty" },
    { key: "Status", name: "Status" }, 
    {
      key: "Action", name: "Action",
      renderCell: ({ row }) => (
        <>
          <Button onClick={() => handleEdit(row)} className="cell_btn">
            <EditIcon />
          </Button>
          <Button onClick={() => handleDelete(row)} className="cell_btn" style={{ color: 'red' }}>
            <DeleteIcon />
          </Button>
        </>
      )
    }
  ];

  return (
    <>
      <div className="Main_container_app">
        <h3>Linen Issue / Collection</h3>
        <div className="RegisFormcon_1">
          <div className="RegisForm_1">
            <label>Issue Date :</label>
            <input type="datetime-local" name="Issue_date" value={linenIssue.Issue_date} onChange={handleChange} />
          </div>
          <div className="RegisForm_1">
            <label>Shift :</label>
            <select name="Issue_shift" value={linenIssue.Issue_shift} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Morning">Morning</option>
              <option value="Night">Night</option>
            </select>
          </div>
          <div className="RegisForm_1">
            <label>Department :</label>
            <select name="Department" value={linenIssue.Department} onChange={handleChange}>
              <option value="">Select</option>
              {DepartmentData.filter(d => d.Status === "Active").map(d => (
                <option key={d.id} value={d.id}>{d.DepartmentName}</option>
              ))}
            </select>
          </div>
          <div className="RegisForm_1">
            <label>Linen Type :</label>
            <select name="LinenType" value={linenIssue.LinenType} onChange={handleChange}>
              <option value="">Select</option>
              {LinenTypeData.filter(l => l.Status === true || l.Status === "Active").map(l => (
                /* Changed value from l.LeninCode to l.id (or whatever the primary key field name is) */
                <option key={l.LeninCode} value={l.LeninType}>{l.LeninType}</option>
              ))}
            </select>
          </div>
          <div className="RegisForm_1">
            <label>Quantity :</label>
            <input type="number" name="Quantity_issued" value={linenIssue.Quantity_issued} onChange={handleChange} />
          </div>
          <div className="RegisForm_1">
            <label>Status :</label>
            <select name="Status" value={linenIssue.Status} onChange={handleChange}>
              <option value="Issued">Issued</option>
              <option value="Collected">Collected</option>
              <option value="Raised">Raised</option>
            </select>
          </div>
        </div>
        <div className="Main_container_Btn">
          <button onClick={handleSubmit} disabled={loading}>{linenIssue.Issue_Id ? "Update" : "Add"}</button>
        </div>

        <div className="RegisFormcon_1" style={{ justifyContent: 'flex-end', marginTop: '20px' }}>
          <div className="RegisForm_1">
            <label>Search Issues:</label>
            <input
              type="text"
              placeholder="Search by ID, Dept, Type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ReactGrid columns={LinenIssueColumns} RowData={filteredLinenIssueData} />
      </div>
      <ToastAlert Message={toast?.message} Type={toast?.type} />
    </>
  );
};

export default LeninIssue;