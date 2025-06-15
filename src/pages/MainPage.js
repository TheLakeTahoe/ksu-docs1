import { Container } from "react-bootstrap"
import CustomNavbar from "../components/CustomComponents/Other/Navbar"
import MainContent from "../components/MainContent/MainContent"
import { useAuth } from "../context/AuthContext"

function MainPage() {

    const { user } = useAuth()

    return (
        <Container className='hide-scrollbar' style={{ height: '100vh', display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start', justifyContent: 'center', alignItems: 'flex-start' }}>
            <CustomNavbar full_name={user?.full_name ? user.full_name : 'Не авторизован'} />
            <Container className='justify-content-center align-content-center' style={{ display: 'flex', flexWrap: 'wrap' }}>
                <MainContent />
            </Container>
        </Container>
    )
}

export default MainPage
