import React from 'react';
import { Row, Col, Card, Container, Alert } from 'react-bootstrap';
import ModuleForm from './ModuleForm';

const ModuleGroup = ({ modules, onModuleChange, onAddModule, onRemoveModule, isEditable, isForEducationalPlan, isForEducationalAndThematicPlan, moduleErrors }) => {
    const modulesList = Array.isArray(modules) ? modules : []
    return (
        <Container>
            {moduleErrors && typeof moduleErrors === 'object' && Object.entries(moduleErrors).map(([key, errors]) => {
                // Функция для получения конфигурации Alert в зависимости от типа ошибки
                const getModuleAlertConfig = (errorKey) => {
                    switch (errorKey) {
                        case 'count':
                            return {
                                title: 'Общие ошибки модулей:',
                                content: (
                                    <ul className="mb-0">
                                        <li>{errors[0]}</li>
                                    </ul>
                                ),
                                variant: 'danger'
                            };
                        case 'duplicates':
                            return {
                                title: 'Обнаружены дубликаты модулей:',
                                content: (
                                    <ul className="mb-0">
                                        {errors.map((err, i) => (
                                            <li key={`dup-${i}`}>{err}</li>
                                        ))}
                                    </ul>
                                ),
                                variant: 'warning'
                            };
                        default: // Для ошибок конкретного модуля
                            return {
                                title: `Модуль ${Number(key) + 1}:`,
                                content: (
                                    <ul className="mb-0">
                                        {errors.module && errors.module.map((err, i) => (
                                            <li key={`mod-${i}`}>{err}</li>
                                        ))}
                                        {errors.submodules && Object.entries(errors.submodules).map(([subIndex, subErrors]) => (
                                            <li key={`sub-${subIndex}`}>
                                                <strong>Подмодуль {Number(subIndex) + 1}:</strong>
                                                <ul>
                                                    {subErrors.map((subErr, j) => (
                                                        <li key={`sub-${subIndex}-${j}`}>{subErr}</li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </ul>
                                ),
                                variant: 'danger'
                            };
                    }
                };

                const { title, content, variant } = getModuleAlertConfig(key);

                return (
                    <Alert key={key} variant={variant}>
                        <strong>{title}</strong>
                        {content}
                    </Alert>
                );
            })}
            <Row className="d-flex flex-column">
                {modulesList.map((module, index) => (
                    <ModuleForm
                        key={index}
                        index={index + 1}
                        moduleData={{ ...module, index }}
                        onChange={(updatedModule) => onModuleChange(index, updatedModule)}
                        onRemove={() => onRemoveModule(index)}
                        isEditable={isEditable}
                        isForEducationalPlan={isForEducationalPlan}
                        isForEducationalAndThematicPlan={isForEducationalAndThematicPlan}
                    />
                ))}
                {isEditable && (
                    <Col className="mb-4">

                        <Card
                            className="d-flex align-items-center justify-content-center"
                            style={{
                                width: '100%',
                                minHeight: '50px',
                                border: '2px dashed #ccc',
                                cursor: 'pointer',
                            }}
                            onClick={onAddModule}
                        >
                            <Card.Body className="d-flex align-items-center justify-content-center">
                                <h5>+ Добавить модуль</h5>
                            </Card.Body>
                        </Card>

                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default ModuleGroup;
