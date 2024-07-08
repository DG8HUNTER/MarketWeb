import { formatDate } from 'date-fns';
import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button, Card } from 'react-bootstrap';

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation

function SignUpForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isSigningUp ,setIsSigningUp]=useState(false)



  const navigate = useNavigate()

  const [email , setEmail ] =useState()
  const [password , setPassword]=useState()
  const [confirmPass , setConfirmPass]=useState()

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
   }else{
    if(formData.password.length < 8){
        validationErrors.password="Password must be at least 8 characters. "
    }else {
        if(!formData.confirmPassword){
            validationErrors.confirmPassword ="Required Field";
        }else {
            if(formData.password!==formData.confirmPassword){
                validationErrors.confirmPassword="Passwords do not match"
            }
        }
    }

   }

   if(!formData.confirmPassword){
    validationErrors.confirmPassword ="Required Field";
   }

    setErrors(validationErrors);

    // **Security Consideration:**
    // Perform server-side validation and secure password storage
    // (e.g., hashing with a strong algorithm) before user creation.

    if (Object.keys(validationErrors).length === 0) {
        setIsSigningUp(true)
      // Handle successful form submission (e.g., send data to server)
      console.log('Form submitted successfully:', formData);

      const auth = getAuth();
createUserWithEmailAndPassword(auth, formData.email, formData.password)
  .then((userCredential) => {
    // Signed up 
    const store = userCredential.user.uid;
    navigate(`/storeCredentials/${store}` , {replace:true})
   
    // ...
  })
  .catch((error) => {
    setIsSigningUp(false)
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
      // Clear the form
    
    }
  };

  return (
    <div className="  d-flex justify-content-center align-items-center vh-100">
      <Card className="shadow border mx-auto col-md-6 col-lg-5 col-xl-4 p-4">
        <Card.Body>
          <h3 className="text-center mb-4 text-primary">Sign Up</h3>
          <Form onSubmit={handleSubmit}>
            <FormGroup controlId="formBasicEmail" className="mb-3 col-12 d-flex flex-md-column">
              <label class="col-5 col-md-12  py-1">Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(event) => {
                    const newValue = event.target.value === '' ? null : event.target.value; // Check for empty string
                    setFormData({...formData , email:newValue})
                  }}
                placeholder="Enter email"
                className={` ${errors.email== null && "border"}  rounded px-2 py-1    ${errors.email!=null && "form-control is-invalid"}`} 
               
              />
              {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
            </FormGroup>

 
            <FormGroup controlId="formBasicPassword" className="mb-3 col-12 d-flex flex-md-column">
              <label class="col-5 col-md-12 py-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(event) => {
                    const newValue = event.target.value === '' ? null : event.target.value; // Check for empty string
                    setFormData({...formData , password:newValue});
                  }} 
                placeholder="Password"
                className={` ${errors.password== null && "border"} rounded px-2 py-1    ${errors.password!=null && "form-control is-invalid"}`}
              />
              {errors.password && <Form.Text className="text-danger">{errors.password}</Form.Text>}
            </FormGroup>

            <FormGroup controlId="formBasicConfirmPassword" className="mb-3 col-12 d-flex flex-md-column">
              <label class=" col-5 col-md-12 py-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={(event) => {
                    const newValue = event.target.value === '' ? null : event.target.value; // Check for empty string
                    setFormData({...formData , confirmPassword:newValue})
                  }}
                placeholder="Confirm password"
                className={` ${errors.confirmPassword== null && "border"}  rounded px-2 py-1    ${errors.confirmPassword!=null && "form-control is-invalid"}`}
              />
              {errors.confirmPassword && <Form.Text className="text-danger">{errors.confirmPassword}</Form.Text>}
            </FormGroup>

            <Button variant="primary" type="submit" className="w-100  mb-3">
             { isSigningUp==true ?<div class="d-flex justify-content-center align-items-center" >
                  Signing Up
                  <span className="spinner-border spinner-border-sm mx-2" role="status" aria-hidden="true">
      <span className="visually-hidden">Loading...</span>
    </span>
                </div>: "Sign Up"}
            </Button>

            <div class="d-flex justify-content-center align-items-center ">
                <p  style={{color:"gray"}}> Already have an account ?  <span  onClick={()=> navigate(`/SignIn`, { replace: true })} class="text-primary"> Sign In</span></p>
            </div>
          </Form>
        </Card.Body> 
      </Card>
    </div>
  );
}

export default SignUpForm;
