import React, { useMemo } from 'react';
import { Container, Row, Col, Card, Accordion, ListGroup } from 'react-bootstrap';
// Se importan íconos para mejorar la presentación
import { FaQuestionCircle, FaShoppingCart, FaShippingFast, FaUndo, FaHeadset, FaCreditCard } from 'react-icons/fa';

const Help = () => {
    // 1. Datos centralizados de las Preguntas Frecuentes
    const faqData = useMemo(() => [
        {
            id: 'pago',
            icon: <FaCreditCard />,
            question: '¿Qué métodos de pago aceptan?',
            answer: (
                <>
                    Aceptamos las principales tarjetas de crédito y débito (**Visa, MasterCard, Amex**). También puedes pagar de forma segura a través de **PayPal**. Todos los pagos son procesados a través de una plataforma cifrada.
                </>
            )
        },
        {
            id: 'compra',
            icon: <FaShoppingCart />,
            question: '¿Cómo realizo una compra en su tienda?',
            answer: (
                <>
                    Es muy sencillo:
                    <ol className="mt-2">
                        <li>**Navega** por las categorías y selecciona los productos deseados.</li>
                        <li>Haz clic en **"Añadir al Carrito"** (<FaShoppingCart />).</li>
                        <li>Una vez en el carrito, haz clic en **"Proceder al Pago"**.</li>
                        <li>Rellena tus datos de envío y pago en la sección **Checkout**.</li>
                        <li>Confirma tu pedido. ¡Recibirás un email de confirmación!</li>
                    </ol>
                </>
            )
        },
        {
            id: 'envio',
            icon: <FaShippingFast />,
            question: '¿Cuáles son los tiempos y costos de envío?',
            answer: (
                <>
                    El tiempo de envío estándar es de **3 a 7 días hábiles**. Los costos de envío varían según tu ubicación. Ofrecemos **envío gratuito** para pedidos superiores a $100. Los detalles exactos se mostrarán en el Checkout.
                </>
            )
        },
        {
            id: 'devolucion',
            icon: <FaUndo />,
            question: '¿Puedo devolver un producto y cuál es la política?',
            answer: (
                <>
                    Sí, aceptamos devoluciones sin problemas. Tienes **30 días** naturales desde la recepción del pedido para solicitar una devolución. El producto debe estar en su estado original, sin usar y con las etiquetas puestas. Para iniciar una devolución, contáctanos por email.
                </>
            )
        },
        {
            id: 'contacto',
            icon: <FaHeadset />,
            question: '¿Cómo puedo contactar con atención al cliente?',
            answer: (
                <>
                    Estamos listos para ayudarte. Puedes contactarnos de las siguientes maneras:
                    <ListGroup className="mt-2 text-dark">
                        <ListGroup.Item className="text-secondary bg-transparent border-0">
                            **Email:** contacto@mitienda.com
                        </ListGroup.Item>
                        <ListGroup.Item className="text-secondary bg-transparent border-0">
                            **Teléfono:** +123 456 7890 (Horario: Lun-Vie, 9:00 - 18:00)
                        </ListGroup.Item>
                    </ListGroup>
                </>
            )
        },
    ], []); // useMemo para asegurar que los datos no se recalculen innecesariamente

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col lg={10} xl={8}>
                    <h1 className="mb-4 text-center text-white">
                        <FaQuestionCircle className="me-2 text-accent" /> Centro de Ayuda
                    </h1>
                    <p className="text-center text-secondary mb-5">
                        Encuentra respuestas a las preguntas más comunes sobre compras, envíos y devoluciones.
                    </p>

                    {/* 2. Uso del componente Accordion para las Preguntas Frecuentes */}
                    <Accordion defaultActiveKey="compra" className="shadow-lg">
                        <Card className="bg-dark border-secondary">
                            <Card.Header className="bg-dark border-secondary">
                                <Card.Title className="text-accent fs-5">Preguntas Frecuentes (FAQ)</Card.Title>
                            </Card.Header>
                            <Card.Body className="p-0">
                                {faqData.map((item, index) => (
                                    <Accordion.Item eventKey={item.id} key={item.id} className="bg-dark border-secondary">
                                        {/* Título de la pregunta (Toggle) */}
                                        <Accordion.Header className="bg-secondary text-white">
                                            <strong className="fs-6 me-2 text-accent">{item.icon}</strong> {item.question}
                                        </Accordion.Header>
                                        
                                        {/* Contenido de la respuesta (Collapse) */}
                                        <Accordion.Body className="text-light py-3 px-4">
                                            {item.answer}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Card.Body>
                        </Card>
                    </Accordion>
                    
                    <div className="text-center mt-5 p-4 border rounded bg-dark-subtle">
                        <h4 className="text-white">¿Necesitas ayuda adicional?</h4>
                        <p className="text-secondary">Si tu pregunta no ha sido respondida, contáctanos directamente.</p>
                        <a href="mailto:contacto@mitienda.com" className="btn btn-primary fw-bold">
                            Enviar un Email
                        </a>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Help;