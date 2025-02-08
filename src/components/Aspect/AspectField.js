import React from 'react';
import { Form, Card, CloseButton } from 'react-bootstrap';

// Маленькая форма для аспектов
const AscpectField = ({index, onChange, aspectData, onRemove }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedData = { ...aspectData, [name]: value };
        onChange(updatedData);
    };

    return (
        <Card style={{ width: '100%', minHeight: '125px', marginBottom: '10px' }}>
            <Card.Body>
                <Form>
                    <Form.Label>Аспект {index}</Form.Label>
                    <div className="d-flex align-items-center">
                        <Form.Control
                            type="text"
                            name="name"
                            value={aspectData.name}
                            onChange={handleChange}
                            style={{ flex: '1', marginRight: '10px' }} // Поле ввода занимает доступное пространство
                        />
                        <CloseButton onClick={onRemove} />
                    </div>
                </Form>
            </Card.Body>
        </Card>

    );
};

export default AscpectField