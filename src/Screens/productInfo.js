import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDoc , query,collection, where, getDocs ,doc } from 'firebase/firestore'; // Assuming Firebase v9
import { db } from '../firebase.js';
import { Table ,Image,Col , label , input , textarea} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default  function ProductInfo() {
  const { data: productId } = useParams(); // Extract product ID from route parameter
  const [productInfo, setProductInfo] = useState(null);
   const [selectedImage, setSelectedImage] = useState(null);

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];

    if (!droppedFile.type.match('image/.*')) {
      alert('Please select an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
    };
    reader.readAsDataURL(droppedFile);
  };

  const handleFileChange = (event) => {
    const droppedFile = event.target.files[0];

    if (!droppedFile.type.match('image/.*')) {
      alert('Please select an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
      setProductInfo({...productInfo , image:e.target.result})
      
    };
    reader.readAsDataURL(droppedFile);
  };

   // State for product data
  console.log(productId)


  // Fetch product data from Firebase on component mount and whenever productId changes
  useEffect(() => {
    const getProductInfo = async () => {
      if (!productId) return; // Handle missing product ID gracefully

      try {
        const docRef = doc(db, "Products", productId);
          const docSnap = await getDoc(docRef);

       if(docSnap!=null){
        setProductInfo({id:docSnap.id , ...docSnap.data()});   
         
       
    
    }
       
        
      
      } catch (error) {
        console.error('Error fetching product info:', error); // Handle errors
      }
    };
    
    getProductInfo();
    
  
  }, []); // Dependency array ensures effect runs on product ID change

  // Display product info or loading/error message
  return (
    
    <div className={"p-4 vh-100 "}>
        <h2 class={"mb-4"}>Product Info </h2>
      {productInfo!=null ? (
<div class=" col-12  d-md-flex justify-content-md-between  align-items-md-center  ">
<form class="row g-3 col-md-6 px-2 py-4 shadow-lg  bg-body rounded h-auto">
  <div class="col-md-6">
    <label for="productName" class="form-label ">Name</label>
    <input type="text" class="form-control " id="productName" value={productInfo.name} placeholder='Product Name' onChange={(prev)=>setProductInfo({...prev , name:this})}/>
  </div>


  <div class="col-md-6">
    <label for="price" class="form-label">Price $</label>
  <div class="input-group mb-3">
  <span class="input-group-text">$</span>
  <input type="number" class="form-control" id="price"  min={0} value={productInfo.price} placeholder="Price"  onChange={(prev)=>setProductInfo({...prev , price:this})} />
</div>
  </div>
  <div class="col-md-6">
    <label for="Discount" class="form-label">Discount %</label>
    <input type="number" min={0} max={100} class="form-control" id="Discount" placeholder="Discount" value={productInfo.discount} onChange={(prev)=>setProductInfo({...prev , discount:this})} / >
  </div>
  <div class="col-md-6">
    <label for="Category" class="form-label">Category</label>
    <input type="text" class="form-control" id="Category" placeholder="Category" value={productInfo.category} onChange={(prev)=>setProductInfo({...prev , category:this})} />
  </div>
  <div class="col-md-12 ">
    <label for="Inventroy" class="form-label">Inventory</label>
    <input type="text"   class="form-control  " id="Inventory" value={productInfo.inventory} onChange={(prev)=>setProductInfo({...prev , inventory:this})} />
  </div>
  <div class="col-md-12 ">
    <label for="Description" class="form-label">Description</label>
    <textarea type="text" rows="3"  class="form-control  " id="Description" value={productInfo.description} onChange={(prev)=>setProductInfo({...prev , description:this})} />
  </div>
  
  <div class="col-12 mt-5">
    <button type="submit" class="btn btn-primary w-100">Update</button>
  </div>
</form>

<div class={"col-md-6 d-flex flex-column  align-items-center mt-4 mt-md-0"}>
<Col xs={6} sm={6} md={8} lg={7} xl={6} class={"align-self-center"}> {/* Responsive breakpoints */}
      <Image src={productInfo.image} className="rounded" alt="Product Image" />

     
    </Col>

    <div className="image-uploader mt-4 col-3" onDragOver={handleDragOver} onDrop={handleDrop}>
      <input type="file" accept="image/*" onChange={handleFileChange}  />
      
    </div>

  

</div>

</div>       




      ) : (
        productInfo === null ? (
          <p>Loading product info...</p>
        ) : (
          <p>Product not found.</p>
        )
      )}
    </div>
  );
}