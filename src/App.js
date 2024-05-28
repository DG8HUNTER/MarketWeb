import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MyComponent from './Screens/Component';
import TargetScreen from './Screens/products';
import Products from './Screens/products';
import ProductInfo from './Screens/productInfo';
import AddProduct from './Screens/addproduct';
import Orders from "./Screens/Orders"
import OrderInfo from "./Screens/OrderInfo"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MyComponent/>} />
        <Route path="/products/:data" element={<Products />} />
        <Route path="/addproduct/:data" element={<AddProduct />} />
        <Route path="/productInfo/:data" element={<ProductInfo />}/>
        <Route path="/orders/:data"  element ={<Orders/>}/>
        <Route path="/orderInfo/:data"  element={<OrderInfo/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
