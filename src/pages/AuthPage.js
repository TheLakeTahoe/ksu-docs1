import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import CustomNavbar from "../components/CustomComponents/Other/Navbar";
import AuthForms from "../components/Forms/AuthForms";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "react-bootstrap";

function AuthPage() {
    const navigate = useNavigate();
    const { user, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && user) {
            navigate('/main');
        }
    }, [user, isLoading, navigate]);
    
    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <Container style={{ height: '100vh', display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start', justifyContent: 'center', alignItems: 'flex-start' }}>
            <CustomNavbar full_name={user?.full_name ? user.full_name : 'Не авторизован'} />
            <Container className='justify-content-center align-content-center' style={{ display: 'flex', flexWrap: 'wrap' }}>
                <AuthForms />
            </Container>
        </Container>
    );
}

export default AuthPage;