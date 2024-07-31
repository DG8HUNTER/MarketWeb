import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { getDoc , query,collection, where, getDocs ,doc ,updateDoc , addDoc , onSnapshot, orderBy} from 'firebase/firestore'; // Assuming Firebase v9
import { db  } from '../firebase.js';

import { Row, Col, Dropdown, DropdownButton, Form, FormControl, Button ,Table} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function Orders() {
const {data:storeId} = useParams()

const navigate = useNavigate();
const date = new Date();
const [orders, setOrders] = useState([]); 

const [status, setStatus] = useState("pending"); 
const [ storeData , setStoreData]=useState({})

const [isExpanded , isExpanededFun]=useState(false)
const [isDropdownOpen, setIsDropdownOpen] = useState(false);

const [filteredOrders, setFilteredOrders] = useState([]);
const[isLoading , setIsLoading]=useState(true)

const [search , setSearch]=useState()
const [toSearch , setToSearch]=useState()
const [month, setMonth] = useState(date.getMonth()+1);
const [year, setYear] = useState(date.getFullYear());

const handleMonthChange = (event) => {
  setMonth(event.target.value);
};

const handleYearChange = (event) => {
  setYear(event.target.value);
};


const toggleDropdown = () => {
  setIsDropdownOpen(!isDropdownOpen);
};



  
  
const q = query(collection(db, "Orders"), where("storeId", "==", storeId),orderBy("createdAt", "desc"));

const unsubscribe = onSnapshot(q, (querySnapshot) => {
  
  const ordrs = [];
  querySnapshot.forEach((doc) => {
    if(doc!=null){

      
      ordrs.push({...doc.data()});}
  });
  setOrders(ordrs);
setIsLoading(false)

});



useEffect(() => {
  const fetchData = async () => {
    const storeRef = doc(db, "Stores", storeId);
    const storeSnap = await getDoc(storeRef);
    const store = storeSnap.data();
    setStoreData(store);
  };

  fetchData();
}, []);




useEffect(() => {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0);
  console.log(`  start  ${startOfMonth}`)
  console.log(`end ${endOfMonth}`)
  const firstDayOfNextMonth = new Date(year, month, 1);
  
  if(toSearch!=null){
    
    setFilteredOrders(orders.filter((order) => order.status === status && order.orderId==toSearch && order.createdAt.toDate()>=startOfMonth && order.createdAt.toDate()<firstDayOfNextMonth));


  }else {
    setFilteredOrders(orders.filter((order) => order.status === status && order.createdAt.toDate()>=startOfMonth && order.createdAt.toDate()<firstDayOfNextMonth));
  }
   
    
    
  }, [orders, status , toSearch , month , year]);



return (
    <div class={"p-3"}>

      
<div className="d-flex flex-column flex-md-row mb-2 mb-md-4 justify-content-md-between align-items-md-center">
      <div className="d-flex justify-content-between  justify-content-md-start align-items-center col-12 col-md-5">
        <h2 className="me-2">Store Orders</h2>
        <DropdownButton variant="primary" title={status} onToggle={toggleDropdown}>
          <Dropdown.Item onClick={() => setStatus("pending")}>Pending</Dropdown.Item>
          <Dropdown.Item onClick={() => setStatus("processing")}>Processing</Dropdown.Item>
          <Dropdown.Item onClick={() => setStatus("shipped")}>Shipped</Dropdown.Item>
          <Dropdown.Item onClick={() => setStatus("delivered")}>Delivered</Dropdown.Item>
          <Dropdown.Item onClick={() => setStatus("cancelled")}>Cancelled</Dropdown.Item>
        </DropdownButton>
      </div>

      

      <div className="d-flex justify-content-md-end mt-2 mt-md-0 align-items-center col-12 col-md-5 ">
        <div className="col-9 col-md-9 col-lg-8">
          <FormControl type="text" className="form-control shadow-sm rounded-pill" placeholder="Search for Order" value={search} onChange={(event) => {
            const newValue = event.target.value === '' ? null : event.target.value;
            setSearch(newValue);
            if (newValue === null) {
              setToSearch(null);
            }
          }} />
        </div>
        <div>
          <Button variant="primary" className="ms-2" type="submit" onClick={() => setToSearch(search)}>
            Search
          </Button>
        </div>
      </div>
      </div>

      <div className="col-7 col-md-5 mb-3">
  <Form className="d-flex align-items-center justify-content-between">
    <Row>
      {/* Month Input */}
      <Col xs={6} md={5} lg={4}>
        <Form.Group className="d-flex align-items-center mb-2 mb-md-0">
          <Form.Label className="me-2">Month</Form.Label>
          <FormControl type="number" min="1" max="12" placeholder="Enter month" value={month} onChange={handleMonthChange} />
        </Form.Group>
      </Col>

      {/* Year Input */}
      <Col xs={6} md={5} lg={4}>
        <Form.Group className="d-flex align-items-center">
          <Form.Label className="me-2">Year</Form.Label>
          <FormControl type="number" min="2023" placeholder="Enter year" value={year} onChange={handleYearChange} />
        </Form.Group>
      </Col>
    </Row>
  </Form>
</div>
  
      {filteredOrders.length > 0 ? (
        
         <Table striped bordered hover responsive  className={"shadow-sm "} draggable   >

         <thead>
           <tr className={"text-center "}>
             <th>orderId</th>
             <th>Delivery Address</th>
             <th>Status</th>
             <th>CreatedAt</th>
             <th>Total Items</th>
             <th>Total Price</th>
             <th>Total Price + Delivery</th>
           </tr>
         </thead>
         <tbody >
          {filteredOrders.map((order) => (
          <tr key={order.orderId} onClick={()=> navigate(`/orderInfo/${order.orderId}`) } className={"text-center flex align-middle"} >
         <td  className="d-flex align-items-center justify-content-center text-center  " >  
          {order.orderId}
        </td>
        <td>{order.location}</td>
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
          <td>{Math.round((order.totalPrice + storeData.deliveryCharge)*100)/100} $</td>
          </tr>
         
            
          
          ))}
          </tbody>
         </Table>
      
      ) : (
        (
          isLoading==true ? (
            <p>Loading order info...</p>
          ) : (
            <p> No Orders  found.</p>
          )
        )
      )}
    </div>
  );
}
