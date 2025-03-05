// Product.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Form, ListGroup } from 'react-bootstrap';
import productsData from '../produtos.json';

const Product = () => {
  const { productId } = useParams();
  const product = productsData.find(p => p.id.toString() === productId);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);

  if (!product) {
    return <p>Producto no encontrado</p>;
  }

  const addToCart = () => {
    const productIndex = cart.findIndex(item => item.id === product.id);
    let updatedCart;

    if (productIndex >= 0) {
      updatedCart = cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const mockReviews = [
    { id: 1, name: 'Juan Pérez', rating: 5, comment: 'Excelente calidad y muy cómodo.' },
    { id: 2, name: 'Ana López', rating: 4, comment: 'Buen producto, aunque un poco caro.' },
    { id: 3, name: 'Carlos Gómez', rating: 3, comment: 'Está bien, pero esperaba más.' }
  ];

  return (
    <Container className="my-5">
      <Row>
        <Col md={6}>
          <Card>
            <Card.Img variant="top" src={product.image} alt={product.name} />
          </Card>
        </Col>
        <Col md={6}>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          {product.onSale ? (
            <>
              <span className="text-muted text-decoration-line-through">${product.price}</span>
              <span className="ms-2 text-danger">${product.salePrice}</span>
            </>
          ) : (
            <h3>${product.price}</h3>
          )}
          <Button variant="primary" className="my-3" onClick={addToCart}>Añadir al Carrito</Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>Reseñas y Puntuaciones</h3>
          <ListGroup variant="flush">
            {mockReviews.map(review => (
              <ListGroup.Item key={review.id}>
                <h5>{review.name}</h5>
                <p>Rating: {'⭐'.repeat(review.rating)}</p>
                <p>{review.comment}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <h4>Deja tu reseña</h4>
          <Form>
            <Form.Group controlId="reviewName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" placeholder="Introduce tu nombre" />
            </Form.Group>
            <Form.Group controlId="reviewRating" className="mt-3">
              <Form.Label>Puntuación</Form.Label>
              <Form.Control as="select">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="reviewComment" className="mt-3">
              <Form.Label>Comentario</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Introduce tu comentario" />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">Enviar Reseña</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Product;
