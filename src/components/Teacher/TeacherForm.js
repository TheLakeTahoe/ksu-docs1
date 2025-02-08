import React from 'react';
import { Form, Card, CloseButton, FloatingLabel, FormLabel } from 'react-bootstrap';

// Маленькая форма для преподавателя
const TeacherForm = ({ index, onChange, teacherData, onRemove }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedData = { ...teacherData, [name]: value };
        onChange(updatedData);
    };

    return (
        <Card style={{ width: '100%', minHeight: '300px', marginBottom: '10px', position: 'relative' }}>
            {/* Кнопка удаления */}
            <CloseButton
                onClick={onRemove}
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    zIndex: '1',
                }}
            />
            <Card.Body>
                <Form>
                    <FormLabel className='mb-3'>Преподаватель {index}</FormLabel>
                    <FloatingLabel
                        controlId="formTeacherFirstName"
                        label="Фамилия"
                        className="mb-2">
                        <Form.Control
                            type="text"
                            name="f_name"
                            value={teacherData.f_name}
                            onChange={handleChange} />
                    </FloatingLabel>

                    <FloatingLabel
                        controlId="formTeacherMiddleName"
                        label="Имя"
                        className="mb-2">
                        <Form.Control
                            type="text"
                            name="m_name"
                            value={teacherData.m_name}
                            onChange={handleChange} />
                    </FloatingLabel>

                    <FloatingLabel
                        controlId="formTeacherLastName"
                        label="Отчество"
                        className="mb-2">
                        <Form.Control
                            type="text"
                            name="l_name"
                            value={teacherData.l_name}
                            onChange={handleChange} />
                    </FloatingLabel>

                    <FloatingLabel
                        controlId="formTeacherPosition"
                        label="Должность"
                        className="mb-2">
                        <Form.Control
                            type="text"
                            name="position"
                            value={teacherData.position}
                            onChange={handleChange} />
                    </FloatingLabel>

                    <FloatingLabel
                        controlId="formTeacherWorkExperience"
                        label="Опыт работы"
                        className="mb-2">
                        <Form.Control
                            type="text"
                            name="workExperience"
                            value={teacherData.workExperience}
                            onChange={handleChange} />
                    </FloatingLabel>

                    <FloatingLabel
                        controlId="formTeacherWorkplace"
                        label="Место работы"
                        className="mb-3">
                        <Form.Control
                            type="text"
                            name="workplace"
                            value={teacherData.workplace}
                            onChange={handleChange} />
                    </FloatingLabel>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default TeacherForm;
