

import React, { useState , useEffect } from 'react'
import { useParams , useNavigate } from 'react-router-dom'

import 'firebase/firestore';
import { getDoc , query,collection, where, getDocs ,doc ,updateDoc , addDoc , onSnapshot, orderBy ,deleteDoc,FieldValue , increment} from 'firebase/firestore'; // Assuming Firebase v9
import { db  } from '../firebase.js';

import { Table ,Image,Col , label , input , textarea , Toast , ToastContainer ,Spinner , Button ,Form} from 'react-bootstrap';
import { Circles } from 'react-loader-spinner';
import { getAuth } from 'firebase/auth'; // Import for clarity


import 'bootstrap/dist/css/bootstrap.min.css';



export default function OrderInfo() {

  
const auth = getAuth();  // Get the Firebase Auth instance



    const {data:orderId}=useParams();
    const [order ,setOrder]=useState({});
    const [orderItems , setOrderItems]=useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [search , setSearch]=useState("All")
    const [isUpdating , setIsUpdating]=useState()
    const [statusToUpdate , setStatusToUpdate]=useState()
    const [showToast , setShowToast]= useState(false);
    const[isLoading , setIsLoading]=useState(true)
    const [productsInOrders , setProductsInOrders]=useState([])
    const[productName , setProductName]=useState()
    const[quantity , setQuantity]=useState();
    const[showModify ,setShowModify]=useState(false);
    const[orderItemData,setOrderItemData]=useState({});
    const[isDeleting,setIsDeleting]=useState(false);
    const[showDeleteToast , setShowDeleteToast]=useState(false)
    const [productInfo  , setProductInfo]=useState({})
    const [currentUserID , setCurrentUserID]=useState("")

    

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          setCurrentUserID(user.uid);
          console.log('User logged in:', currentUserID);
        } else {
          setCurrentUserID(null); // Set to null when user logs out
          console.log('User logged out');
        }
      });
  
      // Important: Unregister the listener on component unmount to prevent memory leaks
      return () => unsubscribe();
    }, []); // Empty dependency array: runs only once on component mount
  
    // ... (Rest of your component code, using currentUserID if needed)
  

// function x = await getCurrentUser();




    const[isUpdatingOI,setIsUpdatingOI]=useState(false);
  

const [products , setProducts]=useState([]);
const [customerData , setCustomerData]=useState({});

const navigate = useNavigate();






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

if(status=="cancelled"){
  orderItems.forEach(async (item) => {
  const productData = products.find((product)=> product.productId === item.productId)
  const inventory = parseInt(productData.inventory)
  const quantity  = parseInt(item.quantity)
  const itemRef = doc(db,"Products",item.productId)

  
  await updateDoc(itemRef,{
    inventory : inventory + quantity
  });


}
  )

}

if(order.status=="cancelled"  && status!="cancelled"){

  orderItems.forEach(async (item) => {
    const productData = products.find((product)=> product.productId === item.productId)
    const inventory = parseInt(productData.inventory)
    const quantity  = parseInt(item.quantity)
    const itemRef = doc(db,"Products",item.productId)
  
    
    await updateDoc(itemRef,{
      inventory : inventory - quantity
    });
  
  
  }
    )
  



}

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

  



if(currentUserID!=""){
    const q1 = query(collection(db, "Products"), where("storeId", "==", currentUserID));
    const unsubscribe1 = onSnapshot(q1, (querySnapshot) => {
      const products = [];
      querySnapshot.forEach((doc) => {
          products.push({...doc.data() });
      });
      setProducts(products);
     
    
    });
  

  }
  


    const fetchOrderItemData = async (orderItemId)=>{
      const docRef = doc(db, "OrderItems", orderItemId);
     const docSnap = await getDoc(docRef);
     setOrderItemData({...docSnap.data()})

if (docSnap.exists()) {
  const foundProduct = products.find(product => product.productId === docSnap.data().productId);
setProductInfo({...foundProduct})
  setProductName(foundProduct.name)
  setQuantity(docSnap.data().quantity)
  setShowModify(true)
} else {
  // docSnap.data() will be undefined in this case
  console.log("No such document!");
}

    }

    


    

    const q = query(collection(db, "OrderItems"), where("orderId", "==", orderId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
    
      const ordrs = [];
      const productsIn=[];
      querySnapshot.forEach((doc) => {
        if(doc!=null){
       const product=  products.find((product)=> product.productId===doc.data().productId)
       if (product) {
        // Access product properties safely
        ordrs.push({ ...doc.data(), productName: product.name });
        productsIn.push(product.name);
      }
        
        }
          
        
      });
      setOrderItems(ordrs);
      setProductsInOrders(productsIn);
      setIsLoading(false)
    
    });



const DeleteOrderItem = async ()=>{
      setIsDeleting(true)

 const orderRef = doc(db, "Orders", orderId);
const orderData = await getDoc(orderRef)
const productRef = doc(db,"Products",orderItemData.productId)
const productData = await getDoc(productRef)
const totalProfit =Math.round((orderData.data().totalProfit-orderItemData.totalProfit)*100)/100;
const totalPrice = Math.round((orderData.data().totalPrice -orderItemData.totalPrice)*100)/100;
const totalItems =orderData.data().totalItems-1




await updateDoc(orderRef, {
  totalPrice:totalPrice,
  totalProfit:totalProfit,
  totalItems:totalItems,
  
});

await updateDoc(productRef, {
  inventory : productData.data().inventory + orderItemData.quantity
  
});



await deleteDoc(doc(db, "OrderItems", orderItemData.orderItemId));

setIsDeleting(false)
setShowModify(false)
setShowDeleteToast(true)

setTimeout(() => {
  setShowDeleteToast(false);
  
}, 2000);



    }

   


const updateOrderItem = async ()=>{
  setIsUpdatingOI(true)
  const orderItemRef=doc(db,"OrderItems",orderItemData.orderItemId)
  const orderRef = doc(db,"Orders" , orderId)
  const prodRef = doc(db,"Products",orderItemData.productId)
  const findProduct = products.find((product)=> product.name === productName)
  const prodInfo = {...findProduct}

  console.log("product" , prodInfo)
  let totalPrice;
  let totalProfit;
  let diffPrice;
  let diffProfit;
  let diffQuantity=0;


  if(productInfo.name != productName && orderItemData.quantity !==quantity){
 totalPrice = parseFloat((quantity*prodInfo.price ).toFixed(2))
 if(prodInfo.discount>0){
 
  totalPrice-=(totalPrice*(prodInfo.discount/100))
 
 }
     totalProfit =parseFloat((quantity*prodInfo.profitPerItem).toFixed(2))
     diffPrice = totalPrice - orderItemData.totalPrice
     diffProfit = totalProfit - orderItemData.totalProfit
     diffQuantity=quantity-orderItemData.quantity

 





  }else 
  if(productInfo.name != productName && orderItemData.quantity===quantity){
     totalPrice = parseFloat((orderItemData.quantity*prodInfo.price).toFixed(2))
     if(prodInfo.discount>0){
      totalPrice-=(totalPrice*(prodInfo.discount))
     }
     totalProfit =parseFloat((orderItemData.quantity*prodInfo.profitPerItem).toFixed(2))
     diffPrice = totalPrice - orderItemData.totalPrice
     diffProfit = totalProfit - orderItemData.totalProfit

    

    


    
  }
  else{

     totalProfit = parseFloat((quantity * prodInfo.profitPerItem).toFixed(2))
     totalPrice = parseFloat((quantity * productInfo.price).toFixed(2))
     if(prodInfo.discount>0){
 
      totalPrice-=(totalPrice*(prodInfo.discount/100))
     
     }
     diffPrice = totalPrice - orderItemData.totalPrice
     diffProfit = totalProfit - orderItemData.totalProfit
     diffQuantity=quantity-orderItemData.quantity

     console.log("Diff" , diffQuantity)

     console.log("quantity" , quantity)

     console.log("prev quantity" ,orderItemData.quantity )
     
     console.log("inventory" , prodInfo.inventory)


  }

  await updateDoc(orderItemRef, {
    productId:prodInfo.productId,
    quantity:quantity,
    totalPrice: Math.round(totalPrice * 100) / 100,
    totalProfit: Math.round(totalProfit * 100) / 100
  });

  await updateDoc(orderRef , {
    totalPrice:Math.round((order.totalPrice+diffPrice)*100)/100,
    totalProfit:Math.round((order.totalProfit+diffProfit)*100)/100,

  })

  await updateDoc(prodRef , {
    inventory : (prodInfo.inventory - diffQuantity) 
  })

  console.log(order.totalProfit);
  console.log(diffPrice);

  const newOrderItemData = await getDoc(orderItemRef)
  const newOrderData = await getDoc(orderRef)
  setOrderItemData({... newOrderItemData.data(), productName:findProduct.name})
  setOrder({...newOrderData.data()})
  setQuantity(orderItemData.quantity)
  setProductInfo({...prodInfo})
  setIsUpdatingOI(false)
  setShowModify(false)
  setShowToast(true)
  
  
  setTimeout(() => {
    setShowToast(false);
    
  }, 2000);






}



    


    /*useEffect(() => {
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
          setIsLoading(false)
      });
  
      return () => {
          console.log("Cleaning up snapshot listener");
          unsubscribe();
      };
  }, []);*/














    //Not releated

      useEffect(() => {
        
        if(search!="All"){
          setFilteredOrders(orderItems.filter((order) => order.productName===search));
        }else {
            setFilteredOrders(orderItems)
        }   
        }, [orderItems, search ])







  return (
    <div class={"p-3"}>







<Toast show={showModify} onClose={()=>setShowModify(false)} class="bg-white p-4 shadow" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000 }}>
        <Toast.Header closeButton={true}>
          <strong className="me-auto">Edit Data</strong>
        </Toast.Header>
        <Toast.Body>
          <Form onSubmit={(e) => e.preventDefault()}>  {/* Wrap content in a Form for potential form validation */}
            <div className="mb-3">
              <Form.Label htmlFor="Product">Product</Form.Label>
              <Form.Select
                aria-label="Product Selection"
                id="Product"
                value={productName}
                onChange={(event) => setProductName(event.target.value)}
              >
                
                {products.map((prod) => (
                  <option key={prod.productId} value={prod.name}>
                    {prod.name}
                  </option>
                ))}
              </Form.Select>
            </div>
            <div className="mb-3">
              <Form.Label htmlFor="quantity">Quantity</Form.Label>
              <Form.Control
                type="number"
                id="quantity"
                placeholder="Enter Quantity"
                value={quantity}
                min="1"
                max={productInfo.inventory}
                onChange={(event) => setQuantity(parseInt(event.target.value))}
                // Add validation and error handling as needed
              />
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <Button variant="primary" size="sm"  onClick={()=>updateOrderItem()} disabled={productInfo.name === productName && orderItemData.quantity === parseInt(quantity)}>
              {isUpdatingOI===true ? <div class="d-flex justify-content-between align-items-center" >
                  Updating
                  <span className="spinner-border spinner-border-sm mx-1" role="status" aria-hidden="true">
      <span className="visually-hidden">Loading...</span>
    </span>
                </div> : "Update"}
              </Button>
              <Button variant="danger" size="sm" onClick={()=>DeleteOrderItem()}  disabled={order.totalItems==1}>
                {isDeleting===true ? <div class="d-flex justify-content-between align-items-center" >
                  Deleting
                  <span className="spinner-border spinner-border-sm mx-1" role="status" aria-hidden="true">
      <span className="visually-hidden">Loading...</span>
    </span>
                </div> : "Delete"}
              </Button>
            </div>
          </Form>
        </Toast.Body>
      </Toast>



 <ToastContainer position="top-center">
<Toast show={showDeleteToast} autohide   class="shadow bg-white"> {/* Added classes */}
    <Toast.Header class="bg-white" closeButton={false} >
      <strong className="me-auto">Notification</strong>
    </Toast.Header>
    <Toast.Body>Order Item  deleted  successfully</Toast.Body>
  </Toast>
    </ToastContainer>
 
      
      <ToastContainer position="top-center">
<Toast show={showToast} autohide   class="shadow bg-white"> {/* Added classes */}
    <Toast.Header class="bg-white" closeButton={false} >
      <strong className="me-auto">Notification</strong>
    </Toast.Header>
    <Toast.Body>Order updated successfully</Toast.Body>
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
        {productsInOrders.map((prod) => (
          <option key={prod.productId || prod} value={prod}>
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
  onClick={async () => {
    setIsUpdating(true);
    setStatusToUpdate("pending");
   await updateStatus("pending");
    
  }}
>
  Pending
  {(isUpdating === true && statusToUpdate === "pending") && (
    <span className="spinner-border spinner-border-sm mx-1" role="status" aria-hidden="true">
      <span className="visually-hidden">Loading...</span>
    </span>
  )}
</button>
    <button type="button" className={`btn btn-info me-2 rounded ${order.status==="processing"&& "border-black border-2"} text-white d-flex flex-row justify-content-between align-items-center`}  onClick={async () => {
    setIsUpdating(true);
    setStatusToUpdate("processing");
   await updateStatus("processing");
    
  }}>Processing   {(isUpdating === true && statusToUpdate === "processing") && (
    <span className="spinner-border spinner-border-sm mx-1" role="status" aria-hidden="true">
      <span className="visually-hidden">Loading...</span>
    </span>
  )}</button>
    <button type="button" className={`btn btn-primary me-2 rounded  ${order.status==="shipped"&& "border-black border-2"} d-flex flex-row justify-content-between align-items-center`}   onClick={async () => {
    setIsUpdating(true);
    setStatusToUpdate("shipped");
   await updateStatus("shipped");
    
  }}>Shipped {(isUpdating === true && statusToUpdate === "shipped") && (
    <span className="spinner-border spinner-border-sm mx-1" role="status" aria-hidden="true">
      <span className="visually-hidden">Loading...</span>
    </span>
  )}</button>
    <button type="button" className={`btn btn-success me-2 rounded ${order.status==="delivered"&& "border-black border-2"} d-flex flex-row justify-content-between align-items-center`}  onClick={async () => {
    setIsUpdating(true);
    setStatusToUpdate("delivered");
    await updateStatus("delivered");
    
  }}>Delivered {(isUpdating === true && statusToUpdate === "delivered") && (
    <span className="spinner-border spinner-border-sm mx-1" role="status" aria-hidden="true">
      <span className="visually-hidden">Loading...</span>
    </span>
  )}</button>
    <button type="button" className={`btn btn-danger me-2 rounded  ${order.status==="cancelled"&& "border-black border-2"}  d-flex flex-row justify-content-between align-items-center`} 
      onClick={async () => {
   
    setIsUpdating(true);
    setStatusToUpdate("cancelled");
   await updateStatus("cancelled");
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
          <tr key={order.orderItemId}  onClick={()=>fetchOrderItemData(order.orderItemId)}  className={"text-center flex align-middle"} >
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
        (
          isLoading==true ? (
            <p>Loading order info...</p>
          ) : (
            <p>Order not found.</p>
          )
        )
      )}
    </div>
  );
   
}


