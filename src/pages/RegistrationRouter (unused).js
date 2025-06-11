import React, { useState } from 'react';
import RegistrationFormMD from '../components/RegistrationFormComponents/RegistrationFormMD';
import RegistrationFormPD from '../components/RegistrationFormComponents/RegistrationFormPD';

const Register = () => {
    const [step, setStep] = useState('md'); // 'md' или 'pd'

    return (
        <div>
            {step === 'md' ? (
                <RegistrationFormMD onNext={() => setStep('pd')} />
            ) : (
                <RegistrationFormPD onBack={() => setStep('md')} />
            )}
        </div>
    );
};

export default Register;
