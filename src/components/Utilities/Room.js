import {useEffect , useState} from 'react'
import axios from 'axios'
import "./Room.css"

const Room = (props) => {

    const [room_data , setRoomdata] = useState({})
    const [reports , setReports] = useState([])
    const [email , setEmail] = useState("")
    const [report_data , setReportdata] = useState({
        room_id : props.match.params.room_id,
        title : "",
        description : "",
        report : null

    })
    const [loading , setLoading] = useState(true)

    useEffect(()=> {
        const url = "/room/get_room/"+props.match.params.room_id

        axios.get(url,{
            headers:{
                "content-type":"application/json",
                "Authorization": "Token "+localStorage.getItem("auth_token")
            }
        }).then((response)=>{
            setRoomdata({...response.data["Room"]})
            setReports([...response.data["Room"]["reports"]])
            setLoading(false)
        }).catch((err)=>{
            console.log(err);
        });


    },[])


    function handleChange(e){
        const fieldName = e.target.name;
        const newValue = e.target.value;
        setReportdata({...report_data,[fieldName]:newValue});
    }

    function handlefileUpload(e){
        const newValue = e.target.files[0] ;
        setReportdata({...report_data,"report":newValue});
    }

    // to add member using email given by owner
    function addMember(event){
        event.preventDefault()
        const invite = {'room_id' : report_data.room_id , 'email' : email}
        console.log(invite)
        axios.post("/room/send_invite",invite,{
            headers:{
                'content-type': 'Application/json',
                "Authorization": "Token "+localStorage.getItem("auth_token")
            }
        }).then((res)=>{
            setEmail("")
            alert("Invitation sent successfully .")

        }).catch((err)=>{
            alert("Invalid credentials !!");
            console.log(err);
        });


    }

    function handleSubmit(e){
        e.preventDefault()
        let form_data = new FormData();
        form_data.append('room_id', report_data.room_id);
        form_data.append('title', report_data.title);
        form_data.append('description', report_data.description);
        form_data.append('report', report_data.report, report_data.report.name);

        axios.post("/room/upload_report",form_data,{
                headers:{
                    'content-type': 'multipart/form-data',
                    "Authorization": "Token "+localStorage.getItem("auth_token")
                }
            }).then((res)=>{
                setReports([{"report":res.data["Report"]} , ...reports ])
                setReportdata({
                    room_id : props.match.params.room_id,
                    title : "",
                    description : "",
                    report : null
                })

            }).catch((err)=>{
                alert("Invalid credentials !!");
                console.log(err);
            });
    }

    if(loading)
    {
        return (<h3>loading</h3>)
    }
    else{
        const members = room_data["members"]
        const owner_email = room_data["owner"]["email"]
        const local_owner_email = localStorage.getItem("email")


        return(
            <div className="container">
                <div className="row">
                    <div className="col col-6">
                        <h3>Members of the room :- {room_data["room_name"]}</h3>
                        <table className="table table-hover table-striped">
                            <thead>
                                <tr className="table-info">
                                <th scope="col">Profile picture</th>
                                <th scope="col">Name of member</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    members.map( (profile , index) => {
                                        return (
                                            <tr key ={index}>
                                                <th>
                                                    <img className="rounded-circle mx-auto "
                                                        src = {profile.profile["pic"]} 
                                                        alt = "profile pic here"
                                                        style={{width : 75 , height : 75}}></img>
                                                </th>
                                                <th >
                                                    {profile.profile["first_name"]+" "+profile.profile["last_name"]}
                                                </th>
                                            </tr>
                                        )
                                        
                                        
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="col col-6">

                        {/* form for adding members only shown to owner*/}
                        {
                            owner_email === local_owner_email ?
                            <form className = "container roomform d-grid mb-1" onSubmit={addMember}>
                                <div className="form-row text-center m-3">
                                    <h5>Enter email of member you want to add to room</h5>
                                </div>
                                <div className="form-row m-2 " >
                                    <label htmlFor="title">Email:</label>
                                    <input type="email" className="form-control" id="email" 
                                    placeholder="email" name = "email" value = {email} 
                                    onChange = {(event)=>{setEmail(event.target.value)}} required/>
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-outline-info mb-1">
                                        Add this member
                                    </button>
                                </div>
                            </form>
                            :
                            ""
                        }
                        

                        {/*form for uploading report */}
                        <form className = "container roomform d-grid" onSubmit={handleSubmit}>
                        <div className="form-row text-center m-3">
                            <h5>Upload your reports here </h5>
                        </div>
                        <div className="form-row m-3 " >
                            <label htmlFor="title">Title of report:</label>
                            <input type="text" className="form-control" id="title" 
                            placeholder="Title" name = "title" value = {report_data.title} 
                            onChange = {handleChange} required/>
                        </div>

                        <div className="form-row m-3 ">
                            <label htmlFor="description">Add some description about report :</label>
                            <input type="text" className="form-control" id="description" 
                                    placeholder="message to remember about report"
                                    name = "description" value = {report_data.description} 
                                    onChange = {handleChange}  required/>
                        </div>
                        <div className="from-row m-3">
                            <h6>Report</h6>
                            <div className="custom-file col-md-12 align-self-center mb-2">
                                <input type="file" onChange={handlefileUpload}  required 
                                        className="custom-file-input" id="customFile"/>
                                <label className="custom-file-label" htmlFor="customFile">
                                    {report_data.report ? report_data.report.name : "Choose File"}
                                </label>
                            </div>
                        </div>

                        <div className="text-center">
                            <button type="submit" className="btn btn-primary mb-2">Submit details</button>
                        </div>
                        </form>
                    </div>
                </div>
                <div className="row">
                    <div className="col ">
                        <h3>Reports </h3>
                        <table className="table table-hover table-striped">
                            <thead>
                                <tr className="table-info">
                                <th scope="col">Report Number</th>
                                <th scope="col">Report title</th>
                                <th scope="col">Report description</th>
                                <th scope="col">See Report</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    reports.map( (report , index) => {
                                        return (
                                            <tr key ={report.report["report_id"]}>
                                                <th >
                                                    {index+1}
                                                </th>
                                                <th >
                                                    {report.report["title"]}
                                                </th>
                                                <th >
                                                    {report.report["description"]}
                                                </th>
                                                <th >
                                                    <a href = {"http://127.0.0.1:8000"+report.report["file"]} target="_blank"> file</a>
                                                </th>
                                            </tr>
                                        )
                                        
                                        
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default Room;
