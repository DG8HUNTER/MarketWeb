import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db  } from '../firebase.js';
import { getDoc , query,collection, where, getDocs ,doc ,updateDoc , addDoc , onSnapshot} from 'firebase/firestore';
import { Table ,Image,Col , label , input , textarea , Toast , ToastContainer , button , Badge ,Spinner} from 'react-bootstrap';
import { Circles } from 'react-loader-spinner';
import 'bootstrap/dist/css/bootstrap.min.css';


function MyComponent() {


  const navigate = useNavigate();

  const [ordersNum , setOrdersNum] = useState(0)
  const [currentOrders , setCurrentOrdes]=useState(0)
  const [income , setIncome] = useState(0)
  const [profit , setProfit] = useState(0)
  const[previousIncome , setPreviousIncome]=useState(0)
  const[previousProfit , setPreviousProfit]=useState(0)
  const[incomeGainPercentage , setIncomeGainPercentage]=useState(0)
  const[profitGainPercentage , setProfitGainPercentage]=useState(0)




  const handleButtonClick = (data) => {
    navigate(`/products/${data}`); // Include data as a parameter
  };

  const addProduct = (data) => {
    navigate(`/addProduct/${data}`); // Include data as a parameter
  };
  const orders = (data) => {
    navigate(`/orders/${data}`); // Include data as a parameter
  };

  const storeId = "AV392AHNNg8TZf5IoOKg"

  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);


 

// Get the month (0-indexed) and year of the previous month
const prevMonth = today.getMonth() - 1;
const prevYear = (prevMonth === -1) ? today.getFullYear() - 1 : today.getFullYear();

// Create the start date of the previous month (1st day)
const startOfPrevMonth = new Date(prevYear, prevMonth, 1);

// Create a new Date object for potentially the last day of the previous month
const endOfPrevMonth = new Date(prevYear, prevMonth + 1, 0);









  const q = query(collection(db, "Orders"), where("storeId", "==", storeId));
const unsubscribe = onSnapshot(q, (querySnapshot) => {
  const ord = [];
  const current =[]
  let monthlyIncome = 0;
  let monthlyProfit =0;
  let prevMonthlyIncome = 0;
  let prevMonthlyProfit =0;

  querySnapshot.forEach((doc) => {
      ord.push(doc.id);
      console.log(doc.data().createdAt.toDate())

      if(doc.data().createdAt.toDate() >= startOfMonth &&  doc.data().createdAt.toDate()<=endOfMonth ){
        current.push(doc.id)
        

        //we have to see if the order is not cancelled or (pending 
        if(doc.data().status=="delivered"){
          monthlyIncome+=doc.data().totalPrice;
          monthlyProfit+=doc.data().totalProfit;
        }
       

       
      }else if (doc.data().createdAt.toDate() >= startOfPrevMonth &&  doc.data().createdAt.toDate()<=endOfPrevMonth) {

        if(doc.data().status=="delivered"){
          prevMonthlyIncome+=doc.data().totalPrice;
          prevMonthlyProfit+=doc.data().totalProfit;
        }
       

      }
      else {

      }
  });

  setOrdersNum(ord.length)
  setCurrentOrdes(current.length)
  setIncome(monthlyIncome)
  setProfit(monthlyProfit)
  setPreviousIncome(prevMonthlyIncome)
  setPreviousProfit(prevMonthlyProfit)
  setIncomeGainPercentage(parseFloat(((monthlyIncome-prevMonthlyIncome)/prevMonthlyIncome)*100).toFixed(2))
  setProfitGainPercentage(parseFloat(((monthlyProfit-prevMonthlyProfit)/prevMonthlyProfit)*100).toFixed(2))
}
);


  
  



  return (
    <div class={"d-flex flex-column col-12 p-4"}>


   

   <div class={"col-12 d-flex flex-row justify-content-around align-content-center"}>
   <div class="card mt-2 shadow  col-2">
  <div class="card-body ">
    <h5 class="card-title">#Total Orders</h5>
    <p class="card-text font-weight-bold h3" style={{ color: '#007bff' }}>{ordersNum}</p>
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

   <div class="col-12 d-flex flex-row justify-content-around align-content-center">
   <div class="card mt-2 shadow col-2">
  <div class="card-body">
    <h5 class="card-title">% Income Difference (Prev)</h5>
    <p class="card-text font-weight-bold h3" style={{ color: incomeGainPercentage > 0 ? '#28a745' : 'red' }}>
      {incomeGainPercentage} %
    </p>
  </div>
</div>

<div class="card mt-2 shadow col-2">
  <div class="card-body">
    <h5 class="card-title">% Income Difference (Prev)</h5>
    <p class="card-text font-weight-bold h3" style={{ color: profitGainPercentage > 0 ? '#28a745' : 'red' }}>
      {profitGainPercentage} %
    </p>
  </div>
</div>
   </div>



   



<button class={"btn btn-primary col-3 mt-4"} onClick={() => handleButtonClick('AV392AHNNg8TZf5IoOKg')}>
        View Product
      </button>

      <button class={"btn btn-primary mt-4 col-3"} onClick={() => addProduct('AV392AHNNg8TZf5IoOKg')}>
       Add Product
      </button>

      <button class={"btn btn-primary mt-4 col-3"} onClick={() => orders('AV392AHNNg8TZf5IoOKg')}>
       Orders
      </button>






    </div>
  );
}

export default MyComponent;