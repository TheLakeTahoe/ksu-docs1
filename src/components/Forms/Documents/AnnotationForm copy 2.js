import { useState, useRef, useEffect } from "react";
import { Form, Button, Container, Card, Modal, Spinner, Alert, Col, InputGroup } from "react-bootstrap";
import InputField from "../../CustomComponents/InputFields/InputField";
import "bootstrap/dist/css/bootstrap.min.css";
import { exportAnnotation, sendAnnotation } from '../../../http/documentAPI';
import { renderAsync } from 'docx-preview';
import AspectGroup from "../../PrimaryFormComponents/Aspect/AspectGroup";
import ModuleGroup from "../../PrimaryFormComponents/Module/ModuleGroup";
import EducationTechGroup from "../../AnnotationFormComponents/EducationTechGroup";
import DocumentFormField from "../../CustomComponents/InputFields/DocumentFormField";

const AnnotationForm = ({ userData, requestID, annotationData, commonData, setDocumentsData, onChange, onSave, isEditable, isChecking }) => {

    const [showModal, setShowModal] = useState(false);
    const containerRef = useRef(null);
    const [aspects, setAspects] = useState([]);
    const [modules, setModules] = useState([]);
    const [technologies, setTechnologies] = useState([{ name: '' }]);
    const [benefitsAlert, setBenefitsAlert] = useState(false)
    const [validationErrors, setValidationErrors] = useState({});
    const [technologyValidationErrors, setTechnologyValidationErrors] = useState({})
    const controlFormOptions = [
        { label: 'Зачет', value: 'Зачет' },
        { label: 'Экзамен', value: 'Экзамен' },
        { label: 'Отсутствует', value: 'Отсутствует' }
    ]

    useEffect(() => {
        if (commonData && Object.keys(commonData?.aspects).length > 0)
            setAspects(commonData?.aspects || [])
        if (commonData && Object.keys(commonData?.modules).length > 0)
            setModules(commonData?.modules || [])
    }, [commonData])

    useEffect(() => {
        if (annotationData && Object.keys(annotationData?.technologies).length > 0)
            setTechnologies(annotationData?.technologies || [])
    }, [annotationData])

    const sendDocument = async (dataToSend) => {
        await sendAnnotation(dataToSend, requestID, userData?.id)
    }

    const handleTechnologyChange = (index, updatedTechnology) => {
        const newTechnologies = [...technologies]
        newTechnologies[index] = updatedTechnology
        setTechnologies(newTechnologies)
        setDocumentsData(prev => ({
            ...prev,
            annotation: {
                ...prev.annotation,
                technologies: newTechnologies
            }
        }));
        onChange()
    }

    const handleAddTechnology = () => {
        const newTechnologies = [...technologies, { name: '' }]
        setTechnologies(newTechnologies)
        setDocumentsData(prev => ({
            ...prev,
            annotation: {
                ...prev.annotation,
                technologies: newTechnologies
            }
        }));
        onChange()
    }

    const handleRemoveTechnology = (index) => {
        const newTechnologies = technologies.filter((_, i) => i !== index)
        setTechnologies(newTechnologies)
        setDocumentsData(prev => ({
            ...prev,
            annotation: {
                ...prev.annotation,
                technologies: newTechnologies
            }
        }));
        onChange()
    }

    const handleViewDoc = async () => {
        try {
            const response = await exportAnnotation({ annotationData, commonData });
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
            const response = await exportAnnotation({ annotationData, commonData });
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

    const handleSelectChange = (val, field) => {
        handleInputChange({ target: { value: val.value, name: field } })
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setDocumentsData(prev => {
            const updated = { ...prev };

            const updateNestedData = (obj, path, val) => {
                const keys = path.split('.');
                const lastKey = keys.pop();
                const nested = keys.reduce((acc, key) => {
                    if (!acc[key]) acc[key] = {};
                    return acc[key];
                }, obj);
                nested[lastKey] = val ?? ''; // если null — ставим ''
            };

            // Решаем, куда писать: в commonData или в annotation
            if (
                name.startsWith('commonData.error')
            ) {
                const path = name.replace(/^commonData\./, '');
                updateNestedData(updated.commonData, path, value);
            } else if (
                name.startsWith('annotation.program') ||
                name.startsWith('annotation.ksu')
            ) {
                const path = name.replace(/^annotation\./, '');
                updateNestedData(updated.annotation, path, value);
            } else if (
                name.startsWith('commonData.program') ||
                name.startsWith('commonData.lesson') ||
                name.startsWith('commonData.hours')
            ) {
                const path = name.replace(/^commonData\./, '');
                updateNestedData(updated.commonData, path, value);
            }

            // Проверяем формат заполнения Benefits
            if (annotationData.program.benefits) {
                const firstWord = annotationData.program.benefits.trim().split(' ')[0]
                const isInfinitive = /(ть|ти|чь|ться)$/.test(firstWord)
                firstWord && !isInfinitive ? setBenefitsAlert(true) : setBenefitsAlert(false)
            }
            else
                setBenefitsAlert(false)

            // Выставляем статус "Редактируется"
            console.log(commonData)
            onChange(name)
            return updated;
        });
    };

    const validateForm = () => {
        const errors = {};
        const technologyErrors = {}

        // commonData.program
        if (!commonData?.program?.standart_compliance) errors['standart_compliance'] = 'Поле не заполнено';
        if (!commonData?.program?.program_goal) errors['program_goal'] = 'Поле не заполнено';
        if (!commonData?.program?.listeners_category) errors['listeners_category'] = 'Поле не заполнено';

        // annotationData.program
        if (!annotationData?.program?.direction) errors['direction'] = 'Поле не заполнено';
        if (!annotationData?.program?.benefits) errors['benefits'] = 'Поле не заполнено';
        if (!annotationData?.program?.control_form) errors['control_form'] = 'Поле не заполнено';

        // commonData.hours
        if (!commonData?.hours?.academic) errors['academic'] = 'Поле не заполнено'
        else if (commonData.hours.academic === '0') errors['academic'] = 'Поле не заполнено'

        if (!commonData?.hours?.overall) errors['overall'] = 'Поле не заполнено'
        else if (commonData.hours.overall === '0') errors['overall'] = 'Поле не заполнено';

        // commonData.lesson
        if (!commonData?.lesson?.count) errors['lesson_count'] = 'Поле не заполнено';
        if (!commonData?.lesson?.duration) errors['lesson_duration'] = 'Поле не заполнено';

        // annotationData.ksu
        if (!annotationData?.ksu?.department) errors['department'] = 'Поле не заполнено';
        if (!annotationData?.ksu?.auditory) errors['auditory'] = 'Поле не заполнено';
        if (!annotationData?.ksu?.equipment) errors['equipment'] = 'Поле не заполнено';

        // technologies
        if (technologies.length < 1)
            errors['technology'] = 'Должна быть заполнена хотя бы одна технология'

        technologies.forEach((technology, index) => {
            const currentTechnologyErrors = [];

            if (!technology.name?.trim()) {
                currentTechnologyErrors.push("Не указано название технологии");
            }

            if (currentTechnologyErrors.length > 0) {
                technologyErrors[index] = currentTechnologyErrors;
            }
        });

        setValidationErrors(errors);
        setTechnologyValidationErrors(technologyErrors)
        console.log(errors)
        return Object.keys(errors).length === 0 && Object.keys(technologyErrors).length === 0;
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        sendDocument({ annotationData, commonData })
        onSave()
    };

    return (
        <Container className="mt-4">
            {/* Вывод ошибок */}
            {validationErrors.length > 0 && (
                <Alert variant="danger" onClose={() => setValidationErrors([])} dismissible>
                    <ul style={{ marginBottom: 0 }}>
                        {validationErrors.map((err, i) => (
                            <li key={i}>{err}</li>
                        ))}
                    </ul>
                </Alert>
            )}
            <Form onSubmit={handleSubmit}>
                {!isChecking &&
                    (
                        <Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {isEditable && (
                                <Button className='mb-3' type="submit" style={{ backgroundColor: 'rgb(27, 154, 233)', border: '1px solid rgba(0, 0, 0, .1)', fontWeight: '500' }}>Сохранить</Button>
                            )}
                            <Button className='mb-3 ms-2' style={{ backgroundColor: 'rgb(80, 180, 130)', border: '1px solid rgba(0, 0, 0, .1)', fontWeight: '500' }} onClick={handleViewDoc}>Предпросмотр документа</Button>
                        </Col>
                    )
                }
                <Card className="mb-4">
                    <Card.Header><h5>Основная информация о программе</h5></Card.Header>
                    <Card.Body>
                        <InputField label="Тип программы" name="commonData.program.program_type"
                            value={commonData?.program?.program_type || ''}
                            disabled={true}
                        />
                        <InputField label="Наименование программы" name="commonData.program.program_name"
                            value={commonData?.program?.program_name || ''}
                            disabled={true}
                        />
                        <DocumentFormField label="Соответствие профессиональному стандарту" name="commonData.program.standart_compliance"
                            value={commonData?.program?.standart_compliance}
                            commentValue={commonData?.errors?.program?.standart_compliance}
                            onChange={handleInputChange}
                            disabled={!isEditable}
                            isChecking={isChecking}
                            error={validationErrors?.standart_compliance}
                        />
                        <InputField label="Цель программы" name="commonData.program.program_goal"
                            value={commonData?.program?.program_goal || ''}
                            onChange={handleInputChange}
                            disabled={!isEditable}
                            error={validationErrors?.program_goal}
                        />
                        <InputField label="Направление" name="annotation.program.direction"
                            value={annotationData?.program?.direction || ''}
                            onChange={handleInputChange}
                            disabled={!isEditable}
                            error={validationErrors?.direction}
                        />
                    </Card.Body>
                </Card>

                <Card className="mb-4">
                    <Card.Header><h5>Обучающиеся и объем программы</h5></Card.Header>
                    <Card.Body>
                        <Alert variant="info">
                            <Alert.Heading>Внимание!</Alert.Heading>
                            <ul> На данный момент:
                                <li>Поле "Что даст освоение программы обучающимся" заполняется строкой вида "научиться преодолевать трудности"</li>
                            </ul>
                        </Alert>
                        <InputField label="Категория обучающихся" name="commonData.program.listeners_category"
                            value={commonData?.program?.listeners_category || ''}
                            disabled={true}
                        />
                        <InputField label="Что даст освоение программы обучающимся" name="annotation.program.benefits"
                            value={annotationData?.program?.benefits || ''}
                            onChange={handleInputChange}
                            disabled={!isEditable}
                            error={validationErrors?.benefits}
                        />
                        {benefitsAlert && (<Alert variant="danger" style={{ animation: 'Decompression 0.25s forwards', paddingTop: '13px', paddingBottom: '13px', overflow: "hidden" }}> Первое слово должно быть инфинитивом глагола (например, "научить", "развить") </Alert>)}
                        <InputField label="Общее количество академических часов" name="commonData.hours.academic"
                            value={commonData?.hours?.academic || ''}
                            onChange={handleInputChange}
                            disabled={!isEditable}
                            error={validationErrors?.academic}
                        />
                        <InputField label="Временные ресурсы (не академические часы)" name="commonData.hours.overall"
                            value={commonData?.hours?.overall || ''}
                            onChange={handleInputChange}
                            disabled={!isEditable}
                            error={validationErrors?.overall}
                        />
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
                            empty={validationErrors?.technology}
                            error={technologyValidationErrors}
                        />
                    </Card.Body>
                </Card>

                <Card className="mb-4">
                    <Card.Header><h5>Организация учебного процесса</h5></Card.Header>
                    <Card.Body>
                        <InputField label="Количество занятий в неделю" name="commonData.lesson.count"
                            value={commonData?.lesson?.count || ''}
                            onChange={handleInputChange}
                            disabled={!isEditable}
                            error={validationErrors?.lesson_count}
                        />
                        <InputField label="Длительность занятий (в часах)" name="commonData.lesson.duration"
                            value={commonData?.lesson?.duration || ''}
                            onChange={handleInputChange}
                            disabled={!isEditable}
                            error={validationErrors?.lesson_duration}
                        />
                        <InputField label="Форма контроля" name="annotation.program.control_form"
                            value={controlFormOptions.find(option => option.label === annotationData?.program?.control_form) || null}
                            onChange={(e) => handleSelectChange(e, "annotation.program.control_form")}
                            disabled={!isEditable}
                            isSelect
                            options={controlFormOptions}
                            error={validationErrors?.control_form}
                        />
                        <InputField label="Документ по завершении" name="annotation.program.graduation_doc"
                            value={annotationData?.program?.graduation_doc || ''}
                            disabled={true}
                        />
                    </Card.Body>
                </Card>

                <Card className="mb-4">
                    <Card.Header><h5>Материально-техническое обеспечение</h5></Card.Header>
                    <Card.Body>
                        <Alert variant="info">
                            <Alert.Heading>Внимание!</Alert.Heading>
                            <ul> На данный момент:
                                <li>Корпус КГУ заполняется строкой вида "А", "Е", "Б1"</li>
                                <li>Аудитория - "А-201", "Е-325", Б-"101"</li>
                                <li>Оборудование пишется в творительном падеже - "стульями и прочим другим"</li>
                            </ul>
                        </Alert>
                        <InputField label="Корпус КГУ" name="annotation.ksu.department"
                            value={annotationData?.ksu?.department || ''}
                            onChange={handleInputChange}
                            disabled={!isEditable}
                            error={validationErrors?.department}
                        />
                        <InputField label="Аудитория" name="annotation.ksu.auditory"
                            value={annotationData?.ksu?.auditory || ''}
                            onChange={handleInputChange}
                            disabled={!isEditable}
                            error={validationErrors?.auditory}
                        />
                        <InputField label="Оборудование" name="annotation.ksu.equipment"
                            value={annotationData?.ksu?.equipment || ''}
                            onChange={handleInputChange}
                            disabled={!isEditable}
                            error={validationErrors?.equipment}
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

export default AnnotationForm;
