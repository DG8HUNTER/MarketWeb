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
    const [search , setSearch]=useState("All")

const [products , setProducts]=useState([])



    const storeId = "AV392AHNNg8TZf5IoOKg";
    

    const q = query(collection(db, "OrderItems"), where("orderId", "==", orderId));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const ordrItems = [];
      const prods =[]
    
      for (const document of querySnapshot.docs) {
        // Ensure document exists before accessing data
        if (document.exists) {
          const orderData = document.data(); // Use productData for readability

          const productData = await getDoc(doc(db, "Products", orderData.productId));
    
          const ordrItem = {
            ...orderData,
            productName:productData.data().name
          };
    
          ordrItems.push(ordrItem);
          prods.push(productData.data().name)
        } else {
          console.log("No such document!"); // Log for debugging
        }
      }
    
      setOrderItems(ordrItems);
      setProducts(prods);
    });



      useEffect(() => {
        if(search!="All"){
          setFilteredOrders(orderItems.filter((order) => order.productName===search));
        }else {
            setFilteredOrders(orderItems)
        }   
        }, [orderItems, search])







  return (
    <div class={"p-3"}>

    <div className="d-flex  flex-column flex-md-row mb-4 justify-content-md-between align-items-md-center">
    
      <div class="d-flex   justify-content-md-start align-items-center col-7 col-md-auto">
      <h3 class=" ms-2 ms-md-0 me-md-3 col-9 col-md-auto">Order Items</h3>
      
      
    </div>

    <div class="d-flex justify-content-md-end mt-2 mt-md-0 align-items-center col-7 col-md-5 ">
    <div class=" col-9 col-md-9 col-lg-8">
    <label for="searchOrder" class="visually-hidden">Search</label>
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
