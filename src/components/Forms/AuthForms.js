import Nav from 'react-bootstrap/Nav'
import { useRef, useState, useEffect, useCallback } from 'react'
import { Col, Container } from 'react-bootstrap'
import { motion, AnimatePresence } from 'framer-motion'
import RegistrationPage from './RegistrationForm'
import LoginForm from './LoginForm'
// import ResetRequestPage from '../ResetRequestPage'

function AuthForms() {
  const [activeTab, setActiveTab] = useState('login')
  const [containerHeight, setContainerHeight] = useState(null)
  const contentRef = useRef(null)

  const updateHeight = useCallback(() => {
    if (contentRef.current) {
      setContainerHeight(contentRef.current.scrollHeight + 100)
    }
  }, [])

  useEffect(() => {
    updateHeight()
  }, [activeTab, updateHeight])

  return (
    <Container
      as={Col}
      md={6}
      className='p-4'
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        height: containerHeight,
        transition: 'height 0.2s ease-in-out',
        overflow: 'hidden',
      }}
    >
      {/* Навигационные вкладки */}
      <Nav
        justify
        variant="tabs"
        activeKey={activeTab}
        onSelect={(selectedKey) => setActiveTab(selectedKey)}
        style={{
          borderBottom: '2px solid #1B9AE9',
        }}
      >
        <Nav.Item>
          <Nav.Link
            eventKey="login"
            style={{
              color: activeTab === 'login' ? '#1B9AE9' : '#333',
              fontWeight: '500',
              transition: 'color 0.3s ease',
            }}
            onMouseOver={(e) => e.target.style.color = '#157BB8'}
            onMouseOut={(e) => e.target.style.color = activeTab === 'login' ? '#1B9AE9' : '#333'}
          >
            Авторизация
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link
            eventKey="register"
            style={{
              color: activeTab === 'register' ? '#1B9AE9' : '#333',
              fontWeight: '500',
              transition: 'color 0.3s ease',
            }}
            onMouseOver={(e) => e.target.style.color = '#157BB8'}
            onMouseOut={(e) => e.target.style.color = activeTab === 'register' ? '#1B9AE9' : '#333'}
          >
            Регистрация
          </Nav.Link>
        </Nav.Item>

        {/* <Nav.Item>
          <Nav.Link 
            eventKey="resetrequest" 
            style={{
              color: activeTab === 'resetrequest' ? '#1B9AE9' : '#333',
              fontWeight: '500',
              transition: 'color 0.3s ease',
            }}
            onMouseOver={(e) => e.target.style.color = '#157BB8'}
            onMouseOut={(e) => e.target.style.color = activeTab === 'resetrequest' ? '#1B9AE9' : '#333'}
          >
            Сброс пароля
          </Nav.Link>
        </Nav.Item> */}
      </Nav>

      {/* Контент с анимацией */}
      <div className="mt-3" ref={contentRef}>
        <AnimatePresence mode="wait">
          {activeTab === 'login' && (
            <motion.div
              key="login"
            >
              <LoginForm updateHeight={updateHeight} />
            </motion.div>
          )}
          {activeTab === 'register' && (
            <motion.div
              key="register"
            >
              <RegistrationPage updateHeight={updateHeight} />
            </motion.div>
          )}
          {/* {activeTab === 'resetrequest' && (
            <motion.div
              key="resetrequest"
            >
              <ResetRequestPage />
            </motion.div>
          )} */}
        </AnimatePresence>
      </div>
    </Container>
  )
}

export default AuthForms
