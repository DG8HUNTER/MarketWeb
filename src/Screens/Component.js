import React from 'react';
import { useState ,useEffect,useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db  } from '../firebase.js';
import { getDoc , query,collection, where, getDocs ,doc ,updateDoc , addDoc , onSnapshot} from 'firebase/firestore';
import { Table ,Image,Col , label , input , textarea , Toast , ToastContainer , button , Badge ,Spinner} from 'react-bootstrap';
import { Circles } from 'react-loader-spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import image from "../Images/noStoreProfile.png"
import moment from 'moment';



function MyComponent() {


  const navigate = useNavigate();
  

  const {data:storeId}=useParams()
  const [ordersNum , setOrdersNum] = useState(0)
  const [currentOrders , setCurrentOrdes]=useState(0)
  const [income , setIncome] = useState(0)
  const [profit , setProfit] = useState(0)
  const[previousIncome , setPreviousIncome]=useState(0)
  const[previousProfit , setPreviousProfit]=useState(0)
  const[incomeGainPercentage , setIncomeGainPercentage]=useState(0)
  const[profitGainPercentage , setProfitGainPercentage]=useState(0)
  const [store , setStore]=useState({})
  const [pendingOrders , setPendingOrders]=useState(0)
  const [processingOrders , setProcessingOrders]=useState(0)
  const [shipedOrders , setShippedOrders]=useState(0)
  const [deliveredOrders , setDeliveredOrders]=useState(0)
  const [canceledOrders , setCanceledOrders]=useState(0)
  const [currentTime, setCurrentTime] = useState(new Date()); 
  const loggedTime = useRef(currentTime);

  const storeRef = doc(db,"Stores",storeId);
  let openingTime;
  let closingTime;


  const convertTime = (timeString) => {
    try {
      const parsedTime = moment(timeString, 'h:mm a', true); // Strict mode for validation
      if (parsedTime.isValid()) {
       
       
        return (parsedTime.format('HH:mm '))
      } else {
        throw new Error('Invalid time format. Please use "h:mm a".');
      }
    } catch (error) {
   // Display the error message
    }
  };

    const getDayName = async () => { // Use async function for clarity
      const today = new Date();
      const day = today.getDay(); // Get the day of the week (0-6)

      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const currentDay = daysOfWeek[day]; // Get the day name
      return (currentDay)
  
    };







  const styles = {
     
    borderRadius: '50%', // Set to 50% for a circle
  
  };


  const handleButtonClick = (data) => {
    navigate(`/products/${data}`); // Include data as a parameter
  };

  const addProduct = (data) => {
    navigate(`/addProduct/${data}`); // Include data as a parameter
  };
  const orders = (data) => {
    navigate(`/orders/${data}`); // Include data as a parameter
  };


  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const firstDayOfNextMonth = new Date(today.getFullYear(), today.getMonth()+1, 1);

  console.log(`first  ${firstDayOfNextMonth}`)
 

// Get the month (0-indexed) and year of the previous month
const prevMonth = today.getMonth() - 1;
const prevYear = (prevMonth === -1) ? today.getFullYear() - 1 : today.getFullYear();

// Create the start date of the previous month (1st day)
const startOfPrevMonth = new Date(prevYear, prevMonth, 1);

// Create a new Date object for potentially the last day of the previous month
const endOfPrevMonth = new Date(prevYear, prevMonth + 1, 0);





const unsub = onSnapshot(doc(db, "Stores", storeId), (doc) => {
    if(doc.data()!=null){
      setStore({...doc.data()})
    }
});

  useEffect(() => {
    const updateCurrentTime = async () => {
    
      const date = new Date();
      setCurrentTime(date);
      loggedTime.current = date; // Update logged time after state update
      console.log('Updated Time:', loggedTime.current); // Log the updated time
  const hours = date.getHours(); // Get hours (24-hour format)
  const minutes = date.getMinutes().toString().padStart(2, '0'); // Get minutes with leading zero
  const period = hours >= 12 ? 'PM' : 'AM'; // Determine AM/PM
  const formattedTime = `${hours % 12 || 12}:${minutes} ${period}`;
const currentTime = convertTime(formattedTime)
console.log(`current    ${currentTime}`)
      const today =await  getDayName()
      console.log(`Today   ${today}`)
      const docSnap = await getDoc(storeRef);
      if(docSnap.exists){
        openingTime= convertTime(docSnap.data().OperatingField[today].OpeningTime.toString());
        closingTime=convertTime(docSnap.data().OperatingField[today].ClosingTime);
        console.log(`Opening  ${openingTime}`)
        console.log(`Closing  ${closingTime}`)
const status = docSnap.data().status;
console.log(status)

if(currentTime>=openingTime && currentTime<closingTime){
  if(status=="Closed"){
    await updateDoc(storeRef, {
      status: "Open"
    });
    console.log("Update 1 ")
  }

}else {
  if(status==="Open"){
    await updateDoc(storeRef, {
      status: "Closed"
    });

    console.log("Update 2 ")

  }


}

      }
      
    };
    

 

   
    if (store.automaticUpdateStatus) {
      updateCurrentTime();
      const intervalId = setInterval(updateCurrentTime, 1000);

      return () => {
        clearInterval(intervalId); // Clear the interval in the cleanup function
      };
    } else {
      // No need for an interval if automaticUpdateStatus is false
      return; // Early return to prevent unnecessary code execution
    }

    // Cleanup function to clear the interval on unmount
    
  }, [store.automaticUpdateStatus]);











  const q = query(collection(db, "Orders"), where("storeId", "==", storeId));
const unsubscribe = onSnapshot(q, (querySnapshot) => {
  const ord = [];
  const current =[]
  let monthlyIncome = 0;
  let monthlyProfit =0;
  let prevMonthlyIncome = 0;
  let prevMonthlyProfit =0;
  let pendOrders=0;
  let procOrders =0;
  let shipOrders=0;
  let deliOrders=0;
  let cancelOrders=0;

  querySnapshot.forEach((doc) => {
      ord.push(doc.id);
      

      if(doc.data().createdAt.toDate() >= startOfMonth &&  doc.data().createdAt.toDate()<firstDayOfNextMonth ){
        current.push(doc.id)
        

        //we have to see if the order is not cancelled or (pending 
        if(doc.data().status=="delivered"){
          monthlyIncome+=doc.data().totalPrice;
          monthlyProfit+=doc.data().totalProfit;
        }

        if(doc.data().status==="pending"){
         pendOrders+=1;
        }
        else if(doc.data().status==="processing"){
         procOrders+=1;

        }else if (doc.data().status==="shipped"){
          shipOrders+=1;
        }
        else if (doc.data().status=="delivered"){
deliOrders+=1;

        }

        else {
          cancelOrders+=1
          
        }


       

       
      }else if (doc.data().createdAt.toDate() >= startOfPrevMonth &&  doc.data().createdAt.toDate()<firstDayOfNextMonth ) {

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
  setPendingOrders(pendOrders)
  setProcessingOrders(procOrders)
  setShippedOrders(shipOrders)
  setDeliveredOrders(deliOrders)
  setCanceledOrders(cancelOrders)



  if(monthlyIncome-prevMonthlyIncome!=0){
    if(prevMonthlyIncome!=0){
      setIncomeGainPercentage(parseFloat(((monthlyIncome-prevMonthlyIncome)/prevMonthlyIncome)*100).toFixed(2))
    }
    else {

      setIncomeGainPercentage(null)

    }
   
  }
  else {
    setIncomeGainPercentage(parseFloat(0).toFixed(2))
  }

  if((monthlyProfit-prevMonthlyProfit)!=0){
    if(prevMonthlyProfit!=0){
    setProfitGainPercentage(parseFloat(((monthlyProfit-prevMonthlyProfit)/prevMonthlyProfit)*100).toFixed(2))
    }
    else{
    setProfitGainPercentage(null)

    }
   

  }
  else {
    setProfitGainPercentage(parseFloat(0).toFixed(2))
  }
  
 
}
);


  return (
    <div class={"d-flex flex-column col-12 p-3  "}>

     

      <div class ="col-12 d-flex justify-content-between align-items-center mb-3">

        <div class="d-flex align-items-center">
        <Circles  height="40"
  width="40"
  radius="4"
  color="blue"/>
        <h2 class="mx-2">{store.name}</h2>
        <Circles  height="40"
  width="40"
  radius="4"
  color="red"/>
        </div>
        
  <div class="d-flex   align-items-center">
    <div class="d-flex  justify-content-center align-items-center mx-4">

    <div class=" mx-1 shadow" style={{ width: '15px', height: '15px',borderRadius: '50%', backgroundColor: store.status=="Open" ? 'green' : 'red',

}}>
 
</div>
<div><b>{store.status}</b></div>

    </div>
  
  <div class=" p-2 shadow  " style={styles}  onClick={()=>navigate(`/storeCredentials/${storeId}`)}>
<img src={store.image==null ? image : store.image} class="rounded-circle  " alt="..."  style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}  />
</div>


  </div>

      </div>


   

   <div class={"col-12 d-flex flex-column  flex-md-row justify-content-md-around align-content-center mb-lg-3"}>
   <div class="card mt-2 shadow  col-12 col-md-2">
  <div class="card-body ">
    <h5 class="card-title">#Total Orders</h5>
    <p class="card-text font-weight-bold h3" style={{ color: '#007bff' }}>{ordersNum}</p>
  </div>
</div>

<div class="card mt-2 shadow col-12 col-md-2">
  <div class="card-body ">
    <h5 class="card-title">#Monthly Orders </h5>
    <p class="card-text font-weight-bold h3" style={{ color: '#007bff' }}>{currentOrders}</p>
  </div>
</div>

<div class="card mt-2 shadow  col-12 col-md-2">
  <div class="card-body ">
    <h5 class="card-title">#Monthly Income </h5>
    <p class="card-text font-weight-bold h3 "  style={{ color: '#28a745' }} >{income} $</p>
  </div>
</div>
<div class="card mt-2 shadow  col-12 col-md-2">
  <div class="card-body ">
    <h5 class="card-title">#Monthly Profit </h5>
    <p class="card-text font-weight-bold h3 "  style={{ color: '#28a745' }} >{profit} $</p>
  </div>
</div>

   </div>



   
   <div class={"col-12 d-flex flex-column  flex-md-row justify-content-md-around align-content-center mb-lg-3"}>
   <div class="card mt-2 shadow  col-12 col-md-2">
  <div class="card-body ">
    <h5 class="card-title">#Pending Orders</h5>
    <p class="card-text font-weight-bold h3" style={{ color: '#FFD700' }}>{pendingOrders}</p>
  </div>
</div>

<div class="card mt-2 shadow col-12 col-md-2">
  <div class="card-body ">
    <h5 class="card-title">#Processing Orders </h5>
    <p class="card-text font-weight-bold h3" style={{ color: '#FFA500' }}>{processingOrders}</p>
  </div>
</div>

<div class="card mt-2 shadow  col-12 col-md-2">
  <div class="card-body ">
    <h5 class="card-title">#Shipped Orders </h5>
    <p class="card-text font-weight-bold h3 "  style={{ color: '#007bff' }} >{shipedOrders}</p>
  </div>
</div>
<div class="card mt-2 shadow  col-12 col-md-2">
  <div class="card-body ">
    <h5 class="card-title">#Delivered Orders </h5>
    <p class="card-text font-weight-bold h3 "  style={{ color: '#28a745' }} >{deliveredOrders}</p>
  </div>
</div>

<div class="card mt-2 shadow  col-12 col-md-2">
  <div class="card-body ">
    <h5 class="card-title">#Canceled Orders </h5>
    <p class="card-text font-weight-bold h3 "  style={{ color: '#FF0000' }} >{canceledOrders}</p>
  </div>
</div>


   </div>











   <div class="col-12 d-flex flex-column flex-md-row justify-content-around align-content-center mb-lg-3">
   <div class="card mt-2 shadow col-12 col-md-3 py-2">
  <div class="card-body">
    <h5 class="card-title">% Income Difference (Prev)</h5>
    <p class="card-text font-weight-bold h3" style={{ color: incomeGainPercentage > 0 ? '#28a745' : 'red' }}>
    {
        incomeGainPercentage==null?  "No prev Data":`${incomeGainPercentage} %`
      
      }
    </p>
  </div>
</div>

<div class="card mt-2 shadow col-12 col-md-3 py-2">
  <div class="card-body">
    <h5 class="card-title">% Profit Difference (Prev)</h5>
    <p class="card-text font-weight-bold h3" style={{ color: profitGainPercentage > 0 ? '#28a745' : 'red' }}>
      {
        profitGainPercentage==null?  "No prev Data":`${profitGainPercentage} %`
      
      }
    </p>
  </div>
</div>
   </div>

<div class="d-flex flex-column flex-md-row  justify-content-md-around   align-items-md-center ">

<button class={"btn btn-primary col-md-3 mt-4 p-2"} onClick={() => handleButtonClick(storeId)}>
        View Products
      </button>

      <button class={"btn btn-primary mt-4 col-md-3 p-2"} onClick={() => addProduct(storeId)}>
       Add Product
      </button>

      <button class={"btn btn-primary mt-4 col-md-3"} onClick={() => orders(storeId)}>
      View  Orders
      </button>

</div>


    </div>
  );
}

export default MyComponent;