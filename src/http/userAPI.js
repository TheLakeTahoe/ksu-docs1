import { $host } from './index'

export const authorize = async (formValues) => {
    try {
        const response = await $host.post(`api/user/login`, formValues)
        return response.data

    } catch (error) {
        console.error('Ошибка входа: ', error)
    }
}

export const checkField = async (field, value) => {
    try {
        const response = await $host.post(`api/user/check_field`, { field, value })
        return response.data.message === 'Y' ? true : false
    } catch (error) {
        console.error('Ошибка проверки полей: ', error)
    }
}

// Функции-обертки для удобства
export const checkLogin = (login) => checkField('login', login)
export const checkPhone = (phone) => checkField('phone', phone)
export const checkEmail = (email) => checkField('email', email)

export const register = async (formValues) => {
    try {
        const response = await $host.post(`api/user/register`, formValues)
        return response.data

    } catch (error) {
        console.error('Ошибка при регистрации: ', error)
    }
}

export const getUserData = async (userData) => {
    try {
        const response = await $host.post(`api/user/get_user_data`, userData)
        return response.data

    } catch (error) {
        console.error('Ошибка при получении данных пользователя: ', error)
    }
}