// NavigationBar.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import logo from "../assets/mitienda.svg";
// Importar estilos de App.css o definir estilos inline si es necesario

const NavigationBar = () => {
    const [cartCount, setCartCount] = useState(0);

    // Función para calcular la cantidad total de artículos en el carrito
    const getCartCount = useCallback(() => {
        try {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            // Sumar las cantidades (quantity) de todos los productos
            const total = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
            return total;
        } catch (error) {
            console.error("Error al leer el carrito de localStorage:", error);
            return 0;
        }
    }, []);

    // 1. Efecto para inicializar el contador al montar el componente
    useEffect(() => {
        setCartCount(getCartCount());
    }, [getCartCount]);

    // 2. Efecto para escuchar los cambios en el localStorage (para que el contador 
    // se actualice automáticamente cuando se añaden ítems desde ProductList, por ejemplo)
    useEffect(() => {
        const handleStorageChange = (e) => {
            // Solo actualiza si el cambio afecta la clave 'cart'
            if (e.key === 'cart' || !e.key) { 
                setCartCount(getCartCount());
            }
        };

        // Escucha el evento 'storage' para cambios en la misma ventana
        window.addEventListener('storage', handleStorageChange);
        
        // También verifica los cambios en el componente (necesario cuando los cambios son internos/programáticos)
        // Usamos un intervalo de sondeo como fallback, aunque 'storage' es el método preferido.
        const intervalId = setInterval(() => {
            const currentCount = getCartCount();
            if (currentCount !== cartCount) {
                 setCartCount(currentCount);
            }
        }, 1000); // Sondeo cada segundo

        // Función de limpieza
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(intervalId);
        };
    }, [getCartCount, cartCount]); // Dependencia en cartCount para evitar bucles de sondeo innecesarios

    return (
        <Navbar 
            bg="dark" 
            variant="dark" 
            expand="lg" 
            className="custom-navbar shadow-lg sticky-top" // Añadimos shadow y sticky-top
        >
            <Container fluid className="px-md-5">
                <Navbar.Brand as={Link} to="/">
                    <img src={logo} className='logo me-2' alt="Mi Tienda" height="40" />
                    <span className="fw-bold text-accent d-none d-sm-inline">Mi Tienda</span>
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        {/* Enlaces de navegación principales */}
                        <Nav.Link as={Link} to="/help" className="nav-link-custom mx-lg-2">Ayuda</Nav.Link>
                        
                        {/* Enlace a Mis Compras (simulando un usuario autenticado) */}
                        <Nav.Link as={Link} to="/order-history" className="nav-link-custom mx-lg-2">
                            <FaUserCircle className="me-1" /> Mis Compras
                        </Nav.Link>

                        {/* Enlace del Carrito con Contador (Destacado) */}
                        <Nav.Link 
                            as={Link} 
                            to="/cart" 
                            className="nav-link-custom mx-lg-2 position-relative"
                        >
                            <FaShoppingCart className="fs-5" /> 
                            <span className="ms-1 d-lg-none">Carrito</span> 
                            
                            {/* Insignia con el número de ítems */}
                            {cartCount > 0 && (
                                <Badge 
                                    pill 
                                    bg="danger" 
                                    className="position-absolute top-0 start-100 translate-middle"
                                    style={{ fontSize: '0.7em', padding: '0.4em 0.6em' }}
                                >
                                    {cartCount}
                                    <span className="visually-hidden">items en el carrito</span>
                                </Badge>
                            )}
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;