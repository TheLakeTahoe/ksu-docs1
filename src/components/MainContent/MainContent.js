import { useEffect, useState } from 'react'
import { Button, Modal, ListGroup, ListGroupItem, Container, Row, Col, Spinner } from 'react-bootstrap'
import { FiPlus, FiEye, FiEdit, FiCheck, FiX, FiFileText } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { getUserRequests } from '../../http/requestAPI'
import { useAuth } from '../../context/AuthContext'
import { getDocumentsData } from '../../http/documentAPI'

const MainContent = () => {
    const [requests, setRequests] = useState([])
    const [isPageLoading, setIsPageLoading] = useState(true) // Состояние загрузки
    const [modalOpen, setModalOpen] = useState(false)
    const [requestDocuments, setRequestDocuments] = useState([])
    const [selectedRequest, setSelectedRequest] = useState(null)
    const editableStatuses = ["Ожидает документы", "Необходима корректировка"]
    const navigate = useNavigate()

    const { user, isLoading } = useAuth()

    const goToCreateRequest = () => {
        navigate('/request')
    }

    useEffect(() => {
        if (!user && !isLoading)
            navigate('/auth')
    }, [user, isLoading])

    useEffect(() => {
        const fetchMainContentData = async () => {
            try {
                setIsPageLoading(true) // Включаем загрузку
                let account_id = user?.id
                if (!account_id) return
                const response = await getUserRequests(account_id)
                const mainContentData = response.data.userrequests.map(item => ({
                    id: item.id,
                    title: item.program_name,
                    date: item.date.split("T")[0],
                    status: item.status_name,
                    desc: item.description,
                }))
                setTimeout(() => { // setTimeout используется для примера
                    setRequests(mainContentData)
                    setIsPageLoading(false) // Выключаем загрузку
                }, 1000)

            } catch (error) {
                console.error("Ошибка загрузки данных:", error)
            } finally {

            }
        }
        fetchMainContentData()
    }, [user])

    const openRequest = async (request) => {
        setSelectedRequest(request)
        const response = await getDocumentsData(request.id)
        setRequestDocuments(response.data[0].data)
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
        setSelectedRequest(null)
    }

    return (
        <Container style={{ padding: '20px' }}>
            {/* Кнопка для подачи заявки */}
            <Row style={{ marginBottom: '20px' }}>
                <Col className="d-flex justify-content-end">
                    <Button
                        variant="primary"
                        onClick={goToCreateRequest}
                        style={{ backgroundColor: '#1B9AE9', borderColor: '#1B9AE9' }}
                    >
                        <FiPlus style={{ marginRight: '8px' }} /> Подать заявку
                    </Button>
                </Col>
            </Row>

            {/* Если данные загружаются, показываем спиннер */}
            {isPageLoading ? (
                <div className="d-flex justify-content-center align-items-center position-absolute top-0 start-0 w-100 h-100">
                    <Spinner animation="border" variant="info" />
                </div>
            ) : (
                requests.length === 0 ? (
                    <div
                        className="text-center mt-5 p-4 border rounded shadow-sm"
                        style={{
                            backgroundColor: '#f8f9fa',
                            color: '#6c757d',
                            fontSize: '1.1rem',
                            maxWidth: '500px',
                            margin: '0 auto'
                        }}
                    >
                        <p className="mb-2">
                            <strong>Нет заявок</strong>
                        </p>
                        <p className="mb-0">
                            Чтобы подать новую заявку, нажмите кнопку <br /> <strong>«+ Подать заявку»</strong> в правом верхнем углу.
                        </p>
                    </div>
                ) : (
                    <ListGroup style={{ animation: 'fadeIn 0.25s ease' }}>
                        {requests.map((request, index) => (
                            <ListGroupItem key={index} style={{ padding: '15px', border: '1px solid #ddd' }}>
                                <Row>
                                    <Col md={8} style={{ textAlign: 'left' }}>
                                            <strong>{request.title}</strong>
                                    </Col>
                                    <Col md={4} className="d-flex justify-content-between" style={{ color: '#555', textAlign: 'left' }}>
                                        <div>{request.date}</div>
                                        <div style={{ color: '#1B9AE9' }}>{request.status}</div>
                                    </Col>
                                </Row>
                                <Row className='mt-2'>
                                    <Col md={8} className="d-flex justify-content-start align-items-center text-break">{request.desc}</Col>
                                    <Col md={4} className="d-flex justify-content-end align-items-center">
                                        {editableStatuses.includes(request?.status) ? (
                                            <Button
                                                variant="link"
                                                onClick={() => openRequest(request)}
                                                style={{ color: '#1B9AE9', paddingRight: '0' }}
                                            >
                                                <FiEdit style={{ marginRight: '5px' }} /> Редактировать
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="link"
                                                onClick={() => openRequest(request)}
                                                style={{ color: '#1B9AE9', paddingRight: '0' }}
                                            >
                                                <FiEye style={{ marginRight: '5px' }} /> Открыть
                                            </Button>
                                        )}
                                    </Col>
                                </Row>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                )
            )}

            {/* Модальное окно с подробностями заявки */}
            <Modal show={modalOpen} onHide={closeModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedRequest?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="mb-3 align-items-center">
                        <Col>
                            <p className="mb-0"><strong>Дата отправки:</strong> {selectedRequest?.date}</p>
                        </Col>
                        <Col className="text-end">
                            <p className="mb-0"><strong>Статус:</strong> {selectedRequest?.status}</p>
                        </Col>
                    </Row>

                    <hr />
                    <ListGroup className="mb-3">
                        {[
                            { name: "Аннотация ДОП",                            saved: requestDocuments?.ANN },
                            { name: "Учебный план",                             saved: requestDocuments?.EDP },
                            { name: "Учебно-тематический план",                 saved: requestDocuments?.ETP },
                            { name: "Обеспечение образовательного процесса",    saved: requestDocuments?.EEP },
                            { name: "Сведения о кадровом обеспечении",          saved: requestDocuments?.IAS }
                        ].map((doc, index) => (
                            <ListGroup.Item
                                key={index}
                                className="d-flex justify-content-between align-items-center"
                                style={{
                                    backgroundColor: doc.saved ? "rgba(163, 236, 200, 0.75)" : "rgba(255, 122, 122, .75)",
                                    border: "1px solid rgba(0, 0, 0, 0.1)",
                                    borderRadius: "8px",
                                    marginBottom: "3px",
                                    padding: "10px 15px",
                                }}
                            >
                                {doc.name}
                                {doc.saved ? (
                                    <FiCheck style={{ fontSize: "1.25rem", color: "rgb(5, 200, 100)" }} />
                                ) : (
                                    <FiX style={{ fontSize: "1.25rem", color: "rgb(200, 25, 25)" }} />
                                )}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Modal.Body>

                <Modal.Footer className="d-flex justify-content-between">
                    <Button variant="outline-secondary" onClick={closeModal}>Закрыть</Button>

                    {/* Кнопка редактирования, если заявка не на проверке */}
                    {editableStatuses.includes(selectedRequest?.status) ? (
                        <Button
                            style={{
                                fontSize: "1rem",
                                fontWeight: "500",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "8px 16px",
                                borderRadius: "8px",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                backgroundColor: '#1B9AE9',
                                border: 'none'
                            }}
                            onClick={() => navigate('/documents', {
                                state: {
                                    requestID: selectedRequest?.id,
                                    isEditable: true,
                                    isChecking: user?.role_id >= 3
                                }
                            })}
                        >
                            <FiEdit size={20} />
                            Редактировать состав заявки
                        </Button>
                    ) : (
                        <Button
                            style={{
                                fontSize: "1rem",
                                fontWeight: "500",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "8px 16px",
                                borderRadius: "8px",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                backgroundColor: '#1B9AE9',
                                border: 'none'
                            }}
                            onClick={() => navigate('/documents', {
                                state: {
                                    requestID: selectedRequest?.id,
                                    isEditable: false,
                                    isChecking: user?.role_id >= 3
                                }
                            })}
                        >
                            <FiFileText size={20} />
                            Открыть состав заявки
                        </Button>
                    )
                    }
                </Modal.Footer>
            </Modal>




        </Container >
    )
}

export default MainContent
