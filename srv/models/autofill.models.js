const { userRole, studyField, typeGraduationDoc, ksuDepartment, programType, aspects, programModule, reward, education, groupStatus, documentType, checkResult, lessonShedule } = require('./models');

const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

// Функция для заполнения справочных таблиц
async function fillDatabase() {
    try {
        const a = hashPassword('abcdefgh')
        
        // Заполнение таблицы user_roles
        await userRole.bulkCreate([
            { name: 'Администратор' },
            { name: 'Пользователь' },
            { name: 'Проверяющий' },
        ], {
            ignoreDuplicates: true, // Игнорирование дубликатов
        });

        // Заполнение таблицы study_field
        await studyField.bulkCreate([
            { name: 'Информатика' },
            { name: 'Менеджмент' },
            { name: 'Финансы' },
            { name: 'Маркетинг' },
        ], {
            ignoreDuplicates: true,
        });

        // Заполнение таблицы type_grad_doc
        await typeGraduationDoc.bulkCreate([
            { name: 'Диплом о высшем образовании' },
            { name: 'Сертификат о прохождении курса' },
            { name: 'Удостоверение повышения квалификации' },
        ], {
            ignoreDuplicates: true,
        });

        // Заполнение таблицы ksu_department
        await ksuDepartment.bulkCreate([
            { name: 'Кафедра прикладной математики' },
            { name: 'Кафедра управления проектами' },
            { name: 'Кафедра бухгалтерского учета' },
        ], {
            ignoreDuplicates: true,
        });

        // Заполнение таблицы program_type
        await programType.bulkCreate([
            { name: 'Программа повышения квалификации' },
            { name: 'Программа профессиональной переподготовки' },
            { name: 'Дополнительная общеобразовательная программа для взрослых' },
        ], {
            ignoreDuplicates: true,
        });

        // Заполнение таблицы aspects
        await aspects.bulkCreate([
            { name: 'Практическое применение' },
            { name: 'Теоретические знания' },
            { name: 'Командная работа' },
        ], {
            ignoreDuplicates: true,
        });

        // Заполнение таблицы education
        await education.bulkCreate([
            { name: 'Начальное общее образование' },
            { name: 'Основное общее образование' },
            { name: 'Среднее (полное) общее образование' },
            { name: 'Неполное высшее образование' },
            { name: 'Высшее образование' },
            { name: 'Магистратура' },
            { name: 'Аспирантура' },
            { name: 'Докторантура' },
        ], {
            ignoreDuplicates: true,
        });

        // Заполнение таблицы group_status
        await groupStatus.bulkCreate([
            { name: 'Черновик' },
            { name: 'В обработке' },
            { name: 'Одобрено' },
            { name: 'Отказано' },
            { name: 'Корректировка' },
        ], {
            ignoreDuplicates: true,
        });

        // Заполнение таблицы document_type
        await documentType.bulkCreate([
            { name: 'Аннотация ДОП' },
            { name: 'Учебный план' },
            { name: 'Учебно-тематический план' },
            { name: 'Обеспечение образовательного процесса' },
            { name: 'Сведения о кадровом обеспечении' },
            { name: 'Календарный учебный график' },
            { name: 'Материально-техническое обеспечение' },
        ], {
            ignoreDuplicates: true,
        });

        // Заполнение таблицы lesson_shedule
        await lessonShedule.bulkCreate([
            { name: 'Очная' },
            { name: 'Очно-заочная' },
            { name: 'Заочная' },
        ], {
            ignoreDuplicates: true,
        });

        // Заполнение таблицы check_result
        await checkResult.bulkCreate([
            { name: 'Одобрено' },
            { name: 'Отказано' },
            { name: 'На доработку' },
        ], {
            ignoreDuplicates: true,
        });

        console.log('Справочные таблицы успешно заполнены начальными данными.');
        hashPassword("my_secure_password").then(console.log);
    } catch (error) {
        console.error('Ошибка при заполнении справочных таблиц:', error);
    }
}

fillDatabase();
