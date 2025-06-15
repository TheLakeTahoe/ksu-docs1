import 'bootstrap/dist/css/bootstrap.min.css'
import { Alert, Button, Col, Modal, Row } from 'react-bootstrap'
import { goToEditState, goToNextState, goToRejectState, sendDocument } from '../../../http/documentAPI'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DocumentsContext } from '../../../context/DocumentsContext'

// Проверяем, есть ли ошибки по заданным полям в commonData.errors
const hasErrorsForFields = (fields, commonDataErrors) => {
    for (const fieldPath of fields) {
        // Для проверки ошибки нужно взять поле из errors, которое совпадает с последним ключом из пути
        // Например: для commonData.program.program_name -> errors.program.program_name
        const keys = fieldPath.split('.')
        if (keys.length < 3) continue // Структура: commonData.*.*
        const errorSection = commonDataErrors?.[keys[1]]
        const errorField = keys[2]
        if (errorSection && errorSection[errorField]) {
            return true
        }
    }
    return false
}

const ReviwerTools = ({ userData, requestID, isAnnotation, dataToSend }) => {

    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [modalText, setModalText] = useState()
    const navigate = useNavigate()
    const commonDataFieldsName = useContext(DocumentsContext)

    const fieldsByDoc = {
        ANN: commonDataFieldsName.commonDataFieldsName[1],
        EDP: commonDataFieldsName.commonDataFieldsName[2],
        ETP: commonDataFieldsName.commonDataFieldsName[3],
        EEP: commonDataFieldsName.commonDataFieldsName[4], // нет полей для проверки
        IAS: commonDataFieldsName.commonDataFieldsName[5], // нет полей для проверки
    }

    const Reject = () => {
        if (dataToSend) {
            const updatedData = dataToSend
            sendDocument(updatedData, requestID)
            goToRejectState(requestID)
            setModalText('Заявка отклонена!')
            setShowSuccessModal(true)
        }
    }

    const checkAndUpdateFlags = (data) => {
        if (!data || !data.commonData) return data

        // Создаем копию данных, чтобы не мутировать пропсы
        const newData = { ...data }

        // Для каждого документа проверяем ошибки и ставим флаг false, если ошибки есть
        ['ANN', 'EDP', 'EEP', 'ETP', 'IAS'].forEach((docKey) => {
            const fieldsToCheck = fieldsByDoc[docKey] || []
            if (fieldsToCheck.length === 0) {
                // Если полей нет, не меняем флаг
                return
            }
            const errors = newData.commonData.errors || {}
            if (hasErrorsForFields(fieldsToCheck, errors)) {
                newData[docKey] = false
            }
        })

        return newData
    }

    const Edit = () => {
        if (dataToSend) {
            const updatedData = checkAndUpdateFlags(dataToSend)
            sendDocument(updatedData, requestID)
            goToEditState(requestID)
            setModalText('Документы отправлены на корректировку!')
            setShowSuccessModal(true)
        }
    }

    const Accept = () => {
        if (dataToSend) {
            const updatedData = dataToSend

            // Очистка данных об ошибках если они были
            delete updatedData.commonData.errors
            delete updatedData.annotation.errors
            delete updatedData.commonData.checkbox
            delete updatedData.annotation.checkbox

            sendDocument(updatedData, requestID)
            goToNextState(requestID)
            setModalText('Документы отправлены!')
            setShowSuccessModal(true)
        }
    }

    return (
        <>
            <Alert variant="info">
                <Alert.Heading>Информация для проверяющих!</Alert.Heading>
                <strong>Проверьте все документы</strong>, они отправляются <strong>только со страницы Аннотации ДОП.</strong><hr />
                Если на Ваш взгляд информация в поле введена неверно, то проставьте флаг "Есть ошибки" и укажите что с полем не так.
            </Alert>
            {isAnnotation && (
                <Row>
                    <Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button className='mb-3 ms-2' style={{ backgroundColor: 'rgb(255, 102, 102)', border: '1px solid rgba(0, 0, 0, .1)', fontWeight: '500' }} onClick={Reject}>Отклонить</Button>
                        <Button className='mb-3 ms-2' style={{ backgroundColor: 'rgb(255, 223, 102)', border: '1px solid rgba(0, 0, 0, .1)', color: 'black', fontWeight: '500' }} onClick={Edit}>На корректировку</Button>
                        <Button className='mb-3 ms-2' style={{ backgroundColor: 'rgb(102, 204, 153)', border: '1px solid rgba(0, 0, 0, .1)', fontWeight: '500' }} onClick={Accept}>Одобрить</Button>
                    </Col>
                </Row>
            )}
            <hr />

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
                <Modal.Body>{modalText}</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => {
                        navigate('/main')
                        setShowSuccessModal(false)
                    }} >
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ReviwerTools
