import React from 'react';
import { Row, Col, Card, CloseButton } from 'react-bootstrap';
import InputField from '../CustomComponents/InputFields/InputField'; // Импортируем компонент InputField

// Форма для модуля
const EducationTechForm = ({ index, technologyData, onChange, onRemove, isEditable }) => {
    return (
        <Card className="module-card mb-3">
            <Card.Header className="d-flex justify-content-between align-items-center module-card-header">
                <h6>Технология {index}</h6>
                {isEditable && (
                    <CloseButton onClick={onRemove} className="remove-button" />
                )}
            </Card.Header>
            <Card.Body>
                {/* Поля для ввода */}
                <Row>
                    <Col xs={12} md={12}>
                        <InputField
                            label="Наименование технологии"
                            type="text"
                            value={technologyData.name}
                            onChange={(e) => onChange({ ...technologyData, name: e.target.value })}
                            disabled={!isEditable}
                        />
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default EducationTechForm;
