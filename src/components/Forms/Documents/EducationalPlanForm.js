import { useState, useEffect, useRef, useContext } from "react"
import { Form, Button, Container, Card, Modal, Spinner, Col } from "react-bootstrap"
import InputField from "../../CustomComponents/InputFields/InputField"
import ModuleGroup from "../../PrimaryFormComponents/Module/ModuleGroup"
import "bootstrap/dist/css/bootstrap.min.css"
import { exportEducationPlan, sendDocument } from '../../../http/documentAPI'
import { renderAsync } from 'docx-preview'
import DocumentFormField from '../../CustomComponents/InputFields/DocumentFormField'
import ReviwerTools from "../../CustomComponents/Other/ReviewerTools"

const EducationalPlanForm = ({ requestID, documentsData, setDocumentsData, onChange, onSave, isEditable, isChecking }) => {
    const [modules, setModules] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [validationErrors, setValidationErrors] = useState({})
    const [moduleValidationErrors, setModuleValidationErrors] = useState({})
    const containerRef = useRef(null)
    const commonData = documentsData.commonData
    const numberInputs = ['commonData.hours.academic', 'commonData.lesson.duration', 'commonData.lesson.count']
    const educationFormOptions = [
        { label: 'Очная', value: 'Очная' },
        { label: 'Очно-заочная', value: 'Очно-заочная' },
        { label: 'Заочная', value: 'Заочная' },
    ]

    //#region FillingAndValidating
    useEffect(() => {
        if (commonData && Object.keys(commonData?.modules).length > 0)
            setModules(commonData?.modules || [])
    }, [commonData])


    const flattenErrors = (errors) => {
        const result = {}

        Object.values(errors).forEach((section) => {
            if (section && typeof section === 'object' && !Array.isArray(section)) {
                Object.assign(result, section) // просто добавляем поля program_name, education_form и т.д.
            }
        })

        return result
    }


    useEffect(() => {
        if (commonData?.errors && !isChecking) {
            const commonErrors = flattenErrors(commonData?.errors || {})
            setValidationErrors({
                ...commonErrors,
            })
        }
    }, [commonData?.errors])

    const validateForm = () => {
        const errors = {}
        const moduleErrors = {}

        // Проверка основных полей
        if (!commonData?.program?.program_goal)
            errors["program_goal"] = "Поле не заполнено"

        if (!commonData?.program?.education_form)
            errors["education_form"] = "Поле не заполнено"

        if (!commonData?.hours?.academic)
            errors["academic"] = "Поле не заполнено"

        if (!commonData?.lesson?.count)
            errors["lesson_count"] = "Поле не заполнено"

        if (!commonData?.lesson?.duration)
            errors["lesson_duration"] = "Поле не заполнено"

        // Проверка модулей
        const moduleNames = new Map() // Для проверки дубликатов названий

        modules.forEach((module, index) => {
            const currentModuleErrors = []

            // Проверка названия модуля
            if (!module.name?.trim())
                currentModuleErrors.push("Не указано название модуля")
            else {
                // Проверка на дубликаты названий
                const normalizedName = module.name.trim().toLowerCase()
                if (moduleNames.has(normalizedName))
                    moduleNames.set(normalizedName, [...moduleNames.get(normalizedName), index])
                else
                    moduleNames.set(normalizedName, [index])

            }

            // Проверка часов
            const hasHours = module.h_lk || module.h_lb || module.h_pr || module.h_sr
            if (!hasHours)
                currentModuleErrors.push("Не указаны часы ни в одном из полей")


            // Проверка формы контроля
            if (!module.control_form?.trim())
                currentModuleErrors.push("Не указана форма контроля")


            // Добавляем ошибки модуля
            if (currentModuleErrors.length > 0) {
                moduleErrors[index] = {}
                if (currentModuleErrors.length > 0)
                    moduleErrors[index].module = currentModuleErrors
            }
        })

        // Добавляем ошибки дубликатов названий модулей
        moduleNames.forEach((indices, name) => {
            if (indices.length > 1) {
                if (!moduleErrors.duplicates) moduleErrors.duplicates = []
                moduleErrors.duplicates.push(
                    `Название модуля "${name}" повторяется в модулях: ${indices.map(i => i + 1).join(', ')}`
                )
            }
        })

        // Проверка количества модулей
        if (modules.length < 1)
            moduleErrors.count = ['Добавьте хотя бы один модуль']

        setValidationErrors(errors)
        setModuleValidationErrors(moduleErrors)
        return Object.keys(errors).length === 0 && Object.keys(moduleErrors).length === 0
    }

    //#endregion

    //#region MODULES
    const addModule = () => {
        const newModule = {
            name: '',
            h_overall: '',
            h_lk: '',
            h_lb: '',
            h_pr: '',
            h_sr: '',
            control_form: ''
        }

        const updatedModules = [...modules, newModule]

        setDocumentsData(prev => ({
            ...prev,
            commonData: {
                ...prev.commonData,
                modules: updatedModules
            },
            EEP: false,
            IAS: false
        }))
    }

    const removeModule = (index) => {
        const updatedModules = modules.filter((_, i) => i !== index)

        setDocumentsData(prev => ({
            ...prev,
            commonData: {
                ...prev.commonData,
                modules: updatedModules
            },
            EEP: false,
            IAS: false
        }))
    }

    const handleModuleChange = (index, newData) => {
        const cleanedData = {
            ...newData,
            h_lk: newData.h_lk ? validateNumberInput(newData.h_lk) : '',
            h_lb: newData.h_lb ? validateNumberInput(newData.h_lb) : '',
            h_pr: newData.h_pr ? validateNumberInput(newData.h_pr) : '',
            h_sr: newData.h_sr ? validateNumberInput(newData.h_sr) : ''
        }
        const updatedModules = modules.map((module, i) => i === index ? cleanedData : module)

        if (
            updatedModules[index].h_lk ||
            updatedModules[index].h_lb ||
            updatedModules[index].h_pr ||
            updatedModules[index].h_sr
        ) {
            updatedModules[index].h_overall =
                parseFloat(updatedModules[index].h_lk || 0) +
                parseFloat(updatedModules[index].h_lb || 0) +
                parseFloat(updatedModules[index].h_pr || 0) +
                parseFloat(updatedModules[index].h_sr || 0)
        }

        setDocumentsData(prev => ({
            ...prev,
            commonData: {
                ...prev.commonData,
                modules: updatedModules
            }
        }))
    }


    const validateNumberInput = (value) => {
        // Удаляем все не-цифровые символы и возвращаем результат
        return value.replace(/[^\d]/g, '')
    }
    // #endregion

    //#region DocxTemplater
    const handleViewDoc = async () => {
        try {
            const response = await exportEducationPlan({ commonData })
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
            const response = await exportEducationPlan({ commonData })
            if (response.status !== 200) throw new Error("Ошибка при создании файла")

            const blob = response.data
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `Учебный_план.docx`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error("Ошибка скачивания файла:", error)
        }
    }

    //#endregion

    //#region Input
    const handleSelectChange = (val, field) => {
        handleInputChange({ target: { value: val.value, name: field } })
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target

        let val

        if (numberInputs.includes(name))
            val = validateNumberInput(value)
        else 
            val = value

        setDocumentsData(prev => {
            const updated = { ...prev }

            const updateNestedData = (obj, path, val) => {
                const keys = path.split('.')
                const lastKey = keys.pop()
                const nested = keys.reduce((acc, key) => {
                    if (!acc[key]) acc[key] = {}
                    return acc[key]
                }, obj)
                nested[lastKey] = val ?? '' // если null — ставим ''
            }

            const path = name.replace(/^commonData\./, '')
            updateNestedData(updated.commonData, path, val)

            // Выставляем статус "Редактируется"
            onChange(name)
            return updated
        })
    }
    //#endregion

    //#region Submit
    const sendThisDocument = () => {
        const dataToSend = {
            ...documentsData,
            EDP: true
        }
        setDocumentsData(dataToSend)
        sendDocument(dataToSend, requestID)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!validateForm()) return
        sendThisDocument()
        onSave()
    }
    //#endregion

    return (
        <Container className='mt-4'>
            <Form onSubmit={handleSubmit}>
                {isChecking && (
                    <ReviwerTools />
                )}
                <Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {isEditable && (
                        <Button className='mb-3' type="submit" style={{ backgroundColor: 'rgb(27, 154, 233)', border: '1px solid rgba(0, 0, 0, .1)', fontWeight: '500' }}>Сохранить</Button>
                    )}
                    <Button className='mb-3 ms-2' style={{ backgroundColor: 'rgb(80, 180, 130)', border: '1px solid rgba(0, 0, 0, .1)', fontWeight: '500' }} onClick={handleViewDoc}>Предпросмотр документа</Button>
                </Col>
                <Card className="mb-4">
                    <Card.Header><h5>Основная информация о программе</h5></Card.Header>
                    <Card.Body>
                        <DocumentFormField label="Цель программы" name="commonData.program.program_goal"
                            value={commonData?.program?.program_goal}
                            commentValue={commonData?.errors?.program?.program_goal}
                            checkboxValue={commonData?.checkbox?.program?.program_goal}
                            onChange={handleInputChange}
                            disabled={!isEditable}
                            isChecking={isChecking}
                            error={validationErrors?.program_goal}
                        />
                        <DocumentFormField label="Категория обучающихся" name="commonData.program.listeners_category"
                            value={commonData?.program?.listeners_category}
                            commentValue={commonData?.errors?.program?.listeners_category}
                            checkboxValue={commonData?.checkbox?.program?.listeners_category}
                            onChange={handleInputChange}
                            disabled={!isEditable}
                            isChecking={isChecking}
                            error={validationErrors?.listeners_category}
                        />
                        <InputField label="Форма обучения" name="commonData.program.education_form"
                            value={educationFormOptions.find(option => option.label === commonData?.program?.education_form) || null}
                            onChange={(e) => handleSelectChange(e, "commonData.program.education_form")}
                            isSelect
                            options={educationFormOptions}
                            disabled={!isEditable}
                            error={validationErrors?.education_form}
                        />
                        <DocumentFormField label="Трудоемкость программы (в академических часах)" name="commonData.hours.academic"
                            value={commonData?.hours?.academic}
                            commentValue={commonData?.errors?.hours?.academic}
                            checkboxValue={commonData?.checkbox?.hours?.academic}
                            onChange={handleInputChange}
                            disabled={!isEditable}
                            isChecking={isChecking}
                            error={validationErrors?.academic}
                        />
                        <DocumentFormField label="Количество занятий в неделю" name="commonData.lesson.count"
                            value={commonData?.lesson?.count}
                            commentValue={commonData?.errors?.lesson?.count}
                            checkboxValue={commonData?.checkbox?.lesson?.count}
                            onChange={handleInputChange}
                            disabled={!isEditable}
                            isChecking={isChecking}
                            error={validationErrors?.count}
                        />
                        <DocumentFormField label="Длительность занятий (в часах)" name="commonData.lesson.duration"
                            value={commonData?.lesson?.duration}
                            commentValue={commonData?.errors?.lesson?.duration}
                            checkboxValue={commonData?.checkbox?.lesson?.duration}
                            onChange={handleInputChange}
                            disabled={!isEditable}
                            isChecking={isChecking}
                            error={validationErrors?.duration}
                        />
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
                            moduleErrors={moduleValidationErrors}
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
    )
}

export default EducationalPlanForm