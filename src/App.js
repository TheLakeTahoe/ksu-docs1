import Navigate from './components/Navbar';
import LoginForm from './components/LoginForm'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <Container style={{height:'100vh'}}>
      <Navigate />
      <Container className='justify-content-center align-content-center' style={{display:'flex', height:'60%', flexWrap:'wrap'}}>
      <LoginForm />
      </Container>
    </Container>
  );
}

export default App;
