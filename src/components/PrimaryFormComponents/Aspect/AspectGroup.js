import React from 'react';
import { Row, Col, Card, Container, Alert } from 'react-bootstrap';
import AspectField from './AspectField';

const AspectGroup = ({ aspects, onAspectChange, onAddAspect, onRemoveAspect, isEditable, aspectErrors }) => {

    const getAlertConfig = (key) => {
        switch (key) {
            case 'type':
                return {
                    title: 'Отсутствуют аспекты:',
                    variant: 'danger'
                };
            case 'missingNames':
                return {
                    title: 'Не заполнены наименования аспектов:',
                    variant: 'danger'
                };
            default:
                return {
                    title: 'Обнаружены дубликаты аспектов:',
                    variant: 'warning'
                };
        }
    };

    // Фильтрация аспектов по типу
    const filterAspectsByType = (type) => aspects.filter((aspect) => aspect.type === type);

    // Рендер колонки с аспектами
    const renderColumn = (typeAspects, typeLabel, type) => (
        <Col xs={12} md={4}>
            <h5>{typeLabel}</h5>
            {typeAspects.map((aspect, index) => (
                <AspectField
                    key={`${type}-${index}`}
                    index={index + 1}
                    aspectData={aspect}
                    onChange={(updatedAspect) => onAspectChange(aspects.indexOf(aspect), updatedAspect)}
                    onRemove={() => onRemoveAspect(aspects.indexOf(aspect))}
                    isEditable={isEditable}
                />
            ))}
            {(typeAspects.length < 3 && isEditable) && (
                <Card
                    className="d-flex align-items-center justify-content-center"
                    style={{
                        width: '100%',
                        minHeight: '125px',
                        border: '2px dashed #ccc',
                        cursor: 'pointer',
                        marginBottom: '10px',
                    }}
                    onClick={() => onAddAspect(type)}
                >
                    <Card.Body className="d-flex align-items-center justify-content-center">
                        <h5>+ Добавить аспект</h5>
                    </Card.Body>
                </Card>
            )}
        </Col>
    );

    return (
        <Container>
            {aspectErrors && Object.entries(aspectErrors).map(([key, errors]) => {

                const { title, variant } = getAlertConfig(key)

                return (
                    <Alert key={key} variant={variant}>
                        <>
                            <strong>{title}</strong>
                            <ul className="mb-0">
                                {errors.map((err, i) => (
                                    <li key={i}>{err}</li>
                                ))}
                            </ul>
                        </>
                    </Alert>
                )
            })}
            <Row>
                {renderColumn(filterAspectsByType('know'), 'Знать', 'know')}
                {renderColumn(filterAspectsByType('can'), 'Уметь', 'can')}
                {renderColumn(filterAspectsByType('own'), 'Владеть', 'own')}
            </Row>
        </Container>
    );
};

export default AspectGroup;
