import { Row, Col, Card, Container, Button, Modal, Spinner } from 'react-bootstrap'
import InputField from '../../CustomComponents/InputFields/InputField'
import { useEffect, useRef, useState } from 'react'
import { renderAsync } from 'docx-preview'
import { exportInformationAboutStaffing, sendDocument } from '../../../http/documentAPI'
import ReviwerTools from '../../CustomComponents/Other/ReviewerTools'
import { getAllTeachers } from '../../../http/dataAPI'

const TeachersForm = ({ module, modules, index, isEditable, onChange, teachersList, setTeachersList, setDocumentsData, moduleErrors }) => {
  const teachers = Array.isArray(teachersList) ? teachersList : []
  const [modalErrors, setModalErrors] = useState({})
  const contractList = [
    { value: 'Договор гражданско-правового характера', label: 'Договор гражданско-правового характера' },
    { value: '-', label: '-' }
  ]
  const [showModal, setShowModal] = useState(false)
  const [newTeacher, setNewTeacher] = useState({
    full_name: '',
    workplace: '',
    position: '',
    institution: '',
    degree: '',
    exp_total: '',
    exp_subject: '',
    contract: ''
  })

  //#region FillingAndValidating
  const validateModal = () => {
    const errors = {}
    const modalErrors = {}
    if (!newTeacher?.full_name)
      modalErrors.full_name = 'Поле не заполнено'

    if (!newTeacher?.workplace)
      modalErrors.workplace = 'Поле не заполнено'

    if (!newTeacher?.position)
      modalErrors.position = 'Поле не заполнено'

    if (!newTeacher?.institution)
      modalErrors.institution = 'Поле не заполнено'

    if (!newTeacher?.degree)
      modalErrors.degree = 'Поле не заполнено'

    if (!newTeacher?.exp_total)
      modalErrors.exp_total = 'Поле не заполнено'

    if (!newTeacher?.exp_subject)
      modalErrors.exp_subject = 'Поле не заполнено'

    if (!newTeacher?.contract)
      modalErrors.contract = 'Поле не заполнено'

    if (Object.keys(modalErrors).length > 0)
      Object.assign(errors, modalErrors)

    setModalErrors(errors)

    return Object.keys(errors).length === 0
  }
  //#endregion

  //#region Input
  const handleSelectChange = (val, field) => {
    if (val.value === '__add__') {
      setShowModal(true)
      handleChange({ target: { value: '' } }, field)
      return
    }
    if (field === 'full_name') {
      setDocumentsData(prev => {
        const updatedModules = [...prev.commonData?.modules]
        updatedModules[index] = {
          ...updatedModules[index],
          teacher: {
            full_name: val.value || '',
            workplace: val.workplace || '',
            institution: val.institution || '',
            degree: val.degree || '',
            position: val.position || '',
            exp_total: val.exp_total || '',
            exp_subject: val.exp_subject || '',
            contract: val.contract || '' // добавь контракт, если есть
          }
        }

        return {
          ...prev,
          commonData: {
            ...prev.commonData,
            modules: updatedModules
          }
        }
      })
    }
    else
      handleChange({ target: { value: val.value } }, field)
  }

  const handleChange = (value, field) => {
    const modulesList = Array.isArray(modules) ? modules : []
    const teacherInfo = modules[index].teacher
    const updatedModules = [...modulesList]
    updatedModules[index] = {
      ...updatedModules[index],
      teacher: {
        ...teacherInfo,
        [field]: value?.target?.value
      }
    }

    setDocumentsData(prev => ({
      ...prev,
      commonData: {
        ...prev.commonData,
        modules: updatedModules
      }
    }))

    onChange(field)
  }

  //#endregion

  //#region Submit
  const handleModalSave = () => {
    const newOption = {
      value: newTeacher.full_name, label: newTeacher.full_name, workplace: newTeacher.workplace,
      position: newTeacher.position, institution: newTeacher.institution, degree: newTeacher.degree,
      exp_total: newTeacher.exp_total, exp_subject: newTeacher.exp_subject, contract: newTeacher.contract
    }
    if (!validateModal()) return
    setTeachersList(prev => [...prev, newOption])

    setNewTeacher({ full_name: '', workplace: '', position: '', institution: '', degree: '', exp_total: '', exp_subject: '', contract: '' })
    setShowModal(false)

  }

  //#endregion

  return (
    <Card className="p-3 mb-4 shadow-sm border border-light-subtle">
      <h5 className="mb-3">Модуль: {module.name}</h5>

      <Row className="mb-3">
        <Col xs={12} md={6}>
          <InputField
            label="ФИО"
            value={teachersList.find(option => option.value === module?.teacher?.full_name) || null}
            onChange={(e) => handleSelectChange(e, 'full_name')}
            isSelect
            options={[...teachers, { value: '__add__', label: '+ Добавить преподавателя' }]}
            disabled={!isEditable}
            error={moduleErrors[index]?.full_name}
          />

          <InputField
            label="Место работы"
            value={module?.teacher?.workplace}
            onChange={(e) => handleChange(e, 'workplace')}
            disabled={!isEditable}
            error={moduleErrors[index]?.workplace}
          />
          <InputField
            label="Должность"
            value={module?.teacher?.position}
            onChange={(e) => handleChange(e, 'position')}
            disabled={!isEditable}
            error={moduleErrors[index]?.position}
          />
          <InputField
            label="Учебное заведение"
            value={module?.teacher?.institution}
            onChange={(e) => handleChange(e, 'institution')}
            disabled={!isEditable}
            error={moduleErrors[index]?.institution}
          />

        </Col>
        <Col xs={12} md={6}>
          <InputField
            label="Ученая степень / звание / категория"
            value={module?.teacher?.degree}
            onChange={(e) => handleChange(e, 'degree')}
            disabled={!isEditable}
            error={moduleErrors[index]?.degree}
          />
          <InputField
            label="Стаж работы (всего)"
            value={module?.teacher?.exp_total}
            onChange={(e) => handleChange(e, 'exp_total')}
            disabled={!isEditable}
            error={moduleErrors[index]?.exp_total}
          />
          <InputField
            label="Стаж по дисциплине"
            value={module?.teacher?.exp_subject}
            onChange={(e) => handleChange(e, 'exp_subject')}
            disabled={!isEditable}
            error={moduleErrors[index]?.exp_subject}
          />
          <InputField
            label="Условия привлечения"
            value={contractList.find(option => option.value === module?.teacher?.contract) || null}
            onChange={(e) => handleSelectChange(e, 'contract')}
            disabled={!isEditable}
            isSelect
            options={contractList}
            error={moduleErrors[index]?.contract}
          />
        </Col>
      </Row>
      {/* Модальное окно добавления преподавателя */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size='lg' centered>
        <Modal.Header closeButton>
          <Modal.Title>Добавить преподавателя</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <InputField
                label="ФИО"
                value={newTeacher.full_name}
                onChange={(e) => setNewTeacher(prev => ({ ...prev, full_name: e.target.value }))}
                error={modalErrors?.full_name}
              />
              <InputField
                label="Место работы"
                value={newTeacher.workplace}
                onChange={(e) => setNewTeacher(prev => ({ ...prev, workplace: e.target.value }))}
                error={modalErrors?.workplace}
              />
              <InputField
                label="Должность"
                value={newTeacher.position}
                onChange={(e) => setNewTeacher(prev => ({ ...prev, position: e.target.value }))}
                error={modalErrors?.position}
              />
              <InputField
                label="Учебное заведение"
                value={newTeacher.institution}
                onChange={(e) => setNewTeacher(prev => ({ ...prev, institution: e.target.value }))}
                error={modalErrors?.institution}
              />
            </Col>
            <Col md={6}>
              <InputField
                label="Уч. степень / звание"
                value={newTeacher.degree}
                onChange={(e) => setNewTeacher(prev => ({ ...prev, degree: e.target.value }))}
                error={modalErrors?.degree}
              />
              <InputField
                label="Стаж общий"
                value={newTeacher.exp_total}
                onChange={(e) => setNewTeacher(prev => ({ ...prev, exp_total: e.target.value }))}
                error={modalErrors?.exp_total}
              />
              <InputField
                label="Стаж по дисциплине"
                value={newTeacher.exp_subject}
                onChange={(e) => setNewTeacher(prev => ({ ...prev, exp_subject: e.target.value }))}
                error={modalErrors?.exp_subject}
              />
              <InputField
                label="Условия привлечения"
                value={contractList.find(option => option.value === newTeacher.contract) || null}
                isSelect
                onChange={(val) => setNewTeacher(prev => ({ ...prev, contract: val.value }))}
                options={contractList}
                error={modalErrors?.contract}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Отмена</Button>
          <Button variant="primary" onClick={handleModalSave}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    </Card>
  )
}

const InformationAboutStaffingForm = ({ documentsData, setDocumentsData, isEditable, isChecking, onChange, requestID, onSave }) => {

  const [showModal, setShowModal] = useState(false)
  const containerRef = useRef(null)
  const [modules, setModules] = useState([])
  const [moduleErrors, setModuleErrors] = useState({})
  const commonData = documentsData.commonData
  const [teachersList, setTeachersList] = useState([])

  //#region FillingAndValidating
  useEffect(() => {
    if (commonData && Object.keys(commonData?.modules).length > 0)
      setModules(commonData?.modules || [])
  }, [commonData])

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await getAllTeachers()
        const teacherOptions = response.data.map(item => ({
          value: item.full_name,
          label: item.full_name,
          id: item.id,
          exp_total: item.exp_total || '',
          exp_subject: item.exp_subject || '',
          position: item.position || '',
          degree: item.degree || '',
          institution: item.institution || '',
          workplace: item.workplace || '',
          contract: item.contract || ''
        }))
        setTeachersList(teacherOptions)

      } catch (error) {
        console.error('Ошибка при получении данных о преподавателях:', error)
      }
    }

    fetchTeachers()
  }, [isEditable])

  const validateModules = () => {
    const errors = {}
    modules.forEach((module, idx) => {
      const moduleError = {}
      if (!module?.teacher?.full_name)
        moduleError.full_name = 'Поле не заполнено'

      if (!module?.teacher?.workplace)
        moduleError.workplace = 'Поле не заполнено'

      if (!module?.teacher?.position)
        moduleError.position = 'Поле не заполенено'

      if (!module?.teacher?.institution)
        moduleError.institution = 'Поле не заполнено'

      if (!module?.teacher?.degree)
        moduleError.degree = 'Поле не заполнено'

      if (!module?.teacher?.exp_total)
        moduleError.exp_total = 'Поле не заполнено'

      if (!module?.teacher?.exp_subject)
        moduleError.exp_subject = 'Поле не заполнено'

      if (!module?.teacher?.contract)
        moduleError.contract = 'Поле не заполнено'

      if (Object.keys(moduleError).length > 0)
        errors[idx] = moduleError

    })

    setModuleErrors(errors)
    return Object.keys(errors).length === 0
  }
  //#endregion

  //#region DocxTemplater
  const handleViewDoc = async () => {
    try {
      const response = await exportInformationAboutStaffing({ commonData })
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
      const response = await exportInformationAboutStaffing({ commonData })
      if (response.status !== 200) throw new Error("Ошибка при создании файла")

      const blob = response.data
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `Сведения_о_кадровом_обеспечении.docx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Ошибка скачивания файла:", error)
    }
  }
  //#endregion

  //#region Submit
  const sendThisDocument = () => {
    if (!validateModules()) return
    const dataToSend = {
      ...documentsData,
      IAS: true
    }
    setDocumentsData(dataToSend)

    sendDocument(dataToSend, requestID)
    onSave()
  }
  //#endregion


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
      {Array.isArray(modules) && modules.map((module, index) => (
        <TeachersForm
          index={index}
          name={module.name}
          module={module}
          modules={modules}
          isEditable={isEditable}
          teachersList={teachersList}
          setTeachersList={setTeachersList}
          onChange={onChange}
          setDocumentsData={setDocumentsData}
          moduleErrors={moduleErrors}
        />
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

export default InformationAboutStaffingForm
