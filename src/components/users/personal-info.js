import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
import axios from 'axios'

import './personal-info.css'


function PersonalInfo(){
    const history = useHistory();
    const [fields,setFields] = useState({
      firstname:"",
      middlename:"",
      lastname:"",
      address:"",
      contact:"",
      gender:"Male",
      bloodgroup:"A+",
      age:"",
      birthdate:"",
      height:"",
      weight:"",
      message:"",
      profile_pic:null,
    });



    function handleChange(e){
      const fieldName = e.target.name;
      const newValue = e.target.value;
      setFields({...fields,[fieldName]:newValue});
    }

    function handlefileUpload(e){
      const fieldName = e.target.name;
      const newValue = e.target.files[0] ;
      setFields({...fields,"profile_pic":newValue});
      console.log(fieldName,newValue.name,fields);
    }

    function handleSubmit(e)
    {
      e.preventDefault();

      let form_data = new FormData();
      form_data.append('first_name', fields.firstname);
      form_data.append('last_name', fields.lastname);
      form_data.append('middle_name', fields.middlename);
      form_data.append('address', fields.address);
      form_data.append('contact_number', fields.contact);
      form_data.append('gender', fields.gender);
      form_data.append('blood_group', fields.bloodgroup);
      form_data.append('birth_date', fields.birthdate);
      form_data.append('weight', fields.weight);
      form_data.append('height', fields.height);
      form_data.append('special_info', fields.message);
      form_data.append('profile_pic', fields.profile_pic, fields.profile_pic.name);

      axios.post("/api/auth/create_profile",form_data,{
            headers:{
                'content-type': 'multipart/form-data',
                "Authorization": "Token "+localStorage.getItem("auth_token")
            }
        }).then((res)=>{
            console.log(res);
            history.push('/profile');
        }).catch((err)=>{
            alert("Invalid credentials !!");
            console.log(err);
        });

    }

    return (
        <form className = "container mform d-grid" onSubmit={handleSubmit}>
          <div className="form-row text-center m-3">
            <h3>Please fill the information carefully !!</h3>
          </div>
          <div className="form-row m-3 " >
            <div className=" col-md-4 ">
              <label htmlFor="firstname">First Name :</label>
              <input type="text" className="form-control" id="firstname" 
              placeholder="Swapnil" name = "firstname" value = {fields.firstname} 
              onChange = {handleChange} required/>
            </div>

            <div className=" col-md-4">
              <label htmlFor="middlename">Middle Name :</label>
              <input type="text" className="form-control" id="middlename" placeholder="Vitthal"
              name = "middlename" value = {fields.middlename} onChange = {handleChange}  required/>
            </div>

            <div className=" col-md-4">
              <label htmlFor="lastname">Last Name :</label>
              <input type="text" className="form-control" id="lastname" placeholder="Chavan"
              name = "lastname" value = {fields.lastname} onChange = {handleChange}  required/>
            </div>
          </div>

          <div className="form-row m-3">
            <div className=" col-md-8">
              <label htmlFor="Address">Address :</label>
              <input type="text" className="form-control" id="address" placeholder="1234 Main St"
              name = "address" value = {fields.address} onChange = {handleChange}  required/>
            </div>

            <div className=" col-md-4">
              <label htmlFor="Contact">Emergency Contact Number :</label>
              <input type="text" className="form-control" id="contact" placeholder="8999999999"
              name = "contact" value = {fields.contact} onChange = {handleChange}  required/>
            </div>
          </div>  
          
          <div className="form-row m-3">
            <div className="form-group col-md-4">
              <label htmlFor="gender">Gender :</label>
              <select id="gender" className="form-control"
              name = "gender" value = {fields.gender} onChange = {handleChange}>
                <option >Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group col-md-4 ">
              <label htmlFor="blood-gropu">Blood-Group :</label>
              <select id="blood-group" className="form-control"
              name = "bloodgroup" value = {fields.bloodgroup} onChange = {handleChange}>
                <option >A+</option>
                <option>B+</option>
                <option>O+</option>
                <option >A-</option>
                <option>B-</option>
                <option>O-</option>
              </select>
            </div>
            <div className=" col-md-4">
              <label htmlFor="birthday">Birthdate :</label>
              <input type="date" className="form-control" id="birthdate" name="birthdate"
              value={fields.birthdate} onChange={handleChange} required/>
            </div>
            
          </div>
          <div className="form-row m-3">
            <div className=" col-md-4">
              <label htmlFor="height">Height :</label>
              <input type="text" className="form-control" id="height" placeholder="180cm"
              name = "height" value = {fields.height} onChange = {handleChange}  required/>
            </div>
            <div className=" col-md-4">
              <label htmlFor="weight">Weight :</label>
              <input type="text" className="form-control" id="weight" placeholder="60kg"
              name = "weight" value = {fields.weight} onChange = {handleChange}  required/>
            </div>
            <div className=" col-md-4">
              <label htmlFor="Age">Age :</label>
              <input type="text" className="form-control" id="age" placeholder="99"
              name = "age" value = {fields.age} onChange = {handleChange}  required/>
            </div>
          </div>
          <div className="from-row m-3">
            <div className="custom-file col-md-12 align-self-center">
              <input type="file" onChange={handlefileUpload}  required className="custom-file-input" id="customFile"/>
              <label className="custom-file-label" htmlFor="customFile">
                {fields.profile_pic ? fields.profile_pic.name : "Choose File"}
              </label>
              
            </div>
          </div>
          <div className="from-row m-3">
            <div className="form-group col-md-12">
              <label htmlFor="mgs">Anything that you would like to tell us..</label>
              <input type="text" className="form-control" id="mgs" placeholder="CAN BE USEFULL IN CASE OF EMERGENCY."
              name = "message" value = {fields.message} onChange = {handleChange}  required/>
            </div>
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-primary mb-2">Submit details</button>
          </div>
        </form>
    )
  
}

export default PersonalInfo;