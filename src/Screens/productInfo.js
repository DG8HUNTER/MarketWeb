import React, { useState, useEffect } from 'react';
import { useParams , useNavigate  } from 'react-router-dom';
import { getDoc , query,collection, where, getDocs ,doc ,updateDoc ,deleteDoc} from 'firebase/firestore'; // Assuming Firebase v9
import { db  } from '../firebase.js';
import { Table ,Image,Col , label , input , textarea , Toast , ToastContainer} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getDownloadURL, ref, uploadBytes ,getStorage  , uploadBytesResumable} from 'firebase/storage';



export default  function ProductInfo() {
  const { data: productId } = useParams(); // Extract product ID from route parameter
  const [productInfo, setProductInfo] = useState(null);
   const [selectedImage, setSelectedImage] = useState(null);
   const [isUpdating , setUpdating] = useState(false)
   const [isDeleting , setIsDeleting] = useState(false)
   const [isDeleted,setIsDeleted]=useState(false)
   const [showToast , setShowToast]=useState(false)
   const navigate = useNavigate();

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

  const DeleteProduct = async ()=>{
    
  setIsDeleting(true)

   await  deleteDoc(doc(db, "Products", productId));
   setIsDeleting(false)
   setIsDeleted(true)


  }
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
   setUpdating(true)

    const storage = getStorage(); // Initialize Storage instance (once outside the function)

    try {
      // Create a unique filename (optional)
      const filename = `/${productInfo.productId}_${productInfo.name}.png`;

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
            "price":parseFloat(productInfo.price),
            "profitPerItem" : parseFloat(productInfo.profitPerItem),
            "category": productInfo.category,
            // ...other product fields
          });

          setUpdating(false)
          setShowToast(true)
          

          setTimeout(() => {
            setShowToast(false);
            
          }, 2000);


          console.log('Product updated successfully!');
        }
      );
    } catch (error) {
      console.error('Error updating product:', error);
      // Display a user-friendly error message here if needed
    } finally {
      // Reset upload state (optional)
       // Clear selected image after upload
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
      <ToastContainer position="top-center"    >
<Toast show={showToast} autohide   class="shadow bg-white"> {/* Added classes */}
    <Toast.Header class="bg-white" closeButton={false} >
      <strong className="me-auto">Notification</strong>
    </Toast.Header>
    <Toast.Body>Product updated successfully</Toast.Body>
  </Toast>
    </ToastContainer>
      {isDeleted === false ? (
        productInfo != null ? (
          <div className="col-12 d-md-flex justify-content-md-between align-items-md-center">
            <form className="row g-3 col-md-6 px-2 py-4 shadow-lg bg-body rounded h-auto">
              <div className="col-md-6">
                <label htmlFor="productName" className="form-label">Name</label>
                <input type="text" className="form-control" id="productName" value={productInfo.name} placeholder='Product Name' onChange={(event) => {
  const newValue = event.target.value === '' ? null : event.target.value; // Check for empty string
  setProductInfo({ ...productInfo, name: newValue });
}} />
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
  <input type="text" class="form-control" id="price"  min={0} value={productInfo.price} placeholder="Price" onChange={(event) => {
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
  <div class="col-md-6">
    <label htmlFor="Discount" class="form-label">Discount %</label>
    <input type="number" min={0} max={100} class="form-control" id="Discount" placeholder="Discount" value={productInfo.discount}  onChange={(event) => {
  const newValue = event.target.value === '' ? null : event.target.value; // Check for empty string
  setProductInfo({ ...productInfo, discount: newValue });
}} / >
  </div>

  <div class="col-md-6 ">
    <label htmlFor="Inventroy" class="form-label">Inventory</label>
    <input type="text"   class="form-control  " id="Inventory" value={productInfo.inventory}  onChange={(event) => {
  const newValue = event.target.value === '' ? null : event.target.value; // Check for empty string
  setProductInfo({ ...productInfo, inventory: newValue });
}} />
  </div>
  <div class="col-md-12 ">
    <label htmlFor="Description" class="form-label">Description</label>
    <textarea type="text" rows="3"  class="form-control  " id="Description" value={productInfo.description}  onChange={(event) => {
  const newValue = event.target.value === '' ? null : event.target.value; // Check for empty string
  setProductInfo({ ...productInfo, description: newValue });
}} />
  </div>
              <div className="col-12 mt-5">
                <button type="button" className="btn btn-primary w-100" onClick={handleUpdate} disabled={!(productInfo.name!=null && productInfo.category !=null && productInfo.price!=null && productInfo.discount!=null && productInfo.inventory!=null && productInfo.description!=null && productInfo.image!=null)} >{isUpdating ? "Updating Product ..." : "Update Product"}</button>
                <button type="button" className="btn btn-danger w-100 mt-2" onClick={DeleteProduct}>{isDeleting == true ? "Deleting Product ..." : "Delete Product"}</button>
              </div>
            </form>
            <div className="col-md-6 d-flex flex-column align-items-center mt-4 mt-md-0">
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
        )
      ) : (
        <ToastContainer position="middle-center"    >
<Toast show={true} autohide  data-bs-autohide="true" delay={2}  class="shadow bg-white"> {/* Added classes */}
    <Toast.Header class="bg-white" closeButton={false} >
      <strong className="me-auto">Notification</strong>
    </Toast.Header>
    <Toast.Body> 
      <div> 
        <p> {productInfo.name} deleted successfully</p>
        <button onClick={()=>{navigate(-1);}} class={"btn btn-primary"} > Go Back</button>
        </div></Toast.Body>
  </Toast>
    </ToastContainer>
      )}
    </div>
  );




}