import React, { useState } from 'react';
import { Form, Button, Container, Col, Row, Alert, AlertHeading } from 'react-bootstrap';
import TeachersGroup from './Teacher/TeachersGroup';
import AspectGroup from './Aspect/AspectGroup';
import ModuleGroup from './Module/ModuleGroup';
import CoordinatorForm from './Coordinator/CoordinatorForm';

const PrimaryForm = () => {
    const [formData, setFormData] = useState({
        programName: '',
        programTypeID: '',
        programDescriptionShort: '',
        programDescription: '',
        targetAudience: '',
        programHours: '',
        lessonSchedule: '',
        studyPeriod: '',
        educationCost: '',
        ksuDepartmentID: '',
        typeGraduationDocID: '',
        programCoordinatorID: '',
        teacherID: '',
        accountID: '', // Это будет ID текущего пользователя
    });

    const [teachers, setTeachers] = useState([
        { position: '', f_name: '', m_name: '', l_name: '', workExperience: '', workplace: '' },
    ]);

    const [aspects, setAspects] = useState([
        { name: '' },
    ]);

    const [modules, setModules] = useState([
        { name: '', hours: '' },
    ]);

    const [coordinator, setCoordinator] = useState([
        { f_name: '', m_name: '', l_name: '', email: '', phone: '', address: ''}
    ])

    const currentUser = { id: 1 }; // Пример ID текущего пользователя

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleTeacherChange = (index, teacherData) => {
        const updatedTeachers = [...teachers];
        updatedTeachers[index] = teacherData;
        setTeachers(updatedTeachers);
    };

    const handleAddTeacher = () => {
        if (teachers.length < 6) {
            setTeachers([
                ...teachers,
                { position: '', f_name: '', m_name: '', l_name: '', workExperience: '', workplace: '' },
            ]);
        }
    };

    const handleRemoveTeacher = (index) => {
        setTeachers(teachers.filter((_, i) => i !== index));
    };

    const handleAspectChange = (index, aspectData) => {
        const updatedAspects = [...aspects];
        updatedAspects[index] = aspectData;
        setAspects(updatedAspects);
    };

    const handleAddAspect = (newAspect) => {
        setAspects((prevAspects) => [...prevAspects, newAspect]);
    };

    const handleRemoveAspect = (index) => {
        setAspects(aspects.filter((_, i) => i !== index));
    };
    const handleModuleChange = (index, updatedModule) => {
        const newModules = [...modules];
        newModules[index] = updatedModule;
        setModules(newModules);
    };

    const handleAddModule = () => {
        setModules([...modules, { name: '', hours: '' }]);
    };

    const handleRemoveModule = (index) => {
        setModules(modules.filter((_, i) => i !== index));
    };

    const handleCoordinatorChange = (coordinatorData) => {
        setCoordinator(coordinatorData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = {
            ...formData,
            teachers,
            coordinator,
            accountID: currentUser.id, // Привязываем текущий аккаунт
        };

        console.log('Отправленные данные:', dataToSend);
        // Здесь вы можете отправить данные на сервер
    };

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <h2>Карточка новой дополнительной образовательной программы</h2>
                <Alert variant='info' className='mb-4'>
                    <AlertHeading><b>Уважаемые коллеги!</b></AlertHeading>
                    Вы решили реализовать <b>новую дополнительную образовательную программу</b> (программу повышения квалификации, программу профессиональной переподготовки или дополнительную общеобразовательную программу для взрослых).<br />
                    <b>Опишите, пожалуйста, программу, заполнив все обязательные поля карточки.</b><hr />
                    Помните, что описание программы должно быть понятным и интересным. Мы с вами готовим продукт для продажи, клиент должен после первых двух предложений захотеть у нас учиться и нажать кнопку записаться. Научные фразы - это здорово, но оставьте их для УММ. Здесь мы должны ориентироваться на клиента, мы должны описать программу простым, понятным языком. Заказчик должен понять, что за программа, чему его научат, кем он сможет работать, где пригодятся ему эти знания.  Поэтому просим вас заполнять не ради того, чтобы заполнить, а ради того, чтобы реально реализовать программу. Спасибо!
                </Alert>
                {/* Поля для данных программы */}
                <Form.Group className='mb-2' as={Row} controlId="formProgramName">
                    <Form.Label column sm={3}>Наименование программы:</Form.Label>
                    <Col sm={9}>
                        <Form.Control
                            type="text"
                            name="programName"
                            placeholder='Название программы должно быть понятное, интересное и продающее'
                            value={formData.programName}
                            onChange={handleFormChange}
                        />
                    </Col>
                </Form.Group>

                <Form.Group className="mb-2" as={Row} controlId="formProgramType">
                    <Form.Label column sm={3}>Вид программы:</Form.Label>
                    <Col sm={9}>
                        <Form.Select
                            name="programTypeID"
                            value={formData.programTypeID}
                            onChange={handleFormChange}
                        >
                            <option value="">Выберите вид программы</option>
                            <option value="1">Программа повышения квалификации</option>
                            <option value="2">Программа профессиональной переподготовки</option>
                            <option value="3">Дополнительная общеобразовательная программа для взрослых</option>
                        </Form.Select>
                    </Col>
                </Form.Group>

                <Form.Group className='mb-2' as={Row} controlId="formProgramDescriptionShort">
                    <Form.Label column sm={3}>Короткое описание программы:</Form.Label>
                    <Col sm={9}>
                        <Form.Control
                            type="text"
                            name="programDescriptionShort"
                            placeholder='Не более двух предложений'
                            value={formData.programDescriptionShort}
                            onChange={handleFormChange}
                        />
                    </Col>
                </Form.Group>

                <Form.Group className='mb-2' as={Row} controlId="formProgramDescription">
                    <Form.Label column sm={3}>Описание программы:</Form.Label>
                    <Col sm={9}>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="programDescription"
                            placeholder='Введите описание программы, например: Слушатели научатся эффективно планировать проекты, освоят методы оценки рисков, смогут стать лидерами проектных команд, получат навыки анализа данных...'
                            value={formData.programDescription}
                            onChange={handleFormChange}
                        />
                    </Col>
                </Form.Group>

                <Form.Group className='mb-2' as={Row} controlId="formTargetAudience">
                    <Form.Label column sm={3}>Целевая аудитория:</Form.Label>
                    <Col sm={9}>
                        <Form.Control
                            type="text"
                            name="targetAudience"
                            placeholder='Кто ваш слушатель? Профессия, опыт, образование, знания'
                            value={formData.targetAudience}
                            onChange={handleFormChange}
                        />
                    </Col>
                </Form.Group>

                <Form.Group className='mb-2' as={Row} controlId="formProgramHours">
                    <Form.Label column sm={3}>Общее количество часов:</Form.Label>
                    <Col sm={9}>
                        <Form.Control
                            type="number"
                            name="programHours"
                            value={formData.programHours}
                            onChange={handleFormChange}
                        />
                    </Col>
                </Form.Group>

                <Form.Group className="mb-2" as={Row} controlId="formLessonSchedule">
                    <Form.Label column sm={3}>Режим занятий:</Form.Label>
                    <Col sm={9}>
                        <Form.Select
                            name="programTypeID"
                            value={formData.programTypeID}
                            onChange={handleFormChange}
                        >
                            <option value="">Выберите режим занятий</option>
                            <option value="1">Программа повышения квалификации</option>
                            <option value="2">Программа профессиональной переподготовки</option>
                            <option value="3">Дополнительная общеобразовательная программа для взрослых</option>
                        </Form.Select>
                    </Col>
                </Form.Group>


                <Form.Group className='mb-2' as={Row} controlId="formStudyPeriod">
                    <Form.Label column sm={3}>Срок обучения:</Form.Label>
                    <Col sm={9}>
                        <Form.Control
                            type="text"
                            name="studyPeriod"
                            placeholder='Например, 8 месяцев или примерный период обучения'
                            value={formData.studyPeriod}
                            onChange={handleFormChange}
                        />
                    </Col>
                </Form.Group>

                <Form.Group className='mb-2' as={Row} controlId="formGraduationDoc">
                    <Form.Label column sm={3}>Документ по окончании:</Form.Label>
                    <Col sm={9}>
                        <Form.Select
                            name="programTypeID"
                            value={formData.programTypeID}
                            disabled={true}
                        >
                            <option value="1">Программа повышения квалификации</option>
                            <option value="2">Программа профессиональной переподготовки</option>
                            <option value="3">Дополнительная общеобразовательная программа для взрослых</option>
                        </Form.Select>
                    </Col>
                </Form.Group>

                <Form.Group className='mb-2' as={Row} controlId="formEducationCost">
                    <Form.Label column sm={3}>Стоимость обучения:</Form.Label>
                    <Col sm={9}>
                        <Form.Control
                            type="number"
                            name="educationCost"
                            value={formData.educationCost}
                            onChange={handleFormChange}
                        />
                    </Col>
                </Form.Group>

                <Form.Group className='mb-2' as={Row} controlId="formDepartment">
                    <Form.Label column sm={3}>Структурное подразделение КГУ, инициирующее программу:</Form.Label>
                    <Col sm={9}>
                        <Form.Control
                            type="text"
                            name="ksuDepartmentID"
                            value={formData.ksuDepartmentID}
                            onChange={handleFormChange}
                        />
                    </Col>
                </Form.Group>

                <AspectGroup
                    aspects={aspects}
                    onAspectChange={handleAspectChange}
                    onAddAspect={handleAddAspect}
                    onRemoveAspect={handleRemoveAspect}
                />

                {/* ВМЕСТО ЭТОГО ТЕКСТА ГРУППА МОДУЛЕЙ */}
                <ModuleGroup
                    modules={modules}
                    onModuleChange={handleModuleChange}
                    onAddModule={handleAddModule}
                    onRemoveModule={handleRemoveModule}
                />

                <TeachersGroup
                    teachers={teachers}
                    onTeacherChange={handleTeacherChange}
                    onAddTeacher={handleAddTeacher}
                    onRemoveTeacher={handleRemoveTeacher}
                />

                <h3>Координатор</h3>

                <CoordinatorForm
                    coordinator={coordinator}
                    onCoordinatorChange={handleCoordinatorChange}
                />

                <Button variant="primary" type="submit">
                    Отправить
                </Button>
            </Form>
        </Container>
    );
};

export default PrimaryForm;
