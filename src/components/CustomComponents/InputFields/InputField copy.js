import React, { useState } from 'react'
import { Form, InputGroup, Image } from 'react-bootstrap'
import Select from 'react-select'
import { Eye, EyeClosed } from 'lucide-react'
import './InputField.css'
import dangerImg from '../../../assets/InputFields/danger.png'

const formatPhoneNumber = (input) => {
  const cleaned = input.replace(/\D/g, '').slice(0, 10)
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/)

  if (!match) return ''

  let formatted = ''
  if (match[1]) formatted += `(${match[1]}`
  if (match[2]) formatted += `) ${match[2]}`
  if (match[3]) formatted += `-${match[3]}`
  if (match[4]) formatted += `-${match[4]}`

  return formatted
}

const InputField = ({ label, type, value, onChange, options, isSelect = false, isPhoneNumber = false, isPassword = false, isTextarea = false, name, error, onInputChange, disabled, onKeyPress }) => {
  const [active, setActive] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [blinking, setBlinking] = useState(false)

  const handleFocus = () => setActive(true)
  const handleBlur = () => {
    if (!value) {
      setActive(false)
    }
  }

  const handlePhoneChange = (e) => {
    const formattedValue = formatPhoneNumber(e.target.value)
    onChange({ target: { value: formattedValue, name } })
  }

  const handleKeyPress = (e) => {
    if (e.key === ' ') {
      e.preventDefault()
    }
  }

  const handlePasswordToggle = () => {
    setBlinking(true)
    setTimeout(() => {
      setShowPassword((prev) => !prev)
      setBlinking(false)
    }, 100)
  }

  const inputId = `input-${name}`

  return (
    <Form.Group className={`input-group ${error ? 'error' : ''}`}>
      <Form.Label htmlFor={inputId} className={`input-label ${isPhoneNumber || active || value ? 'active' : ''}`}>
        {label}
      </Form.Label>

      {isSelect ? (
        <Select
          options={options}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyPress={onKeyPress}
          onInputChange={onInputChange}
          isSearchable
          noOptionsMessage={() => 'Нет результатов'}
          className='input-select'
          classNamePrefix='input-select'
          placeholder=''
          inputId={inputId}
          isDisabled={disabled}
          menuPortalTarget={document.body}
          styles={{
            menuPortal: base => ({ ...base, zIndex: 9999 }),
          }}
        />
      ) : isPhoneNumber ? (
        <InputGroup className={`input-group-phone ${error ? 'error' : ''}`}>
          <InputGroup.Text>+7</InputGroup.Text>
          <Form.Control
            type='text'
            id={inputId}
            value={value}
            onChange={handlePhoneChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyPress={handleKeyPress}
            className='input-field'
            placeholder='(999) 999-99-99'
            name={name}
            disabled={disabled}
          />
        </InputGroup>
      ) : isPassword ? (
        <InputGroup className={`input-group-password ${error ? 'error' : ''}`}>
          <Form.Control
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyPress={handleKeyPress}
            className='input-field'
            name={name}
            disabled={disabled}
          />
          <InputGroup.Text onClick={handlePasswordToggle} className='eye-button'>
            <div className={`eye-icon ${blinking ? 'blinking' : ''}`}>
              {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
            </div>
          </InputGroup.Text>
        </InputGroup>
      ) : isTextarea ? (
        <Form.Control
          as='textarea'
          id={inputId}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className='input-textarea'
          name={name}
          disabled={disabled}
          rows={4}
        />
      ) : (
        <InputGroup>
          <Form.Control
            type={type}
            id={inputId}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyPress={onKeyPress}
            className='input-field'
            name={name}
            disabled={disabled}
          />
        </InputGroup>
      )}

      <Form.Text className={`text-danger ${error ? 'show' : ''}`}>
        <Image src={dangerImg} alt='Danger' className='danger-icon' />
        {error}
      </Form.Text>
    </Form.Group>
  )
}

export default InputField
