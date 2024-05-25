import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db  } from '../firebase.js';
import { getDoc , query,collection, where, getDocs ,doc ,updateDoc , addDoc , onSnapshot} from 'firebase/firestore';
import { Table ,Image,Col , label , input , textarea , Toast , ToastContainer , button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


function MyComponent() {


  const navigate = useNavigate();

  const [orders , setOrders] = useState(0)
  const [currentOrders , setCurrentOrdes]=useState(0)
  const [income , setIncome] = useState(0)
  const [profit , setProfit] = useState(0)

  const handleButtonClick = (data) => {
    navigate(`/products/${data}`); // Include data as a parameter
  };

  const addProduct = (data) => {
    navigate(`/addProduct/${data}`); // Include data as a parameter
  };

  const storeId = "AV392AHNNg8TZf5IoOKg"

  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);



  const q = query(collection(db, "Orders"), where("storeId", "==", storeId));
const unsubscribe = onSnapshot(q, (querySnapshot) => {
  const ord = [];
  const current =[]
  let monthlyIncome = 0;
  let monthlyProfit =0;

  querySnapshot.forEach((doc) => {
      ord.push(doc.id);

      if(doc.data().createdAt.toDate() >= startOfMonth &&  doc.data().createdAt.toDate()<=endOfMonth ){
        current.push(doc.id)
        monthlyIncome+=doc.data().totalPrice;

        //we have to see if the order is not cancelled or (pending 
        if(doc.data().status!="cancelled" && doc.data().status!="pending"){
          monthlyProfit+=doc.data().totalProfit;
        }
       

       
      }
  });

  setOrders(ord.length)
  setCurrentOrdes(current.length)
  setIncome(monthlyIncome)
  setProfit(monthlyProfit)
}
);





  

  return (
    <div class={"d-flex flex-column col-12 p-4"}>
   

   <div class={"col-12 d-flex flex-row justify-content-around align-content-center"}>
   <div class="card mt-2 shadow  col-2">
  <div class="card-body ">
    <h5 class="card-title">#Total Orders</h5>
    <p class="card-text font-weight-bold h3" style={{ color: '#007bff' }}>{orders}</p>
  </div>
</div>

<div class="card mt-2 shadow  col-2">
  <div class="card-body ">
    <h5 class="card-title">#Monthly Orders </h5>
    <p class="card-text font-weight-bold h3" style={{ color: '#007bff' }}>{currentOrders}</p>
  </div>
</div>

<div class="card mt-2 shadow  col-2">
  <div class="card-body ">
    <h5 class="card-title">#Monthly Income </h5>
    <p class="card-text font-weight-bold h3 "  style={{ color: '#28a745' }} >{income} $</p>
  </div>
</div>
<div class="card mt-2 shadow  col-2">
  <div class="card-body ">
    <h5 class="card-title">#Monthly Profit </h5>
    <p class="card-text font-weight-bold h3 "  style={{ color: '#28a745' }} >{profit} $</p>
  </div>
</div>

   </div>

   



<button class={"btn btn-primary col-3 mt-4"} onClick={() => handleButtonClick('AV392AHNNg8TZf5IoOKg')}>
        View Product
      </button>

      <button class={"btn btn-primary mt-4 col-3"} onClick={() => addProduct('AV392AHNNg8TZf5IoOKg')}>
       Add Product
      </button>




    </div>
  );
}

export default MyComponent;