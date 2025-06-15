const sequelize = require('../db')
const { DataTypes } = require('sequelize')

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
})

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
})

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
})

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
})

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
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: false
})

// Таблица program_module (Модуль программы)
const programModule = sequelize.define('program_module', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    h_overall: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    h_lk: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    h_lb: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    h_pr: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    h_sr: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    control_form: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    timestamps: false
})

// Таблица program_submodule (Подмодуль программы)
const programSubModule = sequelize.define('program_submodule', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    h_overall: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    h_lk: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    h_lb: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    h_pr: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    h_sr: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    control_form: {
        type: DataTypes.STRING,
        allowNull: true
    },
    program_module_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'program_modules',
            key: 'id'
        }
    }
}, {
    timestamps: false
})

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
})

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
})

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
})

// Таблица workplace (Место работы)
const workplace = sequelize.define('workplace', {
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
})

// Таблица position (Должность)
const position = sequelize.define('position', {
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
})

// Основные таблицы
// Таблица primary_form (Первичная форма)
const primaryForm = sequelize.define('primary_form', {
    id: {                                       // ID результата проверки
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ksu_department_id: {                          // Ссылка на ksu_department
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type_graduation_doc_id: {                      // Ссылка на type_grad_doc
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    program_coordinator_id: {                     // Ссылка на program_coordinator
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    program_type_id: {                            // Ссылка на program_type
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    lesson_shedule_id: {                           // Ссылка на lesson_shedule
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    account_id: {                                // Ссылка на account
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    study_period: {                              // Срок обучения
        type: DataTypes.STRING,
        allowNull: false,
    },
    program_name: {                              // Наименование программы
        type: DataTypes.STRING,
        allowNull: false,
    },
    program_description_short: {                  // Коротко о программе
        type: DataTypes.STRING,
        allowNull: false,
    },
    program_description: {                       // Описание программы
        type: DataTypes.STRING,
        allowNull: false,
    },
    target_audience: {                           // Целевая аудитория
        type: DataTypes.STRING,
        allowNull: false,
    },
    program_hours: {                             // Общая трудоемкость программы (в часах)
        type: DataTypes.STRING,
        allowNull: false,
    },
    education_cost: {                            // Стоимость обучения
        type: DataTypes.STRING,
        allowNull: false,
    },
    created: {                                  // Дата создания
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
}, {
    timestamps: false
})

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
    e_mail: {                                    // E-mail
        type: DataTypes.STRING,
        allowNull: false
    },
    full_name: {                                // ФИО
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {                                  // Адрес офиса
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    timestamps: false
})

// Таблица teacher (Преподаватель)
const teacher = sequelize.define('teacher', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    full_name: {                                // ФИО
        type: DataTypes.STRING,
        allowNull: false
    },
    exp_total: {                          // Наличие опыта работы
        type: DataTypes.STRING,
        allowNull: false
    },
    exp_subject: {
        type: DataTypes.STRING,
        allowNull: true
    },
    workplace_id: {                             // Место работы
        type: DataTypes.INTEGER,
        allowNull: false
    },
    position_id: {                              // Должность
        type: DataTypes.INTEGER,
        allowNull: false
    },
    education_id: {                              // Должность
        type: DataTypes.INTEGER,
        allowNull: true
    },

}, {
    timestamps: false
})

// Таблица account (Пользователь)
const account = sequelize.define('account', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    education_id: {                              // Ссылка на education
        type: DataTypes.INTEGER,
        allowNull: false
    },
    role_id: {                                   // Ссылка на user_role
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
    phone: {                                    // Контактный телефон
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    position_id: {                                 // Должность
        type: DataTypes.INTEGER,
        allowNull: true
    },
    full_name: {                                // ФИО
        type: DataTypes.STRING,
        allowNull: false
    },
    work_experience: {                           // Наличие опыта работы
        type: DataTypes.STRING,
        allowNull: true
    },
    workplace_id: {                                // Место работы
        type: DataTypes.INTEGER,
        allowNull: true
    },
    ksu_department_id: {
        type: DataTypes.INTEGER,                // Подразделение КГУ для проверяющего
        allowNull: true
    },
    created: {                                  // Дата создания
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
}, {
    timestamps: false
})

// Таблица document (Документ)
const document = sequelize.define('document', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    data: {                             // Данные документа
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
})

// Таблица document_group (Группа Документов)
const documentGroup = sequelize.define('document_group', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    documents_id: {                             // Ссылка на document
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true
    },
    step_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    group_status_id: {                            // Ссылка на group_status
        type: DataTypes.INTEGER,
        allowNull: false
    },
    primary_form_id: {                                // Ссылка на primary_form
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    timestamps: false
})

const requestStep = sequelize.define('request_step', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true
    }
}, {
    timestamps: false
})

// Промежуточная таблица для связи PrimaryForm и Aspect
const formAspects = sequelize.define('form_aspect', {}, {
    timestamps: false, // не требуется отслеживать время
})

// Промежуточная таблица для связи PrimaryForm и ProgramModule
const formTeacher = sequelize.define('form_teacher', {}, {
    timestamps: false, // не требуется отслеживать время
})

// Промежуточная таблица для связи PrimaryForm и Teacher
const formProgramModule = sequelize.define('form_program_module', {}, {
    timestamps: false, // не требуется отслеживать время
})

// Связи таблиц
// Связи primary_form
primaryForm.belongsTo(ksuDepartment, { foreignKey: 'ksu_department_id' })
primaryForm.belongsTo(typeGraduationDoc, { foreignKey: 'type_graduation_doc_id' })
primaryForm.belongsTo(programType, { foreignKey: 'program_type_id' })
primaryForm.belongsTo(lessonShedule, { foreignKey: 'lesson_shedule_id' })
primaryForm.belongsTo(account, { foreignKey: 'account_id' })
primaryForm.belongsTo(programCoordinator, { foreignKey: 'program_coordinator_id' })

// Связи program_coordinator
programCoordinator.hasMany(primaryForm, { foreignKey: 'program_coordinator_id' })

// Связи document_group
documentGroup.belongsTo(document, { foreignKey: 'documents_id' })
documentGroup.belongsTo(primaryForm, { foreignKey: 'primary_form_id' })
documentGroup.belongsTo(groupStatus, { foreignKey: 'group_status_id' })
documentGroup.belongsTo(requestStep, { foreignKey: 'step_id' })

// Связи request_step
requestStep.hasMany(documentGroup, { foreignKey: 'step_id' })

// Связи account
account.belongsTo(ksuDepartment, { foreignKey: 'ksu_department_id' })
account.belongsTo(userRole, { foreignKey: 'role_id' })
account.belongsTo(workplace, { foreignKey: 'workplace_id' })
account.belongsTo(position, { foreignKey: 'position_id' })
account.belongsTo(education, { foreignKey: 'education_id' })
account.hasMany(primaryForm, { foreignKey: 'account_id' })

// Связи user_roles
userRole.hasMany(account, { foreignKey: 'role_id' })

// Связи education
education.hasMany(account, { foreignKey: 'education_id' })
education.hasMany(teacher, { foreignKey: 'education_id' })

// Связи workplaces
workplace.hasMany(account, { foreignKey: 'workplace_id' })
workplace.hasMany(teacher, { foreignKey: 'workplace_id' })

// Связи positions
position.hasMany(account, { foreignKey: 'position_id' })
position.hasMany(teacher, { foreignKey: 'position_id' })

// Связи teacher
teacher.belongsTo(workplace, { foreignKey: 'workplace_id' })
teacher.belongsTo(position, { foreignKey: 'position_id' })
teacher.belongsTo(education, { foreignKey: 'education_id' })

// Связи group_statuses
groupStatus.hasMany(documentGroup, { foreignKey: 'group_status_id' })

// Связь модулей и подмодуей
programSubModule.belongsTo(programModule, { foreignKey: 'program_module_id' })
programModule.hasMany(programSubModule, { foreignKey: 'program_module_id' })

// Связь многие ко многим primaryForm-teacher
primaryForm.belongsToMany(teacher, { through: formTeacher, foreignKey: 'primary_form_id' })
teacher.belongsToMany(primaryForm, { through: formTeacher, foreignKey: 'teacher_id' })

// Связь многие ко многим primaryForm-programModule
primaryForm.belongsToMany(programModule, { through: formProgramModule, foreignKey: 'primary_form_id' })
programModule.belongsToMany(primaryForm, { through: formProgramModule, foreignKey: 'program_module_id' })

// Связь многие ко многим primaryForm-aspects
primaryForm.belongsToMany(aspects, { through: formAspects, foreignKey: 'primary_form_id' })
aspects.belongsToMany(primaryForm, { through: formAspects, foreignKey: 'aspect_id' })


module.exports = {
    userRole,
    typeGraduationDoc,
    ksuDepartment,
    programType,
    aspects,
    programModule,
    programSubModule,
    education,
    groupStatus,
    primaryForm,
    programCoordinator,
    teacher,
    account,
    document,
    documentGroup,
    lessonShedule,
    workplace,
    position,
    requestStep
}
