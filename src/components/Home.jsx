import React, { useState, useMemo, useRef } from 'react';
import { Container, Row, Col, Nav, Button, Carousel, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProductList from './ProductList';
import Footer from './Footer';
import gorrasBanner from '../assets/gorras.webp';
import camisasBanner from '../assets/camisaazul.webp';

// Mover constantes fuera del componente para evitar re-renderizados innecesarios
const CATEGORIES = ['Todos', 'Remeras', 'Camisas', 'Pantalones', 'Gorras', 'Accesorios'];

const Home = () => {
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const productsRef = useRef(null); // Para scroll suave

    const carouselItems = useMemo(() => [
        { id: 1, src: gorrasBanner, alt: "Gorras", caption: "Estilo urbano", category: "Gorras", badge: "Nuevo" },
        { id: 2, src: camisasBanner, alt: "Camisas", caption: "Elegancia Casual", category: "Camisas", badge: "20% OFF" },
    ], []);

    const handleSelect = (category) => {
        setSelectedCategory(category);
        // Scroll suave hacia los productos al filtrar
        productsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <Container fluid className="px-0 bg-dark text-white" style={{ minHeight: '100vh' }}>
            {/* Carrusel con Overlay mejorado */}
            <Carousel fade interval={5000} className="shadow-lg">
                {carouselItems.map((item) => (
                    <Carousel.Item key={item.id} style={{ height: '70vh' }}>
                        <img
                            className="d-block w-100 h-100"
                            src={item.src}
                            alt={item.alt}
                            style={{ objectFit: 'cover', filter: 'brightness(0.6)' }}
                        />
                        <Carousel.Caption className="mb-5">
                            {item.badge && <Badge bg="danger" className="mb-2">{item.badge}</Badge>}
                            <h1 className="display-4 fw-bold">{item.caption}</h1>
                            <Button 
                                variant="primary" 
                                size="lg"
                                onClick={() => handleSelect(item.category)}
                                className="mt-3 px-4 shadow"
                            >
                                Comprar {item.category}
                            </Button>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>

            <Container className="mt-5">
                {/* Navegación Refinada */}
                <section className="mb-5">
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                        <h2 className="fw-light">Nuestras <span className="fw-bold">Colecciones</span></h2>
                        <Button variant="outline-warning" as={Link} to="/offers">🔥 Ofertas Imperdibles</Button>
                    </div>
                    
                    <Nav variant="pills" className="justify-content-center bg-secondary-subtle p-2 rounded-pill shadow-sm">
                        {CATEGORIES.map((category) => (
                            <Nav.Item key={category}>
                                <Nav.Link
                                    active={selectedCategory === category}
                                    onClick={() => handleSelect(category)}
                                    className="rounded-pill px-4 text-dark fw-bold"
                                    style={{ cursor: 'pointer' }}
                                >
                                    {category}
                                </Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>
                </section>

                {/* Lista de Productos con Referencia para Scroll */}
                <div ref={productsRef} className="pb-5">
                    <div className="d-flex align-items-center mb-4">
                        <div className="flex-grow-1 border-bottom border-secondary"></div>
                        <h4 className="mx-3 text-uppercase small tracking-widest">
                            Mostrando: <span className="text-primary">{selectedCategory}</span>
                        </h4>
                        <div className="flex-grow-1 border-bottom border-secondary"></div>
                    </div>
                    
                    <ProductList selectedCategory={selectedCategory} />
                </div>
            </Container>

            <Footer />
        </Container>
    );
};

export default Home;