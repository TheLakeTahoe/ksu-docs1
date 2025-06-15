import { useState, useEffect, useRef } from "react"
import { Form, Button, Container, Card, Modal, Spinner, Col } from "react-bootstrap"
import InputField from "../../CustomComponents/InputFields/InputField"
import ModuleGroup from "../../PrimaryFormComponents/Module/ModuleGroup"
import "bootstrap/dist/css/bootstrap.min.css"
import { exportEducationAndThematicPlan, sendDocument } from '../../../http/documentAPI'
import { renderAsync } from 'docx-preview'
import AspectGroup from "../../PrimaryFormComponents/Aspect/AspectGroup"
import DocumentFormField from "../../CustomComponents/InputFields/DocumentFormField"
import ReviwerTools from "../../CustomComponents/Other/ReviewerTools"

const EducationalAndThematicPlanForm = ({ userData, requestID, documentsData, setDocumentsData, onChange, onSave, isEditable, isChecking }) => {
    const [modules, setModules] = useState([])
    const [aspects, setAspects] = useState([])
    const [validationErrors, setValidationErrors] = useState({})
    const [moduleValidationErrors, setModuleValidationErrors] = useState({})
    const [aspectValidationErrors, setAspectValidationErrors] = useState({})
    const [showModal, setShowModal] = useState(false)
    const containerRef = useRef(null)
    const commonData = documentsData.commonData
    const educationFormOptions = [
        { label: 'Очная', value: 'Очная' },
        { label: 'Очно-заочная', value: 'Очно-заочная' },
        { label: 'Заочная', value: 'Заочная' },
    ]

    useEffect(() => {
        if (commonData && Object.keys(commonData?.aspects).length > 0)
            setAspects(commonData?.aspects || [])
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

    const handleViewDoc = async () => {
        try {
            const response = await exportEducationAndThematicPlan({ commonData })
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
            const response = await exportEducationAndThematicPlan({ commonData })
            if (response.status !== 200) throw new Error("Ошибка при создании файла")

            const blob = response.data
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `Учебно-тематический_план.docx`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error("Ошибка скачивания файла:", error)
        }
    }

    const addAspect = (type) => {
        if (!(aspects.filter((a) => a.type === type).length < 3)) {
            return
        }

        const updatedAspects = [...aspects, { name: '', type }]

        setDocumentsData(prev => ({
            ...prev,
            commonData: {
                ...prev.commonData,
                aspects: updatedAspects
            }
        }))
    }

    const removeAspect = (index) => {
        const updatedAspects = aspects.filter((_, i) => i !== index)

        setDocumentsData(prev => ({
            ...prev,
            commonData: {
                ...prev.commonData,
                aspects: updatedAspects
            }
        }))
    }

    const handleAspectChange = (index, newData) => {
        const updatedAspects = aspects.map((aspect, i) => i === index ? newData : aspect)

        setDocumentsData(prev => ({
            ...prev,
            commonData: {
                ...prev.commonData,
                aspects: updatedAspects
            }
        }))
    }


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
            }
        }))
    }

    const removeModule = (index) => {
        const updatedModules = modules.filter((_, i) => i !== index)

        setDocumentsData(prev => ({
            ...prev,
            commonData: {
                ...prev.commonData,
                modules: updatedModules
            }
        }))
    }

    const handleModuleChange = (index, newData) => {
        const updatedModules = modules.map((module, i) => i === index ? newData : module)

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

    const handleSelectChange = (val, field) => {
        handleInputChange({ target: { value: val.value, name: field } })
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target

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
            updateNestedData(updated.commonData, path, value)

            // Выставляем статус "Редактируется"
            onChange(name)
            return updated
        })
    }

    const validateForm = () => {
        const errors = {}
        const moduleErrors = {}
        const aspectErrors = {}

        if (!commonData?.program?.program_goal?.trim()) {
            errors["program_goal"] = "Поле не заполнено"
        }

        if (!commonData?.program?.education_form) {
            errors["education_form"] = "Поле не заполнено"
        }

        if (!commonData?.program?.standart_compliance?.trim()) {
            errors["standart_compliance"] = "Поле не заполнено"
        }

        modules.forEach((module, index) => {
            const currentModuleErrors = []
            const currentSubModuleErrors = {}

            if (!module.name?.trim()) {
                currentModuleErrors.push("Не указано название модуля")
            }

            const hasHours = module.h_lk || module.h_lb || module.h_pr || module.h_sr

            if (!hasHours) {
                currentModuleErrors.push("Не указаны часы ни в одном из полей")
            }

            if (!module.control_form?.trim()) {
                currentModuleErrors.push("Не указана форма контроля")
            }

            if (Array.isArray(module.submodules)) {
                module.submodules.forEach((submodule, subIndex) => {
                    const subErrors = []

                    if (!submodule.name?.trim()) {
                        subErrors.push("Не указано название подмодуля")
                    }

                    const hasHours = submodule.h_lk || submodule.h_lb || submodule.h_pr || submodule.h_sr

                    if (!hasHours) {
                        subErrors.push("Не указаны часы ни в одном из полей")
                    }

                    if (!submodule.control_form?.trim()) {
                        subErrors.push("Не указана форма контроля")
                    }

                    if (subErrors.length > 0) {
                        currentSubModuleErrors[subIndex] = subErrors
                    }
                })
            }

            if (currentModuleErrors.length > 0 || Object.keys(currentSubModuleErrors).length > 0) {
                moduleErrors[index] = {}
                if (currentModuleErrors.length > 0) {
                    moduleErrors[index].module = currentModuleErrors
                }
                if (Object.keys(currentSubModuleErrors).length > 0) {
                    moduleErrors[index].submodules = currentSubModuleErrors
                }
            }
        })

        if (modules.length < 1)
            moduleErrors.count = ['Добавьте хотя бы один модуль']

        const requiredTypes = ['know', 'can', 'own']
        const typeCounters = { know: 0, can: 0, own: 0 }
        const typeTranslations = { know: 'Знать', can: 'Уметь', own: 'Владеть' }
        const foundTypes = new Set()

        const missingNames = []
        aspects.forEach((aspect) => {
            typeCounters[aspect.type] += 1
            foundTypes.add(aspect.type)

            if (!aspect.name?.trim()) {
                const num = typeCounters[aspect.type]
                const typeText = typeTranslations[aspect.type] || aspect.type
                missingNames.push(`Аспект №${num} типа "${typeText}": Не указано наименование`)
            }
            if (missingNames.length > 0)
                aspectErrors.missingNames = missingNames
        })

        const types = []
        requiredTypes.forEach((type) => {
            if (!foundTypes.has(type)) {
                const typeText = typeTranslations[type] || type
                types.push(`Не указан хотя бы один аспект типа "${typeText}"`)
            }
            if (types.length > 0)
                aspectErrors.type = types
        })

        setValidationErrors(errors)
        setModuleValidationErrors(moduleErrors)
        setAspectValidationErrors(aspectErrors)
        return Object.keys(errors).length === 0 && Object.keys(moduleErrors).length === 0 && Object.keys(aspectErrors).length === 0
    }


    const sendThisDocument = () => {
        const dataToSend = {
            ...documentsData,
            ETP: true
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
                        <InputField label="Форма обучения" name="commonData.program.education_form"
                            value={educationFormOptions.find(option => option.label === commonData?.program?.education_form) || null}
                            onChange={(e) => handleSelectChange(e, "commonData.program.education_form")}
                            isSelect
                            options={educationFormOptions}
                            disabled={!isEditable}
                            error={validationErrors?.education_form}
                        />
                        <DocumentFormField label="Соответствие квалификационным требованиям" name="commonData.program.standart_compliance"
                            value={commonData?.program?.standart_compliance}
                            commentValue={commonData?.errors?.program?.standart_compliance}
                            checkboxValue={commonData?.checkbox?.program?.standart_compliance}
                            onChange={handleInputChange}
                            disabled={!isEditable}
                            isChecking={isChecking}
                            error={validationErrors?.standart_compliance}
                        />
                    </Card.Body>
                </Card>

                <Card className="mb-4">
                    <Card.Header><h5>Результаты обучения</h5></Card.Header>
                    <Card.Body>
                        <AspectGroup
                            aspects={aspects}
                            onAspectChange={handleAspectChange}
                            onAddAspect={addAspect}
                            onRemoveAspect={removeAspect}
                            isEditable={isEditable}
                            aspectErrors={aspectValidationErrors}
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
                            isForEducationalAndThematicPlan={true}
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

export default EducationalAndThematicPlanForm