import { useContext, useEffect, useState } from 'react'
import { Tab, Tabs, Container, Col, Button, Modal, Toast, ToastContainer } from 'react-bootstrap'
import AnnotationForm from '../components/Forms/Documents/AnnotationForm'
import CustomNavbar from '../components/CustomComponents/Other/Navbar'
import { useLocation, useNavigate } from 'react-router-dom'
import EducationalPlanForm from '../components/Forms/Documents/EducationalPlanForm'
import { DocumentsContext } from '../context/DocumentsContext'
import { fillDocuments } from '../utils/fillDocumentsData'
import EducationalAndThematicPlanForm from '../components/Forms/Documents/EducationalAndThematicPlanForm'
import InformationAboutStaffingForm from '../components/Forms/Documents/InformationAboutStaffing'
import EnsuringTheEducationalProccessForm from '../components/Forms/Documents/EnsuringTheEducationalProccess'
import { useAuth } from '../context/AuthContext'
import { getDocumentsData, sendDocumentGroup } from '../http/documentAPI'

function DocumentsPage() {
  const [key, setKey] = useState('1')
  const [showModal, setShowModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [requestDocuments, setRequestDocuments] = useState()
  const { documentsData, setDocumentsData } = useContext(DocumentsContext)
  const commonDataFieldsName = useContext(DocumentsContext)
  const { user, isLoading } = useAuth()

  const location = useLocation()
  const navigate = useNavigate()
  const { requestID, isEditable, isChecking } = location.state || {}

  useEffect(() => {
    if (!user && !isLoading)
      navigate('/auth')
  }, [user])

  // Заполнение форм данными при входе на страницу
  useEffect(() => {
    fillDocuments(requestID, setDocumentsData)
    const checkDocumentStatuses = async () => {
      const response = await getDocumentsData(requestID)
      setRequestDocuments(response?.data[0].data)
    }
    checkDocumentStatuses()

  }, [requestID])

  // Проверка на редактирование общих полей (Здесь определяется какие вкладки должны перейти в Состояние: "Редактируется")
  const handleCommonDataEdit = (field_name) => {
    const changedTabs = Object.entries(commonDataFieldsName.commonDataFieldsName)
      .filter(([_, fields]) => Array.isArray(fields) && fields.includes(field_name))
      .map(([tabKey]) => Number(tabKey))

    if (changedTabs)
      changedTabs.forEach(element => {
        updateTabState(element, 'editing')
      })

  }

  console.log(requestDocuments)

  if (!requestID) navigate('/main')

  const [tabStates, setTabStates] = useState({
    1: 'notSent',
    2: 'notSent',
    3: 'notSent',
    4: 'notSent',
    5: 'notSent'
  })

  useEffect(() => {
    const updatedTabStates = {
      1: requestDocuments?.ANN ? 'sent' : 'notSent',
      2: requestDocuments?.EDP ? 'sent' : 'notSent',
      3: requestDocuments?.ETP ? 'sent' : 'notSent',
      4: requestDocuments?.EEP ? 'sent' : 'notSent',
      5: requestDocuments?.IAS ? 'sent' : 'notSent'
    }
    setTabStates(updatedTabStates)

    if (Object.values(updatedTabStates).every(s => s === 'sent') && isEditable) {
      setShowModal(true)
    }

  }, [requestDocuments])

  // Функция обновления Состояния вкладки
  const updateTabState = (tabKey, state) => {
    setTabStates(prevState => {
      const newState = { ...prevState, [tabKey]: state }

      // Если все вкладки стали "sent" – показываем модальное окно
      if (Object.values(newState).every(s => s === 'sent')) {
        setShowModal(true)
      }

      if (state === 'editing') {
        setShowToast(false)
      }

      return newState
    })
  }

  const sendDocuments = async () => {
    const response = await sendDocumentGroup(requestID)
    console.log(response)
    return response.data.success
  }

  // Функция отправки документов
  const handleSendDocuments = () => {
    if (sendDocuments()) {
      setShowModal(false)
      setShowToast(false)
      setShowSuccessModal(true)
    }
  }

  return (
    <Container className='hide-scrollbar' style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <CustomNavbar full_name={user?.full_name || 'Не авторизован'} />
      <Col md={11}>
        <Tabs activeKey={key} onSelect={(k) => setKey(k)} id="document-tabs" className="mb-3" justify>
          <Tab eventKey="1" title="Аннотация ДОП" tabClassName={tabStates[1]}>
            <AnnotationForm
              userData={user}
              requestID={requestID}
              isEditable={isEditable}
              isChecking={isChecking}
              documentsData={documentsData}
              setDocumentsData={setDocumentsData}
              onChange={(field_name) => {
                updateTabState(1, 'editing')
                handleCommonDataEdit(field_name)
              }}
              onSave={() => updateTabState(1, 'sent')} />
          </Tab>
          <Tab eventKey="2" title="Учебный план" tabClassName={tabStates[2]}>
            <EducationalPlanForm
              userData={user}
              requestID={requestID}
              isEditable={isEditable}
              isChecking={isChecking}
              documentsData={documentsData}
              setDocumentsData={setDocumentsData}
              onChange={(field_name) => {
                updateTabState(2, 'editing')
                handleCommonDataEdit(field_name)
              }}
              onSave={() => updateTabState(2, 'sent')} />
          </Tab>
          <Tab eventKey="3" title="Учебно-тематический план" tabClassName={tabStates[3]}>
            <EducationalAndThematicPlanForm
              userData={user}
              requestID={requestID}
              isEditable={isEditable}
              isChecking={isChecking}
              documentsData={documentsData}
              setDocumentsData={setDocumentsData}
              onChange={(field_name) => {
                updateTabState(3, 'editing')
                handleCommonDataEdit(field_name)
              }}
              onSave={() => updateTabState(3, 'sent')}
            />
          </Tab>
          <Tab eventKey="4" title="Обеспечение процесса" tabClassName={tabStates[4]}>
            <EnsuringTheEducationalProccessForm
              userData={user}
              requestID={requestID}
              isEditable={isEditable}
              isChecking={isChecking}
              documentsData={documentsData}
              setDocumentsData={setDocumentsData}
              onChange={(field_name) => {
                updateTabState(4, 'editing')
                handleCommonDataEdit(field_name)
              }}
              onSave={() => updateTabState(4, 'sent')}
            />
          </Tab>
          <Tab eventKey="5" title="Кадровое обеспечение" tabClassName={tabStates[5]}>
            <InformationAboutStaffingForm
              userData={user}
              requestID={requestID}
              isEditable={isEditable}
              isChecking={isChecking}
              documentsData={documentsData}
              setDocumentsData={setDocumentsData}
              onChange={(field_name) => {
                updateTabState(5, 'editing')
                handleCommonDataEdit(field_name)
              }}
              onSave={() => updateTabState(5, 'sent')}
            />
          </Tab>
        </Tabs>
      </Col>

      {/* Модальное окно с улучшенным стилем */}
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false)
          setShowToast(true) // Если закрыл окно – показываем тост
        }}
        centered
        backdrop="static" // Запрещает клик по фону
        dialogClassName="modal-custom" // Добавим кастомный класс
      >
        <Modal.Header closeButton>
          <Modal.Title>Документы готовы к отправке</Modal.Title>
        </Modal.Header>
        <Modal.Body>Все документы успешно заполнены и могут быть отправлены.</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => {
            setShowModal(false)
            setShowToast(true) // Если закрыл окно – показываем тост
          }} >
            Закрыть
          </Button>
          <Button variant="primary" onClick={handleSendDocuments} >
            Отправить документы
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showSuccessModal}
        onHide={() => {
          setShowSuccessModal(false)
        }}
        centered
        backdrop="static" // Запрещает клик по фону
        dialogClassName="modal-custom" // Добавим кастомный класс
      >
        <Modal.Header>
          <Modal.Title>Документы отправлены</Modal.Title>
        </Modal.Header>
        <Modal.Body>Документы успешно отправлены на проверку.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => {
            navigate('/main')
            setShowSuccessModal(false)
          }} >
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Тост-уведомление */}
      <ToastContainer
        position="bottom-end"
        className="p-3"
        style={{ position: 'fixed', bottom: 20, right: 20 }} // Фиксируем тост
      >
        <Toast
          bg="success"
          show={showToast}
          variant='success'
          onClose={() => setShowToast(false)}
        >
          <Toast.Body style={{ WebkitTextFillColor: "white" }}>
            Документы готовы к отправке!
            <div className="mt-2 d-flex justify-content-end">
              <Button variant="light" size="sm" onClick={handleSendDocuments} style={{ WebkitTextFillColor: 'black' }}>
                Отправить
              </Button>
            </div>
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  )
}

export default DocumentsPage
