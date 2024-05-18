import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MyComponent from './Screens/Component';
import TargetScreen from './Screens/products';
import Products from './Screens/products';
import ProductInfo from './Screens/productInfo';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MyComponent />} />
        <Route path="/products/:data" element={<Products />} />
        <Route path="/productInfo/:data" element={<ProductInfo />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
