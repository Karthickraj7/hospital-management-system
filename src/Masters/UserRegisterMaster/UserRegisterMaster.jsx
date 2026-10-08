import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const UserRegisterMaster = () => {
  const UrlLink = useSelector(state => state.userRecord?.UrlLink);
  const userRecord = useSelector(state => state.userRecord?.UserData);
  const toast = useSelector(state => state.userRecord?.toast);
  const UserListId = useSelector(state => state.userRecord?.UserListId);
  const Usercreatedocdata = useSelector(state => state.userRecord?.Usercreatedocdata);
  const UsercreateEmpdata = useSelector(state => state.userRecord?.UsercreateEmpdata);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log('UsercreateEmpdata---999', UsercreateEmpdata);
  console.log('UserListId---999', UserListId);


  const [UserRegister, setUserRegister] = useState({
    UserId: '',
    EmployeeType: '',
    DoctorId: '',
    EmployeeId: '',
    Title: '',
    firstName: '',
    middleName: '',
    lastName: '',
    Email: '',
    PhoneNo: '',
    Gender: '',
    Qualification: '',
    UserName: '',
    Password: '',
    roleName: '',


  });


  const [permissions, setPermissions] = useState({
    create: false,
    edit: false,
    delete: false,
    read: false,
  });

  const [UserRegistershow, setUserRegistershow] = useState([])
  const [RoleNameData, setRoleNameData] = useState([]);

  const [InventoryLocations, setInventoryLocations] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedStoreIds, setSelectedStoreIds] = useState([]);

  const [LabDepartment, setLabDepartment] = useState([]);
  const [userAccessLabCodes, setUserAccessLabCodes] = useState([]);

  const [ProductCategory, setProductCategory] = useState([])
  const [SubCategory, setSubCategory] = useState([])
  const [SelectedProductCatg, setSelectedProductCatg] = useState([]);
  const [SelectedSubCategories, setSelectedSubCategories] = useState([]);



  const [AssetCategories, setAssetCategories] = useState([]);
  const [SelectedAssetCategories, setSelectedAssetCategories] = useState([]);


  console.log(InventoryLocations, 'InventoryLocations');
  console.log(LabDepartment, 'LabDepartment');
  console.log(selectedTypes, 'selectedTypes');
  console.log(selectedStoreIds, 'selectedStoreIds');
  console.log(ProductCategory, 'ProductCategory');
  console.log(SubCategory, 'SubCategory');
  console.log(SelectedProductCatg, 'SelectedProductCatg');
  console.log(SelectedSubCategories, 'SelectedSubCategories');


  useEffect(() => {
    if (userRecord) {
      axios
        .get(`${UrlLink}AccetCategory/asset_categories_list/`, {
          withCredentials: true,
        })
        .then((res) => {
          const ress = res.data;
          setAssetCategories(ress);
          console.log('asset_categories_list:', ress);
        })
        .catch((err) => {
          console.error('Error fetching asset categories:', err);
          dispatch({
            type: 'toast',
            value: {
              message: err.response?.data?.error || 'Failed to fetch asset categories',
              type: 'error',
            },
          });
        });
    }
  }, [UrlLink, userRecord, dispatch]);


  useEffect(() => {
    axios.get(`${UrlLink}Masters/UserControl_Role_link`)
      .then((res) => {
        const ress = res.data;
        setRoleNameData(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);


  useEffect(() => {
    axios.get(`${UrlLink}Masters/Inventory_Master_Detials_link`)
      .then((res) => {
        const ress = res.data;
        console.log(ress, 'ress--');

        setInventoryLocations(ress);
      })
      .catch((err) => {
        console.log(err)
      })

  }, [UrlLink])



  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=LabSubDepartment`)
      .then((response) => {
        const data = response.data;

        // Add IsChecked to each item
        const updatedData = data.map(item => ({
          ...item,
          IsChecked: false // or true based on logic
        }));

        setLabDepartment(updatedData);
      })
      .catch((error) => {
        console.error("Error fetching SubDepartment data:", error);
      });
  }, [UrlLink]);



  const storeTypes = [...new Set(InventoryLocations.map(store => store.StoreType))];

  const toggleStore = (storeId, storeType) => {
    setSelectedStoreIds(prev => {
      const isSelected = prev.includes(storeId);
      const updatedStoreIds = isSelected
        ? prev.filter(id => id !== storeId)
        : [...prev, storeId];

      // After updating storeIds, check how many stores of this type are selected
      const storesOfThisType = InventoryLocations.filter(s => s.StoreType === storeType).map(s => s.id);
      const areAllStoresSelected = storesOfThisType.every(id => updatedStoreIds.includes(id));

      setSelectedTypes(prevTypes => {
        if (areAllStoresSelected) {
          return [...new Set([...prevTypes, storeType])];
        } else {
          return prevTypes.filter(type => type !== storeType);
        }
      });

      return updatedStoreIds;
    });
  };



  const toggleStoreType = (type) => {
    const matchedStores = InventoryLocations.filter(store => store.StoreType === type);
    const matchedIds = matchedStores.map(store => store.id);

    const isTypeSelected = selectedTypes.includes(type);

    if (isTypeSelected) {
      // Uncheck type and remove its store ids
      setSelectedTypes(prev => prev.filter(t => t !== type));
      setSelectedStoreIds(prev => prev.filter(id => !matchedIds.includes(id)));
    } else {
      // Check type and add its store ids
      setSelectedTypes(prev => [...prev, type]);
      setSelectedStoreIds(prev => [...new Set([...prev, ...matchedIds])]);
    }
  };

  const toggleAssetCategory = (categoryId) => {
    const id = Number(categoryId);
    console.log("Toggling Asset Category:", id);
    setSelectedAssetCategories((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };





  useEffect(() => {
    axios.get(`${UrlLink}Inventory/Product_Category_Product_Details_link`)
      .then((res) => {
        const ress = res.data;
        setProductCategory(ress);
      })
      .catch((err) => {
        console.log(err)
      })

  }, [UrlLink])



  // const toggleProductCategory = (categoryId) => {
  //   console.log('Toggling Category:', categoryId); // ✅
  //   setSelectedProductCatg((prevSelected) => {
  //     const updated = prevSelected.includes(categoryId)
  //       ? prevSelected.filter((id) => id !== categoryId)
  //       : [...prevSelected, categoryId];
  //     console.log('Updated SelectedProductCatg:', updated); // ✅
  //     return updated;
  //   });
  // };

  // const toggleSubCategory = (subId) => {
  //   console.log('Toggling SubCategory:', subId); // ✅
  //   setSelectedSubCategories((prevSelected) => {
  //     const updated = prevSelected.includes(subId)
  //       ? prevSelected.filter((id) => id !== subId)
  //       : [...prevSelected, subId];
  //     console.log('Updated SelectedSubCategories:', updated); // ✅
  //     return updated;
  //   });
  // };



  const toggleProductCategory = (categoryId) => {
    const id = Number(categoryId);
    console.log("Toggling Product Category:", id);
    setSelectedProductCatg((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const toggleSubCategory = (subId) => {
    const id = Number(subId);
    console.log("Toggling SubCategory:", id);
    setSelectedSubCategories((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };


  useEffect(() => {
    console.log(SelectedProductCatg, 'SelectedProductCatg------')
    if (SelectedProductCatg?.length > 0) {
      const query = SelectedProductCatg.join(","); // JOIN to comma-separated string
      axios
        .get(`${UrlLink}Masters/get_subcategories?ProductCategory=${query}`)
        .then((res) => {
          const data = res.data;
          setSubCategory(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          console.log(err);
          setSubCategory([]);
        });
    } else {
      setSubCategory([]);
    }
  }, [UrlLink, SelectedProductCatg]);



  const handleCheckboxChange = (code) => {
    if (code === 'ALL') {
      const isChecked = !LabDepartment.every(item => item.IsChecked);
      const updatedList = LabDepartment.map(item => ({
        ...item,
        IsChecked: isChecked
      }));
      setLabDepartment(updatedList);

      // Log only checked items
      console.log(updatedList.filter(item => item.IsChecked), 'Checked Items (after ALL toggle)');
    } else {
      const updatedList = LabDepartment.map(item =>
        item.SubDepartment_Code === code
          ? { ...item, IsChecked: !item.IsChecked }
          : item
      );

      setLabDepartment(updatedList);

      // Log only checked items
      console.log(updatedList.filter(item => item.IsChecked), 'Checked Items (after individual toggle)');
    }
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserRegister((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };



  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setPermissions((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };





  const [checkedItems, setCheckedItems] = useState([
 
    {
      key: '1',
      value: 'A',
      label: 'FrontOffice',
      check: false,
      children: [
        { key: '1-1', value: 'A1-1', label: 'Dashboard', check: false },
        { key: '1-2', value: 'A1-2', label: 'AppointmentRequestList', check: false },
        { key: '1-3', value: 'A1-3', label: 'NewBasicRegistation', check: false },
        { key: '1-4', value: 'A1-4', label: 'OPVisitEntry', check: false },
        { key: '1-5', value: 'A1-5', label: 'IPRegistration', check: false },
      
        { key: '1-7', value: 'A1-7', label: 'PatientRegisterList', check: false },
        { key: '1-8', value: 'A1-8', label: 'GeneralBilling', check: false },
        { key: '1-9', value: 'A1-9', label: 'OPDQueueList', check: false },
      
        { key: '1-11', value: 'A1-11', label: 'PatientManagement', check: false },
        { key: '1-12', value: 'A1-12', label: 'IPRequestList', check: false },
        { key: '1-13', value: 'A1-13', label: 'DoctorScheduleCalendar', check: false },
        { key: '1-14', value: 'A1-14', label: 'PatientReports', check: false },
      
        { key: '1-18', value: 'A1-18', label: 'SelfRegistration', check: false },
     
        { key: '1-20', value: 'A1-20', label: 'PatientRegistration', check: false },
        { key: '1-21', value: 'A1-21', label: 'GeneralBillingList', check: false },
        { key: '1-22', value: 'A1-22', label: 'RadiologyBilling', check: false },
        { key: '1-23', value: 'A1-23', label: 'LabBilling', check: false },
        { key: '1-24', value: 'A1-24', label: 'EmgToIprequestlist', check: false },
        { key: '1-25', value: 'A1-25', label: 'GoogleStyleCalendar', check: false },
        { key: '1-26', value: 'A1-26', label: 'OpReferalDoctorPatient', check: false },

        { key: '1-28', value: 'A1-28', label: 'IPDischargePatientDiagnosis', check: false },
        { key: '1-29', value: 'A1-29', label: 'MedicalDiagnosisReport', check: false },


      ]
    },
    {
      key: '2',
      value: 'B',
      label: 'OPD_Reception',
      check: false,
      children: [
        { key: '2-1', value: 'B2-1', label: 'OP_patients', check: false },
        { key: '2-2', value: 'B2-2', label: 'DoctorDashboard', check: false }
      
      ]
    },
    {
      key: '3',
      value: 'C',
      label: 'Nurse',
      check: false,
      children: [
        { key: '3-1', value: 'C3-1', label: 'PatientQuelist', check: false },
        { key: '3-2', value: 'C3-2', label: 'BirthRegisterList', check: false },
        { key: '3-3', value: 'C3-3', label: 'DeathRegisterList', check: false },
        { key: '3-4', value: 'C3-4', label: 'OpNurse_WorkbenchNavigation', check: false },
        { key: '3-5', value: 'C3-5', label: 'IP_NurseWorkbenchNavigation', check: false },
      ]
    },
    {
      key: '4',
      value: 'D',
      label: 'Doctor',
      check: false,
      children: [
        { key: '4-1', value: 'D4-1', label: 'Doctordashboard', check: false },
        { key: '4-2', value: 'D4-2', label: 'PatientQuelist', check: false },
        { key: '4-3', value: 'D4-3', label: 'SpecialityWiseDoctorPatientList', check: false },
    
      ]
    },

    {
      key: '5',
      value: 'E',
      label: 'WardManagement',
      check: false,
      children: [
        { key: '5-1', value: 'E5-1', label: 'Warddashboard', check: false },
        { key: '5-2', value: 'E5-2', label: 'IPHandOverList', check: false },
        { key: '5-3', value: 'E5-3', label: 'RoomMangement', check: false },
        { key: '5-4', value: 'E5-4', label: 'IPQueList', check: false },
      ]
    },


    {
      key: '6',
      value: 'F',
      label: 'NurseStation',
      check: false,
      children: [
        { key: '6-1', value: 'F6-1', label: 'NurseStationPations', check: false },
        { key: '6-2', value: 'F6-2', label: 'StockNurseStation', check: false },
        { key: '6-3', value: 'F6-3', label: 'DrugAdministrationNurseStation', check: false },
        { key: '6-4', value: 'F6-4', label: 'NurseStationPationsRequst', check: false },
        { key: '6-5', value: 'F6-5', label: 'NSAssets', check: false },
        { key: '6-6', value: 'F6-6', label: 'IpHandoverQuelist', check: false },
       

      ]
    },


    {
      key: '7',
      value: 'G',
      label: 'OTManagement',
      check: false,
      children: [
        { key: '7-1', value: 'G7-1', label: 'OtMaster', check: false },
        { key: '7-2', value: 'G7-2', label: 'NewOTBook', check: false },
        { key: '7-3', value: 'G7-3', label: 'OtQuelist', check: false },
        { key: '7-4', value: 'G7-4', label: 'SurgicalTeam', check: false },
        { key: '7-5', value: 'G7-5', label: 'Doctor_OueueList', check: false },
        { key: '7-6', value: 'G7-6', label: 'OtDoctorNavigation', check: false },
        { key: '7-7', value: 'G7-7', label: 'OtAnaesthesiaQueueList', check: false },
        { key: '7-8', value: 'G7-8', label: 'OT_Anaesthesia', check: false },
        { key: '7-9', value: 'G7-9', label: 'OtNurseQueList', check: false },
        { key: '7-10', value: 'G7-10', label: 'OT_Nurse', check: false },
        { key: '7-11', value: 'G7-11', label: 'OtCharges', check: false },
        { key: '7-12', value: 'G7-12', label: 'OTReports', check: false },
        { key: '7-13', value: 'G7-13', label: 'OTCompletelist', check: false },

      ]
    },




    {
      key: '8',
      value: 'H',
      label: 'Pharmacy',
      check: false,
      children: [
        { key: '8-1', value: 'H8-1', label: 'OPPharmachyBillingList', check: false },
        { key: '8-2', value: 'H8-2', label: 'PharmacyDueBillingLIst', check: false },
        { key: '8-3', value: 'H8-3', label: 'PharmacyRefundBillingLIst', check: false },
        { key: '8-4', value: 'H8-4', label: 'IPPharmacyBillingList', check: false },
        { key: '8-5', value: 'H8-5', label: 'IPPharmacyDueBillingList', check: false },
        { key: '8-6', value: 'H8-6', label: 'IPPharmacyRefundBillingList', check: false },
        { key: '8-7', value: 'H8-7', label: 'PharmacyWalkinQue', check: false },
        { key: '8-8', value: 'H8-8', label: 'FOCPharmacyBillingLIst', check: false },
        { key: '8-9', value: 'H8-9', label: 'FOCPharmacyRefundBillingList', check: false },
        { key: '8-10', value: 'H8-10', label: 'IP_PharmacyDischargeQueslist', check: false },
        { key: '8-11', value: 'H8-11', label: 'Walkinbilling', check: false },
        { key: '8-12', value: 'H8-12', label: 'IPAmountCollectionList', check: false },
        { key: '8-13', value: 'H8-13', label: 'PharmacyWiseBillReport', check: false },
        { key: '8-14', value: 'H8-14', label: 'UserWisePharmacyBillReport', check: false },
        { key: '8-15', value: 'H8-15', label: 'CalendarWiseReport', check: false },
        { key: '8-16', value: 'H8-16', label: 'ShiftClosingReport', check: false },
        { key: '8-17', value: 'H8-17', label: 'OPPharm', check: false },
        { key: '8-18', value: 'H8-18', label: 'IPPharm', check: false },
        { key: '8-19', value: 'H8-19', label: 'FOCPharm', check: false },
        { key: '8-20', value: 'H8-20', label: 'OPAmountCollectionList', check: false },


      ]
    },

    {
      key: '9',
      value: 'I',
      label: 'Cashier',
      check: false,
      children: [
        { key: '9-1', value: 'I9-1', label: 'GeneralBillingListConsultationCashier', check: false },
        { key: '9-2', value: 'I9-2', label: 'GeneralBillingListCashier', check: false },
        { key: '9-3', value: 'I9-3', label: 'GeneralBillingDueList', check: false },
        { key: '9-4', value: 'I9-4', label: 'GeneralBillingCancelList', check: false },
        { key: '9-5', value: 'I9-5', label: 'GeneralBillingRefundRequestList', check: false },
        { key: '9-6', value: 'I9-6', label: 'GeneralBillingRefundList', check: false },
        { key: '9-7', value: 'I9-7', label: 'GeneralBillingEditList', check: false },
        { key: '9-8', value: 'I9-8', label: 'IPBillingList', check: false },
        { key: '9-9', value: 'I9-9', label: 'IPBillingEstimatedList', check: false },
        { key: '9-10', value: 'I9-10', label: 'IPBillingEstimatedApproveList', check: false },
        { key: '9-11', value: 'I9-11', label: 'IPBillingFinalList', check: false },
        { key: '9-12', value: 'I9-12', label: 'IPBillingDueList', check: false },
        { key: '9-13', value: 'I9-13', label: 'IPBillingRefundRequestList', check: false },
        { key: '9-14', value: 'I9-14', label: 'IPBillingRefundApprovalList', check: false },
        { key: '9-15', value: 'I9-15', label: 'IPBillingEditList', check: false },
        { key: '9-16', value: 'I9-16', label: 'IP_BillingDischargeQueslist', check: false },
        { key: '9-17', value: 'I9-17', label: 'AdvanceCollectionList', check: false },
        { key: '9-18', value: 'I9-18', label: 'AdvanceRefundList', check: false },
        { key: '9-19', value: 'I9-19', label: 'PatientLedgerList', check: false },
        { key: '9-20', value: 'I9-20', label: 'EstimatedBillReport', check: false },
        { key: '9-21', value: 'I9-21', label: 'IPBillingReport', check: false },
        { key: '9-22', value: 'I9-22', label: 'FrontofficeexpensesList', check: false },
        // { key: '9-23', value: 'I9-23', label: 'DayCloseingList', check: false },
        { key: '9-23', value: 'I9-23', label: 'ShiftCloseingList', check: false },
        { key: '9-24', value: 'I9-24', label: 'UserWiseBillReport', check: false },
        { key: '9-25', value: 'I9-25', label: 'PatientBillview', check: false },
        { key: '9-26', value: 'I9-26', label: 'AdvanceReprintList', check: false },
        { key: '9-27', value: 'I9-27', label: 'OutStandingCreditList', check: false },
        { key: '9-28', value: 'I9-28', label: 'OpticalAmountCollectionlist', check: false },

      ]
    },
 

    {
      key: '10',
      value: 'J',
      label: 'Insurance',
      check: false,
      children: [
        { key: '10-1', value: 'J10-1', label: 'InsuranceDashboard', check: false },
        { key: '10-2', value: 'J10-2', label: 'ClientDashboard', check: false },

      ]
    },


    // {
    //   key: '11',
    //   value: 'K',
    //   label: 'CRMdashboard',
    //   check: false,
    //   children: [
    //     { key: '11-1', value: 'k11-1', label: 'Opfollowup', check: false },
    //     { key: '11-2', value: 'k11-2', label: 'IPfollowup', check: false },
    //     { key: '11-3', value: 'k11-3', label: 'Discharge', check: false },
    //     { key: '11-4', value: 'k11-4', label: 'Therapy', check: false },
    //     { key: '11-5', value: 'k11-5', label: 'Labque', check: false },
    //     { key: '11-6', value: 'k11-6', label: 'Radiologyque', check: false },

    //   ]
    // },


    {
      key: '12',
      value: 'L',
      label: 'Lab',
      check: false,
      children: [
        { key: '12-1', value: 'L12-1', label: 'Phelobotomist', check: false },
        { key: '12-2', value: 'L12-2', label: 'LabTechnician', check: false },
        { key: '12-3', value: 'L12-3', label: 'SrTechnician', check: false },
        { key: '12-4', value: 'L12-4', label: 'Pathologist', check: false },
        { key: '12-5', value: 'L12-5', label: 'Dispatch', check: false },
        { key: '12-6', value: 'L12-6', label: 'IP_LabDischargeQueslist', check: false },
        { key: '12-7', value: 'L12-7', label: 'LabTestCount', check: false },
        { key: '12-8', value: 'L12-8', label: 'Patienttestlist', check: false },


      ]
    },

    {
      key: '13',
      value: 'M',
      label: 'Radiology',
      check: false,
      children: [
        { key: '13-1', value: 'M13-1', label: 'RadiologyQuelist', check: false },
        { key: '13-2', value: 'M13-2', label: 'Mritechnician', check: false },
        { key: '13-3', value: 'M13-3', label: 'Cttechnician', check: false },
        { key: '13-4', value: 'M13-4', label: 'XRayTechnician', check: false },
        { key: '13-5', value: 'M13-5', label: 'UsgTechnician', check: false },
        { key: '13-6', value: 'M13-6', label: 'IP_RadiologyDischargeQueslist', check: false },
        { key: '13-7', value: 'M13-7', label: 'Radiologistdoctor', check: false },
        { key: '13-8', value: 'M13-8', label: 'Dispatch', check: false },
          { key: '13-9', value: 'M13-9', label: 'RadiologyReports', check: false },
      ]
    },

    {
      key: '14',
      value: 'N',
      label: 'Therapy',
      check: false,
      children: [
        { key: '14-1', value: 'N14-1', label: 'RadiologyQuelist', check: false },

      ]
    },
    {
      key: '15',
      value: 'O',
      label: 'Master',
      check: false,
      children: [
        { key: '15-1', value: 'O15-1', label: 'HospitalClinicMaster', check: false },
        // { key: '15-2', value: 'O15-2', label: 'DutyRousterMaster'        , check: false },
        { key: '15-3', value: 'O15-3', label: 'ConsentFormsMaster', check: false },
        { key: '15-4', value: 'O15-4', label: 'RoomMaster', check: false },
        { key: '15-5', value: 'O15-5', label: 'Referal_Route', check: false },
        { key: '15-6', value: 'O15-6', label: 'DoctorList', check: false },
        { key: '15-7', value: 'O15-7', label: 'Basic_Master', check: false },
        { key: '15-8', value: 'O15-8', label: 'OtMaster', check: false },
        { key: '15-9', value: 'O15-9', label: 'AnaesthesiaMaster', check: false },
        { key: '15-10', value: 'O15-10', label: 'UserRegisterList', check: false },
        { key: '15-11', value: 'O15-11', label: 'InsClientDonationList', check: false },
        { key: '15-12', value: 'O15-12', label: 'ServiceProcedureMasterList', check: false },
        { key: '15-13', value: 'O15-13', label: 'Servicecategory', check: false },
        { key: '15-14', value: 'O15-14', label: 'ServiceSubCategory', check: false },
        { key: '15-15', value: 'O15-15', label: 'Radiology_Master', check: false },
        { key: '15-16', value: 'O15-16', label: 'Lab_Master', check: false },
        { key: '15-17', value: 'O15-17', label: 'Surgery_Master', check: false },
        { key: '15-18', value: 'O15-18', label: 'FrequencyMaster', check: false },
        { key: '15-19', value: 'O15-19', label: 'apprenewal', check: false },
        { key: '15-20', value: 'O15-20', label: 'LocationMaster', check: false },
        { key: '15-21', value: 'O15-21', label: 'TherapyMaster', check: false },
        { key: '15-22', value: 'O15-22', label: 'RatecardMaster', check: false },
        { key: '15-23', value: 'O15-23', label: 'ICDCodeMaster', check: false },
        { key: '15-24', value: 'O15-24', label: 'NurseStationMaser', check: false },
        { key: '15-25', value: 'O15-25', label: 'PackageMaster', check: false },
        { key: '15-26', value: 'O15-26', label: 'VentilatorType', check: false },
        { key: '15-27', value: 'O15-27', label: 'GeneralEvaluationMaster', check: false },
        { key: '15-28', value: 'O15-28', label: 'DiscountMaster', check: false },
        { key: '15-29', value: 'O15-29', label: 'PatientDetailsMaster', check: false },
        { key: '15-30', value: 'O15-30', label: 'PurchaseReports', check: false },
        { key: '15-31', value: 'O15-31', label: 'Grnreports', check: false },
        { key: '15-32', value: 'O15-32', label: 'IndentReports', check: false },
      ]
    },

    {
      key: '16',
      value: 'P',
      label: 'Inventory',
      check: false,
      children: [
        { key: '16-1', value: 'P16-1', label: 'InventoryLocation', check: false },
        { key: '16-2', value: 'P16-2', label: 'Medicine_rack_Master', check: false },
        { key: '16-3', value: 'P16-3', label: 'TrayManagementList', check: false },
        { key: '16-4', value: 'P16-4', label: 'Productcategory', check: false },
        { key: '16-5', value: 'P16-5', label: 'InventorySubMasters', check: false },
        { key: '16-6', value: 'P16-6', label: 'ProductMasterList', check: false },
        { key: '16-7', value: 'P16-7', label: 'SupplierMasterList', check: false },
        { key: '16-8', value: 'P16-8', label: 'PurchaseOrderList', check: false },
        { key: '16-9', value: 'P16-9', label: 'ItemwisePurchaseOrder', check: false },
        { key: '16-10', value: 'P16-10', label: 'GoodsReceiptNoteList', check: false },
        { key: '16-11', value: 'P16-11', label: 'QuickGoodsRecieptNote', check: false },
        { key: '16-12', value: 'P16-12', label: 'PurchaseReturnList', check: false },
        { key: '16-13', value: 'P16-13', label: 'OldGrnQueList', check: false },
        { key: '16-14', value: 'P16-14', label: 'IndentRaiseList', check: false },
        { key: '16-15', value: 'P16-15', label: 'IndentIssueList', check: false },
        { key: '16-16', value: 'P16-16', label: 'IndentRecieveList', check: false },
        { key: '16-17', value: 'P16-17', label: 'SerialNoQuelist', check: false },
        { key: '16-18', value: 'P16-18', label: 'SerialNoReport', check: false },
        { key: '16-19', value: 'P16-19', label: 'ItemMinimumMaximum', check: false },
        { key: '16-20', value: 'P16-20', label: 'SupplierPayList', check: false },
        { key: '16-21', value: 'P16-21', label: 'SupplierPaidList', check: false },
        { key: '16-22', value: 'P16-22', label: 'StockList', check: false },
        { key: '16-23', value: 'P16-23', label: 'MedicalStockInsertmaster', check: false },
        { key: '16-24', value: 'P16-24', label: 'MedicalRepMaster', check: false },
        { key: '16-25', value: 'P16-25', label: 'ExpiryReport', check: false },
        { key: '16-26', value: 'P16-26', label: 'DummyBillingPrint', check: false },
        { key: '16-27', value: 'P16-27', label: 'MinItemPurchaseOrder', check: false },
        { key: '16-28', value: 'P16-28', label: 'PurchaseReport', check: false },
        { key: '16-29', value: 'P16-29', label: 'BarcodeForGrnItems', check: false },
        { key: '16-30', value: 'P16-30', label: 'PurchaseReturnReport', check: false },
        { key: '16-31', value: 'P16-31', label: 'DoctorItemMapping', check: false },
        { key: '16-32', value: 'P16-32', label: 'StockEvaluationReport', check: false },
        { key: '16-33', value: 'P16-33', label: 'StockMovementReport', check: false },
        { key: '16-34', value: 'P16-34', label: 'ReorderLevelReport', check: false },
        { key: '16-35', value: 'P16-35', label: 'StockAdjustment', check: false },
        { key: '16-36', value: 'P16-36', label: 'OpeningClosingBalance', check: false },
        { key: '16-37', value: 'P16-37', label: 'PurchaseApprove', check: false },
        { key: '16-38', value: 'P16-38', label: 'GrnApprove', check: false },
        { key: '16-40', value: 'P16-40', label: 'AvailableQuantityReport', check: false },
        { key: '16-41', value: 'P16-41', label: 'AccountsReport', check: false },
        { key: '16-42', value: 'P16-42', label: 'StockMaintenanceList', check: false },
        { key: '16-43', value: 'P16-43', label: 'StockEdit', check: false },
        { key: '16-44', value: 'P16-44', label: 'DetailedGSTReport', check: false },
        { key: '16-45', value: 'P16-45', label: 'GoodsReceiptNoteOpticalList', check: false },
        { key: '16-46', value: 'P16-46', label: 'QuickGoodsRecieptNoteOptical', check: false },
        { key: '16-47', value: 'P16-47', label: 'SupplierMasterListOptical', check: false },
        { key: '16-48', value: 'P16-48', label: 'ProductMasterListOptical', check: false },
        { key: '16-49', value: 'P16-49', label: 'GrnApproveOptical', check: false },
        { key: '16-50', value: 'P16-50', label: 'StockEditOptical', check: false },
        { key: '16-50', value: 'P16-50', label: 'OpticalBilling', check: false },
        { key: '16-51', value: 'P16-51', label: 'GENQuickGoodReceiptNote', check: false },
        { key: '16-52', value: 'P16-52', label: 'GoodsReceiptNoteListGEN', check: false },
        { key: '16-53', value: 'P16-53', label: 'GrnApproveGEN', check: false },
        { key: '16-54', value: 'P16-54', label: 'SupplierMasterListGEN', check: false },
        { key: '16-55', value: 'P16-55', label: 'ProductMasterListGEN', check: false },
        { key: '16-56', value: 'P16-56', label: 'GENGrnreports', check: false },
      
      

      ]
    },






    {
      key: '17',
      value: 'Q',
      label: 'AssetDashboard',
      check: false,
      children: [
        { key: '17-1', value: 'Q17-1', label: 'AssetCategories', check: false },
        { key: '17-2', value: 'Q17-2', label: 'AssetSubCategoryManagement', check: false },
        { key: '17-3', value: 'Q17-3', label: 'Suppliers', check: false },
        { key: '17-4', value: 'Q17-4', label: 'ServiceProviderMangement', check: false },
        { key: '17-5', value: 'Q17-5', label: 'ChecklistMasterEntry', check: false },
        { key: '17-6', value: 'Q17-6', label: 'ChecklistManagement', check: false },
        { key: '17-7', value: 'Q17-7', label: 'AssetManagement', check: false },
        { key: '17-8', value: 'Q17-8', label: 'AssetDocumentsupload', check: false },
        { key: '17-9', value: 'Q17-9', label: 'AssetAMC', check: false },
        { key: '17-10', value: 'Q17-10', label: 'Maintenance', check: false },
        { key: '17-11', value: 'Q17-11', label: 'BreakageForm', check: false },
        { key: '17-12', value: 'Q17-12', label: 'InsuranceRegistration', check: false },
        { key: '17-13', value: 'Q17-13', label: 'AssetMovement', check: false },
        { key: '17-14', value: 'Q17-14', label: 'AssetOutsideMovement', check: false },
        { key: '17-15', value: 'Q17-15', label: 'ScrapAsset', check: false },
        { key: '17-16', value: 'Q17-16', label: 'AssetDisposal', check: false },
        // { key: '17-10', value: 'Q17-10', label: '', check: false },


      ]
    },
    {
      key: '18',
      value: 'R',
      label: 'Lenin',
      check: false,
      children: [
        { key: '18-1', value: 'R18-1', label: 'LeninMaster', check: false },
        { key: '18-2', value: 'R18-2', label: 'Lenin_DeptWise_MinMax', check: false },
        { key: '18-3', value: 'R18-3', label: 'Lenin_Stock', check: false }
      ]
    },



    {
      key: '19',
      value: 'S',
      label: 'Finance',
      check: false,
      children: [
        { key: '19-1', value: 'S19-1', label: 'FinanceMasterList', check: false },
        { key: '19-2', value: 'S19-2', label: 'VouchersList', check: false },
        { key: '19-3', value: 'S19-3', label: 'DayBook', check: false },
        { key: '19-4', value: 'S19-4', label: 'CashBook', check: false },
        { key: '19-5', value: 'S19-5', label: 'TrialBalance', check: false },
        { key: '19-6', value: 'S19-6', label: 'ProfitandLoss', check: false },
        { key: '19-7', value: 'S19-7', label: 'BalanceSheet', check: false },

      ]
    },



    {
      key: '20',
      value: 'T',
      label: 'HR',
      check: false,
      children: [
        { key: '20-1', value: 'T20-1', label: 'EmployeeRegistrationList', check: false },
        { key: '20-2', value: 'T20-2', label: 'DutyRosterMasterList', check: false },
        { key: '20-3', value: 'T20-3', label: 'NurseMappingToNurseStation', check: false },
        { key: '20-4', value: 'T20-4', label: 'ShiftManagement', check: false },
        { key: '20-5', value: 'T20-5', label: 'EmployeeMaster', check: false },
        { key: '20-6', value: 'T20-6', label: 'ShiftApproval', check: false },
        { key: '20-7', value: 'T20-7', label: 'LeaveMangement', check: false },
        { key: '20-8', value: 'T20-8', label: 'AdvanceManagementNavigation', check: false },
        { key: '20-9', value: 'T20-9', label: 'Attendance', check: false },
        { key: '20-10', value: 'T20-10', label: 'PayRoll', check: false },
        { key: '20-11', value: 'T20-11', label: 'EmployeeReport', check: false },
        { key: '20-12', value: 'T20-12', label: 'JobRequirements', check: false },
        { key: '20-13', value: 'T20-13', label: 'EmployeeSourceWiseList', check: false },
        { key: '20-14', value: 'T20-14', label: 'Performance', check: false },
        { key: '20-15', value: 'T20-15', label: 'ComplaintAction', check: false },
        { key: '20-16', value: 'T20-16', label: 'Circular', check: false },
        { Key: '20-17', value: 'T20-17', label: 'TraineeRegistrationList', check: false },
        { Key: '20-18', value: 'T20-18', label: 'LeaveMaster', check: false },
        { Key: '20-19', value: 'T20-19', label: 'AllowanceMaster', check: false },
        { Key: '20-20', value: 'T20-20', label: 'DeductionMaster', check: false },
        { Key: '20-21', value: 'T20-21', label: 'EmployeeMapping', check: false },
          { Key: '20-22', value: 'T20-22', label: 'OverTimeManagement', check: false },
        { Key: '20-23', value: 'T20-23', label: 'OtAssignedTable', check: false },
        { Key: '20-24', value: 'T20-24', label: 'PayRollReport', check: false },
        { Key: '20-25', value: 'T20-25', label: 'AttendanceReport', check: false },
        { Key: '20-26', value: 'T20-26', label: 'Reports', check: false },
        // {Key:'20-17',value:'T20-17',label:'TraineeRegistrationList',check:false},
        // { key: '20-14', value: 'T20-14', label: 'HrDashboard', check: false },

      ]
    },

    {
      key: '21',
      value: 'U',
      label: 'EmployeeRequest',
      check: false,
      children: [
        { key: '21-1', value: 'U21-1', label: 'LeaveManagement', check: false },
        { key: '21-2', value: 'U21-2', label: 'AdvanceNavigation', check: false },
        { key: '21-3', value: 'U21-3', label: 'ShiftManagement', check: false },
        { key: '21-4', value: 'U21-4', label: 'PaySlip', check: false },
        { key: '21-5', value: 'U21-5', label: 'Complaint', check: false },
        { key: '21-6', value: 'U21-6', label: 'OverTimeManagement', check: false },


      ]
    },


    {
      key: '22',
      value: 'V',
      label: 'MIS',
      check: false,
      children: [
        { key: '22-1', value: 'V22-1', label: 'PatientRegistrationSummary', check: false },
        { key: '22-2', value: 'V22-2', label: 'ReferalDoctorReport', check: false },
        { key: '22-3', value: 'V22-3', label: 'RegistrationByReferralReport', check: false },
        { key: '22-4', value: 'V22-4', label: 'TotalPatientReportList', check: false },
        { key: '22-5', value: 'V22-5', label: 'Mis_Navigation', check: false },
        { key: '22-6', value: 'V22-6', label: 'Financial', check: false },
        { key: '22-7', value: 'V22-7', label: 'Insurance', check: false },
        { key: '22-8', value: 'V22-8', label: 'Client', check: false },
        { key: '22-9', value: 'V22-9', label: 'RadiologyReportsMIS', check: false },

      ]
    },
    {
      key: '23',
      value: 'W',
      label: 'MRD',
      check: false,
      children: [
        { key: '23-1', value: 'W23-1', label: 'MRDfiletrack', check: false },
        { key: '23-2', value: 'W23-2', label: 'Mrdfilerack', check: false },
        { key: '23-3', value: 'W23-3', label: 'MCIRegistrationList', check: false },
        { key: '23-4', value: 'W23-4', label: 'MCIPatientReports', check: false },
        { key: '23-5', value: 'W23-5', label: 'RadiologyReportsMCI', check: false },
        { key: '23-6', value: 'W23-6', label: 'LabTestCount', check: false },
        { key: '23-7', value: 'W23-7', label: 'MCIOTRequest', check: false },
        { key: '23-8', value: 'W23-8', label: 'MCIIPRegistration', check: false },
        { key: '23-9', value: 'W23-9', label: 'OPCountDecrease', check: false },
        { key: '23-10', value: 'W23-10', label: 'IPCountIncrease', check: false },
        { key: '23-11', value: 'W23-11', label: 'OPRegistration', check: false },
        { key: '23-12', value: 'W23-12', label: 'MRDNewRegistration', check: false },
        { key: '23-13', value: 'W23-13', label: 'MRDPatientList', check: false },
        { key: '23-14', value: 'W23-14', label: 'MRDRoomMaster', check: false },
        { key: '23-15', value: 'W23-15', label: 'DiagnosisData', check: false },
        { key: '23-16', value: 'W23-16', label: 'MedicalCodingReport', check: false },
        { key: '23-17', value: 'W23-17', label: 'CasualityAdmission', check: false },
        { key: '23-18', value: 'W23-18', label: 'RadiologyCountIncrease', check: false },
        

        // { key: '23-5', value: 'W23-5', label: '', check: false },
        // { key: '23-6', value: 'W23-6', label: '', check: false },

      ]
    },
    {
      key: '24',
      value: 'X',
      label: 'CSSDManage',
      check: false,
      children: [
        { key: '24-1', value: 'X24-1', label: 'TrayMaster', check: false },
        { key: '24-1', value: 'X24-1', label: 'TrayCreation', check: false },

      ]
    },
    {
      key: '25',
      value: 'Y',
      label: 'WasteManagement',
      check: false,
      children: [
        { key: '25-1', value: 'Y25-1', label: 'WasteManagement', check: false },
        { key: '25-2', value: 'Y25-2', label: 'HandOver', check: false },
        { key: '25-3', value: 'Y25-3', label: '', check: false },
        { key: '25-4', value: 'Y25-4', label: '', check: false },
        { key: '25-5', value: 'Y25-5', label: '', check: false },
        { key: '25-6', value: 'Y25-6', label: '', check: false },

      ]
    },
    {
      key: '26',
      value: 'Z',
      label: 'Marketing',
      check: false,
      children: [
        { key: '26-1', value: 'Z26-1', label: '', check: false },
        { key: '26-2', value: 'Z26-2', label: '', check: false },
        { key: '26-3', value: 'Z26-3', label: '', check: false },
        { key: '26-4', value: 'Z26-4', label: '', check: false },
        { key: '26-5', value: 'Z26-5', label: '', check: false },
        { key: '26-6', value: 'Z26-6', label: '', check: false },
        { key: '26-7', value: 'Z26-7', label: '', check: false },

      ]
    },
    {
      key: '27',
      value: 'AA',
      label: 'QualityIndicators',
      check: false,
      children: [
        { key: '27-1', value: 'AA27-1', label: 'IP_Quality_Indicator_Quelist', check: false },
        { key: '27-2', value: 'AA27-2', label: 'MedicalErrorMaster', check: false },
        { key: '27-3', value: 'AA27-3', label: 'QATimingMaster', check: false },
        { key: '27-4', value: 'AA27-4', label: '', check: false },
        { key: '27-5', value: 'AA27-5', label: '', check: false },
        { key: '27-6', value: 'AA27-6', label: '', check: false },

      ]
    },
    {
      key: '28',
      value: 'AB',
      label: 'Casuality',
      check: false,
      children: [
        { key: '28-1', value: 'AB28-1', label: '', check: false },
        { key: '28-2', value: 'AB28-2', label: '', check: false },
        { key: '28-3', value: 'AB28-3', label: '', check: false },
        { key: '28-4', value: 'AB28-4', label: '', check: false },
        { key: '28-5', value: 'AB28-5', label: '', check: false },

      ]
    },
    {
      key: '29',
      value: 'Ac',
      label: 'BloodBank',
      check: false,
      children: [
        { key: '29-1', value: 'Ac29-1', label: 'DonorMaster', check: false },
        { key: '29-2', value: 'Ac29-2', label: 'DonorConscentForm', check: false },
        { key: '29-3', value: 'Ac29-3', label: 'BloodBankMaster', check: false },
        { key: '29-4', value: 'Ac29-4', label: 'BagTypeMaster', check: false },
        { key: '29-5', value: 'Ac29-5', label: 'QuestionMaster', check: false },
        { key: '29-6', value: 'Ac29-6', label: 'TitreMaster', check: false },
        { key: '29-7', value: 'Ac29-7', label: 'BloodGroupMaster', check: false },

      ]
    },
    {
      key: '30',
      value: 'AD',
      label: 'PettyCash',
      check: false,
      children: [
        { key: '30-1', value: 'AD30-1', label: 'ExpensesList', check: false },
        { key: '30-2', value: 'AD30-2', label: 'DayCloseingList', check: false },
      ]
    },
    {
      key: '31',
      value: 'AE',
      label: 'BussinessIntelligence',
      check: false,
      children: [
        { key: '31-1', value: 'AE31-1', label: 'FronntOfficeDashboard', check: false },
        { key: '31-2', value: 'AE31-2', label: 'Sixdoctor', check: false },
        { key: '31-3', value: 'AE31-3', label: 'Warddashboard', check: false },
        { key: '31-4', value: 'AE31-4', label: 'CashierDashboard', check: false },
        { key: '31-5', value: 'AE31-5', label: 'HRManagement', check: false },
      ]
    },
    {
      key: '32',
      value: 'AH',
      label: 'PACS',
      check: false,
      children: [
        { key: '32-1', value: 'AH32-1', label: 'RadiologyQuelist', check: false },
        { key: '32-2', value: 'AH32-2', label: 'Mritechnician', check: false },
        { key: '32-3', value: 'AH32-3', label: 'Cttechnician', check: false },
        { key: '32-4', value: 'AH32-4', label: 'XRayTechnician', check: false },
        { key: '32-5', value: 'AH32-5', label: 'UsgTechnician', check: false },
        { key: '32-6', value: 'AH32-6', label: 'IP_RadiologyDischargeQueslist', check: false },
        { key: '32-7', value: 'AH32-7', label: 'Radiologistdoctor', check: false },
        { key: '32-8', value: 'AH32-8', label: 'Dispatch', check: false },
          { key: '32-9', value: 'AH32-9', label: 'RadiologyReports', check: false },
      ]
    },

    // {
    //   key: '32',
    //   value: 'AF',
    //   label: 'IpNurse',
    //   check: false,
    //   children: [
    //     // { key: '32-1', value: 'AF32-1', label: 'PatientQuelist', check: false },
    //     // { key: '32-2', value: 'AF32-2', label: 'BirthRegisterList', check: false },
    //     // { key: '32-3', value: 'AF32-3', label: 'DeathRegisterList', check: false },
    //     // { key: '32-4', value: 'AF32-4', label: '', check: false },
    //     // { key: '32-5', value: 'AF32-5', label: '', check: false },
    //   ]
    // },

    // {
    //   key: '33',
    //   value: 'AG',
    //   label: '',
    //   check: false,
    //   children: [
    //     // { key: '33-1', value: 'AG33-1', label: '', check: false },
    //   ]
    // },

    // {
    //   key: '34',
    //   value: 'AH',
    //   label: '',
    //   check: false,
    //   children: [
    //     // { key: '34-1', value: 'AH34-1', label: '', check: false },
    //   ]
    // },

    // {
    //   key: '35',
    //   value: 'AI',
    //   label: '',
    //   check: false,
    //   children: [
    //     // { key: '35-1', value: 'AI35-1', label: '', check: false },
    //   ]
    // },

  ]);
  const [Locations, setLocations] = useState([])
  const [LocationData, setLocationData] = useState([])
  const [ParentData, setParentData] = useState([])
  const [ChildData, setChildData] = useState([]);


  useEffect(() => {
    axios.get(`${UrlLink}Masters/Location_Detials_link`)
      .then((res) => {
        const ress = res.data
        console.log(ress);
        setLocations(ress)
      })
      .catch((err) => {
        console.log(err);
      })
  }, [UrlLink])



  useEffect(() => {
    if (UserListId && UserListId.Userid) {
      axios.get(`${UrlLink}Masters/Get_User_Detialsby_id?UserId=${UserListId.Userid}`)
        .then((res) => {
          const resss = res.data;
          console.log(resss, 'ressssssssssssssss');

          setUserRegister({
            UserId: resss?.id || '',
            EmployeeType: resss?.EmployeeType || '',
            DoctorId: resss?.DoctorId || '',
            EmployeeId: resss?.EmployeeId || '',
            Title: resss?.Title || '',
            firstName: resss?.firstName || '',
            middleName: resss?.middleName || '',
            lastName: resss?.lastName || '',
            Email: resss?.Email || '',
            PhoneNo: resss?.PhoneNo || '',
            Gender: resss?.Gender || '',
            Qualification: resss?.Qualification || '',
            UserName: resss.UserName || '',
            Password: resss.Password || '',
            roleName: resss?.roleName || '',
          });

          setPermissions({
            create: resss?.Create,
            edit: resss?.Edit,
            delete: resss?.Delete,
            read: resss?.Read,
          });

          const labAccessCodes = resss?.lab_access?.map(item => item.SubDepartment_Code?.trim()) || [];
          setLabDepartment(prev => prev.map(dept => ({
            ...dept,
            IsChecked: labAccessCodes.includes(dept.SubDepartment_Code?.trim())
          })));

          const storeTypes = resss?.inventory_access?.map(item => item.Store_Type);
          const storeIds = resss?.inventory_access?.map(item => item.Store_Id);

          setSelectedTypes(storeTypes);
          setSelectedStoreIds(storeIds);

          const ProdCatg = resss?.ProductCategory_list?.map(item => item.ProductCategoryAccessId);
          const SubCatg = resss?.SubCategory_list?.map(item => item.SubCategoryAccessId);

          setSelectedProductCatg(ProdCatg)
          setSelectedSubCategories(SubCatg)

          const AssetCatg = resss?.AssetCategory_list?.map(item => item.AssetCategoryId);
          setSelectedAssetCategories(AssetCatg || []);


          const ParentData = resss?.Access?.split(',') || [];
          const ChildData = resss?.SubAccess?.split(',') || [];



          const locData = resss?.Locations || [];
          if (locData.length === 1 && locData[0].Location_Name === 'All') {
            setLocationData([...Locations])
          } else {
            const locationNames = locData.map(loc => loc.Location_Name);
            setLocationData([...locationNames]);
          }


          setCheckedItems((prev) => {
            return prev.map((item) => {
              if (item.children && item.children.length > 0) {
                const updatedChildren = item.children.map((child) => {
                  if (ChildData.includes(child.value)) {
                    return { ...child, check: true };
                  }
                  return child;
                });

                const someval = updatedChildren.some((child) => child.check) || ParentData.includes(item.value);
                console.log(item, '---', someval);
                return { ...item, check: someval, children: updatedChildren };
              } else {
                if (ParentData.includes(item.value)) {
                  return { ...item, check: true };
                }
              }
              return item;
            });
          });
          setChildData(ChildData);
          setParentData(ParentData);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (Usercreatedocdata && Usercreatedocdata?.DoctorId) {
      axios.get(`${UrlLink}Masters/get_User_Doctor_Detials?DoctorId=${Usercreatedocdata.DoctorId}`)
        .then(res => {
          const resData = res.data;
          console.log(resData, 'resDataDocccccccccc');
          console.log(Usercreatedocdata, 'Usercreatedocdata');

          setUserRegister((prev) => ({
            ...prev,
            DoctorId: resData?.id,
            EmployeeId: '',
            EmployeeType: Usercreatedocdata?.Type,
            Title: resData?.Title,
            firstName: resData?.firstName,
            middleName: resData?.middleName,
            lastName: resData?.lastName,
            Email: resData?.Email,
            PhoneNo: resData?.PhoneNo,
            Gender: resData?.Gender,
            Qualification: resData?.Qualification,

          }))
        })
        .catch(err => {
          console.log(err);
        })


    } else if (UsercreateEmpdata && UsercreateEmpdata?.EmployeeId) {
      axios.get(`${UrlLink}HR_Management/get_User_Employee_Details?EmployeeId=${UsercreateEmpdata.EmployeeId}`)
        .then(res => {
          const resData = res.data;
          console.log(resData, 'resData');
          console.log(UsercreateEmpdata, 'UsercreateEmpdata');

          setUserRegister((prev) => ({
            ...prev,
            EmployeeId: resData?.Employee_Id,
            DoctorId: '',
            EmployeeType: UsercreateEmpdata?.Type,
            Title: resData?.Title,
            firstName: resData?.FirstName,
            middleName: resData?.MiddleName,
            lastName: resData?.lastName,
            Email: resData?.Email,
            PhoneNo: resData?.Phone,
            Gender: resData?.Gender,
            Qualification: resData?.Qualification,

          }))
        })
        .catch(err => {
          console.log(err);
        })
    }
    else {
      navigate('/Home/UserRegisterList');
    }
  }, [UserListId, UrlLink, navigate, Locations, Usercreatedocdata, UsercreateEmpdata]);

  // useEffect(() => {
  //   if (LabDepartment.length > 0 && userAccessLabCodes.length > 0) {
  //     const updated = LabDepartment.map(dept => ({
  //       ...dept,
  //       IsChecked: userAccessLabCodes.includes(dept.SubDepartment_Code?.trim())
  //     }));
  //     setLabDepartment(updated);
  //   }
  // }, [LabDepartment, userAccessLabCodes]);


  const handlelocationChange = (lname) => {

    setLocationData((prev) => {
      if (!prev.includes(lname)) {
        return [...prev, lname];
      } else {
        return [...prev.filter((value) => value !== lname)]
      }

    });

  }


  const handleParentChange = (index) => {
    setCheckedItems((prev) => {
      const updated = [...prev];
      updated[index].check = !updated[index].check;
      if (updated[index].children.length > 0) {
        updated[index].children.forEach((child) => {
          if (updated[index].check) {
            child.check = true;
            setChildData((prev) => [...prev, child.value]);
          } else {
            child.check = false;
            setChildData((prev) => prev.filter((value) => value !== child.value));
          }
        });
      }
      if (updated[index].check) {
        setParentData((prev) => [...prev, updated[index].value]);
      } else {
        setParentData((prev) => prev.filter((value) => value !== updated[index].value));
      }
      return updated;
    });
  };

  const handleChildChange = (parentIndex, childIndex) => {
    setCheckedItems((prev) => {
      const updated = [...prev];
      updated[parentIndex].children[childIndex].check = !updated[parentIndex].children[childIndex].check;
      if (updated[parentIndex].children[childIndex].check) {
        setChildData((prev) => [...prev, updated[parentIndex].children[childIndex].value]);
      } else {
        setChildData((prev) => prev.filter((value) => value !== updated[parentIndex].children[childIndex].value));
      }
      if (updated[parentIndex].children.some((child) => child.check)) {
        updated[parentIndex].check = true;
        setParentData((prev) => {
          if (!prev.includes(updated[parentIndex].value)) {
            return [...prev, updated[parentIndex].value];
          }
          return prev;
        });
      } else {
        updated[parentIndex].check = false;
        setParentData((prev) => prev.filter((value) => value !== updated[parentIndex].value));
      }
      return updated;
    });
  };


  const formatLabel = (label) => {
    if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
      return label
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (str) => str.toUpperCase());
    } else {
      return label;
    }
  };

  const handleUserRegistersubmit = () => {

    const filteredKeys = Object.keys(UserRegister).filter(p =>
      UserRegister.EmployeeType === 'DOCTOR'
        ? !['UserId', 'EmployeeId'].includes(p)
        : !['UserId', 'DoctorId'].includes(p)
    );

    if (
      !UserRegister.UserName ||
      !UserRegister.Password ||
      !UserRegister.roleName ||
      ChildData.length === 0 ||
      ParentData.length === 0 ||
      LocationData.length === 0
    ) {
      dispatch({
        type: 'toast',
        value: { message: 'Please provide all required fields.', type: 'warn' }
      });

      console.log('Missing required fields:', {
        UserName: UserRegister.UserName,
        Password: UserRegister.Password,
        filteredKeys,
        ChildData,
        ParentData,
        LocationData
      });
    }

    // if (Object.keys(UserRegister).filter(p => UserRegister.EmployeeType === 'DOCTOR' ? !['UserId', 'EmployeeId'].includes(p) : !['UserId', 'DoctorId'].includes(p))|| (ChildData.length === 0 || ParentData.length === 0) || LocationData.length === 0) {
    //   dispatch({ type: 'toast', value: { message: 'Please provide all required fields.', type: 'warn' } });

    //   console.log('gggggg', Object.keys(UserRegister).filter(p => p !== 'UserId').filter(p => UserRegister.EmployeeType === 'DOCTOR' ? !['UserId', 'EmployeeId'].includes(p) : !['UserId', 'DoctorId'].includes(p)).filter(value => UserRegister[value]));

    // } 

    else {
      let locadata = LocationData.join(',')

      console.log(LabDepartment, 'LabDepartment');

      const labAccess = LabDepartment
        .filter(item => item.IsChecked)
        .map(item => item.SubDepartment_Code);

      console.log(labAccess, 'labAccess');

      // For inventory access, we are sending the selected store types as an array
      const inventoryStore = selectedTypes;
      const inventoryId = selectedStoreIds;


      // Product & Subcategory access
      // const selectedProductCategoryIds = SelectedProductCatg.join(',');
      // const selectedSubCategoryIds = SelectedSubCategories.join(',');


      const data = {
        ...UserRegister,
        ...permissions,
        created_by: userRecord?.username || '',
        ChildData: ChildData.join(','),
        ParentData: ParentData.join(','),
        Location: locadata,
        UserId: UserListId?.Userid,
        LabAccess: labAccess,
        InventoryIdAccess: inventoryId,
        InventoryStoreAccess: inventoryStore,
        ProductCategoryAccess: SelectedProductCatg,
        SubCategoryAccess: SelectedSubCategories,
        AssetCategoryAccess: SelectedAssetCategories,
        // ProductCategoryAccess: selectedProductCategoryIds,
        // SubCategoryAccess: selectedSubCategoryIds

      };

      console.log(data, 'data-----------');

      axios.post(`${UrlLink}Masters/UserRegister_Detials_link`, data)
        .then((res) => {
          const resData = res.data;
          const mess = Object.values(resData)[0];
          const typp = Object.keys(resData)[0];
          const tdata = { message: mess, type: typp };
          dispatch({ type: 'toast', value: tdata });
          setUserRegister({
            UserId: '', EmployeeType: '', DoctorId: '',
            EmployeeId: '', UserName: '', firstName: '', middleName: '', lastName: '', Title: '', Email: '',
            Password: '', confirmPassword: '', roleName: '', PhoneNo: '', Gender: '',
            Qualification: ''
          });
          navigate('/Home/UserRegisterList')
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };



  useEffect(() => {
    let data = Object.keys(UserRegister).filter(p => !['UserId', 'DoctorId', 'EmployeeId'].includes(p))

    if (UserRegister.EmployeeType === 'DOCTOR') {
      const categoryIndex = data.indexOf('EmployeeType');
      data.splice(categoryIndex + 1, 0, 'DoctorId');
    }
    if (UserRegister.EmployeeType === 'EMPLOYEE') {
      const categoryIndex = data.indexOf('EmployeeType');
      data.splice(categoryIndex + 1, 0, 'EmployeeId');
    }
    setUserRegistershow(data)
  }, [UserRegister])



  return (
    <>
      <div className="Main_container_app">
        <h3>User Register</h3>
        <div className="common_center_tag">
          <span>User Register</span>
        </div>
        <div className="RegisFormcon_1">
          {UserRegistershow.map((field, index) => (
            <div className="RegisForm_1" key={index}>
              <label htmlFor={`${field}_${index}_${field}`}>
                {formatLabel(field)}
                <span>:</span>
              </label>
              {field === 'roleName' ? (
                <select
                  name={field}
                  id={`${field}_${index}_${field}`}
                  value={UserRegister[field] || ''}
                  onChange={handleInputChange}
                >
                  <option value="">select</option>
                  {RoleNameData.filter(p => p.Status === 'Active').map((p, indx) => (
                    <option value={p.Role} key={indx}>{p.Role}</option>
                  ))}
                </select>
              ) : (
                <input
                  // readOnly
                  id={`${field}_${index}_${field}`}
                  autoComplete='off'
                  readOnly={!['UserName', 'Password'].includes(field)}
                  pattern={
                    field === 'Email' ? "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$" :
                      field === 'PhoneNo' ? "\\d{10}" :
                        field === 'Password' ? "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$" :
                          null
                  }
                  type={
                    field === 'Email' ? 'Email' :
                      field === 'PhoneNo' ? 'tel' :
                        // field === 'Password' ? 'password' :
                        'text'
                  }
                  title={
                    field === 'Email' ? "Format: example@example.com" :
                      field === 'PhoneNo' ? "Format: 10 digits only" :
                        field === 'Password' ? "Must contain 8 characters, one uppercase, one lowercase, one number and one special character" :
                          ''
                  }
                  name={field}
                  value={UserRegister[field] || ''}
                  onChange={handleInputChange}
                />
              )}
            </div>
          ))}
        </div>
        <div className="DivCenter_container">
          <h2>Location Access</h2>
        </div>
        <div className="displayuseraccess">
          {
            Locations.map((p, indx) => (
              <div className="displayuseraccess_child">
                <input
                  type="checkbox"
                  id={`${indx}_${p?.locationName}`}
                  checked={LocationData.includes(p?.locationName)}
                  onChange={() => handlelocationChange(p?.locationName)}
                />
                <label htmlFor={`${indx}_${p?.locationName}`} className='par_acc_lab'>{p?.locationName}</label>
              </div>
            ))
          }

          <div className="DivCenter_container">
            <h2>Inventory Location Access</h2>
          </div>

          <div className="displayuseraccess">
            {storeTypes.map((type, index) => (
              <div className="displayuseraccess_child" key={index}>
                <label>
                  <input
                    type="checkbox"
                    checked={Array.isArray(selectedTypes) && selectedTypes.includes(type)} // use selectedTypes here, not .every(...)
                    onChange={() => toggleStoreType(type)}
                  />

                  {type}
                </label>

                {/* Show stores under selected type */}
                {
                  InventoryLocations.filter(store => store.StoreType === type)
                    .map(store => (
                      <div key={store.id} style={{ marginLeft: '20px' }}>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedStoreIds?.includes(store.id) || false}                            // onChange={() => toggleStore(store.id, store.StoreType)}
                            onChange={() =>
                              setSelectedStoreIds(prev =>
                                prev.includes(store.id)
                                  ? prev.filter(id => id !== store.id)
                                  : [...prev, store.id]
                              )
                            }
                          />
                          {store.StoreName}
                        </label>
                      </div>
                    ))
                }
              </div>
            ))}
          </div>


          <div className="DivCenter_container">
            <h2>LABORATORY DEPARTMENT ACCESS</h2>
          </div>

          <div className="DivCenter_container">
            <div className="displayuseraccess">

              {/* Select All checkbox */}
              <div className="displayuseraccess_child" style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <input
                  type="checkbox"
                  id="select_all_lab"
                  checked={LabDepartment.length > 0 && LabDepartment.every(item => item.IsChecked)}
                  onChange={() => handleCheckboxChange('ALL')}
                />

                <label htmlFor="select_all_lab" style={{ marginLeft: "10px", fontWeight: "bold" }}>
                  All
                </label>
              </div>

              {/* Individual checkboxes */}
              {LabDepartment.map((item, indx) => (
                <div
                  key={indx}
                  className="displayuseraccess_child"
                  style={{ marginBottom: "5px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "5px",
                    }}
                  >
                    <input
                      type="checkbox"
                      id={item.SubDepartment_Code}
                      checked={item.IsChecked || false}
                      onChange={() => handleCheckboxChange(item.SubDepartment_Code)}
                    />
                    <label
                      htmlFor={item.SubDepartment_Code}
                      className="par_acc_lab"
                      style={{ marginLeft: "10px" }}
                    >
                      {item.SubDepartment_Name}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="DivCenter_container">
            <h2>PRODUCT CATEGORY ACCESS</h2>
          </div>

          <div className="DivCenter_container">
            <div className="displayuseraccess">
              {ProductCategory.filter(cat => cat.Status === 'Active').map((item) => (
                <div className="displayuseraccess_child" key={item.id} style={{ marginBottom: "5px" }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                    <label
                      htmlFor={item.key}
                      className="par_acc_lab"
                      style={{ marginLeft: "10px", gap: "5px" }}
                    >
                      <input
                        type="checkbox"
                        checked={Array.isArray(SelectedProductCatg) && SelectedProductCatg.includes(item.id)}
                        onChange={() => toggleProductCategory(item.id)}
                      />
                      {item.ProductCategory}
                    </label>
                  </div>

                  {/* Subcategories under each Product Category */}
                  {SubCategory.filter(sub => sub.ProductCategoryId === item.id).map(sub => (
                    <div key={sub.id} style={{ marginLeft: '20px', gap: "5px" }}>
                      <label style={{ gap: "5px" }}>
                        <input
                          type="checkbox"
                          checked={Array.isArray(SelectedSubCategories) && SelectedSubCategories.includes(sub.id)}
                          // checked={SelectedSubCategories.includes(sub.id)}
                          onChange={() => toggleSubCategory(sub.id)}
                        />
                        {sub.SubCategoryName}
                      </label>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="DivCenter_container">
            <h2>ASSET CATEGORY ACCESS</h2>
          </div>

          <div className="DivCenter_container">
            <div className="displayuseraccess">
              {AssetCategories.filter(cat => cat.status === 'active').map((item) => (
                <div className="displayuseraccess_child" key={item.id} style={{ marginBottom: "5px" }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                    <label
                      htmlFor={`asset_${item.id}`}
                      className="par_acc_lab"
                      style={{ marginLeft: "10px", gap: "5px" }}
                    >
                      <input
                        type="checkbox"
                        id={`asset_${item.id}`}
                        checked={Array.isArray(SelectedAssetCategories) && SelectedAssetCategories.includes(item.id)}
                        onChange={() => toggleAssetCategory(item.id)}
                      />
                      {item.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>


          <div className="DivCenter_container">
            <h2>ACTIONS</h2>
          </div>

          {/* Permissions Checkboxes */}
          <div className="displayuseraccess">
            <div className="displayuseraccess_child">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px", }} >

                <input
                  type="checkbox"
                  id="create"
                  name="create"
                  checked={permissions.create}
                  onChange={handlePermissionChange}
                />
                <label htmlFor="create">Create</label>

                <input
                  type="checkbox"
                  id="edit"
                  name="edit"
                  checked={permissions.edit}
                  onChange={handlePermissionChange}
                />
                <label htmlFor="edit">Edit</label>

                <input
                  type="checkbox"
                  id="delete"
                  name="delete"
                  checked={permissions.delete}
                  onChange={handlePermissionChange}
                />
                <label htmlFor="delete">Delete</label>

                <input
                  type="checkbox"
                  id="read"
                  name="read"
                  checked={permissions.read}
                  onChange={handlePermissionChange}
                />
                <label htmlFor="read">Read</label>
              </div>
            </div>
          </div>

        </div>


        <div className="DivCenter_container">
          <h2>GENERAL PAGE ACCESS</h2>
        </div>

        <div>
          <h2 style={{
            textAlign: "center", margin: "10px 0", color: "gray",
            fontSize: "clamp(12px, 1.5vw, 24px)",
          }}>Access</h2>
          <div className="DivCenter_container">
            <div className="displayuseraccess">
              {checkedItems.map((item, indx) => (
                <div key={indx} className="displayuseraccess_child" style={{ marginBottom: "5px", }} >
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "5px", }} >
                    <input
                      type="checkbox"
                      id={item.key}
                      checked={item.check}
                      onChange={() => handleParentChange(indx)}
                    />
                    <label
                      htmlFor={item.key}
                      className="par_acc_lab"
                      style={{ marginLeft: "10px" }}
                    >
                      {item.label}
                    </label>
                  </div>

                  {item.check && (
                    <div style={{ display: "flex", flexWrap: "wrap", }} >
                      {item.children.map((child, ind1) => (
                        <div key={ind1} style={{ display: "flex", flex: "calc(33.33% - 25px)", }} >
                          <input
                            type="checkbox"
                            id={child.key}
                            checked={child.check}
                            onChange={() => handleChildChange(indx, ind1)}
                          />
                          <label
                            htmlFor={child.key}
                            className="chi_acc_lab"
                            style={{ marginLeft: "10px" }}
                          >
                            {child.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="Main_container_Btn">
          <button onClick={handleUserRegistersubmit}>{UserListId?.Userid ? 'Update' : 'Submit'}</button>
        </div>
      </div>
      <ToastAlert Message={toast.message} Type={toast.type} />
    </>
  );
};

export default UserRegisterMaster;
