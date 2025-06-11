import React from 'react';
import { Row, Col, Card, Container, Alert } from 'react-bootstrap';
import TeacherForm from './TeacherForm';

const TeachersGroup = ({ teachers, teacherOptions, onTeacherChange, onAddTeacher, onRemoveTeacher, teacherErrors, handleTeacherSelectChange, onSelectSpecialValue }) => {
    return (
        <Container>
            {teacherErrors && typeof teacherErrors === 'object' && Object.entries(teacherErrors).map(([index, errors]) => (
                index !== 'count' ? (
                    <Alert key={index} variant="danger">
                        <strong>Преподаватель {Number(index) + 1}:</strong>
                        <ul className="mb-0">
                            {errors.teacher && errors.teacher.map((err, i) => (
                                <li key={`mod-${i}`}>{err}</li>
                            ))}
                        </ul>
                    </Alert>
                ) : (
                    <Alert variant="danger">
                        <strong>Общие ошибки преподавателей:</strong>
                        <ul className="mb-0">
                            <li>{teacherErrors.count[0]}</li>
                        </ul>
                    </Alert>
                )
            ))}
            <Row className="d-flex flex-wrap">
                {teachers.map((teacher, index) => (
                    <Col key={index} xs={12} md={4} lg={4} className="mb-4">
                        <TeacherForm
                            teacherOptions={teacherOptions}
                            teacherData={teacher}
                            index={index + 1}
                            onChange={(data) => onTeacherChange(index, data)}
                            onRemove={() => onRemoveTeacher(index)}
                            handleTeacherSelectChange={handleTeacherSelectChange}
                            onSelectSpecialValue={onSelectSpecialValue}
                        />
                    </Col>
                ))}
                {teachers.length < 6 && (
                    <Col xs={12} md={4} lg={4}>
                        <Card
                            className="d-flex align-items-center justify-content-center"
                            style={{
                                width: '100%',
                                minHeight: '470px',
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
