import { useContext, useState } from "react";
import Orders from "../components/Orders-panel";
import "../styles/Admin.css"
import AddProduct from "../components/AddNewProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";
import ManageProducts from "../components/ManageProducts";
import { DataContext } from "../context/DataContext";

export default function Admin() {
    const [isOrderPanelOpen, setIsOrderPanelOpen] = useState(false);
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);
    const [isManageProductOpen, setIsManageProductOpen] = useState(false);
    const { notification, setNotification, result } = useContext(DataContext);
    // if (!result) {
    //     return <p style={{ textAlign: "center", padding: "120px 0 120px 0" }}>Loading...</p>;
    // }
    const closeNotification = () => {
        setNotification(null);
    }
    return (
        <section className="admin-section">
            {
                notification ? (
                    <div style={notification.type == "error" ?
                        { background: "rgba(177, 20, 20, 0.2)", 
                            border: "1px solid rgba(216, 5, 5, 0.2)" } : {}}
                        className="notification-container">
                        <p className="msg">{notification.msg}</p>
                        <button onClick={closeNotification}><FontAwesomeIcon icon={faX} /></button>
                    </div>
                ) : null
            }
            {
                result?.userRole == "admin" ? (
                    <div className="section-content">
                        <div>
                            <h2>Admin Dashboard</h2>
                            <p className="welcome-text">Welcome back, {result.userInfo}</p>
                        </div>
                        <div className="info-container">
                            <div className="info">
                                <p>Total Orders</p>
                                <h4>7</h4>
                            </div>
                            <div className="info">
                                <p>Total Products</p>
                                <h4>{result.allProducts.length}</h4>
                            </div>
                            <div className="info">
                                <p>Total Users</p>
                                <h4>{result.totalUsers}</h4>
                            </div>
                            <div className="info">
                                <p>Total Revenue</p>
                                <h4>&#8377; 69,999</h4>
                            </div>
                        </div>
                        <div className="admin-control-panel">
                            <h3>Administrative Controls</h3>
                            <div className="btns">
                                <button onClick={() => setIsAddProductOpen(true)} className="primary"><FontAwesomeIcon icon={faPlus} /> Add Product</button>
                                <button onClick={() => setIsManageProductOpen(true)}>Manage Products</button>
                                <button onClick={() => setIsOrderPanelOpen(true)}>Manage Orders</button>
                                <button>Users Directory</button>
                            </div>
                        </div>
                        <Orders isOrderPanelOpen={isOrderPanelOpen} setIsOrderPanelOpen={setIsOrderPanelOpen} />
                        <AddProduct isAddProductOpen={isAddProductOpen} setIsAddProductOpen={setIsAddProductOpen} />
                        <ManageProducts isManageProductOpen={isManageProductOpen} setIsManageProductOpen={setIsManageProductOpen} />
                    </div>
                ) : (
                    <h2 style={{
                        width: "fit-content", margin: "auto",
                        border: "1px solid rgba(216, 5, 5, 0.2)",
                        padding: "10px", background: "rgba(177, 20, 20, 0.2)"
                    }}
                    >404 Page Not Found</h2>
                )
            }
        </section>
    )
}