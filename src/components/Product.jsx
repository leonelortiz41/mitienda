import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Form, ListGroup, Accordion, Carousel } from 'react-bootstrap';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import productsData from '../produtos.json'; // Asegúrate de que la ruta es correcta

const Product = () => {
  const { productId } = useParams();
  const product = productsData.find(p => p.id.toString() === productId);
  const [cart, setCart] = useState([]);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart')) || []);
    const storedReviews = JSON.parse(localStorage.getItem(`reviews_${productId}`)) || [];
    setReviews(storedReviews);
    window.scrollTo(0, 0); // Scroll al inicio de la página
  }, [productId]);

  if (!product) {
    return <p>Producto no encontrado</p>;
  }

  const addToCart = () => {
    const updatedCart = cart.map(item =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    if (!updatedCart.some(item => item.id === product.id)) {
      updatedCart.push({ ...product, quantity: 1 });
    }

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!reviewName) newErrors.reviewName = 'Nombre es requerido';
    if (!reviewRating) newErrors.reviewRating = 'Puntuación es requerida';
    if (!reviewComment) newErrors.reviewComment = 'Comentario es requerido';

    if (Object.keys(newErrors).length === 0) {
      const newReview = {
        id: reviews.length + 1,
        name: reviewName,
        rating: reviewRating,
        comment: reviewComment,
      };
      const updatedReviews = [...reviews, newReview];
      setReviews(updatedReviews);
      setReviewName('');
      setReviewRating(0);
      setReviewComment('');
      setErrors({});
      localStorage.setItem(`reviews_${productId}`, JSON.stringify(updatedReviews));
    } else {
      setErrors(newErrors);
    }
  };

  const handleStarClick = (index) => {
    setReviewRating(index);
  };

  const getStarRating = (rating, clickable = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={clickable ? () => handleStarClick(i) : undefined}
          style={{ cursor: clickable ? 'pointer' : 'default' }}
        >
          {i <= rating ? <FaStar color="gold" /> : <FaRegStar color="gold" />}
        </span>
      );
    }
    return stars;
  };

  return (
    <Container className="my-5">
      <Row>
        <Col md={6}>
          <Carousel>
            <Carousel.Item>
              <Card.Img variant="top" src={product.image} alt={product.name} />
            </Carousel.Item>
            {/* Añade más Carousel.Items si hay más imágenes */}
          </Carousel>
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
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Detalles del Producto</Accordion.Header>
              <Accordion.Body>
                {product.description}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>Reseñas y Puntuaciones</h3>
          <ListGroup variant="flush">
            {reviews.map(review => (
              <ListGroup.Item key={review.id}>
                <h5>{review.name}</h5>
                <p>{getStarRating(review.rating)}</p>
                <p>{review.comment}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <h4>Deja tu reseña</h4>
          <Form onSubmit={handleReviewSubmit}>
            <Form.Group controlId="reviewName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Introduce tu nombre"
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                isInvalid={!!errors.reviewName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.reviewName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="reviewRating" className="mt-3">
              <Form.Label>Puntuación</Form.Label>
              <div>{getStarRating(reviewRating, true)}</div>
              <Form.Control.Feedback type="invalid">
                {errors.reviewRating}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="reviewComment" className="mt-3">
              <Form.Label>Comentario</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Introduce tu comentario"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                isInvalid={!!errors.reviewComment}
              />
              <Form.Control.Feedback type="invalid">
                {errors.reviewComment}
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">Enviar Reseña</Button>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>Productos Relacionados</h3>
          <ListGroup horizontal>
            {productsData.filter(p => p.category === product.category && p.id !== product.id).map(relatedProduct => (
              <ListGroup.Item key={relatedProduct.id}>
                <Card>
                  <Card.Img variant="top" src={relatedProduct.image} />
                  <Card.Body>
                    <Card.Title>{relatedProduct.name}</Card.Title>
                    <Card.Text>${relatedProduct.price}</Card.Text>
                    <Button as={Link} to={`/products/${relatedProduct.id}`} variant="primary">Ver Producto</Button>
                  </Card.Body>
                </Card>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default Product;
