import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';

const IPCountIncrease = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const userRecord = useSelector(state => state.userRecord?.UserData);
    const dispatch = useDispatch();
    const toast = useSelector((state) => state.userRecord?.toast);

    const [specialityData, setSpecialityData] = useState([]);
    const [countData, setCountData] = useState({});
    const [hoveredRow, setHoveredRow] = useState(null);
    const [focusedInput, setFocusedInput] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Same specialities as your management command
    const targetSpecialities = {
        'GENERAL MEDICINE': null,
        'SURGERY': null,
        'ENT': null,
        'ORTHOPEDICS': null,
        'GYNECOLOGY': null,
        'OBSTETRICS': null,
        'PAEDIATRICS': null,
        'OPTHALMOLOGY': null,
        'DERMATOLOGY': null,
        'PULMONOLOGY': null,
        'PSYCHIATRY' : null,
        'UROLOGY' : null,
        
        
    };

    useEffect(() => {
        axios.get(`${UrlLink}Masters/Speciality_Detials_link`)
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
                filtered.forEach(spec => {
                    initialCounts[spec.name] = 0;
                });

                setSpecialityData(filtered);
                setCountData(initialCounts);
            })
            .catch((err) => console.log(err));
    }, [UrlLink]);

    const handleCountChange = (speciality, value) => {
        setCountData(prev => ({
            ...prev,
            [speciality]: parseInt(value) || 0
        }));
    };

    const handleSave = () => {
        if (isSaving) return;
        setIsSaving(true);

        const payload = {
            counts: Object.keys(countData).map(key => ({
                speciality: key,
                admissionCount: countData[key]
            })),
            created_by: userRecord?.username || 'system'
        };

        axios.post(`${UrlLink}MCI/IP_Speciality_Admission_Count_Link`, payload)
            .then(res => {
                const response = res.data;
                const messageType = Object.keys(response)[0];
                const messageContent = Object.values(response)[0];
                dispatch({ type: 'toast', value: { message: messageContent, type: messageType } });
            })
            .catch(err => {
                const msg = err.response?.data?.error || 'Failed to create IP admissions';
                dispatch({ type: 'toast', value: { message: msg, type: 'error' } });
            })
            .finally(() => setIsSaving(false));
    };

    const totalAdmissions = Object.values(countData).reduce((a, b) => a + b, 0);

    const styles = {
        // ... (Keep all your beautiful styles from OP version)
        // Only changes: single column, badge says "Admissions"
        // I'll keep it minimal here for brevity
        pageWrapper: { background: '#f8fafc', minHeight: '100vh', padding: '40px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
        container: { maxWidth: '1000px', margin: '0 auto' },
        headerSection: { textAlign: 'center', marginBottom: '40px', color: '#1e293b' },
        mainTitle: { fontSize: '36px', fontWeight: '700', marginBottom: '12px' },
        subtitle: { fontSize: '16px', color: '#64748b' },
        statsRow: { display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap', justifyContent: 'center' },
        statCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px 32px', minWidth: '220px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' },
        statLabel: { fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' },
        statValue: { fontSize: '32px', fontWeight: '700', color: '#1e293b' },
        mainCard: { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden', border: '1px solid #e2e8f0' },
        cardHeader: { background: '#7c2d12', padding: '24px 32px', color: '#fff' }, // Brownish red for IP
        cardTitle: { fontSize: '20px', fontWeight: '600', margin: 0 },
        tableContainer: { padding: '24px', overflowX: 'auto' },
        table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' },
        th: { padding: '16px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#374151', textTransform: 'uppercase', backgroundColor: '#f8fafc', borderBottom: '2px solid #e5e7eb' },
        td: { padding: '16px 20px', fontSize: '14px', color: '#374151', backgroundColor: '#fff', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6' },
        input: { width: '120px', padding: '12px 16px', border: '2px solid #fca5a5', borderRadius: '8px', fontSize: '16px', fontWeight: '600', textAlign: 'center', outline: 'none', transition: 'all 0.2s' },
        inputFocused: { borderColor: '#dc2626', boxShadow: '0 0 0 4px rgba(220,38,38,0.15)' },
        badge: { backgroundColor: '#fee2e2', color: '#991b1b', padding: '6px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' },
        saveButton: { background: '#7c2d12', padding: '14px 40px', fontSize: '16px', fontWeight: '600' }
    };

    return (
        <>
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <div style={styles.headerSection}>
                        <h1 style={styles.mainTitle}>IP Admission Count Management</h1>
                        <p style={styles.subtitle}>Set target admission counts per speciality (with automatic bed allocation)</p>
                    </div>

                    {specialityData.length > 0 && (
                        <div style={styles.statsRow}>
                            <div style={styles.statCard}>
                                <div style={styles.statLabel}>Total Planned Admissions</div>
                                <div style={styles.statValue}>{totalAdmissions}</div>
                            </div>
                            <div style={styles.statCard}>
                                <div style={styles.statLabel}>Active Specialities</div>
                                <div style={styles.statValue}>{specialityData.length}</div>
                            </div>
                        </div>
                    )}

                    <div style={styles.mainCard}>
                        <div style={styles.cardHeader}>
                            <h2 style={styles.cardTitle}>In-Patient Admission Targets</h2>
                            <p style={{ margin: '8px 0 0', opacity: 0.9 }}>Enter desired number of new admissions per speciality</p>
                        </div>

                        <div style={styles.tableContainer}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>Speciality</th>
                                        <th style={{ textAlign: 'center', borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>
                                            <span style={styles.badge}>Target Admissions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {specialityData.length > 0 ? specialityData.map((spec, index) => {
                                        const key = spec.name;
                                        const isHovered = hoveredRow === index;

                                        return (
                                            <tr key={spec.id} style={{ backgroundColor: isHovered ? '#fef2e2' : '#fff', transition: '0.2s' }}
                                                onMouseEnter={() => setHoveredRow(index)} onMouseLeave={() => setHoveredRow(null)}>
                                                <td style={{ fontWeight: '600', color: '#1f2937' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <div style={{ width: '40px', height: '40px', background: '#7c2d12', color: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                            {key.charAt(0)}
                                                        </div>
                                                        {key}
                                                    </div>
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={countData[key] || 0}
                                                        onChange={(e) => handleCountChange(key, e.target.value)}
                                                        onFocus={() => setFocusedInput(key)}
                                                        onBlur={() => setFocusedInput(null)}
                                                        style={{
                                                            ...styles.input,
                                                            ...(focusedInput === key ? styles.inputFocused : {})
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    }) : (
                                        <tr><td colSpan="2" style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>Loading specialities...</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div style={{ padding: '20px 24px', backgroundColor: '#f8fafc', borderTop: '1px solid #e5e7eb', textAlign: 'right' }}>
                            <Button variant="contained" onClick={handleSave} disabled={isSaving || totalAdmissions === 0}
                                style={{ ...styles.saveButton, opacity: isSaving ? 0.7 : 1 }}>
                                {isSaving ? <>Saving... <CircularProgress size={20} /></> : 'Create IP Admissions'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <ToastAlert Message={toast.message} Type={toast.type} />
        </>
    );
};

export default IPCountIncrease;

