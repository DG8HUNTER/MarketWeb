import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table ,Image,Col , label , input , textarea , Toast , ToastContainer , button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function MyComponent() {
  const navigate = useNavigate();

  const handleButtonClick = (data) => {
    navigate(`/products/${data}`); // Include data as a parameter
  };

  const addProduct = (data) => {
    navigate(`/addProduct/${data}`); // Include data as a parameter
  };
  

  return (
    <div class={"d-flex flex-column col-3 p-4"}>
      <button class={"btn btn-primary"} onClick={() => handleButtonClick('AV392AHNNg8TZf5IoOKg')}>
        View Product
      </button>

      <button class={"btn btn-primary mt-4"} onClick={() => addProduct('AV392AHNNg8TZf5IoOKg')}>
       Add Product
      </button>
    </div>
  );
}

export default MyComponent;