import { Container, Navbar, Button } from 'react-bootstrap';
import { FaClipboardList, FaUserCircle } from "react-icons/fa";
import logo from '../../../assets/logo/MainLogo.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const CustomNavbar = ({ full_name }) => {
  const navigate = useNavigate()


  const goToRequest = () => {
    navigate('/main')
  }

  const goToSettings = () => {
    navigate('/settings')
  }

  return (
    <Navbar
      expand="lg"
      style={{
        width: "100%",
        borderRadius: "0 0 10px 10px",
        backgroundColor: "#ffffff",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        padding: "10px 20px",
        borderBottom: "4px solid #1B9AE9"
      }}
    >
      <Container>
        {/* Логотип */}
        <Navbar.Brand onClick={goToRequest}>
          <img src={logo} alt="logo" style={{ height: 50, borderRadius: "8px", cursor: 'pointer' }} />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse className="justify-content-end">
          {/* Кнопки */}
          {full_name !== 'Не авторизован' ?
            <div className="d-flex gap-3">
              <Button
                style={{
                  height: "45px",
                  minWidth: "140px",
                  borderRadius: "8px",
                  backgroundColor: "#1B9AE9",
                  border: "none",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  fontWeight: "500",
                  transition: "0.3s"
                }}
                className="shadow-sm"
                onMouseOver={(e) => e.target.style.backgroundColor = "#157BB8"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#1B9AE9"}
                onClick={goToRequest}
              >
                <FaClipboardList /> Мои заявки
              </Button>

              <Button
                style={{
                  height: "45px",
                  minWidth: "140px",
                  borderRadius: "8px",
                  backgroundColor: "#1B9AE9",
                  border: "none",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  fontWeight: "500",
                  transition: "0.3s"
                }}
                className="shadow-sm"
                onMouseOver={(e) => e.target.style.backgroundColor = "#157BB8"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#1B9AE9"}
                onClick={goToSettings}
              >
                <FaUserCircle /> Мой профиль
              </Button>
            </div>
            : ''}

          {/* Текст с именем пользователя */}
          <Navbar.Text style={{ marginLeft: "20px", fontSize: "14px", color: "#333" }}>
            <strong>Текущий пользователь:</strong> <br />
            <div style={{ color: "#1B9AE9", textDecoration: "none", fontWeight: "500" }}>
              {full_name}
            </div>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
