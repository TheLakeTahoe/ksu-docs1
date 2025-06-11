import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate()
    const goToMain = () => {
        navigate('/main')
    }
    return (
        <div style={{ backgroundColor: '#1B9AE9', minHeight: '100vh', color: '#FFFFFF' }}>
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Row className="text-center">
                    <Col>
                        <h1 style={{ fontSize: '6rem', fontWeight: 'bold' }}>404</h1>
                        <h2>Страница не найдена</h2>
                        <p>К сожалению, запрашиваемая страница не существует.</p>
                        <Button
                            variant="light"
                            style={{ color: '#1B9AE9', fontWeight: 'bold' }}
                            onClick={goToMain}
                        >
                            На главную
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default NotFoundPage;
