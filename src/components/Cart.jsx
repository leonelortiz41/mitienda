import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Alert, Badge } from 'react-bootstrap';
import { FaTrash, FaShoppingCart, FaTimes, FaMoneyBillWave } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Supongamos que esta función obtiene los productos del localStorage
const getCartItems = () => JSON.parse(localStorage.getItem('cart')) || [];

const Cart = () => {
    const [cartItems, setCartItems] = useState(getCartItems());

    // --- Lógica de Manejo del Carrito ---
    const updateLocalStorage = useCallback((newItems) => {
        setCartItems(newItems);
        localStorage.setItem('cart', JSON.stringify(newItems));
        // Disparar evento de storage para actualizar la Navbar
        window.dispatchEvent(new Event('storage')); 
    }, []);

    const handleQuantityChange = (id, change) => {
        const newItems = cartItems.map(item => {
            if (item.id === id) {
                const newQuantity = item.quantity + change;
                return { ...item, quantity: Math.max(1, newQuantity) }; // Mínimo 1
            }
            return item;
        });
        updateLocalStorage(newItems);
    };

    const handleRemoveItem = (id) => {
        const newItems = cartItems.filter(item => item.id !== id);
        updateLocalStorage(newItems);
    };

    // --- Cálculo de Totales ---
    const { subtotal, totalItems } = useMemo(() => {
        const total = cartItems.reduce((sum, item) => {
            const price = item.onSale ? item.salePrice : item.price;
            return sum + (price * item.quantity);
        }, 0);
        const itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        return { subtotal: total, totalItems: itemsCount };
    }, [cartItems]);

    // --- Renderizado ---
    if (cartItems.length === 0) {
        return (
            <Container className="my-5 text-center text-light">
                <FaShoppingCart className="display-1 text-secondary mb-3" />
                <h2 className="text-white">Tu Carrito está vacío</h2>
                <p className="text-secondary">Parece que no has añadido nada todavía. ¡Explora nuestros productos!</p>
                <Button as={Link} to="/" variant="primary" className="mt-3 fw-bold">
                    Ir a la Tienda
                </Button>
            </Container>
        );
    }

    return (
        <Container className="my-5 text-light">
            <h1 className="text-center mb-5">
                <FaShoppingCart className="me-3 text-accent" /> Tu Carrito de Compras
                <Badge bg="secondary" className="ms-3 fs-5">{totalItems}</Badge>
            </h1>

            <Row>
                {/* Columna de Productos */}
                <Col lg={8} className="mb-4">
                    {cartItems.map(item => {
                        const unitPrice = item.onSale ? item.salePrice : item.price;
                        const itemSubtotal = unitPrice * item.quantity;
                        
                        return (
                            <Card key={item.id} className="mb-4 bg-light-dark border-secondary shadow-sm">
                                <Card.Body className="d-flex flex-column flex-md-row align-items-center p-3">
                                    
                                    {/* Imagen y Nombre */}
                                    <div className="d-flex align-items-center flex-grow-1 me-md-4 mb-3 mb-md-0">
                                        <img 
                                            src={item.image} 
                                            alt={item.name} 
                                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                                            className="me-3 border border-secondary"
                                        />
                                        <div>
                                            <h5 className="mb-1 text-white fw-bold">{item.name}</h5>
                                            <p className="mb-0 text-secondary">${unitPrice.toFixed(2)} / unidad</p>
                                        </div>
                                    </div>

                                    {/* Controles de Cantidad */}
                                    <div className="d-flex align-items-center mb-3 mb-md-0 mx-md-3">
                                        <InputGroup size="sm" style={{ width: '120px' }}>
                                            <Button 
                                                variant="outline-secondary" 
                                                onClick={() => handleQuantityChange(item.id, -1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </Button>
                                            <Form.Control 
                                                type="text" 
                                                className="text-center bg-dark text-light border-secondary"
                                                value={item.quantity} 
                                                readOnly
                                            />
                                            <Button 
                                                variant="outline-secondary" 
                                                onClick={() => handleQuantityChange(item.id, 1)}
                                            >
                                                +
                                            </Button>
                                        </InputGroup>
                                    </div>
                                    
                                    {/* Subtotal y Eliminar */}
                                    <div className="d-flex align-items-center ms-md-auto">
                                        <strong className="me-3 text-accent fs-5" style={{ minWidth: '80px' }}>
                                            ${itemSubtotal.toFixed(2)}
                                        </strong>
                                        <Button 
                                            variant="outline-danger" 
                                            size="sm" 
                                            onClick={() => handleRemoveItem(item.id)}
                                            title="Eliminar producto"
                                        >
                                            <FaTimes />
                                        </Button>
                                    </div>

                                </Card.Body>
                            </Card>
                        );
                    })}
                </Col>

                {/* Columna de Resumen de Pago (Sticker para pantallas grandes) */}
                <Col lg={4}>
                    <Card className="bg-light-dark border-secondary shadow-lg sticky-top" style={{ top: '80px' }}>
                        <Card.Header className="bg-dark border-secondary">
                            <h4 className="mb-0 text-white">Resumen del Pedido</h4>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex justify-content-between mb-3 text-secondary">
                                <span>Subtotal ({totalItems} {totalItems === 1 ? 'artículo' : 'artículos'})</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>

                            {/* Fila de Envío (simulado) */}
                            <div className="d-flex justify-content-between mb-4 text-success">
                                <span>Envío Estándar</span>
                                <span>GRATIS</span>
                            </div>
                            
                            <hr className="border-secondary" />

                            {/* Total Final */}
                            <div className="d-flex justify-content-between align-items-center my-3">
                                <h4 className="mb-0 text-white">Total Final</h4>
                                <h3 className="mb-0 text-accent fw-bold">${subtotal.toFixed(2)}</h3>
                            </div>

                            <Button 
                                as={Link} 
                                to="/checkout" 
                                variant="success" 
                                className="w-100 py-2 mt-3 fw-bold fs-5"
                            >
                                <FaMoneyBillWave className="me-2" /> Proceder al Pago
                            </Button>
                            
                            <p className="text-center text-secondary small mt-3">Los impuestos se calcularán en el checkout.</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Cart;