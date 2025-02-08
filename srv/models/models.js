const sequelize = require('../db');
const { DataTypes } = require('sequelize');

// Справочные таблицы
// Таблица user_roles (Роли пользователей)
const userRole = sequelize.define('user_role', {
    id: {                           // ID роли
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {                         // Название роли
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
}, {
    timestamps: false
});

// Таблица study_field (Сфера обучения)
const studyField = sequelize.define('study_field', {
    id: {                           // ID сферы
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {                         // Название сферы
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
}, {
    timestamps: false
});

// Таблица type_grad_doc (Вид документа по окончании обучения)
const typeGraduationDoc = sequelize.define('type_grad_doc', {
    id: {                           // ID вида документа по окончании обучения
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {                         // Название вида документа по окончании обучения
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
}, {
    timestamps: false
});

// Таблица ksu_department (Подразделение КГУ)
const ksuDepartment = sequelize.define('ksu_department', {
    id: {                           // ID подразделения КГУ
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {                         // Название подразделение КГУ
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
}, {
    timestamps: false
});

// Таблица program_type (Вид программы)
const programType = sequelize.define('program_type', {
    id: {                           // ID вида программы
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {                         // Название вида программы
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
}, {
    timestamps: false
});

// Таблица aspects (Аспекты)
const aspects = sequelize.define('aspects', {
    id: {                           // ID аспекта
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {                         // Название аспекта
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
}, {
    timestamps: false
});

// Таблица program_module (Модуль программы)
const programModule = sequelize.define('program_module', {
    id: {                           // ID модуля программы
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {                         // Название модуля программы
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    hours: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

// Таблица reward (Награда)
const reward = sequelize.define('reward', {
    id: {                           // ID награды
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {                         // Название награды
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
}, {
    timestamps: false
});

// Таблица education (Образование)
const education = sequelize.define('education', {
    id: {                           // ID образования
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {                         // Название образования
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
}, {
    timestamps: false
});

// Таблица group_status (Статус группы)
const groupStatus = sequelize.define('group_status', {
    id: {                           // ID статуса группы
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {                         // Название статуса группы
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
}, {
    timestamps: false
});

// Таблица document_type (Тип документа)
const documentType = sequelize.define('document_type', {
    id: {                           // ID типа документа
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {                         // Название типа документа
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
}, {
    timestamps: false
});

// Таблица check_result (Результат проверки)
const checkResult = sequelize.define('check_result', {
    id: {                           // ID результата проверки
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {                         // Название результата проверки
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
}, {
    timestamps: false
});

// Таблица lesson_shedule (Режим занятий)
const lessonShedule = sequelize.define('lesson_shedule', {
    id: {                           // ID режима занятий
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {                         // Название режима занятий
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
}, {
    timestamps: false
});


// Основные таблицы
// Таблица primary_form (Первичная форма)
const primaryForm = sequelize.define('primary_form', {
    id: {                                       // ID результата проверки
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ksuDepartmentID: {                          // Ссылка на ksu_department
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    typeGraduationDocID: {                      // Ссылка на type_grad_doc
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    programCoordinatorID: {                     // Ссылка на program_coordinator
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    programTypeID: {                            // Ссылка на program_type
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    lessonSheduleID: {                           // Ссылка на lesson_shedule
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    teacherID: {                                // Ссылка на teacher
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    accountID: {                                // Ссылка на account
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    studyPeriod: {                              // Срок обучения
        type: DataTypes.STRING,
        allowNull: false,
    },
    programName: {                              // Наименование программы
        type: DataTypes.STRING,
        allowNull: false,
    },
    programDescriptionShort: {                  // Коротко о программе
        type: DataTypes.STRING,
        allowNull: false,
    },
    programDescription: {                       // Описание программы
        type: DataTypes.STRING,
        allowNull: false,
    },
    targetAudience: {                           // Целевая аудитория
        type: DataTypes.STRING,
        allowNull: false,
    },
    programHours: {                             // Общая трудоемкость программы (в часах)
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    educationCost: {                            // Стоимость обучения
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created: {                                  // Дата создания
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
}, {
    timestamps: false
});

// Таблица grad_doc (Документ по окончании обучения)
const graduationDoc = sequelize.define('grad_doc', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    studyFieldId: {                             // Ссылка на study_field
        type: DataTypes.INTEGER,
        allowNull: false
    },
    typeGraduationDocId: {                      // Ссылка на type_grad_doc
        type: DataTypes.INTEGER,
        allowNull: false
    },
    primaryFormId: {                            // Ссылка на primary_form
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, { 
    timestamps: false 
});

// Таблица program_coordinator (Координатор программы)
const programCoordinator = sequelize.define('program_coordinator', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    phone: {                                    // Контактный телефон
        type: DataTypes.STRING,
        allowNull: false
    },
    eMail: {                                    // E-mail
        type: DataTypes.STRING,
        allowNull: false
    },
    full_name: {                                // ФИО
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {                                  // Адрес офиса
        type: DataTypes.STRING,
        allowNull: false
    },
}, { 
    timestamps: false 
});

// Таблица certificate (Сертификат)
const certificate = sequelize.define('certificate', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { 
    timestamps: false 
});

// Таблица teacher (Преподаватель)
const teacher = sequelize.define('teacher', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    position: {                                 // Должность
        type: DataTypes.STRING,
        allowNull: false
    },
    full_name: {                                // ФИО
        type: DataTypes.STRING,
        allowNull: false
    },
    workExperience: {                           // Наличие опыта работы
        type: DataTypes.STRING,
        allowNull: false
    },
    workplace: {                                // Место работы
        type: DataTypes.STRING,
        allowNull: false
    },
}, { 
    timestamps: false 
});

// Таблица account (Пользователь)
const account = sequelize.define('account', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    educationID: {                              // Ссылка на education
        type: DataTypes.INTEGER,
        allowNull: false
    },
    roleID: {                                   // Ссылка на user_role
        type: DataTypes.INTEGER,
        allowNull: false
    },
    login: {                                    // Логин
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {                                 // Хэш пароля
        type: DataTypes.STRING,
        allowNull: false
    },
    academicDegree: {                           // Ученая степень
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {                                    // Контактный телефон
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    position: {                                 // Должность
        type: DataTypes.STRING,
        allowNull: false
    },
    full_name: {                                // ФИО
        type: DataTypes.STRING,
        allowNull: false
    },
    workExperience: {                           // Наличие опыта работы
        type: DataTypes.STRING,
        allowNull: true
    },
    workplace: {                                // Место работы
        type: DataTypes.STRING,
        allowNull: true
    },
    created: {                                  // Дата создания
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
}, { 
    timestamps: false 
});

// Таблица document (Документ)
const document = sequelize.define('document', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    documentTypeID: {                           // Ссылка на document_type
        type: DataTypes.INTEGER,
        allowNull: false
    },
    documentData: {                             // Данные документа
        type: DataTypes.JSONB,
        allowNull: false
    },
    created: {                                  // Дата создания
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    updated: {                                  // Дата изменения
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
}, { 
    timestamps: false 
});

// Таблица document_group (Группа Документов)
const documentGroup = sequelize.define('document_group', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    documentID_1: {                             // Ссылка на document
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    documentID_2: {                             // Ссылка на document
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    documentID_3: {                             // Ссылка на document
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    documentID_4: {                             // Ссылка на document
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    documentID_5: {                             // Ссылка на document
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    documentID_6: {                             // Ссылка на document
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    documentID_7: {                             // Ссылка на document
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    groupStatusID: {                            // Ссылка на group_status
        type: DataTypes.INTEGER,
        allowNull: false
    },
    accountID: {                                // Ссылка на account
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, { 
    timestamps: false 
});

// Таблица check_documents (Проверка документов)
const checkDocuments = sequelize.define('check_documents', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    accountID : {                               // Ссылка на account
        type: DataTypes.INTEGER,
        allowNull: false
    },
    checkResultID: {                            // Ссылка на check_result
        type: DataTypes.INTEGER,
        allowNull: false
    },
    comment: {                                  // Комментарий
        type: DataTypes.JSONB,
        allowNull: false
    },
    created: {                                  // Дата проверки
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
}, { 
    timestamps: false 
});

// Промежуточная таблица для связи primaryForm и Aspect
const formAspects = sequelize.define('form_aspect', {}, {
    timestamps: false, // не требуется отслеживать время
});

// Промежуточная таблица для связи Account и Certificate
const userCertificate = sequelize.define('account_certificate', {}, {
    timestamps: false, // не требуется отслеживать время
});

// Промежуточная таблица для связи Account и Reward
const userReward = sequelize.define('account_reward', {}, {
    timestamps: false, // не требуется отслеживать время
});

// Связи таблиц
// Связи primary_form
primaryForm.belongsTo(ksuDepartment, { foreignKey: 'ksuDepartmentID' });
primaryForm.belongsTo(typeGraduationDoc, { foreignKey: 'typeGraduationDocID' });
primaryForm.belongsTo(programType, { foreignKey: 'programTypeID' });
primaryForm.belongsTo(lessonShedule, { foreignKey: 'lessonShedule' });
primaryForm.belongsTo(teacher, { foreignKey: 'teacherID' });
primaryForm.belongsTo(account, { foreignKey: 'accountID' });

// Связи graudation_doc
graduationDoc.belongsTo(studyField, { foreignKey: 'studyFieldId' });
graduationDoc.belongsTo(typeGraduationDoc, { foreignKey: 'typeGraduationDocId' });
graduationDoc.belongsTo(primaryForm, { foreignKey: 'primaryFormId' });

// Связи document_group
documentGroup.belongsTo(document, { foreignKey: 'documentID_1' });
documentGroup.belongsTo(document, { foreignKey: 'documentID_2' });
documentGroup.belongsTo(document, { foreignKey: 'documentID_3' });
documentGroup.belongsTo(document, { foreignKey: 'documentID_4' });
documentGroup.belongsTo(document, { foreignKey: 'documentID_5' });
documentGroup.belongsTo(document, { foreignKey: 'documentID_6' });
documentGroup.belongsTo(document, { foreignKey: 'documentID_7' });

// Связи check_documents
checkDocuments.belongsTo(checkResult, { foreignKey: 'checkResultID' });
checkDocuments.belongsTo(account, { foreignKey: 'accountID' });

// Связи account
account.hasMany(primaryForm, { foreignKey: 'accountID' });

// Связь многие ко многим primaryForm-aspects
primaryForm.belongsToMany(aspects, { through: formAspects, foreignKey: 'primaryFormID' });
aspects.belongsToMany(primaryForm, { through: formAspects, foreignKey: 'aspectID' });

// Связь многие ко многим account-certificate
account.belongsToMany(certificate, { through: userCertificate, foreignKey: 'accountID' });
certificate.belongsToMany(account, { through: userCertificate, foreignKey: 'certificateID' });

// Связь многие ко многим account-reward
account.belongsToMany(reward, { through: userReward, foreignKey: 'userID' });
reward.belongsToMany(account, { through: userReward, foreignKey: 'rewardID' });

module.exports = {
    userRole,
    studyField,
    typeGraduationDoc,
    ksuDepartment,
    programType,
    aspects,
    programModule,
    reward,
    education,
    groupStatus,
    documentType,
    checkResult,
    primaryForm,
    graduationDoc,
    programCoordinator,
    certificate,
    teacher,
    account,
    document,
    documentGroup,
    checkDocuments,
    lessonShedule
};
