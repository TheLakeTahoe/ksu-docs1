import { useEffect, useState } from 'react'
import { Form, Col, Row, Button } from 'react-bootstrap'
import InputField from '../CustomComponents/InputFields/InputField'
import { checkLogin, checkPhone, checkEmail } from '../../http/userAPI'

const MainDataForm = ({ onNext, formData, updateFormData, updateHeight }) => {
    const [formValues, setFormValues] = useState({
        login: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
    })

    useEffect(() => {
        setFormValues(formData)
    }, [formData])

    const [errors, setErrors] = useState({})

    useEffect(() => {
        updateHeight(); // Обновление высоты при изменении ошибок
      }, [errors, updateHeight]);

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormValues({ ...formValues, [name]: value })
        updateFormData({ [name]: value }) // Обновляем глобальные данные
    }

    const fieldLabels = {
        login: 'Логин',
        email: 'Email',
        phone: 'Номер телефона',
        password: 'Пароль',
        confirmPassword: 'Подтвердите пароль'
    }

    const validateForm = async (values) => {
        const newErrors = {}
        const { login, email, phone, password, confirmPassword } = values

        if (!login) newErrors.login = 'Поле не должно быть пустым'
        else if (login.length < 5 || login.length > 20) newErrors.login = 'Логин должен содержать от 5 до 20 символов.'
        else if (!/^[a-zA-Z0-9]+$/.test(login)) newErrors.login = 'Логин может содержать только буквы и цифры.'
        else if (await checkLogin(login)) newErrors.login = 'Логин уже используется'

        if (!phone) newErrors.phone = 'Поле не должно быть пустым'
        else if (phone.length < 10) newErrors.phone = 'Номер телефона должен содержать 10 символов.'
        else if (await checkPhone(phone)) newErrors.phone = 'Номер телефона уже используется'

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
        if (!email) newErrors.email = 'Поле не должно быть пустым'
        else if (!emailRegex.test(email)) newErrors.email = 'Введите корректный email.'
        else if (await checkEmail(email)) newErrors.email = 'Email уже используется'

        if (!password) newErrors.password = 'Поле не должно быть пустым'
        else if (password.length < 8) newErrors.password = 'Пароль должен содержать минимум 8 символов.'
        else if (!/[A-Z]/.test(password)) newErrors.password = 'Пароль должен содержать хотя бы одну заглавную букву.'
        else if (!/\d/.test(password)) newErrors.password = 'Пароль должен содержать хотя бы одну цифру.'

        if (!confirmPassword) newErrors.confirmPassword = 'Поле не должно быть пустым'
        else if (confirmPassword !== password) newErrors.confirmPassword = 'Пароли не совпадают.'

        return newErrors
    }

    const handleKeyPress = (e) => {
        if (e.key === ' ') {
          e.preventDefault()
        }
      }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newErrors = await validateForm(formValues)

        if (Object.keys(newErrors).length === 0) {
            setErrors({})
            onNext() // Переход на следующую форму
        } else {
            setErrors(newErrors)
        }
    }

    return (
        <Form className='main-data-form' noValidate onSubmit={handleSubmit}>
            <Row className='form-row'>
                <div className='form-title'>Данные аккаунта</div>
            </Row>

            {['login', 'email', 'phone', 'password', 'confirmPassword'].map((field, idx) => (
                <InputField
                    key={idx}
                    label={fieldLabels[field]}
                    type={field.includes('password') || field.includes('confirmPassword') ? 'password' : 'text'}
                    value={formValues[field]}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    name={field}
                    isPassword={field.includes('password') || field.includes('confirmPassword')}
                    isPhoneNumber={field === 'phone'}
                    error={errors[field]}
                />
            ))}

            <Row className='form-row'>
                <Col md={12} className='d-flex justify-content-center'>
                    <Button type='submit' variant='primary' className='form-button'>
                        Далее
                    </Button>
                </Col>
            </Row>
        </Form>
    )
}

export default MainDataForm
