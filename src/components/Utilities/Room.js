import {useEffect , useState , useRef } from 'react'
import { useHistory } from 'react-router'
import axios from 'axios'
import "./Room.css"
import { Link } from 'react-router-dom'

const Room = (props) => {

    const history = useHistory();
    const [room_data , setRoomdata] = useState({})
    const [reports , setReports] = useState([])
    const [email , setEmail] = useState("")
    const [search_report_by_description , setSearch_report_by_description] = useState("")
    const [regex_expression , setRegexexpression] = useState(".*")
    const regex = new RegExp(regex_expression,"i")
    const [report_data , setReportdata] = useState({
        room_id : props.match.params.room_id,
        title : "",
        description : "",
        report : null

    })
    const [loading , setLoading] = useState(true)
    const report_head = useRef(null); //points towards reports table
  

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


    },[props.match.params.room_id])


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
        const current_members = room_data["members"]
        let room_member_email = ""
        for(let i=0;i<current_members.length;i++)
        {
            room_member_email=current_members[i].profile["email"]
            if (room_member_email === email)
            {
                alert("Already present in the room !!")
                return 
            }
        }
        const invite = {'room_id' : report_data.room_id , 'email' : email}
        axios.post("/room/send_invite",invite,{
            headers:{
                'content-type': 'Application/json',
                "Authorization": "Token "+localStorage.getItem("auth_token")
            }
        }).then((res)=>{
            setEmail("")
            alert("Invitation sent successfully .")

        }).catch((err)=>{
            alert("Some error occured!!");
            console.log(err);
        });


    }
    // uploading report 
    function handleSubmit(e){
        e.preventDefault()
        // removing spaces from file name 
        // because of deleting issue on server
        const file_name = report_data.report.name
        let final_file_name = ""
        for (let i=0;i<file_name.length;i++)
        {
            if(file_name.charAt(i) !== " ")
            {
                final_file_name = final_file_name+file_name.charAt(i)
            }
        }

        let form_data = new FormData();
        form_data.append('room_id', report_data.room_id);
        form_data.append('title', report_data.title);
        form_data.append('description', report_data.description);
        form_data.append('report', report_data.report, final_file_name);

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
                alert("Error occured . Please submit again !!");
                console.log(err);
            });
    }

    // focus/scroll to see reports
    const seeReports = () => {
        // `current` points to the mounted text input element
        report_head.current.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const delete_room = () =>{
        if(window.confirm("All files in this room will be deleted and cannot be recovered again . Do you still want to delete this room ??"))
        {
            const room_id = props.match.params.room_id
            const url = "/room/delete_room/"+room_id
            axios.delete(url,{
                headers:{
                    'content-type': 'Application/json',
                    'Authorization': 'Token '+localStorage.getItem("auth_token")
                }
            }).then((response)=>{
                alert("Room deleted successfully ")
                history.push("/profile")

            }).catch((err)=>{
                alert("Some error occured while deleting room . Please try again!!");
                console.log(err);
            });
        }
    }

    const remove_member = (email , name , option,index) =>{
        if (email === room_data["owner"]["email"])
        {
            window.alert("Owner of the room cannot be removed")
            return ;
        }
        // option 1--> owner removes member else member leaves room
        let message = ""
        if(option === 1 )
        {
            message = "Do you want to remove "+name+" from this room ??"
        }
        else{
            message = "Are you sure you want to leave room??"
        }
        if(window.confirm(message))
        {
            const room_id = props.match.params.room_id
            const url = "/room/remove_member"
            const body = {member_email : email , room_id : room_id }
            axios.post(url,body,{
                headers:{
                    'content-type': 'Application/json',
                    'Authorization': 'Token '+localStorage.getItem("auth_token")
                }
            }).then((response)=>{
                alert(name+" is no longer part of this room.")
                room_data["members"].splice(index,1)
                setRoomdata({...room_data,"members":room_data["members"]})
                if(option === 2 )
                {
                    history.push("/profile");
                }
                

            }).catch((err)=>{
                alert("Some error occured while removing member . Please try again!!");
                console.log(err);
            });
        }
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
            <div className="container-fluid">
                <div className="row">
                    <div className="mx-auto room_heading col-lg-12 text-center">
                        <h3 style={{ display : 'inline-block' ,textTransform: 'capitalize'}} >
                                {room_data["room_name"]}
                        </h3>
                        <button className="btn btn-outline-info mx-2" onClick={seeReports}>
                                See Reports
                        </button>

                        {
                            owner_email === local_owner_email ?
                            <button className="btn btn-outline-danger "
                                onClick = {delete_room}
                                style={{float:'right'}}>
                                Delete Room
                            </button>
                            : null
                        }
                    </div>    
                    <div className="col col-lg-6 col-md-12 col-sm-12">
                        
                        <table className="table table-hover table-striped">
                            <thead>
                                <tr style={{backgroundColor:"#40e0d0"}}>
                                <th scope="col">Profile picture</th>
                                <th scope="col">Name of member</th>
                                {
                                   owner_email === local_owner_email ?
                                   <th scope="col">Remove member</th>
                                   : null 
                                }
                                
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    members.map( (profile , index) => {
                                        const cname = profile.profile["first_name"]+" "+profile.profile["last_name"];
                                        const cemail = profile.profile["email"]
                                        return (
                                            <tr key ={index}>
                                                <th>
                                                    <img className="rounded "
                                                        src = {profile.profile["pic"]} 
                                                        alt = "profile pic here"
                                                        style={{width : 75 , height : 75}}></img>
                                                </th>
                                                <th className="text-center">
                                                    {cname}
                                                    {cemail !== owner_email ? <button className="btn btn-block btn-danger btn-sm"
                                                                                onClick ={() => {remove_member(cemail,cname,2,index)}}>
                                                                                    Leave Room
                                                                                </button> 
                                                                            : <button className="btn btn-block btn-outline-danger btn-sm">
                                                                                    Owner 
                                                                                </button> }
                                                </th>
                                                {
                                                  (owner_email === local_owner_email ) 
                                                  ?
                                                    <th>
                                                        <button className="btn btn-sm btn-warning"
                                                            onClick ={() => {remove_member(cemail,cname,1,index)}}>
                                                            Remove
                                                        </button>
                                                    </th>
                                                    : null
                                                }
                                                
                                            </tr>
                                        )
                                        
                                        
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="col col-lg-6 col-md-12 col-sm-12">

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
                            null
                        }
                        
                        

                        {/*form for uploading report */}
                        <form className = "container roomform d-grid" onSubmit={handleSubmit}>
                        <div className="form-row text-center m-3">
                            <h5>Upload your reports here </h5>
                        </div>
                        <div className="form-row m-3 " >
                            
                            <input type="text" list="list" className="form-control"
                                    name = "title" 
                                    placeholder="Select or type title for this document"
                                    value = {report_data.title}
                                    onChange = {handleChange} 
                                    maxLength="20" required/>
                            <datalist id="list">
                                <option value="Bill"/>
                                <option value="Lab Report"/>
                                <option value="Prescription"/>
                                <option value="other"/>
                            </datalist>
                            
                        </div>

                        <div className="form-row m-3 ">
                            <label htmlFor="description">Add some description about report :</label>
                            <input type="text" className="form-control" id="description" 
                                    placeholder="message to remember about report"
                                    name = "description" value = {report_data.description} 
                                    onChange = {handleChange}  required
                                    maxLength="40"/>
                        </div>
                        <div className="from-row m-3">
                            <h6>Report</h6>
                            <div className="custom-file col-md-12 align-self-center mb-2">
                                <input type="file" onChange={handlefileUpload}  required 
                                        className="custom-file-input" id="customFile"
                                        accept=".pdf"/>
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
                <div ref ={report_head} className="row">
                    {/* this is where report_head is */}
                    <div className="col col-12">
                        <h3>Reports </h3>
                        <button  className="btn btn-dark mb-2 mr-1"
                                onClick={() => { setRegexexpression("Bills"); seeReports()}}>
                            Show Bills
                        </button>
                        <button  className="btn btn-dark mb-2 mr-1"
                                onClick={() => { setRegexexpression("Reports"); seeReports()}}>
                            Show Reports
                        </button>
                        <button  className="btn btn-dark mb-2 mr-1"
                            onClick={() => { setRegexexpression("Prescription"); seeReports()}}>
                            Show Prescriptions
                        </button>
                        <button  className="btn btn-dark mb-2 mr-1"
                            onClick={() => { setRegexexpression(".*"); seeReports()}}>
                            Show All
                        </button>
                        <input type="text" required value={search_report_by_description} 
                                onChange={(e)=>{setSearch_report_by_description(e.target.value)}}
                                placeholder="Search by description "
                                className="mx-2"/>
                        <button className="btn btn-sm btn-success" type="submit"
                            onClick={()=>{setRegexexpression(search_report_by_description)}}>
                            Search
                        </button>
                        <table className="table table-hover table-striped">
                            <thead>
                                <tr  style={{backgroundColor:"#bf00ff" , color:'wheat'}}>
                                <th scope="col">Report Number</th>
                                <th scope="col">Report title</th>
                                <th scope="col">Report description</th>
                                <th scope="col">Uploaded by</th>
                                <th scope="col">See Report</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    reports.filter(report => ((regex.test(report.report["title"])) 
                                                            || (regex.test(report.report["description"])))).map( (report , index) => {
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
                                                        {report.report["uploaded_by"]}
                                                    </th>
                                                    <th >
                                                        <Link to="/pdf" target="_blank" rel="noreferrer noopener">
                                                            <span onClick = {()=>{localStorage.setItem("pdfurl",report.report["file"])}}>Open file</span>
                                                        </Link>
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
