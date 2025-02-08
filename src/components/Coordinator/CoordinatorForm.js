import React from 'react';
import { Form, Card, FloatingLabel, Col, Container } from 'react-bootstrap';

const CoordinatorForm = ({ coordinator, onCoordinatorChange = {} }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onCoordinatorChange({ ...coordinator, [name]: value });
    };

    return (
        <Container>
            <Col xs={12} md={4} lg={4} className="mb-4 pe-3">
            <Card style={{ width: '100%', minHeight: '300px', marginBottom: '10px', position: 'relative' }}>
                <Card.Body>
                    <Form>
                        <FloatingLabel controlId="formCoordinatorFirstName" label="Фамилия" className="mb-2">
                            <Form.Control
                                type="text"
                                name="f_name"
                                value={coordinator?.f_name || ''}
                                onChange={handleChange} />
                        </FloatingLabel>

                        <FloatingLabel controlId="formCoordinatorMiddleName" label="Имя" className="mb-2">
                            <Form.Control
                                type="text"
                                name="m_name"
                                value={coordinator?.m_name || ''}
                                onChange={handleChange} />
                        </FloatingLabel>

                        <FloatingLabel controlId="formCoordinatorLastName" label="Отчество" className="mb-2">
                            <Form.Control
                                type="text"
                                name="l_name"
                                value={coordinator?.l_name || ''}
                                onChange={handleChange} />
                        </FloatingLabel>

                        <FloatingLabel controlId="formCoordinatorPhone" label="Телефон" className="mb-2">
                            <Form.Control
                                type="text"
                                name="phone"
                                value={coordinator?.phone || ''}
                                onChange={handleChange} />
                        </FloatingLabel>
                        <FloatingLabel controlId="formCoordinatorEmail" label="E-Mail" className="mb-2">
                            <Form.Control
                                type="text"
                                name="email"
                                value={coordinator?.email || ''}
                                onChange={handleChange} />
                        </FloatingLabel>
                        <FloatingLabel controlId="formCoordinatorAddress" label="Адрес" className="mb-2">
                            <Form.Control
                                type="text"
                                name="address"
                                value={coordinator?.address || ''}
                                onChange={handleChange} />
                        </FloatingLabel>
                    </Form>
                </Card.Body>
            </Card>
            </Col>

        </Container>
    );
};

export default CoordinatorForm;
