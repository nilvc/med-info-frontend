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
    const [search_room_id , setSearch_room_id] = useState("")
    const [searched_room , setSearchedroom] = useState({})
    const [profile_pic , setProfile_pic] = useState({new_profile_pic:null})

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
                setLoading(false)
            }).catch((err)=>{
                console.log(err);
            });

    },[])

    const copy_to_clipboard = (text , room_name) =>{
        navigator.clipboard.writeText(text)
        .then(() => {
        alert('Room id of '+room_name +" copied to clipboard");
        })
        .catch(() => {
        alert('click again to copy ');
        });
    }

    function searchRoom(event)
    {
        event.preventDefault()
        const searchroomurl = "/room/get_searched_room/"+search_room_id;
        axios.get(searchroomurl,{
            headers:{
                "content-type":"application/json",
                "Authorization": "Token "+localStorage.getItem("auth_token")
            }
        }).then((response)=>{
            setSearchedroom({...response.data.Room})
            setSearch_room_id("")
        }).catch((err)=>{
            console.log(err);
        });
        
    }


    function handlefileUpload(e){
        const newValue = e.target.files[0] ;
        setProfile_pic({"new_profile_pic":newValue});
    }
    function updateProfile_pic(event)
    {
        event.preventDefault()
        if (!profile_pic.new_profile_pic){
            return
        }
        const file_name = profile_pic.new_profile_pic.name
        let final_file_name = ""
        for (let i=0;i<file_name.length;i++)
        {
            if(file_name.charAt(i) !== " ")
            {
                final_file_name = final_file_name+file_name.charAt(i)
            }
        }

        let form_data = new FormData();
        form_data.append('new_profile_pic', profile_pic.new_profile_pic, final_file_name);

        const url = "api/auth/update_profile_pic";
        axios.post(url,form_data,{
            headers:{
                "content-type":"multipart/form-data",
                "Authorization": "Token "+localStorage.getItem("auth_token")
            }
        }).then((response)=>{
            const pic = response.data.pic
            setProfiledata({...profile_data , "pic":pic})
            setProfile_pic({new_profile_pic:null})
        }).catch((error)=>{
            console.log(error)
            alert("Unable to update profile picture. Please try again.")
        });
    }


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
                        <div className="card col-lg-4 col-sm-12">
                            <img className="card-img-top rounded-circle mx-auto " 
                                style={{width : 300 , height : 300}} 
                                src={profile_data["pic"]} 
                                alt="profile "/>
                            <div className="card-body">
                                <h5 className="card-title text-center">
                                    {profile_data["first_name"]+" "+profile_data["last_name"]}
                                </h5>
                                < button className="btn btn-info btn-block"
                                    onClick={()=>{alert("Email sent to update password")}}>
                                    Update password
                                </button>
                                <Link to = "/create_room" className="btn btn-info btn-block">
                                    Create new room
                                </Link>
                            </div>
                        </div>
                        <div className="card  col-lg-8 col-sm-12">
                            <form className="from-inline roomform my-1 pl-2" onSubmit={updateProfile_pic}>
                                <div className="mt-1">
                                    <h5>Upload New Profile Pic </h5>
                                    <div className="custom-file col-md-8 align-left mb-2">
                                        <input type="file" onChange={handlefileUpload}  required 
                                                className="custom-file-input" id="customFile"
                                                accept=".png, .jpg, .jpeg"/>
                                        <label className="custom-file-label" htmlFor="customFile">
                                            {profile_pic.new_profile_pic ? profile_pic.new_profile_pic.name : "Choose New profile pic"}
                                        </label>
                                    </div>
                                    <button className="btn btn-success btn-sm ml-1" type="submit">
                                        Upload picture
                                    </button>
                                </div>
                            </form>
                            {/* form for searching a room with its room id */}
                            <form className = "container roomform d-grid mb-1" onSubmit={searchRoom}>
                                <div className="form-row text-center m-3">
                                    <h5>Search room by room id</h5>
                                </div>
                                <div className="form-row m-2 " >
                                    <label htmlFor="title">
                                        Enter ID of room you want to search
                                    </label>
                                    <input type="text" className="form-control" id="text" 
                                        placeholder="Room ID" name = "title" value={search_room_id}
                                        onChange={(event)=> {setSearch_room_id(event.target.value)}}
                                        required/>
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-outline-info mb-1">
                                        Search Room
                                    </button>
                                </div>
                            </form>
                            <div className = "roomform rounded-3">
                                {
                                    Object.keys(searched_room).length !== 0?
                                    <table className="table table-hover table-striped">
                                        <thead>
                                            <tr style={{backgroundColor:"#00ffff"}}>
                                                <th scope="col">Your Room</th>
                                                <th scope="col">Owner of the room</th>
                                                <th scope="col">Open Room</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <th scope="col">{searched_room["room_name"]}</th>
                                                <th scope="col">{searched_room.owner["name"]}</th>
                                                <th scope="col">
                                                    <Link to ={"/room/" + searched_room["room_id"] } >
                                                         < OpenRoomSvg/>
                                                    </Link>
                                                </th>
                                            </tr>
                                        </tbody>
                                    </table>
                                    : null
                                }
                            </div>
                        </div>
                </div>
                
                <div className="row">
                    {
                        rooms["Rooms"].length === 0 ?
                        <h4>
                            You have not created or being added to any room right know. <br/>
                            Click the button bellow your prolile picture to create rooms.
                        </h4>
                        :
                        <table className="table table-hover table-striped mt-1 ">
                            <thead>
                                <tr style={{backgroundColor:"#40e0d0"}}>
                                <th scope="col">Your Room</th>
                                <th scope="col">Owner of the room</th>
                                <th scope="col">Open Room</th>
                                <th scope="col">Copy room id</th>

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
                                                    <Link to ={"/room/" + room.room["room_id"] } >
                                                         < OpenRoomSvg/>
                                                    </Link>
                                                </th> 
                                                <th>
                                                    <button className="btn btn-outline-info"
                                                        onClick ={ () => {copy_to_clipboard(room.room["room_id"] ,
                                                                                         room.room["room_name"])}}>
                                                        Copy
                                                    </button>
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