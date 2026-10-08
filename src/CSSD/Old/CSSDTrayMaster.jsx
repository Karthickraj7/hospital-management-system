import React, { useEffect, useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useDispatch } from "react-redux";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import DeleteIcon from "@mui/icons-material/Delete";

const CSSDTrayMaster = () => {

  const dispatchvalue = useDispatch()
  const [selectInstrument, setSelectInstrument] = useState(false);
  const [instrumentData, setInstrumentData] = useState([])
  const [instrument, setInstrument] = useState([])
  const [selectedInstrumentCode, setSelectedInstrumentCode] = useState("");

  const [selectInstModal, setInstModal] = useState({
    selectInstrument: "",
  });
  const [formData, setFormData] = useState({
    trayName: "",
    instrumentName: "",
    instrumentId: "",
  });

  const [trayList, setTrayList] = useState([]);

  const SelectDataColumn = [
    {
      key: "id",
      name: "Instrument Id",
    },
    {
      key: "selectInstrument",
      name: "Selected Instrument",
    },
    {
      key: "instrumentCode",
      name: "Instrument Code",
    },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => {
        return (
          <>
            <button
              className="cell_btn"
              onClick={() => handleInstrumentsDelete(params.row)}
            >
              <DeleteIcon className="check_box_clrr_cancell" />
            </button>
          </>
        );
      },
    },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        rateCategory: checked
          ? prevData.rateCategory + value
          : prevData.rateCategory.replace(value, ""),
      }));
    } else if (name === "selectInstrument") {
      const selectedInstrument = instrumentData.find(
        (p) => p.instrument_Id === value
      );
      setSelectedInstrumentCode(selectedInstrument?.instrumentCode || "");
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSave = () => {
    setTrayList((prevList) => [
      ...prevList,
      { ...formData, slNo: prevList.length + 1 },
    ]);

    setFormData({
      trayName: "",
    });
  };

  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    fetch("/api/instruments") // Replace Instruments API URL
      .then((res) => res.json())
      .then((data) => setInstrumentData(data || []))
      .catch((err) => console.error("Error fetching instrument data:", err));
  }, []);

  const handleEdit = (index) => {
    const selectedTray = trayList[index];
    setFormData({
      trayName: selectedTray.trayName,
    });

    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updatedTrayList = trayList.filter((_, i) => i !== index);
    setTrayList(updatedTrayList);
  };

  const handleInstrumentSelect = () => {
    console.log("Instrument Name");
    setSelectInstrument(true);
  };

  const handleInstrumentSave = () => {
    const selectedInstrument = instrumentData.find(
      (ins) => ins.id === parseInt(selectInstModal.selectInstrument)
    );

    if (selectedInstrument) {
      const instrumentExists = instrument.some(
        (ins) => ins.id === selectedInstrument.id
      );

      if (instrumentExists) {
        const idata = {
          message: "The Instrument is already Selected",
          type: "Warn",
        };
        dispatchvalue({ type: "toast", value: idata });
      } else {
        const updatedInstrument = [
          ...instrument,
          {
            id: selectedInstrument.id,
            selectedInstrument: selectedInstrument.instrumentName,
            selectedInstrumentCode: selectedInstrument.instrumentCode,
          },
        ];
        setInstrument(updatedInstrument);

        setFormData((prev) => ({
          ...prev,
          instrumentName: updatedInstrument.map((ins) => ins.selectedInstrument).join(", "),
          instrumentId: updatedInstrument.map((ins) => ins.id).join(", "),
          instrumentCode: updatedInstrument.map((ins) => ins.selectedInstrumentCode).join(", "),
        }));
      }
    }
    setInstModal({ selectInstrument: "" });
  };

  const handleInstrumentsDelete = (instrumentId) => {
    console.log("Instrument ID to delete:", instrumentId);
    const updatedInstrument = instrument.filter(
      (ins) => ins.id !== instrumentId.id
    )
    console.log("Updated Instrument after deletion:", updatedInstrument);
    setInstrument(updatedInstrument);

    setFormData((prev) => ({
      ...prev,
      instrumentName: updatedInstrument.map((ins) => ins.selectedInstrument).join(", "),
      instrumentId: updatedInstrument.map((ins) => ins.id).join(", ")
    }))
  }

  return (
    <div className="Main_container_app">
      <h4>Tray Hit Master</h4>
      <div className="RegisFormcon_1">
        <div className="RegisForm_1">
          <label htmlFor="">
            Tray Hit Name <span>:</span>
          </label>
          <input
            type="text"
            name="trayName"
            value={formData.trayName}
            onChange={handleChange}
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="">
            Instrument Name <span>:</span>
          </label>
          <input
            type="text"
            name="instrumentName"
            value={formData.instrumentName}
            onChange={handleChange}
          />
          <AddCircleIcon onClick={() => handleInstrumentSelect()} />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="">Instrument Code <span>:</span></label>
          <input
            type="text"
            name="instrumentCode"
            value={formData.instrumentCode}
            readOnly
          />
        </div>

        <div className="Main_container_Btn">
          <button onClick={handleSave}>Save</button>
        </div>
      </div>

      {selectInstrument && (
        <div className="loader" onClick={() => setSelectInstrument(false)}>
          <div
            className="loader_register_roomshow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="DivCenter_container">Select Instruments</div>
            <div className="RegisFormcon_1">
              <div className="RegisForm_1">
                <label htmlFor="selectInstrumentModal">
                  Instrument Name <span>:</span>
                </label>
                <select
                  name="selectInstrument"
                  value={selectInstModal.selectInstrument}
                  onChange={(e) => {
                    setInstModal({ selectInstrument: e.target.value });
                    const selectedInstrument = instrumentData.find(
                      (p) => p.instrument_Id === e.target.value
                    );
                    setSelectedInstrumentCode(selectedInstrument?.instrumentCode || "");
                  }}
                >
                  <option value="">Select</option>
                  {Array.isArray(instrumentData) && instrumentData
                    .filter((p) => p.Status === "Active")
                    .map((p, index) => (
                      <option key={index} value={p.instrument_Id}>
                        {p.instrumentName}
                      </option>
                    ))}
                </select>
                <div className="RegisForm_1">
                  <label htmlFor="instrumentCode">
                    Instrument Code <span>:</span>
                  </label>
                  <input
                    type="text"
                    name="instrumentCode"
                    value={selectedInstrumentCode}
                    readOnly
                  />
                </div>
                <div className="Main_container_Btn">
                  <button onClick={handleInstrumentSave}>Save</button>
                </div>
              </div>
            </div>
            <ReactGrid columns={SelectDataColumn} RowData={instrument} />
          </div>
        </div>
      )}

      <div className="Selected-table-container">
        <h4>Tray List</h4>
        <table className="selected-medicine-table2">
          <thead>
            <tr>
              <th>SL.NO</th>
              <th>Tray Name</th>
              <th>Instrument Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(trayList) && trayList.length > 0 ? (
              trayList.map((item, index) => (
                <tr key={index}>
                  <td>{item.slNo}</td>
                  <td>{item.trayName}</td>
                  <td>{item.instrumentName}</td>
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

export default CSSDTrayMaster;
