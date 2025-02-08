import { useState } from 'react';
import { Container, FloatingLabel } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import '../style/LoginForm.css'

function RegistrationForm() {
    const [validated, setValidated] = useState(false);
    const [loginValue, setLoginValue] = useState('');
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [confirmPasswordValue, setConfirmPasswrordValue] = useState('');
    const [haveAccount, setHaveAccount] = useState(false);

    const goToLogin = () => {
        setHaveAccount(true);
    };

    if (haveAccount) {
        return <Navigate to="/login"/>
    }

    // const signUp = async () => {
    //     const response = await login(loginValue, passwordValue);
    // }

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
                    <div style={{ textAlign: "center" }}>Форма регистрации</div>
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
                    <Form.Group as={Col} md="12" controlId="validationCustom01">
                        <FloatingLabel
                            controlId='floatingLogin'
                            label='EMail'>
                            <Form.Control
                                required
                                type="text"
                                placeholder="EMail"
                                defaultValue=""
                                onChange={(e) => setEmailValue(e.target.value)}
                            />
                            <Form.Control.Feedback type='invalid'>
                                Введите EMail
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
                <Row className="mb-3">
                    <Form.Group as={Col} md="12" controlId="validationCustom02">
                        <FloatingLabel
                            controlId='floatingPassword'
                            label='Подтверждение пароля'>
                            <Form.Control
                                required
                                type="password"
                                placeholder='Password'
                                defaultValue=""
                                onChange={(e) => setConfirmPasswrordValue(e.target.value)}
                            />
                            <Form.Control.Feedback type='invalid'>
                                Подтвердите пароль
                            </Form.Control.Feedback>
                        </FloatingLabel>
                    </Form.Group>
                </Row>
                <Row style={{display:'flex', flexWrap:'wrap', justifyContent:'space-around'}}>
                    <Button as={Col} md='5' type="submit">Зарегистрироваться</Button>
                    <Button as={Col} md='3' type="login" onClick={goToLogin}>Есть аккаунт?</Button>
                </Row>
            </Form>
        </Container>
    );
}

export default RegistrationForm;