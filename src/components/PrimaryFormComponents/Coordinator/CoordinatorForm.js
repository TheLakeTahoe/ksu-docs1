import React from 'react'
import { Card, Col, Button } from 'react-bootstrap'
import InputField from '../../CustomComponents/InputFields/InputField'

const CoordinatorForm = ({ coordinator, onCoordinatorChange, coordinatorOptions, handleCoordinatorSelectChange, onSelectSpecialValue, setCoordinator }) => {
    const currentCoordinator = coordinator[0] || {}

    const handleInputChange = (e) => {
        const { name, value } = e.target
        const updatedCoordinator = [{ ...currentCoordinator, [name]: value }]
        onCoordinatorChange(updatedCoordinator)
    }

    const handleClearCoordinator = () => {
        // Очищаем данные координатора, устанавливая пустой массив
        setCoordinator([{}])
    }

    return (
        <Card as={Col} xs={12} md={4} lg={4} className="coordinator-form-card">
            <Card.Header className="coordinator-form-header d-flex justify-content-between align-items-center">
                <h6 className="mb-0">Координатор</h6>
                <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={handleClearCoordinator}
                    disabled={!currentCoordinator.full_name} // Делаем кнопку неактивной если нет координатора
                >
                    Очистить
                </Button>
            </Card.Header>
            <Card.Body>
                <InputField
                    label='Координатор'
                    isSelect
                    name='full_name'
                    options={[...coordinatorOptions, { value: '__add__', label: '+ Добавить координатора' }]}
                    value={coordinatorOptions.find(option => option.value === currentCoordinator.full_name) || null}
                    onChange={(e) => {
                        if (e.value === '__add__') {
                            onSelectSpecialValue?.()
                        } else {
                            handleCoordinatorSelectChange(0, e)
                        }
                    }}
                />
                <InputField
                    label='Телефон'
                    name='phone'
                    value={currentCoordinator.phone || ''}
                    onChange={handleInputChange}
                    isPhoneNumber
                />
                <InputField
                    label='EMail'
                    name='email'
                    value={currentCoordinator.email || ''}
                    onChange={handleInputChange}
                />
                <InputField
                    label='Адрес'
                    name='address'
                    value={currentCoordinator.address || ''}
                    onChange={handleInputChange}
                />
            </Card.Body>
        </Card>
    )
}

export default CoordinatorForm