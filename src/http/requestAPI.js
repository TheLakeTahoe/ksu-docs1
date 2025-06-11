import { $host } from './index'

export const sendRequest = async (formValues) => {
    try {
        const response = await $host.post(`api/request/send_request`, formValues)
        return response

    } catch (error) {
        console.log('Ошибка входа: ', error)
    }
}

export const getUserRequests = async (account_id) => {
    try {
        const response = await $host.post(`api/request/get_user_requests`, { account_id })
        return response

    } catch (error) {
        console.log('Ошибка входа: ', error)
    }
}

export const getRequestDocuments = async (primary_form_id) => {
    try {
        const response = await $host.post(`api/request/get_request_documents`, { primary_form_id })
        return response

    } catch (error) {
        console.log('Ошибка входа: ', error)
    }
}