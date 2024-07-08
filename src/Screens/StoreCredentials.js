import React, { useState ,useEffect} from "react";

import { useNavigate, useParams } from "react-router-dom";
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
import { getDoc , query,collection, where, getDocs ,doc ,updateDoc , addDoc , setDoc} from 'firebase/firestore'; 
import { db  } from '../firebase.js';
import { getAuth, signOut } from "firebase/auth";


function StoreCredentialForm() {





    const styles = {
     
        borderRadius: '50%', // Set to 50% for a circle
      
      };
  const { data: storeId } = useParams();

  const [isSubmitting  , setIsSubmitting]=useState();
  
  
  const [isUpdating , setIsUpdating]=useState();
  const [selectedImage , setSelectedImage]=useState(null);

 

  

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
    closingTimePeriodWeekEnd:"PM",
    status:null,
    automaticUpdateStatus:null
   
    // Other credential fields
  });

  const [state, setState]=useState()

  function formatNumber(number) {
    return (number < 10 ? "0" : "") + number;
  }


  function getTimeComponents(timeString) {
    const timeRegex = /^(?<hours>\d+):(?<minutes>\d+) (?<period>[ap]m)$/i;
    const match = timeString.match(timeRegex);
  
    if (!match) {
      throw new Error('Invalid time format. Please use HH:MM (am/pm)');
    }
  
    const { hours, minutes, period } = match.groups;
  
    return {
      hour: parseInt(hours, 10),
      minutes: parseInt(minutes, 10),
      period: period,
    };
  }

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "Stores", storeId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFormData({ 
            name: docSnap.data().name ,
            phoneNumber: docSnap.data().phoneNumber,
            location:docSnap.data().location,
            minimumCharge:docSnap.data().minimumCharge,
            deliveryCharge:docSnap.data().deliveryCharge,
            description:docSnap.data().description,
            deliveryTime:docSnap.data().deliveryTime,
            openingHourWeekDay:getTimeComponents(docSnap.data().OperatingField["Monday"]["OpeningTime"]).hour,
            openingMinutesWeekDay:formatNumber(getTimeComponents(docSnap.data().OperatingField["Monday"]["OpeningTime"]).minutes),
            openingTimePeriodWeekDay:getTimeComponents(docSnap.data().OperatingField["Monday"]["OpeningTime"]).period,
            closingHourWeekDay:getTimeComponents(docSnap.data().OperatingField["Monday"]["ClosingTime"]).hour,
            closingMinutesWeekDay:formatNumber(getTimeComponents(docSnap.data().OperatingField["Monday"]["ClosingTime"]).minutes),
            closingTimePeriodWeekDay:getTimeComponents(docSnap.data().OperatingField["Monday"]["ClosingTime"]).period,
            openingHourWeekEnd:getTimeComponents(docSnap.data().OperatingField["Saturday"]["OpeningTime"]).hour,
            openingMinutesWeekEnd:formatNumber(getTimeComponents(docSnap.data().OperatingField["Saturday"]["OpeningTime"]).minutes),
            openingTimePeriodWeekEnd:getTimeComponents(docSnap.data().OperatingField["Saturday"]["OpeningTime"]).period,
            closingHourWeekEnd:getTimeComponents(docSnap.data().OperatingField["Saturday"]["ClosingTime"]).hour,
            closingMinutesWeekEnd:formatNumber(getTimeComponents(docSnap.data().OperatingField["Saturday"]["ClosingTime"]).minutes),
            closingTimePeriodWeekEnd:getTimeComponents(docSnap.data().OperatingField["Saturday"]["ClosingTime"]).period,
            image:docSnap.data().image,
            includeSundays:docSnap.data().OperatingField["Sunday"]==null ? false :true,
            status:docSnap.data().status,
            automaticUpdateStatus:docSnap.data().automaticUpdateStatus

           });
          setState("update"); // Update state for edit scenario
        } else {
          setState("add"); // Add state for new store creation
        }
      } catch (error) {
        console.error("Error fetching store data:", error);
        // Handle errors appropriately (e.g., display an error message to the user)
      }
    };

    fetchData(); // Call the function to fetch data

    // Clean up function (optional, if needed for subscriptions or event listeners)
    return () => {
      // Clean up logic here
    };

  }, []);



  console.log(formData.status)


  const SignOut = ()=>{ 
    const auth = getAuth();
signOut(auth).then(() => {
  navigate('/');
}).catch((error) => {
 console.log(`error  ${error}`)
});
  }
  

  const [isOpen, setIsOpen] = useState(false);
  const [ automaticUpdateStatus , setAutomaticUpdateStatus]=useState()



  useEffect(() => {
    if (formData) {
      setIsOpen(formData.status === "Open"); // Set isOpen based on status
    }
  }, [formData.status]); // Dependency array: updates isOpen whenever formData changes

  useEffect(() => {
    if (formData) {
      setAutomaticUpdateStatus(formData.automaticUpdateStatus); // Set isOpen based on status
    }
  }, [formData.automaticUpdateStatus]); // Dependency array: updates isOpen whenever formData changes


  console.log(isOpen)

  const navigate=useNavigate();
  
  const handleFileChange = (event) => {
    const droppedFile = event.target.files[0];

    if (!droppedFile.type.match('image/.*')) {
      alert('Please select an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      
      //setFormData({...formData , image:e.target.result})

      setSelectedImage(e.target.result)
      
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
      
     // setFormData({...formData,image:droppedFile})
     setSelectedImage(e.target.result)

    };
    reader.readAsDataURL(droppedFile);
  };


  const handleClick = () => {
    document.getElementById('fileInput').click();
  };


  const handelUpdate = async(event)=>{

  }


  const [errors, setErrors] = useState({}); // To store validation errors

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    const validationErrors = {};


    if(formData.name==null){
        validationErrors.name= "Required Field";
    }

    if(formData.phoneNumber==null){
      validationErrors.phoneNumber= "Required Field";
  }

  if(formData.location==null){
    validationErrors.location= "Required Field";
}

if(formData.description==null){
  validationErrors.description= "Required Field";
}

if(formData.minimumCharge==null){
  validationErrors.minimumCharge="Required Field";
}

if(formData.deliveryCharge==null){
  validationErrors.deliveryCharge= "Required Field";
}
if(formData.deliveryTime==null){
  validationErrors.deliveryTime= "Required Field";
}

if(formData.openingHourWeekDay==null){
  validationErrors.openingHourWeekDay= "Required Field";
}

if(formData.openingMinutesWeekDay==null){
  validationErrors.openingMinutesWeekDay= "Required Field";
}

if(!formData.closingHourWeekDay){
  validationErrors.closingHourWeekDay= "Required Field";
}

if(formData.closingMinutesWeekDay==null){
  validationErrors.closingMinutesWeekDay= "Required Field";
}

if(!formData.openingHourWeekEnd==null){
  validationErrors.openingHourWeekEnd= "Required Field";
}

if(!formData.openingMinutesWeekEnd==null){
  validationErrors.openingMinutesWeekEnd= "Required Field";
}

if(!formData.closingHourWeekEnd==null){
  validationErrors.closingHourWeekEnd= "Required Field";
}

if(!formData.closingMinutesWeekEnd==null){
  validationErrors.closingMinutesWeekEnd= "Required Field";
}

console.log("Hello world")


async function prepareStoreData(downloadURL) {
  const data= {
    "name": formData.name,
    "phoneNumber": formData.phoneNumber,
    "location": formData.location,
    "minimumCharge": parseFloat(formData.minimumCharge).toFixed(2),
    "description": formData.description,
    "deliveryCharge": parseFloat(formData.deliveryCharge).toFixed(2),
    "deliveryTime": parseInt(formData.deliveryTime),
    "status": isOpen===true ? "Open" :"Closed" ,
    "automaticUpdateStatus":automaticUpdateStatus,
    "storeId": storeId,
    "OperatingField":{
      Monday:{
        OpeningTime:`${formData.openingHourWeekDay}:${formData.openingMinutesWeekDay} ${formData.openingTimePeriodWeekDay}` , 
        ClosingTime:`${formData.closingHourWeekDay}:${formData.closingMinutesWeekDay} ${formData.closingTimePeriodWeekDay}` } ,
        Tuesday :{
          OpeningTime:`${formData.openingHourWeekDay}:${formData.openingMinutesWeekDay} ${formData.openingTimePeriodWeekDay}` , 
        ClosingTime:`${formData.closingHourWeekDay}:${formData.closingMinutesWeekDay} ${formData.closingTimePeriodWeekDay}`
          
        },
        Wednesday:{
          OpeningTime:`${formData.openingHourWeekDay}:${formData.openingMinutesWeekDay} ${formData.openingTimePeriodWeekDay}` , 
        ClosingTime:`${formData.closingHourWeekDay}:${formData.closingMinutesWeekDay} ${formData.closingTimePeriodWeekDay}`
        },
        Thursday:{
          OpeningTime:`${formData.openingHourWeekDay}:${formData.openingMinutesWeekDay} ${formData.openingTimePeriodWeekDay}` , 
        ClosingTime:`${formData.closingHourWeekDay}:${formData.closingMinutesWeekDay} ${formData.closingTimePeriodWeekDay}`
        },
        Friday:{
          OpeningTime:`${formData.openingHourWeekDay}:${formData.openingMinutesWeekDay} ${formData.openingTimePeriodWeekDay}` , 
        ClosingTime:`${formData.closingHourWeekDay}:${formData.closingMinutesWeekDay} ${formData.closingTimePeriodWeekDay}`
        },
        Saturday:{
          OpeningTime:`${formData.openingHourWeekEnd}:${formData.openingMinutesWeekEnd} ${formData.openingTimePeriodWeekEnd}` , 
        ClosingTime:`${formData.closingHourWeekEnd}:${formData.closingMinutesWeekEnd} ${formData.closingTimePeriodWeekEnd}`
        },
        Sunday: (formData.includeSundays) ? {
          OpeningTime: `${formData.openingHourWeekEnd}:${formData.openingMinutesWeekEnd} ${formData.openingTimePeriodWeekEnd}`,
          ClosingTime: `${formData.closingHourWeekEnd}:${formData.closingMinutesWeekEnd} ${formData.closingTimePeriodWeekEnd}`
        } : null

        
      }
  };

  if(downloadURL!=null){
    data.image=downloadURL

  }

  return data;
}

console.log(1)


    setErrors(validationErrors);

    // **Security Consideration:**
    // Perform server-side validation and secure password storage
    // (e.g., hashing with a strong algorithm) before user creation.

    if (Object.keys(validationErrors).length === 0) {
      if(state==="add"){
        setIsSubmitting(true);
      }else {
        setIsUpdating(true)
      }
      console.log(2);
     let data={};

      if(selectedImage!=null){
console.log(3)
        const storage = getStorage();

        const filename = `\{${formData.name}Logo.png`;

        // Create a storage reference
        const storageRef = ref(storage, `stores-logos/${filename}`);
  
        // Handle file conversion if needed (if using DataURL from handleDrop)
        const imageBlob = selectedImage instanceof Blob ? selectedImage : await fetch(selectedImage).then(r => r.blob());
  
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
            const image=downloadURL;
            console.log(4)
            console.log(`img ${image}`)

            console.log('Image URL:', downloadURL);

console.log(5)
             data = await prepareStoreData(downloadURL)

            console.log(`data image  : ${data.image}`)


  
            if(state=="add"){
              await setDoc(doc(db, "Stores", storeId), data);
              navigate(`/dash/${storeId}`, { replace: true });
            }
            else {
              const Ref = doc(db, "Stores", storeId);
              console.log("Hello update")
      
      
      await updateDoc(Ref, data)
      navigate(-1)
            }
      
           
      
  
               
           
          

            
           
          }
        );
      }else {

        data = await prepareStoreData(null)
        
      if(state=="add"){
        await setDoc(doc(db, "Stores", storeId), data);
        navigate(`/dash/${storeId}`, { replace: true });

      }
      else {
        const Ref = doc(db, "Stores", storeId);
        console.log("Hello update")


await updateDoc(Ref, data)
navigate(-1)
      }



         


      }



  
  
           


          

   
            
   


    }

  };
  return (

    <div class="col-12 d-flex justify-content-center align-items-center vh-md-100   mt-3" >
      <div class=" col-11 col-md-9 col-lg-7 shadow p-3 rounded">
        <div class="col-12 d-flex justify-content-between align-items-center mb-2 mb-md-0">
        <h3> Store Credentials</h3>

        


<div class="d-flex justify-content-center  align-items-center" >

  <div class="d-flex flex-column  justify-content-start align-items-center mx-2 ">
  <div class="form-check ">
  <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"   onClick={()=>setAutomaticUpdateStatus(!automaticUpdateStatus)} checked={automaticUpdateStatus}/>
  <label class="form-check-label" for="flexRadioDefault1">
   Auto 
  </label>
</div>
<div class="form-check form-switch ">
  <input class="form-check-input " type="checkbox" role="switch" id="flexSwitchCheckDefault"  onClick={()=>setIsOpen(!isOpen)} checked={isOpen} disabled={automaticUpdateStatus} />
  <label class="form-check-label" for="flexSwitchCheckDefault">Open</label>
</div> 
  </div>

{state=="update" &&
  <button class="btn btn-danger mx-2 d-flex align-items-center" onClick={()=>SignOut()}>
 Sign Out
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" width={20} height={20}class="mx-1">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
</svg>


  </button>
  
}
        <div class="d-flex  " onClick={()=>handleClick()}>
        <input type="file" id="fileInput"  accept="image/*" onChange={handleFileChange} class={"mt-4 " }   style={{ display: 'none' }} />
<div class=" p-2 shadow  " style={styles}>

  {state=="update" ?
  <img src={selectedImage==null ?(formData.image!=null ? formData.image : image): selectedImage} class="rounded-circle  " alt="..."  style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}  />
 :

 <img src={selectedImage==null ?image : selectedImage} class="rounded-circle  " alt="..."  style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}  />

  
  }
</div>
     
        </div>
</div>

   
        </div>
        
        <Form onSubmit={handleSubmit }>
          
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
                  value={formData.name}
                  onChange={(event) => {
                    const newValue =
                      event.target.value === "" ? null : event.target.value; // Check for empty string
                    setFormData({ ...formData, name: newValue });
                  }}
                  placeholder="Store Name"
                  className={`  ${errors.name==null ? "border-2" : " form-control is-invalid"} rounded p-1  col-6 col-md-auto` }
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
              <label class="col-6 col-md-12  p-1 ">Minimum Charge $</label>
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
              <label class="col-6 col-md-12 p-1">Delivery Charge $</label>
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
              <label class=" col-6 col-md-12 p-1">Delivery Time (Min)</label>
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
                    maxLength={2}
                    value={formData.openingHourWeekDay}
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
                    maxLength={2}
                    value={formData.openingMinutesWeekDay}
                    onChange={(event) => {
                      const newValue =
                        event.target.value === "" ? null : formatNumber(parseInt(event.target.value));
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
                    maxLength={2}
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
                    maxLength={2}
                    max={59} // Assuming delivery time is a number
                    value={ formData.closingMinutesWeekDay}
                    onChange={(event) => {
                      const newValue = event.target.value === "" ? null : formatNumber(parseInt(event.target.value));
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
                    maxLength={2}
                    min={1}
                    max={12} // Assuming delivery time is a number
                 
                    value={formData.openingHourWeekEnd}
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
                    maxLength={2}
                    value={formData.openingMinutesWeekEnd}
                    onChange={(event) => {
                        const newValue =
                        event.target.value === "" ? null : formatNumber(parseInt(event.target.value));
                      setFormData({ ...formData, openingMinutesWeekEnd: newValue});
                      
                     
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
                    maxLength={2}
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
                    maxLength={2}
                    value={formData.closingMinutesWeekEnd}
                    onChange={(event) => {
                      const newValue =
                        event.target.value === "" ? null : formatNumber(parseInt(event.target.value));
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

          {state === "add" ? (
  isSubmitting === true ? (
    <div class="d-flex justify-content-center align-items-center">
      Submitting
      <span className="spinner-border spinner-border-sm mx-2" role="status" aria-hidden="true">
        <span className="visually-hidden">Loading...</span>
      </span>
    </div>
  ) : (
    "Submit"
  )
):(
  isUpdating === true ? (
    <div class="d-flex justify-content-center align-items-center">
      Updating
      <span className="spinner-border spinner-border-sm mx-2" role="status" aria-hidden="true">
        <span className="visually-hidden">Loading...</span>
      </span>
    </div>
  ) : (
    "Update"
  )
  
)}
        
          </button>
        </Form>

      </div>
    </div>
   
  );
}

export default StoreCredentialForm;
