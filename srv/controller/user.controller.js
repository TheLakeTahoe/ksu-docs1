const db = require('../db.js')

class UserController {
    async createUser(req, res) {
        const { name, surname } = req.query
        const newUser = await db.query(
            `Insert Into User (name, surname) Values ($1, $2)`,
            [name, surname]
        );
        res.json(newUser.rows[0])
    }
    async getUsers(req, res) {

    }
    async getOneUser(req, res) {
        const { login, password } = req.query
        const oneUser = await db.query(
            `Select *
            From Account
            Where login=$1 And password=$2`,
            [login, password]
        );
        if (oneUser.rowCount > 0)
            res.json('True')
        else
            res.json()
    }
    async deleteUser(req, res) {

    }
}

module.exports = new UserController()