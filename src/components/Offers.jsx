// Offers.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge,ButtonGroup } from 'react-bootstrap';
import { FaCartPlus, FaInfoCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import productsData from '../produtos.json';

const Offers = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const onSaleProducts = productsData.filter(product => product.onSale);
    setOffers(onSaleProducts);
  }, []);

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(item => item.id === product.id);

    if (productIndex >= 0) {
      cart[productIndex].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  };

  return (
    <Container>
      <h1>Ofertas</h1>
      <Row>
        {offers.map(product => (
          <Col key={product.id} md={4} className="mb-4">
            <Card className="product-card">
              <div className="position-relative">
                <Card.Img variant="top" src={product.image} alt={product.name} />
                <Badge
                  pill
                  bg="danger"
                  className="position-absolute top-0 start-0 m-2"
                >
                  Oferta
                </Badge>
              </div>
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Card.Text>
                  <span className="text-muted text-decoration-line-through">${product.price}</span>
                  <span className="ms-2 text-danger">${product.salePrice}</span>
                </Card.Text>
                <ButtonGroup>
                  <Button
                    variant="primary"
                    onClick={() => addToCart(product)}
                    className="rounded-circle btn-lg-custom"
                    title="Añadir al Carrito"
                  >
                    <FaCartPlus />
                  </Button>
                  <Button
                    as={Link}
                    to={`/products/${product.id}`}
                    variant="secondary"
                    className="rounded-circle btn-lg-custom ml-2"
                    title="Ver Detalles"
                  >
                    <FaInfoCircle />
                  </Button>
                </ButtonGroup>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Offers;
