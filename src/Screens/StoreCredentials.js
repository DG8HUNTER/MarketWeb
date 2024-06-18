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

function StoreCredentialForm() {


    const styles = {
     
        borderRadius: '50%', // Set to 50% for a circle
      
      };
  const { data: storeId } = useParams();


  const [formData, setFormData] = useState({
    includeSundays:false,
   
    // Other credential fields
  });

  return (
    <div class="col-12 d-flex justify-content-center align-items-center vh-md-100 p-2 p-md-0 ">
      <div class=" col-11 col-md-9 col-lg-7 shadow p-3 rounded">
        <div class="col-12 d-flex justify-content-between align-items-center mb-2 mb-md-0">
        <h3> Store Credentials</h3>
<div class=" p-2 shadow  " style={styles}>
<img src={formData.image==null ?image : formData.image} class="rounded-circle img-fluid " alt="..." width={57} height={57}  />
</div>
        
        </div>
        
        <Form>
          
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
                  class={" rounded p-1 border-2 col-6 col-md-auto "}
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
                    setFormData({ ...formData, phoneNumver: newValue });
                  }}
                  placeholder="PhoneNumber"
                  class={"rounded p-1 border-2 col-6 col-md-auto"}
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
                  class={" rounded p-1 border-2 col-6 col-md-auto"}
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
                class="form-control  "
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
                class={" rounded p-1 border-2 col-6 col-md-auto"}
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
                class={" rounded p-1 border-2 col-6 col-md-auto"}
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
                  setFormData({ ...formData, deliveryTme: newValue });
                }}
                placeholder="Delivery Time"
                class={" rounded p-1 border-2 col-6 col-md-auto"}
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
                    class=" rounded border-2 text-center p-1"
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
                      setFormData({ ...formData, openingMinutesWeekDay: newValue });
                    }}
                    placeholder="MM"
                    class="  rounded  border-2 text-center p-1"
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
                    class=" rounded border-2 text-center p-1"
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
                    class=" rounded  border-2 text-center p-1"
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
                    class=" rounded border-2 text-center p-1"
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
                    class="  rounded  border-2 text-center p-1"
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
                    class=" rounded border-2 text-center p-1"
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
                    class=" rounded  border-2 text-center p-1"
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

          <button class="btn btn-primary col-12">
            Submit
          </button>
        </Form>

      </div>
    </div>
  );
}

export default StoreCredentialForm;
