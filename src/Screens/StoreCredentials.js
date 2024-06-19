import React, { useState } from "react";

import { useParams } from "react-router-dom";
import image from "../Images/noStoreProfile.png"
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  InputGroup,
  FormControl,
} from "react-bootstrap";

import { getDownloadURL, ref, uploadBytes ,getStorage  , uploadBytesResumable} from 'firebase/storage';
import { getDoc , query,collection, where, getDocs ,doc ,updateDoc , addDoc} from 'firebase/firestore'; 
import { db  } from '../firebase.js';



function StoreCredentialForm() {


    const styles = {
     
        borderRadius: '50%', // Set to 50% for a circle
      
      };
  const { data: storeId } = useParams();

  const [isSubmitting  , setIsSubmitting]=useState()


  const [formData, setFormData] = useState({
    storeName:null,
    phoneNumber:null,
    location:null,
    image:null,
    description:null,
    minimumCharge:null,
    deliveryCharge:null,
    deliveryTime:null,
    openingHourWeekDay:null,
    openingMinutesWeekDay:null,
    closingHourWeekDay:null,
    closingMinutesWeekDay:null,
    openingHourWeekEnd:null,
    openingMinutesWeekEnd:null,
    closingHourWeekEnd:null,
    closingMinutesWeekEnd:null,
    includeSundays:null,
    openingTimePeriodWeekDay:"AM",
    closingTimePeriodWeekDay:"PM",
    openingTimePeriodWeekEnd:"AM",
    closingTimePeriodWeekEnd:"PM"
   
    // Other credential fields
  });

  
  const handleFileChange = (event) => {
    const droppedFile = event.target.files[0];

    if (!droppedFile.type.match('image/.*')) {
      alert('Please select an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      
      setFormData({...formData , image:e.target.result})
      
    };
    reader.readAsDataURL(droppedFile);
  };
  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];

    if (!droppedFile.type.match('image/.*')) {
      alert('Please select an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      
      setFormData({...formData,image:droppedFile})

    };
    reader.readAsDataURL(droppedFile);
  };


  const handleClick = () => {
    document.getElementById('fileInput').click();
  };


  const [errors, setErrors] = useState({}); // To store validation errors

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    const validationErrors = {};


    if(!formData.storeName){
        validationErrors.storeName= "Required Field";
    }

    if(!formData.phoneNumber){
      validationErrors.phoneNumber= "Required Field";
  }

  if(!formData.location){
    validationErrors.location= "Required Field";
}

if(!formData.description){
  validationErrors.description= "Required Field";
}

if(!formData.minimumCharge){
  validationErrors.minimumCharge="Required Field";
}

if(!formData.deliveryCharge){
  validationErrors.deliveryCharge= "Required Field";
}
if(!formData.deliveryTime){
  validationErrors.deliveryTime= "Required Field";
}

if(!formData.openingHourWeekDay){
  validationErrors.openingHourWeekDay= "Required Field";
}

if(!formData.openingMinutesWeekDay){
  validationErrors.openingMinutesWeekDay= "Required Field";
}

if(!formData.closingHourWeekDay){
  validationErrors.closingHourWeekDay= "Required Field";
}

if(!formData.closingMinutesWeekDay){
  validationErrors.closingMinutesWeekDay= "Required Field";
}

if(!formData.openingHourWeekEnd){
  validationErrors.openingHourWeekEnd= "Required Field";
}

if(!formData.openingMinutesWeekEnd){
  validationErrors.openingMinutesWeekEnd= "Required Field";
}

if(!formData.closingHourWeekEnd){
  validationErrors.closingHourWeekEnd= "Required Field";
}

if(!formData.closingMinutesWeekEnd){
  validationErrors.closingMinutesWeekEnd= "Required Field";
}


    setErrors(validationErrors);

    // **Security Consideration:**
    // Perform server-side validation and secure password storage
    // (e.g., hashing with a strong algorithm) before user creation.

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);

      if(formData.image!=null){

        const storage = getStorage();

        const filename = `\{${formData.storeName}Logo.png`;

        // Create a storage reference
        const storageRef = ref(storage, `stores-logos/${filename}`);
  
        // Handle file conversion if needed (if using DataURL from handleDrop)
        const imageBlob = formData.image instanceof Blob ? formData.image : await fetch(formData.image).then(r => r.blob());
  
        // Upload the image Blob to Firebase Storage
        const uploadTask = uploadBytesResumable(storageRef, imageBlob, {
          contentType: 'image/jpeg' // Specify image type
        });
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload progress:', progress + '%');
          },
          (error) => {
            console.error('Error uploading image:', error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('Image URL:', downloadURL);
  
            setFormData({...formData , image:downloadURL})
          }
        );
      }
            // Update the product document with the new image URL
  
            const docRef = await addDoc(collection(db, "Stores"), {
              "name": formData.storeName,
              "phoneNumber":formData.phoneNumber,
              "location":formData.location,
              "minimumCharge":parseFloat(formData.minimumCharge).toFixed(2),
              "description":formData.description,
              "deliveryCharge":parseFloat(formData.deliveryCharge).toFixed(2),
              "deliveryTime":parseInt(formData.deliveryTime),
              "image": formData.image,
              "storeId":storeId,
              "OperatingField":{
                Monday:{
                  openingTime:`${formData.openingHourWeekDay}:${formData.openingMinutesWeekDay} ${formData.openingTimePeriodWeekDay}` , 
                  closingTime:`${formData.closingHourWeekDay}:${formData.closingMinutesWeekDay} ${formData.closingTimePeriodWeekDay}` } ,
                  Tuesday :{
                    openingTime:`${formData.openingHourWeekDay}:${formData.openingMinutesWeekDay} ${formData.openingTimePeriodWeekDay}` , 
                  closingTime:`${formData.closingHourWeekDay}:${formData.closingMinutesWeekDay} ${formData.closingTimePeriodWeekDay}`
                    
                  },
                  Wednesday:{
                    openingTime:`${formData.openingHourWeekDay}:${formData.openingMinutesWeekDay} ${formData.openingTimePeriodWeekDay}` , 
                  closingTime:`${formData.closingHourWeekDay}:${formData.closingMinutesWeekDay} ${formData.closingTimePeriodWeekDay}`
                  },
                  Thursday:{
                    openingTime:`${formData.openingHourWeekDay}:${formData.openingMinutesWeekDay} ${formData.openingTimePeriodWeekDay}` , 
                  closingTime:`${formData.closingHourWeekDay}:${formData.closingMinutesWeekDay} ${formData.closingTimePeriodWeekDay}`
                  },
                  Friday:{
                    openingTime:`${formData.openingHourWeekDay}:${formData.openingMinutesWeekDay} ${formData.openingTimePeriodWeekDay}` , 
                  closingTime:`${formData.closingHourWeekDay}:${formData.closingMinutesWeekDay} ${formData.closingTimePeriodWeekDay}`
                  },
                  Saturday:{
                    openingTime:`${formData.openingHourWeekEnd}:${formData.openingMinutesWeekEnd} ${formData.openingTimePeriodWeekEnd}` , 
                  closingTime:`${formData.closingHourWeekEnd}:${formData.closingMinutesWeekEnd} ${formData.closingTimePeriodWeekEnd}`
                  },
                  Sunday: (formData.includeSundays) ? {
                    openingTime: `${formData.openingHourWeekEnd}:${formData.openingMinutesWeekEnd} ${formData.openingTimePeriodWeekEnd}`,
                    closingTime: `${formData.closingHourWeekEnd}:${formData.closingMinutesWeekEnd} ${formData.closingTimePeriodWeekEnd}`
                  } : null

                  
                }

            });

            //navigation
  
            
        


      




    }

  };
  return (
    <div class="col-12 d-flex justify-content-center align-items-center vh-md-100 p-2 p-md-0 ">
      <div class=" col-11 col-md-9 col-lg-7 shadow p-3 rounded">
        <div class="col-12 d-flex justify-content-between align-items-center mb-2 mb-md-0">
        <h3> Store Credentials</h3>

        <div class="d-flex  " onClick={()=>handleClick()}>
        <input type="file" id="fileInput"  accept="image/*" onChange={handleFileChange} class={"mt-4 " }   style={{ display: 'none' }} />
<div class=" p-2 shadow  " style={styles}>
<img src={formData.image==null ?image : formData.image} class="rounded-circle  " alt="..."  style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}  />
</div>
     
        </div>
   
        </div>
        
        <Form onSubmit={handleSubmit}>
          
          <div class="mb-2">
            <div class="col-12 d-flex  flex-column flex-md-row justify-content-between  align-items-md--center">
              <FormGroup
                controlId="formBasicEmail"
                className="mb-2 col-md-3 d-flex flex-md-column"
              >
                <label class="col-6 col-md-12  p-1 ">Store Name</label>
                <input
                  type="text"
                  name="StoreName"
                  value={formData.storeName}
                  onChange={(event) => {
                    const newValue =
                      event.target.value === "" ? null : event.target.value; // Check for empty string
                    setFormData({ ...formData, storeName: newValue });
                  }}
                  placeholder="Store Name"
                  className={`  ${errors.storeName==null ? "border-2" : " form-control is-invalid"} rounded p-1  col-6 col-md-auto` }
                />
              </FormGroup>

              <FormGroup
                controlId="formBasicPassword"
                className="mb-2 col-md-3 d-flex flex-md-column"
              >
                <label class="col-6 col-md-12 p-1">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(event) => {
                    const newValue =
                      event.target.value === "" ? null : event.target.value; // Check for empty string
                    setFormData({ ...formData, phoneNumber: newValue });
                  }}
                  placeholder="PhoneNumber"
                  className={`  ${errors.phoneNumber==null ? "border-2" : " form-control is-invalid"} rounded p-1  col-6 col-md-auto` }
                />
              </FormGroup>

              <FormGroup
                controlId="formBasicConfirmPassword"
                className="mb-2 col-md-3 d-flex flex-md-column"
              >
                <label class=" col-6 col-md-12 p-1 ">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={(event) => {
                    const newValue =
                      event.target.value === "" ? null : event.target.value; // Check for empty string
                    setFormData({ ...formData, location: newValue });
                  }}
                  placeholder="Store Location"
                  className={`  ${errors.location==null ? "border-2" : " form-control is-invalid"} rounded p-1  col-6 col-md-auto` }
                />
              </FormGroup>
            </div>
            <div class="col-md-12 ">
              <label htmlFor="Description" class="form-label">
                Description
              </label>
              <textarea
                type="text"
                rows="2"
                class={`form-control ${errors.description!=null && "is-invalid"}`}
                id="Description"
                value={formData.description}
                onChange={(event) => {
                  const newValue =
                    event.target.value === "" ? null : event.target.value; // Check for empty string
                  setFormData({ ...formData, description: newValue });
                }}
              />
            </div>
          </div>

          <h5> Delivery Info</h5>

          <div class="col-12 d-flex flex-column flex-md-row justify-content-between  align-items-md-center">
            <FormGroup
              controlId="formBasicEmail"
              className="mb-2 col-md-3 d-flex flex-md-column"
            >
              <label class="col-6 col-md-12  p-1 ">Minimum Charge</label>
              <input
                type="number"
                min="0"
                name="Minimum Charge"
                value={formData.minimumCharge}
                onChange={(event) => {
                  const newValue =
                    event.target.value === "" ? null : event.target.value; // Check for empty string
                  setFormData({ ...formData, minimumCharge: newValue });
                }}
                placeholder="Minimum Charge"
                className={`  ${errors.minimumCharge==null ? "border-2" : " form-control is-invalid"} rounded p-1  col-6 col-md-auto` }
              />
            </FormGroup>

            <FormGroup
              controlId="formBasicPassword"
              className="mb-2 col-md-3 d-flex flex-md-column"
            >
              <label class="col-6 col-md-12 p-1">Delivery Charge</label>
              <input
                type="number"
                min={0}
                name="DeliveryCharge"
                value={formData.deliveryCharge}
                onChange={(event) => {
                  const newValue =
                    event.target.value === "" ? null : event.target.value; // Check for empty string
                  setFormData({ ...formData, deliveryCharge: newValue });
                }}
                placeholder="Delivery Charge"
                className={`  ${errors.deliveryCharge==null ? "border-2" : " form-control is-invalid"} rounded p-1  col-6 col-md-auto` }
              />
            </FormGroup>

            <FormGroup
              controlId="formBasicConfirmPassword"
              className="mb-2 col-md-3 d-flex flex-md-column"
            >
              <label class=" col-6 col-md-12 p-1">Delivery Time</label>
              <input
                type="number"
                name="location"
                min={0}
                value={formData.deliveryTime}
                onChange={(event) => {
                  const newValue =
                    event.target.value === "" ? null : event.target.value; // Check for empty string
                  setFormData({ ...formData, deliveryTime: newValue });
                }}
                placeholder="Delivery Time"
                className={`  ${errors.deliveryTime==null ? "border-2" : " form-control is-invalid"} rounded p-1  col-6 col-md-auto` }
              />
            </FormGroup>
          </div>

          <h5>Operating Time</h5>
          <h6>WeekDays</h6>
          <div class="col-12 d-flex flex-column flex-md-row justify-content-md-between align-items-md-center  ">
            <div class="   ">
              
              <FormGroup
                controlId="formBasicConfirmPassword"
                className="mb-2  d-flex flex-column "
              >
                <label className="col-5 col-md-12 p-1">Opening Time </label>
                <InputGroup class="d-flex flex-row align-items-md-center ">
                  <input
                    type="number"
                    name="HH"
                    min={1}
                    max={12} // Assuming delivery time is a number
                    value={formData.startingHourWeekDay}
                    onChange={(event) => {
                      const newValue =
                        event.target.value === "" ? null : event.target.value;
                      setFormData({ ...formData, openingHourWeekDay :newValue  });
                    }}
                    placeholder="HH"
                    class={`  ${errors.openingHourWeekDay==null ?"border-2" : "form-control is-invalid"} rounded  text-center p-1` }
                  />

                  <span class="mx-2">:</span>

                  <input
                    type="number"
                    name="MM"
                    min={0}
                    max={59} // Assuming delivery time is a number
                    value={formData.openingMinutesWeekDay}
                    onChange={(event) => {
                      const newValue =
                        event.target.value === "" ? null : event.target.value;
                      setFormData({ ...formData, openingMinutesWeekDay: newValue });
                    }}
                    placeholder="MM"
                    class={`  ${errors.openingMinutesWeekDay==null ?"border-2" : "form-control is-invalid"} rounded  text-center p-1` }
                  />

                  <div class="mx-2 ">
                    <select
                      className="form-select form-select-sm border-2 "
                      aria-label=".form-select-sm example"
                      value={formData.openingTimePeriodWeekDay}

                      onChange={(event) =>  setFormData({ ...formData, openingTimePeriodWeekDay: event.target.value })}
                    >
                      <option value="AM">AM</option>

                      <option value="PM">PM</option>
                    </select>
                  </div>
                </InputGroup>
              </FormGroup>
            </div>

            <div class="d-flex ">
        

              <FormGroup
                controlId="formBasicConfirmPassword"
                className="mb-2  d-flex flex-column "
              >
                <label className="col-5 col-md-12 p-1"> Closing Time </label>
                <InputGroup class="d-flex  flex-row ">
                  <input
                    type="number"
                    name="HH"
                    min={1}
                    max={12} // Assuming delivery time is a number
                    value={formData.closingHourWeekDay}
                    onChange={(event) => {
                      const newValue =
                        event.target.value === "" ? null : event.target.value;
                      setFormData({ ...formData, closingHourWeekDay :newValue  });
                    }}
                    placeholder="HH"
                    class={`  ${errors.closingHourWeekDay==null ?"border-2" : "form-control is-invalid"} rounded  text-center p-1` }
                  />

                  <span class="mx-2">:</span>

                  <input
                    type="number"
                    name="MM"
                    min={0}
                    max={59} // Assuming delivery time is a number
                    value={formData.closingMinutesWeekDay}
                    onChange={(event) => {
                      const newValue =
                        event.target.value === "" ? null : event.target.value;
                      setFormData({ ...formData, closingMinutesWeekDay: newValue });
                    }}
                    placeholder="MM"
                    class={`  ${errors.closingMinutesWeekDay==null ?"border-2" : "form-control is-invalid"} rounded  text-center p-1` }
                  />

                  <div class="mx-2 ">
                    <select
                      className="form-select form-select-sm border-2 "
                      aria-label=".form-select-sm example"
                      value={formData.closingTimePeriodWeekDay}

                      onChange={(event) =>  setFormData({ ...formData, closingTimePeriodWeekDay: event.target.value })}
                    >
                      <option value="AM">AM</option>

                      <option value="PM">PM</option>
                    </select>
                  </div>
                </InputGroup>
              </FormGroup>
            </div>

          </div>

<div class="d-flex  mt-2 mt-md-0">
<h6 class="me-3">WeekEnds</h6>
<Form.Group>
      <Form.Check
        type="radio"
        id="flexRadioDefault2"
        name="flexRadioDefault"
        label="Include Sundays"
           // Set the radio button as checked by default
           checked={formData.includeSundays}

           onClick={()=>setFormData({...formData , includeSundays:(!formData.includeSundays)})}
          
      />
    </Form.Group>
</div>
          <div class="col-12 d-flex  flex-column flex-md-row justify-content-md-between align-items-md-center  ">
            <div class=" d-flex  ">
              
              <FormGroup
                controlId="formBasicConfirmPassword"
                className="mb-3  d-flex flex-column "
              >
                <label className="col-12  p-1">Opening Time </label>
                <InputGroup class="d-flex  flex-row align-items-center">
                  <input
                    type="number"
                    name="HH"
                    min={1}
                    max={12} // Assuming delivery time is a number
                    value={formData.startingHourWeekEnd}
                    onChange={(event) => {
                      const newValue =
                        event.target.value === "" ? null : event.target.value;
                      setFormData({ ...formData, openingHourWeekEnd :newValue  });
                    }}
                    placeholder="HH"
                    class={`  ${errors.openingHourWeekEnd==null ?"border-2" : "form-control is-invalid"} rounded  text-center p-1` }
                  />

                  <span class="mx-2">:</span>

                  <input
                    type="number"
                    name="MM"
                    min={0}
                    max={59} // Assuming delivery time is a number
                    value={formData.startingMinutesWeekDay}
                    onChange={(event) => {
                      const newValue =
                        event.target.value === "" ? null : event.target.value;
                      setFormData({ ...formData, openingMinutesWeekEnd: newValue });
                    }}
                    placeholder="MM"
                    class={`  ${errors.openingMinutesWeekEnd==null ?"border-2" : "form-control is-invalid"} rounded  text-center p-1` }
                  />

                  <div class="mx-2 ">
                    <select
                      className="form-select form-select-sm border-2 "
                      aria-label=".form-select-sm example"
                      value={formData.openingTimePeriodWeekEnd}

                      onChange={(event) =>  setFormData({ ...formData, openingTimePeriodWeekEnd: event.target.value })}
                    >
                      <option value="AM">AM</option>

                      <option value="PM">PM</option>
                    </select>
                  </div>
                </InputGroup>
              </FormGroup>
            </div>

            <div class="d-flex">
        

              <FormGroup
                controlId="formBasicConfirmPassword"
                className="mb-3  d-flex flex-column "
              >
                <label className=" col-12 p-1"> Closing Time </label>
                <InputGroup class="d-flex  flex-row ">
                  <input
                    type="number"
                    name="HH"
                    min={1}
                    max={12} // Assuming delivery time is a number
                    value={formData.closingHourWeekEnd}
                    onChange={(event) => {
                      const newValue =
                        event.target.value === "" ? null : event.target.value;
                      setFormData({ ...formData, closingHourWeekEnd :newValue  });
                    }}
                    placeholder="HH"
                    class={`  ${errors.closingHourWeekEnd==null ?"border-2" : "form-control is-invalid"} rounded  text-center p-1` }
                  />

                  <span class="mx-2">:</span>

                  <input
                    type="number"
                    name="MM"
                    min={0}
                    max={59} // Assuming delivery time is a number
                    value={formData.closingMinutesWeekEnd}
                    onChange={(event) => {
                      const newValue =
                        event.target.value === "" ? null : event.target.value;
                      setFormData({ ...formData, closingMinutesWeekEnd: newValue });
                    }}
                    placeholder="MM"
                    class={`  ${errors.closingMinutesWeekEnd==null ?"border-2" : "form-control is-invalid"} rounded  text-center p-1` }
                  />

                  <div class="mx-2 ">
                    <select
                      className="form-select form-select-sm border-2 "
                      aria-label=".form-select-sm example"
                      value={formData.closingTimePeriodWeekEnd}

                      onChange={(event) =>  setFormData({ ...formData, closingTimePeriodWeekEnd: event.target.value })}
                    >
                      <option value="AM">AM</option>

                      <option value="PM">PM</option>
                    </select>
                  </div>
                </InputGroup>
              </FormGroup>
            </div>




          </div>

          <button  type="submit" class="btn btn-primary col-12">
            Submit
          </button>
        </Form>

      </div>
    </div>
  );
}

export default StoreCredentialForm;
