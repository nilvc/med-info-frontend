import {useState} from 'react'
import {useHistory} from "react-router-dom";
import axios from 'axios'
import "./Room.css"

const Room_form = () => {

    const [room_name , setRoomname] = useState("")
    const history = useHistory()

    const handleSubmit = (event) => {
        event.preventDefault()
        const data = {"room_name" : room_name}
        const url = "/room/create_room"

        axios.post(url,data,{
            headers:{
                "content-type":"application/json",
                "Authorization": "Token "+localStorage.getItem("auth_token")
            }
        }).then((response)=>{
            alert("Room created successfully")
            history.push("/profile")
        }).catch((err)=>{
            alert("Error occured while creating room. Please try again.")
            console.log(err);
        })
        
    }

    return (
        <form className = "container roomform d-grid mb-1" onSubmit={handleSubmit}>
            <div className="form-row text-center m-3">
                <h5>Create New Room</h5>
            </div>
            <div className="form-row m-2 " >
                <label htmlFor="title">What name would you like to give this room ?</label>
                <input type="text" className="form-control" id="text" 
                placeholder="Room name" name = "title" value = {room_name} 
                onChange = {(event)=>{setRoomname(event.target.value)}} required/>
            </div>
            <div className="text-center">
                <button type="submit" className="btn btn-outline-info mb-1">
                    Create Room
                </button>
            </div>
        </form>
    )
}
export default Room_form;