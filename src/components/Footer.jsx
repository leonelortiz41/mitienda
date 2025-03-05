import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../App.css'; // Asegúrate de crear y usar este archivo CSS

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md={4}>
            <h5>Ubicación</h5>
            <p>1234 Calle Principal, Ciudad, País</p>
          </Col>
          <Col md={4}>
            <h5>Contacto</h5>
            <p>Teléfono: +123 456 7890</p>
            <p>Email: contacto@mitienda.com</p>
          </Col>
          <Col md={4}>
            <h5>Información</h5>
            <p>&copy; 2025 Mi Tienda. Todos los derechos reservados.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
