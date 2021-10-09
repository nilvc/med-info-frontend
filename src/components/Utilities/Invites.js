import {useEffect , useState}from 'react'
import axios from 'axios'

const AllInvites = () => {

    const [invites , setInvites] = useState([])
    const [loading , setLoading] = useState(true)

    useEffect(()=> {
            
        const url = "/room/get_allinvites/"+localStorage.getItem("email")

        axios.get(url,{
            headers:{
                "content-type":"application/json",
                "Authorization": "Token "+localStorage.getItem("auth_token")
            }
        }).then((response)=>{
            setInvites([...response.data.Invites])
            console.log("invites",response.data.Invites)
            setLoading(false)
        }).catch((err)=>{
            console.log(err);
        });
        
    },[])


    // accepted invitation
    function acceptInvitation(invite_id)
    {
        const data = {"invite_id" : invite_id}
        const url = "/room/add_member"
        console.log(invite_id)
        axios.post(url,data,{
            headers:{
                "content-type":"application/json",
                "Authorization": "Token "+localStorage.getItem("auth_token")
            }
        }).then((response)=>{
            window.location.reload()
        }).catch((err)=>{
            alert("Unable to join to room please try again")
            console.log(err);
        })

    }

    function deleteInvitation(invite_id)
    {
        const url = "/room/reject_invite/"+invite_id
        axios.post(url,{
            headers:{
                "content-type":"application/json",
                "Authorization": "Token "+localStorage.getItem("auth_token")
            }
        }).then((response)=>{
            window.location.reload()
        }).catch((err)=>{
            alert("Try again")
            console.log(err);
        })

    }


    if(loading)
    {
        return (<h3>loading</h3>)
    }
    else{
        return (
            <table className="table table-hover table-striped">
                <thead>
                    <tr className="table-info">
                        <th scope="col">Room name</th>
                        <th scope="col">Romm owner</th>
                        <th scope="col">Patient</th>
                        <th scope="col">Join Room</th>
                        <th scope="col">Delete Invite</th>

                    </tr>
                </thead>
                <tbody>
                    {
                        invites.map((invite,index) => {
                            console.log("cinvite " ,invite)
                            return(
                                <tr key = {invite.Invite["invite_id"]}>
                                    <th>
                                        {invite.Invite.room["room_name"]}
                                    </th>
                                    <th>
                                        {invite.Invite.room.owner["name"]}
                                    </th>
                                    <th>
                                        {invite.Invite.room.patient["name"]}
                                    </th>
                                    <th>
                                        <button className="btn btn-outline-success"
                                            onClick={()=>acceptInvitation(invite.Invite["invite_id"])}>
                                            Accept 
                                        </button>
                                    </th>
                                    <th>
                                        <button className="btn btn-outline-danger"
                                            onClick={()=>deleteInvitation(invite.Invite["invite_id"])}>
                                            Delete
                                        </button>
                                    </th>   
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            
        )
    }
    
}

export default AllInvites