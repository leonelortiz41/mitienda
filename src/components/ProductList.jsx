import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Toast, ToastContainer } from 'react-bootstrap';
import { FaCartPlus, FaEye, FaTags } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import productsData from '../produtos.json';

// --- Sub-componente Memoizado para evitar re-renders innecesarios ---
const ProductCard = React.memo(({ product, onAddToCart }) => (
    <Card className="product-card h-100 shadow-sm border-0 transition-hover">
        <div className="overflow-hidden position-relative">
            <Card.Img 
                variant="top" 
                src={product.image} 
                className="img-zoom"
                loading="lazy" // Optimización de carga
            />
            {product.onSale && (
                <Badge bg="danger" className="position-absolute top-0 end-0 m-3 px-3 py-2">
                    <FaTags className="me-1" /> OFERTA
                </Badge>
            )}
        </div>
        
        <Card.Body className="d-flex flex-column text-center">
            <Card.Title className="text-truncate fw-bold">{product.name}</Card.Title>
            <Card.Text className="text-muted small flex-grow-1">
                {product.description.substring(0, 60)}...
            </Card.Text>

            <div className="my-3">
                {product.onSale ? (
                    <div>
                        <span className="text-decoration-line-through text-muted me-2 small">${product.price.toFixed(2)}</span>
                        <span className="text-primary fw-bold fs-4">${product.salePrice.toFixed(2)}</span>
                    </div>
                ) : (
                    <span className="text-primary fw-bold fs-4">${product.price.toFixed(2)}</span>
                )}
            </div>

            <div className="d-grid gap-2 d-flex justify-content-center">
                <Button variant="primary" onClick={() => onAddToCart(product)} className="flex-grow-1 fw-bold">
                    <FaCartPlus className="me-2" /> Añadir
                </Button>
                <Button as={Link} to={`/products/${product.id}`} variant="outline-secondary">
                    <FaEye />
                </Button>
            </div>
        </Card.Body>
    </Card>
));

const ProductList = ({ selectedCategory }) => {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    // Procesamos los datos solo cuando cambian los productos originales
    const processedProducts = useMemo(() => {
        return productsData.map(p => ({
            ...p,
            price: Number(p.price),
            salePrice: Number(p.salePrice) || Number(p.price),
        }));
    }, []);

    // Filtrado eficiente
    const filteredProducts = useMemo(() => {
        if (selectedCategory === 'Todos') return processedProducts;
        return processedProducts.filter(p => p.category === selectedCategory);
    }, [selectedCategory, processedProducts]);

    const addToCart = useCallback((product) => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const index = cart.findIndex(item => item.id === product.id);

        if (index >= 0) {
            cart[index].quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        
        // --- CLAVE: Notificar a otros componentes (como la Navbar) ---
        window.dispatchEvent(new Event('storage')); 
        
        setToastMessage(`¡${product.name} listo en el carrito!`);
        setShowToast(true);
    }, []);

    return (
        <Container fluid className="px-md-5 my-5">
            {/* Notificación estilo Toast (más profesional que una Alert fija) */}
            <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 3000 }}>
                <Toast show={showToast} onClose={() => setShowToast(false)} delay={2500} autohide bg="dark" className="text-white">
                    <Toast.Header closeButton={false} className="bg-primary text-white">
                        <strong className="me-auto">Tienda Online</strong>
                    </Toast.Header>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>

            <Row className="g-4">
                {filteredProducts.length === 0 ? (
                    <Col className="text-center py-5">
                        <Alert variant="light" className="border-0 shadow-sm">
                            No encontramos productos en la categoría <strong>{selectedCategory}</strong>.
                        </Alert>
                    </Col>
                ) : (
                    filteredProducts.map(product => (
                        <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
                            <ProductCard product={product} onAddToCart={addToCart} />
                        </Col>
                    ))
                )}
            </Row>
        </Container>
    );
};

export default ProductList;