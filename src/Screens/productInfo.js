import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDoc , query,collection, where, getDocs ,doc ,updateDoc} from 'firebase/firestore'; // Assuming Firebase v9
import { db  } from '../firebase.js';
import { Table ,Image,Col , label , input , textarea} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getDownloadURL, ref, uploadBytes ,getStorage  , uploadBytesResumable} from 'firebase/storage';

export default  function ProductInfo() {
  const { data: productId } = useParams(); // Extract product ID from route parameter
  const [productInfo, setProductInfo] = useState(null);
   const [selectedImage, setSelectedImage] = useState(null);
   console.log(productInfo)

  const handleDragOver = (event) => {
    event.preventDefault();
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
          const productDocRef = doc(db, "Products", productId);
          await updateDoc(productDocRef, {
            // Update relevant product fields
            "discount": parseInt(productInfo.discount),
            "image": downloadURL,
            "name": productInfo.name,
            "inventory": parseInt(productInfo.inventory),
            "description": productInfo.description,
            "category": productInfo.category,
            // ...other product fields
          });

          console.log('Product updated successfully!');
        }
      );
    } catch (error) {
      console.error('Error updating product:', error);
      // Display a user-friendly error message here if needed
    } finally {
      // Reset upload state (optional)
      setSelectedImage(null); // Clear selected image after upload
    }
  }


  // Fetch product data from Firebase on component mount and whenever productId changes
  useEffect(() => {
    const getProductInfo = async () => {
      if (!productId) return; // Handle missing product ID gracefully

      try {
        const docRef = doc(db, "Products", productId);
          const docSnap = await getDoc(docRef);

       if(docSnap!=null){
        setProductInfo({productId:docSnap.id , ...docSnap.data()});   
         
       
    
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
        <h2 className={"mb-4"}>Product Info </h2>
      {productInfo!=null ? (
<div class=" col-12  d-md-flex justify-content-md-between  align-items-md-center  ">
<form class="row g-3 col-md-6 px-2 py-4 shadow-lg  bg-body rounded h-auto">
  <div class="col-md-6">
    <label htmlFor="productName" class="form-label ">Name</label>
    <input type="text" class="form-control " id="productName" value={productInfo.name} placeholder='Product Name' onChange={(event) => setProductInfo({ ...productInfo, name: event.target.value })}/>
  </div>


  <div class="col-md-6">
    <label htmlFor="price" class="form-label">Price $</label>
  <div class="input-group mb-3">
  <span class="input-group-text">$</span>
  <input type="number" class="form-control" id="price"  min={0} value={productInfo.price} placeholder="Price"  onChange={(event) => setProductInfo({ ...productInfo, price: event.target.value })} />
</div>
  </div>
  <div class="col-md-6">
    <label htmlFor="Discount" class="form-label">Discount %</label>
    <input type="number" min={0} max={100} class="form-control" id="Discount" placeholder="Discount" value={productInfo.discount}  onChange={(event) => setProductInfo({ ...productInfo, discount: event.target.value })} / >
  </div>
  <div class="col-md-6">
    <label htmlFor="Category" class="form-label">Category</label>
    <input type="text" class="form-control" id="Category" placeholder="Category" value={productInfo.category}  onChange={(event) => setProductInfo({ ...productInfo, category: event.target.value })} />
  </div>
  <div class="col-md-12 ">
    <label htmlFor="Inventroy" class="form-label">Inventory</label>
    <input type="text"   class="form-control  " id="Inventory" value={productInfo.inventory}  onChange={(event) => setProductInfo({ ...productInfo, inventory: event.target.value })} />
  </div>
  <div class="col-md-12 ">
    <label htmlFor="Description" class="form-label">Description</label>
    <textarea type="text" rows="3"  class="form-control  " id="Description" value={productInfo.description}  onChange={(event) => setProductInfo({ ...productInfo, description: event.target.value })} />
  </div>
  
  <div class="col-12 mt-5">
    <button type="button" class="btn btn-primary w-100" onClick={handleUpdate}>Update</button>
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