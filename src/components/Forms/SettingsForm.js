import React, { useEffect, useState } from 'react'
import { Container, Card, Col, Button, Nav, Tab, Row } from 'react-bootstrap'
import InputField from '../CustomComponents/InputFields/InputField'
import { getUserData } from '../../http/userAPI'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const SettingsForm = ({ userData }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    login: '',
    work_experience: '',
    position: '',
    workplace: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
    newEmail: '',
    newPhone: '',
    created: '',
  })

  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const getUser = async () => {
      const response = await getUserData(userData)

      if (response.data)
        setFormData(prev => ({
          ...prev,
          full_name: response?.data?.full_name || '',
          email: response?.data?.email || '',
          phone: response?.data?.phone || '',
          login: response?.data?.login || '',
          work_experience: response?.data?.work_experience || '',
          position: response?.data?.position || '',
          workplace: response?.data?.workplace || '',
          created: response?.data?.created.split('T')[0] || '',
        }))

    }

    if (userData)
      getUser()
  }, userData)

  const exit = () => {
    logout()
    navigate('/auth')
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <Container as={Col} md={9} lg={7} className="mt-4">
      <Tab.Container defaultActiveKey="profile">
        <Nav variant="tabs" className="border-bottom">
          <Nav.Item className='d-flex' as={Col} md={2}>
            <Nav.Link eventKey="profile" style={{ color: '#1B9AE9' }}>Профиль</Nav.Link>
          </Nav.Item>
          <Nav.Item className='d-flex' as={Col} md={3}>
            <Nav.Link eventKey="security" style={{ color: '#1B9AE9' }}>Безопасность</Nav.Link>
          </Nav.Item>
          <Nav.Item className='d-flex justify-content-end' as={Col} md={7}>
            <Button variant='danger' onClick={exit} style={{ borderRadius: '5px 5px 0px 0px', backgroundColor: 'rgb(255, 102, 102)', border: '1px solid rgba(0, 0, 0, .1)', fontWeight: '500' }}>Выйти из аккаунта</Button>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          {/* Профиль */}
          <Tab.Pane eventKey="profile">
            <Card className="p-3 shadow-sm" style={{ borderRadius: '0px 0px 10px 10px', backgroundColor: '#FFFFFF' }}>
              <h4 className="text-center" style={{ color: '#1B9AE9' }}>Основная информация</h4>
              <InputField label="ФИО" type="text" value={formData?.full_name} disabled />
              <InputField label="Логин" type="text" value={formData?.login} disabled />
              <InputField label="Email" type="email" value={formData?.email} disabled />
              <InputField label="Телефон" type="text" name={'phone'} value={formData?.phone} isPhoneNumber disabled />
              <InputField label="Дата создания" type="text" value={formData?.created} disabled />
              <h4 className="text-center" style={{ color: '#1B9AE9', marginTop: '1.5rem' }}>Профессиональная информация</h4>
              <InputField label="Опыт работы" type="text" name="work_experience" value={formData?.work_experience} onChange={handleChange} />
              <InputField label="Должность" type="text" name="position" value={formData?.position} onChange={handleChange} />
              <InputField label="Место работы" type="text" name="workplace" value={formData?.workplace} onChange={handleChange} />
              {/* <div className="d-flex justify-content-center mt-3">
                <Button variant="primary" style={{ backgroundColor: '#1B9AE9', borderColor: '#1B9AE9' }}>Сохранить изменения</Button>
              </div> */}
            </Card>
          </Tab.Pane>

          {/* Безопасность */}
          <Tab.Pane eventKey="security">
            <Card className="p-3 shadow-sm" style={{ borderRadius: '0px 0px 10px 10px', backgroundColor: '#FFFFFF' }}>
              {/* Смена пароля */}
              <Card className='p-3'>
                <h4 className="text-center m-0" style={{ color: '#1B9AE9' }}>Смена пароля</h4> <hr />
                <InputField label="Текущий пароль" type="password" name="password" value={formData.password} onChange={handleChange} />
                <InputField label="Новый пароль" type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} />
                <InputField label="Подтвердите новый пароль" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                <div className="d-flex justify-content-center mt-2">
                  <Button variant="primary" style={{ backgroundColor: '#1B9AE9', borderColor: '#1B9AE9' }}>Обновить пароль</Button>
                </div>
              </Card>

              {/* Смена Email */}
              <Card className='p-3 mt-3'>
                <h4 className="text-center m-0" style={{ color: '#1B9AE9' }}>Смена Email</h4> <hr />
                <Row>
                  <Col md={9}>
                    <InputField label="Новый Email" type="email" name="newEmail" value={formData.newEmail} onChange={handleChange} />
                  </Col>
                  <Col md={3}>
                    <Button variant="primary" style={{ backgroundColor: '#1B9AE9', borderColor: '#1B9AE9' }}>Обновить <br/> Email</Button>
                  </Col>
                </Row>
              </Card>

              {/* Смена Телефона */}
              <Card className='p-3 mt-3'>
                <h4 className="text-center m-0" style={{ color: '#1B9AE9', marginTop: '1rem' }}>Смена Телефона</h4> <hr />
                <Row>
                  <Col md={9}>
                    <InputField label="Новый телефон" type="text" name="phone" value={formData.newPhone} onChange={handleChange} isPhoneNumber />
                  </Col>
                  <Col md={3}>
                    <Button variant="primary" style={{ backgroundColor: '#1B9AE9', borderColor: '#1B9AE9' }}>Обновить телефон</Button>
                  </Col>
                </Row>
              </Card>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  )
}

export default SettingsForm
