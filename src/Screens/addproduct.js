import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDoc , query,collection, where, getDocs ,doc ,updateDoc , addDoc} from 'firebase/firestore'; // Assuming Firebase v9
import { db  } from '../firebase.js';
import { Table ,Image,Col , label , input , textarea , Toast , ToastContainer} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getDownloadURL, ref, uploadBytes ,getStorage  , uploadBytesResumable} from 'firebase/storage';
import upload from "../Images/add_photo_alternate_outlined.svg"


export default  function AddProduct() {
  const { data:storeId } = useParams(); // Extract product ID from route parameter
  const [productInfo, setProductInfo] = useState({});
  const [adding,setAdding]=useState(false)
   const [selectedImage, setSelectedImage] = useState(null);
   const [showToast, setShowToast] = useState(false);
   console.log(productInfo)
   const handleToastClose = () => setShowToast(false); 
  const handleDragOver = (event) => {
    event.preventDefault();
  };


  const handelClick=()=>{
document.getElementById("fileInput").click();

  }

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
      setProductInfo({...productInfo,image:droppedFile})

    };
    reader.readAsDataURL(droppedFile);
  };

  const handleUpdate = async () => {
    setAdding(true);
  
    const storage = getStorage(); // Initialize Storage instance (once outside the function)

    try {
      // Create a unique filename (optional)
      const filename = `\{productId}_${productInfo.name}.png`;

      // Create a storage reference
      const storageRef = ref(storage, `product_images/${filename}`);

      // Handle file conversion if needed (if using DataURL from handleDrop)
      const imageBlob = selectedImage instanceof Blob ? selectedImage : await fetch(selectedImage).then(r => r.blob());

      // Upload the image Blob to Firebase Storage
      const uploadTask = uploadBytesResumable(storageRef, imageBlob, {
        contentType: 'image/jpeg' // Specify image type
      });

      // Monitor upload progress (optional)
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload progress:', progress + '%');
        },
        (error) => {
          console.error('Error uploading image:', error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('Image URL:', downloadURL);

          setProductInfo({...productInfo , image:downloadURL})
          

          // Update the product document with the new image URL

          const docRef = await addDoc(collection(db, "Products"), {
            "discount": parseInt(productInfo.discount),
            "image": downloadURL,
            "name": productInfo.name,
            "inventory": parseInt(productInfo.inventory),
            "description": productInfo.description,
            "category": productInfo.category,
            "price": parseFloat(productInfo.price),
            "profitPerItem":parseFloat(productInfo.profitPerItem),
            "storeId":storeId
          });

          if(docRef!=null){
            await updateDoc(doc(db, "Products", docRef.id), {
                productId: docRef.id  // Use the generated document ID as the productID
              });
              setAdding(false)
              setShowToast(true)
              

              setTimeout(() => {
                setShowToast(false);
                window.location.assign(window.location.href);
              
              }, 1000);
            
  
          }

    

          console.log('Product Added successfully!');
        }
      );
    } catch (error) {
      console.error('Error adding product:', error);
      // Display a user-friendly error message here if needed
    } finally {
      // Reset upload state (optional)
       // Clear selected image after upload
      
    }
  }


  // Fetch product data from Firebase on component mount and whenever productId changes


  // Display product info or loading/error message
  return (
    
    <div class={" vh-100  p-4"}>
        <h2 class={"mb-5"}>Add Product</h2>
      
<div class=" col-12  d-md-flex justify-content-md-between  align-items-md-center  ">
<form class="row g-3 col-md-6 px-2 py-4 shadow-lg  bg-body rounded h-auto">
  <div class="col-md-6">
    <label htmlFor="productName" class="form-label ">Name</label>
    <input type="text" class="form-control " id="productName" value={productInfo.name} placeholder='Product Name' onChange={(event) => {
  const newValue = event.target.value === '' ? null : event.target.value; // Check for empty string
  setProductInfo({ ...productInfo, name: newValue });
}}/>
  </div>
  <div class="col-md-6">
    <label htmlFor="Category" class="form-label">Category</label>
    <input type="text" class="form-control" id="Category" placeholder="Category" value={productInfo.category}  onChange={(event) => {
  const newValue = event.target.value === '' ? null : event.target.value; // Check for empty string
  setProductInfo({ ...productInfo,  category: newValue });
}} />
  </div>


  <div class="col-md-6">
    <label htmlFor="price" class="form-label">Price $</label>
  <div class="input-group mb-3">
  <span class="input-group-text">$</span>
  <input type="text" class="form-control" id="price"  min={0} value={productInfo.price} placeholder="Price"  onChange={(event) => {
  const newValue = event.target.value === '' ? null : event.target.value; // Check for empty string
  setProductInfo({ ...productInfo, price: newValue });
}} />
</div>
  </div>

  <div class="col-md-6">
    <label htmlFor="ppi" class="form-label">Profit Per Item $</label>
  <div class="input-group mb-3">
  <span class="input-group-text">$</span>
  <input type="text" class="form-control" id="ppi"  min={0} value={productInfo.profitPerItem} placeholder="Profit Per Item"  onChange={(event) => {
  const newValue = event.target.value === '' ? null : event.target.value; // Check for empty string
  setProductInfo({ ...productInfo, profitPerItem: newValue });
}} />
</div>
  </div>

  <div class="col-md-6 ">
    <label htmlFor="Inventroy" class="form-label">Inventory</label>
    <input type="text"   class="form-control  " id="Inventory" value={productInfo.inventory} onChange={(event) => {
  const newValue = event.target.value === '' ? null : event.target.value; // Check for empty string
  setProductInfo({ ...productInfo, inventory: newValue });
}} />
  </div>

  <div class="col-md-6">
    <label htmlFor="Discount" class="form-label">Discount %</label>
    <input type="number" min={0} max={100} class="form-control" id="Discount" placeholder="Discount" value={productInfo.discount}  onChange={(event) => {
  const newValue = event.target.value === '' ? null : event.target.value; // Check for empty string
  setProductInfo({ ...productInfo, discount: newValue });
}} / >
  </div>


  <div class="col-md-12 ">
    <label htmlFor="Description" class="form-label">Description</label>
    <textarea type="text" rows="3"  class="form-control  " id="Description" value={productInfo.description}  onChange={(event) => {
  const newValue = event.target.value === '' ? null : event.target.value; // Check for empty string
  setProductInfo({ ...productInfo, description: newValue });
}} />
  </div>
  
  <div class="col-12 mt-5">
    <button type="button" class="btn btn-primary w-100" onClick={handleUpdate} disabled={!(productInfo.name!=null && productInfo.category !=null && productInfo.price!=null && productInfo.discount!=null && productInfo.inventory!=null && productInfo.description!=null && productInfo.image!=null)} >{ adding ? "Adding Product ..." : "Add Product"}</button>
  </div>
</form>

<div class={" image-uploader col-md-6 d-flex flex-column  justify-content-center align-items-center mt-4 mt-md-0"}  onDragOver={handleDragOver}   onDrop={handleDrop}>
    
    <Col xs={6} sm={6} md={8} lg={7} xl={6}  > {/* Responsive breakpoints */}
      <Image src={ productInfo.image!=null ? productInfo.image : upload } width={"400px"}  height={"400px"} className="rounded" alt="Product Image"  onClick={()=>handelClick()}/>

     
    </Col>
      <input type="file"  id="fileInput"accept="image/*" onChange={handleFileChange} class={"mt-4"} style={{display:'none'}}   />
      


  

</div>

</div>       

<ToastContainer position="top-center"    >
<Toast show={showToast} autohide  data-bs-autohide="true" delay={2} onHide={handleToastClose} class="shadow bg-white"> {/* Added classes */}
    <Toast.Header class="bg-white" closeButton={false} >
      <strong className="me-auto">Notification</strong>
    </Toast.Header>
    <Toast.Body>Product added successfully</Toast.Body>
  </Toast>
    </ToastContainer>
    </div>
  );
}