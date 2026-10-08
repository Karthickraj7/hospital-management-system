import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SwapVerticalCircleIcon from '@mui/icons-material/SwapVerticalCircle';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';

const OPCountDecrease = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const userRecord = useSelector(state => state.userRecord?.UserData);
    const dispatchvalue = useDispatch();
    const toast = useSelector((state) => state.userRecord?.toast);

    const [specialityData, setSpecialityData] = useState([]);
    const [countData, setCountData] = useState({});
    const [internalSwapData, setInternalSwapData] = useState({});
    const [externalSwapData, setExternalSwapData] = useState({});
    const [hoveredRow, setHoveredRow] = useState(null);
    const [focusedInput, setFocusedInput] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [operationMode, setOperationMode] = useState('increase'); // 'increase', 'decrease', 'internal-swap', 'external-swap'
    const [selectedExternalFrom, setSelectedExternalFrom] = useState('');
    const [selectedExternalTo, setSelectedExternalTo] = useState('');

    const targetSpecialities = {
        'GENERAL MEDICINE': null,
        'DENTAL': null,
        'ENT': null,
        'DERMATOLOGY': null,
        'GYNECOLOGY': null,
        'OBSTETRICS': null,
        'OPTHALMOLOGY': null,
        'ORTHOPEDICS': null,
        'PAEDIATRICS': null,
        'PSYCHIATRY': null,
        'PULMONOLOGY': null,
        'UROLOGY': null,
        'EMERGENCY MEDICINE': null,
        'SURGERY': null,
        "NEONATAL": null
    };

    useEffect(() => {
        axios
            .get(`${UrlLink}Masters/Speciality_Detials_link`)
            .then((res) => {
                const data = res.data;
                const filtered = data
                    .filter(item =>
                        item.CategoryName === 'DOCTOR' &&
                        item.Status === 'Active' &&
                        targetSpecialities.hasOwnProperty(item.SpecialityName.toUpperCase().trim())
                    )
                    .map(item => ({
                        id: item.Speciality_Id,
                        name: item.SpecialityName.trim().toUpperCase()
                    }));

                const initialCounts = {};
                const initialInternalSwap = {};
                const initialExternalSwap = {};

                filtered.forEach(spec => {
                    const key = spec.name;
                    initialCounts[key] = { new: 0, followUp: 0 };
                    initialInternalSwap[key] = {
                        newToFollowUp: 0,
                        followUpToNew: 0
                    };
                    initialExternalSwap[key] = {
                        newToOther: 0,
                        followUpToOther: 0,
                        otherToNew: 0,
                        otherToFollowUp: 0
                    };
                });

                setSpecialityData(filtered);
                setCountData(initialCounts);
                setInternalSwapData(initialInternalSwap);
                setExternalSwapData(initialExternalSwap);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [UrlLink]);

    const handleCountChange = (speciality, type, value) => {
        if (operationMode === 'increase' || operationMode === 'decrease') {
            setCountData(prev => ({
                ...prev,
                [speciality]: {
                    ...prev[speciality],
                    [type]: parseInt(value) || 0
                }
            }));
        }
    };

    const handleInternalSwapChange = (speciality, field, value) => {
        setInternalSwapData(prev => ({
            ...prev,
            [speciality]: {
                ...prev[speciality],
                [field]: parseInt(value) || 0
            }
        }));
    };

    const handleExternalSwapChange = (speciality, field, value) => {
        setExternalSwapData(prev => ({
            ...prev,
            [speciality]: {
                ...prev[speciality],
                [field]: parseInt(value) || 0
            }
        }));
    };

    const handleSave = () => {
        if (isSaving) return;
        setIsSaving(true);

        if (operationMode === 'increase') {
            const payload = {
                counts: Object.keys(countData).map(key => ({
                    speciality: key,
                    newCount: countData[key].new,
                    followUpCount: countData[key].followUp
                })),
                created_by: userRecord?.username || 'system',
                operation: 'increase'
            };

            axios.post(`${UrlLink}MCI/Speciality_Count_Link`, payload)
                .then(res => {
                    const response = res.data;
                    const messageType = Object.keys(response)[0];
                    const messageContent = Object.values(response)[0];

                    dispatchvalue({
                        type: 'toast',
                        value: { message: messageContent, type: messageType },
                    });
                    resetCounts();
                })
                .catch(err => {
                    const msg = err.response?.data?.error || 'Failed to save counts';
                    dispatchvalue({ type: 'toast', value: { message: msg, type: 'error' } });
                })
                .finally(() => {
                    setIsSaving(false);
                });
        }
        else if (operationMode === 'decrease') {
            const payload = {
                counts: Object.keys(countData).map(key => ({
                    speciality: key,
                    newCount: countData[key].new,
                    followUpCount: countData[key].followUp
                })),
                created_by: userRecord?.username || 'system',
                operation: 'decrease'
            };

            axios.post(`${UrlLink}MCI/Speciality_Decrease_Link`, payload)
                .then(res => {
                    const response = res.data;
                    const messageType = Object.keys(response)[0];
                    const messageContent = Object.values(response)[0];

                    dispatchvalue({
                        type: 'toast',
                        value: { message: messageContent, type: messageType },
                    });
                    resetCounts();
                })
                .catch(err => {
                    const msg = err.response?.data?.error || 'Failed to decrease counts';
                    dispatchvalue({ type: 'toast', value: { message: msg, type: 'error' } });
                })
                .finally(() => {
                    setIsSaving(false);
                });
        }
        else if (operationMode === 'internal-swap') {
            const payload = {
                swaps: Object.keys(internalSwapData)
                    .filter(key => internalSwapData[key].newToFollowUp > 0 || internalSwapData[key].followUpToNew > 0)
                    .map(key => ({
                        speciality: key,
                        newToFollowUp: internalSwapData[key].newToFollowUp,
                        followUpToNew: internalSwapData[key].followUpToNew
                    })),
                created_by: userRecord?.username || 'system'
            };

            if (payload.swaps.length === 0) {
                dispatchvalue({
                    type: 'toast',
                    value: { message: 'Please enter values to swap', type: 'warning' }
                });
                setIsSaving(false);
                return;
            }

            axios.post(`${UrlLink}MCI/Speciality_Internal_Swap_Link`, payload)
                .then(res => {
                    const response = res.data;
                    const messageType = Object.keys(response)[0];
                    const messageContent = Object.values(response)[0];

                    dispatchvalue({
                        type: 'toast',
                        value: { message: messageContent, type: messageType },
                    });
                    resetInternalSwap();
                })
                .catch(err => {
                    const msg = err.response?.data?.error || 'Failed to perform internal swap';
                    dispatchvalue({ type: 'toast', value: { message: msg, type: 'error' } });
                })
                .finally(() => {
                    setIsSaving(false);
                });
        }
        else if (operationMode === 'external-swap') {
            if (!selectedExternalFrom || !selectedExternalTo) {
                dispatchvalue({
                    type: 'toast',
                    value: { message: 'Please select both From and To specialities', type: 'error' }
                });
                setIsSaving(false);
                return;
            }

            const payload = {
                fromSpeciality: selectedExternalFrom,
                toSpeciality: selectedExternalTo,
                newCount: externalSwapData[selectedExternalFrom]?.newToOther || 0,
                followUpCount: externalSwapData[selectedExternalFrom]?.followUpToOther || 0,
                created_by: userRecord?.username || 'system'
            };

            if (payload.newCount === 0 && payload.followUpCount === 0) {
                dispatchvalue({
                    type: 'toast',
                    value: { message: 'Please enter values to swap', type: 'warning' }
                });
                setIsSaving(false);
                return;
            }

            axios.post(`${UrlLink}MCI/Speciality_External_Swap_Link`, payload)
                .then(res => {
                    const response = res.data;
                    const messageType = Object.keys(response)[0];
                    const messageContent = Object.values(response)[0];

                    dispatchvalue({
                        type: 'toast',
                        value: { message: messageContent, type: messageType },
                    });
                    resetExternalSwap();
                })
                .catch(err => {
                    const msg = err.response?.data?.error || 'Failed to perform external swap';
                    dispatchvalue({ type: 'toast', value: { message: msg, type: 'error' } });
                })
                .finally(() => {
                    setIsSaving(false);
                });
        }
    };

    const resetCounts = () => {
        const resetData = {};
        specialityData.forEach(spec => {
            resetData[spec.name] = { new: 0, followUp: 0 };
        });
        setCountData(resetData);
    };

    const resetInternalSwap = () => {
        const resetData = {};
        specialityData.forEach(spec => {
            resetData[spec.name] = {
                newToFollowUp: 0,
                followUpToNew: 0
            };
        });
        setInternalSwapData(resetData);
    };

    const resetExternalSwap = () => {
        const resetData = {};
        specialityData.forEach(spec => {
            resetData[spec.name] = {
                newToOther: 0,
                followUpToOther: 0,
                otherToNew: 0,
                otherToFollowUp: 0
            };
        });
        setExternalSwapData(resetData);
        setSelectedExternalFrom('');
        setSelectedExternalTo('');
    };

    const getTotalCounts = () => {
        const totals = { new: 0, followUp: 0 };
        Object.values(countData).forEach(counts => {
            totals.new += counts.new || 0;
            totals.followUp += counts.followUp || 0;
        });
        return totals;
    };

    const getInternalSwapTotals = () => {
        const totals = { newToFollowUp: 0, followUpToNew: 0 };
        Object.values(internalSwapData).forEach(swap => {
            totals.newToFollowUp += swap.newToFollowUp || 0;
            totals.followUpToNew += swap.followUpToNew || 0;
        });
        return totals;
    };

    const getExternalSwapTotals = () => {
        const totals = { newToOther: 0, followUpToOther: 0 };
        if (selectedExternalFrom) {
            totals.newToOther = externalSwapData[selectedExternalFrom]?.newToOther || 0;
            totals.followUpToOther = externalSwapData[selectedExternalFrom]?.followUpToOther || 0;
        }
        return totals;
    };

    const totals = getTotalCounts();
    const internalSwapTotals = getInternalSwapTotals();
    const externalSwapTotals = getExternalSwapTotals();

    const styles = {
        pageWrapper: {
            background: '#f8fafc',
            minHeight: '100vh',
            padding: '40px 20px',
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
            color: '#1e293b'
        },
        subtitle: {
            fontSize: '16px',
            color: '#64748b',
            fontWeight: '400'
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
            color: '#1e293b'
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
            backgroundColor: '#ffffff'
        },
        radioLabelSelected: {
            borderColor: '#3b82f6',
            backgroundColor: '#eff6ff',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)'
        },
        radioIcon: {
            fontSize: '28px'
        },
        increaseIcon: { color: '#059669' },
        decreaseIcon: { color: '#dc2626' },
        internalSwapIcon: { color: '#7c3aed' },
        externalSwapIcon: { color: '#f59e0b' },
        radioText: {
            fontSize: '16px',
            fontWeight: '600',
            flex: 1
        },
        externalSwapSelector: {
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            marginTop: '20px',
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
            minWidth: '220px',
            backgroundColor: '#ffffff',
            outline: 'none',
            cursor: 'pointer'
        },
        selectBoxFocused: {
            borderColor: '#3b82f6',
            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
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
            padding: '24px 32px',
            minWidth: '200px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0'
        },
        statLabel: {
            fontSize: '13px',
            fontWeight: '600',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '8px'
        },
        statValue: {
            fontSize: '32px',
            fontWeight: '700',
            color: '#1e293b'
        },
        statIconNew: {
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            marginRight: '8px'
        },
        iconGreen: { backgroundColor: '#059669' },
        iconRed: { backgroundColor: '#dc2626' },
        iconPurple: { backgroundColor: '#7c3aed' },
        iconAmber: { backgroundColor: '#f59e0b' },
        mainCard: {
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            border: '1px solid #e2e8f0'
        },
        cardHeader: {
            background: operationMode === 'decrease' ? '#dc2626' :
                       operationMode === 'internal-swap' ? '#7c3aed' :
                       operationMode === 'external-swap' ? '#f59e0b' : '#3b82f6',
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
            textAlign: 'center',
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
        trHover: {
            backgroundColor: '#f8fafc',
            transform: 'translateX(2px)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
        },
        td: {
            padding: '16px 20px',
            fontSize: '14px',
            color: '#374151',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #f3f4f6',
            borderBottom: '1px solid #f3f4f6',
            textAlign: 'center'
        },
        tdFirst: {
            borderLeft: '1px solid #f3f4f6',
            borderTopLeftRadius: '8px',
            borderBottomLeftRadius: '8px',
            textAlign: 'left'
        },
        tdLast: {
            borderRight: '1px solid #f3f4f6',
            borderTopRightRadius: '8px',
            borderBottomRightRadius: '8px'
        },
        specialityName: {
            fontWeight: '600',
            color: '#1f2937',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        },
        specialityIcon: {
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
            width: '90px',
            padding: '10px 12px',
            border: '2px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#1f2937',
            transition: 'all 0.2s ease',
            outline: 'none',
            backgroundColor: '#ffffff',
            textAlign: 'center'
        },
        inputFocused: {
            borderColor: operationMode === 'decrease' ? '#dc2626' :
                       operationMode === 'internal-swap' ? '#7c3aed' :
                       operationMode === 'external-swap' ? '#f59e0b' : '#3b82f6',
            backgroundColor: '#ffffff',
            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
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
        emptyState: {
            textAlign: 'center',
            padding: '60px 20px',
            color: '#6b7280'
        },
        emptyIcon: {
            fontSize: '48px',
            marginBottom: '16px',
            opacity: 0.5
        },
        emptyText: {
            fontSize: '16px',
            fontWeight: '500'
        },
        badge: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
        },
        newBadge: {
            backgroundColor: '#fef2f2',
            color: '#991b1b',
            border: '1px solid #fecaca'
        },
        followUpBadge: {
            backgroundColor: '#f0fdf4',
            color: '#166534',
            border: '1px solid #bbf7d0'
        },
        swapBadge: {
            backgroundColor: '#f3e8ff',
            color: '#6b21a8',
            border: '1px solid #d8b4fe'
        },
        arrowContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#7c3aed'
        },
        arrowIcon: {
            fontSize: '20px',
            margin: '4px 0'
        }
    };

    const getBackgroundColor = () => {
        switch (operationMode) {
            case 'increase': return '#3b82f6';
            case 'decrease': return '#dc2626';
            case 'internal-swap': return '#7c3aed';
            case 'external-swap': return '#f59e0b';
            default: return '#3b82f6';
        }
    };

    const renderTable = () => {
        if (operationMode === 'internal-swap') {
            return (
                <table style={styles.table}>
                    <thead style={styles.thead}>
                        <tr>
                            <th style={{ ...styles.th, ...styles.thFirst }}>Speciality</th>
                            <th style={styles.th}>
                                <span style={{ ...styles.badge, ...styles.newBadge }}>
                                    <span style={{ ...styles.statIconNew, ...styles.iconRed }}></span>
                                    New → Follow-up
                                </span>
                            </th>
                            <th style={styles.th}>
                                <span style={{ ...styles.badge, ...styles.followUpBadge }}>
                                    <span style={{ ...styles.statIconNew, ...styles.iconGreen }}></span>
                                    Follow-up → New
                                </span>
                            </th>
                            <th style={{ ...styles.th, ...styles.thLast }}>
                                Net Change
                            </th>
                        </tr>
                    </thead>
                    <tbody style={styles.tbody}>
                        {specialityData.length > 0 ? (
                            specialityData.map((spec, index) => {
                                const key = spec.name;
                                const isHovered = hoveredRow === index;
                                const swapData = internalSwapData[key] || {};
                                const netChange = (swapData.followUpToNew || 0) - (swapData.newToFollowUp || 0);

                                return (
                                    <tr
                                        key={spec.id}
                                        style={{
                                            ...styles.tr,
                                            ...(isHovered ? styles.trHover : {})
                                        }}
                                        onMouseEnter={() => setHoveredRow(index)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                    >
                                        <td style={{ ...styles.td, ...styles.tdFirst }}>
                                            <div style={styles.specialityName}>
                                                <div style={{
                                                    ...styles.specialityIcon,
                                                    background: '#7c3aed'
                                                }}>
                                                    {key.charAt(0)}
                                                </div>
                                                {key}
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.inputWrapper}>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={swapData.newToFollowUp || 0}
                                                    onChange={(e) => handleInternalSwapChange(key, 'newToFollowUp', e.target.value)}
                                                    onFocus={() => setFocusedInput(`${key}-newToFollowUp`)}
                                                    onBlur={() => setFocusedInput(null)}
                                                    style={{
                                                        ...styles.input,
                                                        ...(focusedInput === `${key}-newToFollowUp` ? styles.inputFocused : {}),
                                                        borderColor: '#fecaca'
                                                    }}
                                                />
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.inputWrapper}>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={swapData.followUpToNew || 0}
                                                    onChange={(e) => handleInternalSwapChange(key, 'followUpToNew', e.target.value)}
                                                    onFocus={() => setFocusedInput(`${key}-followUpToNew`)}
                                                    onBlur={() => setFocusedInput(null)}
                                                    style={{
                                                        ...styles.input,
                                                        ...(focusedInput === `${key}-followUpToNew` ? styles.inputFocused : {}),
                                                        borderColor: '#bbf7d0'
                                                    }}
                                                />
                                            </div>
                                        </td>
                                        <td style={{ ...styles.td, ...styles.tdLast }}>
                                            <div style={{
                                                padding: '8px 16px',
                                                borderRadius: '6px',
                                                fontWeight: '600',
                                                backgroundColor: netChange > 0 ? '#f0fdf4' : 
                                                               netChange < 0 ? '#fef2f2' : '#f3f4f6',
                                                color: netChange > 0 ? '#166534' : 
                                                      netChange < 0 ? '#991b1b' : '#6b7280'
                                            }}>
                                                {netChange > 0 ? '+' : ''}{netChange}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="4" style={styles.emptyState}>
                                    <div style={styles.emptyIcon}>🏥</div>
                                    <div style={styles.emptyText}>Loading specialities...</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            );
        }
        else if (operationMode === 'external-swap') {
            return (
                <table style={styles.table}>
                    <thead style={styles.thead}>
                        <tr>
                            <th style={{ ...styles.th, ...styles.thFirst }}>Speciality</th>
                            <th style={styles.th}>
                                <span style={{ ...styles.badge, ...styles.newBadge }}>
                                    <span style={{ ...styles.statIconNew, ...styles.iconRed }}></span>
                                    New → Other
                                </span>
                            </th>
                            <th style={styles.th}>
                                <span style={{ ...styles.badge, ...styles.followUpBadge }}>
                                    <span style={{ ...styles.statIconNew, ...styles.iconGreen }}></span>
                                    Follow-up → Other
                                </span>
                            </th>
                            <th style={{ ...styles.th, ...styles.thLast }}>
                                Total → {selectedExternalTo || 'Other'}
                            </th>
                        </tr>
                    </thead>
                    <tbody style={styles.tbody}>
                        {specialityData.length > 0 ? (
                            specialityData.map((spec, index) => {
                                const key = spec.name;
                                const isHovered = hoveredRow === index;
                                const isFrom = selectedExternalFrom === key;
                                const swapData = externalSwapData[key] || {};
                                const totalSwap = (swapData.newToOther || 0) + (swapData.followUpToOther || 0);

                                return (
                                    <tr
                                        key={spec.id}
                                        style={{
                                            ...styles.tr,
                                            ...(isHovered ? styles.trHover : {}),
                                            backgroundColor: isFrom ? '#fffbeb' : '#ffffff'
                                        }}
                                        onMouseEnter={() => setHoveredRow(index)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                    >
                                        <td style={{ ...styles.td, ...styles.tdFirst }}>
                                            <div style={styles.specialityName}>
                                                <div style={{
                                                    ...styles.specialityIcon,
                                                    background: isFrom ? '#f59e0b' : '#d1d5db'
                                                }}>
                                                    {key.charAt(0)}
                                                </div>
                                                {key}
                                                {isFrom && (
                                                    <span style={{
                                                        ...styles.badge,
                                                        backgroundColor: '#fef3c7',
                                                        color: '#92400e',
                                                        border: '1px solid #fde68a',
                                                        marginLeft: 'auto'
                                                    }}>
                                                        FROM
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.inputWrapper}>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={swapData.newToOther || 0}
                                                    onChange={(e) => handleExternalSwapChange(key, 'newToOther', e.target.value)}
                                                    onFocus={() => setFocusedInput(`${key}-newToOther`)}
                                                    onBlur={() => setFocusedInput(null)}
                                                    disabled={!isFrom}
                                                    style={{
                                                        ...styles.input,
                                                        ...(focusedInput === `${key}-newToOther` ? styles.inputFocused : {}),
                                                        borderColor: '#fecaca',
                                                        opacity: isFrom ? 1 : 0.5,
                                                        cursor: isFrom ? 'text' : 'not-allowed'
                                                    }}
                                                />
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.inputWrapper}>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={swapData.followUpToOther || 0}
                                                    onChange={(e) => handleExternalSwapChange(key, 'followUpToOther', e.target.value)}
                                                    onFocus={() => setFocusedInput(`${key}-followUpToOther`)}
                                                    onBlur={() => setFocusedInput(null)}
                                                    disabled={!isFrom}
                                                    style={{
                                                        ...styles.input,
                                                        ...(focusedInput === `${key}-followUpToOther` ? styles.inputFocused : {}),
                                                        borderColor: '#bbf7d0',
                                                        opacity: isFrom ? 1 : 0.5,
                                                        cursor: isFrom ? 'text' : 'not-allowed'
                                                    }}
                                                />
                                            </div>
                                        </td>
                                        <td style={{ ...styles.td, ...styles.tdLast }}>
                                            <div style={{
                                                padding: '8px 16px',
                                                borderRadius: '6px',
                                                fontWeight: '600',
                                                backgroundColor: totalSwap > 0 ? '#fef3c7' : '#f3f4f6',
                                                color: totalSwap > 0 ? '#92400e' : '#6b7280'
                                            }}>
                                                {totalSwap}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="4" style={styles.emptyState}>
                                    <div style={styles.emptyIcon}>🏥</div>
                                    <div style={styles.emptyText}>Loading specialities...</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            );
        }
        else {
            return (
                <table style={styles.table}>
                    <thead style={styles.thead}>
                        <tr>
                            <th style={{ ...styles.th, ...styles.thFirst }}>Speciality</th>
                            <th style={styles.th}>
                                <span style={{ ...styles.badge, ...styles.newBadge }}>
                                    <span style={{
                                        ...styles.statIconNew,
                                        ...(operationMode === 'decrease' ? styles.iconRed : styles.iconGreen)
                                    }}></span>
                                    {operationMode === 'decrease' ? 'Decrease New' : 'New Patients'}
                                </span>
                            </th>
                            <th style={{ ...styles.th, ...styles.thLast }}>
                                <span style={{ ...styles.badge, ...styles.followUpBadge }}>
                                    <span style={{
                                        ...styles.statIconNew,
                                        ...(operationMode === 'decrease' ? styles.iconRed : styles.iconGreen)
                                    }}></span>
                                    {operationMode === 'decrease' ? 'Decrease Follow-up' : 'Follow-up Patients'}
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody style={styles.tbody}>
                        {specialityData.length > 0 ? (
                            specialityData.map((spec, index) => {
                                const key = spec.name;
                                const isHovered = hoveredRow === index;

                                return (
                                    <tr
                                        key={spec.id}
                                        style={{
                                            ...styles.tr,
                                            ...(isHovered ? styles.trHover : {})
                                        }}
                                        onMouseEnter={() => setHoveredRow(index)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                    >
                                        <td style={{ ...styles.td, ...styles.tdFirst }}>
                                            <div style={styles.specialityName}>
                                                <div style={{
                                                    ...styles.specialityIcon,
                                                    background: getBackgroundColor()
                                                }}>
                                                    {key.charAt(0)}
                                                </div>
                                                {key}
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.inputWrapper}>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={countData[key]?.new || 0}
                                                    onChange={(e) => handleCountChange(key, 'new', e.target.value)}
                                                    onFocus={() => setFocusedInput(`${key}-new`)}
                                                    onBlur={() => setFocusedInput(null)}
                                                    style={{
                                                        ...styles.input,
                                                        ...(focusedInput === `${key}-new` ? styles.inputFocused : {})
                                                    }}
                                                />
                                            </div>
                                        </td>
                                        <td style={{ ...styles.td, ...styles.tdLast }}>
                                            <div style={styles.inputWrapper}>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={countData[key]?.followUp || 0}
                                                    onChange={(e) => handleCountChange(key, 'followUp', e.target.value)}
                                                    onFocus={() => setFocusedInput(`${key}-followup`)}
                                                    onBlur={() => setFocusedInput(null)}
                                                    style={{
                                                        ...styles.input,
                                                        ...(focusedInput === `${key}-followup` ? styles.inputFocused : {})
                                                    }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="3" style={styles.emptyState}>
                                    <div style={styles.emptyIcon}>🏥</div>
                                    <div style={styles.emptyText}>Loading specialities...</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            );
        }
    };

    const renderStats = () => {
        if (operationMode === 'internal-swap') {
            return (
                <div style={styles.statsRow}>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>
                            <span style={{ ...styles.statIconNew, ...styles.iconRed }}></span>
                            Total New → Follow-up
                        </div>
                        <div style={styles.statValue}>{internalSwapTotals.newToFollowUp}</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>
                            <span style={{ ...styles.statIconNew, ...styles.iconGreen }}></span>
                            Total Follow-up → New
                        </div>
                        <div style={styles.statValue}>{internalSwapTotals.followUpToNew}</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>
                            Net Change
                        </div>
                        <div style={{
                            ...styles.statValue,
                            color: (internalSwapTotals.followUpToNew - internalSwapTotals.newToFollowUp) > 0 ? '#059669' :
                                   (internalSwapTotals.followUpToNew - internalSwapTotals.newToFollowUp) < 0 ? '#dc2626' : '#1e293b'
                        }}>
                            {(internalSwapTotals.followUpToNew - internalSwapTotals.newToFollowUp) > 0 ? '+' : ''}
                            {internalSwapTotals.followUpToNew - internalSwapTotals.newToFollowUp}
                        </div>
                    </div>
                </div>
            );
        }
        else if (operationMode === 'external-swap') {
            return (
                <div style={styles.statsRow}>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>
                            <span style={{ ...styles.statIconNew, ...styles.iconRed }}></span>
                            New → {selectedExternalTo || 'Other'}
                        </div>
                        <div style={styles.statValue}>{externalSwapTotals.newToOther}</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>
                            <span style={{ ...styles.statIconNew, ...styles.iconGreen }}></span>
                            Follow-up → {selectedExternalTo || 'Other'}
                        </div>
                        <div style={styles.statValue}>{externalSwapTotals.followUpToOther}</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>
                            Total Transfer
                        </div>
                        <div style={styles.statValue}>
                            {externalSwapTotals.newToOther + externalSwapTotals.followUpToOther}
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div style={styles.statsRow}>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>
                            <span style={{
                                ...styles.statIconNew,
                                ...(operationMode === 'decrease' ? styles.iconRed : styles.iconGreen)
                            }}></span>
                            Total {operationMode === 'decrease' ? 'Decrease' : 'New'}
                        </div>
                        <div style={styles.statValue}>{totals.new}</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>
                            <span style={{
                                ...styles.statIconNew,
                                ...(operationMode === 'decrease' ? styles.iconRed : styles.iconGreen)
                            }}></span>
                            Total {operationMode === 'decrease' ? 'Decrease' : 'Follow-ups'}
                        </div>
                        <div style={styles.statValue}>{totals.followUp}</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Active Specialities</div>
                        <div style={styles.statValue}>{specialityData.length}</div>
                    </div>
                </div>
            );
        }
    };

    return (
        <>
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    {/* Header Section */}
                    <div style={styles.headerSection}>
                        <h1 style={styles.mainTitle}>Speciality Count Management</h1>
                        <p style={styles.subtitle}>Configure consultation thresholds for medical specialities</p>
                    </div>

                    {/* Operation Selector */}
                    <div style={styles.operationSelector}>
                        <div style={styles.operationTitle}>Select Operation</div>
                        <div style={styles.radioGroup}>
                            <label
                                style={{
                                    ...styles.radioLabel,
                                    ...(operationMode === 'increase' ? styles.radioLabelSelected : {})
                                }}
                                onClick={() => setOperationMode('increase')}
                            >
                                <AddCircleIcon style={{ ...styles.radioIcon, ...styles.increaseIcon }} />
                                <div style={styles.radioText}>Increase Count</div>
                                <Radio
                                    checked={operationMode === 'increase'}
                                    onChange={() => setOperationMode('increase')}
                                    value="increase"
                                    name="operation-mode"
                                />
                            </label>

                            <label
                                style={{
                                    ...styles.radioLabel,
                                    ...(operationMode === 'decrease' ? styles.radioLabelSelected : {})
                                }}
                                onClick={() => setOperationMode('decrease')}
                            >
                                <RemoveCircleIcon style={{ ...styles.radioIcon, ...styles.decreaseIcon }} />
                                <div style={styles.radioText}>Decrease Count</div>
                                <Radio
                                    checked={operationMode === 'decrease'}
                                    onChange={() => setOperationMode('decrease')}
                                    value="decrease"
                                    name="operation-mode"
                                />
                            </label>

                            <label
                                style={{
                                    ...styles.radioLabel,
                                    ...(operationMode === 'internal-swap' ? styles.radioLabelSelected : {})
                                }}
                                onClick={() => setOperationMode('internal-swap')}
                            >
                                <SwapVerticalCircleIcon style={{ ...styles.radioIcon, ...styles.internalSwapIcon }} />
                                <div style={styles.radioText}>Internal Swap<br /><small>(New ↔ Follow-up)</small></div>
                                <Radio
                                    checked={operationMode === 'internal-swap'}
                                    onChange={() => setOperationMode('internal-swap')}
                                    value="internal-swap"
                                    name="operation-mode"
                                />
                            </label>

                            <label
                                style={{
                                    ...styles.radioLabel,
                                    ...(operationMode === 'external-swap' ? styles.radioLabelSelected : {})
                                }}
                                onClick={() => setOperationMode('external-swap')}
                            >
                                <TransferWithinAStationIcon style={{ ...styles.radioIcon, ...styles.externalSwapIcon }} />
                                <div style={styles.radioText}>External Swap<br /><small>(Between Specialities)</small></div>
                                <Radio
                                    checked={operationMode === 'external-swap'}
                                    onChange={() => setOperationMode('external-swap')}
                                    value="external-swap"
                                    name="operation-mode"
                                />
                            </label>
                        </div>

                        {/* External Swap Speciality Selector */}
                        {operationMode === 'external-swap' && (
                            <div style={styles.externalSwapSelector}>
                                <select
                                    value={selectedExternalFrom}
                                    onChange={(e) => setSelectedExternalFrom(e.target.value)}
                                    style={{
                                        ...styles.selectBox,
                                        ...(selectedExternalFrom ? { borderColor: '#f59e0b' } : {})
                                    }}
                                >
                                    <option value="">Select From Speciality</option>
                                    {specialityData.map(spec => (
                                        <option key={spec.id} value={spec.name}>
                                            {spec.name}
                                        </option>
                                    ))}
                                </select>

                                <SwapHorizIcon style={styles.swapArrow} />

                                <select
                                    value={selectedExternalTo}
                                    onChange={(e) => setSelectedExternalTo(e.target.value)}
                                    style={{
                                        ...styles.selectBox,
                                        ...(selectedExternalTo ? { borderColor: '#3b82f6' } : {})
                                    }}
                                    disabled={!selectedExternalFrom}
                                >
                                    <option value="">Select To Speciality</option>
                                    {specialityData
                                        .filter(spec => spec.name !== selectedExternalFrom)
                                        .map(spec => (
                                            <option key={spec.id} value={spec.name}>
                                                {spec.name}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Stats Cards */}
                    {specialityData.length > 0 && renderStats()}

                    {/* Main Card */}
                    <div style={styles.mainCard}>
                        <div style={styles.cardHeader}>
                            <h2 style={styles.cardTitle}>
                                {operationMode === 'increase' && 'Increase Count Configuration'}
                                {operationMode === 'decrease' && 'Decrease Count Configuration'}
                                {operationMode === 'internal-swap' && 'Internal Swap Configuration'}
                                {operationMode === 'external-swap' && 'External Swap Configuration'}
                            </h2>
                            <p style={styles.cardDescription}>
                                {operationMode === 'increase' && 'Set patient count thresholds for each medical speciality'}
                                {operationMode === 'decrease' && 'Reduce patient count for each medical speciality'}
                                {operationMode === 'internal-swap' && 'Swap between New and Follow-up within same speciality'}
                                {operationMode === 'external-swap' && 'Transfer patient counts between different specialities'}
                            </p>
                        </div>

                        <div style={styles.tableContainer}>
                            {renderTable()}
                        </div>

                        <div style={styles.buttonContainer}>
                            <Button
                                variant="contained"
                                onClick={handleSave}
                                disabled={
                                    specialityData.length === 0 ||
                                    isSaving ||
                                    (operationMode === 'external-swap' && (!selectedExternalFrom || !selectedExternalTo))
                                }
                                style={{
                                    ...styles.saveButton,
                                    background: getBackgroundColor(),
                                    opacity: isSaving ? 0.8 : 1,
                                    cursor: isSaving ? 'not-allowed' : 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isSaving) {
                                        const hoverColor = operationMode === 'increase' ? '#2563eb' :
                                                          operationMode === 'decrease' ? '#b91c1c' :
                                                          operationMode === 'internal-swap' ? '#6d28d9' :
                                                          '#d97706';
                                        e.currentTarget.style.background = hoverColor;
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSaving) {
                                        e.currentTarget.style.background = getBackgroundColor();
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }
                                }}
                            >
                                {isSaving ? (
                                    <>
                                        <CircularProgress size={18} color="inherit" />
                                        {operationMode === 'increase' && 'Increasing...'}
                                        {operationMode === 'decrease' && 'Decreasing...'}
                                        {operationMode === 'internal-swap' && 'Swapping...'}
                                        {operationMode === 'external-swap' && 'Transferring...'}
                                    </>
                                ) : (
                                    <>
                                        {operationMode === 'increase' && 'Increase Count'}
                                        {operationMode === 'decrease' && 'Decrease Count'}
                                        {operationMode === 'internal-swap' && 'Perform Internal Swap'}
                                        {operationMode === 'external-swap' && 'Transfer Counts'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <ToastAlert Message={toast.message} Type={toast.type} />
        </>
    );
};

export default OPCountDecrease;




