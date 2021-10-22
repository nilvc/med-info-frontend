import React,{useState , useContext , useEffect} from "react";
import axios from 'axios';
import {useHistory} from "react-router-dom";
import { Usercontext } from "../users/user-context";
import './login-or-register.css'

function LoginRegister() {
    const history = useHistory();
    const [rightpanel,setRightpanel]=useState(false);
    const [userstate , setUserstate] = useContext(Usercontext);

    const [loginfields,setLoginFields] = useState({
        email:"",
        password:""
    });

    const [registerfields,setRegisterFields] = useState({
        first_name:"",
        last_name:"",
        email:"",
        password:"",
        profile_pic:null
    });

    // on page load if token is present 
    // validating token here using componentdid mount

    useEffect (()=>{
        const if_allready_logedin = () =>{
            const token  = localStorage.getItem("auth_token")
            if(token)
            { 
                const url = "/api/auth/validate_token"
                axios.get(url,{
                    headers:{
                        "content-type":"application/json",
                        "Authorization": "Token "+token
                    }
                }).then((response)=>{
                    history.push("/profile")
                }).catch((error)=>{
                    localStorage.clear()
                    console.log("setting flase")
                    setUserstate({...userstate,"is_auth":false , 
                            "username":"",
                            "email":""})
                });
            }
        }
        if_allready_logedin()
    },[])

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

    function handlefileUpload(e){
        const newValue = e.target.files[0] ;
        const filesize = newValue.size
        console.log("file",filesize)
        setRegisterFields({...registerfields,"profile_pic":newValue});
      }
    
    function handleLogin(e){
        e.preventDefault();
        let username = ""
        const email = loginfields.email
        for(var i=email.length -1;i>=0;i--)
        {
            if(email[i]==="@")
            {
                username = email.slice(0,i);
                break;
            }
        }
        const logindata = {"username":username , "password" : loginfields.password}
        axios.post("http://127.0.0.1:8000/api/auth/login",logindata,{
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
            email:"",
            password:""
        });
    }


    function handleRegister(e){
        e.preventDefault();
        let form_data = new FormData();
        form_data.append('first_name', registerfields.first_name);
        form_data.append('last_name', registerfields.last_name);
        form_data.append('email', registerfields.email);
        form_data.append('password', registerfields.password);
        form_data.append('profile_pic', registerfields.profile_pic, registerfields.profile_pic.name);

        axios.post("/api/auth/create_profile",form_data,{
                headers:{
                    'content-type': 'multipart/form-data',
                }
            }).then((response)=>{
                // user has regestired call login now
                alert("Registration successfull . You can login now")
            }).catch((err)=>{
                alert("Invalid credentials !!");
                console.log(err);
            });
        setRegisterFields({
                first_name:"",
                last_name:"",
                email:"",
                password:"",
                profile_pic:null
            })
        
    }
    

    return (
        <div className = "Loginpage">
                <div className={"logincontainer " +(rightpanel ? "right-panel-active" : " ")} id="container">
                    <div className="form-container sign-up-container">
                        <form className="fform" onSubmit = {handleRegister} >
                            <h1>Create Account</h1>

                            <input className="finput" type="text" placeholder="first name" 
                                    name = "first_name" value = {registerfields.first_name} 
                                    onChange = {handleRegisterChange} required />


                            <input className="finput" type="text" placeholder="last name" 
                                    name = "last_name" value = {registerfields.last_name} 
                                    onChange = {handleRegisterChange} required />
                            

                            <input className="finput" type="email" placeholder="Email" 
                                    name = "email" value = {registerfields.email} 
                                    onChange = {handleRegisterChange} required />
                            

                            <input className="finput" type="password" placeholder="Password" 
                                    name = "password"  value = {registerfields.password} 
                                    data-toggle="tooltip" data-placement="top" title="password"
                                    onChange = {handleRegisterChange} required/>

                            <div className="finput from-row m-3">
                                <div className="custom-file col-md-12 align-self-center">
                                    <input type="file" onChange={handlefileUpload}  required 
                                            className="custom-file-input" id="customFile"
                                            accept=".png, .jpg, .jpeg"/>
                                    <label className="custom-file-label" htmlFor="customFile">
                                        {registerfields.profile_pic ? registerfields.profile_pic.name : "Profile pic here"}
                                    </label>
                                </div>
                            
                            </div>

                            <button className="fbutton" type="submit">Create Account</button>
                        </form>
                    </div>
                    <div className="form-container sign-in-container">
                        <form className="fform" onSubmit = {handleLogin} >
                            {/* This is shown intially */}
                            <h1>Sign in</h1>
                            <input className="finput" type="email" placeholder="Email" name = "email"  value = {loginfields.email} onChange = {handleLoginChange} required/>
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
