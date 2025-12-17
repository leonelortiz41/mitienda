import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaUserCircle, FaQuestionCircle } from 'react-icons/fa';
import logo from "../assets/mitienda.svg";

const NavigationBar = () => {
    const [cartCount, setCartCount] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const location = useLocation(); // Para saber qué link marcar como activo

    const getCartCount = useCallback(() => {
        try {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            return cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        } catch { return 0; }
    }, []);

    // Sincronización proactiva sin setInterval
    useEffect(() => {
        const updateCount = () => setCartCount(getCartCount());
        
        updateCount(); // Carga inicial

        // Escucha cambios de otras pestañas y de nuestra propia app
        window.addEventListener('storage', updateCount);
        window.addEventListener('cartUpdated', updateCount); 
        
        // Efecto visual al hacer scroll
        const handleScroll = () => setIsScrolling(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('storage', updateCount);
            window.removeEventListener('cartUpdated', updateCount);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [getCartCount]);

    return (
        <Navbar 
            expand="lg" 
            fixed="top"
            variant="dark"
            className={`transition-all py-2 ${
                isScrolling 
                ? 'bg-dark-glass shadow-lg py-1' 
                : 'bg-transparent'
            }`}
            style={{ 
                backdropFilter: isScrolling ? 'blur(10px)' : 'none',
                transition: 'all 0.3s ease-in-out'
            }}
        >
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                    <img src={logo} alt="Logo" height="35" className="me-2 rounded-circle bg-primary p-1" />
                    <span className="fw-black text-white tracking-tighter">TECH<span className="text-primary">STORE</span></span>
                </Navbar.Brand>
                
                <Navbar.Toggle className="border-0 shadow-none" aria-controls="nav-content" />
                
                <Navbar.Collapse id="nav-content">
                    <Nav className="ms-auto gap-2 align-items-center">
                        <Nav.Link as={Link} to="/help" active={location.pathname === '/help'} className="nav-link-glass">
                            <FaQuestionCircle className="me-1" /> Ayuda
                        </Nav.Link>
                        
                        <Nav.Link as={Link} to="/order-history" active={location.pathname === '/order-history'} className="nav-link-glass">
                            <FaUserCircle className="me-1" /> Mis Compras
                        </Nav.Link>

                        <div className="vr d-none d-lg-block mx-2 text-secondary"></div>

                        <Nav.Link 
                            as={Link} 
                            to="/cart" 
                            className="cart-icon-container"
                        >
                            <div className="position-relative p-2 bg-primary-soft rounded-circle">
                                <FaShoppingCart size={20} className="text-white" />
                                {cartCount > 0 && (
                                    <Badge 
                                        pill 
                                        bg="danger" 
                                        className="position-absolute top-0 start-100 translate-middle badge-bounce shadow-sm"
                                    >
                                        {cartCount}
                                    </Badge>
                                )}
                            </div>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;