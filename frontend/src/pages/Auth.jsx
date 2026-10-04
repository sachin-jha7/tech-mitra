import { useContext, useEffect, useState } from "react"
import { DataContext } from "../context/DataContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faCircleNotch } from "@fortawesome/free-solid-svg-icons";

export default function Auth() {

    const [formMode, setFormMode] = useState("login");
    const [eyeOpen, setEyeOpen] = useState(true);
    const { notification, setNotification, setResult, result } = useContext(DataContext);
    const [userDataForOtpForm, setUserDataForOtpForm] = useState(null);
    const [seconds, setSeconds] = useState(300);
    const [loginProcess, setLoginProcess] = useState(false);
    const [signupProcess, setSignupProcess] = useState(false);
    const [otpProcess, setOtpProcess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {

        if (!userDataForOtpForm) return;
        if (seconds <= 0) return;
        const timer = setInterval(() => {
            setSeconds((prev) => prev - 1)
        }, 1000);
        return () => clearInterval(timer);
    }, [seconds, userDataForOtpForm]);



    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const remainingSeconds = timeInSeconds % 60;

        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    const handleLoginForm = async (e) => {
        e.preventDefault();
        const user = {
            email: e.target[0].value,
            password: e.target[1].value
        }
        // console.log(result)
        setLoginProcess(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user),
                credentials: "include"
            });
            const data = await res.json();
            // console.log(data);
            setLoginProcess(false);
            // e.target[0].value = "";
            e.target[1].value = "";
            if (data == "Invalid email format.") {
                setNotification({ msg: data, type: "error" });
            }
            if (data == "Wrong email or password") {
                setNotification({ msg: data, type: "error" });
            }
            if (data == "Internal server error.") {
                setNotification({ msg: data, type: "error" });
            }
            if (data.message == "Admin Logged-In Successfully") {
                setResult({ ...result, userInfo: data.userName, userRole: data.role });
                navigate("/admin")
            } else if (data.message == "User Logged-In Successfully") {
                setResult({ ...result, userInfo: data.userName, userRole: data.role });
                navigate('/');
            }
        } catch (error) {
            console.log("Error fetching backend:", error);
        }
    }

    const handelSignupForm = async (e) => {
        e.preventDefault();
        const newUser = {
            name: e.target[0].value,
            email: e.target[1].value,
            password: e.target[2].value
        }
        // console.log(newUser)
        setSignupProcess(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newUser),
                credentials: "include"
            });
            const data = await res.json();
            // console.log(data);
            setSignupProcess(false);
            e.target[2].value = "";
            if (data == "Invalid email format.") {
                setNotification({ msg: data, type: "error" });
            }
            if (data == "Wrong email or password") {
                setNotification({ msg: data, type: "error" });
            }
            if (data == "Internal server error.") {
                setNotification({ msg: data, type: "error" });
            }
            if (data.message == "An otp has been sent to your email") {
                // console.log(newUser);
                setUserDataForOtpForm(data.userInfo);
                setFormMode("idle");
            }
            if (data.message == "Admin Registered Successfully") {
                setResult({ ...result, userInfo: data.name, userRole: data.role });
                navigate('/admin');
            } else if (data.message == "User Registered Successfully") {
                setResult({ ...result, userInfo: data.name, userRole: data.role });
                navigate('/');
            }

        } catch (error) {
            console.log("Error fetching backend:", error);
        }
    }
    const closeNotification = () => {
        setNotification(null);
    }

    const verify_otp = async (e) => {
        e.preventDefault();
        const otp = e.target[0].value;
        // console.log(e.target[0].value)
        const userInfo = { ...userDataForOtpForm, otp: otp };
        // setUserDataForOtpForm({ ...userDataForOtpForm, otp: otp });
        // console.log(userDataForOtpForm)
        // const userDetails = {userDataForOtpForm,}
        setOtpProcess(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userInfo),
                credentials: "include"
            });
            const data = await res.json();
            setOtpProcess(false);
            if (data == "Invalid OTP") {
                setNotification({ msg: data, type: "error" });
            }
            if (data.message == "Admin Registered Successfully") {
                setResult({ ...result, userInfo: data.name, userRole: data.role });
                navigate('/admin');
            } else if (data.message == "User Registered Successfully") {
                setResult({ ...result, userInfo: data.name, userRole: data.role });
                navigate('/');
            }
        } catch (error) {
            console.log("Error fetching backend:", error);
        }
    }

    const resend_otp = async (email) => {
        let userEmail = { email };
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/resend-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userEmail),
            credentials: "include"
        });
        const data = await res.json();
        if (data == "An otp has been sent to your email") {
            setNotification({ msg: data, type: "success" });
        }
        setSeconds(300);
    }

    return (
        <div className="auth-container">
            <div className="auth-wrapper">
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
                <form onSubmit={(e) => handleLoginForm(e)} style={formMode === "login" ? { display: "flex" } : { display: "none" }} >
                    <h2>Login to continue shopping...</h2>
                    <input type="email" placeholder="Enter email..." required />
                    <div className="pswd-element">
                        <input className="pswd-field" type={eyeOpen ? "password" : "text"}
                            placeholder="Enter password..." required />
                        <button type="button" onClick={() => setEyeOpen(!eyeOpen)} className="hide-show-pswd-btn">{eyeOpen ? "show" : "hide"}</button>
                    </div>
                    {
                        loginProcess ? (
                            <button type="button" className="auth-submit-btn">Processing
                                <FontAwesomeIcon className="force-spin" icon={faCircleNotch} />
                            </button>
                        ) : (
                            <button className="auth-submit-btn">Login</button>
                        )
                    }
                    <p>Don't have an account? <button type="button"
                        onClick={() => setFormMode("signup")} className="form-opener" >Signup</button></p>

                </form>
                <form onSubmit={(e) => handelSignupForm(e)} style={formMode === "signup" ? { display: "flex" } : { display: "none" }} >
                    <h2>Create account to shop now...</h2>
                    <input type="text" placeholder="Enter name..." required />
                    <input type="email" placeholder="Enter email..." required />
                    <div className="pswd-element">
                        <input className="pswd-field" type={eyeOpen ? "password" : "text"}
                            placeholder="Enter password..." required />
                        <button type="button" onClick={() => setEyeOpen(!eyeOpen)} className="hide-show-pswd-btn">{eyeOpen ? "show" : "hide"}</button>
                    </div>
                    {
                        signupProcess ? (
                            <button type="button" className="auth-submit-btn">Processing
                                <FontAwesomeIcon className="force-spin" icon={faCircleNotch} />
                            </button>
                        ) : (
                            <button className="auth-submit-btn">Create</button>
                        )
                    }
                    <p>Already have an account? <button type="button"
                        onClick={() => setFormMode("login")} className="form-opener">Login</button></p>
                </form>
                {
                    userDataForOtpForm ? (
                        <form onSubmit={(e) => verify_otp(e)}>
                            <h2>Verify your email</h2>
                            <p style={{ whiteSpace: "wrap", lineHeight: "1.4" }}>We sent a 6-digit verification code to<br /> [{userDataForOtpForm.email}].
                                <br />Enter it below to complete your registration.
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                <label htmlFor="otp">Verification Code</label>
                                <input type="number" placeholder="Enter 6-digit code" required />
                            </div>
                            <p><button type="button" disabled={seconds <= 0 ? false : true} onClick={() => resend_otp(userDataForOtpForm.email)}
                                className="resend-otp-btn">Resend</button> code in {formatTime(seconds)} seconds</p>
                            {
                                otpProcess ? (
                                    <button type="button" className="auth-submit-btn">Processing
                                        <FontAwesomeIcon className="force-spin" icon={faCircleNotch} />
                                    </button>
                                ) : (
                                    <button className="auth-submit-btn">Submit</button>
                                )
                            }
                        </form>
                    ) : null
                }
            </div>
        </div>
    )
}
