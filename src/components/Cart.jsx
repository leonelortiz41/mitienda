import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FaTrash, FaShoppingCart, FaMoneyBillWave, FaArrowLeft, FaInfoCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Cart = () => {
    // Nota: En un proyecto real, estos vendrían de un useContext(CartContext)
    const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem('cart')) || []);

    const updateCart = (newItems) => {
        setCartItems(newItems);
        localStorage.setItem('cart', JSON.stringify(newItems));
        window.dispatchEvent(new Event('storage'));
    };

    const handleQuantity = (id, delta) => {
        const updated = cartItems.map(item => 
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        );
        updateCart(updated);
    };

    const removeItem = (id) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
            updateCart(cartItems.filter(item => item.id !== id));
        }
    };

    // Cálculos avanzados para demostrar capacidad analítica
    const totals = useMemo(() => {
        const subtotal = cartItems.reduce((acc, item) => acc + (item.onSale ? item.salePrice : item.price) * item.quantity, 0);
        const savings = cartItems.reduce((acc, item) => {
            return acc + (item.onSale ? (item.price - item.salePrice) * item.quantity : 0);
        }, 0);
        return { subtotal, savings, total: subtotal, count: cartItems.reduce((a, b) => a + b.quantity, 0) };
    }, [cartItems]);

    if (cartItems.length === 0) {
        return (
            <Container className="my-5 text-center py-5 shadow-sm rounded bg-dark border border-secondary">
                <FaShoppingCart size={80} className="text-secondary mb-4 opacity-50" />
                <h2 className="text-white fw-bold">Tu carrito está esperando ser llenado</h2>
                <p className="text-secondary mb-4">¿No sabes por dónde empezar? ¡Mira nuestras últimas ofertas!</p>
                <Button as={Link} to="/" variant="primary" size="lg" className="px-5 fw-bold">
                    Explorar Productos
                </Button>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <div className="d-flex align-items-center mb-4 text-white">
                <Button as={Link} to="/" variant="link" className="text-decoration-none text-secondary p-0 me-3">
                    <FaArrowLeft /> Volver
                </Button>
                <h2 className="mb-0 fw-bold">Cesta de Compras <Badge bg="primary" pill className="ms-2 fs-6">{totals.count}</Badge></h2>
            </div>

            <Row className="g-4">
                <Col lg={8}>
                    {cartItems.map(item => (
                        <Card key={item.id} className="mb-3 bg-dark border-secondary text-white overflow-hidden shadow-hover">
                            <Card.Body className="p-0">
                                <Row className="g-0 align-items-center">
                                    <Col xs={4} md={2}>
                                        <img src={item.image} alt={item.name} className="img-fluid h-100 object-fit-cover" style={{minHeight: '100px'}} />
                                    </Col>
                                    <Col xs={8} md={10} className="p-3">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <h5 className="fw-bold mb-1">{item.name}</h5>
                                                {item.onSale && <Badge bg="danger" className="mb-2">¡Oferta!</Badge>}
                                            </div>
                                            <Button variant="link" className="text-danger p-0 shadow-none" onClick={() => removeItem(item.id)}>
                                                <FaTrash />
                                            </Button>
                                        </div>
                                        
                                        <div className="d-flex justify-content-between align-items-center mt-2 flex-wrap gap-3">
                                            <InputGroup size="sm" style={{ width: '110px' }}>
                                                <Button variant="outline-secondary" onClick={() => handleQuantity(item.id, -1)}>-</Button>
                                                <Form.Control className="bg-transparent text-white text-center border-secondary" value={item.quantity} readOnly />
                                                <Button variant="outline-secondary" onClick={() => handleQuantity(item.id, 1)}>+</Button>
                                            </InputGroup>

                                            <div className="text-end">
                                                {item.onSale && <small className="text-decoration-line-through text-secondary d-block">${(item.price * item.quantity).toFixed(2)}</small>}
                                                <span className="fs-5 fw-bold text-primary">
                                                    ${((item.onSale ? item.salePrice : item.price) * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))}
                </Col>

                {/* Resumen de Compra - Demostrando diseño tipo Dashboard */}
                <Col lg={4}>
                    <Card className="bg-dark border-primary text-white shadow-lg sticky-top" style={{ top: '20px' }}>
                        <Card.Body className="p-4">
                            <h4 className="fw-bold mb-4 border-bottom border-secondary pb-2">Resumen</h4>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-secondary">Subtotal</span>
                                <span>${totals.subtotal.toFixed(2)}</span>
                            </div>
                            {totals.savings > 0 && (
                                <div className="d-flex justify-content-between mb-2 text-success">
                                    <span>Descuento aplicado</span>
                                    <span>-${totals.savings.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="d-flex justify-content-between mb-3 text-secondary">
                                <span>Envío estim. 
                                    <OverlayTrigger overlay={<Tooltip>Envío gratis por compras superiores a $50</Tooltip>}>
                                        <span className="ms-1 cursor-pointer"><FaInfoCircle size={12}/></span>
                                    </OverlayTrigger>
                                </span>
                                <span className="text-success fw-bold">Gratis</span>
                            </div>

                            <hr className="border-secondary" />

                            <div className="d-flex justify-content-between align-items-end mb-4">
                                <h5 className="mb-0 fw-bold">Total</h5>
                                <div className="text-end">
                                    <h3 className="mb-0 fw-bold text-primary">${totals.total.toFixed(2)}</h3>
                                    <small className="text-secondary">IVA incluido</small>
                                </div>
                            </div>

                            <Button as={Link} to="/checkout" variant="primary" size="lg" className="w-100 fw-bold mb-3 shadow">
                                <FaMoneyBillWave className="me-2" /> Finalizar Compra
                            </Button>
                            
                            <div className="text-center">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" height="20" className="me-3 grayscale opacity-50" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" height="15" className="grayscale opacity-50" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Cart;