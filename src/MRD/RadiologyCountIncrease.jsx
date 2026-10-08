import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
import Radio from '@mui/material/Radio';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ScienceIcon from '@mui/icons-material/Science';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const RadiologyCountIncrease = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const userRecord = useSelector(state => state.userRecord?.UserData);
    const dispatchvalue = useDispatch();
    const toast = useSelector((state) => state.userRecord?.toast);

    // Operation modes: 'general' (your existing), 'specialty-increase', 'specialty-decrease', 'specialty-swap'
    const [operationMode, setOperationMode] = useState('general'); 
    
    // For general mode (your existing functionality)
    const [generalFormData, setGeneralFormData] = useState({
        CT: '',
        MRI: '',
        XRAY: '',
        USG: ''
    });
    const [registerType, setRegisterType] = useState('OP');
    
    // For specialty mode
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    console.log(selectedSpecialty,'selectedSpecialty')
    const [specialtyFormData, setSpecialtyFormData] = useState({});
    const [swapData, setSwapData] = useState({
        fromSpecialty: '',
        toSpecialty: '',
        counts: {}
    });
    
    const [isSaving, setIsSaving] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);

    // Specialty configuration
    const specialties = [
        { 
            id: 'ENT', 
            name: 'ENT', 
            color: '#7c3aed',
            availableTests: ['USG', 'CT', 'XRAY','MRI']
        },
        { 
            id: 'GENERAL MEDICINE', 
            name: 'GENERAL MEDICINE', 
            color: '#3b82f6',
            availableTests: ['CT', 'MRI', 'XRAY', 'USG']
        },
        { 
            id: 'SURGERY', 
            name: 'SURGERY', 
            color: '#dc2626',
            availableTests: ['CT', 'USG', 'XRAY', 'MRI']
        },
        { 
            id: 'GYNECOLOGY', 
            name: 'GYNECOLOGY', 
            color: '#ec4899',
            availableTests: ['USG', 'CT', 'XRAY','MRI']
        },
        { 
            id: 'OBSTETRICS', 
            name: 'OBSTETRICS', 
            color: '#8b5cf6',
            availableTests: ['USG', 'CT', 'XRAY','MRI']
        },
        { 
            id: 'PAEDIATRICS', 
            name: 'PAEDIATRICS', 
            color: '#f59e0b',
            availableTests: ['USG', 'CT', 'XRAY','MRI']
        },
        { 
            id: 'ORTHOPEDICS', 
            name: 'ORTHOPEDICS', 
            color: '#059669',
            availableTests: ['USG', 'CT', 'XRAY','MRI']
        },
        { 
            id: 'OPTHALMOLOGY', 
            name: 'OPTHALMOLOGY', 
            color: '#059669',
            availableTests: ['USG', 'CT', 'XRAY','MRI']
        }
        ,
        { 
            id: 'DERMATOLOGY', 
            name: 'DERMATOLOGY', 
            color: '#059669',
            availableTests: ['USG', 'CT', 'XRAY','MRI']
        },
        { 
            id: 'PULMONOLOGY', 
            name: 'PULMONOLOGY', 
            color: '#059669',
            availableTests: ['USG', 'CT', 'XRAY','MRI']
        },
        { 
            id: 'PSYCHIATRY', 
            name: 'PSYCHIATRY', 
            color: '#059669',
            availableTests: ['USG', 'CT', 'XRAY','MRI']
        },
        { 
            id: 'CARDIOLOGY', 
            name: 'CARDIOLOGY', 
            color: '#059669',
            availableTests: ['USG', 'CT', 'XRAY','MRI']
        },
        { 
            id: 'NEUROLOGY', 
            name: 'NEUROLOGY', 
            color: '#059669',
            availableTests: ['USG', 'CT', 'XRAY','MRI']
        },
        { 
            id: 'DENTAL', 
            name: 'DENTAL', 
            color: '#059669',
            availableTests: ['USG', 'CT', 'XRAY','MRI']
        },
        { 
            id: 'NEONATAL', 
            name: 'NEONATAL', 
            color: '#059669',
            availableTests: ['USG', 'CT', 'XRAY','MRI']
        },
        { 
            id: 'EMERGENCY MEDICINE', 
            name: 'EMERGENCY MEDICINE', 
            color: '#059669',
            availableTests: ['USG', 'CT', 'XRAY','MRI']
        },
        { 
            id: 'UROLOGY', 
            name: 'UROLOGY', 
            color: '#059669',
            availableTests: ['USG', 'CT', 'XRAY','MRI']
        },

        
        


        
    ];

    // All available tests
    const testTypes = [
        { key: 'CT', label: 'CT Scan', color: '#3f51b5', icon: '🧠' },
        { key: 'MRI', label: 'MRI', color: '#9c27b0', icon: '🔬' },
        { key: 'XRAY', label: 'X-Ray', color: '#f44336', icon: '🦴' },
        { key: 'USG', label: 'Ultrasound', color: '#4caf50', icon: '👶' },
    ];

    const registerTypes = [
        { value: 'OP', label: 'Out Patient (OP)', color: '#3b82f6', icon: '🚶' },
        { value: 'IP', label: 'In Patient (IP)', color: '#10b981', icon: '🏥' }
    ];

    // Initialize specialty form data
    const initializeSpecialtyForm = (specialtyId) => {
        const specialty = specialties.find(s => s.id === specialtyId);
        if (!specialty) return;
        
        const initialData = {};
        specialty.availableTests.forEach(test => {
            initialData[test] = '';
        });
        
        setSpecialtyFormData(initialData);
    };

    // Handle general input change (your existing functionality)
    const handleGeneralInputChange = (field, value) => {
        const numValue = value === '' ? '' : parseInt(value) || 0;
        setGeneralFormData(prev => ({
            ...prev,
            [field]: numValue
        }));
    };

    // Handle specialty input change
    const handleSpecialtyInputChange = (field, value) => {
        const numValue = value === '' ? '' : parseInt(value) || 0;
        setSpecialtyFormData(prev => ({
            ...prev,
            [field]: numValue
        }));
    };

    // Handle swap input change
    const handleSwapInputChange = (field, value) => {
        const numValue = value === '' ? '' : parseInt(value) || 0;
        setSwapData(prev => ({
            ...prev,
            counts: {
                ...prev.counts,
                [field]: numValue
            }
        }));
    };

    const handleSave = async () => {
        if (isSaving) return;

        try {
            let payload = {};
            let endpoint = '';
            let successMessage = '';

            if (operationMode === 'general') {
                // Your existing save logic
                const hasValues = Object.values(generalFormData).some(value => value !== '' && value > 0);
                if (!hasValues) {
                    dispatchvalue({
                        type: 'toast',
                        value: { 
                            message: 'Please enter at least one test count', 
                            type: 'warning' 
                        },
                    });
                    return;
                }

                setIsSaving(true);

                payload = {
                    CT: generalFormData.CT || 0,
                    MRI: generalFormData.MRI || 0,
                    XRAY: generalFormData.XRAY || 0,
                    USG: generalFormData.USG || 0,
                    created_by: userRecord?.username || 'system'
                };

                endpoint = registerType === 'OP' 
                    ? 'Generate_Radiology_Requests_Manual_Link' 
                    : 'Generate_IP_Radiology_Requests_Manual_Link';

                successMessage = `Radiology requests generated successfully for ${registerType} patients`;
            } 
            else if (operationMode === 'specialty-increase' || operationMode === 'specialty-decrease') {
                // Specialty increase/decrease logic
                if (!selectedSpecialty) {
                    dispatchvalue({
                        type: 'toast',
                        value: { message: 'Please select a specialty', type: 'error' }
                    });
                    return;
                }

                const hasValues = Object.values(specialtyFormData).some(value => value !== '' && value > 0);
                if (!hasValues) {
                    dispatchvalue({
                        type: 'toast',
                        value: { 
                            message: 'Please enter at least one test count', 
                            type: 'warning' 
                        },
                    });
                    return;
                }

                setIsSaving(true);

                const specialty = specialties.find(s => s.id === selectedSpecialty);
                const counts = Object.keys(specialtyFormData)
                    .filter(test => specialtyFormData[test] && specialtyFormData[test] > 0)
                    .map(test => ({
                        testType: test,
                        count: specialtyFormData[test]
                    }));

                payload = {
                    specialty: specialty.name,
                    counts: counts,
                    registerType: registerType,
                    operation: operationMode === 'specialty-increase' ? 'increase' : 'decrease',
                    created_by: userRecord?.username || 'system'
                };

                // You'll need to create these endpoints
                endpoint = operationMode === 'specialty-increase' 
                    ? 'Generate_Specialty_Radiology_Requests_Link'
                    : 'Decrease_Specialty_Radiology_Requests_Link';

                successMessage = `${specialty.name} radiology counts ${operationMode === 'specialty-increase' ? 'increased' : 'decreased'} successfully`;
            }
            else if (operationMode === 'specialty-swap') {
                // Specialty swap logic
                if (!swapData.fromSpecialty || !swapData.toSpecialty) {
                    dispatchvalue({
                        type: 'toast',
                        value: { message: 'Please select both From and To specialties', type: 'error' }
                    });
                    return;
                }

                const hasValues = Object.values(swapData.counts).some(value => value !== '' && value > 0);
                if (!hasValues) {
                    dispatchvalue({
                        type: 'toast',
                        value: { 
                            message: 'Please enter at least one test count to swap', 
                            type: 'warning' 
                        },
                    });
                    return;
                }

                setIsSaving(true);

                const fromSpecialty = specialties.find(s => s.id === swapData.fromSpecialty);
                const toSpecialty = specialties.find(s => s.id === swapData.toSpecialty);
                
                const counts = Object.keys(swapData.counts)
                    .filter(test => swapData.counts[test] && swapData.counts[test] > 0)
                    .map(test => ({
                        testType: test,
                        count: swapData.counts[test]
                    }));

                payload = {
                    fromSpecialty: fromSpecialty.name,
                    toSpecialty: toSpecialty.name,
                    counts: counts,
                    registerType: registerType,
                    created_by: userRecord?.username || 'system'
                };

                // You'll need to create this endpoint
                endpoint = 'Swap_Specialty_Radiology_Requests_Link';
                successMessage = `Counts swapped from ${fromSpecialty.name} to ${toSpecialty.name} successfully`;
            }

            const response = await axios.post(`${UrlLink}MCI/${endpoint}`, payload);
            const messageType = Object.keys(response.data)[0];
            const messageContent = successMessage || Object.values(response.data)[0];

            dispatchvalue({
                type: 'toast',
                value: { message: messageContent, type: messageType },
            });

            // Reset form data
            if (operationMode === 'general') {
                setGeneralFormData({
                    CT: '',
                    MRI: '',
                    XRAY: '',
                    USG: ''
                });
            } else if (operationMode.startsWith('specialty')) {
                if (operationMode === 'specialty-swap') {
                    setSwapData({
                        fromSpecialty: '',
                        toSpecialty: '',
                        counts: {}
                    });
                } else {
                    setSpecialtyFormData({});
                }
            }

        } catch (error) {
            const errorMessage = error.response?.data?.error || 
                               error.response?.data?.message || 
                               `Failed to ${operationMode}`;
            dispatchvalue({
                type: 'toast',
                value: { message: errorMessage, type: 'error' }
            });
        } finally {
            setIsSaving(false);
        }
    };

    const getTotalGeneralCounts = () => {
        return Object.values(generalFormData).reduce((sum, value) => sum + (parseInt(value) || 0), 0);
    };

    const getTotalSpecialtyCounts = () => {
        return Object.values(specialtyFormData).reduce((sum, value) => sum + (parseInt(value) || 0), 0);
    };

    const getTotalSwapCounts = () => {
        return Object.values(swapData.counts).reduce((sum, value) => sum + (parseInt(value) || 0), 0);
    };

    const styles = {
        pageWrapper: {
            background: '#f8fafc',
            minHeight: '100vh',
            padding: '30px 20px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        },
        container: {
            maxWidth: '1200px',
            margin: '0 auto'
        },
        headerSection: {
            textAlign: 'center',
            marginBottom: '40px',
            color: '#1e293b'
        },
        mainTitle: {
            fontSize: '36px',
            fontWeight: '700',
            marginBottom: '12px',
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px'
        },
        subtitle: {
            fontSize: '16px',
            color: '#64748b',
            fontWeight: '400',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: '1.6'
        },
        operationSelector: {
            marginBottom: '30px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0'
        },
        operationTitle: {
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '20px',
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        },
        radioGroup: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
        },
        radioLabel: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderRadius: '10px',
            border: '2px solid #e2e8f0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backgroundColor: '#ffffff',
            minHeight: '80px'
        },
        radioLabelSelected: {
            borderColor: '#3b82f6',
            backgroundColor: '#eff6ff',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)'
        },
        radioIcon: {
            fontSize: '28px'
        },
        generalIcon: { color: '#3b82f6' },
        increaseIcon: { color: '#059669' },
        decreaseIcon: { color: '#dc2626' },
        swapIcon: { color: '#7c3aed' },
        radioText: {
            fontSize: '15px',
            fontWeight: '600',
            flex: 1
        },
        registerTypeSelector: {
            padding: '20px 24px',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e5e7eb'
        },
        radioGroupHorizontal: {
            display: 'flex',
            gap: '20px',
            alignItems: 'center'
        },
        radioLabelHorizontal: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            padding: '10px 16px',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            userSelect: 'none'
        },
        radioBoxSelected: {
            backgroundColor: '#e0e7ff',
            border: '1px solid #a5b4fc',
            boxShadow: '0 2px 4px rgba(30, 64, 175, 0.1)'
        },
        specialtySelector: {
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            marginTop: '25px',
            padding: '20px',
            backgroundColor: '#f8fafc',
            borderRadius: '10px',
            flexWrap: 'wrap'
        },
        selectBox: {
            padding: '12px 16px',
            border: '2px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            minWidth: '250px',
            backgroundColor: '#ffffff',
            outline: 'none',
            cursor: 'pointer'
        },
        swapArrow: {
            fontSize: '24px',
            color: '#f59e0b'
        },
        statsRow: {
            display: 'flex',
            gap: '20px',
            marginBottom: '30px',
            flexWrap: 'wrap',
            justifyContent: 'center'
        },
        statCard: {
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '20px 28px',
            minWidth: '180px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0',
            textAlign: 'center'
        },
        statLabel: {
            fontSize: '12px',
            fontWeight: '600',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '8px'
        },
        statValue: {
            fontSize: '28px',
            fontWeight: '700',
            color: '#1e293b'
        },
        mainCard: {
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            marginTop: '20px'
        },
        cardHeader: {
            background: operationMode === 'general' ? '#1e40af' :
                       operationMode === 'specialty-decrease' ? '#dc2626' :
                       operationMode === 'specialty-swap' ? '#7c3aed' : '#059669',
            padding: '24px 32px',
            color: '#ffffff'
        },
        cardTitle: {
            fontSize: '20px',
            fontWeight: '600',
            margin: 0
        },
        cardDescription: {
            fontSize: '14px',
            opacity: '0.9',
            margin: '4px 0 0 0'
        },
        tableContainer: {
            padding: '24px',
            overflowX: 'auto'
        },
        table: {
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0 8px'
        },
        thead: {
            position: 'sticky',
            top: 0,
            zIndex: 1
        },
        th: {
            padding: '16px 20px',
            textAlign: 'left',
            fontSize: '12px',
            fontWeight: '700',
            color: '#374151',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            backgroundColor: '#f8fafc',
            borderBottom: '2px solid #e5e7eb'
        },
        thFirst: {
            borderTopLeftRadius: '8px',
            borderBottomLeftRadius: '8px'
        },
        thLast: {
            borderTopRightRadius: '8px',
            borderBottomRightRadius: '8px'
        },
        tbody: {
            position: 'relative'
        },
        tr: {
            transition: 'all 0.2s ease',
            backgroundColor: '#ffffff'
        },
        td: {
            padding: '16px 20px',
            fontSize: '14px',
            color: '#374151',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #f3f4f6',
            borderBottom: '1px solid #f3f4f6'
        },
        tdFirst: {
            borderLeft: '1px solid #f3f4f6',
            borderTopLeftRadius: '8px',
            borderBottomLeftRadius: '8px'
        },
        tdLast: {
            borderRight: '1px solid #f3f4f6',
            borderTopRightRadius: '8px',
            borderBottomRightRadius: '8px'
        },
        testName: {
            fontWeight: '600',
            color: '#1f2937',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        },
        testIcon: {
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '600',
            flexShrink: 0
        },
        inputWrapper: {
            position: 'relative',
            display: 'inline-block'
        },
        input: {
            width: '120px',
            padding: '12px 14px',
            border: '2px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '500',
            color: '#1f2937',
            transition: 'all 0.2s ease',
            outline: 'none',
            backgroundColor: '#ffffff',
            textAlign: 'center'
        },
        buttonContainer: {
            padding: '20px 24px',
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px'
        },
        saveButton: {
            padding: '12px 32px',
            fontSize: '15px',
            fontWeight: '600',
            textTransform: 'none',
            borderRadius: '8px',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
        },
        specialtyHeader: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            borderLeft: `4px solid ${selectedSpecialty ? specialties.find(s => s.id === selectedSpecialty)?.color : '#3b82f6'}`
        },
        testGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '15px',
            marginTop: '20px'
        },
        testCard: {
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '15px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease'
        },
        testNameCompact: {
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        testInputWrapper: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        },
        testInput: {
            flex: 1,
            padding: '8px 12px',
            border: '2px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#1f2937',
            transition: 'all 0.2s ease',
            outline: 'none',
            textAlign: 'center'
        },
        infoBox: {
            marginTop: '20px',
            padding: '16px',
            backgroundColor: '#f0f9ff',
            borderRadius: '8px',
            border: '1px solid #bae6fd'
        }
    };

    const renderGeneralContent = () => {
        const totals = getTotalGeneralCounts();
        
        return (
            <>
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead style={styles.thead}>
                            <tr>
                                <th style={{ ...styles.th, ...styles.thFirst }}>Test Type</th>
                                <th style={{ ...styles.th, ...styles.thLast }}>Number of Requests</th>
                            </tr>
                        </thead>
                        <tbody style={styles.tbody}>
                            {testTypes.slice(0, 4).map((test, index) => {
                                const isHovered = focusedInput === test.key;
                                const value = generalFormData[test.key] || '';

                                return (
                                    <tr
                                        key={test.key}
                                        style={styles.tr}
                                    >
                                        <td style={{ ...styles.td, ...styles.tdFirst }}>
                                            <div style={styles.testName}>
                                                <div style={{ ...styles.testIcon, backgroundColor: test.color }}>
                                                    {test.icon}
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '16px', fontWeight: '600' }}>
                                                        {test.label}
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                                                        {test.key}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ ...styles.td, ...styles.tdLast }}>
                                            <div style={styles.inputWrapper}>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    placeholder="0"
                                                    value={value}
                                                    onChange={(e) => handleGeneralInputChange(test.key, e.target.value)}
                                                    onFocus={() => setFocusedInput(test.key)}
                                                    onBlur={() => setFocusedInput(null)}
                                                    style={{
                                                        ...styles.input,
                                                        borderColor: test.color
                                                    }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                
                <div style={styles.statsRow}>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Total Requests to Generate</div>
                        <div style={styles.statValue}>{totals}</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Patient Type</div>
                        <div style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: registerType === 'OP' ? '#3b82f6' : '#10b981',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            {registerType === 'OP' ? '🚶 OP' : '🏥 IP'}
                        </div>
                    </div>
                </div>
            </>
        );
    };

    const renderSpecialtyContent = () => {
        if (!selectedSpecialty) {
            return (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                    <ScienceIcon style={{ fontSize: '48px', opacity: 0.5, marginBottom: '16px' }} />
                    <div style={{ fontSize: '16px', fontWeight: '500' }}>
                        Please select a specialty to configure radiology counts
                    </div>
                </div>
            );
        }

        const specialty = specialties.find(s => s.id === selectedSpecialty);
        const availableTests = specialty?.availableTests || [];
        const totals = getTotalSpecialtyCounts();

        return (
            <>
                <div style={styles.specialtyHeader}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        backgroundColor: specialty.color
                    }}>
                        {specialty.name.charAt(0)}
                    </div>
                    <div>
                        <h3 style={{ margin: 0, color: '#1e293b' }}>{specialty.name}</h3>
                        <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                            {operationMode === 'specialty-increase' ? 'Increase' : 'Decrease'} radiology test counts for {specialty.name.toLowerCase()} patients
                        </p>
                    </div>
                </div>

                <div style={styles.testGrid}>
                    {availableTests.map(test => {
                        const testConfig = testTypes.find(t => t.key === test);
                        if (!testConfig) return null;
                        
                        const value = specialtyFormData[test] || '';
                        
                        return (
                            <div key={test} style={styles.testCard}>
                                <div style={styles.testNameCompact}>
                                    <div style={{
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        backgroundColor: testConfig.color
                                    }}></div>
                                    {testConfig.label}
                                </div>
                                <div style={styles.testInputWrapper}>
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        value={value}
                                        onChange={(e) => handleSpecialtyInputChange(test, e.target.value)}
                                        style={{
                                            ...styles.testInput,
                                            borderColor: operationMode === 'specialty-decrease' ? '#fecaca' : '#bbf7d0'
                                        }}
                                    />
                                    <span style={{
                                        fontSize: '14px',
                                        color: operationMode === 'specialty-decrease' ? '#dc2626' : '#059669',
                                        fontWeight: '600'
                                    }}>
                                        {operationMode === 'specialty-decrease' ? '↓' : '↑'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                <div style={styles.statsRow}>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Total {operationMode === 'specialty-increase' ? 'Increase' : 'Decrease'}</div>
                        <div style={styles.statValue}>{totals}</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Patient Type</div>
                        <div style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: registerType === 'OP' ? '#3b82f6' : '#10b981',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            {registerType === 'OP' ? '🚶 OP' : '🏥 IP'}
                        </div>
                    </div>
                </div>
            </>
        );
    };

    const renderSwapContent = () => {
        const fromSpecialty = specialties.find(s => s.id === swapData.fromSpecialty);
        const toSpecialty = specialties.find(s => s.id === swapData.toSpecialty);
        const totals = getTotalSwapCounts();

        if (!fromSpecialty || !toSpecialty) {
            return (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                    <SwapHorizIcon style={{ fontSize: '48px', opacity: 0.5, marginBottom: '16px' }} />
                    <div style={{ fontSize: '16px', fontWeight: '500' }}>
                        Please select both From and To specialties to configure swap
                    </div>
                </div>
            );
        }

        const availableTests = fromSpecialty.availableTests.filter(test => 
            toSpecialty.availableTests.includes(test)
        );

        return (
            <>
                <div style={{
                    ...styles.specialtyHeader,
                    borderLeft: `4px solid ${fromSpecialty.color}`
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        backgroundColor: fromSpecialty.color
                    }}>
                        {fromSpecialty.name.charAt(0)}
                    </div>
                    <div>
                        <h3 style={{ margin: 0, color: '#1e293b' }}>
                            Swap from {fromSpecialty.name} to {toSpecialty.name}
                        </h3>
                        <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                            Transfer radiology counts between specialties
                        </p>
                    </div>
                </div>

                <div style={styles.testGrid}>
                    {availableTests.map(test => {
                        const testConfig = testTypes.find(t => t.key === test);
                        if (!testConfig) return null;
                        
                        const value = swapData.counts[test] || '';
                        
                        return (
                            <div key={test} style={styles.testCard}>
                                <div style={styles.testNameCompact}>
                                    <div style={{
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        backgroundColor: testConfig.color
                                    }}></div>
                                    {testConfig.label}
                                </div>
                                <div style={styles.testInputWrapper}>
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        value={value}
                                        onChange={(e) => handleSwapInputChange(test, e.target.value)}
                                        style={{
                                            ...styles.testInput,
                                            borderColor: '#d8b4fe'
                                        }}
                                    />
                                    <ArrowForwardIcon style={{
                                        fontSize: '20px',
                                        color: '#7c3aed'
                                    }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                <div style={styles.statsRow}>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Total Transfer</div>
                        <div style={styles.statValue}>{totals}</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Patient Type</div>
                        <div style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: registerType === 'OP' ? '#3b82f6' : '#10b981',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            {registerType === 'OP' ? '🚶 OP' : '🏥 IP'}
                        </div>
                    </div>
                </div>
            </>
        );
    };

    const renderContent = () => {
        switch(operationMode) {
            case 'general':
                return renderGeneralContent();
            case 'specialty-increase':
            case 'specialty-decrease':
                return renderSpecialtyContent();
            case 'specialty-swap':
                return renderSwapContent();
            default:
                return renderGeneralContent();
        }
    };

    const getTotalCounts = () => {
        switch(operationMode) {
            case 'general':
                return getTotalGeneralCounts();
            case 'specialty-increase':
            case 'specialty-decrease':
                return getTotalSpecialtyCounts();
            case 'specialty-swap':
                return getTotalSwapCounts();
            default:
                return 0;
        }
    };

    const totals = getTotalCounts();

    return (
        <>
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    {/* Header Section */}
                    <div style={styles.headerSection}>
                        <h1 style={styles.mainTitle}>
                            <ScienceIcon style={{ fontSize: '40px', color: '#3b82f6' }} />
                            Radiology Count Management
                        </h1>
                        <p style={styles.subtitle}>
                            Manage radiology test counts with multiple operation modes. Choose between general counts or specialty-wise management.
                        </p>
                    </div>

                    {/* Operation Selector */}
                    <div style={styles.operationSelector}>
                        <div style={styles.operationTitle}>
                            <ScienceIcon style={{ color: '#3b82f6' }} />
                            Select Operation Mode
                        </div>
                        <div style={styles.radioGroup}>
                            <label
                                style={{
                                    ...styles.radioLabel,
                                    ...(operationMode === 'general' ? styles.radioLabelSelected : {})
                                }}
                                onClick={() => setOperationMode('general')}
                            >
                                <AddCircleIcon style={{ ...styles.radioIcon, ...styles.generalIcon }} />
                                <div style={styles.radioText}>
                                    General Count
                                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '400', marginTop: '4px' }}>
                                        Your existing CT/MRI/XRAY/USG counts
                                    </div>
                                </div>
                                <Radio
                                    checked={operationMode === 'general'}
                                    onChange={() => setOperationMode('general')}
                                    value="general"
                                    name="operation-mode"
                                />
                            </label>

                            <label
                                style={{
                                    ...styles.radioLabel,
                                    ...(operationMode === 'specialty-increase' ? styles.radioLabelSelected : {})
                                }}
                                onClick={() => setOperationMode('specialty-increase')}
                            >
                                <AddCircleIcon style={{ ...styles.radioIcon, ...styles.increaseIcon }} />
                                <div style={styles.radioText}>
                                    Specialty Increase
                                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '400', marginTop: '4px' }}>
                                        Increase counts for specific specialty
                                    </div>
                                </div>
                                <Radio
                                    checked={operationMode === 'specialty-increase'}
                                    onChange={() => setOperationMode('specialty-increase')}
                                    value="specialty-increase"
                                    name="operation-mode"
                                />
                            </label>

                            <label
                                style={{
                                    ...styles.radioLabel,
                                    ...(operationMode === 'specialty-decrease' ? styles.radioLabelSelected : {})
                                }}
                                onClick={() => setOperationMode('specialty-decrease')}
                            >
                                <RemoveCircleIcon style={{ ...styles.radioIcon, ...styles.decreaseIcon }} />
                                <div style={styles.radioText}>
                                    Specialty Decrease
                                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '400', marginTop: '4px' }}>
                                        Decrease counts for specific specialty
                                    </div>
                                </div>
                                <Radio
                                    checked={operationMode === 'specialty-decrease'}
                                    onChange={() => setOperationMode('specialty-decrease')}
                                    value="specialty-decrease"
                                    name="operation-mode"
                                />
                            </label>

                            <label
                                style={{
                                    ...styles.radioLabel,
                                    ...(operationMode === 'specialty-swap' ? styles.radioLabelSelected : {})
                                }}
                                onClick={() => setOperationMode('specialty-swap')}
                            >
                                <SwapHorizIcon style={{ ...styles.radioIcon, ...styles.swapIcon }} />
                                <div style={styles.radioText}>
                                    Specialty Swap
                                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '400', marginTop: '4px' }}>
                                        Transfer counts between specialties
                                    </div>
                                </div>
                                <Radio
                                    checked={operationMode === 'specialty-swap'}
                                    onChange={() => setOperationMode('specialty-swap')}
                                    value="specialty-swap"
                                    name="operation-mode"
                                />
                            </label>
                        </div>

                        {/* Register Type Selector */}
                        <div style={styles.registerTypeSelector}>
                            <div style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                                Select Patient Type:
                            </div>
                            <div style={styles.radioGroupHorizontal}>
                                {registerTypes.map((type) => (
                                    <label
                                        key={type.value}
                                        style={{
                                            ...styles.radioLabelHorizontal,
                                            ...(registerType === type.value ? styles.radioBoxSelected : {})
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name="registerType"
                                            value={type.value}
                                            checked={registerType === type.value}
                                            onChange={(e) => setRegisterType(e.target.value)}
                                            style={{ display: 'none' }}
                                        />
                                        <div style={{ fontSize: '18px', marginRight: '6px' }}>
                                            {type.icon}
                                        </div>
                                        <span style={{
                                            fontSize: '14px',
                                            fontWeight: registerType === type.value ? '600' : '500',
                                            color: registerType === type.value ? type.color : '#374151'
                                        }}>
                                            {type.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Specialty Selector (for specialty modes) */}
                        {(operationMode === 'specialty-increase' || operationMode === 'specialty-decrease') && (
                            <div style={styles.specialtySelector}>
                                <select
                                    value={selectedSpecialty}
                                    onChange={(e) => {
                                        setSelectedSpecialty(e.target.value);
                                        initializeSpecialtyForm(e.target.value);
                                    }}
                                    style={styles.selectBox}
                                >
                                    <option value="">Select Specialty</option>
                                    {specialties.map(spec => (
                                        <option key={spec.id} value={spec.name}>
                                            {spec.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Swap Selector (for swap mode) */}
                        {operationMode === 'specialty-swap' && (
                            <div style={styles.specialtySelector}>
                                <select
                                    value={swapData.fromSpecialty}
                                    onChange={(e) => {
                                        setSwapData(prev => ({
                                            ...prev,
                                            fromSpecialty: e.target.value,
                                            counts: {}
                                        }));
                                    }}
                                    style={styles.selectBox}
                                >
                                    <option value="">Select From Specialty</option>
                                    {specialties.map(spec => (
                                        <option key={spec.id} value={spec.id}>
                                            {spec.name}
                                        </option>
                                    ))}
                                </select>

                                <SwapHorizIcon style={styles.swapArrow} />

                                <select
                                    value={swapData.toSpecialty}
                                    onChange={(e) => {
                                        setSwapData(prev => ({
                                            ...prev,
                                            toSpecialty: e.target.value,
                                            counts: {}
                                        }));
                                    }}
                                    style={styles.selectBox}
                                    disabled={!swapData.fromSpecialty}
                                >
                                    <option value="">Select To Specialty</option>
                                    {specialties
                                        .filter(spec => spec.id !== swapData.fromSpecialty)
                                        .map(spec => (
                                            <option key={spec.id} value={spec.id}>
                                                {spec.name}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Main Card */}
                    <div style={styles.mainCard}>
                        <div style={styles.cardHeader}>
                            <h2 style={styles.cardTitle}>
                                {operationMode === 'general' && 'General Radiology Counts'}
                                {operationMode === 'specialty-increase' && 'Specialty Count Increase'}
                                {operationMode === 'specialty-decrease' && 'Specialty Count Decrease'}
                                {operationMode === 'specialty-swap' && 'Specialty Count Swap'}
                            </h2>
                            <p style={styles.cardDescription}>
                                {operationMode === 'general' && 'Enter test counts to generate radiology requests for all specialties'}
                                {operationMode === 'specialty-increase' && 'Increase radiology test counts for selected specialty'}
                                {operationMode === 'specialty-decrease' && 'Decrease radiology test counts for selected specialty'}
                                {operationMode === 'specialty-swap' && 'Transfer radiology counts between specialties'}
                            </p>
                        </div>

                        {renderContent()}

                        <div style={styles.buttonContainer}>
                            <Button
                                variant="contained"
                                onClick={handleSave}
                                disabled={isSaving || totals === 0}
                                style={{
                                    ...styles.saveButton,
                                    opacity: (isSaving || totals === 0) ? 0.7 : 1,
                                    cursor: (isSaving || totals === 0) ? 'not-allowed' : 'pointer',
                                    background: operationMode === 'general' ? '#1e40af' :
                                               operationMode === 'specialty-decrease' ? '#dc2626' :
                                               operationMode === 'specialty-swap' ? '#7c3aed' : '#059669'
                                }}
                            >
                                {isSaving ? (
                                    <>
                                        <CircularProgress size={18} color="inherit" />
                                        {operationMode === 'general' && 'Generating...'}
                                        {operationMode === 'specialty-increase' && 'Increasing...'}
                                        {operationMode === 'specialty-decrease' && 'Decreasing...'}
                                        {operationMode === 'specialty-swap' && 'Swapping...'}
                                    </>
                                ) : (
                                    <>
                                        {operationMode === 'general' && `Generate ${registerType} Requests`}
                                        {operationMode === 'specialty-increase' && `Increase ${selectedSpecialty ? specialties.find(s => s.id === selectedSpecialty)?.name : 'Specialty'} Counts`}
                                        {operationMode === 'specialty-decrease' && `Decrease ${selectedSpecialty ? specialties.find(s => s.id === selectedSpecialty)?.name : 'Specialty'} Counts`}
                                        {operationMode === 'specialty-swap' && 'Transfer Counts'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div style={styles.infoBox}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ fontSize: '20px' }}>💡</div>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#0369a1' }}>
                                    How it works
                                </div>
                                <div style={{ fontSize: '13px', color: '#0c4a6e', marginTop: '4px' }}>
                                    {operationMode === 'general' 
                                        ? 'Select patient type (OP or IP), enter the number of requests for each test type, and click "Generate Requests". The system will create these requests for today\'s patients.'
                                        : operationMode === 'specialty-increase' || operationMode === 'specialty-decrease'
                                        ? 'Select a specialty and patient type, enter counts for available tests. The system will increase/decrease counts specifically for that specialty.'
                                        : 'Select From and To specialties, enter counts to transfer. The system will move counts from one specialty to another.'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ToastAlert Message={toast.message} Type={toast.type} />
        </>
    );
};

export default RadiologyCountIncrease;




