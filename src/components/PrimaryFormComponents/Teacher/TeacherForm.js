import React from 'react';
import { Card, CloseButton } from 'react-bootstrap';
import InputField from '../../CustomComponents/InputFields/InputField';  // Импортируем ваш компонент
import './TeacherForm.css';  // Если у вас есть CSS файл для дополнительных стилей

// Маленькая форма для преподавателя
const TeacherForm = ({ index, onChange, teacherOptions, teacherData, onRemove, handleTeacherSelectChange, onSelectSpecialValue }) => {

    const handleChange = (updatedData) => {
        onChange(updatedData);
    };

    return (
        <Card className="teacher-form-card">
            {/* Кнопка удаления */}
            <CloseButton
                onClick={onRemove}
                className="remove-button"
            />
            <Card.Header className="teacher-form-header">
                <h6>Преподаватель {index}</h6>
            </Card.Header>
            <Card.Body>
                <InputField
                    label='Преподаватель'
                    isSelect
                    name='full_name'
                    options={[...teacherOptions, { value: '__add__', label: '+ Добавить преподавателя' }]}
                    value={teacherOptions.find(option => option.value === teacherData.full_name) || null}
                    onChange={(e) => {
                        if (e.value === '__add__') {
                            onSelectSpecialValue?.()
                        } else {
                            handleTeacherSelectChange(index - 1, e)
                        }
                    }}
                />
                <InputField
                    label='Место работы'
                    name='workplace'
                    value={teacherData.workplace}
                    onChange={(e) => handleChange({ ...teacherData, workplace: e.target.value })}
                />
                <InputField
                    label='Должность'
                    name='position'
                    value={teacherData.position}
                    onChange={(e) => handleChange({ ...teacherData, position: e.target.value })}
                />
                <InputField
                    label='Опыт работы'
                    name='exp_total'
                    value={teacherData.exp_total}
                    onChange={(e) => handleChange({ ...teacherData, exp_total: e.target.value })}
                />
            </Card.Body>
        </Card>
    );
};

export default TeacherForm;
