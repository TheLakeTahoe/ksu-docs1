import { Row, Col, Card, Container, Alert } from 'react-bootstrap'
import TeacherForm from './TeacherForm'

const TeachersGroup = ({ teachers, teacherOptions, onTeacherChange, onAddTeacher, onRemoveTeacher, teacherErrors, handleTeacherSelectChange, onSelectSpecialValue }) => {
    // Функция для отображения ошибок с использованием switch-case
    const renderErrorAlert = (errorKey, errors) => {
        switch(errorKey) {
            case 'count':
                return (
                    <Alert variant="danger">
                        <strong>Общие ошибки преподавателей:</strong>
                        <ul className="mb-0">
                            <li>{errors[0]}</li>
                        </ul>
                    </Alert>
                )
            case 'duplicates':
                return (
                    <Alert variant="warning">
                        <strong>Обнаружены дубликаты:</strong>
                        <ul className="mb-0">
                            {errors.map((err, i) => (
                                <li key={`dup-${i}`}>{err}</li>
                            ))}
                        </ul>
                    </Alert>
                )
            default:
                return (
                    <Alert key={errorKey} variant="danger">
                        <strong>Преподаватель {Number(errorKey) + 1}:</strong>
                        <ul className="mb-0">
                            {errors.teacher && errors.teacher.map((err, i) => (
                                <li key={`mod-${i}`}>{err}</li>
                            ))}
                        </ul>
                    </Alert>
                )
        }
    }

    return (
        <Container>
            {/* Отображение ошибок */}
            {teacherErrors && typeof teacherErrors === 'object' && 
                Object.entries(teacherErrors).map(([key, errors]) => (
                    renderErrorAlert(key, errors)
                ))
            }

            <Row className="d-flex flex-wrap">
                {teachers.map((teacher, index) => (
                    <Col key={index} xs={12} md={4} lg={4} className="mb-4">
                        <TeacherForm
                            teacherOptions={teacherOptions}
                            teacherData={teacher}
                            index={index + 1}
                            onChange={(data) => onTeacherChange(index, data)}
                            onRemove={() => onRemoveTeacher(index)}
                            handleTeacherSelectChange={handleTeacherSelectChange}
                            onSelectSpecialValue={onSelectSpecialValue}
                        />
                    </Col>
                ))}
                
                {teachers.length < 6 && (
                    <Col xs={12} md={4} lg={4}>
                        <Card
                            className="d-flex align-items-center justify-content-center"
                            style={{
                                width: '100%',
                                minHeight: '470px',
                                border: '2px dashed #ccc',
                                cursor: 'pointer',
                            }}
                            onClick={onAddTeacher}
                        >
                            <Card.Body className="d-flex align-items-center justify-content-center">
                                <h5>+ Добавить преподавателя</h5>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>
        </Container>
    )
}

export default TeachersGroup