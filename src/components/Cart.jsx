// Cart.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ListGroup, Button, ButtonGroup, Image, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Asegúrate de que los estilos estén incluidos

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCartItems);
  }, []);

  const updateCart = (updatedCart) => {
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const increaseQuantity = (productId) => {
    const updatedCart = cartItems.map(item =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updatedCart);
  };

  const decreaseQuantity = (productId) => {
    const updatedCart = cartItems.map(item =>
      item.id === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ).filter(item => item.quantity > 0);
    updateCart(updatedCart);
  };

  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    updateCart(updatedCart);
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Container>
      <Row>
        <Col>
          <h1>Tu Carrito</h1>
          {cartItems.length === 0 ? (
            <p>Tu carrito está vacío. ¡Agrega productos para comenzar!</p>
          ) : (
            <ListGroup variant="flush">
              {cartItems.map(item => (
                <ListGroup.Item key={item.id} className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                  <div className="d-flex align-items-center mb-3 mb-md-0">
                    <Image src={item.image} rounded style={{ width: '80px', height: '80px', marginRight: '10px' }} />
                    <div>
                      <strong>{item.name}</strong>
                      <p className="mb-1">${item.price} x {item.quantity} = ${item.price * item.quantity}</p>
                    </div>
                  </div>
                  <div className="d-flex flex-column flex-md-row align-items-center">
                    <ButtonGroup className="mb-2 mb-md-0">
                      <Button variant="secondary" onClick={() => decreaseQuantity(item.id)}>-</Button>
                      <Form.Control type="text" readOnly value={item.quantity} className="text-center mx-2" style={{ width: '40px' }} />
                      <Button variant="secondary" onClick={() => increaseQuantity(item.id)}>+</Button>
                    </ButtonGroup>
                    <Button variant="danger" className="ml-md-2 btn-danger" onClick={() => removeItem(item.id)}>Eliminar</Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4">
            <h3>Total: ${totalPrice}</h3>
            <Button  className="mt-3 mt-md-0" onClick={() => navigate('/checkout')}>Proceder al Pago</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Cart;
