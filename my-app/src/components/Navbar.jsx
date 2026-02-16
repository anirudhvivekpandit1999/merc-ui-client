
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ title = "MOD-DAILY-DASHBOARD" }) {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("isLoggedIn");
        navigate("/login");
    };

    return (
        <header className="navbar">
            <div className="logo-left">
                <Link to="/">
                    <img src="/abhitech-logo.png" alt="logo" className="logo-img-left" />
                </Link>
            </div>

            <div className="brand">
                <Link to="/" className="brand-link">
                    <h1 className="brand-title">
                        <span className="smart">{title}</span>
                    </h1>
                </Link>
            </div>

            <button onClick={logout} className="logout-btn">
                Logout
            </button>
        </header>
    );
}