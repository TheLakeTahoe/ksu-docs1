import React from 'react';
import { Row, Col, Card, Container } from 'react-bootstrap';
import ModuleForm from './ModuleForm';

const ModuleGroup = ({ modules, onModuleChange, onAddModule, onRemoveModule }) => {
    return (
        <Container>
            <h3>Модули</h3>
            <Row className="d-flex flex-column">
                {modules.map((module, index) => (
                    <ModuleForm
                        key={index}
                        index = {index + 1}
                        moduleData={{ ...module, index }}
                        onChange={(updatedModule) => onModuleChange(index, updatedModule)}
                        onRemove={() => onRemoveModule(index)}
                    />
                ))}
                <Col className="mb-4">
                        <Card
                            className="d-flex align-items-center justify-content-center"
                            style={{
                                width: '100%',
                                minHeight: '50px',
                                border: '2px dashed #ccc',
                                cursor: 'pointer',
                            }}
                            onClick={onAddModule}
                        >
                            <Card.Body className="d-flex align-items-center justify-content-center">
                                <h5>+ Добавить модуль</h5>
                            </Card.Body>
                        </Card>
                    </Col>
            </Row>
        </Container>
    );
};

export default ModuleGroup;
