import { $host } from './index'

export const getDataForPrimaryForm = async () => {
    try {
        const data = []
        const departments = await $host.get(`api/data/get_ksu_department`)
        const program_types = await $host.get(`api/data/get_program_type`)
        const lesson_schedules = await $host.get(`api/data/get_lesson_shedule`)
        const types_graduation_doc = await $host.get(`api/data/get_type_graduation_doc`)
        data.push(departments, program_types, lesson_schedules, types_graduation_doc)
        return data
    } catch (error) {
        console.error(error)
    }
}

export const getDepartmentsData = async () => {
    try {
        const response = await $host.get(`api/data/get_ksu_department`)
        return response
    } catch (error) {
        console.error(error)
    }
}

export const getAllEducation = async () => {
    try {
        const response = await $host.get(`api/data/get_education`)
        return response
    } catch (error) {
        console.error(error)
    }
}

export const getAllTeachers = async () => {
    try {
        const response = await $host.get(`api/data/get_teachers`)
        return response
    } catch (error) {
        console.error(error)
    }
}

export const getPrimaryFormData = async (primary_form_id) => {
    try {
        const response = await $host.post(`api/data/get_primary_form_data`, { primary_form_id })
        return response
    } catch (error) {
        console.error(error)
    }
}

export const getFormAspects = async (primary_form_id) => {
    try {
        const response = await $host.post(`api/data/get_form_aspects`, { primary_form_id })
        return response
    } catch (error) {
        console.error(error)
    }
}

export const getFormModules = async (primary_form_id) => {
    try {
        const response = await $host.post(`api/data/get_form_modules`, { primary_form_id })
        return response
    } catch (error) {
        console.error(error)
    }
}
