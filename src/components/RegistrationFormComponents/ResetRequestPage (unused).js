import { useState } from 'react';
import { Form, Col, Row, Button } from 'react-bootstrap';
import InputField from '../CustomComponents/InputFields/InputField';


const ResetRequestPage = () => {
    const [formValues, setFormValues] = useState({
        email: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const fieldLabels = {
        email: 'Email',
    };

    const validateForm = (values) => {
        const newErrors = {};
        const { email } = values;

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!email) newErrors.email = 'Поле не должно быть пустым';
        else if (!emailRegex.test(email)) newErrors.email = 'Введите корректный email.';

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateForm(formValues);

        if (Object.keys(newErrors).length === 0) {
            setErrors({});
            console.log(formValues)
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <Form className='mt-0 mb-4 p-2' noValidate onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Row className='p-3'>
                <div style={{ textAlign: "center", fontSize: "1.2rem", fontWeight: "bold" }}>Восстановление аккаунта</div>
            </Row>

            {['email'].map((field, idx) => (
                <InputField
                    key={idx}
                    label={fieldLabels[field]}
                    type='text'
                    value={formValues[field]}
                    onChange={handleChange}
                    name={field}
                    error={errors[field]}
                />
            ))}

            <Row className="mt-2 d-flex justify-content-between">
                <Col md={12} style={{display:'flex', justifyContent:'center'}}>
                    <Button type="submit" variant="primary" className="w-50" >
                        Далее
                    </Button>
                </Col>
            </Row>

        </Form>
    );
}

export default ResetRequestPage;
