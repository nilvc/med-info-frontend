import React from "react"
import {Link,useHistory} from "react-router-dom"
import axios from "axios"
import { useContext } from "react";
import { Usercontext } from "../users/user-context";


export default function Navbar() {


    const history = useHistory();
    const [userstate , setUserstate] = useContext(Usercontext);


    const handleLogout = () => {
        axios.post("http://127.0.0.1:8000/api/auth/logout",{},{
            headers:{
                "content-type":"application/json",
                "Authorization":"Token "+localStorage.getItem('auth_token')
            }})
            .then((res)=>{
                localStorage.removeItem('auth_token');
                localStorage.removeItem('username');
                localStorage.removeItem('email');
                setUserstate({...userstate,"is_auth":false, 
                            "username" : "",
                            "email" : "" })
                history.push('/')
            })
            .catch((err)=>{
                alert("Some error occured");
                console.log(err);
            });
    }
    return (
            <nav className="navbar navbar-expand-lg navbar-light sticky-top  mb-4 shadow-sm " 
                style={{backgroundColor: "#D7E9F7"}}>
                <div className="container-fluid">
                    <Link className="navbar-brand" to="#">MED - INFO</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav mb-2 mb-lg-0 ">
                            <li className="nav-item">
                                <Link className="nav-link" aria-current="page" to="/">Home</Link>
                            </li>
                            {
                                userstate["is_auth"]  ? 
                                <li className="nav-item">
                                    <Link className="nav-link" aria-current="page" to="/profile">Profile</Link>
                                </li>
                                :""
                            }
                            {
                                userstate["is_auth"]  ? 
                                <li className="nav-item">
                                    <Link className="nav-link" aria-current="page" to="/my_invites">My Invites</Link>
                                </li>
                                :""
                            }
                            
                        </ul>
                        {
                          userstate["is_auth"]  ? 
                          <button className="btn btn-sm ml-auto btn-outline-primary" onClick={handleLogout}>Log-out</button>
                          :<Link className="btn btn-sm ml-auto btn-outline-primary " to="/">Login/Register</Link>
                        }
                        
                    </div>
                </div>
            </nav>
    )
}