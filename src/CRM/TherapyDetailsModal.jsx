import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import axios from "axios";

function TherapyDetailsModal({ open, handleClose, therapyData, UrlLink,therpychange }) {
    const [rescheduleDate, setRescheduleDate] = useState("");
    const [localData, setLocalData] = useState(null);

    // Sync therapyData into localData when modal opens
    useEffect(() => {
        setLocalData(therapyData);
        setRescheduleDate("");
    }, [therapyData]);

    if (!localData) return null;

    const handleReschedule = async () => {
        if (!rescheduleDate) {
            alert("Please select a date.");
            return;
        }

        try {
            const response = await axios.post(`${UrlLink}OP/reschedule_therapy`, {
                Request_Id: localData.Request_Id,
                next_review_date: rescheduleDate
            });

            if (response.data.status === "success") {
                alert("Rescheduled successfully");

                // Update local next_review_date without refresh
                setLocalData({
                    ...localData,
                    next_review_date: rescheduleDate
                });
                therpychange();

                setRescheduleDate(""); // clear input
            } else {
                alert("Reschedule : " + response.data.message);
            }
        } catch (error) {
            console.error("Error during reschedule:", error);
            alert("An error occurred while rescheduling.");
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Therapy Details</DialogTitle>
            <DialogContent>
                <p><strong>Request Id :</strong> {localData.Request_Id}</p>
                <p><strong>Patient Name :</strong> {localData.PatientName}</p>
                <p><strong>Phone No :</strong> {localData.PhoneNo}</p>
                <p><strong>Doctor Name :</strong> {localData.Doctor_Name}</p>
                <p><strong>Therapy Type :</strong> {localData.Therapy_Type}</p>
                <p><strong>Theraphy Name :</strong> {localData.Theraphy_Name}</p>
                <p><strong>Total Session :</strong> {localData.total_sessions}</p>
                <p><strong>Sessions Completed :</strong> {localData.Sessions_Completed}</p>
                <p><strong>Balance Sessions :</strong> {localData.Sessions_Balance}</p>
                <p><strong>Next Review Date : </strong> {localData.next_review_date}</p>
                <br />
                <p>
                    <strong>Reschedule Date : </strong>
                    <input
                        type="date"
                        value={rescheduleDate}
                        onChange={(e) => setRescheduleDate(e.target.value)}
                    />
                </p>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleReschedule} disabled={!rescheduleDate}>Reschedule</Button>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default TherapyDetailsModal;
