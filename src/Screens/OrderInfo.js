
import React, { useState , useEffect } from 'react'
import { useParams } from 'react-router-dom'


import { getDoc , query,collection, where, getDocs ,doc ,updateDoc , addDoc , onSnapshot, orderBy} from 'firebase/firestore'; // Assuming Firebase v9
import { db  } from '../firebase.js';

import { Table ,Image,Col , label , input , textarea , Toast , ToastContainer ,Spinner} from 'react-bootstrap';
import { Circles } from 'react-loader-spinner';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function OrderInfo() {
    const {data:orderId}=useParams();
    const [order ,setOrder]=useState({})
    const [orderItems , setOrderItems]=useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [search , setSearch]=useState("All")
    const [isUpdating , setIsUpdating]=useState()
    const [statusToUpdate , setStatusToUpdate]=useState()
    const [showToast , setShowToast]= useState(false)

const [products , setProducts]=useState([])
const [customerData , setCustomerData]=useState({});



useEffect(() => {
  console.log("UseEffect 1 Order Info");
  const fetchOrderData = async () => {
    const OrderRef = await getDoc(doc(db, "Orders", orderId));
   
    const OrderData = OrderRef.data();
   setOrder({...OrderData})
   
  };

  fetchOrderData();
}, [statusToUpdate]);

const updateStatus =async (status) =>{

const OrderRef = doc(db, "Orders", orderId);

// Set the "capital" field of the city 'DC'
await updateDoc(OrderRef, {
  "status":status
});

setIsUpdating(false);
setShowToast(true)

setTimeout(() => {
  setShowToast(false);
  
}, 2000);

}



useEffect(() => {
  console.log("UseEffect 1 Order Info");
  const fetchData = async () => {
    const OrderRef = await getDoc(doc(db, "Orders", orderId));
    const customerRef = await getDoc(doc(db, "Users", OrderRef.data().userId));
    const customerData = customerRef.data();
    setCustomerData(customerData)
   
  };

  fetchData();
}, []);

    const storeId = "AV392AHNNg8TZf5IoOKg";
    

    const q = query(collection(db, "OrderItems"), where("orderId", "==", orderId));



    useEffect(() => {
      const q = query(collection(db, "OrderItems"), where("orderId", "==", orderId));
  
      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
          console.log("Query Order Info executed (reads data from Firestore)");
          const ordrItems = [];
          const prods = [];
  
          await Promise.all(querySnapshot.docs.map(async (document) => {
              // Ensure document exists before accessing data
              if (document.exists) {
                  const orderData = document.data();
  
                  const productDoc = await getDoc(doc(db, "Products", orderData.productId));
                  const productData = productDoc.data();
  
                  const ordrItem = {
                      ...orderData,
                      productName: productData.name
                  };
  
                  ordrItems.push(ordrItem);
                  prods.push(productData.name);
              } else {
                  console.log("No such document!"); // Log for debugging
              }
          }));
  
          setOrderItems(ordrItems);
          setProducts(prods);
      });
  
      return () => {
          console.log("Cleaning up snapshot listener");
          unsubscribe();
      };
  }, []);
  







    //Not releated

      useEffect(() => {
        
        if(search!="All"){
          setFilteredOrders(orderItems.filter((order) => order.productName===search));
        }else {
            setFilteredOrders(orderItems)
        }   
        }, [orderItems, search])







  return (
    <div class={"p-3"}>
      
      <ToastContainer position="top-center">
<Toast show={showToast} autohide   class="shadow bg-white"> {/* Added classes */}
    <Toast.Header class="bg-white" closeButton={false} >
      <strong className="me-auto">Notification</strong>
    </Toast.Header>
    <Toast.Body>Order  status updated successfully</Toast.Body>
  </Toast>
    </ToastContainer>
    
<div className="d-flex flex-column flex-md-row mb-2 justify-content-between align-items-center">

  <h3 className="ms-2 ms-md-0 me-md-3 col-auto">Order Info</h3>

 

  <div className="d-flex  mt-2 mt-md-0 align-items-center col-auo col-md-3">
    <div className="col-12 ">
      <label for="searchOrder" className="visually-hidden">Search</label>
      <select
        className="form-select form-select-sm shadow"
        aria-label=".form-select-sm example"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      >
        <option value="All">All</option>
        {products.map((prod) => (
          <option key={prod.id || prod} value={prod}>
            {prod}
          </option>
        ))}
      </select>
    </div>
  </div>
</div>

    <div class="mb-3">
  
    <h6>Customer Id : {customerData.UserID}</h6>
      <h6>Customer Name : {customerData.FirstName} {customerData.LastName}</h6>
      <div className="btn-group d-flex flex-row col-md-3 mt-2" role="group" aria-label="Order Status">
      <button
  type="button"
  className={`btn btn-warning me-2 text-white  ${order.status==="pending"&& "border-black border-2"} rounded d-flex flex-row justify-content-between align-items-center`}
  onClick={() => {
    setIsUpdating(true);
    updateStatus("pending");
    setStatusToUpdate("pending");
  }}
>
  Pending
  {(isUpdating === true && statusToUpdate === "pending") && (
    <span className="spinner-border spinner-border-sm mx-1" role="status" aria-hidden="true">
      <span className="visually-hidden">Loading...</span>
    </span>
  )}
</button>
    <button type="button" className={`btn btn-info me-2 rounded ${order.status==="processing"&& "border-black border-2"} text-white d-flex flex-row justify-content-between align-items-center`}  onClick={() => {
    setIsUpdating(true);
    updateStatus("processing");
    setStatusToUpdate("processing");
  }}>Processing   {(isUpdating === true && statusToUpdate === "processing") && (
    <span className="spinner-border spinner-border-sm mx-1" role="status" aria-hidden="true">
      <span className="visually-hidden">Loading...</span>
    </span>
  )}</button>
    <button type="button" className={`btn btn-primary me-2 rounded  ${order.status==="shipped"&& "border-black border-2"} d-flex flex-row justify-content-between align-items-center`}   onClick={() => {
    setIsUpdating(true);
    updateStatus("shipped");
    setStatusToUpdate("shipped");
  }}>Shipped {(isUpdating === true && statusToUpdate === "shipped") && (
    <span className="spinner-border spinner-border-sm mx-1" role="status" aria-hidden="true">
      <span className="visually-hidden">Loading...</span>
    </span>
  )}</button>
    <button type="button" className={`btn btn-success me-2 rounded ${order.status==="delivered"&& "border-black border-2"} d-flex flex-row justify-content-between align-items-center`}  onClick={() => {
    setIsUpdating(true);
    updateStatus("delivered");
    setStatusToUpdate("delivered");
  }}>Delivered {(isUpdating === true && statusToUpdate === "delivered") && (
    <span className="spinner-border spinner-border-sm mx-1" role="status" aria-hidden="true">
      <span className="visually-hidden">Loading...</span>
    </span>
  )}</button>
    <button type="button" className={`btn btn-danger me-2 rounded  ${order.status==="cancelled"&& "border-black border-2"}  d-flex flex-row justify-content-between align-items-center`}   onClick={() => {
   
    setIsUpdating(true);
    updateStatus("cancelled");
    setStatusToUpdate("cancelled");
  }}>Cancelled {(isUpdating === true && statusToUpdate === "cancelled") && (
    <span className="spinner-border spinner-border-sm mx-1" role="status" aria-hidden="true">
      <span className="visually-hidden">Loading...</span>
    </span>
  )}</button>
  </div>
    </div>

    <h4>Items</h4>
  
      {filteredOrders.length > 0 ? (
      
        
         <Table striped bordered hover responsive  className={"shadow-sm "} draggable   >

         <thead>
           <tr className={"text-center "}>
             <th>Id</th>
             <th>Product Name</th>
             <th>Quantity</th>
             <th>Total Price</th>
             <th>Total Profit</th>
           </tr>
         </thead>
         <tbody >
          {filteredOrders.map((order) => (
          <tr key={order.orderId}  className={"text-center flex align-middle"} >
         <td  className="d-flex align-items-center justify-content-center text-center  " >  
          {order.orderItemId}
        </td>
          <td>{order.productName}</td>
          <td>{order.quantity}</td>
          <td>{order.totalPrice} $</td>
          <td>{order.totalProfit} $</td>
          </tr>
         
            
          
          ))}
          </tbody>
         </Table>
      
      ) : (
        <p>No Orders found.</p>
      )}
    </div>
  );
   
}


