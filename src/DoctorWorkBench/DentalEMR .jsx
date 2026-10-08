

// import React, { useState, useEffect, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import { IconButton } from "@mui/material";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
// import EditIcon from "@mui/icons-material/Edit";
// import AddIcon from "@mui/icons-material/Add";
// import PrintIcon from "@mui/icons-material/Print";
// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
// import ModelContainer from "../OtherComponent/ModelContainer/ModelContainer";
// import './EMR.css';

// /* ================= STATUS OPTIONS WITH COLORS ================= */
// const statusOptions = [
//   { label: "Existing", color: "#60a5fa" },
//   { label: "Planned", color: "#dc2626" },
//   { label: "In Progress", color: "#fb923c" },
//   { label: "Completed", color: "#22c55e" },
// ];

// /* ================= PROCEDURES PER CATEGORY ================= */
// const proceduresByCategory = {
//   Diagnostics: [
//     { name: "Periapical X-Ray" },
//     { name: "Bitewing X-Ray" },
//     { name: "Panoramic X-Ray" },
//     { name: "Study Model" },
//     { name: "Intraoral Scan" },
//     { name: "Photograph" },
//     { name: "Caries Detector" },
//     { name: "Pulp Test" },
//   ],
//   Preventive: [
//     { name: "Prophylaxis" },
//     { name: "Fluoride Treatment" },
//     { name: "Sealant" },
//     { name: "Oral Hygiene Instruction" },
//   ],
//   Therapy: [
//     { name: "Composite Filling" },
//     { name: "Amalgam Filling" },
//     { name: "Root Canal Treatment" },
//   ],
//   Prosth: [
//     { name: "Crown" },
//     { name: "Bridge" },
//     { name: "Veneer" },
//     { name: "Denture" },
//     { name: "Inlay/Onlay" },
//   ],
//   Surgery: [
//     { name: "Extraction" },
//     { name: "Implant Placement" },
//     { name: "Surgical Extraction" },
//     { name: "Frenectomy" },
//     { name: "Bone Graft" },
//   ],
//   Ortho: [
//     { name: "Braces" },
//     { name: "Aligners" },
//   ],
// };

// /* ================= INTERACTIVE DENTAL SVG COMPONENT ================= */
// const InteractiveDentalSVG = ({ selectedTeeth, onToothClick }) => {
//   const handleSvgClick = (e) => {
//     const target = e.target.closest('[data-key]');
//     if (target) {
//       const toothId = parseInt(target.getAttribute('data-key'));
//       onToothClick(toothId);
//     }
//   };

//   const getToothStyle = (id) => {
//     const isSelected = selectedTeeth.includes(id);
//     return {
//       transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//       cursor: 'pointer',
//       fill: isSelected ? '#3b82f6' : 'url(#toothGradient)',
//       stroke: isSelected ? '#1d4ed8' : '#cbd5e1',
//       strokeWidth: isSelected ? '1.5' : '0.8',
//       filter: isSelected ? 'drop-shadow(0px 0px 3px rgba(59, 130, 246, 0.8))' : 'none',
//     };
//   };

//   return (
//     <div style={{
//       width: '480px',
//       background: '#f8fafc',
//       padding: '20px',
//       borderRadius: '16px',
//       boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
//       border: '1px solid #e2e8f0',
//       margin: '0 auto'
//     }}>
//       <svg
//         viewBox="0 0 450 700"
//         onClick={handleSvgClick}
//         style={{ width: '100%', height: 'auto', overflow: 'visible' }}
//       >
//         <defs>
//           <radialGradient id="toothGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
//             <stop offset="0%" style={{ stopColor: '#ffffff' }} />
//             <stop offset="80%" style={{ stopColor: '#f1f5f9' }} />
//             <stop offset="100%" style={{ stopColor: '#e2e8f0' }} />
//           </radialGradient>
//           <filter id="subtleDrop" x="-20%" y="-20%" width="140%" height="140%">
//             <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
//             <feOffset dx="1" dy="1" result="offsetblur" />
//             <feComponentTransfer>
//               <feFuncA type="linear" slope="0.2" />
//             </feComponentTransfer>
//             <feMerge>
//               <feMergeNode />
//               <feMergeNode in="SourceGraphic" />
//             </feMerge>
//           </filter>
//         </defs>

//         <g id="toothLabels" style={{ pointerEvents: 'none', userSelect: 'none', fill: '#64748b', fontWeight: '600', fontFamily: 'sans-serif' }}>
//           <text transform="matrix(1 0 0 1 97.9767 402.1409)" fontSize="16px">32</text>
//           <text transform="matrix(1 0 0 1 94.7426 449.1693)" fontSize="16px">31</text>
//           <text transform="matrix(1 0 0 1 106.0002 495.5433)" fontSize="16px">30</text>
//           <text transform="matrix(1 0 0 1 118.0002 538.667)" fontSize="16px">29</text>
//           <text transform="matrix(0.9999 -1.456241e-02 1.456241e-02 0.9999 136.4086 573.5098)" fontSize="16px">28</text>
//           <text transform="matrix(1 0 0 1 157.3335 603.8164)" fontSize="14px">27</text>
//           <text transform="matrix(1 0 0 1 179.3335 623.8164)" fontSize="14px">26</text>
//           <text transform="matrix(1 0 0 1 204.6669 628.483)" fontSize="14px">25</text>
//           <text transform="matrix(1 0 0 1 231.3335 628.1497)" fontSize="14px">24</text>
//           <text transform="matrix(1 0 0 1 256.3335 619.1497)" fontSize="14px">23</text>
//           <text transform="matrix(1 0 0 1 276.3335 602.483)" fontSize="14px">22</text>
//           <text transform="matrix(1 0 0 1 286.6669 573.1497)" fontSize="16px">21</text>
//           <text transform="matrix(1 0 0 1 303.6327 538.667)" fontSize="16px">20</text>
//           <text transform="matrix(1 0 0 1 322.983 495.5432)" fontSize="16px">19</text>
//           <text transform="matrix(1 0 0 1 325.1251 449.1686)" fontSize="16px">18</text>
//           <text transform="matrix(1 0 0 1 324.0004 402.1405)" fontSize="16px">17</text>
//           <text transform="matrix(1 0 0 1 312.8534 324.1021)" fontSize="16px">16</text>
//           <text transform="matrix(1 0 0 1 315.3335 275.3333)" fontSize="16px">15</text>
//           <text transform="matrix(1 0 0 1 311.3335 236)" fontSize="16px">14</text>
//           <text transform="matrix(1 0 0 1 300.3335 200.6667)" fontSize="16px">13</text>
//           <text transform="matrix(1 0 0 1 286.6669 172)" fontSize="16px">12</text>
//           <text transform="matrix(1 0 0 1 270.2269 142.439)" fontSize="16px">11</text>
//           <text transform="matrix(1 0 0 1 247.5099 118.9722)" fontSize="16px">10</text>
//           <text transform="matrix(1 0 0 1 227.8432 112.9722)" fontSize="16px">9</text>
//           <text transform="matrix(1 0 0 1 200.1766 112.9722)" fontSize="16px">8</text>
//           <text transform="matrix(1 0 0 1 170.5099 117.6388)" fontSize="16px">7</text>
//           <text transform="matrix(1 0 0 1 148.6667 134.167)" fontSize="16px">6</text>
//           <text transform="matrix(1 0 0 1 131.3605 164.8335)" fontSize="16px">5</text>
//           <text transform="matrix(1 0 0 1 119.3927 195.6387)" fontSize="16px">4</text>
//           <text transform="matrix(1 0 0 1 103.8631 234.4391)" fontSize="16px">3</text>
//           <text transform="matrix(1 0 0 1 96.2504 275.9999)" fontSize="16px">2</text>
//           <text transform="matrix(1 0 0 1 93.9767 324.769)" fontSize="16px">1</text>
//         </g>

//         <g id="Spots" style={{ filter: 'url(#subtleDrop)' }}>
//           <polygon data-key="32" style={getToothStyle(32)} points="66.7,369.7 59,370.3 51,373.7 43.7,384.3 42.3,392 38.7,406 41,415.3 44.3,420.3 47.3,424 51.7,424.3 57.7,424 62.3,422.7 66.7,422.7 71,424.3 76.3,422.7 80.7,419.3 84.7,412.3 85.3,405 87.3,391.7 85,380 80.7,375 73.7,371.3" />
//           <polygon data-key="31" style={getToothStyle(31)} points="76,425.7 80.3,427.7 83.3,433 85.3,447.7 84.3,458.7 79.7,472.3 73,475 50.3,479.7 46.7,476.7 37.7,446.3 39.7,438.3 43.3,432 49,426.7 56,424.7 65,424.7" />
//           <polygon data-key="30" style={getToothStyle(30)} points="78.7,476 85,481 90.3,488.3 96.3,499.3 97.7,511.3 93,522 86,526.3 67,533 60.3,529.7 56.3,523.7 51.7,511 47.7,494.7 47.7,488.3 50.3,483.3 55,479.7 67,476.7" />
//           <polygon data-key="29" style={getToothStyle(29)} points="93.3,525 99.3,527.3 108.3,536 114,546.7 115.7,559.3 114.3,567.3 106.3,573 98.3,578.3 88,579 82,575 75,565 69.3,552.3 67.3,542 69.7,536 74.3,531.7 84.3,528.3" />
//           <path data-key="28" style={getToothStyle(28)} d="M117.3,569.7l7.7,1.3l6.3,3.7l6.3,7.7l4,8.3L144,602l-1.3,6.7l-6.7,6.7l-7.7,3.3l-7.3-1l-7-3l-7.3-7l-5-9l-2-10c0,0-0.7-7,0.3-7.3c1-0.3,5.3-6.7,5.3-6.7l9-5H117.3z" />
//           <polygon data-key="27" style={getToothStyle(27)} points="155.7,611 160.3,615.3 165,624.7 161.7,634.3 156,641.3 149,644 140.7,644.3 133.3,641.3 128.7,634.7 128.7,629 132.7,621.3 137.7,615 143.7,611 149.7,610" />
//           <polygon data-key="26" style={getToothStyle(26)} points="178.3,627 186,629 187.7,633.7 188.7,644 189,657 189.3,662.7 186.3,663.7 176.7,663 168,656.3 159.3,649.7 156.7,644 162,639.3" />
//           <polygon data-key="25" style={getToothStyle(25)} points="214,637 218,642.7 223,654.3 225.7,664 225.3,666.3 219,668.3 206.7,668 196,665.7 190.3,662.7 193,657.3 199.7,647.3 207,638 210.7,635.5" />
//           <path data-key="24" style={getToothStyle(24)} d="M235.3,637c0,0,3-2,4-2.3c1-0.3,4.3,0,4.3,0l5,4.3l5.3,7.3l3.3,6.7l2,7.3l-2,3l-7.7,2.7l-10,0.3h-10l-2-6.7l2.7-7.3L235.3,637z" />
//           <polygon data-key="23" style={getToothStyle(23)} points="269.3,624 273.3,624.7 275.3,627.3 279,628.7 281.7,631.3 285.3,634.7 289.3,638.3 292,643.3 291.3,650 287,655 280.7,658.7 272,660 265,660.7 261.3,657.3 261.7,650 263.7,637 264.3,627" />
//           <polygon data-key="22" style={getToothStyle(22)} points="286,629.3 286.7,633.3 291.3,638.7 295.3,642.3 302,644 311.7,643.3 318.3,637.7 321,630 321.3,620.3 317,614.3 308,608 298.3,607 291,609.3 287,612.3 286.7,617.7 287.3,624.7" />
//           <polygon data-key="21" style={getToothStyle(21)} points="331,565.7 335,565.7 341.3,568 349.3,574.3 352.3,578.3 352.7,583.7 350.7,593.7 342.7,604 337.7,609 328,612.7 320,613.3 315,611 308.3,604.7 306.7,598 307.3,591.3 309,584.7 312.7,578.3 318.3,571.7" />
//           <polygon data-key="20" style={getToothStyle(20)} points="334,561 338.7,566 346,570 354.7,573 360.7,571.7 368,568.3 383,545 385.3,532.7 381.3,524.3 374,520.7 363.7,516.3 356.3,515.3 351.3,518.3 346.3,524 340.3,534.3 336,546.7" />
//           <path data-key="19" style={getToothStyle(19)} d="M398,470l4.7,5.7l3,7.7l-0.3,11.7l-6,13.3l-6.3,10.3l-8.3,4.3l-7.3-1l-16.3-7c0,0-2.7-6-3-7.3 c-0.3-1.3-0.3-11-0.3-11l3.7-14.3l3.7-7l5.3-6.7l8-2l9.7-0.7L398,470z" />
//           <polygon data-key="18" style={getToothStyle(18)} points="410,435 408.7,447.3 404.3,459 399.3,467.7 393.7,468 388,466 376.3,466.3 369.7,466.3 365.7,460 364.7,444.7 366.3,434.3 369,424 378.3,417.3 386.7,415.7 391.7,415.3 396,418 399.7,418 404,421.7 407.7,427.3" />
//           <polygon data-key="17" style={getToothStyle(17)} points="371.7,417 378.3,417.3 386.7,415.7 391.7,415.3 397.3,417.7 402.7,416.3 407.7,409.7 406.7,395 401,377.7 397.3,373 390.7,367.3 380,365 373,366.7 367.3,369 364,374.3 360,389 363.3,401.3 367.7,412.3" />
//           <polygon data-key="16" style={getToothStyle(16)} points="404.3,293.7 408.7,299.3 408.7,308 405.3,318.7 401,329.7 392.3,339.7 382.7,341 369,339.7 359,335 354.7,327.7 354.3,316 358.3,304 363.7,294 368.7,294.7 378.7,296 389,296" />
//           <polygon data-key="15" style={getToothStyle(15)} points="362.3,247.3 357.3,251 357,259.3 358.7,268 359.7,279.7 361.3,286.7 365,291.7 371,294.3 392,295 404.3,293.7 410,280.7 412,263.3 407.3,246.7 401,240.3 396,239.7 389.3,243" />
//           <polygon data-key="14" style={getToothStyle(14)} points="359.7,243.7 350.7,224 345.7,211.7 348.7,205 358.3,202.7 375.7,197 388.7,193 393,196 399.3,207 401.3,222.7 400,234.3 394.7,240.7 381.7,244.7 371,246" />
//           <polygon data-key="13" style={getToothStyle(13)} points="386,188.7 383.3,192.7 377.7,196 356.3,203.3 345.7,202.3 341.7,199.7 338.7,196.3 335,188.7 332,177 333.7,169.7 338,164.7 346.3,161 353.7,156.7 360.3,150.3 364,151 370.7,156.3 376.3,164.3 380,170.3 383.3,178.3" />
//           <polygon data-key="12" style={getToothStyle(12)} points="358.7,134.3 360.3,145.7 357.3,152.7 352,157.3 346.3,161 336,164 329.7,163.3 321.7,157.7 314.3,149 310.7,139.3 310,133.7 312.3,127 318.3,125.7 326,122 332.7,116 334.7,114.3 337.7,117.3 343.3,119.7 348.7,122.7 354.3,127.7" />
//           <polygon data-key="11" style={getToothStyle(11)} points="336,93.3 337.7,100 336,104.7 332.7,113.7 324.3,121.3 315.3,125.7 306.3,126 297.3,120.3 294,112 295.7,102.7 299,95 303.3,90 309.3,88 316.3,87.3 322.7,87.3 328,88.3" />
//           <polygon data-key="10" style={getToothStyle(10)} points="310.3,83.3 298,90.7 286,95 276.3,98.3 270.3,93.3 269,82.7 269,69.3 270,58.7 274.7,54.7 282,53 287.7,54.7 297.3,60.3 304,64.3 308.7,68.7 312.3,74 313,81" />
//           <polygon data-key="9" style={getToothStyle(9)} points="273.3,52 266.7,61.7 258.3,72.3 253.3,79.7 247.3,85 239,87.7 232.3,82 224.7,67 222,58.3 219,50 220,44.3 224.3,40.3 230,38.7 237.3,38.7 253,39.3 258.7,41.3 264.3,43.7 268.3,45.7" />
//           <polygon data-key="8" style={getToothStyle(8)} points="176.7,46.3 195,41 203.3,39.7 209.3,40.7 215.3,42.7 217,47 217.7,54.3 215,64.7 212.3,75.7 208,83 201.7,85.7 195.7,86.7 189.7,83.3 183.7,74.7 175,62 171.7,54 172.7,49.7" />
//           <path data-key="7" style={getToothStyle(7)} d="M167,55l6.7,6.3L174,68l0.3,8l1,10l-2,8.3l-4.7,4.3l-6.7,1.7l-8-4.3l-7.3-4.7 l-9.3-4.7 l-6.3-5.3l-1-4.3l1.3-5c0,0,3.3-6,4.3-6s5.3-6,6.3-6s10.3-4.7,10.3-4.7L167,55z" />
//           <polygon data-key="6" style={getToothStyle(6)} points="126.3,82 134.3,86.3 139.7,92.3 144.7,104.7 145.7,115.3 143.7,120.7 138,124.3 131.3,125 121,125 114.7,119.3 110.3,112.3 108.3,104.7 108.7,94.7 110.7,88.7 116,84" />
//           <polygon data-key="5" style={getToothStyle(5)} points="109,116.7 116,122.3 122.7,125.3 127.7,131.3 128.3,141 122.7,153.7 114,161.7 105.7,162.3 96.7,161 85.7,156 82,150 81,139.3 86.3,128 93,121.3 100.7,117.3" />
//           <polygon data-key="4" style={getToothStyle(4)} points="82,155.3 102.3,163.3 108.7,172 109.3,182 104.7,192 100,199 94,203.7 85.3,201.7 73.7,201 64.3,196.7 60.3,190.7 59,183.3 61.7,175.3 66.3,167.7 71.3,161.3" />
//           <path data-key="3" style={getToothStyle(3)} d="M92.7,207.3l2,5.3l-1.7,8l-1.7,9l-4,8l-5,7.7l-11,4.7l-13.7,0.7l-10-7l-1.7-5L45,220l3-10.7 l5-7.3l4-3.3l4.7-2.7l5.3,3.7l6.7,1.3c0,0,7.3,1.3,9.3,1.3s6.3,0.7,6.3,0.7L92.7,207.3z" />
//           <polygon data-key="2" style={getToothStyle(2)} points="79.7,288.3 71.7,291 55,293 40.3,291.3 36,287 33,273.7 36.3,260 42,248.7 44.7,244.7 50.3,246.7 56,249 65.3,250.7 74,249.7 80.3,249.7 82.3,254 85.3,259.3 87,267.7 87.7,274.7 85.3,282.7" />
//           <polygon data-key="1" style={getToothStyle(1)} points="33,314.3 38,325.7 45.7,335.7 55.7,341.7 64.7,343 73.3,340 77.7,335.7 81.3,326.3 82,314.3 81.3,302 80.7,292.7 73.7,292 51.3,293.7 38.7,293.7 34,298 31.7,302.3 32,311" />
//         </g>
//       </svg>

//       <div style={{
//         marginTop: '15px',
//         paddingTop: '15px',
//         borderTop: '1px solid #e2e8f0',
//         display: 'flex',
//         justifyContent: 'space-between',
//         fontSize: '12px',
//         color: '#64748b'
//       }}>
//         <span>Universal Numbering System</span>
//         <div style={{ display: 'flex', gap: '10px' }}>
//           <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
//             <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></div> Selected
//           </span>
//           <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
//             <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e2e8f0', border: '1px solid #cbd5e1' }}></div> Healthy
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// const DentalEMR = () => {
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const userRecord = useSelector((state) => state.userRecord?.UserData);
//   const dispatch = useDispatch();
//   const DoctorWorkbenchNavigation = useSelector((state) => state.Frontoffice?.DoctorWorkbenchNavigation);
//   const IP_DoctorWorkbenchNavigation = useSelector((state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation);

//   const [openModal, setOpenModal] = useState(false);
//   const [isGetData, setIsGetData] = useState(false);
//   const [isViewMode, setIsViewMode] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [gridData, setGridData] = useState([]);
//   const [formData, setFormData] = useState({
//     Id: null,
//     Procedures: "",
//     Existing: "",
//     Planned: "",
//     InProgress: "",
//     Completed: "",
//     Status: "",
//     Teeth: "",
//     Qty: "",
//     ChooseDocument: null,
//   });

//   const [activeTab, setActiveTab] = useState("Chart");
//   const [category, setCategory] = useState("Diagnostics");
//   const [status, setStatus] = useState("Planned");
//   const [selectedTeeth, setSelectedTeeth] = useState([]);
//   const [selectedProcedure, setSelectedProcedure] = useState(null);
//   const [procedures, setProcedures] = useState([]);
//   const [isStatusOpen, setIsStatusOpen] = useState(false);

//   const toggleTooth = (number) => {
//     setSelectedTeeth((prev) =>
//       prev.includes(number)
//         ? prev.filter((t) => t !== number)
//         : [...prev, number]
//     );
//   };

//   const selectProcedure = (procedureName) => {
//     setSelectedProcedure(procedureName);
//   };

//   const applyProcedure = () => {
//     if (selectedTeeth.length === 0 || !selectedProcedure) {
//       alert("Please select at least one tooth and a procedure.");
//       return;
//     }
//     // const newProcedures = selectedTeeth.map((tooth) => ({
//     //   tooth,
//     //   procedures: selectedProcedure,
//     //   status,
//     //   qty: 1,
//     //   fee: 0,
//     // }));
//     const newProcedures = selectedTeeth.map((tooth) => ({
//   tooth,
//   procedures: selectedProcedure,
//   status,
//   qty: 1,
//   fee: 0,  // ← This will be editable later
// }));
//     setProcedures((prev) => [...prev, ...newProcedures]);
//     setSelectedTeeth([]);
//     setSelectedProcedure(null);
//   };

//   const updateFee = (index, newFee) => {
//     const updated = [...procedures];
//     updated[index].fee = Number(newFee) || 0;
//     setProcedures(updated);
//   };

//   const totalAmount = procedures.reduce((sum, p) => sum + p.fee, 0);
//   const currentStatusColor = statusOptions.find((s) => s.label === status)?.color || "#dc2626";
//   const isPlanned = status === "Planned";
//   const currentProcedures = proceduresByCategory[category] || [];

//   const GeneralEvaluationColumns = [
//     { key: "id", name: "S.No", width: 60 },
//     { key: "created_at", name: "Date", width: 100 },
//     { key: "created_by", name: "Note By", width: 100 },
//     { key: "Status", name: "Status", width: 750 },
//     { key: "Teeth", name: "Teeth", width: 650 },
//     { key: "Qty", name: "Qty", width: 200 },
//     {
//       key: "action",
//       name: "VIEW",
//       width: 120,
//       renderCell: ({ row }) => (
//         <IconButton onClick={() => handleView(row)} color="primary" title="View">
//           <VisibilityIcon />
//         </IconButton>
//       ),
//     },
//     {
//       key: "action",
//       name: "EDIT",
//       width: 120,
//       renderCell: ({ row }) => (
//         <IconButton onClick={() => handleEdit(row)} color="secondary" title="Edit">
//           <EditIcon />
//         </IconButton>
//       ),
//     },
//     {
//       key: "print",
//       name: "PRINT",
//       width: 100,
//       renderCell: ({ row }) => (
//         <IconButton
//           onClick={() => {
//             setFormData(row);
//             setTimeout(handlePrint, 200);
//           }}
//           color="primary"
//           title="Print"
//         >
//           <PrintIcon />
//         </IconButton>
//       ),
//     },
//   ];

//   const fetchData = useCallback(async () => {
//     const registrationId = DoctorWorkbenchNavigation?.RegistrationId || IP_DoctorWorkbenchNavigation?.RegistrationId;
//     if (!registrationId) return;

//     const registrationType = IP_DoctorWorkbenchNavigation?.RegistrationId ? "IP" : "OP";

//     setIsLoading(true);
//     try {
//       const response = await axios.get(`${UrlLink}Workbench/workbench_dentalemr_evaluation`, {
//         params: { RegistrationId: registrationId, RegistrationType: registrationType },
//       });

//       const formatted = response.data.map((item, index) => ({
//         ...item,
//         id: index + 1,
//         created_at: new Date(item.created_at).toLocaleDateString("en-GB", {
//           day: "2-digit",
//           month: "short",
//           year: "numeric",
//         }),
//       }));
//       setGridData(formatted);
//     } catch (err) {
//       console.error("Failed to fetch data", err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [UrlLink, DoctorWorkbenchNavigation, IP_DoctorWorkbenchNavigation]);

//   useEffect(() => {
//     const registrationId = DoctorWorkbenchNavigation?.RegistrationId || IP_DoctorWorkbenchNavigation?.RegistrationId;
//     if (!registrationId) {
//       setGridData([]);
//       return;
//     }
//     fetchData();
//   }, [DoctorWorkbenchNavigation, IP_DoctorWorkbenchNavigation, isGetData, fetchData]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
//     const maxSize = 5 * 1024 * 1024;
//     if (!file || !allowedTypes.includes(file.type) || file.size > maxSize) return;

//     const reader = new FileReader();
//     reader.onload = () => setFormData((prev) => ({ ...prev, ChooseDocument: reader.result }));
//     reader.readAsDataURL(file);
//   };

//   const dataURItoBlob = (dataURI) => {
//     const byteString = atob(dataURI.split(",")[1]);
//     const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
//     const ab = new ArrayBuffer(byteString.length);
//     const ia = new Uint8Array(ab);
//     for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
//     return new Blob([ab], { type: mimeString });
//   };

//   const getRegistrationInfo = () => {
//     const opId = DoctorWorkbenchNavigation?.RegistrationId;
//     const ipId = IP_DoctorWorkbenchNavigation?.RegistrationId;
//     if (ipId) return { registrationId: ipId, registrationType: "IP" };
//     if (opId) return { registrationId: opId, registrationType: "OP" };
//     return { registrationId: null, registrationType: null };
//   };

//   const { registrationId, registrationType } = getRegistrationInfo();
//   const patientName = DoctorWorkbenchNavigation?.PatientName || IP_DoctorWorkbenchNavigation?.PatientName || "No Patient Selected";

//   // const handleView = (data) => {
//   //   setFormData({ ...data, RegistrationId: registrationId, RegistrationType: registrationType });
//   //   setIsViewMode(true);
//   // };

//   // const handleEdit = (data) => {
//   //   setFormData({ ...data, RegistrationId: registrationId, RegistrationType: registrationType });
//   //   setIsViewMode(false);
//   // };

//   const handleEdit = (data) => {
//   setFormData({ 
//     ...data, 
//     RegistrationId: registrationId, 
//     RegistrationType: registrationType 
//   });
  
//   // ← ADD THIS LINE
//   setProcedures(data.ProcedureDetails || []);
  
//   setIsViewMode(false);
// };

// const handleView = (data) => {
//   setFormData({ 
//     ...data, 
//     RegistrationId: registrationId, 
//     RegistrationType: registrationType 
//   });
  
//   // ← ADD THIS LINE
//   setProcedures(data.ProcedureDetails || []);
  
//   setIsViewMode(true);
// };

//   const handleClear = () => {
//     setFormData({
//       Id: null,
//       Procedures: "",
//       Existing: "",
//       Planned: "",
//       InProgress: "",
//       Completed: "",
//       Status: "",
//       Teeth: "",
//       Qty: "",
//       ChooseDocument: null,
//     });
//     setIsViewMode(false);
//     setProcedures([]);
//     setSelectedTeeth([]);
//     setSelectedProcedure(null);
//   };

//   const handleSubmit = async () => {
//     if (procedures.length === 0) {
//       alert("Please add at least one procedure before submitting.");
//       return;
//     }
//     if (!registrationId || !registrationType) {
//       alert("No patient selected! Please select a patient in Doctor Workbench first.");
//       return;
//     }

//     try {
//       const formDataObj = new FormData();
//       const procedureDetails = procedures.map((p) => `${p.procedures} - Tooth ${p.tooth} (${p.status})`).join("\n");
//       const allTeeth = [...new Set(procedures.map((p) => p.tooth))].sort((a, b) => a - b).join(", ");
//       const totalQty = procedures.reduce((sum, p) => sum + p.qty, 0);
//       const primaryStatus = procedures[0]?.status || "Planned";

//       formDataObj.append("Procedures", procedureDetails);
//       formDataObj.append("Existing", formData.Existing || "");
//       formDataObj.append("Planned", formData.Planned || "");
//       formDataObj.append("InProgress", formData.InProgress || "");
//       formDataObj.append("Completed", formData.Completed || "");
//       formDataObj.append("Teeth", allTeeth);
//       formDataObj.append("Qty", totalQty);
//       formDataObj.append("Status", primaryStatus);
//       formDataObj.append("created_by", userRecord?.username || "Unknown User");
//       formDataObj.append("RegistrationId", registrationId);
//       formDataObj.append("RegistrationType", registrationType);
//       formDataObj.append("ProcedureDetails", JSON.stringify(procedures));

//       if (formData.ChooseDocument?.startsWith("data:")) {
//         const blob = dataURItoBlob(formData.ChooseDocument);
//         formDataObj.append("ChooseDocument", blob, "document.jpg");
//       }

//       const response = await axios.post(`${UrlLink}Workbench/workbench_dentalemr_evaluation`, formDataObj, {
//         headers: { "Content-Type": "multipart/form-data" },
//         timeout: 30000,
//       });

//       if (response.data.success) {
//         alert("Dental Evaluation saved successfully!");
//         handleClear();
//         setIsGetData((prev) => !prev);
//       } else {
//         alert("Save failed: " + (response.data.error || "Unknown error"));
//       }
//     } catch (error) {
//       console.error("Dental EMR Submission Error:", error);
//       alert("Error saving Dental EMR. Check console for details.");
//     }
//   };

//   const handlePrint = () => {
//     if (procedures.length === 0 && !formData.Procedures) {
//       alert("No data to print. Please add procedures or notes first.");
//       return;
//     }

//     const procedureLines = procedures.length > 0
//       ? procedures.map(p => `${p.procedures} - Tooth ${p.tooth} (${p.status})`).join("<br>")
//       : (formData.Procedures || "No procedures");

//     const teethList = procedures.length > 0
//       ? [...new Set(procedures.map(p => p.tooth))].sort((a, b) => a - b).join(", ")
//       : (formData.Teeth || "-");

//     const totalQty = procedures.length > 0
//       ? procedures.reduce((sum, p) => sum + p.qty, 0)
//       : (formData.Qty || 0);

//     const iframe = document.createElement("iframe");
//     iframe.style.display = "none";
//     document.body.appendChild(iframe);

//     const doc = iframe.contentWindow.document;
//     doc.open();
//     doc.write(`
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <meta charset="UTF-8">
//           <title>Dental EMR Evaluation</title>
//           <style>
//             body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
//             h2 { text-align: center; color: #1e40af; font-size: 28px; margin-bottom: 30px; }
//             table { width: 100%; border-collapse: collapse; margin: 20px 0; }
//             th, td { border: 1px solid #333; padding: 12px; text-align: left; vertical-align: top; }
//             th { background: #f0f9ff; width: 30%; font-weight: bold; color: #1e40af; }
//             .notes { white-space: pre-wrap; }
//             .footer { margin-top: 50px; text-align: center; font-size: 14px; color: #666; }
//           </style>
//         </head>
//         <body>
//           <div style="text-align: center; margin-bottom: 30px;">
//             <h2>Dental EMR Evaluation Summary</h2>
//           </div>
//           <p><strong>Patient:</strong> ${patientName}</p>
//           <p><strong>Date:</strong> ${new Date().toLocaleDateString("en-GB")}</p>
//           <p><strong>Noted By:</strong> ${userRecord?.username || "Unknown"}</p>
//           <table>
//             <tr><th>Procedures</th><td class="notes">${procedureLines}</td></tr>
//             <tr><th>Teeth</th><td>${teethList}</td></tr>
//             <tr><th>Total Quantity</th><td>${totalQty}</td></tr>
//             <tr><th>Existing</th><td class="notes">${formData.Existing || "-"}</td></tr>
//             <tr><th>Planned</th><td class="notes">${formData.Planned || "-"}</td></tr>
//             <tr><th>In Progress</th><td class="notes">${formData.InProgress || "-"}</td></tr>
//             <tr><th>Completed</th><td class="notes">${formData.Completed || "-"}</td></tr>
//             <tr><th>Overall Status</th><td>${formData.Status || "Planned"}</td></tr>
//              <tr><th>Total Amount</th><td>₹ ${totalAmount.toLocaleString("en-IN")}</td></tr>
//           </table>
//             <div class="total">Grand Total: ₹ ${totalAmount.toLocaleString("en-IN")}</div>
//           <div class="footer">
//             Computer-generated report • ${new Date().toLocaleString("en-GB")}
//           </div>
//         </body>
//       </html>
//     `);
//     doc.close();

//     iframe.onload = () => {
//       setTimeout(() => {
//         iframe.contentWindow.focus();
//         iframe.contentWindow.print();
//       }, 300);
//     };

//     iframe.contentWindow.onafterprint = () => {
//       setTimeout(() => document.body.removeChild(iframe), 1000);
//     };
//   };

//   const handleFileView = (data) => {
//     if (!data) return;
//     if (data.startsWith("http")) {
//       window.open(data, "_blank");
//       return;
//     }
//     let fileType = "image/jpeg";
//     if (data.includes("data:image/png")) fileType = "image/png";
//     if (data.includes("data:application/pdf")) fileType = "application/pdf";

//     dispatch({
//       type: "modelcon",
//       value: { Isopen: true, content: data, type: fileType },
//     });
//   };

//   return (
//     <>
//       <div style={{ fontFamily: "system-ui, sans-serif", padding: "20px", background: "#f9fafb" }}>
//         <div style={{ marginBottom: "20px", padding: "16px", background: "#e0f2fe", borderRadius: "8px", border: "1px solid #0ea5e9" }}>
//           <h3 style={{ margin: "0 0 8px 0", color: "#0369a1" }}>
//             Current Patient: <strong>{patientName}</strong>
//             {registrationId && (
//               <span style={{ marginLeft: "12px", fontSize: "14px", color: "#059669" }}>
//                 ({registrationType} - ID: {registrationId})
//               </span>
//             )}
//           </h3>
//         </div>

//         {!registrationId && (
//           <div style={{
//             padding: "24px",
//             margin: "20px 0",
//             backgroundColor: "#fee2e2",
//             border: "2px solid #ef4444",
//             borderRadius: "12px",
//             textAlign: "center",
//             color: "#991b1b",
//             fontSize: "20px",
//             fontWeight: "bold",
//             boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
//           }}>
//             ⚠️ No Patient Selected ⚠️<br/><br/>
//             Please <strong>go back to Doctor Workbench</strong> and <strong>click on a patient</strong> from the list first.
//           </div>
//         )}

//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
//           <div style={{ display: "flex", gap: "8px" }}>
//             <button
//               style={{
//                 padding: "8px 16px",
//                 border: "none",
//                 background: activeTab === "Chart" ? "#3b82f6" : "transparent",
//                 color: activeTab === "Chart" ? "white" : "#4b5563",
//                 borderRadius: "6px",
//                 cursor: "pointer",
//               }}
//               onClick={() => setActiveTab("Chart")}
//             >
//               Chart
//             </button>
//           </div>
//         </div>

//         <div style={{ display: "flex", gap: "8px", marginBottom: "16px", overflowX: "auto" }}>
//           {Object.keys(proceduresByCategory).map((c) => (
//             <button
//               key={c}
//               style={{
//                 padding: "8px 16px",
//                 border: "1px solid #d1d5db",
//                 background: category === c ? "#dbeafe" : "white",
//                 color: "#1e40af",
//                 borderRadius: "999px",
//                 whiteSpace: "nowrap",
//                 cursor: "pointer",
//               }}
//               onClick={() => {
//                 setCategory(c);
//                 setSelectedTeeth([]);
//                 setSelectedProcedure(null);
//               }}
//             >
//               {c}
//             </button>
//           ))}
//         </div>

//         <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
//           <div style={{ position: "relative" }}>
//             <button
//               onClick={() => setIsStatusOpen(!isStatusOpen)}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "8px",
//                 padding: "6px 14px",
//                 borderRadius: "999px",
//                 border: "none",
//                 fontWeight: "500",
//                 fontSize: "14px",
//                 cursor: "pointer",
//                 backgroundColor: isPlanned ? "#dc2626" : "#f3f4f6",
//                 color: isPlanned ? "white" : "#111827",
//               }}
//             >
//               <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: isPlanned ? "white" : currentStatusColor }} />
//               {status}
//               <ArrowDropDownIcon style={{ fontSize: 18 }} />
//             </button>
//             {isStatusOpen && (
//               <div style={{
//                 position: "absolute",
//                 top: "100%",
//                 left: 0,
//                 marginTop: "8px",
//                 background: "white",
//                 border: "1px solid #e5e7eb",
//                 borderRadius: "8px",
//                 boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
//                 zIndex: 100,
//                 minWidth: "180px",
//               }}>
//                 {statusOptions.map((opt) => (
//                   <div
//                     key={opt.label}
//                     onClick={() => {
//                       setStatus(opt.label);
//                       setIsStatusOpen(false);
//                     }}
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "10px",
//                       padding: "10px 16px",
//                       cursor: "pointer",
//                       backgroundColor: status === opt.label ? "#dbeafe" : "transparent",
//                     }}
//                   >
//                     <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: opt.color }} />
//                     {opt.label}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
//             {currentProcedures.map((proc, i) => (
//               <div
//                 key={i}
//                 onClick={() => selectProcedure(proc.name)}
//                 title={proc.name}
//                 style={{
//                   cursor: "pointer",
//                   padding: "12px",
//                   borderRadius: "8px",
//                   backgroundColor: selectedProcedure === proc.name ? "#dbeafe" : "#f3f4f6",
//                   border: selectedProcedure === proc.name ? "2px solid #3b82f6" : "none",
//                   textAlign: "center",
//                   minWidth: "80px",
//                 }}
//               >
//                 <div style={{ fontSize: "10px", color: "#4b5563" }}>{proc.name}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {activeTab === "Chart" && (
//           <div style={{ textAlign: "center", marginBottom: "30px" }}>
//             <InteractiveDentalSVG selectedTeeth={selectedTeeth} onToothClick={toggleTooth} />
//           </div>
//         )}

//         {selectedTeeth.length > 0 && (
//           <div style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             padding: "12px 16px",
//             background: "#f3f4f6",
//             borderRadius: "8px",
//             marginBottom: "20px",
//           }}>
//             <div>
//               <strong>Teeth:</strong> {selectedTeeth.sort((a, b) => a - b).join(", ")}
//               {selectedProcedure && (
//                 <span style={{ marginLeft: "20px" }}>
//                   <strong>Procedure:</strong> {selectedProcedure}
//                 </span>
//               )}
//             </div>
//             <button
//               onClick={applyProcedure}
//               disabled={!selectedProcedure}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "6px",
//                 padding: "8px 16px",
//                 background: selectedProcedure ? "#10b981" : "#9ca3af",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "8px",
//                 cursor: selectedProcedure ? "pointer" : "not-allowed",
//               }}
//             >
//               <AddIcon /> Apply
//             </button>
//           </div>
//         )}

//         {procedures.length > 0 && (
//           <div style={{ marginBottom: "30px" }}>
//             <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
//               <thead style={{ background: "#f3f4f6" }}>
//                 <tr>
//                   <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
//                   <th style={{ padding: "12px", textAlign: "left" }}>S/P</th>
//                   <th style={{ padding: "12px", textAlign: "left" }}>Teeth</th>
//                   <th style={{ padding: "12px", textAlign: "left" }}>Procedures</th>
//                   <th style={{ padding: "12px", textAlign: "left" }}>Qty</th>
//                   <th style={{ padding: "12px", textAlign: "left" }}>Fee</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {procedures.map((p, i) => (
//                   <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
//                     <td style={{ padding: "12px" }}>
//                       <span style={{
//                         display: "inline-block",
//                         width: "10px",
//                         height: "10px",
//                         borderRadius: "50%",
//                         backgroundColor: statusOptions.find((s) => s.label === p.status)?.color || "#ccc",
//                         marginRight: "8px",
//                       }} />
//                       {p.status}
//                     </td>
//                     <td style={{ padding: "12px" }}></td>
//                     <td style={{ padding: "12px" }}>{p.tooth}</td>
//                     <td style={{ padding: "12px" }}>{p.procedures}</td>
//                     <td style={{ padding: "12px" }}>{p.qty}</td>
//                     <td style={{ padding: "12px" }}>
//                       ₹ <input
//                         type="number"
//                         value={p.fee}
//                         onChange={(e) => updateFee(i, e.target.value)}
//                         style={{ width: "80px", marginLeft: "8px", padding: "4px", border: "1px solid #d1d5db", borderRadius: "4px" }}
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <div style={{
//               display: "flex",
//               justifyContent: "flex-end",
//               padding: "16px",
//               background: "#f0fdf4",
//               borderRadius: "0 0 8px 8px",
//               marginTop: "-1px",
//               fontSize: "18px",
//               fontWeight: "bold",
//               color: "#166534",
//             }}>
//               Total Amount: ₹ {totalAmount.toLocaleString("en-IN")}
//             </div>
//           </div>
//         )}

//         <div className="venkat2000-container">
//           <div className="venkat2000-header">
//             <button className="venkat2000-button" style={{ backgroundColor: 'grey' }} onClick={() => setOpenModal(true)}>
//               <VisibilityIcon />
//             </button>
//           </div>
//           {openModal && (
//             <div className="venkat2000-modal">
//               <div className="venkat2000-modal-content">
//                 <div className="venkat2000-modal-header">
//                   <h3>Evaluation Records</h3>
//                   <button style={{ padding: '8px', borderRadius: '5px' }} className="venkat2000-close-btn" onClick={() => setOpenModal(false)}>
//                     Close ✕
//                   </button>
//                 </div>
//                 <div className="venkat2000-modal-body">
//                   <ReactGrid columns={GeneralEvaluationColumns} RowData={gridData} />
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         <br />

//         <h2>{isViewMode ? "Dental EMR Summary" : "New Evaluation"}</h2>

//         <div className="venkat2000-form">
//           <label className="venkat2000-label">Procedures <span>*</span></label>
//           <textarea className="venkat2000-input" name="Procedures" rows="4" value={formData.Procedures} onChange={handleChange} readOnly={isViewMode} />

//           <label className="venkat2000-label">Existing</label>
//           <input className="venkat2000-input" name="Existing" value={formData.Existing} onChange={handleChange} readOnly={isViewMode} />

//           <label className="venkat2000-label">Planned</label>
//           <input className="venkat2000-input" name="Planned" value={formData.Planned} onChange={handleChange} readOnly={isViewMode} />

//           <label className="venkat2000-label">In Progress</label>
//           <input className="venkat2000-input" name="InProgress" value={formData.InProgress} onChange={handleChange} readOnly={isViewMode} />

//           <label className="venkat2000-label">Completed</label>
//           <input className="venkat2000-input" name="Completed" value={formData.Completed} onChange={handleChange} readOnly={isViewMode} />

//           <label className="venkat2000-label">Status</label>
//           <input className="venkat2000-input" name="Status" value={formData.Status} onChange={handleChange} readOnly={isViewMode} />

//           <label className="venkat2000-label">Teeth</label>
//           <input className="venkat2000-input" name="Teeth" value={formData.Teeth} onChange={handleChange} readOnly={isViewMode} />

//           <label className="venkat2000-label">Choose Document</label>
//           <div className="venkat2000-file">
//             <input type="file" id="ChooseDocument" className="hidden" onChange={handleFileChange} disabled={isViewMode} />
//             <label htmlFor="ChooseDocument" className="venkat2000-icon"><PhotoCameraBackIcon /></label>
//             <button className="venkat2000-icon" onClick={() => handleFileView(formData.ChooseDocument)}><VisibilityIcon /></button>
//           </div>

//           <br /><br />

//           <div className="venkat2000-button">
//             <button
//               className="venkat2000-button"
//               style={{ backgroundColor: 'grey' }}
//               onClick={handleSubmit}
//               disabled={procedures.length === 0 || !registrationId || isViewMode}
//             >
//               {procedures.length === 0 || !registrationId ? "Submit" : "Submit"}
//             </button>
//             <button className="venkat2000-button" style={{ backgroundColor: 'grey' }} onClick={handleClear}>
//               Clear
//             </button>
//             <button
//               className="venkat2000-button"
//               style={{ backgroundColor: "grey" }}
//               onClick={handlePrint}
//               disabled={procedures.length === 0 && !formData.Procedures}
//             >
//               Print
//             </button>
//           </div>
//         </div>

//         <div className="venkat2000-grid" style={{ width: "100%", marginTop: "30px" }}>
//           <ReactGrid columns={GeneralEvaluationColumns} RowData={gridData} />
//         </div>
//       </div>
//       <ModelContainer />
//     </>
//   );
// };

// export default DentalEMR;





import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import PrintIcon from "@mui/icons-material/Print";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import ModelContainer from "../OtherComponent/ModelContainer/ModelContainer";
import './EMR.css';

/* ================= STATUS OPTIONS WITH COLORS ================= */
const statusOptions = [
  { label: "Existing", color: "#60a5fa" },
  { label: "Planned", color: "#dc2626" },
  { label: "In Progress", color: "#fb923c" },
  { label: "Completed", color: "#22c55e" },
];

/* ================= PROCEDURES PER CATEGORY ================= */
const proceduresByCategory = {
  Diagnostics: [
    { name: "Periapical X-Ray" },
    { name: "Bitewing X-Ray" },
    { name: "Panoramic X-Ray" },
    { name: "Study Model" },
    { name: "Intraoral Scan" },
    { name: "Photograph" },
    { name: "Caries Detector" },
    { name: "Pulp Test" },
  ],
  Preventive: [
    { name: "Prophylaxis" },
    { name: "Fluoride Treatment" },
    { name: "Sealant" },
    { name: "Oral Hygiene Instruction" },
  ],
  Therapy: [
    { name: "Composite Filling" },
    { name: "Amalgam Filling" },
    { name: "Root Canal Treatment" },
  ],
  Prosth: [
    { name: "Crown" },
    { name: "Bridge" },
    { name: "Veneer" },
    { name: "Denture" },
    { name: "Inlay/Onlay" },
  ],
  Surgery: [
    { name: "Extraction" },
    { name: "Implant Placement" },
    { name: "Surgical Extraction" },
    { name: "Frenectomy" },
    { name: "Bone Graft" },
  ],
  Ortho: [
    { name: "Braces" },
    { name: "Aligners" },
  ],
};

/* ================= INTERACTIVE DENTAL SVG COMPONENT ================= */
const InteractiveDentalSVG = ({ selectedTeeth, onToothClick }) => {
  const handleSvgClick = (e) => {
    const target = e.target.closest('[data-key]');
    if (target) {
      const toothId = parseInt(target.getAttribute('data-key'));
      onToothClick(toothId);
    }
  };

  const getToothStyle = (id) => {
    const isSelected = selectedTeeth.includes(id);
    return {
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      fill: isSelected ? '#3b82f6' : 'url(#toothGradient)',
      stroke: isSelected ? '#1d4ed8' : '#cbd5e1',
      strokeWidth: isSelected ? '1.5' : '0.8',
      filter: isSelected ? 'drop-shadow(0px 0px 3px rgba(59, 130, 246, 0.8))' : 'none',
    };
  };

  return (
    <div style={{
      width: '480px',
      background: '#f8fafc',
      padding: '20px',
      borderRadius: '16px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e2e8f0',
      margin: '0 auto'
    }}>
      <svg
        viewBox="0 0 450 700"
        onClick={handleSvgClick}
        style={{ width: '100%', height: 'auto', overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="toothGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
            <stop offset="0%" style={{ stopColor: '#ffffff' }} />
            <stop offset="80%" style={{ stopColor: '#f1f5f9' }} />
            <stop offset="100%" style={{ stopColor: '#e2e8f0' }} />
          </radialGradient>
          <filter id="subtleDrop" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
            <feOffset dx="1" dy="1" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.2" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g id="toothLabels" style={{ pointerEvents: 'none', userSelect: 'none', fill: '#64748b', fontWeight: '600', fontFamily: 'sans-serif' }}>
          <text transform="matrix(1 0 0 1 97.9767 402.1409)" fontSize="16px">32</text>
          <text transform="matrix(1 0 0 1 94.7426 449.1693)" fontSize="16px">31</text>
          <text transform="matrix(1 0 0 1 106.0002 495.5433)" fontSize="16px">30</text>
          <text transform="matrix(1 0 0 1 118.0002 538.667)" fontSize="16px">29</text>
          <text transform="matrix(0.9999 -1.456241e-02 1.456241e-02 0.9999 136.4086 573.5098)" fontSize="16px">28</text>
          <text transform="matrix(1 0 0 1 157.3335 603.8164)" fontSize="14px">27</text>
          <text transform="matrix(1 0 0 1 179.3335 623.8164)" fontSize="14px">26</text>
          <text transform="matrix(1 0 0 1 204.6669 628.483)" fontSize="14px">25</text>
          <text transform="matrix(1 0 0 1 231.3335 628.1497)" fontSize="14px">24</text>
          <text transform="matrix(1 0 0 1 256.3335 619.1497)" fontSize="14px">23</text>
          <text transform="matrix(1 0 0 1 276.3335 602.483)" fontSize="14px">22</text>
          <text transform="matrix(1 0 0 1 286.6669 573.1497)" fontSize="16px">21</text>
          <text transform="matrix(1 0 0 1 303.6327 538.667)" fontSize="16px">20</text>
          <text transform="matrix(1 0 0 1 322.983 495.5432)" fontSize="16px">19</text>
          <text transform="matrix(1 0 0 1 325.1251 449.1686)" fontSize="16px">18</text>
          <text transform="matrix(1 0 0 1 324.0004 402.1405)" fontSize="16px">17</text>
          <text transform="matrix(1 0 0 1 312.8534 324.1021)" fontSize="16px">16</text>
          <text transform="matrix(1 0 0 1 315.3335 275.3333)" fontSize="16px">15</text>
          <text transform="matrix(1 0 0 1 311.3335 236)" fontSize="16px">14</text>
          <text transform="matrix(1 0 0 1 300.3335 200.6667)" fontSize="16px">13</text>
          <text transform="matrix(1 0 0 1 286.6669 172)" fontSize="16px">12</text>
          <text transform="matrix(1 0 0 1 270.2269 142.439)" fontSize="16px">11</text>
          <text transform="matrix(1 0 0 1 247.5099 118.9722)" fontSize="16px">10</text>
          <text transform="matrix(1 0 0 1 227.8432 112.9722)" fontSize="16px">9</text>
          <text transform="matrix(1 0 0 1 200.1766 112.9722)" fontSize="16px">8</text>
          <text transform="matrix(1 0 0 1 170.5099 117.6388)" fontSize="16px">7</text>
          <text transform="matrix(1 0 0 1 148.6667 134.167)" fontSize="16px">6</text>
          <text transform="matrix(1 0 0 1 131.3605 164.8335)" fontSize="16px">5</text>
          <text transform="matrix(1 0 0 1 119.3927 195.6387)" fontSize="16px">4</text>
          <text transform="matrix(1 0 0 1 103.8631 234.4391)" fontSize="16px">3</text>
          <text transform="matrix(1 0 0 1 96.2504 275.9999)" fontSize="16px">2</text>
          <text transform="matrix(1 0 0 1 93.9767 324.769)" fontSize="16px">1</text>
        </g>

        <g id="Spots" style={{ filter: 'url(#subtleDrop)' }}>
          <polygon data-key="32" style={getToothStyle(32)} points="66.7,369.7 59,370.3 51,373.7 43.7,384.3 42.3,392 38.7,406 41,415.3 44.3,420.3 47.3,424 51.7,424.3 57.7,424 62.3,422.7 66.7,422.7 71,424.3 76.3,422.7 80.7,419.3 84.7,412.3 85.3,405 87.3,391.7 85,380 80.7,375 73.7,371.3" />
          <polygon data-key="31" style={getToothStyle(31)} points="76,425.7 80.3,427.7 83.3,433 85.3,447.7 84.3,458.7 79.7,472.3 73,475 50.3,479.7 46.7,476.7 37.7,446.3 39.7,438.3 43.3,432 49,426.7 56,424.7 65,424.7" />
          <polygon data-key="30" style={getToothStyle(30)} points="78.7,476 85,481 90.3,488.3 96.3,499.3 97.7,511.3 93,522 86,526.3 67,533 60.3,529.7 56.3,523.7 51.7,511 47.7,494.7 47.7,488.3 50.3,483.3 55,479.7 67,476.7" />
          <polygon data-key="29" style={getToothStyle(29)} points="93.3,525 99.3,527.3 108.3,536 114,546.7 115.7,559.3 114.3,567.3 106.3,573 98.3,578.3 88,579 82,575 75,565 69.3,552.3 67.3,542 69.7,536 74.3,531.7 84.3,528.3" />
          <path data-key="28" style={getToothStyle(28)} d="M117.3,569.7l7.7,1.3l6.3,3.7l6.3,7.7l4,8.3L144,602l-1.3,6.7l-6.7,6.7l-7.7,3.3l-7.3-1l-7-3l-7.3-7l-5-9l-2-10c0,0-0.7-7,0.3-7.3c1-0.3,5.3-6.7,5.3-6.7l9-5H117.3z" />
          <polygon data-key="27" style={getToothStyle(27)} points="155.7,611 160.3,615.3 165,624.7 161.7,634.3 156,641.3 149,644 140.7,644.3 133.3,641.3 128.7,634.7 128.7,629 132.7,621.3 137.7,615 143.7,611 149.7,610" />
          <polygon data-key="26" style={getToothStyle(26)} points="178.3,627 186,629 187.7,633.7 188.7,644 189,657 189.3,662.7 186.3,663.7 176.7,663 168,656.3 159.3,649.7 156.7,644 162,639.3" />
          <polygon data-key="25" style={getToothStyle(25)} points="214,637 218,642.7 223,654.3 225.7,664 225.3,666.3 219,668.3 206.7,668 196,665.7 190.3,662.7 193,657.3 199.7,647.3 207,638 210.7,635.5" />
          <path data-key="24" style={getToothStyle(24)} d="M235.3,637c0,0,3-2,4-2.3c1-0.3,4.3,0,4.3,0l5,4.3l5.3,7.3l3.3,6.7l2,7.3l-2,3l-7.7,2.7l-10,0.3h-10l-2-6.7l2.7-7.3L235.3,637z" />
          <polygon data-key="23" style={getToothStyle(23)} points="269.3,624 273.3,624.7 275.3,627.3 279,628.7 281.7,631.3 285.3,634.7 289.3,638.3 292,643.3 291.3,650 287,655 280.7,658.7 272,660 265,660.7 261.3,657.3 261.7,650 263.7,637 264.3,627" />
          <polygon data-key="22" style={getToothStyle(22)} points="286,629.3 286.7,633.3 291.3,638.7 295.3,642.3 302,644 311.7,643.3 318.3,637.7 321,630 321.3,620.3 317,614.3 308,608 298.3,607 291,609.3 287,612.3 286.7,617.7 287.3,624.7" />
          <polygon data-key="21" style={getToothStyle(21)} points="331,565.7 335,565.7 341.3,568 349.3,574.3 352.3,578.3 352.7,583.7 350.7,593.7 342.7,604 337.7,609 328,612.7 320,613.3 315,611 308.3,604.7 306.7,598 307.3,591.3 309,584.7 312.7,578.3 318.3,571.7" />
          <polygon data-key="20" style={getToothStyle(20)} points="334,561 338.7,566 346,570 354.7,573 360.7,571.7 368,568.3 383,545 385.3,532.7 381.3,524.3 374,520.7 363.7,516.3 356.3,515.3 351.3,518.3 346.3,524 340.3,534.3 336,546.7" />
          <path data-key="19" style={getToothStyle(19)} d="M398,470l4.7,5.7l3,7.7l-0.3,11.7l-6,13.3l-6.3,10.3l-8.3,4.3l-7.3-1l-16.3-7c0,0-2.7-6-3-7.3 c-0.3-1.3-0.3-11-0.3-11l3.7-14.3l3.7-7l5.3-6.7l8-2l9.7-0.7L398,470z" />
          <polygon data-key="18" style={getToothStyle(18)} points="410,435 408.7,447.3 404.3,459 399.3,467.7 393.7,468 388,466 376.3,466.3 369.7,466.3 365.7,460 364.7,444.7 366.3,434.3 369,424 378.3,417.3 386.7,415.7 391.7,415.3 396,418 399.7,418 404,421.7 407.7,427.3" />
          <polygon data-key="17" style={getToothStyle(17)} points="371.7,417 378.3,417.3 386.7,415.7 391.7,415.3 397.3,417.7 402.7,416.3 407.7,409.7 406.7,395 401,377.7 397.3,373 390.7,367.3 380,365 373,366.7 367.3,369 364,374.3 360,389 363.3,401.3 367.7,412.3" />
          <polygon data-key="16" style={getToothStyle(16)} points="404.3,293.7 408.7,299.3 408.7,308 405.3,318.7 401,329.7 392.3,339.7 382.7,341 369,339.7 359,335 354.7,327.7 354.3,316 358.3,304 363.7,294 368.7,294.7 378.7,296 389,296" />
          <polygon data-key="15" style={getToothStyle(15)} points="362.3,247.3 357.3,251 357,259.3 358.7,268 359.7,279.7 361.3,286.7 365,291.7 371,294.3 392,295 404.3,293.7 410,280.7 412,263.3 407.3,246.7 401,240.3 396,239.7 389.3,243" />
          <polygon data-key="14" style={getToothStyle(14)} points="359.7,243.7 350.7,224 345.7,211.7 348.7,205 358.3,202.7 375.7,197 388.7,193 393,196 399.3,207 401.3,222.7 400,234.3 394.7,240.7 381.7,244.7 371,246" />
          <polygon data-key="13" style={getToothStyle(13)} points="386,188.7 383.3,192.7 377.7,196 356.3,203.3 345.7,202.3 341.7,199.7 338.7,196.3 335,188.7 332,177 333.7,169.7 338,164.7 346.3,161 353.7,156.7 360.3,150.3 364,151 370.7,156.3 376.3,164.3 380,170.3 383.3,178.3" />
          <polygon data-key="12" style={getToothStyle(12)} points="358.7,134.3 360.3,145.7 357.3,152.7 352,157.3 346.3,161 336,164 329.7,163.3 321.7,157.7 314.3,149 310.7,139.3 310,133.7 312.3,127 318.3,125.7 326,122 332.7,116 334.7,114.3 337.7,117.3 343.3,119.7 348.7,122.7 354.3,127.7" />
          <polygon data-key="11" style={getToothStyle(11)} points="336,93.3 337.7,100 336,104.7 332.7,113.7 324.3,121.3 315.3,125.7 306.3,126 297.3,120.3 294,112 295.7,102.7 299,95 303.3,90 309.3,88 316.3,87.3 322.7,87.3 328,88.3" />
          <polygon data-key="10" style={getToothStyle(10)} points="310.3,83.3 298,90.7 286,95 276.3,98.3 270.3,93.3 269,82.7 269,69.3 270,58.7 274.7,54.7 282,53 287.7,54.7 297.3,60.3 304,64.3 308.7,68.7 312.3,74 313,81" />
          <polygon data-key="9" style={getToothStyle(9)} points="273.3,52 266.7,61.7 258.3,72.3 253.3,79.7 247.3,85 239,87.7 232.3,82 224.7,67 222,58.3 219,50 220,44.3 224.3,40.3 230,38.7 237.3,38.7 253,39.3 258.7,41.3 264.3,43.7 268.3,45.7" />
          <polygon data-key="8" style={getToothStyle(8)} points="176.7,46.3 195,41 203.3,39.7 209.3,40.7 215.3,42.7 217,47 217.7,54.3 215,64.7 212.3,75.7 208,83 201.7,85.7 195.7,86.7 189.7,83.3 183.7,74.7 175,62 171.7,54 172.7,49.7" />
          <path data-key="7" style={getToothStyle(7)} d="M167,55l6.7,6.3L174,68l0.3,8l1,10l-2,8.3l-4.7,4.3l-6.7,1.7l-8-4.3l-7.3-4.7 l-9.3-4.7 l-6.3-5.3l-1-4.3l1.3-5c0,0,3.3-6,4.3-6s5.3-6,6.3-6s10.3-4.7,10.3-4.7L167,55z" />
          <polygon data-key="6" style={getToothStyle(6)} points="126.3,82 134.3,86.3 139.7,92.3 144.7,104.7 145.7,115.3 143.7,120.7 138,124.3 131.3,125 121,125 114.7,119.3 110.3,112.3 108.3,104.7 108.7,94.7 110.7,88.7 116,84" />
          <polygon data-key="5" style={getToothStyle(5)} points="109,116.7 116,122.3 122.7,125.3 127.7,131.3 128.3,141 122.7,153.7 114,161.7 105.7,162.3 96.7,161 85.7,156 82,150 81,139.3 86.3,128 93,121.3 100.7,117.3" />
          <polygon data-key="4" style={getToothStyle(4)} points="82,155.3 102.3,163.3 108.7,172 109.3,182 104.7,192 100,199 94,203.7 85.3,201.7 73.7,201 64.3,196.7 60.3,190.7 59,183.3 61.7,175.3 66.3,167.7 71.3,161.3" />
          <path data-key="3" style={getToothStyle(3)} d="M92.7,207.3l2,5.3l-1.7,8l-1.7,9l-4,8l-5,7.7l-11,4.7l-13.7,0.7l-10-7l-1.7-5L45,220l3-10.7 l5-7.3l4-3.3l4.7-2.7l5.3,3.7l6.7,1.3c0,0,7.3,1.3,9.3,1.3s6.3,0.7,6.3,0.7L92.7,207.3z" />
          <polygon data-key="2" style={getToothStyle(2)} points="79.7,288.3 71.7,291 55,293 40.3,291.3 36,287 33,273.7 36.3,260 42,248.7 44.7,244.7 50.3,246.7 56,249 65.3,250.7 74,249.7 80.3,249.7 82.3,254 85.3,259.3 87,267.7 87.7,274.7 85.3,282.7" />
          <polygon data-key="1" style={getToothStyle(1)} points="33,314.3 38,325.7 45.7,335.7 55.7,341.7 64.7,343 73.3,340 77.7,335.7 81.3,326.3 82,314.3 81.3,302 80.7,292.7 73.7,292 51.3,293.7 38.7,293.7 34,298 31.7,302.3 32,311" />
        </g>
      </svg>

      <div style={{
        marginTop: '15px',
        paddingTop: '15px',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#64748b'
      }}>
        <span>Universal Numbering System</span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></div> Selected
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e2e8f0', border: '1px solid #cbd5e1' }}></div> Healthy
          </span>
        </div>
      </div>
    </div>
  );
};

const DentalEMR = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const dispatch = useDispatch();
  const DoctorWorkbenchNavigation = useSelector((state) => state.Frontoffice?.DoctorWorkbenchNavigation);
  const IP_DoctorWorkbenchNavigation = useSelector((state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation);

  const [openModal, setOpenModal] = useState(false);
  const [isGetData, setIsGetData] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [formData, setFormData] = useState({
    Id: null,
    Procedures: "",
    Existing: "",
    Planned: "",
    InProgress: "",
    Completed: "",
    Status: "",
    Teeth: "",
    Qty: "",
    ChooseDocument: null,
  });

  const [activeTab, setActiveTab] = useState("Chart");
  const [category, setCategory] = useState("Diagnostics");
  const [status, setStatus] = useState("Planned");
  const [selectedTeeth, setSelectedTeeth] = useState([]);
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [procedures, setProcedures] = useState([]);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const toggleTooth = (number) => {
    setSelectedTeeth((prev) =>
      prev.includes(number)
        ? prev.filter((t) => t !== number)
        : [...prev, number]
    );
  };

  const selectProcedure = (procedureName) => {
    setSelectedProcedure(procedureName);
  };

  const applyProcedure = () => {
    if (selectedTeeth.length === 0 || !selectedProcedure) {
      alert("Please select at least one tooth and a procedure.");
      return;
    }
    // const newProcedures = selectedTeeth.map((tooth) => ({
    //   tooth,
    //   procedures: selectedProcedure,
    //   status,
    //   qty: 1,
    //   fee: 0,
    // }));
    const newProcedures = selectedTeeth.map((tooth) => ({
  tooth,
  procedures: selectedProcedure,
  status,
  qty: 1,
  fee: 0,  // ← This will be editable later
}));
    setProcedures((prev) => [...prev, ...newProcedures]);
    setSelectedTeeth([]);
    setSelectedProcedure(null);
  };

  const updateFee = (index, newFee) => {
    const updated = [...procedures];
    updated[index].fee = Number(newFee) || 0;
    setProcedures(updated);
  };

  const totalAmount = procedures.reduce((sum, p) => sum + p.fee, 0);
  const currentStatusColor = statusOptions.find((s) => s.label === status)?.color || "#dc2626";
  const isPlanned = status === "Planned";
  const currentProcedures = proceduresByCategory[category] || [];

  const GeneralEvaluationColumns = [
    { key: "id", name: "S.No", width: 60 },
    { key: "created_at", name: "Date", width: 100 },
    { key: "created_by", name: "Note By", width: 100 },
    { key: "Status", name: "Status", width: 750 },
    { key: "Teeth", name: "Teeth", width: 650 },
    { key: "Qty", name: "Qty", width: 200 },
    {
      key: "action",
      name: "VIEW",
      width: 120,
      renderCell: ({ row }) => (
        <IconButton onClick={() => handleView(row)} color="primary" title="View">
          <VisibilityIcon />
        </IconButton>
      ),
    },
    // {
    //   key: "action",
    //   name: "EDIT",
    //   width: 120,
    //   renderCell: ({ row }) => (
    //     <IconButton onClick={() => handleEdit(row)} color="secondary" title="Edit">
    //       <EditIcon />
    //     </IconButton>
    //   ),
    // },
    // {
    //   key: "print",
    //   name: "PRINT",
    //   width: 100,
    //   renderCell: ({ row }) => (
    //     <IconButton
    //       onClick={() => {
    //         setFormData(row);
    //         setTimeout(handlePrint, 200);
    //       }}
    //       color="primary"
    //       title="Print"
    //     >
    //       <PrintIcon />
    //     </IconButton>
    //   ),
    // },
  ];

  const fetchData = useCallback(async () => {
    const registrationId = DoctorWorkbenchNavigation?.RegistrationId || IP_DoctorWorkbenchNavigation?.RegistrationId;
    if (!registrationId) return;

    const registrationType = IP_DoctorWorkbenchNavigation?.RegistrationId ? "IP" : "OP";

    setIsLoading(true);
    try {
      const response = await axios.get(`${UrlLink}Workbench/workbench_dentalemr_evaluation`, {
        params: { RegistrationId: registrationId, RegistrationType: registrationType },
      });

      const formatted = response.data.map((item, index) => ({
        ...item,
        id: index + 1,
        created_at: new Date(item.created_at).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      }));
      setGridData(formatted);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setIsLoading(false);
    }
  }, [UrlLink, DoctorWorkbenchNavigation, IP_DoctorWorkbenchNavigation]);

  useEffect(() => {
    const registrationId = DoctorWorkbenchNavigation?.RegistrationId || IP_DoctorWorkbenchNavigation?.RegistrationId;
    if (!registrationId) {
      setGridData([]);
      return;
    }
    fetchData();
  }, [DoctorWorkbenchNavigation, IP_DoctorWorkbenchNavigation, isGetData, fetchData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024;
    if (!file || !allowedTypes.includes(file.type) || file.size > maxSize) return;

    const reader = new FileReader();
    reader.onload = () => setFormData((prev) => ({ ...prev, ChooseDocument: reader.result }));
    reader.readAsDataURL(file);
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    return new Blob([ab], { type: mimeString });
  };

  const getRegistrationInfo = () => {
    const opId = DoctorWorkbenchNavigation?.RegistrationId;
    const ipId = IP_DoctorWorkbenchNavigation?.RegistrationId;
    if (ipId) return { registrationId: ipId, registrationType: "IP" };
    if (opId) return { registrationId: opId, registrationType: "OP" };
    return { registrationId: null, registrationType: null };
  };

  const { registrationId, registrationType } = getRegistrationInfo();
  const patientName = DoctorWorkbenchNavigation?.PatientName || IP_DoctorWorkbenchNavigation?.PatientName || "No Patient Selected";

  // const handleView = (data) => {
  //   setFormData({ ...data, RegistrationId: registrationId, RegistrationType: registrationType });
  //   setIsViewMode(true);
  // };

  // const handleEdit = (data) => {
  //   setFormData({ ...data, RegistrationId: registrationId, RegistrationType: registrationType });
  //   setIsViewMode(false);
  // };

  const handleEdit = (data) => {
  setFormData({ 
    ...data, 
    RegistrationId: registrationId, 
    RegistrationType: registrationType 
  });
  
  // ← ADD THIS LINE
  setProcedures(data.ProcedureDetails || []);
  
  
  setIsViewMode(false);
};

const handleView = (data) => {
  setFormData({ 
    ...data, 
    RegistrationId: registrationId, 
    RegistrationType: registrationType 
  });
  
  // ← ADD THIS LINE
  setProcedures(data.ProcedureDetails || []);
  
  setIsViewMode(true);
};

  const handleClear = () => {
    setFormData({
      Id: null,
      Procedures: "",
      Existing: "",
      Planned: "",
      InProgress: "",
      Completed: "",
      Status: "",
      Teeth: "",
      Qty: "",
      ChooseDocument: null,
    });
    setIsViewMode(false);
    setProcedures([]);
    setSelectedTeeth([]);
    setSelectedProcedure(null);
  };

  const handleSubmit = async () => {
    if (procedures.length === 0) {
      alert("Please add at least one procedure before submitting.");
      return;
    }
    if (!registrationId || !registrationType) {
      alert("No patient selected! Please select a patient in Doctor Workbench first.");
      return;
    }

    try {
      const formDataObj = new FormData();
      const procedureDetails = procedures.map((p) => `${p.procedures} - Tooth ${p.tooth} (${p.status})`).join("\n");
      const allTeeth = [...new Set(procedures.map((p) => p.tooth))].sort((a, b) => a - b).join(", ");
      const totalQty = procedures.reduce((sum, p) => sum + p.qty, 0);
      const primaryStatus = procedures[0]?.status || "Planned";

      formDataObj.append("Procedures", procedureDetails);
      formDataObj.append("Existing", formData.Existing || "");
      formDataObj.append("Planned", formData.Planned || "");
      formDataObj.append("InProgress", formData.InProgress || "");
      formDataObj.append("Completed", formData.Completed || "");
      formDataObj.append("Teeth", allTeeth);
      formDataObj.append("Qty", totalQty);
      formDataObj.append("Status", primaryStatus);
      formDataObj.append("created_by", userRecord?.username || "Unknown User");
      formDataObj.append("RegistrationId", registrationId);
      formDataObj.append("RegistrationType", registrationType);
      formDataObj.append("ProcedureDetails", JSON.stringify(procedures));

      if (formData.ChooseDocument?.startsWith("data:")) {
        const blob = dataURItoBlob(formData.ChooseDocument);
        formDataObj.append("ChooseDocument", blob, "document.jpg");
      }

      const response = await axios.post(`${UrlLink}Workbench/workbench_dentalemr_evaluation`, formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000,
      });

      if (response.data.success) {
        alert("Dental Evaluation saved successfully!");
        handleClear();
        setIsGetData((prev) => !prev);
      } else {
        alert("Save failed: " + (response.data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Dental EMR Submission Error:", error);
      alert("Error saving Dental EMR. Check console for details.");
    }
  };

  const handlePrint = () => {
    if (procedures.length === 0 && !formData.Procedures) {
      alert("No data to print. Please add procedures or notes first.");
      return;
    }

    const procedureLines = procedures.length > 0
      ? procedures.map(p => `${p.procedures} - Tooth ${p.tooth} (${p.status})`).join("<br>")
      : (formData.Procedures || "No procedures");

    const teethList = procedures.length > 0
      ? [...new Set(procedures.map(p => p.tooth))].sort((a, b) => a - b).join(", ")
      : (formData.Teeth || "-");

    const totalQty = procedures.length > 0
      ? procedures.reduce((sum, p) => sum + p.qty, 0)
      : (formData.Qty || 0);

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Dental EMR Evaluation</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
            h2 { text-align: center; color: #1e40af; font-size: 28px; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #333; padding: 12px; text-align: left; vertical-align: top; }
            th { background: #f0f9ff; width: 30%; font-weight: bold; color: #1e40af; }
            .notes { white-space: pre-wrap; }
            .footer { margin-top: 50px; text-align: center; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 30px;">
            <h2>Dental EMR Evaluation Summary</h2>
          </div>
          <p><strong>Patient:</strong> ${patientName}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString("en-GB")}</p>
          <p><strong>Noted By:</strong> ${userRecord?.username || "Unknown"}</p>
          <table>
            <tr><th>Procedures</th><td class="notes">${procedureLines}</td></tr>
            <tr><th>Teeth</th><td>${teethList}</td></tr>
            <tr><th>Total Quantity</th><td>${totalQty}</td></tr>
            <tr><th>Existing</th><td class="notes">${formData.Existing || "-"}</td></tr>
            <tr><th>Planned</th><td class="notes">${formData.Planned || "-"}</td></tr>
            <tr><th>In Progress</th><td class="notes">${formData.InProgress || "-"}</td></tr>
            <tr><th>Completed</th><td class="notes">${formData.Completed || "-"}</td></tr>
            <tr><th>Overall Status</th><td>${formData.Status || "Planned"}</td></tr>
             <tr><th>Total Amount</th><td>₹ ${totalAmount.toLocaleString("en-IN")}</td></tr>
          </table>
            <div class="total">Grand Total: ₹ ${totalAmount.toLocaleString("en-IN")}</div>
          <div class="footer">
            Computer-generated report • ${new Date().toLocaleString("en-GB")}
          </div>
        </body>
      </html>
    `);
    doc.close();

    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      }, 300);
    };

    iframe.contentWindow.onafterprint = () => {
      setTimeout(() => document.body.removeChild(iframe), 1000);
    };
  };

  const handleFileView = (data) => {
    if (!data) return;
    if (data.startsWith("http")) {
      window.open(data, "_blank");
      return;
    }
    let fileType = "image/jpeg";
    if (data.includes("data:image/png")) fileType = "image/png";
    if (data.includes("data:application/pdf")) fileType = "application/pdf";

    dispatch({
      type: "modelcon",
      value: { Isopen: true, content: data, type: fileType },
    });
  };

  return (
    <>
      <div style={{ fontFamily: "system-ui, sans-serif", padding: "20px", background: "#f9fafb" }}>
        <div style={{ marginBottom: "20px", padding: "16px", background: "#e0f2fe", borderRadius: "8px", border: "1px solid #0ea5e9" }}>
          <h3 style={{ margin: "0 0 8px 0", color: "#0369a1" }}>
            Current Patient: <strong>{patientName}</strong>
            {registrationId && (
              <span style={{ marginLeft: "12px", fontSize: "14px", color: "#059669" }}>
                ({registrationType} - ID: {registrationId})
              </span>
            )}
          </h3>
        </div>

        {!registrationId && (
          <div style={{
            padding: "24px",
            margin: "20px 0",
            backgroundColor: "#fee2e2",
            border: "2px solid #ef4444",
            borderRadius: "12px",
            textAlign: "center",
            color: "#991b1b",
            fontSize: "20px",
            fontWeight: "bold",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}>
            ⚠️ No Patient Selected ⚠️<br/><br/>
            Please <strong>go back to Doctor Workbench</strong> and <strong>click on a patient</strong> from the list first.
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              style={{
                padding: "8px 16px",
                border: "none",
                background: activeTab === "Chart" ? "#3b82f6" : "transparent",
                color: activeTab === "Chart" ? "white" : "#4b5563",
                borderRadius: "6px",
                cursor: "pointer",
              }}
              onClick={() => setActiveTab("Chart")}
            >
              Chart
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", overflowX: "auto" }}>
          {Object.keys(proceduresByCategory).map((c) => (
            <button
              key={c}
              style={{
                padding: "8px 16px",
                border: "1px solid #d1d5db",
                background: category === c ? "#dbeafe" : "white",
                color: "#1e40af",
                borderRadius: "999px",
                whiteSpace: "nowrap",
                cursor: "pointer",
              }}
              onClick={() => {
                setCategory(c);
                setSelectedTeeth([]);
                setSelectedProcedure(null);
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "999px",
                border: "none",
                fontWeight: "500",
                fontSize: "14px",
                cursor: "pointer",
                backgroundColor: isPlanned ? "#dc2626" : "#f3f4f6",
                color: isPlanned ? "white" : "#111827",
              }}
            >
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: isPlanned ? "white" : currentStatusColor }} />
              {status}
              <ArrowDropDownIcon style={{ fontSize: 18 }} />
            </button>
            {isStatusOpen && (
              <div style={{
                position: "absolute",
                top: "100%",
                left: 0,
                marginTop: "8px",
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                zIndex: 100,
                minWidth: "180px",
              }}>
                {statusOptions.map((opt) => (
                  <div
                    key={opt.label}
                    onClick={() => {
                      setStatus(opt.label);
                      setIsStatusOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 16px",
                      cursor: "pointer",
                      backgroundColor: status === opt.label ? "#dbeafe" : "transparent",
                    }}
                  >
                    <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: opt.color }} />
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {currentProcedures.map((proc, i) => (
              <div
                key={i}
                onClick={() => selectProcedure(proc.name)}
                title={proc.name}
                style={{
                  cursor: "pointer",
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundColor: selectedProcedure === proc.name ? "#dbeafe" : "#f3f4f6",
                  border: selectedProcedure === proc.name ? "2px solid #3b82f6" : "none",
                  textAlign: "center",
                  minWidth: "80px",
                }}
              >
                <div style={{ fontSize: "10px", color: "#4b5563" }}>{proc.name}</div>
              </div>
            ))}
          </div>
        </div>

        {activeTab === "Chart" && (
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <InteractiveDentalSVG selectedTeeth={selectedTeeth} onToothClick={toggleTooth} />
          </div>
        )}

        {selectedTeeth.length > 0 && (
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 16px",
            background: "#f3f4f6",
            borderRadius: "8px",
            marginBottom: "20px",
          }}>
            <div>
              <strong>Teeth:</strong> {selectedTeeth.sort((a, b) => a - b).join(", ")}
              {selectedProcedure && (
                <span style={{ marginLeft: "20px" }}>
                  <strong>Procedure:</strong> {selectedProcedure}
                </span>
              )}
            </div>
            <button
              onClick={applyProcedure}
              disabled={!selectedProcedure}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                background: selectedProcedure ? "#10b981" : "#9ca3af",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: selectedProcedure ? "pointer" : "not-allowed",
              }}
            >
              <AddIcon /> Apply
            </button>
          </div>
        )}

        {procedures.length > 0 && (
          <div style={{ marginBottom: "30px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <thead style={{ background: "#f3f4f6" }}>
                <tr>
                  <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>S/P</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Teeth</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Procedures</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Qty</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Fee</th>
                </tr>
              </thead>
              <tbody>
                {procedures.map((p, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "12px" }}>
                      <span style={{
                        display: "inline-block",
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: statusOptions.find((s) => s.label === p.status)?.color || "#ccc",
                        marginRight: "8px",
                      }} />
                      {p.status}
                    </td>
                    <td style={{ padding: "12px" }}></td>
                    <td style={{ padding: "12px" }}>{p.tooth}</td>
                    <td style={{ padding: "12px" }}>{p.procedures}</td>
                    <td style={{ padding: "12px" }}>{p.qty}</td>
                    <td style={{ padding: "12px" }}>
                      ₹ <input
                        type="number"
                        value={p.fee}
                        onChange={(e) => updateFee(i, e.target.value)}
                        style={{ width: "80px", marginLeft: "8px", padding: "4px", border: "1px solid #d1d5db", borderRadius: "4px" }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{
              display: "flex",
              justifyContent: "flex-end",
              padding: "16px",
              background: "#f0fdf4",
              borderRadius: "0 0 8px 8px",
              marginTop: "-1px",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#166534",
            }}>
              Total Amount: ₹ {totalAmount.toLocaleString("en-IN")}
            </div>
          </div>
        )}

        <div className="venkat2000-container">
          <div className="venkat2000-header">
            <button className="venkat2000-button" style={{ backgroundColor: 'grey' }} onClick={() => setOpenModal(true)}>
              <VisibilityIcon />
            </button>
          </div>
          {openModal && (
            <div className="venkat2000-modal">
              <div className="venkat2000-modal-content">
                <div className="venkat2000-modal-header">
                  <h3>Evaluation Records</h3>
                  <button style={{ padding: '8px', borderRadius: '5px' }} className="venkat2000-close-btn" onClick={() => setOpenModal(false)}>
                    Close ✕
                  </button>
                </div>
                <div className="venkat2000-modal-body">
                  <ReactGrid columns={GeneralEvaluationColumns} RowData={gridData} />
                </div>
              </div>
            </div>
          )}
        </div>

        <br />

        <h2>{isViewMode ? "Dental EMR Summary" : "New Evaluation"}</h2>

        <div className="venkat2000-form">
          <label className="venkat2000-label">Procedures <span>*</span></label>
          <textarea className="venkat2000-input" name="Procedures" rows="6" value={formData.Procedures} onChange={handleChange} readOnly={isViewMode} />

          <label className="venkat2000-label">Existing</label>
          <input className="venkat2000-input" name="Existing" value={formData.Existing} onChange={handleChange} readOnly={isViewMode} />

          <label className="venkat2000-label">Planned</label>
          <input className="venkat2000-input" name="Planned" value={formData.Planned} onChange={handleChange} readOnly={isViewMode} />

          <label className="venkat2000-label">In Progress</label>
          <input className="venkat2000-input" name="InProgress" value={formData.InProgress} onChange={handleChange} readOnly={isViewMode} />

          <label className="venkat2000-label">Completed</label>
          <input className="venkat2000-input" name="Completed" value={formData.Completed} onChange={handleChange} readOnly={isViewMode} />

          <label className="venkat2000-label">Status</label>
          <input className="venkat2000-input" name="Status" value={formData.Status} onChange={handleChange} readOnly={isViewMode} />

          <label className="venkat2000-label">Teeth</label>
          <input className="venkat2000-input" name="Teeth" value={formData.Teeth} onChange={handleChange} readOnly={isViewMode} />

          <label className="venkat2000-label">Choose Document</label>
          <div className="venkat2000-file">
            <input type="file" id="ChooseDocument" className="hidden" onChange={handleFileChange} disabled={isViewMode} />
            <label htmlFor="ChooseDocument" className="venkat2000-icon"><PhotoCameraBackIcon /></label>
            <button className="venkat2000-icon" onClick={() => handleFileView(formData.ChooseDocument)}><VisibilityIcon /></button>
          </div>

          <br /><br />

          <div className="venkat2000-button">
            <button
              className="venkat2000-button"
              style={{ backgroundColor: 'grey' }}
              onClick={handleSubmit}
              disabled={procedures.length === 0 || !registrationId || isViewMode}
            >
              {procedures.length === 0 || !registrationId ? "Submit" : "Submit"}
            </button>
            <button className="venkat2000-button" style={{ backgroundColor: 'grey' }} onClick={handleClear}>
              Clear
            </button>
            <button
              className="venkat2000-button"
              style={{ backgroundColor: "grey" }}
              onClick={handlePrint}
              disabled={procedures.length === 0 && !formData.Procedures}
            >
              Print
            </button>
          </div>
        </div>

        <div className="venkat2000-grid" style={{ width: "100%", marginTop: "30px" }}>
          <ReactGrid columns={GeneralEvaluationColumns} RowData={gridData} />
        </div>
      </div>
      <ModelContainer />
    </>
  );
};

export default DentalEMR;





// // import React, { useState, useEffect, useCallback } from "react";
// import React, { useState, useEffect, useCallback, useRef } from "react";

// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import { IconButton } from "@mui/material";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
// import EditIcon from "@mui/icons-material/Edit";
// import AddIcon from "@mui/icons-material/Add";
// import PrintIcon from "@mui/icons-material/Print";
// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
// import ModelContainer from "../OtherComponent/ModelContainer/ModelContainer";
// import './EMR.css';
// import SignatureCanvas from "react-signature-canvas";
// // import { useRef } from "react";

// /* ================= STATUS OPTIONS WITH COLORS ================= */
// const statusOptions = [
//   { label: "Existing", color: "#60a5fa" },
//   { label: "Planned", color: "#dc2626" },
//   { label: "In Progress", color: "#fb923c" },
//   { label: "Completed", color: "#22c55e" },
// ];

// /* ================= PROCEDURES PER CATEGORY ================= */
// const proceduresByCategory = {
//   Diagnostics: [
//     { name: "Periapical X-Ray" },
//     { name: "Bitewing X-Ray" },
//     { name: "Panoramic X-Ray" },
//     { name: "Study Model" },
//     { name: "Intraoral Scan" },
//     { name: "Photograph" },
//     { name: "Caries Detector" },
//     { name: "Pulp Test" },
//   ],
//   Preventive: [
//     { name: "Prophylaxis" },
//     { name: "Fluoride Treatment" },
//     { name: "Sealant" },
//     { name: "Oral Hygiene Instruction" },
//   ],
//   Therapy: [
//     { name: "Composite Filling" },
//     { name: "Amalgam Filling" },
//     { name: "Root Canal Treatment" },
//   ],
//   Prosth: [
//     { name: "Crown" },
//     { name: "Bridge" },
//     { name: "Veneer" },
//     { name: "Denture" },
//     { name: "Inlay/Onlay" },
//   ],
//   Surgery: [
//     { name: "Extraction" },
//     { name: "Implant Placement" },
//     { name: "Surgical Extraction" },
//     { name: "Frenectomy" },
//     { name: "Bone Graft" },
//   ],
//   Ortho: [
//     { name: "Braces" },
//     { name: "Aligners" },
//   ],
// };

// /* ================= INTERACTIVE DENTAL SVG COMPONENT ================= */
// const InteractiveDentalSVG = ({ selectedTeeth, onToothClick }) => {
//   const handleSvgClick = (e) => {
//     const target = e.target.closest('[data-key]');
//     if (target) {
//       const toothId = parseInt(target.getAttribute('data-key'));
//       onToothClick(toothId);
//     }
//   };

//   const getToothStyle = (id) => {
//     const isSelected = selectedTeeth.includes(id);
//     return {
//       transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//       cursor: 'pointer',
//       fill: isSelected ? '#3b82f6' : 'url(#toothGradient)',
//       stroke: isSelected ? '#1d4ed8' : '#cbd5e1',
//       strokeWidth: isSelected ? '1.5' : '0.8',
//       filter: isSelected ? 'drop-shadow(0px 0px 3px rgba(59, 130, 246, 0.8))' : 'none',
//     };
//   };

//   return (
//     <div style={{
//       width: '480px',
//       background: '#f8fafc',
//       padding: '20px',
//       borderRadius: '16px',
//       boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
//       border: '1px solid #e2e8f0',
//       margin: '0 auto'
//     }}>
//       <svg
//         viewBox="0 0 450 700"
//         onClick={handleSvgClick}
//         style={{ width: '100%', height: 'auto', overflow: 'visible' }}
//       >
//         <defs>
//           <radialGradient id="toothGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
//             <stop offset="0%" style={{ stopColor: '#ffffff' }} />
//             <stop offset="80%" style={{ stopColor: '#f1f5f9' }} />
//             <stop offset="100%" style={{ stopColor: '#e2e8f0' }} />
//           </radialGradient>
//           <filter id="subtleDrop" x="-20%" y="-20%" width="140%" height="140%">
//             <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
//             <feOffset dx="1" dy="1" result="offsetblur" />
//             <feComponentTransfer>
//               <feFuncA type="linear" slope="0.2" />
//             </feComponentTransfer>
//             <feMerge>
//               <feMergeNode />
//               <feMergeNode in="SourceGraphic" />
//             </feMerge>
//           </filter>
//         </defs>

//         <g id="toothLabels" style={{ pointerEvents: 'none', userSelect: 'none', fill: '#64748b', fontWeight: '600', fontFamily: 'sans-serif' }}>
//           <text transform="matrix(1 0 0 1 97.9767 402.1409)" fontSize="16px">32</text>
//           <text transform="matrix(1 0 0 1 94.7426 449.1693)" fontSize="16px">31</text>
//           <text transform="matrix(1 0 0 1 106.0002 495.5433)" fontSize="16px">30</text>
//           <text transform="matrix(1 0 0 1 118.0002 538.667)" fontSize="16px">29</text>
//           <text transform="matrix(0.9999 -1.456241e-02 1.456241e-02 0.9999 136.4086 573.5098)" fontSize="16px">28</text>
//           <text transform="matrix(1 0 0 1 157.3335 603.8164)" fontSize="14px">27</text>
//           <text transform="matrix(1 0 0 1 179.3335 623.8164)" fontSize="14px">26</text>
//           <text transform="matrix(1 0 0 1 204.6669 628.483)" fontSize="14px">25</text>
//           <text transform="matrix(1 0 0 1 231.3335 628.1497)" fontSize="14px">24</text>
//           <text transform="matrix(1 0 0 1 256.3335 619.1497)" fontSize="14px">23</text>
//           <text transform="matrix(1 0 0 1 276.3335 602.483)" fontSize="14px">22</text>
//           <text transform="matrix(1 0 0 1 286.6669 573.1497)" fontSize="16px">21</text>
//           <text transform="matrix(1 0 0 1 303.6327 538.667)" fontSize="16px">20</text>
//           <text transform="matrix(1 0 0 1 322.983 495.5432)" fontSize="16px">19</text>
//           <text transform="matrix(1 0 0 1 325.1251 449.1686)" fontSize="16px">18</text>
//           <text transform="matrix(1 0 0 1 324.0004 402.1405)" fontSize="16px">17</text>
//           <text transform="matrix(1 0 0 1 312.8534 324.1021)" fontSize="16px">16</text>
//           <text transform="matrix(1 0 0 1 315.3335 275.3333)" fontSize="16px">15</text>
//           <text transform="matrix(1 0 0 1 311.3335 236)" fontSize="16px">14</text>
//           <text transform="matrix(1 0 0 1 300.3335 200.6667)" fontSize="16px">13</text>
//           <text transform="matrix(1 0 0 1 286.6669 172)" fontSize="16px">12</text>
//           <text transform="matrix(1 0 0 1 270.2269 142.439)" fontSize="16px">11</text>
//           <text transform="matrix(1 0 0 1 247.5099 118.9722)" fontSize="16px">10</text>
//           <text transform="matrix(1 0 0 1 227.8432 112.9722)" fontSize="16px">9</text>
//           <text transform="matrix(1 0 0 1 200.1766 112.9722)" fontSize="16px">8</text>
//           <text transform="matrix(1 0 0 1 170.5099 117.6388)" fontSize="16px">7</text>
//           <text transform="matrix(1 0 0 1 148.6667 134.167)" fontSize="16px">6</text>
//           <text transform="matrix(1 0 0 1 131.3605 164.8335)" fontSize="16px">5</text>
//           <text transform="matrix(1 0 0 1 119.3927 195.6387)" fontSize="16px">4</text>
//           <text transform="matrix(1 0 0 1 103.8631 234.4391)" fontSize="16px">3</text>
//           <text transform="matrix(1 0 0 1 96.2504 275.9999)" fontSize="16px">2</text>
//           <text transform="matrix(1 0 0 1 93.9767 324.769)" fontSize="16px">1</text>
//         </g>

//         <g id="Spots" style={{ filter: 'url(#subtleDrop)' }}>
//           <polygon data-key="32" style={getToothStyle(32)} points="66.7,369.7 59,370.3 51,373.7 43.7,384.3 42.3,392 38.7,406 41,415.3 44.3,420.3 47.3,424 51.7,424.3 57.7,424 62.3,422.7 66.7,422.7 71,424.3 76.3,422.7 80.7,419.3 84.7,412.3 85.3,405 87.3,391.7 85,380 80.7,375 73.7,371.3" />
//           <polygon data-key="31" style={getToothStyle(31)} points="76,425.7 80.3,427.7 83.3,433 85.3,447.7 84.3,458.7 79.7,472.3 73,475 50.3,479.7 46.7,476.7 37.7,446.3 39.7,438.3 43.3,432 49,426.7 56,424.7 65,424.7" />
//           <polygon data-key="30" style={getToothStyle(30)} points="78.7,476 85,481 90.3,488.3 96.3,499.3 97.7,511.3 93,522 86,526.3 67,533 60.3,529.7 56.3,523.7 51.7,511 47.7,494.7 47.7,488.3 50.3,483.3 55,479.7 67,476.7" />
//           <polygon data-key="29" style={getToothStyle(29)} points="93.3,525 99.3,527.3 108.3,536 114,546.7 115.7,559.3 114.3,567.3 106.3,573 98.3,578.3 88,579 82,575 75,565 69.3,552.3 67.3,542 69.7,536 74.3,531.7 84.3,528.3" />
//           <path data-key="28" style={getToothStyle(28)} d="M117.3,569.7l7.7,1.3l6.3,3.7l6.3,7.7l4,8.3L144,602l-1.3,6.7l-6.7,6.7l-7.7,3.3l-7.3-1l-7-3l-7.3-7l-5-9l-2-10c0,0-0.7-7,0.3-7.3c1-0.3,5.3-6.7,5.3-6.7l9-5H117.3z" />
//           <polygon data-key="27" style={getToothStyle(27)} points="155.7,611 160.3,615.3 165,624.7 161.7,634.3 156,641.3 149,644 140.7,644.3 133.3,641.3 128.7,634.7 128.7,629 132.7,621.3 137.7,615 143.7,611 149.7,610" />
//           <polygon data-key="26" style={getToothStyle(26)} points="178.3,627 186,629 187.7,633.7 188.7,644 189,657 189.3,662.7 186.3,663.7 176.7,663 168,656.3 159.3,649.7 156.7,644 162,639.3" />
//           <polygon data-key="25" style={getToothStyle(25)} points="214,637 218,642.7 223,654.3 225.7,664 225.3,666.3 219,668.3 206.7,668 196,665.7 190.3,662.7 193,657.3 199.7,647.3 207,638 210.7,635.5" />
//           <path data-key="24" style={getToothStyle(24)} d="M235.3,637c0,0,3-2,4-2.3c1-0.3,4.3,0,4.3,0l5,4.3l5.3,7.3l3.3,6.7l2,7.3l-2,3l-7.7,2.7l-10,0.3h-10l-2-6.7l2.7-7.3L235.3,637z" />
//           <polygon data-key="23" style={getToothStyle(23)} points="269.3,624 273.3,624.7 275.3,627.3 279,628.7 281.7,631.3 285.3,634.7 289.3,638.3 292,643.3 291.3,650 287,655 280.7,658.7 272,660 265,660.7 261.3,657.3 261.7,650 263.7,637 264.3,627" />
//           <polygon data-key="22" style={getToothStyle(22)} points="286,629.3 286.7,633.3 291.3,638.7 295.3,642.3 302,644 311.7,643.3 318.3,637.7 321,630 321.3,620.3 317,614.3 308,608 298.3,607 291,609.3 287,612.3 286.7,617.7 287.3,624.7" />
//           <polygon data-key="21" style={getToothStyle(21)} points="331,565.7 335,565.7 341.3,568 349.3,574.3 352.3,578.3 352.7,583.7 350.7,593.7 342.7,604 337.7,609 328,612.7 320,613.3 315,611 308.3,604.7 306.7,598 307.3,591.3 309,584.7 312.7,578.3 318.3,571.7" />
//           <polygon data-key="20" style={getToothStyle(20)} points="334,561 338.7,566 346,570 354.7,573 360.7,571.7 368,568.3 383,545 385.3,532.7 381.3,524.3 374,520.7 363.7,516.3 356.3,515.3 351.3,518.3 346.3,524 340.3,534.3 336,546.7" />
//           <path data-key="19" style={getToothStyle(19)} d="M398,470l4.7,5.7l3,7.7l-0.3,11.7l-6,13.3l-6.3,10.3l-8.3,4.3l-7.3-1l-16.3-7c0,0-2.7-6-3-7.3 c-0.3-1.3-0.3-11-0.3-11l3.7-14.3l3.7-7l5.3-6.7l8-2l9.7-0.7L398,470z" />
//           <polygon data-key="18" style={getToothStyle(18)} points="410,435 408.7,447.3 404.3,459 399.3,467.7 393.7,468 388,466 376.3,466.3 369.7,466.3 365.7,460 364.7,444.7 366.3,434.3 369,424 378.3,417.3 386.7,415.7 391.7,415.3 396,418 399.7,418 404,421.7 407.7,427.3" />
//           <polygon data-key="17" style={getToothStyle(17)} points="371.7,417 378.3,417.3 386.7,415.7 391.7,415.3 397.3,417.7 402.7,416.3 407.7,409.7 406.7,395 401,377.7 397.3,373 390.7,367.3 380,365 373,366.7 367.3,369 364,374.3 360,389 363.3,401.3 367.7,412.3" />
//           <polygon data-key="16" style={getToothStyle(16)} points="404.3,293.7 408.7,299.3 408.7,308 405.3,318.7 401,329.7 392.3,339.7 382.7,341 369,339.7 359,335 354.7,327.7 354.3,316 358.3,304 363.7,294 368.7,294.7 378.7,296 389,296" />
//           <polygon data-key="15" style={getToothStyle(15)} points="362.3,247.3 357.3,251 357,259.3 358.7,268 359.7,279.7 361.3,286.7 365,291.7 371,294.3 392,295 404.3,293.7 410,280.7 412,263.3 407.3,246.7 401,240.3 396,239.7 389.3,243" />
//           <polygon data-key="14" style={getToothStyle(14)} points="359.7,243.7 350.7,224 345.7,211.7 348.7,205 358.3,202.7 375.7,197 388.7,193 393,196 399.3,207 401.3,222.7 400,234.3 394.7,240.7 381.7,244.7 371,246" />
//           <polygon data-key="13" style={getToothStyle(13)} points="386,188.7 383.3,192.7 377.7,196 356.3,203.3 345.7,202.3 341.7,199.7 338.7,196.3 335,188.7 332,177 333.7,169.7 338,164.7 346.3,161 353.7,156.7 360.3,150.3 364,151 370.7,156.3 376.3,164.3 380,170.3 383.3,178.3" />
//           <polygon data-key="12" style={getToothStyle(12)} points="358.7,134.3 360.3,145.7 357.3,152.7 352,157.3 346.3,161 336,164 329.7,163.3 321.7,157.7 314.3,149 310.7,139.3 310,133.7 312.3,127 318.3,125.7 326,122 332.7,116 334.7,114.3 337.7,117.3 343.3,119.7 348.7,122.7 354.3,127.7" />
//           <polygon data-key="11" style={getToothStyle(11)} points="336,93.3 337.7,100 336,104.7 332.7,113.7 324.3,121.3 315.3,125.7 306.3,126 297.3,120.3 294,112 295.7,102.7 299,95 303.3,90 309.3,88 316.3,87.3 322.7,87.3 328,88.3" />
//           <polygon data-key="10" style={getToothStyle(10)} points="310.3,83.3 298,90.7 286,95 276.3,98.3 270.3,93.3 269,82.7 269,69.3 270,58.7 274.7,54.7 282,53 287.7,54.7 297.3,60.3 304,64.3 308.7,68.7 312.3,74 313,81" />
//           <polygon data-key="9" style={getToothStyle(9)} points="273.3,52 266.7,61.7 258.3,72.3 253.3,79.7 247.3,85 239,87.7 232.3,82 224.7,67 222,58.3 219,50 220,44.3 224.3,40.3 230,38.7 237.3,38.7 253,39.3 258.7,41.3 264.3,43.7 268.3,45.7" />
//           <polygon data-key="8" style={getToothStyle(8)} points="176.7,46.3 195,41 203.3,39.7 209.3,40.7 215.3,42.7 217,47 217.7,54.3 215,64.7 212.3,75.7 208,83 201.7,85.7 195.7,86.7 189.7,83.3 183.7,74.7 175,62 171.7,54 172.7,49.7" />
//           <path data-key="7" style={getToothStyle(7)} d="M167,55l6.7,6.3L174,68l0.3,8l1,10l-2,8.3l-4.7,4.3l-6.7,1.7l-8-4.3l-7.3-4.7 l-9.3-4.7 l-6.3-5.3l-1-4.3l1.3-5c0,0,3.3-6,4.3-6s5.3-6,6.3-6s10.3-4.7,10.3-4.7L167,55z" />
//           <polygon data-key="6" style={getToothStyle(6)} points="126.3,82 134.3,86.3 139.7,92.3 144.7,104.7 145.7,115.3 143.7,120.7 138,124.3 131.3,125 121,125 114.7,119.3 110.3,112.3 108.3,104.7 108.7,94.7 110.7,88.7 116,84" />
//           <polygon data-key="5" style={getToothStyle(5)} points="109,116.7 116,122.3 122.7,125.3 127.7,131.3 128.3,141 122.7,153.7 114,161.7 105.7,162.3 96.7,161 85.7,156 82,150 81,139.3 86.3,128 93,121.3 100.7,117.3" />
//           <polygon data-key="4" style={getToothStyle(4)} points="82,155.3 102.3,163.3 108.7,172 109.3,182 104.7,192 100,199 94,203.7 85.3,201.7 73.7,201 64.3,196.7 60.3,190.7 59,183.3 61.7,175.3 66.3,167.7 71.3,161.3" />
//           <path data-key="3" style={getToothStyle(3)} d="M92.7,207.3l2,5.3l-1.7,8l-1.7,9l-4,8l-5,7.7l-11,4.7l-13.7,0.7l-10-7l-1.7-5L45,220l3-10.7 l5-7.3l4-3.3l4.7-2.7l5.3,3.7l6.7,1.3c0,0,7.3,1.3,9.3,1.3s6.3,0.7,6.3,0.7L92.7,207.3z" />
//           <polygon data-key="2" style={getToothStyle(2)} points="79.7,288.3 71.7,291 55,293 40.3,291.3 36,287 33,273.7 36.3,260 42,248.7 44.7,244.7 50.3,246.7 56,249 65.3,250.7 74,249.7 80.3,249.7 82.3,254 85.3,259.3 87,267.7 87.7,274.7 85.3,282.7" />
//           <polygon data-key="1" style={getToothStyle(1)} points="33,314.3 38,325.7 45.7,335.7 55.7,341.7 64.7,343 73.3,340 77.7,335.7 81.3,326.3 82,314.3 81.3,302 80.7,292.7 73.7,292 51.3,293.7 38.7,293.7 34,298 31.7,302.3 32,311" />
//         </g>
//       </svg>

//       <div style={{
//         marginTop: '15px',
//         paddingTop: '15px',
//         borderTop: '1px solid #e2e8f0',
//         display: 'flex',
//         justifyContent: 'space-between',
//         fontSize: '12px',
//         color: '#64748b'
//       }}>
//         <span>Universal Numbering System</span>
//         <div style={{ display: 'flex', gap: '10px' }}>
//           <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
//             <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></div> Selected
//           </span>
//           <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
//             <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e2e8f0', border: '1px solid #cbd5e1' }}></div> Healthy
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// const DentalEMR = () => {
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const userRecord = useSelector((state) => state.userRecord?.UserData);
//   const dispatch = useDispatch();
//   const DoctorWorkbenchNavigation = useSelector((state) => state.Frontoffice?.DoctorWorkbenchNavigation);
//   const IP_DoctorWorkbenchNavigation = useSelector((state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation);

//   const [openModal, setOpenModal] = useState(false);
//   const [isGetData, setIsGetData] = useState(false);
//   const [isViewMode, setIsViewMode] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [gridData, setGridData] = useState([]);
//   const [formData, setFormData] = useState({
//     Id: null,
//     Procedures: "",
//     Existing: "",
//     Planned: "",
//     InProgress: "",
//     Completed: "",
//     Status: "",
//     Teeth: "",
//     Qty: "",
//     ChooseDocument: null,
//     PatientSignature: "",
//   });

//   const [activeTab, setActiveTab] = useState("Chart");
//   const [category, setCategory] = useState("Diagnostics");
//   const [status, setStatus] = useState("Planned");
//   const [selectedTeeth, setSelectedTeeth] = useState([]);
//   const [selectedProcedure, setSelectedProcedure] = useState(null);
//   const [procedures, setProcedures] = useState([]);
//   const [isStatusOpen, setIsStatusOpen] = useState(false);

//   const toggleTooth = (number) => {
//     setSelectedTeeth((prev) =>
//       prev.includes(number)
//         ? prev.filter((t) => t !== number)
//         : [...prev, number]
//     );
//   };

//   const selectProcedure = (procedureName) => {
//     setSelectedProcedure(procedureName);
//   };

//   const applyProcedure = () => {
//     if (selectedTeeth.length === 0 || !selectedProcedure) {
//       alert("Please select at least one tooth and a procedure.");
//       return;
//     }
//     // const newProcedures = selectedTeeth.map((tooth) => ({
//     //   tooth,
//     //   procedures: selectedProcedure,
//     //   status,
//     //   qty: 1,
//     //   fee: 0,
//     // }));
//     const newProcedures = selectedTeeth.map((tooth) => ({
//   tooth,
//   procedures: selectedProcedure,
//   status,
//   qty: 1,
//   fee: 0,  // ← This will be editable later
// }));
//     setProcedures((prev) => [...prev, ...newProcedures]);
//     setSelectedTeeth([]);
//     setSelectedProcedure(null);
//   };

//   const updateFee = (index, newFee) => {
//     const updated = [...procedures];
//     updated[index].fee = Number(newFee) || 0;
//     setProcedures(updated);
//   };

//   const totalAmount = procedures.reduce((sum, p) => sum + p.fee, 0);
//   const currentStatusColor = statusOptions.find((s) => s.label === status)?.color || "#dc2626";
//   const isPlanned = status === "Planned";
//   const currentProcedures = proceduresByCategory[category] || [];


//   const sigRef = useRef(null);

// const handleClearSignature = () => {
//   sigRef.current.clear();
//   setFormData({ ...formData, PatientSignature: "" });
// };




//   const GeneralEvaluationColumns = [
//     { key: "id", name: "S.No", width: 60 },
//     { key: "created_at", name: "Date", width: 100 },
//     { key: "created_by", name: "Note By", width: 100 },
//     { key: "Status", name: "Status", width: 750 },
//     { key: "Teeth", name: "Teeth", width: 650 },
//     { key: "Qty", name: "Qty", width: 200 },
//     {
//       key: "action",
//       name: "VIEW",
//       width: 120,
//       renderCell: ({ row }) => (
//         <IconButton onClick={() => handleView(row)} color="primary" title="View">
//           <VisibilityIcon />
//         </IconButton>
//       ),
//     },
//     // {
//     //   key: "action",
//     //   name: "EDIT",
//     //   width: 120,
//     //   renderCell: ({ row }) => (
//     //     <IconButton onClick={() => handleEdit(row)} color="secondary" title="Edit">
//     //       <EditIcon />
//     //     </IconButton>
//     //   ),
//     // },
//     // {
//     //   key: "print",
//     //   name: "PRINT",
//     //   width: 100,
//     //   renderCell: ({ row }) => (
//     //     <IconButton
//     //       onClick={() => {
//     //         setFormData(row);
//     //         setTimeout(handlePrint, 200);
//     //       }}
//     //       color="primary"
//     //       title="Print"
//     //     >
//     //       <PrintIcon />
//     //     </IconButton>
//     //   ),
//     // },
//   ];

//   const fetchData = useCallback(async () => {
//     const registrationId = DoctorWorkbenchNavigation?.RegistrationId || IP_DoctorWorkbenchNavigation?.RegistrationId;
//     if (!registrationId) return;

//     const registrationType = IP_DoctorWorkbenchNavigation?.RegistrationId ? "IP" : "OP";

//     setIsLoading(true);
//     try {
//       const response = await axios.get(`${UrlLink}Workbench/workbench_dentalemr_evaluation`, {
//         params: { RegistrationId: registrationId, RegistrationType: registrationType },
//       });

//       const formatted = response.data.map((item, index) => ({
//         ...item,
//         id: index + 1,
//         created_at: new Date(item.created_at).toLocaleDateString("en-GB", {
//           day: "2-digit",
//           month: "short",
//           year: "numeric",
//         }),
//       }));
//       setGridData(formatted);
//     } catch (err) {
//       console.error("Failed to fetch data", err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [UrlLink, DoctorWorkbenchNavigation, IP_DoctorWorkbenchNavigation]);

//   useEffect(() => {
//     const registrationId = DoctorWorkbenchNavigation?.RegistrationId || IP_DoctorWorkbenchNavigation?.RegistrationId;
//     if (!registrationId) {
//       setGridData([]);
//       return;
//     }
//     fetchData();
//   }, [DoctorWorkbenchNavigation, IP_DoctorWorkbenchNavigation, isGetData, fetchData]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
//     const maxSize = 5 * 1024 * 1024;
//     if (!file || !allowedTypes.includes(file.type) || file.size > maxSize) return;

//     const reader = new FileReader();
//     reader.onload = () => setFormData((prev) => ({ ...prev, ChooseDocument: reader.result }));
//     reader.readAsDataURL(file);
//   };

//   const dataURItoBlob = (dataURI) => {
//     const byteString = atob(dataURI.split(",")[1]);
//     const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
//     const ab = new ArrayBuffer(byteString.length);
//     const ia = new Uint8Array(ab);
//     for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
//     return new Blob([ab], { type: mimeString });
//   };

//   const getRegistrationInfo = () => {
//     const opId = DoctorWorkbenchNavigation?.RegistrationId;
//     const ipId = IP_DoctorWorkbenchNavigation?.RegistrationId;
//     if (ipId) return { registrationId: ipId, registrationType: "IP" };
//     if (opId) return { registrationId: opId, registrationType: "OP" };
//     return { registrationId: null, registrationType: null };
//   };

//   const { registrationId, registrationType } = getRegistrationInfo();
//   const patientName = DoctorWorkbenchNavigation?.PatientName || IP_DoctorWorkbenchNavigation?.PatientName || "No Patient Selected";

//   // const handleView = (data) => {
//   //   setFormData({ ...data, RegistrationId: registrationId, RegistrationType: registrationType });
//   //   setIsViewMode(true);
//   // };

//   // const handleEdit = (data) => {
//   //   setFormData({ ...data, RegistrationId: registrationId, RegistrationType: registrationType });
//   //   setIsViewMode(false);
//   // };

// //   const handleEdit = (data) => {
// //   setFormData({ 
// //     ...data, 
// //     RegistrationId: registrationId, 
// //     RegistrationType: registrationType 
// //   });
  
// //   // ← ADD THIS LINE
// //   setProcedures(data.ProcedureDetails || []);
  
  
// //   setIsViewMode(false);
// // };

// // const handleEdit = (data) => {
// //   setFormData({
// //     ...data,
// //     PatientSignature: normalizeSignature(data.PatientSignature),
// //     RegistrationId: registrationId,
// //     RegistrationType: registrationType,
// //   });

// //   setProcedures(
// //     data.ProcedureDetails
// //       ? typeof data.ProcedureDetails === "string"
// //         ? JSON.parse(data.ProcedureDetails)
// //         : data.ProcedureDetails
// //       : []
// //   );

// //   setIsViewMode(false);
// // };


// // const handleView = (data) => {
// //   setFormData({ 
// //     ...data, 
// //     RegistrationId: registrationId, 
// //     RegistrationType: registrationType 
// //   });
  
// //   // ← ADD THIS LINE
// //   setProcedures(data.ProcedureDetails || []);
  
// //   setIsViewMode(true);
// // };
// // --------------
// // const handleView = (data) => {
// //   const parsedProcedures = data.ProcedureDetails
// //     ? typeof data.ProcedureDetails === "string"
// //       ? JSON.parse(data.ProcedureDetails)
// //       : data.ProcedureDetails
// //     : [];

// //   setFormData({
// //     ...data,
// //     PatientSignature: normalizeSignature(data.PatientSignature),
// //     RegistrationId: registrationId,
// //     RegistrationType: registrationType,
// //   });

// //   setProcedures(parsedProcedures);
// //   setIsViewMode(true);
// // };

// const handleView = (data) => {
//   const parsedProcedures = data.ProcedureDetails
//     ? typeof data.ProcedureDetails === "string"
//       ? JSON.parse(data.ProcedureDetails)
//       : data.ProcedureDetails
//     : [];

//   const normalizedSig = normalizeSignature(data.PatientSignature);

//   setFormData({
//     ...data,
//     PatientSignature: normalizedSig,
//     RegistrationId: registrationId,
//     RegistrationType: registrationType,
//   });

//   setProcedures(parsedProcedures);
//   setIsViewMode(true);

//   // Debug help – remove later
//   console.log("VIEW MODE signature (after normalize):", normalizedSig);
// };

// const handleEdit = (data) => {
//   const sig = normalizeSignature(data.PatientSignature);

//   setFormData({
//     ...data,
//     PatientSignature: sig,
//     RegistrationId: registrationId,
//     RegistrationType: registrationType,
//   });

//   setProcedures(
//     typeof data.ProcedureDetails === "string"
//       ? JSON.parse(data.ProcedureDetails)
//       : data.ProcedureDetails || []
//   );

//   setIsViewMode(false);

//   setTimeout(() => {
//     if (sigRef.current && sig) {
//       sigRef.current.clear();
//       sigRef.current.fromDataURL(sig);
//     }
//   }, 0);
// };



//   const handleClear = () => {
//     setFormData({
//       Id: null,
//       Procedures: "",
//       Existing: "",
//       Planned: "",
//       InProgress: "",
//       Completed: "",
//       Status: "",
//       Teeth: "",
//       Qty: "",
//       ChooseDocument: null,
//       PatientSignature: "",
//     });
//     setIsViewMode(false);
//     setProcedures([]);
//     setSelectedTeeth([]);
//     setSelectedProcedure(null);
//   };

//   // const handleSubmit = async () => {
//   //   if (procedures.length === 0) {
//   //     alert("Please add at least one procedure before submitting.");
//   //     return;
//   //   }
//   //   if (!registrationId || !registrationType) {
//   //     alert("No patient selected! Please select a patient in Doctor Workbench first.");
//   //     return;
//   //   }

//   //   try {
//   //     const formDataObj = new FormData();
//   //     const procedureDetails = procedures.map((p) => `${p.procedures} - Tooth ${p.tooth} (${p.status})`).join("\n");
//   //     const allTeeth = [...new Set(procedures.map((p) => p.tooth))].sort((a, b) => a - b).join(", ");
//   //     const totalQty = procedures.reduce((sum, p) => sum + p.qty, 0);
//   //     const primaryStatus = procedures[0]?.status || "Planned";

//   //     formDataObj.append("Procedures", procedureDetails);
//   //     formDataObj.append("Existing", formData.Existing || "");
//   //     formDataObj.append("Planned", formData.Planned || "");
//   //     formDataObj.append("InProgress", formData.InProgress || "");
//   //     formDataObj.append("Completed", formData.Completed || "");
//   //     formDataObj.append("Teeth", allTeeth);
//   //     formDataObj.append("Qty", totalQty);
//   //     formDataObj.append("Status", primaryStatus);
//   //     formDataObj.append("created_by", userRecord?.username || "Unknown User");
//   //     formDataObj.append("RegistrationId", registrationId);
//   //     formDataObj.append("RegistrationType", registrationType);
//   //     formDataObj.append("ProcedureDetails", JSON.stringify(procedures));
//   //     formDataObj.append("PatientSignature", formData.PatientSignature || "");

//   //     if (formData.ChooseDocument?.startsWith("data:")) {
//   //       const blob = dataURItoBlob(formData.ChooseDocument);
//   //       formDataObj.append("ChooseDocument", blob, "document.jpg");
//   //     }
//   //     // const signatureBase64 = sigRef.current.toDataURL();
//   //     // formData.append("PatientSignature", signatureBase64);

//   //     const response = await axios.post(`${UrlLink}Workbench/workbench_dentalemr_evaluation`, formDataObj, {
//   //       headers: { "Content-Type": "multipart/form-data" },
//   //       timeout: 30000,
//   //     });

//   //     if (response.data.success) {
//   //       alert("Dental Evaluation saved successfully!");
//   //       handleClear();
//   //       setIsGetData((prev) => !prev);
//   //     } else {
//   //       alert("Save failed: " + (response.data.error || "Unknown error"));
//   //     }
//   //   } catch (error) {
//   //     console.error("Dental EMR Submission Error:", error);
//   //     alert("Error saving Dental EMR. Check console for details.");
//   //   }
//   // };


// const handleSubmit = async () => {
//   if (procedures.length === 0) {
//     alert("Please add at least one procedure before submitting.");
//     return;
//   }

//   if (!registrationId || !registrationType) {
//     alert("No patient selected!");
//     return;
//   }

//   if (!sigRef.current || sigRef.current.isEmpty()) {
//     alert("Please add patient signature before saving");
//     return;
//   }

//   try {
//     const formDataObj = new FormData();

//     // procedures
//     formDataObj.append("Procedures", procedures
//       .map(p => `${p.procedures} - Tooth ${p.tooth} (${p.status})`)
//       .join("\n")
//     );

//     formDataObj.append("Existing", formData.Existing || "");
//     formDataObj.append("Planned", formData.Planned || "");
//     formDataObj.append("InProgress", formData.InProgress || "");
//     formDataObj.append("Completed", formData.Completed || "");
//     formDataObj.append("Teeth", [...new Set(procedures.map(p => p.tooth))].join(", "));
//     formDataObj.append("Qty", procedures.reduce((s, p) => s + p.qty, 0));
//     formDataObj.append("Status", procedures[0]?.status || "Planned");
//     formDataObj.append("created_by", userRecord?.username || "Unknown");
//     formDataObj.append("RegistrationId", registrationId);
//     formDataObj.append("RegistrationType", registrationType);
//     formDataObj.append("ProcedureDetails", JSON.stringify(procedures));

//     // ✅ SIGNATURE (CORRECT WAY)
//     const signatureBase64 = sigRef.current.toDataURL("image/png");
//     formDataObj.append("PatientSignature", signatureBase64);

//     // document
//     if (formData.ChooseDocument?.startsWith("data:")) {
//       const blob = dataURItoBlob(formData.ChooseDocument);
//       formDataObj.append("ChooseDocument", blob, "document.jpg");
//     }

//     const response = await axios.post(
//       `${UrlLink}Workbench/workbench_dentalemr_evaluation`,
//       formDataObj,
//       { headers: { "Content-Type": "multipart/form-data" } }
//     );

//     if (response.data.success) {
//       alert("Dental Evaluation saved successfully!");

//       sigRef.current.clear();
//       setFormData(prev => ({ ...prev, PatientSignature: "" }));
//       setProcedures([]);
//       setSelectedTeeth([]);
//       setSelectedProcedure([]);
//       setIsViewMode(false);
//       setIsGetData(prev => !prev);
//     }

//   } catch (err) {
//     console.error(err);
//     alert("Error saving Dental EMR");
//   }
// };



// // useEffect(() => {
// //   if (formData.PatientSignature && sigRef.current) {
// //     sigRef.current.clear();
// //     sigRef.current.fromDataURL(formData.PatientSignature);
// //   }
// // }, [formData.PatientSignature]);


// // const normalizeSignature = (sig) => {
// //   if (!sig) return "";

// //   // Case 1: backend returns file URL
// //   if (sig.startsWith("http")) {
// //     return sig;
// //   }

// //   // Case 2: already a data URL
// //   if (sig.startsWith("data:image")) {
// //     return sig;
// //   }

// //   // Case 3: raw base64
// //   return `data:image/png;base64,${sig}`;
// // };





// //   const handlePrint = () => {
// //     if (procedures.length === 0 && !formData.Procedures) {
// //       alert("No data to print. Please add procedures or notes first.");
// //       return;
// //     }

// //     const procedureLines = procedures.length > 0
// //       ? procedures.map(p => `${p.procedures} - Tooth ${p.tooth} (${p.status})`).join("<br>")
// //       : (formData.Procedures || "No procedures");

// //     const teethList = procedures.length > 0
// //       ? [...new Set(procedures.map(p => p.tooth))].sort((a, b) => a - b).join(", ")
// //       : (formData.Teeth || "-");

// //     const totalQty = procedures.length > 0
// //       ? procedures.reduce((sum, p) => sum + p.qty, 0)
// //       : (formData.Qty || 0);

// //     const iframe = document.createElement("iframe");
// //     iframe.style.display = "none";
// //     document.body.appendChild(iframe);

// //     const doc = iframe.contentWindow.document;
// //     doc.open();
// //     doc.write(`
// //       <!DOCTYPE html>
// //       <html>
// //         <head>
// //           <meta charset="UTF-8">
// //           <title>Dental EMR Evaluation</title>
// //           <style>
// //             body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
// //             h2 { text-align: center; color: #1e40af; font-size: 28px; margin-bottom: 30px; }
// //             table { width: 100%; border-collapse: collapse; margin: 20px 0; }
// //             th, td { border: 1px solid #333; padding: 12px; text-align: left; vertical-align: top; }
// //             th { background: #f0f9ff; width: 30%; font-weight: bold; color: #1e40af; }
// //             .notes { white-space: pre-wrap; }
// //             .footer { margin-top: 50px; text-align: center; font-size: 14px; color: #666; }
// //           </style>
// //         </head>
// //         <body>
// //           <div style="text-align: center; margin-bottom: 30px;">
// //             <h2>Dental EMR Evaluation Summary</h2>
// //           </div>
// //           <p><strong>Patient:</strong> ${patientName}</p>
// //           <p><strong>Date:</strong> ${new Date().toLocaleDateString("en-GB")}</p>
// //           <p><strong>Noted By:</strong> ${userRecord?.username || "Unknown"}</p>
// //           <table>
// //             <tr><th>Procedures</th><td class="notes">${procedureLines}</td></tr>
// //             <tr><th>Teeth</th><td>${teethList}</td></tr>
// //             <tr><th>Total Quantity</th><td>${totalQty}</td></tr>
// //             <tr><th>Existing</th><td class="notes">${formData.Existing || "-"}</td></tr>
// //             <tr><th>Planned</th><td class="notes">${formData.Planned || "-"}</td></tr>
// //             <tr><th>In Progress</th><td class="notes">${formData.InProgress || "-"}</td></tr>
// //             <tr><th>Completed</th><td class="notes">${formData.Completed || "-"}</td></tr>
// //             <tr><th>Overall Status</th><td>${formData.Status || "Planned"}</td></tr>
// //              <tr><th>Total Amount</th><td>₹ ${totalAmount.toLocaleString("en-IN")}</td></tr>
// //           </table>
// //             <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:40px;">

// //   <!-- Grand Total -->
// //   <div style="font-weight:bold; font-size:16px;">
// //     Grand Total: ₹ ${totalAmount.toLocaleString("en-IN")}
// //   </div>

// //   <!-- Patient Signature -->
// //   <div style="text-align:center; width:260px;">
// //     <div style="font-weight:bold; margin-bottom:6px;">
// //       Patient Signature
// //     </div>

// //     ${
// //   formData.PatientSignature
// //     ? (() => {
// //         const signature = formData.PatientSignature.startsWith("data:image")
// //           ? formData.PatientSignature
// //           : `data:image/png;base64,${formData.PatientSignature}`;

// //         return `
// //           <img
// //             src="${signature}"
// //             alt="Patient Signature"
// //             style="width:250px; height:auto; border-bottom:1px solid #000;"
// //           />
// //         `;
// //       })()
// //     : `<div style="height:40px; border-bottom:1px solid #000;"></div>`
// // }





// //   </div>

// // </div>

// //           <div class="footer">
// //             Computer-generated report • ${new Date().toLocaleString("en-GB")}
// //           </div>
// //         </body>
// //       </html>
// //     `);
// //     doc.close();

// //     iframe.onload = () => {
// //       setTimeout(() => {
// //         iframe.contentWindow.focus();
// //         iframe.contentWindow.print();
// //       }, 300);
// //     };

// //     iframe.contentWindow.onafterprint = () => {
// //       setTimeout(() => document.body.removeChild(iframe), 1000);
// //     };
// //   };


// const normalizeSignature = (sig) => {
//   if (!sig || sig === "null" || sig === "undefined") return "";

//   if (sig.startsWith("data:image")) return sig;

//   if (!sig.startsWith("http") && !sig.startsWith("/")) {
//     return `data:image/png;base64,${sig}`;
//   }

//   return sig;
// };






// const handlePrint = () => {
//   if (procedures.length === 0 && !formData.Procedures) {
//     alert("No data to print. Please add procedures or notes first.");
//     return;
//   }

//   const procedureLines = procedures.length
//     ? procedures.map(p => `${p.procedures} - Tooth ${p.tooth} (${p.status})`).join("<br>")
//     : (formData.Procedures || "No procedures");

//   const teethList = procedures.length
//     ? [...new Set(procedures.map(p => p.tooth))].sort((a, b) => a - b).join(", ")
//     : (formData.Teeth || "-");

//   const totalQty = procedures.length
//     ? procedures.reduce((sum, p) => sum + p.qty, 0)
//     : (formData.Qty || 0);

//   const signatureSrc = normalizeSignature(
//   formData.PatientSignature || ""
// );


//   const iframe = document.createElement("iframe");
//   iframe.style.position = "fixed";
//   iframe.style.right = "0";
//   iframe.style.bottom = "0";
//   iframe.style.width = "0";
//   iframe.style.height = "0";
//   iframe.style.border = "0";
//   document.body.appendChild(iframe);

//   const doc = iframe.contentWindow.document;
//   doc.open();
//   doc.write(`
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <meta charset="UTF-8">
//         <title>Dental EMR Evaluation</title>
//         <style>
//           body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
//           h2 { text-align: center; color: #1e40af; font-size: 28px; margin-bottom: 30px; }
//           table { width: 100%; border-collapse: collapse; margin: 20px 0; }
//           th, td { border: 1px solid #333; padding: 12px; vertical-align: top; }
//           th { background: #f0f9ff; width: 30%; font-weight: bold; color: #1e40af; }
//           .notes { white-space: pre-wrap; }
//           .footer { margin-top: 50px; text-align: center; font-size: 14px; color: #666; }
//         </style>
//       </head>
//       <body>
//         <h2>Dental EMR Evaluation Summary</h2>

//         <p><strong>Patient:</strong> ${patientName}</p>
//         <p><strong>Date:</strong> ${new Date().toLocaleDateString("en-GB")}</p>
//         <p><strong>Noted By:</strong> ${userRecord?.username || "Unknown"}</p>

//         <table>
//           <tr><th>Procedures</th><td class="notes">${procedureLines}</td></tr>
//           <tr><th>Teeth</th><td>${teethList}</td></tr>
//           <tr><th>Total Quantity</th><td>${totalQty}</td></tr>
//           <tr><th>Existing</th><td class="notes">${formData.Existing || "-"}</td></tr>
//           <tr><th>Planned</th><td class="notes">${formData.Planned || "-"}</td></tr>
//           <tr><th>In Progress</th><td class="notes">${formData.InProgress || "-"}</td></tr>
//           <tr><th>Completed</th><td class="notes">${formData.Completed || "-"}</td></tr>
//           <tr><th>Overall Status</th><td>${formData.Status || "Planned"}</td></tr>
//           <tr><th>Total Amount</th><td>₹ ${totalAmount.toLocaleString("en-IN")}</td></tr>
//         </table>

//         <div style="display:flex; justify-content:space-between; margin-top:40px;">
//           <div style="font-weight:bold;">
//             Grand Total: ₹ ${totalAmount.toLocaleString("en-IN")}
//           </div>

//           <div style="text-align:center; width:260px;">
//             <div style="font-weight:bold; margin-bottom:6px;">Patient Signature</div>
//             ${
//               signatureSrc
//                 ? `<img src="${signatureSrc}" style="width:250px; border-bottom:1px solid #000;" />`
//                 : `<div style="height:40px; border-bottom:1px solid #000;"></div>`
//             }
//           </div>
//         </div>

//         <div class="footer">
//           Computer-generated report • ${new Date().toLocaleString("en-GB")}
//         </div>
//       </body>
//     </html>
//   `);
//   doc.close();

//   iframe.onload = () => {
//     setTimeout(() => {
//       iframe.contentWindow.focus();
//       iframe.contentWindow.print();
//     }, 500);
//   };

//   iframe.contentWindow.onafterprint = () => {
//     document.body.removeChild(iframe);
//   };
// };

//   const handleFileView = (data) => {
//     if (!data) return;
//     if (data.startsWith("http")) {
//       window.open(data, "_blank");
//       return;
//     }
//     let fileType = "image/jpeg";
//     if (data.includes("data:image/png")) fileType = "image/png";
//     if (data.includes("data:application/pdf")) fileType = "application/pdf";

//     dispatch({
//       type: "modelcon",
//       value: { Isopen: true, content: data, type: fileType },
//     });
//   };

//   return (
//     <>
//       <div style={{ fontFamily: "system-ui, sans-serif", padding: "20px", background: "#f9fafb" }}>
//         <div style={{ marginBottom: "20px", padding: "16px", background: "#e0f2fe", borderRadius: "8px", border: "1px solid #0ea5e9" }}>
//           <h3 style={{ margin: "0 0 8px 0", color: "#0369a1" }}>
//             Current Patient: <strong>{patientName}</strong>
//             {registrationId && (
//               <span style={{ marginLeft: "12px", fontSize: "14px", color: "#059669" }}>
//                 ({registrationType} - ID: {registrationId})
//               </span>
//             )}
//           </h3>
//         </div>

//         {!registrationId && (
//           <div style={{
//             padding: "24px",
//             margin: "20px 0",
//             backgroundColor: "#fee2e2",
//             border: "2px solid #ef4444",
//             borderRadius: "12px",
//             textAlign: "center",
//             color: "#991b1b",
//             fontSize: "20px",
//             fontWeight: "bold",
//             boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
//           }}>
//             ⚠️ No Patient Selected ⚠️<br/><br/>
//             Please <strong>go back to Doctor Workbench</strong> and <strong>click on a patient</strong> from the list first.
//           </div>
//         )}

//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
//           <div style={{ display: "flex", gap: "8px" }}>
//             <button
//               style={{
//                 padding: "8px 16px",
//                 border: "none",
//                 background: activeTab === "Chart" ? "#3b82f6" : "transparent",
//                 color: activeTab === "Chart" ? "white" : "#4b5563",
//                 borderRadius: "6px",
//                 cursor: "pointer",
//               }}
//               onClick={() => setActiveTab("Chart")}
//             >
//               Chart
//             </button>
//           </div>
//         </div>

//         <div style={{ display: "flex", gap: "8px", marginBottom: "16px", overflowX: "auto" }}>
//           {Object.keys(proceduresByCategory).map((c) => (
//             <button
//               key={c}
//               style={{
//                 padding: "8px 16px",
//                 border: "1px solid #d1d5db",
//                 background: category === c ? "#dbeafe" : "white",
//                 color: "#1e40af",
//                 borderRadius: "999px",
//                 whiteSpace: "nowrap",
//                 cursor: "pointer",
//               }}
//               onClick={() => {
//                 setCategory(c);
//                 setSelectedTeeth([]);
//                 setSelectedProcedure(null);
//               }}
//             >
//               {c}
//             </button>
//           ))}
//         </div>

//         <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
//           <div style={{ position: "relative" }}>
//             <button
//               onClick={() => setIsStatusOpen(!isStatusOpen)}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "8px",
//                 padding: "6px 14px",
//                 borderRadius: "999px",
//                 border: "none",
//                 fontWeight: "500",
//                 fontSize: "14px",
//                 cursor: "pointer",
//                 backgroundColor: isPlanned ? "#dc2626" : "#f3f4f6",
//                 color: isPlanned ? "white" : "#111827",
//               }}
//             >
//               <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: isPlanned ? "white" : currentStatusColor }} />
//               {status}
//               <ArrowDropDownIcon style={{ fontSize: 18 }} />
//             </button>
//             {isStatusOpen && (
//               <div style={{
//                 position: "absolute",
//                 top: "100%",
//                 left: 0,
//                 marginTop: "8px",
//                 background: "white",
//                 border: "1px solid #e5e7eb",
//                 borderRadius: "8px",
//                 boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
//                 zIndex: 100,
//                 minWidth: "180px",
//               }}>
//                 {statusOptions.map((opt) => (
//                   <div
//                     key={opt.label}
//                     onClick={() => {
//                       setStatus(opt.label);
//                       setIsStatusOpen(false);
//                     }}
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "10px",
//                       padding: "10px 16px",
//                       cursor: "pointer",
//                       backgroundColor: status === opt.label ? "#dbeafe" : "transparent",
//                     }}
//                   >
//                     <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: opt.color }} />
//                     {opt.label}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
//             {currentProcedures.map((proc, i) => (
//               <div
//                 key={i}
//                 onClick={() => selectProcedure(proc.name)}
//                 title={proc.name}
//                 style={{
//                   cursor: "pointer",
//                   padding: "12px",
//                   borderRadius: "8px",
//                   backgroundColor: selectedProcedure === proc.name ? "#dbeafe" : "#f3f4f6",
//                   border: selectedProcedure === proc.name ? "2px solid #3b82f6" : "none",
//                   textAlign: "center",
//                   minWidth: "80px",
//                 }}
//               >
//                 <div style={{ fontSize: "10px", color: "#4b5563" }}>{proc.name}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {activeTab === "Chart" && (
//           <div style={{ textAlign: "center", marginBottom: "30px" }}>
//             <InteractiveDentalSVG selectedTeeth={selectedTeeth} onToothClick={toggleTooth} />
//           </div>
//         )}

//         {selectedTeeth.length > 0 && (
//           <div style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             padding: "12px 16px",
//             background: "#f3f4f6",
//             borderRadius: "8px",
//             marginBottom: "20px",
//           }}>
//             <div>
//               <strong>Teeth:</strong> {selectedTeeth.sort((a, b) => a - b).join(", ")}
//               {selectedProcedure && (
//                 <span style={{ marginLeft: "20px" }}>
//                   <strong>Procedure:</strong> {selectedProcedure}
//                 </span>
//               )}
//             </div>
//             <button
//               onClick={applyProcedure}
//               disabled={!selectedProcedure}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "6px",
//                 padding: "8px 16px",
//                 background: selectedProcedure ? "#10b981" : "#9ca3af",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "8px",
//                 cursor: selectedProcedure ? "pointer" : "not-allowed",
//               }}
//             >
//               <AddIcon /> Apply
//             </button>
//           </div>
//         )}

//         {procedures.length > 0 && (
//           <div style={{ marginBottom: "30px" }}>
//             <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
//               <thead style={{ background: "#f3f4f6" }}>
//                 <tr>
//                   <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
//                   <th style={{ padding: "12px", textAlign: "left" }}>S/P</th>
//                   <th style={{ padding: "12px", textAlign: "left" }}>Teeth</th>
//                   <th style={{ padding: "12px", textAlign: "left" }}>Procedures</th>
//                   <th style={{ padding: "12px", textAlign: "left" }}>Qty</th>
//                   <th style={{ padding: "12px", textAlign: "left" }}>Fee</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {procedures.map((p, i) => (
//                   <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
//                     <td style={{ padding: "12px" }}>
//                       <span style={{
//                         display: "inline-block",
//                         width: "10px",
//                         height: "10px",
//                         borderRadius: "50%",
//                         backgroundColor: statusOptions.find((s) => s.label === p.status)?.color || "#ccc",
//                         marginRight: "8px",
//                       }} />
//                       {p.status}
//                     </td>
//                     <td style={{ padding: "12px" }}></td>
//                     <td style={{ padding: "12px" }}>{p.tooth}</td>
//                     <td style={{ padding: "12px" }}>{p.procedures}</td>
//                     <td style={{ padding: "12px" }}>{p.qty}</td>
//                     <td style={{ padding: "12px" }}>
//                       ₹ <input
//                         type="number"
//                         value={p.fee}
//                         onChange={(e) => updateFee(i, e.target.value)}
//                         style={{ width: "80px", marginLeft: "8px", padding: "4px", border: "1px solid #d1d5db", borderRadius: "4px" }}
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <div style={{
//               display: "flex",
//               justifyContent: "flex-end",
//               padding: "16px",
//               background: "#f0fdf4",
//               borderRadius: "0 0 8px 8px",
//               marginTop: "-1px",
//               fontSize: "18px",
//               fontWeight: "bold",
//               color: "#166534",
//             }}>
//               Total Amount: ₹ {totalAmount.toLocaleString("en-IN")}
//             </div>
//           </div>
//         )}

//         <div className="venkat2000-container">
//           <div className="venkat2000-header">
//             <button className="venkat2000-button" style={{ backgroundColor: 'grey' }} onClick={() => setOpenModal(true)}>
//               <VisibilityIcon />
//             </button>
//           </div>
//           {openModal && (
//             <div className="venkat2000-modal">
//               <div className="venkat2000-modal-content">
//                 <div className="venkat2000-modal-header">
//                   <h3>Evaluation Records</h3>
//                   <button style={{ padding: '8px', borderRadius: '5px' }} className="venkat2000-close-btn" onClick={() => setOpenModal(false)}>
//                     Close ✕
//                   </button>
//                 </div>
//                 <div className="venkat2000-modal-body">
//                   <ReactGrid columns={GeneralEvaluationColumns} RowData={gridData} />
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         <br />

//         <h2>{isViewMode ? "Dental EMR Summary" : "New Evaluation"}</h2>

//         <div className="venkat2000-form">
//           <label className="venkat2000-label">Procedures <span>*</span></label>
//           <textarea className="venkat2000-input" name="Procedures" rows="6" value={formData.Procedures} onChange={handleChange} readOnly={isViewMode} />

//           <label className="venkat2000-label">Existing</label>
//           <input className="venkat2000-input" name="Existing" value={formData.Existing} onChange={handleChange} readOnly={isViewMode} />

//           <label className="venkat2000-label">Planned</label>
//           <input className="venkat2000-input" name="Planned" value={formData.Planned} onChange={handleChange} readOnly={isViewMode} />

//           <label className="venkat2000-label">In Progress</label>
//           <input className="venkat2000-input" name="InProgress" value={formData.InProgress} onChange={handleChange} readOnly={isViewMode} />

//           <label className="venkat2000-label">Completed</label>
//           <input className="venkat2000-input" name="Completed" value={formData.Completed} onChange={handleChange} readOnly={isViewMode} />

//           <label className="venkat2000-label">Status</label>
//           <input className="venkat2000-input" name="Status" value={formData.Status} onChange={handleChange} readOnly={isViewMode} />

//           <label className="venkat2000-label">Teeth</label>
//           <input className="venkat2000-input" name="Teeth" value={formData.Teeth} onChange={handleChange} readOnly={isViewMode} />


//           <label className="venkat2000-label">Patient Signature</label>
// <>
//   {isViewMode ? (
//     formData.PatientSignature ? (
//       <img
//         src={normalizeSignature(formData.PatientSignature)}
//         alt="Patient Signature"
//         style={{
//           width: 300,
//           height: 150,
//           border: "1px solid #000",
//           objectFit: "contain",
//         }}
//       />
//     ) : (
//       <div style={{ width: 300, height: 150, border: "1px solid #000" }} />
//     )
//   ) : (
//     <SignatureCanvas
//       ref={sigRef}
//       penColor="black"
//       canvasProps={{
//         width: 400,
//         height: 150,
//         style: {
//           border: "1px solid #ccc",
//           background: "#fff",
//         },
//       }}
//     />
//   )}

//   {!isViewMode && (
//     <div style={{ marginTop: "8px" }}>
//       <button type="button" onClick={handleClearSignature}>
//         Clear
//       </button>
//     </div>
//   )}
// </>




//           <br /><br />

//           <div className="venkat2000-button">
//             <button
//               className="venkat2000-button"
//               style={{ backgroundColor: 'grey' }}
//               onClick={handleSubmit}
//               disabled={procedures.length === 0 || !registrationId || isViewMode}
//             >
//               {procedures.length === 0 || !registrationId ? "Submit" : "Submit"}
//             </button>
//             <button className="venkat2000-button" style={{ backgroundColor: 'grey' }} onClick={handleClear}>
//               Clear
//             </button>
//             <button
//               className="venkat2000-button"
//               style={{ backgroundColor: "grey" }}
//               onClick={handlePrint}
//               disabled={procedures.length === 0 && !formData.Procedures}
//             >
//               Print
//             </button>
//           </div>
//         </div>

//         <div className="venkat2000-grid" style={{ width: "100%", marginTop: "30px" }}>
//           <ReactGrid columns={GeneralEvaluationColumns} RowData={gridData} />
//         </div>
//       </div>
//       <ModelContainer />
//     </>
//   );
// };

// export default DentalEMR;















