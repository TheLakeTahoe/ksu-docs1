import React, { useEffect, useState } from 'react';
import { Tab, Tabs, Container, Col, Button, Modal, Toast, ToastContainer } from 'react-bootstrap';
import AnnotationForm from '../components/Forms/Documents/AnnotationForm';
import CustomNavbar from '../components/CustomComponents/Other/Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { getPrimaryFormData, getFormAspects, getFormModules } from '../http/dataAPI';
import { getDocumentsData } from '../http/documentAPI';
import EducationalPlanForm from '../components/Forms/Documents/EducationalPlanForm';
import { DocumentsProvider } from './TestContext';

function DocumentsPage({ userData }) {
  const [key, setKey] = useState('1');
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [primaryFormData, setPrimaryFormData] = useState([])
  const [formAspectsData, setFormAspectsData] = useState([])
  const [formModulesData, setFormModulesData] = useState([])
  const [doc1Data, setDoc1Data] = useState([])

  const location = useLocation()
  const navigate = useNavigate()
  const requestID = location.state?.requestID
  const isEditable = location.state?.isEditable

  useEffect(() => {
    if (requestID) {
      const fetchPrimaryFormData = async (requestID) => {
        const primaryFormData = await getPrimaryFormData(requestID)
        setPrimaryFormData(primaryFormData.data.data[0])
      }
      const fetchDocumentsData = async (requestID) => {
        const documents = await getDocumentsData(requestID)
        setDoc1Data(documents.data[0]?.doc1_data)
      }
      const fetchFormAspects = async (requestID) => {
        const formAspectsData = await getFormAspects(requestID)
        setFormAspectsData(formAspectsData.data.aspects)
      }
      const fetchFormModules = async (requestID) => {
        const formModulesData = await getFormModules(requestID)
        setFormModulesData(formModulesData.data.modules)
      }

      fetchPrimaryFormData(requestID)
      fetchDocumentsData(requestID)
      fetchFormAspects(requestID)
      fetchFormModules(requestID)
    }
  }, [requestID])

  if (!requestID) navigate('/main')

  const [tabStates, setTabStates] = useState({
    1: 'notSent',
    2: 'notSent',
    3: 'notSent',
    4: 'notSent',
    5: 'notSent'
  });

  // Функция обновления состояния вкладки
  const updateTabState = (tabKey, state) => {
    setTabStates(prevState => {
      const newState = { ...prevState, [tabKey]: state };

      // Если все вкладки стали "sent" – показываем модальное окно
      if (Object.values(newState).every(s => s === 'sent')) {
        setShowModal(true);
      }

      if (state === 'editing') {
        setShowToast(false);
      }

      return newState;
    });
  };

  // Функция отправки документов
  const handleSendDocuments = () => {
    alert('📨 Документы отправлены!');
    setShowToast(false);
  };

  return (
    <DocumentsProvider>
      <Container className='hide-scrollbar' style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <CustomNavbar full_name={userData.full_name || 'Не авторизован'} />
        <Col md={11}>
          <Tabs activeKey={key} onSelect={(k) => setKey(k)} id="document-tabs" className="mb-3" justify>
            <Tab eventKey="1" title="Аннотация ДОП" tabClassName={tabStates[1]}>
              <AnnotationForm
                requestID={requestID}
                isEditable={isEditable}
                formAspectsData={formAspectsData}
                formModulesData={formModulesData}
                annotationData={doc1Data}
                primaryFormData={primaryFormData}
                onChange={() => updateTabState(1, 'editing')}
                onSave={() => updateTabState(1, 'sent')} />
            </Tab>
            <Tab eventKey="2" title="Учебный план" tabClassName={tabStates[2]}>
              <EducationalPlanForm
                requestID={requestID}
                isEditable={isEditable}
                formModulesData={formModulesData}
                primaryFormData={primaryFormData}
                onChange={() => updateTabState(2, 'editing')}
                onSave={() => updateTabState(2, 'sent')} />
            </Tab>
            <Tab eventKey="3" title="Учебно-тематический план" tabClassName={tabStates[3]}>
              <button onClick={() => updateTabState(3, 'editing')}>Начать редактирование</button>
              <button onClick={() => updateTabState(3, 'sent')}>Отправить</button>
            </Tab>
            <Tab eventKey="4" title="Обеспечение процесса" tabClassName={tabStates[4]}>
              <button onClick={() => updateTabState(4, 'editing')}>Начать редактирование</button>
              <button onClick={() => updateTabState(4, 'sent')}>Отправить</button>
            </Tab>
            <Tab eventKey="5" title="Кадровое обеспечение" tabClassName={tabStates[5]}>
              <button onClick={() => updateTabState(5, 'editing')}>Начать редактирование</button>
              <button onClick={() => updateTabState(5, 'sent')}>Отправить</button>
            </Tab>
          </Tabs>
        </Col>

        {/* Модальное окно с улучшенным стилем */}
        <Modal
          show={showModal}
          onHide={() => {
            setShowModal(false);
            setShowToast(true); // Если закрыл окно – показываем тост
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
              setShowModal(false);
              setShowToast(true); // Если закрыл окно – показываем тост
            }} >
              Закрыть
            </Button>
            <Button variant="primary" onClick={handleSendDocuments} >
              Отправить документы
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
    </DocumentsProvider>
  );
}

export default DocumentsPage;
