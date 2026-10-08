import React, { useEffect, useRef, useState,useMemo,useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PrintIcon from "@mui/icons-material/Print";
import { useReactToPrint } from "react-to-print";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GroupIcon from "@mui/icons-material/Group";

const EstimatedBillReport = () => {


  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const UserData = useSelector((state) => state.userRecord?.UserData);
    const dispatchvalue = useDispatch();
    const navigate = useNavigate();
    const componentRef = useRef();
  
    const formatDate = (date) => {
      const d = new Date(date);
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      const day = d.getDate().toString().padStart(2, "0");
      const year = d.getFullYear();
      return `${year}-${month}-${day}`;
    };

    const [viewType, setViewType] = useState("EstimatedBill");

    const [TodayDate, setTodayDate] = useState(formatDate(new Date()));
    

    const [searchOptions, setSearchOptions] = useState({
        DateType: "Current",
        CurrentDate: formatDate(new Date()),
        FromDate: "",
        ToDate: "",
        SearchbyFirstName: "",
        SearchbySpeciality: "",
        SearchbyDoctor: "",
        SearchTimeOrderby: "",
        SearchStatus: "Paid",
        BillType: "",
        userid: UserData?.username,
      });

     const HandleOnchangeSearch = (e) => {
    const { name, value } = e.target;
    if (name === "SearchbyPhoneNumber") {
      if (value.length <= 10) {
        setSearchOptions((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else if (name === "DateType") {
      if (value === "Current") {
        setSearchOptions((prev) => ({
          ...prev,
          DateType: value,
          CurrentDate: TodayDate,
          FromDate: "",
          ToDate: "",
        }));
      } else if (value === "Customize") {
        setSearchOptions((prev) => ({
          ...prev,
          DateType: value,
          CurrentDate: "",
        }));
      } else if (value === "All") {
        setSearchOptions((prev) => ({
          ...prev,
          DateType: value,
          CurrentDate: "",
          FromDate: "",
          ToDate: "",
        }));
      }
    } 
  
    
    else {
      setSearchOptions((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };


    const [OpenEstimatedBillprint, setOpenEstimatedBillPrint] = useState(false);
  

  const openModalEstimatedBill = () => {

    setOpenEstimatedBillPrint(true);

  }

  const closeModalEstimatedBill = () => {

    setOpenEstimatedBillPrint(false);

  }


  const [EstimationData,setEstimationData] = useState([]);


  useEffect(() => {
      if (viewType !== "EstimatedBill") return;
  
      // Create cancel token source
      const source = axios.CancelToken.source();
      const cancelTokenRef = { current: source };
  
      const fetchData = async () => {
        // Cancel previous request if still pending
        if (cancelTokenRef.current) {
          cancelTokenRef.current.cancel("Operation canceled due to new request.");
        }
  
        const newSource = axios.CancelToken.source();
        cancelTokenRef.current = newSource;
  
        let params = {
          ...searchOptions,
          
        };
        delete params.userid;
  
        try {
          
  
          const advanceRes = await axios.get(
            `${UrlLink}Frontoffice/IPBillingEstimatedReportLinkView`,
            {
              params,
              cancelToken: newSource.token,
            }
          );

          console.log(advanceRes.data,'dataaaaaaaaaa')
          setEstimationData(advanceRes.data);
  
  
          
        } catch (err) {
          if (axios.isCancel(err)) {
            console.log("Request canceled:", err.message);
            return;
          }
          console.error("Error fetching data:", err);
          setEstimationData({});
        }
      };
  
      // Add debounce
      const delayDebounce = setTimeout(() => {
        fetchData();
      }, 400);
  
      // Cleanup
      return () => {
        clearTimeout(delayDebounce);
        if (cancelTokenRef.current) {
          cancelTokenRef.current.cancel("Operation canceled during cleanup.");
        }
      };
    }, [
      searchOptions,
      viewType,
      UrlLink,
    ]);






const ForEstimationPrint = () => {
  const componentRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('patientName');
  const [itemSearchTerm, setItemSearchTerm] = useState('');
  const [itemSearchType, setItemSearchType] = useState('serviceName');
  const [serviceNameSuggestions, setServiceNameSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Multiple_Patient_Estimations',
  });

  // Extract all unique service names from EstimationData
  const allServiceNames = useMemo(() => {
    const names = new Set();
    EstimationData.forEach(patient => {
      patient.Estimated_Items?.forEach(item => {
        if (item.Service_Name) {
          names.add(item.Service_Name.trim());
        }
      });
    });
    return Array.from(names).sort();
  }, [EstimationData]);

  // Update suggestions when itemSearchTerm changes (for serviceName search)
  useEffect(() => {
    if (itemSearchType === 'serviceName' && itemSearchTerm.trim()) {
      const term = itemSearchTerm.toLowerCase().trim();
      const filtered = allServiceNames.filter(name => 
        name.toLowerCase().includes(term)
      );
      setServiceNameSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setServiceNameSuggestions([]);
      setShowSuggestions(false);
    }
  }, [itemSearchTerm, itemSearchType, allServiceNames]);

  // Filter patients based on patient search criteria
  const patientFilteredData = useMemo(() => {
    if (!searchTerm.trim()) {
      return EstimationData;
    }

    const term = searchTerm.toLowerCase().trim();
    
    return EstimationData.filter(patient => {
      switch (searchType) {
        case 'patientName':
          return patient.Patient_Name?.toLowerCase().includes(term);
        
        case 'patientId':
          return patient.PatientId?.toString().toLowerCase().includes(term);
        
        case 'ipNo':
          return patient.Registration_Id?.toLowerCase().includes(term);
        
        case 'estimationId':
          return patient.id?.toString().toLowerCase().includes(term);
        
        default:
          return true;
      }
    });
  }, [EstimationData, searchTerm, searchType]);

  // Enhanced item search with different matching strategies
  const filteredPatients = useMemo(() => {
    if (!itemSearchTerm.trim()) {
      return patientFilteredData;
    }

    const itemTerm = itemSearchTerm.toLowerCase().trim();
    
    return patientFilteredData.map(patient => {
      // Filter items within this patient
      const filteredItems = patient.Estimated_Items?.filter(item => {
        switch (itemSearchType) {
          case 'serviceName':
            // Multiple matching strategies for service name
            const serviceName = item.Service_Name?.toLowerCase() || '';
            
            // Exact match
            if (serviceName === itemTerm) return true;
            
            // Contains match
            if (serviceName.includes(itemTerm)) return true;
            
            // Word boundary match (starts with)
            if (serviceName.split(' ').some(word => word.startsWith(itemTerm))) return true;
            
            // Partial word match
            if (itemTerm.split(' ').every(termPart => 
              serviceName.includes(termPart)
            )) return true;
            
            // Soundex or fuzzy match could be added here
            return false;
          
          case 'serviceType':
            const serviceType = item.Service_Type?.toLowerCase() || '';
            return serviceType.includes(itemTerm);
          
          case 'itemAmount':
            // Search by exact amount or partial amount
            const amount = parseFloat(item.Total_Amount || 0);
            const rate = parseFloat(item.Rate || 0);
            return !isNaN(amount) && (
              amount.toString().includes(itemTerm) ||
              rate.toString().includes(itemTerm)
            );
          
          case 'containsText':
            // Search in multiple text fields
            const searchFields = [
              item.Service_Name,
              item.Service_Type,
              item.Discount_Type,
              item.Quantity?.toString(),
              item.Rate?.toString(),
              item.Amount?.toString()
            ];
            return searchFields.some(field => 
              field?.toLowerCase().includes(itemTerm)
            );
          
          default:
            return true;
        }
      });

      // If no items match, return null (patient will be filtered out)
      if (!filteredItems || filteredItems.length === 0) {
        return null;
      }

      // Return patient with filtered items
      return {
        ...patient,
        Estimated_Items: filteredItems
      };
    }).filter(patient => patient !== null);
  }, [patientFilteredData, itemSearchTerm, itemSearchType]);

  // Calculate statistics
  const totalPatientsCount = patientFilteredData.length;
  const totalItemsCount = useMemo(() => {
    return filteredPatients.reduce((total, patient) => {
      return total + (patient.Estimated_Items?.length || 0);
    }, 0);
  }, [filteredPatients]);

  const patientMatchingItemsCount = filteredPatients.length;

  // Unique service types for filtering
  const allServiceTypes = useMemo(() => {
    const types = new Set();
    EstimationData.forEach(patient => {
      patient.Estimated_Items?.forEach(item => {
        if (item.Service_Type) {
          types.add(item.Service_Type.trim());
        }
      });
    });
    return Array.from(types).sort();
  }, [EstimationData]);

  const handleServiceNameSelect = (serviceName) => {
    setItemSearchTerm(serviceName);
    setShowSuggestions(false);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <style>
        {`
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .search-container,
            .item-search-container,
            .print-btn-container,
            .suggestions-dropdown {
              display: none;
            }
            .patient-estimation {
              page-break-inside: avoid;
              margin-bottom: 20px;
            }
            table {
              page-break-inside: auto;
            }
            tr {
              page-break-inside: avoid;
            }
          }
          
          .search-container,
          .item-search-container {
            background-color: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 15px;
            border: 1px solid #e5e7eb;
            position: relative;
          }
          
          .search-input-group {
            display: flex;
            gap: 10px;
            align-items: center;
            flex-wrap: wrap;
            position: relative;
          }
          
          .search-select {
            padding: 6px 10px;
            border: 1px solid #d1d5db;
            border-radius: 5px;
            background-color: white;
            font-size: 14px;
            min-width: 150px;
            cursor: pointer;
          }
          
          .search-input {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 5px;
            font-size: 14px;
            min-width: 250px;
          }
          
          .search-input:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          
          .clear-btn {
            padding: 8px 16px;
            background-color: #6b7280;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s;
          }
          
          .clear-btn:hover:not(:disabled) {
            background-color: #4b5563;
          }
          
          .clear-btn:disabled {
            background-color: #d1d5db;
            cursor: not-allowed;
          }
          
          .results-count {
            margin-top: 10px;
            font-size: 14px;
            color: #4b5563;
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          
          .no-results {
            text-align: center;
            padding: 40px;
            background-color: #fef2f2;
            border-radius: 8px;
            border: 1px solid #fecaca;
            margin: 20px 0;
          }
          
          .print-btn-container {
            text-align: center;
            margin-bottom: 20px;
          }
          
          button {
            padding: 10px 20px;
            margin: 0 10px;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s;
          }
          
          button:hover {
            background-color: #1e40af;
          }
          
          .search-header {
            margin: 0;
            color: #1e40af;
            font-size: 16px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            margin-left: 5px;
          }
          
          .badge-patients {
            background-color: #dbeafe;
            color: #1e40af;
          }
          
          .badge-items {
            background-color: #dcfce7;
            color: #059669;
          }
          
          .badge-services {
            background-color: #f3e8ff;
            color: #7c3aed;
          }
          
          .suggestions-dropdown {
            position: absolute;
            top: 100%;
            left: 150px;
            right: 0;
            background: white;
            border: 1px solid #d1d5db;
            border-radius: 5px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            margin-top: 2px;
          }
          
          .suggestion-item {
            padding: 8px 12px;
            cursor: pointer;
            border-bottom: 1px solid #f3f4f6;
            font-size: 14px;
          }
          
          .suggestion-item:hover {
            background-color: #f3f4f6;
          }
          
          .suggestion-item:last-child {
            border-bottom: none;
          }
          
          .service-count {
            float: right;
            color: #6b7280;
            font-size: 12px;
          }
          
          .search-stats {
            display: flex;
            gap: 15px;
            margin-top: 10px;
            flex-wrap: wrap;
          }
          
          .stat-item {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 13px;
          }
          
          .stat-value {
            font-weight: 600;
            color: #1e40af;
          }
          
          .quick-search-buttons {
            display: flex;
            gap: 8px;
            margin-top: 10px;
            flex-wrap: wrap;
          }
          
          .quick-search-btn {
            padding: 4px 12px;
            background-color: #e5e7eb;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .quick-search-btn:hover {
            background-color: #d1d5db;
          }
          
          .search-type-label {
            display: inline-block;
            padding: 2px 8px;
            background-color: #dbeafe;
            color: #1e40af;
            border-radius: 12px;
            font-size: 12px;
            margin-left: 5px;
          }
        `}
      </style>

      {/* Patient Search Container */}
      <div className="search-container">
        <h3 className="search-header">
          <span>Search Patients</span>
          <span className="search-type-label">Patient Level</span>
        </h3>
        
        <div className="search-input-group">
          <select 
            className="search-select"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="patientName">Patient Name</option>
            <option value="patientId">Patient ID</option>
            <option value="ipNo">IP/Registration No</option>
            <option value="estimationId">Estimation ID</option>
          </select>
          
          <input
            type="text"
            className="search-input"
            placeholder={`Search by ${searchType === 'patientName' ? 'patient name' : searchType === 'patientId' ? 'patient ID' : searchType === 'ipNo' ? 'IP/Registration number' : 'estimation ID'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <button 
            className="clear-btn"
            onClick={() => setSearchTerm('')}
            disabled={!searchTerm.trim()}
          >
            Clear
          </button>
        </div>
        
        <div className="search-stats">
          <div className="stat-item">
            <span>Total Patients:</span>
            <span className="stat-value">{EstimationData.length}</span>
          </div>
          <div className="stat-item">
            <span>Found:</span>
            <span className="stat-value" style={{ color: '#059669' }}>
              {patientFilteredData.length}
            </span>
          </div>
        </div>
      </div>

      {/* Item Search Container */}
      <div className="item-search-container">
        <h3 className="search-header">
          <span>Search Service Items</span>
          <span className="search-type-label">Item Level</span>
        </h3>
        
        <div className="search-input-group">
          <select 
            className="search-select"
            value={itemSearchType}
            onChange={(e) => {
              setItemSearchType(e.target.value);
              setShowSuggestions(false);
            }}
          >
            <option value="serviceName">Service Name</option>
            <option value="serviceType">Service Type</option>
            <option value="itemAmount">Item Amount</option>
            <option value="containsText">Contains Text</option>
          </select>
          
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              className="search-input"
              placeholder={itemSearchType === 'serviceName' ? 'Search service name... (Type to see suggestions)' :
                         itemSearchType === 'serviceType' ? 'Search service type...' :
                         itemSearchType === 'itemAmount' ? 'Search by amount...' :
                         'Search in any text field...'}
              value={itemSearchTerm}
              onChange={(e) => setItemSearchTerm(e.target.value)}
              onFocus={() => itemSearchType === 'serviceName' && setShowSuggestions(true)}
            />
            
            {/* Service Name Suggestions Dropdown */}
            {itemSearchType === 'serviceName' && showSuggestions && serviceNameSuggestions.length > 0 && (
              <div className="suggestions-dropdown">
                {serviceNameSuggestions.slice(0, 10).map((serviceName, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleServiceNameSelect(serviceName)}
                  >
                    {serviceName}
                    <span className="service-count">
                      {EstimationData.reduce((count, patient) => 
                        count + (patient.Estimated_Items?.filter(item => 
                          item.Service_Name?.trim() === serviceName
                        ).length || 0), 0)} items
                    </span>
                  </div>
                ))}
                {serviceNameSuggestions.length > 10 && (
                  <div className="suggestion-item" style={{ color: '#6b7280', fontStyle: 'italic' }}>
                    ... and {serviceNameSuggestions.length - 10} more services
                  </div>
                )}
              </div>
            )}
          </div>
          
          <button 
            className="clear-btn"
            onClick={() => {
              setItemSearchTerm('');
              setShowSuggestions(false);
            }}
            disabled={!itemSearchTerm.trim()}
          >
            Clear
          </button>
        </div>
        
        {/* Quick Search Buttons for Service Names */}
        {itemSearchType === 'serviceName' && allServiceNames.length > 0 && (
          <div className="quick-search-buttons">
            <div style={{ fontSize: '12px', color: '#6b7280', marginRight: '5px' }}>
              Quick search:
            </div>
            {allServiceNames.slice(0, 8).map((serviceName, index) => (
              <button
                key={index}
                className="quick-search-btn"
                onClick={() => {
                  setItemSearchTerm(serviceName);
                  setShowSuggestions(false);
                }}
                title={`Search for "${serviceName}"`}
              >
                {serviceName.length > 15 ? serviceName.substring(0, 15) + '...' : serviceName}
              </button>
            ))}
            {allServiceNames.length > 8 && (
              <span style={{ fontSize: '12px', color: '#6b7280', alignSelf: 'center' }}>
                +{allServiceNames.length - 8} more
              </span>
            )}
          </div>
        )}
        
        <div className="results-count">
          <div className="search-stats">
            <div className="stat-item">
              <span>Patients with items:</span>
              <span className="stat-value">{patientMatchingItemsCount}</span>
            </div>
            <div className="stat-item">
              <span>Total items found:</span>
              <span className="stat-value" style={{ color: '#059669' }}>
                {totalItemsCount}
              </span>
            </div>
            <div className="stat-item">
              <span>Unique services:</span>
              <span className="stat-value" style={{ color: '#7c3aed' }}>
                {allServiceNames.length}
              </span>
            </div>
          </div>
          
          {itemSearchTerm.trim() && (
            <div style={{ 
              marginTop: '8px', 
              padding: '6px',
              backgroundColor: '#f0f9ff',
              borderRadius: '4px',
              fontSize: '13px'
            }}>
              <strong>Searching in:</strong> 
              {itemSearchType === 'serviceName' && ' Service Names'}
              {itemSearchType === 'serviceType' && ' Service Types'}
              {itemSearchType === 'itemAmount' && ' Item Amounts'}
              {itemSearchType === 'containsText' && ' All Text Fields'}
              <span style={{ marginLeft: '10px', color: '#dc2626' }}>
                "{itemSearchTerm}"
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="print-btn-container">
        <button onClick={handlePrint}>Print All Estimations</button>
        {(searchTerm.trim() || itemSearchTerm.trim()) && (
          <button 
            onClick={() => {
              setSearchTerm('');
              setItemSearchTerm('');
              setSearchType('patientName');
              setItemSearchType('serviceName');
              setShowSuggestions(false);
            }}
            style={{ backgroundColor: '#6b7280' }}
          >
            Clear All Filters
          </button>
        )}
      </div>

      <div ref={componentRef}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#1e40af' }}>
            KARUNA MEDICAL COLLEGE HOSPITAL
          </h2>
          <h3 style={{ margin: '5px 0', fontSize: '18px', color: '#374151' }}>
            Vilayodi, Chittur, Palakkad
          </h3>
          
          {/* Search Status Summary */}
          {(searchTerm.trim() || itemSearchTerm.trim()) && (
            <div style={{ 
              marginTop: '15px',
              padding: '12px',
              borderRadius: '6px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e5e7eb',
              fontSize: '14px',
              maxWidth: '800px',
              margin: '15px auto'
            }}>
              <div style={{ fontWeight: '600', color: '#1e40af', marginBottom: '8px' }}>
                🔍 Search Summary
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {searchTerm.trim() && (
                  <div style={{ 
                    padding: '8px',
                    backgroundColor: '#dbeafe',
                    borderRadius: '4px',
                    border: '1px solid #93c5fd'
                  }}>
                    <div style={{ fontSize: '12px', color: '#374151' }}>Patient Search:</div>
                    <div style={{ fontWeight: '600', color: '#1e40af' }}>"{searchTerm}"</div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                      {searchType} • {patientFilteredData.length} patient(s)
                    </div>
                  </div>
                )}
                
                {itemSearchTerm.trim() && (
                  <div style={{ 
                    padding: '8px',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '4px',
                    border: '1px solid #bae6fd'
                  }}>
                    <div style={{ fontSize: '12px', color: '#374151' }}>Item Search:</div>
                    <div style={{ fontWeight: '600', color: '#0ea5e9' }}>"{itemSearchTerm}"</div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                      {itemSearchType} • {patientMatchingItemsCount} patient(s) • {totalItemsCount} item(s)
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* No Results Message */}
        {filteredPatients.length === 0 ? (
          <div className="no-results">
            <div style={{ fontSize: '48px', color: '#d1d5db', marginBottom: '10px' }}>
              🔍
            </div>
            <h3 style={{ color: '#dc2626', marginBottom: '10px' }}>
              No matching patients or services found
            </h3>
            <p style={{ color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
              {searchTerm.trim() || itemSearchTerm.trim() 
                ? 'Try adjusting your search terms or using different search criteria.'
                : 'No estimation data available.'}
            </p>
            {(searchTerm.trim() || itemSearchTerm.trim()) && (
              <div style={{ marginTop: '15px' }}>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setItemSearchTerm('');
                    setShowSuggestions(false);
                  }}
                  style={{ 
                    backgroundColor: '#2563eb',
                    color: 'white',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Clear All Searches
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Patient Estimations */
          filteredPatients.map((patient, patientIndex) => {
            const totals = patient.Estimated_Items?.reduce((acc, item) => ({
              quantity: acc.quantity + parseInt(item.Quantity || 0),
              amount: acc.amount + parseFloat(item.Amount || 0),
              discount: acc.discount + parseFloat(item.Discount_Amount || 0),
              taxable: acc.taxable + parseFloat(item.Taxable_Amount || 0),
              tax: acc.tax + parseFloat(item.Tax_Amount || 0),
              total: acc.total + parseFloat(item.Total_Amount || 0)
            }), {
              quantity: 0,
              amount: 0,
              discount: 0,
              taxable: 0,
              tax: 0,
              total: 0
            });

            return (
              <div 
                key={patient.id} 
                className="patient-estimation"
                style={{ 
                  marginBottom: '40px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  pageBreakInside: 'avoid'
                }}
              >
                {/* Patient Header with Search Indicator */}
                <div style={{ 
                  backgroundColor: itemSearchTerm.trim() ? '#fffbeb' : '#f8fafc', 
                  padding: '15px',
                  borderBottom: `3px solid ${itemSearchTerm.trim() ? '#f59e0b' : '#1e40af'}`,
                  position: 'relative'
                }}>
                  {itemSearchTerm.trim() && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      fontSize: '11px',
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontWeight: '600'
                    }}>
                      {patient.Estimated_Items?.length || 0} matching item(s)
                    </div>
                  )}
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '10px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    <div>
                      <strong>Estimation ID:</strong> {patient.id}
                    </div>
                    <div>
                      <strong>Patient ID:</strong> {patient.PatientId}
                    </div>
                    <div>
                      <strong>Registration ID:</strong> {patient.Registration_Id}
                    </div>
                    <div>
                      <strong>Patient Name:</strong> {patient.Patient_Name}
                    </div>
                    <div>
                      <strong>Date:</strong> {new Date(patient.Date).toLocaleDateString('en-GB')}
                    </div>
                    <div>
                      <strong>Total Items:</strong> {patient.Estimated_Items?.length || 0}
                    </div>
                  </div>
                </div>

                {/* Estimated Items Table */}
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  fontSize: '12px'
                }}>
                  <thead>
                    <tr style={{ 
                      backgroundColor: itemSearchTerm.trim() ? '#fbbf24' : '#1e40af', 
                      color: 'white',
                      position: 'sticky',
                      top: 0
                    }}>
                      <th style={{ border: '1px solid #3730a3', padding: '8px', textAlign: 'center', width: '5%' }}>SL No</th>
                      <th style={{ border: '1px solid #3730a3', padding: '8px', textAlign: 'left', width: '25%' }}>Service Name</th>
                      <th style={{ border: '1px solid #3730a3', padding: '8px', textAlign: 'left', width: '12%' }}>Service Type</th>
                      <th style={{ border: '1px solid #3730a3', padding: '8px', textAlign: 'right', width: '8%' }}>Rate (₹)</th>
                      <th style={{ border: '1px solid #3730a3', padding: '8px', textAlign: 'center', width: '6%' }}>Qty</th>
                      <th style={{ border: '1px solid #3730a3', padding: '8px', textAlign: 'right', width: '10%' }}>Amount (₹)</th>
                      <th style={{ border: '1px solid #3730a3', padding: '8px', textAlign: 'right', width: '8%' }}>Discount %</th>
                      <th style={{ border: '1px solid #3730a3', padding: '8px', textAlign: 'right', width: '10%' }}>Discount (₹)</th>
                      <th style={{ border: '1px solid #3730a3', padding: '8px', textAlign: 'right', width: '8%' }}>Tax %</th>
                      <th style={{ border: '1px solid #3730a3', padding: '8px', textAlign: 'right', width: '8%' }}>Tax (₹)</th>
                      <th style={{ border: '1px solid #3730a3', padding: '8px', textAlign: 'right', width: '10%' }}>Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patient.Estimated_Items?.map((item, index) => {
                      // Check if item matches the item search (for highlighting)
                      const matchesItemSearch = itemSearchTerm.trim() && (
                        (itemSearchType === 'serviceName' && (
                          item.Service_Name?.toLowerCase().includes(itemSearchTerm.toLowerCase()) ||
                          itemSearchTerm.toLowerCase().split(' ').every(termPart => 
                            item.Service_Name?.toLowerCase().includes(termPart)
                          )
                        )) ||
                        (itemSearchType === 'serviceType' && item.Service_Type?.toLowerCase().includes(itemSearchTerm.toLowerCase())) ||
                        (itemSearchType === 'itemAmount' && (
                          item.Total_Amount?.toString().includes(itemSearchTerm) ||
                          item.Rate?.toString().includes(itemSearchTerm)
                        )) ||
                        (itemSearchType === 'containsText' && [
                          item.Service_Name,
                          item.Service_Type,
                          item.Discount_Type,
                          item.Quantity?.toString(),
                          item.Rate?.toString(),
                          item.Amount?.toString()
                        ].some(field => field?.toLowerCase().includes(itemSearchTerm.toLowerCase())))
                      );

                      return (
                        <tr 
                          key={index} 
                          style={{ 
                            backgroundColor: matchesItemSearch 
                              ? '#fffbeb' 
                              : index % 2 === 0 
                                ? '#ffffff' 
                                : '#f8fafc',
                            borderLeft: matchesItemSearch ? '4px solid #f59e0b' : 'none',
                            transition: 'background-color 0.2s'
                          }}
                        >
                          <td style={{ border: '1px solid #d1d5db', padding: '6px', textAlign: 'center', fontWeight: '600' }}>
                            {index + 1}
                          </td>
                          <td style={{ border: '1px solid #d1d5db', padding: '6px', textAlign: 'left' }}>
                            {matchesItemSearch && itemSearchType === 'serviceName' ? (
                              <span style={{ fontWeight: '600', color: '#92400e' }}>
                                {item.Service_Name}
                              </span>
                            ) : item.Service_Name}
                          </td>
                          <td style={{ border: '1px solid #d1d5db', padding: '6px', textAlign: 'left' }}>
                            {item.Service_Type}
                          </td>
                          <td style={{ border: '1px solid #d1d5db', padding: '6px', textAlign: 'right' }}>
                            {parseFloat(item.Rate || 0).toFixed(2)}
                          </td>
                          <td style={{ border: '1px solid #d1d5db', padding: '6px', textAlign: 'center' }}>
                            {item.Quantity}
                          </td>
                          <td style={{ border: '1px solid #d1d5db', padding: '6px', textAlign: 'right' }}>
                            {parseFloat(item.Amount || 0).toFixed(2)}
                          </td>
                          <td style={{ border: '1px solid #d1d5db', padding: '6px', textAlign: 'right', color: '#dc2626' }}>
                            {item.Discount_Type || '0%'}
                          </td>
                          <td style={{ border: '1px solid #d1d5db', padding: '6px', textAlign: 'right', color: '#dc2626' }}>
                            {parseFloat(item.Discount_Amount || 0).toFixed(2)}
                          </td>
                          <td style={{ border: '1px solid #d1d5db', padding: '6px', textAlign: 'right', color: '#059669' }}>
                            {parseFloat(item.Tax_Percentage || 0).toFixed(0)}%
                          </td>
                          <td style={{ border: '1px solid #d1d5db', padding: '6px', textAlign: 'right', color: '#059669' }}>
                            {parseFloat(item.Tax_Amount || 0).toFixed(2)}
                          </td>
                          <td style={{ border: '1px solid #d1d5db', padding: '6px', textAlign: 'right', fontWeight: '600' }}>
                            {parseFloat(item.Total_Amount || 0).toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Patient Summary */}
                <div style={{ 
                  backgroundColor: itemSearchTerm.trim() ? '#fef3c7' : '#f0fdf4',
                  padding: '12px',
                  borderTop: `3px solid ${itemSearchTerm.trim() ? '#f59e0b' : '#059669'}`
                }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr 1fr 1fr',
                    gap: '10px',
                    fontSize: '13px',
                    fontWeight: '500',
                    marginBottom: '10px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <strong>Filtered Items:</strong> {patient.Estimated_Items?.length || 0}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <strong>Total Quantity:</strong> {totals.quantity}
                    </div>
                    <div style={{ textAlign: 'center', color: '#dc2626' }}>
                      <strong>Total Discount:</strong> ₹{totals.discount.toFixed(2)}
                    </div>
                    <div style={{ textAlign: 'center', color: '#059669' }}>
                      <strong>Total Tax:</strong> ₹{totals.tax.toFixed(2)}
                    </div>
                  </div>
                  
                  {/* Grand Total */}
                 <div
                    style={{
                      textAlign: 'center',
                      padding: '10px',
                      backgroundColor: itemSearchTerm.trim() ? '#fed7aa' : '#dcfce7',
                      borderRadius: '6px',
                      border: `2px solid ${itemSearchTerm.trim() ? '#fdba74' : '#bbf7d0'}`,
                      marginBottom: '8px',
                    }}
                  >

                    <strong style={{ fontSize: '15px', color: itemSearchTerm.trim() ? '#92400e' : '#065f46' }}>
                      FILTERED ITEMS TOTAL: ₹{totals.total.toFixed(2)}
                    </strong>
                    {itemSearchTerm.trim() && (
                      <div style={{ fontSize: '12px', marginTop: '4px', color: '#92400e' }}>
                        📋 Showing items matching "{itemSearchTerm}"
                      </div>
                    )}
                  </div>

                  {/* Original Total Comparison */}
                  {itemSearchTerm.trim() && patient.Net_Amount && parseFloat(patient.Net_Amount) !== totals.total && (
                    <div style={{ 
                      padding: '8px',
                      backgroundColor: '#f1f5f9',
                      borderRadius: '4px',
                      fontSize: '12px',
                      textAlign: 'center',
                      border: '1px solid #cbd5e1',
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '15px'
                    }}>
                      <div>
                        <strong>Original Total:</strong> ₹{parseFloat(patient.Net_Amount || 0).toFixed(2)}
                      </div>
                      <div style={{ color: '#dc2626' }}>
                        <strong>Difference:</strong> ₹{(parseFloat(patient.Net_Amount || 0) - totals.total).toFixed(2)}
                      </div>
                      <div style={{ color: '#059669' }}>
                        <strong>Filtered:</strong> {Math.round((totals.total / parseFloat(patient.Net_Amount || 1)) * 100)}%
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '30px',
          padding: '15px',
          borderTop: '2px solid #e5e7eb',
          fontSize: '12px',
          color: '#6b7280',
          backgroundColor: '#f8fafc',
          borderRadius: '6px'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '5px' }}>
            📄 Document Summary
          </div>
          <div>
            Printed on: {new Date().toLocaleDateString('en-GB')} at {new Date().toLocaleTimeString('en-GB')}
          </div>
          <div style={{ marginTop: '5px' }}>
            <strong>Total Patients:</strong> {filteredPatients.length} 
            <span style={{ margin: '0 10px' }}>•</span>
            <strong>Total Items:</strong> {totalItemsCount}
            <span style={{ margin: '0 10px' }}>•</span>
            <strong>Computer Generated</strong>
          </div>
          {(searchTerm.trim() || itemSearchTerm.trim()) && (
            <div style={{ 
              marginTop: '8px',
              padding: '6px',
              backgroundColor: '#e5e7eb',
              borderRadius: '4px',
              fontSize: '11px'
            }}>
              🔍 <strong>Active Filters:</strong>
              {searchTerm.trim() && ` Patients: "${searchTerm}" (${searchType})`}
              {itemSearchTerm.trim() && ` Items: "${itemSearchTerm}" (${itemSearchType})`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};





  return (
    <>

    <div className="Main_container_app">
      <h3>Estimated Bill Report</h3>

      <div className="RegisterTypecon">
                <div className="RegisterType">
                  {[
                    "EstimatedBill",
                    
                  ].map((p, ind) => (
                    <div className="registertypeval" key={ind + "key"}>
                      <input
                        type="radio"
                        id={p}
                        name="view_type"
                        checked={viewType === p}
                        onChange={() => setViewType(p)}
                        value={p}
                      />
                      <label htmlFor={p}>
                        {
                          {
                            EstimatedBill: "Estimated Bill",
                            
                          }[p] || p // Fallback to p if no match is found
                        }
                      </label>
                    </div>
                  ))}
                </div>
      </div>


      <br />
        <div className="search_div_bar" style={{ width: "100%" }}>
          <div className="RegisFormcon_1" style={{ marginTop: "10px" }}>

            <div className="RegisForm_1">
              <label>
                Date Type<span>:</span>
              </label>
              <select
                name="DateType"
                value={searchOptions.DateType}
                onChange={HandleOnchangeSearch}
              >
                <option value="Current">Current Date</option>
                <option value="Customize">Customize</option>
              </select>
            </div>

            {searchOptions.DateType === "Current" && (
              <div className="RegisForm_1">
                <label>
                  Current Date<span>:</span>
                </label>
                <input
                  type="date"
                  name="CurrentDate"
                  value={searchOptions.CurrentDate}
                  onChange={HandleOnchangeSearch}
                  readOnly
                />
              </div>
            )}
            {searchOptions.DateType === "Customize" && (
              <>
                <div className="RegisForm_1">
                  <label>
                    From Date<span>:</span>
                  </label>
                  <input
                    type="date"
                    name="FromDate"
                    value={searchOptions.FromDate}
                    onChange={HandleOnchangeSearch}
                  />
                </div>
                <div className="RegisForm_1">
                  <label>
                    To Date<span>:</span>
                  </label>
                  <input
                    type="date"
                    name="ToDate"
                    value={searchOptions.ToDate}
                    onChange={HandleOnchangeSearch}
                    min={searchOptions.FromDate}
                  />
                </div>
              </>
            )}


            {viewType === "EstimatedBill" && (
                          <div
                            className="RegisForm_1"
                            style={{ justifyContent: "space-evenly" }}
                          >
                            <label htmlFor="input">
                              Estimated Bill<span>:</span>
                            </label>
                            <div style={{ display: "flex", gap: "10px" }}>
                              {/* Print Button */}
                              <button
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  border: "1px solid #ccc",
                                  borderRadius: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: "#f5f5f5",
                                  cursor: "pointer",
                                }}
                                onClick={() => openModalEstimatedBill()}
                              >
                                <PrintIcon style={{ fontSize: "32px", color: "#333" }} />
                              </button>
                            
                            </div>
                          </div>
                        )}

          </div>
        </div>


    </div>


    {OpenEstimatedBillprint && viewType === "EstimatedBill" && (
            <div className="loader" onClick={closeModalEstimatedBill}>
              <div className="cardModel" onClick={(e) => e.stopPropagation()}>    
                  <ForEstimationPrint />          
              </div>
            </div>
          )}

    </>
  )
}

export default EstimatedBillReport
