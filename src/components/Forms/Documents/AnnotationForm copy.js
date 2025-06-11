import React, { useState, useRef, useEffect, useContext } from "react";
import { Form, Button, Container, Card, Modal, Spinner, Alert, Col } from "react-bootstrap";
import InputField from "../../CustomComponents/InputFields/InputField";
import "bootstrap/dist/css/bootstrap.min.css";
import { exportAnnotation, sendAnnotation } from '../../../http/documentAPI';
import { renderAsync } from 'docx-preview';
import AspectGroup from "../../PrimaryFormComponents/Aspect/AspectGroup";
import ModuleGroup from "../../PrimaryFormComponents/Module/ModuleGroup";
import EducationTechGroup from "../../AnnotationFormComponents/EducationTechGroup";
import { DocumentsContext } from "../../../pages/TestContext";

const AnnotationForm = ({ userData, requestID, formAspectsData, formModulesData, annotationData, primaryFormData, onChange, onSave, isEditable }) => {
    const { commonData, setCommonData } = useContext(DocumentsContext)
    const [formValues, setFormValues] = useState({
        programType: '',
        programName: '',
        standardCompliance: "",
        programGoal: commonData.programGoal,
        direction: "",
        benefits: "",
        hours: '',
        studentCategory: '',
        academicHours: "",
        controlForm: "",
        graduationDoc: '',
        department: '',
        auditory: '',
        equipment: '',
        lessonDuration: "",
        lessonCount: ''
    });

    const [showModal, setShowModal] = useState(false);
    const containerRef = useRef(null);
    const [aspects, setAspects] = useState([]);
    const [modules, setModules] = useState([]);
    const [technologies, setTechnologies] = useState([{ name: '' }]);
    const [benefitsAlert, setBenefitsAlert] = useState(false)

    useEffect(() => {
        if (annotationData && Object.keys(annotationData).length > 0) {
            onSave()
            const { technologies, ...formData } = annotationData // Деструктуризация annotationData, чтобы отделить technologies
            setFormValues(formData);
            setTechnologies(technologies ? technologies : [{ name: '' }]);
        }
        else if (primaryFormData && Object.keys(primaryFormData).length > 0)
            setFormValues({
                programType: primaryFormData?.p_type_name,
                programName: primaryFormData?.program_name,
                hours: primaryFormData?.program_hours,
                academicHours: String(primaryFormData?.program_hours / 0.75),
                studentCategory: primaryFormData?.target_audience,
                graduationDoc: primaryFormData?.grad_doc_name
            })
    }, [annotationData, primaryFormData])

    useEffect(() => {
        setFormValues(prevValues => ({
            ...prevValues,
            programGoal: commonData.programGoal
        }))
        onChange()
    }, [commonData])

    useEffect(() => {
        if (formAspectsData && Object.keys(formAspectsData).length > 0)
            setAspects(formAspectsData)
    }, [formAspectsData])

    useEffect(() => {
        if (formModulesData && Object.keys(formModulesData).length > 0)
            setModules(formModulesData)
    }, [formModulesData])

    const sendDocument = async (dataToSend) => {
        await sendAnnotation(dataToSend, requestID)
    }

    const handleTechnologyChange = (index, updatedTechnology) => {
        const newTechnologies = [...technologies]
        newTechnologies[index] = updatedTechnology
        setTechnologies(newTechnologies)
        onChange()
    }

    const handleAddTechnology = () => {
        setTechnologies([...technologies, { name: '' }])
        onChange()
    }

    const handleRemoveTechnology = (index) => {
        setTechnologies(technologies.filter((_, i) => i !== index))
        onChange()
    }

    const handleDownload = async () => {
        try {
            const dataToSend = { ...formValues, aspects, modules, technologies };
            const response = await exportAnnotation(dataToSend);
            if (response.status !== 200) throw new Error("Ошибка при создании файла");

            const blob = response.data;
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Аннотация_ДОП.docx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Ошибка скачивания файла:", error);
        }
    };

    const handleViewDoc = async () => {
        try {
            const dataToSend = { ...formValues, aspects, modules, technologies };
            const response = await exportAnnotation(dataToSend);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
        onChange();
        if (name === 'programGoal') setCommonData(prevData => ({ ...prevData, [name]: value }))
        if (name === 'benefits') {
            const firstWord = value.trim().split(' ')[0]
            const isInfinitive = /(ть|ти|чь)$/.test(firstWord)
            firstWord && !isInfinitive ? setBenefitsAlert(true) : setBenefitsAlert(false)
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSend = { ...formValues, aspects, modules, technologies }
        console.log("Form Data Submitted:", { dataToSend, requestID });
        sendDocument(dataToSend)
        onSave()
    };

    return (
        <Container className="mt-4">
            <Form onSubmit={handleSubmit}>
                <Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {isEditable && (
                        <Button className='mb-3' type="submit" style={{ backgroundColor: 'rgb(27, 154, 233)', border: '1px solid rgba(0, 0, 0, .1)', fontWeight: '500' }}>Сохранить</Button>
                    )}
                    <Button className='mb-3 ms-2' style={{ backgroundColor: 'rgb(80, 180, 130)', border: '1px solid rgba(0, 0, 0, .1)', fontWeight: '500' }} onClick={handleViewDoc}>Предпросмотр документа</Button>
                </Col>
                <Card className="mb-4">
                    <Card.Header><h5>Основная информация о программе</h5></Card.Header>
                    <Card.Body>
                        <InputField label="Тип программы" name="programType" value={formValues.programType} onChange={handleChange} disabled={true} />
                        <InputField label="Наименование программы" name="programName" value={formValues.programName} onChange={handleChange} disabled={true} />
                        <InputField label="Соответствие профессиональному стандарту" name="standardCompliance" value={formValues.standardCompliance} onChange={handleChange} disabled={!isEditable} />
                        <InputField label="Цель программы" name="programGoal" value={formValues.programGoal} onChange={handleChange} disabled={!isEditable} />
                        <InputField label="Направление" name="direction" value={formValues.direction} onChange={handleChange} disabled={!isEditable} />
                    </Card.Body>
                </Card>

                <Card className="mb-4">
                    <Card.Header><h5>Обучающиеся и объем программы</h5></Card.Header>
                    <Card.Body>
                        <InputField label="Категория обучающихся" name="studentCategory" value={formValues.studentCategory} onChange={handleChange} disabled={true} />
                        <InputField label="Что даст освоение программы обучающимся" name="benefits" value={formValues.benefits} onChange={handleChange} disabled={!isEditable} />
                        {benefitsAlert && (<Alert variant="danger" style={{ animation: 'Decompression 0.25s forwards', paddingTop: '13px', paddingBottom: '13px', overflow: "hidden" }}> Первое слово должно быть инфинитивом глагола (например, "научить", "развить") </Alert>)}
                        <InputField label="Общее количество академических часов" name="academicHours" value={formValues.academicHours} onChange={handleChange} disabled={true} />
                        <InputField label="Временные ресурсы (не академические часы)" name="hours" value={formValues.hours} onChange={handleChange} disabled={true} />
                    </Card.Body>
                </Card>

                <Card className="mb-4">
                    <Card.Header><h5>Содержание и структура программы</h5></Card.Header>
                    <Card.Body>
                        <h5 className="mt-2">В результате освоения образовательной программы обучающийся должен</h5>
                        <AspectGroup aspects={aspects} isEditable={false} />
                        <h5 className="mt-2">Структура образовательной программы</h5>
                        <ModuleGroup modules={modules} isEditable={false} />
                        <h5 className="mt-2">Образовательные технологии и методы обучения</h5>
                        <EducationTechGroup
                            technologies={technologies}
                            onTechnologyChange={handleTechnologyChange}
                            onAddTechnology={handleAddTechnology}
                            onRemoveTechnology={handleRemoveTechnology}
                            isEditable={isEditable}
                        />
                    </Card.Body>
                </Card>

                <Card className="mb-4">
                    <Card.Header><h5>Организация учебного процесса</h5></Card.Header>
                    <Card.Body>
                        <InputField label="Количество занятий в неделю" name="lessonCount" value={formValues.lessonCount} onChange={handleChange} disabled={!isEditable} />
                        <InputField label="Длительность занятий" name="lessonDuration" value={formValues.lessonDuration} onChange={handleChange} disabled={!isEditable} />
                        <InputField label="Форма контроля" name="controlForm" value={formValues.controlForm} onChange={handleChange} disabled={!isEditable} />
                        <InputField label="Документ по завершении" name="graduationDoc" value={formValues.graduationDoc} onChange={handleChange} disabled={true} />
                    </Card.Body>
                </Card>

                <Card className="mb-4">
                    <Card.Header><h5>Материально-техническое обеспечение</h5></Card.Header>
                    <Card.Body>
                        <InputField label="Корпус КГУ" name="department" value={formValues.department} onChange={handleChange} disabled={!isEditable} />
                        <InputField label="Аудитория" name="auditory" value={formValues.auditory} onChange={handleChange} disabled={!isEditable} />
                        <InputField label="Оборудование" name="equipment" value={formValues.equipment} onChange={handleChange} disabled={!isEditable} />
                    </Card.Body>
                </Card>
            </Form>

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
    );
};

export default AnnotationForm;
