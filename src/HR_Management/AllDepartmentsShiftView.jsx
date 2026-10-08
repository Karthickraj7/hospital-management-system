// import React, { useRef, useState } from "react";

// const formatDate = (dateStr) => {
//   const d = new Date(dateStr);
//   if (isNaN(d)) return { day: "", date: "" };
//   const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
//   const day = days[d.getDay()];
//   const dd = String(d.getDate()).padStart(2, "0");
//   const mm = String(d.getMonth() + 1).padStart(2, "0");
//   const yyyy = d.getFullYear();
//   return { day, date: `${dd}/${mm}/${yyyy}` };
// };

// const ShiftScheduleTable = ({ departmentsData }) => {
//   const tableRef = useRef();
//   const [showTable, setShowTable] = useState(false);

//   if (!Array.isArray(departmentsData)) return <p>No department data found</p>;

//   const handlePrint = () => {
//     setShowTable(true); // show the table for printing

//     setTimeout(() => {
//       if (!tableRef.current) return;
//       const printContents = tableRef.current.innerHTML;
//       const newWin = window.open("", "_blank");
//       newWin.document.write(`
//         <html>
//           <head>
//             <title>Print Shift Schedule</title>
//             <style>
//               table { width: 100%; border-collapse: collapse; font-size: 12px; }
//               th, td { border: 1px solid #000; padding: 4px; text-align: center; }
//             </style>
//           </head>
//           <body>${printContents}</body>
//         </html>
//       `);
//       newWin.document.close();
//       newWin.focus();
//       newWin.print();
//       newWin.close();

//       setShowTable(false); // hide table after printing
//     }, 100); // small delay to ensure table renders
//   };

//   return (
//     <div>
//       <div style={{ marginBottom: "15px" }}>
//         <button onClick={handlePrint} style={{ padding: "6px 12px", cursor: "pointer" }}>
//           🖨️ Print Table Only
//         </button>
//       </div>

//       {showTable && (
//         <div ref={tableRef}>
//           {departmentsData.map((dept, deptIndex) => {
//             const assignShifts = dept?.DepartmentAssignShift || [];
//             const employees = dept?.Employees || [];
//             const uniqueDates = [...new Set(assignShifts.map((s) => s.ShiftDate))].sort();

//             return (
//               <div key={deptIndex} style={{ marginBottom: "40px" }}>
//                 <h2>{dept?.Department_Name || "Unknown Dept"} - Shift Schedule</h2>

//                 <table>
//                   <thead>
//                     <tr>
//                       <th>S.No</th>
//                       <th>Employee Name</th>
//                       {uniqueDates.map((d, i) => {
//                         const { day, date } = formatDate(d);
//                         return (
//                           <th key={i}>
//                             {day} <br /> {date}
//                           </th>
//                         );
//                       })}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {employees.map((emp, empIndex) => (
//                       <tr key={emp.Employee_ID || empIndex}>
//                         <td>{empIndex + 1}</td>
//                         <td style={{textAlign:'left'}}>{`${emp?.Tittle || ""} ${emp?.First_Name || ""} ${emp?.Last_Name || ""}`}</td>
//                         {uniqueDates.map((d, i) => {
//                           const assign = assignShifts.find(
//                             (s) => s.Employee_ID === emp.Employee_ID && s.ShiftDate === d
//                           );
//                           return <td key={i}>{assign ? assign.ShiftName : "OFF"}</td>;
//                         })}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ShiftScheduleTable;
import React, { useRef, useState } from "react";

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  if (isNaN(d)) return { day: "", date: "" };
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const day = days[d.getDay()];
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return { day, date: `${dd}/${mm}/${yyyy}` };
};

const ShiftScheduleTable = ({ departmentsData }) => {
  const tableRef = useRef();
  const [showTable, setShowTable] = useState(false);

  if (!Array.isArray(departmentsData)) return <p>No department data found</p>;

  const handlePrint = () => {
    setShowTable(true);

    setTimeout(() => {
      if (!tableRef.current) return;

      const printContents = tableRef.current.innerHTML;
      const newWin = window.open("", "_blank");
      newWin.document.write(`
        <html>
          <head>
            <title>Print Shift Schedule</title>
            <style>
              @media print {
                body { font-family: Arial, sans-serif; font-size: 12px; margin: 8mm; }
                table { width: 100%; border-collapse: collapse; font-size: 12px; }
                th, td { border: 1px solid #000; padding: 4px; text-align: center; word-break: break-word; }
                th { font-weight: bold; }
                .department { page-break-after: always; }
                .department:last-child { page-break-after: auto; }
              }
            </style>
          </head>
          <body>${printContents}</body>
        </html>
      `);
      newWin.document.close();
      newWin.focus();
      newWin.print();
      newWin.close();

      setShowTable(false); // hide table after printing
    }, 100);
  };

  return (
    <div>
      <div style={{ marginBottom: "15px" }}>
        <button onClick={handlePrint} style={{ padding: "6px 12px", cursor: "pointer" }}>
          🖨️ Print Table Only
        </button>
      </div>

      {showTable && (
        <div ref={tableRef}>
          {departmentsData.map((dept, deptIndex) => {
            const assignShifts = dept?.DepartmentAssignShift || [];
            const employees = dept?.Employees || [];
            const uniqueDates = [...new Set(assignShifts.map((s) => s.ShiftDate))].sort();

            return (
              <div key={deptIndex} className="department" style={{ marginBottom: "40px" }}>
                <h2 style={{ marginBottom: "10px" }}>
                  {dept?.Department_Name || "Unknown Dept"} - Shift Schedule
                </h2>

                <table>
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Employee Name</th>
                      {uniqueDates.map((d, i) => {
                        const { day, date } = formatDate(d);
                        return (
                          <th key={i}>
                            {day} <br /> {date}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp, empIndex) => (
                      <tr key={emp.Employee_ID || empIndex}>
                        <td>{empIndex + 1}</td>
                        <td style={{textAlign:'left'}}>{`${emp?.Tittle || ""} ${emp?.First_Name || ""} `}</td>
                        {uniqueDates.map((d, i) => {
                          const assign = assignShifts.find(
                            (s) => s.Employee_ID === emp.Employee_ID && s.ShiftDate === d
                          );
                          return <td key={i}>{(assign ? assign.ShiftName : "OFF").slice(0, 3) }</td>;
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShiftScheduleTable;
