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

    const documentsCommonData = [];

    // Ждём все данные
    const [
        primaryFormData,
        documents,
        formAspectsData,
        formModulesData
    ] = await Promise.all([
        getPrimaryFormData(requestID),
        getDocumentsData(requestID),
        getFormAspects(requestID),
        getFormModules(requestID)
    ]);

    if (primaryFormData.data.data[0]) {
        documentsCommonData.push(primaryFormData.data.data[0])
    }

    // Собираем общие данные
    if (documents.data.length > 0) {
        const docData = documents.data[0];
        documentsCommonData.push(
            docData?.doc1_data,
            docData?.doc2_data,
            docData?.doc3_data,
            docData?.doc4_data,
            docData?.doc5_data
        );
    }

    if (formAspectsData.data?.aspects)
        documentsCommonData.push(formAspectsData.data);

    if (formModulesData.data?.modules) {
        documentsCommonData.push(formModulesData.data);
    }

    if (Object.values(documents.data[0]).every(s => s === null)) {
        // Заполняем documentsData
        setDocumentsData(prev => {
            const updated = structuredClone(prev);

            documentsCommonData.forEach(dataObject => {
                if (!dataObject) return;

                Object.entries(dataObject).forEach(([key, value]) => {
                    const paths = serverToDocumentMap[key];
                    if (paths) {
                        paths.forEach(path => {
                            setByPath(updated, path, value || '');
                        });
                    }
                });
            });

            return updated;
        });
    }
    else {
        const latestDocKey = Object.entries(documents.data[0])
            .filter(([key]) => key.includes('updated'))
            .sort((a, b) => new Date(b[1]) - new Date(a[1]))[0][0].replace('_updated', '_data');

        const latestData = documents.data[0][latestDocKey];

        let normalizedData;

        // Шаблоны по умолчанию
        const defaultStructure = {
            annotation: {
                program: {
                    control_form: '',
                    direction: '',
                    benefits: '',
                    graduation_doc: primaryFormData.data.data[0]?.grad_doc_name || '',
                },
                ksu: {
                    department: '',
                    auditory: '',
                    equipment: '',
                },
                technologies: {},
            },
            commonData: {
                program: {
                    program_type: primaryFormData.data.data[0]?.program_type || '',
                    program_goal: '',
                    program_name: primaryFormData.data.data[0]?.program_name || '',
                    education_form: primaryFormData.data.data[0]?.shedule_name || '',
                    listeners_category: primaryFormData.data.data[0]?.target_audience || '',
                    standart_compliance: '',
                },
                hours: {
                    overall: '',
                    academic: primaryFormData.data.data[0]?.program_hours || '',
                },
                lesson: {
                    count: '',
                    duration: '',
                },
                modules: formModulesData.data?.modules || {},
                aspects: formAspectsData.data?.aspects || {},
            },
        };

        // Если уже в нужной структуре
        if ('commonData' in latestData && 'annotationData' in latestData) {
            normalizedData = {
                annotation: {
                    ...defaultStructure.annotation,
                    ...documents.data[0].doc1_data.annotationData,        // берем из исходных всегда
                    ...latestData.annotationData,   // перезаписываем если есть новые
                },
                commonData: {
                    ...defaultStructure.commonData,
                    ...latestData.commonData,
                },
            };
        } else {
            if (documents.data[0].doc1_data !== null)
                // Если нет annotationData, то не трогаем аннотацию из doc1_data, просто кладём ее как есть
                normalizedData = {
                    annotation: {
                        ...defaultStructure.annotation,
                        ...documents.data[0].doc1_data.annotationData,  // всегда берем существующую аннотацию
                    },
                    commonData: {
                        ...defaultStructure.commonData,
                        ...latestData,
                    },
                };
            else
                normalizedData = {
                    annotation: {
                        ...defaultStructure.annotation,
                    },
                    commonData: {
                        ...defaultStructure.commonData,
                        ...latestData,
                    },
                };
        }

        setDocumentsData(normalizedData);
        console.log(normalizedData);
    }



};
