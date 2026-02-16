import React from "react";
import '../css/Welcome.css';
import { Link } from "react-router-dom";
import abhiPactLogo from "../../public/images/abhitech-mahagenco-combined-logo.png"
const Welcome2 = () => {
    return (
        <div id="welcome">
            <div className="banner mt-4 d-flex justify-content-between">
                <div className="px-2 ">
                    <h2 className="navbar-brand mx-auto">Welcome User !</h2>
                    <h4>AbhiPact</h4>
                    <ul>
                        <li>Anticipates, mitigates, and eliminates disallowance costs</li>
                        <li>Ensures seamless compliance</li>
                        <li>Optimizes operational efficiency</li>
                        <li>Leverages data intelligence</li>
                        <li>Utilizes predictive analytics</li>
                        <li>Provides real-time monitoring</li>
                        <li>Empowers Mahagenco to stay ahead of regulations</li>
                        <li>Prevents revenue losses</li>
                        <li>Maximizes overall performance</li>
                        <li>Transforms compliance from a burden into a strategic advantage</li>
                    </ul>

                </div>
                <img className="me-5 align-self-center" style={{ borderRadius: "50%" }} width={250} height={250} src={abhiPactLogo} />
            </div>

            <div className="services mt-4">
                {/* <span className="title">Our Services</span> */}
                <div className="row mt-4 text-center">
                    <div className="col-3">
                        <Link to="/dashboard/RegulatoryParams">
                            <div className="servicesContent bg-info">
                                Regulatory paramaters
                            </div>
                        </Link>

                    </div>
                    {/* <div className="col-3">
                        <Link to='/dashboard/ai'>
                            <div className="servicesContent bg-success">
                                AI Model
                            </div>
                        </Link>
                    </div> */}
                    {/* <div className="col-3">
                        <Link to ='/dashboard/coalSlagging'>
                        <div className="servicesContent bg-warning">
                            Slagging & Fouling Predictor
                        </div>
                        </Link>
                    </div> */}
                    <div className="col-3">
                        <Link to='/dashboard/ecr'>
                            <div className="servicesContent bg-danger">
                                ECR Model
                            </div>
                        </Link>
                    </div>
                    <div className="col-3">

                        <div className="servicesContent bg-warning">
                            PDF's
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Welcome2;