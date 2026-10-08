// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import axios from "axios";
// import Button from "@mui/material/Button";
// import CircularProgress from '@mui/material/CircularProgress';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import InputLabel from '@mui/material/InputLabel';
// import Typography from '@mui/material/Typography';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import Grid from '@mui/material/Grid';
// import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper';
// import TextField from '@mui/material/TextField';
// import Alert from '@mui/material/Alert';
// import Snackbar from '@mui/material/Snackbar';
// import Radio from '@mui/material/Radio';
// import RadioGroup from '@mui/material/RadioGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import { styled } from '@mui/material/styles';
// import AddCircleIcon from '@mui/icons-material/AddCircle';
// import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
// import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
// import ScienceIcon from '@mui/icons-material/Science';
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// const CountIncrease = () => {
//     const UrlLink = useSelector(state => state.userRecord?.UrlLink);
//     const userRecord = useSelector(state => state.userRecord?.UserData);
//   const today = new Date().toISOString().slice(0, 10);

//     // State management
//     const [specialities, setSpecialities] = useState([]);
//     const [selectedSpeciality, setSelectedSpeciality] = useState('');
//     const [patientCount,setPatientCount] = useState(1)
//     const [selectDate, setSelectDate] = useState(today)
//     const [labDepartments, setLabDepartments] = useState([]);
//     const [filteredDepartments, setFilteredDepartments] = useState([]);
//     const [testCounts, setTestCounts] = useState({});
//     const [isLoading, setIsLoading] = useState(false);
//     const [isSaving, setIsSaving] = useState(false);

//     // New states for operation modes
//     const [operationMode, setOperationMode] = useState('increase'); // 'general', 'increase', 'decrease', 'swap'
//     const [registerType, setRegisterType] = useState('OP'); // 'OP' or 'IP'
//     const [swapData, setSwapData] = useState({
//         fromSpeciality: '',
//         toSpeciality: '',
//         counts: {}
//     });

//     const [snackbar, setSnackbar] = useState({
//         open: false,
//         message: '',
//         severity: 'success'
//     });

//     // Fetch specialities on component mount
//     useEffect(() => {
//         fetchSpecialities();
//         fetchLabDepartments();
//     }, []);

//     // Filter departments when speciality changes
//     useEffect(() => {
//         if (selectedSpeciality && labDepartments.length > 0) {
//             const filtered = labDepartments.filter(dept =>
//                 dept.Status === 'Active' &&
//                 dept.MainDepartment_Name === 'LABORATORY'
//             );
//             setFilteredDepartments(filtered);

//             // Initialize test counts for filtered departments
//             const initialCounts = {};
//             filtered.forEach(dept => {
//                 initialCounts[dept.SubDepartment_Code] = {
//                     dailyCount: 0,
//                     departmentName: dept.SubDepartment_Name
//                 };
//             });
//             setTestCounts(initialCounts);
//         }
//     }, [selectedSpeciality, labDepartments]);

//     const fetchSpecialities = async () => {
//         try {
//             setIsLoading(true);
//             const response = await axios.get(`${UrlLink}Masters/Speciality_Detials_link`);
//             setSpecialities(response.data || []);
//         } catch (error) {
//             console.error("Error fetching specialities:", error);
//             setSnackbar({
//                 open: true,
//                 message: 'Failed to load specialities',
//                 severity: 'error'
//             });
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const fetchLabDepartments = async () => {
//         try {
//             const response = await axios.get(
//                 `${UrlLink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=LabSubDepartment`
//             );
//             setLabDepartments(response.data || []);
//         } catch (error) {
//             console.error("Error fetching lab departments:", error);
//             setSnackbar({
//                 open: true,
//                 message: 'Failed to load lab departments',
//                 severity: 'error'
//             });
//         }
//     };

//     const handleCountChange = (deptCode, field, value) => {
//         setTestCounts(prev => ({
//             ...prev,
//             [deptCode]: {
//                 ...prev[deptCode],
//                 [field]: parseInt(value) || 0
//             }
//         }));
//     };

//     const handleSwapCountChange = (deptCode, value) => {
//         setSwapData(prev => ({
//             ...prev,
//             counts: {
//                 ...prev.counts,
//                 [deptCode]: parseInt(value) || 0
//             }
//         }));
//     };

//     const handleSave = async () => {
//         if (isSaving) return;

//         try {
//             let payload = {};
//             let endpoint = '';
//             let successMessage = '';

//             if (operationMode === 'increase' || operationMode === 'decrease') {
//                 if (!selectedSpeciality) {
//                     setSnackbar({
//                         open: true,
//                         message: 'Please select a speciality',
//                         severity: 'warning'
//                     });
//                     return;
//                 }

//                 const hasValues = Object.values(testCounts).some(data => data.dailyCount > 0);
//                 if (!hasValues) {
//                     setSnackbar({
//                         open: true,
//                         message: 'Please enter at least one test count',
//                         severity: 'warning'
//                     });
//                     return;
//                 }

//                 setIsSaving(true);

//                 const counts = Object.entries(testCounts)
//                     .filter(([_, data]) => data.dailyCount > 0)
//                     .map(([deptCode, data]) => ({
//                         departmentCode: deptCode,
//                         departmentName: data.departmentName,
//                         dailyCount: data.dailyCount
//                     }));

//                 payload = {
//                     patientCount: patientCount === 0 ? 1 : patientCount,
//                     date: selectDate,
//                     speciality: selectedSpeciality,
//                     counts: counts,
//                     createdBy: userRecord?.username || 'system',
//                     registerType: registerType,
//                     operation: operationMode,
//                     location: userRecord?.location
//                 };

//                 endpoint = operationMode === 'increase'
//                     ? 'MCI/MCI_Create_Test_Requests_By_Count'
//                     : 'MCI/MCI_Decrease_Test_Requests';

//                 successMessage = `Lab test counts ${operationMode === 'increase' ? 'increased' : 'decreased'} successfully!`;

//             }




//             const response = await axios.post(`${UrlLink}${endpoint}`, payload);

//             setSnackbar({
//                 open: true,
//                 message: successMessage,
//                 severity: 'success'
//             });

//             // Reset form after successful save
//             if (operationMode !== 'swap') {
//                 setSelectedSpeciality('');
//                 setTestCounts({});
//                 setFilteredDepartments([]);
//             } else {
//                 setSwapData({
//                     fromSpeciality: '',
//                     toSpeciality: '',
//                     counts: {}
//                 });
//             }

//         } catch (error) {
//             console.error("Error saving test counts:", error);
//             const errorMsg = error.response?.data?.message || 'Failed to save test counts';
//             setSnackbar({
//                 open: true,
//                 message: errorMsg,
//                 severity: 'error'
//             });
//         } finally {
//             setIsSaving(false);
//         }
//     };

//     const getTotalCounts = () => {
//         if (operationMode === 'swap') {
//             return Object.values(swapData.counts).reduce((sum, count) => sum + (count || 0), 0);
//         }

//         return Object.values(testCounts).reduce((sum, data) => sum + (data.dailyCount || 0), 0);
//     };

//     const initializeSpecialityData = (specialityId) => {
//         const filtered = labDepartments.filter(dept =>
//             dept.Status === 'Active' &&
//             dept.MainDepartment_Name === 'LABORATORY'
//         );
//         setFilteredDepartments(filtered);

//         const initialCounts = {};
//         filtered.forEach(dept => {
//             initialCounts[dept.SubDepartment_Code] = {
//                 dailyCount: 0,
//                 departmentName: dept.SubDepartment_Name
//             };
//         });
//         setTestCounts(initialCounts);
//     };

//     const totalCounts = getTotalCounts();

//     // Styled components
//     const StyledCard = styled(Card)(({ theme }) => ({
//         borderRadius: theme.spacing(2),
//         boxShadow: theme.shadows[3],
//         marginBottom: theme.spacing(3),
//     }));

//     const CountInput = styled(TextField)(({ theme }) => ({
//         '& .MuiOutlinedInput-root': {
//             borderRadius: theme.spacing(1),
//         },
//     }));

//     const DepartmentCard = styled(Paper)(({ theme }) => ({
//         padding: theme.spacing(3),
//         borderRadius: theme.spacing(1.5),
//         backgroundColor: theme.palette.background.paper,
//         border: `1px solid ${theme.palette.divider}`,
//         transition: 'all 0.2s ease-in-out',
//         '&:hover': {
//             borderColor: theme.palette.primary.main,
//             boxShadow: theme.shadows[2],
//         },
//     }));

//     const OperationCard = styled(Paper)(({ theme, selected }) => ({
//         padding: theme.spacing(2),
//         borderRadius: theme.spacing(1.5),
//         backgroundColor: selected ? theme.palette.action.selected : theme.palette.background.paper,
//         border: `2px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
//         cursor: 'pointer',
//         transition: 'all 0.2s ease',
//         '&:hover': {
//             borderColor: theme.palette.primary.main,
//             backgroundColor: theme.palette.action.hover,
//         },
//     }));

//     const renderGeneralContent = () => (
//         <>
//             <StyledCard>
//                 <CardContent>
//                     <Grid container spacing={3} alignItems="center">
//                         <Grid item xs={12} md={6}>
//                             <Box sx={{ mt: 2 }}>
//                                 <CountInput
//                                     fullWidth
//                                     label="Select Date"
//                                     type="date"
//                                     variant="outlined"
//                                     size="small"
//                                     value={selectDate}
//                                     onChange={(e) =>
//                                         setSelectDate(e.target.value)
//                                     }
//                                     InputProps={{ inputProps: { min: 0 } }}
//                                 />
//                             </Box>
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                             <FormControl fullWidth>
//                                 <InputLabel>Select Speciality</InputLabel>
//                                 <Select
//                                     value={selectedSpeciality}
//                                     label="Select Speciality"
//                                     onChange={(e) => {
//                                         setSelectedSpeciality(e.target.value);
//                                         initializeSpecialityData(e.target.value);
//                                     }}
//                                     disabled={isLoading}
//                                 >
//                                     <MenuItem value="">
//                                         <em>Select a speciality</em>
//                                     </MenuItem>
//                                     {specialities.map((spec) => (
//                                         <MenuItem key={spec.id} value={spec.Speciality_Id}>
//                                             {spec.SpecialityName}
//                                         </MenuItem>
//                                     ))}
//                                 </Select>
//                             </FormControl>
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                             <Box sx={{ mt: 2 }}>
//                                 <CountInput
//                                     fullWidth
//                                     label="Patient Count"
//                                     type="number"
//                                     variant="outlined"
//                                     size="small"
//                                     value={patientCount}
//                                     onChange={(e) =>
//                                         setPatientCount(e.target.value)
//                                     }
//                                     InputProps={{ inputProps: { min: 0 } }}
//                                 />
//                             </Box>
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                             <Typography variant="body1" color="textSecondary">
//                                 {selectedSpeciality
//                                     ? `Creating test requests for: ${selectedSpeciality}`
//                                     : 'Please select a speciality to continue'}
//                             </Typography>
//                         </Grid>
//                     </Grid>
//                 </CardContent>
//             </StyledCard>

//             {selectedSpeciality && filteredDepartments.length > 0 && (
//                 <StyledCard>
//                     <CardContent>
//                         <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
//                             Lab Departments under {selectedSpeciality}
//                         </Typography>

//                         <Grid container spacing={3}>
//                             {filteredDepartments.map((dept) => (
//                                 <Grid item xs={12} md={6} lg={4} key={dept.SubDepartment_Code}>
//                                     <DepartmentCard>
//                                         <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
//                                             {dept.SubDepartment_Name}
//                                         </Typography>
//                                         <Typography variant="body2" color="textSecondary" gutterBottom>
//                                             Code: {dept.SubDepartment_Code}
//                                         </Typography>

//                                         <Box sx={{ mt: 2 }}>
//                                             <CountInput
//                                                 fullWidth
//                                                 label="Test Count"
//                                                 type="number"
//                                                 variant="outlined"
//                                                 size="small"
//                                                 value={testCounts[dept.SubDepartment_Code]?.dailyCount || 0}
//                                                 onChange={(e) =>
//                                                     handleCountChange(dept.SubDepartment_Code, 'dailyCount', e.target.value)
//                                                 }
//                                                 InputProps={{ inputProps: { min: 0 } }}
//                                             />
//                                         </Box>
//                                     </DepartmentCard>
//                                 </Grid>
//                             ))}
//                         </Grid>
//                     </CardContent>
//                 </StyledCard>
//             )}
//         </>
//     );

//     const renderSwapContent = () => (
//         <>
//             <StyledCard>
//                 <CardContent>
//                     <Grid container spacing={3} alignItems="center">
//                         <Grid item xs={12} md={5}>
//                             <FormControl fullWidth>
//                                 <InputLabel>From Speciality</InputLabel>
//                                 <Select
//                                     value={swapData.fromSpeciality}
//                                     label="From Speciality"
//                                     onChange={(e) => setSwapData(prev => ({
//                                         ...prev,
//                                         fromSpeciality: e.target.value
//                                     }))}
//                                 >
//                                     <MenuItem value="">
//                                         <em>Select from speciality</em>
//                                     </MenuItem>
//                                     {specialities.map((spec) => (
//                                         <MenuItem key={spec.id} value={spec.Speciality_Id}>
//                                             {spec.SpecialityName}
//                                         </MenuItem>
//                                     ))}
//                                 </Select>
//                             </FormControl>
//                         </Grid>
//                         <Grid item xs={12} md={2} sx={{ textAlign: 'center' }}>
//                             <ArrowForwardIcon sx={{ fontSize: 40, color: 'primary.main' }} />
//                         </Grid>
//                         <Grid item xs={12} md={5}>
//                             <FormControl fullWidth>
//                                 <InputLabel>To Speciality</InputLabel>
//                                 <Select
//                                     value={swapData.toSpeciality}
//                                     label="To Speciality"
//                                     onChange={(e) => setSwapData(prev => ({
//                                         ...prev,
//                                         toSpeciality: e.target.value
//                                     }))}
//                                     disabled={!swapData.fromSpeciality}
//                                 >
//                                     <MenuItem value="">
//                                         <em>Select to speciality</em>
//                                     </MenuItem>
//                                     {specialities
//                                         .filter(spec => spec.Speciality_Id !== swapData.fromSpeciality)
//                                         .map((spec) => (
//                                             <MenuItem key={spec.id} value={spec.Speciality_Id}>
//                                                 {spec.SpecialityName}
//                                             </MenuItem>
//                                         ))}
//                                 </Select>
//                             </FormControl>
//                         </Grid>
//                     </Grid>
//                 </CardContent>
//             </StyledCard>

//             {swapData.fromSpeciality && swapData.toSpeciality && filteredDepartments.length > 0 && (
//                 <StyledCard>
//                     <CardContent>
//                         <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
//                             Transfer counts between specialities
//                         </Typography>

//                         <Grid container spacing={3}>
//                             {filteredDepartments.map((dept) => (
//                                 <Grid item xs={12} md={6} lg={4} key={dept.SubDepartment_Code}>
//                                     <DepartmentCard>
//                                         <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
//                                             {dept.SubDepartment_Name}
//                                         </Typography>

//                                         <Box sx={{ mt: 2 }}>
//                                             <CountInput
//                                                 fullWidth
//                                                 label="Count to Transfer"
//                                                 type="number"
//                                                 variant="outlined"
//                                                 size="small"
//                                                 value={swapData.counts[dept.SubDepartment_Code] || 0}
//                                                 onChange={(e) =>
//                                                     handleSwapCountChange(dept.SubDepartment_Code, e.target.value)
//                                                 }
//                                                 InputProps={{ inputProps: { min: 0 } }}
//                                             />
//                                         </Box>
//                                     </DepartmentCard>
//                                 </Grid>
//                             ))}
//                         </Grid>
//                     </CardContent>
//                 </StyledCard>
//             )}
//         </>
//     );

//     return (
//         <Box sx={{ p: 3 }}>
//             {/* Header */}
//             <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
//                 <ScienceIcon /> Lab Test Count Management
//             </Typography>

//             {/* Operation Mode Selection */}
//             <StyledCard>
//                 <CardContent>
//                     <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
//                         Select Operation Mode
//                     </Typography>

//                     <Grid container spacing={2}>


//                         <Grid item xs={12} sm={3}>
//                             <OperationCard
//                                 selected={operationMode === 'increase'}
//                                 onClick={() => setOperationMode('increase')}
//                             >
//                                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                                     <AddCircleIcon sx={{ mr: 1, color: 'success.main' }} />
//                                     <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
//                                         Increase
//                                     </Typography>
//                                 </Box>
//                                 <Typography variant="body2" color="textSecondary">
//                                     Increase existing counts
//                                 </Typography>
//                             </OperationCard>
//                         </Grid>

//                         <Grid item xs={12} sm={3}>
//                             <OperationCard
//                                 selected={operationMode === 'decrease'}
//                                 onClick={() => setOperationMode('decrease')}
//                             >
//                                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                                     <RemoveCircleIcon sx={{ mr: 1, color: 'error.main' }} />
//                                     <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
//                                         Decrease
//                                     </Typography>
//                                 </Box>
//                                 <Typography variant="body2" color="textSecondary">
//                                     Decrease existing counts
//                                 </Typography>
//                             </OperationCard>
//                         </Grid>


//                     </Grid>
//                 </CardContent>
//             </StyledCard>

//             {/* Register Type Selection */}
//             <StyledCard>
//                 <CardContent>
//                     <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
//                         Select Patient Type
//                     </Typography>
//                     <RadioGroup
//                         row
//                         value={registerType}
//                         onChange={(e) => setRegisterType(e.target.value)}
//                     >
//                         <FormControlLabel
//                             value="OP"
//                             control={<Radio />}
//                             label="Out Patient (OP)"
//                         />
//                         <FormControlLabel
//                             value="IP"
//                             control={<Radio />}
//                             label="In Patient (IP)"
//                         />
//                     </RadioGroup>
//                 </CardContent>
//             </StyledCard>

//             {/* Main Content */}
//             {operationMode !== 'swap' ? renderGeneralContent() : renderSwapContent()}

//             {/* Summary Stats */}
//             {(selectedSpeciality || (operationMode === 'swap' && swapData.fromSpeciality && swapData.toSpeciality)) && (
//                 <StyledCard>
//                     <CardContent>
//                         <Grid container spacing={3}>
//                             <Grid item xs={12} md={4}>
//                                 <Box sx={{ textAlign: 'center', p: 2 }}>
//                                     <Typography variant="h6" color="textSecondary" gutterBottom>
//                                         Total Departments
//                                     </Typography>
//                                     <Typography variant="h3" color="primary">
//                                         {filteredDepartments.length}
//                                     </Typography>
//                                 </Box>
//                             </Grid>
//                             <Grid item xs={12} md={4}>
//                                 <Box sx={{ textAlign: 'center', p: 2 }}>
//                                     <Typography variant="h6" color="textSecondary" gutterBottom>
//                                         Total Test Counts
//                                     </Typography>
//                                     <Typography variant="h3" color="success.main">
//                                         {totalCounts}
//                                     </Typography>
//                                 </Box>
//                             </Grid>
//                             <Grid item xs={12} md={4}>
//                                 <Box sx={{ textAlign: 'center', p: 2 }}>
//                                     <Typography variant="h6" color="textSecondary" gutterBottom>
//                                         Patient Type
//                                     </Typography>
//                                     <Typography variant="h3"
//                                         sx={{
//                                             color: registerType === 'OP' ? 'info.main' : 'secondary.main',
//                                             display: 'flex',
//                                             alignItems: 'center',
//                                             justifyContent: 'center',
//                                             gap: 1
//                                         }}
//                                     >
//                                         {registerType === 'OP' ? '🚶 OP' : '🏥 IP'}
//                                     </Typography>
//                                 </Box>
//                             </Grid>
//                         </Grid>
//                     </CardContent>
//                 </StyledCard>
//             )}

//             {/* Save Button */}
//             {((selectedSpeciality && filteredDepartments.length > 0 && totalCounts > 0) ||
//                 (operationMode === 'swap' && swapData.fromSpeciality && swapData.toSpeciality && totalCounts > 0)) && (
//                     <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
//                         <Button
//                             variant="contained"
//                             size="large"
//                             onClick={handleSave}
//                             disabled={isSaving}
//                             sx={{
//                                 px: 4,
//                                 py: 1.5,
//                                 borderRadius: 2,
//                                 fontSize: '1rem',
//                                 backgroundColor: operationMode === 'general' ? 'primary.main' :
//                                     operationMode === 'increase' ? 'success.main' :
//                                         operationMode === 'decrease' ? 'error.main' :
//                                             'warning.main'
//                             }}
//                         >
//                             {isSaving ? (
//                                 <>
//                                     <CircularProgress size={20} sx={{ mr: 1 }} />
//                                     {operationMode === 'increase' && 'Increasing...'}
//                                     {operationMode === 'decrease' && 'Decreasing...'}
//                                 </>
//                             ) : (
//                                 <>
//                                     {operationMode === 'increase' && `Increase ${registerType} Test Counts`}
//                                     {operationMode === 'decrease' && `Decrease ${registerType} Test Counts`}
//                                 </>
//                             )}
//                         </Button>
//                     </Box>
//                 )}

//             {/* No Departments Message */}
//             {selectedSpeciality && filteredDepartments.length === 0 && !isLoading && (
//                 <Alert severity="info" sx={{ mt: 3 }}>
//                     No active lab departments found for the selected speciality.
//                 </Alert>
//             )}

//             {/* Snackbar for notifications */}
//             <Snackbar
//                 open={snackbar.open}
//                 autoHideDuration={6000}
//                 onClose={() => setSnackbar({ ...snackbar, open: false })}
//                 anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//             >
//                 <Alert
//                     onClose={() => setSnackbar({ ...snackbar, open: false })}
//                     severity={snackbar.severity}
//                     sx={{ width: '100%' }}
//                 >
//                     {snackbar.message}
//                 </Alert>
//             </Snackbar>
//         </Box>
//     );
// };

// export default CountIncrease;


import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from "@mui/material/styles";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ScienceIcon from "@mui/icons-material/Science";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
  marginBottom: theme.spacing(3),
}));

const CountInput = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(1),
  },
}));

const DepartmentCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1.5),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    boxShadow: theme.shadows[2],
  },
}));

const OperationCard = styled(Paper)(({ theme, selected }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1.5),
  backgroundColor: selected
    ? theme.palette.action.selected
    : theme.palette.background.paper,
  border: `2px solid ${
    selected ? theme.palette.primary.main : theme.palette.divider
  }`,
  cursor: "pointer",
  transition: "all 0.2s ease",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

const CountIncrease = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const today = new Date().toISOString().slice(0, 10);

  // State management
  const [specialities, setSpecialities] = useState([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState("");
  const [patientCount, setPatientCount] = useState(1);
  const [selectDate, setSelectDate] = useState(today);
  const [labDepartments, setLabDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [testCounts, setTestCounts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // New states for operation modes
  const [operationMode, setOperationMode] = useState("increase"); // 'general', 'increase', 'decrease', 'swap'
  const [registerType, setRegisterType] = useState("OP"); // 'OP' or 'IP'
  const [swapData, setSwapData] = useState({
    fromSpeciality: "",
    toSpeciality: "",
    counts: {},
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch specialities on component mount
  useEffect(() => {
    fetchSpecialities();
    fetchLabDepartments();
  }, []);

  // Filter departments when speciality changes
  useEffect(() => {
    if (selectedSpeciality && labDepartments.length > 0) {
      const filtered = labDepartments.filter(
        (dept) =>
          dept.Status === "Active" && dept.MainDepartment_Name === "LABORATORY",
      );
      setFilteredDepartments(filtered);

      // Initialize test counts for filtered departments
      const initialCounts = {};
      filtered.forEach((dept) => {
        initialCounts[dept.SubDepartment_Code] = {
          dailyCount: 0,
          departmentName: dept.SubDepartment_Name,
        };
      });
      setTestCounts(initialCounts);
    }
  }, [selectedSpeciality, labDepartments]);

  const fetchSpecialities = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${UrlLink}Masters/Speciality_Detials_link`,
      );
      setSpecialities(response.data || []);
    } catch (error) {
      console.error("Error fetching specialities:", error);
      setSnackbar({
        open: true,
        message: "Failed to load specialities",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };
  console.log(specialities, "specialities");

  const fetchLabDepartments = async () => {
    try {
      const response = await axios.get(
        `${UrlLink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=LabSubDepartment`,
      );
      setLabDepartments(response.data || []);
    } catch (error) {
      console.error("Error fetching lab departments:", error);
      setSnackbar({
        open: true,
        message: "Failed to load lab departments",
        severity: "error",
      });
    }
  };

  // const handleCountChange = (deptCode, field, value) => {
  //     setTestCounts(prev => ({
  //         ...prev,
  //         [deptCode]: {
  //             ...prev[deptCode],
  //             [field]: parseInt(value) || 0
  //         }
  //     }));
  // };

  const handleCountChange = (deptCode, field, value) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    setTestCounts((prev) => ({
      ...prev,
      [deptCode]: {
        ...prev[deptCode],
        [field]: numValue,
      },
    }));
  };

  // const handleSwapCountChange = (deptCode, value) => {
  //     setSwapData(prev => ({
  //         ...prev,
  //         counts: {
  //             ...prev.counts,
  //             [deptCode]: parseInt(value) || 0
  //         }
  //     }));
  // };

  const handleSwapCountChange = (deptCode, value) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    setSwapData((prev) => ({
      ...prev,
      counts: {
        ...prev.counts,
        [deptCode]: numValue,
      },
    }));
  };

  const handlePatientCountChange = (value) => {
    const numValue = parseInt(value) || 1;
    setPatientCount(numValue > 0 ? numValue : 1);
  };

  const handleSave = async () => {
    if (isSaving) return;

    try {
      let payload = {};
      let endpoint = "";
      let successMessage = "";

      if (operationMode === "increase" || operationMode === "decrease") {
        if (!selectedSpeciality) {
          setSnackbar({
            open: true,
            message: "Please select a speciality",
            severity: "warning",
          });
          return;
        }

        const hasValues = Object.values(testCounts).some(
          (data) => data.dailyCount > 0,
        );
        if (!hasValues) {
          setSnackbar({
            open: true,
            message: "Please enter at least one test count",
            severity: "warning",
          });
          return;
        }

        setIsSaving(true);

        const counts = Object.entries(testCounts)
          .filter(([_, data]) => data.dailyCount > 0)
          .map(([deptCode, data]) => ({
            departmentCode: deptCode,
            departmentName: data.departmentName,
            dailyCount: data.dailyCount,
          }));

        payload = {
          // patientCount: patientCount === 0 ? 1 : patientCount,
          patientCount: Math.max(1, patientCount || 1),
          date: selectDate,
          speciality: selectedSpeciality,
          counts: counts,
          createdBy: userRecord?.username || "system",
          registerType: registerType,
          operation: operationMode,
          location: userRecord?.location,
        };

        endpoint =
          operationMode === "increase"
            ? "MCI/MCI_Create_Test_Requests_By_Count"
            : "MCI/MCI_Decrease_Test_Requests";

        successMessage = `Lab test counts ${operationMode === "increase" ? "increased" : "decreased"} successfully!`;
      }

      const response = await axios.post(`${UrlLink}${endpoint}`, payload);

      setSnackbar({
        open: true,
        message: successMessage,
        severity: "success",
      });

      // Reset form after successful save
      if (operationMode !== "swap") {
        setSelectedSpeciality("");
        setTestCounts({});
        setFilteredDepartments([]);
      } else {
        setSwapData({
          fromSpeciality: "",
          toSpeciality: "",
          counts: {},
        });
      }
    } catch (error) {
      console.error("Error saving test counts:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to save test counts";
      setSnackbar({
        open: true,
        message: errorMsg,
        severity: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getTotalCounts = () => {
    if (operationMode === "swap") {
      return Object.values(swapData.counts).reduce(
        (sum, count) => sum + (count || 0),
        0,
      );
    }

    return Object.values(testCounts).reduce(
      (sum, data) => sum + (data.dailyCount || 0),
      0,
    );
  };

  const initializeSpecialityData = (specialityId) => {
    const filtered = labDepartments.filter(
      (dept) =>
        dept.Status === "Active" && dept.MainDepartment_Name === "LABORATORY",
    );
    setFilteredDepartments(filtered);

    const initialCounts = {};
    filtered.forEach((dept) => {
      initialCounts[dept.SubDepartment_Code] = {
        dailyCount: 0,
        departmentName: dept.SubDepartment_Name,
      };
    });
    setTestCounts(initialCounts);
  };

  const totalCounts = getTotalCounts();

  const renderGeneralContent = () => (
    <>
      <StyledCard>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ mt: 2 }}>
                <CountInput
                  fullWidth
                  label="Select Date"
                  type="date"
                  variant="outlined"
                  size="small"
                  value={selectDate}
                  onChange={(e) => setSelectDate(e.target.value)}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Select Speciality</InputLabel>
                <Select
                  value={selectedSpeciality}
                  label="Select Speciality"
                  onChange={(e) => {
                    setSelectedSpeciality(e.target.value);
                    initializeSpecialityData(e.target.value);
                  }}
                  disabled={isLoading}
                >
                  <MenuItem value="">
                    <em>Select a speciality</em>
                  </MenuItem>
                  {specialities.map((spec) => (
                    <MenuItem key={spec.id} value={spec.Speciality_Id}>
                      {spec.SpecialityName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mt: 2 }}>
                <CountInput
                  fullWidth
                  label="Patient Count"
                  type="number"
                  variant="outlined"
                  size="small"
                  value={patientCount}
                  onChange={(e) => handlePatientCountChange(e.target.value)}
                  InputProps={{ inputProps: { min: 1, step: "any" } }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" color="textSecondary">
                {selectedSpeciality
                  ? `Creating test requests for: ${selectedSpeciality}`
                  : "Please select a speciality to continue"}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>

      {selectedSpeciality && filteredDepartments.length > 0 && (
        <StyledCard>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Lab Departments under {selectedSpeciality}
            </Typography>

            <Grid container spacing={3}>
              {filteredDepartments.map((dept) => (
                <Grid item xs={12} md={6} lg={4} key={dept.SubDepartment_Code}>
                  <DepartmentCard>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      {dept.SubDepartment_Name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      Code: {dept.SubDepartment_Code}
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                      <CountInput
                        fullWidth
                        label="Test Count"
                        type="number"
                        variant="outlined"
                        size="small"
                        value={
                          testCounts[dept.SubDepartment_Code]?.dailyCount || 0
                        }
                        onChange={(e) =>
                          handleCountChange(
                            dept.SubDepartment_Code,
                            "dailyCount",
                            e.target.value,
                          )
                        }
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                    </Box>
                  </DepartmentCard>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </StyledCard>
      )}
    </>
  );

  const renderSwapContent = () => (
    <>
      <StyledCard>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={5}>
              <FormControl fullWidth>
                <InputLabel>From Speciality</InputLabel>
                <Select
                  value={swapData.fromSpeciality}
                  label="From Speciality"
                  onChange={(e) =>
                    setSwapData((prev) => ({
                      ...prev,
                      fromSpeciality: e.target.value,
                    }))
                  }
                >
                  <MenuItem value="">
                    <em>Select from speciality</em>
                  </MenuItem>
                  {specialities.map((spec) => (
                    <MenuItem key={spec.id} value={spec.Speciality_Id}>
                      {spec.SpecialityName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2} sx={{ textAlign: "center" }}>
              <ArrowForwardIcon sx={{ fontSize: 40, color: "primary.main" }} />
            </Grid>
            <Grid item xs={12} md={5}>
              <FormControl fullWidth>
                <InputLabel>To Speciality</InputLabel>
                <Select
                  value={swapData.toSpeciality}
                  label="To Speciality"
                  onChange={(e) =>
                    setSwapData((prev) => ({
                      ...prev,
                      toSpeciality: e.target.value,
                    }))
                  }
                  disabled={!swapData.fromSpeciality}
                >
                  <MenuItem value="">
                    <em>Select to speciality</em>
                  </MenuItem>
                  {specialities
                    .filter(
                      (spec) => spec.Speciality_Id !== swapData.fromSpeciality,
                    )
                    .map((spec) => (
                      <MenuItem key={spec.id} value={spec.Speciality_Id}>
                        {spec.SpecialityName}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>

      {swapData.fromSpeciality &&
        swapData.toSpeciality &&
        filteredDepartments.length > 0 && (
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Transfer counts between specialities
              </Typography>

              <Grid container spacing={3}>
                {filteredDepartments.map((dept) => (
                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={4}
                    key={dept.SubDepartment_Code}
                  >
                    <DepartmentCard>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                      >
                        {dept.SubDepartment_Name}
                      </Typography>

                      <Box sx={{ mt: 2 }}>
                        <CountInput
                          fullWidth
                          label="Count to Transfer"
                          type="number"
                          variant="outlined"
                          size="small"
                          value={swapData.counts[dept.SubDepartment_Code] || 0}
                          onChange={(e) =>
                            handleSwapCountChange(
                              dept.SubDepartment_Code,
                              e.target.value,
                            )
                          }
                          InputProps={{ inputProps: { min: 0 } }}
                        />
                      </Box>
                    </DepartmentCard>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </StyledCard>
        )}
    </>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 600,
          mb: 4,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <ScienceIcon /> Lab Test Count Management
      </Typography>

      {/* Operation Mode Selection */}
      <StyledCard>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Select Operation Mode
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <OperationCard
                selected={operationMode === "increase"}
                onClick={() => setOperationMode("increase")}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <AddCircleIcon sx={{ mr: 1, color: "success.main" }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Increase
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Increase existing counts
                </Typography>
              </OperationCard>
            </Grid>

            {/* <Grid item xs={12} sm={3}>
              <OperationCard
                selected={operationMode === "decrease"}
                onClick={() => setOperationMode("decrease")}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <RemoveCircleIcon sx={{ mr: 1, color: "error.main" }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Decrease
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Decrease existing counts
                </Typography>
              </OperationCard>
            </Grid> */}
          </Grid>
        </CardContent>
      </StyledCard>

      {/* Register Type Selection */}
      <StyledCard>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Select Patient Type
          </Typography>
          <RadioGroup
            row
            value={registerType}
            onChange={(e) => setRegisterType(e.target.value)}
          >
            <FormControlLabel
              value="OP"
              control={<Radio />}
              label="Out Patient (OP)"
            />
            <FormControlLabel
              value="IP"
              control={<Radio />}
              label="In Patient (IP)"
            />
          </RadioGroup>
        </CardContent>
      </StyledCard>

      {/* Main Content */}
      {operationMode !== "swap" ? renderGeneralContent() : renderSwapContent()}

      {/* Summary Stats */}
      {(selectedSpeciality ||
        (operationMode === "swap" &&
          swapData.fromSpeciality &&
          swapData.toSpeciality)) && (
        <StyledCard>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Total Departments
                  </Typography>
                  <Typography variant="h3" color="primary">
                    {filteredDepartments.length}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Total Test Counts
                  </Typography>
                  <Typography variant="h3" color="success.main">
                    {totalCounts}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Patient Type
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      color:
                        registerType === "OP" ? "info.main" : "secondary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    {registerType === "OP" ? "🚶 OP" : "🏥 IP"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </StyledCard>
      )}

      {/* Save Button */}
      {((selectedSpeciality &&
        filteredDepartments.length > 0 &&
        totalCounts > 0) ||
        (operationMode === "swap" &&
          swapData.fromSpeciality &&
          swapData.toSpeciality &&
          totalCounts > 0)) && (
        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSave}
            disabled={isSaving}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontSize: "1rem",
              backgroundColor:
                operationMode === "general"
                  ? "primary.main"
                  : operationMode === "increase"
                    ? "success.main"
                    : operationMode === "decrease"
                      ? "error.main"
                      : "warning.main",
            }}
          >
            {isSaving ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                {operationMode === "increase" && "Increasing..."}
                {operationMode === "decrease" && "Decreasing..."}
              </>
            ) : (
              <>
                {operationMode === "increase" &&
                  `Increase ${registerType} Test Counts`}
                {operationMode === "decrease" &&
                  `Decrease ${registerType} Test Counts`}
              </>
            )}
          </Button>
        </Box>
      )}

      {/* No Departments Message */}
      {selectedSpeciality && filteredDepartments.length === 0 && !isLoading && (
        <Alert severity="info" sx={{ mt: 3 }}>
          No active lab departments found for the selected speciality.
        </Alert>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CountIncrease;

