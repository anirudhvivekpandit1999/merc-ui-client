import React, { useState } from "react";
import './../css/Dashboard.css';
import { Link, Outlet } from "react-router-dom";


const Dashboard = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidenav = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div id="dashboard" className="d-flex">

            {/* Side Navigation */}
            <div className={`sidenav ${isOpen ? "open" : ""}`}>
                {/* <button className="closebtn" onClick={toggleSidenav}>&times;</button> */}
                <div className="d-flex align-items-center">
                    <Link to="/dashboard">
                        <img src="https://www.figma.com/community/resource/d3ce5064-a3ee-468b-8245-0e47504800f2/thumbnail"
                            width="60px" />
                        {isOpen && <span className="ms-2 fs-4 text-primary">MERC</span>}
                    </Link>
                </div>
                <div className="mt-4 gap-y-4">
                    {isOpen ? <span className="menu">HOME</span> : <span className="menu ms-2">...</span>}
                    <Link to="/dashboard/RegulatoryParams">
                        <div className={`submenubox d-flex align-items-center pt-2 pb-2 pe-3 mb-2 ${isOpen ? "ps-4" : "ps-3"}`}>
                            <i className="bi bi-clipboard2-data fs-5">{!isOpen && <span className="submenu">Reg</span>}</i>
                            {isOpen && <span className="submenu">Regulatory Parameters</span>}
                        </div>
                    </Link>

                    {/* <div className={`submenubox d-flex align-items-center pt-2 pb-2 pe-3 mb-2 ${isOpen ? "ps-4" : "ps-3"}`}>
                        <i class="bi bi-cpu fs-5"></i>
                        {isOpen && <span className="submenu">AI Model</span>}
                    </div> */}

                    {/* <div className={`submenubox d-flex align-items-center pt-2 pb-2 pe-3 mb-2 ${isOpen ? "ps-4" : "ps-3"}`}>
                        <i className="bi bi-clipboard2-pulse fs-5"></i>
                        {isOpen && <span className="submenu">Slagging & Fouling<br /> Predictor</span>}
                    </div> */}
                    <Link to='/dashboard/ecr'>

                        <div className={`submenubox d-flex align-items-center pt-2 pb-2 pe-3 mb-2 ${isOpen ? "ps-4" : "ps-3"}`}>
                            <i className="bi bi-lightning fs-5">{!isOpen && <span className="submenu">ECR</span>}</i>
                            {isOpen && <span className="submenu">ECR Model</span>}
                        </div>
                    </Link>
                        <Link to='/dashboard/modDashboard'>
                    <div className={`submenubox d-flex align-items-center pt-2 pb-2 pe-3 mb-2 ${isOpen ? "ps-4" : "ps-3"}`}>
                        <i className="bi bi-lightning fs-5">{!isOpen && <span className="submenu">Mod</span>}</i>
                        {isOpen && <span className="submenu">MOD Dashboard</span>}
                    </div>
                    </Link>
                </div>


            </div>

            {/* Page Content */}
            <div id="main" className={isOpen ? "shifted" : ""}>
                <div className="pb-0 mb-3">
                    <i id="sidenavBtn" className="bi bi-list fs-5" onClick={toggleSidenav}></i>
                </div>
                <Outlet />
            </div>
        </div >
    )
}

export default Dashboard;