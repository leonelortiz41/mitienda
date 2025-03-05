// Home.js
import React, { useState } from 'react';
import { Container, Row, Col, Dropdown, Nav, Button, Carousel } from 'react-bootstrap';
import ProductList from './ProductList';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import gorras from '../assets/gorras.webp'
import camisas from '../assets/camisas.jpg'
import remeras from '../assets/remeras.png'
import camisaazul from '../assets/camisaazul.webp'
import camisalino from '../assets/camisalino.jpeg'
import gorra2 from '../assets/gorra2.jpeg'
import gorra from '../assets/gorra.jpeg'
import remera_blanca from '../assets/remera_blanca.jpg'

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const handleSelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <Container>
      <Row>
        <Col>
          <Nav variant="tabs" className='nav-home'>
            <Nav.Item>
              <Dropdown onSelect={handleSelect}>
                <Dropdown.Toggle className="btn-navHome" id="dropdown-basic">
                  Filtrar por categoría
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="Todos">Todos</Dropdown.Item>
                  <Dropdown.Item eventKey="Remeras">Remeras</Dropdown.Item>
                  <Dropdown.Item eventKey="Camisas">Camisas</Dropdown.Item>
                  <Dropdown.Item eventKey="Pantalones">Pantalones</Dropdown.Item>
                  <Dropdown.Item eventKey="Gorras">Gorras</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav.Item>
            <Nav.Item>
              <Button className="btn-navHome" as={Link} to="/offers">Ver Ofertas</Button>
            </Nav.Item>
          </Nav>
          <Carousel controls={true} indicators={false} interval={3500} className="mb-3">
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={gorras}
                alt="gorras"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={camisas}
                alt="camisas"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={remeras}
                alt="remeras"
              />
            </Carousel.Item>

          </Carousel>
          <ProductList selectedCategory={selectedCategory} />
        </Col>
      </Row>
      <Footer />
    </Container>
  );
};

export default Home;
