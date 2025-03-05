import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import productsData from '../produtos.json';

const ProductList = ({ selectedCategory }) => {
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (selectedCategory === 'Todos') {
      setFilteredProducts(productsData);
    } else {
      setFilteredProducts(productsData.filter(product => product.category === selectedCategory));
    }
  }, [selectedCategory]);

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
      <Row>
        {filteredProducts.map(product => (
          <Col key={product.id} md={4} className="mb-4">
            <Card className="product-card">
              <div className="position-relative">
                <Card.Img variant="top" src={product.image} alt={product.name} />
                {product.onSale && (
                  <Badge
                    pill
                    bg="danger"
                    className="position-absolute top-0 start-0 m-2"
                  >
                    Oferta
                  </Badge>
                )}
              </div>
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Card.Text>
                  {product.onSale ? (
                    <>
                      <span className="text-muted text-decoration-line-through">${product.price}</span>
                      <span className="ms-2 text-danger">${product.salePrice}</span>
                    </>
                  ) : (
                    `$${product.price}`
                  )}
                </Card.Text>
                <Button variant="primary" onClick={() => addToCart(product)}>Añadir al Carrito</Button>
                <Link to={`/products/${product.id}`} className="btn btn-secondary ml-2">Ver Detalles</Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ProductList;
