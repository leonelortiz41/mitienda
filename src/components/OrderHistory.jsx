// OrderHistory.js
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const mockOrderHistory = [
  { id: 1, date: '2025-02-14', status: 'En envío', items: [{ name: 'Remera Básica', quantity: 1 }] },
  { id: 2, date: '2025-03-01', status: 'Entregado', items: [{ name: 'Pantalón Jeans', quantity: 2 }] },
];

const OrderHistory = () => {
  const [accessKey, setAccessKey] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (accessKey === '000') { // Reemplaza 'claveDeAcceso' con la clave real de acceso
      setAuthenticated(true);
      setError('');
    } else {
      setError('Clave de acceso incorrecta');
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Header className=" text-white text-center">
              <h4>Acceso a Historial de Compras</h4>
            </Card.Header>
            <Card.Body>
              {!authenticated ? (
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formBasicAccessKey">
                    <Form.Label>Clave de Acceso</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="password"
                        placeholder="Introduce tu clave de acceso"
                        value={accessKey}
                        onChange={(e) => setAccessKey(e.target.value)}
                        isInvalid={!!error}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {error}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100 mt-3">Acceder</Button>
                </Form>
              ) : (
                <div>
                  <h5>Historial de Compras</h5>
                  <Card className="mt-3">
                    {mockOrderHistory.map(order => (
                      <Card.Body key={order.id} className="mb-3">
                        <Card.Title>Orden #{order.id}</Card.Title>
                        <Card.Text><strong>Fecha:</strong> {order.date}</Card.Text>
                        <Card.Text><strong>Estado:</strong> {order.status}</Card.Text>
                        <Card.Text><strong>Items:</strong></Card.Text>
                        <ul>
                          {order.items.map((item, index) => (
                            <li key={index}>{item.name} x{item.quantity}</li>
                          ))}
                        </ul>
                      </Card.Body>
                    ))}
                  </Card>
                  <Button variant="secondary" className="w-100 mt-3" onClick={() => navigate('/')}>Volver al Inicio</Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default OrderHistory;
