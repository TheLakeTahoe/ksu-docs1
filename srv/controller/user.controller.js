// Подключение к БД
const db = require('../db.js')

// Используется для шифрования и сверки пароля
const bcrypt = require('bcrypt')

// Используем типы запросов для корректной отработки команд для PostgreSQL
const { QueryTypes } = require('sequelize')

// Строка в SHA256 'Пам пам пам, это пароль' используется для создания jwt
const SECRET_KEY = 'b2a9c25c4c899e281d0c35759c7b239c6018a340618b9d678eae3c6cf0824f82'
const jwt = require('jsonwebtoken')


class UserController {
    // Проверка полей для первой части регистрации, чтобы не проверять при отправке данных при регистрации
    async checkUserField(req, res) {
        try {
            const { field, value } = req.body

            // Проверяем, чтобы поле было одним из допустимых
            const allowedFields = ['login', 'phone', 'email']
            if (!allowedFields.includes(field)) {
                return res.status(400).json({ message: 'Недопустимое поле!' })
            }

            const user = await db.query(
                `Select id From accounts 
                Where Trim(${field}) = $1`,
                {
                    bind: [value],
                    type: QueryTypes.SELECT
                })

            return res.status(200).json({ message: user.length > 0 ? 'Y' : 'N' })

        } catch (error) {
            return res.status(500).json({ message: 'Ошибка сервера!' })
        }
    }

    async getUserData(req, res) {
        try {
            console.log(req.body)
            const { id, phone, email, full_name } = req.body

            console.log(phone)

            const user = await db.query(
                `Select login, email, phone, full_name, work_experience, created, positions.name As position, education.name As education, workplaces.name as workplace From accounts
                Inner Join positions On positions.id = position_id
                Inner Join education On education.id = education_id
                Inner Join workplaces On workplaces.id = workplace_id
                Where accounts.id=$1::Integer And trim(phone)=$2 And trim(email)=$3 And trim(full_name)=$4`,
                {
                    bind: [id, phone, email, full_name],
                    type: QueryTypes.SELECT
                })

                console.log(user)

            return res.status(200).json({ data: user[0] })

        } catch (error) {
            return res.status(500).json({ message: 'Ошибка сервера!' })
        }
    }

    // Авторизация
    async userAuth(req, res) {
        try {
            const { loginOrEmail, password } = req.body

            const users = await db.query(
                `Select * From accounts 
                 Where Trim(login) = $1 Or Trim(email) = $1`, {
                bind: [loginOrEmail],
                type: QueryTypes.SELECT
            })

            if (!users.length)
                return res.status(200).json({ field: 'loginOrEmail', message: 'Неверный логин или email' })

            const user = users[0]

            const isPasswordValid = await bcrypt.compare(password, user.password)

            if (!isPasswordValid)
                return res.status(200).json({ field: 'password', message: 'Неверный пароль' })

            const token = jwt.sign(
                { id: user.id, phone: user.phone, email: user.email, full_name: user.full_name, role_id: user.role_id },
                SECRET_KEY,
                { expiresIn: '24h' }
            )

            return res.json({ token })


        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера!' })
        }
    }

    // Регистрация 
    async createUser(req, res) {
        try {
            const { education_id, login, email, password, phone, position, full_name, workExperience, workplace, ksu_department } = req.body

            const roleID = 2
            const saltRounds = 10
            const password_hash = await bcrypt.hash(password, saltRounds)

            // Проверяем и добавляем должность, если её нет
            let positionID
            const positionCheck = await db.query(
                `Select id From positions
                 Where name = $1`, {
                bind: [position],
                type: QueryTypes.SELECT
            })
            if (positionCheck.length === 0) {
                const newPosition = await db.query(
                    `Insert Into positions (name)
                     Values ($1)
                     Returning id`, {
                    bind: [position],
                    type: QueryTypes.INSERT
                }
                )
                positionID = newPosition[0][0].id
            } else {
                positionID = positionCheck[0].id
            }

            // Проверяем и добавляем место работы, если его нет
            let workplaceID
            const workplaceCheck = await db.query(
                `Select id From workplaces
                 Where name = $1`, {
                bind: [workplace],
                type: QueryTypes.SELECT
            })
            if (workplaceCheck.length === 0) {
                const newWorkplace = await db.query(
                    `Insert Into workplaces (name)
                     Values ($1)
                     Returning id`, {
                    bind: [workplace],
                    type: QueryTypes.INSERT
                }
                )
                workplaceID = newWorkplace[0][0].id
            } else {
                workplaceID = workplaceCheck[0].id
            }

            let departmentID
            const departmentCheck = await db.query(
                `Select id From ksu_departments
                 Where name = $1`, {
                bind: [ksu_department || null],
                type: QueryTypes.SELECT
            })

            departmentID = departmentCheck[0]?.id || null

            const userID = await db.query(
                `Insert Into accounts (role_id, education_id, login, email, password, phone, position_id, full_name, work_experience, workplace_id, ksu_department_id, created)
                 Values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW()) Returning id`, {
                bind: [roleID, education_id, login, email, password_hash, phone, positionID, full_name, workExperience, workplaceID, departmentID],
                type: QueryTypes.INSERT
            })

            const token = jwt.sign(
                { id: userID[0][0].id, phone: phone, email: email, full_name: full_name, role_id: roleID },
                SECRET_KEY,
                { expiresIn: '24h' }
            )

            return res.json({ token })

        }
        catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Ошибка сервера!' })
        }
    }
}

module.exports = new UserController()
