import React, { useEffect, useRef, useState } from 'react'
import InputField from '../../CustomComponents/InputFields/InputField' // путь к компоненту
import { Button, Card, Col, Container, Modal, Row, Spinner } from 'react-bootstrap'
import { renderAsync } from 'docx-preview'
import { exportEnsuringTheEducationalProccess, sendDocument } from '../../../http/documentAPI'
import ReviwerTools from '../../CustomComponents/Other/ReviewerTools'

const roomOptions = [
  { label: 'Корпус Е, Е-325', value: '1', address: 'ул. Пушкина, дом Колотушкина', department_id: '1' },
  { label: 'Корпус А, А-101', value: '2', address: 'ул. Другая, дом Тоже другой' },
  { label: 'Корпус Б, Б-201', value: '3', address: 'ул. Новая, дом Тот же' }
]

const EnsuringTheEducationalProccessForm = ({ requestID, onChange, documentsData, setDocumentsData, isEditable, isChecking, onSave }) => {
  const [moduleList, setModuleList] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [moduleErrors, setModuleErrors] = useState({})
  const commonData = documentsData.commonData
  const containerRef = useRef(null)

  useEffect(() => {
    if (commonData && Object.keys(commonData?.modules).length > 0)
      setModuleList(commonData?.modules || [])
  }, [commonData])

  const handleChange = (index, value) => {
    const updatedModules = [...moduleList]
    updatedModules[index] = {
      ...updatedModules[index],
      ksu_data: {
        auditory: value.label,
        auditory_id: value.value,
        address: value.address,
        department_id: value.department_id
      }
    }

    setDocumentsData(prev => ({
      ...prev,
      commonData: {
        ...prev.commonData,
        modules: updatedModules
      }
    }))
    onChange()
  }

  const handleViewDoc = async () => {
    try {
      const response = await exportEnsuringTheEducationalProccess({ commonData })
      if (response.status !== 200) throw new Error("Ошибка при создании файла")

      const blob = response.data
      setShowModal(true)

      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.innerHTML = ""
          renderAsync(blob, containerRef.current)
        }
      }, 1000)
    } catch (error) {
      console.error("Ошибка просмотра документа:", error)
    }
  }

  const handleDownload = async () => {
    try {
      const response = await exportEnsuringTheEducationalProccess({ commonData })
      if (response.status !== 200) throw new Error("Ошибка при создании файла")

      const blob = response.data
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `Обеспечение_образовательного_процесса.docx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Ошибка скачивания файла:", error)
    }
  }

  const validateModules = () => {
    const errors = {}
    moduleList.forEach((module, idx) => {
      const moduleError = {}
      if (!module?.ksu_data?.auditory) {
        moduleError.auditory = 'Выберите учебную аудиторию'
      }
      if (Object.keys(moduleError).length > 0) {
        errors[idx] = moduleError
      }
    })

    setModuleErrors(errors)
    return Object.keys(errors).length === 0
  }

  const sendThisDocument = () => {
    if (!validateModules())
      return
    const dataToSend = {
      ...documentsData,
      EEP: true
    }
    setDocumentsData(dataToSend)
    
    sendDocument(dataToSend, requestID)
    onSave()
  }

  return (
    <Container className='mt-4'>
      {isChecking && (
        <ReviwerTools />
      )}
      <Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {isEditable && (
          <Button className='mb-3' style={{ backgroundColor: 'rgb(27, 154, 233)', border: '1px solid rgba(0, 0, 0, .1)', fontWeight: '500' }} onClick={sendThisDocument}>Сохранить</Button>
        )}
        <Button className='mb-3 ms-2' style={{ backgroundColor: 'rgb(80, 180, 130)', border: '1px solid rgba(0, 0, 0, .1)', fontWeight: '500' }} onClick={handleViewDoc} >Предпросмотр документа</Button>
      </Col>
      {Array.isArray(moduleList) && moduleList.map((module, idx) => (
        <Card
          key={idx}
          className='mb-3 p-3 shadow-sm'
        >
          <Row>
            <Col xs={12} md={4}>
              <InputField
                label='Модуль'
                value={module.name}
                disabled={true}
              />
            </Col>
            <Col xs={12} md={4}>
              <InputField
                isSelect
                label='Учебная аудитория'
                value={roomOptions.find(option => option.label === module?.ksu_data?.auditory)}
                onChange={(val) => handleChange(idx, val)}
                options={roomOptions}
                disabled={!isEditable}
                error={moduleErrors[idx]?.auditory}
              />
            </Col>
            <Col xs={12} md={4}>
              <InputField
                label='Адрес'
                value={module?.ksu_data?.address}
                disabled={true}
              />
            </Col>
          </Row>
        </Card>
      ))}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Предварительный просмотр документа</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div ref={containerRef} style={{
            border: "1px solid #ddd",
            padding: "10px",
            minHeight: "300px",
            display: 'flex',
            flexWrap: 'wrap',
            alignContent: 'center',
            justifyContent: 'center'
          }}>
            <Spinner />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Закрыть</Button>
          <Button style={{ backgroundColor: 'rgb(80, 180, 130)', border: '1px solid rgba(0, 0, 0, .1)' }} onClick={handleDownload}>Скачать DOCX</Button>
        </Modal.Footer>
      </Modal>

    </Container>
  )
}

export default EnsuringTheEducationalProccessForm
