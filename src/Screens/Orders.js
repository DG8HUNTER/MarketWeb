import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'

import { getDoc , query,collection, where, getDocs ,doc ,updateDoc , addDoc , onSnapshot, orderBy} from 'firebase/firestore'; // Assuming Firebase v9
import { db  } from '../firebase.js';

import { Table ,Image,Col , label , input , textarea , Toast , ToastContainer} from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Orders() {
const {data:storeId} = useParams()

const [orders, setOrders] = useState([]); 

const [status, setStatus] = useState("pending"); 

const [isExpanded , isExpanededFun]=useState(false)
const [isDropdownOpen, setIsDropdownOpen] = useState(false);

const [filteredOrders, setFilteredOrders] = useState([]);

const toggleDropdown = () => {
  setIsDropdownOpen(!isDropdownOpen);
};



  
  
const q = query(collection(db, "Orders"), where("storeId", "==", storeId),orderBy("createdAt", "asc"));

const unsubscribe = onSnapshot(q, (querySnapshot) => {
  const ordrs = [];
  querySnapshot.forEach((doc) => {
    if(doc!=null){
      ordrs.push({...doc.data()});}
  });
  setOrders(ordrs);

});

useEffect(() => {
   
      setFilteredOrders(orders.filter((order) => order.status === status));
    
  }, [orders, status]);



return (
    <div className={"p-4"}>



    <div className="d-flex flex-row mb-4 justify-content-start align-items-center">
      <h3>Store Orders</h3>
      <div class="mx-3">
      <Dropdown  show={isDropdownOpen} onToggle={toggleDropdown}>
        <Dropdown.Toggle variant="primary">
          {status}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={()=>setStatus("pending")}  href="#">pending</Dropdown.Item>
          <Dropdown.Item   onClick={()=>setStatus("processing")} href="#">processing</Dropdown.Item>
          <Dropdown.Item   onClick={()=>setStatus("shiped")} href="#">shipped</Dropdown.Item>
          <Dropdown.Item   onClick={()=>setStatus("delivered")} href="#">delivered</Dropdown.Item>
          <Dropdown.Item   onClick={()=>setStatus("cancelled")}href="#">cancelled</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
    </div>
  
      {filteredOrders.length > 0 ? (
        
         <Table striped bordered hover responsive  className={"shadow-sm "} draggable   >

         <thead>
           <tr className={"text-center "}>
             <th>orderId</th>
             <th>Status</th>
             <th>CreatedAt</th>
             <th>Total Items</th>
             <th>Total Price</th>
           </tr>
         </thead>
         <tbody >
          {filteredOrders.map((order) => (
          <tr key={order.orderId} className={"text-center flex align-middle"} >
         <td  className="d-flex align-items-center justify-content-center" >  
          {order.orderId}
        </td>
          <td>{order.status}</td>
         <td>{new Date(order.createdAt.seconds * 1000).toLocaleString('en-LB', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
})}</td>
          <td>{order.totalItems}</td>
          <td>{order.totalPrice} $</td>
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
