import { Row, Col, Card, Container, Button, Modal, Spinner } from 'react-bootstrap'
import InputField from '../../CustomComponents/InputFields/InputField'
import { useEffect, useRef, useState } from 'react'
import { renderAsync } from 'docx-preview'
import { exportInformationAboutStaffing, sendDocument } from '../../../http/documentAPI'
import ReviwerTools from '../../CustomComponents/Other/ReviewerTools'

const TeachersForm = ({ module, modules, index, isEditable, onChange, teachersList, setTeachersList, setDocumentsData, moduleErrors }) => {
  const teachers = Array.isArray(teachersList) ? teachersList : []
  const [modalErrors, setModalErrors] = useState({});
  const contractList = [
    { value: 'Договор гражданско-правового характера', label: 'Договор гражданско-правового характера' },
    { value: '-', label: '-' }
  ]
  const [showModal, setShowModal] = useState(false)
  const [newTeacher, setNewTeacher] = useState({
    full_name: '',
    workplace: '',
    education: '',
    degree: '',
    experience_total: '',
    experience_subject: '',
    contract: ''
  })

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
            education: val.education || '',
            degree: val.degree || '',
            experience_total: val.experience_total || '',
            experience_subject: val.experience_subject || '',
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

  const validateModal = () => {
    const errors = {};
    const modalErrors = {};
    if (!newTeacher?.full_name) {
      modalErrors.full_name = 'Поле не заполнено';
    }
    if (!newTeacher?.workplace) {
      modalErrors.workplace = 'Поле не заполнено';
    }
    if (!newTeacher?.education) {
      modalErrors.education = 'Поле не заполнено';
    }
    if (!newTeacher?.degree) {
      modalErrors.degree = 'Поле не заполнено';
    }
    if (!newTeacher?.experience_total) {
      modalErrors.experience_total = 'Поле не заполнено';
    }
    if (!newTeacher?.experience_subject) {
      modalErrors.experience_subject = 'Поле не заполнено';
    }
    if (!newTeacher?.contract) {
      modalErrors.contract = 'Поле не заполнено';
    }
    if (Object.keys(modalErrors).length > 0) {
      Object.assign(errors, modalErrors);
    }
    setModalErrors(errors)

    return Object.keys(errors).length === 0
  }


  const handleModalSave = () => {
    const newOption = {
      value: newTeacher.full_name, label: newTeacher.full_name, workplace: newTeacher.workplace,
      education: newTeacher.education, degree: newTeacher.degree, experience_total: newTeacher.experience_total,
      experience_subject: newTeacher.experience_subject, contract: newTeacher.contract
    }
    if (!validateModal()) return
    setTeachersList(prev => [...prev, newOption])

    setNewTeacher({ full_name: '', workplace: '', education: '', degree: '', experience_total: '', experience_subject: '', contract: '' })
    setShowModal(false)

  }

  return (
    <Card className="p-3 mb-4 shadow-sm border border-light-subtle">
      <h5 className="mb-3">Модуль: {module.name}</h5>

      <Row className="mb-3">
        <Col xs={12} md={6}>
          <InputField
            label="ФИО, должность"
            value={teachersList.find(option => option.value === module?.teacher?.full_name) || null}
            onChange={(e) => handleSelectChange(e, 'full_name')}
            isSelect
            options={[...teachers, { value: '__add__', label: '+ Добавить преподавателя' }]}
            disabled={!isEditable}
            error={moduleErrors[index]?.full_name}
          />

          <InputField
            label="Место работы, должность"
            value={module?.teacher?.workplace}
            onChange={(e) => handleChange(e, 'workplace')}
            disabled={!isEditable}
            error={moduleErrors[index]?.workplace}
          />
          <InputField
            label="Учебное заведение, специальность"
            value={module?.teacher?.education}
            onChange={(e) => handleChange(e, 'education')}
            disabled={!isEditable}
            error={moduleErrors[index]?.education}
          />
          <InputField
            label="Ученая степень / звание / категория"
            value={module?.teacher?.degree}
            onChange={(e) => handleChange(e, 'degree')}
            disabled={!isEditable}
            error={moduleErrors[index]?.degree}
          />
        </Col>
        <Col xs={12} md={6}>
          <InputField
            label="Стаж работы (всего)"
            value={module?.teacher?.experience_total}
            onChange={(e) => handleChange(e, 'experience_total')}
            disabled={!isEditable}
            error={moduleErrors[index]?.experience_total}
          />
          <InputField
            label="Стаж по дисциплине"
            value={module?.teacher?.experience_subject}
            onChange={(e) => handleChange(e, 'experience_subject')}
            disabled={!isEditable}
            error={moduleErrors[index]?.experience_subject}
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
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Добавить преподавателя</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputField
            label="ФИО, должность"
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
            label="Образование"
            value={newTeacher.education}
            onChange={(e) => setNewTeacher(prev => ({ ...prev, education: e.target.value }))}
            error={modalErrors?.education}
          />
          <InputField
            label="Уч. степень / звание"
            value={newTeacher.degree}
            onChange={(e) => setNewTeacher(prev => ({ ...prev, degree: e.target.value }))}
            error={modalErrors?.degree}
          />
          <InputField
            label="Стаж общий"
            value={newTeacher.experience_total}
            onChange={(e) => setNewTeacher(prev => ({ ...prev, experience_total: e.target.value }))}
            error={modalErrors?.experience_total}
          />
          <InputField
            label="Стаж по дисциплине"
            value={newTeacher.experience_subject}
            onChange={(e) => setNewTeacher(prev => ({ ...prev, experience_subject: e.target.value }))}
            error={modalErrors?.experience_subject}
          />
          <InputField
            label="Условия привлечения"
            value={contractList.find(option => option.value === newTeacher.contract) || null}
            isSelect
            onChange={(val) => setNewTeacher(prev => ({ ...prev, contract: val.value }))}
            options={contractList}
            error={modalErrors?.contract}
          />
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

  const [showModal, setShowModal] = useState(false);
  const containerRef = useRef(null);
  const [modules, setModules] = useState([])
  const [moduleErrors, setModuleErrors] = useState({});
  const commonData = documentsData.commonData
  const [teachersList, setTeachersList] = useState([
    { value: 'Иванов И.И., доцент', label: 'Иванов И.И., доцент', workplace: 'Работа', education: 'Среднее', degree: 'Крутой', experience_total: '2', experience_subject: '1' },
    { value: 'Петрова Н.Н., старший преподаватель', label: 'Петрова Н.Н., старший преподаватель' }
  ])

  useEffect(() => {
    if (commonData && Object.keys(commonData?.modules).length > 0)
      setModules(commonData?.modules || [])
  }, [commonData])

  const validateModules = () => {
    const errors = {};
    modules.forEach((module, idx) => {
      const moduleError = {};
      if (!module?.teacher?.full_name) {
        moduleError.full_name = 'Поле не заполнено';
      }
      if (!module?.teacher?.workplace) {
        moduleError.workplace = 'Поле не заполнено';
      }
      if (!module?.teacher?.education) {
        moduleError.education = 'Поле не заполнено';
      }
      if (!module?.teacher?.degree) {
        moduleError.degree = 'Поле не заполнено';
      }
      if (!module?.teacher?.experience_total) {
        moduleError.experience_total = 'Поле не заполнено';
      }
      if (!module?.teacher?.experience_subject) {
        moduleError.experience_subject = 'Поле не заполнено';
      }
      if (!module?.teacher?.contract) {
        moduleError.contract = 'Поле не заполнено';
      }
      if (Object.keys(moduleError).length > 0) {
        errors[idx] = moduleError;
      }
    });

    setModuleErrors(errors);
    return Object.keys(errors).length === 0;
  };

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

  const handleViewDoc = async () => {
    try {
      const response = await exportInformationAboutStaffing({ commonData });
      if (response.status !== 200) throw new Error("Ошибка при создании файла");

      const blob = response.data;
      setShowModal(true);

      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
          renderAsync(blob, containerRef.current);
        }
      }, 1000);
    } catch (error) {
      console.error("Ошибка просмотра документа:", error);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await exportInformationAboutStaffing({ commonData });
      if (response.status !== 200) throw new Error("Ошибка при создании файла");

      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Сведения_о_кадровом_обеспечении.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Ошибка скачивания файла:", error);
    }
  };

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
