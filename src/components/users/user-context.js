import {React , useState , createContext} from "react";


export const Usercontext = createContext();


export const Userprovider = (props) => {
    const token = localStorage.getItem("auth_token")
    let is_authenticated = false;
    if (token)
    {
        is_authenticated = true;
    }
    const [userstate , setUserstate] = useState(
        {
            is_auth: is_authenticated,
            username :localStorage.getItem("username"),
            email :localStorage.getItem("email")
        }
        
    )
    return (
        <div>
            <Usercontext.Provider value={[userstate, setUserstate]}>
                {props.children}
            </Usercontext.Provider>
        </div>
    )
}
