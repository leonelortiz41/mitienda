import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Help = () => {
  return (
    <Container>
      <Row>
        <Col>
          <h1>Ayuda</h1>
          <Card>
            <Card.Body>
              <Card.Title>Preguntas Frecuentes</Card.Title>
              <Card.Text>
                <strong>1. ¿Cómo puedo realizar una compra?</strong><br />
                Para realizar una compra, selecciona los productos que deseas y añádelos al carrito. Luego, procede al pago desde el carrito.
              </Card.Text>
              <Card.Text>
                <strong>2. ¿Qué métodos de pago aceptan?</strong><br />
                Aceptamos tarjetas de crédito y débito, así como otros métodos de pago como PayPal.
              </Card.Text>
              <Card.Text>
                <strong>3. ¿Cómo puedo contactar con atención al cliente?</strong><br />
                Puedes contactarnos a través del email contacto@mitienda.com o llamando al +123 456 7890.
              </Card.Text>
              <Card.Text>
                <strong>4. ¿Puedo devolver un producto?</strong><br />
                Sí, aceptamos devoluciones dentro de los 30 días posteriores a la compra. Consulta nuestra política de devoluciones para más detalles.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Help;
