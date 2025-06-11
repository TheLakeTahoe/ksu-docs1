import React from 'react';
import { Card, Col } from 'react-bootstrap';
import InputField from '../../CustomComponents/InputFields/InputField';

const CoordinatorForm = ({ coordinator, onCoordinatorChange = {} }) => {

    const fields = [
        { label: 'Фамилия', name: 'f_name', type: 'text' },
        { label: 'Имя', name: 'm_name', type: 'text' },
        { label: 'Отчество', name: 'l_name', type: 'text' },
        { label: 'Телефон', name: 'phone', type: 'phone' },
        { label: 'Email', name: 'email', type: 'text' },
        { label: 'Адрес', name: 'address', type: 'text' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        onCoordinatorChange({ ...coordinator, [name]: value });
    };

    return (
        <Card as={Col} xs={12} md={4} lg={4} className="coordinator-form-card">
            <Card.Header className="coordinator-form-header">
                <h6>Координатор</h6>
            </Card.Header>
            <Card.Body>
                {/* Динамически отображаем поля формы */}
                {fields.map((field, i) => (
                    <InputField
                        key={i}
                        label={field.label}
                        type={field.type}
                        name={field.name}
                        value={coordinator[field.name]}
                        onChange={handleChange}
                        isPhoneNumber={field.type === 'phone' ? true : false}
                    />
                ))}
            </Card.Body>
        </Card>
    );
};

export default CoordinatorForm;
