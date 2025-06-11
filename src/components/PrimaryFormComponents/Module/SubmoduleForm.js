// SubmoduleForm.js
import { Row, Col, Card, CloseButton } from 'react-bootstrap';
import InputField from '../../CustomComponents/InputFields/InputField';

const SubmoduleForm = ({ index, submodule, onChange, onRemove, isEditable, controlFormOptions }) => {
    return (
        <Card className="submodule-card mb-2">
            <Card.Header className="d-flex justify-content-between align-items-center module-card-header">
                <small>Подмодуль {index + 1} (Родительский модуль: {submodule.parentName})</small>
                {isEditable && <CloseButton onClick={onRemove} />}
            </Card.Header>
            <Card.Body>
                <Row className="mt-3">
                    <Col xs={12} md={3}>
                        <InputField
                            label="Наименование подмодуля"
                            value={submodule.name}
                            onChange={(e) => onChange({ ...submodule, name: e.target.value })}
                            disabled={!isEditable}
                        />
                    </Col>
                    <Col xs={12} md={2}>
                        <InputField
                            label="Количество часов"
                            value={submodule.h_overall}
                            onChange={(e) => onChange({ ...submodule, h_overall: e.target.value })}
                            disabled={!isEditable}
                        />
                    </Col>
                    <Col xs={12} md={4}>
                        <div className="d-flex flex-column" style={{ marginTop: '-18px' }}>
                            <div style={{ textAlign: 'center' }}>В том числе:</div>
                            <div className="d-flex gap-3">
                                <InputField
                                    label="ЛК"
                                    value={submodule.h_lk}
                                    onChange={(e) => onChange({ ...submodule, h_lk: e.target.value })}
                                    disabled={!isEditable}
                                />
                                <InputField
                                    label="ЛБ"
                                    value={submodule.h_lb}
                                    onChange={(e) => onChange({ ...submodule, h_lb: e.target.value })}
                                    disabled={!isEditable}
                                />
                                <InputField
                                    label="ПР"
                                    value={submodule.h_pr}
                                    onChange={(e) => onChange({ ...submodule, h_pr: e.target.value })}
                                    disabled={!isEditable}
                                />
                                <InputField
                                    label="СР"
                                    value={submodule.h_sr}
                                    onChange={(e) => onChange({ ...submodule, h_sr: e.target.value })}
                                    disabled={!isEditable}
                                />
                            </div>
                        </div>
                    </Col>
                    <Col>
                        <Col xs={12}>
                            <InputField
                                label="Форма аттестации"
                                value={controlFormOptions.find(option => option.label === submodule?.control_form)}
                                onChange={(e) => onChange({ ...submodule, control_form: e.value })}
                                disabled={!isEditable}
                                isSelect
                                options={controlFormOptions}
                            />
                        </Col>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default SubmoduleForm;
