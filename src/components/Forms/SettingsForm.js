import React, { useState } from 'react';
import { Container, Card, Col, Button, Nav, Tab } from 'react-bootstrap';
import InputField from '../CustomComponents/InputFields/InputField';

const SettingsForm = ({ userData }) => {
  const [formData, setFormData] = useState({
    full_name: userData.full_name,
    email: userData.email,
    phone: userData.phone,
    login: userData.login,
    work_experience: userData.work_experience || '',
    position: userData.position || '',
    workplace: userData.workplace || '',
    password: '',
    newPassword: '',
    confirmPassword: '',
    newEmail: '',
    newPhone: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Container as={Col} md={9} lg={7} className="mt-4">
      <Tab.Container defaultActiveKey="profile">
        <Nav variant="tabs" className="border-bottom">
          <Nav.Item>
            <Nav.Link eventKey="profile" style={{ color: '#1B9AE9' }}>Профиль</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="security" style={{ color: '#1B9AE9' }}>Безопасность</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          {/* Профиль */}
          <Tab.Pane eventKey="profile">
            <Card className="p-3 shadow-sm" style={{ borderRadius: '0px 0px 10px 10px', backgroundColor: '#FFFFFF' }}>
              <h4 className="text-center" style={{ color: '#1B9AE9' }}>Основная информация</h4>
              <InputField label="ФИО" type="text" value={formData.full_name} disabled />
              <InputField label="Логин" type="text" value={formData.login} disabled />
              <InputField label="Email" type="email" value={formData.email} disabled />
              <InputField label="Телефон" type="text" name={'phone'} value={formData.phone} isPhoneNumber disabled />
              <InputField label="Дата создания" type="text" value={userData.created} disabled />
              <h4 className="text-center" style={{ color: '#1B9AE9', marginTop: '1.5rem' }}>Профессиональная информация</h4>
              <InputField label="Опыт работы" type="text" name="work_experience" value={formData.work_experience} onChange={handleChange} />
              <InputField label="Должность" type="text" name="position" value={formData.position} onChange={handleChange} />
              <InputField label="Место работы" type="text" name="workplace" value={formData.workplace} onChange={handleChange} />
              <div className="d-flex justify-content-center mt-3">
                <Button variant="primary" style={{ backgroundColor: '#1B9AE9', borderColor: '#1B9AE9' }}>Сохранить изменения</Button>
              </div>
            </Card>
          </Tab.Pane>

          {/* Безопасность */}
          <Tab.Pane eventKey="security">
            <Card className="p-3 shadow-sm" style={{ borderRadius: '0px 0px 10px 10px', backgroundColor: '#FFFFFF' }}>
                {/* Смена пароля */}
                  <h4 className="text-center" style={{ color: '#1B9AE9' }}>Смена пароля</h4>
                  <InputField label="Текущий пароль" type="password" name="password" value={formData.password} onChange={handleChange} />
                  <InputField label="Новый пароль" type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} />
                  <InputField label="Подтвердите новый пароль" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                  <div className="d-flex justify-content-center mt-2">
                    <Button variant="primary" style={{ backgroundColor: '#1B9AE9', borderColor: '#1B9AE9' }}>Обновить пароль</Button>
                  </div>

                {/* Смена Email и Телефона */}
                  {/* Смена Email */}
                  <h4 className="text-center" style={{ color: '#1B9AE9' }}>Смена Email</h4>
                  <InputField label="Новый Email" type="email" name="newEmail" value={formData.newEmail} onChange={handleChange} />
                  <div className="d-flex justify-content-center mt-2">
                    <Button variant="primary" style={{ backgroundColor: '#1B9AE9', borderColor: '#1B9AE9' }}>Обновить Email</Button>
                  </div>

                  {/* Смена Телефона */}
                  <h4 className="text-center" style={{ color: '#1B9AE9', marginTop: '1rem' }}>Смена Телефона</h4>
                  <InputField label="Новый телефон" type="text" name="phone" value={formData.newPhone} onChange={handleChange} isPhoneNumber />
                  <div className="d-flex justify-content-center mt-2">
                    <Button variant="primary" style={{ backgroundColor: '#1B9AE9', borderColor: '#1B9AE9' }}>Обновить телефон</Button>
                  </div>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default SettingsForm;
