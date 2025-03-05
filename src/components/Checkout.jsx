// Checkout.js
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'El email es requerido';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'El email es inválido';
    if (!address) newErrors.address = 'La dirección es requerida';
    if (!cardNumber) newErrors.cardNumber = 'El número de tarjeta de crédito es requerido';
    else if (!/^\d{16}$/.test(cardNumber)) newErrors.cardNumber = 'El número de tarjeta de crédito es inválido';
    return newErrors;
  };

  const handleCheckout = (event) => {
    event.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      // Aquí puedes añadir la lógica para procesar el pago
      setSuccess(true);
      localStorage.removeItem('cart'); // Limpiar el carrito después del pago
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Header className="text-white text-center">
              <h4>Realizar Pago</h4>
            </Card.Header>
            <Card.Body>
              {success ? (
                <div className="text-center">
                  <h5>¡Pago realizado con éxito!</h5>
                  <Button variant="secondary" className="w-100 mt-3" onClick={() => navigate('/')}>Volver al Inicio</Button>
                </div>
              ) : (
                <Form onSubmit={handleCheckout}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="email"
                        placeholder="Introduce tu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        isInvalid={!!errors.email}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group controlId="formBasicAddress">
                    <Form.Label>Dirección</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Introduce tu dirección"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        isInvalid={!!errors.address}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.address}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group controlId="formBasicCard">
                    <Form.Label>Tarjeta de Crédito</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Número de tarjeta de crédito"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        isInvalid={!!errors.cardNumber}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.cardNumber}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100 mt-3">Realizar Pago</Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Checkout;
