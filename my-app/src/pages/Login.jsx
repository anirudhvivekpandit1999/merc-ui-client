// src/LoginScreen.js
import React, { useState } from 'react';
import '../css/Login.css';
import mahagencoLogo from '../../public/images/mahagenco_ico.webp';
import abhitechLogo from '../../public/images/abhitech-logo.png';
import axios from 'axios';
import { encryptData, postEncrypted, url } from '../security';
import { useNavigate } from 'react-router-dom';


const Login = () => {

    const navigate = useNavigate();
    const [username , setUsername] = useState('');
    const [password,setPassword] = useState('');

    async function handleLogin () {
        try {
            console.log("Logging" , username , password );
            let payload = {
                               encryptedData: encryptData({
                                   p_username : username,
                                   p_password : password
                               })
                           }
                           const response = await fetch(`${url}/api/login`, {
                               method: 'POST',
                               mode: 'cors',
                               headers: {
                                   'Content-Type': 'application/json',
                                   'Access-Control-Allow-Origin': '*'
                               },
                               body: JSON.stringify(payload)
                           });

                        if (response.ok) {
                               navigate('/dashboard');
                               }
        } catch (error) {
            console.error("Login failed:", error);
        }

    }

    return (
        <section class="vh-100 d-flex align-items-center justify-content-center"
            style={{ backgroundImage: "url('../../public/images/loginBack.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
            <div class="container">
                <span style={{ position: "absolute", fontSize: "1.5em", margin: '10px 15px',fontFamily:"revert",
                    fontWeight:"bold",color:"#393185"
                 }}>MERC</span>
                <div class="row d-flex align-items-center h-100 border" style={{ backgroundColor: "#EDF0F5", borderRadius: "30px" }}>
                    <div class="col-sm-12 col-lg-6">

                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                            class="img-fluid" alt="Sample image" />
                    </div>
                    <div class="col-sm-12 col-lg-6" style={{ backgroundColor: '#FFFF', borderRadius: '30px', padding: "5% 8%" }}>
                        <form>
                            <div className='d-flex justify-content-between'>
                                <img src={abhitechLogo} height={90} alt='res' />
                                <img src={mahagencoLogo} height={90} alt='res' />
                            </div>
                            <div class="d-flex align-items-center my-4">
                                <h2 class="text-center text-primary fw-bold mb-0 m-auto"
                                    style={{ fontFamily: "math" }}>User Login</h2>
                            </div>

                            <div class="mb-4">
                                {/* <label for="email" class="form-label">Email address</label> */}
                                <input value={username} onChange={(e) => setUsername(e.target.value)} type="text"  class="form-control form-control-md border border-primary"
                                    style={{ borderRadius: "100px", backgroundColor: "#EFEFEF" }}
                                    placeholder="Enter Username" required />
                            </div>

                            <div class="mb-3">
                                {/* <label for="password" class="form-label">Password</label> */}
                                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" id="password" class="form-control form-control-md border border-primary"
                                    style={{ borderRadius: "100px", backgroundColor: "#EFEFEF" }}
                                    placeholder="Enter Password" required />
                            </div>

                            <div class="d-flex justify-content-between align-items-center">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="rememberMe" />
                                    <label class="form-check-label" for="rememberMe">Remember me</label>
                                </div>
                                <a href="#" class="text-body">Forgot password?</a>
                            </div>

                            <div class="text-center text-lg-start mt-3">
                                <button 
                                onClick={(e) => { e.preventDefault(); handleLogin(); }} type="button" class="btn btn-primary btn-md px-5 w-100">Login</button>
                                {/* <p class="small fw-bold mt-2 pt-1 mb-0">
                                    Don't have an account? <a href="#" class="link-danger">Register</a>
                                </p> */}
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;