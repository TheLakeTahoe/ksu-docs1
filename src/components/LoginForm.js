import { useState } from 'react';
import { Container, FloatingLabel } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import '../style/LoginForm.css'
import { login } from '../http/userAPI';

function LoginForm() {
    const [validated, setValidated] = useState(false);
    const [loginValue, setLoginValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [haveNotAccount, setHaveNotAccount] = useState(false);

    const goToRegister = () => {
        setHaveNotAccount(true);
    };

    if (haveNotAccount) {
        return <Navigate to="/register" />
    }


    const logIn = async () => {
        const response = await login(loginValue, passwordValue);
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        else {
            //Здесь код для работы, когда форма валидна

        }

        setValidated(true);
    };

    return (
        <Container as={Col} md='6' className='login_form container-fluid mt-5'>
            <Form className='m-3 mt-0' noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className='p-3 '>
                    <div style={{ textAlign: "center" }}>Форма авторизации</div>
                </Row>
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
                                onChange={(e) => setLoginValue(e.target.value)}
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
                                onChange={(e) => setPasswordValue(e.target.value)}
                            />
                            <Form.Control.Feedback type='invalid'>
                                Введите пароль
                            </Form.Control.Feedback>
                        </FloatingLabel>
                    </Form.Group>
                </Row>
                <Row style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                    <Button as={Col} md='3' type="submit">Войти</Button>
                    <Button as={Col} md='3' type="submit" onClick={goToRegister}>Нет аккаунта?</Button>
                </Row>
            </Form>
        </Container>
    );
}

export default LoginForm;