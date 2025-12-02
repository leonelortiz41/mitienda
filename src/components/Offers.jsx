import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { FaCartPlus, FaEye, FaBolt, FaTags } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import productsData from '../produtos.json';

const Offers = () => {
    const [offers, setOffers] = useState([]);
    const [notification, setNotification] = useState(null);

    // --- Lógica de Carga y Filtrado ---
    useEffect(() => {
        // Cargar y sanitizar los productos en oferta
        const onSaleProducts = productsData
            .filter(product => product.onSale)
            .map(p => ({
                ...p,
                price: Number(p.price),
                salePrice: Number(p.salePrice) || Number(p.price),
            }));
        setOffers(onSaleProducts);
    }, []);

    // --- Lógica del Carrito (Reutilizando el patrón optimizado) ---
    const addToCart = useCallback((product) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const productIndex = cart.findIndex(item => item.id === product.id);

        let message = '';
        if (productIndex >= 0) {
            cart[productIndex].quantity += 1;
            message = `¡Otra unidad de **${product.name}** añadida!`;
        } else {
            cart.push({ ...product, quantity: 1 });
            message = `**${product.name}** (¡En Oferta!) añadido al carrito.`;
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('storage')); // Notificar a la Navbar

        // Mostrar notificación de éxito
        setNotification({ 
            message: message, 
            variant: 'success' 
        });
        setTimeout(() => setNotification(null), 3000);
    }, []);

    // --- Componente de Notificación ---
    const NotificationAlert = () => (
        notification && (
            <Alert 
                variant={notification.variant} 
                onClose={() => setNotification(null)} 
                dismissible 
                className="fixed-top-alert shadow-lg"
            >
                <div dangerouslySetInnerHTML={{ __html: notification.message }} />
            </Alert>
        )
    );

    // --- Renderizado Principal ---
    return (
        <Container className="my-5 text-light">
            <NotificationAlert />
            
            <h1 className="text-center mb-5 fw-bolder">
                <FaBolt className="me-2 text-warning" /> ¡Ofertas Relámpago!
            </h1>

            {offers.length === 0 ? (
                <Row className="justify-content-center">
                    <Col md={8} className="text-center">
                        <Alert variant="info" className="bg-dark-subtle text-white border-0">
                            Actualmente no hay productos en oferta. Vuelve pronto para ver las novedades.
                        </Alert>
                    </Col>
                </Row>
            ) : (
                <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                    {offers.map(product => {
                        const discount = ((1 - product.salePrice / product.price) * 100).toFixed(0);

                        return (
                            <Col key={product.id}>
                                <Card className="product-card h-100 bg-light-dark border-secondary">
                                    <div className="position-relative overflow-hidden">
                                        <Card.Img 
                                            variant="top" 
                                            src={product.image} 
                                            alt={product.name} 
                                            className="card-img-top"
                                            style={{ height: '250px', objectFit: 'cover' }}
                                        />
                                        
                                        {/* Insignia de Descuento (Destacado) */}
                                        <Badge
                                            bg="warning"
                                            className="position-absolute top-0 start-0 m-3 p-2 fw-bold text-dark fs-6"
                                        >
                                            <FaTags className="me-1" /> {discount}% OFF
                                        </Badge>
                                    </div>
                                    
                                    <Card.Body className="d-flex flex-column justify-content-between p-3">
                                        <div>
                                            <Card.Title className="fw-bold text-white mb-1">{product.name}</Card.Title>
                                            <Card.Text className="text-secondary small mb-3">{product.category}</Card.Text>

                                            {/* Precios (Destacados) */}
                                            <div className="mb-3">
                                                <span className="text-muted text-decoration-line-through me-2 fs-6">
                                                    ${product.price.toFixed(2)}
                                                </span>
                                                <strong className="text-danger fs-4">
                                                    ${product.salePrice.toFixed(2)}
                                                </strong>
                                            </div>
                                        </div>

                                        {/* Botones de Acción */}
                                        <div className="d-flex justify-content-between mt-auto">
                                            <Button
                                                variant="danger" // Usamos danger para llamar la atención en ofertas
                                                onClick={() => addToCart(product)}
                                                className="flex-grow-1 me-2 fw-bold"
                                            >
                                                <FaCartPlus className="me-1" /> Comprar
                                            </Button>
                                            <Button
                                                as={Link}
                                                to={`/products/${product.id}`}
                                                variant="outline-secondary"
                                                title="Ver Detalles"
                                            >
                                                <FaEye />
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}
        </Container>
    );
}

export default Offers;