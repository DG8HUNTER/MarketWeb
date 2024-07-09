import { useParams } from "react-router-dom"
import { collection, query, where, onSnapshot , orderBy , doc , updateDoc} from "firebase/firestore";
import {useState , useEffect} from "react"
import { db  } from '../firebase.js';

import { Table ,Image,Co , Form, Row} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
export function  AdminDash(){

const{data}=useParams();

const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

const [totalStore , setTotalStore] = useState();
const[storesThisMonth , setStoresThisMonth]=useState()
const [authorizedStores , setAuthorizedStores]=useState()
const [unAuthorizedStores , setUnauthorizedStores]=useState();
const [stores ,setStores]=useState([])

const [ filteredStores , setFilteredStores] = useState([])

const [ storeAuthorizationFilter  , setStoreAuthorizationFilter]=useState("authorized")

const [search , setSearch]=useState()
const [toSearch , setToSearch]=useState()

const [isUpdatingToAuthorize  , setIsUpdatingToAuthorize]=useState(false)
const [isUpdatingToUnauthorize  , setIsUpdatingToUnauthorize]=useState(false)
const [ clickedRow , setClickedRow]=useState()

const q = query(collection(db, "Stores"),orderBy("createdAt", "desc"));
const unsubscribe = onSnapshot(q, (querySnapshot) => {
  let storesNum=0;
  let thisMonth=0;
  let authorized=0;
  let unAuthorized=0;
  let allStores=[]
  

  querySnapshot.forEach((doc) => {
    allStores.push(doc.data())
      storesNum+=1
      if(doc.data().createdAt.toDate() >= startOfMonth &&  doc.data().createdAt.toDate()<=endOfMonth ){
thisMonth+=1;
      }


      if(doc.data().isAuthorized){
        authorized+=1;
      }else {
        unAuthorized+=1;
      }




  });
  setTotalStore(storesNum)
  setStoresThisMonth(thisMonth)
  setAuthorizedStores(authorized);
  setUnauthorizedStores(unAuthorized)
  setStores(allStores)
});


const  updateAuthorization = async (storeId , status)=>{

    setClickedRow(storeId)

    if(status==true){
        setIsUpdatingToUnauthorize(true)
    }else {
        setIsUpdatingToAuthorize(true)
    }

    const Ref = doc(db, "Stores", storeId);

// Set the "capital" field of the city 'DC'
await updateDoc(Ref, {
  isAuthorized: !status
});

setClickedRow(null)


}


useEffect(() => {

    if(toSearch==null){
        if(storeAuthorizationFilter=="authorized"){
            setFilteredStores(stores.filter((store) => store.isAuthorized==true));
          }else {
              setFilteredStores(stores.filter((store) => store.isAuthorized==false));
          }
    }else {

        if(storeAuthorizationFilter=="authorized"){
            setFilteredStores(stores.filter((store) => store.isAuthorized==true && (store.name == toSearch || store.storeId==toSearch)))
          }else {
              setFilteredStores(stores.filter((store) => store.isAuthorized==false && (store.name == toSearch || store.storeId==toSearch)));
          }



    }
        
   
    }, [stores , storeAuthorizationFilter , toSearch])

    return(
        <div class="p-3">
          <h3> Admin Dashboard</h3>

          
    <div class={"col-12 d-flex flex-column  flex-md-row justify-content-md-around align-content-center mb-lg-3"}>
   <div class="card mt-2 shadow  col-12 col-md-2">
  <div class="card-body ">
    <h5 class="card-title">#Total Stores</h5>
    <p class="card-text font-weight-bold h3" style={{ color: '#007bff' }}>{totalStore}</p>
  </div>
</div>

<div class="card mt-2 shadow  col-12 col-md-2">
  <div class="card-body ">
    <h5 class="card-title">#Stores This Month</h5>
    <p class="card-text font-weight-bold h3" style={{ color: '#007bff' }}>{storesThisMonth}</p>
  </div>
</div>

<div class="card mt-2 shadow  col-12 col-md-2">
  <div class="card-body ">
    <h5 class="card-title">#Authorized Stores</h5>
    <p class="card-text font-weight-bold h3" style={{ color: '#007bff' }}>{authorizedStores}</p>
  </div>
</div>
<div class="card mt-2 shadow  col-12 col-md-2">
  <div class="card-body ">
    <h5 class="card-title">#Unauthorized Stores</h5>
    <p class="card-text font-weight-bold h3" style={{ color: '#007bff' }}>{unAuthorizedStores}</p>
  </div>
</div>

          </div>

          <div class="d-flex justify-content-between align-items-center  my-4 ">
          <h4>Stores</h4> 





<div class="d-flex justify-content-md-end mt-2 mt-md-0 align-items-center col-7 col-md-6 ">
    <div class=" col-9 col-md-9 col-lg-6">
    <label for="searchOrder" class="visually-hidden">Search</label>
    <input type="text" class="form-control shadow" id="searchOrder" placeholder="Search by Name or ID" value ={search} onChange={(event) => {
  const newValue = event.target.value === '' ? null : event.target.value; // Check for empty string
  setSearch(newValue)
  if(newValue==null){
    setToSearch(null)
  }

}}/>
  </div>
  <div >
    <button type="submit" class="btn btn-primary mx-2 "   onClick={()=> setToSearch(search)}>Search     </button>
  </div>

  <div >
              <Form.Select
                aria-label="Product Selection"
                id="StoreAuthorization"
                value={storeAuthorizationFilter}
                onChange={(event) => setStoreAuthorizationFilter(event.target.value)}
              >
                
                  <option key={1} value={"authorized"} defaultChecked>
                    Authorized
                  </option>

                  <option key={2} value={"unauthorized"}>
                    Unauthorized
                  </option>
              
              </Form.Select>
            </div>


    </div>

    



     
          </div>

         


          {filteredStores.length > 0 ?




<Table striped bordered hover responsive  className={"shadow-sm "} draggable   >

<thead>
  <tr className={"text-center "}>
    <th>ID</th>
    <th>Name</th>
    <th>Location</th>
    <th>Number</th>
    <th>Created At</th>
    <th>Update Authorization</th>
  </tr>
</thead>
<tbody >
 {filteredStores.map((store) => (
 <tr key={store.storeId} className={"text-center flex align-middle"} >
 <td>{store.storeId}</td>
 <td>{store.name}</td>
 <td>{store.location}</td>
 <td>{store.phoneNumber}</td>
 <td>{new Date(store.createdAt.seconds * 1000).toLocaleString('en-LB', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
})}</td>

<td>
{store.isAuthorized==true ?  <button class="btn btn-danger" onClick={()=>updateAuthorization(store.storeId , store.isAuthorized)}>
    
{ clickedRow===store.storeId ?<div class="d-flex justify-content-center align-items-center" >
                 

                  Unauthorizing
                  <span className="spinner-border spinner-border-sm mx-2" role="status" aria-hidden="true">
      <span className="visually-hidden">Loading...</span>
    </span>
                </div>: "Unauthorize"}
    
    
    
    </button> : <button class="btn btn-success"  onClick={()=>updateAuthorization(store.storeId , store.isAuthorized)}>
    { clickedRow===store.storeId ?<div class="d-flex justify-content-center align-items-center" >
        Authorizing
                  <span className="spinner-border spinner-border-sm mx-2" role="status" aria-hidden="true">
      <span className="visually-hidden">Loading...</span>
    </span>
                </div>: "Authorize"}
        
        </button> }

</td>

 </tr>
 ))}
 </tbody>
</Table>
    :

    <p>No stores yet</p>

          
          }
         


        
        </div>
    
    
    
    )

}