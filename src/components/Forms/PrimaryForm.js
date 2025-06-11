import React, { useEffect, useState } from 'react'
import { Form, Button, Col, Row, Alert, AlertHeading, Container, Card, Modal } from 'react-bootstrap'
import TeachersGroup from '../PrimaryFormComponents/Teacher/TeachersGroup'
import AspectGroup from '../PrimaryFormComponents/Aspect/AspectGroup'
import ModuleGroup from '../PrimaryFormComponents/Module/ModuleGroup'
import CoordinatorForm from '../PrimaryFormComponents/Coordinator/CoordinatorForm'
import InputField from '../CustomComponents/InputFields/InputField'
import { getDataForPrimaryForm } from '../../http/dataAPI'
import { sendRequest } from '../../http/requestAPI'
import { useNavigate } from 'react-router-dom'

const PrimaryForm = ({ userID }) => {
    const [formValues, setFormValues] = useState({
        program_name: '',
        program_type_id: '',
        program_description_short: '',
        program_description: '',
        target_audience: '',
        program_hours: '',
        lesson_shedule: '',
        study_period: '',
        education_cost: '',
        ksu_department_id: '',
        type_graduation_doc_id: '',
        program_coordinator_id: '',
        account_id: '',
    })

    useEffect(() => {
        setFormValues(prevValues => ({
            ...prevValues,
            account_id: userID ? userID : 1
        }))
    }, [userID])

    const navigate = useNavigate()

    const goToMain = () => {
        navigate('/main')
    }

    const [showModal, setShowModal] = useState(false)
    const [showAddTeacherModal, setShowAddTeacherModal] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState(null)

    const [aspects, setAspects] = useState([])
    const [modules, setModules] = useState([])
    const [coordinator, setCoordinator] = useState([])

    const [teachers, setTeachers] = useState([])
    const [teacherOptions, setTeachersOptions] = useState([])
    const [newTeacher, setNewTeacher] = useState({
        full_name: '',
        workplace: '',
        education: '',
        exp_total: ''
    })

    const [validationErrors, setValidationErrors] = useState({})
    const [moduleValidationErrors, setModuleValidationErrors] = useState({})
    const [aspectValidationErrors, setAspectValidationErrors] = useState({})
    const [teacherValidationErrors, setTeacherValidationErrors] = useState({})
    const [teacherModalErrors, setTeacherModalErrors] = useState({})

    const [ksuDepartmentOptions, setKSUDepartmentOptions] = useState([])
    const [programTypeOptions, setProgramTypeOptions] = useState([])
    const [lessonSheduleOptions, setLessonSheduleOptions] = useState([])
    const [typeGraduationDocOptions, setTypeGraduationDocOptions] = useState([])

    useEffect(() => {
        const fetchPrimaryFormData = async () => {
            try {
                const response = await getDataForPrimaryForm()
                const ksuDepartmentData = response[0].data.map(item => ({
                    value: item.name,
                    label: item.name,
                    id: item.id
                }))
                setKSUDepartmentOptions(ksuDepartmentData)

                const programTypeData = response[1].data.map(item => ({
                    value: item.name,
                    label: item.name,
                    id: item.id
                }))
                setProgramTypeOptions(programTypeData)

                const lessonSheduleData = response[2].data.map(item => ({
                    value: item.name,
                    label: item.name,
                    id: item.id
                }))
                setLessonSheduleOptions(lessonSheduleData)

                const typeGraduationDocData = response[3].data.map(item => ({
                    value: item.name,
                    label: item.name,
                    id: item.id
                }))
                setTypeGraduationDocOptions(typeGraduationDocData)
            } catch (error) {
                console.error('Ошибка при получении данных о структурных подразделениях:', error)
            }
        }

        fetchPrimaryFormData()
    }, []) // Пустой массив зависимостей

    const programToGraduationDocMap = {
        "Программа повышения квалификации": 3,
        "Программа профессиональной переподготовки": 1,
        "Дополнительная общеобразовательная программа для взрослых": 2
    }

    useEffect(() => {
        if (formValues.program_type_id) {
            const matchedGraduationDoc = typeGraduationDocOptions.find(
                option => option.id === programToGraduationDocMap[formValues.program_type_id]
            )

            setFormValues(prevValues => ({
                ...prevValues,
                type_graduation_doc_id: matchedGraduationDoc ? matchedGraduationDoc.value : ''
            }))
        }
    }, [formValues.program_type_id])

    const handleTeacherChange = (index, teacherData) => {
        const updatedTeachers = [...teachers]
        updatedTeachers[index] = teacherData
        setTeachers(updatedTeachers)
    }

    const handleAddTeacher = () => {
        if (teachers.length < 6) {
            setTeachers([
                ...teachers,
                { position: '', f_name: '', m_name: '', l_name: '', workExperience: '', workplace: '' },
            ])
        }
    }

    const handleRemoveTeacher = (index) => {
        setTeachers(teachers.filter((_, i) => i !== index))
    }

    const handleAddAspect = (type) => {
        if (aspects.filter((a) => a.type === type).length < 3) {
            setAspects([...aspects, { name: '', type }])
        }
    }

    // Изменение аспекта
    const handleAspectChange = (index, updatedAspect) => {
        const updatedAspects = aspects.map((aspect, i) => (i === index ? updatedAspect : aspect))
        setAspects(updatedAspects)
    }

    // Удаление аспекта
    const handleRemoveAspect = (index) => {
        setAspects(aspects.filter((_, i) => i !== index))
    }

    const handleModuleChange = (index, updatedModule) => {
        const newModules = [...modules]
        newModules[index] = updatedModule
        setModules(newModules)
    }

    const handleAddModule = () => {
        setModules([...modules, { name: '', h_overall: '' }])
    }

    const handleRemoveModule = (index) => {
        setModules(modules.filter((_, i) => i !== index))
    }

    const handleCoordinatorChange = (coordinatorData) => {
        setCoordinator(coordinatorData)
    }

    const handleChange = (e) => {
        if (e && e.value) {
            console.log(e)
            setFormValues({ ...formValues, [e.name]: e.value })
        } else {
            setFormValues({ ...formValues, [e.target.name]: e.target.value })
        }
    }

    const validateForm = () => {
        const errors = {}
        const moduleErrors = {}
        const aspectErrors = {}
        const teacherErrors = {}

        if (!formValues.program_name.trim()) errors.program_name = 'Введите название программы'
        if (!formValues.program_type_id) errors.program_type_id = 'Выберите вид программы'
        if (!formValues.program_description_short.trim()) errors.program_description_short = 'Введите краткое описание'
        if (!formValues.program_description.trim()) errors.program_description = 'Введите полное описание'
        if (!formValues.target_audience.trim()) errors.target_audience = 'Укажите целевую аудиторию'
        if (!formValues.program_hours.trim()) errors.program_hours = 'Укажите количество часов'
        if (!formValues.lesson_shedule) errors.lesson_shedule = 'Выберите форму обучения'
        if (!formValues.study_period.trim()) errors.study_period = 'Укажите срок обучения'
        if (!formValues.education_cost.trim()) errors.education_cost = 'Укажите стоимость обучения'
        if (!formValues.ksu_department_id) errors.ksu_department_id = 'Выберите структурное подразделение'
        if (!formValues.type_graduation_doc_id) errors.type_graduation_doc_id = 'Выберите документ по окончании'
        modules.forEach((module, index) => {
            const currentModuleErrors = [];

            if (!module.name?.trim()) {
                currentModuleErrors.push("Не указано название модуля");
            }

            // Приводим к единой структуре
            if (currentModuleErrors.length > 0) {
                moduleErrors[index] = {
                    module: currentModuleErrors,
                    submodules: {} // даже если нет подмодулей — для универсального отображения
                };
            }
        });

        if (modules.length < 1)
            moduleErrors.count = ['Добавьте хотя бы один модуль']

        const requiredTypes = ['know', 'can', 'own']
        const typeCounters = { know: 0, can: 0, own: 0 };
        const typeTranslations = { know: 'Знать', can: 'Уметь', own: 'Владеть' };
        const foundTypes = new Set()

        const missingNames = []
        aspects.forEach((aspect) => {
            typeCounters[aspect.type] += 1;
            foundTypes.add(aspect.type);

            if (!aspect.name?.trim()) {
                const num = typeCounters[aspect.type];
                const typeText = typeTranslations[aspect.type] || aspect.type;
                missingNames.push(`Аспект №${num} типа "${typeText}": Не указано наименование`);
            }
            if (missingNames.length > 0)
                aspectErrors.missingNames = missingNames
        });

        const types = []
        requiredTypes.forEach((type) => {
            if (!foundTypes.has(type)) {
                const typeText = typeTranslations[type] || type;
                types.push(`Не указан хотя бы один аспект типа "${typeText}"`);
            }
            if (types.length > 0)
                aspectErrors.type = types
        });

        teachers.forEach((teacher, index) => {
            const currentTeacherErrors = [];

            if (!teacher.full_name?.trim()) currentTeacherErrors.push("Не выбран Преподаватель");
            else {
                if (!teacher.exp_total?.trim()) currentTeacherErrors.push("Не указан опыт работы");
                if (!teacher.workplace?.trim()) currentTeacherErrors.push("Не указано место работы");
                if (!teacher.position?.trim()) currentTeacherErrors.push("Не указана должность");
            }

            if (currentTeacherErrors.length > 0) {
                teacherErrors[index] = {
                    teacher: currentTeacherErrors,
                };
            }

        });

        if (teachers.length < 1)
            teacherErrors.count = ['Добавьте хотя бы одного преподавателя']

        setTeacherValidationErrors(teacherErrors)
        setAspectValidationErrors(aspectErrors)
        setModuleValidationErrors(moduleErrors)
        setValidationErrors(errors)
        return Object.keys(errors).length === 0 && Object.keys(moduleErrors).length === 0 && Object.keys(aspectErrors).length === 0 && Object.keys(teacherErrors).length === 0
    }

    const validateNewTeacher = () => {
        const errors = {}
        if (!newTeacher.full_name.trim()) errors.full_name = 'Введите ФИО преподавателя'
        if (!newTeacher.position.trim()) errors.position = 'Укажите должность'
        if (!newTeacher.workplace.trim()) errors.workplace = 'Укажите место работы'
        if (!newTeacher.exp_total.trim()) errors.exp_total = 'Укажите опыт работы'
        setTeacherModalErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleTeacherSelectChange = (index, selected) => {
        if (selected.value === '__add__') {
            return
        }

        const updatedTeachers = [...teachers]
        console.log(updatedTeachers[index])
        updatedTeachers[index] = {
            full_name: selected.value,
            position: selected.position || '',
            workplace: selected.workplace || '',
            exp_total: selected.exp_total || ''
        }
        setTeachers(updatedTeachers)
    }

    const handleTeacherSelectSpecial = () => {
        setShowAddTeacherModal(true)
    }

    const handleAddNewTeacher = () => {
        if (!validateNewTeacher()) return

        const newOption = {
            value: newTeacher.full_name,
            label: newTeacher.full_name,
            position: newTeacher.position,
            workplace: newTeacher.workplace,
            exp_total: newTeacher.exp_total
        }

        setTeachersOptions(prev => [...prev, newOption])
        setNewTeacher({ full_name: '', position: '', workplace: '', exp_total: '' })
        setShowAddTeacherModal(false)
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            if (!validateForm()) {
                setIsSubmitting(false)
                return
            }
            const dataToSend = { ...formValues, teachers, coordinator, aspects, modules }
            console.log(dataToSend)
            const response = await sendRequest(dataToSend)
            setMessage(response.data.message)
            setShowModal(true)
        } catch (error) {
            console.error('Ошибка отправки формы:', error)
        }
    }

    const fieldLabels = {
        program_name: 'Наименование программы',
        program_type_id: 'Вид программы',
        program_description_short: 'Краткое описание',
        program_description: 'Описание программы',
        target_audience: 'Целевая аудитория',
        program_hours: 'Общее количество часов',
        lesson_shedule: 'Форма обучения',
        study_period: 'Срок обучения',
        education_cost: 'Стоимость обучения',
        ksu_department_id: 'Структурное подразделение КГУ',
        type_graduation_doc_id: 'Документ по окончании',
    }

    return (
        <Container>
            <Form onSubmit={handleSubmit} className='m-0 mb-4 p-2'>
                <h2>Карточка новой дополнительной образовательной программы</h2>
                <Alert variant='info' className='mb-4'>
                    <AlertHeading><b>Уважаемые коллеги!</b></AlertHeading>
                    Вы решили реализовать <b>новую дополнительную образовательную программу</b> (программу повышения квалификации, программу профессиональной переподготовки или дополнительную общеобразовательную программу для взрослых).<br />
                    <b>Опишите, пожалуйста, программу, заполнив все обязательные поля карточки.</b><hr />
                    Помните, что описание программы должно быть понятным и интересным. Мы с вами готовим продукт для продажи, клиент должен после первых двух предложений захотеть у нас учиться и нажать кнопку записаться.
                    Научные фразы - это здорово, но оставьте их для УММ. Здесь мы должны ориентироваться на клиента, мы должны описать программу простым, понятным языком.
                    Заказчик должен понять, что за программа, чему его научат, кем он сможет работать, где пригодятся ему эти знания.  Поэтому просим вас заполнять не ради того, чтобы заполнить, а ради того, чтобы реально реализовать программу.
                    Спасибо!
                </Alert>

                {/* Блок для основных данных программы */}
                <Card className="mb-4">
                    <Card.Header><h5>Информация о программе</h5></Card.Header>
                    <Card.Body>

                        {/* Блок: Основные данные */}
                        <div className="mb-4">
                            <h6>Основные данные</h6>
                            <hr />
                            <Row>
                                {['program_name', 'program_type_id'].map((field, idx) => (
                                    <Col sm={6} key={idx}>
                                        <InputField
                                            label={fieldLabels[field]}
                                            name={field}
                                            type='text'
                                            value={field === 'program_type_id' ? programTypeOptions.find(option => option.value === formValues.program_type_id) : formValues[field]}
                                            onChange={field === 'program_type_id' ? (selected) => handleChange({ name: field, ...selected }) : handleChange}
                                            options={programTypeOptions}
                                            isSelect={field === 'program_type_id'}
                                            error={validationErrors[field]}
                                        />
                                    </Col>
                                ))}
                            </Row>

                            <Row>
                                <Col sm={12}>
                                    <InputField
                                        label="Короткое описание"
                                        name="program_description_short"
                                        type="text"
                                        value={formValues.program_description_short}
                                        onChange={handleChange}
                                        error={validationErrors?.program_description_short}
                                    />
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={12}>
                                    <InputField
                                        label="Описание программы"
                                        name="program_description"
                                        type="textarea"
                                        value={formValues.program_description}
                                        onChange={handleChange}
                                        isTextarea
                                        error={validationErrors?.program_description}
                                    />
                                </Col>
                            </Row>
                        </div>

                        {/* Блок: Организационные детали */}
                        <div className="mb-4">
                            <h6>Организационные детали</h6>
                            <hr />
                            <Row>
                                {['target_audience', 'program_hours', 'lesson_shedule', 'study_period'].map((field, idx) => (
                                    <Col sm={6} key={idx}>
                                        <Form.Group controlId={`form${field.name}`}>
                                            <InputField
                                                label={fieldLabels[field]}
                                                name={field}
                                                type='text'
                                                value={field === 'lesson_shedule' ? lessonSheduleOptions.find(option => option.value === formValues.lesson_shedule) : formValues[field]}
                                                onChange={field === 'lesson_shedule' ? (selected) => handleChange({ name: field, ...selected }) : handleChange}
                                                options={lessonSheduleOptions}
                                                isSelect={field === 'lesson_shedule'}
                                                error={validationErrors[field]}
                                            />
                                        </Form.Group>
                                    </Col>
                                ))}
                            </Row>
                        </div>

                        {/* Блок: Стоимость и структура */}
                        <div>
                            <h6>Стоимость и структура</h6>
                            <hr />
                            <Row>
                                {['education_cost', 'ksu_department_id', 'type_graduation_doc_id'].map((field, idx) => (
                                    <Col sm={6} key={idx}>
                                        <Form.Group controlId={`form${field.name}`}>
                                            <InputField
                                                label={fieldLabels[field]}
                                                name={field}
                                                type='text'
                                                value={field !== 'education_cost' ?
                                                    field === 'ksu_department_id' ?
                                                        ksuDepartmentOptions.find(option => option.value === formValues.ksu_department_id) :
                                                        typeGraduationDocOptions.find(option => option.value === formValues.type_graduation_doc_id) :
                                                    formValues[field]}
                                                onChange={field !== 'education_cost' ? (selected) => handleChange({ name: field, ...selected }) : handleChange}
                                                options={field === 'ksu_department_id' ? ksuDepartmentOptions : typeGraduationDocOptions}
                                                isSelect={field !== 'education_cost'}
                                                disabled={field === 'type_graduation_doc_id'}
                                                error={validationErrors[field]}
                                            />
                                        </Form.Group>
                                    </Col>
                                ))}
                            </Row>
                        </div>

                    </Card.Body>
                </Card>

                {/* Блок для аспектов */}
                <Card className="mb-4">
                    <Card.Header><h5>Аспекты программы</h5></Card.Header>
                    <Card.Body>
                        <AspectGroup
                            aspects={aspects}
                            onAspectChange={handleAspectChange}
                            onAddAspect={handleAddAspect}
                            onRemoveAspect={handleRemoveAspect}
                            isEditable={true}
                            aspectErrors={aspectValidationErrors}
                        />
                    </Card.Body>
                </Card>

                {/* Блок для модулей */}
                <Card className="mb-4">
                    <Card.Header><h5>Модули программы</h5></Card.Header>
                    <Card.Body>
                        <ModuleGroup
                            modules={modules}
                            onModuleChange={handleModuleChange}
                            onAddModule={handleAddModule}
                            onRemoveModule={handleRemoveModule}
                            isEditable={true}
                            moduleErrors={moduleValidationErrors}
                        />
                    </Card.Body>
                </Card>

                {/* Блок для преподавателей */}
                <Card className="mb-4">
                    <Card.Header><h5>Преподаватели</h5></Card.Header>
                    <Card.Body>
                        <TeachersGroup
                            teachers={teachers}
                            onTeacherChange={handleTeacherChange}
                            teacherOptions={teacherOptions}
                            handleTeacherSelectChange={handleTeacherSelectChange}
                            onAddTeacher={handleAddTeacher}
                            onRemoveTeacher={handleRemoveTeacher}
                            teacherErrors={teacherValidationErrors}
                            onSelectSpecialValue={handleTeacherSelectSpecial}
                        />
                    </Card.Body>
                </Card>

                {/* Блок для координатора */}
                <Card className="mb-4">
                    <Card.Header><h5>Координатор программы</h5></Card.Header>
                    <Card.Body>
                        <Alert variant='info'>
                            <Alert.Heading>Внимание!</Alert.Heading>
                            Данный блок не является обязательным для заполнения, в случае если он пуст <strong>координатором программы будет пользователь, подавший заявку</strong>
                        </Alert>
                        <CoordinatorForm
                            coordinator={coordinator}
                            onCoordinatorChange={handleCoordinatorChange}
                        />
                    </Card.Body>
                </Card>

                <Button disabled={isSubmitting} type="submit">
                    Отправить
                </Button>
            </Form>

            <Modal show={showAddTeacherModal} onHide={() => setShowAddTeacherModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Добавить преподавателя</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputField
                        label="ФИО"
                        value={newTeacher?.full_name}
                        onChange={(e) => setNewTeacher(prev => ({ ...prev, full_name: e.target.value }))}
                        error={teacherModalErrors?.full_name}
                    />
                    <InputField
                        label="Должность"
                        value={newTeacher?.position}
                        onChange={(e) => setNewTeacher(prev => ({ ...prev, position: e.target.value }))}
                        error={teacherModalErrors?.position}
                    />
                    <InputField
                        label="Место работы"
                        value={newTeacher?.workplace}
                        onChange={(e) => setNewTeacher(prev => ({ ...prev, workplace: e.target.value }))}
                        error={teacherModalErrors?.workplace}
                    />
                    <InputField
                        label="Опыт работы"
                        value={newTeacher?.exp_total}
                        onChange={(e) => setNewTeacher(prev => ({ ...prev, exp_total: e.target.value }))}
                        error={teacherModalErrors?.exp_total}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddTeacherModal(false)}>Отмена</Button>
                    <Button variant="primary" onClick={handleAddNewTeacher}>Сохранить</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Форма отправлена</Modal.Title>
                </Modal.Header>
                <Modal.Body>{message}</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={goToMain}>Закрыть</Button>
                </Modal.Footer>
            </Modal>
        </Container >
    )
}

export default PrimaryForm
