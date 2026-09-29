import bgImage from "../assets/hero-bg-img.png"
import Products from "../components/Products"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faX } from "@fortawesome/free-solid-svg-icons"
import { useContext, useEffect, useRef, useState } from "react";
import { DataContext } from "../context/DataContext";


export default function Home() {

    const { loading, notification, setNotification } = useContext(DataContext);


    useEffect(() => {
        sessionStorage.clear("homeScrollPosition");
    }, []);

    if (loading) {
        return <p style={{ textAlign: "center", padding: "120px 0 120px 0" }}>Loading products...</p>;
    }
    const closeNotification = () => {
        setNotification(null);
    }

    return (
        <main>
            <section id="hero" className="hero-section">
                <div className="section-content">
                    {
                        notification ? (
                            <div style={notification.type == "error" ? 
                            {background: "rgba(218, 31, 31, 0.2)", border: "1px solid rgba(216, 5, 5, 0.2)"} : {}} 
                            className="notification-container">
                                <p className="msg">{notification.msg}</p>
                                <button onClick={closeNotification}><FontAwesomeIcon icon={faX} /></button>
                            </div>
                        ) : null
                    }
                    <div className="left">
                        <h2>Welcome to TechMitra</h2>
                        <p>Discover the best products at unbeatable prices.</p>
                        <a href="#products" className="cta-btn">Shop Now &nbsp;<FontAwesomeIcon icon={faArrowRight} /></a>
                    </div>
                    <div className="right">
                        <img src={bgImage} alt="hero-img" />
                    </div>
                </div>
            </section>
            <Products />
        </main>
    )
}