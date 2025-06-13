import { getPrimaryFormData, getFormAspects, getFormModules } from '../http/dataAPI';
import { getDocumentsData } from '../http/documentAPI';

const serverToDocumentMap = {
    grad_doc_name: ['annotation.program.graduation_doc'],
    program_hours: ['commonData.hours.academic'],
    p_type_name: ['commonData.program.program_type'],
    program_name: ['commonData.program.program_name'],
    shedule_name: ['commonData.program.education_form'],
    target_audience: ['commonData.program.listeners_category'],
    aspects: ['commonData.aspects'],
    modules: ['commonData.modules'],
};

// Вспомогательная функция для установки значения по пути
const setByPath = (obj, path, value) => {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const nested = keys.reduce((acc, key) => {
        if (!acc[key]) acc[key] = {};
        return acc[key];
    }, obj);
    nested[lastKey] = value;
};

export const fillDocuments = async (requestID, setDocumentsData) => {
    if (!requestID) return;

    try {
        // Получаем все необходимые данные
        const [
            primaryFormData,
            documentsResponse,
            formAspectsData,
            formModulesData
        ] = await Promise.all([
            getPrimaryFormData(requestID),
            getDocumentsData(requestID),
            getFormAspects(requestID),
            getFormModules(requestID)
        ]);

        // Получаем данные документов из ответа сервера
        const serverDocumentsData = documentsResponse?.data[0]?.data;
        console.log('Данные с сервера:', serverDocumentsData);

        // Создаем базовую структуру с дефолтными значениями
        const defaultData = {
            annotation: {
                ksu: {
                    auditory: '',
                    equipment: '',
                    department: ''
                },
                program: {
                    benefits: '',
                    direction: '',
                    control_form: '',
                    graduation_doc: primaryFormData.data.data[0]?.grad_doc_name || ''
                },
                technologies: {}
            },
            commonData: {
                hours: {
                    overall: '',
                    academic: primaryFormData.data.data[0]?.program_hours || ''
                },
                lesson: {
                    count: '',
                    duration: ''
                },
                aspects: formAspectsData.data?.aspects || [],
                modules: formModulesData.data?.modules || [],
                program: {
                    program_goal: '',
                    program_name: primaryFormData.data.data[0]?.program_name || '',
                    program_type: primaryFormData.data.data[0]?.p_type_name || '',
                    education_form: primaryFormData.data.data[0]?.shedule_name || '',
                    listeners_category: primaryFormData.data.data[0]?.target_audience || '',
                    standart_compliance: ''
                }
            },
            ANN: false,
            EDP: false,
            ETP: false,
            EEP: false,
            IAS: false
        };

        // Объединяем данные с сервера с дефолтной структурой
        const mergedData = {
            annotation: {
                ...defaultData.annotation,
                ...serverDocumentsData?.annotation,
                program: {
                    ...defaultData.annotation.program,
                    ...serverDocumentsData?.annotation?.program
                },
                ksu: {
                    ...defaultData.annotation.ksu,
                    ...serverDocumentsData?.annotation?.ksu
                }
            },
            commonData: {
                ...defaultData.commonData,
                ...serverDocumentsData?.commonData,
                hours: {
                    ...defaultData.commonData.hours,
                    ...serverDocumentsData?.commonData?.hours
                },
                lesson: {
                    ...defaultData.commonData.lesson,
                    ...serverDocumentsData?.commonData?.lesson
                },
                program: {
                    ...defaultData.commonData.program,
                    ...serverDocumentsData?.commonData?.program
                },
                // Сохраняем аспекты и модули из отдельных запросов, если они есть
                aspects: serverDocumentsData?.commonData?.aspects || formAspectsData.data?.aspects || [],
                modules: serverDocumentsData?.commonData?.modules || formModulesData.data?.modules || []
            },
            ANN: serverDocumentsData?.ANN || false,
            EDP: serverDocumentsData?.EDP || false,
            ETP: serverDocumentsData?.ETP || false,
            EEP: serverDocumentsData?.EEP || false,
            IAS: serverDocumentsData?.IAS || false
        };

        // Обновляем состояние
        setDocumentsData(mergedData);
        console.log('Объединенные данные:', mergedData);

    } catch (error) {
        console.error('Ошибка при заполнении документов:', error);
        // Можно добавить обработку ошибок, например:
        // setErrorState('Не удалось загрузить данные документов');
    }
};