import React from 'react';
import { Row, Col, Form, CloseButton } from 'react-bootstrap';

const ModuleForm = ({ index, moduleData, onChange, onRemove }) => {
    return (
        <Row className="align-items-center mb-3">
            <Col xs={12} md={7}>
                <Form.Group controlId={`moduleName-${moduleData.index}`}>
                    <Form.Label>Модуль {index}</Form.Label>
                    <Form.Control
                        type="text"
                        value={moduleData.name}
                        onChange={(e) => onChange({ ...moduleData, name: e.target.value })}
                        placeholder="Введите наименование"
                    />
                </Form.Group>
            </Col>
            <Col xs={12} md={4}>
                <Form.Group controlId={`moduleHours-${moduleData.index}`}>
                    <Form.Label>Количество часов</Form.Label>
                    <Form.Control
                        type="number"
                        value={moduleData.hours}
                        onChange={(e) => onChange({ ...moduleData, hours: e.target.value })}
                        placeholder="Введите часы"
                        min="0"
                    />
                </Form.Group>
            </Col>
            <Col xs={12} md={1} className="d-flex justify-content-end">
                <CloseButton onClick={onRemove} className="mt-4"/>
            </Col>
        </Row>
    );
};

export default ModuleForm;
