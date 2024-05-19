
import React, { useState, useEffect } from 'react'; // Import React for component structure
import { db } from '../firebase.js';
 // Import the Firestore instance from firebase.js
import {getDocs,collection , query,where , onSnapshot} from "firebase/firestore"
import { useParams } from 'react-router-dom';
import { Table ,Image,Col} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';



function Products(){
    const { data } = useParams();
    const navigate = useNavigate();
  
  const [products, setProducts] = useState([]); 
  
  
const q = query(collection(db, "Products"), where("storeId", "==", data));
const unsubscribe = onSnapshot(q, (querySnapshot) => {
  const products = [];
  querySnapshot.forEach((doc) => {
      products.push({productId: doc.id, ...doc.data()});
  });
  setProducts(products);

});

  // Fetch products from Firestore on component mount
  /*useEffect(() => {
    const getProducts = async () => {
      try {
        const q = query(collection(db, "Products"), where("storeId", "==", data));

        const snapshot = await getDocs(q);

        const retrievedProducts = [];
        snapshot.forEach((doc) => {
          retrievedProducts.push({id: doc.id, ...doc.data() }); // Add product data with ID
        });
        setProducts(retrievedProducts);
      
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    getProducts();
  }, []); // Empty dependency array ensures fetching only once on mount
*/
  // Display retrieved products (replace with your preferred UI component)
  return (
    <div className={"p-4"}>
      <h3 className={"mb-4"}>Store Products</h3>

   
   
      
      {products.length > 0 ? (
         <Table striped bordered hover responsive  className={"shadow-sm "} draggable   >

         <thead>
           <tr className={"text-center "}>
             <th>Image</th>
             <th>Product Name</th>
             <th>Category</th>
             <th>Price</th>
             <th>Discount</th>
             <th>Inventory</th>
             <th>Availability</th>
           </tr>
         </thead>
         <tbody >
          {products.map((product) => (
          <tr key={product.productId} className={"text-center flex align-middle"} onClick={()=>navigate(`/productInfo/${product.productId}`)}>
         <td  className="d-flex align-items-center justify-content-center" >  
          <Image src={product.image} thumbnail  width={45} height={45}   />
        </td>
          <td>{product.name}</td>
          <td>{product.category}</td>
          <td>{product.price}</td>
          <td>{product.discount}%</td>
          <td>{product.inventory}</td>
          
          {product.inventory > 0 ? (
  <td className="text-success">
    <p>In Stock</p>
  </td>
) : (
  <td className="text-danger">Out of Stock</td>
)}

          </tr>
         
            
          
          ))}
          </tbody>
         </Table>
      
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}

export default Products;