import logo from '../assets/logo/MainLogo.jpg';
import { Container, Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navigate() {
  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home"><img src={logo} style={{height: 100}} alt="logo" /></Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <a href="#login">Current User</a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigate;
