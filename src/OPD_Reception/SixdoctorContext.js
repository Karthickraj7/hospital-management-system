import React from 'react'
import "./Sixdoctor.css";

const SixdoctorContext = ({ x, y, onClose, onSelectStatus, onMouseLeave }) => {
    return (
        <div
            className="context-menu"
            style={{ top: y, left: x }}
            onMouseLeave={onMouseLeave}
        >
            <ul>

                <li onClick={() => onSelectStatus('InProgress')}>Check In</li>
                <li onClick={() => onSelectStatus('CheckOut')}>Check Out</li>
                <li onClick={() => onSelectStatus('Completed')}>Completed</li>
            </ul>
        </div>
    )
}

export default SixdoctorContext