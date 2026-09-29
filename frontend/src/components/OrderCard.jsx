import { useState } from "react";
export default function OrderCard({ item, idx }) {
    const [isExpanded, setIsExpanded] = useState(false);
    return (

        <div key={idx} className="order-item">
            <div className="product-cell" >
                <img src={item.productImage} alt="product" />
                <p>{item.productName}</p>
            </div>
            <p>{item.quantity}</p>
            <p>&#8377; {item.totalPrice}</p>
            <p>{item.orderedBy}</p>
            <p>{item.paymentStatus}</p>
            <div className="text-box">
                <div className={`content ${isExpanded ? 'expanded' : 'collapsed'}`}>
                    {item.address}
                </div>
                <button onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? 'Show Less' : 'Show More'}
                </button>
            </div>
            <select className="status-select" name="Delivery Status" id="">
                <option value="" disabled >Delivery Status</option>
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
            </select>
        </div>
    )
}