import { useParams } from "react-router-dom"
import { useState, useContext } from "react";
import { DataContext } from "../context/DataContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
export default function ProductDetails() {
    const { id } = useParams();

    const indianFormatter = new Intl.NumberFormat('en-IN');
    // const [allProduct, setallProduct] = useState(null);
    const { result, loading, setNotification } = useContext(DataContext);

    const [btnState, setBtnState] = useState("idle");


    if (loading) {
        return <p style={{ textAlign: "center", padding: "120px 0 120px 0" }}>Loading products...</p>;
    }
    const data = result.allProducts.find(item => item._id == id);


    function formatSpecificationName(key) {
        return key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, char => char.toUpperCase());
    }

    const storageKey = "techMitra";
    const cartArray = JSON.parse(localStorage.getItem(storageKey)) || [];
    const addToCart = (id) => {
        const product = {
            id: id,
            qty: 1
        };
        const itemExists = cartArray.find((item) => item.id == id);
        if(itemExists) {
            itemExists.qty += 1; 
        } else {
            cartArray.push(product);
        }
        localStorage.setItem(storageKey, JSON.stringify(cartArray));
        setBtnState("Adding");
        setTimeout(() => {
            setBtnState("Added");

        }, 300);
        setNotification("");
        setTimeout(() => {
            setNotification(null);
        }, 100);
    }

    // console.log(specificationArray[0].display);
    return (
        <div className="product-details-container">
            <div className="product-details-wrapper">
                <div className="product-img-in-detail">
                    <img src={data.url} alt="product" />
                </div>
                <div className="product-info-in-detail">
                    <div className="left">
                        <h2>{data.name}</h2>
                        <h3>&#8377; {indianFormatter.format(data.price)}</h3>
                        <p>
                            {data.description}
                        </p>
                        {
                            btnState === "idle" ? (
                                <button onClick={() => addToCart(data._id)} className="add-to-cart-btn">Add to Cart</button>
                            ) : btnState === "Adding" ? (
                                <button className="add-to-cart-btn">Adding <FontAwesomeIcon className="force-spin" icon={faCircleNotch} /></button>
                            ) : (
                                <button style={{backgroundColor: "#06917e"}} className="add-to-cart-btn">&#10004; Added</button>
                            )
                        }
                    </div>

                    <div className="right">
                        <h2>Specifications</h2>
                        <div className="info-container">
                            {
                                Object.entries(data.specifications).map(([key, value]) => (
                                    <div key={key}>
                                        <p>{formatSpecificationName(key)}</p>
                                        <p>{value}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}