import React from 'react';
import { Row, Col, Card, Container } from 'react-bootstrap';
import TeacherForm from './TeacherForm';

const TeachersGroup = ({ teachers, onTeacherChange, onAddTeacher, onRemoveTeacher }) => {
    return (
        <Container>
            <h3>Преподаватели</h3>
            <Row className="d-flex flex-wrap">
                {teachers.map((teacher, index) => (
                    <Col key={index} xs={12} md={4} lg={4} className="mb-4">
                        <TeacherForm
                            teacherData={teacher}
                            index = {index + 1}
                            onChange={(data) => onTeacherChange(index, data)}
                            onRemove={() => onRemoveTeacher(index)}
                        />
                    </Col>
                ))}
                {teachers.length < 6 && (
                    <Col xs={12} md={4} lg={4} className="mb-4">
                        <Card
                            className="d-flex align-items-center justify-content-center"
                            style={{
                                width: '100%',
                                minHeight: '450px',
                                border: '2px dashed #ccc',
                                cursor: 'pointer',
                            }}
                            onClick={onAddTeacher}
                        >
                            <Card.Body className="d-flex align-items-center justify-content-center">
                                <h5>+ Добавить преподавателя</h5>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default TeachersGroup;
