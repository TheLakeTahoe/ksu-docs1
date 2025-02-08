import { Container } from 'react-bootstrap';
import Navigate from '../components/Navbar';
import RegistrationForm from '../components/RegistrationForm';

function RegistrationPage() {
    return (
        <Container style={{ height: '100vh' }}>
            <Navigate />
            <Container className='justify-content-center align-content-center' style={{ display: 'flex', height: '60%', flexWrap: 'wrap' }}>
                <RegistrationForm />
            </Container>
        </Container>
    );
}

export default RegistrationPage;
