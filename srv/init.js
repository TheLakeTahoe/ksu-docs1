const db = require('./db'); // Подключение к базе данных

async function db_init() {
    try {
        // Создание таблицы Account, если её нет
        await db.query(`
            Create Table If Not Exists Account (
                id Serial Primary Key,
                login VarChar(255),
                password VarChar(255),
                email VarChar(255)
            )
        `);

        // Создание таблицы Message, если её нет
        await db.query(`
            Create Table If Not Exists Message (
                id Serial Primary Key,
                message VarChar(255),
                id_from Integer,
                id_to Integer,
                Foreign Key (id_from) References Account (id),
                Foreign Key (id_to) References Account (id)
            )
        `);

        // Создание таблицы 

        console.log('Таблицы проверены и созданы (если отсутствовали)');
    } catch (error) {
        console.error('Ошибка инициализации базы данных:', error.message);
    }
}

module.exports = db_init;
