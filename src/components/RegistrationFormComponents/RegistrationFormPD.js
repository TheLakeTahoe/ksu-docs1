import React, { useState, useEffect } from 'react'
import { Form, Col, Row, Button } from 'react-bootstrap'
import InputField from '../CustomComponents/InputFields/InputField'
import { getAllEducation } from '../../http/dataAPI'
import { register } from '../../http/userAPI'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const PersonalDataForm = ({ onBack, formData, updateFormData, updateHeight }) => {
    const [formValues, setFormValues] = useState({
        f_name: '',
        m_name: '',
        l_name: '',
        workExperience: '',
        workplace: '',
        education_id: '',
        position: ''
    })

    const [errors, setErrors] = useState({})
    const [educationOptions, setEducationOptions] = useState([])
    const { login } = useAuth()

    useEffect(() => {
        updateHeight(); // Обновление высоты при изменении ошибок
    }, [errors, updateHeight]);

    const tryRegister = async () => {
        const response = await register(formData)
        if (response?.token) login(response.token)
    }

    const fieldLabels = {
        f_name: 'Фамилия',
        m_name: 'Имя',
        l_name: 'Отчество',
        workExperience: 'Опыт работы (лет)',
        workplace: 'Место работы',
        education_id: 'Образование',
        position: 'Должность'
    }

    useEffect(() => {
        const fetchEducationData = async () => {
            try {
                const response = await getAllEducation()
                const educationData = response.data.map(item => ({
                    value: item.name,
                    label: item.name,
                    id: item.id
                }))
                setEducationOptions(educationData)
            } catch (error) {
                console.error('Ошибка при получении данных об образовании:', error)
            }
        }

        fetchEducationData()
    }, []) // Пустой массив зависимостей

    const validateForm = (values) => {
        const newErrors = {}
        const { f_name, m_name, l_name, workExperience, workplace, education_id, position } = values

        if (!f_name) newErrors.f_name = 'Поле не должно быть пустым'
        if (!m_name) newErrors.m_name = 'Поле не должно быть пустым'
        if (!l_name) newErrors.l_name = 'Поле не должно быть пустым'
        if (!workExperience) newErrors.workExperience = 'Поле не должно быть пустым'
        if (!workplace) newErrors.workplace = 'Поле не должно быть пустым'
        if (!education_id) newErrors.education_id = 'Поле не должно быть пустым'
        if (!position) newErrors.position = 'Поле не должно быть пустым'

        return newErrors
    }

    const handleKeyPress = (e) => {
        if (e.key === ' ') {
            e.preventDefault()
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const newErrors = validateForm(formValues)

        if (Object.keys(newErrors).length === 0) {
            setErrors({})
            tryRegister()
        } else {
            setErrors(newErrors)
        }
    }

    const handleChange = (e) => {
        if (e && e.value) {
            console.log(e)
            setFormValues({ ...formValues, [e.name]: e.value })
            updateFormData({ [e.name]: e.id })
        } else {
            setFormValues({ ...formValues, [e.target.name]: e.target.value })
            updateFormData({ [e.target.name]: e.target.value })
        }
    }

    return (
        <Form className='personal-data-form' onSubmit={handleSubmit}>
            <Row className='form-header'>
                <div className='form-title'>Персональные данные</div>
            </Row>

            {['f_name', 'm_name', 'l_name'].map((field, idx) => (
                <InputField
                    key={idx}
                    label={fieldLabels[field]}
                    type='text'
                    value={formValues[field]}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    name={field}
                    error={errors[field]}
                />
            ))}

            <InputField
                label='Образование'
                value={educationOptions.find(option => option.value === formValues.education_id)}
                onChange={(selected) => handleChange({ name: 'education_id', ...selected })}
                name='education_id'
                options={educationOptions}
                isSelect={true}
                error={errors.education_id}
            />

            {['workplace', 'position', 'workExperience'].map((field, idx) => (
                <InputField
                    key={idx}
                    label={fieldLabels[field]}
                    type='text'
                    value={formValues[field]}
                    onChange={handleChange}
                    name={field}
                    error={errors[field]}
                />
            ))}

            <Row className='form-buttons'>
                <Col xs={6}>
                    <Button variant='outline-secondary' className='back-button' onClick={onBack}>
                        Назад
                    </Button>
                </Col>
                <Col xs={6}>
                    <Button type='submit' variant='primary' className='submit-button'>
                        Зарегистрироваться
                    </Button>
                </Col>
            </Row>
        </Form>
    )
}

export default PersonalDataForm
