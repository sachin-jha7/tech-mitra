import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/ManageProducts.css";
import React, { useContext, useState } from "react";
import { DataContext } from "../context/DataContext";
import EditProduct from "./EditProduct";

export default function ManageProducts({ isManageProductOpen, setIsManageProductOpen }) {
    const { result, loading } = useContext(DataContext);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [productData, setProductData] = useState(null);
    // if (loading || result === null) {
    //     return <p style={isManageProductOpen ? { top: "15%", textAlign: "center", padding: "120px 0 120px 0" }
    //         : { top: "100%", textAlign: "center", padding: "120px 0 120px 0" }
    //     }>Loading products...</p>;
    // }
    const allProducts = result?.allProducts;
    // const uniqueCategories = [...new Set(allProducts.map(p => p.category))];
    const openEditForm = (item) => {
        setIsEditFormOpen(true);
        setProductData(item);
    }
    return (
        <>
            <div style={isManageProductOpen ? { top: "15%" } : { top: "100%" }} className="manage-products-container">
                <div className="header">
                    <h2>Manage Products</h2>
                    <button onClick={() => setIsManageProductOpen(false)}><FontAwesomeIcon icon={faX} /></button>
                </div>
                <div className="container">
                    <div className="card-grid">
                        {
                            // uniqueCategories.map((name, idx) => {
                            //     return (
                            //         <React.Fragment key={idx}>
                            //             <h3 key={name}>{name}</h3>

                            //         </React.Fragment>
                            //     )
                            // })
                            allProducts.map((item, idx) => {
                                return (
                                    <div key={idx} className="card">
                                        <img src={item.url} alt="product" />
                                        <div className="texts">
                                            <p className="card-name">{item.name}</p>
                                            <p className="card-price">&#8377; {item.price}</p>
                                        </div>
                                        <button onClick={() => openEditForm(item)} className="edit-btn">Edit</button>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <EditProduct isEditFormOpen={isEditFormOpen} setIsEditFormOpen={setIsEditFormOpen} productData={productData} />
        </>
    )
}