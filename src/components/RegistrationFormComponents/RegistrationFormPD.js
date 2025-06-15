import React, { useState, useEffect } from 'react'
import { Form, Col, Row, Button, Alert } from 'react-bootstrap'
import InputField from '../CustomComponents/InputFields/InputField'
import { getAllEducation, getDepartmentsData } from '../../http/dataAPI'
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
        position: '',
        ksu_department: ''
    })

    const [errors, setErrors] = useState({})
    const [educationOptions, setEducationOptions] = useState([])
    const [ksuDepartmentOptions, setKsuDepartmentOptions] = useState([])
    const { login } = useAuth()

    useEffect(() => {
        updateHeight(); // Обновление высоты при изменении ошибок
    }, [errors, updateHeight]);

    const tryRegister = async () => {
        const response = await register(formData)
        if (response?.token) login(response.token)
    }

    const fieldLabels = {
        full_name: 'ФИО',
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
        const fetchDepartmentsData = async () => {
            try {
                const response = await getDepartmentsData()
                const departmentsData = response.data.map(item => ({
                    value: item.name,
                    label: item.name,
                    id: item.id
                }))
                setKsuDepartmentOptions(departmentsData)
            } catch (error) {
                console.error('Ошибка при получении данных о структурных подразделениях:', error)
            }
        }

        fetchEducationData()
        fetchDepartmentsData()
    }, []) // Пустой массив зависимостей

    const validateForm = (values) => {
        const newErrors = {}
        const { full_name, workExperience, workplace, education_id, position } = values

        if (!full_name) newErrors.full_name = 'Поле не должно быть пустым'
        if (!workExperience) newErrors.workExperience = 'Поле не должно быть пустым'
        if (!workplace) newErrors.workplace = 'Поле не должно быть пустым'
        if (!education_id) newErrors.education_id = 'Поле не должно быть пустым'
        if (!position) newErrors.position = 'Поле не должно быть пустым'

        return newErrors
    }

    // const handleKeyPress = (e) => {
    //     if (e.key === ' ') {
    //         e.preventDefault()
    //     }
    // }

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

            {['full_name'].map((field, idx) => (
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

            <Alert variant='info'>Данное поле необходимо для заполнения только для проверяющего структурного подразделения</Alert>
            <InputField
                label='Структурное подразделение КГУ'
                type='text'
                value={ksuDepartmentOptions.find(option => option.value === formValues.ksu_department)}
                onChange={(selected) => handleChange({ name: 'ksu_department', ...selected })}
                options={ksuDepartmentOptions}
                isSelect
            />

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
