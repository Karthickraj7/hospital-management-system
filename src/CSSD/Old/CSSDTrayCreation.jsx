import React, { useState } from "react";
import { Checkbox, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const trayMasterData = {
  "Wound Dressing Tray": ["Scissors", "Forceps", "Gauze"],
  "Suture Removal Tray": ["Scalpel", "Tweezers", "Antiseptic"],
  "Catheter Removal Tray": ["Gloves", "Sterile Water", "Clamps"],
  "Drain Insertion Tray": [],
  "Sternotomy Set": [],
  "CABG Set": [],
  "Craniotomy Set": [],
  "Micro Dissector Set": [],
  "Emergency Tray": [],
  "Laproscopy Set": [],
  "Vaginal Hysterectomy Set": [],
  "Abdominal Hysterectomy Set": [],
  "D&C Set": [],
  "Retractor Set": [],
  "Delivery Set": [],
};

// const trayMasterNames = Object.keys(trayMasterData);

const CSSDTrayCreation = () => {

  const [selectInstruments, setSelectInstruments] = useState(false);
  const [selectedTrayName, setSelectedTrayName] = useState("");
  const [showReason, setShowReason] = useState(false);

  const [formData, setFormData] = useState({
    creationDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    trayName: "",
    instruments: "",
    rateCategory: "",
    status: "Active",
    reason: "",
  });

  const updateExpiryDate = (newCreationDate) => {
    const creationDateObj = new Date(newCreationDate);
    const nextDay = new Date(creationDateObj.setDate(creationDateObj.getDate() + 1));
    const nextDayISO = nextDay.toISOString().split("T")[0];
    setFormData((prevData) => ({
      ...prevData,
      expiryDate: nextDayISO,
    }));
  };

  const [trayList, setTrayList] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => {
      if (type === "checkbox") {
        return {
          ...prevData,
          rateCategory: checked
            ? prevData.rateCategory + value
            : prevData.rateCategory.replace(value, ""),
        };
      }

      if (name === "status" && value === "Inactive") {
        return {
          ...prevData,
          status: value,
          reason: "",
        };
      } else if (name === "status" && value === "Active") {
        return {
          ...prevData,
          status: value,
          reason: "",
        };
      }

      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleSave = () => {
    if (formData.status === "Inactive" && !formData.reason) {
      alert("Please provide a reason for setting the status to Inactive.");
      return;
    }

    if (editingIndex !== null) {
      const updatedTrays = [...trayList];
      updatedTrays[editingIndex] = formData;
      setTrayList(updatedTrays);
      setEditingIndex(null);
    } else {
      setTrayList((prevList) => [...prevList, formData]);
    }

    setFormData({
      creationDate: new Date().toISOString().split("T")[0],
      expiryDate: "",
      trayMasterName: "",
      instruments: "",
      trayName: "",
      rateCategory: "",
      status: "Active",
      reason: "",
    });
  };

  const [editingIndex, setEditingIndex] = useState(null);
  const handleEdit = (index) => {
    setFormData(trayList[index]);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updatedTrayList = trayList.filter((_, i) => i !== index);
    setTrayList(updatedTrayList);
  };

  const handleSelectInstruments = () => {
    setSelectInstruments(true)
  }

  const handleTrayMasterSelect = (e) => {
    const trayName = e.target.value;
    setFormData((prevData) => ({ ...prevData, trayMasterName: trayName }));
    setSelectedTrayName(trayName);
    setSelectInstruments(true);
  };

  return (
    <div className="Main_container_app">
      <h4>Tray Creation</h4>
      <div className="RegisFormcon_1">
        <div className="RegisForm_1">
          <label htmlFor="TrayName">
            Tray Master Name <span>:</span>{" "}
          </label>
          <select name="trayMasterName" value={formData.trayMasterName} onChange={handleTrayMasterSelect}>
            <option value="">Select</option>
            {Object.keys(trayMasterData).map((name, index) => (
              <option key={index} value={name}>{name}</option>
            ))}
            {trayList.map((tray) => (
              <option key={tray.slNo} value={tray.trayMasterName}>
                {tray.trayMasterName}
              </option>
            ))}
          </select>
        </div>
        <div className="RegisForm_1">
          <label htmlFor="instruments">Instruments <span>:</span></label>
          <input
            type="text"
            name="instruments"
            value={formData.instruments}
            onChange={handleChange}
          />
          <AddCircleIcon onClick={() => handleSelectInstruments()} />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="trayName">Tray Name <span>:</span></label>
          <input
            type="text"
            name="trayName"
            value={formData.trayName}
            onChange={handleChange}
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="">
            Rate Category <span>:</span>
          </label>
          <label htmlFor="">A</label>
          <Checkbox
            type="radio"
            name="rateCategory"
            value="A"
            checked={formData.rateCategory === "A"}
            onChange={handleChange}
          />
          <label htmlFor="">B</label>
          <Checkbox
            type="radio"
            name="rateCategory"
            value="B"
            checked={formData.rateCategory === "B"}
            onChange={handleChange}
          />
          <label htmlFor="">C</label>
          <Checkbox
            type="radio"
            name="rateCategory"
            value="C"
            checked={formData.rateCategory === "C"}
            onChange={handleChange}
          />
        </div>

        <div className="RegisForm_1">
          <label htmlFor="">
            Tray Creation Date <span>:</span>
          </label>
          <input
            type="date"
            name="creationDate"
            value={formData.creationDate}
            onChange={(e) => {
              handleChange(e);
              updateExpiryDate(e.target.value);
            }}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="">Tray Expiry Date</label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            min={formData.creationDate}
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="">
            Status <span>:</span>
          </label>
          <div className="RegisForm_1">
            <Checkbox
              type="radio"
              id="active"
              name="status"
              value="Active"
              checked={formData.status === "Active"}
              onChange={handleChange}
            />
            <label htmlFor="active">Active</label>

            <Checkbox
              type="radio"
              id="inactive"
              name="status"
              value="Inactive"
              checked={formData.status === "Inactive"}
              onChange={handleChange}
            />
            <label htmlFor="inactive">InActive</label>
          </div>
        </div>

        {showReason && (
          <div className="RegisForm_1">
            <label>Reason for Inactive <span>:</span></label>
            <select
              name="reason"
              value={formData.reason}
              onChange={handleChange}
            >
              <option value="">Select Reason</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Damage/Not Working">Damage/Not Working</option>
            </select>
          </div>
        )}

        <div className="Main_container_Btn">
          <button onClick={handleSave}>Save</button>
        </div>

        <Dialog open={selectInstruments} onClose={() => setSelectInstruments(false)}>
          <DialogTitle>Instruments in {selectedTrayName}</DialogTitle>
          <DialogContent>
            <table>
              <thead>
                <tr>
                  <th>Instrument Name</th>
                </tr>
              </thead>
              <tbody>
                {trayMasterData[selectedTrayName]?.map((instrument, index) => (
                  <tr key={index}>
                    <td>{instrument}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DialogContent>
          <DialogActions>
            <button onClick={() => setSelectInstruments(false)}>Close</button>
          </DialogActions>
        </Dialog>
      </div>

      <div className="Selected-table-container">
        <h4>Tray List</h4>
        <table className="selected-medicine-table2">
          <thead>
            <tr>
              <th>Tray Master Name</th>
              <th>Tray Name</th>
              <th>Rate Category</th>
              <th>Creation Date</th>
              <th>Expiry Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(trayList) && trayList.length > 0 ? (
              trayList.map((item, index) => (
                <tr key={index}>
                  <td>{item.trayMasterName}</td>
                  <td>{item.trayName}</td>
                  <td>{item.rateCategory}</td>
                  <td>{item.creationDate}</td>
                  <td>{item.expiryDate}</td>
                  <td>{item.status}</td>
                  <td>
                    <button onClick={() => handleEdit(index)}>Edit</button>
                    <button onClick={() => handleDelete(index)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CSSDTrayCreation;
