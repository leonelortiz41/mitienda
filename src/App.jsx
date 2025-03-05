import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Home from './components/Home';
import ProductList from './components/ProductList';
import Product from './components/Product';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Help from './components/Help';
import OrderHistory from './components/OrderHistory';
import Offers from './components/Offers'; // Importa el componente Offers
import Footer from './components/Footer';
import './App.css';

const App = () => (
  <Router>
    <NavigationBar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/products/:productId" element={<Product />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/help" element={<Help />} />
      <Route path="/order-history" element={<OrderHistory />} />
      <Route path="/offers" element={<Offers />} /> {/* Añade la ruta para el componente Offers */}
    </Routes>
  </Router>
);

export default App;
