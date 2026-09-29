import { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { DataContext } from "../context/DataContext";

export default function Checkout() {
    const { result, loading, setNotification, notification } = useContext(DataContext);
    const [productQtyChanged, setProductQtyChanged] = useState(false);
    const [paymentOrder, setPaymentOrder] = useState(null);
    if (loading) {
        return <p style={{ textAlign: "center", padding: "120px 0 120px 0" }}>Loading products...</p>;
    }
    const storageKey = "techMitra";
    const cartArray = JSON.parse(localStorage.getItem(storageKey)) || [];
    const productArray = [];
    if (cartArray.length > 0) {
        for (let item of cartArray) {
            for (let data of result.allProducts) {
                if (data._id === item.id) {
                    const qty = item.qty;
                    productArray.push({ ...data, qty });
                }
            }
        }
    }
    const indianFormatter = new Intl.NumberFormat('en-IN');
    const incProductQty = (id) => {
        for (let item of cartArray) {
            if (item.id === id) {
                item.qty = item.qty + 1;
                localStorage.setItem(storageKey, JSON.stringify(cartArray));
                setProductQtyChanged(!productQtyChanged);
            }
        }
    }
    const decProductQty = (id) => {
        for (let item of cartArray) {
            if (item.id === id) {
                if (item.qty == 0) return;
                item.qty = item.qty - 1;
                localStorage.setItem(storageKey, JSON.stringify(cartArray));
                setProductQtyChanged(!productQtyChanged);
            }
        }
    }
    const removeItem = (id) => {
        for (let i = 0; i < cartArray.length; i++) {
            if (cartArray[i].id === id) {
                cartArray.splice(i, 1);
                localStorage.setItem(storageKey, JSON.stringify(cartArray));
                setProductQtyChanged(!productQtyChanged);
                setNotification("");
                setTimeout(() => {
                    setNotification(null);
                }, 100);
            }
        }
    }
    const totalPrice = () => {
        let totalPrice = 0;
        for (let item of productArray) {
            totalPrice += (item.price) * (item.qty);
        }
        return totalPrice;
    }

    const placeOrder = async (e) => {
        e.preventDefault();
        console.log(e.target[0].value)
        const deliveryAddress = e.target[0].value;
        const orderDetails = {
            deliveryAddress,
            productArray,
            userEmail: result.userEmail
        }
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/order/create-order`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderDetails),
            credentials: "include"
        });
        const data = await res.json();
        console.log(data);
        if (data == "Unauthorized") {
            setNotification({ msg: "You're not logged in.", type: "error" });
            return;
        }
        if (data == "Error occured while placing order") {
            setNotification({ msg: "Can't make payment at the moment, please try again later!", type: "error" });
            return;
        }
        setPaymentOrder(data);
    }

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            // script.src = 'https://razorpay.com';
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    }

    
    const handlePayment = async () => {
        console.log(paymentOrder);
        const options = {
            key: `rzp_test_Th2yEAyW6SBJQ9`,
            amount: paymentOrder.totalPrice,
            currency: 'INR',
            name: 'techMitra',
            description: 'Product purchase description',
            order_id: paymentOrder.order.id,
            handler: async function (paymentResponse) {
                console.log(paymentResponse)
                const verifyResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/order/verify-payment`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        razorpay_order_id: paymentResponse.razorpay_order_id,
                        razorpay_payment_id: paymentResponse.razorpay_payment_id,
                        razorpay_signature: paymentResponse.razorpay_signature
                    }),
                    credentials: "include"
                });
                const verificationResult = await verifyResponse.json();
                console.log(verificationResult);
                if (verificationResult.ok) {
                    alert('Payment successful & verified');
                } else {
                    alert(`Verification Failed: ${verificationResult.message}`);
                }
            },
            prefill: {
                email: paymentOrder.userEmail
            },
            theme: '#61dafb'
        }
        const rzp = new window.Razorpay(options);
        
        rzp.on('payment.failed', function (failedResponse) {
            alert(`Payment failed: ${failedResponse.error.description}`);
        });
        rzp.open();
    }

    const closeNotification = () => {
        setNotification(null);
    }

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>
            <div className="checkout-wrapper">
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
                <div className="billing-items">
                    <h3>Order Summary</h3>
                    {
                        productArray.length <= 0 ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "30px", alignItems: "center" }}>
                                <h2 style={{ padding: "0" }}>You haven't selected any items yet.</h2>
                                <a href="/" className="cta-btn" style={{ color: "#000", border: "none", width: "200px", textAlign: "center" }}>Shop Now</a>
                            </div>
                        ) : null
                    }
                    {
                        productArray.map((item) => {
                            return (
                                <div key={item._id} className="item">
                                    <div className="left">
                                        <div className="item-img">
                                            <img src={item.url} alt="product" />
                                        </div>
                                        <div className="item-name">
                                            <h4>{item.name}</h4>
                                            <p>&#8377; {indianFormatter.format(item.price)} each</p>
                                        </div>
                                    </div>
                                    <div className="right">
                                        <div className="price-inc-dec">
                                            <button onClick={() => decProductQty(item._id)}>&minus;</button>
                                            <p>{item.qty}</p>
                                            <button onClick={() => incProductQty(item._id)}>&#43;</button>
                                        </div>
                                        <p className="price">&#8377; {indianFormatter.format((item.price) * item.qty)}</p>
                                        <button onClick={() => removeItem(item._id)} className="remove-item">Remove</button>
                                    </div>
                                </div>
                            )
                        })
                    }

                </div>
                <div className="total-bill">
                    <h3>Total</h3>
                    <div>
                        <p className="subtotal">Subtotal:</p>
                        <p className="subtotal-value">
                            &#8377; {indianFormatter.format(totalPrice())}
                        </p>
                    </div>
                    <div>
                        <p className="total">Total:</p>
                        <p className="total-value">&#8377; {indianFormatter.format(totalPrice())}</p>
                    </div>
                    <hr />
                    <form onSubmit={(e) => placeOrder(e)}>
                        <div className="form-element">
                            <label htmlFor="address">Enter delivery address</label>
                            <input id="address" type="text"
                                placeholder="e.g., vill+po: Balha, ps: Rajnagar, dist: Madhubani" required />
                        </div>
                        {
                            paymentOrder ? (
                                null
                            ) : (
                                <button>Place Order</button>
                            )
                        }
                    </form>
                    {
                        paymentOrder ? (
                            <button onClick={handlePayment}>Pay with Razorpay</button>
                        ) : null
                    }
                    
                </div>
            </div>
        </div>
    )
}