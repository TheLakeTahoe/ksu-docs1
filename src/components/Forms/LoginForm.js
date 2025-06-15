import { useState, useEffect } from 'react'
import { Col, Button, Form, Row, Alert } from 'react-bootstrap'
import InputField from '../CustomComponents/InputFields/InputField'
import { authorize } from '../../http/userAPI'
import { useNavigate } from 'react-router-dom'
import './Forms.css'
import { useAuth } from '../../context/AuthContext'

function LoginForm({ updateHeight }) {
    const [formValues, setFormValues] = useState({
        loginOrEmail: '',
        password: ''
    })
    const [errors, setErrors] = useState({})
    const [failure, setFailure] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const { login } = useAuth()

    useEffect(() => {
        updateHeight()
    }, [failure, errors, updateHeight])

    const handleLogin = async () => {
        setFailure('')
        const response = await authorize(formValues)
        if (!response?.token) setFailure(response.message)
        else login(response.token)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormValues({ ...formValues, [name]: value })
    }

    const fieldLabels = {
        loginOrEmail: 'Логин или Email',
        password: 'Пароль'
    }

    const validateForm = (values) => {
        const newErrors = {}
        const { loginOrEmail, password } = values

        if (!loginOrEmail) newErrors.loginOrEmail = 'Поле не должно быть пустым'
        else if (loginOrEmail.length < 5 || loginOrEmail.length > 20) newErrors.loginOrEmail = 'Логин должен содержать от 5 до 20 символов.'
        else if (!/^[a-zA-Z0-9]+$/.test(loginOrEmail)) newErrors.loginOrEmail = 'Логин может содержать только буквы и цифры.'

        if (!password) newErrors.password = 'Поле не должно быть пустым'
        else if (password.length < 8) newErrors.password = 'Пароль должен содержать минимум 8 символов.'
        else if (!/[A-Z]/.test(password)) newErrors.password = 'Пароль должен содержать хотя бы одну заглавную букву.'
        else if (!/\d/.test(password)) newErrors.password = 'Пароль должен содержать хотя бы одну цифру.'

        return newErrors
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const newErrors = validateForm(formValues)

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
        }
        else {
            setErrors({})
            handleLogin()
            if (failure)
                setErrors(newErrors)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === ' ') {
            e.preventDefault()
        }
    }

    return (
        <Form className="login-form-container" noValidate onSubmit={handleSubmit}>
            <Row className="text-center mb-3">
                <h4 className="login-title">Форма авторизации</h4>
            </Row>
            {failure && (
                <Alert variant="danger" className="text-center">
                    {failure}
                </Alert>
            )}

            {['loginOrEmail', 'password'].map((field, idx) => (
                <InputField
                    key={idx}
                    label={fieldLabels[field]}
                    type={field === 'password' && !showPassword ? 'password' : 'text'}
                    value={formValues[field]}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    name={field}
                    error={errors[field]}
                    isPassword={field === 'password'}
                    showPassword={showPassword}
                    togglePassword={() => setShowPassword(!showPassword)}
                />
            ))}
            <Row className="justify-content-center mt-3">
                <Col md={12} className="text-center">
                    <Button type="submit" className="login-btn mb-2">
                        Авторизоваться
                    </Button>
                </Col>
            </Row>
        </Form>
    )
}

export default LoginForm
