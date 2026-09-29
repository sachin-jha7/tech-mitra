import { Link } from "react-router-dom";


export default function Card(data, idx) {
    
    const indianFormatter = new Intl.NumberFormat('en-IN');
    return (
        <div key={idx} className="card">
            <img className="product-img" src={data.data.url} alt="product" />
            <div className="product-info">
                <p className="product-name">{data.data.name}</p>
                <div className="stock-info">
                    <div></div>
                    <p>{data.data.stock} units available</p>
                </div>
                <p className="product-price">&#8377; {indianFormatter.format(data.data.price)}</p>
                <Link to={`/product/${data.data._id}`} onClick={() => {
                    sessionStorage.setItem(
                        "homeScrollPosition",
                        window.scrollY.toString()
                    );
                }} className="view-details-btn">View Details</Link>
            </div>

            {/* <div className="btns">
                
                <button className="product-btn add-to-cart-btn">Add To Cart</button>
            </div> */}
        </div>
        
    )
}