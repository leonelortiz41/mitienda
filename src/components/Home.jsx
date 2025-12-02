// Home.js
import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Nav, Button, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProductList from './ProductList';
import Footer from './Footer';
// Limpieza: Se eliminan las importaciones de imágenes locales si se cargan desde una fuente externa o ProductList.
// Si las imágenes del carrusel se mantienen aquí, se renombran para claridad.
import gorrasBanner from '../assets/gorras.webp';
import camisasBanner from '../assets/camisas.jpg';
import remerasBanner from '../assets/remeras.png';

// Definición de categorías para evitar repetición en el menú
const CATEGORIES = ['Todos', 'Remeras', 'Camisas', 'Pantalones', 'Gorras', 'Accesorios'];

const Home = () => {
    // 1. Estado para la categoría seleccionada
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    // 2. Data del Carrusel (se centraliza para fácil manejo)
    const carouselItems = useMemo(() => [
        { src: gorrasBanner, alt: "Nueva Colección de Gorras", caption: "¡Nuevas Gorras! Estilo urbano al mejor precio.", category: "Gorras" },
        { src: camisasBanner, alt: "Camisas Casuales y Formales", caption: "Descubre la elegancia. 20% OFF en todas las Camisas.", category: "Camisas" },
        { src: remerasBanner, alt: "Remeras de algodón premium", caption: "Comodidad y calidad. Explora nuestra línea de Remeras.", category: "Remeras" },
    ], []);

    // 3. Función de manejo de selección (ya estaba bien)
    const handleSelect = (category) => {
        setSelectedCategory(category);
    };

    return (
        <Container className="p-0">
            {/* ---------------------------------------------------- */}
            {/* 🖼️ SECCIÓN DE CARRUSEL (BANNER PRINCIPAL) */}
            {/* ---------------------------------------------------- */}
            <Row className="mb-4">
                <Col>
                    <Carousel 
                        controls={true} 
                        indicators={true} // Se activan los indicadores para mejor UX
                        interval={4000} 
                        className="shadow-lg"
                    >
                        {carouselItems.map((item, index) => (
                            <Carousel.Item key={index}>
                                <div style={{ height: '400px', overflow: 'hidden' }}>
                                    <img
                                        className="d-block w-100 h-100"
                                        src={item.src}
                                        alt={item.alt}
                                        style={{ objectFit: 'cover' }} // Asegura que la imagen cubra el área
                                    />
                                </div>
                                {/* Leyendas del Carrusel */}
                                <Carousel.Caption className="bg-dark-overlay p-3 rounded-top">
                                    <h3 className="fw-bold text-white">{item.caption}</h3>
                                    <Button 
                                        variant="primary" 
                                        as={Link} 
                                        to="/products"
                                        onClick={() => handleSelect(item.category)}
                                        className="mt-2"
                                    >
                                        Ver {item.category} Ahora
                                    </Button>
                                </Carousel.Caption>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Col>
            </Row>

            {/* ---------------------------------------------------- */}
            {/* 🧭 SECCIÓN DE NAVEGACIÓN Y FILTRADO */}
            {/* ---------------------------------------------------- */}
            <Row className="mb-4">
                <Col>
                    <h2 className="text-white text-center mb-3">🛍️ Explorar Productos</h2>
                    <Nav 
                        variant="pills" // Se cambia a 'pills' para un look más moderno que 'tabs'
                        className='nav-home justify-content-center custom-navbar p-2 rounded' 
                    >
                        {/* Mapeo de Categorías (UX mejorada) */}
                        {CATEGORIES.map((category) => (
                            <Nav.Item key={category} className="mx-1 my-1">
                                <Nav.Link
                                    eventKey={category}
                                    active={selectedCategory === category}
                                    onClick={() => handleSelect(category)}
                                    className={`btn-navHome fw-bold ${selectedCategory === category ? 'active' : ''}`}
                                >
                                    {category}
                                </Nav.Link>
                            </Nav.Item>
                        ))}
                        
                        {/* Botón de Ofertas */}
                        <Nav.Item className="ms-3 my-1">
                            <Button 
                                variant="outline-primary" // Se usa un estilo outline para destacarlo de las categorías
                                as={Link} 
                                to="/offers"
                                className="fw-bold px-3"
                            >
                                🔥 Ver Ofertas
                            </Button>
                        </Nav.Item>
                    </Nav>
                </Col>
            </Row>
            
            {/* ---------------------------------------------------- */}
            {/* 📋 SECCIÓN DE LISTA DE PRODUCTOS */}
            {/* ---------------------------------------------------- */}
            <Row>
                <Col>
                    <h3 className="text-white mt-4 mb-4">
                        Mostrando: <strong className="text-accent">{selectedCategory}</strong>
                    </h3>
                    <ProductList selectedCategory={selectedCategory} />
                </Col>
            </Row>

            {/* ---------------------------------------------------- */}
            {/* 🦶 PIE DE PÁGINA */}
            {/* ---------------------------------------------------- */}
            <Footer />
        </Container>
    );
};

export default Home;

// Nota: Si el archivo ProductList aún no existe, se necesitaría crearlo. 
// Además, la clase CSS .bg-dark-overlay debe ser añadida a App.css para el carrusel.
/*
.bg-dark-overlay {
    background-color: rgba(0, 0, 0, 0.5); 
    padding: 1rem;
}
.text-accent { 
    color: var(--color-accent); 
}
*/