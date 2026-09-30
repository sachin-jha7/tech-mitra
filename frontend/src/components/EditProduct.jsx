import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import img from "../assets/google-pixel-9.jpg";
import "../styles/EditProduct.css";
import { faX } from "@fortawesome/free-solid-svg-icons";

export default function EditProduct({ isEditFormOpen, setIsEditFormOpen, productData }) {
    if (!productData) {
        return <p style={isEditFormOpen ? { display: "block", textAlign: "center", padding: "120px 0 120px 0" } :
         { display: "none", textAlign: "center", padding: "120px 0 120px 0" }}>Loading products...</p>;
    }
    function formatSpecificationName(key) {
        return key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, char => char.toUpperCase());
    }
    return (
        <div style={isEditFormOpen ? { top: "15%" } : { top: "100%" }} className="edit-form">
            <div className="header">
                <h2>Edit Form</h2>
                <button onClick={() => setIsEditFormOpen(false)}><FontAwesomeIcon icon={faX} /></button>
            </div>
            <div className="edit-form-wrapper">
                <img src={productData.url} alt="product" />
                <div className="form-element">
                    <input id="image" type="file" accept="image/*" hidden />
                    <label className="edit-img" htmlFor="image">Edit Image</label>
                </div>
                <div className="form-grid">
                    <div className="form-element">
                        <label htmlFor="name">Edit name</label>
                        <input value={productData.name} id="name" type="text" required readOnly />
                    </div>
                    <div className="form-element">
                        <label htmlFor="price">Edit price</label>
                        <input id="price" value={productData.price} type="number" required readOnly />
                    </div>
                    <div className="form-element">
                        <label htmlFor="price">Edit stock/availabilty</label>
                        <input id="price" value={productData.stock} type="number" required readOnly />
                    </div>

                </div>
                <div className="form-grid">
                    <h3>Specifications</h3>
                    <br />
                    {
                        Object.entries(productData.specifications).map(([key, value]) => {
                            return (
                                <div key={key} className="form-element">
                                    <label htmlFor={value}>{formatSpecificationName(key)}</label>
                                    <input id={value} value={value} type="text" readOnly />
                                </div>
                            )
                        })
                    }
                </div>
                <button className="edit-btn">Edit</button>
            </div>
        </div>
    )
}