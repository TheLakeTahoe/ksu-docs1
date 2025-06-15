import { Col, InputGroup, Row } from 'react-bootstrap'
import InputField from './InputField'
import { useEffect, useState } from 'react'

const buildErrorPath = (name) => {
    const [prefix, ...rest] = name.split('.')
    return `${prefix}.errors.${rest.join('.')}`
}

const buildCheckboxPath = (name) => {
    const [prefix, ...rest] = name.split('.')
    return `${prefix}.checkbox.${rest.join('.')}`
}

const ValidatedField = ({
    label,
    name,
    value,
    onChange,
    isSelect = false,
    options,
    error,
    disabled,
    isChecking,
    commentValue,
    checkboxValue,
}) => {
    const errorName = buildErrorPath(name)
    const checkboxName = buildCheckboxPath(name)

    const handleCheckboxToggle = (e) => {
        const checked = e.target.checked

        // обновим local состояние, если используешь useState (можно убрать вообще, если читаешь только из props)
        // setHasError(checked) — больше не нужен, если `checkboxValue` приходит из родителя

        // отправим в родитель через onChange
        onChange({ target: { name: checkboxName, value: checked } })

        // если сняли галочку — очищаем ошибку
        if (!checked && commentValue) {
            onChange({ target: { name: errorName, value: '' } })
        }
    }

    return (
        <>
            {isChecking ? (
                <>
                    <Row>
                        <Col xs={10} md={11}>
                            <InputField
                                label={label}
                                name={name}
                                value={value}
                                isSelect={isSelect}
                                options={options}
                                onChange={onChange}
                                disabled={true}
                                error={error}
                            />
                        </Col>
                        <Col xs={2} md={1} className='comment-check'>
                            <Row>
                                <InputGroup.Checkbox
                                    checked={checkboxValue} // читаем из props
                                    onChange={handleCheckboxToggle}
                                />
                            </Row>
                            <Row>
                                Есть ошибки
                            </Row>
                        </Col>
                    </Row>
                    {checkboxValue && (
                        <Row>
                            <Col>
                                <InputField
                                    label={`Ошибки поля ${label}`}
                                    name={errorName}
                                    value={commentValue}
                                    onChange={onChange}
                                />
                            </Col>
                        </Row>
                    )}
                </>
            ) : (
                <InputField
                    label={label}
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    error={error}
                />
            )}
        </>
    )
}

export default ValidatedField
