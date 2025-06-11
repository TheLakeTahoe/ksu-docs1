import React, { createContext, useState } from 'react';

export const DocumentsContext = createContext();

export const DocumentsProvider = ({ children }) => {
    const [documentsData, setDocumentsData] = useState({
        //* Уникальные данные *//
        // АННОТАЦИЯ ДОП
        annotation: {
            // Данные о программе
            program: {
                control_form: '',
                direction: '',
                benefits: '',
                graduation_doc: '',
            },

            // Данные о КГУ (Корпус, Аудитория и Оборудование)
            ksu: {
                department: '',
                auditory: '',
                equipment: '',
            },

            // Данные о технологиях обучения
            technologies: {
            },
        },

        // ИНФОРМАЦИЯ О КАДРОВОМ ОБЕСПЕЧЕНИИ
        informationAboutStaffing: {
            // Данные о преподавателе
            teachers: {
                // Имя и должность в образовательной программе
                teacher: {
                    name: '',
                    position: '',
                },

                // Данные об обучении
                education: {
                    institute: '',
                    specialty: '',
                },

                // Ученая степень, квалификационая категория
                category: '',

                // Опыт работы
                experience: {
                    overall: '',
                    in_discipline: '',
                },

                // Место работы и должность
                workplace: {
                    name: '',
                    position: '',
                },

                // Условия привлечения к педагогической деятельности
                conditions: '',
            }
        },

        //* НЕ Уникальные данные *//
        commonData: {
            // Общие данные о программе
            program: {
                program_type: '',
                program_goal: '',
                program_name: '',
                education_form: '',
                listeners_category: '',
                standart_compliance: '',
            },

            // Данные о количестве часов
            hours: {
                overall: '',
                academic: '',
            },

            // Общие данные о количестве занятий и их длительности
            lesson: {
                count: '',
                duration: '',
            },

            // Общие данные о модулях программы
            // ПРИМЕР ЗАПОЛНЕНИЯ
            // modules: {
            //      0: {
            //          name: 'Первые шаги',
            //          h_overall: 144,
            //          h_lk: 100,
            //          h_lb: 10,
            //          h_pr: 14,
            //          h_sr: 20,
            //          control_form: 'Экзамен',
            //          submodules: {
            //              0: {
            //                  name: 'Введение',
            //                  h_overall: 15,
            //                  h_lk: 3,
            //                  h_lb: 10,
            //                  h_pr: 1,
            //                  h_sr: 1,
            //                  control_form: 'Отсутствует',
            //              },
            //              1: {
            //                  ...
            //              },
            //          },
            //          ksu_data: {
            //              department_id: 1,
            //              auditory: 'Корпус Е, Аудитория 325',
            //              address: 'ул.Пушкина, дом Колотушкина'
            //          }
            //      }
            // },


            modules: {

            },

            // Общие данные о получаемых аспектах при прохождении программы
            aspects: {

            },
        },

        // Формы только с общими данными
        educationalPlan: {

        },
        educationalAndThematicPlan: {

        },

        ensuringTheEducationalProccess: {

        },
    })

    const commonDataFieldsName = {
        // Annotation
        1: [
            'commonData.program.program_type',
            'commonData.program.program_name',
            'commonData.program.standart_compliance',
            'commonData.program.program_goal',
            'commonData.program.listeners_category',
            'commonData.hours.academic',
            'commonData.hours.overall',
            'commonData.lesson.count',
            'commonData.lesson.duration',
            'commonData.aspects',
            'commonData.modules.name',
            'commonData.modules.h_overall'
        ],

        // EducationalPlan
        2: [
            'commonData.program.program_type',
            'commonData.program.program_name',
            'commonData.program.program_goal',
            'commonData.program.listeners_category',
            'commonData.program.education_form',
            'commonData.hours.academic',
            'commonData.lesson.count',
            'commonData.lesson.duration',
            'commonData.modules.name',
            'commonData.modules.h_overall',
            'commonData.modules.h_lk',
            'commonData.modules.h_lb',
            'commonData.modules.h_pr',
            'commonData.modules.h_sr',
            'commonData.modules.control_form',
        ],

        // EducationalAndThematicPlan
        3: [
            'commonData.program.program_type',
            'commonData.program.program_name',
            'commonData.program.program_goal',
            'commonData.program.standart_compliance',
            'commonData.program.education_form',
            'commonData.aspects',
            'commonData.modules.name',
            'commonData.modules.h_overall',
            'commonData.modules.h_lk',
            'commonData.modules.h_lb',
            'commonData.modules.h_pr',
            'commonData.modules.h_sr',
            'commonData.modules.control_form',
        ],

        // EnsuringTheEducationalProccess
        4: [],

        // InformationAboutStaffing
        5: []
    }



    return (
        <DocumentsContext.Provider value={{ documentsData, setDocumentsData, commonDataFieldsName }}>
            {children}
        </DocumentsContext.Provider>
    );
};