import React, { useContext } from "react";
import Card from "./Card";
import { DataContext } from "../context/DataContext";
export default function Products() {

    const { result, loading } = useContext(DataContext);
    if (loading || result == null) {
        return <p style={{ textAlign: "center", padding: "120px 0 120px 0" }}>Loading products...</p>;
    }

    const allProducts = result?.allProducts;
    const uniqueCategories = [...new Set(allProducts.map(p => p.category))];

    return (
        <section id="products" className="product-section">
            <div className="section-content">
                <h2>Discover products for you</h2>
                <div className="product-category">
                    {
                        uniqueCategories.map((name, idx) => {
                            const bgColor = idx % 2 ? "#0b0b0c" : "#000000";
                            return (
                                <React.Fragment key={idx}>
                                    <h3 key={name}>{name}</h3>
                                    <div style={{ backgroundColor: bgColor }} key={idx} className="product-grid">
                                        {
                                            allProducts.map((productData, pIdx) => {
                                                if (productData.category === name) {
                                                    return (
                                                        /* 🌟 Pass the data object directly */
                                                        <Card key={productData._id || pIdx} data={productData} />
                                                    );
                                                }
                                                return null;
                                            })
                                        }
                                    </div>
                                </React.Fragment>
                            )
                        })
                    }
                </div>
            </div>
        </section>
    )
}