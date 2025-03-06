import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaShoppingCart } from 'react-icons/fa';
import logo from "../assets/mitienda.svg"
import '../App.css'; // Asegúrate de crear y enlazar el archivo CSS

const NavigationBar = () => (
  <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar">
    <Container>
      <Navbar.Brand as={Link} to="/">
        <img src={logo} className='logo' alt="Mi Tienda" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          <Nav.Link as={Link} to="/help" className="nav-link-custom">Ayuda</Nav.Link>
          <Nav.Link as={Link} to="/order-history" className="nav-link-custom">Mis Compras</Nav.Link>
          <Nav.Link as={Link} to="/cart" className="nav-link-custom">Carrito <FaShoppingCart /></Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

export default NavigationBar;
