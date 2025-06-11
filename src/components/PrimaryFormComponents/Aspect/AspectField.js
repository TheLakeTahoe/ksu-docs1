import React from 'react';
import { Card, CloseButton } from 'react-bootstrap';
import InputField from '../../CustomComponents/InputFields/InputField'; // Используем кастомный InputField
import './AspectField.css'


// Маленькая форма для аспектов
const AspectField = ({ index, onChange, aspectData, onRemove, isEditable }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedData = { ...aspectData, [name]: value };
        onChange(updatedData);
    };

    return (
        <Card className="aspect-card mb-3">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <h6>Аспект {index}</h6>
                {isEditable && (
                    <CloseButton onClick={onRemove} className="remove-button" />
                )}
            </Card.Header>
            <Card.Body>
                <InputField
                    label="Название аспекта"
                    type="text"
                    name="name"
                    value={aspectData.name}
                    onChange={handleChange}
                    placeholder="Введите название аспекта"
                    disabled={!isEditable}
                />
            </Card.Body>
        </Card>
    );
};

export default AspectField;
