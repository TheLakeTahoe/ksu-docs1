import { Row, Col, Card, CloseButton, Alert } from 'react-bootstrap';
import InputField from '../../CustomComponents/InputFields/InputField';
import './ModuleForm.css';
import SubmoduleForm from './SubmoduleForm';

const ModuleForm = ({ index, moduleData, onChange, onRemove, isEditable, isForEducationalPlan, isForEducationalAndThematicPlan }) => {
    const controlFormOptions = [
        { label: 'Зачет', value: 'Зачет' },
        { label: 'Экзамен', value: 'Экзамен' },
        { label: 'Отсутствует', value: 'Отсутствует' }
    ]
    const validateNumberInput = (value) => {
        // Удаляем все не-цифровые символы и возвращаем результат
        return value.replace(/[^\d]/g, '')
    }
    let content

    if (isForEducationalAndThematicPlan)
        content = (
            <>
                <Row>
                    <Alert variant='info'>
                        <Alert.Heading>Суммы часов по модулю {index}:</Alert.Heading>
                        <li>Часы модуля: {moduleData.h_overall || 0}</li>
                        <li>Сумма часов подмодулей: {
                            moduleData.submodules?.reduce((sum, sub) => sum + (parseFloat(sub.h_overall) || 0), 0) || 0
                        }</li>
                    </Alert>
                </Row>
                <Row className="mt-3">
                    <Col xs={12} md={3}>
                        <InputField
                            label="Наименование модуля"
                            value={moduleData.name}
                            onChange={(e) => onChange({ ...moduleData, name: e.target.value })}
                            disabled={!isEditable}
                        />
                    </Col>
                    <Col xs={12} md={2}>
                        <InputField
                            label="Количество часов"
                            value={moduleData.h_overall}
                            onChange={(e) => onChange({ ...moduleData, h_overall: e.target.value })}
                            disabled={!isEditable}
                        />
                    </Col>
                    <Col xs={12} md={4}>
                        <div className="d-flex flex-column" style={{ marginTop: '-18px' }}>
                            <div style={{ textAlign: 'center' }}>В том числе:</div>
                            <div className="d-flex gap-3">
                                <InputField
                                    label="ЛК"
                                    value={moduleData.h_lk}
                                    onChange={(e) => onChange({ ...moduleData, h_lk: e.target.value })}
                                    placeholder="ЛК"
                                    disabled={!isEditable}
                                    className="flex-grow-1"
                                />
                                <InputField
                                    label="ЛБ"
                                    value={moduleData.h_lb}
                                    onChange={(e) => onChange({ ...moduleData, h_lb: e.target.value })}
                                    placeholder="ЛБ"
                                    disabled={!isEditable}
                                    className="flex-grow-1"
                                />
                                <InputField
                                    label="ПР"
                                    value={moduleData.h_pr}
                                    onChange={(e) => onChange({ ...moduleData, h_pr: e.target.value })}
                                    placeholder="ПР"
                                    disabled={!isEditable}
                                    className="flex-grow-1"
                                />
                                <InputField
                                    label="СР"
                                    value={moduleData.h_sr}
                                    onChange={(e) => onChange({ ...moduleData, h_sr: e.target.value })}
                                    placeholder="СР"
                                    disabled={!isEditable}
                                    className="flex-grow-1"
                                />
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} md={3}>
                        <InputField
                            label="Форма аттестации"
                            value={controlFormOptions.find(option => option.label === moduleData?.control_form) || null}
                            onChange={(e) => onChange({ ...moduleData, control_form: e.value })}
                            disabled={!isEditable}
                            className="flex-grow-1"
                            isSelect
                            options={controlFormOptions}
                        />
                    </Col>
                </Row>
                <Row>
                    <>
                        {moduleData?.submodules?.length > 0 && (<h6 className="mt-4">Подмодули</h6>)}
                        {moduleData.submodules?.map((sub, subIndex) => (
                            <SubmoduleForm
                                key={subIndex}
                                index={subIndex}
                                submodule={sub}
                                isEditable={isEditable}
                                onChange={(updatedSub) => {
                                    const cleanedData = {
                                        ...updatedSub,
                                        h_lk: updatedSub.h_lk ? validateNumberInput(updatedSub.h_lk) : '',
                                        h_lb: updatedSub.h_lb ? validateNumberInput(updatedSub.h_lb) : '',
                                        h_pr: updatedSub.h_pr ? validateNumberInput(updatedSub.h_pr) : '',
                                        h_sr: updatedSub.h_sr ? validateNumberInput(updatedSub.h_sr) : ''
                                    }
                                    const updatedSubmodules = [...moduleData.submodules];
                                    updatedSubmodules[subIndex] = cleanedData;
                                    if (
                                        updatedSubmodules[subIndex].h_lk ||
                                        updatedSubmodules[subIndex].h_lb ||
                                        updatedSubmodules[subIndex].h_pr ||
                                        updatedSubmodules[subIndex].h_sr
                                    ) {
                                        updatedSubmodules[subIndex].h_overall =
                                            parseFloat(updatedSubmodules[subIndex].h_lk || 0) +
                                            parseFloat(updatedSubmodules[subIndex].h_lb || 0) +
                                            parseFloat(updatedSubmodules[subIndex].h_pr || 0) +
                                            parseFloat(updatedSubmodules[subIndex].h_sr || 0);
                                    }
                                    onChange({ ...moduleData, submodules: updatedSubmodules });
                                }}
                                onRemove={() => {
                                    const updatedSubmodules = moduleData.submodules.filter((_, i) => i !== subIndex);
                                    onChange({ ...moduleData, submodules: updatedSubmodules });
                                }}
                                controlFormOptions={controlFormOptions}
                            />
                        ))}
                        {isEditable && (
                            <Card
                                className="d-flex align-items-center justify-content-center"
                                style={{
                                    width: '100%',
                                    minHeight: '30px',
                                    border: '2px dashed #ccc',
                                    cursor: 'pointer',
                                }}
                                onClick={() => {
                                    const newSubmodules = moduleData.submodules ? [...moduleData.submodules] : [];
                                    newSubmodules.push({
                                        name: '',
                                        h_overall: '',
                                        h_lk: '',
                                        h_lb: '',
                                        h_pr: '',
                                        h_sr: '',
                                        control_form: '',
                                        parentName: moduleData.name || `Модуль ${index}`
                                    });
                                    onChange({ ...moduleData, submodules: newSubmodules });
                                }}
                            >
                                <Card.Body className="d-flex align-items-center justify-content-center">
                                    <h5>+ Добавить подмодуль</h5>
                                </Card.Body>
                            </Card>
                        )}
                    </>
                </Row>
            </>)
    else if (isForEducationalPlan)
        content = (
            <>
                <Row className="mt-3">
                    <Col xs={12} md={3}>
                        <InputField
                            label="Наименование модуля"
                            value={moduleData.name}
                            onChange={(e) => onChange({ ...moduleData, name: e.target.value })}
                            disabled={!isEditable}
                        />
                    </Col>
                    <Col xs={12} md={2}>
                        <InputField
                            label="Количество часов"
                            value={moduleData.h_overall}
                            onChange={(e) => onChange({ ...moduleData, h_overall: e.target.value })}
                            disabled={!isEditable}
                        />
                    </Col>
                    <Col xs={12} md={4}>
                        <div className="d-flex flex-column" style={{ marginTop: '-18px' }}>
                            <div style={{ textAlign: 'center' }}>В том числе:</div>
                            <div className="d-flex gap-3">
                                <InputField
                                    label="ЛК"
                                    value={moduleData.h_lk}
                                    onChange={(e) => onChange({ ...moduleData, h_lk: e.target.value })}
                                    disabled={!isEditable}
                                    className="flex-grow-1"
                                />
                                <InputField
                                    label="ЛБ"
                                    value={moduleData.h_lb}
                                    onChange={(e) => onChange({ ...moduleData, h_lb: e.target.value })}
                                    disabled={!isEditable}
                                    className="flex-grow-1"
                                />
                                <InputField
                                    label="ПР"
                                    value={moduleData.h_pr}
                                    onChange={(e) => onChange({ ...moduleData, h_pr: e.target.value })}
                                    disabled={!isEditable}
                                    className="flex-grow-1"
                                />
                                <InputField
                                    label="СР"
                                    value={moduleData.h_sr}
                                    onChange={(e) => onChange({ ...moduleData, h_sr: e.target.value })}
                                    disabled={!isEditable}
                                    className="flex-grow-1"
                                />
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} md={3}>
                        <InputField
                            label="Форма аттестации"
                            value={controlFormOptions.find(option => option.label === moduleData?.control_form) || null}
                            onChange={(e) => onChange({ ...moduleData, control_form: e.value })}
                            disabled={!isEditable}
                            className="flex-grow-1"
                            isSelect
                            options={controlFormOptions}
                        />
                    </Col>
                </Row>
            </>)
    else
        content = (
            <Row>
                <Col xs={12} md={8}>
                    <InputField
                        label="Наименование модуля"
                        value={moduleData.name}
                        onChange={(e) => onChange({ ...moduleData, name: e.target.value })}
                        disabled={!isEditable}
                    />
                </Col>
                <Col xs={12} md={4}>
                    <InputField
                        label="Количество часов"
                        value={moduleData.h_overall}
                        onChange={(e) => onChange({ ...moduleData, h_overall: e.target.value })}
                        disabled={!isEditable}
                    />
                </Col>
            </Row>)

    return (
        <Card className="module-card mb-3">
            <Card.Header className="d-flex justify-content-between align-items-center module-card-header">
                <h6>Модуль {index}</h6>
                {isEditable && <CloseButton onClick={onRemove} className="remove-button" />}
            </Card.Header>
            <Card.Body>
                {content}
            </Card.Body >
        </Card >)
}

export default ModuleForm;
