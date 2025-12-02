// src/components/CartItem.jsx
import React from 'react';
import { ListGroup, Button, Form, Image } from 'react-bootstrap';

// El componente recibe las funciones de manejo directamente como props
const CartItem = ({ item, increaseQuantity, decreaseQuantity, removeItem }) => {
    const subtotal = item.price * item.quantity;
    
    // Función para manejar la eliminación con confirmación
    const handleRemove = () => {
        if (window.confirm(`¿Estás seguro de que deseas eliminar "${item.name}" del carrito?`)) {
            removeItem(item.id);
        }
    };

    return (
        <ListGroup.Item 
            key={item.id} 
            className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center p-3 mb-3 border-secondary list-group-item"
        >
            {/* Sección de Imagen y Detalles */}
            <div className="d-flex align-items-center mb-3 mb-lg-0 flex-grow-1">
                <Image 
                    src={item.image} 
                    rounded 
                    alt={item.name}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '15px' }} 
                    className="me-3"
                />
                <div>
                    <h5 className="mb-1 fw-bold text-light">{item.name}</h5>
                    <p className="mb-0 text-muted">${item.price.toFixed(2)} / unidad</p>
                </div>
            </div>

            {/* Sección de Cantidad y Subtotal */}
            <div className="d-flex flex-column flex-sm-row align-items-center">
                {/* Controles de Cantidad */}
                <div className="d-flex align-items-center me-sm-4 mb-2 mb-sm-0">
                    <Button 
                        variant="outline-secondary" 
                        onClick={() => decreaseQuantity(item.id)}
                        disabled={item.quantity <= 1} /* Desactiva si la cantidad es 1 */
                        aria-label="Disminuir cantidad"
                    >
                        -
                    </Button>
                    <Form.Control 
                        type="text" 
                        readOnly 
                        value={item.quantity} 
                        className="text-center mx-2 bg-transparent text-light border-0" 
                        style={{ width: '40px' }} 
                    />
                    <Button 
                        variant="outline-secondary" 
                        onClick={() => increaseQuantity(item.id)}
                        aria-label="Aumentar cantidad"
                    >
                        +
                    </Button>
                </div>

                {/* Subtotal del Producto */}
                <div className="text-center me-sm-4 mb-2 mb-sm-0" style={{ minWidth: '100px' }}>
                    <p className="mb-0">Subtotal:</p>
                    <strong className="fs-5">${subtotal.toFixed(2)}</strong>
                </div>

                {/* Botón de Eliminar */}
                <Button 
                    variant="danger" 
                    onClick={handleRemove}
                    aria-label={`Eliminar ${item.name}`}
                    className="mt-2 mt-sm-0"
                >
                    &times; Eliminar
                </Button>
            </div>
        </ListGroup.Item>
    );
};

export default CartItem;