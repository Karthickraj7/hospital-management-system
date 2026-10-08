import React, { useState } from "react";
import LoupeIcon from "@mui/icons-material/Loupe";
import "./Consumestyle.css"

const Consumables = () => {
  // State for form fields
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");

  // State for the list of added consumables
  const [consumablesList, setConsumablesList] = useState([]);

  // Handle input change for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") setCategory(value);
    else if (name === "subCategory") setSubCategory(value);
    else if (name === "item") setItem(value);
    else if (name === "quantity") setQuantity(value);
  };

  // Handle adding item to the list
  const handleAddItem = () => {
    if (!category || !subCategory || !item || !quantity) {
      alert("Please fill all fields before adding!");
      return;
    }

    const newItem = {
      category,
      subCategory,
      item,
      quantity,
      selected: true, // Default checkbox checked
      used: "", // Initially empty for used quantity
      unused: "", // Initially empty for unused quantity
    };
    setConsumablesList([...consumablesList, newItem]);

    // Clear the form after adding the item
    setCategory("");
    setSubCategory("");
    setItem("");
    setQuantity("");
  };

  // Handle changing the checkbox state
  const handleCheckboxChange = (index) => {
    const updatedList = [...consumablesList];
    updatedList[index].selected = !updatedList[index].selected;
    setConsumablesList(updatedList);
  };

  // Handle updating the 'used' or 'unused' fields
  const handleQuantityChange = (index, field, value) => {
    const updatedList = [...consumablesList];
    updatedList[index][field] = value;
    setConsumablesList(updatedList);
  };

  // Handle submitting the list (you can add more logic here)
  const handleSubmit = () => {
    if (consumablesList.length === 0) {
      alert("No items to submit.");
      return;
    }
    // Submit the data (e.g., API call, form submission, etc.)
    console.log("Submitting items:", consumablesList);
  };

  return (
    <>
      <div className="Main_container_app">
        <h4>Consumables</h4>
        <div className="Consume_con">
          <div className="Consume_form">
            <label>
              Category <span>:</span>
            </label>
            <select
              name="category"
              value={category}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="#">Category</option>
            </select>
          </div>
          <div className="Consume_form">
            <label>
              Sub Category <span>:</span>
            </label>
            <select
              name="subCategory"
              value={subCategory}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="#">Sub Category</option>
            </select>
          </div>
          <div className="Consume_form">
            <label>
              Item <span>:</span>
            </label>
            <select
              name="item"
              value={item}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="#">Item Names</option>
            </select>
          </div>
          <div className="Consume_form">
            <input
              type="text"
              placeholder="Quantity"
              name="quantity"
              value={quantity}
              onChange={handleInputChange}
            />
          </div>
          <div className="Regis">
            <button
              type="button"
              className="search_div_bar_btn_1"
              onClick={handleAddItem}
            >
              <LoupeIcon />
            </button>
          </div>
        </div>

        {/* Displaying the added consumables in a table */}
        {consumablesList.length > 0 && (
          <table className="consum_tbl">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Category</th>
                <th>Sub Category</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>Select</th>
                <th>Used</th>
                <th>Unused</th>
              </tr>
            </thead>
            <tbody>
              {consumablesList.map((consumable, index) => (
                <tr key={index}>
                   <td>{index + 1}</td>
                  <td>{consumable.category}</td>
                  <td>{consumable.subCategory}</td>
                  <td>{consumable.item}</td>
                  <td>{consumable.quantity}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={consumable.selected}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      placeholder="Used"
                      value={consumable.used}
                      onChange={(e) =>
                        handleQuantityChange(index, "used", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      placeholder="Unused"
                      value={consumable.unused}
                      onChange={(e) =>
                        handleQuantityChange(index, "unused", e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Submit button */}
        <div className="Main_container_Btn">
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </>
  );
};

export default Consumables;
