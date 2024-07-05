import { formatDate } from 'date-fns';
import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button, Card } from 'react-bootstrap';
import { collection, query, where, getDocs , querySnapshot } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { db  } from '../firebase.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation

function SignInForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    
  });

  const [isSigningIn ,setIsSigningIn]=useState(false)
  const [signInErrorMessage  ,setSignInErrorMessage]=useState()

  



  const navigate = useNavigate()

  const [email , setEmail ] =useState()
  const [password , setPassword]=useState()

  const [errors, setErrors] = useState({}); // To store validation errors

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission

    const validationErrors = {};


    if(!formData.email){
        validationErrors.email= "Email is required";
    }
    else  {
        if(!EMAIL_REGEX.test(formData.email)) {
      validationErrors.email = 'Required Field';}
    }


    /*if (formData.password.length < 8 && formData.password.length!=0 ) {
      validationErrors.password = 'Password must be at least 8 characters.';
    } else if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match.';
    }*/
   if(!formData.password){
    validationErrors.password="Required Field"
   }

   

    setErrors(validationErrors);

    // **Security Consideration:**
    // Perform server-side validation and secure password storage
    // (e.g., hashing with a strong algorithm) before user creation.

    if (Object.keys(validationErrors).length === 0) {
        setIsSigningIn(true)
      // Handle successful form submission (e.g., send data to server)
      console.log('Form submitted successfully:', formData);

      const auth = getAuth();
      signInWithEmailAndPassword(auth, formData.email, formData.password)
        .then(async (userCredential) => {
          let isStore=false
          const store = userCredential.user.uid;
          const q = query(collection(db, "Stores"));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
          if(doc.id===store){
            isStore=true;
           
          }
          });
       if(isStore==true){
        navigate(`/dash/${store}`) 
       }else {
        const errorMessage = "Invalid Store Credentials ";
          setSignInErrorMessage(errorMessage)

          setIsSigningIn(false)
       }
                   
        })
        .catch((error) => {
            setIsSigningIn(false)
          const errorCode = error.code;
          const errorMessage = error.message;
          setSignInErrorMessage("Invalid Credentials")
          setIsSigningIn(false)
        });
    
    }
  };
  
  return (
    <div className="  d-flex justify-content-center align-items-center vh-100">
      <Card className="shadow border mx-auto col-md-6 col-lg-5 col-xl-4 p-4">
        <Card.Body>
          <h3 className="text-center mb-4 text-primary">Sign In</h3>
          <Form onSubmit={handleSubmit}>
            <FormGroup controlId="formBasicEmail" className="mb-3 col-12 d-flex flex-md-column">
              <label class="col-5 col-md-12  py-1">Email address</label>
              <input
                type="email"
                name="email"
                onFocus={()=>(setErrors({})  , setSignInErrorMessage(null))}
                value={formData.email}
                onChange={(event) => {
                    const newValue = event.target.value === '' ? null : event.target.value; // Check for empty string
                    setFormData({...formData , email:newValue})
                  }}
                placeholder="Enter email"
                className={` ${(errors.email==null && signInErrorMessage==null) && "border"}  rounded px-2 py-1    ${(errors.email!=null || signInErrorMessage!=null) && "form-control is-invalid"}`} 
               
              />
              {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
            </FormGroup>
            

 
            <FormGroup controlId="formBasicPassword" className="mb-3 col-12 d-flex flex-md-column">
              <label class="col-5 col-md-12 py-1">Password</label>
              <input
                type="password"
                name="password"
                onFocus={()=>(setErrors({})  , setSignInErrorMessage(null))}
                value={formData.password}
                onChange={(event) => {
                    const newValue = event.target.value === '' ? null : event.target.value; // Check for empty string
                    setFormData({...formData , password:newValue});
                  }} 
                placeholder="Password"
                className={` ${(errors.password ==null && signInErrorMessage==null) && "border"} rounded px-2 py-1    ${(errors.password!=null || signInErrorMessage!=null) ? "form-control is-invalid" :""}`}
              />
              {errors.password && <Form.Text className="text-danger">{errors.password}</Form.Text>}
              {signInErrorMessage!=null && <Form.Text className="text-danger">{signInErrorMessage}</Form.Text>}
            </FormGroup>

            
            <Button variant="primary" type="submit" className="w-100  mb-3">
             { isSigningIn==true ?<div class="d-flex justify-content-center align-items-center" >
                  Signing In 
                  <span className="spinner-border spinner-border-sm mx-2" role="status" aria-hidden="true">
      <span className="visually-hidden">Loading...</span>
    </span>
                </div>: "Sign In"}
            </Button>

            <div class="d-flex justify-content-center align-items-center ">
                <p  style={{color:"gray"}}> Don't have an account ?  <span  onClick={()=>navigate("/")} class="text-primary"> Sign Up</span></p>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default SignInForm;
