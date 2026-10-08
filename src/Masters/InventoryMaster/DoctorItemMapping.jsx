import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import { FaTrash } from 'react-icons/fa';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ModelContainer from '../../OtherComponent/ModelContainer/ModelContainer';

const DoctorItemMapping = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [ItemNames, setItemNames] = useState([]);
  const [Doctors, setDoctors] = useState([]);
  const [MappedItems, setMappedItems] = useState([]);
  const [IsItemDoctorGet, setIsItemDoctorGet] = useState(false);
  console.log('MappedItems', MappedItems);
  const dispatchvalue = useDispatch();

  const [ItemMap, setItemMap] = useState({
    doctorname: '',
    doctorid: '',
    itemname: '',
    itemcode: '',
    Itemmapcode: '',
  });
  console.log('ItemMap', ItemMap);

  const [Resss, setResss] = useState([]);

  // Fetch Item Names
  useEffect(() => {
    axios
      .get(`${UrlLink}Inventory/All_Items_Link`)
      .then((response) => {
        setItemNames(Array.isArray(response.data) ? response.data : []);
      })
      .catch((err) => {
        console.error('Error fetching items:', err);
      });
  }, [UrlLink]);

  // Fetch Doctor Names
  useEffect(() => {
    axios
      .get(`${UrlLink}Inventory/All_Doctors_Item_Link`)
      .then((res) => {
        setDoctors(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === 'itemname') {
      // Find the item by name and set itemcode
      const selectedItem = ItemNames.find((item) => item.itemname === value);
      setItemMap({
        ...ItemMap,
        itemname: value,
        itemcode: selectedItem ? selectedItem.itemcode : '',
        doctorid: '',
        doctorname: '',
        Itemmapcode: '',
      });
    } else if (id === 'doctorname') {
      // Find the doctor by name and set doctorid
      const selectedDoctor = Doctors.find((doc) => doc.doctorname === value);
      setItemMap({
        ...ItemMap,
        doctorname: value,
        doctorid: selectedDoctor ? selectedDoctor.doctorid : '',
      });
    }
  };
  const handleAdd = () => {
    const { doctorname, doctorid, itemname, itemcode } = ItemMap;

    // Check if any required field is empty
    if (!doctorid || !itemcode) {
      const tdata = {
        message: `All fields must be selected before adding.`,
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
      return;
    }

    // Check if the item already exists in MappedItems
    const existingItem = MappedItems.find(
      (entry) => entry.itemcode === itemcode
    );

    if (existingItem) {
      // Check if the doctor is already mapped to this item
      const isDuplicate = existingItem.doctors.some(
        (doctor) => doctor.doctorid === doctorid
      );

      if (isDuplicate) {
        const tdata = {
          message: `This doctor is already mapped to the selected item!`,
          type: 'warn',
        };
        dispatchvalue({ type: 'toast', value: tdata });
        return;
      } else {
        // Add the new doctor to the existing item's doctors array
        setMappedItems((prev) =>
          prev.map((entry) =>
            entry.itemcode === itemcode
              ? {
                  ...entry,
                  doctors: [...entry.doctors, { doctorname, doctorid }],
                }
              : entry
          )
        );
      }
    } else {
      // Add a new item with the doctor inside the doctors array
      setMappedItems((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          itemname,
          itemcode,
          doctors: [{ doctorname, doctorid }],
        },
      ]);
    }

    const tdata = {
      message: `Added ${doctorname} to ${itemname} successfully`,
      type: 'success',
    };
    dispatchvalue({ type: 'toast', value: tdata });

    // Reset only the doctor fields, keep the item fields
    setItemMap((prevState) => ({
      ...prevState,
      doctorname: '',
      doctorid: '',
    
    }));
  };

  const handleRemove = (row) => {
    console.log('Removing doctor:', row);

    setMappedItems(
      (prev) =>
        prev
          .map((item) => {
            // If the item's doctor list contains the doctor to remove
            if (
              item.doctors.some((doctor) => doctor.doctorid === row.doctorid)
            ) {
              return {
                ...item,
                doctors: item.doctors.filter(
                  (doctor) => doctor.doctorid !== row.doctorid
                ), // Remove doctor
              };
            }
            return item;
          })
          .filter((item) => item.doctors.length > 0) // Remove items with no doctors left
    );

    const tdata = {
      message: `Doctor ${row.doctorname} removed successfully`,
      type: 'success',
    };
    dispatchvalue({ type: 'toast', value: tdata });
  };

  const MappedItemsColumns = [
    {
      key: 'id',
      name: 'S.No',
    },
    {
      key: 'doctorid',
      name: 'Doctor Id',
    },
    {
      key: 'doctorname',
      name: 'Doctor Name',
    },
    {
      key: 'Action',
      name: 'Delete',
      renderCell: (params) => (
        <Button className="cell_btn" onClick={() => handleRemove(params.row)}>
          <FaTrash className="check_box_clrr_cancell" />
        </Button>
      ),
    },
  ];

  const handleSubmit = () => {
    if (ItemMap.itemcode) {
      const data = {
        ...ItemMap,
        MappedItems: MappedItems || [],
        created_by: userRecord?.username || '',
      };
      console.log('senddata', data);
      axios
        .post(`${UrlLink}Inventory/Item_Doctor_Mapping_Link`, data)
        .then((res) => {
          const reste = res.data;
          const typp = Object.keys(reste)[0];
          const mess = Object.values(reste)[0];
          const tdata = {
            message: mess,
            type: typp,
          };
          dispatchvalue({ type: 'toast', value: tdata });
          setIsItemDoctorGet((prev) => !prev);
          setItemMap({
            doctorname: '',
            doctorid: '',
            itemcode: '',
            itemname: '',
            Itemmapcode: '',
          });
          setMappedItems([]);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const tdata = {
        message: 'Please provide the ItemName .',
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
    }
  };

  useEffect(() => {
    axios
      .get(`${UrlLink}Inventory/Item_Doctor_Mapping_Link`)
      .then((response) => {
        console.log('--------', response.data);
        setResss(Array.isArray(response.data) ? response.data : []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, IsItemDoctorGet]);
  const [ViewDoctors, setViewDoctors] = useState([]);
  const [selectedrow, setSelectedRow] = useState(false);

  const handleviewDoctors = (params) => {
    if (params.doctors.length > 0) {
      setViewDoctors(params?.doctors);
      setSelectedRow(true);
    } else {
      const tdata = {
        message: 'There is no data to view.',
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
    }
  };

  
  const handleEdit = (row) => {
    console.log("Editing Row:", row);
  
    if (!row || typeof row !== "object") {
      console.warn("Invalid row data for editing.");
      return;
    }
  
    const { itemcode, itemname, doctors = [] } = row;
  
    setMappedItems([{ ...row, doctors: Array.isArray(doctors) ? doctors : [] }]);
  
    setItemMap({
      itemcode,
      itemname,
      Itemmapcode: row.id, 
    });
  };
  
  const FinalColumns = [
    {
      key: 'id',
      name: 'S.No',
    },
    {
      key: 'itemcode',
      name: 'Item Code',
    },
    {
      key: 'itemname',
      name: 'Item Name',
    },
    {
      key: 'doctors',
      name: 'View Doctors',
      renderCell: (params) => (
        <Button
          className="cell_btn"
          onClick={() => handleviewDoctors(params.row)}
        >
          <VisibilityIcon className="check_box_clrr_cancell" />
        </Button>
      ),
    },
    {
      key: 'Action',
      name: 'Action',
      renderCell: (params) => (
        <Button className="cell_btn" onClick={() => handleEdit(params.row)}>
          <EditIcon className="check_box_clrr_cancell" />
        </Button>
      ),
    },
  ];
  const viewColumns = [
    {
      key: 'doctorid',
      name: 'Doctor Id',
    },
    {
      key: 'doctorname',
      name: 'Doctor Name',
    },
  ];

  return (
    <>
      <div className="Main_container_app">
        <div className="common_center_tag">
          <span>Item Name Mapping Multiple Doctors</span>
        </div>
        <div className="RegisFormcon_1">
          {/* Item Name Selection */}
          <div className="RegisForm_1">
            <label>
              Item Name<span>:</span>
            </label>
            <input
              type="text"
              list="itemnames"
              id="itemname"
              value={ItemMap.itemname}
              autoComplete="off"
              onChange={handleChange}
            />
            <datalist id="itemnames">
              {ItemNames.map((item, index) => (
                <option key={`${index}_item`} value={item.itemname} />
              ))}
            </datalist>
          </div>

          {/* Doctor Name Selection */}
          <div className="RegisForm_1">
            <label>
              Doctor Name<span>:</span>
            </label>
            <input
              type="text"
              list="doctornames"
              id="doctorname"
              value={ItemMap.doctorname}
              autoComplete="off"
              onChange={handleChange}
            />
            <datalist id="doctornames">
              {Doctors.map((doctor, index) => (
                <option key={`${index}_doctor`} value={doctor.doctorname} />
              ))}
            </datalist>
          </div>
          <div className="Search_patient_icons">
            <AddBoxIcon onClick={handleAdd} />
          </div>
        </div>

        {MappedItems && MappedItems.length > 0 && (
          <ReactGrid
            columns={MappedItemsColumns}
            RowData={MappedItems.flatMap((item) =>
              item.doctors.map((doctor, index) => ({
                id: `${index + 1}`, // Unique ID per row
                doctorid: doctor.doctorid,
                doctorname: doctor.doctorname,
              }))
            )}
          />
        )}

        <div className="Main_container_Btn">
          <button onClick={handleSubmit}>
            {ItemMap.Itemmapcode ? 'Update' : 'Save'}
          </button>
        </div>
        <br></br>
        {Resss.length > 0 && (
          <ReactGrid columns={FinalColumns} RowData={Resss} />
        )}
        {selectedrow && (
          <div className="loader" onClick={() => setSelectedRow(false)}>
            <div
              className="loader_register_roomshow"
              onClick={(e) => e.stopPropagation()}
            >
              {ViewDoctors.length > 0 && (
                <div>
                  <div className="common_center_tag">
                    <span>Doctor Names</span>
                  </div>
                  <br />
                  <div className="Main_container_app">
                    <ReactGrid columns={viewColumns} RowData={ViewDoctors} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <ModelContainer />
        <ToastAlert Message={toast.message} Type={toast.type} />
      </div>
    </>
  );
};

export default DoctorItemMapping;
