import React from "react";
import DataCard from "../components/DataCard";
import { useNavigate } from "react-router-dom";
import "./styles.css"

const cardData = [
    { id: "BSL_3", title: "BSL_3" },
    { id: "CSTPS_3-7", title: "CSTPS_3-7" },
    { id: "KPKD_1-4", title: "KPKD_1-4" },
    { id: "KTPS_6", title: "KTPS_6" },
    { id: "PARALI_TPS_6-7", title: "PARALI_TPS_6-7" },
    { id: "NTPS_3-5", title: "NTPS_3-5" },
    { id: "BSL_4-5", title: "BSL_4-5" },
    { id: "CSTPS_8-9", title: "CSTPS_8-9" },
    { id: "KPKD_5", title: "KPKD_5" },
    { id: "KTPS_8-10", title: "KTPS_8-10" },
    { id: "PARALI_TPS_8", title: "PARALI_TPS_8" },
    { id: "PARAS_TPS_3-4", title: "PARAS_TPS_3-4" },

];

export default function Home() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("isLoggedIn");
        navigate("/login");
    };

    return (
        <div>
            {/* <header className="navbar">
                <div className="logo-left">
                    <a href="/">
                        <img src="/abhitech-logo.png" alt="logo" className="logo-img-left" />
                    </a>
                </div>

                <div className="brand">
                    <a className="brand-link" href="/dashboard/modDashboard">
                        <h1 className="brand-title">
                            <span className="smart">MOD-DAILY-DASHBOARD</span>
                        </h1>
                    </a>
                </div>


                <button onClick={logout} className="logout-btn">Logout</button>
            </header> */}
            
                
            
            <main className="page-wrap">
                
                <h2 className="page-title">MOD-Dashboard (₹/kWh)

                    <div className="square-content2">
                    {/* <div className="mod-label">Approved MOD</div>
                    <div className="mod-value">₹ 2.3002 / kWh</div> */}
                </div>
                </h2>




                <div className="cards-grid-two-row">
                    {cardData.map((c) => (
                        <DataCard key={c.id} id={c.id} title={c.title} />
                    ))}
                </div>
            </main>
        </div>
    );
}