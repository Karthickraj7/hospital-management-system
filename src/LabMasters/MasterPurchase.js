import React, { useState } from 'react';
import "./Master.css";
function MasterPurchase() {
    const [formData, setFormData] = useState({
        code: '000000',
        itemName: '',
        manufacturer: '',
        category: '',
        medicine: '',
        generic: '',
        strength: '',
        pack: '',
        uom: '',
        notified: '',
        narcotic: '',
        inactive: false,
        ved: '',
        createUser: '',
        createDate: '',
        supplier: '',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'inactive') {
            const isInactive = checked;
            if (isInactive) {
                // Reset other fields when "Inactive" is checked
                const resetData = {
                    ...formData,
                    code: '',
                    itemName: '',
                    manufacturer: '',
                    category: '',
                    medicine: '',
                    generic: '',
                    strength: '',
                    pack: '',
                    uom: '',
                    notified: '',
                    narcotic: '',
                    ved: '',
                    createUser: '',
                    createDate: '',
                    supplier: '',
                };
                setFormData({
                    ...resetData,
                    inactive: true,
                });
            } else {
                setFormData({
                    ...formData,
                    inactive: false,
                });
            }
        } else if (!formData.inactive) {
            const fieldValue = type === 'checkbox' ? checked : value;
            setFormData({
                ...formData,
                [name]: fieldValue,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        generateCode();

    };

    const generateCode = () => {
        // Get the current code from the form data
        const currentCode = formData.code;

        // Increment the code and pad with leading zeros
        const nextCode = (parseInt(currentCode, 10) + 1).toString().padStart(6, '0');

        setFormData({
            ...formData,
            code: nextCode,
        });
    };

    return (
        <div className="purchase-form">
            <div className="pur_form_head">
                <h3>Product Master</h3>
            </div>
              <div className='MasterPurchaseMaster'>
            <form onSubmit={handleSubmit} className='Master_Inventory_Form'>
                <div className="pur_flex">
                    <div className="purchase_row_number">
                        <label  className= "label_Purchase" htmlFor="code">Code:</label>
                        <input
                            type="text"
                            id="code"
                            name="code"
                            placeholder="Enter Code"
                            value={formData.code}
                            onChange={handleChange}
                            required
                            disabled={formData.inactive}
                        />
                    </div>

                    <div className="purchase_row_number">
                        <label className= "label_Purchase" htmlFor="itemName">Item Name:</label>
                        <input
                            type="text"
                            id="itemName"
                            name="itemName"
                            placeholder="Enter Item"
                            value={formData.itemName}
                            onChange={handleChange}
                            disabled={formData.inactive}
                        />
                    </div>

                    <div className="purchase_row_number">
                        <label className= "label_Purchase" htmlFor="manufacturer">Manufacturer:</label>
                        <input
                            type="text"
                            id="manufacturer"
                            name="manufacturer"
                            placeholder="Enter Manufacturer"
                            value={formData.manufacturer}
                            onChange={handleChange}
                            disabled={formData.inactive}
                        />
                    </div>

                    <div className="purchase_row_number">
                        <label className= "label_Purchase" htmlFor="category">Category:</label>
                        <input
                            type="text"
                            id="category"
                            name="category"
                            placeholder="Enter Category"
                            value={formData.category}
                            onChange={handleChange}
                            disabled={formData.inactive}
                        />
                    </div>
                </div>
                <div className="pur_flex">
                    <div className="purchase_row_number">
                        <label className= "label_Purchase" htmlFor="supplier">Supplier:</label>
                        <input
                            type="text"
                            id="supplier"
                            name="supplier"
                            placeholder="Enter Supplier"
                            value={formData.supplier}
                            onChange={handleChange}
                            disabled={formData.inactive}
                        />
                    </div>
                    <div className="purchase_row_number">
                        <label className= "label_Purchase" htmlFor="medicine">Medicine:</label>
                        <input
                            type="text"
                            id="medicine"
                            name="medicine"
                            placeholder="Enter Medicine"
                            value={formData.medicine}
                            onChange={handleChange}
                            disabled={formData.inactive}
                        />
                    </div>

                    <div className="purchase_row_number">
                        <label className= "label_Purchase" htmlFor="generic">Generic:</label>
                        <input
                            type="text"
                            id="generic"
                            name="generic"
                            placeholder="Enter Generic"
                            value={formData.generic}
                            onChange={handleChange}
                            disabled={formData.inactive}
                        />
                    </div>
                    <div className="purchase_row_number">
                        <label className= "label_Purchase" htmlFor="strength">Strength:</label>
                        <input
                            type="text"
                            id="strength"
                            name="strength"
                            placeholder="Enter Strength"
                            value={formData.strength}
                            onChange={handleChange}
                            disabled={formData.inactive}
                        />
                    </div>
                </div>
                <div className="pur_flex">
                    <div className="purchase_row_number">
                        <label  className= "label_Purchase" htmlFor="pack">Pack:</label>
                        <input
                            type="text"
                            id="pack"
                            name="pack"
                            placeholder="Enter Pack"
                            value={formData.pack}
                            onChange={handleChange}
                            disabled={formData.inactive}
                        />
                    </div>

                    <div className="purchase_row_number">
                        <label className= "label_Purchase"  htmlFor="uom">UOM:</label>
                        <input
                            type="text"
                            id="uom"
                            name="uom"
                            placeholder="Enter UOM"
                            value={formData.uom}
                            onChange={handleChange}
                            disabled={formData.inactive}
                        />
                    </div>
                    <div className="purchase_row_number">
                        <label className= "label_Purchase" htmlFor="notified">HSN Code:</label>
                        <input
                            type="text"
                            id="notified"
                            name="notified"
                            placeholder="Enter Notified"
                            value={formData.notified}
                            onChange={handleChange}
                            disabled={formData.inactive}
                        />
                    </div>
                    <div className="purchase_row_number">
                        <label className= "label_Purchase" htmlFor="narcotic">Narcotic:</label>
                        <input
                            type="text"
                            id="narcotic"
                            name="narcotic"
                            placeholder="Enter Narcotic"
                            value={formData.narcotic}
                            onChange={handleChange}
                            disabled={formData.inactive}
                        />
                    </div>
                </div>
                <div className="pur_flex">




                   

                    <div className="purchase_row_number">
                        <label className= "label_Purchase" htmlFor="ved">VED:</label>
                        <input
                            type="text"
                            id="ved"
                            name="ved"
                            placeholder="Enter VED"
                            value={formData.ved}
                            onChange={handleChange}
                            disabled={formData.inactive}
                        />
                    </div>

                    <div className="purchase_row_number">
                        <label className= "label_Purchase" htmlFor="createUser">Create User:</label>
                        <input
                            type="text"
                            id="createUser"
                            name="createUser"
                            placeholder="Enter Create User"
                            value={formData.createUser}
                            onChange={handleChange}
                            disabled={formData.inactive}
                        />
                    </div>

                    <div className="purchase_row_number">
                        <label className= "label_Purchase" htmlFor="createDate">Create Date:</label>
                        <input
                            type="text"
                            id="createDate"
                            name="createDate"
                            placeholder="Enter Create Date"
                            value={formData.createDate}
                            onChange={handleChange}
                            disabled={formData.inactive}
                        />
                    </div>
                    <div className="purchase_row_number">
                        <label  className= "label_Purchase" htmlFor="inactive">Inactive:</label>
                        <input
                            type="checkbox"
                            id="inactive"
                            name="inactive"
                            checked={formData.inactive}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className='Master_pruchase_btn'>
                    <button className=' submit_master' disabled={formData.inactive}>
                        Submit
                    </button>
                </div>
            </form>
            </div>
        </div>
    );
}

export default MasterPurchase;

