const { userRole, typeGraduationDoc, ksuDepartment, programType, education, groupStatus, documentType, requestStep, lessonShedule } = require('./models');


// Функция для заполнения справочных таблиц
async function fillDatabase() {
    try {
        // Заполнение таблицы user_roles
        await userRole.bulkCreate([
            { name: 'Администратор' },
            { name: 'Пользователь' },
            { name: 'Проверяющий ДОП' },
            { name: 'Проверяющий Структурного Подразделения'},
            { name: 'Проректор по ОД'}
        ], {
            ignoreDuplicates: true, // Игнорирование дубликатов
        });

        // Заполнение таблицы type_grad_doc
        await typeGraduationDoc.bulkCreate([
            { name: 'Диплом о профессиональной переподготовке' },
            { name: 'Сертификат о прохождении курса' },
            { name: 'Удостоверение повышения квалификации' },
        ], {
            ignoreDuplicates: true,
        });

        // Заполнение таблицы ksu_department
        await ksuDepartment.bulkCreate([
            { name: 'Институт Высшая ИТ-Школа' },
            { name: 'Институт Гуманитарных наук и социальных технологий' },
            { name: 'Институт Промышленных технологий и дизайна' },
            { name: 'Институт Культуры и искусств' },
            { name: 'Институт Педагогики и психологии' },
            { name: 'Институт Управления, экономики и финансов' },
            { name: 'Институт Физико-математических и естественных наук' },
            { name: 'Юридический институт Имени Ю.П. Новицкого' },
            { name: 'Центр дополнительного образования' },
            { name: 'Координационный центр по вопросам формирования у молодежи активной гражданской позиции, предупреждения межнациональных и межконфессиональных конфликтов, противодействия идеологии терроризма и профилактики экстремизма' },
            { name: 'Отдел по развитию и адаптации персонала' },
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
            { name: 'Заявка отправлена' },
            { name: 'Ожидает документы' },
            { name: 'В обработке' },
            { name: 'Необходима корректировка' },
            { name: 'Одобрено' },
            { name: 'Отказано' },
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

        // Заполнение таблицы request_step
        await requestStep.bulkCreate([
            { name: 'Проверка отделом ДОП', role_id: '3' },
            { name: 'Проверка структурным подразделением', role_id: '4'},
            { name: 'Согласование проректором', role_id: '5' },
        ], {
            ignoreDuplicates: true,
        });

        console.log('Справочные таблицы успешно заполнены начальными данными.');
    } catch (error) {
        console.error('Ошибка при заполнении справочных таблиц:', error);
    }
}

fillDatabase();
