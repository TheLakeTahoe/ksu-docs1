import { Container } from 'react-bootstrap';
import Navigate from '../components/Navbar';
import LoginForm from '../components/LoginForm';

function LoginPage() {
    return (
        <Container style={{ height: '100vh' }}>
            <Navigate />
            <Container className='justify-content-center align-content-center' style={{ display: 'flex', height: '60%', flexWrap: 'wrap' }}>
                <LoginForm />
            </Container>
        </Container>
    );
}

export default LoginPage;
