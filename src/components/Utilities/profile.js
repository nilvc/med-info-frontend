import React , {useEffect , useState} from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'


function OpenRoomSvg() {
    return(<button type="button" className="btn btn-outline-info"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-door-open-fill" viewBox="0 0 16 16">
    <path d="M1.5 15a.5.5 0 0 0 0 1h13a.5.5 0 0 0 0-1H13V2.5A1.5 1.5 0 0 0 11.5 1H11V.5a.5.5 0 0 0-.57-.495l-7 1A.5.5 0 0 0 3 1.5V15H1.5zM11 2h.5a.5.5 0 0 1 .5.5V15h-1V2zm-2.5 8c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1z"/>
  </svg> Open Room</button>);
}


const Profile = () => {

    const [loading , setLoading] = useState(true);
    const [profile_data , setProfiledata] = useState({})
    const [rooms , setRooms] = useState({})

    useEffect(() => {
            const url = "/api/auth/get_profile/"+localStorage.getItem("email");

            // personal-info
            axios.get(url,{
                headers:{
                    "content-type":"application/json",
                    "Authorization": "Token "+localStorage.getItem("auth_token")
                }
            }).then((response)=>{
                setProfiledata({...response.data.profile})
            }).catch((err)=>{
                console.log(err);
            });

            //Rooms
            const roomsurl = "/room/get_myrooms/"+localStorage.getItem("email");
            axios.get(roomsurl,{
                headers:{
                    "content-type":"application/json",
                    "Authorization": "Token "+localStorage.getItem("auth_token")
                }
            }).then((response)=>{
                setRooms({...response.data})
                console.log(response.data)
                setLoading(false)
            }).catch((err)=>{
                console.log(err);
            });

    },[])

    
    if(loading)
    {
        return (
            <div className="d-flex align-items-center">
                <strong>Loading...</strong>
                <div className="spinner-border ml-auto" role="status" aria-hidden="true"></div>
            </div>
        )
    }else{
        return(
            <div className = "container">
                <div className="row">
                        <div className="card col-4">
                            <img className="card-img-top rounded-circle mx-auto " 
                                style={{width : 300 , height : 300}} 
                                src={profile_data["pic"]} 
                                alt="profile "/>
                            <div className="card-body">
                                <h5 className="card-title text-center">
                                    {profile_data["first_name"]+" "+profile_data["last_name"]}
                                </h5>
                                <Link to = "/profile" className="btn btn-info btn-block">
                                    Edit Profile
                                </Link>
                                <Link to = "/create_room" className="btn btn-info btn-block">
                                    Create new room
                                </Link>
                            </div>
                        </div>
                        <div className="card  col-8 ">
                            <div className="card-body">
                                <h5 className="card-title text-center">
                                    {"Full name : "+profile_data["first_name"]+" "+profile_data["last_name"]}
                                </h5>
                                <h5 className="card-title text-center">
                                    {"Address : "+profile_data["address"]}
                                </h5>
                            </div>
                        </div>
                </div>
                
                <div className="row">
                    {
                        rooms["Rooms"].length === 0 ?
                        <h2>
                            You have not created or being added to any room right know <br/>
                            click the button bellow your prolile picture to create rooms.
                        </h2>
                        :
                        <table className="table table-hover table-striped">
                            <thead>
                                <tr className="table-info">
                                <th scope="col">Your Room</th>
                                <th scope="col">Owner of the room</th>
                                <th scope="col">Patient in the room</th>
                                <th scope="col">Open Room</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    rooms["Rooms"].map((room)=>
                                             <tr key = {room.room["room_id"]}>
                                                <th>
                                                     {room.room["room_name"]}
                                                </th>
                                                <th>
                                                     {room.room.owner["name"]}
                                                </th>
                                                <th>
                                                     {room.room.patient["name"]}
                                                </th>
                                                <th>
                                                    <Link to ={"/room/" + room.room["room_id"] } className="btn-light">
                                                         < OpenRoomSvg/>
                                                    </Link>
                                                </th>   
                                             </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    }
                </div>
            </div>
        )
    }
    
}

export default Profile;