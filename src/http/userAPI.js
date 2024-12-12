import { $host } from './index';

export const login = async (login, password) => {
    password = 'admin'
    const response = await $host.post(`api/user/get_one_user?login=${login}&password=${password}`)
    return response
}