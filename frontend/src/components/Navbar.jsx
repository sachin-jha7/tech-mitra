import { faBars, faClose, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "../context/DataContext";

export default function Navbar() {

    const [isSearchFormOpen, setSearchFormOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { result, setResult, notification, setNotification } = useContext(DataContext);
    
    const openSearchForm = () => {
        setSearchFormOpen(!isSearchFormOpen);
    }
    const openSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }
    
    const logoutUser = async () => {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,{
            credentials: "include"
        });
        const data = await res.json();
        setResult({...result, userInfo: null})
        setNotification({msg: data, type: "success"});
    }
    const storageKey = "techMitra";
    const cartArray = JSON.parse(localStorage.getItem(storageKey)) || [];
    return (
        <header>
            <nav>
                <div className="left">
                    <a href="/" className="logo">TechMitra</a>
                </div>
                {
                    window.innerWidth >= 999 ? (
                        <form style={isSearchFormOpen ? { top: "100%" } : { top: "-100%" }} className="search-form">
                            <input type="text" placeholder="Search TechMitra..." />
                            <button><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                        </form>
                    ) : null
                }

                <ul style={isSidebarOpen ? { top: "100%" } : { top: "-380%" }} className="right">
                    <li key={"1a"}><Link to="/" className="nav-link">Home</Link></li>
                    <li key={"3c"}><Link to="/cart" className="nav-link">Cart({cartArray.length})</Link></li>
                    {
                        result?.userInfo ? (
                            <li key={"nz"}><p className="nav-link">{result.userInfo}</p></li>
                        ) : null
                    }
                    {
                        result?.userInfo ? (
                            <li key={"4d"}>
                                {/* <a href={logoutUrl} className="nav-link">Logout</a> */}
                                <button onClick={logoutUser} className="nav-link logout-btn">Logout</button>
                            </li>
                        ) : (
                            <li key={"5e"}>
                                <Link to="/auth" className="nav-link">Login</Link>
                            </li>
                        )
                    }
                    {/* <li key={"4d"}>
                        <Link to="/auth" className="nav-link">Login</Link>
                    </li> */}
                    {/* <li key={"5e"}>
                        <Link className="nav-link">Signup</Link>
                    </li> */}

                    <li key={"6b"}>

                        {
                            window.innerWidth <= 800 ? (
                                <form className="search-form">
                                    <input type="text" placeholder="Search TechMitra..." />
                                    <button><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                                </form>
                            ) :
                                isSearchFormOpen ? (
                                    <button onClick={openSearchForm} className="search-form-opener">&#10006;Close</button>
                                ) : (
                                    <button onClick={openSearchForm} className="search-form-opener">Search</button>
                                )
                        }
                    </li>
                </ul>
                {
                    window.innerWidth <= 998 ? (
                        <form style={isSearchFormOpen ? { top: "100%" } : { top: "-100%" }} className="search-form">
                            <input type="text" placeholder="Search TechMitra..." />
                            <button><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                        </form>
                    ) : null
                }
                <button onClick={openSidebar} className="side-bar-opener">
                    {isSidebarOpen ? (
                        <FontAwesomeIcon icon={faClose} />
                    ) : (
                        <FontAwesomeIcon icon={faBars} />
                    )}
                </button>
            </nav>
        </header >
    )
}