import React from 'react';
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();

  const handleButtonClick = (data) => {
    navigate(`/products/${data}`); // Include data as a parameter
  };

  return (
    <div>
      <button onClick={() => handleButtonClick('AV392AHNNg8TZf5IoOKg')}>
        Send Data to Target Screen
      </button>
    </div>
  );
}

export default MyComponent;