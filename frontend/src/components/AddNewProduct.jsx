import { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faPlus } from "@fortawesome/free-solid-svg-icons";
// import "./AddProductModal.css";
import "../styles/AddNewProduct.css";
import { DataContext } from "../context/DataContext";
const SPEC_FIELDS_BY_CATEGORY = {
    Phones: [
        { name: "display", label: "Display Spec" },
        { name: "processor", label: "Processor" },
        { name: "ram", label: "RAM" },
        { name: "storage", label: "Storage" },
        { name: "rearCamera", label: "Rear Camera" },
        { name: "frontCamera", label: "Front Camera" },
        { name: "battery", label: "Battery Capacity" },
        { name: "operatingSystem", label: "Operating System" },
        { name: "weight", label: "Weight" },
    ],
    Laptops: [
        { name: "processor", label: "Processor" },
        { name: "gpu", label: "Graphics Card (GPU)" },
        { name: "ram", label: "RAM" },
        { name: "storage", label: "Storage Type & Size" },
        { name: "display", label: "Display Size & Resolution" },
        { name: "battery", label: "Battery Life" },
        { name: "operatingSystem", label: "Operating System" },
        { name: "weight", label: "Weight" },
    ],
    Monitors: [
        { name: "screenSize", label: "Screen Size" },
        { name: "resolution", label: "Resolution" },
        { name: "refreshRate", label: "Refresh Rate (Hz)" },
        { name: "panelType", label: "Panel Type (IPS/OLED/VA)" },
        { name: "responseTime", label: "Response Time" },
        { name: "aspectRatio", label: "Aspect Ratio" },
    ],
    Keyboards: [
        { name: "switchType", label: "Switch Type (Mechanical/Membrane)" },
        { name: "connectivity", label: "Connectivity (Wired/Wireless)" },
        { name: "backlight", label: "RGB / Backlight" },
        { name: "layout", label: "Keyboard Layout (TKL/Full)" },
    ],
    Headphones: [
        { name: "type", label: "Type (Over-Ear/In-Ear)" },
        { name: "connectivity", label: "Connectivity (Bluetooth/Wired)" },
        { name: "anc", label: "Active Noise Cancellation (ANC)" },
        { name: "batteryLife", label: "Battery Life" },
        { name: "driverSize", label: "Driver Size" },
    ],
    Tablets: [
        { name: "display", label: "Display Size" },
        { name: "processor", label: "Processor" },
        { name: "ram", label: "RAM" },
        { name: "storage", label: "Storage" },
        { name: "battery", label: "Battery" },
        { name: "operatingSystem", label: "OS" },
    ],
    "Smart Watches": [
        { name: "displaySize", label: "Display Size" },
        { name: "batteryLife", label: "Battery Life" },
        { name: "waterResistance", label: "Water Resistance" },
        { name: "sensors", label: "Health Sensors" },
        { name: "compatibility", label: "OS Compatibility" },
    ],
    Mouse: [
        { name: "dpi", label: "Max DPI" },
        { name: "sensor", label: "Sensor Type" },
        { name: "connectivity", label: "Connectivity" },
        { name: "weight", label: "Weight" },
        { name: "buttons", label: "Programmable Buttons" },
    ],
}
export default function AddProduct({ isAddProductOpen, setIsAddProductOpen }) {
    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        price: "",
        stock: "",
        category: "",
        image: null,
        specifications: {},
    });
    const [imagePreview, setImagePreview] = useState(null);
    const {notification, setNotification} = useContext(DataContext);

    // if (!isAddProductOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setFormData((prev) => ({
            ...prev,
            category: selectedCategory,
            specifications: {}, // Reset specs when category changes
        }));
    };
    const handleSpecChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            specifications: {
                ...prev.specifications,
                [name]: value,
            },
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     console.log("New Product Data Submitted:", formData);
    //     const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/upload`, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify(formData),
    //         credentials: "include"
    //     });
    //     const data = await res.json();
    //     console.log(data);

    //     // Add API logic here
    //     // onClose();

    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();

        data.append("name", formData.name);
        data.append("brand", formData.brand);
        data.append("price", formData.price);
        data.append("stock", formData.stock);
        data.append("category", formData.category);

        data.append(
            "specifications",
            JSON.stringify(formData.specifications)
        );

        data.append("image", formData.image);

        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/product/upload`,
                {
                    method: "POST",
                    body: data,
                    credentials: "include",
                }
            );

            const resData = await res.json();
            // console.log(result);
            if(resData == "Unauthorized") {
                setNotification({msg: resData, type: "error"});
            }
            if(resData == "Access denied.") {
                setNotification({msg: resData, type: "error"});
            }
            if(resData == "No file") {
                setNotification({msg: resData, type: "error"})
            }
            if(resData == "Upload successfull") {
                setNotification({msg: resData, type: "success"});
            }
            if(resData == "Can't upload new product, try again later!") {
                setNotification({msg: resData, type: "error"});
            }
        } catch (error) {
            setNotification({msg: "Error uploading product", type: "error"});
            console.error("Error uploading product:", error);
        }
    };

    const closeNotification = () => {
        setNotification(null);
    }

    // style={isAddProductOpen ? {top: "0"} : {top: "200%"}}
    return (

        <div style={isAddProductOpen ? { top: "15%" } : { top: "100%" }} className="add-product-container">
            {
                notification ? (
                    <div style={notification.type == "error" ?
                        { background: "rgba(177, 20, 20, 0.2)", border: "1px solid rgba(216, 5, 5, 0.2)" } : {}}
                        className="notification-container">
                        <p className="msg">{notification.msg}</p>
                        <button onClick={closeNotification}><FontAwesomeIcon icon={faX} /></button>
                    </div>
                ) : null
            }
            <div className="modal-header">
                <h3>Add New Product</h3>
                <button className="close-btn" onClick={() => setIsAddProductOpen(false)}>
                    <FontAwesomeIcon icon={faX} />
                </button>
            </div>
            <form onSubmit={handleSubmit} className="product-form">
                {/* Main Info Grid */}
                <div className="form-grid">
                    <div className="form-group span-2">
                        <label>Product Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="e.g. Google Pixel 9 Pro"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Brand</label>
                        <input
                            type="text"
                            name="brand"
                            placeholder="Enter brand name"
                            value={formData.brand}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select name="category"
                            value={formData.category}
                            onChange={handleCategoryChange}
                            required
                        >
                            <option value="" disabled>Select Category</option>
                            {Object.keys(SPEC_FIELDS_BY_CATEGORY).map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Price (&#8377;)</label>
                        <input
                            type="number"
                            name="price"
                            placeholder="e.g. 79999"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Stock / Availability</label>
                        <input
                            type="number"
                            name="stock"
                            placeholder="e.g. 25"
                            value={formData.stock}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Image Upload Area */}
                    <div className="form-group span-2">
                        <label>Product Image</label>
                        <div className="image-upload-wrapper">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                id="product-image-input"
                                required
                            />
                            <label htmlFor="product-image-input" className="upload-box">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="preview-img" />
                                ) : (
                                    <span>Click to Upload Image</span>
                                )}
                            </label>
                        </div>
                    </div>
                </div>
                {/* Dynamic Specifications Section */}
                {formData.category && SPEC_FIELDS_BY_CATEGORY[formData.category] && (
                    <div className="specifications-section">
                        <h4>{formData.category} Specifications</h4>
                        <div className="form-grid">
                            {SPEC_FIELDS_BY_CATEGORY[formData.category].map((field) => (
                                <div key={field.name} className="form-group">
                                    <label>{field.label}</label>
                                    <input
                                        type="text"
                                        name={field.name}
                                        placeholder={`Enter ${field.label.toLowerCase()}`}
                                        value={formData.specifications[field.name] || ""}
                                        onChange={handleSpecChange}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Form Actions */}
                <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={() => setIsAddProductOpen(false)}>
                        Cancel
                    </button>
                    <button type="submit" className="btn-submit">
                        <FontAwesomeIcon icon={faPlus} /> Add Product
                    </button>
                </div>
            </form>
        </div>
        //     {/* <div style={isAddProductOpen ? {top: "0"} : {top: "200%"}} className="modal-overlay"> */}
        // {/* </div> */}
    )
}
