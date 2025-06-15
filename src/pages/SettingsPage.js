import React from "react"
import { Container } from "react-bootstrap"
import CustomNavbar from "../components/CustomComponents/Other/Navbar"
import SettingsForm from "../components/Forms/SettingsForm"
import { useAuth } from "../context/AuthContext"

function RequestPage() {

    const { user } = useAuth()

    return (
        <Container style={{ height: '100vh', display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start', justifyContent: 'center', alignItems: 'flex-start' }}>
            <CustomNavbar full_name={user?.full_name ? user.full_name : 'Не авторизован'} />
            <Container className='justify-content-center align-content-center' style={{ display: 'flex', flexWrap: 'wrap' }}>
                <SettingsForm userData={user}/>
            </Container>
        </Container>
    )
}

export default RequestPage
