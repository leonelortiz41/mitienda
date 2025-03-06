import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ListGroup, Button, ButtonGroup, Image, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../App.css';

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
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      const updatedCart = cartItems.filter(item => item.id !== productId);
      updateCart(updatedCart);
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Container>
      <Row>
        <Col>
          <h1 className="my-4">Tu Carrito</h1>
          {cartItems.length === 0 ? (
            <Alert variant="info" className="text-center">
              Tu carrito está vacío. ¡Agrega productos para comenzar!
            </Alert>
          ) : (
            <ListGroup variant="flush">
              {cartItems.map(item => (
                <ListGroup.Item key={item.id} className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                  <div className="d-flex align-items-center mb-3 mb-md-0">
                    <Image src={item.image} rounded style={{ width: '100px', height: '100px', marginRight: '15px' }} />
                    <div>
                      <h5 className="mb-1">{item.name}</h5>
                      <p className="mb-1">${item.price} x {item.quantity} = <strong>${item.price * item.quantity}</strong></p>
                    </div>
                  </div>
                  <div className="d-flex flex-column flex-md-row align-items-center">
                    <ButtonGroup className="mb-2 mb-md-0">
                      <Button variant="outline-secondary" onClick={() => decreaseQuantity(item.id)}>-</Button>
                      <Form.Control type="text" readOnly value={item.quantity} className="text-center mx-2" style={{ width: '50px' }} />
                      <Button variant="outline-secondary" onClick={() => increaseQuantity(item.id)}>+</Button>
                    </ButtonGroup>
                    <Button variant="danger" className="ms-md-2" onClick={() => removeItem(item.id)}>Eliminar</Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
          <div className="d-flex flex-column align-items-center mt-4">
            <h3>Total: <strong>${totalPrice}</strong></h3>
            <Button variant="success" className="mt-2" onClick={() => navigate('/checkout')}>Proceder al Pago</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Cart;
