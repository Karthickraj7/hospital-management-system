import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './IDCardPage.css';

function IDCardPage({ employeeId }) { // Accept employeeId as a prop
  const [ClinicDetails, setClinicDetails] = useState({
    ClinicLogo: null,
    ClinicName: '',
    ClinicAddress: '',
    ClinicCity: '',
    ClinicMobileNo: '',
    ClinicLandlineNo: '',
    ClinicMailID: '',
    ClinicWebsite: '',
  });

  const [employeeDetails, setEmployeeDetails] = useState({
    FirstName: '',
    Address: '',
    Mobile: '',
    Alternate_Number: '',
    BloodGroupName: '',
    DOB: '',
    DateOfJoining: '',
    Designation: '',
    Department: '',
    EmployeeId: '',
    Photo: null,
  });

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  useEffect(() => {
    let isMounted = true;

    const fetchHospitalDetails = async () => {
      try {
        const response = await axios.get(`${UrlLink}Masters/Hospital_Detials_link`);
        if (response.data && isMounted) {
          const logoBase64 = response.data.hospitalLogo;
          const formattedLogo = logoBase64?.startsWith('data:image')
            ? logoBase64
            : `data:image/jpeg;base64,${logoBase64}`;

          setClinicDetails((prev) => ({
            ...prev,
            ClinicName: response.data.hospitalName || prev.ClinicName,
            ClinicLogo: formattedLogo || prev.ClinicLogo,
          }));
        }
      } catch (error) {
        console.error('Error fetching hospital details:', error);
      }
    };

    const fetchClinicDetails = async () => {
      try {
        const response = await axios.get(`${UrlLink}Masters/Clinic_Detials_link`);
        const clinicData = response.data[0];
        if (clinicData && isMounted) {
          const addressComponents = [
            clinicData.DoorNo,
            clinicData.Street,
            clinicData.Area,
            clinicData.City,
            clinicData.State,
            clinicData.Country,
            clinicData.Pincode,
          ].filter((component) => component && component.trim() !== '');

          const formattedAddress =
            addressComponents.length > 0 ? addressComponents.join(', ') : 'N/A';

          setClinicDetails((prev) => ({
            ...prev,
            ClinicAddress: formattedAddress,
            ClinicCity: clinicData.City || prev.ClinicCity,
            ClinicMobileNo: clinicData.PhoneNo || prev.ClinicMobileNo,
            ClinicLandlineNo: clinicData.LandlineNo || prev.ClinicLandlineNo,
            ClinicMailID: clinicData.Mail || prev.ClinicMailID,
            ClinicWebsite: clinicData.Website || prev.ClinicWebsite || 'N/A',
          }));
        }
      } catch (error) {
        console.error('Error fetching clinic details:', error);
      }
    };

    const fetchEmployeeDetails = async () => {
      if (!employeeId) {
        console.error('No employeeId provided');
        return;
      }

      try {
        console.log('Fetching employee data for ID:', employeeId);
        const response = await axios.get(`${UrlLink}HR_Management/Fetch_Employee_Details`, {
          params: { EmployeeId: employeeId },
        });

        console.log('API Response:', response.data);

        const employeeData = Array.isArray(response.data)
          ? response.data.find((emp) => emp.Employee_Id === employeeId)
          : response.data;

        if (employeeData && isMounted) {
          const addressComponents = [
            employeeData.DoorNo,
            employeeData.Street,
            employeeData.Area,
            employeeData.City,
            employeeData.State,
            employeeData.Pincode,
          ].filter((component) => component && component.trim() !== '');

          const formattedAddress =
            addressComponents.length > 0 ? addressComponents.join(', ') : 'N/A';

          const photo = employeeData.Photo
            ? employeeData.Photo.startsWith('data:image')
              ? employeeData.Photo
              : `data:image/jpeg;base64,${employeeData.Photo}`
            : null;

          // Extract DateOfJoining from EmployeeCurrentDetails array
          const currentDetails = employeeData.EmployeeCurrentDetails?.[0];
          const dateOfJoining = currentDetails?.DateOfJoining || 'N/A';

          setEmployeeDetails({
            FirstName: employeeData.FirstName || 'N/A',
            Address: formattedAddress,
            Mobile: employeeData.Phone || 'N/A',
            Alternate_Number: employeeData.Alternate_Number || 'N/A',
            BloodGroupName: employeeData.BloodGroupName || 'N/A',
            DOB: employeeData.DOB || 'N/A',
            DateOfJoining: dateOfJoining,
            Designation: employeeData.Designation || 'N/A',
            Department: employeeData.Department || 'N/A',
            EmployeeId: employeeData.Employee_Id || 'N/A',
            Photo: photo,
          });
        } else {
          console.error('No employee data found for ID:', employeeId);
        }
      } catch (error) {
        console.error('Error fetching employee details:', error);
      }
    };

    fetchHospitalDetails();
    fetchClinicDetails();
    fetchEmployeeDetails();

    return () => {
      isMounted = false;
    };
  }, [UrlLink, employeeId]);

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'N/A';

    try {
      // Handle different date string formats
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // Try parsing as ISO format if direct conversion fails
        const parts = dateString.split('-');
        if (parts.length === 3) {
          const isoDate = new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
          if (!isNaN(isoDate.getTime())) {
            return isoDate.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            });
          }
        }
        return 'N/A';
      }
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'N/A';
    }
  };

  return (
    <div className="id-card-container">
      <div className="id-card-front">
        <div className="id-card-header">
          <div className="hospital-logo">
            <div className="logo-circle">
              <div className="logo-inner">
                <img
                  src={ClinicDetails.ClinicLogo || '/placeholder-logo.png'}
                  alt="Hospital Logo"
                  className="logo-text"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
            </div>
          </div>
          <div className="hospital-name">
            <h1>{ClinicDetails.ClinicName || 'N/A'}</h1>
            <h2>
              {ClinicDetails.ClinicName && ClinicDetails.ClinicName.includes('MULTISPECIALITY')
                ? 'AND RESEARCH CENTRE'
                : ''}
            </h2>
            <h2>{ClinicDetails.ClinicCity || 'N/A'}</h2>
          </div>
        </div>

        <div className="id-card-photo">
          <div style={{ width: '100px', height: '100px', overflow: 'hidden' }}>
            {employeeDetails.Photo ? (
              <img
                src={employeeDetails.Photo}
                alt="Employee Photo"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              />
            ) : (
              <img
                src="/placeholder-photo.png"
                alt="Placeholder Photo"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              />
            )}
          </div>
        </div>

        <div className="id-card-details">
          <h2 className="employee-name">{employeeDetails.FirstName || 'N/A'}</h2>
          <div className="employee-position">
            <p>{employeeDetails.Designation || 'N/A'}</p>
            <p>{employeeDetails.Department || 'N/A'}</p>
            <p>ID NO {employeeDetails.EmployeeId || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="id-card-back">
        <div className="personal-info">
          <h2>Residential Address:</h2>
          <p className="dfcde_address">{employeeDetails.Address || 'N/A'}</p>

          <div className="separator"></div>

          <div className="contact-details">
            <div className="info-row">
              <span className="info-label" style={{ color: '#F26E21' }}>
                Mobile
              </span>
              <span className="info-colon">:</span>
              <span className="info-value" style={{ color: 'white' }}>
                {employeeDetails.Mobile || 'N/A'}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label" style={{ color: '#F26E21' }}>
                Alternate No
              </span>
              <span className="info-colon">:</span>
              <span className="info-value" style={{ color: 'white' }}>
                {employeeDetails.Alternate_Number || 'N/A'}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label" style={{ color: '#F26E21' }}>
                Blood Group
              </span>
              <span className="info-colon">:</span>
              <span className="info-value" style={{ color: 'white' }}>
                {employeeDetails.BloodGroupName || 'N/A'}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label" style={{ color: '#F26E21' }}>
                D.O.B
              </span>
              <span className="info-colon">:</span>
              <span className="info-value" style={{ color: 'white' }}>
                {employeeDetails.DOB || 'N/A'}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label" style={{ color: '#F26E21' }}>
                D.O.J
              </span>
              <span className="info-colon">:</span>
              <span className="info-value" style={{ color: 'white' }}>
                {formatDate(employeeDetails.DateOfJoining)}
              </span>
            </div>
          </div>

          <div className="signature-00s">
            <div className="signature-line-pp"></div>
            <p>Managing Director</p>
          </div>
        </div>

        <div className="id-card-footer">
          <div className="footer-logo">
            <img
              src={ClinicDetails.ClinicLogo || '/placeholder-logo.png'}
              alt="Hospital Logo"
              style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50px' }}
            />
          </div>
          <div className="hospital-address">
            <p>{ClinicDetails.ClinicAddress || 'N/A'}</p>
            <p>
              {ClinicDetails.ClinicMobileNo ? `Ph: ${ClinicDetails.ClinicMobileNo}` : 'Ph: N/A'}
              {ClinicDetails.ClinicLandlineNo ? `, ${ClinicDetails.ClinicLandlineNo}` : ''}
            </p>
            <p>{ClinicDetails.ClinicMobileNo ? `Mob: ${ClinicDetails.ClinicMobileNo}` : 'Mob: N/A'}</p>
            <p>{ClinicDetails.ClinicMailID ? `Gmail - ${ClinicDetails.ClinicMailID}` : 'Gmail - N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IDCardPage;