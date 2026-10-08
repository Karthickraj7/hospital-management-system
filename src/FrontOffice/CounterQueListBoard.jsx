import React, { useState, useEffect } from 'react';
import './QueListBoard.css';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

const CounterQueListBoard = () => {
  // const queueData = [
  //   {speciality:'xyz', sno: 1, patientId: 'P001', patientName: 'John Doe', status: 'Waiting', visitType: 'General', slotNo: '1', doctorName: 'Dr. Smith', counterNo: 'Counter 1' },
  //   {speciality:'xyz', sno: 2, patientId: 'P002', patientName: 'Jane Smith', status: 'In Progress', visitType: 'Emergency', slotNo: '2', doctorName: 'Dr. Johnson', counterNo: 'Counter 2' },
  //   {speciality:'xyz', sno: 3, patientId: 'P003', patientName: 'Alice Brown', status: 'Completed', visitType: 'Follow-up', slotNo: '3', doctorName: 'Dr. Williams', counterNo: 'Counter 3' },
  //   {speciality:'xyz', sno: 4, patientId: 'P004', patientName: 'Michael Lee', status: 'Waiting', visitType: 'General', slotNo: '4', doctorName: 'Dr. Scott', counterNo: 'Counter 4' },
  //   {speciality:'xyz', sno: 5, patientId: 'P005', patientName: 'Mary Clark', status: 'In Progress', visitType: 'Emergency', slotNo: '5', doctorName: 'Dr. Thomas', counterNo: 'Counter 5' },
  //   {speciality:'xyz', sno: 6, patientId: 'P006', patientName: 'David Adams', status: 'Completed', visitType: 'Follow-up', slotNo: '6', doctorName: 'Dr. Brown', counterNo: 'Counter 6' },
  //   {speciality:'xyz', sno: 7, patientId: 'P007', patientName: 'Emma Davis', status: 'Waiting', visitType: 'General', slotNo: '7', doctorName: 'Dr. Taylor', counterNo: 'Counter 7' },
  //   {speciality:'xyz', sno: 8, patientId: 'P008', patientName: 'James Wilson', status: 'In Progress', visitType: 'Emergency', slotNo: '8', doctorName: 'Dr. Harris', counterNo: 'Counter 8' },
  //   {speciality:'xyz', sno: 9, patientId: 'P009', patientName: 'Sophia Martinez', status: 'Completed', visitType: 'Follow-up', slotNo: '9', doctorName: 'Dr. Thompson', counterNo: 'Counter 9' },
  //   {speciality:'xyz', sno: 10, patientId: 'P010', patientName: 'Lucas Garcia', status: 'Waiting', visitType: 'General', slotNo: '10', doctorName: 'Dr. Anderson', counterNo: 'Counter 10' },
  //   {speciality:'xyz', sno: 11, patientId: 'P011', patientName: 'Isabella Martinez', status: 'In Progress', visitType: 'Emergency', slotNo: '11', doctorName: 'Dr. Lee', counterNo: 'Counter 11' },
  //   {speciality:'xyz', sno: 12, patientId: 'P012', patientName: 'Benjamin Harris', status: 'Completed', visitType: 'Follow-up', slotNo: '12', doctorName: 'Dr. Walker', counterNo: 'Counter 12' },
  //   {speciality:'xyz', sno: 13, patientId: 'P013', patientName: 'Charlotte Wilson', status: 'Waiting', visitType: 'General', slotNo: '13', doctorName: 'Dr. Young', counterNo: 'Counter 13' },
  //   {speciality:'xyz', sno: 14, patientId: 'P014', patientName: 'Mason Robinson', status: 'In Progress', visitType: 'Emergency', slotNo: '14', doctorName: 'Dr. Martinez', counterNo: 'Counter 14' },
  //   {speciality:'xyz', sno: 15, patientId: 'P015', patientName: 'Amelia King', status: 'Completed', visitType: 'Follow-up', slotNo: '15', doctorName: 'Dr. Gonzalez', counterNo: 'Counter 15' },
  //   {speciality:'xyz', sno: 16, patientId: 'P016', patientName: 'Ethan Walker', status: 'Waiting', visitType: 'General', slotNo: '16', doctorName: 'Dr. Perez', counterNo: 'Counter 16' },
  //   {speciality:'xyz', sno: 17, patientId: 'P017', patientName: 'Ava Lopez', status: 'In Progress', visitType: 'Emergency', slotNo: '17', doctorName: 'Dr. Roberts', counterNo: 'Counter 17' },
  //   {speciality:'xyz', sno: 18, patientId: 'P018', patientName: 'Jackson Lee', status: 'Completed', visitType: 'Follow-up', slotNo: '18', doctorName: 'Dr. Scott', counterNo: 'Counter 18' },
  //   {speciality:'xyz', sno: 19, patientId: 'P019', patientName: 'Mia Harris', status: 'Waiting', visitType: 'General', slotNo: '19', doctorName: 'Dr. Wilson', counterNo: 'Counter 19' },
  //   {speciality:'xyz', sno: 20, patientId: 'P020', patientName: 'William Clark', status: 'In Progress', visitType: 'Emergency', slotNo: '20', doctorName: 'Dr. Taylor', counterNo: 'Counter 20' },
  // ];
  

  const [queueData,setqueueData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(queueData.length / rowsPerPage);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPage((prevPage) => (prevPage % totalPages) + 1);
        setIsTransitioning(false);
      }, 500); // Wait for the transition to finish before updating the page
    }, 10000);

    return () => clearInterval(timer);
  }, [totalPages]);

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return queueData.slice(startIndex, endIndex);
  };

  
  useEffect(() => {
    axios.get(`${UrlLink}Masters/get_counter_details_for_OPPatient`)
        .then((res) => {
            const ress = res.data     
            setqueueData(ress);              
        })
        .catch((err) => {
            console.log(err);
        })
  }, [UrlLink]);



  return (
    <div className="queue-container-1">
      <div className="queue-card-2">
        <div className="header-container-3">
          <h1 className="main-title-4">Queue Board System</h1>
          <div className="page-counter-5">
            Page {currentPage} of {totalPages}
          </div>
        </div>
        
        <div className="table-wrapper-6">
          <table className="queue-table-7">
            <thead>
              <tr className="header-row-8">
                <th className="table-header-9">S.No</th>
                <th className="table-header-9">Patient ID</th>
                <th className="table-header-9">Patient Name</th>
                {/* <th className="table-header-9">Status</th> */}
                <th className="table-header-9">Visit Type</th>
                <th className="table-header-9">Speciality</th>
                <th className="table-header-9">Slot No</th>
                <th className="table-header-9">Doctor Name</th>
                <th className="table-header-9">OP No</th>
                <th className="table-header-9">Counter No.</th>
              </tr>
            </thead>
            <tbody className={`table-body-10 ${isTransitioning ? 'page-transition' : ''}`}>
              {getCurrentPageData().map((item) => (
                <tr key={item.sno} className="table-row-11">
                  <td className="table-cell-12">{item.sno}</td>
                  <td className="table-cell-12">{item.patientId}</td>
                  <td className="table-cell-12">{item.patientName}</td>
                  {/* <td className="table-cell-12">
                    <span className={`status-badge-13 ${
                      item.status === 'Waiting' ? 'status-waiting' :
                      item.status === 'In Progress' ? 'status-progress' :
                      'status-completed'
                    }`}>
                      {item.status}
                    </span>
                  </td> */}
                  <td className={`table-cell-12 ${item.visitType === 'Emergency' ? 'emergency-text' : ''}`}>
                    {item.visitType}
                  </td>
                  <td className="table-cell-12">{item.speciality}</td>

                  <td className="table-cell-12">{item.slotNo}</td>
                  <td className="table-cell-12">{item.doctorName}</td>
                  <td className="table-cell-12">{item.OPNo}</td>
                  <td className="table-cell-12 counter-text">{item.counterNo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CounterQueListBoard;
