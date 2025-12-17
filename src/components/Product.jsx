import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Form, ListGroup, Accordion, Carousel, Alert, Badge, Toast, ToastContainer } from 'react-bootstrap';
import { FaStar, FaRegStar, FaCartPlus, FaCheckCircle, FaTruck, FaShieldAlt } from 'react-icons/fa';
import productsData from '../produtos.json';

// Rating con soporte de hover para el formulario
const InteractiveRating = ({ value, onChange, hover, setHover }) => (
    <div className="star-rating-input">
        {[1, 2, 3, 4, 5].map((index) => (
            <span
                key={index}
                onClick={() => onChange(index)}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(0)}
                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                className={`me-1 fs-3 ${index <= (hover || value) ? 'text-warning' : 'text-secondary opacity-50'}`}
            >
                {index <= (hover || value) ? <FaStar /> : <FaRegStar />}
            </span>
        ))}
    </div>
);

const Product = () => {
    const { productId } = useParams();
    const [hoverRating, setHoverRating] = useState(0); // Para el efecto visual al calificar
    const [showToast, setShowToast] = useState(false);

    const product = useMemo(() => {
        const p = productsData.find(p => p.id.toString() === productId);
        return p ? {
            ...p,
            price: Number(p.price),
            salePrice: Number(p.salePrice) || Number(p.price),
            images: p.images || [p.image]
        } : null;
    }, [productId]);

    const [reviewName, setReviewName] = useState('');
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [reviews, setReviews] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const storedReviews = JSON.parse(localStorage.getItem(`reviews_${productId}`)) || [];
        setReviews(storedReviews);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [productId]);

    // Lógica de Carrito Robusta (Patrón Funcional)
    const addToCart = () => {
        const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        const productIndex = currentCart.findIndex(item => item.id === product.id);

        let updatedCart;
        if (productIndex !== -1) {
            updatedCart = currentCart.map((item, index) =>
                index === productIndex ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            updatedCart = [...currentCart, { ...product, quantity: 1 }];
        }

        localStorage.setItem('cart', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cartUpdated')); // Sincroniza con tu Navbar
        setShowToast(true);
    };

    if (!product) return <Alert variant="danger">Producto no encontrado.</Alert>;

    // --- Lógica de Reseñas ---
    const handleReviewSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        // Validaciones
        if (!reviewName.trim()) newErrors.reviewName = 'El nombre es requerido';
        if (!reviewRating) newErrors.reviewRating = 'La puntuación es requerida';
        if (!reviewComment.trim()) newErrors.reviewComment = 'El comentario es requerido';

        if (Object.keys(newErrors).length === 0) {
            const newReview = {
                id: Date.now(),
                name: reviewName,
                rating: reviewRating,
                comment: reviewComment,
                date: new Date().toLocaleDateString('es-ES'),
            };

            const updatedReviews = [newReview, ...reviews];
            setReviews(updatedReviews);

            // Persistir en LocalStorage
            localStorage.setItem(`reviews_${productId}`, JSON.stringify(updatedReviews));

            // Limpiar formulario
            setReviewName('');
            setReviewRating(0);
            setReviewComment('');
            setErrors({});

            // Notificación (Opcional si usas el Toast anterior)
            setShowToast(true);
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <Container className="my-5 pt-4 text-light">
            {/* Toast de confirmación estilo Amazon */}
            <ToastContainer position="top-center" className="p-3" style={{ zIndex: 9999 }}>
                <Toast bg="success" onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                    <Toast.Body className="text-white d-flex align-items-center">
                        <FaCheckCircle className="me-2" />
                        ¡{product.name} añadido correctamente!
                    </Toast.Body>
                </Toast>
            </ToastContainer>

            <Row className="g-5">
                {/* 🖼️ Galería con Zoom (Visual) */}
                <Col lg={6}>
                    <div className="sticky-md-top" style={{ top: '100px' }}>
                        <Carousel indicators={true} interval={null} fade className="product-carousel rounded-4 overflow-hidden shadow-lg border border-secondary">
                            {product.images.map((imgSrc, index) => (
                                <Carousel.Item key={index}>
                                    <div className="bg-white p-4 d-flex align-items-center justify-content-center" style={{ height: '500px' }}>
                                        <img src={imgSrc} alt={product.name} className="img-fluid" style={{ maxHeight: '100%', objectFit: 'contain' }} />
                                    </div>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </div>
                </Col>

                {/* 📝 Detalles de Compra */}
                <Col lg={6}>
                    <Badge bg="primary" className="mb-2 px-3 py-2">Nuevo Lanzamiento</Badge>
                    <h1 className="display-5 fw-bold mb-2">{product.name}</h1>
                    <p className="text-secondary lead">{product.category}</p>

                    <div className="d-flex align-items-center mb-4">
                        <div className="text-warning me-2"><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></div>
                        <span className="text-secondary small">({reviews.length} opiniones de clientes)</span>
                    </div>

                    <div className="p-4 rounded-4 bg-dark-subtle border border-secondary mb-4">
                        {product.onSale ? (
                            <div className="mb-3">
                                <span className="text-secondary text-decoration-line-through fs-5 me-2">${product.price.toFixed(2)}</span>
                                <span className="text-primary fw-bold display-6">${product.salePrice.toFixed(2)}</span>
                                <Badge bg="danger" pill className="ms-3">- {((1 - product.salePrice / product.price) * 100).toFixed(0)}%</Badge>
                            </div>
                        ) : (
                            <h2 className="text-primary fw-bold mb-3">${product.price.toFixed(2)}</h2>
                        )}

                        <Button variant="primary" size="lg" className="w-100 fw-bold py-3 mb-3 shadow-sm hover-scale" onClick={addToCart}>
                            <FaCartPlus className="me-2" /> Agregar a mi pedido
                        </Button>

                        <div className="d-flex justify-content-around text-secondary small pt-2 border-top border-secondary">
                            <span className="d-flex align-items-center"><FaTruck className="me-2 text-primary" /> Envío rápido</span>
                            <span className="d-flex align-items-center"><FaShieldAlt className="me-2 text-primary" /> Garantía oficial</span>
                        </div>
                    </div>

                    <Accordion flush className="product-accordion">
                        <Accordion.Item eventKey="0" className="bg-transparent text-light border-secondary">
                            <Accordion.Header>Detalles del producto</Accordion.Header>
                            <Accordion.Body className="text-secondary">{product.description}</Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1" className="bg-transparent text-light border-secondary">
                            <Accordion.Header>Especificaciones Técnicas</Accordion.Header>
                            <Accordion.Body className="text-secondary">
                                <ul>
                                    <li>Material Premium de alta duración.</li>
                                    <li>Diseño ergonómico y moderno.</li>
                                    <li>Compatible con estándares internacionales.</li>
                                </ul>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>
            </Row>

            {/* Sección de Reseñas Pro */}
            <Row className="mt-5 pt-5 border-top border-secondary">
                <Col md={12} className="mb-4">
                    <h2 className="fw-bold">Experiencias de usuarios</h2>
                </Col>
                <Col md={5}>
                    <Card className="bg-dark border-secondary p-4 rounded-4 shadow-sm mb-4">
                        <h4 className="mb-4 text-center">Deja tu opinión</h4>
                        <Form onSubmit={handleReviewSubmit}>
                            <Form.Group className="mb-4 text-center">
                                <Form.Label className="d-block mb-3">¿Qué puntuación le das?</Form.Label>
                                <InteractiveRating
                                    value={reviewRating}
                                    onChange={setReviewRating}
                                    hover={hoverRating}
                                    setHover={setHoverRating}
                                />
                                {errors.reviewRating && <small className="text-danger d-block mt-2">{errors.reviewRating}</small>}
                            </Form.Group>

                            <Form.Floating className="mb-3 text-dark">
                                <Form.Control id="floatName" type="text" placeholder="Nombre" value={reviewName} onChange={(e) => setReviewName(e.target.value)} isInvalid={!!errors.reviewName} />
                                <label htmlFor="floatName">Tu nombre</label>
                            </Form.Floating>

                            <Form.Floating className="mb-3 text-dark">
                                <Form.Control id="floatComment" as="textarea" style={{ height: '100px' }} placeholder="Comentario" value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} isInvalid={!!errors.reviewComment} />
                                <label htmlFor="floatComment">Cuéntanos tu experiencia...</label>
                            </Form.Floating>

                            <Button variant="outline-primary" type="submit" className="w-100 fw-bold py-2">
                                Publicar reseña
                            </Button>
                        </Form>
                    </Card>
                </Col>

                <Col md={7}>
                    <div className="ps-md-4">
                        {reviews.length === 0 ? (
                            <div className="text-center py-5 border border-dashed border-secondary rounded-4">
                                <p className="text-secondary mb-0">No hay reseñas todavía. ¡Sé el primero!</p>
                            </div>
                        ) : (
                            reviews.map(r => (
                                <div key={r.id} className="mb-4 pb-4 border-bottom border-secondary">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="fw-bold fs-5 text-primary">{r.name}</span>
                                        <span className="text-secondary small">{r.date}</span>
                                    </div>
                                    <div className="text-warning mb-2">
                                        {[...Array(r.rating)].map((_, i) => <FaStar key={i} />)}
                                    </div>
                                    <p className="text-secondary-emphasis italic">"{r.comment}"</p>
                                </div>
                            ))
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Product;