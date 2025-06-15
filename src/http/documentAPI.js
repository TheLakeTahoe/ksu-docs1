import { $host } from './index'

export const getDocumentsData = async (requestID) => {
    try {
        const response = await $host.post(`api/document/get_docs_data`, { requestID })
        return response
    } catch (error) {
        console.error('Ошибка при получении документов: ', error)
    }
}

// EXPORT BLOCK
export const exportAnnotation = async (formValues) => {
    try {
        const response = await $host.get(`api/document/export_annotation`, {
            params: { formValues },
            responseType: 'blob'
        })
        return response
    } catch (error) {
        console.error('Ошибка при экспорте документа: ', error)
    }
}

export const exportEducationPlan = async (formValues) => {
    try {
        const response = await $host.get(`api/document/export_education_plan`, {
            params: { formValues },
            responseType: 'blob'
        })
        return response
    } catch (error) {
        console.error('Ошибка при экспорте документа: ', error)
    }
}

export const exportEducationAndThematicPlan = async (formValues) => {
    try {
        const response = await $host.get(`api/document/export_education_and_thematic_plan`, {
            params: { formValues },
            responseType: 'blob'
        })
        return response
    } catch (error) {
        console.error('Ошибка при экспорте документа: ', error)
    }
}

export const exportEnsuringTheEducationalProccess = async (formValues) => {
    try {
        const response = await $host.get(`api/document/export_ensuring_the_educational_proccess`, {
            params: { formValues },
            responseType: 'blob'
        })
        return response
    } catch (error) {
        console.error('Ошибка при экспорте документа: ', error)
    }
}

export const exportInformationAboutStaffing = async (formValues) => {
    try {
        const response = await $host.get(`api/document/export_information_about_staffing`, {
            params: { formValues },
            responseType: 'blob'
        })
        return response
    } catch (error) {
        console.error('Ошибка при экспорте документа: ', error)
    }
}

// SEND BLOCK
export const sendDocument = async (dataToSend, requestID) => {
    try {
        const response = await $host.post(`api/document/send_document`, { dataToSend, requestID })
        return response
    } catch (error) {
        console.error('Ошибка при отправке документа: ', error)
    }
}

export const sendDocumentGroup = async (requestID) => {
    try {
        const response = await $host.post(`api/document/send_documents_group`, { requestID })
        return response
    } catch (error) {
        console.error('Ошибка при отправке группы документов: ', error)
    }
}

export const goToNextState = async (requestID) => {
    try {
        const response = await $host.post(`api/document/go_to_next_state`, { requestID })
        return response
    } catch (error) {
        console.error('Ошибка при отправке группы документов: ', error)
    }
}

export const goToEditState = async (requestID) => {
    try {
        const response = await $host.post(`api/document/go_to_edit_state`, { requestID })
        return response
    } catch (error) {
        console.error('Ошибка при отправке группы документов: ', error)
    }
}

export const goToRejectState = async (requestID) => {
    try {
        const response = await $host.post(`api/document/go_to_reject_state`, { requestID })
        return response
    } catch (error) {
        console.error('Ошибка при отправке группы документов: ', error)
    }
}