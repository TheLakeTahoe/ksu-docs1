import React, { useState, useEffect, useRef, useContext } from "react";
import { Form, Button, Container, Card, Modal, Spinner, Col } from "react-bootstrap";
import InputField from "../../CustomComponents/InputFields/InputField";
import ModuleGroup from "../../PrimaryFormComponents/Module/ModuleGroup";
import "bootstrap/dist/css/bootstrap.min.css";
import { exportAnnotation, sendAnnotation } from '../../../http/documentAPI';
import { renderAsync } from 'docx-preview';
import { DocumentsContext } from "../../../pages/TestContext";

const EducationalPlanForm = ({ userData, requestID, formModulesData, primaryFormData, onChange, onSave, isEditable }) => {
    const { commonData, setCommonData } = useContext(DocumentsContext)
    const [formValues, setFormValues] = useState({
        programType: '',
        programName: '',
        studentCategory: '',
        lessonShedule: "",
        academicHours: '',
        programGoal: commonData.programGoal,
        direction: "",
        lessonDuration: "",
        lessonCount: ''
    });

    const [modules, setModules] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        if (primaryFormData && Object.keys(primaryFormData).length > 0) {
            console.log(primaryFormData)
            setFormValues({
                programType: primaryFormData?.p_type_name,
                programName: primaryFormData?.program_name,
                lessonShedule: primaryFormData?.shedule_name,
                studentCategory: primaryFormData?.target_audience,
            });
        }
    }, [primaryFormData]);

    useEffect(() => {
        if (formModulesData && Object.keys(formModulesData).length > 0) {
            setModules(formModulesData);
        }
    }, [formModulesData]);

    const handleModuleChange = (index, newData) => {
        const updatedModules = modules.map((module, i) => (i === index ? newData : module));
        updatedModules[index].hours = parseFloat(updatedModules[index].lecture || 0) + parseFloat(updatedModules[index].lab || 0) +
            parseFloat(updatedModules[index].practice || 0) + parseFloat(updatedModules[index].selfStudy || 0)
        setModules(updatedModules);
    };

    useEffect(() => {
        if (formValues.programGoal !== commonData.programGoal) {
            setFormValues(prevValues => ({
                ...prevValues,
                programGoal: commonData.programGoal
            }))
            onChange()
        }
    }, [commonData])

    const handleDownload = async () => {
        try {
            const dataToSend = { ...formValues, modules };
            const response = await exportAnnotation(dataToSend);
            if (response.status !== 200) throw new Error("Ошибка при создании файла");

            const blob = response.data;
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Учебный план.docx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Ошибка скачивания файла:", error);
        }
    };

    const handleViewDoc = async () => {
        try {
            const dataToSend = { ...formValues, modules };
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

    const addModule = () => {
        setModules([...modules, { name: '', hours: '', lecture: '', lab: '', practice: '', selfStudy: '', exam: '' }]);
    };

    const removeModule = (index) => {
        setModules(modules.filter((_, i) => i !== index));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
        if (name === 'programGoal') setCommonData(prevData => ({ ...prevData, [name]: value }))
        onChange();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave();
        //sendAnnotation({ ...formValues, modules }, requestID);
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
                        <InputField label="Тип программы" name="programType" value={formValues.programType} disabled={true} />
                        <InputField label="Наименование программы" name="programName" value={formValues.programName} disabled={true} />
                        <InputField label="Цель программы" name="programGoal" value={formValues.programGoal} onChange={handleChange} disabled={!isEditable} />
                        <InputField label="Категория обучающихся" name="studentCategory" value={formValues.studentCategory} onChange={handleChange} disabled={true} />
                        <InputField label="Форма обучения" name="lessonShedule" value={formValues.lessonShedule} onChange={handleChange} disabled={!isEditable} />
                        <InputField label="Трудоемкость программы (в академических часах)" name="academicHours" value={formValues.academicHours} onChange={handleChange} disabled={!isEditable} />
                        <InputField label="Количество занятий в неделю" name="lessonCount" value={formValues.lessonCount} onChange={handleChange} disabled={!isEditable} />
                        <InputField label="Длительность занятий" name="lessonDuration" value={formValues.lessonDuration} onChange={handleChange} disabled={!isEditable} />
                    </Card.Body>
                </Card>

                <Card className="mb-4">
                    <Card.Header><h5>План обучения</h5></Card.Header>
                    <Card.Body>
                        <ModuleGroup
                            modules={modules}
                            onModuleChange={handleModuleChange}
                            onAddModule={addModule}
                            onRemoveModule={removeModule}
                            isEditable={isEditable}
                            isForEducationalPlan={true}
                        />
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

export default EducationalPlanForm;