import React from 'react';
import { Row, Col, Card, Container, Alert } from 'react-bootstrap';
import EducationTechForm from './EducationTechForm';

const EducationTechGroup = ({ technologies, onTechnologyChange, onAddTechnology, onRemoveTechnology, isEditable, empty, error }) => {
    return (
        <Container>
            <Row className="d-flex flex-column">
                {error && Object.entries(error).map(([index, errors]) => (
                    <Alert key={index} variant="danger">
                        <strong>Технология {Number(index) + 1}:</strong>
                        <ul className="mb-0">
                            {errors.map((err, i) => (
                                <li key={i}>{err}</li>
                            ))}
                        </ul>
                    </Alert>
                ))}
                {empty && (<Alert variant='danger'>{empty}</Alert>)}
                {technologies.map((technology, index) => (
                    <EducationTechForm
                        key={index}
                        index={index + 1}
                        technologyData={{ ...technology, index }}
                        onChange={(updatedTechnology) => onTechnologyChange(index, updatedTechnology)}
                        onRemove={() => onRemoveTechnology(index)}
                        isEditable={isEditable}
                    />
                ))}
                {isEditable && (
                    <Col className="mb-4">

                        <Card
                            className="d-flex align-items-center justify-content-center"
                            style={{
                                width: '100%',
                                minHeight: '50px',
                                border: '2px dashed #ccc',
                                cursor: 'pointer',
                            }}
                            onClick={onAddTechnology}
                        >
                            <Card.Body className="d-flex align-items-center justify-content-center">
                                <h5>+ Добавить технологии</h5>
                            </Card.Body>
                        </Card>

                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default EducationTechGroup;
