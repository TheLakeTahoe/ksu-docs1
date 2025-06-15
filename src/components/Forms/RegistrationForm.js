import { useState } from 'react'
import MainDataForm from '../RegistrationFormComponents/RegistrationFormMD'
import PersonalDataForm from '../RegistrationFormComponents/RegistrationFormPD'
import './Forms.css'

function RegistrationPage({updateHeight}) {
    const [step, setStep] = useState('md') // 'md' или 'pd'
    const [formData, setFormData] = useState({
        login: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        f_name: '',
        m_name: '',
        l_name: '',
        workExperience: '',
        workplace: '',
        education: '',
        position: ''
    })

    const updateFormData = (newData) => {
        setFormData((prevData) => ({
            ...prevData,
            ...newData
        }))
    }

    return (
        <div>
            {step === 'md' ? (
                <MainDataForm
                    onNext={() => setStep('pd')}
                    formData={formData}
                    updateFormData={updateFormData}
                    updateHeight={updateHeight}
                />
            ) : (
                <PersonalDataForm
                    onBack={() => setStep('md')}
                    formData={formData}
                    updateFormData={updateFormData}
                    updateHeight={updateHeight}
                />
            )}
        </div>
    )
}

export default RegistrationPage
