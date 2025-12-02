import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { FaCartPlus, FaEye, FaTags } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import productsData from '../produtos.json';

// Se utiliza un componente Toast/Notification externo en un proyecto real.
// Para simplificar, aquí usaremos un estado de alerta simple dentro del componente.

const ProductList = ({ selectedCategory }) => {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [notification, setNotification] = useState(null);

    // --- Lógica de Filtrado ---
    useEffect(() => {
        // Aseguramos que los precios sean tratados como números
        const productsWithNumbers = productsData.map(p => ({
            ...p,
            price: Number(p.price),
            salePrice: Number(p.salePrice) || Number(p.price), // Asegura salePrice si está en oferta
        }));

        if (selectedCategory === 'Todos') {
            setFilteredProducts(productsWithNumbers);
        } else {
            setFilteredProducts(productsWithNumbers.filter(product => product.category === selectedCategory));
        }
    }, [selectedCategory]);

    // --- Lógica del Carrito (Optimizado con useCallback) ---
    const addToCart = useCallback((product) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const productIndex = cart.findIndex(item => item.id === product.id);
        
        let message = '';
        if (productIndex >= 0) {
            cart[productIndex].quantity += 1;
            message = `¡Otra unidad de **${product.name}** añadida al carrito!`;
        } else {
            cart.push({ ...product, quantity: 1 });
            message = `**${product.name}** ha sido añadido al carrito.`;
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Mostrar notificación de éxito
        setNotification({ 
            message: message, 
            variant: 'success' 
        });

        // Ocultar la notificación después de 3 segundos
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
        <Container fluid className="px-md-5">
            <NotificationAlert />
            
            <Row className="justify-content-center">
                {filteredProducts.length === 0 ? (
                    <Col className="text-center mt-5">
                        <Alert variant="warning">
                            No hay productos disponibles en la categoría **"{selectedCategory}"**.
                        </Alert>
                    </Col>
                ) : (
                    filteredProducts.map(product => (
                        <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                            <Card className="product-card h-100 d-flex flex-column">
                                <div className="position-relative">
                                    <Card.Img 
                                        variant="top" 
                                        src={product.image} 
                                        alt={product.name} 
                                        className="card-img-top" 
                                    />
                                    {/* Etiqueta de Oferta destacada */}
                                    {product.onSale && (
                                        <Badge 
                                            bg="danger" 
                                            className="position-absolute top-0 end-0 m-2 p-2 fw-bold"
                                        >
                                            <FaTags className="me-1" /> ¡Oferta!
                                        </Badge>
                                    )}
                                </div>
                                
                                <Card.Body className="d-flex flex-column align-items-center justify-content-between flex-grow-1 p-3">
                                    <div className="text-center mb-3">
                                        <Card.Title className="fw-bold">{product.name}</Card.Title>
                                        <Card.Text className="text-secondary small">{product.description}</Card.Text>
                                    </div>

                                    {/* Precios */}
                                    <Card.Text className="mb-3">
                                        {product.onSale ? (
                                            <>
                                                <span className="text-muted text-decoration-line-through me-2 fs-6">
                                                    ${product.price.toFixed(2)}
                                                </span>
                                                <strong className="text-accent fs-4">
                                                    ${product.salePrice.toFixed(2)}
                                                </strong>
                                            </>
                                        ) : (
                                            <strong className="text-accent fs-4">
                                                ${product.price.toFixed(2)}
                                            </strong>
                                        )}
                                    </Card.Text>

                                    {/* Botones de Acción */}
                                    <div className="d-flex justify-content-center w-100">
                                        <Button
                                            variant="primary"
                                            onClick={() => addToCart(product)}
                                            className="me-2 fw-bold"
                                            aria-label="Añadir al Carrito"
                                        >
                                            <FaCartPlus className="me-1" /> Añadir
                                        </Button>
                                        <Button
                                            as={Link}
                                            to={`/products/${product.id}`}
                                            variant="outline-secondary"
                                            title="Ver Detalles"
                                            aria-label={`Ver detalles de ${product.name}`}
                                        >
                                            <FaEye />
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>
        </Container>
    );
}

export default ProductList;

/* * Nota: Para que el NotificationAlert funcione correctamente, necesitarás el siguiente CSS en App.css:
* .fixed-top-alert {
* position: fixed;
* top: 15px;
* left: 50%;
* transform: translateX(-50%);
* z-index: 2000; 
* min-width: 300px;
* max-width: 90%;
* }
*/