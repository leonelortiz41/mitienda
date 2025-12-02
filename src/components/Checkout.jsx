import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
// Importa un ícono de Bootstrap (si estás usando react-icons/bs o similar, si no, es opcional)
// import { BsCreditCard2Front, BsFillPinMapFill, BsEnvelope } from 'react-icons/bs'; 

const Checkout = () => {
    // --- ESTADO INICIAL ---
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        address: '',
        city: '',
        zipCode: '',
        cardNumber: '',
        expiryDate: '', // MM/YY
        cvv: '',
    });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('pending'); // pending, loading, success, error
    const navigate = useNavigate();

    // Calcula el precio total (solo para mostrar)
    const totalPrice = useMemo(() => {
        const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
        return storedCartItems.reduce((total, item) => total + Number(item.price) * Number(item.quantity), 0).toFixed(2);
    }, []);

    // --- MANEJO DE CAMBIOS ---
    const handleChange = (e) => {
        const { id, value } = e.target;
        let processedValue = value;

        // Formateo de tarjeta de crédito (opcional pero bueno para UX)
        if (id === 'cardNumber') {
            // Permite solo dígitos y limita a 16 o 19 (con espacios)
            processedValue = value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
        }
        
        // Formateo de fecha de expiración (MM/YY)
        if (id === 'expiryDate') {
            // Permite MM/YY, limitando la longitud e insertando '/'
            processedValue = value.replace(/\D/g, '').slice(0, 4);
            if (processedValue.length > 2) {
                processedValue = processedValue.slice(0, 2) + '/' + processedValue.slice(2, 4);
            }
        }
        
        // Limita CVV a 3 o 4 dígitos
        if (id === 'cvv') {
            processedValue = value.replace(/\D/g, '').slice(0, 4);
        }

        setFormData(prev => ({ ...prev, [id]: processedValue }));
    };

    // --- VALIDACIÓN ---
    const validate = useCallback(() => {
        const newErrors = {};

        // Validaciones de Contacto/Envío
        if (!formData.email) newErrors.email = 'El email es requerido';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido.';
        
        if (!formData.fullName) newErrors.fullName = 'El nombre completo es requerido.';
        if (!formData.address) newErrors.address = 'La dirección es requerida.';
        if (!formData.city) newErrors.city = 'La ciudad es requerida.';
        if (!formData.zipCode) newErrors.zipCode = 'El código postal es requerido.';

        // Validaciones de Pago
        if (!formData.cardNumber || !/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(formData.cardNumber)) {
            newErrors.cardNumber = 'Número de tarjeta inválido (16 dígitos).';
        }
        if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
            newErrors.expiryDate = 'Formato de fecha inválido (MM/YY).';
        } else {
             // Validación de fecha (simplificada: solo verifica que el mes sea válido)
            const [month, year] = formData.expiryDate.split('/').map(Number);
            if (month < 1 || month > 12) {
                newErrors.expiryDate = 'Mes inválido.';
            }
        }
        if (!formData.cvv || !/^\d{3,4}$/.test(formData.cvv)) {
            newErrors.cvv = 'CVV inválido (3 o 4 dígitos).';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    // --- MANEJO DE PAGO ---
    const handleCheckout = async (event) => {
        event.preventDefault();

        if (!validate()) {
            // El desplazamiento a la parte superior podría ser útil para ver errores
            window.scrollTo(0, 0); 
            return;
        }

        setStatus('loading');
        setErrors({});

        // SIMULACIÓN DE PROCESO DE PAGO (Ejecución Asíncrona)
        try {
            // Simular una llamada API de 2 segundos
            await new Promise(resolve => setTimeout(resolve, 2000)); 

            // Simular un pago exitoso
            setStatus('success');
            
            // Limpiar el carrito y datos sensibles
            localStorage.removeItem('cart'); 
            setFormData(prev => ({ 
                ...prev, 
                cardNumber: '', 
                expiryDate: '', 
                cvv: '' 
            })); 

        } catch (error) {
            console.error("Error de procesamiento de pago:", error);
            setStatus('error');
            setErrors({ general: 'Error al procesar el pago. Inténtalo de nuevo.' });
        }
    };
    
    // --- RENDERIZADO ---
    if (status === 'success') {
        return (
            <Container className="my-5 text-center">
                <Alert variant="success" className="p-4 shadow-lg">
                    <h2 className="text-success">✅ ¡Pago Realizado con Éxito!</h2>
                    <p className="mt-3 fs-5">Tu pedido ha sido confirmado. Recibirás una notificación en **{formData.email}** en breve.</p>
                    <Button variant="secondary" className="mt-3 px-4 py-2 fw-bold" onClick={() => navigate('/')}>
                        Volver al Inicio
                    </Button>
                </Alert>
            </Container>
        );
    }
    
    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col lg={8} xl={6}>
                    <Card className="shadow-lg border-0 bg-dark text-light">
                        <Card.Header className="bg-accent text-center py-3">
                            <h4 className="mb-0 text-white">💳 Finalizar Pedido (${totalPrice})</h4>
                        </Card.Header>
                        <Card.Body>
                            {/* Alerta de Error General */}
                            {status === 'error' && (
                                <Alert variant="danger" onClose={() => setStatus('pending')} dismissible>
                                    {errors.general || 'Ocurrió un error inesperado. Por favor, revisa tus datos.'}
                                </Alert>
                            )}

                            <Form onSubmit={handleCheckout}>
                                
                                <h5 className="mt-3 mb-3 text-accent">1. Información de Contacto y Envío</h5>
                                <hr className="bg-secondary" />

                                {/* Email y Nombre Completo */}
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="tucorreo@ejemplo.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            isInvalid={!!errors.email}
                                            className="form-control-dark"
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                    </Form.Group>
                                    
                                    <Form.Group as={Col} controlId="fullName" className="mt-3 mt-sm-0">
                                        <Form.Label>Nombre Completo</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Tu Nombre"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            isInvalid={!!errors.fullName}
                                            className="form-control-dark"
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
                                    </Form.Group>
                                </Row>

                                {/* Dirección y Ciudad */}
                                <Form.Group controlId="address" className="mb-3">
                                    <Form.Label>Dirección</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Calle, número, apto, etc."
                                        value={formData.address}
                                        onChange={handleChange}
                                        isInvalid={!!errors.address}
                                        className="form-control-dark"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                                </Form.Group>

                                {/* Ciudad y Código Postal */}
                                <Row className="mb-4">
                                    <Form.Group as={Col} controlId="city">
                                        <Form.Label>Ciudad</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ciudad"
                                            value={formData.city}
                                            onChange={handleChange}
                                            isInvalid={!!errors.city}
                                            className="form-control-dark"
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                                    </Form.Group>
                                    
                                    <Form.Group as={Col} controlId="zipCode" className="mt-3 mt-sm-0">
                                        <Form.Label>Código Postal</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="C.P."
                                            value={formData.zipCode}
                                            onChange={handleChange}
                                            isInvalid={!!errors.zipCode}
                                            className="form-control-dark"
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.zipCode}</Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                
                                <h5 className="mt-4 mb-3 text-accent">2. Detalles de Pago</h5>
                                <hr className="bg-secondary" />

                                {/* Número de Tarjeta */}
                                <Form.Group controlId="cardNumber" className="mb-3">
                                    <Form.Label>Número de Tarjeta de Crédito</Form.Label>
                                    <InputGroup>
                                        {/* Icono de Tarjeta */}
                                        <InputGroup.Text className="bg-secondary border-0 text-white">
                                            {/* <BsCreditCard2Front /> Si usas react-icons */}
                                            💳
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            placeholder="xxxx xxxx xxxx xxxx"
                                            value={formData.cardNumber}
                                            onChange={handleChange}
                                            isInvalid={!!errors.cardNumber}
                                            maxLength={19} // 16 dígitos + 3 espacios
                                            className="form-control-dark"
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.cardNumber}</Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>

                                {/* Fecha de Expiración y CVV */}
                                <Row className="mb-4">
                                    <Form.Group as={Col} controlId="expiryDate">
                                        <Form.Label>Expiración (MM/YY)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="MM/AA"
                                            value={formData.expiryDate}
                                            onChange={handleChange}
                                            isInvalid={!!errors.expiryDate}
                                            maxLength={5}
                                            className="form-control-dark"
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.expiryDate}</Form.Control.Feedback>
                                    </Form.Group>
                                    
                                    <Form.Group as={Col} controlId="cvv" className="mt-3 mt-sm-0">
                                        <Form.Label>CVV</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="123"
                                            value={formData.cvv}
                                            onChange={handleChange}
                                            isInvalid={!!errors.cvv}
                                            maxLength={4}
                                            className="form-control-dark"
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.cvv}</Form.Control.Feedback>
                                    </Form.Group>
                                </Row>

                                {/* Botón de Submit */}
                                <Button 
                                    variant="success" 
                                    type="submit" 
                                    className="w-100 mt-4 py-2 fw-bold"
                                    disabled={status === 'loading'}
                                >
                                    {status === 'loading' ? 'Procesando...' : `Pagar $${totalPrice}`}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Checkout;