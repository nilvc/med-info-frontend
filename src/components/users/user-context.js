import {React , useState , createContext} from "react";


export const Usercontext = createContext();


export const Userprovider = (props) => {
    const [userstate , setUserstate] = useState(
        {
            is_auth: localStorage.getItem("auth_token") ? true : false,
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
