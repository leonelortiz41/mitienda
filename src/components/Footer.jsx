import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { FaFacebook, FaInstagram, FaWhatsapp, FaCode } from 'react-icons/fa'; // Necesitas instalar react-icons
import '../App.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer bg-dark text-light pt-5 pb-3">
      <Container>
        <Row className="gy-4">
          {/* Columna 1: Branding y Propósito */}
          <Col md={4} className="text-center text-md-start">
            <h5 className="text-primary fw-bold mb-3">MI TIENDA</h5>
            <p className="text-secondary small">
              Ofreciendo la mejor calidad en indumentaria urbana con envíos a todo el país. 
              Estilo, comodidad y confianza en cada prenda.
            </p>
            <div className="d-flex justify-content-center justify-content-md-start gap-3 mt-3">
              <a href="#" className="text-light fs-4 transition-icon"><FaFacebook /></a>
              <a href="#" className="text-light fs-4 transition-icon"><FaInstagram /></a>
              <a href="#" className="text-light fs-4 transition-icon"><FaWhatsapp /></a>
            </div>
          </Col>

          {/* Columna 2: Enlaces Rápidos (Demuestra orden) */}
          <Col md={4} className="text-center">
            <h5 className="mb-3 fw-bold">Navegación</h5>
            <Nav className="flex-column small">
              <Nav.Link href="/" className="p-0 mb-2 text-secondary hover-white">Inicio</Nav.Link>
              <Nav.Link href="/products" className="p-0 mb-2 text-secondary hover-white">Productos</Nav.Link>
              <Nav.Link href="/offers" className="p-0 mb-2 text-secondary hover-white">Ofertas</Nav.Link>
              <Nav.Link href="/contact" className="p-0 mb-2 text-secondary hover-white">Contacto</Nav.Link>
            </Nav>
          </Col>

          {/* Columna 3: Contacto y Ubicación */}
          <Col md={4} className="text-center text-md-end">
            <h5 className="mb-3 fw-bold">Contacto</h5>
            <address className="text-secondary small">
              <p className="mb-1">📍 1234 Calle Principal, Ciudad, País</p>
              <p className="mb-1">📞 +123 456 7890</p>
              <p className="mb-1">📧 contacto@mitienda.com</p>
            </address>
          </Col>
        </Row>

        <hr className="my-4 border-secondary" />

        {/* Barra Final: TU CRÉDITO DE DESARROLLADOR */}
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start small text-secondary">
            &copy; {currentYear} Mi Tienda - Todos los derechos reservados.
          </Col>
          <Col md={6} className="text-center text-md-end mt-2 mt-md-0">
            <div className="dev-credit py-1 px-3 d-inline-block rounded-pill">
              <small className="text-secondary">Desarrollado con ❤️ por </small>
              <a 
                href="https://leonel-ortiz.netlify.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary fw-bold text-decoration-none ms-1"
              >
                <FaCode className="me-1" /> Leonel Ortiz
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;