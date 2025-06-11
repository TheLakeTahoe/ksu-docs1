import { useState } from 'react';
import { Container, FloatingLabel } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import '../style/LoginForm.css'

function LoginForm() {
    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
    };

    return (
        <Container as={Col} md='6' className='login_form container-fluid mt-5'>
        <div className='mt-3' style={{textAlign:"center"}}>Форма авторизации</div>
        <Form className='m-3' noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
                <Form.Group as={Col} md="12" controlId="validationCustom01">
                    <FloatingLabel
                        controlId='floatingLogin'
                        label='Логин'>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Login"
                            defaultValue=""
                        />
                        <Form.Control.Feedback type='invalid'>
                            Введите логин
                        </Form.Control.Feedback>
                    </FloatingLabel>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} md="12" controlId="validationCustom02">
                    <FloatingLabel
                        controlId='floatingPassword'
                        label='Пароль'>
                        <Form.Control
                            required
                            type="password"
                            placeholder='Password'
                            defaultValue=""
                        />
                        <Form.Control.Feedback type='invalid'>
                            Введите пароль
                        </Form.Control.Feedback>
                    </FloatingLabel>
                </Form.Group>
            </Row>
            <Form.Group className="mb-3">
                <Form.Check
                    label="Запомнить меня"
                />
            </Form.Group>
            <Button type="submit">Войти</Button>
        </Form>
        </Container>
    );
}

export default LoginForm;