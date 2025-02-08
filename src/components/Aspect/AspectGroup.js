import React from 'react';
import { Row, Col, Card, Container } from 'react-bootstrap';
import AscpectField from './AspectField';

const AspectGroup = ({
    aspects,
    onAspectChange,
    onAddAspect,
    onRemoveAspect,
}) => {
    // Фильтруем аспекты по их типу
    const type1Aspects = aspects.filter((aspect) => aspect.type === 'type1');
    const type2Aspects = aspects.filter((aspect) => aspect.type === 'type2');
    const type3Aspects = aspects.filter((aspect) => aspect.type === 'type3');

    // Добавляем аспект для определенного типа
    const handleAddAspectForType = (type) => {
        onAddAspect({ name: '', type }); // Добавляем новый объект аспекта с указанным типом
    };

    const renderColumn = (typeAspects, typeLabel, type) => (
        <Col xs={12} md={4}>
            <h5>{typeLabel}</h5>
            {typeAspects.map((aspect, index) => (
                <AscpectField
                    key={`${type}-${index}`} // Уникальный ключ для каждого аспекта
                    index={index + 1} // Передаем индекс начиная с 1
                    aspectData={aspect}
                    onChange={(data) =>
                        onAspectChange(
                            aspects.findIndex((a) => a === aspect),
                            data
                        )
                    }
                    onRemove={() =>
                        onRemoveAspect(aspects.findIndex((a) => a === aspect))
                    }
                />
            ))}
            {typeAspects.length < 4 && ( // Ограничиваем добавление до 4 аспектов на тип
                <Card
                    className="d-flex align-items-center justify-content-center"
                    style={{
                        width: '100%',
                        minHeight: '125px',
                        border: '2px dashed #ccc',
                        cursor: 'pointer',
                        marginBottom: '10px',
                    }}
                    onClick={() => handleAddAspectForType(type)}
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
            <h3>В результате освоения программы обучающийся должен</h3>
            <Row>
                {renderColumn(type1Aspects, 'Знать', 'type1')}
                {renderColumn(type2Aspects, 'Уметь', 'type2')}
                {renderColumn(type3Aspects, 'Владеть', 'type3')}
            </Row>
        </Container>
    );
};

export default AspectGroup;
