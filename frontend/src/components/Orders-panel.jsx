import { faX } from "@fortawesome/free-solid-svg-icons";
import { order } from "../Data/Order-info";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OrderCard from "./OrderCard";
import "../styles/Order-panel.css";
export default function Orders({ isOrderPanelOpen, setIsOrderPanelOpen }) {

    const closeOrderPanel = () => {
        setIsOrderPanelOpen(false);
    }
    return (
        <div style={isOrderPanelOpen ? { top: "15%" } : { top: "100%" }} className="order-container">
            <div className="header">
                <h2>Manage Orders</h2>
                <button onClick={closeOrderPanel}>
                    <FontAwesomeIcon icon={faX} />
                </button>
            </div>
            <div className="order-list">
                <div className="parameters">
                    <p>Product</p>
                    {/* <p>Product Name</p> */}
                    <p>Quantity</p>
                    <p>Amount</p>
                    <p>Customer</p>
                    <p>Payment</p>
                    <p>Address</p>
                    <p>Action</p>
                </div>
                {
                    order.map((item, idx) => {
                        // console.log(item)
                        return (
                            <OrderCard key={idx} item={item} idx={idx} />
                        )
                    })
                }
            </div>
        </div>
    )
}