import React, { useState , useEffect } from 'react'
import { useParams } from 'react-router-dom'


import { getDoc , query,collection, where, getDocs ,doc ,updateDoc , addDoc , onSnapshot, orderBy} from 'firebase/firestore'; // Assuming Firebase v9
import { db  } from '../firebase.js';

import { Table ,Image,Col , label , input , textarea , Toast , ToastContainer} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function OrderInfo() {
    const {data:orderId}=useParams();
    const [orderItems , setOrderItems]=useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [search , setSearch]=useState()
const [toSearch , setToSearch]=useState()



    const storeId = "AV392AHNNg8TZf5IoOKg";
    

    const q = query(collection(db, "OrderItems"), where("orderId", "==", orderId));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const ordrItems = [];
    
      for (const document of querySnapshot.docs) {
        // Ensure document exists before accessing data
        if (document.exists) {
          const orderData = document.data(); // Use productData for readability
    
          const ordrItem = {
            ...orderData,
            productName: await getDoc(doc(db, "Products", orderData.productId)).then(
              (docSnap) => (docSnap.exists ? docSnap.data().name : null)
            ),
          };
    
          ordrItems.push(ordrItem);
        } else {
          console.log("No such document!"); // Log for debugging
        }
      }
    
      setOrderItems(ordrItems);
    });



      useEffect(() => {
        if(toSearch!=null){
          setFilteredOrders(orderItems.filter((order) => order.productName==toSearch));
        }else {
            setFilteredOrders(orderItems)
        }   
        }, [orderItems, toSearch])







  return (
    <div class={"p-3"}>

      
    <div className="d-flex  flex-column flex-md-row mb-4 justify-content-md-between align-items-md-center">
    
      <div class="d-flex   justify-content-md-start align-items-center col-7 col-md-auto">
      <h3 class=" ms-2 ms-md-0 me-md-3 col-9 col-md-auto">Order Items</h3>
      
      
    </div>

    <div class="d-flex justify-content-md-end mt-2 mt-md-0 align-items-center col-7 col-md-5 ">
    <div class=" col-9 col-md-9 col-lg-8">
    <label for="searchOrder" class="visually-hidden">Search</label>
    <input type="text" class="form-control shadow" id="searchOrder" placeholder="Search by product name" value ={search} onChange={(event) => {
  const newValue = event.target.value === '' ? null : event.target.value; // Check for empty string
  setSearch(newValue)
  if(newValue==null){
    setToSearch(null)
  }

}}/>
  </div>
  <div >
    <button type="submit" class="btn btn-primary ms-2  "   onClick={()=> setToSearch(search)}>Search     </button>
  </div>
    </div>
    </div>
  
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
