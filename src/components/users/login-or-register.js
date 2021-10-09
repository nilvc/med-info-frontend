import React,{useState , useContext} from "react";
import axios from 'axios';
import {useHistory} from "react-router-dom";
import { Usercontext } from "../users/user-context";
import './login-or-register.css'

function LoginRegister({changestate}) {
    const history = useHistory();
    const [rightpanel,setRightpanel]=useState(false);
    const [userstate , setUserstate] = useContext(Usercontext);

    const [loginfields,setLoginFields] = useState({
        username:"",
        password:""
    });

    const [registerfields,setRegisterFields] = useState({
        username:"",
        email:"",
        password:""
    });

    function handleLoginChange(e){
        const fieldName = e.target.name;
        const newValue = e.target.value;
        setLoginFields({...loginfields,[fieldName]:newValue});
    }

    function handleRegisterChange(e){
        const fieldName = e.target.name;
        const newValue = e.target.value;
        setRegisterFields({...registerfields,[fieldName]:newValue});
    }
    
    function handleLogin(e){
        e.preventDefault();
        axios.post("http://127.0.0.1:8000/api/auth/login",loginfields,{
            headers:{
                "content-type":"application/json"
            }
        }).then((res)=>{
            localStorage.setItem("auth_token",res.data.token);
            localStorage.setItem("username",res.data.user.username);
            localStorage.setItem("email",res.data.user.email);
            setUserstate({...userstate,"is_auth":true , 
                            "username":res.data.user.username,
                            "email":res.data.user.email })
            history.push('/profile');
        }).catch((err)=>{
            alert("Invalid credentials !!");
        });
        setLoginFields({
            username:"",
            password:""
        });
    }
    function handleRegister(e){
        e.preventDefault();
        console.log(registerfields);
        axios.post("http://127.0.0.1:8000/api/auth/register",registerfields,{
                headers:{
                    "content-type":"application/json",
                }
            })
            .then((res)=>{
                localStorage.setItem('auth_token',res.data.token);
                localStorage.setItem('username',res.data.user.username);
                localStorage.setItem("email",res.data.user.email);
                setUserstate({"is_auth":true , 
                                "username":res.data.user.username,
                                "email":res.data.user.email })
                history.push('/personal_info-form');
            })
            .catch((err)=>{
                alert("Some error occured");
            });
            setRegisterFields({
                username:"",
                email:"",
                password:""
            });
    }
    

    return (
        <div className = "Loginpage">
                <div className={"logincontainer " +(rightpanel ? "right-panel-active" : " ")} id="container">
                    <div className="form-container sign-up-container">
                        <form className="fform" onSubmit = {handleRegister} >
                            <h1>Create Account</h1>
                            <input className="finput" type="text" placeholder="Name" name = "username" value = {registerfields.username} onChange = {handleRegisterChange} required />
                            <input className="finput" type="email" placeholder="Email" name = "email" value = {registerfields.email} onChange = {handleRegisterChange} required />
                            <input className="finput" type="password" placeholder="Password" name = "password"  value = {registerfields.password} onChange = {handleRegisterChange} required/>
                            <button className="fbutton" type="submit">Create Account</button>
                        </form>
                    </div>
                    <div className="form-container sign-in-container">
                        <form className="fform" onSubmit = {handleLogin} >
                            {/* This is shown intially */}
                            <h1>Sign in</h1>
                            <input className="finput" type="text" placeholder="Username" name = "username"  value = {loginfields.username} onChange = {handleLoginChange} required/>
                            <input className="finput" type="password" placeholder="Password" name = "password" value = {loginfields.password} onChange = {handleLoginChange} required />
                            <p className="fp">Forgot your password?</p>
                            <button className="fbutton" type="submit">Login In</button>
                        </form>
                    </div>
                    <div className="overlay-container">
                        <div className="overlay">
                            <div className="overlay-panel overlay-left">
                                <h1>What are we 
                                    going to do for you ??</h1>
                                <p className="fp">We will keep your medical information ready in case of emergency.</p>
                                <p className="fp">We will keep your medical information updataed.</p>
                                <button className="ghost fbutton" id="signIn" onClick={()=> setRightpanel(false)}>Login In</button>
                            </div>
                            <div className="overlay-panel overlay-right">
                                {/* This is shown intially */}
                                <h1>What are we going to do for you ??</h1>
                                <p className="fp">We will keep your medical information ready in case of emergency.</p>
                                <p className="fp">We will keep your medical information updataed.</p>
                                <button className="ghost fbutton" id="signUp" onClick={()=> setRightpanel(true)}>Create Account</button>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default LoginRegister;
