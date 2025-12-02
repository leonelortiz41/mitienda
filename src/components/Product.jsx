import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Form, ListGroup, Accordion, Carousel, Alert, Badge } from 'react-bootstrap';
import { FaStar, FaRegStar, FaCartPlus, FaCheckCircle } from 'react-icons/fa';
import productsData from '../produtos.json'; 

// 1. Componente para renderizar la puntuación (media estrella omitida por simplicidad, pero lista para expandir)
const StarRatingDisplay = ({ rating, size = '1em', color = 'gold' }) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;

    return (
        <>
            {[...Array(fullStars)].map((_, i) => (
                <FaStar key={`full-${i}`} color={color} size={size} className="me-1" />
            ))}
            {[...Array(emptyStars)].map((_, i) => (
                <FaRegStar key={`empty-${i}`} color={color} size={size} className="me-1" />
            ))}
        </>
    );
};

const Product = () => {
    const { productId } = useParams();
    // 2. Usar find en productsData filtrando solo la categoría una vez
    const product = useMemo(() => {
        // Asegúrate de que price y salePrice son números
        const p = productsData.find(p => p.id.toString() === productId);
        return p ? { 
            ...p, 
            price: Number(p.price), 
            salePrice: Number(p.salePrice) || Number(p.price),
            // Simulación de múltiples imágenes si el JSON lo soporta
            images: p.images || [p.image] 
        } : null;
    }, [productId]);
    
    const [cart, setCart] = useState([]);
    const [reviewName, setReviewName] = useState('');
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [reviews, setReviews] = useState([]);
    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState(null); // Estado para notificaciones

    // --- Efectos y Carga Inicial ---
    useEffect(() => {
        setCart(JSON.parse(localStorage.getItem('cart')) || []);
        const storedReviews = JSON.parse(localStorage.getItem(`reviews_${productId}`)) || [];
        setReviews(storedReviews);
        window.scrollTo(0, 0); 
    }, [productId]);

    if (!product) {
        return <Alert variant="warning" className="m-5">Producto no encontrado.</Alert>;
    }
    
    // --- Lógica de Carrito (Optimizada con useCallback) ---
    const addToCart = useCallback(() => {
        const updatedCart = [...cart];
        const productIndex = updatedCart.findIndex(item => item.id === product.id);

        if (productIndex !== -1) {
            updatedCart[productIndex].quantity += 1;
        } else {
            updatedCart.push({ ...product, quantity: 1 });
        }

        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        // Mostrar notificación
        setNotification({ 
            message: `¡**${product.name}** añadido al carrito!`, 
            variant: 'success' 
        });
        setTimeout(() => setNotification(null), 3000);

    }, [cart, product]);

    // --- Lógica de Reseñas ---
    const averageRating = useMemo(() => {
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        return (total / reviews.length).toFixed(1);
    }, [reviews]);
    
    const handleReviewSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!reviewName.trim()) newErrors.reviewName = 'El nombre es requerido';
        if (!reviewRating) newErrors.reviewRating = 'La puntuación es requerida';
        if (!reviewComment.trim()) newErrors.reviewComment = 'El comentario es requerido';

        if (Object.keys(newErrors).length === 0) {
            const newReview = {
                id: Date.now(), // ID único basado en timestamp
                name: reviewName,
                rating: reviewRating,
                comment: reviewComment,
                date: new Date().toLocaleDateString('es-ES'),
            };
            const updatedReviews = [newReview, ...reviews]; // Añadir la más nueva primero
            setReviews(updatedReviews);
            
            // Limpiar formulario y errores
            setReviewName('');
            setReviewRating(0);
            setReviewComment('');
            setErrors({});
            
            // Persistir
            localStorage.setItem(`reviews_${productId}`, JSON.stringify(updatedReviews));
            setNotification({ message: '¡Tu reseña ha sido enviada con éxito!', variant: 'info' });
            setTimeout(() => setNotification(null), 3000);
        } else {
            setErrors(newErrors);
        }
    };
    
    // --- Renderizado de Estrellas Clickeables ---
    const handleStarClick = useCallback((index) => {
        setReviewRating(index);
    }, []);

    // --- Productos Relacionados ---
    const relatedProducts = useMemo(() => {
        return productsData.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4); // Limitar a 4
    }, [product.category, product.id]);


    // --- Estructura Principal ---
    return (
        <Container className="my-5 text-light">
            {/* Notificación Flotante */}
            {notification && (
                <Alert variant={notification.variant} className="fixed-top-alert shadow-lg">
                    <div dangerouslySetInnerHTML={{ __html: notification.message }} />
                </Alert>
            )}

            <Row className="mb-5">
                {/* 🖼️ Columna de Imágenes */}
                <Col md={6}>
                    <Card className="bg-dark border-secondary shadow-lg">
                        <Carousel indicators={true} interval={null} className="product-carousel">
                            {/* Mapear todas las imágenes, si hay varias */}
                            {product.images.map((imgSrc, index) => (
                                <Carousel.Item key={index}>
                                    <Card.Img variant="top" src={imgSrc} alt={`${product.name} - Imagen ${index + 1}`} style={{ maxHeight: '500px', objectFit: 'contain' }} />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </Card>
                </Col>

                {/* 📝 Columna de Detalles */}
                <Col md={6} className="ps-md-5 mt-4 mt-md-0">
                    <h1 className="fw-bolder text-white">{product.name}</h1>
                    <p className="text-secondary fs-6 mb-3">{product.category}</p>
                    
                    {/* Puntuación Promedio */}
                    <div className="d-flex align-items-center mb-3">
                        <StarRatingDisplay rating={averageRating} size="1.2em" />
                        <span className="ms-2 fw-bold text-accent">{averageRating}</span>
                        <span className="ms-2 text-secondary">({reviews.length} reseñas)</span>
                    </div>

                    <hr className="text-secondary" />

                    {/* Precios */}
                    <div className="mb-4">
                        {product.onSale ? (
                            <h3 className="mb-0">
                                <span className="text-muted text-decoration-line-through me-3 fs-5">${product.price.toFixed(2)}</span>
                                <span className="text-danger fw-bolder fs-2">${product.salePrice.toFixed(2)}</span>
                                <Badge bg="danger" className="ms-3 align-text-top">¡{((1 - product.salePrice / product.price) * 100).toFixed(0)}% OFF!</Badge>
                            </h3>
                        ) : (
                            <h3 className="fw-bolder fs-2">${product.price.toFixed(2)}</h3>
                        )}
                    </div>
                    
                    {/* Botón de Carrito */}
                    <Button 
                        variant="primary" 
                        className="w-100 py-2 fw-bold" 
                        onClick={addToCart}
                    >
                        <FaCartPlus className="me-2" /> Añadir al Carrito
                    </Button>
                    
                    {/* Acordeón de Detalles */}
                    <Accordion defaultActiveKey="0" className="mt-4">
                        <Accordion.Item eventKey="0" className="bg-dark border-secondary">
                            <Accordion.Header className="bg-secondary">Descripción</Accordion.Header>
                            <Accordion.Body className="text-secondary">
                                {product.description}
                            </Accordion.Body>
                        </Accordion.Item>
                        {/* Puedes añadir más ítems de Accordion aquí (ej: Envío, Tallas) */}
                    </Accordion>
                </Col>
            </Row>

            {/* ⭐️ Reseñas y Formulario */}
            <Row className="mt-5">
                <Col lg={6} className="mb-5 mb-lg-0">
                    <h3 className="mb-4 text-white">Reseñas de Clientes ({reviews.length})</h3>
                    <ListGroup variant="flush" className="reviews-list">
                        {reviews.length === 0 ? (
                            <Alert variant="info" className="bg-dark-subtle text-white border-0">Aún no hay reseñas. ¡Sé el primero en opinar!</Alert>
                        ) : (
                            reviews.map(review => (
                                <ListGroup.Item key={review.id} className="bg-dark text-light border-secondary mb-3 rounded shadow-sm p-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h5 className="fw-bold text-accent">{review.name}</h5>
                                        <small className="text-muted">{review.date}</small>
                                    </div>
                                    <div className="mb-2">
                                        <StarRatingDisplay rating={review.rating} size="1em" color="gold" />
                                    </div>
                                    <p className="text-secondary">{review.comment}</p>
                                </ListGroup.Item>
                            ))
                        )}
                    </ListGroup>
                </Col>
                
                {/* Formulario de Reseña */}
                <Col lg={6}>
                    <Card className="bg-dark border-secondary shadow-lg">
                        <Card.Header className="bg-primary text-white">
                            <h4 className="mb-0">Deja tu reseña</h4>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleReviewSubmit}>
                                {/* Puntuación */}
                                <Form.Group controlId="reviewRating" className="mb-3">
                                    <Form.Label className="d-block text-white">
                                        Puntuación: <strong className="ms-2">{reviewRating} de 5</strong>
                                    </Form.Label>
                                    <div className="star-rating-input">
                                        {[1, 2, 3, 4, 5].map(index => (
                                            <span 
                                                key={index}
                                                onClick={() => handleStarClick(index)}
                                                style={{ cursor: 'pointer' }}
                                                className="me-1 fs-4"
                                            >
                                                {index <= reviewRating ? <FaStar color="gold" /> : <FaRegStar color="gold" />}
                                            </span>
                                        ))}
                                    </div>
                                    <Form.Control.Feedback type="invalid" style={{ display: errors.reviewRating ? 'block' : 'none' }}>
                                        {errors.reviewRating}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                
                                {/* Nombre */}
                                <Form.Group controlId="reviewName" className="mb-3">
                                    <Form.Label className="text-white">Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Tu nombre"
                                        value={reviewName}
                                        onChange={(e) => setReviewName(e.target.value)}
                                        isInvalid={!!errors.reviewName}
                                        className="form-control-dark"
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.reviewName}</Form.Control.Feedback>
                                </Form.Group>
                                
                                {/* Comentario */}
                                <Form.Group controlId="reviewComment" className="mb-3">
                                    <Form.Label className="text-white">Comentario</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="¿Qué te pareció el producto?"
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        isInvalid={!!errors.reviewComment}
                                        className="form-control-dark"
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.reviewComment}</Form.Control.Feedback>
                                </Form.Group>
                                
                                <Button variant="success" type="submit" className="w-100 mt-3 fw-bold">
                                    <FaCheckCircle className="me-2" /> Enviar Reseña
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            
            <hr className="my-5 text-secondary" />

            {/* 📦 Productos Relacionados */}
            <Row className="mt-5">
                <Col>
                    <h3 className="mb-4 text-white">Productos Relacionados</h3>
                    {relatedProducts.length > 0 ? (
                        <Row xs={1} md={2} lg={4} className="g-4">
                            {relatedProducts.map(relatedProduct => (
                                <Col key={relatedProduct.id}>
                                    <Card className="h-100 bg-dark border-secondary text-light product-card-related">
                                        <Card.Img variant="top" src={relatedProduct.image} alt={relatedProduct.name} style={{ height: '200px', objectFit: 'cover' }} />
                                        <Card.Body className="d-flex flex-column">
                                            <Card.Title className="fw-bold">{relatedProduct.name}</Card.Title>
                                            <Card.Text className="text-accent">${Number(relatedProduct.price).toFixed(2)}</Card.Text>
                                            <Button 
                                                as={Link} 
                                                to={`/products/${relatedProduct.id}`} 
                                                variant="outline-primary" 
                                                className="mt-auto"
                                            >
                                                Ver Detalles
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <Alert variant="secondary" className="bg-dark-subtle text-white border-0">No hay más productos en esta categoría.</Alert>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default Product;